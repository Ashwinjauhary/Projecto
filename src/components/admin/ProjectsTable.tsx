'use client';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/supabase/database.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, EyeOff, Star, Github, ExternalLink, GripVertical, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

type Project = Database['public']['Tables']['projects']['Row'];

interface SortableProjectItemProps {
    project: Project;
    updating: string | null;
    onToggleVisible: (project: Project) => void;
    onToggleFeatured: (project: Project) => void;
    onDelete: (project: Project) => void;
}

function SortableProjectItem({
    project,
    updating,
    onToggleVisible,
    onToggleFeatured,
    onDelete,
}: SortableProjectItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="touch-none">
            <Card className={`${updating === project.id ? 'opacity-50' : ''} bg-card`}>
                <div className="flex items-center p-4">
                    <div
                        {...attributes}
                        {...listeners}
                        className="mr-4 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
                    >
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-bold">
                                {project.title || project.repo_name}
                            </h3>
                            {project.featured && (
                                <Badge variant="default" className="bg-yellow-500 scale-90">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                </Badge>
                            )}
                            {!project.visible && (
                                <Badge variant="secondary" className="scale-90">
                                    <EyeOff className="w-3 h-3 mr-1" />
                                    Hidden
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description || 'No description'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 mr-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {project.stars}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                {project.language}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={project.visible}
                                onCheckedChange={() => onToggleVisible(project)}
                                disabled={updating === project.id}
                            />
                            <span className="text-xs w-10">Visible</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={project.featured}
                                onCheckedChange={() => onToggleFeatured(project)}
                                disabled={updating === project.id}
                            />
                            <span className="text-xs w-12">Featured</span>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <Link href={`/admin/projects/edit/${project.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(project)}
                                disabled={updating === project.id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

interface ProjectsTableProps {
    initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [updating, setUpdating] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setProjects((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newArray = arrayMove(items, oldIndex, newIndex);

                // Persist to database
                updateOrder(newArray);

                return newArray;
            });
        }
    };

    const updateOrder = async (newProjects: Project[]) => {
        try {
            // Create updates for all projects to ensure order_index is consistent
            const updates = newProjects.map((p, index) => ({
                id: p.id,
                order_index: index,
                // Need to include all required fields or use a partial update if supported
                // In Supabase upsert with ID works as an update
                repo_name: p.repo_name,
                github_url: p.github_url,
            }));

            const { error } = await supabase
                .from('projects')
                .upsert(updates as any, { onConflict: 'id' });

            if (error) throw error;
            toast.success('Order saved');
        } catch (error: any) {
            toast.error('Failed to save order');
            console.error(error);
        }
    };

    const handleToggleVisible = async (project: Project) => {
        setUpdating(project.id);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ visible: !project.visible })
                .eq('id', project.id);

            if (error) throw error;
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, visible: !p.visible } : p
            ));
            toast.success(`Project ${!project.visible ? 'shown' : 'hidden'}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update visibility');
        } finally {
            setUpdating(null);
        }
    };

    const handleToggleFeatured = async (project: Project) => {
        setUpdating(project.id);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ featured: !project.featured })
                .eq('id', project.id);

            if (error) throw error;
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, featured: !p.featured } : p
            ));
            toast.success(`Project ${!project.featured ? 'featured' : 'unfeatured'}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update featured status');
        } finally {
            setUpdating(null);
        }
    };

    const handleDelete = async (project: Project) => {
        if (!confirm(`Are you sure you want to delete "${project.title || project.repo_name}"?`)) {
            return;
        }
        setUpdating(project.id);
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', project.id);

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== project.id));
            toast.success('Project deleted');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete project');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-4xl font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-2">
                        Drag and drop to reorder projects on your site
                    </p>
                </div>
                <Link href="/admin/projects/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                    </Button>
                </Link>
            </div>

            <div className="space-y-2">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No projects yet. Try syncing from the dashboard.
                        </CardContent>
                    </Card>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={projects.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid gap-3">
                                {projects.map((project) => (
                                    <SortableProjectItem
                                        key={project.id}
                                        project={project}
                                        updating={updating}
                                        onToggleVisible={handleToggleVisible}
                                        onToggleFeatured={handleToggleFeatured}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
