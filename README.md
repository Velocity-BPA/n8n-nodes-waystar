# n8n-nodes-waystar

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Waystar** healthcare revenue cycle management (RCM) platform. This node provides 22 resources and 150+ operations for complete healthcare billing automation including eligibility verification, claims processing, remittance handling, denial management, and analytics.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Healthcare](https://img.shields.io/badge/Healthcare-RCM-green)

## Features

### Revenue Cycle Management Operations
- **Eligibility Verification (270/271)**: Real-time and batch eligibility checks, coverage info, benefits, deductibles, copays, coinsurance, out-of-pocket amounts
- **Claims Processing (837P/I/D)**: Submit professional, institutional, and dental claims with full service line support
- **Claim Status (276/277)**: Track claim status, history, rejections, and payments
- **Remittance/ERA (835)**: Process electronic remittance advice, payment details, adjustments, reconciliation
- **Prior Authorization**: Submit, track, and manage prior authorization requests
- **Denial Management**: Analyze denials, track appeals, identify recovery opportunities
- **Payment Processing**: Post payments, reconcile, track variances, expected payments

### Additional Capabilities
- **Patient Management**: Demographics, insurance, eligibility history, claims, balances
- **Provider Operations**: NPI validation, enrollment status, credentials, network status
- **Payer Management**: Rules, requirements, connectivity testing, EDI info
- **Billing & Coding**: Charge capture, code validation (ICD-10, CPT, HCPCS), CCI edits
- **Reporting & Analytics**: A/R aging, denial trends, clean claim rate, days in A/R
- **EDI Processing**: Submit/parse EDI files, 997/999/TA1 acknowledgments
- **Batch Operations**: Submit, monitor, and manage batch processes
- **Workflow Management**: Task assignment, queues, workflow automation

### Real-Time Triggers
- Eligibility responses and coverage changes
- Claim submissions, acceptances, rejections, payments, denials
- ERA/remittance receipts and payment postings
- Denial and appeal notifications
- Prior authorization decisions
- Batch completions and EDI acknowledgments
- Workflow task assignments

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-waystar`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-waystar
```

### Development Installation

```bash
# Clone and install
git clone https://github.com/Velocity-BPA/n8n-nodes-waystar.git
cd n8n-nodes-waystar
npm install
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-waystar

# Restart n8n
```

## Credentials Setup

### Waystar API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Environment | Production, Sandbox, or Custom | Yes |
| Client ID | OAuth 2.0 Client ID | Yes |
| Client Secret | OAuth 2.0 Client Secret | Yes |
| Username | Waystar account username | Yes |
| Password | Waystar account password | Yes |
| Organization ID | Your Waystar Organization ID | Yes |
| Site ID | Site ID for multi-site organizations | No |
| NPI | National Provider Identifier | No |

### Waystar EDI Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Sender ID (ISA06) | Your organization's EDI sender ID | Yes |
| Sender Qualifier (ISA05) | Sender ID qualifier type | Yes |
| Receiver ID (ISA08) | Waystar/Payer receiver ID | Yes |
| Receiver Qualifier (ISA07) | Receiver ID qualifier type | Yes |
| Trading Partner ID | Waystar Trading Partner ID | Yes |

### Waystar SFTP Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Host | SFTP server hostname | Yes |
| Port | SFTP port (default: 22) | Yes |
| Username | SFTP username | Yes |
| Authentication Method | Password or Private Key | Yes |
| Inbound Directory | Directory for uploads | No |
| Outbound Directory | Directory for downloads | No |

## Resources & Operations

### Eligibility (270/271)
- Check Eligibility (single and batch)
- Get Coverage Info
- Get Benefits, Deductible, Copay, Coinsurance
- Get Out of Pocket amounts
- Get Coverage Dates
- Parse 271 Response

### Claims (837/276/277)
- Submit Claims (Professional, Institutional, Dental)
- Get Claim Status
- Get Claims by Patient, Date, Status
- Update, Void, Resubmit Claims
- Get Claim Attachments, History, Rejections, Payments

### Remittance (835/ERA)
- Get ERA and ERA List
- Get ERA by Check Number or Date Range
- Get Payment Details and Adjustments
- Parse ERA
- Get Posted/Unposted Payments
- Reconciliation Data

### Prior Authorization
- Submit Prior Auth Request
- Check Status and Get Details
- Update and Cancel
- Get Approved Services
- Search Prior Auths

### Denials
- Get Denials and Details
- Analyze Denial
- Get Denial Trends
- Create and Track Appeals
- Get Recovery Opportunities

### Payments
- Get Payments and Details
- Post Payments
- Get Allocations
- Reconcile Payments
- Get Expected Payments

### And 16 More Resources...
Including Patient, Provider, Payer, Billing, Coding, Statement, Collections, Report, Analytics, Attachment, Enrollment, Batch, EDI, Workflow, User, and Utility operations.

## Usage Examples

### Check Patient Eligibility

```javascript
// Node configuration
{
  "resource": "eligibility",
  "operation": "checkEligibility",
  "payerId": "BCBS1234",
  "memberId": "ABC123456789",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-15",
  "serviceType": "30", // Health Benefit Plan Coverage
  "providerNpi": "1234567890"
}
```

### Submit a Professional Claim

```javascript
// Node configuration
{
  "resource": "claim",
  "operation": "submitClaim",
  "claimType": "837P",
  "payerId": "AETNA001",
  "patientId": "PT-12345",
  "memberId": "MBR-98765",
  "diagnosisCodes": "J06.9, R05.9",
  "serviceLines": {
    "lines": [
      {
        "procedureCode": "99213",
        "modifiers": "25",
        "units": 1,
        "chargeAmount": 150.00,
        "serviceDate": "2024-01-15"
      }
    ]
  }
}
```

### Process ERA/Remittance

```javascript
// Node configuration
{
  "resource": "remittance",
  "operation": "getEraByCheck",
  "checkNumber": "CHK-123456"
}
```

### Analyze Denial

```javascript
// Node configuration
{
  "resource": "denial",
  "operation": "analyzeDenial",
  "claimId": "CLM-789012"
}
```

## Healthcare Concepts

### Revenue Cycle Management (RCM)
The financial process that manages claims processing, payment, and revenue generation from patient registration through final payment.

### EDI Transaction Types
- **270/271**: Eligibility Inquiry/Response
- **276/277**: Claim Status Inquiry/Response
- **837P/I/D**: Professional/Institutional/Dental Claims
- **835**: Electronic Remittance Advice (ERA)
- **997/999**: Functional/Implementation Acknowledgment

### Key Metrics
- **Clean Claim Rate**: Percentage of claims accepted without errors
- **Days in A/R**: Average days to collect payment
- **Collection Rate**: Percentage of billed amount collected
- **Denial Rate**: Percentage of claims denied

### Adjustment Codes
- **CARC**: Claim Adjustment Reason Codes
- **RARC**: Remittance Advice Remark Codes
- **Group Codes**: CO (Contractual), PR (Patient Responsibility), etc.

## Error Handling

The node provides detailed error messages for common scenarios:

- **Authentication Errors**: Invalid credentials or expired tokens
- **Validation Errors**: Invalid NPI, member ID, or claim data
- **Rate Limiting**: Automatic retry-after handling
- **HIPAA Compliance**: PHI masking in logs

## Security Best Practices

1. **Never log PHI** - The node automatically masks sensitive data
2. **Use TLS** - All API communications use HTTPS
3. **Secure credentials** - Store credentials in n8n's encrypted credential store
4. **Audit access** - Enable n8n audit logging for compliance
5. **Minimum necessary** - Only request required data elements

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: licensing@velobpa.com

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
- Personal use
- Educational use
- Research use
- Internal business use (non-production)

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [Waystar API Docs](https://docs.waystar.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-waystar/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Waystar](https://waystar.com) for their healthcare RCM platform
- [n8n](https://n8n.io) for the workflow automation platform
- Healthcare standards organizations (X12, NUCC, CMS)
