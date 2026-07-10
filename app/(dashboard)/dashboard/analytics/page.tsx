'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Eye,
  Heart,
  Users,
  BarChart3,
  Download,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ContentPerformanceTracker } from '@/components/analytics/content-performance-tracker';
import { ViralScorePredictor } from '@/components/analytics/viral-score-predictor';

interface Metrics {
  totalScripts: number;
  totalScriptsChange: number;
  totalContentPlans: number;
  totalContentPlansChange: number;
  avgViralScore: number;
  avgViralScoreChange: number;
  highViralCount: number;
  highViralCountChange: number;
  platforms: { name: string; count: number }[];
  contentTypes: { type: string; count: number }[];
  contentOverTime: { date: string; contentCreated: number; avgViralScore: number }[];
  topContent: {
    id: string;
    title: string;
    type: string;
    platform: string;
    viralScore: number | null;
    createdAt: string;
  }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/overview?range=${dateRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('অ্যানালিটিক্স ডেটা লোড করা যায়নি। আবার চেষ্টা করুন।');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAnalytics}>আবার চেষ্টা করুন</Button>
        </div>
      </div>
    );
  }

  const m = metrics!;
  const rangeLabel = dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90';

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your content performance and audience insights
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <Button variant={dateRange === '7d' ? 'default' : 'ghost'} size="sm" onClick={() => setDateRange('7d')}>
                7 Days
              </Button>
              <Button variant={dateRange === '30d' ? 'default' : 'ghost'} size="sm" onClick={() => setDateRange('30d')}>
                30 Days
              </Button>
              <Button variant={dateRange === '90d' ? 'default' : 'ghost'} size="sm" onClick={() => setDateRange('90d')}>
                90 Days
              </Button>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Content Created */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                {m.totalScripts > 0 && (
                  <Badge variant="secondary" className={m.totalScriptsChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {m.totalScriptsChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(m.totalScriptsChange).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Content Created</p>
                <p className="text-3xl font-bold">{m.totalScripts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.totalScripts > 0 ? 'from last period' : 'No content yet — start creating!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* High-Viral Content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                {m.highViralCount > 0 && (
                  <Badge variant="secondary" className={m.highViralCountChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {m.highViralCountChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(m.highViralCountChange).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">High-Viral Content</p>
                <p className="text-3xl font-bold">{m.highViralCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.highViralCount > 0 ? 'Score 70+ this period' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Plans */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                {m.totalContentPlans > 0 && (
                  <Badge variant="secondary" className={m.totalContentPlansChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {m.totalContentPlansChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(m.totalContentPlansChange).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Content Plans</p>
                <p className="text-3xl font-bold">{m.totalContentPlans.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.totalContentPlans > 0 ? 'Active plans' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Viral Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                {m.avgViralScore > 0 && (
                  <Badge variant="secondary" className={m.avgViralScoreChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                    {m.avgViralScoreChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(m.avgViralScoreChange).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Viral Score</p>
                <p className="text-3xl font-bold">{m.avgViralScore || 0}/100</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.avgViralScore > 70 ? 'High viral potential' : m.avgViralScore > 0 ? 'Moderate potential' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Created Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Content Created Over Time</CardTitle>
              <CardDescription>Daily content creation for the last {rangeLabel} days</CardDescription>
            </CardHeader>
            <CardContent>
              {m.contentOverTime.every((d) => d.contentCreated === 0) ? (
                <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                  এখনো কোনো কনটেন্ট তৈরি হয়নি
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={m.contentOverTime}>
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="contentCreated" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCreated)" name="Content Created" />
                    <Area type="monotone" dataKey="avgViralScore" stroke="#06b6d4" fillOpacity={1} fill="url(#colorViral)" name="Avg Viral Score" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Content by Platform</CardTitle>
              <CardDescription>Where your content is created for</CardDescription>
            </CardHeader>
            <CardContent>
              {m.platforms.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                  এখনো কোনো প্ল্যাটফর্ম ডেটা নেই
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={m.platforms} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Content Count" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Type Performance & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Type Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Content Type Breakdown</CardTitle>
              <CardDescription>Performance by content format</CardDescription>
            </CardHeader>
            <CardContent>
              {m.contentTypes.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  এখনো কোনো কনটেন্ট টাইপ ডেটা নেই
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={m.contentTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} tickLine={false} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Posts Created" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Analyze and optimize</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Predict Viral Score
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trend Detection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your highest viral-score content</CardDescription>
          </CardHeader>
          <CardContent>
            {m.topContent.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                এখনো কোনো কনটেন্ট নেই। প্রথমে কিছু script/hook তৈরি করুন।
              </div>
            ) : (
              <div className="space-y-4">
                {m.topContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{content.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {content.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Viral Score</div>
                        <div className="flex items-center gap-1">
                          <div className="text-lg font-bold text-purple-600">{content.viralScore ?? '—'}</div>
                          <Zap className="h-4 w-4 text-orange-500" />
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Performance Tracker */}
        <ContentPerformanceTracker />
      </div>
    </div>
  );
}
