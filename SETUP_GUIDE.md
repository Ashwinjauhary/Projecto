# 🚀 Quick Setup Guide

Follow these steps to get your portfolio up and running!

## Step 1: Install Dependencies ✅

Already done! Dependencies are installed.

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: portfolio-db (or any name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2.2 Run Database Migration
1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-migration.sql`
4. Paste into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned"

### 2.3 Create Storage Bucket
1. Go to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Enter:
   - **Name**: `project-media`
   - **Public bucket**: ✅ Check this box
4. Click "Create bucket"

### 2.4 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string)

## Step 3: Get GitHub Token

1. Go to GitHub → **Settings** → **Developer settings**
2. Click **Personal access tokens** → **Tokens (classic)**
3. Click "Generate new token (classic)"
4. Fill in:
   - **Note**: Portfolio App
   - **Expiration**: No expiration (or your preference)
   - **Scopes**: Check `repo` (this gives read access to repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't see it again!)

## Step 4: Configure Environment Variables

1. Create a file named `.env.local` in the project root
2. Copy this template and fill in your values:

```env
# GitHub API
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_github_token_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
```

**Example:**
```env
NEXT_PUBLIC_GITHUB_USERNAME=johndoe
GITHUB_TOKEN=ghp_abc123xyz789
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Create Admin User

1. Go to your Supabase project
2. Click **Authentication** in the left sidebar
3. Click **Users** tab
4. Click "Add user" → "Create new user"
5. Fill in:
   - **Email**: your-email@example.com
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this
6. Click "Create user"

## Step 6: Run the App

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

## Step 7: Login to Admin Panel

1. Open: **http://localhost:3000/admin/login**
2. Enter the email and password you created in Step 5
3. Click "Sign In"

## Step 8: Sync Your GitHub Projects

1. You should now be in the admin dashboard
2. Click the **"Sync GitHub"** button
3. Wait a few seconds
4. Your GitHub repositories will be imported!

## Step 9: Customize Your Projects

1. Go to **Projects** in the admin nav
2. For each project you can:
   - ✏️ **Edit** to add custom title, description, live URL
   - 👁️ Toggle **Visible** to show/hide on public site
   - ⭐ Toggle **Featured** to highlight important projects
   - 🗑️ **Delete** projects you don't want to show

## Step 10: View Your Portfolio

1. Open: **http://localhost:3000**
2. See your beautiful portfolio with:
   - 3D animated hero section
   - Your GitHub projects
   - Filterable project grid
   - Click any project for details

---

## 🎉 You're Done!

Your portfolio is now running locally. 

### Next Steps:

- **Customize**: Edit the hero text in `src/components/portfolio/Hero.tsx`
- **Add Projects**: Create custom projects in the admin panel
- **Deploy**: Push to GitHub and deploy on Vercel (see README.md)

---

## 🐛 Troubleshooting

### "Failed to fetch projects"
- Check your `.env.local` file has correct Supabase credentials
- Make sure you ran the database migration SQL

### "GitHub API rate limit exceeded"
- Make sure `GITHUB_TOKEN` is set in `.env.local`
- Without a token, you're limited to 60 requests/hour

### "Unauthorized" in admin panel
- Make sure you created a user in Supabase Authentication
- Check email/password are correct

### Build errors
- Make sure `.env.local` exists with all required variables
- Run `npm install` again if needed

---

## 📚 Need Help?

Check the full [README.md](./README.md) for detailed documentation!
