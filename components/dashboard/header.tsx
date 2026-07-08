'use client';

import { useSession, signOut } from 'next-auth/react';
import { Sparkles, LogOut, User, Settings, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function DashboardHeader() {
  const { data: session } = useSession();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    try {
      const res = await fetch('/api/referral/my-code');
      const data = await res.json();
      if (data.referralCode) {
        setReferralCode(data.referralUrl);
      }
    } catch (error) {
      console.error('Failed to fetch referral code:', error);
    }
  };

  const handleCopyReferralLink = () => {
    if (referralCode) {
      copyToClipboard(referralCode, 'Referral link copied! Share it to earn rewards 🎁');
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">Bangla Creator</span>
        </div>

        <div className="flex items-center gap-4">
          {referralCode && (
            <Button
              onClick={handleCopyReferralLink}
              variant="outline"
              size="sm"
              className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Gift className="h-4 w-4" />
              Refer & Earn
            </Button>
          )}

          <div className="text-sm">
            <div className="font-medium">{session?.user?.name}</div>
            <div className="text-slate-500">{session?.user?.email}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
