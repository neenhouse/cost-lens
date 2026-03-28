import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WastePage from "./WastePage";

describe("WastePage", () => {
  it("renders waste summary with total waste amount", () => {
    render(
      <MemoryRouter>
        <WastePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Total Monthly Waste")).toBeInTheDocument();
    expect(screen.getByText("Waste Items")).toBeInTheDocument();
  });

  it("renders waste items in the table", () => {
    render(
      <MemoryRouter>
        <WastePage />
      </MemoryRouter>
    );
    // Check for at least one known resource ID
    expect(screen.getByText("ec2-useast-idle01")).toBeInTheDocument();
    expect(screen.getByText("ebs-useast-unat01")).toBeInTheDocument();
  });

  it("shows all 5 waste categories", () => {
    render(
      <MemoryRouter>
        <WastePage />
      </MemoryRouter>
    );
    expect(screen.getAllByText("Idle Compute").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Unattached Storage").length).toBeGreaterThan(0);
  });

  it("has Export CSV button", () => {
    render(
      <MemoryRouter>
        <WastePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });
});
