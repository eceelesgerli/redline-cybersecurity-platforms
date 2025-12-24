'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: true,
  });

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setCoverImage(data.url);
    } catch (err) {
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coverImage }),
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
            <label className="block text-sm font-bold mb-2">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {coverImage ? (
                <div className="relative">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <span className="text-gray-500">
                    {uploadingCover ? 'Uploading...' : 'Click to upload cover image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">This image will appear at the top of your blog post</p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your blog content here..."
            />
            <p className="text-sm text-gray-500 mt-1">Use the toolbar to format text, add images, change colors, and more</p>
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
