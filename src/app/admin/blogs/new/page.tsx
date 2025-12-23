'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create blog');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyber-red mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        <h1 className="text-3xl font-black text-cyber-black">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-cyber-black p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-cyber-red text-cyber-red">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-bold mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="input-field min-h-[100px]"
              placeholder="Brief description of the post"
              maxLength={300}
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field min-h-[400px] font-mono text-sm"
              placeholder="Write your blog content here using Markdown..."
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 border-2 border-cyber-black"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <Link href="/admin/blogs" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
