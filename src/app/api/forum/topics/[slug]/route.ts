import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ForumTopic from '@/models/ForumTopic';
import ForumReply from '@/models/ForumReply';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const topic = await ForumTopic.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username rank avatar bio topicsCount')
      .populate('lastReplyBy', 'username')
      .lean();

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Get replies
    const topicId = (topic as any)._id;
    const replies = await ForumReply.find({ topic: topicId })
      .populate('author', 'username rank avatar')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ topic, replies });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}
