'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

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

export default function NewToolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Web Application',
    externalLink: '',
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create tool');
      }

      router.push('/admin/tools');
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
          href="/admin/tools"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyber-red mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
        <h1 className="text-3xl font-black text-cyber-black">Add New Tool</h1>
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
              placeholder="e.g., Nmap"
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
              placeholder="Describe what this tool does..."
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
              placeholder="https://..."
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
              {loading ? 'Adding...' : 'Add Tool'}
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
