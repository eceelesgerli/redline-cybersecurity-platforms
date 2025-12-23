import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;
    
    const blog = await Blog.findOne({ slug, published: true });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
