import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumCategory from '@/models/ForumCategory';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/userAuth';
import { cookies } from 'next/headers';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '-' + Date.now();
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    const skip = (page - 1) * limit;

    const [topics, total] = await Promise.all([
      ForumTopic.find(query)
        .populate('author', 'username rank avatar')
        .populate('lastReplyBy', 'username')
        .sort({ isPinned: -1, lastReplyAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ForumTopic.countDocuments(query),
    ]);

    return NextResponse.json({
      topics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyUserToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const { title, content, category, subcategory } = await request.json();

    if (!title || !content || !category || !subcategory) {
      return NextResponse.json(
        { error: 'Title, content, category and subcategory are required' },
        { status: 400 }
      );
    }

    // Verify category and subcategory exist
    const categoryDoc = await ForumCategory.findOne({ slug: category });
    if (!categoryDoc) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const subcat = categoryDoc.subcategories.find((s: any) => s.slug === subcategory);
    if (!subcat) {
      return NextResponse.json({ error: 'Invalid subcategory' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const topic = await ForumTopic.create({
      title,
      slug,
      content,
      category,
      subcategory,
      author: decoded.userId,
    });

    // Update user's topic count
    await User.findByIdAndUpdate(decoded.userId, { $inc: { topicsCount: 1 } });

    // Update subcategory topic count
    await ForumCategory.updateOne(
      { slug: category, 'subcategories.slug': subcategory },
      { $inc: { 'subcategories.$.topicsCount': 1 } }
    );

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
