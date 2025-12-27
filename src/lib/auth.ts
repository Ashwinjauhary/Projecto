import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAuth() {
    console.log('requireAuth: Starting check...');
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log('requireAuth: User present?', !!user);

    if (!user) {
        console.log('requireAuth: Redirecting to login');
        redirect('/admin/login');
    }

    return user;
}
