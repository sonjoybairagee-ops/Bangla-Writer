'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Check,
  ArrowRight 
} from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small creators',
      monthlyPrice: 29,
      yearlyPrice: Math.round(29 * 12 * 0.8), // 20% discount
      features: [
        '10,000 words/month',
        'Brand Brain (1 brand)',
        'AI Content Writer',
        'Hook Generator',
        'Basic templates',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      description: 'Best for growing businesses and agencies',
      monthlyPrice: 79,
      yearlyPrice: Math.round(79 * 12 * 0.8), // 20% discount
      features: [
        '50,000 words/month',
        'Brand Brain (5 brands)',
        'All AI Tools',
        'OVC Director',
        'Content Planner',
        'Advanced frameworks',
        'Priority support',
        'Team collaboration',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For large teams and organizations',
      monthlyPrice: 199,
      yearlyPrice: Math.round(199 * 12 * 0.8), // 20% discount
      features: [
        'Unlimited words',
        'Brand Brain (Unlimited brands)',
        'All AI Tools',
        'White-label options',
        'Custom integrations',
        'Dedicated account manager',
        'Custom training',
        '24/7 premium support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

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

      {/* Pricing Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your content needs. All plans include a 7-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-white rounded-full shadow-sm mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-full transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              billingPeriod === 'yearly'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yearly
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto text-left">
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
              answer="After 7 days, you'll be charged based on your selected plan. You can cancel anytime during the trial with no charges."
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
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">
            Start Your Free Trial Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No credit card required. Get full access to all features for 7 days.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  plan,
  billingPeriod,
}: {
  plan: {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    cta: string;
    highlighted: boolean;
  };
  billingPeriod: 'monthly' | 'yearly';
}) {
  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const savings = billingPeriod === 'yearly' ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0;

  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all ${
        plan.highlighted ? 'ring-2 ring-purple-600 scale-105' : ''
      }`}
    >
      {plan.highlighted && (
        <div className="bg-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <p className="text-slate-600 mb-6">{plan.description}</p>
      
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">${price}</span>
          <span className="text-slate-600">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        {billingPeriod === 'yearly' && savings > 0 && (
          <p className="text-sm text-green-600 mt-2">
            Save ${savings}/year
          </p>
        )}
      </div>

      <Link href="/register">
        <Button
          className="w-full mb-6"
          variant={plan.highlighted ? 'default' : 'outline'}
          size="lg"
        >
          {plan.cta}
        </Button>
      </Link>

      <div className="space-y-3">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">{feature}</span>
          </div>
        ))}
      </div>
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
