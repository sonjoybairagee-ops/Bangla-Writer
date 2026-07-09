'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Eye, EyeOff, Rocket, Award, Clock, Heart, Check, Shield, ArrowLeft } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlReferralCode = searchParams.get('ref');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(urlReferralCode || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          referralCode: referralCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login?message=Account created successfully. Please login.');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20" />
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Bangla Creator AI</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                Start Creating<br />Amazing Content<br />Today
              </h1>
              <p className="text-xl text-purple-100 max-w-md">
                Join thousands of content creators using AI to create viral বাংলা content
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-8">
              {[
                { icon: Rocket, text: 'Get started in under 2 minutes' },
                { icon: Award, text: '7-day free trial included' },
                { icon: Clock, text: 'Cancel anytime, no commitments' },
                { icon: Heart, text: 'Join 10,000+ happy creators' },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/90 text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Referral Badge */}
            {referralCode && (
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-md border-2 border-green-300/50 rounded-2xl p-6 mt-12">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">🎉 Special Offer!</div>
                    <div className="text-green-100 text-sm">You've been referred by a friend</div>
                  </div>
                </div>
                <div className="text-white/95 font-semibold mt-3">
                  Get 20% OFF your first paid subscription!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-white/90">
              <div className="font-semibold">10,000+ Creators</div>
              <div className="text-sm text-purple-200">Already creating with AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Back to Home Button */}
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-slate-900">Bangla Creator AI</span>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h2>
            <p className="text-slate-600">Start creating amazing content with AI</p>
            
            {urlReferralCode && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Check className="w-4 h-4" />
                20% OFF on first subscription (Code: {urlReferralCode})
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 px-4 text-base border-slate-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 text-base border-slate-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 px-4 pr-12 text-base border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">Must be at least 8 characters</p>
            </div>

            {/* Optional Referral Code Input */}
            {!urlReferralCode && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter referral code for 20% OFF"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="h-12 px-4 text-base border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Get 20% OFF your first paid subscription
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-xs text-center text-slate-500">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            onClick={handleGoogleSignIn}
            type="button"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-8 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Signup</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>7-Day Free Trial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
