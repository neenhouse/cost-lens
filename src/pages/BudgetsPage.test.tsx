import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BudgetsPage from "./BudgetsPage";

describe("BudgetsPage", () => {
  it("renders the page title", () => {
    render(
      <MemoryRouter>
        <BudgetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Budget Alerts")).toBeInTheDocument();
  });

  it("shows budget summary cards", () => {
    render(
      <MemoryRouter>
        <BudgetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Total Budgets")).toBeInTheDocument();
    expect(screen.getByText("On Track")).toBeInTheDocument();
    expect(screen.getByText("At Risk")).toBeInTheDocument();
    expect(screen.getByText("Over Budget")).toBeInTheDocument();
  });

  it("renders individual budget cards with progress bars", () => {
    render(
      <MemoryRouter>
        <BudgetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Overall Cloud Budget")).toBeInTheDocument();
    expect(screen.getByText("Platform Team")).toBeInTheDocument();
    expect(screen.getByText("Data Team")).toBeInTheDocument();
  });

  it("shows burn rate information", () => {
    render(
      <MemoryRouter>
        <BudgetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Burn Rate/)).toBeInTheDocument();
  });

  it("has export CSV button", () => {
    render(
      <MemoryRouter>
        <BudgetsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });
});
