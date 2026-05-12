import type { Project, ProjectStep } from "@prisma/client";
import { ZodError } from "zod";
import { describe, expect, it, vi } from "vitest";

import { createProject, normalizeStepOrdering, prepareProjectInput, prepareProjectUpdate, type ProjectRepositoryPort } from "@/lib/services/project-service";
import { projectUpdateSchema } from "@/lib/validation/project-schemas";
import type { ProjectInput } from "@/lib/validation/project-schemas";

const projectInput: ProjectInput = {
  title: "  Bench LED Continuity Tester  ",
  slug: "bench-led-continuity-tester",
  shortDescription: "A compact tester for checking wiring while working at the bench.",
  projectGoal: "Make continuity checks faster during small electronics builds.",
  whyBuilt: "The multimeter was useful but slow to reset during hands-on wiring.",
  problemSolved: "It gives a visible answer when a switch, wire, or solder joint is connected.",
  status: "building",
  difficulty: "beginner",
  projectStory: "Started after tracing a bad solder joint.",
  partsSummary: "LED, resistor, battery holder, switch, probe wire, and enclosure.",
  lessonsLearned: "Simple tools are easier to trust when the current path is obvious.",
  mistakesProblems: "<script>alert('bad')</script>The first resistor value made the LED too dim.",
  fixesSolutions: "Compared resistor values and chose a brighter LED.",
  safetyNotes: "Use only on unpowered circuits.",
  futureTutorialNotes: "Show the current path with a simple diagram.",
  nextSteps: "Install the final parts in the enclosure.",
};

describe("project service", () => {
  it("sanitizes project input before persistence", () => {
    const prepared = prepareProjectInput(projectInput);

    expect(prepared.title).toBe("Bench LED Continuity Tester");
    expect(prepared.mistakesProblems).not.toContain("script");
  });

  it("creates projects through the repository boundary", async () => {
    const createdProject = { id: "project-1", ...prepareProjectInput(projectInput), ownerId: null, createdAt: new Date(), updatedAt: new Date() } as Project;
    const repository: ProjectRepositoryPort = {
      createProject: vi.fn().mockResolvedValue(createdProject),
      updateProject: vi.fn(),
      createProjectStep: vi.fn<() => Promise<ProjectStep>>(),
    };

    await expect(createProject(projectInput, repository)).resolves.toMatchObject({ id: "project-1" });
    expect(repository.createProject).toHaveBeenCalledWith(expect.objectContaining({ title: "Bench LED Continuity Tester" }));
  });

  it("renumbers steps after sorting", () => {
    expect(normalizeStepOrdering([{ stepNumber: 4 }, { stepNumber: 2 }, { stepNumber: 9 }])).toEqual([
      { stepNumber: 1 },
      { stepNumber: 2 },
      { stepNumber: 3 },
    ]);
  });

  it("sanitizes project update input and strips script tags from rich text fields", () => {
    const update = prepareProjectUpdate({
      id: "project-1",
      title: "  Motion Detection Beeper  ",
      slug: "motion-detection-beeper",
      projectStory: "<script>alert('xss')</script>Used a PIR sensor on GPIO 13.",
    });

    expect(update.title).toBe("Motion Detection Beeper");
    expect(update.slug).toBe("motion-detection-beeper");
    expect(update.projectStory).not.toContain("script");
    expect(update.projectStory).toContain("Used a PIR sensor on GPIO 13.");
  });

  it("rejects an invalid slug format in the update schema", () => {
    expect(() =>
      projectUpdateSchema.parse({ id: "project-1", slug: "Has Spaces & Symbols!" }),
    ).toThrow(ZodError);
  });
});
