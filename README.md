# Premium Portfolio Web App

A stunning, animated portfolio web application with automatic GitHub integration and a powerful admin panel for content management.

## ✨ Features

### Public Portfolio
- **3D Animated Hero Section** - Eye-catching particle system background
- **Dynamic Project Grid** - Bento-style layout with smooth animations
- **Project Filtering** - Filter by featured status and technologies
- **Detailed Project Modals** - Rich project information with media galleries
- **GitHub Stats Integration** - Automatic display of stars, forks, and languages
- **Responsive Design** - Beautiful on all devices

### Admin Panel
- **Secure Authentication** - Email/password and GitHub OAuth
- **GitHub Sync** - One-click synchronization of repositories
- **Full CRUD Operations** - Create, read, update, and delete projects
- **Custom Overrides** - Override GitHub data with custom titles, descriptions, and media
- **Visibility Control** - Show/hide projects from public view
- **Featured Projects** - Highlight your best work
- **Drag-and-Drop Ordering** - Customize project display order
- **Media Management** - Upload custom images and videos

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Animations**: Framer Motion, GSAP
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **External API**: GitHub REST API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A GitHub Personal Access Token
- (Optional) Vercel account for deployment

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd portfolio-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the migration script from `supabase-migration.sql`
3. Create a storage bucket:
   - Go to Storage → Create bucket
   - Name: `project-media`
   - Public: Yes
4. Get your project credentials from Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# GitHub API
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-personal-access-token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Getting a GitHub Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token to your `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### 5. Create Admin Account

1. Go to your Supabase project → Authentication → Users
2. Click "Add user" → Create user with email/password
3. This user can now log in at `/admin/login`

### 6. Sync GitHub Projects

1. Log in to the admin panel at `/admin/login`
2. Go to Dashboard
3. Click "Sync GitHub" to fetch your repositories
4. Customize projects as needed

## 📁 Project Structure

```
portfolio-app/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin panel routes
│   │   │   ├── login/       # Login page
│   │   │   └── (protected)/ # Protected admin routes
│   │   │       ├── dashboard/
│   │   │       └── projects/
│   │   ├── api/             # API routes
│   │   │   └── sync/        # GitHub sync endpoint
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── admin/           # Admin components
│   │   ├── portfolio/       # Public portfolio components
│   │   ├── ui/              # shadcn/ui components
│   │   └── providers.tsx    # React Query provider
│   └── lib/
│       ├── supabase/        # Supabase clients & types
│       ├── github.ts        # GitHub API integration
│       ├── sync.ts          # Sync logic
│       └── auth.ts          # Authentication helpers
├── public/                  # Static assets
├── supabase-migration.sql   # Database schema
└── ENV_TEMPLATE.md          # Environment variables template
```

## 🎨 Customization

### Colors & Theme
Edit `src/app/globals.css` to customize the color scheme. The app uses Tailwind CSS v4 with CSS variables.

### Fonts
The app uses Inter and Outfit from Google Fonts. Change them in `src/app/layout.tsx`.

### Hero Section
Customize the 3D particle background in `src/components/portfolio/Hero.tsx`.

### Project Card Layout
Modify the project card design in `src/components/portfolio/ProjectCard.tsx`.

## 🔒 Security

- **Row Level Security (RLS)** is enabled on all Supabase tables
- Public users can only read visible projects
- Only authenticated users can modify data
- GitHub token is kept server-side only
- All admin routes are protected with authentication

## 📊 Database Schema

### `projects` Table
- `id` - UUID primary key
- `repo_name` - GitHub repository name (unique)
- `title` - Custom title (overrides repo name)
- `description` - Custom description
- `github_url` - Repository URL
- `live_url` - Demo/live site URL
- `featured` - Featured flag
- `visible` - Visibility flag
- `order_index` - Display order
- `stars`, `forks`, `language`, `topics` - GitHub stats

### `project_media` Table
- `id` - UUID primary key
- `project_id` - Foreign key to projects
- `type` - 'image' or 'video'
- `url` - Supabase Storage URL
- `order_index` - Display order

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Post-Deployment

1. Update Supabase Auth settings:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-domain.vercel.app/**` to "Redirect URLs"

2. Configure GitHub OAuth (optional):
   - Go to Supabase → Authentication → Providers
   - Enable GitHub provider
   - Add GitHub OAuth app credentials

## 📝 Usage

### Syncing Projects
The admin panel includes a "Sync GitHub" button that fetches all your public repositories. The sync process:
- Fetches repos from GitHub API
- Creates new projects for repos not in database
- Updates GitHub stats (stars, forks) for existing projects
- Preserves all custom overrides (title, description, featured, visible, order)

### Custom Projects
You can add projects that aren't on GitHub:
1. Go to Admin → Projects → Add Custom Project
2. Fill in the details manually
3. Upload custom media

### Reordering Projects
Drag and drop projects in the admin panel to change their display order on the public site.

## 🐛 Troubleshooting

**"Failed to fetch projects"**
- Check your Supabase credentials in `.env.local`
- Verify RLS policies are set up correctly

**"GitHub API rate limit exceeded"**
- Make sure `GITHUB_TOKEN` is set in `.env.local`
- Authenticated requests have much higher rate limits

**"Unauthorized" in admin panel**
- Ensure you've created a user in Supabase Authentication
- Check that the user is logged in

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)
