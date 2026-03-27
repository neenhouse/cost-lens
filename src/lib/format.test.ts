import { describe, it, expect } from "vitest";
import { formatUsd, formatPercent, formatMonth } from "./format";

describe("formatUsd", () => {
  it("formats whole numbers without decimals", () => {
    expect(formatUsd(1000)).toBe("$1,000");
  });

  it("formats decimal amounts", () => {
    expect(formatUsd(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatUsd(0)).toBe("$0");
  });
});

describe("formatPercent", () => {
  it("formats a decimal as percentage", () => {
    expect(formatPercent(0.425)).toBe("42.5%");
  });

  it("formats with custom decimals", () => {
    expect(formatPercent(0.8, 0)).toBe("80%");
  });
});

describe("formatMonth", () => {
  it("formats ISO date as month year", () => {
    expect(formatMonth("2025-01-15")).toBe("Jan 2025");
  });
});
