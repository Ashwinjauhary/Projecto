'use client';

import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { Database } from '@/lib/supabase/database_types';

import { Project } from '@/types/portfolio';

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');

    const filteredProjects = projects.filter((project) => {
        if (filter === 'featured') return project.featured;
        return true;
    });

    // Get unique languages for filter
    const languages = Array.from(
        new Set(projects.map((p) => p.language).filter(Boolean))
    ) as string[];

    return (
        <section id="projects" className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="font-heading text-5xl font-bold mb-4">
                        Featured <span className="text-primary">Projects</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore my latest work, automatically synced from GitHub with custom enhancements
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    <button
                        onClick={() => setFilter('all')}
                        suppressHydrationWarning
                        className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'all'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        All Projects ({projects.length})
                    </button>
                    <button
                        onClick={() => setFilter('featured')}
                        suppressHydrationWarning
                        className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'featured'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        Featured ({projects.filter((p) => p.featured).length})
                    </button>
                </div>

                {/* Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">No projects found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
