'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?limit=100');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-cyber-black">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blogs/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      <div className="bg-white border-2 border-cyber-black">
        <div className="p-4 border-b-2 border-cyber-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No blog posts found</p>
            <Link href="/admin/blogs/new" className="btn-outline-red inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-cyber-black">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{blog.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{blog.excerpt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold ${
                          blog.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blogs/${blog._id}`}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleting === blog._id}
                          className="p-2 hover:bg-red-50 text-cyber-red rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
