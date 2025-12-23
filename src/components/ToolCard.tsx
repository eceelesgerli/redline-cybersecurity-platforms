import { ExternalLink, Tag } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  category: string;
  externalLink: string;
}

export default function ToolCard({ name, description, category, externalLink }: ToolCardProps) {
  return (
    <article className="card group">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-cyber-red" />
        <span className="text-sm font-medium text-cyber-red">{category}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-3 group-hover:text-cyber-red transition-colors">
        {name}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {description}
      </p>
      
      <a 
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-cyber-black font-semibold hover:text-cyber-red transition-colors"
      >
        Visit Tool
        <ExternalLink className="w-4 h-4" />
      </a>
    </article>
  );
}
