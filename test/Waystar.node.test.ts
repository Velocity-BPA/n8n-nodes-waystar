/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Waystar } from '../nodes/Waystar/Waystar.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Waystar Node', () => {
  let node: Waystar;

  beforeAll(() => {
    node = new Waystar();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Waystar');
      expect(node.description.name).toBe('waystar');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('EligibilityVerification Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token',
        baseUrl: 'https://api.waystar.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create eligibility request successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEligibilityRequest')
      .mockReturnValueOnce({ firstName: 'John', lastName: 'Doe' })
      .mockReturnValueOnce({ payerName: 'Aetna' })
      .mockReturnValueOnce({ npi: '1234567890' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
      requestId: 'req_123',
      status: 'pending'
    });

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { requestId: 'req_123', status: 'pending' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle create eligibility request error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEligibilityRequest')
      .mockReturnValueOnce({ firstName: 'John' })
      .mockReturnValueOnce({ payerName: 'Aetna' })
      .mockReturnValueOnce({ npi: '1234567890' });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Invalid patient information')
    );
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { error: 'Invalid patient information' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should get eligibility request successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEligibilityRequest')
      .mockReturnValueOnce('req_123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      requestId: 'req_123',
      status: 'complete',
      results: { covered: true }
    });

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { requestId: 'req_123', status: 'complete', results: { covered: true } },
      pairedItem: { item: 0 }
    }]);
  });

  it('should list eligibility requests with filters successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listEligibilityRequests')
      .mockReturnValueOnce('2024-01-01,2024-12-31')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce('patient_123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      requests: [{ requestId: 'req_123', status: 'pending' }],
      total: 1
    });

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { requests: [{ requestId: 'req_123', status: 'pending' }], total: 1 },
      pairedItem: { item: 0 }
    }]);
  });

  it('should update eligibility request successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateEligibilityRequest')
      .mockReturnValueOnce('req_123')
      .mockReturnValueOnce({ status: 'cancelled' });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      requestId: 'req_123',
      status: 'cancelled',
      updated: true
    });

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { requestId: 'req_123', status: 'cancelled', updated: true },
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete eligibility request successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteEligibilityRequest')
      .mockReturnValueOnce('req_123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      requestId: 'req_123',
      deleted: true
    });

    const result = await executeEligibilityVerificationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{
      json: { requestId: 'req_123', deleted: true },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Claims Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.waystar.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create a claim successfully', async () => {
    const mockClaimData = { claim_number: 'CLM123' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createClaim';
        case 'claimData': return { type: 'medical' };
        case 'patientInfo': return { name: 'John Doe' };
        case 'providerInfo': return { npi: '1234567890' };
        case 'services': return [{ code: '99213' }];
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockClaimData);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockClaimData, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.waystar.com/v1/claims',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: {
        claim_data: { type: 'medical' },
        patient_info: { name: 'John Doe' },
        provider_info: { npi: '1234567890' },
        services: [{ code: '99213' }]
      },
      json: true
    });
  });

  it('should handle create claim error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createClaim');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get a claim successfully', async () => {
    const mockClaim = { id: 'claim123', status: 'approved' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getClaim';
        case 'claimId': return 'claim123';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockClaim);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockClaim, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.waystar.com/v1/claims/claim123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  it('should list claims with filters successfully', async () => {
    const mockClaims = [{ id: 'claim1' }, { id: 'claim2' }];
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'listClaims';
        case 'status': return 'approved';
        case 'patientId': return 'patient123';
        default: return '';
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockClaims);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockClaims, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.waystar.com/v1/claims?status=approved&patient_id=patient123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  it('should update a claim successfully', async () => {
    const mockUpdatedClaim = { id: 'claim123', status: 'updated' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateClaim';
        case 'claimId': return 'claim123';
        case 'updatedClaimData': return { status: 'updated' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedClaim);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockUpdatedClaim, pairedItem: { item: 0 } }]);
  });

  it('should delete a claim successfully', async () => {
    const mockDeleteResponse = { success: true };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteClaim';
        case 'claimId': return 'claim123';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockDeleteResponse);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockDeleteResponse, pairedItem: { item: 0 } }]);
  });

  it('should resubmit a claim successfully', async () => {
    const mockResubmitResponse = { id: 'claim123', status: 'resubmitted' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'resubmitClaim';
        case 'claimId': return 'claim123';
        case 'corrections': return { corrected_amount: 100 };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResubmitResponse);

    const result = await executeClaimsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResubmitResponse, pairedItem: { item: 0 } }]);
  });
});

