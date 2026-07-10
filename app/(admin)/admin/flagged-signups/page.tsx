import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FlaggedSignupCard } from './flagged-signup-card';

export default async function FlaggedSignupsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (adminUser?.role !== 'admin') redirect('/dashboard');

  // Get flagged signups
  const [pending, reviewed] = await Promise.all([
    prisma.flaggedSignup.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            subscriptions: {
              select: {
                planId: true,
                status: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.flaggedSignup.findMany({
      where: { status: { in: ['approved', 'rejected', 'blocked'] } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { reviewedAt: 'desc' },
      take: 20,
    }),
  ]);

  const stats = {
    pending: pending.length,
    highRisk: pending.filter((f) => f.riskLevel === 'high').length,
    mediumRisk: pending.filter((f) => f.riskLevel === 'medium').length,
    lowRisk: pending.filter((f) => f.riskLevel === 'low').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Flagged Signups</h1>
        <p className="text-slate-600 mt-2">
          Review suspicious signups and take action
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-6">
          <div className="text-sm text-slate-600 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-sm text-red-600 mb-1">High Risk</div>
          <div className="text-3xl font-bold text-red-700">{stats.highRisk}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="text-sm text-yellow-600 mb-1">Medium Risk</div>
          <div className="text-3xl font-bold text-yellow-700">{stats.mediumRisk}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-sm text-green-600 mb-1">Low Risk</div>
          <div className="text-3xl font-bold text-green-700">{stats.lowRisk}</div>
        </div>
      </div>

      {/* Pending Signups */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Pending Review ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="text-center py-12 bg-white border rounded-xl">
            <div className="text-slate-400 text-lg">✅ No pending reviews</div>
            <p className="text-slate-500 text-sm mt-2">All signups are clean!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((flagged) => (
              <FlaggedSignupCard key={flagged.id} flagged={flagged} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Recent Reviews ({reviewed.length})
        </h2>

        {reviewed.length === 0 ? (
          <div className="text-center py-8 bg-white border rounded-xl text-slate-400">
            No reviews yet
          </div>
        ) : (
          <div className="space-y-2">
            {reviewed.map((flagged) => (
              <div
                key={flagged.id}
                className="border rounded-lg p-4 bg-white flex items-center justify-between text-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {flagged.user.name} ({flagged.email})
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    {flagged.flags.join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      flagged.status === 'approved'
                        ? 'bg-green-50 text-green-700'
                        : flagged.status === 'blocked'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {flagged.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {flagged.reviewedAt
                      ? new Date(flagged.reviewedAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
