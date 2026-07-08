'use client';

import { useEffect, useState } from 'react';
import { Gift, Copy, Users, Award, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { formatDate } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils/clipboard';

export default function ReferralsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/referral/my-code');
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
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const { stats } = data || {};
  const paidReferrals = stats?.paidReferrals || 0;

  // Determine next milestone
  const milestones = [
    { count: 1, reward: 'Track Progress', days: 0, icon: '📊', color: 'blue' },
    { count: 3, reward: '14 Days Pro Free', days: 14, icon: '🎯', color: 'green' },
    { count: 5, reward: '1 Month Pro Free', days: 30, icon: '🎉', color: 'purple' },
    { count: 10, reward: '2 Months Pro + Badge', days: 60, icon: '🏆', color: 'amber' },
    { count: 25, reward: 'Lifetime 20% Discount', days: 0, icon: '⭐', color: 'pink' },
    { count: 50, reward: '3 Months Agency + Ambassador', days: 90, icon: '👑', color: 'rose' },
  ];

  const nextMilestone = milestones.find((m) => paidReferrals < m.count) || milestones[milestones.length - 1];
  const progress = nextMilestone ? (paidReferrals / nextMilestone.count) * 100 : 100;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          <Gift className="w-4 h-4" />
          Referral Program
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Refer & Earn Rewards
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto">
          Share your referral link and earn free months when your friends subscribe. 
          The more you refer, the bigger the rewards!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="text-3xl font-black text-blue-600">
              {stats?.totalReferrals || 0}
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Total Signups</div>
          <div className="text-xs text-slate-500 mt-1">People who used your link</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="text-3xl font-black text-purple-600">
              {paidReferrals}
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Paid Referrals</div>
          <div className="text-xs text-slate-500 mt-1">Friends with active subscriptions</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-green-600" />
            <div className="text-3xl font-black text-green-600">
              {stats?.rewardsEarned || 0}
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-700">Rewards Earned</div>
          <div className="text-xs text-slate-500 mt-1">Milestones you've unlocked</div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-30" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Referral Link</h2>
              <p className="text-sm text-slate-600">Share this link to start earning rewards</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-5">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Referral Code</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-purple-600 tracking-wider">
                  {data?.referralCode}
                </div>
                <CopyButton 
                  text={data?.referralCode || ''} 
                  successMessage="Code copied!"
                  variant="outline"
                  size="icon"
                  showText={false}
                />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-5">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Share Link</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-sm text-slate-700 truncate">
                  {data?.referralUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(data?.referralUrl, '🎁 Link copied! Share it to earn rewards')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all flex items-center gap-2 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border-2 border-purple-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Progress</h2>
            <p className="text-sm text-slate-500">
              {paidReferrals} of {nextMilestone.count} paid referrals
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-purple-600">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-slate-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-700 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Next Reward */}
        {paidReferrals < 50 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">{nextMilestone.icon}</div>
            <div className="text-sm text-slate-500 mb-1">Next Reward</div>
            <div className="text-xl font-bold text-slate-900 mb-2">
              {nextMilestone.reward}
            </div>
            <div className="text-sm text-purple-600 font-semibold">
              {nextMilestone.count - paidReferrals} more {nextMilestone.count - paidReferrals === 1 ? 'referral' : 'referrals'} needed
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Reward Milestones</h2>
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const achieved = paidReferrals >= milestone.count;
            const inProgress = paidReferrals < milestone.count && nextMilestone.count === milestone.count;

            return (
              <div
                key={milestone.count}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  achieved
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : inProgress
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-4xl">{milestone.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-slate-900">{milestone.reward}</div>
                    {achieved && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-slate-600">
                    {milestone.count} paid {milestone.count === 1 ? 'referral' : 'referrals'}
                    {milestone.days > 0 && ` • ${milestone.days} days free`}
                  </div>
                </div>
                <div className={`text-2xl font-black ${
                  achieved ? 'text-green-600' : inProgress ? 'text-purple-600' : 'text-slate-400'
                }`}>
                  {milestone.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral List */}
      {data?.referrals && data.referrals.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Referrals</h2>
          <div className="space-y-3">
            {data.referrals.map((referral: any) => {
              const hasPaid = referral.subscriptions.length > 0;
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      hasPaid ? 'bg-green-100' : 'bg-slate-100'
                    }`}>
                      {hasPaid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{referral.name || 'Anonymous'}</div>
                      <div className="text-sm text-slate-500">{referral.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold mb-1 ${
                      hasPaid ? 'text-green-600' : 'text-slate-400'
                    }`}>
                      {hasPaid ? '✓ Paid' : 'Pending'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDate(referral.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* How it Works */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              1
            </div>
            <div className="font-semibold text-slate-900 mb-2">Share Your Link</div>
            <div className="text-sm text-slate-600">
              Copy your unique referral link and share it with friends, family, or your audience
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              2
            </div>
            <div className="font-semibold text-slate-900 mb-2">They Subscribe</div>
            <div className="text-sm text-slate-600">
              When someone signs up using your link and subscribes to a paid plan, they get 20% off
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              3
            </div>
            <div className="font-semibold text-slate-900 mb-2">Earn Rewards</div>
            <div className="text-sm text-slate-600">
              Reach milestones to unlock free months, discounts, and exclusive badges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
