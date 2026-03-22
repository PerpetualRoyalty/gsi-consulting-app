/**
 * Onboarding document templates for Good Samaritan Institute.
 * Each function returns a self-contained HTML string with inline styles.
 */

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2d8b7a',
  light: '#f4f7fa',
  text: '#2d3748',
  muted: '#718096',
};

const pageWrapper = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: ${BRAND.text}; line-height: 1.7; background: #fff; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { background: ${BRAND.primary}; color: #fff; padding: 32px 40px; border-radius: 8px 8px 0 0; margin-bottom: 0; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { opacity: 0.8; font-size: 13px; margin-top: 4px; }
    .subheader { background: ${BRAND.light}; padding: 20px 40px; border-bottom: 2px solid ${BRAND.accent}; }
    .subheader h2 { font-size: 18px; color: ${BRAND.primary}; }
    .content { padding: 32px 40px; }
    h3 { color: ${BRAND.primary}; font-size: 16px; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    p, li { font-size: 14px; line-height: 1.8; }
    ol, ul { padding-left: 24px; margin: 8px 0 16px; }
    .sig-block { display: flex; gap: 40px; margin-top: 40px; }
    .sig-box { flex: 1; border-top: 2px solid ${BRAND.primary}; padding-top: 12px; }
    .sig-box label { display: block; font-size: 12px; color: ${BRAND.muted}; margin-top: 16px; }
    .sig-box .line { border-bottom: 1px solid #cbd5e0; height: 32px; margin-top: 4px; }
    .field-group { margin-bottom: 20px; }
    .field-group label { display: block; font-weight: 600; font-size: 13px; color: ${BRAND.primary}; margin-bottom: 6px; }
    .field-group input[type="text"],
    .field-group input[type="email"],
    .field-group input[type="number"],
    .field-group input[type="date"],
    .field-group textarea,
    .field-group select {
      width: 100%; padding: 10px 14px; border: 1px solid #cbd5e0; border-radius: 6px;
      font-size: 14px; font-family: inherit; background: #fff; transition: border-color 0.2s;
    }
    .field-group input:focus, .field-group textarea:focus, .field-group select:focus {
      outline: none; border-color: ${BRAND.accent}; box-shadow: 0 0 0 3px rgba(45,139,122,0.1);
    }
    .field-group textarea { min-height: 80px; resize: vertical; }
    .field-row { display: flex; gap: 20px; }
    .field-row .field-group { flex: 1; }
    .checkbox-group label { display: flex; align-items: center; gap: 8px; font-weight: 400; font-size: 14px; color: ${BRAND.text}; cursor: pointer; margin-bottom: 8px; }
    .checkbox-group input { width: 18px; height: 18px; accent-color: ${BRAND.accent}; }
    .radio-group label { display: flex; align-items: center; gap: 8px; font-weight: 400; font-size: 14px; margin-bottom: 8px; cursor: pointer; }
    .radio-group input { accent-color: ${BRAND.accent}; }
    .rating-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
    .rating-row span { min-width: 180px; font-size: 14px; }
    .rating-row select { width: 80px; padding: 6px 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { font-size: 12px; color: ${BRAND.muted}; }
    @media print { .page { padding: 20px; } .header { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Good Samaritan Institute</h1>
      <p>IT Consulting &amp; Technology Solutions</p>
    </div>
    ${body}
    <div class="footer">
      <p>Good Samaritan Institute &bull; Confidential &bull; Generated ${new Date().toLocaleDateString('en-US')}</p>
    </div>
  </div>
</body>
</html>`;

// ─── NDA ─────────────────────────────────────────────────────────────────────

export function generateNDA(clientName, clientCompany, startDate) {
  const body = `
    <div class="subheader"><h2>Mutual Non-Disclosure Agreement</h2></div>
    <div class="content">
      <p><strong>Effective Date:</strong> ${startDate}</p>
      <p style="margin-top:12px;">
        This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between
        <strong>Good Samaritan Institute</strong> ("GSI") and <strong>${clientCompany}</strong>
        ("Client"), collectively referred to as the "Parties."
      </p>

      <h3>1. Purpose</h3>
      <p>The Parties wish to explore a potential or existing business relationship involving
      IT consulting, technology assessment, and related services (the "Purpose"). In
      connection with the Purpose, each Party may disclose Confidential Information to the
      other Party.</p>

      <h3>2. Definition of Confidential Information</h3>
      <p>"Confidential Information" means any non-public information disclosed by either
      Party, whether orally, in writing, or electronically, including but not limited to:</p>
      <ul>
        <li>Technical data, source code, algorithms, network architectures, and system configurations</li>
        <li>Business plans, financial information, pricing, and customer lists</li>
        <li>Proprietary software, tools, methodologies, and trade secrets</li>
        <li>Security assessments, vulnerability reports, and audit findings</li>
        <li>Employee and personnel information</li>
        <li>Any information designated as "confidential" or that a reasonable person would understand to be confidential</li>
      </ul>

      <h3>3. Obligations of Receiving Party</h3>
      <p>The receiving Party agrees to:</p>
      <ol>
        <li>Hold all Confidential Information in strict confidence and not disclose it to third parties without prior written consent;</li>
        <li>Use Confidential Information solely for the Purpose described herein;</li>
        <li>Restrict access to Confidential Information to employees and contractors who have a need to know and are bound by confidentiality obligations at least as protective as this Agreement;</li>
        <li>Take reasonable security measures to protect Confidential Information, no less than those used to protect its own confidential information of similar sensitivity;</li>
        <li>Promptly notify the disclosing Party of any unauthorized disclosure or use.</li>
      </ol>

      <h3>4. Exclusions</h3>
      <p>Confidential Information does not include information that:</p>
      <ol type="a">
        <li>Was already known to the receiving Party without restriction prior to disclosure;</li>
        <li>Becomes publicly available through no fault of the receiving Party;</li>
        <li>Is independently developed by the receiving Party without reference to the Confidential Information;</li>
        <li>Is received from a third party without breach of any obligation of confidentiality;</li>
        <li>Is required to be disclosed by law or court order, provided the receiving Party gives prompt written notice to the disclosing Party.</li>
      </ol>

      <h3>5. Term</h3>
      <p>This Agreement is effective as of the Effective Date and continues for a period of
      <strong>two (2) years</strong>, unless terminated earlier by either Party with thirty
      (30) days' written notice. The obligations of confidentiality shall survive
      termination for a period of two (2) years.</p>

      <h3>6. Return of Materials</h3>
      <p>Upon termination or upon request of the disclosing Party, the receiving Party shall
      promptly return or destroy all Confidential Information and any copies thereof, and
      provide written certification of such destruction upon request.</p>

      <h3>7. No License or Warranty</h3>
      <p>Nothing in this Agreement grants any license or rights to any intellectual property
      of either Party. Confidential Information is provided "as is" without warranty of any
      kind.</p>

      <h3>8. Governing Law</h3>
      <p>This Agreement shall be governed by and construed in accordance with the laws of the
      state in which Good Samaritan Institute's principal office is located, without regard
      to conflict of law principles.</p>

      <h3>9. Entire Agreement</h3>
      <p>This Agreement constitutes the entire understanding between the Parties regarding
      the subject matter herein and supersedes all prior agreements, whether written or oral.</p>

      <h3 style="margin-top:48px;">Signatures</h3>
      <div class="sig-block">
        <div class="sig-box">
          <strong>Good Samaritan Institute</strong>
          <label>Authorized Signature</label>
          <div class="line"></div>
          <label>Printed Name</label>
          <div class="line"></div>
          <label>Title</label>
          <div class="line"></div>
          <label>Date</label>
          <div class="line"></div>
        </div>
        <div class="sig-box">
          <strong>${clientCompany}</strong>
          <label>Authorized Signature</label>
          <div class="line"></div>
          <label>Printed Name: ${clientName}</label>
          <div class="line"></div>
          <label>Title</label>
          <div class="line"></div>
          <label>Date</label>
          <div class="line"></div>
        </div>
      </div>
    </div>`;

  return pageWrapper(`NDA — ${clientCompany}`, body);
}

// ─── PROJECT INTAKE FORM ─────────────────────────────────────────────────────

export function generateProjectIntakeForm(clientName, clientCompany, agreementType) {
  const body = `
    <div class="subheader"><h2>Project Intake Form</h2></div>
    <div class="content">
      <p>Welcome, <strong>${clientName}</strong>. Please complete this form so we can
      understand your project goals, current environment, and expectations. Your answers
      help us tailor our approach for <strong>${clientCompany}</strong>.</p>

      <h3>Section 1 — Company Overview</h3>
      <div class="field-row">
        <div class="field-group">
          <label>Company Name</label>
          <input type="text" value="${clientCompany}" />
        </div>
        <div class="field-group">
          <label>Industry</label>
          <select>
            <option value="">Select…</option>
            <option>Healthcare</option><option>Finance / Banking</option>
            <option>Education</option><option>Manufacturing</option>
            <option>Retail / E-commerce</option><option>Government</option>
            <option>Technology</option><option>Nonprofit</option>
            <option>Professional Services</option><option>Other</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Company Size (employees)</label>
          <select>
            <option value="">Select…</option>
            <option>1–10</option><option>11–50</option><option>51–200</option>
            <option>201–500</option><option>501–1,000</option><option>1,000+</option>
          </select>
        </div>
        <div class="field-group">
          <label>Primary Contact Name</label>
          <input type="text" value="${clientName}" />
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Contact Email</label>
          <input type="email" />
        </div>
        <div class="field-group">
          <label>Contact Phone</label>
          <input type="text" />
        </div>
      </div>

      <h3>Section 2 — Current Technology Stack</h3>
      <div class="field-group">
        <label>Primary Operating Systems in Use</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> Windows Server</label>
          <label><input type="checkbox" /> Linux (Ubuntu/RHEL/CentOS)</label>
          <label><input type="checkbox" /> macOS</label>
          <label><input type="checkbox" /> Other</label>
        </div>
      </div>
      <div class="field-group">
        <label>Cloud Providers</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> AWS</label>
          <label><input type="checkbox" /> Microsoft Azure</label>
          <label><input type="checkbox" /> Google Cloud Platform</label>
          <label><input type="checkbox" /> On-premises only</label>
          <label><input type="checkbox" /> Other</label>
        </div>
      </div>
      <div class="field-group">
        <label>Key Business Software (ERP, CRM, etc.)</label>
        <textarea placeholder="e.g., Salesforce, SAP, QuickBooks, custom in-house tools…"></textarea>
      </div>
      <div class="field-group">
        <label>Networking Overview</label>
        <textarea placeholder="Describe your network topology, VPN setup, ISPs, firewall solutions…"></textarea>
      </div>

      <h3>Section 3 — Project Objectives</h3>
      <div class="field-group">
        <label>Primary Goals for This Engagement</label>
        <textarea placeholder="What are the top outcomes you'd like from this project?"></textarea>
      </div>
      <div class="field-group">
        <label>How Will You Measure Success?</label>
        <textarea placeholder="Key metrics, KPIs, or benchmarks…"></textarea>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Desired Start Date</label>
          <input type="date" />
        </div>
        <div class="field-group">
          <label>Target Completion</label>
          <input type="date" />
        </div>
      </div>

      <h3>Section 4 — Security &amp; Compliance</h3>
      <div class="field-group">
        <label>Compliance Requirements</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> HIPAA</label>
          <label><input type="checkbox" /> SOC 2</label>
          <label><input type="checkbox" /> PCI-DSS</label>
          <label><input type="checkbox" /> GDPR</label>
          <label><input type="checkbox" /> CMMC / NIST 800-171</label>
          <label><input type="checkbox" /> None / Unsure</label>
        </div>
      </div>
      <div class="field-group">
        <label>Current Security Measures</label>
        <textarea placeholder="Antivirus, EDR, SIEM, MFA, firewall rules, etc."></textarea>
      </div>
      <div class="field-group">
        <label>Have you experienced a security incident in the past 24 months?</label>
        <div class="radio-group">
          <label><input type="radio" name="incident" /> Yes</label>
          <label><input type="radio" name="incident" /> No</label>
          <label><input type="radio" name="incident" /> Prefer not to say</label>
        </div>
      </div>

      <h3>Section 5 — Budget &amp; Resources</h3>
      <div class="field-row">
        <div class="field-group">
          <label>Budget Range</label>
          <select>
            <option value="">Select…</option>
            <option>Under $10,000</option><option>$10,000 – $25,000</option>
            <option>$25,000 – $50,000</option><option>$50,000 – $100,000</option>
            <option>$100,000+</option><option>TBD</option>
          </select>
        </div>
        <div class="field-group">
          <label>Internal IT Team Size</label>
          <select>
            <option value="">Select…</option>
            <option>No IT staff</option><option>1–3</option>
            <option>4–10</option><option>11–25</option><option>25+</option>
          </select>
        </div>
      </div>
      <div class="field-group">
        <label>Who is the primary decision-maker for this project?</label>
        <input type="text" placeholder="Name and title" />
      </div>

      <h3>Section 6 — Priorities</h3>
      <p>Rate each area from 1 (low) to 5 (critical):</p>
      ${['Security & Compliance', 'Performance & Uptime', 'Cost Optimization', 'Scalability', 'User Experience']
        .map(
          (item) => `
      <div class="rating-row">
        <span>${item}</span>
        <select><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option></select>
      </div>`
        )
        .join('')}

      <h3>Section 7 — Additional Notes</h3>
      <div class="field-group">
        <label>Anything else we should know?</label>
        <textarea style="min-height:120px;" placeholder="Any additional context, constraints, or expectations…"></textarea>
      </div>
    </div>`;

  return pageWrapper(`Project Intake Form — ${clientCompany}`, body);
}

// ─── INFRASTRUCTURE QUESTIONNAIRE ────────────────────────────────────────────

export function generateInfraQuestionnaire(clientName, clientCompany) {
  const body = `
    <div class="subheader"><h2>IT Infrastructure Assessment Questionnaire</h2></div>
    <div class="content">
      <p>This questionnaire helps Good Samaritan Institute understand
      <strong>${clientCompany}</strong>'s current IT infrastructure so we can provide
      targeted recommendations.</p>

      <h3>1. Network Infrastructure</h3>
      <div class="field-group">
        <label>Network Topology</label>
        <select>
          <option value="">Select…</option>
          <option>Flat / Single subnet</option><option>Segmented VLANs</option>
          <option>Hub-and-spoke (branch offices)</option><option>SD-WAN</option>
          <option>Hybrid / Complex</option><option>Unknown</option>
        </select>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Primary ISP / Bandwidth</label>
          <input type="text" placeholder="e.g., Comcast 500 Mbps" />
        </div>
        <div class="field-group">
          <label>Backup / Redundant ISP</label>
          <input type="text" placeholder="e.g., AT&T 200 Mbps or None" />
        </div>
      </div>
      <div class="field-group">
        <label>VPN Solution</label>
        <input type="text" placeholder="e.g., Cisco AnyConnect, WireGuard, OpenVPN, None" />
      </div>
      <div class="field-group">
        <label>Firewall / Edge Security</label>
        <input type="text" placeholder="e.g., Palo Alto, Fortinet, pfSense, Meraki MX" />
      </div>

      <h3>2. Server Environment</h3>
      <div class="field-group">
        <label>Hosting Model</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> On-premises data center</label>
          <label><input type="checkbox" /> Colocation facility</label>
          <label><input type="checkbox" /> Cloud IaaS (AWS EC2, Azure VMs, etc.)</label>
          <label><input type="checkbox" /> Cloud PaaS (App Services, Lambda, etc.)</label>
          <label><input type="checkbox" /> Fully SaaS — no self-managed servers</label>
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Total Physical Servers</label>
          <input type="number" placeholder="0" />
        </div>
        <div class="field-group">
          <label>Total Virtual Machines</label>
          <input type="number" placeholder="0" />
        </div>
      </div>
      <div class="field-group">
        <label>Virtualization Platform</label>
        <select>
          <option value="">Select…</option>
          <option>VMware vSphere / ESXi</option><option>Microsoft Hyper-V</option>
          <option>Proxmox</option><option>KVM</option>
          <option>Docker / Kubernetes only</option><option>None</option>
        </select>
      </div>

      <h3>3. Cloud Services</h3>
      <div class="field-group">
        <label>Current Cloud Providers</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> Amazon Web Services (AWS)</label>
          <label><input type="checkbox" /> Microsoft Azure</label>
          <label><input type="checkbox" /> Google Cloud Platform (GCP)</label>
          <label><input type="checkbox" /> DigitalOcean / Linode / Vultr</label>
          <label><input type="checkbox" /> None</label>
        </div>
      </div>
      <div class="field-group">
        <label>Key Cloud Services in Use</label>
        <textarea placeholder="e.g., EC2, S3, RDS, Azure AD, Cloud Functions…"></textarea>
      </div>
      <div class="field-group">
        <label>Approximate Monthly Cloud Spend</label>
        <select>
          <option value="">Select…</option>
          <option>Under $500</option><option>$500 – $2,000</option>
          <option>$2,000 – $10,000</option><option>$10,000 – $50,000</option>
          <option>$50,000+</option><option>Unknown</option>
        </select>
      </div>

      <h3>4. Data Management</h3>
      <div class="field-group">
        <label>Database Systems</label>
        <div class="checkbox-group">
          <label><input type="checkbox" /> SQL Server</label>
          <label><input type="checkbox" /> PostgreSQL</label>
          <label><input type="checkbox" /> MySQL / MariaDB</label>
          <label><input type="checkbox" /> MongoDB</label>
          <label><input type="checkbox" /> Oracle</label>
          <label><input type="checkbox" /> Cloud-managed (RDS, Cloud SQL, etc.)</label>
          <label><input type="checkbox" /> Other</label>
        </div>
      </div>
      <div class="field-group">
        <label>Backup Strategy</label>
        <textarea placeholder="Frequency, retention, tools (Veeam, AWS Backup, etc.), offsite copies…"></textarea>
      </div>
      <div class="field-group">
        <label>Disaster Recovery Plan</label>
        <div class="radio-group">
          <label><input type="radio" name="dr" /> Documented and tested</label>
          <label><input type="radio" name="dr" /> Documented but untested</label>
          <label><input type="radio" name="dr" /> Informal / ad-hoc</label>
          <label><input type="radio" name="dr" /> None</label>
        </div>
      </div>
      <div class="field-group">
        <label>Total Data Volume (approximate)</label>
        <select>
          <option value="">Select…</option>
          <option>Under 100 GB</option><option>100 GB – 1 TB</option>
          <option>1 TB – 10 TB</option><option>10 TB – 100 TB</option>
          <option>100 TB+</option><option>Unknown</option>
        </select>
      </div>

      <h3>5. Security Posture</h3>
      <div class="field-group">
        <label>Endpoint Protection</label>
        <input type="text" placeholder="e.g., CrowdStrike, SentinelOne, Windows Defender, Sophos" />
      </div>
      <div class="field-group">
        <label>SIEM / Log Management</label>
        <input type="text" placeholder="e.g., Splunk, Elastic, Azure Sentinel, None" />
      </div>
      <div class="field-group">
        <label>Multi-Factor Authentication</label>
        <div class="radio-group">
          <label><input type="radio" name="mfa" /> Enforced for all users</label>
          <label><input type="radio" name="mfa" /> Enforced for admins only</label>
          <label><input type="radio" name="mfa" /> Available but optional</label>
          <label><input type="radio" name="mfa" /> Not implemented</label>
        </div>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label>Last Security Audit Date</label>
          <input type="date" />
        </div>
        <div class="field-group">
          <label>Known Vulnerabilities</label>
          <select>
            <option value="">Select…</option>
            <option>None known</option><option>Minor / low-risk</option>
            <option>Several unpatched</option><option>Critical outstanding</option>
            <option>Unknown — no recent scan</option>
          </select>
        </div>
      </div>

      <h3>6. Application Portfolio</h3>
      <div class="field-group">
        <label>Critical Business Applications</label>
        <textarea placeholder="List your top 5-10 mission-critical applications…"></textarea>
      </div>
      <div class="field-group">
        <label>Custom vs. Off-the-Shelf Ratio</label>
        <select>
          <option value="">Select…</option>
          <option>Mostly custom / in-house</option>
          <option>Mix of custom and COTS</option>
          <option>Mostly COTS / SaaS</option>
          <option>All COTS / SaaS</option>
        </select>
      </div>
      <div class="field-group">
        <label>Key Integration Points / APIs</label>
        <textarea placeholder="Describe how your key systems communicate…"></textarea>
      </div>

      <h3>7. User Environment</h3>
      <div class="field-row">
        <div class="field-group">
          <label>Total End Users</label>
          <input type="number" placeholder="0" />
        </div>
        <div class="field-group">
          <label>Remote vs. Onsite Ratio</label>
          <select>
            <option value="">Select…</option>
            <option>Fully remote</option><option>Mostly remote (70%+)</option>
            <option>Hybrid (40-60%)</option><option>Mostly onsite (70%+)</option>
            <option>Fully onsite</option>
          </select>
        </div>
      </div>
      <div class="field-group">
        <label>BYOD Policy</label>
        <div class="radio-group">
          <label><input type="radio" name="byod" /> Fully managed devices only</label>
          <label><input type="radio" name="byod" /> BYOD allowed with MDM</label>
          <label><input type="radio" name="byod" /> BYOD with no management</label>
          <label><input type="radio" name="byod" /> Mixed / no formal policy</label>
        </div>
      </div>
      <div class="field-group">
        <label>Helpdesk / IT Support System</label>
        <input type="text" placeholder="e.g., Jira Service Desk, Freshdesk, Zendesk, internal" />
      </div>

      <h3>8. Pain Points &amp; Wishlist</h3>
      <div class="field-group">
        <label>Top 3 IT Pain Points</label>
        <textarea style="min-height:100px;" placeholder="1.\n2.\n3."></textarea>
      </div>
      <div class="field-group">
        <label>Desired Improvements / Goals</label>
        <textarea placeholder="What does your ideal IT environment look like in 12 months?"></textarea>
      </div>
      <div class="field-group">
        <label>Upcoming Projects or Initiatives</label>
        <textarea placeholder="Any planned migrations, upgrades, expansions, or new deployments?"></textarea>
      </div>
    </div>`;

  return pageWrapper(`IT Infrastructure Assessment — ${clientCompany}`, body);
}
