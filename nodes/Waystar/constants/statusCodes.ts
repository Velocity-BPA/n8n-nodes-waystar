/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Healthcare Claim Status Codes
 *
 * Standard claim status codes used in healthcare revenue cycle management.
 * Based on ASC X12 276/277 transaction set specifications.
 */
export const CLAIM_STATUS_CODES: Record<string, string> = {
  // Category codes
  A0: 'Forwarded to entity',
  A1: 'Forwarded to entity with time limit',
  A2: 'Forwarded to entity with time limit expired',
  A3: 'Acknowledgment - Claim received',
  A4: 'Acknowledgment - Forwarded to entity',
  A5: 'Receipt acknowledged, claim pending',

  // Pending codes
  P0: 'Pending - Cannot determine',
  P1: 'Pending - In process',
  P2: 'Pending - Pended for review',
  P3: 'Pending - In adjudication',
  P4: 'Pending - Waiting for information from provider',
  P5: 'Pending - Waiting for information from patient',

  // Finalized - Payment codes
  F0: 'Finalized - Payment',
  F1: 'Finalized - Payment - Approved',
  F2: 'Finalized - Payment - Partial',
  F3: 'Finalized - Payment - Zero',
  F4: 'Finalized - Payment - Denied',

  // Finalized - Denial codes
  F5: 'Finalized - Denial',
  F6: 'Finalized - Denial - Medical necessity',
  F7: 'Finalized - Denial - Not covered',
  F8: 'Finalized - Denial - Duplicate',
  F9: 'Finalized - Denial - Timely filing',

  // Request codes
  R0: 'Request for additional information',
  R1: 'Request for medical records',
  R2: 'Request for documentation',
  R3: 'Request for clarification',
  R4: 'Request for itemized bill',

  // Error codes
  E0: 'Error - Cannot process',
  E1: 'Error - Invalid data',
  E2: 'Error - Missing required data',
  E3: 'Error - Duplicate submission',

  // Rejection codes
  RJ: 'Rejected',
  R5: 'Rejected - Missing information',
  R6: 'Rejected - Invalid format',
  R7: 'Rejected - Invalid payer',
  R8: 'Rejected - Invalid provider',
  R9: 'Rejected - Invalid patient',
};

/**
 * EDI Transaction Acknowledgment Codes (997/999)
 */
export const EDI_ACK_CODES: Record<string, string> = {
  // Functional Acknowledgment codes (AK9)
  A: 'Accepted',
  E: 'Accepted, but errors were noted',
  M: 'Rejected, message authentication code (MAC) failed',
  P: 'Partially accepted',
  R: 'Rejected',
  W: 'Rejected, assurance failed validity tests',
  X: 'Rejected, content after decryption could not be analyzed',

  // Segment Error codes
  1: 'Unrecognized segment ID',
  2: 'Unexpected segment',
  3: 'Required segment missing',
  4: 'Loop occurs over maximum times',
  5: 'Segment exceeds maximum use',
  6: 'Segment not in defined transaction set',
  7: 'Segment not in proper sequence',
  8: 'Segment has data element errors',

  // Element Error codes
  I1: 'Invalid element - too long',
  I2: 'Invalid element - too short',
  I3: 'Invalid element - invalid date',
  I4: 'Invalid element - invalid time',
  I5: 'Invalid element - exclusion violated',
  I6: 'Invalid element - required, not used',
  I7: 'Invalid element - invalid code value',
  I8: 'Invalid element - invalid date format',
  I9: 'Invalid element - invalid time format',
  I10: 'Invalid element - invalid character',
  I11: 'Invalid element - too many repetitions',
  I12: 'Invalid element - too many components',
  I13: 'Invalid element - required, not present',
};

/**
 * Eligibility Status Codes (271)
 */
