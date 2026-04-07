import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForecastPage from "./ForecastPage";

describe("ForecastPage", () => {
  it("renders the page heading", () => {
    render(
      <MemoryRouter>
        <ForecastPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Forecast Model")).toBeInTheDocument();
  });

  it("renders the three summary cards", () => {
    render(
      <MemoryRouter>
        <ForecastPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Next Month Forecast")).toBeInTheDocument();
    expect(screen.getByText("6-Month Projected Total")).toBeInTheDocument();
    expect(screen.getByText("Confidence Range (Next Mo)")).toBeInTheDocument();
  });

  it("renders the monthly detail table", () => {
    render(
      <MemoryRouter>
        <ForecastPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Monthly Detail")).toBeInTheDocument();
    expect(screen.getByText("Predicted Spend")).toBeInTheDocument();
  });

  it("shows actual and forecast badges in the table", () => {
    render(
      <MemoryRouter>
        <ForecastPage />
      </MemoryRouter>
    );
    const actualBadges = screen.getAllByText("Actual");
    const forecastBadges = screen.getAllByText("Forecast");
    expect(actualBadges.length).toBeGreaterThan(0);
    expect(forecastBadges.length).toBeGreaterThan(0);
  });
});
