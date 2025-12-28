/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * EDI Parser for Healthcare Transactions
 *
 * Handles parsing and generation of X12 EDI transactions including:
 * - 270/271 (Eligibility)
 * - 276/277 (Claim Status)
 * - 835 (Remittance Advice / ERA)
 * - 837 P/I/D (Claims)
 * - 997/999 (Acknowledgments)
 */

export interface EDISegment {
  id: string;
  elements: string[];
}

export interface Eligibility271Response {
  subscriber: {
    memberId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
  };
  payer: {
    payerId: string;
    payerName: string;
  };
  provider?: {
    npi: string;
    name: string;
  };
  coverage: {
    active: boolean;
    effectiveDate?: string;
    terminationDate?: string;
    planName?: string;
    groupNumber?: string;
    insuranceType?: string;
  };
  benefits: EligibilityBenefit[];
  errors?: string[];
}

export interface EligibilityBenefit {
  type: string;
  code: string;
  description: string;
  coverageLevel?: string;
  timePeriod?: string;
  amount?: number;
  percent?: number;
  quantity?: number;
  inNetwork?: boolean;
  authRequired?: boolean;
  serviceType?: string;
}

export interface ERA835Response {
  checkNumber: string;
  checkDate: string;
  paymentAmount: number;
  payerName: string;
  payerId: string;
  payeeName: string;
  payeeNpi: string;
  claims: ERA835Claim[];
}

export interface ERA835Claim {
  claimNumber: string;
  patientControlNumber: string;
  patientName: string;
  patientId: string;
  chargeAmount: number;
  paidAmount: number;
  patientResponsibility: number;
  serviceLines: ERA835ServiceLine[];
  adjustments: ERA835Adjustment[];
}

export interface ERA835ServiceLine {
  lineNumber: number;
  procedureCode: string;
  modifiers?: string[];
  chargeAmount: number;
  paidAmount: number;
  units: number;
  serviceDate: string;
  adjustments: ERA835Adjustment[];
  remarkCodes?: string[];
}

export interface ERA835Adjustment {
  groupCode: string;
  reasonCode: string;
  amount: number;
  quantity?: number;
}

export interface ClaimStatus277Response {
  claimNumber: string;
  patientControlNumber: string;
  statusCategoryCode: string;
  statusCategoryDescription: string;
  statusCode: string;
  statusDescription: string;
  effectiveDate: string;
  payerClaimNumber?: string;
  totalChargeAmount?: number;
  totalPaidAmount?: number;
}

export interface EDIAcknowledgment {
  transactionType: string;
  accepted: boolean;
  controlNumber: string;
  errors: EDIError[];
}

export interface EDIError {
  segmentId: string;
  elementPosition?: number;
  errorCode: string;
  errorDescription: string;
}

/**
 * EDI Parser class
 */
export class EDIParser {
  private segmentDelimiter = '~';
  private elementDelimiter = '*';
  private subElementDelimiter = ':';

  /**
   * Parse raw EDI content into segments
   */
  parseRaw(ediContent: string): EDISegment[] {
    const normalized = ediContent.replace(/\r\n/g, '').replace(/\n/g, '').trim();

    if (normalized.startsWith('ISA')) {
      this.elementDelimiter = normalized[3];
      this.subElementDelimiter = normalized[104] || ':';
      this.segmentDelimiter = normalized[105] || '~';
    }

    const rawSegments = normalized.split(this.segmentDelimiter).filter((s) => s.length > 0);

    return rawSegments.map((segment) => {
      const elements = segment.split(this.elementDelimiter);
      return { id: elements[0], elements: elements.slice(1) };
    });
  }

