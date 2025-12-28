/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createWaystarClient } from '../../transport/waystarClient';
import { ediParser } from '../../transport/ediParser';
import { WAYSTAR_ENDPOINTS } from '../../constants/endpoints';

/**
 * Eligibility Resource Operations
 *
 * Handles 270/271 eligibility verification transactions including:
 * - Real-time eligibility checks
 * - Batch eligibility processing
 * - Coverage and benefits information
 */

export const eligibilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['eligibility'] } },
    options: [
      { name: 'Check Eligibility', value: 'checkEligibility', description: 'Verify patient eligibility (270/271)', action: 'Check eligibility' },
      { name: 'Check Eligibility Batch', value: 'checkEligibilityBatch', description: 'Batch eligibility verification', action: 'Check eligibility batch' },
      { name: 'Get Eligibility Response', value: 'getEligibilityResponse', description: 'Get eligibility response by ID', action: 'Get eligibility response' },
      { name: 'Get Coverage Info', value: 'getCoverageInfo', description: 'Get coverage information', action: 'Get coverage info' },
      { name: 'Get Benefits', value: 'getBenefits', description: 'Get benefit details', action: 'Get benefits' },
      { name: 'Get Deductible', value: 'getDeductible', description: 'Get deductible information', action: 'Get deductible' },
      { name: 'Get Copay', value: 'getCopay', description: 'Get copay information', action: 'Get copay' },
      { name: 'Get Coinsurance', value: 'getCoinsurance', description: 'Get coinsurance information', action: 'Get coinsurance' },
      { name: 'Get Out of Pocket', value: 'getOutOfPocket', description: 'Get out of pocket information', action: 'Get out of pocket' },
      { name: 'Get Coverage Dates', value: 'getCoverageDates', description: 'Get coverage effective dates', action: 'Get coverage dates' },
      { name: 'Get Plan Info', value: 'getPlanInfo', description: 'Get plan information', action: 'Get plan info' },
      { name: 'Get Prior Auth Requirements', value: 'getPriorAuthRequirements', description: 'Get prior authorization requirements', action: 'Get prior auth requirements' },
      { name: 'Parse 271 Response', value: 'parse271Response', description: 'Parse raw 271 EDI response', action: 'Parse 271 response' },
    ],
    default: 'checkEligibility',
  },
];

export const eligibilityFields: INodeProperties[] = [
  // Check Eligibility fields
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    default: '',
    description: 'The payer/insurance company ID',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility', 'checkEligibilityBatch'] } },
  },
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    required: true,
    default: '',
    description: 'The subscriber/member ID on the insurance card',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility', 'checkEligibilityBatch'] } },
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    description: 'Patient first name',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    default: '',
    description: 'Patient last name',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
  },
  {
    displayName: 'Date of Birth',
    name: 'dateOfBirth',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'YYYY-MM-DD',
    description: 'Patient date of birth',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
  },
  {
    displayName: 'Service Type',
    name: 'serviceType',
    type: 'options',
    options: [
      { name: 'Health Benefit Plan Coverage', value: '30' },
      { name: 'Medical Care', value: '1' },
      { name: 'Surgical', value: '2' },
      { name: 'Consultation', value: '3' },
      { name: 'Diagnostic X-Ray', value: '4' },
      { name: 'Diagnostic Lab', value: '5' },
      { name: 'Radiation Therapy', value: '6' },
      { name: 'Anesthesia', value: '7' },
      { name: 'Surgical Assistance', value: '8' },
      { name: 'Hospital Inpatient', value: '48' },
      { name: 'Hospital Outpatient', value: '50' },
      { name: 'Emergency Services', value: '86' },
      { name: 'Urgent Care', value: 'UC' },
      { name: 'Prescription Drug', value: '88' },
      { name: 'Mental Health', value: 'MH' },
      { name: 'Chiropractic', value: '33' },
      { name: 'Physical Therapy', value: 'PT' },
      { name: 'Durable Medical Equipment', value: '12' },
    ],
    default: '30',
    description: 'Type of service to check eligibility for',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility', 'getBenefits'] } },
  },
  {
    displayName: 'Provider NPI',
    name: 'providerNpi',
    type: 'string',
    default: '',
    description: 'National Provider Identifier (10 digits)',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
  },
  {
    displayName: 'Service Date',
    name: 'serviceDate',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DD',
    description: 'Date of service (defaults to today)',
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
  },

  // Eligibility Response ID field
  {
    displayName: 'Response ID',
    name: 'responseId',
    type: 'string',
    required: true,
    default: '',
    description: 'The eligibility response ID',
    displayOptions: { show: { resource: ['eligibility'], operation: ['getEligibilityResponse', 'getCoverageInfo', 'getBenefits', 'getDeductible', 'getCopay', 'getCoinsurance', 'getOutOfPocket', 'getCoverageDates', 'getPlanInfo', 'getPriorAuthRequirements'] } },
  },

  // Parse 271 field
  {
    displayName: 'EDI Content',
    name: 'ediContent',
    type: 'string',
    typeOptions: { rows: 10 },
    required: true,
    default: '',
    description: 'Raw 271 EDI content to parse',
    displayOptions: { show: { resource: ['eligibility'], operation: ['parse271Response'] } },
  },

  // Additional options
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['eligibility'], operation: ['checkEligibility'] } },
    options: [
      { displayName: 'Dependent First Name', name: 'dependentFirstName', type: 'string', default: '', description: 'Dependent first name (if checking for dependent)' },
      { displayName: 'Dependent Last Name', name: 'dependentLastName', type: 'string', default: '', description: 'Dependent last name' },
      { displayName: 'Dependent DOB', name: 'dependentDob', type: 'string', default: '', description: 'Dependent date of birth' },
      { displayName: 'Relationship Code', name: 'relationshipCode', type: 'options', options: [
        { name: 'Self', value: '18' },
        { name: 'Spouse', value: '01' },
        { name: 'Child', value: '19' },
        { name: 'Other', value: '21' },
      ], default: '18', description: 'Relationship to subscriber' },
      { displayName: 'Group Number', name: 'groupNumber', type: 'string', default: '', description: 'Insurance group number' },
      { displayName: 'Include Inactive', name: 'includeInactive', type: 'boolean', default: false, description: 'Include inactive coverage in results' },
    ],
  },
];

