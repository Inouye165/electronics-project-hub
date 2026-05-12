import Link from "next/link";
import type { Route } from "next";
import type { ProjectDifficulty, ProjectStatus } from "@prisma/client";

import { ProjectCard } from "@/components/projects/project-card";
import { statusLabels } from "@/lib/format";

export interface DashboardProject {
  title: string;
  slug: string;
  shortDescription: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  updatedAt: Date;
  steps?: unknown[];
}

interface DashboardViewProps {
  projects: DashboardProject[];
  statusSummary: { status: ProjectStatus; count: number }[];
  error?: string;
}

export function DashboardView({ projects, statusSummary, error }: DashboardViewProps) {
  const latestProject = projects[0];
  const latestProjectRoute = latestProject ? (`/projects/${latestProject.slug}` as Route) : undefined;
  const totalSteps = projects.reduce((count, project) => count + (project.steps?.length ?? 0), 0);

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Project journal</span>
        <h1>Build notes that your future self can actually use.</h1>
        <p className="lead">Capture what you built, why it mattered, what went wrong, and how to explain it clearly later.</p>
      </header>

      {error ? <ErrorState message={error} /> : null}

      <div className="dashboard-grid">
        <section className="panel hero-panel" aria-labelledby="dashboard-projects-title">
          <div>
            <span className="eyebrow">Projects are primary</span>
            <h2 id="dashboard-projects-title">Continue the electronics story from the latest bench session.</h2>
            <p className="lead">Projects hold the full build record: goals, parts, mistakes, fixes, safety notes, and tutorial notes.</p>
          </div>
          <div className="button-row">
            <Link className="button secondary" href="/projects">Open projects</Link>
            {latestProjectRoute ? <Link className="button primary" href={latestProjectRoute}>Continue latest</Link> : null}
          </div>
          <div className="metrics" aria-label="Project overview">
            <div className="metric">
              <p className="metric-value">{projects.length}</p>
              <p className="metric-label">Projects</p>
            </div>
            <div className="metric">
              <p className="metric-value">{totalSteps}</p>
              <p className="metric-label">Documented steps</p>
            </div>
            <div className="metric">
              <p className="metric-value">{statusSummary.length}</p>
              <p className="metric-label">Active statuses</p>
            </div>
          </div>
        </section>

        <aside className="stack" aria-label="Secondary sections">
          <section className="panel">
            <div className="section-heading">
              <h2>Status overview</h2>
            </div>
            {statusSummary.length ? (
              <ul className="compact-list">
                {statusSummary.map((item) => (
                  <li key={item.status}>
                    <span>{statusLabels[item.status]}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No project statuses yet.</p>
            )}
          </section>
          <div className="gateway-grid">
            <Link className="card gateway-card" href="/inventory">
              <strong>Inventory</strong>
              <p>Parts, quantities, datasheets, storage locations, and project usage are planned in the schema.</p>
            </Link>
            <Link className="card gateway-card" href="/lessons">
              <strong>Lessons</strong>
              <p>Reusable notes, references, mistakes, and safety reminders will become a searchable library.</p>
            </Link>
          </div>
        </aside>
      </div>

      <section className="panel" style={{ marginTop: 18 }} aria-labelledby="recent-projects-title">
        <div className="section-heading">
          <h2 id="recent-projects-title">Recently updated projects</h2>
          <Link className="pill" href="/projects">View all</Link>
        </div>
        {projects.length ? (
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <h2>No projects documented yet</h2>
      <p>Add the first project through the service layer or seed script, then this dashboard becomes the working journal gateway.</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="error-state" role="alert">
      <h2>Database connection needs attention</h2>
      <p>{message}</p>
    </div>
  );
}
