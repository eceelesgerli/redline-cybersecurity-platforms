import Link from 'next/link';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyber-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-cyber-red" />
              <span className="text-2xl font-black tracking-tight">
                Red<span className="text-cyber-red">Line</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your gateway to cybersecurity knowledge and penetration testing tools.
              Stay ahead of threats with our latest insights and resources.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-cyber-red">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-cyber-red transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-cyber-red transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-400 hover:text-cyber-red transition-colors">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-cyber-red">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-cyber-red transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyber-red transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyber-red transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} RedLine. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built for cybersecurity professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
