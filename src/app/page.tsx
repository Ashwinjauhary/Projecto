import { Suspense } from 'react';
import { Hero } from '@/components/portfolio/Hero';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { TechMarquee } from '@/components/portfolio/TechMarquee';
import { LoadingGrid } from '@/components/portfolio/LoadingGrid';
import { Contact } from '@/components/portfolio/Contact';
import { getPublicProjects } from '@/lib/sync';

export const revalidate = 3600; // Revalidate every hour

async function ProjectsSection() {
  try {
    const projects = await getPublicProjects();

    if (!projects || projects.length === 0) {
      return (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-muted/50 rounded-lg p-12 border border-border">
              <h2 className="text-2xl font-bold mb-4">No Projects Yet</h2>
              <p className="text-muted-foreground mb-6">
                Projects will appear here once they are synced from GitHub.
              </p>
              <div className="space-y-3 text-sm text-left max-w-md mx-auto">
                <p className="font-semibold">To add projects:</p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Set up your Supabase database with the schema</li>
                  <li>Configure environment variables in <code className="bg-muted px-1 rounded">.env.local</code></li>
                  <li>Log in to the <a href="/admin/login" className="text-primary hover:underline">admin panel</a></li>
                  <li>Click "Sync GitHub" to import your repositories</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return <ProjectGrid projects={projects} />;
  } catch (error: any) {
    console.error('Error fetching projects:', error);

    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-destructive/10 rounded-lg p-12 border border-destructive/20">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Failed to Load Projects</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || 'Unable to connect to the database'}
            </p>
            <div className="space-y-3 text-sm text-left max-w-md mx-auto">
              <p className="font-semibold">Common issues:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Supabase credentials not configured in <code className="bg-muted px-1 rounded">.env.local</code></li>
                <li>Database schema not applied (run <code className="bg-muted px-1 rounded">supabase-complete-schema.sql</code>)</li>
                <li>Network connectivity issues</li>
              </ul>
              <p className="mt-4">
                <a href="/admin/login" className="text-primary hover:underline">
                  Try logging in to the admin panel →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Hero />

      <TechMarquee />

      <Suspense fallback={<LoadingGrid />}>
        <ProjectsSection />
      </Suspense>

      <Contact />

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 text-center text-muted-foreground">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Creative Portfolio. Built with Next.js, Framer Motion & Supabase.</p>
        </div>
      </footer>
    </main>
  );
}
