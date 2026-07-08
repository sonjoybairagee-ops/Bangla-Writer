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
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                <p className="text-3xl font-bold">245.8K</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +27.3K from last period
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
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                <p className="text-3xl font-bold">4.8%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Above industry avg (3.2%)
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
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  15.1%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Followers</p>
                <p className="text-3xl font-bold">42.5K</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +5.5K new followers
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
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.3%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Viral Score</p>
                <p className="text-3xl font-bold">76/100</p>
                <p className="text-xs text-muted-foreground mt-1">
                  High viral potential
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
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Chart will render here</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Recharts integration in progress)
                  </p>
                </div>
              </div>
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
                {[
                  { name: 'Instagram', views: '98.5K', color: 'bg-pink-500', percentage: 40 },
                  { name: 'TikTok', views: '87.2K', color: 'bg-black', percentage: 35 },
                  { name: 'Facebook', views: '45.3K', color: 'bg-blue-600', percentage: 18 },
                  { name: 'LinkedIn', views: '14.8K', color: 'bg-blue-700', percentage: 7 },
                ].map((platform, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-muted-foreground">{platform.views}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${platform.color}`}
                        style={{ width: `${platform.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
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
              <div className="space-y-3">
                {[
                  { title: '5 Tips for Growing Your Business', views: '45.2K', engagement: '8.5%', type: 'Reel' },
                  { title: 'Behind the Scenes: Product Launch', views: '38.7K', engagement: '7.2%', type: 'Story' },
                  { title: 'Customer Success Story', views: '32.1K', engagement: '6.8%', type: 'Post' },
                  { title: 'How-To Tutorial: Step by Step', views: '28.9K', engagement: '5.9%', type: 'Carousel' },
                ].map((content, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{content.title}</h4>
                        <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {content.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {content.engagement}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
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