  /**
   * Parse 271 Eligibility Response
   */
  parse271(ediContent: string): Eligibility271Response {
    const segments = this.parseRaw(ediContent);
    const response: Eligibility271Response = {
      subscriber: { memberId: '', firstName: '', lastName: '', dateOfBirth: '', gender: '' },
      payer: { payerId: '', payerName: '' },
      coverage: { active: false },
      benefits: [],
    };

    let currentBenefit: Partial<EligibilityBenefit> = {};

    for (const segment of segments) {
      switch (segment.id) {
        case 'NM1': {
          const entityCode = segment.elements[0];
          if (entityCode === 'IL') {
            response.subscriber.lastName = segment.elements[2] || '';
            response.subscriber.firstName = segment.elements[3] || '';
            response.subscriber.memberId = segment.elements[8] || '';
          } else if (entityCode === 'PR') {
            response.payer.payerName = segment.elements[2] || '';
            response.payer.payerId = segment.elements[8] || '';
          } else if (entityCode === '1P' || entityCode === 'P3') {
            response.provider = { name: segment.elements[2] || '', npi: segment.elements[8] || '' };
          }
          break;
        }
        case 'DMG':
          response.subscriber.dateOfBirth = this.parseDate(segment.elements[1] || '');
          response.subscriber.gender = segment.elements[2] || '';
          break;
        case 'DTP': {
          const dateQualifier = segment.elements[0];
          const dateValue = segment.elements[2] || '';
          if (dateQualifier === '346') response.coverage.effectiveDate = this.parseDate(dateValue);
          else if (dateQualifier === '347') response.coverage.terminationDate = this.parseDate(dateValue);
          break;
        }
        case 'EB': {
          if (Object.keys(currentBenefit).length > 0) {
            response.benefits.push(currentBenefit as EligibilityBenefit);
          }
          const statusCode = segment.elements[0] || '';
          currentBenefit = {
            type: this.getEligibilityStatusDescription(statusCode),
            code: statusCode,
            description: '',
            coverageLevel: segment.elements[1] || '',
            serviceType: segment.elements[2] || '',
          };
          if (['1', '6'].includes(statusCode)) response.coverage.active = true;
          if (segment.elements[3]) response.coverage.insuranceType = segment.elements[3];
          if (segment.elements[4]) response.coverage.planName = segment.elements[4];
          if (segment.elements[5]) currentBenefit.timePeriod = segment.elements[5];
          if (segment.elements[6]) currentBenefit.amount = parseFloat(segment.elements[6]);
          if (segment.elements[7]) currentBenefit.percent = parseFloat(segment.elements[7]);
          if (segment.elements[8]) currentBenefit.quantity = parseFloat(segment.elements[8]);
          if (segment.elements[10] === 'Y') currentBenefit.authRequired = true;
          if (segment.elements[11]) currentBenefit.inNetwork = segment.elements[11] === 'Y';
          break;
        }
        case 'MSG':
          if (currentBenefit) {
            currentBenefit.description = (currentBenefit.description || '') + segment.elements[0];
          }
          break;
        case 'INS':
          if (segment.elements[3]) response.coverage.groupNumber = segment.elements[3];
          break;
        case 'AAA':
          if (!response.errors) response.errors = [];
          response.errors.push(`${segment.elements[0]}: ${segment.elements[2]} - ${segment.elements[3]}`);
          break;
      }
    }

    if (Object.keys(currentBenefit).length > 0) {
      response.benefits.push(currentBenefit as EligibilityBenefit);
    }

    return response;
  }

