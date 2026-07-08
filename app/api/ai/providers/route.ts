import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProviderStatus, getAvailableProviders } from '@/lib/ai/providers';

/**
 * GET /api/ai/providers
 * Check status of all AI providers
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only authenticated users can check provider status
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await getProviderStatus();
    const available = await getAvailableProviders();

    return NextResponse.json({
      success: true,
      providers: status,
      availableCount: available.length,
      primaryProvider: available[0]?.name || null,
    });
  } catch (error: any) {
    console.error('Provider status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check provider status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
