import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PRICING_PLANS } from '@/lib/constants/pricing';

const YEARLY_DISCOUNT = 0.2;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      planId,
      billing,
      transactionId,
      phoneNumber,
      email,
    } = body;

    // Validate required fields
    if (!planId || !billing || !transactionId || !phoneNumber || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // SECURITY: never trust client-supplied amount/planName — recompute
    // server-side from the canonical price list, otherwise anyone can POST
    // { planId: 'agency', amount: 1 } directly to this endpoint and have a
    // reviewer approve what looks like a legitimate low-amount payment.
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan || planId === 'free') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }
    if (billing !== 'monthly' && billing !== 'yearly') {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
    }

    const monthlyBdt = plan.prices.BDT;
    const expectedAmount =
      billing === 'yearly'
        ? Math.round(monthlyBdt * 12 * (1 - YEARLY_DISCOUNT))
        : monthlyBdt;
    const planName = plan.name;
    const amount = expectedAmount;

    // Check if transaction ID already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { transactionId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'This transaction ID has already been submitted' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        planId,
        planName,
        amount,
        billing,
        transactionId,
        phoneNumber,
        email,
        status: 'pending',
        method: 'bkash',
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        transactionId: payment.transactionId,
      },
    });
  } catch (error: any) {
    console.error('bKash payment submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit payment' },
      { status: 500 }
    );
  }
}
