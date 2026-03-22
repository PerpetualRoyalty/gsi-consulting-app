// Comprehensive clause library for different service types and industries
const CLAUSE_LIBRARY = {
  services: {
    'cloud migration': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall provide comprehensive cloud migration consulting services, including:

1.1 Assessment Phase
- Current infrastructure audit and inventory
- Cloud readiness assessment
- Architecture gap analysis
- Cost-benefit analysis and ROI modeling
- Security and compliance evaluation
- Risk assessment and mitigation planning

1.2 Design Phase
- Target cloud architecture design
- Network and security architecture
- Data strategy and database design
- Disaster recovery and business continuity planning
- Cost optimization strategy
- Capacity planning

1.3 Migration Phase
- Migration planning and scheduling
- Infrastructure setup and configuration
- Data migration execution
- Application deployment and configuration
- Testing and validation
- Cutover planning and execution

1.4 Post-Migration Phase
- Performance optimization
- Cost monitoring and optimization
- Documentation and knowledge transfer
- Post-migration support and issue resolution
- Training and capability building

All services will be performed in accordance with industry best practices and applicable cloud provider guidelines.`,
      sla: `Service Level Agreement:
- Incident Response: Critical issues within 2 hours, High priority within 4 hours, Medium priority within 8 hours
- Service Availability: Target 99.5% uptime for production systems
- Support Hours: Standard business hours (Monday-Friday 9 AM - 6 PM)
- Escalation: Issues unresolved within response time will be escalated to senior engineers`,
    },
    'cybersecurity audit': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall conduct a comprehensive cybersecurity audit, including:

1.1 Assessment Phase
- Network security assessment and vulnerability scanning
- Infrastructure and endpoint analysis
- Application security review
- Access control and identity management audit
- Data protection and encryption assessment
- Security policy and procedures review

1.2 Penetration Testing (if included)
- External penetration testing
- Internal network penetration testing
- Social engineering assessment
- Vulnerability validation
- Exploitation scenario testing

1.3 Compliance Assessment
- Regulatory compliance evaluation
- Industry standard alignment (ISO 27001, NIST, etc.)
- Security baseline assessment
- Incident response capability review
- Business continuity and disaster recovery assessment

1.4 Reporting and Recommendations
- Detailed findings report with risk ratings
- Prioritized remediation roadmap
- Cost-benefit analysis for recommended improvements
- Implementation timeline and resource planning
- Follow-up assessment planning

All assessments will be conducted professionally with minimal business disruption.`,
      sla: `Service Level Agreement:
- Testing Windows: Scheduled during agreed maintenance windows
- Report Delivery: Within 10 business days of assessment completion
- Clarification Support: Available for 30 days post-report delivery
- Re-assessment: Available at agreed-upon intervals to validate remediation`,
    },
    'digital transformation': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall provide digital transformation consulting services, including:

1.1 Strategy and Planning
- Current state assessment (technology, processes, skills, culture)
- Digital maturity evaluation
- Industry benchmarking and best practices analysis
- Future state definition and roadmap creation
- Technology stack recommendations
- Change management planning

1.2 Process Optimization
- Business process documentation and analysis
- Process redesign and optimization
- Workflow automation identification
- Efficiency improvement planning
- Organizational change impact assessment

1.3 Technology Implementation
- System selection and evaluation
- Implementation planning
- Pilot program design and execution
- Scaling and rollout planning
- Integration planning with existing systems
- Data migration strategies

1.4 Capability Building
- Team training and upskilling
- Process documentation and SOPs
- Knowledge transfer sessions
- Tool adoption support
- Ongoing optimization planning

1.5 Governance and Metrics
- Performance metrics definition
- Success criteria and KPI tracking
- Governance framework implementation
- Risk mitigation strategies`,
      sla: `Service Level Agreement:
- Planning Meetings: Within 2 business days of scheduling request
- Status Updates: Weekly during active engagement
- Deliverable Review: Within 5 business days of delivery
- Support Hours: Standard business hours with emergency escalation available`,
    },
    'cybersecurity retainer': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall provide ongoing cybersecurity consulting services, including:

1.1 Continuous Monitoring and Analysis
- 24/7 security event monitoring and alerts
- Threat intelligence analysis and reporting
- Vulnerability management and scanning
- Network security baseline monitoring
- Incident detection and investigation

1.2 Incident Response
- Incident response planning and coordination
- 24/7 incident response support
- Digital forensics and investigation
- Root cause analysis
- Recovery and remediation planning
- Post-incident reporting and recommendations

1.3 Security Operations
- Security patch management planning
- Access control review and recommendations
- Configuration management oversight
- Compliance monitoring and reporting
- Security awareness training recommendations

1.4 Reporting and Recommendations
- Monthly security status reports
- Quarterly strategic reviews
- Annual security posture assessment
- Threat landscape briefings
- Risk mitigation prioritization

1.5 Consulting Support
- General cybersecurity questions and guidance
- Technology evaluation for security solutions
- Policy and procedure recommendations
- Training and awareness program guidance`,
      sla: `Service Level Agreement:
- Critical Incidents: 1-hour response time, 24/7 availability
- High Priority Issues: 4-hour response time during business hours
- Regular Consulting: Within 2 business days
- Monthly Reporting: By the 5th business day of each month
- Escalation: Available for urgent security concerns`,
    },
    'managed IT services': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall provide comprehensive managed IT services, including:

