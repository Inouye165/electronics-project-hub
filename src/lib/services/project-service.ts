import type { Project, ProjectStep } from "@prisma/client";

import { sanitizePlainText, sanitizeRichText } from "@/lib/security/sanitize";
import { projectInputSchema, projectStepInputSchema, projectUpdateSchema, type ProjectInput, type ProjectStepInput, type ProjectUpdateInput } from "@/lib/validation/project-schemas";

export interface ProjectRepositoryPort {
  createProject(data: ProjectInput): Promise<Project>;
  updateProject(id: string, data: Partial<ProjectInput>): Promise<Project>;
  createProjectStep(data: ProjectStepInput): Promise<ProjectStep>;
}

export interface ProjectStatusSummary {
  status: Project["status"];
  count: number;
}

const richTextFields = [
  "projectGoal",
  "whyBuilt",
  "problemSolved",
  "projectStory",
  "partsSummary",
  "lessonsLearned",
  "mistakesProblems",
  "fixesSolutions",
  "safetyNotes",
  "futureTutorialNotes",
  "nextSteps",
] as const;

export function prepareProjectInput(input: ProjectInput): ProjectInput {
  const parsed = projectInputSchema.parse(input);
  const sanitized = { ...parsed };

  sanitized.title = sanitizePlainText(parsed.title);
  sanitized.slug = sanitizePlainText(parsed.slug);
  sanitized.shortDescription = sanitizePlainText(parsed.shortDescription);

  for (const field of richTextFields) {
    sanitized[field] = sanitizeRichText(parsed[field]);
  }

  return sanitized;
}

export function prepareProjectUpdate(input: ProjectUpdateInput): ProjectUpdateInput {
  const parsed = projectUpdateSchema.parse(input);
  const sanitized = { ...parsed };

  if (parsed.title) sanitized.title = sanitizePlainText(parsed.title);
  if (parsed.slug) sanitized.slug = sanitizePlainText(parsed.slug);
  if (parsed.shortDescription) sanitized.shortDescription = sanitizePlainText(parsed.shortDescription);

  for (const field of richTextFields) {
    if (parsed[field]) {
      sanitized[field] = sanitizeRichText(parsed[field]);
    }
  }

  return sanitized;
}

export async function createProject(input: ProjectInput, repository: ProjectRepositoryPort) {
  return repository.createProject(prepareProjectInput(input));
}

export async function updateProject(input: ProjectUpdateInput, repository: ProjectRepositoryPort) {
  const { id, ...data } = prepareProjectUpdate(input);
  return repository.updateProject(id, data);
}

export function normalizeStepOrdering<T extends { stepNumber: number }>(steps: T[]): T[] {
  return [...steps]
    .sort((left, right) => left.stepNumber - right.stepNumber)
    .map((step, index) => ({ ...step, stepNumber: index + 1 }));
}

export async function createProjectStep(input: ProjectStepInput, repository: ProjectRepositoryPort) {
  const parsed = projectStepInputSchema.parse(input);
  return repository.createProjectStep({
    ...parsed,
    title: sanitizePlainText(parsed.title),
    simpleExplanation: sanitizeRichText(parsed.simpleExplanation),
    partsToolsNeeded: sanitizeRichText(parsed.partsToolsNeeded),
    whatIDid: sanitizeRichText(parsed.whatIDid),
    whatWentWrong: sanitizeRichText(parsed.whatWentWrong),
    howIFixedIt: sanitizeRichText(parsed.howIFixedIt),
    grandkidFriendlyExplanation: sanitizeRichText(parsed.grandkidFriendlyExplanation),
    futureTutorialNotes: sanitizeRichText(parsed.futureTutorialNotes),
    safetyNotes: sanitizeRichText(parsed.safetyNotes),
  });
}

export function summarizeProjectStatuses(projects: Pick<Project, "status">[]): ProjectStatusSummary[] {
  const summary = new Map<Project["status"], number>();

  for (const project of projects) {
    summary.set(project.status, (summary.get(project.status) ?? 0) + 1);
  }

  return Array.from(summary.entries()).map(([status, count]) => ({ status, count }));
}
