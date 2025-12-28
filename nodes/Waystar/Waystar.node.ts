/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { resourceOptions, operationsByResource, commonFields, executeOperation } from './actions';

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

export class Waystar implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Waystar',
    name: 'waystar',
    icon: 'file:waystar.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Healthcare revenue cycle management with Waystar - eligibility, claims, remittance, denials, and more',
    defaults: {
      name: 'Waystar',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'waystarApi',
        required: true,
      },
      {
        name: 'waystarEdi',
        required: false,
        displayOptions: {
          show: {
            resource: ['edi'],
          },
        },
      },
      {
        name: 'waystarSftp',
        required: false,
        displayOptions: {
          show: {
            resource: ['batch', 'edi'],
          },
        },
      },
    ],
    properties: [
      // License notice (informational)
      {
        displayName: 'This node is licensed under BSL 1.1. Commercial use requires a license from Velocity BPA. Visit velobpa.com/licensing for details.',
        name: 'licenseNotice',
        type: 'notice',
        default: '',
      },
      // Resource selection
      resourceOptions,
      // Operations by resource
      ...Object.values(operationsByResource),
      // Common fields
      ...commonFields,
      // Service type for eligibility
      {
        displayName: 'Service Type',
        name: 'serviceType',
        type: 'options',
        options: [
          { name: 'Health Benefit Plan Coverage', value: '30' },
          { name: 'Medical Care', value: '1' },
          { name: 'Surgical', value: '2' },
          { name: 'Diagnostic X-Ray', value: '4' },
          { name: 'Diagnostic Lab', value: '5' },
          { name: 'Hospital Inpatient', value: '48' },
          { name: 'Hospital Outpatient', value: '50' },
          { name: 'Emergency Services', value: '86' },
          { name: 'Urgent Care', value: 'UC' },
          { name: 'Prescription Drug', value: '88' },
          { name: 'Mental Health', value: 'MH' },
          { name: 'Physical Therapy', value: 'PT' },
          { name: 'Durable Medical Equipment', value: '12' },
        ],
        default: '30',
        displayOptions: { show: { operation: ['checkEligibility', 'getBenefits'] } },
      },
      // Claim type
      {
        displayName: 'Claim Type',
        name: 'claimType',
        type: 'options',
        options: [
          { name: 'Professional (837P)', value: '837P' },
          { name: 'Institutional (837I)', value: '837I' },
          { name: 'Dental (837D)', value: '837D' },
        ],
        default: '837P',
        displayOptions: { show: { operation: ['submitClaim'] } },
      },
      // Provider NPI
      {
        displayName: 'Provider NPI',
        name: 'providerNpi',
        type: 'string',
        default: '',
        placeholder: '1234567890',
        displayOptions: { show: { operation: ['checkEligibility', 'submitClaim'] } },
      },
      // Diagnosis codes
      {
        displayName: 'Diagnosis Codes',
        name: 'diagnosisCodes',
        type: 'string',
        default: '',
        placeholder: 'A00.0, B01.1',
        description: 'Comma-separated ICD-10 diagnosis codes',
        displayOptions: { show: { operation: ['submitClaim'] } },
      },
      // Service lines for claims
      {
        displayName: 'Service Lines',
        name: 'serviceLines',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: { lines: [] },
        displayOptions: { show: { operation: ['submitClaim'] } },
        options: [
          {
            name: 'lines',
            displayName: 'Service Line',
            values: [
              { displayName: 'Procedure Code', name: 'procedureCode', type: 'string', default: '' },
              { displayName: 'Modifiers', name: 'modifiers', type: 'string', default: '' },
              { displayName: 'Units', name: 'units', type: 'number', default: 1 },
              { displayName: 'Charge Amount', name: 'chargeAmount', type: 'number', typeOptions: { numberPrecision: 2 }, default: 0 },
              { displayName: 'Service Date', name: 'serviceDate', type: 'string', default: '', placeholder: 'YYYY-MM-DD' },
            ],
          },
        ],
      },
      // Prior auth fields
      {
        displayName: 'Authorization Number',
        name: 'authNumber',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['checkStatus', 'getDetails', 'updatePriorAuth', 'cancelPriorAuth', 'getApprovedServices'] } },
      },
      // Appeal fields
      {
        displayName: 'Appeal Reason',
        name: 'appealReason',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        displayOptions: { show: { operation: ['createAppeal'] } },
      },
      // Void reason
      {
        displayName: 'Void Reason',
        name: 'voidReason',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['voidClaim'] } },
      },
      // File upload for attachments
      {
        displayName: 'File Content',
        name: 'fileContent',
        type: 'string',
        default: '',
        description: 'Base64 encoded file content',
        displayOptions: { show: { operation: ['uploadAttachment'] } },
      },
      {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['uploadAttachment'] } },
      },
      {
        displayName: 'Attachment Type',
        name: 'attachmentType',
        type: 'options',
        options: [
          { name: 'Medical Records', value: 'OZ' },
          { name: 'Operative Report', value: 'OB' },
          { name: 'Lab Results', value: 'LA' },
          { name: 'X-Ray', value: 'XR' },
          { name: 'Prescription', value: 'RX' },
          { name: 'Other', value: 'OT' },
        ],
        default: 'OZ',
        displayOptions: { show: { operation: ['uploadAttachment'] } },
      },
      // Additional options
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          { displayName: 'Include Inactive', name: 'includeInactive', type: 'boolean', default: false },
          { displayName: 'Page Size', name: 'pageSize', type: 'number', default: 100 },
          { displayName: 'Page Number', name: 'pageNumber', type: 'number', default: 1 },
          { displayName: 'Sort By', name: 'sortBy', type: 'string', default: '' },
          { displayName: 'Sort Order', name: 'sortOrder', type: 'options', options: [{ name: 'Ascending', value: 'asc' }, { name: 'Descending', value: 'desc' }], default: 'desc' },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Log license notice once per execution
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await executeOperation(this, i);
        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
