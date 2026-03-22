import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get total revenue from completed payments
    const payments = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
    });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Get active clients count
    const activeClients = await prisma.user.count({
      where: { role: 'CLIENT' },
    });

    // Get pending agreements count
    const pendingAgreements = await prisma.agreement.count({
      where: { status: 'PENDING' },
    });

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: { isRead: false },
    });

    // Get recent payments (last 5)
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        agreement: {
          include: { client: true },
        },
      },
    });

    // Get recent activity (last 10 - combination of various actions)
    const recentAgreements = await prisma.agreement.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        client: { select: { name: true } },
      },
    });

    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: { select: { name: true } },
      },
    });

    const recentActivity = [
      ...recentAgreements.map(a => ({
        type: 'AGREEMENT',
        title: `Agreement "${a.title}" - ${a.status}`,
        timestamp: a.updatedAt,
        client: a.client.name,
      })),
      ...recentMessages.map(m => ({
        type: 'MESSAGE',
        title: m.content.substring(0, 50),
        timestamp: m.createdAt,
        from: m.sender.name,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    return NextResponse.json({
      totalRevenue,
      activeClients,
      pendingAgreements,
      unreadMessages,
      recentPayments,
      recentActivity,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
