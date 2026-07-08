'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setSent(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Bangla Writer</span>
            </div>

            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-purple-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">পাসওয়ার্ড ভুলে গেছেন?</h1>
                  <p className="text-slate-500 text-sm">
                    আপনার ইমেইল দিন — আমরা একটি reset link পাঠাবো।
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      ইমেইল ঠিকানা
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    id="send-reset-link"
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Reset Link পাঠান
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">ইমেইল পাঠানো হয়েছে! ✉️</h2>
                <p className="text-slate-500 text-sm mb-6">
                  <span className="font-semibold text-slate-700">{email}</span> এ একটি password reset link পাঠানো হয়েছে। Spam folder-ও চেক করুন।
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-sm text-purple-600 hover:underline"
                >
                  অন্য ইমেইল দিয়ে চেষ্টা করুন
                </button>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                লগইন পেজে ফিরে যান
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Bangla Writer. All rights reserved.
        </p>
      </div>
    </div>
  );
}
