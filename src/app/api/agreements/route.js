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

    let agreements;

    if (session.user.role === 'ADMIN') {
      // Admins see all agreements
      agreements = await prisma.agreement.findMany({
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
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Clients see only their own agreements
      agreements = await prisma.agreement.findMany({
        where: { clientId: session.user.id },
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
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      agreements,
    });
  } catch (error) {
    console.error('Get agreements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const { clientId, title, description, content, amount, startDate, endDate, type } = body;

    // Validate required fields
    if (!clientId || !title || !content || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, title, content, amount' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client || client.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create agreement
    const agreement = await prisma.agreement.create({
      data: {
        clientId,
        title,
        description,
        content,
        amount,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        type: type || 'RETAINER',
        status: 'PENDING',
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

    return NextResponse.json(
      {
        success: true,
        message: 'Agreement created successfully',
        agreement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create agreement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
