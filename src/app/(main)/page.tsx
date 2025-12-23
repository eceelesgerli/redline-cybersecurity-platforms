import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getHeroSlides() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/hero-slides`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slides || [];
  } catch {
    return [];
  }
}

async function getLatestBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs?limit=3&published=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blogs || [];
  } catch {
    return [];
  }
}

async function getLatestTools() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tools?limit=3`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tools || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [blogs, tools, slides] = await Promise.all([
    getLatestBlogs(),
    getLatestTools(),
    getHeroSlides(),
  ]);

  return (
    <>
      <Hero 
        title="Home" 
        subtitle="Your gateway to cybersecurity knowledge and penetration testing tools. Stay ahead of threats with our latest insights and resources."
        showCTA={true}
        slides={slides}
      />

      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title text-white">Latest Blog Posts</h2>
            <Link 
              href="/blog" 
              className="hidden md:inline-flex items-center gap-2 text-cyber-red font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog: { _id: string; title: string; slug: string; excerpt: string; createdAt: string }) => (
                <BlogCard
                  key={blog._id}
                  title={blog.title}
                  slug={blog.slug}
                  excerpt={blog.excerpt}
                  createdAt={blog.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No blog posts yet. Check back soon!</p>
            </div>
          )}

          <Link 
            href="/blog" 
            className="md:hidden inline-flex items-center gap-2 text-cyber-red font-semibold mt-6 hover:gap-3 transition-all"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title text-white">Latest Tools</h2>
            <Link 
              href="/tools" 
              className="hidden md:inline-flex items-center gap-2 text-cyber-red font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-white">
              <p className="text-gray-500">No tools available yet. Check back soon!</p>
            </div>
          )}

          <Link 
            href="/tools" 
            className="md:hidden inline-flex items-center gap-2 text-cyber-red font-semibold mt-6 hover:gap-3 transition-all"
          >
            View All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
