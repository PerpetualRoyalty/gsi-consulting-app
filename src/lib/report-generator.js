import prisma from '@/lib/prisma';

/**
 * Generate a beautiful, branded HTML report for a client
 * Can be converted to PDF or displayed in browser
 */
export async function generateClientReport({
  clientId,
  reportType = 'monthly', // 'monthly' | 'quarterly'
  periodStart,
  periodEnd,
}) {
  try {
    // Fetch client data
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

    // Fetch agreements for the client
    const agreements = await prisma.agreement.findMany({
      where: { clientId },
    });

    // Fetch payments within the period
    const payments = await prisma.payment.findMany({
      where: {
        clientId,
        createdAt: {
          gte: new Date(periodStart),
          lte: new Date(periodEnd),
        },
      },
    });

    // Fetch documents delivered within the period
    const documents = await prisma.document.findMany({
      where: {
        sharedWithId: clientId,
        createdAt: {
          gte: new Date(periodStart),
          lte: new Date(periodEnd),
        },
      },
    });

    // Fetch messages exchanged within the period
    const messages = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: new Date(periodStart),
          lte: new Date(periodEnd),
        },
        OR: [{ senderId: clientId }, { receiverId: clientId }],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate metrics
    const totalBilled = payments
      .filter((p) => p.status !== 'REFUNDED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPaid = payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const outstanding = totalBilled - totalPaid;

    const messagesExchanged = messages.length;
    const documentsDelivered = documents.length;

    // Calculate average response time (simplified)
    const avgResponseTime = calculateAvgResponseTime(messages);

    // Format dates
    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);
    const periodLabel = `${startDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })} ${reportType === 'quarterly' ? `- Q${Math.ceil((startDate.getMonth() + 1) / 3)}` : ''}`;

    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Generate HTML report
    const html = generateHTML({
      clientName: client.name,
      clientCompany: client.company || 'N/A',
      reportType,
      periodLabel,
      generatedDate,
      agreements,
      payments,
      documents,
      messages,
      totalBilled,
      totalPaid,
      outstanding,
      messagesExchanged,
      documentsDelivered,
      avgResponseTime,
    });

    return {
      html,
      metadata: {
        clientName: client.name,
        clientCompany: client.company || 'N/A',
        reportType,
        periodStart,
        periodEnd,
        periodLabel,
        totalBilled,
        totalPaid,
        outstanding,
        messagesExchanged,
        documentsDelivered,
        generatedDate,
      },
    };
  } catch (error) {
    console.error('Error generating client report:', error);
    throw error;
  }
}

/**
 * Calculate average response time from messages
 */
function calculateAvgResponseTime(messages) {
  if (messages.length < 2) return 'N/A';

  let totalTime = 0;
  let count = 0;

  for (let i = 1; i < messages.length; i++) {
    const current = new Date(messages[i].createdAt);
    const previous = new Date(messages[i - 1].createdAt);
    const diffHours = (current - previous) / (1000 * 60 * 60);
    if (diffHours < 48) {
      // Only count reasonable response times
      totalTime += diffHours;
      count++;
    }
  }

  if (count === 0) return 'N/A';
  const avgHours = Math.round(totalTime / count);
  return `${avgHours}h`;
}

/**
 * Generate beautiful HTML report
 */
