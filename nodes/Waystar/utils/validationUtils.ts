/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Validation Utilities for Healthcare Data
 *
 * Provides validation functions for healthcare-specific identifiers
 * and data elements used in revenue cycle management.
 */

/**
 * Validate National Provider Identifier (NPI)
 * NPIs are 10-digit numbers that follow the Luhn algorithm
 */
export function validateNPI(npi: string): { valid: boolean; error?: string } {
  // Remove any non-numeric characters
  const cleanNpi = npi.replace(/\D/g, '');

  // Check length
  if (cleanNpi.length !== 10) {
    return { valid: false, error: 'NPI must be exactly 10 digits' };
  }

  // Check if all digits
  if (!/^\d{10}$/.test(cleanNpi)) {
    return { valid: false, error: 'NPI must contain only digits' };
  }

  // NPI prefix for Luhn check
  const prefixedNpi = '80840' + cleanNpi;

  // Apply Luhn algorithm
  let sum = 0;
  let alternate = false;

  for (let i = prefixedNpi.length - 1; i >= 0; i--) {
    let digit = parseInt(prefixedNpi[i], 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid NPI check digit' };
  }

  return { valid: true };
}

/**
 * Validate Tax Identification Number (TIN/EIN)
 * Format: XX-XXXXXXX (9 digits total)
 */
export function validateTaxId(taxId: string): { valid: boolean; error?: string } {
  // Remove any non-numeric characters
  const cleanTaxId = taxId.replace(/\D/g, '');

  if (cleanTaxId.length !== 9) {
    return { valid: false, error: 'Tax ID must be exactly 9 digits' };
  }

  // Check if all digits
  if (!/^\d{9}$/.test(cleanTaxId)) {
    return { valid: false, error: 'Tax ID must contain only digits' };
  }

  // Check for invalid patterns
  if (/^0{9}$/.test(cleanTaxId) || /^9{9}$/.test(cleanTaxId)) {
    return { valid: false, error: 'Invalid Tax ID pattern' };
  }

  return { valid: true };
}

/**
 * Validate ICD-10 diagnosis code format
 */
export function validateICD10(code: string): { valid: boolean; error?: string } {
  // ICD-10 format: A00-Z99.X (letter + 2 digits, optional decimal + 1-4 characters)
  const icd10Pattern = /^[A-TV-Z]\d{2}(\.\d{1,4})?$/i;

  if (!icd10Pattern.test(code)) {
    return { valid: false, error: 'Invalid ICD-10 code format. Expected format: A00 or A00.0000' };
  }

  return { valid: true };
}

/**
 * Validate CPT procedure code format
 */
export function validateCPT(code: string): { valid: boolean; error?: string } {
  // CPT format: 5 digits or 4 digits + letter (for Category II/III)
  const cptPattern = /^(\d{5}|[0-9]{4}[A-Z])$/;

  if (!cptPattern.test(code)) {
    return { valid: false, error: 'Invalid CPT code format. Expected 5 digits' };
  }

  return { valid: true };
}

/**
 * Validate HCPCS code format
 */
export function validateHCPCS(code: string): { valid: boolean; error?: string } {
  // HCPCS format: Letter + 4 digits (A0000-V9999)
  const hcpcsPattern = /^[A-V]\d{4}$/;

  if (!hcpcsPattern.test(code)) {
    return { valid: false, error: 'Invalid HCPCS code format. Expected letter + 4 digits (e.g., A0000)' };
  }

  return { valid: true };
}

/**
 * Validate modifier code format
 */
export function validateModifier(modifier: string): { valid: boolean; error?: string } {
  // Modifiers are 2 characters (digits or letters)
  const modifierPattern = /^[A-Z0-9]{2}$/i;

  if (!modifierPattern.test(modifier)) {
    return { valid: false, error: 'Invalid modifier format. Expected 2 alphanumeric characters' };
  }

  return { valid: true };
}

/**
 * Validate date format (YYYY-MM-DD or CCYYMMDD)
 */
export function validateDate(date: string): { valid: boolean; error?: string; normalized?: string } {
  // Try ISO format first
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (isoPattern.test(date)) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return { valid: false, error: 'Invalid date value' };
    }
    return { valid: true, normalized: date };
  }

  // Try EDI format (CCYYMMDD)
  const ediPattern = /^\d{8}$/;
  if (ediPattern.test(date)) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    const normalized = `${year}-${month}-${day}`;
    const parsed = new Date(normalized);
    if (isNaN(parsed.getTime())) {
      return { valid: false, error: 'Invalid date value' };
    }
    return { valid: true, normalized };
  }

  return { valid: false, error: 'Invalid date format. Expected YYYY-MM-DD or CCYYMMDD' };
}

/**
 * Validate member/subscriber ID
 */
export function validateMemberId(memberId: string): { valid: boolean; error?: string } {
  if (!memberId || memberId.trim().length === 0) {
    return { valid: false, error: 'Member ID is required' };
  }

  if (memberId.length > 80) {
    return { valid: false, error: 'Member ID cannot exceed 80 characters' };
  }

  // Check for common invalid patterns
  if (/^0+$/.test(memberId)) {
    return { valid: false, error: 'Invalid member ID pattern' };
  }

  return { valid: true };
}

/**
 * Validate payer ID
 */
