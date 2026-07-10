import { NextRequest, NextResponse } from 'next/server';
import { handlePaddleWebhook, verifyPaddleWebhook } from '@/lib/payments/paddle';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Read the RAW body text first — signature verification depends on the
    // exact bytes Paddle sent, not a re-serialized JSON.parse/stringify
    // round-trip (which can silently break the HMAC check).
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('paddle-signature');

    if (!verifyPaddleWebhook(rawBody, signatureHeader)) {
      console.error('Paddle webhook signature verification failed — rejecting request.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Process webhook
    const result = await handlePaddleWebhook(payload);

    if (!result) {
      return NextResponse.json({ received: true });
    }

    switch (result.type) {
      case 'subscription.created':
        // Create subscription in database
        await prisma.subscription.create({
          data: {
            userId: result.userId,
            planId: result.planId,
            paymentGateway: 'paddle',
            ...result.subscriptionData,
            billingCycle: result.billingCycle,
          },
        });

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: result.userId,
            amount: result.subscriptionData.amount,
            currency: result.subscriptionData.currency,
            paymentGateway: 'paddle',
            gatewayTransactionId: result.subscriptionData.paddleSubscriptionId,
            status: 'success',
            paidAt: new Date(),
          },
        });
        break;

      case 'subscription.updated':
        await prisma.subscription.updateMany({
          where: {
            paddleSubscriptionId: result.subscriptionId,
          },
          data: {
            status: result.status,
            ...(result.currentPeriodStart && { currentPeriodStart: result.currentPeriodStart }),
            ...(result.currentPeriodEnd && { currentPeriodEnd: result.currentPeriodEnd }),
          },
        });
        break;

      case 'subscription.cancelled':
        await prisma.subscription.updateMany({
          where: {
            paddleSubscriptionId: result.subscriptionId,
          },
          data: {
            status: 'cancelled',
          },
        });
        break;

      case 'payment.succeeded':
        if (result.userId) {
          await prisma.payment.create({
            data: {
              userId: result.userId,
              ...result.paymentData,
              paymentGateway: 'paddle',
            },
          });
        }
        // Belt-and-braces: if this succeeded payment is a subscription
        // renewal and includes an updated billing period, extend it here
        // too — some Paddle event sequencing delivers payment.succeeded
        // without a corresponding subscription.updated in the same batch.
        if (result.subscriptionId && result.currentPeriodEnd) {
          await prisma.subscription.updateMany({
            where: { paddleSubscriptionId: result.subscriptionId },
            data: { currentPeriodEnd: result.currentPeriodEnd },
          });
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paddle webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
