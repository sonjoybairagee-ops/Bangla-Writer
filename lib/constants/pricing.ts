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
      '13 total generations',
      '10 quick + 3 creative',
      '1 brand profile',
      'All basic features',
    ],
    limits: {
      scripts_per_month: 13,
      hooks_per_month: 13,
      brand_profiles: 1,
      content_plans: 1,
      ovc_scenes: 3,
      device_login: 1,
      quick_generations_per_month: 10,
      creative_generations_per_month: 3,
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
      '200 generations / month',
      '150 quick + 50 creative',
      '30-day content plan',
      'All AI features',
      'WhatsApp support',
    ],
    limits: {
      scripts_per_month: 200,
      hooks_per_month: 200,
      brand_profiles: 1,
      content_plans: 5,
      ovc_scenes: 50,
      device_login: 1,
      quick_generations_per_month: 150,
      creative_generations_per_month: 50,
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
      '350 generations / month',
      '250 quick + 100 creative',
      '2 device login',
      'Unlimited content plan days',
      'Priority WhatsApp support',
    ],
    limits: {
      scripts_per_month: 350,
      hooks_per_month: 350,
      brand_profiles: 2,
      content_plans: 10,
      ovc_scenes: 100,
      device_login: 2,
      quick_generations_per_month: 250,
      creative_generations_per_month: 100,
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
      '1100 generations / month',
      '800 quick + 300 creative',
      '5 device login',
      'Multi-brand workflow',
      'Dedicated support',
    ],
    limits: {
      scripts_per_month: 1100,
      hooks_per_month: 1100,
      brand_profiles: 10,
      content_plans: 30,
      ovc_scenes: 300,
      device_login: 5,
      quick_generations_per_month: 800,
      creative_generations_per_month: 300,
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

export function canGenerateQuick(usage: any, planId: string): boolean {
  const limits = getPlanLimits(planId);
  if (limits.quick_generations_per_month === -1) return true;
  return usage.quickGenerated < limits.quick_generations_per_month;
}

export function canGenerateCreative(usage: any, planId: string): boolean {
  const limits = getPlanLimits(planId);
  if (limits.creative_generations_per_month === -1) return true;
  return usage.creativeGenerated < limits.creative_generations_per_month;
}