function generateHTML({
  clientName,
  clientCompany,
  reportType,
  periodLabel,
  generatedDate,
  agreements,
  payments,
  documents,
  messages,
  totalBilled,
  totalPaid,
  outstanding,
  messagesExchanged,
  documentsDelivered,
  avgResponseTime,
}) {
  const reportTitle =
    reportType === 'monthly' ? 'Monthly Client Report' : 'Quarterly Client Report';

  const paymentOnTimePercentage = calculatePaymentOnTimePercentage(payments);
  const avgDaysToPay = calculateAvgDaysToPay(payments);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${clientCompany}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .page-break {
        page-break-after: always;
      }
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f7fa;
      padding: 20px;
    }

    .report-container {
      background: white;
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Header Section */
    .header {
      background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
      color: white;
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: 'CONFIDENTIAL';
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      font-weight: bold;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0 0 0 20px;
    }

    .logo {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 40px;
      letter-spacing: 0.5px;
    }

    .header h1 {
      font-size: 36px;
      margin-bottom: 12px;
      font-weight: 700;
    }

    .header .client-info {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .client-info-item {
      font-size: 14px;
    }

    .client-info-item label {
      opacity: 0.8;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: block;
    }

    .client-info-item value {
      font-size: 16px;
      font-weight: 600;
    }

    /* Content Sections */
    .section {
      padding: 40px;
      border-bottom: 1px solid #e5e7eb;
    }

    .section:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e3a5f;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #2d8b7a;
      display: inline-block;
    }

    /* Executive Summary */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      border-left: 4px solid #2d8b7a;
    }

    .metric-card.primary {
      border-left-color: #1e3a5f;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 700;
      color: #1e3a5f;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }

    thead {
      background-color: #f3f4f6;
    }

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #1e3a5f;
      border-bottom: 2px solid #d1d5db;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody tr:hover {
      background-color: #f9fafb;
    }

    /* Status Badges */
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge.success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .badge.pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge.active {
      background-color: #bfdbfe;
      color: #1e40af;
    }

    /* Summary Box */
    .summary-text {
      background-color: #f0f9ff;
      border-left: 4px solid #2d8b7a;
      padding: 20px;
      margin-bottom: 24px;
      border-radius: 4px;
      line-height: 1.8;
      color: #374151;
    }

    /* Deliverables List */
    .deliverables-list {
      list-style: none;
      margin: 20px 0;
    }

    .deliverables-list li {
      padding: 12px 0;
      padding-left: 28px;
      position: relative;
      border-bottom: 1px solid #e5e7eb;
    }

    .deliverables-list li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #2d8b7a;
      font-weight: bold;
      font-size: 18px;
    }

    /* Footer */
    .footer {
      background-color: #f3f4f6;
      border-top: 1px solid #d1d5db;
      padding: 20px 40px;
      font-size: 12px;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-left {
      flex: 1;
    }

    .footer-right {
      text-align: right;
    }

    .page-number {
      color: #9ca3af;
    }

    /* Financial Summary Grid */
    .financial-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 24px 0;
    }

    .financial-box {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }

    .financial-box-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .financial-box-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e3a5f;
    }

    /* Health Indicator */
    .health-indicator {
      width: 100%;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 12px;
    }

    .health-bar {
      height: 100%;
      background: linear-gradient(90deg, #2d8b7a 0%, #059669 100%);
      border-radius: 4px;
    }

    .health-bar.warning {
      background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
    }

    .health-bar.critical {
      background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    }

    /* Messages Summary */
    .message-thread {
      background: #f9fafb;
      border-left: 3px solid #2d8b7a;
      padding: 12px 16px;
      margin: 12px 0;
      border-radius: 4px;
      font-size: 13px;
    }

    .message-thread-topic {
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 4px;
    }

    /* Next Steps */
    .next-steps-list {
      list-style: none;
      margin: 20px 0;
    }

    .next-steps-list li {
      padding: 12px 0;
      padding-left: 28px;
      position: relative;
      border-bottom: 1px solid #e5e7eb;
    }

    .next-steps-list li:before {
      content: '→';
      position: absolute;
      left: 0;
      color: #2d8b7a;
      font-weight: bold;
      font-size: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .header .client-info {
        grid-template-columns: 1fr;
      }

      .financial-summary {
        grid-template-columns: 1fr;
      }

      .section {
        padding: 24px;
      }

      table {
        font-size: 12px;
      }

      th,
      td {
        padding: 8px 12px;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">Good Samaritan Institute</div>
      <h1>${reportTitle}</h1>
      <div class="client-info">
        <div class="client-info-item">
          <label>Client Company</label>
          <value>${clientCompany}</value>
        </div>
        <div class="client-info-item">
          <label>Client Name</label>
          <value>${clientName}</value>
        </div>
        <div class="client-info-item">
          <label>Reporting Period</label>
          <value>${periodLabel}</value>
        </div>
        <div class="client-info-item">
          <label>Generated On</label>
          <value>${generatedDate}</value>
        </div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="section">
      <h2 class="section-title">Executive Summary</h2>
      <div class="summary-text">
        <p>During the reporting period of ${periodLabel}, Good Samaritan Institute has delivered comprehensive IT consulting services to ${clientCompany}. This report summarizes key deliverables, financial activities, and engagement metrics.</p>
      </div>
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-value">${documents.length}</div>
          <div class="metric-label">Deliverables</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${messagesExchanged}</div>
          <div class="metric-label">Communications</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$${totalBilled.toLocaleString()}</div>
          <div class="metric-label">Invoiced</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${paymentOnTimePercentage}%</div>
          <div class="metric-label">On-Time Payment</div>
        </div>
      </div>
    </div>

    <!-- Engagement Overview -->
    <div class="section">
      <h2 class="section-title">Engagement Overview</h2>
      ${
        agreements.length > 0
          ? `
        <table>
          <thead>
            <tr>
              <th>Agreement</th>
              <th>Type</th>
              <th>Status</th>
              <th>Retainer Amount</th>
            </tr>
          </thead>
          <tbody>
            ${agreements
              .map(
                (agreement) => `
              <tr>
                <td><strong>${agreement.title}</strong></td>
                <td>${agreement.type}</td>
                <td><span class="badge ${
                  agreement.status === 'active' ? 'active' : 'pending'
                }">${agreement.status}</span></td>
                <td>$${(agreement.retainerAmount || 0).toLocaleString()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : '<p>No active agreements during this period.</p>'
      }
    </div>

    <!-- Work Completed -->
    <div class="section">
      <h2 class="section-title">Work Completed</h2>
      ${
        documents.length > 0
          ? `
        <h3 style="font-size: 16px; color: #374151; margin-bottom: 16px; margin-top: 24px;">Deliverables</h3>
        <ul class="deliverables-list">
          ${documents.map((doc) => `<li>${doc.name} <em style="color: #9ca3af; font-size: 12px;">(${doc.category})</em></li>`).join('')}
        </ul>
      `
          : '<p>No documents delivered during this period.</p>'
      }
    </div>

    <!-- Financial Summary -->
    <div class="section">
      <h2 class="section-title">Financial Summary</h2>
      <div class="financial-summary">
        <div class="financial-box">
          <div class="financial-box-label">Total Invoiced</div>
          <div class="financial-box-value">$${totalBilled.toLocaleString()}</div>
        </div>
        <div class="financial-box">
          <div class="financial-box-label">Total Paid</div>
          <div class="financial-box-value">$${totalPaid.toLocaleString()}</div>
        </div>
        <div class="financial-box">
          <div class="financial-box-label">Outstanding</div>
          <div class="financial-box-value" style="color: ${outstanding > 0 ? '#dc2626' : '#059669'};">$${outstanding.toLocaleString()}</div>
        </div>
      </div>

      <h3 style="font-size: 16px; color: #374151; margin-bottom: 16px; margin-top: 24px;">Payment Health</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">On-Time Payment Rate</p>
          <div class="health-indicator">
            <div class="health-bar" style="width: ${Math.max(paymentOnTimePercentage, 10)}%; ${
    paymentOnTimePercentage < 70 ? 'background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);' : ''
  }"></div>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">${paymentOnTimePercentage}%</p>
        </div>
        <div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Average Days to Pay</p>
          <p style="font-size: 24px; font-weight: 700; color: #1e3a5f;">${avgDaysToPay}</p>
        </div>
      </div>

      ${
        payments.length > 0
          ? `
        <h3 style="font-size: 16px; color: #374151; margin-bottom: 16px; margin-top: 24px;">Invoice Details</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${payments
              .map(
                (payment) => `
              <tr>
                <td>${new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>${payment.type}</td>
                <td>$${payment.amount.toLocaleString()}</td>
                <td><span class="badge ${payment.status === 'paid' ? 'success' : 'pending'}">${payment.status}</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }
    </div>

    <!-- Communication Summary -->
    <div class="section">
      <h2 class="section-title">Communication Summary</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-value">${messagesExchanged}</div>
          <div class="metric-label">Total Messages</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${avgResponseTime}</div>
          <div class="metric-label">Avg Response Time</div>
        </div>
      </div>
      ${
        messages.length > 0
          ? `
        <h3 style="font-size: 16px; color: #374151; margin-bottom: 16px;">Recent Communication Topics</h3>
        ${messages
          .slice(0, 5)
          .map((msg) => {
            const preview = msg.content.substring(0, 50).replace(/\n/g, ' ');
            return `<div class="message-thread"><div class="message-thread-topic">${preview}${msg.content.length > 50 ? '...' : ''}</div></div>`;
          })
          .join('')}
      `
          : ''
      }
    </div>

    <!-- Next Steps -->
    <div class="section">
      <h2 class="section-title">Next Steps & Recommendations</h2>
      <ul class="next-steps-list">
        <li>Schedule next period planning meeting by end of month</li>
        <li>Review and prioritize pending action items</li>
        <li>Discuss budget allocation for upcoming initiatives</li>
        <li>Assess technology roadmap alignment</li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        Good Samaritan Institute | Confidential<br />
        <span style="font-size: 11px; margin-top: 4px; display: block;">Contact: doug@goodsamaritaninstitute.org</span>
      </div>
      <div class="footer-right">
        <span class="page-number">Page 1</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Calculate payment on-time percentage
 */
function calculatePaymentOnTimePercentage(payments) {
  if (payments.length === 0) return 0;

  const paidOnTime = payments.filter((p) => {
    if (p.status !== 'paid') return false;
    const createdDate = new Date(p.createdAt);
    const paidDate = new Date(p.paidAt);
    const daysDiff = (paidDate - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Assume 30 days is "on-time"
  }).length;

  return Math.round((paidOnTime / payments.length) * 100);
}

/**
 * Calculate average days to pay
 */
function calculateAvgDaysToPay(payments) {
  const paidPayments = payments.filter((p) => p.status === 'paid' && p.paidAt);

  if (paidPayments.length === 0) return 'N/A';

  const totalDays = paidPayments.reduce((sum, p) => {
    const daysDiff = (new Date(p.paidAt) - new Date(p.createdAt)) / (1000 * 60 * 60 * 24);
    return sum + daysDiff;
  }, 0);

  return Math.round(totalDays / paidPayments.length);
}
