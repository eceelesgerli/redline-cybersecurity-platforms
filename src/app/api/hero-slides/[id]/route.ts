import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { deleteImage, uploadImage } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ slide });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slide' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await connectDB();
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const title = formData.get('title') as string;
    const order = formData.get('order') as string;
    const isActive = formData.get('isActive') as string;

    // Update fields
    if (title !== null) slide.title = title;
    if (order !== null) slide.order = parseInt(order) || 0;
    if (isActive !== null) slide.isActive = isActive === 'true';

    // If new image uploaded, replace the old one
    if (file && file.size > 0) {
      // Delete old image from Cloudinary
      await deleteImage(slide.cloudinaryId);

      // Upload new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      const { url, publicId } = await uploadImage(base64);

      slide.imageUrl = url;
      slide.cloudinaryId = publicId;
    }

    await slide.save();
    return NextResponse.json({ slide });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await connectDB();
    const slide = await HeroSlide.findById(id);

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    // Delete image from Cloudinary
    await deleteImage(slide.cloudinaryId);

    // Delete from database
    await HeroSlide.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}
