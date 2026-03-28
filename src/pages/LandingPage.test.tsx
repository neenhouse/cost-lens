import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  it("renders the hero headline", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Stop overpaying/i)).toBeInTheDocument();
    expect(screen.getByText(/for cloud/i)).toBeInTheDocument();
  });

  it("renders all 7 feature cards", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Billing Data Upload")).toBeInTheDocument();
    expect(screen.getByText("Waste Detection")).toBeInTheDocument();
    expect(screen.getByText("Optimization Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Team Cost Attribution")).toBeInTheDocument();
    expect(screen.getByText("Reserved Instance Planner")).toBeInTheDocument();
    expect(screen.getByText("Monthly Forecast")).toBeInTheDocument();
    expect(screen.getByText("Budget Alerts")).toBeInTheDocument();
  });

  it("has Upload Billing Data CTA that links to /upload", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const cta = screen.getByText("Upload Billing Data");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")).toHaveAttribute("href", "/upload");
  });

  it("renders the how-it-works steps", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Analyze")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows privacy-by-design footer", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/billing data never leaves your browser/i)
    ).toBeInTheDocument();
  });
});
