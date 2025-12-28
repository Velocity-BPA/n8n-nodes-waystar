/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Waystar EDI Credentials
 *
 * Configuration for X12 EDI transactions with Waystar.
 * These credentials are used for submitting and receiving
 * healthcare EDI transactions (270/271, 276/277, 835, 837, etc.)
 */
export class WaystarEdi implements ICredentialType {
  name = 'waystarEdi';
  displayName = 'Waystar EDI';
  documentationUrl = 'https://docs.waystar.com/edi';

  properties: INodeProperties[] = [
    {
      displayName: 'Sender ID (ISA06)',
      name: 'senderId',
      type: 'string',
      default: '',
      required: true,
      description: 'Interchange Sender ID - your organization identifier in EDI transactions',
      placeholder: 'YOURORGID',
    },
    {
      displayName: 'Sender Qualifier (ISA05)',
      name: 'senderQualifier',
      type: 'options',
      options: [
        { name: '01 - DUNS', value: '01' },
        { name: '08 - UCC EDI Number', value: '08' },
        { name: '14 - DUNS+4', value: '14' },
        { name: '20 - Health Industry Number', value: '20' },
        { name: '27 - HCFA Medicare ID', value: '27' },
        { name: '28 - HCFA Medicaid ID', value: '28' },
        { name: '29 - HCFA Champus ID', value: '29' },
        { name: '30 - US Federal Tax ID', value: '30' },
        { name: '33 - NAIC Company Code', value: '33' },
        { name: 'ZZ - Mutually Defined', value: 'ZZ' },
      ],
      default: 'ZZ',
      required: true,
      description: 'Qualifier that identifies the type of Sender ID',
    },
    {
      displayName: 'Receiver ID (ISA08)',
      name: 'receiverId',
      type: 'string',
      default: '',
      required: true,
      description: 'Interchange Receiver ID - Waystar or payer identifier',
      placeholder: 'WAYSTAR',
    },
    {
      displayName: 'Receiver Qualifier (ISA07)',
      name: 'receiverQualifier',
      type: 'options',
      options: [
        { name: '01 - DUNS', value: '01' },
        { name: '08 - UCC EDI Number', value: '08' },
        { name: '14 - DUNS+4', value: '14' },
        { name: '20 - Health Industry Number', value: '20' },
        { name: '27 - HCFA Medicare ID', value: '27' },
        { name: '28 - HCFA Medicaid ID', value: '28' },
        { name: '29 - HCFA Champus ID', value: '29' },
        { name: '30 - US Federal Tax ID', value: '30' },
        { name: '33 - NAIC Company Code', value: '33' },
        { name: 'ZZ - Mutually Defined', value: 'ZZ' },
      ],
      default: 'ZZ',
      required: true,
      description: 'Qualifier that identifies the type of Receiver ID',
    },
    {
      displayName: 'Trading Partner ID',
      name: 'tradingPartnerId',
      type: 'string',
      default: '',
      required: true,
      description: 'Waystar Trading Partner ID assigned to your organization',
    },
    {
      displayName: 'Application Sender Code (GS02)',
      name: 'applicationSenderCode',
      type: 'string',
      default: '',
      description: 'Application Sender Code for functional group header',
    },
    {
      displayName: 'Application Receiver Code (GS03)',
      name: 'applicationReceiverCode',
      type: 'string',
      default: '',
      description: 'Application Receiver Code for functional group header',
    },
    {
      displayName: 'Submitter ID',
      name: 'submitterId',
      type: 'string',
      default: '',
      description: 'Submitter identifier for claim submissions',
    },
    {
      displayName: 'Submitter Name',
      name: 'submitterName',
      type: 'string',
      default: '',
      description: 'Submitter organization name',
    },
  ];
}
