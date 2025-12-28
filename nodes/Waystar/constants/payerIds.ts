/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Common Payer IDs
 *
 * Standard payer identifiers used in healthcare claims processing.
 * These are used for EDI routing and identification.
 */

/**
 * Medicare Payer IDs by region
 */
export const MEDICARE_PAYER_IDS: Record<string, string> = {
  // Medicare Administrative Contractors (MACs)
  PALMETTO_JJ: '12502',
  PALMETTO_JM: '12501',
  NOVITAS_JL: '12201',
  NOVITAS_JH: '12102',
  NGS_6: '12401',
  NGS_K: '12402',
  WPS_8: '12301',
  WPS_5: '12302',
  CGS_15: '12601',
  FIRST_COAST_9: '12001',
  CAHABA_10: '12701',
  NORIDIAN_F: '12002',
  NORIDIAN_E: '12003',

  // Railroad Medicare
  RAILROAD_MEDICARE: '00882',

  // DME MACs
  NORIDIAN_DME_A: '11501',
  NORIDIAN_DME_D: '11502',
  CGS_DME_B: '11503',
  CGS_DME_C: '11504',

  // Medicare HHH (Home Health & Hospice)
  PALMETTO_HHH: '12500',
  CGS_HHH: '12600',
};

/**
 * Medicaid Payer IDs by state
 */
export const MEDICAID_PAYER_IDS: Record<string, string> = {
  AL: 'SKYAL0',
  AK: 'SKYAK0',
  AZ: 'AHCCCS',
  AR: 'SKYAR0',
  CA: 'MCAL',
  CO: 'SKYCO0',
  CT: 'SKYCT0',
  DE: 'SKYDE0',
  DC: 'DCHFP',
  FL: 'SKYFL0',
  GA: 'SKYGA0',
  HI: 'SKYHI0',
  ID: 'SKYID0',
  IL: 'SKYIL0',
  IN: 'SKYIN0',
  IA: 'IMEHP',
  KS: 'SKYKS0',
  KY: 'SKYKY0',
  LA: 'SKYLA0',
  ME: 'SKYME0',
  MD: 'SKYMD0',
  MA: 'SKYMA0',
  MI: 'SKYMI0',
  MN: 'SKYMN0',
  MS: 'SKYMS0',
  MO: 'SKYMO0',
  MT: 'SKYMT0',
  NE: 'SKYNE0',
  NV: 'SKYNV0',
  NH: 'SKYNH0',
  NJ: 'SKYNJ0',
  NM: 'SKYNM0',
  NY: 'SKYNY0',
  NC: 'SKYNC0',
  ND: 'SKYND0',
  OH: 'SKYOH0',
  OK: 'SKYOK0',
  OR: 'SKYOR0',
  PA: 'SKYPA0',
  RI: 'SKYRI0',
  SC: 'SKYSC0',
  SD: 'SKYSD0',
  TN: 'SKYTN0',
  TX: 'SKYTX0',
  UT: 'SKYUT0',
  VT: 'SKYVT0',
  VA: 'SKYVA0',
  WA: 'SKYWA0',
  WV: 'SKYWV0',
  WI: 'SKYWI0',
  WY: 'SKYWY0',
};

/**
 * Major Commercial Payer IDs
 */
