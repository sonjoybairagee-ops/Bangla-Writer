'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Copy, Check, AlertCircle, Smartphone } from 'lucide-react';

interface BkashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amount: number;
  billing: 'monthly' | 'yearly';
}

export function BkashPaymentModal({
  isOpen,
  onClose,
  planId,
  planName,
  amount,
  billing,
}: BkashPaymentModalProps) {
  const [step, setStep] = useState<'instructions' | 'form'>('instructions');
  const [formData, setFormData] = useState({
    transactionId: '',
    phoneNumber: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const bkashNumber = '01870703475';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.transactionId || !formData.phoneNumber || !formData.email) {
      setError('All fields are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/payments/bkash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          planName,
          amount,
          billing,
          transactionId: formData.transactionId,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment submission failed');
      }

      alert('Payment submitted successfully! We will verify and activate your plan within 24 hours. You will receive an email confirmation.');
      onClose();
      
      // Refresh page to update status
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">bKash Payment</h2>
                <p className="text-pink-100 text-sm">Personal Send Money</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Plan Info */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Selected Plan</p>
                <p className="text-lg font-bold text-pink-900">{planName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-pink-600 font-medium">Amount</p>
                <p className="text-2xl font-bold text-pink-900">৳{amount}</p>
              </div>
            </div>
            <p className="text-xs text-pink-600 mt-2">Billing: {billing === 'yearly' ? 'Yearly (20% OFF)' : 'Monthly'}</p>
          </div>

          {step === 'instructions' ? (
            <>
              {/* Instructions */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-2">Follow these steps:</p>
                      <ol className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="font-bold">1.</span>
                          <span>Open your bKash app</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">2.</span>
                          <span>Go to "Send Money"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">3.</span>
                          <span>Enter the number below and send <strong>৳{amount}</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">4.</span>
                          <span>Note down your Transaction ID (TRX ID)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">5.</span>
                          <span>Come back and fill the form</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* bKash Number */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-center">
                  <p className="text-white/90 text-sm mb-2">Send Money to this bKash Number:</p>
                  <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-4">
                    <span className="text-3xl font-bold text-pink-600">{bkashNumber}</span>
                    <Button
                      onClick={handleCopyNumber}
                      size="sm"
                      variant="outline"
                      className="border-pink-300"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-white/80 text-xs mt-3">
                    Account Type: <strong>Personal</strong> | Amount: <strong>৳{amount}</strong>
                  </p>
                </div>

                {/* Next Button */}
                <Button
                  onClick={() => setStep('form')}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  size="lg"
                >
                  I've Sent the Money →
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transaction ID (TRX ID) *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 9A1B2C3D4E"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="text-base"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Find this in your bKash transaction history
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your bKash Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="text-base"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Number you sent money from
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-base"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    We'll send confirmation to this email
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => setStep('instructions')}
                    variant="outline"
                    className="flex-1"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Payment'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
