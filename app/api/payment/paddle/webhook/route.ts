import { NextRequest, NextResponse } from 'next/server';
import { handlePaddleWebhook } from '@/lib/payments/paddle';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

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
