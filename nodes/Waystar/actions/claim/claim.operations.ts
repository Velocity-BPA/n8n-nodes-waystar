/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createWaystarClient } from '../../transport/waystarClient';
import { WAYSTAR_ENDPOINTS } from '../../constants/endpoints';

/**
 * Claim Resource Operations
 *
 * Handles claim submission (837P/I/D) and status (276/277) transactions
 */

export const claimOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['claim'] } },
    options: [
      { name: 'Submit Claim', value: 'submitClaim', description: 'Submit a claim (837P/I/D)', action: 'Submit claim' },
      { name: 'Get Claim Status', value: 'getClaimStatus', description: 'Check claim status (276/277)', action: 'Get claim status' },
      { name: 'Get Claim Details', value: 'getClaimDetails', description: 'Get detailed claim information', action: 'Get claim details' },
      { name: 'Get Claims by Patient', value: 'getClaimsByPatient', description: 'Get all claims for a patient', action: 'Get claims by patient' },
      { name: 'Get Claims by Date', value: 'getClaimsByDate', description: 'Get claims by date range', action: 'Get claims by date' },
      { name: 'Get Claims by Status', value: 'getClaimsByStatus', description: 'Get claims by status', action: 'Get claims by status' },
      { name: 'Update Claim', value: 'updateClaim', description: 'Update claim information', action: 'Update claim' },
      { name: 'Void Claim', value: 'voidClaim', description: 'Void a submitted claim', action: 'Void claim' },
      { name: 'Resubmit Claim', value: 'resubmitClaim', description: 'Resubmit a rejected claim', action: 'Resubmit claim' },
      { name: 'Get Claim Attachments', value: 'getClaimAttachments', description: 'Get claim attachments', action: 'Get claim attachments' },
      { name: 'Get Claim History', value: 'getClaimHistory', description: 'Get claim history', action: 'Get claim history' },
      { name: 'Get Claim Rejections', value: 'getClaimRejections', description: 'Get claim rejections', action: 'Get claim rejections' },
      { name: 'Get Claim Payments', value: 'getClaimPayments', description: 'Get claim payments', action: 'Get claim payments' },
    ],
    default: 'submitClaim',
  },
];

