/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Waystar SFTP Credentials
 *
 * Configuration for SFTP file transfers with Waystar.
 * Used for batch file submissions and retrievals including
 * EDI files, reports, and other bulk data transfers.
 */
export class WaystarSftp implements ICredentialType {
  name = 'waystarSftp';
  displayName = 'Waystar SFTP';
  documentationUrl = 'https://docs.waystar.com/sftp';

  properties: INodeProperties[] = [
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'sftp.waystar.com',
      description: 'Waystar SFTP server hostname',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 22,
      required: true,
      description: 'SFTP port (typically 22)',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'SFTP username provided by Waystar',
    },
    {
      displayName: 'Authentication Method',
      name: 'authMethod',
      type: 'options',
      options: [
        {
          name: 'Password',
          value: 'password',
        },
        {
          name: 'Private Key',
          value: 'privateKey',
        },
      ],
      default: 'password',
      description: 'Method to authenticate with SFTP server',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['password'],
        },
      },
      description: 'SFTP password',
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: {
        password: true,
        rows: 8,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['privateKey'],
        },
      },
      description: 'Private key for SSH authentication (PEM format)',
      placeholder: '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----',
    },
    {
      displayName: 'Passphrase',
      name: 'passphrase',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['privateKey'],
        },
      },
      description: 'Passphrase for the private key (if encrypted)',
    },
    {
      displayName: 'Inbound Directory',
      name: 'inboundDirectory',
      type: 'string',
      default: '/inbound',
      description: 'Directory for uploading files to Waystar',
    },
    {
      displayName: 'Outbound Directory',
      name: 'outboundDirectory',
      type: 'string',
      default: '/outbound',
      description: 'Directory for downloading files from Waystar',
    },
    {
      displayName: 'Archive Directory',
      name: 'archiveDirectory',
      type: 'string',
      default: '/archive',
      description: 'Directory for archived/processed files',
    },
  ];
}
