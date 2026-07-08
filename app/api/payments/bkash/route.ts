import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      planId,
      planName,
      amount,
      billing,
      transactionId,
      phoneNumber,
      email,
    } = body;

    // Validate required fields
    if (!planId || !planName || !amount || !billing || !transactionId || !phoneNumber || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
