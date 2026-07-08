import { NextRequest, NextResponse } from 'next/server';
import { validateSSLCommerzPayment } from '@/lib/payments/sslcommerz';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    // Validate IPN
    if (data.val_id) {
      await validateSSLCommerzPayment(data.val_id as string);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('SSLCommerz IPN error:', error);
    return NextResponse.json(
      { error: 'IPN processing failed' },
      { status: 500 }
    );
  }
}
