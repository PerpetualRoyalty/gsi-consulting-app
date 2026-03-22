import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { retryOnboardingStep } from '@/lib/onboarding';

/**
 * POST /api/onboarding/[agreementId]/retry
 * Retries a specific failed onboarding step. Admin-only.
 * Body: { step: "stripe" | "documents" | "email" | "message" | "activate" }
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { agreementId } = params;
    const { step } = await request.json();

    const validSteps = ['stripe', 'documents', 'email', 'message', 'activate'];
    if (!step || !validSteps.includes(step)) {
      return NextResponse.json(
        { error: `Invalid step. Must be one of: ${validSteps.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await retryOnboardingStep(agreementId, step);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Step "${step}" retried successfully`
        : `Retry completed with issues — check step details`,
      steps: result.steps,
    });
  } catch (error) {
    console.error('Retry onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
