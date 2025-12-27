export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
}

export interface GitHubError {
    message: string;
    documentation_url?: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch all repositories for a GitHub user
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        console.warn('⚠️  GITHUB_TOKEN not found. API rate limits will apply (60 requests/hour).');
        console.warn('   Add GITHUB_TOKEN to .env.local for 5000 requests/hour');
    } else {
        console.log('✅ Using authenticated GitHub API requests');
    }

    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log(`🔍 Fetching repositories for user: ${username}`);

        const response = await fetch(
            `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`,
            {
                headers,
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            const error: GitHubError = await response.json();
            console.error(`❌ GitHub API error (${response.status}):`, error.message);

            if (response.status === 404) {
                throw new Error(`GitHub user "${username}" not found. Check NEXT_PUBLIC_GITHUB_USERNAME in .env.local`);
            } else if (response.status === 403) {
                throw new Error(`GitHub API rate limit exceeded. Add GITHUB_TOKEN to .env.local for higher limits.`);
            } else if (response.status === 401) {
                throw new Error(`GitHub authentication failed. Your GITHUB_TOKEN may be invalid or expired.`);
            }

            throw new Error(`GitHub API error: ${error.message}`);
        }

        const repos: GitHubRepo[] = await response.json();
        console.log(`✅ Successfully fetched ${repos.length} repositories`);
        return repos;
    } catch (error) {
        console.error('❌ Error fetching GitHub repos:', error);
        throw error;
    }
}

/**
 * Fetch a single repository
 */
export async function fetchGitHubRepo(
    owner: string,
    repo: string
): Promise<GitHubRepo> {
    const token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
            {
                headers,
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) {
            const error: GitHubError = await response.json();
            throw new Error(`GitHub API error: ${error.message}`);
        }

        const repoData: GitHubRepo = await response.json();
        return repoData;
    } catch (error) {
        console.error('Error fetching GitHub repo:', error);
        throw error;
    }
}

/**
 * Get rate limit status
 */
export async function getGitHubRateLimit() {
    const token = process.env.GITHUB_TOKEN;

    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch rate limit');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching rate limit:', error);
        throw error;
    }
}
