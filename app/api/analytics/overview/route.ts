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
    const range = searchParams.get('range') || '30d';

    // Mock data for now - in production, fetch from database
    const metrics = {
      totalViews: 245800,
      viewsGrowth: 12.5,
      engagementRate: 4.8,
      engagementGrowth: 8.2,
      totalFollowers: 42500,
      followersGrowth: 15.1,
      avgViralScore: 76,
      viralScoreGrowth: 5.3,
      
      // Additional metrics
      totalPosts: 45,
      totalReach: 189000,
      impressions: 312000,
      clicks: 15600,
      shares: 3200,
      saves: 4800,
      comments: 2100,
      
      // Platform breakdown
      platforms: [
        { name: 'Instagram', views: 98500, percentage: 40 },
        { name: 'TikTok', views: 87200, percentage: 35 },
        { name: 'Facebook', views: 45300, percentage: 18 },
        { name: 'LinkedIn', views: 14800, percentage: 7 },
      ],
      
      // Top content
      topContent: [
        {
          id: '1',
          title: '5 Tips for Growing Your Business',
          views: 45200,
          engagement: 8.5,
          type: 'Reel',
          platform: 'Instagram',
          date: '2024-01-15',
        },
        {
          id: '2',
          title: 'Behind the Scenes: Product Launch',
          views: 38700,
          engagement: 7.2,
          type: 'Story',
          platform: 'Instagram',
          date: '2024-01-12',
        },
        {
          id: '3',
          title: 'Customer Success Story',
          views: 32100,
          engagement: 6.8,
          type: 'Post',
          platform: 'Facebook',
          date: '2024-01-10',
        },
        {
          id: '4',
          title: 'How-To Tutorial: Step by Step',
          views: 28900,
          engagement: 5.9,
          type: 'Carousel',
          platform: 'Instagram',
          date: '2024-01-08',
        },
      ],
      
      // Engagement over time (daily data)
      engagementOverTime: generateDailyData(range),
    };

    return NextResponse.json({
      success: true,
      metrics,
      range,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper function to generate daily data
function generateDailyData(range: string) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 10000) + 5000,
      engagement: Math.floor(Math.random() * 500) + 100,
      likes: Math.floor(Math.random() * 300) + 50,
      comments: Math.floor(Math.random() * 50) + 10,
      shares: Math.floor(Math.random() * 30) + 5,
    });
  }
  
  return data;
}
