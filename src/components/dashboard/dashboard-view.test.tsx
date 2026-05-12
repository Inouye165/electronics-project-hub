import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardView } from "@/components/dashboard/dashboard-view";

describe("DashboardView", () => {
  it("makes Projects the primary gateway and shows recent work", () => {
    render(
      <DashboardView
        projects={[
          {
            title: "Bench LED Continuity Tester",
            slug: "bench-led-continuity-tester",
            shortDescription: "A compact tester for checking wiring while working at the bench.",
            status: "building",
            difficulty: "beginner",
            updatedAt: new Date("2026-05-12T00:00:00Z"),
            steps: [{ id: "step-1" }],
          },
        ]}
        statusSummary={[{ status: "building", count: 1 }]}
      />,
    );

    expect(screen.getByRole("link", { name: /open projects/i })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: /continue latest/i })).toHaveAttribute("href", "/projects/bench-led-continuity-tester");
    expect(screen.getByText("Bench LED Continuity Tester")).toBeInTheDocument();
  });
});
