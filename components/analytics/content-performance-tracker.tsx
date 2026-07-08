'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  MousePointer,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export function ContentPerformanceTracker() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'reel' | 'post' | 'story' | 'carousel'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'engagement' | 'date'>('views');

  useEffect(() => {
    fetchContentPerformance();
  }, [filter, sortBy]);

  const fetchContentPerformance = async () => {
    try {
      const response = await fetch(`/api/analytics/content-performance?filter=${filter}&sort=${sortBy}`);
      const data = await response.json();
      setContent(data.content || []);
    } catch (error) {
      console.error('Failed to fetch content performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return 'text-green-600 bg-green-50';
    if (rate >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Content Performance Tracking
            </CardTitle>
            <CardDescription>
              Track individual content performance metrics
            </CardDescription>
          </div>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All Content
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters & Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'reel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('reel')}
            >
              Reels
            </Button>
            <Button
              variant={filter === 'post' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('post')}
            >
              Posts
            </Button>
            <Button
              variant={filter === 'carousel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('carousel')}
            >
              Carousels
            </Button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="views">Sort by Views</option>
            <option value="engagement">Sort by Engagement</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.platform}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    className={`${getEngagementColor(item.engagementRate)} border-0`}
                  >
                    {item.engagementRate}% Engagement
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.views.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.likes.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.comments.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.shares.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Shares</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <Bookmark className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.saves.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Saves</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                      <MousePointer className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.clicks.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                  </div>
                </div>

                {/* Reach & Impressions */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Reach: <span className="font-semibold text-foreground">{item.reach.toLocaleString()}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Impressions: <span className="font-semibold text-foreground">{item.impressions.toLocaleString()}</span>
                    </span>
                    {item.conversions && (
                      <span className="text-muted-foreground">
                        Conversions: <span className="font-semibold text-green-600">{item.conversions}</span>
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredContent.length === 0 && !loading && (
          <div className="text-center p-8 bg-slate-50 rounded-lg">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Content Found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Start creating content to track performance'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
