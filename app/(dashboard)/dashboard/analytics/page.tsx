'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  Users,
  BarChart3,
  Calendar,
  Download,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ContentPerformanceTracker } from '@/components/analytics/content-performance-tracker';
import { ViralScorePredictor } from '@/components/analytics/viral-score-predictor';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/overview?range=${dateRange}`);
      const data = await response.json();
      setMetrics(data.metrics || {
        totalViews: 0,
        totalEngagement: 0,
        totalFollowers: 0,
        avgViralScore: 0,
        viewsChange: 0,
        engagementChange: 0,
        followersChange: 0,
        viralScoreChange: 0,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set empty metrics on error
      setMetrics({
        totalViews: 0,
        totalEngagement: 0,
        totalFollowers: 0,
        avgViralScore: 0,
        viewsChange: 0,
        engagementChange: 0,
        followersChange: 0,
        viralScoreChange: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate realistic engagement data based on date range
  const generateEngagementData = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: 0,
        engagement: 0,
        followers: 0,
      });
    }
    return data;
  };

  const engagementData = generateEngagementData();

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Button
                variant={dateRange === '7d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange('7d')}
              >
                7 Days
              </Button>
              <Button
                variant={dateRange === '30d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange('30d')}
              >
                30 Days
              </Button>
              <Button
                variant={dateRange === '90d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange('90d')}
              >
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
          {/* Total Views */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                {metrics?.viewsChange !== 0 && (
                  <Badge variant="secondary" className={metrics?.viewsChange > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                    {metrics?.viewsChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(metrics?.viewsChange || 0).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                <p className="text-3xl font-bold">{metrics?.totalViews?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics?.totalViews > 0 ? 'from last period' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                {metrics?.engagementChange !== 0 && (
                  <Badge variant="secondary" className={metrics?.engagementChange > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                    {metrics?.engagementChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(metrics?.engagementChange || 0).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                <p className="text-3xl font-bold">{metrics?.totalEngagement?.toFixed(1) || '0'}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics?.totalEngagement > 0 ? 'Average engagement' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Followers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                {metrics?.followersChange !== 0 && (
                  <Badge variant="secondary" className={metrics?.followersChange > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                    {metrics?.followersChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(metrics?.followersChange || 0).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Followers</p>
                <p className="text-3xl font-bold">{metrics?.totalFollowers?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics?.totalFollowers > 0 ? 'Total audience reach' : 'No data yet'}
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
                {metrics?.viralScoreChange !== 0 && (
                  <Badge variant="secondary" className={metrics?.viralScoreChange > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                    {metrics?.viralScoreChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(metrics?.viralScoreChange || 0).toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Viral Score</p>
                <p className="text-3xl font-bold">{metrics?.avgViralScore || '0'}/100</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics?.avgViralScore > 70 ? 'High viral potential' : metrics?.avgViralScore > 0 ? 'Moderate potential' : 'No data yet'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Daily engagement metrics for the last {dateRange === '7d' ? '7' : dateRange === '30d' ? '30' : '90'} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {engagementData.some(d => d.views > 0 || d.engagement > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#colorViews)"
                      name="Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#06b6d4" 
                      fillOpacity={1} 
                      fill="url(#colorEngagement)"
                      name="Engagement"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">No engagement data yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start creating content to see analytics
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>
                Compare performance across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-sm text-muted-foreground bg-slate-50 rounded-lg">
                  <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">No platform data available</p>
                  <p className="text-xs mt-1">Connect your social media accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Performance & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Your best performing content this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-sm text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">No content data available</p>
                <p className="text-xs mt-1">Create content to see performance analytics</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Analyze and optimize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Predict Viral Score
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Audience Insights
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trend Detection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Competitor Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Performance Tracker */}
        <ContentPerformanceTracker />
      </div>
    </div>
  );
}
