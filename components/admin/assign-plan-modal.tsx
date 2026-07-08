'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Calendar, CreditCard, User } from 'lucide-react';

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
  { id: 'free', name: 'Free', price: 0, color: 'secondary', icon: '🆓' },
  { id: 'starter', name: 'Starter', price: 699, color: 'info', icon: '🚀' },
  { id: 'pro', name: 'Pro', price: 999, color: 'purple', icon: '⭐' },
  { id: 'agency', name: 'Agency', price: 2999, color: 'warning', icon: '👑' },
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

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Assign Plan to User
          </DialogTitle>
          <DialogDescription>
            Manually assign a subscription plan to {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <span>Select Plan</span>
              <Badge variant="secondary" className="text-xs">Required</Badge>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                    selectedPlan === plan.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{plan.icon}</span>
                    {selectedPlan === plan.id && (
                      <div className="bg-purple-600 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-lg">{plan.name}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    ৳{plan.price}{plan.price > 0 && '/month'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Billing Cycle */}
          {selectedPlan !== 'free' && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Billing Cycle</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    billingCycle === 'monthly'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Monthly</span>
                    {billingCycle === 'monthly' && (
                      <Check className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className="text-sm text-slate-600">
                    Billed every month
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    billingCycle === 'yearly'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Yearly</span>
                    {billingCycle === 'yearly' ? (
                      <Check className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Badge variant="success" className="text-xs">
                        Save 20%
                      </Badge>
                    )}
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
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duration (days)
            </label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
              min="1"
              placeholder="30"
              label=""
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span>Plan will be active for</span>
              <Badge variant="outline" className="text-xs">{duration} days</Badge>
              <span>from now</span>
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl border border-slate-200">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Assignment Summary
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  User
                </span>
                <span className="font-medium text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Plan</span>
                <Badge variant={selectedPlanData?.color as any}>
                  {selectedPlanData?.icon} {selectedPlanData?.name}
                </Badge>
              </div>
              {selectedPlan !== 'free' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Billing</span>
                  <Badge variant="outline" className="capitalize">
                    {billingCycle}
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Valid until
                </span>
                <span className="font-medium text-sm">
                  {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssignPlan} 
            disabled={loading}
            loading={loading}
            variant="gradient"
          >
            Assign Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
