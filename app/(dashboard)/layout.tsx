import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { authOptions } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { SupportBubble } from '@/components/support/support-bubble';
import { Toaster } from '@/components/ui/toaster';
import { UpgradeBanner } from '@/components/upgrade-banner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <Suspense fallback={null}>
            <UpgradeBanner />
          </Suspense>
          {children}
        </main>
      </div>
      <SupportBubble />
      <Toaster />
    </div>
  );
}
