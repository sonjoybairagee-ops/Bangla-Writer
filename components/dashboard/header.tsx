'use client';

import { useSession, signOut } from 'next-auth/react';
import { Sparkles, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">Bangla Creator</span>
        </div>

        <div className="flex items-center gap-4">
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
