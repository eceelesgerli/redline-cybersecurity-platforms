'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, MessageCircle, Send, Clock } from 'lucide-react';
import { RANKS } from '@/models/User';

interface Author {
  _id: string;
  username: string;
  rank: number;
  avatar?: string;
  topicsCount?: number;
}

interface Reply {
  _id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: Author;
  category: string;
  subcategory: string;
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
}

export default function TopicPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopic();
    checkUser();
  }, [slug]);

  const fetchTopic = async () => {
    try {
      const res = await fetch(`/api/forum/topics/${slug}`);
      const data = await res.json();
      setTopic(data.topic);
      setReplies(data.replies || []);
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !topic) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          topicId: topic._id,
        }),
      });

      if (res.ok) {
        const newReply = await res.json();
        setReplies([...replies, newReply]);
        setReplyContent('');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getRankInfo = (rank: number) => {
    return RANKS.find(r => r.level === rank) || RANKS[0];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white">Loading topic...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Topic Not Found</h2>
          <Link href="/forum" className="btn-primary">Back to Forum</Link>
        </div>
      </div>
    );
  }

  const authorRank = getRankInfo(topic.author.rank);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/forum" className="hover:text-white">Forum</Link>
          <span>/</span>
          <Link href={`/forum/${topic.category}/${topic.subcategory}`} className="hover:text-white">
            {topic.subcategory}
          </Link>
        </div>

        <Link href={`/forum/${topic.category}/${topic.subcategory}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Topic */}
        <div className="card mb-6">
          <div className="border-b-2 border-gray-200 pb-4 mb-4">
            <h1 className="text-2xl font-black mb-2">{topic.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{topic.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{topic.repliesCount} replies</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Author Info */}
            <div className="w-32 flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-cyber-red rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-2">
                {topic.author.username[0].toUpperCase()}
              </div>
              <p className="font-bold text-sm">{topic.author.username}</p>
              <p className="text-xs text-gray-500">{authorRank.emoji} {authorRank.name}</p>
              <p className="text-xs text-gray-400 mt-1">{topic.author.topicsCount || 0} topics</p>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <Clock className="w-3 h-3" />
                <span>{formatDate(topic.createdAt)}</span>
              </div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-white">Replies ({replies.length})</h3>
            {replies.map((reply) => {
              const replyRank = getRankInfo(reply.author.rank);
              return (
                <div key={reply._id} className="card">
                  <div className="flex gap-4">
                    <div className="w-24 flex-shrink-0 text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-lg mx-auto mb-1">
                        {reply.author.username[0].toUpperCase()}
                      </div>
                      <p className="font-bold text-xs">{reply.author.username}</p>
                      <p className="text-xs text-gray-500">{replyRank.emoji}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(reply.createdAt)}</span>
                      </div>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: reply.content }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reply Form */}
        {user && !topic.isLocked ? (
          <div className="card">
            <h3 className="font-bold mb-4">Post a Reply</h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="input-field min-h-[120px] mb-4"
                placeholder="Write your reply..."
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          </div>
        ) : !user ? (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-4">You must be logged in to reply</p>
            <Link href="/user-login" className="btn-primary">Sign In</Link>
          </div>
        ) : topic.isLocked ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">This topic is locked</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
