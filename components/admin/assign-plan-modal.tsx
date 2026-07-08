'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface AssignPlanModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  { id: 'free', name: 'Free', price: 0, color: 'slate' },
  { id: 'starter', name: 'Starter', price: 699, color: 'blue' },
  { id: 'pro', name: 'Pro', price: 999, color: 'purple' },
  { id: 'agency', name: 'Agency', price: 2999, color: 'amber' },
];

export default function AssignPlanModal({
  user,
  isOpen,
  onClose,
}: AssignPlanModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [duration, setDuration] = useState(30); // days
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssignPlan = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/assign-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planId: selectedPlan,
          billingCycle,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign plan');
      }

      // Success
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Plan to User</DialogTitle>
          <DialogDescription>
            Manually assign a subscription plan to {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Plan</label>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPlan === plan.id
                      ? `border-${plan.color}-500 bg-${plan.color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{plan.name}</span>
                    {selectedPlan === plan.id && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div className="text-sm text-slate-600">
                    ৳{plan.price}/month
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Billing Cycle */}
          {selectedPlan !== 'free' && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Billing Cycle</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    billingCycle === 'monthly'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium">Monthly</div>
                  <div className="text-sm text-slate-600">
                    Billed every month
                  </div>
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    billingCycle === 'yearly'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium flex items-center gap-2">
                    Yearly
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    Billed annually
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Duration (days)
            </label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
              min="1"
              placeholder="30"
            />
            <p className="text-xs text-slate-500">
              Plan will be active for {duration} days from now
            </p>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium">Summary</div>
            <div className="text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Billing:</span>
                <span className="font-medium capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid until:</span>
                <span className="font-medium">
                  {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAssignPlan} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
