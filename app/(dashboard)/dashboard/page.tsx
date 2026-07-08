'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Brain,
  FileText,
  Zap,
  Film,
  Calendar,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3,
  Search,
  Clock,
  Target,
  Palette,
  Plus,
  ArrowUp,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error === 'admin_access_denied') {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    fetchUsage();
    fetchRecentScripts();
  }, []);

  const fetchRecentScripts = async () => {
    try {
      const res = await fetch('/api/scripts?limit=3');
      const data = await res.json();
      if (data.scripts) setRecentScripts(data.scripts.slice(0, 3));
    } catch {}
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Error Banner */}
      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1">
              🚫 Admin Access Denied
            </h3>
            <p className="text-red-600 text-sm">
              You don't have permission to access the Admin Panel. Only administrators can access that section.
            </p>
          </div>
          <button
            onClick={() => setShowError(false)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-purple-100 text-lg mb-6">
            Ready to create amazing content with AI?
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/writer-pro">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                New Script
              </Button>
            </Link>
            <Link href="/dashboard/content-planner">
              <Button size="lg" variant="outline" className="bg-purple-700/20 border-white/30 text-white hover:bg-purple-700/30">
                <Calendar className="mr-2 h-5 w-5" />
                New Campaign
              </Button>
            </Link>
            <Link href="/dashboard/hooks">
              <Button size="lg" variant="outline" className="bg-purple-700/20 border-white/30 text-white hover:bg-purple-700/30">
                <Zap className="mr-2 h-5 w-5" />
                Generate Hook
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* AI Command Bar */}
      <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!searchQuery.trim()) return;
              const q = searchQuery.toLowerCase();
              if (q.includes('hook')) window.location.href = '/dashboard/hooks';
              else if (q.includes('plan') || q.includes('campaign') || q.includes('calendar')) window.location.href = '/dashboard/content-planner';
              else if (q.includes('ad') || q.includes('creative') || q.includes('thumbnail') || q.includes('ugc')) window.location.href = '/dashboard/creative-studio';
              else if (q.includes('brand') || q.includes('voice')) window.location.href = '/dashboard/brand-brain';
              else if (q.includes('analytic') || q.includes('performance')) window.location.href = '/dashboard/analytics';
              else window.location.href = `/dashboard/writer-pro?q=${encodeURIComponent(searchQuery)}`;
            }}
            className="relative flex items-center gap-2"
          >
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tell AI what you need... (e.g., create hook, 30-day plan, write skincare ad)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-28 h-12 text-base border-0 focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!searchQuery.trim()}
              className="absolute right-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg px-4 h-8"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Go
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 pl-1">
            💡 Try: "hook generator", "30 day content plan", "Facebook ad script"
          </p>
        </CardContent>
      </Card>


      {/* Today's Usage Cards */}
      {!loading && usage && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Today's Activity</h2>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm">
                View All Usage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UsageCard
              title="Scripts"
              value={usage.usage.scriptsGenerated}
              limit={usage.limits.scripts_per_month}
              icon={<FileText className="h-6 w-6 text-purple-600" />}
              subtitle="this month"
              bgColor="from-purple-50 to-purple-100"
            />
            <UsageCard
              title="Hooks"
              value={usage.usage.hooksGenerated}
              limit={usage.limits.hooks_per_month}
              icon={<Zap className="h-6 w-6 text-yellow-600" />}
              subtitle="this month"
              bgColor="from-yellow-50 to-yellow-100"
            />
            <UsageCard
              title="Campaigns"
              value={usage.usage.contentPlansCreated}
              limit={usage.limits.content_plans}
              icon={<Calendar className="h-6 w-6 text-green-600" />}
              subtitle="this month"
              bgColor="from-green-50 to-green-100"
            />
            <UsageCard
              title="Scenes"
              value={usage.usage.ovcScenesGenerated}
              limit={usage.limits.ovc_scenes}
              icon={<Film className="h-6 w-6 text-blue-600" />}
              subtitle="this month"
              bgColor="from-blue-50 to-blue-100"
            />
          </div>
        </div>
      )}

      {/* Workflow Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Recent Scripts
              </span>
              <Link href="/dashboard/library">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScripts.length > 0 ? recentScripts.map((script) => (
                  <Link key={script.id} href={`/dashboard/library`}>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Film className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{script.title}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {script.type} • {new Date(script.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize shrink-0">{script.platform || 'draft'}</Badge>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No scripts yet</p>
                    <Link href="/dashboard/writer-pro" className="text-xs text-purple-600 hover:underline mt-1 inline-block">Create your first script →</Link>
                  </div>
                )}
              </div>
            </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Posts
              </span>
              <Link href="/dashboard/content-planner">
                <Button variant="ghost" size="sm">
                  View Calendar
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Morning Motivation Post</h4>
                    <p className="text-xs text-muted-foreground">Tomorrow • 9:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Score Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              This Month's Progress
            </CardTitle>
            <CardDescription>Your total generation usage</CardDescription>
          </CardHeader>
          <CardContent>
            {usage && (() => {
              const limit = usage.limits.scripts_per_month;
              const used = (usage.usage.scriptsGenerated || 0) + (usage.usage.hooksGenerated || 0);
              const score = limit === -1 ? 100 : Math.min(Math.round((used / limit) * 100), 100);
              const label = score < 30 ? 'শুরু হয়েছে' : score < 70 ? 'ভালো চলছে!' : score < 95 ? 'দারুণ!' : 'Limit শেষ!';
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{used}<span className="text-xl text-blue-400">/{limit === -1 ? '∞' : limit}</span></div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                  <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-200" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={`${Math.min(score, 100) * 2.51} 251`} className="text-blue-600 transition-all duration-700" />
                    </svg>
                  </div>
                </div>
              );
            })()}
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Usage Details দেখুন
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 rounded">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Use AI Writer for faster content</h4>
                  <p className="text-xs text-muted-foreground">Generate scripts 10x faster</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-purple-100 rounded">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Train your Brand Brain</h4>
                  <p className="text-xs text-muted-foreground">Upload documents for better AI</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Plan your content calendar</h4>
                  <p className="text-xs text-muted-foreground">Stay consistent with planning</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Usage Card Component
function UsageCard({
  title,
  value,
  limit,
  icon,
  subtitle,
  bgColor,
}: {
  title: string;
  value: number;
  limit: number;
  icon: React.ReactNode;
  subtitle: string;
  bgColor: string;
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((value / limit) * 100, 100);
  const isWarning = !isUnlimited && percentage >= 80;

  return (
    <Card className={`bg-gradient-to-br ${bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {icon}
          </div>
          {isWarning && (
            <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
              সীমা কাছে!
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>ব্যবহার</span>
            <span>{value} / {isUnlimited ? '∞' : limit}</span>
          </div>
          {!isUnlimited && (
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isWarning ? 'bg-red-400' : 'bg-gradient-to-r from-purple-600 to-blue-600'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          {isUnlimited && (
            <div className="h-2 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
