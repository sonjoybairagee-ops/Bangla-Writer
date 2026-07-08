'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Smartphone,
  User,
  Mail,
  Phone,
  DollarSign,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'all';

interface Payment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: string;
  billing: string;
  transactionId: string;
  phoneNumber: string;
  email: string;
  status: string;
  method: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentStatus>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?status=${filter}`);
      const data = await res.json();
      
      if (res.ok) {
        setPayments(data.payments);
      } else {
        alert(data.error || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      alert('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (paymentId: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) {
      return;
    }

    setProcessing(paymentId);
    try {
      const res = await fetch('/api/admin/grant-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || `Payment ${action}d successfully`);
        fetchPayments(); // Refresh list
      } else {
        alert(data.error || `Failed to ${action} payment`);
      }
    } catch (error) {
      console.error(`Failed to ${action} payment:`, error);
      alert(`Failed to ${action} payment`);
    } finally {
      setProcessing(null);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    return (
      payment.user.name?.toLowerCase().includes(query) ||
      payment.user.email?.toLowerCase().includes(query) ||
      payment.transactionId?.toLowerCase().includes(query) ||
      payment.phoneNumber?.includes(query)
    );
  });

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === 'pending').length,
    verified: payments.filter((p) => p.status === 'verified').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
    totalAmount: payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-pink-600" />
            bKash Payments
          </h1>
          <p className="text-slate-500 mt-1">
            Verify and manage manual bKash payments
          </p>
        </div>
        <Button
          onClick={fetchPayments}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium uppercase">Pending</p>
              <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium uppercase">Verified</p>
              <p className="text-2xl font-bold text-green-900">{stats.verified}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 font-medium uppercase">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium uppercase">Revenue</p>
              <p className="text-2xl font-bold text-purple-900">
                ৳{stats.totalAmount.toLocaleString('en-BD')}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, TRX ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'verified', 'rejected'] as PaymentStatus[]).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              className={
                filter === status
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : ''
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card className="p-12 text-center">
          <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No payments found</p>
          <p className="text-slate-400 text-sm mt-1">
            {searchQuery ? 'Try a different search query' : 'Payments will appear here'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-6">
                {/* Payment Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {payment.planName}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              payment.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : payment.status === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          {payment.billing === 'yearly' ? 'Yearly' : 'Monthly'} Billing
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        ৳{parseFloat(payment.amount).toLocaleString('en-BD')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <User className="w-3 h-3" />
                        User
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {payment.user.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500">{payment.user.email}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Smartphone className="w-3 h-3" />
                        TRX ID
                      </div>
                      <p className="font-mono font-semibold text-sm text-slate-900">
                        {payment.transactionId}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Phone className="w-3 h-3" />
                        Phone
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {payment.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </div>
                      <p className="text-sm text-slate-900 truncate">
                        {payment.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {payment.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleAction(payment.id, 'approve')}
                      disabled={processing === payment.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(payment.id, 'reject')}
                      disabled={processing === payment.id}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
