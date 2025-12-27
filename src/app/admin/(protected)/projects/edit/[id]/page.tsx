'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Database } from '@/lib/supabase/database.types';

import { MediaUploader } from '@/components/admin/MediaUploader';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectMedia = Database['public']['Tables']['project_media']['Row'];

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [media, setMedia] = useState<ProjectMedia[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        live_url: '',
        language: '',
        topics: '',
        featured: false,
        visible: true,
    });

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const [projectRes, mediaRes] = await Promise.all([
                supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single(),
                supabase
                    .from('project_media')
                    .select('*')
                    .eq('project_id', id)
                    .order('order_index', { ascending: true })
            ]);

            if (projectRes.error) throw projectRes.error;
            if (mediaRes.error) throw mediaRes.error;

            setProject(projectRes.data);
            setMedia(mediaRes.data);
            setFormData({
                title: projectRes.data.title || '',
                description: projectRes.data.description || '',
                live_url: projectRes.data.live_url || '',
                language: projectRes.data.language || '',
                topics: projectRes.data.topics?.join(', ') || '',
                featured: projectRes.data.featured,
                visible: projectRes.data.visible,
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to load project');
            router.push('/admin/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const topics = formData.topics
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const { error } = await supabase
                .from('projects')
                .update({
                    title: formData.title || null,
                    description: formData.description || null,
                    live_url: formData.live_url || null,
                    language: formData.language || null,
                    topics: topics.length > 0 ? topics : null,
                    featured: formData.featured,
                    visible: formData.visible,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;

            toast.success('Project updated successfully!');
            router.push('/admin/projects');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-12 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div>
                    <h1 className="font-heading text-4xl font-bold">Edit Project</h1>
                    <p className="text-muted-foreground mt-2">
                        {project.repo_name}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Custom Title</Label>
                            <Input
                                id="title"
                                placeholder={project.repo_name}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                disabled={saving}
                            />
                            <p className="text-sm text-muted-foreground">
                                Override the repository name with a custom title
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="A brief description of your project..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                disabled={saving}
                            />
                            <p className="text-sm text-muted-foreground">
                                Custom description (overrides GitHub description)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="live_url">Live Demo URL</Label>
                            <Input
                                id="live_url"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.live_url}
                                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                disabled={saving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">Primary Language</Label>
                                <Input
                                    id="language"
                                    placeholder="TypeScript"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    disabled={saving}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="topics">Topics (comma-separated)</Label>
                                <Input
                                    id="topics"
                                    placeholder="react, nextjs, typescript"
                                    value={formData.topics}
                                    onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">GitHub Information (Read-only)</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Repository:</span>{' '}
                                    <span className="font-medium">{project.repo_name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Stars:</span>{' '}
                                    <span className="font-medium">{project.stars}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Forks:</span>{' '}
                                    <span className="font-medium">{project.forks}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">GitHub URL:</span>{' '}
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                                    disabled={saving}
                                />
                                <Label htmlFor="featured" className="cursor-pointer">
                                    Featured Project
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="visible"
                                    checked={formData.visible}
                                    onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                                    disabled={saving}
                                />
                                <Label htmlFor="visible" className="cursor-pointer">
                                    Visible on Portfolio
                                </Label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Link href="/admin/projects">
                                <Button type="button" variant="outline" disabled={saving}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Project Media</CardTitle>
                </CardHeader>
                <CardContent>
                    <MediaUploader projectId={id} initialMedia={media} />
                </CardContent>
            </Card>
        </div>
    );
}
