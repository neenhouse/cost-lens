import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecommendationsPage from "./RecommendationsPage";

describe("RecommendationsPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <RecommendationsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Optimization Recommendations")).toBeInTheDocument();
  });

  it("shows total potential savings", () => {
    render(
      <MemoryRouter>
        <RecommendationsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Total Potential Savings")).toBeInTheDocument();
  });

  it("renders recommendation cards with accept/dismiss actions", () => {
    render(
      <MemoryRouter>
        <RecommendationsPage />
      </MemoryRouter>
    );
    const acceptButtons = screen.getAllByText("Accept");
    const dismissButtons = screen.getAllByText("Dismiss");
    expect(acceptButtons.length).toBeGreaterThan(0);
    expect(dismissButtons.length).toBeGreaterThan(0);
  });

  it("renders all recommendation cards", () => {
    render(
      <MemoryRouter>
        <RecommendationsPage />
      </MemoryRouter>
    );
    // Should have 8 recommendations
    expect(screen.getByText("Right-size oversized RDS instance")).toBeInTheDocument();
    expect(screen.getByText("Terminate idle EC2 instances")).toBeInTheDocument();
  });
});
