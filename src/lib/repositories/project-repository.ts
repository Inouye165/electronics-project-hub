import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const projectDetailInclude = {
  steps: { orderBy: { stepNumber: "asc" as const } },
  files: true,
  images: true,
  parts: true,
  tags: { include: { tag: true } },
  referenceLinks: true,
} satisfies Prisma.ProjectInclude;

export type ProjectDetail = Prisma.ProjectGetPayload<{ include: typeof projectDetailInclude }>;

export async function listProjects() {
  return prisma.project.findMany({
    include: {
      steps: { select: { id: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listRecentlyUpdatedProjects(limit = 4) {
  return prisma.project.findMany({
    take: limit,
    include: { steps: { select: { id: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  return prisma.project.findUnique({
    where: { slug },
    include: projectDetailInclude,
  });
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data });
}

export async function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({ where: { id }, data });
}

export async function createProjectStep(data: Prisma.ProjectStepUncheckedCreateInput) {
  return prisma.projectStep.create({ data });
}
