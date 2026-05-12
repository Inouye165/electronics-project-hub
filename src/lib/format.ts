import type { ProjectDifficulty, ProjectStatus } from "@prisma/client";

export const statusLabels: Record<ProjectStatus, string> = {
  idea: "Idea",
  planning: "Planning",
  building: "Building",
  testing: "Testing",
  completed: "Completed",
  paused: "Paused",
};

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function formatRelativeDate(date: Date, now = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 14) return `${diffDays} days ago`;

  return formatShortDate(date);
}
