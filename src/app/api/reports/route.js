import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/reports
 * Returns all generated reports (Document records with category REPORT).
 * Query params: ?clientId=xxx to filter by client.
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    // Build query — admins see all, clients see only their own
    const where = {
      category: 'REPORT',
    };

    if (session.user.role !== 'ADMIN') {
      where.sharedWithId = session.user.id;
    } else if (clientId) {
      where.sharedWithId = clientId;
    }

    const reports = await prisma.document.findMany({
      where,
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
        sharedWith: {
          select: { id: true, name: true, company: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reportList = reports.map((report) => {
      // Parse metadata from description field
      let metadata = {};
      try {
        metadata = JSON.parse(report.description || '{}');
      } catch (_) {}

      return {
        id: report.id,
        name: report.name,
        clientId: report.sharedWith?.id,
        clientName: report.sharedWith?.name,
        clientCompany: report.sharedWith?.company,
        type: metadata.reportType || 'unknown',
        period: metadata.periodLabel || 'N/A',
        generatedDate: report.createdAt,
        fileSize: report.fileSize,
        status: 'Generated',
      };
    });

    return NextResponse.json(reportList);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
