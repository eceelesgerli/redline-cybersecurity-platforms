import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ForumCategory from '@/models/ForumCategory';

// Default categories to seed
const defaultCategories = [
  {
    name: 'Cyber Security',
    slug: 'cyber-security',
    description: 'Discussions about cybersecurity topics, threats, and defense strategies',
    icon: '🛡️',
    color: '#dc2626',
    order: 1,
    subcategories: [
      { name: 'Network Security', slug: 'network-security', description: 'Firewalls, IDS/IPS, VPNs', topicsCount: 0 },
      { name: 'Web Security', slug: 'web-security', description: 'OWASP, XSS, SQL Injection', topicsCount: 0 },
      { name: 'Malware Analysis', slug: 'malware-analysis', description: 'Virus, trojan, ransomware analysis', topicsCount: 0 },
      { name: 'Penetration Testing', slug: 'penetration-testing', description: 'Ethical hacking techniques', topicsCount: 0 },
      { name: 'Cryptography', slug: 'cryptography', description: 'Encryption, hashing, PKI', topicsCount: 0 },
      { name: 'Security Tools', slug: 'security-tools', description: 'Nmap, Burp Suite, Metasploit', topicsCount: 0 },
    ],
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Programming languages, frameworks, and development topics',
    icon: '💻',
    color: '#2563eb',
    order: 2,
    subcategories: [
      { name: 'Python', slug: 'python', description: 'Python programming and scripting', topicsCount: 0 },
      { name: 'JavaScript', slug: 'javascript', description: 'JS, Node.js, React, Vue', topicsCount: 0 },
      { name: 'C/C++', slug: 'c-cpp', description: 'Systems programming', topicsCount: 0 },
      { name: 'Rust', slug: 'rust', description: 'Memory-safe systems programming', topicsCount: 0 },
      { name: 'Go', slug: 'go', description: 'Go language and tools', topicsCount: 0 },
      { name: 'Shell Scripting', slug: 'shell-scripting', description: 'Bash, PowerShell, automation', topicsCount: 0 },
    ],
  },
  {
    name: 'Reverse Engineering',
    slug: 'reverse-engineering',
    description: 'Binary analysis, disassembly, and reverse engineering techniques',
    icon: '🔍',
    color: '#7c3aed',
    order: 3,
    subcategories: [
      { name: 'Binary Analysis', slug: 'binary-analysis', description: 'ELF, PE, Mach-O analysis', topicsCount: 0 },
      { name: 'Disassembly', slug: 'disassembly', description: 'IDA Pro, Ghidra, radare2', topicsCount: 0 },
      { name: 'Debugging', slug: 'debugging', description: 'GDB, x64dbg, WinDbg', topicsCount: 0 },
      { name: 'Exploit Development', slug: 'exploit-development', description: 'Buffer overflows, ROP chains', topicsCount: 0 },
      { name: 'Game Hacking', slug: 'game-hacking', description: 'Game modification and analysis', topicsCount: 0 },
    ],
  },
  {
    name: 'General Discussion',
    slug: 'general',
    description: 'Off-topic discussions, introductions, and community chat',
    icon: '💬',
    color: '#059669',
    order: 4,
    subcategories: [
      { name: 'Introductions', slug: 'introductions', description: 'Introduce yourself to the community', topicsCount: 0 },
      { name: 'Career & Jobs', slug: 'career-jobs', description: 'Career advice and job opportunities', topicsCount: 0 },
      { name: 'News & Events', slug: 'news-events', description: 'Security news and events', topicsCount: 0 },
      { name: 'Resources', slug: 'resources', description: 'Learning resources and tutorials', topicsCount: 0 },
    ],
  },
];

export async function GET() {
  try {
    await dbConnect();
    
    // Check if categories exist, if not seed them
    const count = await ForumCategory.countDocuments();
    if (count === 0) {
      await ForumCategory.insertMany(defaultCategories);
    }
    
    const categories = await ForumCategory.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