export function validatePayerId(payerId: string): { valid: boolean; error?: string } {
  if (!payerId || payerId.trim().length === 0) {
    return { valid: false, error: 'Payer ID is required' };
  }

  // Payer IDs are typically 5-15 characters
  if (payerId.length < 2 || payerId.length > 15) {
    return { valid: false, error: 'Payer ID should be 2-15 characters' };
  }

  return { valid: true };
}

/**
 * Validate claim amount
 */
export function validateAmount(amount: number | string): { valid: boolean; error?: string; value?: number } {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { valid: false, error: 'Invalid amount format' };
  }

  if (numAmount < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }

  // Round to 2 decimal places
  const rounded = Math.round(numAmount * 100) / 100;

  return { valid: true, value: rounded };
}

/**
 * Validate units/quantity
 */
export function validateUnits(units: number | string): { valid: boolean; error?: string; value?: number } {
  const numUnits = typeof units === 'string' ? parseFloat(units) : units;

  if (isNaN(numUnits)) {
    return { valid: false, error: 'Invalid units format' };
  }

  if (numUnits <= 0) {
    return { valid: false, error: 'Units must be greater than 0' };
  }

  return { valid: true, value: numUnits };
}

/**
 * Validate place of service code
 */
export function validatePlaceOfService(pos: string): { valid: boolean; error?: string } {
  // POS codes are 2 digits
  const posPattern = /^\d{2}$/;

  if (!posPattern.test(pos)) {
    return { valid: false, error: 'Place of service must be 2 digits' };
  }

  const posNum = parseInt(pos, 10);
  const validPosRanges = [
    [1, 34], [41, 42], [49, 62], [65, 65], [71, 72], [81, 81], [99, 99],
  ];

  const isValidPos = validPosRanges.some(([min, max]) => posNum >= min && posNum <= max);

  if (!isValidPos) {
    return { valid: false, error: 'Invalid place of service code' };
  }

  return { valid: true };
}

/**
 * Validate gender code
 */
export function validateGender(gender: string): { valid: boolean; error?: string; normalized?: string } {
  const upperGender = gender.toUpperCase();

  const validCodes: Record<string, string> = {
    M: 'M',
    F: 'F',
    U: 'U',
    MALE: 'M',
    FEMALE: 'F',
    UNKNOWN: 'U',
  };

  if (validCodes[upperGender]) {
    return { valid: true, normalized: validCodes[upperGender] };
  }

  return { valid: false, error: 'Invalid gender. Use M, F, or U' };
}

/**
 * Validate claim data
 */
export interface ClaimValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateClaimData(claim: {
  patientId?: string;
  memberId?: string;
  payerId?: string;
  providerId?: string;
  diagnosisCodes?: string[];
  procedureCodes?: string[];
  serviceDate?: string;
  totalAmount?: number;
  placeOfService?: string;
}): ClaimValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!claim.memberId) {
    errors.push('Member ID is required');
  } else {
    const memberResult = validateMemberId(claim.memberId);
    if (!memberResult.valid) errors.push(memberResult.error!);
  }

  if (!claim.payerId) {
    errors.push('Payer ID is required');
  } else {
    const payerResult = validatePayerId(claim.payerId);
    if (!payerResult.valid) errors.push(payerResult.error!);
  }

  if (claim.providerId) {
    const npiResult = validateNPI(claim.providerId);
    if (!npiResult.valid) errors.push(`Provider NPI: ${npiResult.error}`);
  }

  // Diagnosis codes
  if (claim.diagnosisCodes && claim.diagnosisCodes.length > 0) {
    claim.diagnosisCodes.forEach((code, index) => {
      const result = validateICD10(code);
      if (!result.valid) errors.push(`Diagnosis code ${index + 1}: ${result.error}`);
    });
  } else {
    errors.push('At least one diagnosis code is required');
  }

  // Procedure codes
  if (claim.procedureCodes && claim.procedureCodes.length > 0) {
    claim.procedureCodes.forEach((code, index) => {
      const cptResult = validateCPT(code);
      const hcpcsResult = validateHCPCS(code);
      if (!cptResult.valid && !hcpcsResult.valid) {
        errors.push(`Procedure code ${index + 1}: Invalid CPT or HCPCS format`);
      }
    });
  } else {
    warnings.push('No procedure codes provided');
  }

  // Service date
  if (claim.serviceDate) {
    const dateResult = validateDate(claim.serviceDate);
    if (!dateResult.valid) errors.push(`Service date: ${dateResult.error}`);
  } else {
    errors.push('Service date is required');
  }

  // Amount
  if (claim.totalAmount !== undefined) {
    const amountResult = validateAmount(claim.totalAmount);
    if (!amountResult.valid) errors.push(`Total amount: ${amountResult.error}`);
    if (amountResult.valid && amountResult.value === 0) {
      warnings.push('Total amount is zero');
    }
  }

  // Place of service
  if (claim.placeOfService) {
    const posResult = validatePlaceOfService(claim.placeOfService);
    if (!posResult.valid) errors.push(`Place of service: ${posResult.error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export default {
  validateNPI,
  validateTaxId,
  validateICD10,
  validateCPT,
  validateHCPCS,
  validateModifier,
  validateDate,
  validateMemberId,
  validatePayerId,
  validateAmount,
  validateUnits,
  validatePlaceOfService,
  validateGender,
  validateClaimData,
};
