'use client';

import { useEffect, useState } from 'react';
import { PRICING_PLANS } from '@/lib/constants/pricing';
import { formatDate } from '@/lib/utils';
import {
  Check, Crown, Zap, Sparkles, Shield,
  Clock, RefreshCcw, Wallet, Star
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
    badge: '🔥 সেরা মূল্য',
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

export default function BillingPage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => { fetchUsage(); }, []);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage');
      setUsage(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setCheckingOut(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch {
      alert('Failed to start checkout');
    } finally {
      setCheckingOut(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const currentPlan = usage?.planId || 'free';

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">

      {/* ── Page Header ── */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          Bangla Writer প্রাইমিং
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          আপনার জন্য পারফেক্ট প্ল্যানটি বেছে নিন
        </h1>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          তিনটি জেনারেশন ট্রাই করুন। ভালো লাগলে নিচের প্ল্যান থেকে বেছে নিন।
        </p>
      </div>

      {/* ── Monthly / Yearly Toggle ── */}
      <div className="flex justify-center">
        <div className="relative inline-flex items-center bg-slate-100 rounded-2xl p-1.5 gap-1">
          <button
            id="toggle-monthly"
            onClick={() => setBilling('monthly')}
            className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              billing === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            মাসিক
          </button>
          <button
            id="toggle-yearly"
            onClick={() => setBilling('yearly')}
            className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 ${
              billing === 'yearly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            বার্ষিক
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              20% ছাড়
            </span>
          </button>
        </div>
      </div>

      {/* ── Pricing Grid ── */}
      <div className="grid md:grid-cols-3 gap-6 px-2">
        {Object.entries(PRICING_PLANS).map(([planId, plan]) => {
          const style = PLAN_STYLE[planId];
          const Icon = style.icon;
          const isCurrent = planId === currentPlan;
          const isPopular = !!(plan as any).popular;

          const bdtMonthly = plan.prices.BDT;
          const displayPrice = billing === 'yearly'
            ? getYearlyMonthly(bdtMonthly)
            : bdtMonthly;

          return (
            <div
              key={planId}
              className={`relative flex flex-col rounded-3xl border-2 bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${
                isCurrent ? 'border-purple-600 shadow-lg' : style.ring
              }`}
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
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full">
                      বর্তমান
                    </span>
                  )}
                </div>
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
                      বার্ষিক মোট: ৳{getYearlyTotal(bdtMonthly).toLocaleString('en-BD')}
                    </p>
                    <p className="text-xs text-slate-400 line-through">
                      মাসিকে ৳{getOriginalYearlyTotal(bdtMonthly).toLocaleString('en-BD')} হতো
                    </p>
                    <span className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      ৳{(getOriginalYearlyTotal(bdtMonthly) - getYearlyTotal(bdtMonthly)).toLocaleString('en-BD')} সাশ্রয়!
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">
                    বার্ষিকে{' '}
                    <span className="text-green-600 font-semibold">
                      ৳{getYearlyMonthly(bdtMonthly).toLocaleString('en-BD')}/মাস (20% ছাড়)
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
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-400 font-semibold text-sm cursor-not-allowed bg-slate-50"
                  >
                    Currently Active
                  </button>
                ) : (
                  <button
                    id={`subscribe-${planId}`}
                    onClick={() => handleUpgrade(planId)}
                    disabled={checkingOut === planId}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${style.btnClass} ${checkingOut === planId ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {checkingOut === planId ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        প্রসেস হচ্ছে...
                      </span>
                    ) : (
                      `Subscribe ${plan.name}`
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trust Badges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {[
          { icon: Shield,      title: '৩০ দিন মানি ব্যাক',       sub: 'রিস্ক ফ্রি ট্রায়াল' },
          { icon: Clock,       title: '২৪ ঘণ্টা অ্যাক্টিভেশন',  sub: 'তাৎক্ষণিক শুরু' },
          { icon: RefreshCcw,  title: 'যেকোনো সময় বাতিল',        sub: 'Anytime Cancel' },
          { icon: Wallet,      title: 'bKash Send Money',          sub: 'Sender number: 01909...' },
        ].map(({ icon: Ic, title, sub }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Ic className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Current Subscription Card ── */}
      {usage?.subscription && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 px-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">আপনার বর্তমান সাবস্ক্রিপশন</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'স্ট্যাটাস', value: usage.subscription.status },
              { label: 'মেয়াদ শেষ', value: formatDate(usage.subscription.currentPeriodEnd) },
              { label: 'প্ল্যান', value: PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS]?.name || 'Free' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{label}</div>
                <div className="font-semibold capitalize text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Usage This Month ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-5">এই মাসের ব্যবহার</h2>
        <div className="space-y-4">
          <UsageBar label="স্ক্রিপ্ট / জেনারেশন"  current={usage?.usage.scriptsGenerated || 0}  limit={usage?.limits.scripts_per_month || 0} />
          <UsageBar label="হুক জেনারেটেড"          current={usage?.usage.hooksGenerated || 0}    limit={usage?.limits.hooks_per_month || 0} />
          <UsageBar label="কন্টেন্ট প্ল্যান"        current={usage?.usage.contentPlansCreated || 0} limit={usage?.limits.content_plans || 0} />
          <UsageBar label="OVC সিন"                 current={usage?.usage.ovcScenesGenerated || 0} limit={usage?.limits.ovc_scenes || 0} />
        </div>
      </div>

    </div>
  );
}

// ─── UsageBar ─────────────────────────────────────────────────────────────────
function UsageBar({ label, current, limit }: { label: string; current: number; limit: number }) {
  const unlimited = limit === -1;
  const pct = unlimited ? 100 : Math.min((current / limit) * 100, 100);
  const warn = !unlimited && pct >= 80;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={`text-xs font-semibold ${warn ? 'text-red-500' : 'text-slate-500'}`}>
          {current} / {unlimited ? '∞' : limit}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            unlimited
              ? 'w-full bg-gradient-to-r from-purple-300 to-pink-300'
              : warn
              ? 'bg-red-400'
              : 'bg-gradient-to-r from-purple-500 to-pink-400'
          }`}
          style={unlimited ? {} : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
