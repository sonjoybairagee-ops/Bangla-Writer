import { NextRequest } from 'next/server';

export async function getUserCountry(req: NextRequest): Promise<string> {
  // Try to get country from Vercel's geo headers
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country');

  if (country) {
    return country;
  }

  // Try to get from Cloudflare headers
  const cfCountry = req.headers.get('cf-ipcountry');
  if (cfCountry) {
    return cfCountry;
  }

  // Fallback: Try to detect from IP using a free API
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (ip) {
      const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
      if (response.ok) {
        const countryCode = await response.text();
        return countryCode.trim();
      }
    }
  } catch (error) {
    console.error('Error detecting country:', error);
  }

  // Default to US
  return 'US';
}

export function shouldUsePaddle(country: string): boolean {
  // Use SSLCommerz for Bangladesh, Paddle for everyone else
  return country !== 'BD';
}

export function getCurrencyForCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    BD: 'BDT',
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    IN: 'INR',
    PK: 'PKR',
  };

  return currencyMap[country] || 'USD';
}

export function getPaymentGateway(country: string): 'paddle' | 'sslcommerz' {
  return country === 'BD' ? 'sslcommerz' : 'paddle';
}
