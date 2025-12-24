import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export const revalidate = 0;

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
}

async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    if (!blog) return null;
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.createdAt,
    },
  };
}

export default async function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="py-8 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-white hover:text-cyber-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-8 pb-8 border-b-2 border-cyber-black">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-white">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
          </div>
        </header>

        {blog.coverImage && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-white prose-li:text-white prose-a:text-cyber-red prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-cyber-black prose-pre:text-white prose-strong:text-white prose-img:rounded-lg prose-img:mx-auto"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <footer className="mt-12 pt-8 border-t-2 border-cyber-black">
          <Link 
            href="/blog"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </footer>
      </div>
    </article>
  );
}
