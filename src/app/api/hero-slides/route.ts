import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { uploadImage } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string || '';
    const order = parseInt(formData.get('order') as string) || 0;

    if (!file) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(base64);

    await connectDB();
    const slide = await HeroSlide.create({
      imageUrl: url,
      cloudinaryId: publicId,
      title,
      order,
      isActive: true,
    });

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}
