import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { calculateClientHealth, calculateAllClientHealth } from '@/lib/health-scoring';

/**
 * GET /api/health
 * Returns health scores for clients.
 * Query params: ?clientId=xxx for a single client.
 * Admin-only.
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (clientId) {
      const result = await calculateClientHealth(clientId);
      return NextResponse.json(result);
    }

    const allHealth = await calculateAllClientHealth();
    return NextResponse.json({
      clients: allHealth,
      timestamp: new Date(),
      total: allHealth.length,
      summary: {
        green: allHealth.filter((h) => h.grade === 'GREEN').length,
        yellow: allHealth.filter((h) => h.grade === 'YELLOW').length,
        red: allHealth.filter((h) => h.grade === 'RED').length,
      },
    });
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate health scores', details: error.message },
      { status: 500 }
    );
  }
}
