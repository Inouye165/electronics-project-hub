import type { ProjectDifficulty, ProjectStatus } from "@prisma/client";

import { difficultyLabels, formatShortDate, statusLabels } from "@/lib/format";
import { ProjectTabs } from "@/components/projects/project-tabs";

const PLACEHOLDER = "—";

export interface ProjectDetailViewProps {
  project: {
    slug: string;
    title: string;
    shortDescription: string;
    status: ProjectStatus;
    difficulty: ProjectDifficulty;
    createdAt: Date;
    updatedAt: Date;
    projectGoal: string;
    whyBuilt: string;
    problemSolved: string;
    projectStory: string;
    partsSummary: string;
    lessonsLearned: string;
    mistakesProblems: string;
    fixesSolutions: string;
    safetyNotes: string;
    futureTutorialNotes: string;
    nextSteps: string;
    steps: Array<{
      id: string;
      stepNumber: number;
      title: string;
      simpleExplanation: string;
      partsToolsNeeded: string;
      whatIDid: string;
      whatWentWrong: string;
      howIFixedIt: string;
      grandkidFriendlyExplanation: string;
      futureTutorialNotes: string;
      safetyNotes: string;
    }>;
    parts: Array<{ id: string; name: string; quantity: number; role: string }>;
    files: unknown[];
    images: unknown[];
  };
}

function computeNextAction(project: ProjectDetailViewProps["project"]): string | null {
  if (project.status === "completed") return null;
  if (project.parts.length === 0 && project.partsSummary.trim() === PLACEHOLDER) {
    return "Add your parts list";
  }
  if (project.steps.length === 0) {
    return "Add the first step to your build log";
  }
  if (project.nextSteps.trim() !== PLACEHOLDER && project.nextSteps.trim() !== "") {
    return project.nextSteps;
  }
  return null;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const nextAction = computeNextAction(project);
  const createdAt = formatShortDate(project.createdAt);
  const updatedAt = formatShortDate(project.updatedAt);

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Project journal</span>
        <h1>{project.title}</h1>
        <p className="lead">{project.shortDescription}</p>
        <div className="meta-row">
          <span className={`pill status-${project.status}`}>{statusLabels[project.status]}</span>
          <span className="pill">{difficultyLabels[project.difficulty]}</span>
          <span className="pill">Updated {updatedAt}</span>
        </div>
        {nextAction ? (
          <div className="next-action">
            <span className="next-action-label">Next action</span>
            <span>{nextAction}</span>
          </div>
        ) : null}
        <div className="button-row">
          <a href={`/projects/${project.slug}/edit`} className="button primary">
            Edit project
          </a>
        </div>
      </header>

      <ProjectTabs project={project} createdAt={createdAt} updatedAt={updatedAt} />
    </div>
  );
}
