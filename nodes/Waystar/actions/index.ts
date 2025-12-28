/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createWaystarClient } from '../transport/waystarClient';
import { ediParser } from '../transport/ediParser';
import { WAYSTAR_ENDPOINTS } from '../constants/endpoints';

/**
 * All Resource Definitions
 */
export const resourceOptions: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'Analytics', value: 'analytics' },
    { name: 'Attachment', value: 'attachment' },
    { name: 'Batch', value: 'batch' },
    { name: 'Billing', value: 'billing' },
    { name: 'Claim', value: 'claim' },
    { name: 'Coding', value: 'coding' },
    { name: 'Collections', value: 'collections' },
    { name: 'Denial', value: 'denial' },
    { name: 'EDI', value: 'edi' },
    { name: 'Eligibility', value: 'eligibility' },
    { name: 'Enrollment', value: 'enrollment' },
    { name: 'Patient', value: 'patient' },
    { name: 'Payer', value: 'payer' },
    { name: 'Payment', value: 'payment' },
    { name: 'Prior Authorization', value: 'priorAuth' },
    { name: 'Provider', value: 'provider' },
    { name: 'Remittance', value: 'remittance' },
    { name: 'Report', value: 'report' },
    { name: 'Statement', value: 'statement' },
    { name: 'User', value: 'user' },
    { name: 'Utility', value: 'utility' },
    { name: 'Workflow', value: 'workflow' },
  ],
  default: 'eligibility',
};

/**
 * Operation definitions for each resource
 */
