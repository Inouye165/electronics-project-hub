"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { findProjectBySlug, updateProject } from "@/lib/repositories/project-repository";
import { prepareProjectUpdate } from "@/lib/services/project-service";
import { projectStatuses, projectDifficulties } from "@/lib/validation/project-schemas";

const editProjectFormSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(140, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only — no spaces or special characters (e.g. motion-detection-beeper)",
    ),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(260, "Short description is too long (max 260 characters)"),
  status: z.enum(projectStatuses),
  difficulty: z.enum(projectDifficulties),
  projectGoal: z.string().trim().min(1, "Project goal is required").max(12_000),
  whyBuilt: z.string().trim().min(1, "Required").max(12_000),
  problemSolved: z.string().trim().min(1, "Required").max(12_000),
  projectStory: z.string().trim().min(1, "Project story is required").max(12_000),
  partsSummary: z.string().trim().min(1, "Required").max(12_000),
  lessonsLearned: z.string().trim().min(1, "Required").max(12_000),
  mistakesProblems: z.string().trim().min(1, "Required").max(12_000),
  fixesSolutions: z.string().trim().min(1, "Required").max(12_000),
  safetyNotes: z.string().trim().min(1, "Required").max(12_000),
  futureTutorialNotes: z.string().trim().min(1, "Required").max(12_000),
  nextSteps: z.string().trim().min(1, "Required").max(12_000),
});

export type EditProjectFormState = {
  errors?: Partial<Record<keyof z.infer<typeof editProjectFormSchema>, string>>;
  message?: string;
};

export async function updateProjectAction(
  _prevState: EditProjectFormState,
  formData: FormData,
): Promise<EditProjectFormState> {
  const raw = {
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    status: formData.get("status"),
    difficulty: formData.get("difficulty"),
    projectGoal: formData.get("projectGoal"),
    whyBuilt: formData.get("whyBuilt"),
    problemSolved: formData.get("problemSolved"),
    projectStory: formData.get("projectStory"),
    partsSummary: formData.get("partsSummary"),
    lessonsLearned: formData.get("lessonsLearned"),
    mistakesProblems: formData.get("mistakesProblems"),
    fixesSolutions: formData.get("fixesSolutions"),
    safetyNotes: formData.get("safetyNotes"),
    futureTutorialNotes: formData.get("futureTutorialNotes"),
    nextSteps: formData.get("nextSteps"),
  };

  const parsed = editProjectFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: EditProjectFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<EditProjectFormState["errors"]>;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { errors: fieldErrors };
  }

  // Check the new slug is not already taken by a different project
  if (parsed.data.slug !== formData.get("originalSlug")) {
    const existing = await findProjectBySlug(parsed.data.slug);
    if (existing && existing.id !== parsed.data.id) {
      return { errors: { slug: "That slug is already used by another project." } };
    }
  }

  const { id, ...rest } = parsed.data;
  try {
    const prepared = prepareProjectUpdate({ id, ...rest });
    const { id: preparedId, ...data } = prepared;
    await updateProject(preparedId!, data);
  } catch {
    return { message: "Failed to save changes. Please try again." };
  }

  redirect(`/projects/${parsed.data.slug}`);
}
