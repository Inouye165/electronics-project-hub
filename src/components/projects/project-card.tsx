import Link from "next/link";
import type { Route } from "next";
import type { ProjectDifficulty, ProjectStatus } from "@prisma/client";

import { difficultyLabels, formatRelativeDate, statusLabels } from "@/lib/format";

export interface ProjectCardProps {
  project: {
    title: string;
    slug: string;
    shortDescription: string;
    status: ProjectStatus;
    difficulty: ProjectDifficulty;
    updatedAt: Date;
    steps?: unknown[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const projectRoute = `/projects/${project.slug}` as Route;

  return (
    <Link className="card project-card" href={projectRoute}>
      <div>
        <div className="meta-row" aria-label="Project metadata">
          <span className={`pill status-${project.status}`}>{statusLabels[project.status]}</span>
          <span className="pill">{difficultyLabels[project.difficulty]}</span>
          <span className="pill">{project.steps?.length ?? 0} steps</span>
        </div>
      </div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.shortDescription}</p>
      </div>
      <span className="muted">Updated {formatRelativeDate(project.updatedAt)}</span>
    </Link>
  );
}
