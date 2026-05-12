import { z } from "zod";

export const projectStatuses = ["idea", "planning", "building", "testing", "completed", "paused"] as const;
export const projectDifficulties = ["beginner", "intermediate", "advanced"] as const;

const requiredProjectText = z.string().trim().min(1).max(12_000);

export const projectInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-safe slug such as bench-power-supply."),
  shortDescription: z.string().trim().min(10).max(260),
  projectGoal: requiredProjectText,
  whyBuilt: requiredProjectText,
  problemSolved: requiredProjectText,
  status: z.enum(projectStatuses),
  difficulty: z.enum(projectDifficulties),
  projectStory: requiredProjectText,
  partsSummary: requiredProjectText,
  lessonsLearned: requiredProjectText,
  mistakesProblems: requiredProjectText,
  fixesSolutions: requiredProjectText,
  safetyNotes: requiredProjectText,
  futureTutorialNotes: requiredProjectText,
  nextSteps: requiredProjectText,
});

export const projectUpdateSchema = projectInputSchema.partial().extend({
  id: z.string().min(1),
});

export const projectStepInputSchema = z.object({
  projectId: z.string().min(1),
  stepNumber: z.number().int().positive(),
  title: z.string().trim().min(3).max(140),
  simpleExplanation: requiredProjectText,
  partsToolsNeeded: requiredProjectText,
  whatIDid: requiredProjectText,
  whatWentWrong: z.string().trim().max(12_000).default(""),
  howIFixedIt: z.string().trim().max(12_000).default(""),
  grandkidFriendlyExplanation: requiredProjectText,
  futureTutorialNotes: z.string().trim().max(12_000).default(""),
  safetyNotes: z.string().trim().max(12_000).default(""),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type ProjectStepInput = z.infer<typeof projectStepInputSchema>;
