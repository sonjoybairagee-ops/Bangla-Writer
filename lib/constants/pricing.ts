export const PRICING_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and content creators',
    prices: {
      USD: 29,
      BDT: 3000,
      EUR: 27,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_STARTER_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_STARTER_EUR || '',
    },
    features: [
      'Brand Brain - Store your brand voice',
      'AI Content Writer (5 frameworks)',
      '100 scripts per month',
      'Basic Hook Generator',
      '1 Brand Profile',
      'Script Library',
      'Email Support',
    ],
    limits: {
      scripts_per_month: 100,
      hooks_per_month: 200,
      brand_profiles: 1,
      content_plans: 5,
      ovc_scenes: 0,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing businesses',
    prices: {
      USD: 79,
      BDT: 8000,
      EUR: 75,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_PRO_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_PRO_EUR || '',
    },
    features: [
      'Everything in Starter',
      'Story Maker AI (OVC Director)',
      'Content Planner (30-day strategy)',
      'Framework Brain',
      '500 scripts per month',
      'Unlimited hooks',
      '3 Brand Profiles',
      'Priority AI processing',
      'Advanced Analytics',
      'Priority Support',
    ],
    limits: {
      scripts_per_month: 500,
      hooks_per_month: -1, // unlimited
      brand_profiles: 3,
      content_plans: 20,
      ovc_scenes: 100,
    },
    popular: true,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'For agencies and teams',
    prices: {
      USD: 199,
      BDT: 20000,
      EUR: 189,
    },
    paddle_price_ids: {
      monthly_usd: process.env.PADDLE_PRICE_AGENCY_USD || '',
      monthly_eur: process.env.PADDLE_PRICE_AGENCY_EUR || '',
    },
    features: [
      'Everything in Pro',
      'Unlimited scripts',
      'Unlimited content plans',
      'White-label option',
      'API access',
      '5 Brand Profiles',
      'Team collaboration',
      'Custom AI training',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      scripts_per_month: -1, // unlimited
      hooks_per_month: -1,
      brand_profiles: 5,
      content_plans: -1,
      ovc_scenes: -1,
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
