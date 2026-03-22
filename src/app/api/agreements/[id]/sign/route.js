import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { onboardClient } from '@/lib/onboarding';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { signatureData } = body;

    // Validate signature data
    if (!signatureData) {
      return NextResponse.json(
        { error: 'Signature data is required' },
        { status: 400 }
      );
    }

    // Get agreement
    const agreement = await prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      );
    }

    // Check authorization - clients can only sign their own agreements
    if (session.user.role !== 'ADMIN' && agreement.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update agreement with signature
    const signedAgreement = await prisma.agreement.update({
      where: { id },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        signatureData,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    // Trigger automated onboarding pipeline
    let onboardingResult = null;
    try {
      onboardingResult = await onboardClient(id);
      console.log('Onboarding triggered:', onboardingResult.success ? 'SUCCESS' : 'PARTIAL',
        `(${onboardingResult.steps.filter(s => s.status === 'completed').length}/${onboardingResult.steps.length} steps)`);
    } catch (onboardingError) {
      console.error('Onboarding trigger failed:', onboardingError);
      // Don't fail the signing — onboarding can be retried
    }

    return NextResponse.json({
      success: true,
      message: 'Agreement signed successfully. Onboarding initiated.',
      agreement: signedAgreement,
      onboarding: onboardingResult,
    });
  } catch (error) {
    console.error('Sign agreement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
