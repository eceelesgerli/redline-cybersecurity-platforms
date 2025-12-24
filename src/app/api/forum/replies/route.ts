import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ForumReply from '@/models/ForumReply';
import ForumTopic from '@/models/ForumTopic';
import User from '@/models/User';
import { verifyUserToken } from '@/lib/userAuth';
import { cookies } from 'next/headers';

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

    const { content, topicId } = await request.json();

    if (!content || !topicId) {
      return NextResponse.json(
        { error: 'Content and topicId are required' },
        { status: 400 }
      );
    }

    // Check if topic exists and is not locked
    const topic = await ForumTopic.findById(topicId);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    if (topic.isLocked) {
      return NextResponse.json({ error: 'Topic is locked' }, { status: 403 });
    }

    const reply = await ForumReply.create({
      content,
      author: decoded.userId,
      topic: topicId,
    });

    // Update topic
    await ForumTopic.findByIdAndUpdate(topicId, {
      $inc: { repliesCount: 1 },
      lastReplyAt: new Date(),
      lastReplyBy: decoded.userId,
    });

    // Update user's reply count
    await User.findByIdAndUpdate(decoded.userId, { $inc: { repliesCount: 1 } });

    const populatedReply = await ForumReply.findById(reply._id)
      .populate('author', 'username rank avatar')
      .lean();

    return NextResponse.json(populatedReply, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}
