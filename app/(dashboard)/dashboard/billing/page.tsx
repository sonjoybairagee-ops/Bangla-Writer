'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRICING_PLANS } from '@/lib/constants/pricing';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Check, Crown, Zap } from 'lucide-react';

export default function BillingPage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert('Failed to start checkout process');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const currentPlan = usage?.planId || 'starter';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Usage & Billing</h1>
        <p className="text-slate-600">
          Manage your subscription and usage
        </p>
      </div>

      {/* Current Plan */}
      {usage?.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You're on the {PRICING_PLANS[currentPlan]?.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Status</div>
                <div className="font-medium capitalize">
                  {usage.subscription.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Current Period Ends</div>
                <div className="font-medium">
                  {formatDate(usage.subscription.currentPeriodEnd)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Amount</div>
                <div className="font-medium">
                  {formatCurrency(
                    PRICING_PLANS[currentPlan]?.prices.USD || 0,
                    'USD'
                  )}
                  /month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UsageBar
              label="Scripts Generated"
              current={usage?.usage.scriptsGenerated || 0}
              limit={usage?.limits.scripts_per_month || 0}
            />
            <UsageBar
              label="Hooks Generated"
              current={usage?.usage.hooksGenerated || 0}
              limit={usage?.limits.hooks_per_month || 0}
            />
            <UsageBar
              label="Content Plans"
              current={usage?.usage.contentPlansCreated || 0}
              limit={usage?.limits.content_plans || 0}
            />
            <UsageBar
              label="OVC Scenes"
              current={usage?.usage.ovcScenesGenerated || 0}
              limit={usage?.limits.ovc_scenes || 0}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(PRICING_PLANS).map(([planId, plan]) => (
            <Card
              key={planId}
              className={
                planId === currentPlan
                  ? 'border-purple-600 border-2'
                  : plan.popular
                  ? 'border-purple-300 border-2'
                  : ''
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold">
                    ${plan.prices.USD}
                    <span className="text-lg text-slate-600 font-normal">
                      /month
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    ৳{plan.prices.BDT}/month for Bangladesh
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {planId === currentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade(planId)}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      'Processing...'
                    ) : planId === 'agency' ? (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Agency
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to {plan.name}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageBar({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : (current / limit) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-slate-600">
          {current} / {isUnlimited ? 'Unlimited' : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
