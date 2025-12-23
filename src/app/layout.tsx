import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'RedLine | Cybersecurity Blog & Pentesting Tools',
    template: '%s | RedLine',
  },
  description: 'RedLine is a cybersecurity-focused blog and web penetration testing tools platform. Stay updated with the latest security insights and tools.',
  keywords: ['cybersecurity', 'pentesting', 'hacking', 'security tools', 'blog', 'web security'],
  authors: [{ name: 'RedLine Team' }],
  openGraph: {
    title: 'RedLine | Cybersecurity Blog & Pentesting Tools',
    description: 'Your gateway to cybersecurity knowledge and penetration testing tools.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedLine | Cybersecurity Blog & Pentesting Tools',
    description: 'Your gateway to cybersecurity knowledge and penetration testing tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
