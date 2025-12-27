# 🚀 Quick Start - Getting Projects to Show

Your portfolio app is running, but you need to complete the setup to see projects!

## Current Status

✅ **App is running** at http://localhost:3000  
❓ **Projects not showing?** Follow the steps below.

## Why No Projects?

Projects are stored in **Supabase** (not fetched directly from GitHub). You need to:
1. Set up Supabase database
2. Configure environment variables
3. Sync your GitHub repos via the admin panel

## Step-by-Step Setup

### 1️⃣ Test GitHub Connection

Run this command to verify your GitHub credentials:

```bash
npx tsx test-github-sync.ts
```

This will tell you if your `NEXT_PUBLIC_GITHUB_USERNAME` and `GITHUB_TOKEN` are configured correctly.

### 2️⃣ Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a project
2. In your Supabase project, go to **SQL Editor**
3. Copy all contents from `supabase-complete-schema.sql`
4. Paste into SQL Editor and click **Run**
5. Create storage bucket:
   - Go to **Storage** → **Create bucket**
   - Name: `project-media`
   - Make it **public**

### 3️⃣ Configure Environment Variables

Make sure your `.env.local` file has all these variables:

```env
# GitHub API
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_token_here

# Supabase (get from Supabase Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Getting a GitHub Token:**
- Go to GitHub → Settings → Developer settings → Personal access tokens
- Generate new token (classic) with `repo` scope
- Copy the token to `.env.local`

### 4️⃣ Create Admin User

1. Go to your Supabase project → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Check **Auto Confirm User**
5. Click **Create user**

### 5️⃣ Sync GitHub Projects

1. Go to http://localhost:3000/admin/login
2. Log in with the credentials you just created
3. Click the **"Sync GitHub"** button
4. Wait a few seconds for your repos to import

### 6️⃣ View Your Portfolio

Go to http://localhost:3000 - your projects should now be visible! 🎉

## Troubleshooting

### "No Projects Yet" message
- You haven't synced GitHub repos yet
- Go to admin panel and click "Sync GitHub"

### "Failed to Load Projects" error
- Supabase credentials are missing or incorrect in `.env.local`
- Database schema hasn't been applied
- Check the browser console (F12) for detailed error messages

### GitHub sync fails
- Run `npx tsx test-github-sync.ts` to diagnose
- Check your `NEXT_PUBLIC_GITHUB_USERNAME` is correct
- Verify your `GITHUB_TOKEN` is valid (if using one)

### Can't log in to admin panel
- Make sure you created a user in Supabase Authentication
- Check email/password are correct
- Verify Supabase credentials in `.env.local`

## Need More Help?

Check the detailed guides:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Step-by-step setup instructions
- `supabase-complete-schema.sql` - Database schema with comments

## Quick Commands

```bash
# Test GitHub connection
npx tsx test-github-sync.ts

# Start dev server
npm run dev

# Build for production
npm run build
```
