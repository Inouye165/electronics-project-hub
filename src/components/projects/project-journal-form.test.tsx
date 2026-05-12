import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The form imports the server action — mock it so tests run in a browser-like env
vi.mock("@/app/projects/[slug]/edit/actions", () => ({
  updateProjectAction: vi.fn(),
}));

import { ProjectJournalForm } from "@/components/projects/project-journal-form";

const project = {
  id: "project-abc",
  slug: "motion-detection-beeper",
  title: "Motion Detection Beeper",
  shortDescription: "An ESP32-based motion sensor that beeps whenever movement is detected.",
  status: "idea" as const,
  difficulty: "beginner" as const,
  projectGoal: "Detect motion and trigger an audible beep.",
  whyBuilt: "To learn how to read a digital sensor on an ESP32.",
  problemSolved: "Alerts when someone enters a room.",
  projectStory: "Started on a breadboard with an HC-SR501 PIR sensor.",
  partsSummary: "ESP32, PIR sensor, buzzer, resistor, breadboard.",
  lessonsLearned: "PIR sensors need 30-60 seconds to warm up.",
  mistakesProblems: "Wired the buzzer directly without a resistor at first.",
  fixesSolutions: "Added a 100 ohm current-limiting resistor.",
  safetyNotes: "Keep power limited to 5V; use a transistor for higher loads.",
  futureTutorialNotes: "Great beginner tutorial candidate — under 20 lines of code.",
  nextSteps: "Add an LED indicator and Wi-Fi notification.",
};

describe("ProjectJournalForm", () => {
  it("pre-fills form fields with existing project values", () => {
    render(<ProjectJournalForm project={project} />);

    // Text inputs — matched by label
    expect(screen.getByLabelText("Title")).toHaveValue("Motion Detection Beeper");
    // Slug label contains additional text; use a partial match
    expect(screen.getByRole("textbox", { name: /^Slug/i })).toHaveValue("motion-detection-beeper");
    expect(
      screen.getByDisplayValue(
        "An ESP32-based motion sensor that beeps whenever movement is detected.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Detect motion and trigger an audible beep."),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Started on a breadboard with an HC-SR501 PIR sensor."),
    ).toBeInTheDocument();
  });

  it("renders a Cancel link pointing back to the project detail page", () => {
    render(<ProjectJournalForm project={project} />);

    const cancelLink = screen.getByRole("link", { name: "Cancel" });
    expect(cancelLink).toHaveAttribute("href", "/projects/motion-detection-beeper");
  });

  it("renders a Save changes submit button", () => {
    render(<ProjectJournalForm project={project} />);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
