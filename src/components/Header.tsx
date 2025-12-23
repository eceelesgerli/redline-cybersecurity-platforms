'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools', label: 'Tools' },
  { href: '/login', label: 'Login' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-transparent sticky top-0 z-50">
      {/* Glassmorphism background for header */}
      <div className="glass-divider !py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center relative">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="w-8 h-8 text-cyber-red group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black tracking-tight text-white">
                Red<span className="text-cyber-red">Line</span>
              </span>
            </Link>

            {/* Centered Nav */}
            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? 'nav-link-active' : 'nav-link'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 border-2 border-cyber-black hover:bg-cyber-black hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Empty div for spacing on desktop */}
            <div className="hidden md:block w-8"></div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden py-4 border-t-2 border-cyber-black bg-white">
          <div className="flex flex-col gap-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${isActive(link.href) ? 'nav-link-active' : 'nav-link'} text-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
      
    </header>
  );
}
