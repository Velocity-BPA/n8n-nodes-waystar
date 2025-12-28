/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Waystar API Endpoints
 *
 * Centralized endpoint definitions for the Waystar healthcare
 * revenue cycle management platform.
 */
export const WAYSTAR_ENDPOINTS = {
  // Base URLs by environment
  BASE_URLS: {
    PRODUCTION: 'https://api.waystar.com/v1',
    SANDBOX: 'https://api-sandbox.waystar.com/v1',
  },

  // OAuth endpoints
  AUTH: {
    TOKEN: '/oauth2/token',
    REFRESH: '/oauth2/refresh',
    REVOKE: '/oauth2/revoke',
  },

  // Eligibility endpoints (270/271)
  ELIGIBILITY: {
    CHECK: '/eligibility/verify',
    CHECK_BATCH: '/eligibility/batch',
    RESPONSE: '/eligibility/responses',
    COVERAGE: '/eligibility/coverage',
    BENEFITS: '/eligibility/benefits',
    HISTORY: '/eligibility/history',
  },

  // Claims endpoints (837P/I/D, 276/277)
  CLAIMS: {
    SUBMIT: '/claims/submit',
    STATUS: '/claims/status',
    DETAILS: '/claims',
    BY_PATIENT: '/claims/patient',
    BY_DATE: '/claims/by-date',
    BY_STATUS: '/claims/by-status',
    UPDATE: '/claims/update',
    VOID: '/claims/void',
    RESUBMIT: '/claims/resubmit',
    ATTACHMENTS: '/claims/attachments',
    HISTORY: '/claims/history',
    REJECTIONS: '/claims/rejections',
    PAYMENTS: '/claims/payments',
  },

  // Remittance endpoints (835/ERA)
  REMITTANCE: {
    ERA: '/remittance/era',
    ERA_LIST: '/remittance/era/list',
    BY_CHECK: '/remittance/by-check',
    BY_DATE: '/remittance/by-date',
    PAYMENT_DETAILS: '/remittance/payment-details',
    ADJUSTMENTS: '/remittance/adjustments',
    SERVICE_LINES: '/remittance/service-lines',
    DOWNLOAD: '/remittance/download',
    PARSE: '/remittance/parse',
    RECONCILIATION: '/remittance/reconciliation',
    POSTED: '/remittance/posted',
    UNPOSTED: '/remittance/unposted',
  },

  // Prior Authorization endpoints
  PRIOR_AUTH: {
    SUBMIT: '/prior-auth/submit',
    STATUS: '/prior-auth/status',
    DETAILS: '/prior-auth',
    UPDATE: '/prior-auth/update',
    CANCEL: '/prior-auth/cancel',
    REFERENCE: '/prior-auth/reference',
    SERVICES: '/prior-auth/services',
    VALIDITY: '/prior-auth/validity',
    REQUIREMENTS: '/prior-auth/requirements',
    SEARCH: '/prior-auth/search',
  },

  // Patient endpoints
  PATIENTS: {
    GET: '/patients',
    SEARCH: '/patients/search',
    CREATE: '/patients/create',
    UPDATE: '/patients/update',
    DEMOGRAPHICS: '/patients/demographics',
    INSURANCE: '/patients/insurance',
    ELIGIBILITY_HISTORY: '/patients/eligibility-history',
    CLAIMS: '/patients/claims',
    BALANCE: '/patients/balance',
    MERGE: '/patients/merge',
    STATEMENTS: '/patients/statements',
  },

  // Provider endpoints
  PROVIDERS: {
    GET: '/providers',
    SEARCH: '/providers/search',
    BY_NPI: '/providers/npi',
    VALIDATE_NPI: '/providers/validate-npi',
    LOCATIONS: '/providers/locations',
    SPECIALTIES: '/providers/specialties',
    ENROLLMENT: '/providers/enrollment',
    CREDENTIALS: '/providers/credentials',
    NETWORK: '/providers/network',
  },

  // Payer endpoints
  PAYERS: {
    LIST: '/payers',
    DETAILS: '/payers/details',
    BY_ID: '/payers/id',
    RULES: '/payers/rules',
    REQUIREMENTS: '/payers/requirements',
    CONTACTS: '/payers/contacts',
    TRANSACTIONS: '/payers/transactions',
    EDI_INFO: '/payers/edi-info',
    CONNECTIVITY: '/payers/connectivity',
  },

  // Denial endpoints
  DENIALS: {
    LIST: '/denials',
    DETAILS: '/denials/details',
    REASONS: '/denials/reasons',
    BY_CLAIM: '/denials/by-claim',
    ANALYZE: '/denials/analyze',
    TRENDS: '/denials/trends',
    APPEAL_REQUIREMENTS: '/denials/appeal-requirements',
    CREATE_APPEAL: '/denials/appeal',
    TRACK_APPEAL: '/denials/appeal/track',
    STATS: '/denials/stats',
    RECOVERY: '/denials/recovery',
  },

  // Payment endpoints
  PAYMENTS: {
    LIST: '/payments',
    DETAILS: '/payments/details',
    BY_CHECK: '/payments/by-check',
    POST: '/payments/post',
    ALLOCATIONS: '/payments/allocations',
    UNALLOCATED: '/payments/unallocated',
    HISTORY: '/payments/history',
    RECONCILE: '/payments/reconcile',
    VARIANCE: '/payments/variance',
    EXPECTED: '/payments/expected',
  },

  // Billing endpoints
  BILLING: {
    QUEUE: '/billing/queue',
    HOLDS: '/billing/holds',
    READY: '/billing/ready',
    SUBMIT_BATCH: '/billing/batch',
    STATUS: '/billing/status',
    ERRORS: '/billing/errors',
    HISTORY: '/billing/history',
    CHARGE_CAPTURE: '/billing/charge-capture',
    UNBILLED: '/billing/unbilled',
  },

  // Coding endpoints
  CODING: {
    VALIDATE_ICD10: '/coding/icd10/validate',
    VALIDATE_CPT: '/coding/cpt/validate',
    VALIDATE_HCPCS: '/coding/hcpcs/validate',
    DESCRIPTION: '/coding/description',
    EDITS: '/coding/edits',
    CCI: '/coding/cci',
    LCD_NCD: '/coding/lcd-ncd',
    CROSSWALK: '/coding/crosswalk',
    BUNDLING: '/coding/bundling',
    SEARCH: '/coding/search',
  },

  // Statement endpoints
  STATEMENTS: {
    GENERATE: '/statements/generate',
    GET: '/statements',
    BY_PATIENT: '/statements/patient',
    SEND: '/statements/send',
    HISTORY: '/statements/history',
    QUEUE: '/statements/queue',
    UPDATE: '/statements/update',
    BALANCE: '/statements/balance',
    COLLECTION_STATUS: '/statements/collection-status',
  },

  // Collections endpoints
  COLLECTIONS: {
    ACCOUNTS: '/collections/accounts',
    QUEUE: '/collections/queue',
    ASSIGN: '/collections/assign',
    UPDATE_STATUS: '/collections/status',
    NOTES: '/collections/notes',
    ADD_NOTE: '/collections/notes/add',
    HISTORY: '/collections/history',
    BAD_DEBT: '/collections/bad-debt',
    WRITE_OFF: '/collections/write-off',
    STATS: '/collections/stats',
  },

  // Report endpoints
  REPORTS: {
    AVAILABLE: '/reports/available',
    GENERATE: '/reports/generate',
    STATUS: '/reports/status',
    DOWNLOAD: '/reports/download',
    SCHEDULE: '/reports/schedule',
    AR_AGING: '/reports/ar-aging',
    DENIAL: '/reports/denial',
    PAYMENT: '/reports/payment',
    PRODUCTIVITY: '/reports/productivity',
    FINANCIAL_SUMMARY: '/reports/financial-summary',
    EXPORT: '/reports/export',
  },

  // Analytics endpoints
  ANALYTICS: {
    REVENUE: '/analytics/revenue',
    DENIAL: '/analytics/denial',
    PAYER: '/analytics/payer',
    PROVIDER: '/analytics/provider',
    AR: '/analytics/ar',
    COLLECTION_RATE: '/analytics/collection-rate',
    CLEAN_CLAIM_RATE: '/analytics/clean-claim-rate',
    DAYS_IN_AR: '/analytics/days-in-ar',
    CHARGE_LAG: '/analytics/charge-lag',
    PAYMENT_LAG: '/analytics/payment-lag',
    BENCHMARK: '/analytics/benchmark',
  },

  // Attachment endpoints
  ATTACHMENTS: {
    UPLOAD: '/attachments/upload',
    GET: '/attachments',
    BY_CLAIM: '/attachments/by-claim',
    TYPES: '/attachments/types',
    LINK: '/attachments/link',
    STATUS: '/attachments/status',
    DELETE: '/attachments/delete',
    PWK_CODES: '/attachments/pwk-codes',
  },

  // Enrollment endpoints
  ENROLLMENT: {
    STATUS: '/enrollment/status',
    SUBMIT: '/enrollment/submit',
    REQUIREMENTS: '/enrollment/requirements',
    UPDATE: '/enrollment/update',
    PAYERS: '/enrollment/payers',
    HISTORY: '/enrollment/history',
    CREDENTIALING: '/enrollment/credentialing',
    REENROLLMENT: '/enrollment/reenrollment',
  },

  // Batch endpoints
  BATCH: {
    SUBMIT: '/batch/submit',
    STATUS: '/batch/status',
    RESULTS: '/batch/results',
    ERRORS: '/batch/errors',
    CANCEL: '/batch/cancel',
    HISTORY: '/batch/history',
    DOWNLOAD: '/batch/download',
    REPROCESS: '/batch/reprocess',
  },

  // EDI endpoints
  EDI: {
    SUBMIT: '/edi/submit',
    RESPONSE: '/edi/response',
    ACK_997: '/edi/acknowledgment/997',
    ACK_999: '/edi/acknowledgment/999',
    ACK_TA1: '/edi/acknowledgment/ta1',
    PARSE: '/edi/parse',
    GENERATE: '/edi/generate',
    VALIDATE: '/edi/validate',
    HISTORY: '/edi/history',
    DOWNLOAD: '/edi/download',
  },

  // Workflow endpoints
  WORKFLOW: {
    LIST: '/workflow',
    TASKS: '/workflow/tasks',
    ASSIGN: '/workflow/assign',
    COMPLETE: '/workflow/complete',
    QUEUE: '/workflow/queue',
    STATUS: '/workflow/status',
    CREATE: '/workflow/create',
    HISTORY: '/workflow/history',
  },

  // User endpoints
  USERS: {
    LIST: '/users',
    GET: '/users',
    PERMISSIONS: '/users/permissions',
    ACTIVITY: '/users/activity',
    TASKS: '/users/tasks',
    WORK_QUEUE: '/users/work-queue',
  },

  // Utility endpoints
  UTILITY: {
    VALIDATE_NPI: '/utility/validate-npi',
    VALIDATE_TAX_ID: '/utility/validate-tax-id',
    VALIDATE_ADDRESS: '/utility/validate-address',
    TAXONOMY_CODES: '/utility/taxonomy-codes',
    POS_CODES: '/utility/pos-codes',
    MODIFIER_CODES: '/utility/modifier-codes',
    CARC_CODES: '/utility/carc-codes',
    RARC_CODES: '/utility/rarc-codes',
    TEST_CONNECTION: '/utility/test-connection',
    API_STATUS: '/utility/status',
  },

  // Health check
  HEALTH: '/health',
};

/**
 * Webhook endpoints for triggers
 */
export const WEBHOOK_ENDPOINTS = {
  ELIGIBILITY: '/webhooks/eligibility',
  CLAIMS: '/webhooks/claims',
  REMITTANCE: '/webhooks/remittance',
  DENIALS: '/webhooks/denials',
  PRIOR_AUTH: '/webhooks/prior-auth',
  PAYMENTS: '/webhooks/payments',
  BATCH: '/webhooks/batch',
  WORKFLOW: '/webhooks/workflow',
  EDI: '/webhooks/edi',
  REPORTS: '/webhooks/reports',
};

export default WAYSTAR_ENDPOINTS;
