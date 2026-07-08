'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  FileText,
  Zap,
  Film,
  Calendar,
  FolderOpen,
  BookOpen,
  CreditCard,
  BarChart3,
  Sparkles,
  Palette,
  Target,
  Shield,
  TrendingUp,
  Users,
  Gift,
} from 'lucide-react';

const navSections = [
  {
    title: 'Overview',
    titleKey: null,
    items: [
      {
        title: 'Dashboard',
        titleKey: 'nav.dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: '1️⃣ Plan',
    items: [
      {
        title: 'Content Planner',
        href: '/dashboard/content-planner',
        icon: Calendar,
      },
    ],
  },
  {
    title: '2️⃣ Create',
    items: [
      {
        title: 'AI Writer',
        href: '/dashboard/writer-pro',
        icon: Sparkles,
      },
      {
        title: 'Hook Generator',
        href: '/dashboard/hooks',
        icon: Zap,
      },
    ],
  },
  {
    title: '3️⃣ Produce',
    items: [
      {
        title: 'AI Studio',
        href: '/dashboard/ai-studio',
        icon: Film,
        badge: 'NEW',
      },
      {
        title: 'Story Director',
        href: '/dashboard/ovc-director',
        icon: Target,
        badge: 'PRO',
      },
      {
        title: 'Creative Studio',
        href: '/dashboard/creative-studio',
        icon: Palette,
      },
    ],
  },
  {
    title: '4️⃣ Manage',
    items: [
      {
        title: 'Scripts Library',
        href: '/dashboard/library',
        icon: FolderOpen,
      },
      {
        title: 'Brand Brain',
        href: '/dashboard/brand-brain',
        icon: Brain,
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        badge: 'BETA',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Referrals',
        href: '/dashboard/referrals',
        icon: Gift,
        badge: 'NEW',
      },
      {
        title: 'Team',
        href: '/dashboard/team',
        icon: Users,
        badge: 'PRO+',
      },
      {
        title: 'Usage & Billing',
        href: '/dashboard/billing',
        icon: CreditCard,
      },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage');
      const data = await res.json();
      setUsage(data);
    } catch (e) {
      console.error('Failed to fetch usage:', e);
    }
  };

  return (
    <nav className="w-64 border-r bg-white min-h-[calc(100vh-73px)] p-4 overflow-y-auto">
      <div className="space-y-6">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group',
                      isActive
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      isActive ? "text-purple-600" : "text-slate-500"
                    )} />
                    <span className="flex-1">{item.title}</span>
                    {(item as any).badge && (
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-semibold",
                        (item as any).badge === 'NEW' && "bg-green-100 text-green-700",
                        (item as any).badge === 'PRO' && "bg-purple-100 text-purple-700",
                        (item as any).badge === 'BETA' && "bg-blue-100 text-blue-700",
                        (item as any).badge === 'ADMIN' && "bg-amber-100 text-amber-700"
                      )}>
                        {(item as any).badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Usage Card - Show after Account section */}
            {section.title === 'Account' && usage && (
              <div className="mt-3 mx-3">
                {/* Trial Badge if on free plan */}
                {usage.planId === 'free' && (
                  <div className="mb-3 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg border-2 border-green-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                      <span className="text-sm font-bold text-white">Free Trial Active!</span>
                    </div>
                    {usage.subscription?.currentPeriodEnd && (
                      <p className="text-xs text-white/90">
                        Expires: {new Date(usage.subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Usage Stats */}
                <div className="p-3 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-white" />
                      <span className="text-xs font-semibold text-white">This Month</span>
                    </div>
                    <span className="text-[10px] font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
                      {usage.planId === 'free' ? 'Trial' : 'Active'}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <UsageMini
                      label="Scripts"
                      current={usage.usage.scriptsGenerated || 0}
                      limit={usage.limits.scripts_per_month || 0}
                    />
                    <UsageMini
                      label="Hooks"
                      current={usage.usage.hooksGenerated || 0}
                      limit={usage.limits.hooks_per_month || 0}
                    />
                    <UsageMini
                      label="Plans"
                      current={usage.usage.contentPlansCreated || 0}
                      limit={usage.limits.content_plans || 0}
                    />
                    <UsageMini
                      label="OVC"
                      current={usage.usage.ovcScenesGenerated || 0}
                      limit={usage.limits.ovc_scenes || 0}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

// Mini usage indicator
function UsageMini({ label, current, limit }: { label: string; current: number; limit: number }) {
  const unlimited = limit === -1;
  const pct = unlimited ? 100 : Math.min((current / limit) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-white/90">{label}</span>
        <span className="font-semibold text-white">
          {current}/{unlimited ? '∞' : limit}
        </span>
      </div>
      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all"
          style={{ width: unlimited ? '100%' : `${pct}%` }}
        />
      </div>
    </div>
  );
}
