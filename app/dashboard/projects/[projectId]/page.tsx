import ProjectDetailsClient from './ProjectDetailsClient';

export async function generateStaticParams() {
  // Example: Replace with your real data source
  const projects = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];

  return projects.map((project) => ({
    projectId: project.id,
  }));
}

export default async function ProjectDetailsPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  // TODO: Fetch project and units data here if needed, or let client component fetch
  return <ProjectDetailsClient projectId={projectId} />;
} 