export const operationsByResource: Record<string, INodeProperties> = {
  eligibility: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['eligibility'] } },
    options: [
      { name: 'Check Eligibility', value: 'checkEligibility', action: 'Check eligibility' },
      { name: 'Check Eligibility Batch', value: 'checkEligibilityBatch', action: 'Check eligibility batch' },
      { name: 'Get Coverage Info', value: 'getCoverageInfo', action: 'Get coverage info' },
      { name: 'Get Benefits', value: 'getBenefits', action: 'Get benefits' },
      { name: 'Get Deductible', value: 'getDeductible', action: 'Get deductible' },
      { name: 'Get Copay', value: 'getCopay', action: 'Get copay' },
      { name: 'Get Out of Pocket', value: 'getOutOfPocket', action: 'Get out of pocket' },
      { name: 'Parse 271 Response', value: 'parse271', action: 'Parse 271 response' },
    ],
    default: 'checkEligibility',
  },
  claim: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['claim'] } },
    options: [
      { name: 'Submit Claim', value: 'submitClaim', action: 'Submit claim' },
      { name: 'Get Claim Status', value: 'getClaimStatus', action: 'Get claim status' },
      { name: 'Get Claim Details', value: 'getClaimDetails', action: 'Get claim details' },
      { name: 'Get Claims by Patient', value: 'getClaimsByPatient', action: 'Get claims by patient' },
      { name: 'Get Claims by Date', value: 'getClaimsByDate', action: 'Get claims by date' },
      { name: 'Update Claim', value: 'updateClaim', action: 'Update claim' },
      { name: 'Void Claim', value: 'voidClaim', action: 'Void claim' },
      { name: 'Resubmit Claim', value: 'resubmitClaim', action: 'Resubmit claim' },
      { name: 'Get Claim History', value: 'getClaimHistory', action: 'Get claim history' },
    ],
    default: 'submitClaim',
  },
  remittance: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['remittance'] } },
    options: [
      { name: 'Get ERA', value: 'getEra', action: 'Get ERA' },
      { name: 'Get ERA List', value: 'getEraList', action: 'Get ERA list' },
      { name: 'Get ERA by Check Number', value: 'getEraByCheck', action: 'Get ERA by check' },
      { name: 'Get ERA by Date Range', value: 'getEraByDate', action: 'Get ERA by date' },
      { name: 'Get Payment Details', value: 'getPaymentDetails', action: 'Get payment details' },
      { name: 'Parse ERA', value: 'parseEra', action: 'Parse ERA' },
      { name: 'Get Posted Payments', value: 'getPostedPayments', action: 'Get posted payments' },
      { name: 'Get Unposted Payments', value: 'getUnpostedPayments', action: 'Get unposted payments' },
    ],
    default: 'getEraList',
  },
  priorAuth: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['priorAuth'] } },
    options: [
      { name: 'Submit Prior Auth', value: 'submitPriorAuth', action: 'Submit prior auth' },
      { name: 'Check Status', value: 'checkStatus', action: 'Check status' },
      { name: 'Get Details', value: 'getDetails', action: 'Get details' },
      { name: 'Update Prior Auth', value: 'updatePriorAuth', action: 'Update prior auth' },
      { name: 'Cancel Prior Auth', value: 'cancelPriorAuth', action: 'Cancel prior auth' },
      { name: 'Get Approved Services', value: 'getApprovedServices', action: 'Get approved services' },
      { name: 'Search Prior Auths', value: 'searchPriorAuths', action: 'Search prior auths' },
    ],
    default: 'submitPriorAuth',
  },
  patient: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['patient'] } },
    options: [
      { name: 'Get Patient', value: 'getPatient', action: 'Get patient' },
      { name: 'Search Patients', value: 'searchPatients', action: 'Search patients' },
      { name: 'Create Patient', value: 'createPatient', action: 'Create patient' },
      { name: 'Update Patient', value: 'updatePatient', action: 'Update patient' },
      { name: 'Get Demographics', value: 'getDemographics', action: 'Get demographics' },
      { name: 'Get Insurance', value: 'getInsurance', action: 'Get insurance' },
      { name: 'Get Eligibility History', value: 'getEligibilityHistory', action: 'Get eligibility history' },
      { name: 'Get Patient Claims', value: 'getPatientClaims', action: 'Get patient claims' },
      { name: 'Get Patient Balance', value: 'getPatientBalance', action: 'Get patient balance' },
    ],
    default: 'getPatient',
  },
  provider: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['provider'] } },
    options: [
      { name: 'Get Provider', value: 'getProvider', action: 'Get provider' },
      { name: 'Search Providers', value: 'searchProviders', action: 'Search providers' },
      { name: 'Get by NPI', value: 'getByNpi', action: 'Get by NPI' },
      { name: 'Validate NPI', value: 'validateNpi', action: 'Validate NPI' },
      { name: 'Get Locations', value: 'getLocations', action: 'Get locations' },
      { name: 'Get Enrollment Status', value: 'getEnrollmentStatus', action: 'Get enrollment status' },
    ],
    default: 'getProvider',
  },
  payer: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['payer'] } },
    options: [
      { name: 'Get Payers', value: 'getPayers', action: 'Get payers' },
      { name: 'Get Payer Details', value: 'getPayerDetails', action: 'Get payer details' },
      { name: 'Get Payer Rules', value: 'getPayerRules', action: 'Get payer rules' },
      { name: 'Get Payer Requirements', value: 'getPayerRequirements', action: 'Get payer requirements' },
      { name: 'Check Connectivity', value: 'checkConnectivity', action: 'Check connectivity' },
    ],
    default: 'getPayers',
  },
  denial: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['denial'] } },
    options: [
      { name: 'Get Denials', value: 'getDenials', action: 'Get denials' },
      { name: 'Get Denial Details', value: 'getDenialDetails', action: 'Get denial details' },
      { name: 'Get Denial Reasons', value: 'getDenialReasons', action: 'Get denial reasons' },
      { name: 'Analyze Denial', value: 'analyzeDenial', action: 'Analyze denial' },
      { name: 'Get Denial Trends', value: 'getDenialTrends', action: 'Get denial trends' },
      { name: 'Create Appeal', value: 'createAppeal', action: 'Create appeal' },
      { name: 'Track Appeal', value: 'trackAppeal', action: 'Track appeal' },
      { name: 'Get Recovery Opportunities', value: 'getRecoveryOpportunities', action: 'Get recovery opportunities' },
    ],
    default: 'getDenials',
  },
  payment: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['payment'] } },
    options: [
      { name: 'Get Payments', value: 'getPayments', action: 'Get payments' },
      { name: 'Get Payment Details', value: 'getPaymentDetails', action: 'Get payment details' },
      { name: 'Get Payment by Check', value: 'getPaymentByCheck', action: 'Get payment by check' },
      { name: 'Post Payment', value: 'postPayment', action: 'Post payment' },
      { name: 'Get Allocations', value: 'getAllocations', action: 'Get allocations' },
      { name: 'Reconcile Payments', value: 'reconcilePayments', action: 'Reconcile payments' },
      { name: 'Get Expected Payments', value: 'getExpectedPayments', action: 'Get expected payments' },
    ],
    default: 'getPayments',
  },
  billing: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['billing'] } },
    options: [
      { name: 'Get Billing Queue', value: 'getBillingQueue', action: 'Get billing queue' },
      { name: 'Get Billing Holds', value: 'getBillingHolds', action: 'Get billing holds' },
      { name: 'Get Ready to Bill', value: 'getReadyToBill', action: 'Get ready to bill' },
      { name: 'Submit Billing Batch', value: 'submitBillingBatch', action: 'Submit billing batch' },
      { name: 'Get Billing Errors', value: 'getBillingErrors', action: 'Get billing errors' },
      { name: 'Get Unbilled Charges', value: 'getUnbilledCharges', action: 'Get unbilled charges' },
    ],
    default: 'getBillingQueue',
  },
  coding: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['coding'] } },
    options: [
      { name: 'Validate ICD-10', value: 'validateIcd10', action: 'Validate ICD-10' },
      { name: 'Validate CPT', value: 'validateCpt', action: 'Validate CPT' },
      { name: 'Validate HCPCS', value: 'validateHcpcs', action: 'Validate HCPCS' },
      { name: 'Get Code Description', value: 'getCodeDescription', action: 'Get code description' },
      { name: 'Get CCI Edits', value: 'getCciEdits', action: 'Get CCI edits' },
      { name: 'Get LCD/NCD Info', value: 'getLcdNcdInfo', action: 'Get LCD/NCD info' },
      { name: 'Search Codes', value: 'searchCodes', action: 'Search codes' },
    ],
    default: 'validateIcd10',
  },
  report: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['report'] } },
    options: [
      { name: 'Get Available Reports', value: 'getAvailableReports', action: 'Get available reports' },
      { name: 'Generate Report', value: 'generateReport', action: 'Generate report' },
      { name: 'Get Report Status', value: 'getReportStatus', action: 'Get report status' },
      { name: 'Download Report', value: 'downloadReport', action: 'Download report' },
      { name: 'Get A/R Aging Report', value: 'getArAgingReport', action: 'Get A/R aging report' },
      { name: 'Get Denial Report', value: 'getDenialReport', action: 'Get denial report' },
      { name: 'Get Payment Report', value: 'getPaymentReport', action: 'Get payment report' },
    ],
    default: 'getAvailableReports',
  },
  analytics: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['analytics'] } },
    options: [
      { name: 'Get Revenue Analytics', value: 'getRevenueAnalytics', action: 'Get revenue analytics' },
      { name: 'Get Denial Analytics', value: 'getDenialAnalytics', action: 'Get denial analytics' },
      { name: 'Get Payer Analytics', value: 'getPayerAnalytics', action: 'Get payer analytics' },
      { name: 'Get Clean Claim Rate', value: 'getCleanClaimRate', action: 'Get clean claim rate' },
      { name: 'Get Days in A/R', value: 'getDaysInAr', action: 'Get days in A/R' },
      { name: 'Get Collection Rate', value: 'getCollectionRate', action: 'Get collection rate' },
      { name: 'Get Benchmark Data', value: 'getBenchmarkData', action: 'Get benchmark data' },
    ],
    default: 'getRevenueAnalytics',
  },
  edi: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['edi'] } },
    options: [
      { name: 'Submit EDI File', value: 'submitEdiFile', action: 'Submit EDI file' },
      { name: 'Get EDI Response', value: 'getEdiResponse', action: 'Get EDI response' },
      { name: 'Get 997/999 Acknowledgment', value: 'getAcknowledgment', action: 'Get acknowledgment' },
      { name: 'Parse EDI File', value: 'parseEdiFile', action: 'Parse EDI file' },
      { name: 'Validate EDI', value: 'validateEdi', action: 'Validate EDI' },
      { name: 'Get EDI History', value: 'getEdiHistory', action: 'Get EDI history' },
    ],
    default: 'submitEdiFile',
  },
  batch: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['batch'] } },
    options: [
      { name: 'Submit Batch', value: 'submitBatch', action: 'Submit batch' },
      { name: 'Get Batch Status', value: 'getBatchStatus', action: 'Get batch status' },
      { name: 'Get Batch Results', value: 'getBatchResults', action: 'Get batch results' },
      { name: 'Get Batch Errors', value: 'getBatchErrors', action: 'Get batch errors' },
      { name: 'Cancel Batch', value: 'cancelBatch', action: 'Cancel batch' },
      { name: 'Reprocess Batch', value: 'reprocessBatch', action: 'Reprocess batch' },
    ],
    default: 'submitBatch',
  },
  utility: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['utility'] } },
    options: [
      { name: 'Validate NPI', value: 'validateNpi', action: 'Validate NPI' },
      { name: 'Validate Tax ID', value: 'validateTaxId', action: 'Validate tax ID' },
      { name: 'Validate Address', value: 'validateAddress', action: 'Validate address' },
      { name: 'Get Taxonomy Codes', value: 'getTaxonomyCodes', action: 'Get taxonomy codes' },
      { name: 'Get Place of Service Codes', value: 'getPosCodes', action: 'Get POS codes' },
      { name: 'Get Adjustment Reason Codes', value: 'getCarcCodes', action: 'Get CARC codes' },
      { name: 'Test Connection', value: 'testConnection', action: 'Test connection' },
      { name: 'Get API Status', value: 'getApiStatus', action: 'Get API status' },
    ],
    default: 'testConnection',
  },
  statement: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['statement'] } },
    options: [
      { name: 'Generate Statement', value: 'generateStatement', action: 'Generate statement' },
      { name: 'Get Statement', value: 'getStatement', action: 'Get statement' },
      { name: 'Get Statements by Patient', value: 'getStatementsByPatient', action: 'Get statements by patient' },
      { name: 'Send Statement', value: 'sendStatement', action: 'Send statement' },
      { name: 'Get Statement Queue', value: 'getStatementQueue', action: 'Get statement queue' },
    ],
    default: 'getStatement',
  },
  collections: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['collections'] } },
    options: [
      { name: 'Get Collection Accounts', value: 'getCollectionAccounts', action: 'Get collection accounts' },
      { name: 'Get Collection Queue', value: 'getCollectionQueue', action: 'Get collection queue' },
      { name: 'Assign to Collection', value: 'assignToCollection', action: 'Assign to collection' },
      { name: 'Update Collection Status', value: 'updateCollectionStatus', action: 'Update collection status' },
      { name: 'Get Collection Stats', value: 'getCollectionStats', action: 'Get collection stats' },
    ],
    default: 'getCollectionAccounts',
  },
  attachment: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['attachment'] } },
    options: [
      { name: 'Upload Attachment', value: 'uploadAttachment', action: 'Upload attachment' },
      { name: 'Get Attachment', value: 'getAttachment', action: 'Get attachment' },
      { name: 'Get Attachments by Claim', value: 'getAttachmentsByClaim', action: 'Get attachments by claim' },
      { name: 'Get Attachment Types', value: 'getAttachmentTypes', action: 'Get attachment types' },
      { name: 'Delete Attachment', value: 'deleteAttachment', action: 'Delete attachment' },
    ],
    default: 'uploadAttachment',
  },
  enrollment: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['enrollment'] } },
    options: [
      { name: 'Get Enrollment Status', value: 'getEnrollmentStatus', action: 'Get enrollment status' },
      { name: 'Submit Enrollment', value: 'submitEnrollment', action: 'Submit enrollment' },
      { name: 'Get Enrollment Requirements', value: 'getEnrollmentRequirements', action: 'Get enrollment requirements' },
      { name: 'Get Enrolled Payers', value: 'getEnrolledPayers', action: 'Get enrolled payers' },
    ],
    default: 'getEnrollmentStatus',
  },
  workflow: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['workflow'] } },
    options: [
      { name: 'Get Workflows', value: 'getWorkflows', action: 'Get workflows' },
      { name: 'Get Workflow Tasks', value: 'getWorkflowTasks', action: 'Get workflow tasks' },
      { name: 'Assign Task', value: 'assignTask', action: 'Assign task' },
      { name: 'Complete Task', value: 'completeTask', action: 'Complete task' },
      { name: 'Get Task Queue', value: 'getTaskQueue', action: 'Get task queue' },
    ],
    default: 'getWorkflows',
  },
  user: {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['user'] } },
    options: [
      { name: 'Get Users', value: 'getUsers', action: 'Get users' },
      { name: 'Get User', value: 'getUser', action: 'Get user' },
      { name: 'Get User Permissions', value: 'getUserPermissions', action: 'Get user permissions' },
      { name: 'Get User Activity', value: 'getUserActivity', action: 'Get user activity' },
      { name: 'Get Work Queue', value: 'getWorkQueue', action: 'Get work queue' },
    ],
    default: 'getUsers',
  },
};

