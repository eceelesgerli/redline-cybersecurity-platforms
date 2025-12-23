import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/models/Tool';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const tool = await Tool.findById(id);

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Get tool error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { name, description, category, externalLink, icon, featured } = body;

    const tool = await Tool.findById(id);

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    if (name) tool.name = name;
    if (description) tool.description = description;
    if (category) tool.category = category;
    if (externalLink) tool.externalLink = externalLink;
    if (icon !== undefined) tool.icon = icon;
    if (featured !== undefined) tool.featured = featured;

    await tool.save();

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Update tool error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const tool = await Tool.findByIdAndDelete(id);

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