export const COMMERCIAL_PAYER_IDS: Record<string, string> = {
  // Aetna
  AETNA: '60054',
  AETNA_BETTER_HEALTH: 'ABTHO',
  AETNA_MEDICARE: '36273',

  // Anthem / Blue Cross Blue Shield
  ANTHEM: '00860',
  BCBS_AL: '00510',
  BCBS_AZ: '00831',
  BCBS_AR: '00520',
  BCBS_CA: '84075',
  BCBS_CO: '00540',
  BCBS_CT: '00545',
  BCBS_DE: '00550',
  BCBS_FL: '00590',
  BCBS_GA: '00600',
  BCBS_HI: '00610',
  BCBS_ID: '00620',
  BCBS_IL: '00621',
  BCBS_IN: '00630',
  BCBS_IA: '00640',
  BCBS_KS: '00650',
  BCBS_KY: '00660',
  BCBS_LA: '00670',
  BCBS_ME: '00211',
  BCBS_MD: '00680',
  BCBS_MA: '00690',
  BCBS_MI: '00700',
  BCBS_MN: '00710',
  BCBS_MS: '00720',
  BCBS_MO: '00730',
  BCBS_MT: '00740',
  BCBS_NE: '00750',
  BCBS_NV: '00760',
  BCBS_NH: '00225',
  BCBS_NJ: '00770',
  BCBS_NM: '00780',
  BCBS_NY: '00803',
  BCBS_NC: '00810',
  BCBS_ND: '00820',
  BCBS_OH: '00830',
  BCBS_OK: '00840',
  BCBS_OR: '00850',
  BCBS_PA: '00870',
  BCBS_RI: '00880',
  BCBS_SC: '00890',
  BCBS_SD: '00900',
  BCBS_TN: '84132',
  BCBS_TX: '84980',
  BCBS_UT: '00920',
  BCBS_VT: '00235',
  BCBS_VA: '00930',
  BCBS_WA: '00940',
  BCBS_WV: '00950',
  BCBS_WI: '00960',
  BCBS_WY: '00970',
  BCBS_FEP: '00312',

  // Cigna
  CIGNA: '62308',
  CIGNA_HEALTHSPRING: 'CGHSP',
  CIGNA_MEDICARE: '80142',

  // Humana
  HUMANA: '61101',
  HUMANA_MEDICARE: 'SX065',
  HUMANA_MILITARY: '35173',

  // United Healthcare
  UNITED: '87726',
  UNITED_COMMUNITY: 'UHC01',
  UNITED_MEDICARE: '87726',
  UNITED_OXFORD: '06111',
  UNITED_SIERRA: '41124',

  // Kaiser
  KAISER: '94135',
  KAISER_CA: '94135',
  KAISER_CO: 'KPDEN',
  KAISER_GA: 'KPGA1',
  KAISER_HI: 'KPHI1',
  KAISER_MID_ATLANTIC: 'KPMA1',
  KAISER_NW: 'KPNW1',
  KAISER_WA: 'KPWA1',

  // Other major payers
  TRICARE: '99726',
  TRICARE_EAST: '84111',
  TRICARE_WEST: '84112',
  CHAMPVA: '84146',

  // Workers Compensation
  TRAVELERS_WC: '13162',
  HARTFORD_WC: '65978',
  LIBERTY_MUTUAL_WC: '42129',
  AIG_WC: '45614',
  SEDGWICK_WC: '38217',

  // Auto/PIP
  ALLSTATE: '35300',
  STATE_FARM: '59140',
  GEICO: '75283',
  PROGRESSIVE: '31178',
  USAA: '77950',
};

/**
 * Clearinghouse IDs
 */
export const CLEARINGHOUSE_IDS: Record<string, string> = {
  WAYSTAR: 'WAYSTAR',
  CHANGE_HEALTHCARE: 'EMDEON',
  AVAILITY: 'AVAIL',
  TRIZETTO: 'TRIZET',
  RELAY_HEALTH: 'RLYHLTH',
  OFFICE_ALLY: 'OFALL',
  ABILITY: 'ABILIT',
  CLAIM_REMEDI: 'CLMRMD',
  GATEWAY_EDI: 'GTWEDI',
  NAVICURE: 'NAVICR',
};

/**
 * Payer Types
 */
export const PAYER_TYPES = {
  MEDICARE: 'medicare',
  MEDICAID: 'medicaid',
  COMMERCIAL: 'commercial',
  TRICARE: 'tricare',
  WORKERS_COMP: 'workersComp',
  AUTO: 'auto',
  SELF_PAY: 'selfPay',
  OTHER: 'other',
} as const;

/**
 * EDI Transaction Types
 */
export const EDI_TRANSACTION_TYPES = {
  ELIGIBILITY_INQUIRY: '270',
  ELIGIBILITY_RESPONSE: '271',
  CLAIM_STATUS_INQUIRY: '276',
  CLAIM_STATUS_RESPONSE: '277',
  SERVICES_REVIEW_REQUEST: '278',
  SERVICES_REVIEW_RESPONSE: '278',
  PROFESSIONAL_CLAIM: '837P',
  INSTITUTIONAL_CLAIM: '837I',
  DENTAL_CLAIM: '837D',
  REMITTANCE_ADVICE: '835',
  FUNCTIONAL_ACK: '997',
  IMPLEMENTATION_ACK: '999',
  INTERCHANGE_ACK: 'TA1',
} as const;

export default {
  MEDICARE_PAYER_IDS,
  MEDICAID_PAYER_IDS,
  COMMERCIAL_PAYER_IDS,
  CLEARINGHOUSE_IDS,
  PAYER_TYPES,
  EDI_TRANSACTION_TYPES,
};
