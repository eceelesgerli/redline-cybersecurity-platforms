'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const categories = [
  'Reconnaissance',
  'Scanning',
  'Exploitation',
  'Post-Exploitation',
  'Password Attacks',
  'Web Application',
  'Network Analysis',
  'Forensics',
  'Other',
];

interface ToolFormData {
  name: string;
  description: string;
  category: string;
  externalLink: string;
  featured: boolean;
}

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    category: 'Web Application',
    externalLink: '',
    featured: false,
  });

  useEffect(() => {
    fetchTool();
  }, [id]);

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch tool');
      }

      setFormData({
        name: data.tool.name,
        description: data.tool.description,
        category: data.tool.category,
        externalLink: data.tool.externalLink,
        featured: data.tool.featured || false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tool');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update tool');
      }

      router.push('/admin/tools');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/tools');
        router.refresh();
      }
    } catch (err) {
      setError('Failed to delete tool');
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href="/admin/tools"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-cyber-red mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-black text-cyber-black">Edit Tool</h1>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-cyber-red border-2 border-cyber-red hover:bg-cyber-red hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-cyber-black p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-cyber-red text-cyber-red">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2">
              Tool Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[150px]"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="externalLink" className="block text-sm font-bold mb-2">
              External Link *
            </label>
            <input
              id="externalLink"
              type="url"
              value={formData.externalLink}
              onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 border-2 border-cyber-black"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured tool
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/tools" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
