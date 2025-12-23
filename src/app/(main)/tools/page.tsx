import { Metadata } from 'next';
import Hero from '@/components/Hero';
import ToolCard from '@/components/ToolCard';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Explore our curated collection of web penetration testing tools and cybersecurity resources.',
};

const categories = [
  'All',
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

async function getTools() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tools?limit=50`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tools || [];
  } catch {
    return [];
  }
}

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <>
      <Hero title="Tools" subtitle="Curated collection of web penetration testing tools and cybersecurity resources." />

      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 border-2 border-white text-white text-sm font-medium hover:bg-white hover:text-cyber-black cursor-pointer transition-colors"
              >
                {category}
              </span>
            ))}
          </div>

          {tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool: { _id: string; name: string; description: string; category: string; externalLink: string }) => (
                <ToolCard
                  key={tool._id}
                  name={tool.name}
                  description={tool.description}
                  category={tool.category}
                  externalLink={tool.externalLink}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold mb-2">No Tools Yet</h3>
              <p className="text-gray-500">Check back soon for our curated pentesting tools!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
