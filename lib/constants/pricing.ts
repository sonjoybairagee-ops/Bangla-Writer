export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free Trial',
    description: 'Try all features for 7 days',
    prices: {
      USD: 0,
      BDT: 0,
      EUR: 0,
    },
    paddle_price_ids: {
      monthly_usd: '',
      monthly_eur: '',
      yearly_usd: '',
      yearly_eur: '',
    },
    features: [
      '7 days free trial',
      '3 Content Write',
      '3 Hook Generate',
      '3 AI Writer',
      'All basic features',
    ],
    limits: {
      scripts_per_month: 3,
      hooks_per_month: 3,
      brand_profiles: 1,
      content_plans: 3,
      ovc_scenes: 0,
      device_login: 1,
    },
    trial: true,
    trialDays: 7,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'ছোট ও মিড কন্টেন্ট ক্রিয়েটরদের জন্য',
    prices: {
      USD: 7,
      BDT: 699,
      EUR: 6,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_STARTER_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_STARTER_EUR || '',
      yearly_usd: process.env.PADDLE_PRICE_STARTER_YEARLY_USD || '',
      yearly_eur: process.env.PADDLE_PRICE_STARTER_YEARLY_EUR || '',
    },
    features: [
      '90 generations / month',
      '30-day content plan',
      'All AI features',
      'WhatsApp support',
      '1 device login',
    ],
    limits: {
      scripts_per_month: 90,
      hooks_per_month: 90,
      brand_profiles: 1,
      content_plans: 30,
      ovc_scenes: 0,
      device_login: 1,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'রেগুলার ক্রিয়েটর ও বিজনেসের জন্য',
    prices: {
      USD: 10,
      BDT: 999,
      EUR: 9,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_PRO_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_PRO_EUR || '',
      yearly_usd: process.env.PADDLE_PRICE_PRO_YEARLY_USD || '',
      yearly_eur: process.env.PADDLE_PRICE_PRO_YEARLY_EUR || '',
    },
    features: [
      '200 generations / month',
      '2 device login',
      'Unlimited content plan days',
      'Story Maker AI + Visual Hook Pro',
      'Priority WhatsApp support',
    ],
    limits: {
      scripts_per_month: 200,
      hooks_per_month: -1,
      brand_profiles: 2,
      content_plans: -1,
      ovc_scenes: 200,
      device_login: 2,
    },
    popular: true,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'টিম ও মাল্টি-ব্র্যান্ড ওয়ার্কফ্লোর জন্য',
    prices: {
      USD: 30,
      BDT: 2999,
      EUR: 28,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_AGENCY_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_AGENCY_EUR || '',
      yearly_usd: process.env.PADDLE_PRICE_AGENCY_YEARLY_USD || '',
      yearly_eur: process.env.PADDLE_PRICE_AGENCY_YEARLY_EUR || '',
    },
    features: [
      '1000 generations / month',
      '5 device login',
      'Multi-brand workflow',
      'All Pro features',
      'Dedicated support',
    ],
    limits: {
      scripts_per_month: 1000,
      hooks_per_month: -1,
      brand_profiles: 10,
      content_plans: -1,
      ovc_scenes: -1,
      device_login: 5,
    },
  },
} as const;

export type PlanId = keyof typeof PRICING_PLANS;

export function getPlanLimits(planId: string) {
  return PRICING_PLANS[planId as PlanId]?.limits || PRICING_PLANS.starter.limits;
}

export function canGenerateScript(usage: any, planId: string): boolean {
  const limits = getPlanLimits(planId);
  if (limits.scripts_per_month === -1) return true;
  return usage.scriptsGenerated < limits.scripts_per_month;
}

export function canGenerateHook(usage: any, planId: string): boolean {
  const limits = getPlanLimits(planId);
  if (limits.hooks_per_month === -1) return true;
  return usage.hooksGenerated < limits.hooks_per_month;
}

export function canCreateContentPlan(usage: any, planId: string): boolean {
  const limits = getPlanLimits(planId);
  if (limits.content_plans === -1) return true;
  return usage.contentPlansCreated < limits.content_plans;
}
