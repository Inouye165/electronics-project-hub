import { notFound } from "next/navigation";

import { ProjectJournalForm } from "@/components/projects/project-journal-form";
import { findProjectBySlug } from "@/lib/repositories/project-repository";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await findProjectBySlug(slug);
  } catch {
    return (
      <div className="page">
        <div className="error-state" role="alert">
          <h1>Could not load project</h1>
          <p>The database connection needs attention before this project can be edited.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Projects</span>
        <h1>Edit project</h1>
        <p className="lead">{project.title}</p>
      </header>
      <div className="form-container" style={{ maxWidth: 760 }}>
        <ProjectJournalForm project={project} />
      </div>
    </div>
  );
}