  /**
   * Parse 835 ERA (Electronic Remittance Advice)
   */
  parse835(ediContent: string): ERA835Response {
    const segments = this.parseRaw(ediContent);
    const response: ERA835Response = {
      checkNumber: '',
      checkDate: '',
      paymentAmount: 0,
      payerName: '',
      payerId: '',
      payeeName: '',
      payeeNpi: '',
      claims: [],
    };

    let currentClaim: Partial<ERA835Claim> | null = null;
    let currentServiceLine: Partial<ERA835ServiceLine> | null = null;

    for (const segment of segments) {
      switch (segment.id) {
        case 'BPR':
          response.paymentAmount = parseFloat(segment.elements[1] || '0');
          response.checkDate = this.parseDate(segment.elements[15] || '');
          break;
        case 'TRN':
          response.checkNumber = segment.elements[1] || '';
          break;
        case 'N1': {
          const entityIdCode = segment.elements[0];
          if (entityIdCode === 'PR') {
            response.payerName = segment.elements[1] || '';
            response.payerId = segment.elements[3] || '';
          } else if (entityIdCode === 'PE') {
            response.payeeName = segment.elements[1] || '';
            response.payeeNpi = segment.elements[3] || '';
          }
          break;
        }
        case 'CLP':
          if (currentClaim && currentClaim.claimNumber) {
            response.claims.push(currentClaim as ERA835Claim);
          }
          currentClaim = {
            patientControlNumber: segment.elements[0] || '',
            claimNumber: segment.elements[6] || '',
            chargeAmount: parseFloat(segment.elements[2] || '0'),
            paidAmount: parseFloat(segment.elements[3] || '0'),
            patientResponsibility: parseFloat(segment.elements[4] || '0'),
            patientName: '',
            patientId: '',
            serviceLines: [],
            adjustments: [],
          };
          currentServiceLine = null;
          break;
        case 'NM1':
          if (currentClaim && segment.elements[0] === 'QC') {
            currentClaim.patientName = `${segment.elements[3] || ''} ${segment.elements[2] || ''}`.trim();
            currentClaim.patientId = segment.elements[8] || '';
          }
          break;
        case 'CAS': {
          const adjustment: ERA835Adjustment = {
            groupCode: segment.elements[0] || '',
            reasonCode: segment.elements[1] || '',
            amount: parseFloat(segment.elements[2] || '0'),
            quantity: segment.elements[3] ? parseFloat(segment.elements[3]) : undefined,
          };
          if (currentServiceLine) {
            currentServiceLine.adjustments = currentServiceLine.adjustments || [];
            currentServiceLine.adjustments.push(adjustment);
          } else if (currentClaim) {
            currentClaim.adjustments = currentClaim.adjustments || [];
            currentClaim.adjustments.push(adjustment);
          }
          break;
        }
        case 'SVC': {
          if (currentServiceLine && currentClaim) {
            currentClaim.serviceLines = currentClaim.serviceLines || [];
            currentClaim.serviceLines.push(currentServiceLine as ERA835ServiceLine);
          }
          const procedureInfo = (segment.elements[0] || '').split(this.subElementDelimiter);
          currentServiceLine = {
            lineNumber: (currentClaim?.serviceLines?.length || 0) + 1,
            procedureCode: procedureInfo[1] || '',
            modifiers: procedureInfo.slice(2).filter((m) => m),
            chargeAmount: parseFloat(segment.elements[1] || '0'),
            paidAmount: parseFloat(segment.elements[2] || '0'),
            units: parseFloat(segment.elements[4] || '1'),
            serviceDate: '',
            adjustments: [],
          };
          break;
        }
        case 'DTM':
          if (currentServiceLine && segment.elements[0] === '472') {
            currentServiceLine.serviceDate = this.parseDate(segment.elements[1] || '');
          }
          break;
        case 'LQ':
          if (currentServiceLine && segment.elements[0] === 'HE') {
            currentServiceLine.remarkCodes = currentServiceLine.remarkCodes || [];
            currentServiceLine.remarkCodes.push(segment.elements[1] || '');
          }
          break;
      }
    }

    if (currentServiceLine && currentClaim) {
      currentClaim.serviceLines = currentClaim.serviceLines || [];
      currentClaim.serviceLines.push(currentServiceLine as ERA835ServiceLine);
    }
    if (currentClaim && currentClaim.claimNumber) {
      response.claims.push(currentClaim as ERA835Claim);
    }

    return response;
  }

  /**
   * Parse 277 Claim Status Response
   */
  parse277(ediContent: string): ClaimStatus277Response[] {
    const segments = this.parseRaw(ediContent);
    const responses: ClaimStatus277Response[] = [];
    let currentResponse: Partial<ClaimStatus277Response> = {};

    for (const segment of segments) {
      switch (segment.id) {
        case 'TRN':
          if (Object.keys(currentResponse).length > 0) {
            responses.push(currentResponse as ClaimStatus277Response);
          }
          currentResponse = { claimNumber: segment.elements[1] || '' };
          break;
        case 'STC': {
          const statusInfo = (segment.elements[0] || '').split(this.subElementDelimiter);
          currentResponse.statusCategoryCode = statusInfo[0] || '';
          currentResponse.statusCode = statusInfo[1] || '';
          currentResponse.statusCategoryDescription = this.getStatusCategoryDescription(currentResponse.statusCategoryCode);
          currentResponse.statusDescription = this.getStatusDescription(currentResponse.statusCode);
          currentResponse.effectiveDate = this.parseDate(segment.elements[1] || '');
          if (segment.elements[3]) currentResponse.totalChargeAmount = parseFloat(segment.elements[3]);
          if (segment.elements[4]) currentResponse.totalPaidAmount = parseFloat(segment.elements[4]);
          break;
        }
        case 'REF':
          if (segment.elements[0] === '1K') currentResponse.payerClaimNumber = segment.elements[1] || '';
          else if (segment.elements[0] === 'D9') currentResponse.patientControlNumber = segment.elements[1] || '';
          break;
      }
    }

    if (Object.keys(currentResponse).length > 0) {
      responses.push(currentResponse as ClaimStatus277Response);
    }

    return responses;
  }

