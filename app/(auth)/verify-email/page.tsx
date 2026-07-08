'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, Mail, CheckCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (value && index === 5 && next.every(d => d !== '')) {
      verifyOTP(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      const code = otp.join('');
      if (code.length === 6) verifyOTP(code);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...pasted.split(''), ...Array(6).fill('')].slice(0, 6);
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) verifyOTP(pasted);
  };

  const verifyOTP = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => router.push('/login?verified=1'), 2000);
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Failed to resend');
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা।');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
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

            {!success ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-purple-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">ইমেইল ভেরিফাই করুন</h1>
                  <p className="text-slate-500 text-sm">
                    <span className="font-semibold text-slate-700">{email}</span>-এ<br />
                    একটি ৬-সংখ্যার কোড পাঠানো হয়েছে
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 text-center">
                    {error}
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleInput(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 ${
                        digit
                          ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm shadow-purple-100'
                          : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-purple-400 focus:bg-white'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={() => verifyOTP(otp.join(''))}
                  disabled={otp.join('').length < 6 || loading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ভেরিফাই হচ্ছে...
                    </>
                  ) : (
                    'ভেরিফাই করুন ✓'
                  )}
                </button>

                {/* Resend */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <RefreshCcw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                      {resending ? 'পাঠানো হচ্ছে...' : 'নতুন কোড পাঠান'}
                    </button>
                  ) : (
                    <p className="text-sm text-slate-400">
                      নতুন কোডের জন্য অপেক্ষা করুন{' '}
                      <span className="font-semibold text-slate-600">{countdown}s</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">ভেরিফাই সফল! 🎉</h2>
                <p className="text-slate-500 text-sm mb-2">আপনার অ্যাকাউন্ট সক্রিয় হয়েছে।</p>
                <p className="text-slate-400 text-xs">লগইন পেজে নিয়ে যাচ্ছি...</p>
                <div className="mt-4 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse" />
              </div>
            )}

            {/* Back link */}
            {!success && (
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  নিবন্ধনে ফিরে যান
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
