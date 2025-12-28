/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Healthcare Adjustment and Reference Codes
 *
 * Standard codes used in healthcare revenue cycle management for
 * identifying various adjustment types, service codes, and modifiers.
 */

/**
 * Claim Adjustment Group Codes (CAS01)
 * Used to categorize adjustments in the 835 remittance
 */
export const ADJUSTMENT_GROUP_CODES: Record<string, string> = {
  CO: 'Contractual Obligations - Provider write-off due to contract',
  CR: 'Corrections and Reversals',
  OA: 'Other Adjustments',
  PI: 'Payer Initiated Reductions - Not due to contract',
  PR: 'Patient Responsibility - Deductible, copay, coinsurance',
};

/**
 * Place of Service Codes
 * CMS-designated codes indicating where services were rendered
 */
export const PLACE_OF_SERVICE_CODES: Record<string, string> = {
  '01': 'Pharmacy',
  '02': 'Telehealth Provided Other than in Patient\'s Home',
  '03': 'School',
  '04': 'Homeless Shelter',
  '05': 'Indian Health Service Free-standing Facility',
  '06': 'Indian Health Service Provider-based Facility',
  '07': 'Tribal 638 Free-standing Facility',
  '08': 'Tribal 638 Provider-based Facility',
  '09': 'Prison/Correctional Facility',
  '10': 'Telehealth Provided in Patient\'s Home',
  '11': 'Office',
  '12': 'Home',
  '13': 'Assisted Living Facility',
  '14': 'Group Home',
  '15': 'Mobile Unit',
  '16': 'Temporary Lodging',
  '17': 'Walk-in Retail Health Clinic',
  '18': 'Place of Employment - Worksite',
  '19': 'Off Campus-Outpatient Hospital',
  '20': 'Urgent Care Facility',
  '21': 'Inpatient Hospital',
  '22': 'On Campus-Outpatient Hospital',
  '23': 'Emergency Room - Hospital',
  '24': 'Ambulatory Surgical Center',
  '25': 'Birthing Center',
  '26': 'Military Treatment Facility',
  '27': 'Outreach Site / Street',
  '31': 'Skilled Nursing Facility',
  '32': 'Nursing Facility',
  '33': 'Custodial Care Facility',
  '34': 'Hospice',
  '41': 'Ambulance - Land',
  '42': 'Ambulance - Air or Water',
  '49': 'Independent Clinic',
  '50': 'Federally Qualified Health Center',
  '51': 'Inpatient Psychiatric Facility',
  '52': 'Psychiatric Facility - Partial Hospitalization',
  '53': 'Community Mental Health Center',
  '54': 'Intermediate Care Facility/Individuals with Intellectual Disabilities',
  '55': 'Residential Substance Abuse Treatment Facility',
  '56': 'Psychiatric Residential Treatment Center',
  '57': 'Non-residential Substance Abuse Treatment Facility',
  '58': 'Non-residential Opioid Treatment Facility',
  '60': 'Mass Immunization Center',
  '61': 'Comprehensive Inpatient Rehabilitation Facility',
  '62': 'Comprehensive Outpatient Rehabilitation Facility',
  '65': 'End-Stage Renal Disease Treatment Facility',
  '71': 'Public Health Clinic',
  '72': 'Rural Health Clinic',
  '81': 'Independent Laboratory',
  '99': 'Other Place of Service',
};

/**
 * Common CPT Modifier Codes
 * Used to provide additional information about services
 */
