'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, ChevronRight, Plus } from 'lucide-react';

interface SubCategory {
  name: string;
  slug: string;
  description: string;
  topicsCount: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: SubCategory[];
}

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    checkUser();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/forum/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-white">Loading forum...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Forum</h1>
            <p className="text-gray-400">Join discussions with the cybersecurity community</p>
          </div>
          {user ? (
            <Link href="/forum/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Topic
            </Link>
          ) : (
            <Link href="/register" className="btn-primary flex items-center gap-2">
              <Users className="w-4 h-4" />
              Join to Post
            </Link>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category._id} className="card overflow-hidden">
              {/* Category Header */}
              <div 
                className="flex items-center gap-3 p-4 border-b-2 border-gray-200"
                style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
              >
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h2 className="text-xl font-bold">{category.name}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>

              {/* Subcategories */}
              <div className="divide-y divide-gray-100">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/forum/${category.slug}/${sub.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold group-hover:text-cyber-red transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-sm text-gray-500">{sub.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {sub.topicsCount} topics
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyber-red transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
