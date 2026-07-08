'use client';

import { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, Award, Clock, 
  CheckCircle, XCircle, Gift, Copy,
  ArrowUpRight, ArrowDownRight, Trophy,
  Calendar, DollarSign
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils/clipboard';

export default function AdminReferralsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/referrals');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading referral data...</p>
        </div>
      </div>
    );
  }

  const { stats, referrals = [], rewards = [], topReferrers = [] } = data || {};

  // Filter referrals
  const filteredReferrals = referrals.filter((r: any) => {
    if (filter === 'paid') return r.subscriptions.length > 0;
    if (filter === 'pending') return r.subscriptions.length === 0;
    return true;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Referral Management</h1>
          <p className="text-slate-500 mt-1">Track and manage your referral program</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg">
          <Gift className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">Admin Dashboard</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {stats?.totalSignups || 0}
          </div>
          <div className="text-sm font-medium text-slate-600">Total Signups</div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {stats?.paidReferrals || 0}
          </div>
          <div className="text-sm font-medium text-slate-600">Paid Referrals</div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-amber-600" />
            <ArrowDownRight className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {stats?.pendingReferrals || 0}
          </div>
          <div className="text-sm font-medium text-slate-600">Pending</div>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-purple-600" />
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {stats?.totalRewards || 0}
          </div>
          <div className="text-sm font-medium text-slate-600">Rewards Given</div>
        </div>

        <div className="bg-white border-2 border-pink-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-pink-600" />
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {stats?.conversionRate || 0}%
          </div>
          <div className="text-sm font-medium text-slate-600">Conversion</div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">Top Referrers</h2>
        </div>
        <div className="space-y-3">
          {topReferrers.slice(0, 5).map((referrer: any, index: number) => (
            <div
              key={referrer.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                  index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{referrer.name || 'Anonymous'}</div>
                  <div className="text-sm text-slate-500">{referrer.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-slate-500">Code</div>
                  <div className="font-mono font-bold text-purple-600 flex items-center gap-2">
                    {referrer.referralCode}
                    <button
                      onClick={() => copyToClipboard(referrer.referralCode, 'Code copied!')}
                      className="p-1 hover:bg-purple-100 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="text-lg font-bold text-slate-900">{referrer.totalReferrals}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Paid</div>
                  <div className="text-lg font-bold text-green-600">{referrer.paidReferrals}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Rewards */}
      {rewards.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">Recent Rewards</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Reward Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {rewards.slice(0, 10).map((reward: any) => (
                  <tr key={reward.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{reward.user.name}</div>
                      <div className="text-sm text-slate-500">{reward.user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                        <Gift className="w-3 h-3" />
                        {reward.rewardType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {formatDate(reward.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Referrals */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">All Referrals</h2>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({referrals.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                filter === 'paid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid ({stats?.paidReferrals || 0})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                filter === 'pending'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({stats?.pendingReferrals || 0})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Referred User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Referrer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((referral: any) => {
                const hasPaid = referral.subscriptions.length > 0;
                const subscription = referral.subscriptions[0];
                
                return (
                  <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{referral.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-500">{referral.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{referral.referrer?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500 font-mono">{referral.referrer?.referralCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      {hasPaid ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {subscription ? (
                        <span className="text-sm font-semibold text-purple-600 capitalize">
                          {subscription.planId}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {formatDate(referral.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredReferrals.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No referrals found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
