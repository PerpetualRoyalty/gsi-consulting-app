import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateClientReport } from '@/lib/report-generator';

/**
 * POST /api/reports/generate
 * Generates a branded client report and saves it as a Document.
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

    const { clientId, reportType = 'monthly', periodStart, periodEnd } = await request.json();

    if (!clientId || !periodStart || !periodEnd) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, periodStart, periodEnd' },
        { status: 400 }
      );
    }

    // Generate report
    const reportData = await generateClientReport({
      clientId,
      reportType,
      periodStart,
      periodEnd,
    });

    // Save report as a Document record matching the actual Prisma schema
    const periodLabel = reportData.metadata.periodLabel || `${reportType} report`;
    const reportFileName = `Report_${(reportData.metadata.clientCompany || 'Client').replace(/\s+/g, '_')}_${periodLabel.replace(/\s+/g, '_')}.html`;

    const reportDocument = await prisma.document.create({
      data: {
        name: `${reportData.metadata.clientCompany || 'Client'} — ${periodLabel} ${reportType === 'monthly' ? 'Monthly' : 'Quarterly'} Report`,
        fileName: reportFileName,
        fileType: 'text/html',
        fileSize: Buffer.byteLength(reportData.html, 'utf8'),
        filePath: `/documents/reports/${clientId}/${reportFileName}`,
        description: JSON.stringify(reportData.metadata),
        category: 'REPORT',
        uploadedById: session.user.id,
        sharedWithId: clientId,
      },
    });

    return NextResponse.json({
      success: true,
      report: reportData,
      documentId: reportDocument.id,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
