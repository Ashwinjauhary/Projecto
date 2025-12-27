'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Star, GitFork, Calendar } from 'lucide-react';
import { Database } from '@/lib/supabase/database.types';

type Project = Database['public']['Tables']['projects']['Row'] & {
    project_media?: Array<{
        id: string;
        type: 'image' | 'video';
        url: string;
        order_index: number;
    }>;
};

interface ProjectModalProps {
    project: Project;
    open: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-heading text-3xl">
                        {project.title || project.repo_name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Media Gallery */}
                    {project.project_media && project.project_media.length > 0 && (
                        <div className="flex flex-col gap-6">
                            {project.project_media
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((media) => (
                                    <div key={media.id} className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800">
                                        {media.type === 'image' ? (
                                            <div className="relative group">
                                                <img
                                                    src={media.url}
                                                    alt={project.title || project.repo_name}
                                                    className="w-full h-auto max-h-[600px] object-contain mx-auto"
                                                />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                        ) : (
                                            <video
                                                src={media.url}
                                                controls
                                                className="w-full h-auto max-h-[600px] mx-auto"
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold">{project.stars}</span>
                            <span className="text-sm text-muted-foreground">stars</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <GitFork className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold">{project.forks}</span>
                            <span className="text-sm text-muted-foreground">forks</span>
                        </div>
                        {project.language && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="font-semibold">{project.language}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-heading text-xl font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {project.description || 'No description available'}
                        </p>
                    </div>

                    {/* Topics */}
                    {project.topics && project.topics.length > 0 && (
                        <div>
                            <h3 className="font-heading text-xl font-semibold mb-3">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.topics.map((topic) => (
                                    <Badge key={topic} variant="secondary">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4 pt-4 border-t">
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </a>
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 border-2 border-slate-900 text-slate-900 dark:border-white dark:text-white rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors font-semibold"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Live Demo
                            </a>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="text-sm text-muted-foreground pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Last updated: {new Date(project.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
