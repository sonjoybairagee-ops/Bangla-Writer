import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const brandId = formData.get('brandId') as string;
    const type = formData.get('type') as string;

    if (!file || !brandId || !type) {
      return NextResponse.json(
        { error: 'File, brandId, and type are required' },
        { status: 400 }
      );
    }

    // Verify brand ownership
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Validate file type
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    let isValid = false;
    if (type === 'logo' || type === 'image') {
      isValid = validImageTypes.includes(file.type);
    } else if (type === 'video') {
      isValid = validVideoTypes.includes(file.type);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: `Invalid file type for ${type}` },
        { status: 400 }
      );
    }

    // Check file size (10MB limit for images, 50MB for videos)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${type === 'video' ? '50MB' : '10MB'}` },
        { status: 400 }
      );
    }

    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll store metadata only and use a placeholder URL
    
    // Convert file to base64 for storage (for MVP only - use cloud storage in production)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Create asset object
    const newAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: file.name,
      type: type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      thumbnail: dataUrl, // In production, generate thumbnail URL
      url: dataUrl, // In production, use cloud storage URL
    };

    // Update brand assets
    const currentAssets = ((brand as any).assets as any[]) || [];
    const updatedAssets = [...currentAssets, newAsset];

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        assets: updatedAssets as any,
      },
    });

    return NextResponse.json({
      success: true,
      asset: newAsset,
    });
  } catch (error) {
    console.error('Asset upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload asset' },
      { status: 500 }
    );
  }
}
