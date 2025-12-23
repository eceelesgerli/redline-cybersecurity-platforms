import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const query: Record<string, unknown> = {};
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const [tools, total] = await Promise.all([
      Tool.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Tool.countDocuments(query),
    ]);

    return NextResponse.json({
      tools,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get tools error:', error);
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
    const { name, description, category, externalLink, icon, featured } = body;

    if (!name || !description || !category || !externalLink) {
      return NextResponse.json(
        { error: 'Name, description, category, and external link are required' },
        { status: 400 }
      );
    }

    const tool = await Tool.create({
      name,
      description,
      category,
      externalLink,
      icon: icon || '',
      featured: featured || false,
    });

    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error('Create tool error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
