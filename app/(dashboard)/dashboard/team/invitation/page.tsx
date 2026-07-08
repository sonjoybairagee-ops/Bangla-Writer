'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Shield,
  Pencil,
  Loader2,
} from 'lucide-react';

export default function TeamInvitationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleAccept = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid invitation link');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/team/accept-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully joined the team!');
        
        // Redirect to team page after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard/team';
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to accept invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <Card className="p-12 text-center border-slate-200 shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Invitation</h2>
          <p className="text-slate-500 mb-6">
            The invitation link is invalid or has expired.
          </p>
          <Button
            onClick={() => (window.location.href = '/dashboard')}
            className="bg-slate-600 hover:bg-slate-700"
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20">
      <Card className="overflow-hidden border-slate-200 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Team Invitation</h1>
          <p className="text-purple-100">You've been invited to join a team!</p>
        </div>

        <div className="p-8">
          {status === 'idle' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-semibold mb-2">
                      What happens when you accept?
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        You'll become a team member
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Get access to shared brands and content
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Collaborate with your team
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Your role will determine your permissions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Team Roles:</h3>
                
                <div className="flex items-start gap-3 p-3 border border-purple-200 bg-purple-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Admin</p>
                    <p className="text-xs text-slate-600">
                      Full access - manage team, invite members, create content
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Member</p>
                    <p className="text-xs text-slate-600">
                      Create and manage content, view analytics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-green-200 bg-green-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Pencil className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Creator</p>
                    <p className="text-xs text-slate-600">
                      Content creation only - no brand management
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAccept}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Accept Invitation
                  </>
                )}
              </Button>
            </>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome to the Team!
              </h2>
              <p className="text-slate-600 mb-4">{message}</p>
              <p className="text-sm text-slate-400">
                Redirecting to team dashboard...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Something Went Wrong
              </h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setStatus('idle')}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
