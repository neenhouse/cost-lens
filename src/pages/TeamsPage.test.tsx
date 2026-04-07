import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamsPage from "./TeamsPage";

describe("TeamsPage", () => {
  it("renders the page heading", () => {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Team Cost Attribution")).toBeInTheDocument();
  });

  it("renders the summary cards", () => {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Total 6-Month Spend")).toBeInTheDocument();
    expect(screen.getByText("Highest Spend Team")).toBeInTheDocument();
  });

  it("renders the cost distribution chart section", () => {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Cost Distribution")).toBeInTheDocument();
  });

  it("renders the team breakdown table", () => {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Team Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Total Cost")).toBeInTheDocument();
    expect(screen.getByText("Top Service")).toBeInTheDocument();
  });

  it("renders export CSV button", () => {
    render(
      <MemoryRouter>
        <TeamsPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });
});
