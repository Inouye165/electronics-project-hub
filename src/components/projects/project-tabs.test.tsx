import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProjectTabs } from "@/components/projects/project-tabs";

const project = {
  slug: "motion-detection-beeper",
  projectGoal: "Detect motion and trigger an audible beep.",
  whyBuilt: "To learn how to read a digital sensor on an ESP32.",
  problemSolved: "Alerts when someone enters a room.",
  projectStory: "Started on a breadboard with an HC-SR501 PIR sensor.",
  partsSummary: "ESP32, PIR sensor, buzzer, resistor, breadboard.",
  lessonsLearned: "PIR sensors need 30-60 seconds to warm up.",
  mistakesProblems: "Wired the buzzer directly without a resistor at first.",
  fixesSolutions: "Added a 100 ohm current-limiting resistor.",
  safetyNotes: "Keep power limited to 5V.",
  futureTutorialNotes: "Great beginner tutorial candidate.",
  nextSteps: "Add an LED indicator and Wi-Fi notification.",
  steps: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Gather parts",
      simpleExplanation: "Collect all the components before starting.",
      partsToolsNeeded: "ESP32, PIR sensor, buzzer.",
      whatIDid: "Laid out all parts on the bench.",
      whatWentWrong: "",
      howIFixedIt: "",
      grandkidFriendlyExplanation: "Get everything ready before you start building.",
      futureTutorialNotes: "",
      safetyNotes: "",
    },
  ],
  parts: [{ id: "part-1", name: "HC-SR501 PIR sensor", quantity: 1, role: "Motion detector" }],
  files: [],
  images: [],
};

describe("ProjectTabs", () => {
  it("shows the Overview tab content by default", () => {
    render(<ProjectTabs project={project} createdAt="May 1, 2026" updatedAt="May 12, 2026" />);

    // Overview tab content is visible
    expect(screen.getByRole("heading", { name: "The story" })).toBeInTheDocument();
    expect(
      screen.getByText("Started on a breadboard with an HC-SR501 PIR sensor."),
    ).toBeInTheDocument();
  });

  it("renders placeholder text for unfilled journal fields", () => {
    const sparseProject = { ...project, projectGoal: "—", whyBuilt: "—" };
    render(<ProjectTabs project={sparseProject} createdAt="May 1, 2026" updatedAt="May 12, 2026" />);

    expect(
      screen.getAllByText("Not yet filled in — use Edit project to add this.").length,
    ).toBeGreaterThan(0);
  });

  it("switches to Build Log tab when the button is clicked", async () => {
    render(<ProjectTabs project={project} createdAt="May 1, 2026" updatedAt="May 12, 2026" />);

    await userEvent.click(screen.getByRole("button", { name: "Build Log" }));

    expect(screen.getByRole("button", { name: "Build Log" })).toHaveClass("active");
  });

  it("shows parts in the Parts tab", () => {
    render(<ProjectTabs project={project} createdAt="May 1, 2026" updatedAt="May 12, 2026" />);

    // Parts tab content is in the DOM (CSS hide not applied in jsdom)
    expect(screen.getByText("HC-SR501 PIR sensor")).toBeInTheDocument();
  });
});