1.1 Infrastructure Management
- Network management and optimization
- Server and storage administration
- Database administration and optimization
- Cloud infrastructure management
- Backup and disaster recovery management
- Capacity planning and forecasting

1.2 Helpdesk and User Support
- First and second-level helpdesk support
- Ticket management and tracking
- User account management
- Password and access management
- Hardware and software troubleshooting
- Remote and on-site support as needed

1.3 Security Management
- Security updates and patch management
- Antivirus and malware protection management
- Firewall and intrusion detection management
- User access control and permissions
- Regular security assessments
- Incident response support

1.4 Monitoring and Maintenance
- 24/7 system monitoring and alerting
- Proactive maintenance and optimization
- Performance monitoring and reporting
- Log management and analysis
- Hardware maintenance planning
- Software licensing optimization

1.5 Strategic Services
- Technology planning and roadmapping
- Budget forecasting and cost optimization
- Vendor management and negotiations
- Technology training and documentation
- Disaster recovery planning and testing
- Quarterly strategic reviews`,
      sla: `Service Level Agreement:
- Critical Issues: 1-hour response, 4-hour resolution target
- High Priority: 4-hour response, 8-hour resolution target
- Standard: 8-hour response, 24-hour resolution target
- Support Hours: 24/7 with escalation for emergencies
- System Availability: Target 99.5% uptime for critical systems
- Monthly Reporting: By the 5th business day of each month`,
    },
    'it assessment': {
      scope: `1. SCOPE OF SERVICES

The Service Provider shall conduct a comprehensive IT assessment, including:

1.1 Infrastructure Assessment
- Current hardware inventory and condition
- Server and network infrastructure evaluation
- Storage and backup systems assessment
- Disaster recovery capability review
- Capacity and performance analysis
- Obsolescence and end-of-life identification

1.2 Software and Licensing Assessment
- Application inventory and audit
- Software licensing compliance verification
- Outdated and unsupported software identification
- Cloud service evaluation
- Integration capability analysis
- Redundancy and consolidation opportunities

1.3 Security Assessment
- Network security posture evaluation
- Access control review
- Data protection and encryption assessment
- Compliance with industry standards evaluation
- Incident response capability assessment
- Security awareness evaluation

1.4 Operations Assessment
- Current IT processes and procedures documentation
- Staffing and skill gap analysis
- IT service delivery effectiveness
- Ticket management and support processes
- Change management procedures
- Knowledge management systems

1.5 Reporting and Recommendations
- Executive summary with key findings
- Detailed assessment report by category
- Risk assessment and prioritization
- Remediation roadmap with timeline
- Cost-benefit analysis for recommendations
- Implementation approach and resources needed
- Follow-up assessment recommendations`,
      sla: `Service Level Agreement:
