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
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Eligibility Verification',
            value: 'eligibilityVerification',
          },
          {
            name: 'Claims',
            value: 'claims',
          },
          {
            name: 'Remittance',
            value: 'remittance',
          },
          {
            name: 'Denial Management',
            value: 'denialManagement',
          },
          {
            name: 'Patients',
            value: 'patients',
          },
          {
            name: 'Providers',
            value: 'providers',
          }
        ],
        default: 'eligibilityVerification',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['eligibilityVerification'] } },
        options: [
          { name: 'Create Eligibility Request', value: 'createEligibilityRequest', description: 'Submit new eligibility verification request', action: 'Create eligibility request' },
          { name: 'Get Eligibility Request', value: 'getEligibilityRequest', description: 'Retrieve specific eligibility request status and results', action: 'Get eligibility request' },
          { name: 'List Eligibility Requests', value: 'listEligibilityRequests', description: 'List all eligibility requests with filters', action: 'List eligibility requests' },
          { name: 'Update Eligibility Request', value: 'updateEligibilityRequest', description: 'Update eligibility request details', action: 'Update eligibility request' },
          { name: 'Delete Eligibility Request', value: 'deleteEligibilityRequest', description: 'Cancel eligibility request', action: 'Delete eligibility request' }
        ],
        default: 'createEligibilityRequest',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['claims'] } },
        options: [
          { name: 'Create Claim', value: 'createClaim', description: 'Submit new healthcare claim', action: 'Create claim' },
          { name: 'Get Claim', value: 'getClaim', description: 'Retrieve specific claim details and status', action: 'Get claim' },
          { name: 'List Claims', value: 'listClaims', description: 'List claims with filtering options', action: 'List claims' },
          { name: 'Update Claim', value: 'updateClaim', description: 'Update claim information', action: 'Update claim' },
          { name: 'Delete Claim', value: 'deleteClaim', description: 'Void or cancel claim', action: 'Delete claim' },
          { name: 'Resubmit Claim', value: 'resubmitClaim', description: 'Resubmit previously rejected claim', action: 'Resubmit claim' }
        ],
        default: 'createClaim',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['remittance'] } },
        options: [
          { name: 'List Remittance Advice', value: 'listRemittanceAdvice', description: 'Retrieve available remittance advice documents', action: 'List remittance advice' },
          { name: 'Get Remittance Advice', value: 'getRemittanceAdvice', description: 'Get specific ERA document details', action: 'Get remittance advice' },
          { name: 'Process Remittance Advice', value: 'processRemittanceAdvice', description: 'Process and post ERA to patient accounts', action: 'Process remittance advice' },
          { name: 'List Payments', value: 'listPayments', description: 'List payment transactions', action: 'List payments' },
          { name: 'Get Payment', value: 'getPayment', description: 'Get specific payment details', action: 'Get payment' }
        ],
        default: 'listRemittanceAdvice',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['denialManagement'] } },
        options: [
          { name: 'List Denials', value: 'listDenials', description: 'Retrieve denied claims with filtering', action: 'List denials' },
          { name: 'Get Denial', value: 'getDenial', description: 'Get specific denial details and reason codes', action: 'Get denial details' },
          { name: 'Create Appeal', value: 'createAppeal', description: 'Submit appeal for denied claim', action: 'Create appeal' },
          { name: 'List Appeals', value: 'listAppeals', description: 'List appeals for specific denial', action: 'List appeals' },
          { name: 'Update Appeal', value: 'updateAppeal', description: 'Update appeal status or documentation', action: 'Update appeal' },
          { name: 'Get Denial Analytics', value: 'getDenialAnalytics', description: 'Get denial trend analytics and reporting', action: 'Get denial analytics' },
        ],
        default: 'listDenials',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['patients'] } },
        options: [
          { name: 'Create Patient', value: 'createPatient', description: 'Add new patient to system', action: 'Create patient' },
          { name: 'Get Patient', value: 'getPatient', description: 'Retrieve patient information', action: 'Get patient' },
          { name: 'List Patients', value: 'listPatients', description: 'Search and list patients', action: 'List patients' },
          { name: 'Update Patient', value: 'updatePatient', description: 'Update patient demographics or insurance', action: 'Update patient' },
          { name: 'Delete Patient', value: 'deletePatient', description: 'Remove patient record', action: 'Delete patient' }
        ],
        default: 'createPatient',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['providers'],
          },
        },
        options: [
          {
            name: 'Create Provider',
            value: 'createProvider',
            description: 'Add new provider to system',
            action: 'Create a provider',
          },
          {
            name: 'Get Provider',
            value: 'getProvider',
            description: 'Get provider details',
            action: 'Get a provider',
          },
          {
            name: 'List Providers',
            value: 'listProviders',
            description: 'List all providers with filtering',
            action: 'List providers',
          },
          {
            name: 'Update Provider',
            value: 'updateProvider',
            description: 'Update provider information',
            action: 'Update a provider',
          },
          {
            name: 'Delete Provider',
            value: 'deleteProvider',
            description: 'Remove provider record',
            action: 'Delete a provider',
          },
        ],
        default: 'createProvider',
      },
      // Eligibility fields
      {
        displayName: 'Patient Information',
        name: 'patientInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['createEligibilityRequest']
          }
        },
        default: '{}',
        description: 'Patient demographic and identification information',
        placeholder: '{"firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-01", "memberId": "123456789"}'
      },
      {
        displayName: 'Insurance Information',
        name: 'insuranceInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['createEligibilityRequest']
          }
        },
        default: '{}',
        description: 'Insurance payer and plan details',
        placeholder: '{"payerName": "Aetna", "planType": "PPO", "groupNumber": "12345"}'
      },
      {
        displayName: 'Provider Information',
        name: 'providerInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['createEligibilityRequest']
          }
        },
        default: '{}',
        description: 'Healthcare provider details',
        placeholder: '{"npi": "1234567890", "name": "Dr. Smith", "taxonomy": "207Q00000X"}'
      },
      {
        displayName: 'Request ID',
        name: 'requestId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['getEligibilityRequest', 'updateEligibilityRequest', 'deleteEligibilityRequest']
          }
        },
        default: '',
        description: 'The eligibility request ID'
      },
      {
        displayName: 'Date Range',
        name: 'dateRange',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['listEligibilityRequests']
          }
        },
        default: '',
        description: 'Filter requests by date range (ISO format)',
        placeholder: '2024-01-01,2024-12-31'
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['listEligibilityRequests']
          }
        },
        options: [
          { name: 'All', value: '' },
          { name: 'Pending', value: 'pending' },
          { name: 'Complete', value: 'complete' },
          { name: 'Failed', value: 'failed' },
          { name: 'Cancelled', value: 'cancelled' }
        ],
        default: '',
        description: 'Filter requests by status'
      },
      {
        displayName: 'Patient ID',
        name: 'patientId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['listEligibilityRequests']
          }
        },
        default: '',
        description: 'Filter requests by patient ID'
      },
      {
        displayName: 'Updated Information',
        name: 'updatedInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['eligibilityVerification'],
            operation: ['updateEligibilityRequest']
          }
        },
        default: '{}',
        description: 'Updated eligibility request details',
        placeholder: '{"status": "cancelled", "notes": "Patient cancelled appointment"}'
      },
      // Claims fields
      {
        displayName: 'Claim Data',
        name: 'claimData',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['createClaim'] } },
        default: '{}',
        description: 'The claim data object containing all claim information'
      },
      {
        displayName: 'Patient Info',
        name: 'patientInfo',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['createClaim'] } },
        default: '{}',
        description: 'Patient information including demographics and insurance details'
      },
      {
        displayName: 'Provider Info',
        name: 'providerInfo',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['createClaim'] } },
        default: '{}',
        description: 'Healthcare provider information and credentials'
      },
      {
        displayName: 'Services',
        name: 'services',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['createClaim'] } },
        default: '[]',
        description: 'Array of services provided and their associated codes'
      },
      {
        displayName: 'Claim ID',
        name: 'claimId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['getClaim', 'updateClaim', 'deleteClaim', 'resubmitClaim'] } },
        default: '',
        description: 'The unique identifier of the claim'
      },
      {
        displayName: 'Date Range Start',
        name: 'dateRangeStart',
        type: 'dateTime',
        displayOptions: { show: { resource: ['claims'], operation: ['listClaims'] } },
        default: '',
        description: 'Start date for filtering claims'
      },
      {
        displayName: 'Date Range End',
        name: 'dateRangeEnd',
        type: 'dateTime',
        displayOptions: { show: { resource: ['claims'], operation: ['listClaims'] } },
        default: '',
        description: 'End date for filtering claims'
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        displayOptions: { show: { resource: ['claims'], operation: ['listClaims'] } },
        options: [
          { name: 'All', value: '' },
          { name: 'Pending', value: 'pending' },
          { name: 'Approved', value: 'approved' },
          { name: 'Rejected', value: 'rejected' },
          { name: 'Paid', value: 'paid' }
        ],
        default: '',
        description: 'Filter claims by status'
      },
      {
        displayName: 'Patient ID',
        name: 'patientId',
        type: 'string',
        displayOptions: { show: { resource: ['claims'], operation: ['listClaims'] } },
        default: '',
        description: 'Filter claims by patient ID'
      },
      {
        displayName: 'Provider ID',
        name: 'providerId',
        type: 'string',
        displayOptions: { show: { resource: ['claims'], operation: ['listClaims'] } },
        default: '',
        description: 'Filter claims by provider ID'
      },
      {
        displayName: 'Updated Claim Data',
        name: 'updatedClaimData',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['updateClaim'] } },
        default: '{}',
        description: 'The updated claim data object'
      },
      {
        displayName: 'Corrections',
        name: 'corrections',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['claims'], operation: ['resubmitClaim'] } },
        default: '{}',
        description: 'Corrections to be applied to the claim before resubmission'
      },
      // Remittance fields
      {
        displayName: 'Date Range',
        name: 'dateRange',
        type: 'string',
        displayOptions: { show: { resource: ['remittance'], operation: ['listRemittanceAdvice', 'listPayments'] } },
        default: '',
        description: 'Date range for filtering (e.g., 2024-01-01 to 2024-01-31)',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        displayOptions: { show: { resource: ['remittance'], operation: ['listRemittanceAdvice', 'listPayments'] } },
        default: '',
        description: 'Filter by specific payer identifier',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        displayOptions: { show: { resource: ['remittance'], operation: ['listRemittanceAdvice'] } },
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Processed', value: 'processed' },
          { name: 'Failed', value: 'failed' },
          { name: 'All', value: 'all' }
        ],
        default: 'all',
        description: 'Filter by remittance advice status',
      },
      {
        displayName: 'ERA ID',
        name: 'eraId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['remittance'], operation: ['getRemittanceAdvice', 'processRemittanceAdvice'] } },
        default: '',
        description: 'Electronic Remittance Advice identifier',
      },
      {
        displayName: 'Posting Options',
        name: 'postingOptions',
        type: 'json',
        displayOptions: { show: { resource: ['remittance'], operation: ['processRemittanceAdvice'] } },
        default: '{}',
        description: 'JSON object containing posting options for ERA processing',
      },
      {
        displayName: 'Amount Range',
        name: 'amountRange',
        type: 'string',
        displayOptions: { show: { resource: ['remittance'], operation: ['listPayments'] } },
        default: '',
        description: 'Amount range for filtering payments (e.g., 100-1000)',
      },
      {
        displayName: 'Payment ID',
        name: 'paymentId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['remittance'], operation: ['getPayment'] } },
        default: '',
        description: 'Payment transaction identifier',
      },
      // Denial Management fields
      {
        displayName: 'Date Range',
        name: 'dateRange',
        type: 'string',
        displayOptions: { show: { resource: ['denialManagement'], operation: ['listDenials', 'getDenialAnalytics'] } },
        default: '',
        description: 'Date range filter for denied claims (e.g., 2024-01-01,2024-01-31)',
      },
      {
        displayName: 'Denial Reason',
        name: 'denialReason',
        type: 'string',
        displayOptions: { show: { resource: ['denialManagement'], operation: ['listDenials'] } },
        default: '',
        description: 'Filter by specific denial reason code',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        displayOptions: { show: { resource: ['denialManagement'], operation: ['listDenials', 'getDenialAnalytics'] } },
        default: '',
        description: 'Filter by specific payer/insurance company',
      },
      {
        displayName: 'Claim Type',
        name: 'claimType',
        type: 'string',
        displayOptions: { show: { resource: ['denialManagement'], operation: ['listDenials'] } },
        default: '',
        description: 'Filter by claim type (professional, institutional, etc.)',
      },
      {
        displayName: 'Denial ID',
        name: 'denialId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['denialManagement'], operation: ['getDenial', 'createAppeal', 'listAppeals', 'updateAppeal'] } },
        default: '',
        description: 'Unique identifier for the denial',
      },
      {
        displayName: 'Appeal Documentation',
        name: 'appealDocumentation',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['denialManagement'], operation: ['createAppeal'] } },
        default: '',
        description: 'Supporting documentation for the appeal',
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['denialManagement'], operation: ['createAppeal'] } },
        default: '',
        description: 'Reason for submitting the appeal',
      },
      {
        displayName: 'Appeal ID',
        name: 'appealId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['denialManagement'], operation: ['updateAppeal'] } },
        default: '',
        description: 'Unique identifier for the appeal',
      },
      {
        displayName: 'Updated Info',
        name: 'updatedInfo',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['denialManagement'], operation: ['updateAppeal'] } },
        default: '{}',
        description: 'Updated appeal information (status, documentation, etc.)',
      },
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'options',
        displayOptions: { show: { resource: ['denialManagement'], operation: ['getDenialAnalytics'] } },
        options: [
          { name: 'Payer', value: 'payer' },
          { name: 'Denial Reason', value: 'denial_reason' },
          { name: 'Claim Type', value: 'claim_type' },
          { name: 'Date', value: 'date' },
        ],
        default: 'payer',
        description: 'How to group the analytics data',
      },
      // Patients fields
      {
        displayName: 'Patient ID',
        name: 'patientId',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['patients'], operation: ['getPatient', 'updatePatient', 'deletePatient'] } },
        default: '',
        description: 'The unique identifier for the patient',
      },
      {
        displayName: 'Demographics',
        name: 'demographics',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['patients'], operation: ['createPatient'] } },
        default: '{\n  "firstName": "",\n  "lastName": "",\n  "dateOfBirth": "",\n  "gender": "",\n  "ssn": ""\n}',
        description: 'Patient demographic information including name, DOB, gender, and SSN',
      },
      {
        displayName: 'Insurance Information',
        name: 'insuranceInfo',
        type: 'json',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['createPatient'] } },
        default: '{\n  "insuranceId": "",\n  "groupNumber": "",\n  "planName": "",\n  "payerId": ""\n}',
        description: 'Patient insurance information',
      },
      {
        displayName: 'Contact Information',
        name: 'contactInfo',
        type: 'json',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['createPatient'] } },
        default: '{\n  "address": "",\n  "city": "",\n  "state": "",\n  "zipCode": "",\n  "phone": "",\n  "email": ""\n}',
        description: 'Patient contact information',
      },
      {
        displayName: 'Patient Name',
        name: 'name',
        type: 'string',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['listPatients'] } },
        default: '',
        description: 'Filter patients by name (partial match)',
      },
      {
        displayName: 'Date of Birth',
        name: 'dob',
        type: 'string',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['listPatients'] } },
        default: '',
        description: 'Filter patients by date of birth (YYYY-MM-DD format)',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['listPatients'] } },
        default: '',
        description: 'Filter patients by Social Security Number',
      },
      {
        displayName: 'Insurance ID',
        name: 'insuranceId',
        type: 'string',
        required: false,
        displayOptions: { show: { resource: ['patients'], operation: ['listPatients'] } },
        default: '',
        description: 'Filter patients by insurance ID',
      },
      {
        displayName: 'Updated Information',
        name: 'updatedInfo',
        type: 'json',
        required: true,
        displayOptions: { show: { resource: ['patients'], operation: ['updatePatient'] } },
        default: '{\n  "demographics": {},\n  "insuranceInfo": {},\n  "contactInfo": {}\n}',
        description: 'Updated patient information (any combination of demographics, insurance, or contact info)',
      },
      // Providers fields
      {
        displayName: 'Provider ID',
        name: 'providerId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['getProvider', 'updateProvider', 'deleteProvider'],
          },
        },
        default: '',
        placeholder: 'PRV123456',
        description: 'The unique identifier for the provider',
      },
      {
        displayName: 'Provider Information',
        name: 'providerInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['createProvider'],
          },
        },
        default: '{}',
        placeholder: '{"first_name": "John", "last_name": "Doe", "speciality": "Cardiology"}',
        description: 'Provider demographic and professional information',
      },
      {
        displayName: 'Credentials',
        name: 'credentials',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['createProvider'],
          },
        },
        default: '{}',
        placeholder: '{"license_number": "MD12345", "dea_number": "BD1234567"}',
        description: 'Healthcare provider credentials and license information',
      },
      {
        displayName: 'Taxonomy Code',
        name: 'taxonomyCode',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['createProvider'],
          },
        },
        default: '',
        placeholder: '207Q00000X',
        description: 'Healthcare Provider Taxonomy Code for the provider specialty',
      },
      {
        displayName: 'Updated Information',
        name: 'updatedInfo',
        type: 'json',
        required: true,
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['updateProvider'],
          },
        },
        default: '{}',
        placeholder: '{"phone": "555-0123", "address": {"street": "123 Main St"}}',
        description: 'Updated provider information',
      },
      {
        displayName: 'Provider Name',
        name: 'name',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['listProviders'],
          },
        },
        default: '',
        description: 'Filter providers by name (first or last)',
      },
      {
        displayName: 'NPI Number',
        name: 'npi',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['listProviders'],
          },
        },
        default: '',
        placeholder: '1234567890',
        description: 'Filter providers by National Provider Identifier',
      },
      {
        displayName: 'Taxonomy',
        name: 'taxonomy',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['listProviders'],
          },
        },
        default: '',
        placeholder: '207Q00000X',
        description: 'Filter providers by taxonomy code',
      },
      {
        displayName: 'Location',
        name: 'location',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['providers'],
            operation: ['listProviders'],
          },
        },
        default: '',
        placeholder: 'New York, NY',
        description: 'Filter providers by location (city, state, or zip)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    // Log license notice once per execution
    console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);

    switch (resource) {
      case 'eligibilityVerification':
        return [await executeEligibilityVerificationOperations.call(this, items)];
      case 'claims':
        return [await executeClaimsOperations.call(this, items)];
      case 'remittance':
        return [await executeRemittanceOperations.call(this, items)];
      case 'denialManagement':
        return [await executeDenialManagementOperations.call(this, items)];
      case 'patients':
        return [await executePatientsOperations.call(this, items)];
      case 'providers':
        return [await executeProvidersOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEligibilityVerificationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createEligibilityRequest': {
          const patientInfo = this.getNodeParameter('patientInfo', i) as object;
          const insuranceInfo = this.getNodeParameter('insuranceInfo', i) as object;
          const providerInfo = this.getNodeParameter('providerInfo', i) as object;

          const requestBody = {
            patient_info: patientInfo,
            insurance_info: insuranceInfo,
            provider_info: providerInfo
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/eligibility/requests`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEligibilityRequest': {
          const requestId = this.getNodeParameter('requestId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eligibility/requests/${requestId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listEligibilityRequests': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const patientId = this.getNodeParameter('patientId', i) as string;

          const queryParams: string[] = [];
          if (dateRange) queryParams.push(`date_range=${encodeURIComponent(dateRange)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (patientId) queryParams.push(`patient_id=${encodeURIComponent(patientId)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eligibility/requests${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEligibilityRequest': {
          const requestId = this.getNodeParameter('requestId', i) as string;
          const updatedInfo = this.getNodeParameter('updatedInfo', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/eligibility/requests/${requestId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updated_info: updatedInfo }),
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteEligibilityRequest': {
          const requestId = this.getNodeParameter('requestId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/eligibility/requests/${requestId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeClaimsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createClaim': {
          const claimData = this.getNodeParameter('claimData', i) as any;
          const patientInfo = this.getNodeParameter('patientInfo', i) as any;
          const providerInfo = this.getNodeParameter('providerInfo', i) as any;
          const services = this.getNodeParameter('services', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/claims`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              claim_data: claimData,
              patient_info: patientInfo,
              provider_info: providerInfo,
              services: services
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/claims/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listClaims': {
          const dateRangeStart = this.getNodeParameter('dateRangeStart', i) as string;
          const dateRangeEnd = this.getNodeParameter('dateRangeEnd', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const patientId = this.getNodeParameter('patientId', i) as string;
          const providerId = this.getNodeParameter('providerId', i) as string;

          const queryParams: any = {};
          if (dateRangeStart) queryParams.date_start = dateRangeStart;
          if (dateRangeEnd) queryParams.date_end = dateRangeEnd;
          if (status) queryParams.status = status;
          if (patientId) queryParams.patient_id = patientId;
          if (providerId) queryParams.provider_id = providerId;

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/claims${queryString ? '?' + queryString : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const updatedClaimData = this.getNodeParameter('updatedClaimData', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/claims/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              updated_claim_data: updatedClaimData
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/claims/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'resubmitClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const corrections = this.getNodeParameter('corrections', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/claims/${claimId}/resubmit`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              corrections: corrections
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRemittanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.waystar.com/v1';

      switch (operation) {
        case 'listRemittanceAdvice': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams = new URLSearchParams();
          if (dateRange) queryParams.append('date_range', dateRange);
          if (payerId) queryParams.append('payer_id', payerId);
          if (status && status !== 'all') queryParams.append('status', status);

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/remittance/advice?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRemittanceAdvice': {
          const eraId = this.getNodeParameter('eraId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/remittance/advice/${eraId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'processRemittanceAdvice': {
          const eraId = this.getNodeParameter('eraId', i) as string;
          const postingOptions = this.getNodeParameter('postingOptions', i) as string;

          let parsedPostingOptions: any = {};
          if (postingOptions) {
            try {
              parsedPostingOptions = JSON.parse(postingOptions);
            } catch (parseError: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in posting options: ${parseError.message}`);
            }
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/remittance/advice/${eraId}/process`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              posting_options: parsedPostingOptions,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listPayments': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const amountRange = this.getNodeParameter('amountRange', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;

          const queryParams = new URLSearchParams();
          if (dateRange) queryParams.append('date_range', dateRange);
          if (amountRange) queryParams.append('amount_range', amountRange);
          if (payerId) queryParams.append('payer_id', payerId);

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/remittance/payments?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPayment': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/remittance/payments/${paymentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDenialManagementOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listDenials': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const denialReason = this.getNodeParameter('denialReason', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;
          const claimType = this.getNodeParameter('claimType', i) as string;

          const queryParams: any = {};
          if (dateRange) queryParams.date_range = dateRange;
          if (denialReason) queryParams.denial_reason = denialReason;
          if (payerId) queryParams.payer_id = payerId;
          if (claimType) queryParams.claim_type = claimType;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/denials`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDenial': {
          const denialId = this.getNodeParameter('denialId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/denials/${denialId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAppeal': {
          const denialId = this.getNodeParameter('denialId', i) as string;
          const appealDocumentation = this.getNodeParameter('appealDocumentation', i) as string;
          const reason = this.getNodeParameter('reason', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/denials/${denialId}/appeals`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              appeal_documentation: appealDocumentation,
              reason: reason,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAppeals': {
          const denialId = this.getNodeParameter('denialId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/denials/${denialId}/appeals`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAppeal': {
          const denialId = this.getNodeParameter('denialId', i) as string;
          const appealId = this.getNodeParameter('appealId', i) as string;
          const updatedInfo = this.getNodeParameter('updatedInfo', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/denials/${denialId}/appeals/${appealId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: updatedInfo,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDenialAnalytics': {
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const groupBy = this.getNodeParameter('groupBy', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;

          const queryParams: any = {};
          if (dateRange) queryParams.date_range = dateRange;
          if (groupBy) queryParams.group_by = groupBy;
          if (payerId) queryParams.payer_id = payerId;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/denials/analytics`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePatientsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createPatient': {
          const demographics = this.getNodeParameter('demographics', i) as object;
          const insuranceInfo = this.getNodeParameter('insuranceInfo', i, {}) as object;
          const contactInfo = this.getNodeParameter('contactInfo', i, {}) as object;

          const body = {
            demographics,
            insurance_info: insuranceInfo,
            contact_info: contactInfo,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/patients`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPatient': {
          const patientId = this.getNodeParameter('patientId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/patients/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listPatients': {
          const name = this.getNodeParameter('name', i, '') as string;
          const dob = this.getNodeParameter('dob', i, '') as string;
          const ssn = this.getNodeParameter('ssn', i, '') as string;
          const insuranceId = this.getNodeParameter('insuranceId', i, '') as string;

          const queryParams = new URLSearchParams();
          if (name) queryParams.append('name', name);
          if (dob) queryParams.append('dob', dob);
          if (ssn) queryParams.append('ssn', ssn);
          if (insuranceId) queryParams.append('insurance_id', insuranceId);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePatient': {
          const patientId = this.getNodeParameter('patientId', i) as string;
          const updatedInfo = this.getNodeParameter('updatedInfo', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/patients/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updated_info: updatedInfo }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deletePatient': {
          const patientId = this.getNodeParameter('patientId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/patients/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProvidersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('waystarApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createProvider': {
          const providerInfo = this.getNodeParameter('providerInfo', i) as object;
          const providerCredentials = this.getNodeParameter('credentials', i) as object;
          const taxonomyCode = this.getNodeParameter('taxonomyCode', i) as string;

          const body = {
            provider_info: providerInfo,
            credentials: providerCredentials,
            taxonomy_code: taxonomyCode,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/providers`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProvider': {
          const providerId = this.getNodeParameter('providerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/providers/${providerId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listProviders': {
          const name = this.getNodeParameter('name', i, '') as string;
          const npi = this.getNodeParameter('npi', i, '') as string;
          const taxonomy = this.getNodeParameter('taxonomy', i, '') as string;
          const location = this.getNodeParameter('location', i, '') as string;

          const qs: any = {};
          if (name) qs.name = name;
          if (npi) qs.npi = npi;
          if (taxonomy) qs.taxonomy = taxonomy;
          if (location) qs.location = location;

          const options: any = {
            method: 'GET',