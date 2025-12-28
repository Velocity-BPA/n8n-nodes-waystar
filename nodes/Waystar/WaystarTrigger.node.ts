/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

/**
 * Velocity BPA Licensing Notice
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

export class WaystarTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Waystar Trigger',
    name: 'waystarTrigger',
    icon: 'file:waystar.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Receive real-time events from Waystar healthcare revenue cycle platform',
    defaults: {
      name: 'Waystar Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'waystarApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      // License notice
      {
        displayName: 'This node is licensed under BSL 1.1. Commercial use requires a license from Velocity BPA.',
        name: 'licenseNotice',
        type: 'notice',
        default: '',
      },
      {
        displayName: 'Event Category',
        name: 'eventCategory',
        type: 'options',
        options: [
          { name: 'Eligibility', value: 'eligibility' },
          { name: 'Claims', value: 'claims' },
          { name: 'Remittance', value: 'remittance' },
          { name: 'Denials', value: 'denials' },
          { name: 'Prior Authorization', value: 'priorAuth' },
          { name: 'Payments', value: 'payments' },
          { name: 'Batch', value: 'batch' },
          { name: 'Workflow', value: 'workflow' },
          { name: 'EDI', value: 'edi' },
          { name: 'Reports', value: 'reports' },
        ],
        default: 'claims',
        description: 'Category of events to listen for',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['eligibility'] } },
        options: [
          { name: 'Eligibility Response Received', value: 'eligibility.response' },
          { name: 'Coverage Changed', value: 'eligibility.coverage_changed' },
          { name: 'Eligibility Error', value: 'eligibility.error' },
          { name: 'Benefits Updated', value: 'eligibility.benefits_updated' },
        ],
        default: 'eligibility.response',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['claims'] } },
        options: [
          { name: 'Claim Submitted', value: 'claim.submitted' },
          { name: 'Claim Accepted', value: 'claim.accepted' },
          { name: 'Claim Rejected', value: 'claim.rejected' },
          { name: 'Claim Paid', value: 'claim.paid' },
          { name: 'Claim Denied', value: 'claim.denied' },
          { name: 'Claim Status Changed', value: 'claim.status_changed' },
          { name: 'Claim Pending', value: 'claim.pending' },
          { name: 'Claim Appealed', value: 'claim.appealed' },
        ],
        default: 'claim.submitted',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['remittance'] } },
        options: [
          { name: 'ERA Received', value: 'remittance.era_received' },
          { name: 'Payment Posted', value: 'remittance.payment_posted' },
          { name: 'Payment Failed', value: 'remittance.payment_failed' },
          { name: 'Adjustment Applied', value: 'remittance.adjustment_applied' },
          { name: 'Zero Pay Received', value: 'remittance.zero_pay' },
        ],
        default: 'remittance.era_received',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['denials'] } },
        options: [
          { name: 'Denial Received', value: 'denial.received' },
          { name: 'Appeal Due', value: 'denial.appeal_due' },
          { name: 'Appeal Result', value: 'denial.appeal_result' },
          { name: 'Recovery Opportunity', value: 'denial.recovery_opportunity' },
        ],
        default: 'denial.received',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['priorAuth'] } },
        options: [
          { name: 'Authorization Approved', value: 'priorAuth.approved' },
          { name: 'Authorization Denied', value: 'priorAuth.denied' },
          { name: 'Authorization Pending', value: 'priorAuth.pending' },
          { name: 'Authorization Expiring', value: 'priorAuth.expiring' },
        ],
        default: 'priorAuth.approved',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['payments'] } },
        options: [
          { name: 'Payment Received', value: 'payment.received' },
          { name: 'Payment Posted', value: 'payment.posted' },
          { name: 'Payment Variance', value: 'payment.variance' },
          { name: 'Underpayment Alert', value: 'payment.underpayment' },
        ],
        default: 'payment.received',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['batch'] } },
        options: [
          { name: 'Batch Submitted', value: 'batch.submitted' },
          { name: 'Batch Completed', value: 'batch.completed' },
          { name: 'Batch Error', value: 'batch.error' },
          { name: 'Batch Acknowledgment', value: 'batch.acknowledgment' },
        ],
        default: 'batch.completed',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['workflow'] } },
        options: [
          { name: 'Task Assigned', value: 'workflow.task_assigned' },
          { name: 'Task Due', value: 'workflow.task_due' },
          { name: 'Task Completed', value: 'workflow.task_completed' },
          { name: 'Workflow Started', value: 'workflow.started' },
        ],
        default: 'workflow.task_assigned',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['edi'] } },
        options: [
          { name: 'EDI Response Received', value: 'edi.response_received' },
          { name: '997/999 Received', value: 'edi.acknowledgment_received' },
          { name: 'EDI Rejection', value: 'edi.rejection' },
          { name: 'TA1 Acknowledgment', value: 'edi.ta1_received' },
        ],
        default: 'edi.response_received',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: { show: { eventCategory: ['reports'] } },
        options: [
          { name: 'Report Ready', value: 'report.ready' },
          { name: 'Scheduled Report Complete', value: 'report.scheduled_complete' },
        ],
        default: 'report.ready',
      },
      // Filter options
      {
        displayName: 'Filter Options',
        name: 'filterOptions',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        options: [
          { displayName: 'Payer ID', name: 'payerId', type: 'string', default: '', description: 'Filter by specific payer' },
          { displayName: 'Provider NPI', name: 'providerNpi', type: 'string', default: '', description: 'Filter by provider NPI' },
          { displayName: 'Minimum Amount', name: 'minAmount', type: 'number', default: 0, description: 'Minimum payment amount to trigger' },
          { displayName: 'Claim Type', name: 'claimType', type: 'options', options: [
            { name: 'All', value: 'all' },
            { name: 'Professional', value: '837P' },
            { name: 'Institutional', value: '837I' },
            { name: 'Dental', value: '837D' },
          ], default: 'all' },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;
        const credentials = await this.getCredentials('waystarApi');

        try {
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${this.getBaseUrl(credentials)}/webhooks`,
            headers: { Authorization: `Bearer ${await this.getAccessToken(credentials)}` },
          });

          const webhooks = response.webhooks || [];
          return webhooks.some((wh: { url: string; event: string }) => 
            wh.url === webhookUrl && wh.event === event
          );
        } catch {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;
        const filterOptions = this.getNodeParameter('filterOptions', {}) as Record<string, unknown>;
        const credentials = await this.getCredentials('waystarApi');

        try {
          await this.helpers.httpRequest({
            method: 'POST',
            url: `${this.getBaseUrl(credentials)}/webhooks`,
            headers: {
              Authorization: `Bearer ${await this.getAccessToken(credentials)}`,
              'Content-Type': 'application/json',
            },
            body: {
              url: webhookUrl,
              event,
              filters: filterOptions,
            },
          });
          return true;
        } catch {
          return false;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const credentials = await this.getCredentials('waystarApi');

        try {
          await this.helpers.httpRequest({
            method: 'DELETE',
            url: `${this.getBaseUrl(credentials)}/webhooks`,
            headers: { Authorization: `Bearer ${await this.getAccessToken(credentials)}` },
            body: { url: webhookUrl },
          });
          return true;
        } catch {
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = this.getBodyData();

    // Log the license notice
    console.warn('[Velocity BPA] Waystar webhook received - BSL 1.1 licensed');

    // Return the webhook data
    return {
      workflowData: [
        this.helpers.returnJsonArray({
          event: body.event,
          timestamp: body.timestamp || new Date().toISOString(),
          data: body.data || body,
          headers: {
            'x-waystar-signature': req.headers['x-waystar-signature'],
            'x-waystar-timestamp': req.headers['x-waystar-timestamp'],
          },
        }),
      ],
    };
  }
}
