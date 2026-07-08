import { NextRequest, NextResponse } from 'next/server';
import { handleSSLCommerzSuccess } from '@/lib/payments/sslcommerz';
import { prisma } from '@/lib/prisma';
import { PRICING_PLANS } from '@/lib/constants/pricing';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    // Process SSLCommerz success
    const result = await handleSSLCommerzSuccess(data);

    const plan = PRICING_PLANS[result.planId as keyof typeof PRICING_PLANS];

    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Create subscription
    const currentDate = new Date();
    const nextBillingDate = new Date(currentDate);
    
    if (result.billingCycle === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    await prisma.subscription.create({
      data: {
        userId: result.userId,
        planId: result.planId,
        paymentGateway: 'sslcommerz',
        transactionId: result.paymentData.transactionId,
        paymentMethod: result.paymentData.paymentMethod,
        status: 'active',
        amount: result.paymentData.amount,
        currency: result.paymentData.currency,
        billingCycle: result.billingCycle,
        currentPeriodStart: currentDate,
        currentPeriodEnd: nextBillingDate,
        nextBillingDate: nextBillingDate,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: result.userId,
        ...result.paymentData,
        paymentGateway: 'sslcommerz',
      },
    });

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`
    );
  } catch (error) {
    console.error('SSLCommerz success error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=error`
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
