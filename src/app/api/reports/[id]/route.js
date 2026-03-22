import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/reports/[id]
 * Returns a single report by its Document ID, including HTML content.
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const report = await prisma.document.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
        sharedWith: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    if (!report || report.category !== 'REPORT') {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Clients can only view their own reports
    if (session.user.role !== 'ADMIN' && report.sharedWithId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse metadata from description field
    let metadata = {};
    try {
      metadata = JSON.parse(report.description || '{}');
    } catch (_) {}

    // Read the HTML content from the file path
    let html = '';
    try {
      const fs = await import('fs/promises');
      html = await fs.readFile(report.filePath, 'utf-8');
    } catch (err) {
      console.error('Error reading report file:', err);
      html = '<div style="padding: 40px; text-align: center; color: #6b7280;">Report content is not available.</div>';
    }

    return NextResponse.json({
      id: report.id,
      name: report.fileName,
      html,
      metadata: {
        reportType: metadata.reportType || 'monthly',
        periodLabel: metadata.periodLabel || 'N/A',
        clientName: report.sharedWith?.name,
        clientCompany: report.sharedWith?.company,
        totalBilled: metadata.totalBilled || 0,
        documentsDelivered: metadata.documentsDelivered || 0,
        messagesExchanged: metadata.messagesExchanged || 0,
        generatedDate: report.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reports/[id]
 * Deletes a report. Admin only.
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;

    const report = await prisma.document.findUnique({
      where: { id },
    });

    if (!report || report.category !== 'REPORT') {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Delete the file if it exists
    try {
      const fs = await import('fs/promises');
      await fs.unlink(report.filePath);
    } catch (err) {
      console.error('Error deleting report file (may not exist):', err);
    }

    // Delete the database record
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