- Assessment Timeline: Completed within agreed timeframe
- Report Delivery: Within 10 business days of assessment completion
- Follow-up Consultation: Available for 30 days post-delivery
- Clarification Meetings: Within 3 business days of request`,
    },
  },
  compliance: {
    healthcare: {
      content: `COMPLIANCE REQUIREMENTS - HEALTHCARE

2.1 HIPAA Compliance
The Service Provider acknowledges that it may have access to Protected Health Information (PHI) and agrees to comply with all requirements of the Health Insurance Portability and Accountability Act (HIPAA), 45 CFR Parts 160 and 164.

2.2 Business Associate Agreement
The parties acknowledge that this engagement requires a Business Associate Agreement (BAA) as defined by HIPAA. A separate BAA addendum shall be executed as a condition of this agreement.

2.3 Data Security and Encryption
- All PHI data in transit shall be encrypted using industry-standard protocols (TLS 1.2 or higher)
- All PHI data at rest shall be encrypted using AES-256 or equivalent
- Encryption keys shall be managed securely with access restricted to authorized personnel only
- Regular encryption key rotation shall be performed annually

2.4 Access Controls and Authentication
- Multi-factor authentication (MFA) required for all systems accessing PHI
- Role-based access control (RBAC) implementation for PHI access
- Regular access reviews and audit logs maintained
- Immediate access revocation upon employee termination

2.5 Audit and Compliance
- Regular HIPAA compliance audits (minimum annually)
- Comprehensive audit logs maintained for all PHI access (minimum 6 years retention)
- HIPAA Security Risk Assessment completed annually
- Compliance documentation available for regulatory review

2.6 Incident Notification
- Breach notification procedures in compliance with HIPAA
- Notification to affected individuals within 60 days of discovery
- Notification to HHS and media if required
- Post-incident review and corrective action planning`,
    },
    finance: {
      content: `COMPLIANCE REQUIREMENTS - FINANCIAL SERVICES

2.1 PCI-DSS Compliance
The Service Provider shall comply with Payment Card Industry Data Security Standard (PCI-DSS) version 3.2.1 or later, including:

2.2 Cardholder Data Protection
- No storage of sensitive cardholder data (PIN, CVV, full track data)
- Tokenization of payment card data where required
- Secure transmission of payment data through PCI-compliant networks
- Regular security assessments and vulnerability testing

2.3 SOC 2 Compliance
- Type II SOC 2 audit performed annually
- Security, availability, and confidentiality controls documented
- Audit reports available for client review upon request
- Continuous monitoring and control improvements

2.4 Regulatory Compliance
- Compliance with applicable banking regulations (Gramm-Leach-Bliley Act)
- Information security policies and procedures documented
- Privacy policy established and maintained
- Regulatory audit cooperation and documentation

2.5 Data Protection
- Encryption of all financial data in transit and at rest
- Secure key management practices
- Regular backup and recovery testing
- Data retention policies in compliance with regulations

2.6 Incident Management
- Incident response plan for data breaches
- Notification procedures for regulatory bodies
- Forensic investigation capabilities
- Corrective action and remediation planning`,
    },
    education: {
      content: `COMPLIANCE REQUIREMENTS - EDUCATION

2.1 FERPA Compliance
The Service Provider shall comply with the Family Educational Rights and Privacy Act (FERPA), 20 U.S.C. § 1232g, including:

2.2 Student Privacy Protection
- Protection of personally identifiable information (PII) from student records
- Limited disclosure of student information with proper authorization
- Student and parent access rights to educational records
- Secure storage and handling of student data

2.3 Access Controls
- Role-based access control (RBAC) for student records
- Multi-factor authentication for system access
- Audit trails of all access to student information
- Regular access reviews and certification

2.4 Data Security
- Encryption of student data in transit and at rest
- Secure data destruction procedures upon record disposal
- Regular security assessments and vulnerability testing
- Incident response procedures for data breaches

2.5 Compliance Documentation
- FERPA compliance policies and procedures documented
- Staff training on student privacy requirements
- Regular compliance audits and assessments
- Documentation of third-party agreements

