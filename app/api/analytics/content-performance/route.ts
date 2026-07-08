import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'views';

    // Mock content performance data
    let content = [
      {
        id: '1',
        title: '5 Tips for Growing Your Business Fast',
        type: 'Reel',
        platform: 'Instagram',
        date: '2024-01-15T10:00:00Z',
        views: 45200,
        likes: 3840,
        comments: 156,
        shares: 234,
        saves: 892,
        clicks: 1250,
        reach: 38500,
        impressions: 52300,
        conversions: 45,
        engagementRate: 8.5,
      },
      {
        id: '2',
        title: 'Behind the Scenes: Product Launch',
        type: 'Story',
        platform: 'Instagram',
        date: '2024-01-12T14:30:00Z',
        views: 38700,
        likes: 2780,
        comments: 89,
        shares: 167,
        saves: 543,
        clicks: 890,
        reach: 32100,
        impressions: 41200,
        conversions: 32,
        engagementRate: 7.2,
      },
      {
        id: '3',
        title: 'Customer Success Story - How Sarah 10X Her Revenue',
        type: 'Post',
        platform: 'Facebook',
        date: '2024-01-10T09:15:00Z',
        views: 32100,
        likes: 2180,
        comments: 145,
        shares: 298,
        saves: 412,
        clicks: 765,
        reach: 28900,
        impressions: 38700,
        conversions: 28,
        engagementRate: 6.8,
      },
      {
        id: '4',
        title: 'How-To Tutorial: Step by Step Guide',
        type: 'Carousel',
        platform: 'Instagram',
        date: '2024-01-08T11:45:00Z',
        views: 28900,
        likes: 1710,
        comments: 78,
        shares: 134,
        saves: 678,
        clicks: 543,
        reach: 24500,
        impressions: 32100,
        conversions: 19,
        engagementRate: 5.9,
      },
      {
        id: '5',
        title: 'Weekly Roundup: Top Industry News',
        type: 'Post',
        platform: 'LinkedIn',
        date: '2024-01-06T08:00:00Z',
        views: 14800,
        likes: 1180,
        comments: 67,
        shares: 234,
        saves: 312,
        clicks: 456,
        reach: 12300,
        impressions: 16900,
        conversions: 12,
        engagementRate: 8.0,
      },
      {
        id: '6',
        title: 'Trending Alert: What Everyone is Talking About',
        type: 'Reel',
        platform: 'TikTok',
        date: '2024-01-05T16:20:00Z',
        views: 87200,
        likes: 6980,
        comments: 234,
        shares: 567,
        saves: 1234,
        clicks: 2100,
        reach: 72400,
        impressions: 95600,
        conversions: 78,
        engagementRate: 8.0,
      },
      {
        id: '7',
        title: 'Product Demo: See It In Action',
        type: 'Reel',
        platform: 'Instagram',
        date: '2024-01-03T12:00:00Z',
        views: 41500,
        likes: 3320,
        comments: 123,
        shares: 189,
        saves: 765,
        clicks: 1100,
        reach: 35700,
        impressions: 48200,
        conversions: 38,
        engagementRate: 8.0,
      },
      {
        id: '8',
        title: 'Common Mistakes to Avoid',
        type: 'Carousel',
        platform: 'Instagram',
        date: '2024-01-01T10:30:00Z',
        views: 25600,
        likes: 1540,
        comments: 56,
        shares: 98,
        saves: 543,
        clicks: 412,
        reach: 21800,
        impressions: 28900,
        conversions: 15,
        engagementRate: 6.0,
      },
    ];

    // Filter by type
    if (filter !== 'all') {
      content = content.filter(item => item.type.toLowerCase() === filter.toLowerCase());
    }

    // Sort
    content.sort((a, b) => {
      if (sort === 'views') return b.views - a.views;
      if (sort === 'engagement') return b.engagementRate - a.engagementRate;
      if (sort === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

    return NextResponse.json({
      success: true,
      content,
      total: content.length,
    });
  } catch (error) {
    console.error('Content performance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content performance' },
      { status: 500 }
    );
  }
}
