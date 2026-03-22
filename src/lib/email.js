import nodemailer from 'nodemailer';

/**
 * Get or create email transporter.
 * Falls back to a mock transport when SMTP is not configured.
 */
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: parseInt(SMTP_PORT || '587', 10) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  console.warn('[Email] SMTP not configured — emails will be logged to console only.');
  return null;
}

/**
 * Low-level send helper.
 */
export async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    console.log(`[Email Mock] Body preview: ${html.substring(0, 200)}…`);
    return { success: true, messageId: `mock-${Date.now()}`, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Good Samaritan Institute" <${process.env.SMTP_USER || 'doug@goodsamaritaninstitute.org'}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email] Send failed:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Beautiful HTML welcome email.
 */
export async function sendWelcomeEmail({
  clientName,
  clientEmail,
  clientCompany,
  agreementTitle,
  portalUrl,
}) {
  const subject = `Welcome to Good Samaritan Institute, ${clientName}!`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);padding:40px 40px 30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;">Good Samaritan Institute</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">IT Consulting &amp; Technology Solutions</p>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding:40px;">
          <h2 style="color:#1e3a5f;margin:0 0 16px;font-size:22px;">Welcome aboard, ${clientName}!</h2>
          <p style="color:#4a5568;line-height:1.7;font-size:15px;margin:0 0 20px;">
            We're thrilled to begin our partnership with${clientCompany ? ' <strong>' + clientCompany + '</strong>' : ' you'}. Your agreement <strong>"${agreementTitle}"</strong> has been signed and activated.
          </p>

          <h3 style="color:#1e3a5f;font-size:16px;margin:28px 0 16px;">Here's what happens next:</h3>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              { num: '1', title: 'Access Your Portal', desc: 'Log in to view your dashboard, documents, and messages.' },
              { num: '2', title: 'Complete Your Intake Form', desc: 'Tell us about your project goals and current setup.' },
              { num: '3', title: 'Review Documents', desc: 'Review and sign the NDA, and fill out the infrastructure questionnaire.' },
              { num: '4', title: 'Schedule Kickoff', desc: 'We\'ll set up an intro call to align on timeline and deliverables.' },
            ]
              .map(
                (s) => `
            <tr>
              <td style="padding:10px 0;vertical-align:top;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:36px;height:36px;background:#2d8b7a;color:#fff;border-radius:50%;text-align:center;line-height:36px;font-weight:700;font-size:14px;">${s.num}</td>
                  <td style="padding-left:16px;">
                    <strong style="color:#1e3a5f;font-size:15px;">${s.title}</strong>
                    <p style="color:#718096;margin:4px 0 0;font-size:13px;line-height:1.5;">${s.desc}</p>
                  </td>
                </tr></table>
              </td>
            </tr>`
              )
              .join('')}
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
            <tr><td align="center">
              <a href="${portalUrl}" style="display:inline-block;background:#2d8b7a;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
                Log Into Your Portal &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Consultant -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;margin-top:20px;">
            <tr><td>
              <p style="color:#718096;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your Consultant</p>
              <p style="color:#1e3a5f;font-size:16px;font-weight:600;margin:0;">Douglas</p>
              <p style="color:#4a5568;font-size:14px;margin:4px 0 0;">
                <a href="mailto:doug@goodsamaritaninstitute.org" style="color:#2d8b7a;text-decoration:none;">doug@goodsamaritaninstitute.org</a>
              </p>
            </td></tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#a0aec0;font-size:12px;margin:0;line-height:1.6;">
            Good Samaritan Institute &bull; IT Consulting &amp; Technology Solutions<br>
            This is an automated message. Reply directly to reach Douglas.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return sendEmail({ to: clientEmail, subject, html });
}

/**
 * Invoice notification email.
 */
export async function sendInvoiceEmail({
  clientName,
  clientEmail,
  amount,
  dueDate,
  invoiceUrl,
}) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Invoice from Good Samaritan Institute — ${formattedAmount}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:#1e3a5f;padding:30px 40px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;">Good Samaritan Institute</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:40px;">
          <h2 style="color:#1e3a5f;margin:0 0 16px;">New Invoice</h2>
          <p style="color:#4a5568;line-height:1.7;font-size:15px;">Hi ${clientName},</p>
          <p style="color:#4a5568;line-height:1.7;font-size:15px;">A new invoice has been generated for your account:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin:24px 0;">
            <tr>
              <td style="padding:20px;">
                <table width="100%">
                  <tr>
                    <td style="color:#718096;font-size:14px;padding:6px 0;">Amount</td>
                    <td style="color:#1e3a5f;font-size:18px;font-weight:700;text-align:right;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="color:#718096;font-size:14px;padding:6px 0;">Due Date</td>
                    <td style="color:#4a5568;font-size:14px;text-align:right;">${formattedDate}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table width="100%"><tr><td align="center">
            <a href="${invoiceUrl}" style="display:inline-block;background:#2d8b7a;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;">
              Pay Invoice &rarr;
            </a>
          </td></tr></table>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#a0aec0;font-size:12px;margin:0;">Good Samaritan Institute &bull; IT Consulting</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return sendEmail({ to: clientEmail, subject, html });
}
