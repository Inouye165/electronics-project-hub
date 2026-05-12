import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectDetailView } from "@/components/projects/project-detail-view";

const project = {
  title: "Bench LED Continuity Tester",
  shortDescription: "A compact tester for checking wiring while working at the bench.",
  status: "building" as const,
  difficulty: "beginner" as const,
  createdAt: new Date("2026-05-01T00:00:00Z"),
  updatedAt: new Date("2026-05-12T00:00:00Z"),
  projectGoal: "Make continuity checks faster during small electronics builds.",
  whyBuilt: "The multimeter was useful but slow to reset during hands-on wiring.",
  problemSolved: "It gives a visible answer when a switch, wire, or solder joint is connected.",
  projectStory: "Started after tracing a bad solder joint and wanting a dedicated bench tool.",
  partsSummary: "LED, resistor, battery holder, switch, probe wire, and enclosure.",
  lessonsLearned: "Simple tools are easier to trust when the current path is obvious.",
  mistakesProblems: "The first resistor value made the LED too dim.",
  fixesSolutions: "Compared resistor values and chose a brighter LED.",
  safetyNotes: "Use only on unpowered circuits.",
  futureTutorialNotes: "Show the current path with a simple diagram.",
  nextSteps: "Install the final parts in the enclosure.",
  steps: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Prove the circuit on a breadboard",
      simpleExplanation: "The LED lights when the probes touch through a connected path.",
      partsToolsNeeded: "Breadboard, LED, resistor, and battery holder.",
      whatIDid: "Built the circuit in series.",
      whatWentWrong: "The LED was too dim.",
      howIFixedIt: "Compared resistor values.",
      grandkidFriendlyExplanation: "A complete loop lets the light turn on.",
      futureTutorialNotes: "Film the breadboard from above.",
      safetyNotes: "Keep it away from powered projects.",
    },
  ],
  parts: [{ id: "part-1", name: "Red LED", quantity: 1, role: "Indicator" }],
  files: [],
  images: [],
};

describe("ProjectDetailView", () => {
  it("renders the project story, steps, and tutorial notes", () => {
    render(<ProjectDetailView project={project} />);

    expect(screen.getByRole("heading", { name: "Bench LED Continuity Tester" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Build steps" })).toBeInTheDocument();
    expect(screen.getByText("A complete loop lets the light turn on.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Future tutorial notes" })).toBeInTheDocument();
  });
});