2.6 Notification and Reporting
- Prompt notification of unauthorized access or breaches
- Cooperation with educational institution investigations
- Corrective action planning and implementation`,
    },
    general: {
      content: `COMPLIANCE REQUIREMENTS

2.1 Applicable Laws and Regulations
The Service Provider shall comply with all applicable federal, state, and local laws and regulations in the performance of services, including but not limited to data protection, privacy, and industry-specific requirements.

2.2 Security Standards
The Service Provider shall maintain security controls consistent with industry best practices, including:
- Encryption of sensitive data in transit and at rest
- Access controls and authentication mechanisms
- Regular security assessments and vulnerability testing
- Incident response and breach notification procedures

2.3 Data Protection
- Adherence to applicable data protection regulations
- Privacy policy consistent with industry standards
- Data retention and destruction procedures
- Secure handling of client proprietary information

2.4 Compliance Verification
- Regular compliance assessments and audits
- Maintenance of compliance documentation
- Cooperation with client audit activities
- Prompt reporting of compliance incidents`,
    },
  },
  billingCycles: {
    MONTHLY: {
      template: `COMPENSATION

The Client shall compensate the Service Provider as follows:

- Monthly Fee: $[AMOUNT]
- Billing Cycle: Monthly, in advance
- Payment Due: Net 30 days from invoice date
- First Invoice: Due upon agreement execution
- Subsequent Invoices: Due on the [DAY] day of each month

The monthly fee includes the services outlined in the Scope of Services section. Expenses incurred by the Service Provider in performing the services (travel, third-party tools, etc.) shall be billed separately at cost plus 10%.

Late Payment Terms:
- Overdue invoices will accrue interest at 1.5% per month (18% annually)
- Invoicing will continue during any payment dispute period
- Persistent late payment may result in service suspension after 15 days`,
    },
    QUARTERLY: {
      template: `COMPENSATION

The Client shall compensate the Service Provider as follows:

- Quarterly Fee: $[AMOUNT]
- Billing Cycle: Quarterly, in advance
- Payment Due: Net 30 days from invoice date
- Invoice Schedule: January, April, July, October
- First Invoice: Due upon agreement execution

The quarterly fee includes the services outlined in the Scope of Services section. Expenses incurred by the Service Provider in performing the services (travel, third-party tools, etc.) shall be billed separately at cost plus 10%.

Late Payment Terms:
- Overdue invoices will accrue interest at 1.5% per month (18% annually)
- Invoicing will continue during any payment dispute period
- Persistent late payment (30+ days) may result in service suspension`,
    },
    ANNUAL: {
      template: `COMPENSATION

The Client shall compensate the Service Provider as follows:

- Annual Fee: $[AMOUNT]
- Billing Cycle: Annually, in advance
- Payment Due: Net 30 days from invoice date
- Invoice Date: [START_DATE] annually
- First Invoice: Due upon agreement execution

The annual fee includes the services outlined in the Scope of Services section. Expenses incurred by the Service Provider in performing the services (travel, third-party tools, etc.) shall be billed separately at cost plus 10%.

A 5% discount is applied to annual prepayment.

Late Payment Terms:
- Overdue invoices will accrue interest at 1.5% per month (18% annually)
- Invoicing will continue during any payment dispute period
- Service suspension may occur if payment is 30+ days overdue`,
    },
    ONE_TIME: {
      template: `COMPENSATION

The Client shall compensate the Service Provider as follows:

- Project Fee: $[AMOUNT]
- Payment Due: Net 30 days from invoice date
- Invoice: Upon completion of deliverables or as per project milestones

The project fee covers the services and deliverables outlined in the Scope of Services section. Expenses incurred by the Service Provider (travel, third-party tools, software, etc.) shall be billed separately at cost plus 10%.

Payment terms:
- 50% deposit due upon agreement execution
- 50% balance due upon project completion
OR
- Full payment upon invoice (if approved by mutual agreement)

