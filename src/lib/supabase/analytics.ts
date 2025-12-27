import { supabase } from './client';

/**
 * Increments the view count for a specific project.
 */
export async function trackProjectView(projectId: string) {
    try {
        const { error } = await supabase.rpc('increment_view_count', { project_id: projectId });
        if (error) {
            const { data: project } = await supabase.from('projects').select('view_count').eq('id', projectId).single();
            await supabase.from('projects').update({ view_count: (project?.view_count || 0) + 1 }).eq('id', projectId);
        }
    } catch (e) {
        console.error('Failed to track view', e);
    }
}

export async function trackProjectClick(projectId: string) {
    try {
        const { error } = await supabase.rpc('increment_click_count', { project_id: projectId });
        if (error) {
            const { data: project } = await supabase.from('projects').select('click_count').eq('id', projectId).single();
            await supabase.from('projects').update({ click_count: (project?.click_count || 0) + 1 }).eq('id', projectId);
        }
    } catch (e) {
        console.error('Failed to track click', e);
    }
}
