'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, AlertTriangle } from 'lucide-react';

interface FlaggedSignupCardProps {
  flagged: any;
}

export function FlaggedSignupCard({ flagged }: FlaggedSignupCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const handleDecision = async (decision: 'approve' | 'reject' | 'block') => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/flagged-signups/${flagged.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    flagged.riskLevel === 'high'
      ? 'border-red-300 bg-red-50'
      : flagged.riskLevel === 'medium'
      ? 'border-yellow-300 bg-yellow-50'
      : 'border-green-300 bg-green-50';

  const riskBadge =
    flagged.riskLevel === 'high'
      ? 'bg-red-100 text-red-700'
      : flagged.riskLevel === 'medium'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700';

  return (
    <div className={`border-2 rounded-xl p-5 ${riskColor}`}>
      <div className="flex items-start justify-between gap-4">
        {/* User Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2">
              <span className="text-lg font-bold text-slate-700">
                {flagged.user?.name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <div className="font-bold text-slate-900">{flagged.user?.name}</div>
              <div className="text-sm text-slate-600">{flagged.email}</div>
            </div>
          </div>

          {/* Risk Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskBadge}`}>
              {flagged.riskLevel.toUpperCase()} RISK
            </span>
            {flagged.flags.map((flag: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-white border px-3 py-1 rounded-full text-slate-700"
              >
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-500 text-xs">IP Address</div>
              <div className="font-mono text-slate-900">{flagged.ipAddress || 'N/A'}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Signed Up</div>
              <div className="text-slate-900">
                {new Date(flagged.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Current Plan</div>
              <div className="text-slate-900">
                {flagged.user?.subscriptions[0]?.planId || 'free'}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">Similar Accounts</div>
              <div className="text-slate-900">
                {(flagged.metadata as any)?.similarAccounts || 0}
              </div>
            </div>
          </div>

          {/* Reason */}
          {flagged.reason && (
            <div className="bg-white border rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">Detection Reason</div>
              <div className="text-sm text-slate-700">{flagged.reason}</div>
            </div>
          )}

          {/* Notes Input */}
          {showNotes && (
            <div>
              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                placeholder="Add review notes (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleDecision('approve')}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>

          <button
            onClick={() => handleDecision('reject')}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject
          </button>

          <button
            onClick={() => handleDecision('block')}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            Block
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 border-2 hover:bg-white px-4 py-2 rounded-lg font-medium transition-colors text-slate-700"
          >
            <Eye className="w-4 h-4" />
            {showNotes ? 'Hide' : 'Notes'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-3 text-center text-sm text-slate-600">
          Processing...
        </div>
      )}
    </div>
  );
}