Late Payment Terms:
- Overdue invoices will accrue interest at 1.5% per month (18% annually)
- Project work may be suspended if payment is 15+ days overdue`,
    },
  },
};

// Parser to extract details from plain language prompt
function parsePrompt(prompt) {
  const parsed = {
    duration: null,
    projectType: null,
    companySize: null,
    industry: null,
    amount: null,
    billingCycle: null,
    compliance: [],
    raw: prompt,
  };

  const promptLower = prompt.toLowerCase();

  // Extract duration
  const durationMatch = prompt.match(/(\d+)\s*(month|year|week)(s)?/i);
  if (durationMatch) {
    const num = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    parsed.duration = unit.startsWith('y') ? num * 12 : unit.startsWith('w') ? Math.ceil(num / 4) : num;
  }

  // Extract project type
  const projectTypes = ['cloud migration', 'cybersecurity audit', 'cybersecurity retainer', 'digital transformation', 'managed IT', 'it assessment', 'network', 'security', 'infrastructure', 'application', 'database', 'staff augmentation'];
  for (const type of projectTypes) {
    if (promptLower.includes(type)) {
      parsed.projectType = type;
      break;
    }
  }

  // Extract company size
  if (promptLower.includes('enterprise') || promptLower.includes('1000+') || promptLower.includes('thousand')) {
    parsed.companySize = 'enterprise';
  } else if (promptLower.includes('mid-size') || promptLower.includes('mid-market') || promptLower.includes('250-1000')) {
    parsed.companySize = 'midmarket';
  } else if (promptLower.includes('small') || promptLower.includes('startup') || promptLower.includes('50-250') || promptLower.includes('50 person')) {
    parsed.companySize = 'small';
  }

  // Extract industry
  const industries = {
    healthcare: ['healthcare', 'hospital', 'medical', 'pharma', 'clinic', 'patient'],
    finance: ['bank', 'financial', 'fintech', 'insurance', 'payment', 'trading'],
    education: ['school', 'university', 'education', 'college', 'district', 'k-12'],
    technology: ['tech', 'software', 'saas', 'startup', 'it company', 'developer'],
    retail: ['retail', 'ecommerce', 'store', 'commerce', 'shopping'],
    manufacturing: ['manufacturing', 'industrial', 'factory', 'production'],
    nonprofit: ['nonprofit', 'non-profit', 'charity', 'foundation'],
  };

  for (const [ind, keywords] of Object.entries(industries)) {
    if (keywords.some(kw => promptLower.includes(kw))) {
      parsed.industry = ind;
      break;
    }
  }

  // Extract amount
  const amountMatch = prompt.match(/\$?([\d,]+(?:\.\d{2})?)/);
  if (amountMatch) {
    parsed.amount = parseInt(amountMatch[1].replace(/,/g, ''));
  }

  // Extract billing cycle
  if (promptLower.includes('/month') || promptLower.includes('monthly') || promptLower.includes('per month')) {
    parsed.billingCycle = 'MONTHLY';
  } else if (promptLower.includes('/quarter') || promptLower.includes('quarterly') || promptLower.includes('per quarter')) {
    parsed.billingCycle = 'QUARTERLY';
  } else if (promptLower.includes('/year') || promptLower.includes('annually') || promptLower.includes('per year') || promptLower.includes('annual')) {
    parsed.billingCycle = 'ANNUAL';
  } else if (promptLower.includes('fixed') || promptLower.includes('one-time') || promptLower.includes('one time')) {
    parsed.billingCycle = 'ONE_TIME';
  } else if (parsed.duration && !parsed.billingCycle) {
    // Default based on duration
    parsed.billingCycle = parsed.duration >= 12 ? 'MONTHLY' : parsed.duration >= 6 ? 'MONTHLY' : 'ONE_TIME';
  }

  // Extract compliance requirements
  if (promptLower.includes('hipaa') || promptLower.includes('phi') || promptLower.includes('healthcare')) {
    parsed.compliance.push('HIPAA');
  }
  if (promptLower.includes('pci') || promptLower.includes('payment') || promptLower.includes('finance')) {
    parsed.compliance.push('PCI-DSS');
  }
  if (promptLower.includes('soc2') || promptLower.includes('soc 2')) {
    parsed.compliance.push('SOC2');
  }
  if (promptLower.includes('ferpa') || promptLower.includes('education') || promptLower.includes('school')) {
    parsed.compliance.push('FERPA');
  }
  if (promptLower.includes('gdpr') || promptLower.includes('eu') || promptLower.includes('european')) {
    parsed.compliance.push('GDPR');
  }
  if (promptLower.includes('iso 27001') || promptLower.includes('iso27001')) {
    parsed.compliance.push('ISO 27001');
  }

  return parsed;
}

// Generate a complete agreement based on parsed data
function generateAgreementContent(parsed) {
  const serviceType = parsed.projectType || 'general consulting';
  const industry = parsed.industry || 'general';
  const billingCycle = parsed.billingCycle || 'MONTHLY';
  const amount = parsed.amount || 5000;
  const duration = parsed.duration || 6;
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);
  const endDateStr = endDate.toISOString().split('T')[0];

  // Build sections
  let content = `STATEMENT OF WORK & SERVICE AGREEMENT

