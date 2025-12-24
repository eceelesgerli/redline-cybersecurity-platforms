import { Metadata } from 'next';
import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import HeroSlide from '@/models/HeroSlide';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest cybersecurity articles, tutorials, and insights from RedLine.',
};

async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).limit(50).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

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

export default async function BlogPage() {
  const [blogs, slides] = await Promise.all([getBlogs(), getHeroSlides()]);

  return (
    <>
      <Hero title="Blog" subtitle="Explore cybersecurity insights, tutorials, and the latest in web security." slides={slides} />

      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="text-center py-16 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
              <p className="text-gray-500">Stay tuned for upcoming cybersecurity content!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
