import { NextResponse } from 'next/server';
import { syncGitHubRepos } from '@/lib/sync';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
    try {
        // Check authentication
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get GitHub username from environment
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

        if (!username) {
            return NextResponse.json(
                { error: 'GitHub username not configured' },
                { status: 500 }
            );
        }

        // Sync repositories
        const result = await syncGitHubRepos(username);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to sync repositories' },
            { status: 500 }
        );
    }
}