This Statement of Work ("SOW") and Service Agreement sets forth the terms and conditions of the consulting services to be provided by Good Samaritan Institute ("Service Provider") to the Client.

EFFECTIVE DATE: ${startDate}

`;

  // Scope of Services
  const scopeClause = CLAUSE_LIBRARY.services[serviceType]?.scope ||
    CLAUSE_LIBRARY.services['managed IT services'].scope;
  content += scopeClause + '\n\n';

  // Term and Renewal
  content += `2. TERM AND RENEWAL

2.1 Initial Term
This Agreement shall commence on ${startDate} and shall continue through ${endDateStr} (the "Initial Term"), unless terminated earlier in accordance with the termination provisions below.

2.2 Renewal
Upon expiration of the Initial Term, this Agreement may be renewed by mutual written consent of both parties. If renewed, the terms shall remain the same unless otherwise agreed in writing.

2.3 Continuation
If neither party provides written notice of non-renewal at least thirty (30) days prior to the expiration of the term, this Agreement shall automatically renew for successive periods of the same duration.

`;

  // Compensation
  const billingTemplate = CLAUSE_LIBRARY.billingCycles[billingCycle].template
    .replace('[AMOUNT]', amount.toLocaleString())
    .replace('[START_DATE]', startDate)
    .replace('[DAY]', '1');
  content += `3. ${billingTemplate}\n\n`;

  // Compliance
  let complianceContent = '4. ';
  if (parsed.compliance.length > 0) {
    const complianceTexts = [];
    if (parsed.compliance.includes('HIPAA')) {
      complianceTexts.push(CLAUSE_LIBRARY.compliance.healthcare.content);
    }
    if (parsed.compliance.includes('PCI-DSS')) {
      complianceTexts.push(CLAUSE_LIBRARY.compliance.finance.content);
    }
    if (parsed.compliance.includes('FERPA')) {
      complianceTexts.push(CLAUSE_LIBRARY.compliance.education.content);
    }
    if (parsed.compliance.includes('SOC2')) {
      complianceTexts.push('SOC2 COMPLIANCE\n\nThe Service Provider shall maintain SOC 2 Type II certification throughout the engagement. Annual audit reports shall be made available to the Client upon request.');
    }
    if (parsed.compliance.includes('ISO 27001')) {
      complianceTexts.push('ISO 27001 COMPLIANCE\n\nThe Service Provider maintains ISO 27001 certification and shall comply with all information security requirements defined in the standard.');
    }
    if (parsed.compliance.includes('GDPR')) {
      complianceTexts.push('DATA PROTECTION AND GDPR COMPLIANCE\n\nThe Service Provider shall comply with the EU General Data Protection Regulation (GDPR) for processing of personal data. A Data Processing Agreement (DPA) shall be executed as a condition of this agreement.');
    }

    if (complianceTexts.length > 0) {
      complianceContent += complianceTexts.join('\n\n') + '\n\n';
    } else {
      complianceContent += CLAUSE_LIBRARY.compliance.general.content + '\n\n';
    }
  } else {
    complianceContent += CLAUSE_LIBRARY.compliance.general.content + '\n\n';
  }
  content += complianceContent;

  // Service Level Agreement
  const slaClause = CLAUSE_LIBRARY.services[serviceType]?.sla ||
    `Service Level Agreement:
