'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search } from 'lucide-react';

interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  externalLink: string;
  createdAt: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools?limit=100');
      const data = await res.json();
      setTools(data.tools || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTools(tools.filter((tool) => tool._id !== id));
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-cyber-black">Tools</h1>
          <p className="text-gray-500 mt-1">Manage pentesting tools</p>
        </div>
        <Link href="/admin/tools/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Tool
        </Link>
      </div>

      <div className="bg-white border-2 border-cyber-black">
        <div className="p-4 border-b-2 border-cyber-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredTools.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No tools found</p>
            <Link href="/admin/tools/new" className="btn-outline-red inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add your first tool
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-cyber-black">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Link</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool) => (
                  <tr key={tool._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{tool.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{tool.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-700">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={tool.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyber-red hover:underline text-sm"
                      >
                        {tool.externalLink.slice(0, 30)}...
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={tool.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Open Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/tools/${tool._id}`}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tool._id)}
                          disabled={deleting === tool._id}
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
