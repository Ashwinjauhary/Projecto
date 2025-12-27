'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FolderGit2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function AdminNav() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            toast.success('Logged out successfully');
            router.push('/admin/login');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to log out');
        }
    };

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/admin/dashboard" className="font-heading text-xl font-bold">
                            Portfolio Admin
                        </Link>
                        <div className="flex gap-4">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/projects"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <FolderGit2 className="w-4 h-4" />
                                Projects
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            View Site
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
