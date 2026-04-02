# n8n-nodes-waystar

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Waystar's healthcare revenue cycle management platform. The node includes 6 resources covering eligibility verification, claims processing, remittance handling, denial management, patient administration, and provider management to streamline healthcare financial operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Healthcare](https://img.shields.io/badge/Healthcare-Revenue%20Cycle-green)
![Revenue Cycle](https://img.shields.io/badge/RCM-Management-orange)
![Claims](https://img.shields.io/badge/Claims-Processing-purple)

## Features

- **Eligibility Verification** - Real-time insurance eligibility checks and benefit verification for patients
- **Claims Management** - Submit, track, and manage healthcare claims throughout the billing lifecycle
- **Remittance Processing** - Process electronic remittance advice (ERA) and payment reconciliation
- **Denial Management** - Handle claim denials, appeals, and resubmission workflows
- **Patient Administration** - Manage patient demographics, insurance information, and billing details
- **Provider Network** - Maintain provider credentials, contracts, and billing configurations
- **Revenue Cycle Automation** - Automate end-to-end revenue cycle management workflows
- **Compliance Reporting** - Generate reports for healthcare compliance and financial analysis

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-waystar`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-waystar
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-waystar.git
cd n8n-nodes-waystar
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-waystar
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Waystar API key from the developer portal | Yes |
| Environment | Production or Sandbox environment | Yes |
| Client ID | Your application client identifier | Yes |

## Resources & Operations

### 1. Eligibility Verification

| Operation | Description |
|-----------|-------------|
| Check Eligibility | Verify patient insurance eligibility and benefits |
| Get Verification | Retrieve eligibility verification results |
| List Verifications | Get all eligibility verifications |
| Update Verification | Update verification status or details |

### 2. Claims

| Operation | Description |
|-----------|-------------|
| Submit Claim | Submit new healthcare claims |
| Get Claim | Retrieve claim details and status |
| List Claims | Get all claims with filtering options |
| Update Claim | Update claim information |
| Cancel Claim | Cancel or void a submitted claim |
| Get Claim Status | Check current claim processing status |

### 3. Remittance

| Operation | Description |
|-----------|-------------|
| Get Remittance | Retrieve remittance advice details |
| List Remittances | Get all remittance documents |
| Download ERA | Download electronic remittance advice files |
| Process Payment | Process payment posting from remittance |
| Reconcile Payment | Reconcile payments with claims |

### 4. Denial Management

| Operation | Description |
|-----------|-------------|
| Get Denial | Retrieve denial details and reasons |
| List Denials | Get all claim denials |
| Create Appeal | Submit appeal for denied claims |
| Update Appeal | Update appeal status or documentation |
| Resubmit Claim | Resubmit corrected claim after denial |

### 5. Patients

| Operation | Description |
|-----------|-------------|
| Create Patient | Add new patient to the system |
| Get Patient | Retrieve patient demographics and information |
| List Patients | Get all patients with search filters |
| Update Patient | Update patient information |
| Delete Patient | Remove patient from system |
| Get Insurance | Retrieve patient insurance information |

### 6. Providers

| Operation | Description |
|-----------|-------------|
| Create Provider | Add new healthcare provider |
| Get Provider | Retrieve provider details and credentials |
| List Providers | Get all providers with filtering |
| Update Provider | Update provider information |
| Delete Provider | Remove provider from network |
| Get Contracts | Retrieve provider contract details |

## Usage Examples

```javascript
// Check patient eligibility verification
{
  "patient_id": "PAT123456",
  "insurance": {
    "payer_id": "60054",
    "member_id": "ABC123456789",
    "group_number": "GRP001"
  },
  "service_date": "2024-01-15",
  "provider_npi": "1234567890"
}
```

```javascript
// Submit healthcare claim
{
  "claim_type": "professional",
  "patient_id": "PAT123456",
  "provider_npi": "1234567890",
  "service_lines": [
    {
      "procedure_code": "99213",
      "diagnosis_codes": ["Z00.00"],
      "service_date": "2024-01-15",
      "charge_amount": 125.00
    }
  ]
}
```

```javascript
// Process remittance payment
{
  "era_id": "ERA20240115001",
  "claim_id": "CLM123456",
  "payment_amount": 100.00,
  "adjustment_codes": ["CO-45"],
  "check_number": "CHK789123"
}
```

```javascript
// Create denial appeal
{
  "claim_id": "CLM123456",
  "denial_reason": "Missing documentation",
  "appeal_level": 1,
  "supporting_documents": ["medical_records.pdf"],
  "appeal_text": "Submitting complete medical records as requested"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and client ID in credentials |
| Patient Not Found | Specified patient ID does not exist | Check patient ID format and verify patient exists |
| Claim Validation Error | Claim data failed validation rules | Review claim fields against Waystar requirements |
| Eligibility Service Unavailable | Payer eligibility service temporarily down | Retry request or check payer system status |
| Insufficient Permissions | API key lacks required permissions | Contact Waystar support to update API permissions |
| Rate Limit Exceeded | Too many requests sent in time period | Implement request throttling and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-waystar/issues)
- **Waystar API Documentation**: [Waystar Developer Portal](https://developer.waystar.com)
- **Healthcare Integration Community**: [Healthcare API Community](https://community.waystar.com)