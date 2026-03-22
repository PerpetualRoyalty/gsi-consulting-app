import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/reports/[id]/send
 * Sends a report notification email to the client. Admin only.
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;

    const report = await prisma.document.findUnique({
      where: { id },
      include: {
        sharedWith: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });

    if (!report || report.category !== 'REPORT') {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (!report.sharedWith) {
      return NextResponse.json({ error: 'No client associated with this report' }, { status: 400 });
    }

    // Parse metadata from description
    let metadata = {};
    try {
      metadata = JSON.parse(report.description || '{}');
    } catch (_) {}

    const periodLabel = metadata.periodLabel || 'Recent Period';
    const reportType = metadata.reportType === 'quarterly' ? 'Quarterly' : 'Monthly';

    // Send notification email to client
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const reportUrl = `${appUrl}/dashboard/reports/${report.id}`;

    await sendEmail({
      to: report.sharedWith.email,
      subject: `Your ${reportType} Report is Ready — ${periodLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; padding: 24px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">Good Samaritan Institute</h1>
          </div>
          <div style="padding: 32px 24px; background-color: #f5f7fa;">
            <p style="color: #374151; font-size: 16px;">
              Hi ${report.sharedWith.name},
            </p>
            <p style="color: #374151; font-size: 14px;">
              Your <strong>${reportType} Report</strong> for <strong>${periodLabel}</strong> is now available in your client portal.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${reportUrl}" style="display: inline-block; padding: 12px 32px; background-color: #2d8b7a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                View Your Report
              </a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
              This report summarizes your engagement activity and deliverables. If you have any questions, please reply to this email or reach out through the messaging portal.
            </p>
          </div>
          <div style="padding: 16px 24px; background-color: #1e3a5f; text-align: center;">
            <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
              Good Samaritan Institute — IT Consulting & Technology Solutions
            </p>
          </div>
        </div>
      `,
    });

    // Also send a portal message
    await prisma.message.create({
      data: {
        content: `Your ${reportType} Report for ${periodLabel} has been published. You can view it in your Reports section.`,
        senderId: session.user.id,
        receiverId: report.sharedWith.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Report sent to ${report.sharedWith.name} (${report.sharedWith.email})`,
    });
  } catch (error) {
    console.error('Error sending report:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
