import prisma from '@/lib/prisma';
import {
  generateNDA,
  generateProjectIntakeForm,
  generateInfraQuestionnaire,
} from '@/lib/onboarding-templates';
import { sendWelcomeEmail, sendInvoiceEmail } from '@/lib/email';

let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
} catch (err) {
  console.warn('[Onboarding] Stripe not available:', err.message);
}

/**
 * Master onboarding orchestration function.
 * Runs every pipeline step, catches errors per-step so one failure
 * never blocks the rest, then persists a log to the database.
 */
export async function onboardClient(agreementId) {
  const steps = [];
  let clientId = null;

  // ── Step 1  Validate & load ──────────────────────────────────────
  let agreement, client;
  try {
    agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: { client: true },
    });
    if (!agreement) throw new Error('Agreement not found');
    if (!['SIGNED', 'ACTIVE'].includes(agreement.status)) {
      throw new Error(`Agreement status is ${agreement.status}, expected SIGNED`);
    }
    client = agreement.client;
    clientId = client.id;
    steps.push({ name: 'validate', status: 'completed', detail: 'Agreement and client data loaded' });
  } catch (err) {
    steps.push({ name: 'validate', status: 'failed', detail: err.message });
    return saveAndReturn(agreementId, clientId, steps);
  }

  // ── Step 2  Stripe customer & first invoice ──────────────────────
  try {
    if (!stripe) {
      steps.push({ name: 'stripe', status: 'skipped', detail: 'Stripe not configured — skipped' });
    } else {
      let stripeCustomerId = client.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: client.email,
          name: client.name,
          metadata: {
            company: client.company || '',
            internalId: client.id,
          },
        });
        stripeCustomerId = customer.id;
        await prisma.user.update({
          where: { id: client.id },
          data: { stripeCustomerId },
        });
      }

      if (agreement.retainerAmount && agreement.retainerAmount > 0) {
        const amountCents = Math.round(agreement.retainerAmount * 100);
        const invoice = await stripe.invoices.create({
          customer: stripeCustomerId,
          collection_method: 'send_invoice',
          days_until_due: 15,
          metadata: { agreementId: agreement.id },
        });

        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: invoice.id,
          amount: amountCents,
          currency: 'usd',
          description: `${agreement.title} — Initial ${agreement.billingCycle?.toLowerCase() || ''} retainer`,
        });

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
        await stripe.invoices.sendInvoice(invoice.id);

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 15);

        await prisma.payment.create({
          data: {
            amount: amountCents,
            status: 'PENDING',
            type: agreement.type === 'RETAINER' ? 'RETAINER' : 'PROJECT',
            description: `Initial invoice — ${agreement.title}`,
            stripeInvoiceId: finalizedInvoice.id,
            agreementId: agreement.id,
            clientId: client.id,
            dueDate,
          },
        });

        steps.push({
          name: 'stripe',
          status: 'completed',
          detail: `Customer ${stripeCustomerId} created; Invoice ${finalizedInvoice.id} sent for $${(amountCents / 100).toFixed(2)}`,
        });

        // Send invoice email
        try {
          await sendInvoiceEmail({
            clientName: client.name,
            clientEmail: client.email,
            amount: amountCents / 100,
            dueDate: dueDate.toISOString(),
            invoiceUrl: finalizedInvoice.hosted_invoice_url || '#',
          });
        } catch (_) { /* non-critical */ }
      } else {
        steps.push({ name: 'stripe', status: 'completed', detail: 'Stripe customer created; no invoice (amount is 0)' });
      }
    }
  } catch (err) {
    steps.push({ name: 'stripe', status: 'failed', detail: err.message });
  }

  // ── Step 3  Generate onboarding documents ────────────────────────
  try {
    const startDate = agreement.startDate
      ? new Date(agreement.startDate).toLocaleDateString('en-US')
      : new Date().toLocaleDateString('en-US');

    const docs = [
      {
        name: `NDA — ${client.company || client.name}`,
        fileName: `NDA_${(client.company || client.name).replace(/\s+/g, '_')}.html`,
        category: 'AGREEMENT',
        content: generateNDA(client.name, client.company || client.name, startDate),
      },
      {
        name: `Project Intake Form — ${client.company || client.name}`,
        fileName: `Intake_Form_${(client.company || client.name).replace(/\s+/g, '_')}.html`,
        category: 'OTHER',
        content: generateProjectIntakeForm(client.name, client.company || client.name, agreement.type),
      },
      {
        name: `Infrastructure Questionnaire — ${client.company || client.name}`,
        fileName: `Infra_Questionnaire_${(client.company || client.name).replace(/\s+/g, '_')}.html`,
        category: 'OTHER',
        content: generateInfraQuestionnaire(client.name, client.company || client.name),
      },
    ];

    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const uploaderId = adminUser?.id || client.id;

    for (const doc of docs) {
      const filePath = `/documents/onboarding/${client.id}/${doc.fileName}`;
      await prisma.document.create({
        data: {
          name: doc.name,
          fileName: doc.fileName,
          fileType: 'text/html',
          fileSize: Buffer.byteLength(doc.content, 'utf8'),
          filePath,
          description: `Auto-generated onboarding document for ${client.company || client.name}`,
          category: doc.category,
          uploadedById: uploaderId,
          sharedWithId: client.id,
        },
      });
    }

    steps.push({
      name: 'documents',
      status: 'completed',
      detail: `Generated 3 onboarding documents (NDA, Intake Form, Infrastructure Questionnaire)`,
    });
  } catch (err) {
    steps.push({ name: 'documents', status: 'failed', detail: err.message });
  }

  // ── Step 4  Send welcome email ───────────────────────────────────
  try {
    const portalUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
    const emailResult = await sendWelcomeEmail({
      clientName: client.name,
      clientEmail: client.email,
      clientCompany: client.company || '',
      agreementTitle: agreement.title,
      portalUrl,
    });
    steps.push({
      name: 'email',
      status: emailResult.success ? 'completed' : 'failed',
      detail: emailResult.success
        ? `Welcome email sent to ${client.email}`
        : `Email send failed: ${emailResult.error}`,
    });
  } catch (err) {
    steps.push({ name: 'email', status: 'failed', detail: err.message });
  }

  // ── Step 5  Send internal welcome message ────────────────────────
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminUser) {
      await prisma.message.create({
        data: {
          content: [
            `Welcome to Good Samaritan Institute, ${client.name}! 🎉`,
            '',
            `Your agreement "${agreement.title}" has been signed and activated. Here's what happens next:`,
            '',
            '1. **Complete your Project Intake Form** — This helps us understand your goals and requirements.',
            '2. **Fill out the Infrastructure Questionnaire** — So we can assess your current IT environment.',
            '3. **Review and sign the NDA** — To protect both parties\' confidential information.',
            '4. **Schedule your kickoff call** — We\'ll set up a time to align on timeline and deliverables.',
            '',
            'You\'ll find all documents in your portal under the Documents section. If you have any questions, just reply here!',
            '',
            'Looking forward to working with you,',
            'Douglas — Good Samaritan Institute',
          ].join('\n'),
          senderId: adminUser.id,
          receiverId: client.id,
        },
      });
    }
    steps.push({ name: 'message', status: 'completed', detail: 'Welcome message sent to client portal' });
  } catch (err) {
    steps.push({ name: 'message', status: 'failed', detail: err.message });
  }

  // ── Step 6  Activate agreement ───────────────────────────────────
  try {
    await prisma.agreement.update({
      where: { id: agreementId },
      data: { status: 'ACTIVE' },
    });
    steps.push({ name: 'activate', status: 'completed', detail: 'Agreement status updated to ACTIVE' });
  } catch (err) {
    steps.push({ name: 'activate', status: 'failed', detail: err.message });
  }

  return saveAndReturn(agreementId, clientId, steps);
}

