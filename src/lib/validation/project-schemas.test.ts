import { describe, expect, it } from "vitest";

import { projectInputSchema, projectStepInputSchema } from "@/lib/validation/project-schemas";

const validProject = {
  title: "Bench LED Continuity Tester",
  slug: "bench-led-continuity-tester",
  shortDescription: "A compact tester for checking wiring while working at the bench.",
  projectGoal: "Make continuity checks faster during small electronics builds.",
  whyBuilt: "The multimeter was useful but slow to reset during hands-on wiring.",
  problemSolved: "It gives a visible answer when a switch, wire, or solder joint is connected.",
  status: "building",
  difficulty: "beginner",
  projectStory: "Started after tracing a bad solder joint and wanting a dedicated bench tool.",
  partsSummary: "LED, resistor, battery holder, switch, probe wire, and enclosure.",
  lessonsLearned: "Simple tools are easier to trust when the current path is obvious.",
  mistakesProblems: "The first resistor value made the LED too dim.",
  fixesSolutions: "Compared resistor values and chose a brighter LED.",
  safetyNotes: "Use only on unpowered circuits.",
  futureTutorialNotes: "Show the current path with a simple diagram.",
  nextSteps: "Install the final parts in the enclosure.",
} as const;

describe("projectInputSchema", () => {
  it("accepts a complete project journal payload", () => {
    expect(projectInputSchema.parse(validProject).slug).toBe("bench-led-continuity-tester");
  });

  it("rejects slugs that would create unstable URLs", () => {
    expect(() => projectInputSchema.parse({ ...validProject, slug: "Bench LED Tester" })).toThrow();
  });
});

describe("projectStepInputSchema", () => {
  it("requires positive step numbers", () => {
    expect(() =>
      projectStepInputSchema.parse({
        projectId: "project-1",
        stepNumber: 0,
        title: "Breadboard the tester",
        simpleExplanation: "The LED turns on when the probes complete the circuit.",
        partsToolsNeeded: "Breadboard, LED, resistor, battery holder, and jumper wires.",
        whatIDid: "Built the circuit in series and checked it with temporary probes.",
        grandkidFriendlyExplanation: "A complete loop lets the light turn on.",
      }),
    ).toThrow();
  });
});
