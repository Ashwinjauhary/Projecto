'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Star, GitFork, Calendar, X } from 'lucide-react';
import { Database } from '@/lib/supabase/database_types';
import { trackProjectView, trackProjectClick } from '@/lib/supabase/analytics';

import { Project } from '@/types/portfolio';

interface ProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (isOpen && project?.id) {
            trackProjectView(project.id);
        }
    }, [isOpen, project?.id]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="font-heading text-3xl font-black italic uppercase tracking-tighter">
                        {project.title || project.repo_name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* Media Gallery */}
                    {project.project_media && project.project_media.length > 0 && (
                        <div className="flex flex-col gap-8">
                            {project.project_media
                                .sort((a: any, b: any) => a.order_index - b.order_index)
                                .map((media: any) => (
                                    <motion.div
                                        key={media.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-[2rem] overflow-hidden glass border-white/5"
                                    >
                                        {media.type === 'image' ? (
                                            <img
                                                src={media.url}
                                                alt={project.title || project.repo_name}
                                                className="w-full h-auto max-h-[600px] object-contain mx-auto"
                                            />
                                        ) : (
                                            <video
                                                src={media.url}
                                                controls
                                                className="w-full h-auto max-h-[600px] mx-auto"
                                            />
                                        )}
                                    </motion.div>
                                ))}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1 p-4 glass-dark rounded-2xl border-white/5">
                            <Star className="w-4 h-4 text-cyan-400" />
                            <span className="text-xl font-black italic">{project.stars}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Stars</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 glass-dark rounded-2xl border-white/5">
                            <GitFork className="w-4 h-4 text-purple-400" />
                            <span className="text-xl font-black italic">{project.forks}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Forks</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 glass-dark rounded-2xl border-white/5">
                            <Calendar className="w-4 h-4 text-pink-400" />
                            <span className="text-xs font-bold text-slate-300 mt-1">
                                {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Updated</span>
                        </div>
                        {project.language && (
                            <div className="flex flex-col gap-1 p-4 glass-dark rounded-2xl border-white/5">
                                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                <span className="text-xl font-black italic mt-1">{project.language}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Logic</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="p-8 glass-dark rounded-3xl border-white/5">
                        <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4">Brief</h3>
                        <p className="text-slate-300 font-light leading-relaxed text-lg">
                            {project.description || 'No description available'}
                        </p>
                    </div>

                    {/* Topics */}
                    {project.topics && project.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.topics.map((topic: string) => (
                                <Badge key={topic} variant="secondary" className="bg-white/5 text-slate-300 border-white/5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors hover:border-cyan-500/30">
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-col md:flex-row gap-4 pt-8">
                        <motion.a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackProjectClick(project.id)}
                            whileHover={{ y: -5 }}
                            className="flex-1 h-16 glass rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:border-white/20 transition-all"
                        >
                            <Github className="w-5 h-5" />
                            Source Artifact
                        </motion.a>
                        {project.live_url && (
                            <motion.a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackProjectClick(project.id)}
                                whileHover={{ y: -5 }}
                                className="flex-1 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Live System
                            </motion.a>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
