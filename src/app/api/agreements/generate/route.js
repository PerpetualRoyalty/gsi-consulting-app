import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateAgreement } from '@/lib/agreement-generator';

/**
 * POST /api/agreements/generate
 * AI-powered agreement generation from a plain-language prompt.
 * Admin-only.
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { prompt, clientId } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const agreement = await generateAgreement(prompt.trim());

    return NextResponse.json({
      success: true,
      agreement,
      clientId: clientId || null,
    });
  } catch (error) {
    console.error('Agreement generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate agreement', details: error.message },
      { status: 500 }
    );
  }
}
