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

import crypto from 'crypto';

/**
 * Verifies a Paddle Billing webhook using the Paddle-Signature header.
 * Paddle sends: "Paddle-Signature: ts=<unix_ts>;h1=<hex_hmac>"
 * The signed content is `${ts}:${rawRequestBody}` (the *raw* body string,
 * NOT the re-serialized JSON — re-serializing can change whitespace/key
 * order and silently break verification).
 *
 * IMPORTANT: the caller must pass the untouched raw body text (from
 * `await req.text()`), not `JSON.stringify(await req.json())`.
 */
export function verifyPaddleWebhook(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('PADDLE_WEBHOOK_SECRET is not configured — refusing to trust webhook.');
    return false;
  }

  // Parse "ts=169...;h1=abcd..." into a map
  const parts = Object.fromEntries(
    signatureHeader.split(';').map((p) => {
      const [key, value] = p.split('=');
      return [key, value];
    })
  );
  const timestamp = parts.ts;
  const receivedHash = parts.h1;

  if (!timestamp || !receivedHash) return false;

  // Reject stale webhooks (>5 min old) to prevent replay attacks
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - parseInt(timestamp, 10)) > 300) {
    console.error('Paddle webhook timestamp too old/skewed — possible replay attempt.');
    return false;
  }

  const signedPayload = `${timestamp}:${rawBody}`;
  const expectedHash = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

  // Constant-time comparison to avoid timing attacks
  const expectedBuf = Buffer.from(expectedHash, 'hex');
  const receivedBuf = Buffer.from(receivedHash, 'hex');
  if (expectedBuf.length !== receivedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
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
        // Paddle includes the (possibly renewed) billing period on this event.
        // Without this, a renewed subscription's currentPeriodEnd never moves
        // forward, and the expire-trials cron will incorrectly expire paying
        // customers at the end of their *first* billing period.
        currentPeriodStart: data.current_billing_period?.starts_at
          ? new Date(data.current_billing_period.starts_at)
          : undefined,
        currentPeriodEnd: data.current_billing_period?.ends_at
          ? new Date(data.current_billing_period.ends_at)
          : undefined,
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
        // If this payment is tied to a subscription renewal, Paddle includes
        // subscription_id — use it to also bump that subscription's period
        // in the route handler (belt-and-braces alongside subscription.updated).
        subscriptionId: data.subscription_id || undefined,
        currentPeriodEnd: data.current_billing_period?.ends_at
          ? new Date(data.current_billing_period.ends_at)
          : undefined,
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
