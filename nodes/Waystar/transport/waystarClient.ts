/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  ICredentialDataDecryptedObject,
  IHttpRequestOptions,
  IHttpRequestMethods,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { WAYSTAR_ENDPOINTS } from '../constants/endpoints';

/**
 * Velocity BPA Licensing Notice
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */
const displayLicenseNotice = (): void => {
  if (!displayLicenseNotice.displayed) {
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
    displayLicenseNotice.displayed = true;
  }
};
displayLicenseNotice.displayed = false;

/**
 * OAuth token cache interface
 */
interface TokenCache {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

/**
 * Token cache storage (per organization)
 */
const tokenCache: Map<string, TokenCache> = new Map();

/**
 * Waystar API client for healthcare revenue cycle management operations
 */
export class WaystarClient {
  private context: IExecuteFunctions | ILoadOptionsFunctions;
  private credentials: ICredentialDataDecryptedObject;
  private baseUrl: string;

  constructor(
    context: IExecuteFunctions | ILoadOptionsFunctions,
    credentials: ICredentialDataDecryptedObject,
  ) {
    displayLicenseNotice();
    this.context = context;
    this.credentials = credentials;
    this.baseUrl = this.getBaseUrl();
  }

  /**
   * Get the appropriate base URL based on environment selection
   */
  private getBaseUrl(): string {
    const environment = this.credentials.environment as string;

    switch (environment) {
      case 'production':
        return WAYSTAR_ENDPOINTS.BASE_URLS.PRODUCTION;
      case 'sandbox':
        return WAYSTAR_ENDPOINTS.BASE_URLS.SANDBOX;
      case 'custom':
        return this.credentials.customApiUrl as string;
      default:
        return WAYSTAR_ENDPOINTS.BASE_URLS.SANDBOX;
    }
  }

  /**
   * Get the OAuth token endpoint based on environment
   */
  private getTokenUrl(): string {
    const environment = this.credentials.environment as string;

    switch (environment) {
      case 'production':
        return 'https://auth.waystar.com/oauth2/token';
      case 'sandbox':
        return 'https://auth-sandbox.waystar.com/oauth2/token';
      case 'custom':
        return `${this.credentials.customApiUrl}/oauth2/token`;
      default:
        return 'https://auth-sandbox.waystar.com/oauth2/token';
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  private async getAccessToken(): Promise<string> {
    const cacheKey = `${this.credentials.organizationId}_${this.credentials.clientId}`;
    const cached = tokenCache.get(cacheKey);

    // Check if we have a valid cached token (with 5 minute buffer)
    if (cached && cached.expiresAt > Date.now() + 300000) {
      return cached.accessToken;
    }

    // Request new token
    const tokenUrl = this.getTokenUrl();
    const authHeader = Buffer.from(
      `${this.credentials.clientId}:${this.credentials.clientSecret}`,
    ).toString('base64');

    const requestOptions: IHttpRequestOptions = {
      method: 'POST',
      url: tokenUrl,
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: this.credentials.username as string,
        password: this.credentials.password as string,
        scope: 'api',
      }).toString(),
    };

    try {
      const response = await this.context.helpers.httpRequest(requestOptions);

      const tokenData = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresAt: Date.now() + (response.expires_in * 1000),
      };

      tokenCache.set(cacheKey, tokenData);
      return tokenData.accessToken;
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), error as JsonObject, {
        message: 'Failed to obtain access token from Waystar',
      });
    }
  }

  /**
   * Build headers for API requests
   */
  private async buildHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.getAccessToken();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Waystar-Org-Id': this.credentials.organizationId as string,
    };

    if (this.credentials.siteId) {
      headers['X-Waystar-Site-Id'] = this.credentials.siteId as string;
    }

    if (this.credentials.npi) {
      headers['X-Waystar-NPI'] = this.credentials.npi as string;
    }

    return headers;
  }

  /**
   * Make an API request to Waystar
   */
  async request<T = unknown>(
    method: IHttpRequestMethods,
    endpoint: string,
    body?: object,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    const headers = await this.buildHeaders();

    const requestOptions: IHttpRequestOptions = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers,
      json: true,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = body;
    }

    if (query) {
      requestOptions.qs = query;
    }

    try {
      return await this.context.helpers.httpRequest(requestOptions);
    } catch (error) {
      const errorData = error as JsonObject;

      // Handle rate limiting
      if (errorData.httpCode === 429) {
        const retryAfter = parseInt((errorData.headers as JsonObject)?.['retry-after'] as string || '60', 10);
        throw new NodeApiError(this.context.getNode(), errorData, {
          message: `Rate limited by Waystar API. Retry after ${retryAfter} seconds.`,
        });
      }

      // Handle authentication errors
      if (errorData.httpCode === 401) {
        // Clear token cache and retry once
        const cacheKey = `${this.credentials.organizationId}_${this.credentials.clientId}`;
        tokenCache.delete(cacheKey);

        throw new NodeApiError(this.context.getNode(), errorData, {
          message: 'Authentication failed. Please verify your credentials.',
        });
      }

      // Handle HIPAA-related errors
      if (errorData.httpCode === 403) {
        throw new NodeApiError(this.context.getNode(), errorData, {
          message: 'Access denied. Check your permissions and HIPAA authorization.',
        });
      }

      throw new NodeApiError(this.context.getNode(), errorData, {
        message: `Waystar API error: ${errorData.message || 'Unknown error'}`,
      });
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, query);
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: object,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>('POST', endpoint, body, query);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: object,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, body, query);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: object,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, query);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    query?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, query);
  }

  /**
   * Handle paginated requests
   */
  async paginate<T = unknown>(
    endpoint: string,
    query?: Record<string, string | number | boolean>,
    pageSize = 100,
    maxPages = 10,
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= maxPages) {
      const response = await this.get<{
        data: T[];
        pagination: {
          page: number;
          pageSize: number;
          totalPages: number;
          totalCount: number;
        };
      }>(endpoint, {
        ...query,
        page,
        pageSize,
      });

      results.push(...response.data);

      if (response.pagination.page >= response.pagination.totalPages) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return results;
  }

  /**
   * Test connection to Waystar API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.get(WAYSTAR_ENDPOINTS.HEALTH);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create a Waystar client instance
 */
export async function createWaystarClient(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<WaystarClient> {
  const credentials = await context.getCredentials('waystarApi');
  return new WaystarClient(context, credentials);
}

export default WaystarClient;
