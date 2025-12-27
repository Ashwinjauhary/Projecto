import { requireAuth } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect to login if not authenticated
    await requireAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <AdminNav />
            <main className="container mx-auto py-8 px-4">
                {children}
            </main>
        </div>
    );
}
