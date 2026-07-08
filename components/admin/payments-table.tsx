'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentGateway: string;
  paymentMethod: string | null;
  status: string;
  paidAt: Date | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  subscription: {
    planId: string;
  } | null;
}

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      success: { 
        color: 'bg-green-100 text-green-700', 
        icon: CheckCircle, 
        label: 'Success' 
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-700', 
        icon: Clock, 
        label: 'Pending' 
      },
      failed: { 
        color: 'bg-red-100 text-red-700', 
        icon: XCircle, 
        label: 'Failed' 
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  const getPlanBadge = (planId: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      free: { color: 'bg-slate-100 text-slate-700', label: 'Free' },
      starter: { color: 'bg-blue-100 text-blue-700', label: 'Starter' },
      pro: { color: 'bg-purple-100 text-purple-700', label: 'Pro' },
      agency: { color: 'bg-amber-100 text-amber-700', label: 'Agency' },
    };

    const badge = badges[planId] || badges.free;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'BDT' ? 'BDT' : 'USD',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search payments by user, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-slate-600">
            {filteredPayments.length} payments
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Payment ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Gateway
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="text-sm font-mono text-slate-600">
                      {payment.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-sm">
                        {payment.user.name || 'No name'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {payment.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {payment.subscription ? (
                      getPlanBadge(payment.subscription.planId)
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold">
                      {formatAmount(payment.amount, payment.currency)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium capitalize">
                        {payment.paymentGateway}
                      </div>
                      {payment.paymentMethod && (
                        <div className="text-xs text-slate-500">
                          {payment.paymentMethod}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-600">
                      {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(payment.paidAt || payment.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No payments found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
