import { FileText, Wrench, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const [blogsRes, toolsRes] = await Promise.all([
      fetch(`${baseUrl}/api/blogs`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/tools`, { cache: 'no-store' }),
    ]);

    const blogsData = blogsRes.ok ? await blogsRes.json() : { pagination: { total: 0 } };
    const toolsData = toolsRes.ok ? await toolsRes.json() : { pagination: { total: 0 } };

    return {
      blogs: blogsData.pagination?.total || 0,
      tools: toolsData.pagination?.total || 0,
    };
  } catch {
    return { blogs: 0, tools: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Total Blog Posts',
      value: stats.blogs,
      icon: FileText,
      href: '/admin/blogs',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tools',
      value: stats.tools,
      icon: Wrench,
      href: '/admin/tools',
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-cyber-black">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your admin control panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white border-2 border-cyber-black p-6 hover:border-cyber-red transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-black">{card.value}</p>
              <p className="text-gray-500 text-sm">{card.title}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-cyber-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/blogs/new"
              className="flex items-center gap-3 p-4 border-2 border-cyber-black hover:border-cyber-red hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-cyber-red" />
              <span className="font-medium">Create New Blog Post</span>
            </Link>
            <Link
              href="/admin/tools/new"
              className="flex items-center gap-3 p-4 border-2 border-cyber-black hover:border-cyber-red hover:bg-gray-50 transition-colors"
            >
              <Wrench className="w-5 h-5 text-cyber-red" />
              <span className="font-medium">Add New Tool</span>
            </Link>
          </div>
        </div>

        <div className="bg-white border-2 border-cyber-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>Activity tracking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
