import { createClient } from '@/lib/supabase/server';
import { fetchGitHubRepos, GitHubRepo } from './github';
import { Database } from './supabase/database_types';
import { Project as PortfolioProject } from '@/types/portfolio';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

/**
 * Sync GitHub repositories to Supabase
 * Merges GitHub data with existing Supabase data (Supabase overrides GitHub)
 */
export async function syncGitHubRepos(username: string) {
    try {
        // Fetch repos from GitHub
        const githubRepos = await fetchGitHubRepos(username);

        // Get Supabase client
        const supabase = await createClient();

        // Fetch existing projects from Supabase
        const { data: existingProjects, error: fetchError } = await supabase
            .from('projects')
            .select('*');

        if (fetchError) {
            throw new Error(`Failed to fetch existing projects: ${fetchError.message}`);
        }

        // Create a map of existing projects by repo_name
        const existingProjectsMap = new Map<string, Project>();
        existingProjects?.forEach(project => {
            existingProjectsMap.set(project.repo_name, project);
        });

        // Prepare projects to upsert
        const projectsToUpsert: ProjectInsert[] = githubRepos.map((repo, index) => {
            const existing = existingProjectsMap.get(repo.name);

            return {
                repo_name: repo.name,
                // Use custom title if exists, otherwise use repo name
                title: existing?.title || repo.name,
                // Use custom description if exists, otherwise use GitHub description
                description: existing?.description || repo.description,
                github_url: repo.html_url,
                // Preserve custom live_url if exists, otherwise use homepage
                live_url: existing?.live_url || repo.homepage,
                // Preserve custom featured status
                featured: existing?.featured ?? false,
                // Preserve custom visibility
                visible: existing?.visible ?? true,
                // Preserve custom order, or use index
                order_index: existing?.order_index ?? index,
                // Always update GitHub stats
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                topics: repo.topics,
                updated_at: new Date().toISOString(),
            };
        });

        // Upsert projects (insert new, update existing)
        const { data: upsertedProjects, error: upsertError } = await supabase
            .from('projects')
            .upsert(projectsToUpsert, {
                onConflict: 'repo_name',
                ignoreDuplicates: false,
            })
            .select();

        if (upsertError) {
            throw new Error(`Failed to upsert projects: ${upsertError.message}`);
        }

        return {
            success: true,
            synced: upsertedProjects?.length || 0,
            projects: upsertedProjects,
        };
    } catch (error) {
        console.error('Error syncing GitHub repos:', error);
        throw error;
    }
}

/**
 * Get all visible projects for public display
 */
export async function getPublicProjects(): Promise<PortfolioProject[]> {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
      *,
      project_media (*)
    `)
        .eq('visible', true)
        .order('order_index', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return (projects as any) || [];
}

/**
 * Get all projects for admin panel
 */
export async function getAllProjects(): Promise<PortfolioProject[]> {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
      *,
      project_media (*)
    `)
        .order('order_index', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return (projects as any) || [];
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<PortfolioProject> {
    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from('projects')
        .select(`
      *,
      project_media (*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return project as any;
}
