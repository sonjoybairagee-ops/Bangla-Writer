import { PRICING_PLANS } from '@/lib/constants/pricing';

interface CreateCheckoutParams {
  userId: string;
  planId: string;
  email: string;
  country?: string;
  billing?: string;
}

export async function createPaddleCheckout({
  userId,
  planId,
  email,
  country = 'US',
  billing = 'monthly',
}: CreateCheckoutParams) {
  const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];

  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  // Determine currency based on country
  const currency = country === 'BD' ? 'BDT' : 'USD';
  let priceId = '';
  
  if (billing === 'yearly') {
    priceId = currency === 'USD' 
      ? plan.paddle_price_ids.yearly_usd 
      : plan.paddle_price_ids.yearly_eur;
  } else {
    priceId = currency === 'USD' 
      ? plan.paddle_price_ids.monthly_usd 
      : plan.paddle_price_ids.monthly_eur;
  }

  try {
    const response = await fetch('https://api.paddle.com/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        customer: {
          email,
        },
        custom_data: {
          user_id: userId,
          plan_id: planId,
          billing_cycle: billing,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Paddle checkout');
    }

    const data = await response.json();
    return {
      url: data.data.url,
      checkoutId: data.data.id,
    };
  } catch (error) {
    console.error('Paddle checkout error:', error);
    throw error;
  }
}

export async function verifyPaddleWebhook(payload: any, signature: string): Promise<boolean> {
  // Implement Paddle webhook signature verification
  // This is a placeholder - implement proper verification based on Paddle docs
  return true;
}

export async function handlePaddleWebhook(payload: any) {
  const { event_type, data } = payload;

  switch (event_type) {
    case 'subscription.created':
      return {
        type: 'subscription.created',
        userId: data.custom_data.user_id,
        planId: data.custom_data.plan_id,
        billingCycle: data.custom_data.billing_cycle || 'monthly',
        subscriptionData: {
          paddleSubscriptionId: data.id,
          paddleCustomerId: data.customer_id,
          status: 'active',
          amount: parseFloat(data.items[0].price.unit_price.amount) / 100,
          currency: data.items[0].price.unit_price.currency_code,
          currentPeriodStart: new Date(data.current_billing_period.starts_at),
          currentPeriodEnd: new Date(data.current_billing_period.ends_at),
          nextBillingDate: new Date(data.next_billed_at),
        },
      };

    case 'subscription.updated':
      return {
        type: 'subscription.updated',
        subscriptionId: data.id,
        status: data.status,
      };

    case 'subscription.cancelled':
      return {
        type: 'subscription.cancelled',
        subscriptionId: data.id,
        cancelledAt: new Date(data.cancelled_at),
      };

    case 'payment.succeeded':
      return {
        type: 'payment.succeeded',
        userId: data.custom_data?.user_id,
        paymentData: {
          amount: parseFloat(data.amount) / 100,
          currency: data.currency_code,
          gatewayTransactionId: data.id,
          status: 'success',
          paidAt: new Date(data.created_at),
        },
      };

    default:
      return null;
  }
}
