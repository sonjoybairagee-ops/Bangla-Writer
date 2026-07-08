'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
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
        badge: 'NEW',
      },
      {
        title: 'Hook Generator',
        href: '/dashboard/hooks',
        icon: Zap,
      },
      {
        title: 'Content Writer',
        href: '/dashboard/content-writer',
        icon: FileText,
      },
    ],
  },
  {
    title: '3️⃣ Produce',
    items: [
      {
        title: 'Story Director',
        href: '/dashboard/ovc-director',
        icon: Film,
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
        title: 'Usage & Billing',
        href: '/dashboard/billing',
        icon: CreditCard,
      },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r bg-white min-h-[calc(100vh-73px)] p-4">
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
          </div>
        ))}
      </div>
    </nav>
  );
}
