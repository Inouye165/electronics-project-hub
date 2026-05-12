import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export async function createProjectFile(data: Prisma.ProjectFileUncheckedCreateInput) {
  return prisma.projectFile.create({ data });
}

export async function createProjectImage(data: Prisma.ProjectImageUncheckedCreateInput) {
  return prisma.projectImage.create({ data });
}
