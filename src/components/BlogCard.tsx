import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string | Date;
  coverImage?: string;
}

export default function BlogCard({ title, slug, excerpt, createdAt, coverImage }: BlogCardProps) {
  return (
    <article className="card group overflow-hidden">
      {coverImage && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
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
