import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string | Date;
}

export default function BlogCard({ title, slug, excerpt, createdAt }: BlogCardProps) {
  return (
    <article className="card group">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
        <Calendar className="w-4 h-4" />
        <time dateTime={new Date(createdAt).toISOString()}>
          {formatDate(createdAt)}
        </time>
      </div>
      
      <h3 className="text-xl font-bold mb-3 group-hover:text-cyber-red transition-colors">
        <Link href={`/blog/${slug}`}>
          {title}
        </Link>
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {excerpt}
      </p>
      
      <Link 
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 text-cyber-red font-semibold hover:gap-3 transition-all"
      >
        Read More
        <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}