  /**
   * Parse 997/999 Acknowledgment
   */
  parseAcknowledgment(ediContent: string): EDIAcknowledgment {
    const segments = this.parseRaw(ediContent);
    const response: EDIAcknowledgment = {
      transactionType: '',
      accepted: true,
      controlNumber: '',
      errors: [],
    };

    for (const segment of segments) {
      switch (segment.id) {
        case 'AK1':
          response.transactionType = segment.elements[0] || '';
          response.controlNumber = segment.elements[1] || '';
          break;
        case 'AK9': {
          const ackCode = segment.elements[0];
          response.accepted = ackCode === 'A' || ackCode === 'E';
          break;
        }
        case 'AK3':
        case 'AK4':
          response.errors.push({
            segmentId: segment.elements[0] || '',
            elementPosition: segment.elements[1] ? parseInt(segment.elements[1]) : undefined,
            errorCode: segment.elements[2] || '',
            errorDescription: this.getAckErrorDescription(segment.elements[2] || ''),
          });
          break;
        case 'IK3':
        case 'IK4':
          response.errors.push({
            segmentId: segment.elements[0] || '',
            elementPosition: segment.elements[1] ? parseInt(segment.elements[1]) : undefined,
            errorCode: segment.elements[3] || '',
            errorDescription: this.getAckErrorDescription(segment.elements[3] || ''),
          });
          break;
      }
    }

    return response;
  }

  private parseDate(ediDate: string): string {
    if (!ediDate || ediDate.length < 8) return '';
    return `${ediDate.substring(0, 4)}-${ediDate.substring(4, 6)}-${ediDate.substring(6, 8)}`;
  }

  private getEligibilityStatusDescription(code: string): string {
    const descriptions: Record<string, string> = {
      '1': 'Active Coverage', '2': 'Active - Full Risk Capitation', '3': 'Active - Services Capitated',
      '6': 'Inactive', A: 'Co-Insurance', B: 'Co-Payment', C: 'Deductible', D: 'Benefit Description',
      E: 'Exclusions', F: 'Limitations', G: 'Out of Pocket', H: 'Unlimited', I: 'Non-Covered',
      L: 'Primary Care Provider', M: 'Pre-Existing Condition', R: 'Other or Additional Payor',
    };
    return descriptions[code] || `Unknown (${code})`;
  }

  private getStatusCategoryDescription(code: string): string {
    const descriptions: Record<string, string> = {
      A0: 'Forwarded', A1: 'Forwarded - Time Limit', A3: 'Acknowledgment - Received',
      P0: 'Pending - Cannot Determine', P1: 'Pending - In Process', P2: 'Pending - Review',
      P3: 'Pending - Adjudication', F0: 'Finalized', F1: 'Finalized - Payment',
      F2: 'Finalized - Partial Payment', F3: 'Finalized - Zero Payment', F4: 'Finalized - Denied',
      R0: 'Request for Information', RJ: 'Rejected', E0: 'Error',
    };
    return descriptions[code] || `Unknown (${code})`;
  }

  private getStatusDescription(code: string): string {
    return code || 'No status code provided';
  }

  private getAckErrorDescription(code: string): string {
    const descriptions: Record<string, string> = {
      '1': 'Unrecognized segment ID', '2': 'Unexpected segment', '3': 'Required segment missing',
      '4': 'Loop occurs over maximum times', '5': 'Segment exceeds maximum use',
      '6': 'Segment not in defined transaction set', '7': 'Segment not in proper sequence',
      '8': 'Segment has data element errors',
    };
    return descriptions[code] || `Error code: ${code}`;
  }
}

export const ediParser = new EDIParser();
export default EDIParser;
