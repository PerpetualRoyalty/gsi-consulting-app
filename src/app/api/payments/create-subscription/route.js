import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

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

    const body = await request.json();
    const { agreementId, priceId } = body;

    // Validate required fields
    if (!agreementId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: agreementId, priceId' },
        { status: 400 }
      );
    }

    // Verify agreement exists and user has access
    const agreement = await prisma.agreement.findUnique({
      where: { id: agreementId },
      include: { client: true },
    });

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (session.user.role !== 'ADMIN' && agreement.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create or get Stripe customer
    let customer;
    const existingCustomer = await prisma.user.findUnique({
      where: { id: agreement.clientId },
    });

    if (existingCustomer?.stripeCustomerId) {
      customer = { id: existingCustomer.stripeCustomerId };
    } else {
      const newCustomer = await stripe.customers.create({
        email: agreement.client.email,
        name: agreement.client.name,
        metadata: {
          userId: agreement.clientId,
        },
      });
      customer = newCustomer;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: agreement.clientId },
        data: { stripeCustomerId: newCustomer.id },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