/**
 * Execute eligibility operations
 */
export async function executeEligibilityOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  const client = await createWaystarClient(this);
  let responseData: unknown;

  switch (operation) {
    case 'checkEligibility': {
      const payerId = this.getNodeParameter('payerId', index) as string;
      const memberId = this.getNodeParameter('memberId', index) as string;
      const firstName = this.getNodeParameter('firstName', index) as string;
      const lastName = this.getNodeParameter('lastName', index) as string;
      const dateOfBirth = this.getNodeParameter('dateOfBirth', index) as string;
      const serviceType = this.getNodeParameter('serviceType', index) as string;
      const providerNpi = this.getNodeParameter('providerNpi', index, '') as string;
      const serviceDate = this.getNodeParameter('serviceDate', index, '') as string;
      const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as Record<string, unknown>;

      const requestBody: Record<string, unknown> = {
        payerId,
        subscriber: {
          memberId,
          firstName,
          lastName,
          dateOfBirth,
        },
        serviceType,
        serviceDate: serviceDate || new Date().toISOString().split('T')[0],
      };

      if (providerNpi) {
        requestBody.provider = { npi: providerNpi };
      }

      if (additionalOptions.dependentFirstName) {
        requestBody.dependent = {
          firstName: additionalOptions.dependentFirstName,
          lastName: additionalOptions.dependentLastName,
          dateOfBirth: additionalOptions.dependentDob,
          relationshipCode: additionalOptions.relationshipCode,
        };
      }

      if (additionalOptions.groupNumber) {
        (requestBody.subscriber as Record<string, unknown>).groupNumber = additionalOptions.groupNumber;
      }

      responseData = await client.post(WAYSTAR_ENDPOINTS.ELIGIBILITY.CHECK, requestBody);
      break;
    }

    case 'checkEligibilityBatch': {
      const payerId = this.getNodeParameter('payerId', index) as string;
      const items = this.getInputData();
      const batchRequests = items.map((item) => ({
        payerId,
        subscriber: {
          memberId: item.json.memberId,
          firstName: item.json.firstName,
          lastName: item.json.lastName,
          dateOfBirth: item.json.dateOfBirth,
        },
        serviceType: item.json.serviceType || '30',
      }));

      responseData = await client.post(WAYSTAR_ENDPOINTS.ELIGIBILITY.CHECK_BATCH, { requests: batchRequests });
      break;
    }

    case 'getEligibilityResponse': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.RESPONSE}/${responseId}`);
      break;
    }

    case 'getCoverageInfo': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.COVERAGE}/${responseId}`);
      break;
    }

    case 'getBenefits': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      const serviceType = this.getNodeParameter('serviceType', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { serviceType });
      break;
    }

    case 'getDeductible': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { benefitType: 'deductible' });
      break;
    }

    case 'getCopay': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { benefitType: 'copay' });
      break;
    }

    case 'getCoinsurance': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { benefitType: 'coinsurance' });
      break;
    }

    case 'getOutOfPocket': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { benefitType: 'outOfPocket' });
      break;
    }

    case 'getCoverageDates': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.COVERAGE}/${responseId}`, { include: 'dates' });
      break;
    }

    case 'getPlanInfo': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.COVERAGE}/${responseId}`, { include: 'plan' });
      break;
    }

    case 'getPriorAuthRequirements': {
      const responseId = this.getNodeParameter('responseId', index) as string;
      responseData = await client.get(`${WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS}/${responseId}`, { include: 'priorAuth' });
      break;
    }

    case 'parse271Response': {
      const ediContent = this.getNodeParameter('ediContent', index) as string;
      responseData = ediParser.parse271(ediContent);
      break;
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return [{ json: responseData as Record<string, unknown> }];
}
