import SSLCommerzPayment from 'sslcommerz-lts';
import { PRICING_PLANS } from '@/lib/constants/pricing';

interface CreateCheckoutParams {
  userId: string;
  planId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
}

export async function createSSLCommerzCheckout({
  userId,
  planId,
  userEmail,
  userName,
  userPhone = '01700000000',
}: CreateCheckoutParams) {
  const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];

  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  const amount = plan.prices.BDT;
  const transactionId = `TXN_${Date.now()}_${userId}`;

  const store_id = process.env.SSLCOMMERZ_STORE_ID!;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  const is_live = process.env.SSLCOMMERZ_ENVIRONMENT === 'live';

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/cancel`,
    ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/ipn`,

    product_name: `${plan.name} Plan - Bangla Creator`,
    product_category: 'Subscription',
    product_profile: 'general',

    cus_name: userName,
    cus_email: userEmail,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: userPhone,

    shipping_method: 'NO',

    // Custom data
    value_a: userId,
    value_b: planId,
    value_c: transactionId,
  };

  try {
    const apiResponse = await sslcz.init(data);

    if (apiResponse.status === 'SUCCESS') {
      return {
        url: apiResponse.GatewayPageURL,
        transactionId,
      };
    } else {
      throw new Error('Failed to initialize SSLCommerz payment');
    }
  } catch (error) {
    console.error('SSLCommerz error:', error);
    throw error;
  }
}

export async function validateSSLCommerzPayment(val_id: string) {
  const store_id = process.env.SSLCOMMERZ_STORE_ID!;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  const is_live = process.env.SSLCOMMERZ_ENVIRONMENT === 'live';

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    const validation = await sslcz.validate({ val_id });
    return validation;
  } catch (error) {
    console.error('SSLCommerz validation error:', error);
    throw error;
  }
}

export async function handleSSLCommerzSuccess(data: any) {
  const {
    val_id,
    tran_id,
    amount,
    card_type,
    status,
    value_a: userId,
    value_b: planId,
  } = data;

  if (status !== 'VALID' && status !== 'VALIDATED') {
    throw new Error('Invalid payment status');
  }

  // Validate with SSLCommerz
  const validation = await validateSSLCommerzPayment(val_id);

  if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
    throw new Error('Payment validation failed');
  }

  return {
    userId,
    planId,
    paymentData: {
      transactionId: tran_id,
      paymentMethod: card_type,
      amount: parseFloat(amount),
      currency: 'BDT',
      status: 'success',
      gatewayTransactionId: val_id,
      paidAt: new Date(),
    },
  };
}

export async function initiateBkashPayment(params: {
  userId: string;
  planId: string;
  amount: number;
  phone: string;
}) {
  // Implement bKash direct integration if needed
  // This is a placeholder for future bKash integration
  throw new Error('bKash direct integration not implemented yet');
}

export async function initiateNagadPayment(params: {
  userId: string;
  planId: string;
  amount: number;
  phone: string;
}) {
  // Implement Nagad direct integration if needed
  // This is a placeholder for future Nagad integration
  throw new Error('Nagad direct integration not implemented yet');
}
