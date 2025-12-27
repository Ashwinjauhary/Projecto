import { Database } from '@/lib/supabase/database_types';

export type Project = Database['public']['Tables']['projects']['Row'] & {
    project_media?: Database['public']['Tables']['project_media']['Row'][];
};
