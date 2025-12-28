/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestHelper,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Waystar API Credentials
 *
 * Supports OAuth 2.0 authentication for Waystar's healthcare revenue cycle
 * management platform. Handles multiple environments including production
 * and sandbox.
 */
export class WaystarApi implements ICredentialType {
  name = 'waystarApi';
  displayName = 'Waystar API';
  documentationUrl = 'https://docs.waystar.com/api';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Sandbox/Test',
          value: 'sandbox',
        },
        {
          name: 'Custom',
          value: 'custom',
        },
      ],
      default: 'sandbox',
      description: 'The Waystar environment to connect to',
    },
    {
      displayName: 'Custom API URL',
      name: 'customApiUrl',
      type: 'string',
      default: '',
      placeholder: 'https://api.custom.waystar.com',
      description: 'Custom API endpoint URL (only for Custom environment)',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'OAuth 2.0 Client ID provided by Waystar',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OAuth 2.0 Client Secret provided by Waystar',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'Waystar account username',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Waystar account password',
    },
    {
      displayName: 'Organization ID',
      name: 'organizationId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Waystar Organization ID',
    },
    {
      displayName: 'Site ID',
      name: 'siteId',
      type: 'string',
      default: '',
      description: 'Optional Site ID for multi-site organizations',
    },
    {
      displayName: 'NPI',
      name: 'npi',
      type: 'string',
      default: '',
      description: 'National Provider Identifier (10-digit number)',
      placeholder: '1234567890',
    },
  ];

  /**
   * Get the appropriate base URL based on environment selection
   */
  static getBaseUrl(credentials: ICredentialDataDecryptedObject): string {
    const environment = credentials.environment as string;

    switch (environment) {
      case 'production':
        return 'https://api.waystar.com/v1';
      case 'sandbox':
        return 'https://api-sandbox.waystar.com/v1';
      case 'custom':
        return credentials.customApiUrl as string;
      default:
        return 'https://api-sandbox.waystar.com/v1';
    }
  }

  /**
   * Get the OAuth token endpoint based on environment
   */
  static getTokenUrl(credentials: ICredentialDataDecryptedObject): string {
    const environment = credentials.environment as string;

    switch (environment) {
      case 'production':
        return 'https://auth.waystar.com/oauth2/token';
      case 'sandbox':
        return 'https://auth-sandbox.waystar.com/oauth2/token';
      case 'custom':
        return `${credentials.customApiUrl}/oauth2/token`;
      default:
        return 'https://auth-sandbox.waystar.com/oauth2/token';
    }
  }

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
        'X-Waystar-Org-Id': '={{$credentials.organizationId}}',
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.environment === "production" ? "https://api.waystar.com/v1" : $credentials.environment === "sandbox" ? "https://api-sandbox.waystar.com/v1" : $credentials.customApiUrl}}',
      url: '/health',
      method: 'GET',
    },
  };
}