/**
 * Common fields used across multiple resources
 */
export const commonFields: INodeProperties[] = [
  // ID fields
  { displayName: 'ID', name: 'id', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['getPatient', 'getProvider', 'getPayerDetails', 'getDenialDetails', 'getPaymentDetails', 'getEra', 'getBatchStatus', 'getStatement', 'getAttachment', 'getUser', 'getClaimDetails'] } } },
  { displayName: 'Patient ID', name: 'patientId', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['getPatientClaims', 'getPatientBalance', 'getStatementsByPatient', 'getEligibilityHistory', 'getDemographics', 'getInsurance', 'createPatient', 'updatePatient'] } } },
  { displayName: 'Claim ID', name: 'claimId', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['getClaimStatus', 'voidClaim', 'resubmitClaim', 'getClaimHistory', 'getAttachmentsByClaim', 'analyzeDenial'] } } },
  
  // Payer fields
  { displayName: 'Payer ID', name: 'payerId', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['checkEligibility', 'submitClaim', 'getPayerRules', 'getPayerRequirements', 'checkConnectivity'] } } },
  
  // Member/subscriber fields
  { displayName: 'Member ID', name: 'memberId', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['checkEligibility', 'submitClaim', 'getClaimStatus'] } } },
  
  // Name fields
  { displayName: 'First Name', name: 'firstName', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['checkEligibility', 'createPatient', 'searchPatients'] } } },
  { displayName: 'Last Name', name: 'lastName', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['checkEligibility', 'createPatient', 'searchPatients'] } } },
  { displayName: 'Date of Birth', name: 'dateOfBirth', type: 'string', default: '', placeholder: 'YYYY-MM-DD', displayOptions: { show: { operation: ['checkEligibility', 'createPatient', 'searchPatients'] } } },
  
  // Date range fields
  { displayName: 'Start Date', name: 'startDate', type: 'string', required: true, default: '', placeholder: 'YYYY-MM-DD', displayOptions: { show: { operation: ['getClaimsByDate', 'getEraByDate', 'getDenialTrends', 'getRevenueAnalytics', 'getPaymentReport'] } } },
  { displayName: 'End Date', name: 'endDate', type: 'string', required: true, default: '', placeholder: 'YYYY-MM-DD', displayOptions: { show: { operation: ['getClaimsByDate', 'getEraByDate', 'getDenialTrends', 'getRevenueAnalytics', 'getPaymentReport'] } } },
  
  // Check number
  { displayName: 'Check Number', name: 'checkNumber', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['getEraByCheck', 'getPaymentByCheck'] } } },
  
  // Code validation fields
  { displayName: 'Code', name: 'code', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['validateIcd10', 'validateCpt', 'validateHcpcs', 'getCodeDescription'] } } },
  
  // NPI field
  { displayName: 'NPI', name: 'npi', type: 'string', required: true, default: '', placeholder: '1234567890', displayOptions: { show: { operation: ['validateNpi', 'getByNpi'] } } },
  
  // Search query
  { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', displayOptions: { show: { operation: ['searchPatients', 'searchProviders', 'searchCodes', 'searchPriorAuths'] } } },
  
  // EDI content
  { displayName: 'EDI Content', name: 'ediContent', type: 'string', typeOptions: { rows: 10 }, required: true, default: '', displayOptions: { show: { operation: ['parse271', 'parseEra', 'parseEdiFile', 'validateEdi', 'submitEdiFile'] } } },
  
  // Report type
  { displayName: 'Report Type', name: 'reportType', type: 'options', options: [
    { name: 'A/R Aging', value: 'ar_aging' },
    { name: 'Denial Summary', value: 'denial_summary' },
    { name: 'Payment Summary', value: 'payment_summary' },
    { name: 'Productivity', value: 'productivity' },
    { name: 'Financial Summary', value: 'financial_summary' },
    { name: 'Clean Claim Rate', value: 'clean_claim_rate' },
    { name: 'Days in A/R', value: 'days_in_ar' },
  ], default: 'ar_aging', displayOptions: { show: { operation: ['generateReport'] } } },
  
  // Batch ID
  { displayName: 'Batch ID', name: 'batchId', type: 'string', required: true, default: '', displayOptions: { show: { operation: ['getBatchStatus', 'getBatchResults', 'getBatchErrors', 'cancelBatch', 'reprocessBatch'] } } },
];

