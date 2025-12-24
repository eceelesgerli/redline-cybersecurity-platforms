'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Eye, MessageCircle, Pin, Lock } from 'lucide-react';
import { RANKS } from '@/models/User';

interface Author {
  _id: string;
  username: string;
  rank: number;
}

interface Topic {
  _id: string;
  title: string;
  slug: string;
  author: Author;
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  lastReplyAt: string;
}

export default function SubcategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string; subcategory: string }> 
}) {
  const { category, subcategory } = use(params);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);

  useEffect(() => {
    fetchTopics();
    fetchCategoryInfo();
    checkUser();
  }, [category, subcategory]);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`/api/forum/topics?category=${category}&subcategory=${subcategory}`);
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryInfo = async () => {
    try {
      const res = await fetch('/api/forum/categories');
      const categories = await res.json();
      const cat = categories.find((c: any) => c.slug === category);
      if (cat) {
        const sub = cat.subcategories.find((s: any) => s.slug === subcategory);
        setCategoryInfo({ category: cat, subcategory: sub });
      }
    } catch (error) {
      console.error('Error fetching category info:', error);
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

  const getRankInfo = (rank: number) => {
    return RANKS.find(r => r.level === rank) || RANKS[0];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/forum" className="hover:text-white">Forum</Link>
          <span>/</span>
          <span className="text-white">
            {categoryInfo?.category?.name || category}
          </span>
          <span>/</span>
          <span className="text-cyber-red">
            {categoryInfo?.subcategory?.name || subcategory}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/forum" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Forum
            </Link>
            <h1 className="text-3xl font-black text-white">
              {categoryInfo?.subcategory?.name || subcategory}
            </h1>
            <p className="text-gray-400 mt-1">
              {categoryInfo?.subcategory?.description}
            </p>
          </div>
          {user ? (
            <Link 
              href={`/forum/new?category=${category}&subcategory=${subcategory}`}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Topic
            </Link>
          ) : (
            <Link href="/register" className="btn-primary">
              Join to Post
            </Link>
          )}
        </div>

        {/* Topics List */}
        {topics.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="divide-y divide-gray-100">
              {topics.map((topic) => {
                const rankInfo = getRankInfo(topic.author.rank);
                return (
                  <Link
                    key={topic._id}
                    href={`/forum/topic/${topic.slug}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.isPinned && (
                          <Pin className="w-4 h-4 text-cyber-red" />
                        )}
                        {topic.isLocked && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        <h3 className="font-semibold truncate group-hover:text-cyber-red transition-colors">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{rankInfo.emoji}</span>
                        <span>{topic.author.username}</span>
                        <span>•</span>
                        <span>{formatDate(topic.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{topic.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{topic.repliesCount}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Topics Yet</h3>
            <p className="text-gray-500 mb-4">Be the first to start a discussion!</p>
            {user && (
              <Link 
                href={`/forum/new?category=${category}&subcategory=${subcategory}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Topic
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
