import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import ToolCard from '@/components/ToolCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import Blog from '@/models/Blog';
import Tool from '@/models/Tool';
import SiteSettings from '@/models/SiteSettings';

export const revalidate = 0;

async function getHeroSlides() {
  try {
    await dbConnect();
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(slides));
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

async function getLatestBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

async function getLatestTools() {
  try {
    await dbConnect();
    const tools = await Tool.find({}).sort({ createdAt: -1 }).limit(3).lean();
    return JSON.parse(JSON.stringify(tools));
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

async function getSiteSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().lean();
    if (!settings) {
      return { siteName: 'Red', siteNameAccent: 'Line', logoUrl: '' };
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return { siteName: 'Red', siteNameAccent: 'Line', logoUrl: '' };
  }
}

export default async function HomePage() {
  const [blogs, tools, slides, siteSettings] = await Promise.all([
    getLatestBlogs(),
    getLatestTools(),
    getHeroSlides(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero 
        title="Home" 
        subtitle="Your gateway to cybersecurity knowledge and penetration testing tools. Stay ahead of threats with our latest insights and resources."
        showCTA={true}
        slides={slides}
        siteSettings={siteSettings}
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
              {blogs.map((blog: { _id: string; title: string; slug: string; excerpt: string; createdAt: string; coverImage?: string }) => (
                <BlogCard
                  key={blog._id}
                  title={blog.title}
                  slug={blog.slug}
                  excerpt={blog.excerpt}
                  createdAt={blog.createdAt}
                  coverImage={blog.coverImage}
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