- Response Time: Within 24 business hours for all inquiries
- Support Hours: Standard business hours (Monday-Friday 9 AM - 6 PM)
- Escalation: Available for critical issues`;
  content += `5. ${slaClause}\n\n`;

  // Confidentiality
  content += `6. CONFIDENTIALITY AND DATA PROTECTION

6.1 Confidential Information
Both parties agree to:
- Maintain confidentiality of all proprietary information disclosed by the other party
- Not disclose any confidential information without prior written consent
- Limit access to confidential information to employees with a need-to-know
- Return or securely destroy all confidential materials upon termination
- Protect confidential information for a period of three (3) years after termination

6.2 Data Protection
The Service Provider shall:
- Implement appropriate technical and organizational security measures
- Comply with applicable data protection laws and regulations
- Maintain appropriate access controls and audit trails
- Notify Client of any unauthorized data access or breach within 24 hours
- Cooperate fully in data breach investigations and remediation

6.3 Exclusions
Confidentiality obligations shall not apply to information that:
- Was publicly available at the time of disclosure
- Is or becomes publicly available through no breach by the receiving party
- Was rightfully possessed prior to disclosure
- Is independently developed without use of confidential information
- Is required to be disclosed by law or court order (with advance notice when possible)

`;

  // Intellectual Property
  content += `7. INTELLECTUAL PROPERTY RIGHTS

7.1 Work Product Ownership
The Client shall retain full ownership of all deliverables, work product, and documentation created specifically for the Client under this Agreement.

7.2 Pre-existing Materials
The Service Provider retains ownership of all pre-existing tools, methodologies, templates, frameworks, and intellectual property developed prior to this engagement. The Client shall have a non-exclusive, royalty-free license to use such methodologies as incorporated in the deliverables.

7.3 Third-Party Materials
The Service Provider shall maintain all necessary licenses for third-party software, tools, and intellectual property used in performance of the services.

7.4 Copyrights and Patents
The parties agree that:
- Client retains all copyrights to custom code and deliverables
- Service Provider retains copyrights to pre-existing methodologies and tools
- All work shall be performed in compliance with applicable copyright laws

`;

  // Termination
  content += `8. TERMINATION

8.1 Termination for Convenience
Either party may terminate this Agreement:
- With thirty (30) days written notice to the other party
- The terminating party shall pay all fees and reimbursable expenses incurred through the termination date
- Upon termination, the Service Provider shall deliver all work product and transition support

8.2 Termination for Cause
Either party may terminate this Agreement immediately upon written notice if:
- The other party materially breaches this Agreement and fails to cure such breach within ten (10) days of receiving notice
- The other party becomes insolvent or bankrupt
- The other party ceases business operations

8.3 Effect of Termination
Upon termination:
- The Client shall pay invoices for all services rendered through the termination date
- The Service Provider shall return or destroy all Client confidential information
- Confidentiality obligations shall survive termination
- Accrued fees and expenses remain due

`;

  // Independent Contractor
  content += `9. INDEPENDENT CONTRACTOR STATUS

The Service Provider is an independent contractor and not an employee of the Client. The Service Provider is responsible for:
- All payroll taxes, withholdings, and employment-related obligations
- Professional liability insurance
- Compliance with applicable labor and tax laws
- Any business licenses or permits required for service delivery

The Client shall not provide employee benefits, insurance coverage, or unemployment compensation to the Service Provider.

`;

  // Limitation of Liability
  content += `10. LIMITATION OF LIABILITY

10.1 Exclusion of Consequential Damages
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR:
- Indirect, incidental, special, or consequential damages
- Lost profits, revenue, or business opportunities
- Lost data or information
- Claims arising from delays or business interruptions
- Even if advised of the possibility of such damages

10.2 Cap on Liability
EXCEPT FOR BREACH OF CONFIDENTIALITY OR GROSS NEGLIGENCE, EACH PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE AMOUNTS PAID OR PAYABLE DURING THE PRECEDING TWELVE (12) MONTHS.

10.3 No Warranty
THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

