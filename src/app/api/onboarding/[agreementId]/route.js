import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { onboardClient } from '@/lib/onboarding';

/**
 * GET /api/onboarding/[agreementId]
 * Returns onboarding status for an agreement.
 * Accessible by admin or the agreement's client.
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agreementId } = params;

    // Load agreement to verify access
    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true, phone: true },
        },
      },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // Authorization: admin can see all, clients only their own
    if (session.user.role !== 'ADMIN' && agreement.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the most recent onboarding log
    const log = await prisma.onboardingLog.findFirst({
      where: { agreementId },
      orderBy: { triggeredAt: 'desc' },
    });

    // Get generated onboarding documents
    const documents = await prisma.document.findMany({
      where: {
        sharedWithId: agreement.clientId,
        description: { contains: 'onboarding' },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      agreement: {
        id: agreement.id,
        title: agreement.title,
        type: agreement.type,
        status: agreement.status,
        retainerAmount: agreement.retainerAmount,
        billingCycle: agreement.billingCycle,
        startDate: agreement.startDate,
        signedAt: agreement.signedAt,
      },
      client: agreement.client,
      onboarding: log
        ? {
            id: log.id,
            status: log.status,
            steps: JSON.parse(log.steps),
            triggeredAt: log.triggeredAt,
            completedAt: log.completedAt,
          }
        : null,
      documents,
    });
  } catch (error) {
    console.error('GET onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/onboarding/[agreementId]
 * Triggers the onboarding pipeline. Admin-only.
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { agreementId } = params;

    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
    });

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const result = await onboardClient(agreementId);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'Onboarding completed successfully'
        : 'Onboarding completed with some failures — check step details',
      steps: result.steps,
    });
  } catch (error) {
    console.error('POST onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
