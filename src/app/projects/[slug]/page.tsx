import { notFound } from "next/navigation";

import { ProjectDetailView } from "@/components/projects/project-detail-view";
import { findProjectBySlug } from "@/lib/repositories/project-repository";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  try {
    const project = await findProjectBySlug(slug);

    if (!project) {
      notFound();
    }

    return <ProjectDetailView project={project} />;
  } catch {
    return (
      <div className="page">
        <div className="error-state" role="alert">
          <h1>Project record unavailable</h1>
          <p>The project route is ready, but the database connection or migration needs attention before records can load.</p>
        </div>
      </div>
    );
  }
}
