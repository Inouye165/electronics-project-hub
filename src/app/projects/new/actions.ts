"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createProject } from "@/lib/repositories/project-repository";
import { prepareProjectInput } from "@/lib/services/project-service";
import { projectStatuses, projectDifficulties } from "@/lib/validation/project-schemas";
import type { ProjectInput } from "@/lib/validation/project-schemas";

const PLACEHOLDER = "—";

const newProjectFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(140, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only (e.g. bench-power-supply)"),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(260, "Short description is too long"),
  status: z.enum(projectStatuses),
  difficulty: z.enum(projectDifficulties),
});

export type NewProjectFormState = {
  errors?: Partial<Record<keyof z.infer<typeof newProjectFormSchema>, string>>;
  message?: string;
};

export async function createProjectAction(
  _prevState: NewProjectFormState,
  formData: FormData
): Promise<NewProjectFormState> {
  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    status: formData.get("status"),
    difficulty: formData.get("difficulty"),
  };

  const parsed = newProjectFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: NewProjectFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<NewProjectFormState["errors"]>;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { errors: fieldErrors };
  }

  const input: ProjectInput = {
    ...parsed.data,
    projectGoal: PLACEHOLDER,
    whyBuilt: PLACEHOLDER,
    problemSolved: PLACEHOLDER,
    projectStory: PLACEHOLDER,
    partsSummary: PLACEHOLDER,
    lessonsLearned: PLACEHOLDER,
    mistakesProblems: PLACEHOLDER,
    fixesSolutions: PLACEHOLDER,
    safetyNotes: PLACEHOLDER,
    futureTutorialNotes: PLACEHOLDER,
    nextSteps: PLACEHOLDER,
  };

  let project;
  try {
    const prepared = prepareProjectInput(input);
    project = await createProject(prepared);
  } catch {
    return { message: "Failed to create project. Please try again." };
  }

  redirect(`/projects/${project.slug}`);
}
