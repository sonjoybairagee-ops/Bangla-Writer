'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';

export function PaymentActionButtons({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handleDecision = async (action: 'approve' | 'reject') => {
    if (action === 'reject') {
      const confirmed = window.confirm('Reject this payment? This cannot be undone.');
      if (!confirmed) return;
    }

    setLoading(action);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to process');
        return;
      }

      router.refresh();
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2 flex-shrink-0">
      <Button
        size="sm"
        onClick={() => handleDecision('approve')}
        disabled={loading !== null}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading === 'approve' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" /> Approve
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleDecision('reject')}
        disabled={loading !== null}
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        {loading === 'reject' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <X className="h-4 w-4 mr-1" /> Reject
          </>
        )}
      </Button>
    </div>
  );
}
