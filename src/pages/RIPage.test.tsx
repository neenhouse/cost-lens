import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RIPage from "./RIPage";

describe("RIPage", () => {
  it("renders the page heading", () => {
    render(
      <MemoryRouter>
        <RIPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Reserved Instance Planner")).toBeInTheDocument();
  });

  it("renders the summary cards", () => {
    render(
      <MemoryRouter>
        <RIPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Potential Annual Savings")).toBeInTheDocument();
    expect(screen.getAllByText("Monthly Savings").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Current RI Coverage")).toBeInTheDocument();
  });

  it("renders the coverage analysis section", () => {
    render(
      <MemoryRouter>
        <RIPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Coverage Analysis")).toBeInTheDocument();
  });

  it("renders term and payment filter selects", () => {
    render(
      <MemoryRouter>
        <RIPage />
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue("All Terms")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All Payment Options")).toBeInTheDocument();
  });

  it("renders the RI recommendations table", () => {
    render(
      <MemoryRouter>
        <RIPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Instance Type")).toBeInTheDocument();
    expect(screen.getByText("Annual Savings")).toBeInTheDocument();
    expect(screen.getByText("Break-Even")).toBeInTheDocument();
  });
});
