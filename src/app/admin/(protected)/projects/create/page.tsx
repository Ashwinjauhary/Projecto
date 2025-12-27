'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        repo_name: '',
        title: '',
        description: '',
        github_url: '',
        live_url: '',
        language: '',
        topics: '',
        featured: false,
        visible: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Parse topics
            const topics = formData.topics
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const { error } = await supabase.from('projects').insert({
                repo_name: formData.repo_name,
                title: formData.title || null,
                description: formData.description || null,
                github_url: formData.github_url,
                live_url: formData.live_url || null,
                language: formData.language || null,
                topics: topics.length > 0 ? topics : null,
                featured: formData.featured,
                visible: formData.visible,
                stars: 0,
                forks: 0,
                order_index: 0,
            } as any);

            if (error) throw error;

            toast.success('Project created successfully!');
            router.push('/admin/projects');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="font-heading text-4xl font-bold">Create Project</h1>
                    <p className="text-muted-foreground mt-2">
                        Add a custom project to your portfolio
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
                            <Label htmlFor="repo_name">
                                Repository Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="repo_name"
                                placeholder="my-awesome-project"
                                value={formData.repo_name}
                                onChange={(e) => setFormData({ ...formData, repo_name: e.target.value })}
                                required
                                disabled={loading}
                            />
                            <p className="text-sm text-muted-foreground">
                                Unique identifier for this project
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Custom Title</Label>
                            <Input
                                id="title"
                                placeholder="My Awesome Project"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                disabled={loading}
                            />
                            <p className="text-sm text-muted-foreground">
                                Display name (defaults to repository name)
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
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="github_url">
                                    GitHub URL <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="github_url"
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="live_url">Live Demo URL</Label>
                                <Input
                                    id="live_url"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={formData.live_url}
                                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">Primary Language</Label>
                                <Input
                                    id="language"
                                    placeholder="TypeScript"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="topics">Topics (comma-separated)</Label>
                                <Input
                                    id="topics"
                                    placeholder="react, nextjs, typescript"
                                    value={formData.topics}
                                    onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                                <Label htmlFor="visible" className="cursor-pointer">
                                    Visible on Portfolio
                                </Label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Project'}
                            </Button>
                            <Link href="/admin/projects">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
