import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserCountry, getPaymentGateway } from '@/lib/geo';
import { createPaddleCheckout } from '@/lib/payments/paddle';
import { createSSLCommerzCheckout } from '@/lib/payments/sslcommerz';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, billing = 'monthly' } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Detect user country
    const userCountry = await getUserCountry(req);
    const paymentGateway = getPaymentGateway(userCountry);

    // Update user country if not set
    if (!user.country) {
      await prisma.user.update({
        where: { id: user.id },
        data: { country: userCountry },
      });
    }

    if (paymentGateway === 'sslcommerz') {
      // Bangladesh user → SSLCommerz
      const checkout = await createSSLCommerzCheckout({
        userId: user.id,
        planId,
        userEmail: user.email!,
        userName: user.name || 'User',
        billing,
      });

      return NextResponse.json({
        gateway: 'sslcommerz',
        checkoutUrl: checkout.url,
        transactionId: checkout.transactionId,
      });
    } else {
      // International user → Paddle
      const checkout = await createPaddleCheckout({
        userId: user.id,
        planId,
        email: user.email!,
        country: userCountry,
        billing,
      });

      return NextResponse.json({
        gateway: 'paddle',
        checkoutUrl: checkout.url,
        checkoutId: checkout.checkoutId,
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