export const claimFields: INodeProperties[] = [
  // Claim Type
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
    description: 'Type of claim to submit',
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim'] } },
  },

  // Payer Info
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    default: '',
    description: 'Insurance payer ID',
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim', 'getClaimStatus'] } },
  },

  // Patient Info
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    default: '',
    description: 'Internal patient ID',
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim', 'getClaimsByPatient'] } },
  },
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    required: true,
    default: '',
    description: 'Insurance member/subscriber ID',
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim', 'getClaimStatus'] } },
  },

  // Claim ID
  {
    displayName: 'Claim ID',
    name: 'claimId',
    type: 'string',
    required: true,
    default: '',
    description: 'The claim identifier',
    displayOptions: { show: { resource: ['claim'], operation: ['getClaimDetails', 'getClaimStatus', 'updateClaim', 'voidClaim', 'resubmitClaim', 'getClaimAttachments', 'getClaimHistory', 'getClaimRejections', 'getClaimPayments'] } },
  },

  // Date Range
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'YYYY-MM-DD',
    description: 'Start date for search',
    displayOptions: { show: { resource: ['claim'], operation: ['getClaimsByDate'] } },
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'YYYY-MM-DD',
    description: 'End date for search',
    displayOptions: { show: { resource: ['claim'], operation: ['getClaimsByDate'] } },
  },

  // Status Filter
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    options: [
      { name: 'All', value: 'all' },
      { name: 'Pending', value: 'pending' },
      { name: 'Accepted', value: 'accepted' },
      { name: 'Rejected', value: 'rejected' },
      { name: 'Paid', value: 'paid' },
      { name: 'Denied', value: 'denied' },
      { name: 'Appealed', value: 'appealed' },
    ],
    default: 'all',
    description: 'Filter by claim status',
    displayOptions: { show: { resource: ['claim'], operation: ['getClaimsByStatus', 'getClaimsByPatient', 'getClaimsByDate'] } },
  },

  // Claim Details for Submit
  {
    displayName: 'Claim Details',
    name: 'claimDetails',
    type: 'collection',
    placeholder: 'Add Claim Detail',
    default: {},
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim'] } },
    options: [
      { displayName: 'Patient Control Number', name: 'patientControlNumber', type: 'string', default: '', description: 'Your internal claim reference number' },
      { displayName: 'Total Charge Amount', name: 'totalChargeAmount', type: 'number', typeOptions: { numberPrecision: 2 }, default: 0, description: 'Total claim charge amount' },
      { displayName: 'Place of Service', name: 'placeOfService', type: 'string', default: '11', description: 'Place of service code (e.g., 11 for Office)' },
      { displayName: 'Frequency Code', name: 'frequencyCode', type: 'options', options: [
        { name: 'Original', value: '1' },
        { name: 'Replacement', value: '7' },
        { name: 'Void', value: '8' },
      ], default: '1' },
      { displayName: 'Prior Authorization Number', name: 'priorAuthNumber', type: 'string', default: '' },
      { displayName: 'Referral Number', name: 'referralNumber', type: 'string', default: '' },
    ],
  },

  // Provider Info
  {
    displayName: 'Provider',
    name: 'provider',
    type: 'collection',
    placeholder: 'Add Provider Info',
    default: {},
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim'] } },
    options: [
      { displayName: 'Billing NPI', name: 'billingNpi', type: 'string', default: '', description: 'Billing provider NPI' },
      { displayName: 'Rendering NPI', name: 'renderingNpi', type: 'string', default: '', description: 'Rendering provider NPI' },
      { displayName: 'Referring NPI', name: 'referringNpi', type: 'string', default: '', description: 'Referring provider NPI' },
      { displayName: 'Tax ID', name: 'taxId', type: 'string', default: '' },
      { displayName: 'Taxonomy Code', name: 'taxonomyCode', type: 'string', default: '' },
    ],
  },

  // Diagnosis Codes
  {
    displayName: 'Diagnosis Codes',
    name: 'diagnosisCodes',
    type: 'string',
    default: '',
    placeholder: 'A00.0, B01.1, C02.2',
    description: 'Comma-separated ICD-10 diagnosis codes',
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim'] } },
  },

  // Service Lines
  {
    displayName: 'Service Lines',
    name: 'serviceLines',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: { lines: [] },
    displayOptions: { show: { resource: ['claim'], operation: ['submitClaim'] } },
    options: [
      {
        name: 'lines',
        displayName: 'Service Line',
        values: [
          { displayName: 'Procedure Code', name: 'procedureCode', type: 'string', default: '', description: 'CPT or HCPCS code' },
          { displayName: 'Modifiers', name: 'modifiers', type: 'string', default: '', description: 'Comma-separated modifiers' },
          { displayName: 'Diagnosis Pointer', name: 'diagnosisPointer', type: 'string', default: '1', description: 'Pointer to diagnosis codes (e.g., 1,2)' },
          { displayName: 'Units', name: 'units', type: 'number', default: 1 },
          { displayName: 'Charge Amount', name: 'chargeAmount', type: 'number', typeOptions: { numberPrecision: 2 }, default: 0 },
          { displayName: 'Service Date', name: 'serviceDate', type: 'string', default: '', placeholder: 'YYYY-MM-DD' },
          { displayName: 'Service End Date', name: 'serviceEndDate', type: 'string', default: '', placeholder: 'YYYY-MM-DD' },
        ],
      },
    ],
  },

  // Void Reason
  {
    displayName: 'Void Reason',
    name: 'voidReason',
    type: 'string',
    required: true,
    default: '',
    description: 'Reason for voiding the claim',
    displayOptions: { show: { resource: ['claim'], operation: ['voidClaim'] } },
  },
];

/**
 * Execute claim operations
 */
