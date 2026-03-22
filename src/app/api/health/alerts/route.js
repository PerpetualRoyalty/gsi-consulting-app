import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { calculateAllClientHealth } from '@/lib/health-scoring';

/**
 * GET /api/health/alerts
 * Returns all active alerts across all clients, grouped by severity.
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

    const allHealth = await calculateAllClientHealth();

    const alerts = [];
    for (const client of allHealth) {
      if (client.alerts && client.alerts.length > 0) {
        for (const alert of client.alerts) {
          alerts.push({
            clientId: client.clientId,
            clientName: client.clientName,
            score: client.score,
            grade: client.grade,
            timestamp: client.lastUpdated,
            ...alert,
          });
        }
      }
    }

    const severityOrder = { RED: 0, YELLOW: 1, INFO: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const groupedByClient = {};
    for (const alert of alerts) {
      if (!groupedByClient[alert.clientId]) {
        groupedByClient[alert.clientId] = {
          clientName: alert.clientName,
          score: alert.score,
          grade: alert.grade,
          alerts: [],
        };
      }
      groupedByClient[alert.clientId].alerts.push({
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.timestamp,
      });
    }

    return NextResponse.json({
      alerts,
      grouped: groupedByClient,
      timestamp: new Date(),
      total: alerts.length,
      summary: {
        critical: alerts.filter((a) => a.severity === 'RED').length,
        warning: alerts.filter((a) => a.severity === 'YELLOW').length,
        info: alerts.filter((a) => a.severity === 'INFO').length,
      },
    });
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve alerts', details: error.message },
      { status: 500 }
    );
  }
}
