import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Check if user is admin
    // For now, we'll allow all authenticated users
    
    const { userId, planId, billingCycle, duration } = await req.json();

    if (!userId || !planId) {
      return Response.json(
        { error: 'User ID and Plan ID are required' },
        { status: 400 }
      );
    }

    // Calculate period dates
    const now = new Date();
    const durationDays = duration || 30;
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Get plan pricing
    const planPrices: Record<string, number> = {
      free: 0,
      starter: 699,
      pro: 999,
      agency: 2999,
    };

    const amount = planPrices[planId] || 0;

    // Cancel existing active subscriptions
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: 'active',
      },
      data: {
        status: 'cancelled',
      },
    });

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        paymentGateway: 'manual', // Manual admin assignment
        amount,
        currency: 'BDT',
        billingCycle: billingCycle || 'monthly',
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
        nextBillingDate: endDate,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount,
        currency: 'BDT',
        paymentGateway: 'manual',
        paymentMethod: 'admin_assigned',
        status: 'success',
        paidAt: now,
      },
    });

    return Response.json({ 
      success: true,
      subscription 
    });
  } catch (error: any) {
    console.error('Assign plan error:', error);
    return Response.json(
      { error: error.message || 'Failed to assign plan' },
      { status: 500 }
    );
  }
}
