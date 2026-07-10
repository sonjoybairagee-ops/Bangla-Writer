'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { PRICING_PLANS } from '@/lib/constants/pricing';
import { ArrowRight, X, Sparkles } from 'lucide-react';

/**
 * Drop this into your dashboard layout (e.g. app/dashboard/layout.tsx),
 * above the page content:
 *
 *   import { UpgradeBanner } from '@/components/upgrade-banner';
 *   ...
 *   <UpgradeBanner />
 *   {children}
 *
 * It reads `?upgradeTo=starter|pro|agency&billing=monthly|yearly` — the
 * query params register/page.tsx now attaches after signup when the user
 * picked a plan on the pricing page — and shows a one-line nudge toward
 * finishing checkout for that plan. Dismissible; does nothing if the
 * param is absent or invalid.
 */
export function UpgradeBanner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const upgradeTo = searchParams.get('upgradeTo');
  const billing = searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly';

  const plan =
    upgradeTo && upgradeTo in PRICING_PLANS
      ? PRICING_PLANS[upgradeTo as keyof typeof PRICING_PLANS]
      : null;

  if (!plan || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">
            You're on the 7-day free trial — continue with {plan.name}?
          </p>
          <p className="text-xs text-white/80">
            ৳{plan.prices.BDT}/{billing === 'yearly' ? 'month (billed yearly, 20% off)' : 'month'} · Cancel anytime
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/checkout?plan=${upgradeTo}&billing=${billing}`}
          className="bg-white text-purple-700 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-white/90 transition-colors"
        >
          Continue with {plan.name}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
