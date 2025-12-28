/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * HIPAA Compliance Utilities
 *
 * Functions to help maintain HIPAA compliance when handling
 * Protected Health Information (PHI) in healthcare workflows.
 */

/**
 * PHI field identifiers - fields that contain Protected Health Information
 */
export const PHI_FIELDS = [
  'patientName',
  'firstName',
  'lastName',
  'middleName',
  'dateOfBirth',
  'dob',
  'birthDate',
  'ssn',
  'socialSecurityNumber',
  'memberId',
  'subscriberId',
  'patientId',
  'mrn',
  'medicalRecordNumber',
  'address',
  'streetAddress',
  'city',
  'state',
  'zipCode',
  'zip',
  'postalCode',
  'phone',
  'phoneNumber',
  'telephone',
  'fax',
  'faxNumber',
  'email',
  'emailAddress',
  'accountNumber',
  'claimNumber',
  'authorizationNumber',
  'priorAuthNumber',
  'benefitPlanId',
  'ipAddress',
  'deviceId',
  'biometricId',
  'photoId',
  'diagnosis',
  'diagnosisCode',
  'procedure',
  'procedureCode',
  'medication',
  'prescription',
];

/**
 * Mask sensitive data for logging
 */
export function maskPHI(value: string, visibleChars = 4): string {
  if (!value || value.length <= visibleChars) {
    return '*'.repeat(value?.length || 0);
  }

  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}

/**
 * Check if a field name likely contains PHI
 */
export function isPHIField(fieldName: string): boolean {
  const lowerField = fieldName.toLowerCase();
  return PHI_FIELDS.some((phi) => lowerField.includes(phi.toLowerCase()));
}

/**
 * Sanitize an object for logging by masking PHI fields
 */
export function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeForLogging(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'object' ? sanitizeForLogging(item as Record<string, unknown>) : item,
      );
    } else if (typeof value === 'string' && isPHIField(key)) {
      sanitized[key] = maskPHI(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Generate a de-identified patient token for tracking without PHI
 */
export function generatePatientToken(
  memberId: string,
  dateOfBirth: string,
  salt?: string,
): string {
  // Simple hash-like token (not cryptographic, for tracking only)
  const input = `${memberId}:${dateOfBirth}:${salt || 'waystar'}`;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `PT${Math.abs(hash).toString(36).toUpperCase()}`;
}

/**
 * Extract only non-PHI fields from an object
 */
export function extractNonPHI(obj: Record<string, unknown>): Record<string, unknown> {
  const nonPhi: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!isPHIField(key)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        nonPhi[key] = extractNonPHI(value as Record<string, unknown>);
      } else {
        nonPhi[key] = value;
      }
    }
  }

  return nonPhi;
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId?: string;
  resourceType: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry for HIPAA compliance
 */
export function createAuditLog(
  action: string,
  resourceType: string,
  resourceId: string,
  outcome: 'success' | 'failure',
  options?: {
    userId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  },
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    resourceType,
    resourceId: maskPHI(resourceId, 4),
    outcome,
    userId: options?.userId,
    details: options?.details,
    ipAddress: options?.ipAddress ? maskPHI(options.ipAddress, 3) : undefined,
    userAgent: options?.userAgent,
  };
}

/**
 * HIPAA-compliant date formatting
 * Removes day for de-identification when needed
 */
export function deidentifyDate(date: string, removeDay = false): string {
  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return date;
  }

  if (removeDay) {
    // Return only year and month
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  }

  return parsed.toISOString().split('T')[0];
}

/**
 * Check if a date falls within the HIPAA safe harbor for age
 * (Dates for individuals 89 or older must be aggregated to a single category)
 */
export function isOver89(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 89;
}

/**
 * Minimum necessary standard - filter object to only required fields
 */
export function applyMinimumNecessary<T extends Record<string, unknown>>(
  data: T,
  requiredFields: string[],
): Partial<T> {
  const filtered: Partial<T> = {};

  for (const field of requiredFields) {
    if (field in data) {
      filtered[field as keyof T] = data[field as keyof T];
    }
  }

  return filtered;
}

/**
 * Validate that required disclosures are properly documented
 */
export interface DisclosureRecord {
  patientId: string;
  disclosureDate: string;
  recipientName: string;
  recipientType: string;
  purpose: string;
  dataDisclosed: string[];
  authorizationReference?: string;
}

export function validateDisclosureRecord(record: Partial<DisclosureRecord>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!record.patientId) errors.push('Patient ID is required');
  if (!record.disclosureDate) errors.push('Disclosure date is required');
  if (!record.recipientName) errors.push('Recipient name is required');
  if (!record.recipientType) errors.push('Recipient type is required');
  if (!record.purpose) errors.push('Purpose is required');
  if (!record.dataDisclosed || record.dataDisclosed.length === 0) {
    errors.push('Data disclosed must be specified');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Security reminder messages
 */
export const SECURITY_REMINDERS = {
  PHI_ACCESS: 'Accessing PHI - ensure proper authorization',
  PHI_TRANSMISSION: 'Transmitting PHI - verify encryption is enabled',
  PHI_STORAGE: 'Storing PHI - ensure secure storage location',
  MINIMUM_NECESSARY: 'Apply minimum necessary standard',
  AUDIT_REQUIRED: 'This action requires audit logging',
  AUTHORIZATION_CHECK: 'Verify patient authorization before proceeding',
};

export default {
  PHI_FIELDS,
  maskPHI,
  isPHIField,
  sanitizeForLogging,
  generatePatientToken,
  extractNonPHI,
  createAuditLog,
  deidentifyDate,
  isOver89,
  applyMinimumNecessary,
  validateDisclosureRecord,
  SECURITY_REMINDERS,
};