export const MODIFIER_CODES: Record<string, string> = {
  '22': 'Increased Procedural Services',
  '23': 'Unusual Anesthesia',
  '24': 'Unrelated Evaluation and Management Service',
  '25': 'Significant, Separately Identifiable E/M Service',
  '26': 'Professional Component',
  '50': 'Bilateral Procedure',
  '51': 'Multiple Procedures',
  '52': 'Reduced Services',
  '53': 'Discontinued Procedure',
  '54': 'Surgical Care Only',
  '55': 'Postoperative Management Only',
  '56': 'Preoperative Management Only',
  '57': 'Decision for Surgery',
  '58': 'Staged or Related Procedure',
  '59': 'Distinct Procedural Service',
  '62': 'Two Surgeons',
  '76': 'Repeat Procedure by Same Physician',
  '77': 'Repeat Procedure by Another Physician',
  '78': 'Unplanned Return to Operating Room',
  '79': 'Unrelated Procedure During Postoperative Period',
  '80': 'Assistant Surgeon',
  '81': 'Minimum Assistant Surgeon',
  '82': 'Assistant Surgeon (when qualified resident not available)',
  '90': 'Reference (Outside) Laboratory',
  '91': 'Repeat Clinical Diagnostic Laboratory Test',
  '95': 'Synchronous Telemedicine Service via Real-Time Interactive',
  '99': 'Multiple Modifiers',
  AA: 'Anesthesia services performed personally by anesthesiologist',
  AS: 'Physician assistant, nurse practitioner, or clinical nurse specialist services',
  GA: 'Waiver of liability statement issued',
  GC: 'Service performed in part by resident',
  GT: 'Via interactive audio and video telecommunication systems',
  GW: 'Service not related to the hospice patient\'s terminal condition',
  GY: 'Item or service statutorily excluded, does not meet definition of benefit',
  GZ: 'Item or service expected to be denied as not reasonable and necessary',
  LT: 'Left side',
  RT: 'Right side',
  TC: 'Technical component',
  XE: 'Separate encounter',
  XP: 'Separate practitioner',
  XS: 'Separate structure',
  XU: 'Unusual non-overlapping service',
};

/**
 * Provider Taxonomy Codes (Common)
 * NUCC Health Care Provider Taxonomy codes
 */
export const TAXONOMY_CODES: Record<string, string> = {
  '207Q00000X': 'Family Medicine',
  '207R00000X': 'Internal Medicine',
  '207RC0000X': 'Cardiovascular Disease',
  '207RE0101X': 'Endocrinology, Diabetes & Metabolism',
  '207RG0100X': 'Gastroenterology',
  '207RH0000X': 'Hematology',
  '207RN0300X': 'Nephrology',
  '207RP1001X': 'Pulmonary Disease',
  '207RR0500X': 'Rheumatology',
  '207T00000X': 'Neurological Surgery',
  '207V00000X': 'Obstetrics & Gynecology',
  '207W00000X': 'Ophthalmology',
  '207X00000X': 'Orthopaedic Surgery',
  '207Y00000X': 'Otolaryngology',
  '208000000X': 'Pediatrics',
  '208100000X': 'Physical Medicine & Rehabilitation',
  '208200000X': 'Plastic Surgery',
  '208600000X': 'Surgery',
  '208800000X': 'Urology',
  '208D00000X': 'General Practice',
  '208M00000X': 'Hospitalist',
  '363A00000X': 'Physician Assistant',
  '363L00000X': 'Nurse Practitioner',
  '364S00000X': 'Clinical Nurse Specialist',
  '367500000X': 'Nurse Anesthetist, Certified Registered',
  '282N00000X': 'General Acute Care Hospital',
  '291U00000X': 'Clinical Medical Laboratory',
  '333600000X': 'Pharmacy',
};

/**
 * Revenue Codes (UB-04) - Common codes
 * Used in institutional billing
 */
export const REVENUE_CODES: Record<string, string> = {
  '0001': 'Total Charges',
  '0100': 'All-Inclusive Room & Board',
  '0110': 'Room & Board - Private',
  '0120': 'Room & Board - Semi-Private',
  '0200': 'Intensive Care',
  '0250': 'Pharmacy',
  '0260': 'IV Therapy',
  '0270': 'Medical/Surgical Supplies',
  '0300': 'Laboratory',
  '0320': 'Radiology - Diagnostic',
  '0350': 'CT Scan',
  '0360': 'Operating Room Services',
  '0370': 'Anesthesia',
  '0380': 'Blood',
  '0400': 'Other Imaging Services',
  '0410': 'Respiratory Services',
  '0420': 'Physical Therapy',
  '0430': 'Occupational Therapy',
  '0440': 'Speech-Language Pathology',
  '0450': 'Emergency Room',
  '0480': 'Cardiology',
  '0490': 'Ambulatory Surgical Care',
  '0510': 'Clinic',
  '0540': 'Ambulance',
  '0610': 'MRI',
  '0730': 'EKG/ECG',
  '0800': 'Inpatient Renal Dialysis',
  '0900': 'Behavioral Health Treatments/Services',
  '0960': 'Professional Fees',
};

export default {
  ADJUSTMENT_GROUP_CODES,
  PLACE_OF_SERVICE_CODES,
  MODIFIER_CODES,
  TAXONOMY_CODES,
  REVENUE_CODES,
};
