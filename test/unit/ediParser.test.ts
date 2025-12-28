/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { EDIParser } from '../../nodes/Waystar/transport/ediParser';

describe('EDI Parser', () => {
  let parser: EDIParser;

  beforeEach(() => {
    parser = new EDIParser();
  });

  describe('parseRaw', () => {
    it('should parse raw EDI into segments', () => {
      const edi = 'ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HB*SENDER*RECEIVER*20231201*1200*1*X*005010X279A1~ST*271*0001~SE*2*0001~GE*1*1~IEA*1*000000001~';
      const segments = parser.parseRaw(edi);

      expect(segments.length).toBeGreaterThan(0);
      expect(segments[0].id).toBe('ISA');
      expect(segments[1].id).toBe('GS');
    });

    it('should detect delimiters from ISA segment', () => {
      const edi = 'ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~';
      const segments = parser.parseRaw(edi);

      expect(segments[0].elements[0]).toBe('00');
    });
  });

  describe('parse271', () => {
    it('should parse 271 eligibility response', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HB*SENDER*RECEIVER*20231201*1200*1*X*005010X279A1~ST*271*0001~BHT*0022*11*TN12345*20231201*1200~HL*1**20*1~NM1*PR*2*BLUE CROSS*****PI*12345~HL*2*1*21*1~NM1*IL*1*DOE*JOHN****MI*MBR123456~DMG*D8*19800115*M~EB*1*IND*30**STANDARD PLAN~DTP*346*D8*20230101~SE*10*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse271(edi);

      expect(result.subscriber.lastName).toBe('DOE');
      expect(result.subscriber.firstName).toBe('JOHN');
      expect(result.subscriber.memberId).toBe('MBR123456');
      expect(result.payer.payerName).toBe('BLUE CROSS');
      expect(result.coverage.active).toBe(true);
    });

    it('should parse benefits from 271', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HB*SENDER*RECEIVER*20231201*1200*1*X*005010X279A1~ST*271*0001~NM1*IL*1*DOE*JOHN****MI*MBR123456~EB*C*IND*30***23*500~EB*B*IND*30***23*25~SE*5*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse271(edi);

      expect(result.benefits.length).toBeGreaterThan(0);
      const deductible = result.benefits.find(b => b.code === 'C');
      expect(deductible).toBeDefined();
      expect(deductible?.amount).toBe(500);
    });

    it('should handle inactive coverage', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HB*SENDER*RECEIVER*20231201*1200*1*X*005010X279A1~ST*271*0001~NM1*IL*1*DOE*JOHN****MI*MBR123456~EB*6*IND*30~SE*4*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse271(edi);

      expect(result.coverage.active).toBe(false);
    });
  });

  describe('parse835', () => {
    it('should parse 835 ERA response', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HP*SENDER*RECEIVER*20231201*1200*1*X*005010X221A1~ST*835*0001~BPR*I*1500.00*C*ACH*CTX*01*999999999*DA*123456789********20231201~TRN*1*CHK123456~N1*PR*BLUE CROSS****PI*12345~N1*PE*ACME MEDICAL****XX*1234567890~CLP*PCN001*1*1000*800**12*CLAIM001~NM1*QC*1*DOE*JOHN~SVC*HC:99213*150*120*UN*1~CAS*CO*45*30~SE*12*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse835(edi);

      expect(result.checkNumber).toBe('CHK123456');
      expect(result.paymentAmount).toBe(1500.00);
      expect(result.payerName).toBe('BLUE CROSS');
      expect(result.claims.length).toBeGreaterThan(0);
      expect(result.claims[0].patientControlNumber).toBe('PCN001');
    });

    it('should parse service lines from 835', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HP*SENDER*RECEIVER*20231201*1200*1*X*005010X221A1~ST*835*0001~BPR*I*500*C*CHK~TRN*1*CHK999~CLP*PCN002*1*500*400~SVC*HC:99213*150*120*UN*1~CAS*CO*45*30~SVC*HC:36415*50*40*UN*1~SE*9*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse835(edi);

      expect(result.claims[0].serviceLines.length).toBe(2);
      expect(result.claims[0].serviceLines[0].procedureCode).toBe('99213');
      expect(result.claims[0].serviceLines[0].chargeAmount).toBe(150);
      expect(result.claims[0].serviceLines[0].paidAmount).toBe(120);
    });

    it('should parse adjustments from 835', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HP*SENDER*RECEIVER*20231201*1200*1*X*005010X221A1~ST*835*0001~BPR*I*100*C*CHK~TRN*1*CHK888~CLP*PCN003*1*200*100~SVC*HC:99214*200*100*UN*1~CAS*CO*45*50~CAS*PR*1*50~SE*8*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse835(edi);

      const serviceLine = result.claims[0].serviceLines[0];
      expect(serviceLine.adjustments.length).toBe(2);
      expect(serviceLine.adjustments[0].groupCode).toBe('CO');
      expect(serviceLine.adjustments[0].reasonCode).toBe('45');
      expect(serviceLine.adjustments[0].amount).toBe(50);
    });
  });

  describe('parse277', () => {
    it('should parse 277 claim status response', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HN*SENDER*RECEIVER*20231201*1200*1*X*005010X212~ST*277*0001~TRN*1*CLM123456~STC*P1:20*20231201~REF*1K*PAYER123~REF*D9*PCN001~SE*6*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse277(edi);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].claimNumber).toBe('CLM123456');
      expect(result[0].statusCategoryCode).toBe('P1');
      expect(result[0].payerClaimNumber).toBe('PAYER123');
    });

    it('should handle multiple claim statuses', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*HN*SENDER*RECEIVER*20231201*1200*1*X*005010X212~ST*277*0001~TRN*1*CLM001~STC*P1:20*20231201~TRN*1*CLM002~STC*F1:21*20231201~SE*7*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parse277(edi);

      expect(result.length).toBe(2);
      expect(result[0].claimNumber).toBe('CLM001');
      expect(result[1].claimNumber).toBe('CLM002');
    });
  });

  describe('parseAcknowledgment', () => {
    it('should parse 997 acknowledgment', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*FA*SENDER*RECEIVER*20231201*1200*1*X*005010~ST*997*0001~AK1*HC*000000001~AK9*A*1*1*1~SE*4*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parseAcknowledgment(edi);

      expect(result.transactionType).toBe('HC');
      expect(result.accepted).toBe(true);
      expect(result.controlNumber).toBe('000000001');
    });

    it('should parse rejected acknowledgment with errors', () => {
      const edi = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *231201*1200*^*00501*000000001*0*P*:~GS*FA*SENDER*RECEIVER*20231201*1200*1*X*005010~ST*997*0001~AK1*HC*000000001~AK3*NM1*5*1~AK4*3*66*7~AK9*R*1*1*0~SE*6*0001~GE*1*1~IEA*1*000000001~`;

      const result = parser.parseAcknowledgment(edi);

      expect(result.accepted).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
