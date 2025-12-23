const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/redline';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String, default: '' },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  externalLink: { type: String, required: true },
  icon: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Admin = mongoose.model('Admin', AdminSchema);
    const Blog = mongoose.model('Blog', BlogSchema);
    const Tool = mongoose.model('Tool', ToolSchema);

    // Seed Admin
    console.log('\n📝 Seeding admin user...');
    const existingAdmin = await Admin.findOne({ email: 'admin@redline.com' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      await Admin.create({
        email: 'admin@redline.com',
        password: hashedPassword,
        name: 'Admin',
      });
      console.log('✅ Admin user created');
      console.log('   Email: admin@redline.com');
      console.log('   Password: Admin@123456');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed sample blog posts
    console.log('\n📝 Seeding sample blog posts...');
    const blogCount = await Blog.countDocuments();
    
    if (blogCount === 0) {
      const sampleBlogs = [
        {
          title: 'Introduction to Web Penetration Testing',
          slug: 'introduction-to-web-penetration-testing',
          excerpt: 'Learn the fundamentals of web application security testing and discover common vulnerabilities that affect modern web applications.',
          content: `# Introduction to Web Penetration Testing

Web penetration testing is a critical security practice that helps organizations identify vulnerabilities in their web applications before malicious actors can exploit them.

## What is Penetration Testing?

Penetration testing, often called "pen testing," is an authorized simulated attack on a computer system to evaluate its security. Web penetration testing specifically focuses on web applications and their associated infrastructure.

## Common Vulnerabilities

### 1. SQL Injection
SQL injection occurs when an attacker can insert malicious SQL code into queries that an application sends to its database.

### 2. Cross-Site Scripting (XSS)
XSS attacks inject malicious scripts into web pages viewed by other users.

### 3. Cross-Site Request Forgery (CSRF)
CSRF tricks authenticated users into performing unintended actions.

## Getting Started

To begin your journey in web penetration testing:

1. **Learn the basics** - Understand HTTP, web technologies, and common vulnerabilities
2. **Set up a lab** - Use platforms like DVWA or OWASP WebGoat
3. **Practice legally** - Only test systems you have permission to test
4. **Use proper tools** - Familiarize yourself with tools like Burp Suite, OWASP ZAP

Stay tuned for more detailed guides on each topic!`,
          published: true,
        },
        {
          title: 'OWASP Top 10 Security Risks Explained',
          slug: 'owasp-top-10-security-risks-explained',
          excerpt: 'A comprehensive guide to understanding the OWASP Top 10 web application security risks and how to mitigate them.',
          content: `# OWASP Top 10 Security Risks Explained

The OWASP Top 10 is a standard awareness document representing the most critical security risks to web applications.

## The Current Top 10

### A01:2021 - Broken Access Control
Access control enforces policy such that users cannot act outside of their intended permissions.

### A02:2021 - Cryptographic Failures
Previously known as Sensitive Data Exposure, this focuses on failures related to cryptography.

### A03:2021 - Injection
Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query.

### A04:2021 - Insecure Design
A new category focusing on risks related to design and architectural flaws.

### A05:2021 - Security Misconfiguration
Security misconfiguration is the most commonly seen issue in web applications.

## How to Stay Protected

- Implement proper access controls
- Use strong encryption for sensitive data
- Validate and sanitize all user inputs
- Follow secure design principles
- Regularly audit your security configurations

The key to application security is staying informed and proactive!`,
          published: true,
        },
        {
          title: 'Essential Tools for Bug Bounty Hunters',
          slug: 'essential-tools-for-bug-bounty-hunters',
          excerpt: 'Discover the must-have tools and resources that every bug bounty hunter should have in their arsenal.',
          content: `# Essential Tools for Bug Bounty Hunters

Bug bounty hunting has become a lucrative field for security researchers. Here are the essential tools you need to get started.

## Reconnaissance Tools

### Subdomain Enumeration
- **Subfinder** - Fast passive subdomain enumeration tool
- **Amass** - In-depth attack surface mapping
- **Assetfinder** - Find domains and subdomains

### Port Scanning
- **Nmap** - The classic network scanner
- **Masscan** - Fast port scanner

## Web Application Testing

### Proxy Tools
- **Burp Suite** - The industry standard for web security testing
- **OWASP ZAP** - Free and open-source alternative

### Vulnerability Scanners
- **Nuclei** - Fast vulnerability scanner based on templates
- **Nikto** - Web server scanner

## Automation

- **Httpx** - Fast HTTP toolkit
- **Waybackurls** - Fetch URLs from Wayback Machine
- **Gf** - Pattern matching for grep

## Tips for Success

1. Build your own methodology
2. Automate repetitive tasks
3. Focus on understanding, not just running tools
4. Document everything
5. Stay updated with latest vulnerabilities

Happy hunting!`,
          published: true,
        },
      ];

      await Blog.insertMany(sampleBlogs);
      console.log('✅ Sample blog posts created');
    } else {
      console.log('ℹ️  Blog posts already exist');
    }

    // Seed sample tools
    console.log('\n📝 Seeding sample tools...');
    const toolCount = await Tool.countDocuments();
    
    if (toolCount === 0) {
      const sampleTools = [
        {
          name: 'Burp Suite',
          description: 'Industry-leading web security testing toolkit with proxy, scanner, and various testing tools for web application security assessment.',
          category: 'Web Application',
          externalLink: 'https://portswigger.net/burp',
          featured: true,
        },
        {
          name: 'Nmap',
          description: 'Free and open-source network scanner used to discover hosts and services on a network by sending packets and analyzing responses.',
          category: 'Scanning',
          externalLink: 'https://nmap.org/',
          featured: true,
        },
        {
          name: 'OWASP ZAP',
          description: 'Free and open-source web application security scanner. Great for finding vulnerabilities in web applications during development and testing.',
          category: 'Web Application',
          externalLink: 'https://www.zaproxy.org/',
          featured: true,
        },
        {
          name: 'Metasploit',
          description: 'The world\'s most used penetration testing framework. Helps security professionals find vulnerabilities, develop exploits, and execute attacks.',
          category: 'Exploitation',
          externalLink: 'https://www.metasploit.com/',
          featured: false,
        },
        {
          name: 'Hashcat',
          description: 'Advanced password recovery utility supporting five unique modes of attack for over 300 highly-optimized hashing algorithms.',
          category: 'Password Attacks',
          externalLink: 'https://hashcat.net/hashcat/',
          featured: false,
        },
        {
          name: 'Subfinder',
          description: 'Fast passive subdomain enumeration tool that discovers valid subdomains using passive online sources.',
          category: 'Reconnaissance',
          externalLink: 'https://github.com/projectdiscovery/subfinder',
          featured: false,
        },
        {
          name: 'Nuclei',
          description: 'Fast and customizable vulnerability scanner based on simple YAML-based templates describing how to detect security vulnerabilities.',
          category: 'Scanning',
          externalLink: 'https://github.com/projectdiscovery/nuclei',
          featured: true,
        },
        {
          name: 'Wireshark',
          description: 'Free and open-source packet analyzer used for network troubleshooting, analysis, software and protocol development.',
          category: 'Network Analysis',
          externalLink: 'https://www.wireshark.org/',
          featured: false,
        },
      ];

      await Tool.insertMany(sampleTools);
      console.log('✅ Sample tools created');
    } else {
      console.log('ℹ️  Tools already exist');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   Admin: admin@redline.com / Admin@123456');
    console.log('   Blogs:', await Blog.countDocuments());
    console.log('   Tools:', await Tool.countDocuments());

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seed();
