import { getAllProjects } from '@/lib/sync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SyncButton } from '@/components/admin/SyncButton';
import { FolderGit2, Eye, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
    const projects = (await getAllProjects()) as any[];

    const stats = {
        total: projects.length,
        visible: projects.filter((p: any) => p.visible).length,
        featured: projects.filter((p: any) => p.featured).length,
        totalStars: projects.reduce((acc: number, p: any) => acc + (p.stars || 0), 0),
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-4xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your portfolio projects and content
                    </p>
                </div>
                <SyncButton />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visible</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.visible}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Featured</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.featured}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalStars}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Link href="/admin/projects">
                        <Button>
                            <FolderGit2 className="w-4 h-4 mr-2" />
                            Manage Projects
                        </Button>
                    </Link>
                    <Link href="/admin/projects/create">
                        <Button variant="outline">
                            Add Custom Project
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {projects.slice(0, 5).map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div>
                                    <h3 className="font-semibold">{project.title || project.repo_name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {project.featured && (
                                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                            Featured
                                        </span>
                                    )}
                                    {!project.visible && (
                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                                            Hidden
                                        </span>
                                    )}
                                    <Link href={`/admin/projects/edit/${project.id}`}>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