export const ELIGIBILITY_STATUS_CODES: Record<string, string> = {
  1: 'Active coverage',
  2: 'Active - Full risk capitation',
  3: 'Active - Services capitated',
  4: 'Active - Services capitated to primary care provider',
  5: 'Active - Pending investigation',
  6: 'Inactive',
  7: 'Inactive - Pending eligibility update',
  8: 'Inactive - Pending investigation',
  A: 'Co-insurance',
  B: 'Co-payment',
  C: 'Deductible',
  CB: 'Coverage basis',
  D: 'Benefit description',
  E: 'Exclusions',
  F: 'Limitations',
  G: 'Out of pocket',
  H: 'Unlimited',
  I: 'Non-covered',
  J: 'Cost containment',
  K: 'Reserve',
  L: 'Primary care provider',
  M: 'Pre-existing condition',
  MC: 'Managed care coordinator',
  N: 'Services restricted to following provider',
  O: 'Not deemed a medical necessity',
  P: 'Benefit disclaimer',
  Q: 'Second surgical opinion required',
  R: 'Other or additional payor',
  S: 'Prior year history',
  T: 'Card(s) reported lost/stolen',
  U: 'Contact following entity for information',
  V: 'Cannot process',
  W: 'Other source of data',
  X: 'Health care facility',
  Y: 'Spend down',
};

/**
 * Prior Authorization Status Codes
 */
export const PRIOR_AUTH_STATUS_CODES: Record<string, string> = {
  A1: 'Certified in total',
  A2: 'Certified - Partial',
  A3: 'Not certified',
  A4: 'Pended',
  A5: 'Modified',
  A6: 'Contact payer',
  CT: 'Certification type',
  NA: 'No action required',
  ND: 'New request - denied',
  NP: 'New request - pending',
  PA: 'Prior authorization required',
  SC: 'Service certified',
  UR: 'Utilization review required',
};

/**
 * Claim Type Codes
 */
export const CLAIM_TYPE_CODES: Record<string, string> = {
  '837P': 'Professional claim',
  '837I': 'Institutional claim',
  '837D': 'Dental claim',
  '270': 'Eligibility inquiry',
  '271': 'Eligibility response',
  '276': 'Claim status inquiry',
  '277': 'Claim status response',
  '278': 'Health care services review',
  '835': 'Payment/remittance advice',
};

/**
 * Claim Filing Indicator Codes
 */
export const CLAIM_FILING_CODES: Record<string, string> = {
  '09': 'Self-pay',
  '11': 'Other non-federal programs',
  '12': 'Preferred Provider Organization (PPO)',
  '13': 'Point of Service (POS)',
  '14': 'Exclusive Provider Organization (EPO)',
  '15': 'Indemnity insurance',
  '16': 'Health Maintenance Organization (HMO) Medicare Risk',
  '17': 'Dental Maintenance Organization',
  AM: 'Automobile medical',
  BL: 'Blue Cross/Blue Shield',
  CH: 'CHAMPUS',
  CI: 'Commercial insurance',
  DS: 'Disability',
  FI: 'Federal Employees Program',
  HM: 'Health Maintenance Organization (HMO)',
  LM: 'Liability medical',
  MA: 'Medicare Part A',
  MB: 'Medicare Part B',
  MC: 'Medicaid',
  OF: 'Other federal program',
  TV: 'Title V',
  VA: 'Veterans Administration plan',
  WC: 'Workers compensation health claim',
  ZZ: 'Mutually defined',
};

/**
 * Batch Status Codes
 */
export const BATCH_STATUS_CODES: Record<string, string> = {
  SUBMITTED: 'Batch submitted',
  PROCESSING: 'Batch processing',
  COMPLETED: 'Batch completed',
  PARTIAL: 'Batch partially completed',
  FAILED: 'Batch failed',
  CANCELLED: 'Batch cancelled',
  PENDING: 'Batch pending',
  QUEUED: 'Batch queued',
};

/**
 * Workflow Status Codes
 */
export const WORKFLOW_STATUS_CODES: Record<string, string> = {
  NEW: 'New task',
  ASSIGNED: 'Task assigned',
  IN_PROGRESS: 'Task in progress',
  ON_HOLD: 'Task on hold',
  COMPLETED: 'Task completed',
  CANCELLED: 'Task cancelled',
  ESCALATED: 'Task escalated',
  REOPENED: 'Task reopened',
};

export default {
  CLAIM_STATUS_CODES,
  EDI_ACK_CODES,
  ELIGIBILITY_STATUS_CODES,
  PRIOR_AUTH_STATUS_CODES,
  CLAIM_TYPE_CODES,
  CLAIM_FILING_CODES,
  BATCH_STATUS_CODES,
  WORKFLOW_STATUS_CODES,
};