export async function executeClaimOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  const client = await createWaystarClient(this);
  let responseData: unknown;

  switch (operation) {
    case 'submitClaim': {
      const claimType = this.getNodeParameter('claimType', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const patientId = this.getNodeParameter('patientId', index) as string;
      const memberId = this.getNodeParameter('memberId', index) as string;
      const claimDetails = this.getNodeParameter('claimDetails', index, {}) as Record<string, unknown>;
      const provider = this.getNodeParameter('provider', index, {}) as Record<string, unknown>;
      const diagnosisCodes = (this.getNodeParameter('diagnosisCodes', index, '') as string).split(',').map(c => c.trim()).filter(c => c);
      const serviceLines = this.getNodeParameter('serviceLines', index, { lines: [] }) as { lines: Array<Record<string, unknown>> };

      const claim = {
        claimType,
        payerId,
        patientId,
        memberId,
        ...claimDetails,
        provider,
        diagnosisCodes,
        serviceLines: serviceLines.lines.map((line, idx) => ({
          lineNumber: idx + 1,
          ...line,
          modifiers: (line.modifiers as string || '').split(',').map(m => m.trim()).filter(m => m),
          diagnosisPointers: (line.diagnosisPointer as string || '1').split(',').map(p => parseInt(p.trim())),
        })),
      };

      responseData = await client.post(WAYSTAR_ENDPOINTS.CLAIMS.SUBMIT, claim);
      break;
    }

    case 'getClaimStatus': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const memberId = this.getNodeParameter('memberId', index) as string;

      responseData = await client.get(WAYSTAR_ENDPOINTS.CLAIMS.STATUS, { claimId, payerId, memberId });
      break;
    }

    case 'getClaimDetails': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.CLAIMS.DETAILS}/${claimId}`);
      break;
    }

    case 'getClaimsByPatient': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const status = this.getNodeParameter('status', index, 'all') as string;
      const query: Record<string, string> = { patientId };
      if (status !== 'all') query.status = status;
      responseData = await client.get(WAYSTAR_ENDPOINTS.CLAIMS.BY_PATIENT, query);
      break;
    }

    case 'getClaimsByDate': {
      const startDate = this.getNodeParameter('startDate', index) as string;
      const endDate = this.getNodeParameter('endDate', index) as string;
      const status = this.getNodeParameter('status', index, 'all') as string;
      const query: Record<string, string> = { startDate, endDate };
      if (status !== 'all') query.status = status;
      responseData = await client.get(WAYSTAR_ENDPOINTS.CLAIMS.BY_DATE, query);
      break;
    }

    case 'getClaimsByStatus': {
      const status = this.getNodeParameter('status', index) as string;
      responseData = await client.get(WAYSTAR_ENDPOINTS.CLAIMS.BY_STATUS, { status });
      break;
    }

    case 'updateClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const claimDetails = this.getNodeParameter('claimDetails', index, {}) as Record<string, unknown>;
      responseData = await client.patch(`${WAYSTAR_ENDPOINTS.CLAIMS.UPDATE}/${claimId}`, claimDetails);
      break;
    }

    case 'voidClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const voidReason = this.getNodeParameter('voidReason', index) as string;
      responseData = await client.post(`${WAYSTAR_ENDPOINTS.CLAIMS.VOID}/${claimId}`, { reason: voidReason });
      break;
    }

    case 'resubmitClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.post(`${WAYSTAR_ENDPOINTS.CLAIMS.RESUBMIT}/${claimId}`, {});
      break;
    }

    case 'getClaimAttachments': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.CLAIMS.ATTACHMENTS}/${claimId}`);
      break;
    }

    case 'getClaimHistory': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.CLAIMS.HISTORY}/${claimId}`);
      break;
    }

    case 'getClaimRejections': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.CLAIMS.REJECTIONS}/${claimId}`);
      break;
    }

    case 'getClaimPayments': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.CLAIMS.PAYMENTS}/${claimId}`);
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return [{ json: responseData as Record<string, unknown> }];
}
