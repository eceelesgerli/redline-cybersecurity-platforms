import { Metadata } from 'next';
import Hero from '@/components/Hero';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest cybersecurity articles, tutorials, and insights from RedLine.',
};

async function getBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs?published=true&limit=50`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.blogs || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <Hero title="Blog" subtitle="Explore cybersecurity insights, tutorials, and the latest in web security." />

      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
