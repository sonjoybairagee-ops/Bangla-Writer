import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * TEMPORARY API ROUTE - Make a user admin
 * Delete this file after setting up your first admin user
 * 
 * Usage: POST /api/admin/make-admin
 * Body: { "email": "your@email.com", "secret": "your-secret-key" }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json();

    // Security check - use a secret key from environment
    const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET || 'bangla-creator-admin-2026';
    
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user and update role to admin
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role to admin
    await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} is now an admin!`,
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json(
      { error: 'Failed to make user admin' },
      { status: 500 }
    );
  }
}
