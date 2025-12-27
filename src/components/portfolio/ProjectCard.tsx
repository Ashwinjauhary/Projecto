'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'] & {
    project_media?: Array<{
        id: string;
        type: 'image' | 'video';
        url: string;
        order_index: number;
    }>;
};

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    const mainMedia = project.project_media?.sort((a, b) => a.order_index - b.order_index)[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card
                className="h-full cursor-pointer group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-white dark:bg-slate-900"
                onClick={onClick}
            >
                {/* Project Image/Media Preview */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {mainMedia ? (
                        mainMedia.type === 'image' ? (
                            <img
                                src={mainMedia.url}
                                alt={project.title || project.repo_name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <video
                                    src={mainMedia.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                />
                            </div>
                        )
                    ) : (
                        <img
                            src={`https://opengraph.githubassets.com/1/${project.github_url.split('github.com/')[1]}`}
                            alt={project.title || project.repo_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                // Fallback if opengraph image fails
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground/20"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></div>';
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-medium">Click to view details</span>
                    </div>
                </div>
                <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                        <h3 className="font-heading text-2xl font-bold group-hover:text-primary transition-colors">
                            {project.title || project.repo_name}
                        </h3>
                        {project.featured && (
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900">
                                Featured
                            </Badge>
                        )}
                    </div>

                    {project.language && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-muted-foreground">{project.language}</span>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                        {project.description || 'No description available'}
                    </p>

                    {project.topics && project.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.topics.slice(0, 5).map((topic) => (
                                <Badge key={topic} variant="secondary" className="text-xs">
                                    {topic}
                                </Badge>
                            ))}
                            {project.topics.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                    +{project.topics.length - 5}
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </a>
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-colors text-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                        </a>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