/**
 * Retry a single failed step
 */
export async function retryOnboardingStep(agreementId, stepName) {
  const log = await prisma.onboardingLog.findFirst({
    where: { agreementId },
    orderBy: { triggeredAt: 'desc' },
  });
  if (!log) throw new Error('No onboarding log found for this agreement');

  const steps = JSON.parse(log.steps);
  const stepIndex = steps.findIndex((s) => s.name === stepName);
  if (stepIndex === -1) throw new Error(`Step "${stepName}" not found in log`);

  // Re-run the full pipeline — it's idempotent enough for a retry
  // In production you'd isolate each step, but this keeps things simple
  const result = await onboardClient(agreementId);
  return result;
}

// ── Helpers ──────────────────────────────────────────────────────────

async function saveAndReturn(agreementId, clientId, steps) {
  const allCompleted = steps.every((s) => s.status === 'completed' || s.status === 'skipped');
  const anyFailed = steps.some((s) => s.status === 'failed');
  const status = allCompleted ? 'COMPLETED' : anyFailed ? 'FAILED' : 'IN_PROGRESS';

  try {
    if (clientId) {
      await prisma.onboardingLog.create({
        data: {
          agreementId,
          clientId,
          status,
          steps: JSON.stringify(steps),
          completedAt: allCompleted ? new Date() : null,
        },
      });
    }
  } catch (err) {
    console.error('[Onboarding] Failed to save log:', err.message);
  }

  return { success: allCompleted, steps, clientId, agreementId };
}
