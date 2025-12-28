/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
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
} from '../../nodes/Waystar/utils/validationUtils';

describe('Validation Utilities', () => {
  describe('validateNPI', () => {
    it('should validate a correct NPI', () => {
      // Using a known valid NPI pattern
      const result = validateNPI('1234567893');
      expect(result.valid).toBe(true);
    });

    it('should reject NPI with incorrect length', () => {
      const result = validateNPI('123456789');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 digits');
    });

    it('should reject NPI with non-numeric characters', () => {
      const result = validateNPI('123456789A');
      expect(result.valid).toBe(false);
    });

    it('should handle NPI with formatting', () => {
      const result = validateNPI('123-456-7893');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTaxId', () => {
    it('should validate a correct Tax ID', () => {
      const result = validateTaxId('123456789');
      expect(result.valid).toBe(true);
    });

    it('should reject Tax ID with incorrect length', () => {
      const result = validateTaxId('12345678');
      expect(result.valid).toBe(false);
    });

    it('should handle Tax ID with dashes', () => {
      const result = validateTaxId('12-3456789');
      expect(result.valid).toBe(true);
    });

    it('should reject all zeros', () => {
      const result = validateTaxId('000000000');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateICD10', () => {
    it('should validate correct ICD-10 codes', () => {
      expect(validateICD10('A00').valid).toBe(true);
      expect(validateICD10('J06.9').valid).toBe(true);
      expect(validateICD10('Z99.89').valid).toBe(true);
    });

    it('should reject invalid ICD-10 codes', () => {
      expect(validateICD10('123').valid).toBe(false);
      expect(validateICD10('AA0').valid).toBe(false);
      expect(validateICD10('A0').valid).toBe(false);
    });
  });

  describe('validateCPT', () => {
    it('should validate correct CPT codes', () => {
      expect(validateCPT('99213').valid).toBe(true);
      expect(validateCPT('00100').valid).toBe(true);
    });

    it('should reject invalid CPT codes', () => {
      expect(validateCPT('9921').valid).toBe(false);
      expect(validateCPT('992134').valid).toBe(false);
    });
  });

  describe('validateHCPCS', () => {
    it('should validate correct HCPCS codes', () => {
      expect(validateHCPCS('A0000').valid).toBe(true);
      expect(validateHCPCS('J1234').valid).toBe(true);
    });

    it('should reject invalid HCPCS codes', () => {
      expect(validateHCPCS('12345').valid).toBe(false);
      expect(validateHCPCS('X1234').valid).toBe(false);
    });
  });

  describe('validateModifier', () => {
    it('should validate correct modifiers', () => {
      expect(validateModifier('25').valid).toBe(true);
      expect(validateModifier('TC').valid).toBe(true);
      expect(validateModifier('59').valid).toBe(true);
    });

    it('should reject invalid modifiers', () => {
      expect(validateModifier('A').valid).toBe(false);
      expect(validateModifier('ABC').valid).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('should validate ISO format dates', () => {
      const result = validateDate('2024-01-15');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('2024-01-15');
    });

    it('should validate EDI format dates', () => {
      const result = validateDate('20240115');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('2024-01-15');
    });

    it('should reject invalid dates', () => {
      expect(validateDate('2024-13-01').valid).toBe(false);
      expect(validateDate('invalid').valid).toBe(false);
    });
  });

  describe('validateMemberId', () => {
    it('should validate correct member IDs', () => {
      expect(validateMemberId('ABC123456789').valid).toBe(true);
      expect(validateMemberId('MBR-98765').valid).toBe(true);
    });

    it('should reject empty member IDs', () => {
      expect(validateMemberId('').valid).toBe(false);
      expect(validateMemberId('   ').valid).toBe(false);
    });

    it('should reject all zeros', () => {
      expect(validateMemberId('0000000').valid).toBe(false);
    });
  });

  describe('validatePayerId', () => {
    it('should validate correct payer IDs', () => {
      expect(validatePayerId('BCBS1').valid).toBe(true);
      expect(validatePayerId('62308').valid).toBe(true);
    });

    it('should reject empty payer IDs', () => {
      expect(validatePayerId('').valid).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      const result = validateAmount(100.50);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(100.50);
    });

    it('should round to 2 decimal places', () => {
      const result = validateAmount(100.555);
      expect(result.value).toBe(100.56);
    });

    it('should reject negative amounts', () => {
      expect(validateAmount(-100).valid).toBe(false);
    });

    it('should handle string amounts', () => {
      const result = validateAmount('150.75');
      expect(result.valid).toBe(true);
      expect(result.value).toBe(150.75);
    });
  });

  describe('validateUnits', () => {
    it('should validate positive units', () => {
      expect(validateUnits(1).valid).toBe(true);
      expect(validateUnits(100).valid).toBe(true);
    });

    it('should reject zero or negative units', () => {
      expect(validateUnits(0).valid).toBe(false);
      expect(validateUnits(-1).valid).toBe(false);
    });
  });

  describe('validatePlaceOfService', () => {
    it('should validate correct POS codes', () => {
      expect(validatePlaceOfService('11').valid).toBe(true);
      expect(validatePlaceOfService('21').valid).toBe(true);
      expect(validatePlaceOfService('23').valid).toBe(true);
    });

    it('should reject invalid POS codes', () => {
      expect(validatePlaceOfService('1').valid).toBe(false);
      expect(validatePlaceOfService('123').valid).toBe(false);
      expect(validatePlaceOfService('98').valid).toBe(false);
    });
  });

  describe('validateGender', () => {
    it('should validate and normalize gender codes', () => {
      expect(validateGender('M').normalized).toBe('M');
      expect(validateGender('F').normalized).toBe('F');
      expect(validateGender('male').normalized).toBe('M');
      expect(validateGender('female').normalized).toBe('F');
    });

    it('should reject invalid gender codes', () => {
      expect(validateGender('X').valid).toBe(false);
      expect(validateGender('other').valid).toBe(false);
    });
  });
});