`;

  // Insurance
  content += `11. INSURANCE

The Service Provider shall maintain:
- Professional liability insurance with minimum coverage of $1,000,000 per claim
- General liability insurance with minimum coverage of $1,000,000
- Cyber liability insurance appropriate to the services provided
- Coverage shall remain in effect throughout the engagement and for twelve (12) months following termination

`;

  // Governing Law
  content += `12. GOVERNING LAW AND DISPUTE RESOLUTION

12.1 Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located, without regard to conflicts of law principles.

12.2 Dispute Resolution
Before initiating legal proceedings:
- The parties shall attempt to resolve disputes through good faith negotiation
- If negotiation fails, disputes shall be resolved through mediation
- Mediation shall be conducted in a mutually agreed location
- Cost of mediation shall be shared equally by both parties

12.3 Jurisdiction
Both parties consent to jurisdiction in the courts located in the state in which the Client operates.

`;

  // Limitation of Commitment
  content += `13. AVAILABILITY AND RESOURCES

13.1 Engagement Model
The Service Provider shall provide the services on a consulting basis, providing:
- Strategic guidance and recommendations
- Implementation planning and oversight
- Training and knowledge transfer
- The actual implementation of services may be performed by the Client or third parties as agreed

13.2 Key Personnel
The Service Provider shall assign qualified personnel to the engagement. If key personnel become unavailable, the Service Provider shall provide equivalent replacements with Client approval.

13.3 Equipment and Tools
Unless otherwise agreed:
- The Client shall provide necessary equipment, software licenses, and access
- The Service Provider shall provide consulting expertise and methodologies
- Third-party software costs shall be billed separately

`;

  // Entire Agreement
  content += `14. ENTIRE AGREEMENT

14.1 Integration
This Agreement (including any attachments and exhibits) constitutes the entire agreement between the parties and supersedes all prior understandings, whether written or oral, relating to the subject matter.

14.2 Amendments
No amendments or modifications shall be valid unless made in writing and signed by authorized representatives of both parties.

14.3 Waiver
The failure of either party to enforce any provision shall not constitute a waiver of that provision or any other provision.

14.4 Severability
If any provision is found to be unenforceable, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full effect.

`;

  // Signatures
  content += `15. SIGNATURES

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

GOOD SAMARITAN INSTITUTE
(Service Provider)

By: _____________________________
Name: ___________________________
Title: ____________________________
Date: ____________________________


CLIENT

By: _____________________________
Name: ___________________________
Title: ____________________________
Date: ____________________________
`;

  return content;
}

// Main generation function
export async function generateAgreement(prompt) {
  try {
    const parsed = parsePrompt(prompt);

    // Determine title
    const title = `${parsed.projectType ? parsed.projectType.charAt(0).toUpperCase() + parsed.projectType.slice(1) : 'Professional Services'} Agreement`;

    // Determine type
    let type = 'PROJECT';
    if (parsed.billingCycle === 'MONTHLY' || parsed.billingCycle === 'QUARTERLY' || parsed.billingCycle === 'ANNUAL') {
      type = 'RETAINER';
    }

    // Generate content
    const content = generateAgreementContent(parsed);

    // Create summary
    const summaryParts = [];
    if (parsed.projectType) summaryParts.push(parsed.projectType);
    if (parsed.duration) summaryParts.push(`${parsed.duration}-month engagement`);
    if (parsed.amount) summaryParts.push(`$${parsed.amount.toLocaleString()}`);
    if (parsed.billingCycle) summaryParts.push(`(${parsed.billingCycle.toLowerCase()})`);

    const summary = `Professional services agreement for ${summaryParts.join(' ')}${parsed.compliance.length > 0 ? ` with ${parsed.compliance.join(', ')} compliance requirements` : ''}.`;

    return {
      title,
      type,
      amount: parsed.amount || 0,
      billingCycle: parsed.billingCycle || 'MONTHLY',
      duration: parsed.duration || 6,
      industry: parsed.industry || 'general',
      compliance: parsed.compliance,
      content,
      summary,
    };
  } catch (error) {
    throw new Error(`Agreement generation failed: ${error.message}`);
  }
}
