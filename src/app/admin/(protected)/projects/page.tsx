import { getAllProjects } from '@/lib/sync';
import { ProjectsTable } from '@/components/admin/ProjectsTable';

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return <ProjectsTable initialProjects={projects} />;
}
