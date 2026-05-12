import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { listProjects } from "@/lib/repositories/project-repository";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  try {
    const projects = await listProjects();

    return (
      <div className="page">
        <header className="page-header">
          <span className="eyebrow">Projects</span>
          <h1>Every build gets a complete record.</h1>
          <p className="lead">Track the goal, story, parts, steps, fixes, safety notes, and future tutorial notes for each electronics project.</p>
        </header>
        {projects.length ? (
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No projects yet</h2>
            <p>Run the seed command or create a project through the service layer to begin the journal.</p>
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="page">
        <div className="error-state" role="alert">
          <h1>Projects need a database connection</h1>
          <p>Copy .env.example to .env, start PostgreSQL, then run the Prisma migration and seed commands.</p>
          <Link className="button primary" href="/">Back to dashboard</Link>
        </div>
      </div>
    );
  }
}
