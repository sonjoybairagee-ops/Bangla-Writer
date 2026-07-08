'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS } from '@/lib/constants/pricing';
import { 
  Sparkles, 
  Check,
  ArrowRight,
  Crown, 
  Zap, 
  Shield,
  Clock, 
  RefreshCcw, 
  Wallet, 
  Star
} from 'lucide-react';

// ─── Yearly 20% discount helpers ─────────────────────────────────────────────
const YEARLY_DISCOUNT = 0.20;

function getYearlyMonthly(monthly: number) {
  return Math.round(monthly * (1 - YEARLY_DISCOUNT));
}
function getYearlyTotal(monthly: number) {
  return Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT));
}
function getOriginalYearlyTotal(monthly: number) {
  return monthly * 12;
}

// ─── Per-plan styling ─────────────────────────────────────────────────────────
const PLAN_STYLE: Record<string, {
  icon: React.ElementType;
  iconBg: string;
  badge?: string;
  btnClass: string;
  ring: string;
  accentBar: string;
}> = {
  starter: {
    icon: Zap,
    iconBg: 'from-blue-500 to-cyan-400',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    ring: 'border-slate-200',
    accentBar: 'from-blue-400 to-cyan-400',
  },
  pro: {
    icon: Crown,
    iconBg: 'from-purple-600 to-pink-500',
    badge: '🔥 Best Value',
    btnClass: 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-200',
    ring: 'border-purple-400',
    accentBar: 'from-purple-500 to-pink-400',
  },
  agency: {
    icon: Sparkles,
    iconBg: 'from-amber-500 to-orange-400',
    btnClass: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    ring: 'border-amber-300',
    accentBar: 'from-amber-400 to-orange-400',
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold">Bangla Creator</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* ── Page Header ── */}
        <div className="text-center space-y-3 pt-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Bangla Creator Pricing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Choose Your Perfect Plan
          </h1>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            Try 3 generations free. If you like it, choose a plan below.
          </p>
        </div>

        {/* ── Monthly / Yearly Toggle ── */}
        <div className="flex justify-center mb-10">
          <div className="relative inline-flex items-center bg-slate-100 rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                billing === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${
                billing === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing Grid ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {Object.entries(PRICING_PLANS).map(([planId, plan]) => {
            const style = PLAN_STYLE[planId];
            const Icon = style.icon;
            const isPopular = !!(plan as any).popular;

            const bdtMonthly = plan.prices.BDT;
            const displayPrice = billing === 'yearly'
              ? getYearlyMonthly(bdtMonthly)
              : bdtMonthly;

            return (
              <div
                key={planId}
                className={`relative flex flex-col rounded-3xl border-2 bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${style.ring}`}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${style.accentBar}`} />

                {/* Popular badge */}
                {style.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {style.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="p-6 pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${style.iconBg} mb-4 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.description}</p>
                </div>

                {/* Price block */}
                <div className="px-6 pb-5 border-b border-slate-100">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-slate-400 text-2xl font-medium leading-none">৳</span>
                    <span className="text-5xl font-black text-slate-900 leading-none tracking-tight">
                      {displayPrice.toLocaleString('en-BD')}
                    </span>
                    <span className="text-slate-400 text-sm mb-1.5 ml-0.5">/ month</span>
                  </div>

                  {billing === 'yearly' ? (
                    <div className="space-y-1 mt-2">
                      <p className="text-sm text-green-600 font-semibold">
                        Yearly total: ৳{getYearlyTotal(bdtMonthly).toLocaleString('en-BD')}
                      </p>
                      <p className="text-xs text-slate-400 line-through">
                        Was ৳{getOriginalYearlyTotal(bdtMonthly).toLocaleString('en-BD')}
                      </p>
                      <span className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Save ৳{(getOriginalYearlyTotal(bdtMonthly) - getYearlyTotal(bdtMonthly)).toLocaleString('en-BD')}!
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">
                      Yearly{' '}
                      <span className="text-green-600 font-semibold">
                        ৳{getYearlyMonthly(bdtMonthly).toLocaleString('en-BD')}/month (20% OFF)
                      </span>
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="px-6 py-5 space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link href="/register">
                    <button
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${style.btnClass}`}
                    >
                      Start Free Trial
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Trust Badges ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Shield, title: '30 Day Money Back', sub: 'Risk-free trial' },
            { icon: Clock, title: '24 Hour Activation', sub: 'Instant start' },
            { icon: RefreshCcw, title: 'Cancel Anytime', sub: 'No commitments' },
            { icon: Wallet, title: 'bKash Send Money', sub: 'Easy payment' },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{badge.title}</p>
                <p className="text-xs text-slate-400">{badge.sub}</p>
              </div>
            );
          })}
        </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I switch plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference."
            />
            <FAQItem
              question="What happens after the free trial?"
              answer="After trying 3 free generations, you'll need to choose a plan to continue. All plans come with full access to features."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely! There are no long-term contracts. You can cancel your subscription at any time from your dashboard."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  );
}
