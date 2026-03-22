import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { agreementId, clientId } = session.metadata;

        // Create or update payment record
        const payment = await prisma.payment.upsert({
          where: {
            stripePaymentIntentId: session.payment_intent || '',
          },
          create: {
            agreementId,
            amount: session.amount_total / 100, // Convert from cents
            paymentMethod: 'STRIPE_CARD',
            status: 'COMPLETED',
            stripePaymentIntentId: session.payment_intent,
          },
          update: {
            status: 'COMPLETED',
          },
        });

        console.log('Checkout session completed:', payment);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;

        // Update payment record
        const payment = await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'COMPLETED',
          },
        });

        console.log('Payment intent succeeded:', payment);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;

        // Handle subscription payment
        if (invoice.subscription) {
          // Create payment record for subscription invoice
          const payment = await prisma.payment.create({
            data: {
              agreementId: '', // Would need to associate subscription with agreement
              amount: invoice.amount_paid / 100,
              paymentMethod: 'STRIPE_SUBSCRIPTION',
              status: 'COMPLETED',
              stripePaymentIntentId: invoice.payment_intent,
            },
          }).catch(error => {
            // If agreementId is required, handle the error gracefully
            console.error('Failed to create payment for invoice:', error.message);
          });

          console.log('Invoice paid:', payment);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn('Invoice payment failed:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
