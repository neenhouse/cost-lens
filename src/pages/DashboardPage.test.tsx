import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the dashboard heading", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Cost Intelligence Dashboard")).toBeInTheDocument();
  });

  it("displays all 6 metric cards", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Monthly Waste")).toBeInTheDocument();
    expect(screen.getByText("Potential Savings")).toBeInTheDocument();
    expect(screen.getByText("Total 6-Mo Spend")).toBeInTheDocument();
    expect(screen.getByText("Next Month Forecast")).toBeInTheDocument();
    expect(screen.getByText("RI Coverage")).toBeInTheDocument();
    expect(screen.getByText("Budget Status")).toBeInTheDocument();
  });

  it("shows quick action links", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    const wasteLink = screen.getByText(/View Waste Details/);
    expect(wasteLink).toBeInTheDocument();
    expect(wasteLink.closest("a")).toHaveAttribute("href", "/waste");
  });
});
