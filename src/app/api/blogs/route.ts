import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { getCurrentAdmin } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const published = searchParams.get('published');

    const query: Record<string, unknown> = {};
    if (published === 'true') {
      query.published = true;
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { title, content, excerpt, coverImage, published } = body;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || '',
      published: published !== false,
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
