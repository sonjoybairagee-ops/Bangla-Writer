'use client';

import { useEffect, useState } from 'react';
import { PRICING_PLANS } from '@/lib/constants/pricing';
import { formatDate } from '@/lib/utils';
import {
  Check, Crown, Zap, Sparkles, Shield,
  Clock, RefreshCcw, Wallet, Star, Gift, Copy
} from 'lucide-react';
import { BkashPaymentModal } from '@/components/payment/bkash-payment-modal';
import { copyToClipboard } from '@/lib/utils/clipboard';

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
  const [bkashModal, setBkashModal] = useState<{
    isOpen: boolean;
    planId: string;
    planName: string;
    amount: number;
  } | null>(null);
  const [referralData, setReferralData] = useState<any>(null);
  const [discountInfo, setDiscountInfo] = useState<{
    hasDiscount: boolean;
    discountPercent: number;
    discountType: string;
  } | null>(null);

  useEffect(() => { 
    fetchUsage();
    fetchReferralData();
    fetchDiscountInfo();
  }, []);

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

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral/my-code');
      const data = await res.json();
      setReferralData(data);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  };

  const fetchDiscountInfo = async () => {
    try {
      const res = await fetch('/api/billing/discount-info');
      const data = await res.json();
      setDiscountInfo(data);
    } catch (error) {
      console.error('Failed to fetch discount info:', error);
    }
  };

  const calculateDiscountedPrice = (originalPrice: number): number => {
    if (!discountInfo?.hasDiscount) return originalPrice;
    const discount = Math.round(originalPrice * (discountInfo.discountPercent / 100));
    return originalPrice - discount;
  };

  const handleCopyReferral = () => {
    if (referralData?.referralUrl) {
      copyToClipboard(
        referralData.referralUrl, 
        '🎁 Referral link copied! Share it to earn free months'
      );
    }
  };

  const handleUpgrade = async (planId: string) => {
    setCheckingOut(planId);
    
    try {
      const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
      const monthlyPrice = plan.prices.BDT;
      const amount = billing === 'yearly' 
        ? getYearlyTotal(monthlyPrice)
        : monthlyPrice;
      
      // Open bKash payment modal
      setBkashModal({
        isOpen: true,
        planId,
        planName: plan.name,
        amount,
      });
    } catch (error) {
      alert('Failed to start checkout. Please try again.');
      console.error('Checkout error:', error);
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
          Bangla Writer Pricing
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Choose Your Perfect Plan
        </h1>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          Try 3 generations. Choose a plan if you like it.
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
            Monthly
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
            Yearly
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              20% OFF
            </span>
          </button>
        </div>
      </div>

      {/* ── Pricing Grid ── */}
      <div className="grid md:grid-cols-3 gap-6 px-2">
        {Object.entries(PRICING_PLANS).filter(([id]) => id !== 'free').map(([planId, plan]) => {
          const style = PLAN_STYLE[planId];
          const Icon = style.icon;
          const isCurrent = planId === currentPlan;
          const isPopular = !!(plan as any).popular;

          const bdtMonthly = plan.prices.BDT;
          let displayPrice = billing === 'yearly'
            ? getYearlyMonthly(bdtMonthly)
            : bdtMonthly;

          // Apply referral discount
          let finalPrice = displayPrice;
          let hasReferralDiscount = false;
          if (discountInfo?.hasDiscount) {
            finalPrice = calculateDiscountedPrice(displayPrice);
            hasReferralDiscount = true;
          }

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
                {/* Referral Discount Badge */}
                {hasReferralDiscount && (
                  <div className="mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <Gift className="w-3 h-3" />
                    {discountInfo?.message || `${discountInfo?.discountPercent}% Discount Applied`}
                  </div>
                )}
                
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-slate-400 text-2xl font-medium leading-none">৳</span>
                  {hasReferralDiscount && (
                    <span className="text-3xl font-bold text-slate-400 line-through leading-none mr-2">
                      {displayPrice.toLocaleString('en-BD')}
                    </span>
                  )}
                  <span className={`text-5xl font-black leading-none tracking-tight ${hasReferralDiscount ? 'text-green-600' : 'text-slate-900'}`}>
                    {finalPrice.toLocaleString('en-BD')}
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
                        Processing...
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
          { icon: Shield,      title: '30 Day Money Back',       sub: 'Risk-free trial' },
          { icon: Clock,       title: '24 Hour Activation',  sub: 'Instant start' },
          { icon: RefreshCcw,  title: 'Cancel Anytime',        sub: 'No commitment' },
          { icon: Wallet,      title: 'bKash Send Money',          sub: 'Easy payment' },
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

      {/* ── Referral Card ── */}
      {referralData && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 rounded-2xl p-8 px-2 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Refer & Earn</h2>
                </div>
                <p className="text-slate-600">
                  Invite creators and unlock <span className="font-bold text-purple-600">free months</span> when they subscribe!
                </p>
              </div>
            </div>

            {/* Referral Code & Link */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Your Referral Code</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-600 tracking-wider">
                    {referralData.referralCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralData.referralCode, 'Code copied!')}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Referral Link</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-slate-700 truncate flex-1">
                    {referralData.referralUrl}
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Progress to Next Reward */}
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-slate-700">Progress to Next Reward</div>
                  <div className="text-xs text-slate-500">
                    {referralData.stats?.paidReferrals || 0} paid referrals
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {referralData.stats?.paidReferrals || 0}/3
                  </div>
                  <div className="text-xs text-slate-500">to 14 Days Free</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(((referralData.stats?.paidReferrals || 0) / 3) * 100, 100)}%` }}
                />
              </div>

              {/* Milestone badges */}
              <div className="grid grid-cols-5 gap-2 mt-5">
                {[
                  { count: 1, reward: 'Progress', icon: '📊' },
                  { count: 3, reward: '14 Days', icon: '🎯' },
                  { count: 5, reward: '1 Month', icon: '🎉' },
                  { count: 10, reward: '2 Months', icon: '🏆' },
                  { count: 25, reward: '20% Forever', icon: '⭐' },
                ].map(({ count, reward, icon }) => {
                  const achieved = (referralData.stats?.paidReferrals || 0) >= count;
                  return (
                    <div
                      key={count}
                      className={`text-center p-3 rounded-lg transition-all ${
                        achieved
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className={`text-xs font-bold ${achieved ? 'text-purple-600' : 'text-slate-400'}`}>
                        {count}
                      </div>
                      <div className={`text-xs ${achieved ? 'text-slate-700' : 'text-slate-400'}`}>
                        {reward}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rewards Info */}
            <div className="mt-5 grid md:grid-cols-3 gap-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-purple-100">
                <div className="text-lg font-bold text-slate-900">{referralData.stats?.totalReferrals || 0}</div>
                <div className="text-xs text-slate-500">Total Signups</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-purple-100">
                <div className="text-lg font-bold text-purple-600">{referralData.stats?.paidReferrals || 0}</div>
                <div className="text-xs text-slate-500">Paid Referrals</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center border border-purple-100">
                <div className="text-lg font-bold text-green-600">{referralData.stats?.rewardsEarned || 0}</div>
                <div className="text-xs text-slate-500">Rewards Earned</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Current Subscription Card ── */}
      {usage?.subscription && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 px-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Current Subscription</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Status', value: usage.subscription.status },
              { label: 'Expires', value: formatDate(usage.subscription.currentPeriodEnd) },
              { label: 'Plan', value: PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS]?.name || 'Free' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{label}</div>
                <div className="font-semibold capitalize text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* bKash Payment Modal */}
      {bkashModal && (
        <BkashPaymentModal
          isOpen={bkashModal.isOpen}
          onClose={() => setBkashModal(null)}
          planId={bkashModal.planId}
          planName={bkashModal.planName}
          amount={bkashModal.amount}
          billing={billing}
        />
      )}

    </div>
  );
}
