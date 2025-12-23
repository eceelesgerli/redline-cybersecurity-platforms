# RedLine - Cybersecurity Blog & Pentesting Tools Platform

A modern, production-ready full-stack web application built with Next.js, React, MongoDB, and Tailwind CSS. RedLine is a cybersecurity-focused blog and web penetration testing tools platform with an admin-only control panel.

## Features

- **Blog Section**: Publish and manage cybersecurity articles with Markdown support
- **Tools Section**: Curated collection of web pentesting tools with categories
- **Admin Panel**: Full CRUD functionality for blogs and tools
- **JWT Authentication**: Secure admin-only access with HttpOnly cookies
- **Responsive Design**: Modern, aggressive cybersecurity aesthetic
- **SEO Optimized**: Meta tags and structured data for search engines

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Icons**: Lucide React

## Color Palette

- White: `#ffffff`
- Cyber Red: `#e10600`
- Black: `#000000`

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd filmblog
   npm install
   ```

2. **Configure environment variables**:
   
   Create a `.env.local` file (or use the existing one):
   ```env
   MONGODB_URI=mongodb://localhost:27017/redline
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Start MongoDB**:
   
   Make sure MongoDB is running locally, or update `MONGODB_URI` to point to your MongoDB Atlas cluster.

4. **Seed the database**:
   ```bash
   npm run seed
   ```
   
   This will create:
   - Admin user: `admin@redline.com` / `Admin@123456`
   - Sample blog posts
   - Sample pentesting tools

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin login: [http://localhost:3000/login](http://localhost:3000/login)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Public pages with header/footer
│   │   ├── page.tsx         # Home page
│   │   ├── blog/            # Blog list and detail pages
│   │   ├── tools/           # Tools page
│   │   └── login/           # Admin login page
│   ├── admin/               # Protected admin panel
│   │   ├── page.tsx         # Dashboard
│   │   ├── blogs/           # Blog CRUD
│   │   └── tools/           # Tools CRUD
│   ├── api/                 # API routes
│   │   ├── auth/            # Login/logout/me
│   │   ├── blogs/           # Blog CRUD API
│   │   └── tools/           # Tools CRUD API
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── BlogCard.tsx
│   ├── ToolCard.tsx
│   ├── Loading.tsx
│   └── admin/
│       └── AdminSidebar.tsx
├── lib/                     # Utilities
│   ├── auth.ts              # JWT & password utilities
│   ├── db.ts                # MongoDB connection
│   └── utils.ts             # Helper functions
├── models/                  # Mongoose models
│   ├── Admin.ts
│   ├── Blog.ts
│   └── Tool.ts
└── scripts/
    └── seed.js              # Database seeding script
```

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin

### Blogs
- `GET /api/blogs` - List blogs (with pagination)
- `POST /api/blogs` - Create blog (protected)
- `GET /api/blogs/[id]` - Get blog by ID
- `PUT /api/blogs/[id]` - Update blog (protected)
- `DELETE /api/blogs/[id]` - Delete blog (protected)
- `GET /api/blogs/slug/[slug]` - Get published blog by slug

### Tools
- `GET /api/tools` - List tools (with pagination)
- `POST /api/tools` - Create tool (protected)
- `GET /api/tools/[id]` - Get tool by ID
- `PUT /api/tools/[id]` - Update tool (protected)
- `DELETE /api/tools/[id]` - Delete tool (protected)

## Admin Credentials

Default admin credentials (created by seed script):
- **Email**: admin@redline.com
- **Password**: Admin@123456

⚠️ **Important**: Change these credentials in production!

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in HttpOnly cookies
- Protected admin routes with middleware
- Input validation and sanitization
- CSRF protection via SameSite cookies

## Tool Categories

- Reconnaissance
- Scanning
- Exploitation
- Post-Exploitation
- Password Attacks
- Web Application
- Network Analysis
- Forensics
- Other

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Lint
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/redline` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `NEXT_PUBLIC_BASE_URL` | Base URL for API calls | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Production Deployment

1. Set environment variables on your hosting platform
2. Build the application: `npm run build`
3. Start the server: `npm start`

For platforms like Vercel, Netlify, or Railway, the build and deployment is typically automatic.

## License

MIT License - Feel free to use this project for learning or building your own cybersecurity platform.

---

Built with ❤️ for the cybersecurity community
