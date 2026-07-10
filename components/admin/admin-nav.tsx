'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Shield,
  Home,
  MessageCircle,
  Gift,
  Monitor
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/flagged-signups', label: 'Flagged', icon: Shield },
    { href: '/admin/referrals', label: 'Referrals', icon: Gift },
    { href: '/admin/support', label: 'Support', icon: MessageCircle },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Back to Dashboard */}
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to Dashboard →
          </Link>
        </div>
      </div>
    </nav>
  );
}
