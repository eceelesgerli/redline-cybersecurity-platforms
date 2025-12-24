import { Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';

interface Slide {
  _id: string;
  imageUrl: string;
  title?: string;
}

interface SiteSettings {
  siteName: string;
  siteNameAccent: string;
  logoUrl?: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
  slides?: Slide[];
  siteSettings?: SiteSettings;
}

export default function Hero({ title = 'Home', subtitle, showCTA = false, slides = [], siteSettings }: HeroProps) {
  const settings = siteSettings || { siteName: 'Red', siteNameAccent: 'Line', logoUrl: '' };
  
  return (
    <section className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 lg:py-20">
          <div className="flex items-center justify-center order-2 lg:order-1">
            <HeroCarousel slides={slides} />
          </div>

          <div className="flex flex-col justify-center order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <Shield className="w-12 h-12 text-cyber-red" />
              )}
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white">
                {settings.siteName}<span className="text-cyber-red">{settings.siteNameAccent}</span>
              </h1>
            </div>
            {subtitle && (
              <p className="text-xl text-white mb-6 max-w-lg">
                {subtitle}
              </p>
            )}
            {showCTA && (
              <div className="flex flex-wrap gap-4">
                <Link href="/blog" className="btn-primary">
                  Read Blog
                </Link>
                <Link href="/tools" className="btn-secondary">
                  Explore Tools
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Glassmorphism divider with title */}
      <div className="glass-divider-dark">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyber-black hidden md:block"></div>
        <div className="flex items-center justify-center w-full max-w-7xl mx-auto px-4">
          <div className="flex-1 max-w-[200px] md:max-w-[300px] h-0.5 bg-gradient-to-r from-transparent to-cyber-black"></div>
          <span className="px-6 py-2 border-2 border-cyber-black font-bold text-lg bg-white mx-4 whitespace-nowrap">
            {title}
          </span>
          <div className="flex-1 max-w-[200px] md:max-w-[300px] h-0.5 bg-gradient-to-l from-transparent to-cyber-black"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-cyber-black hidden md:block"></div>
      </div>
    </section>
  );
}
