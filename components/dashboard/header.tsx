'use client';

import { useSession, signOut } from 'next-auth/react';
import { Sparkles, LogOut, User, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DashboardHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">Bangla Creator</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-medium flex items-center gap-2">
              {session?.user?.name}
              {isAdmin && (
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <div className="text-slate-500">{session?.user?.email}</div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
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