/**
 * Router to execute operations based on resource
 */
export async function executeOperation(
  context: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const resource = context.getNodeParameter('resource', index) as string;
  const operation = context.getNodeParameter('operation', index) as string;
  const client = await createWaystarClient(context);
  
  let responseData: unknown;

  // Generic handler based on resource and operation
  const endpoint = getEndpoint(resource, operation);
  const method = getMethod(operation);
  const params = buildParams(context, index, resource, operation);

  if (method === 'GET') {
    responseData = await client.get(endpoint, params.query);
  } else if (method === 'POST') {
    responseData = await client.post(endpoint, params.body, params.query);
  } else if (method === 'PATCH') {
    responseData = await client.patch(endpoint, params.body);
  } else if (method === 'DELETE') {
    responseData = await client.delete(endpoint);
  }

  // Special handling for parse operations
  if (operation === 'parse271') {
    const ediContent = context.getNodeParameter('ediContent', index) as string;
    responseData = ediParser.parse271(ediContent);
  } else if (operation === 'parseEra') {
    const ediContent = context.getNodeParameter('ediContent', index) as string;
    responseData = ediParser.parse835(ediContent);
  }

  return [{ json: responseData as Record<string, unknown> }];
}

function getEndpoint(resource: string, operation: string): string {
  const endpoints: Record<string, Record<string, string>> = {
    eligibility: {
      checkEligibility: WAYSTAR_ENDPOINTS.ELIGIBILITY.CHECK,
      getCoverageInfo: WAYSTAR_ENDPOINTS.ELIGIBILITY.COVERAGE,
      getBenefits: WAYSTAR_ENDPOINTS.ELIGIBILITY.BENEFITS,
    },
    claim: {
      submitClaim: WAYSTAR_ENDPOINTS.CLAIMS.SUBMIT,
      getClaimStatus: WAYSTAR_ENDPOINTS.CLAIMS.STATUS,
      getClaimDetails: WAYSTAR_ENDPOINTS.CLAIMS.DETAILS,
      getClaimsByPatient: WAYSTAR_ENDPOINTS.CLAIMS.BY_PATIENT,
      getClaimsByDate: WAYSTAR_ENDPOINTS.CLAIMS.BY_DATE,
    },
    remittance: {
      getEra: WAYSTAR_ENDPOINTS.REMITTANCE.ERA,
      getEraList: WAYSTAR_ENDPOINTS.REMITTANCE.ERA_LIST,
      getEraByCheck: WAYSTAR_ENDPOINTS.REMITTANCE.BY_CHECK,
      getEraByDate: WAYSTAR_ENDPOINTS.REMITTANCE.BY_DATE,
    },
    denial: {
      getDenials: WAYSTAR_ENDPOINTS.DENIALS.LIST,
      getDenialDetails: WAYSTAR_ENDPOINTS.DENIALS.DETAILS,
      createAppeal: WAYSTAR_ENDPOINTS.DENIALS.CREATE_APPEAL,
    },
    payment: {
      getPayments: WAYSTAR_ENDPOINTS.PAYMENTS.LIST,
      postPayment: WAYSTAR_ENDPOINTS.PAYMENTS.POST,
    },
    utility: {
      testConnection: WAYSTAR_ENDPOINTS.UTILITY.TEST_CONNECTION,
      getApiStatus: WAYSTAR_ENDPOINTS.UTILITY.API_STATUS,
    },
  };

  return endpoints[resource]?.[operation] || `/${resource}/${operation}`;
}

