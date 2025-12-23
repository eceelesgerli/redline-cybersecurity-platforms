import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  createdAt: string;
}

async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs/slug/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog;
  } catch {
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

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-white prose-li:text-white prose-a:text-cyber-red prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-cyber-black prose-pre:text-white prose-strong:text-white">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

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