describe('Remittance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token',
        baseUrl: 'https://api.waystar.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listRemittanceAdvice', () => {
    it('should successfully list remittance advice', async () => {
      const mockResponse = { advice: [], total: 0 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listRemittanceAdvice')
        .mockReturnValueOnce('2024-01-01 to 2024-01-31')
        .mockReturnValueOnce('PAYER123')
        .mockReturnValueOnce('pending');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle listRemittanceAdvice errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listRemittanceAdvice');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getRemittanceAdvice', () => {
    it('should successfully get remittance advice', async () => {
      const mockResponse = { era_id: 'ERA123', status: 'pending' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRemittanceAdvice')
        .mockReturnValueOnce('ERA123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('processRemittanceAdvice', () => {
    it('should successfully process remittance advice', async () => {
      const mockResponse = { era_id: 'ERA123', status: 'processed' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('processRemittanceAdvice')
        .mockReturnValueOnce('ERA123')
        .mockReturnValueOnce('{"auto_post": true}');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('listPayments', () => {
    it('should successfully list payments', async () => {
      const mockResponse = { payments: [], total: 0 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listPayments')
        .mockReturnValueOnce('2024-01-01 to 2024-01-31')
        .mockReturnValueOnce('100-1000')
        .mockReturnValueOnce('PAYER123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPayment', () => {
    it('should successfully get payment', async () => {
      const mockResponse = { payment_id: 'PAY123', amount: 500.00 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPayment')
        .mockReturnValueOnce('PAY123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRemittanceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Denial Management Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.waystar.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listDenials operation', () => {
    it('should list denials successfully', async () => {
      const mockResponse = { denials: [{ id: 'denial1', reason: 'coverage_expired' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listDenials';
          case 'dateRange': return '2024-01-01,2024-01-31';
          case 'payerId': return 'payer123';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDenialManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle listDenials error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listDenials');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeDenialManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getDenial operation', () => {
    it('should get denial details successfully', async () => {
      const mockResponse = { id: 'denial1', reason_code: 'CO-97', amount: 500 };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getDenial';
        if (param === 'denialId') return 'denial1';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDenialManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createAppeal operation', () => {
    it('should create appeal successfully', async () => {
      const mockResponse = { appeal_id: 'appeal1', status: 'submitted' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createAppeal';
          case 'denialId': return 'denial1';
          case 'appealDocumentation': return 'Medical records attached';
          case 'reason': return 'Services were medically necessary';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDenialManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getDenialAnalytics operation', () => {
    it('should get denial analytics successfully', async () => {
      const mockResponse = { 
        total_denials: 150, 
        denial_rate: 0.12,
        top_reasons: [{ reason: 'coverage_expired', count: 45 }]
      };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDenialAnalytics';
          case 'dateRange': return '2024-01-01,2024-01-31';
          case 'groupBy': return 'denial_reason';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDenialManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Patients Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.waystar.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create patient successfully', async () => {
    const mockResponse = { id: 'patient123', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPatient')
      .mockReturnValueOnce({ firstName: 'John', lastName: 'Doe' })
      .mockReturnValueOnce({ insuranceId: 'INS123' })
      .mockReturnValueOnce({ phone: '555-1234' });

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle create patient error', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createPatient');

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get patient successfully', async () => {
    const mockResponse = { id: 'patient123', name: 'John Doe' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPatient')
      .mockReturnValueOnce('patient123');

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should list patients successfully', async () => {
    const mockResponse = { patients: [{ id: 'patient123' }], total: 1 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listPatients')
      .mockReturnValueOnce('John')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should update patient successfully', async () => {
    const mockResponse = { id: 'patient123', status: 'updated' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updatePatient')
      .mockReturnValueOnce('patient123')
      .mockReturnValueOnce({ demographics: { phone: '555-9999' } });

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should delete patient successfully', async () => {
    const mockResponse = { status: 'deleted' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deletePatient')
      .mockReturnValueOnce('patient123');

    const result = await executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle unknown operation error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executePatientsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Providers Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.waystar.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createProvider operation', () => {
		it('should create a provider successfully', async () => {
			const mockResponse = { provider_id: 'PRV123', status: 'created' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createProvider')
				.mockReturnValueOnce({ first_name: 'John', last_name: 'Doe' })
				.mockReturnValueOnce({ license_number: 'MD12345' })
				.mockReturnValueOnce('207Q00000X');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.waystar.com/v1/providers',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					provider_info: { first_name: 'John', last_name: 'Doe' },
					credentials: { license_number: 'MD12345' },
					taxonomy_code: '207Q00000X',
				},
				json: true,
			});
		});

		it('should handle createProvider errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createProvider');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('getProvider operation', () => {
		it('should get provider details successfully', async () => {
			const mockResponse = { provider_id: 'PRV123', first_name: 'John', last_name: 'Doe' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProvider')
				.mockReturnValueOnce('PRV123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.waystar.com/v1/providers/PRV123',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getProvider errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getProvider');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Provider not found'));

			await expect(
				executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Provider not found');
		});
	});

	describe('listProviders operation', () => {
		it('should list providers with filters successfully', async () => {
			const mockResponse = { providers: [{ provider_id: 'PRV123' }], total: 1 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listProviders')
				.mockReturnValueOnce('John')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.waystar.com/v1/providers',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: { name: 'John' },
				json: true,
			});
		});

		it('should handle listProviders errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('listProviders');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('updateProvider operation', () => {
		it('should update provider successfully', async () => {
			const mockResponse = { provider_id: 'PRV123', status: 'updated' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateProvider')
				.mockReturnValueOnce('PRV123')
				.mockReturnValueOnce({ phone: '555-0123' });
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.waystar.com/v1/providers/PRV123',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					updated_info: { phone: '555-0123' },
				},
				json: true,
			});
		});

		it('should handle updateProvider errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('updateProvider');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));

			await expect(
				executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Update failed');
		});
	});

	describe('deleteProvider operation', () => {
		it('should delete provider successfully', async () => {
			const mockResponse = { status: 'deleted' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteProvider')
				.mockReturnValueOnce('PRV123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.waystar.com/v1/providers/PRV123',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle deleteProvider errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('deleteProvider');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Delete failed'));

			await expect(
				executeProvidersOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Delete failed');
		});
	});
});
});