function getMethod(operation: string): string {
  const postOperations = ['submit', 'create', 'post', 'upload', 'generate', 'assign', 'send'];
  const patchOperations = ['update'];
  const deleteOperations = ['delete', 'void', 'cancel'];

  if (postOperations.some(op => operation.toLowerCase().includes(op))) return 'POST';
  if (patchOperations.some(op => operation.toLowerCase().includes(op))) return 'PATCH';
  if (deleteOperations.some(op => operation.toLowerCase().includes(op))) return 'DELETE';
  return 'GET';
}

function buildParams(context: IExecuteFunctions, index: number, resource: string, operation: string): { body?: Record<string, unknown>; query?: Record<string, string | number | boolean> } {
  const query: Record<string, string | number | boolean> = {};
  const body: Record<string, unknown> = {};

  // Build params based on available fields
  const paramFields = ['id', 'patientId', 'claimId', 'payerId', 'memberId', 'firstName', 'lastName', 'dateOfBirth', 'startDate', 'endDate', 'checkNumber', 'code', 'npi', 'searchQuery', 'batchId'];

  for (const field of paramFields) {
    try {
      const value = context.getNodeParameter(field, index, '') as string;
      if (value) {
        if (['POST', 'PATCH'].includes(getMethod(operation))) {
          body[field] = value;
        } else {
          query[field] = value;
        }
      }
    } catch {
      // Field not available for this operation
    }
  }

  return { body: Object.keys(body).length > 0 ? body : undefined, query: Object.keys(query).length > 0 ? query : undefined };
}

export default {
  resourceOptions,
  operationsByResource,
  commonFields,
  executeOperation,
};
