#!/usr/bin/env node
/**
 * GitHub API Test Script
 * 
 * This script tests your GitHub API configuration and connectivity.
 * Run with: npx tsx test-github-sync.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');

    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: .env.local file not found!');
        console.log('\n📝 Please create a .env.local file with:');
        console.log('   NEXT_PUBLIC_GITHUB_USERNAME=your-username');
        console.log('   GITHUB_TOKEN=your-token (optional but recommended)');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=').trim();
            if (key && value) {
                process.env[key] = value;
            }
        }
    });
}

async function testGitHubAPI() {
    console.log('🔍 Testing GitHub API Configuration...\n');

    // Load environment variables
    loadEnvFile();

    // Check required variables
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    console.log('📋 Configuration:');
    console.log(`   GitHub Username: ${username || '❌ NOT SET'}`);
    console.log(`   GitHub Token: ${token ? '✅ SET' : '⚠️  NOT SET (rate limits will apply)'}`);
    console.log('');

    if (!username) {
        console.error('❌ Error: NEXT_PUBLIC_GITHUB_USERNAME is not set in .env.local');
        process.exit(1);
    }

    // Test GitHub API
    console.log(`🌐 Fetching repositories for: ${username}...\n`);

    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App-Test',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // Fetch repositories
        const repoResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
            { headers }
        );

        if (!repoResponse.ok) {
            const errorData = await repoResponse.json();
            console.error(`❌ GitHub API Error (${repoResponse.status}):`, errorData.message);

            if (repoResponse.status === 401) {
                console.log('\n💡 Tip: Your GITHUB_TOKEN might be invalid or expired.');
                console.log('   Generate a new token at: https://github.com/settings/tokens');
            } else if (repoResponse.status === 404) {
                console.log(`\n💡 Tip: User "${username}" not found on GitHub.`);
                console.log('   Check your NEXT_PUBLIC_GITHUB_USERNAME in .env.local');
            } else if (repoResponse.status === 403) {
                console.log('\n💡 Tip: Rate limit exceeded. Add a GITHUB_TOKEN to .env.local');
            }

            process.exit(1);
        }

        const repos = await repoResponse.json();

        console.log(`✅ Success! Found ${repos.length} repositories\n`);

        if (repos.length === 0) {
            console.log('⚠️  No public repositories found for this user.');
        } else {
            console.log('📦 Your repositories:');
            repos.slice(0, 10).forEach((repo: any, index: number) => {
                console.log(`   ${index + 1}. ${repo.name}`);
                console.log(`      ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks | 📝 ${repo.language || 'N/A'}`);
                console.log(`      ${repo.html_url}`);
            });

            if (repos.length > 10) {
                console.log(`   ... and ${repos.length - 10} more`);
            }
        }

        // Check rate limit
        const rateLimitResponse = await fetch('https://api.github.com/rate_limit', { headers });
        const rateLimit = await rateLimitResponse.json();

        const coreLimit = rateLimit.resources.core;
        const remaining = coreLimit.remaining;
        const limit = coreLimit.limit;
        const resetDate = new Date(coreLimit.reset * 1000);

        console.log('\n📊 Rate Limit Status:');
        console.log(`   Remaining: ${remaining}/${limit} requests`);
        console.log(`   Resets at: ${resetDate.toLocaleString()}`);

        if (remaining < 10) {
            console.log('\n⚠️  Warning: Low rate limit remaining!');
            if (!token) {
                console.log('   💡 Add GITHUB_TOKEN to .env.local for 5000 requests/hour');
            }
        }

        console.log('\n✅ GitHub API is working correctly!');
        console.log('\n📝 Next steps:');
        console.log('   1. Make sure your Supabase database is set up');
        console.log('   2. Run the SQL from supabase-complete-schema.sql');
        console.log('   3. Log in to /admin/login and click "Sync GitHub"');

    } catch (error: any) {
        console.error('❌ Network Error:', error.message);
        console.log('\n💡 Tip: Check your internet connection');
        process.exit(1);
    }
}

// Run the test
testGitHubAPI().catch(console.error);
