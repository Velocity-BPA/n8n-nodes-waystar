/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ICredentialDataDecryptedObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import Client from 'ssh2-sftp-client';

/**
 * SFTP Client for Waystar file transfers
 *
 * Handles secure file transfers for:
 * - EDI file submissions
 * - Batch claim uploads
 * - ERA/remittance downloads
 * - Report retrieval
 */

export interface SftpFileInfo {
  name: string;
  path: string;
  size: number;
  modifyTime: Date;
  type: 'file' | 'directory';
}

export interface SftpTransferResult {
  success: boolean;
  filename: string;
  path: string;
  size?: number;
  error?: string;
}

/**
 * Waystar SFTP Client
 */
export class WaystarSftpClient {
  private context: IExecuteFunctions;
  private credentials: ICredentialDataDecryptedObject;
  private client: Client;

  constructor(context: IExecuteFunctions, credentials: ICredentialDataDecryptedObject) {
    this.context = context;
    this.credentials = credentials;
    this.client = new Client();
  }

  /**
   * Connect to the SFTP server
   */
  async connect(): Promise<void> {
    const config: Client.ConnectOptions = {
      host: this.credentials.host as string,
      port: (this.credentials.port as number) || 22,
      username: this.credentials.username as string,
    };

    const authMethod = this.credentials.authMethod as string;

    if (authMethod === 'privateKey') {
      config.privateKey = this.credentials.privateKey as string;
      if (this.credentials.passphrase) {
        config.passphrase = this.credentials.passphrase as string;
      }
    } else {
      config.password = this.credentials.password as string;
    }

    try {
      await this.client.connect(config);
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), error as JsonObject, {
        message: 'Failed to connect to Waystar SFTP server',
      });
    }
  }

  /**
   * Disconnect from the SFTP server
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.end();
    } catch {
      // Ignore disconnect errors
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(directory?: string): Promise<SftpFileInfo[]> {
    const targetDir = directory || (this.credentials.outboundDirectory as string) || '/outbound';

    try {
      const listing = await this.client.list(targetDir);

      return listing.map((item) => ({
        name: item.name,
        path: `${targetDir}/${item.name}`,
        size: item.size,
        modifyTime: new Date(item.modifyTime),
        type: item.type === 'd' ? 'directory' : 'file',
      }));
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), error as JsonObject, {
        message: `Failed to list files in ${targetDir}`,
      });
    }
  }

  /**
   * Upload a file to the SFTP server
   */
  async uploadFile(
    content: string | Buffer,
    filename: string,
    directory?: string,
  ): Promise<SftpTransferResult> {
    const targetDir = directory || (this.credentials.inboundDirectory as string) || '/inbound';
    const remotePath = `${targetDir}/${filename}`;

    try {
      const buffer = typeof content === 'string' ? Buffer.from(content) : content;
      await this.client.put(buffer, remotePath);

      return {
        success: true,
        filename,
        path: remotePath,
        size: buffer.length,
      };
    } catch (error) {
      return {
        success: false,
        filename,
        path: remotePath,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Download a file from the SFTP server
   */
  async downloadFile(remotePath: string): Promise<Buffer> {
    try {
      const buffer = await this.client.get(remotePath);
      return buffer as Buffer;
    } catch (error) {
      throw new NodeApiError(this.context.getNode(), error as JsonObject, {
        message: `Failed to download file: ${remotePath}`,
      });
    }
  }

  /**
   * Download a file as text
   */
  async downloadFileAsText(remotePath: string): Promise<string> {
    const buffer = await this.downloadFile(remotePath);
    return buffer.toString('utf-8');
  }

  /**
   * Delete a file from the SFTP server
   */
  async deleteFile(remotePath: string): Promise<boolean> {
    try {
      await this.client.delete(remotePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Move a file on the SFTP server
   */
  async moveFile(sourcePath: string, destinationPath: string): Promise<boolean> {
    try {
      await this.client.rename(sourcePath, destinationPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Move file to archive directory
   */
  async archiveFile(remotePath: string): Promise<boolean> {
    const archiveDir = (this.credentials.archiveDirectory as string) || '/archive';
    const filename = remotePath.split('/').pop() || '';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archivePath = `${archiveDir}/${timestamp}_${filename}`;

    return this.moveFile(remotePath, archivePath);
  }

  /**
   * Check if a file exists
   */
  async fileExists(remotePath: string): Promise<boolean> {
    try {
      await this.client.stat(remotePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(remotePath: string): Promise<SftpFileInfo | null> {
    try {
      const stats = await this.client.stat(remotePath);
      const filename = remotePath.split('/').pop() || '';

      return {
        name: filename,
        path: remotePath,
        size: stats.size,
        modifyTime: new Date(stats.modifyTime),
        type: stats.isDirectory ? 'directory' : 'file',
      };
    } catch {
      return null;
    }
  }

  /**
   * Create a directory if it doesn't exist
   */
  async ensureDirectory(directoryPath: string): Promise<boolean> {
    try {
      await this.client.mkdir(directoryPath, true);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get files matching a pattern
   */
  async getFilesByPattern(directory: string, pattern: RegExp): Promise<SftpFileInfo[]> {
    const files = await this.listFiles(directory);
    return files.filter((file) => file.type === 'file' && pattern.test(file.name));
  }

  /**
   * Download all EDI response files
   */
  async downloadEdiResponses(directory?: string): Promise<{ filename: string; content: string }[]> {
    const targetDir = directory || (this.credentials.outboundDirectory as string) || '/outbound';
    const ediPattern = /\.(835|837|270|271|276|277|997|999|ta1)$/i;

    const files = await this.getFilesByPattern(targetDir, ediPattern);
    const results: { filename: string; content: string }[] = [];

    for (const file of files) {
      const content = await this.downloadFileAsText(file.path);
      results.push({ filename: file.name, content });
    }

    return results;
  }

  /**
   * Upload EDI file with proper naming
   */
  async uploadEdiFile(
    content: string,
    transactionType: string,
    controlNumber?: string,
  ): Promise<SftpTransferResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const filename = `${transactionType}_${controlNumber || timestamp}.edi`;

    return this.uploadFile(content, filename);
  }
}

/**
 * Create a Waystar SFTP client instance
 */
export async function createWaystarSftpClient(
  context: IExecuteFunctions,
): Promise<WaystarSftpClient> {
  const credentials = await context.getCredentials('waystarSftp');
  return new WaystarSftpClient(context, credentials);
}

export default WaystarSftpClient;
