import { describe, it, expect } from "vitest";
import {
  MOCK_BILLING_DATA,
  MOCK_WASTE_ITEMS,
  MOCK_TOTAL_WASTE,
  MOCK_RECOMMENDATIONS,
  MOCK_TOTAL_SAVINGS,
  MOCK_TEAM_ATTRIBUTION,
  MOCK_RI_RECOMMENDATIONS,
  MOCK_FORECAST,
  MOCK_BUDGETS,
} from "./mock-data";

describe("Mock Billing Data", () => {
  it("generates billing data with ~$50K/month across 8 services", () => {
    const months = new Set(MOCK_BILLING_DATA.lineItems.map((i) => i.date.slice(0, 7)));
    expect(months.size).toBe(6);

    const services = new Set(MOCK_BILLING_DATA.lineItems.map((i) => i.service));
    expect(services.size).toBe(8);

    // Average monthly should be roughly $50K (within a wide band due to randomness)
    const avgMonthly = MOCK_BILLING_DATA.totalCostUsd / 6;
    expect(avgMonthly).toBeGreaterThan(20000);
    expect(avgMonthly).toBeLessThan(120000);
  });

  it("has correct total matching sum of line items", () => {
    const summed = MOCK_BILLING_DATA.lineItems.reduce((s, i) => s + i.costUsd, 0);
    expect(Math.abs(MOCK_BILLING_DATA.totalCostUsd - summed)).toBeLessThan(1);
  });
});

describe("Waste Detection", () => {
  it("identifies at least 5 waste categories", () => {
    const categories = new Set(MOCK_WASTE_ITEMS.map((w) => w.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });

  it("waste total matches sum of items", () => {
    const sum = MOCK_WASTE_ITEMS.reduce((s, w) => s + w.monthlyCostUsd, 0);
    expect(MOCK_TOTAL_WASTE).toBeCloseTo(sum, 2);
  });

  it("each waste item has resource ID, cost, and category", () => {
    for (const w of MOCK_WASTE_ITEMS) {
      expect(w.resourceId).toBeTruthy();
      expect(w.monthlyCostUsd).toBeGreaterThan(0);
      expect(w.category).toBeTruthy();
    }
  });
});

describe("Optimization Recommendations", () => {
  it("provides at least 4 recommendation categories", () => {
    const cats = new Set(MOCK_RECOMMENDATIONS.map((r) => r.category));
    expect(cats.size).toBeGreaterThanOrEqual(4);
  });

  it("sorts by priority score descending", () => {
    for (let i = 1; i < MOCK_RECOMMENDATIONS.length; i++) {
      expect(MOCK_RECOMMENDATIONS[i - 1].priorityScore).toBeGreaterThanOrEqual(
        MOCK_RECOMMENDATIONS[i].priorityScore
      );
    }
  });

  it("priority score follows (savings * confidence) / effort formula", () => {
    const effortMap = { low: 1, medium: 2, high: 3 };
    for (const r of MOCK_RECOMMENDATIONS) {
      const expected =
        Math.round(
          ((r.monthlySavingsUsd * r.confidence) / effortMap[r.effortLevel]) * 100
        ) / 100;
      expect(r.priorityScore).toBeCloseTo(expected, 1);
    }
  });

  it("total savings matches sum", () => {
    const sum = MOCK_RECOMMENDATIONS.reduce((s, r) => s + r.monthlySavingsUsd, 0);
    expect(MOCK_TOTAL_SAVINGS).toBe(sum);
  });
});

describe("Team Attribution", () => {
  it("covers all 5 teams", () => {
    expect(MOCK_TEAM_ATTRIBUTION.length).toBe(5);
  });

  it("team totals roughly match overall spend", () => {
    const teamTotal = MOCK_TEAM_ATTRIBUTION.reduce((s, t) => s + t.totalCostUsd, 0);
    // Should be close to billing total (some rounding)
    expect(Math.abs(teamTotal - MOCK_BILLING_DATA.totalCostUsd)).toBeLessThan(10);
  });
});

describe("Reserved Instance Planner", () => {
  it("has recommendations with savings greater than zero", () => {
    for (const ri of MOCK_RI_RECOMMENDATIONS) {
      expect(ri.monthlySavingsUsd).toBeGreaterThan(0);
      expect(ri.annualSavingsUsd).toBe(ri.monthlySavingsUsd * 12);
    }
  });
});

describe("Forecast Model", () => {
  it("has 6 historical and 6 projected months", () => {
    const historical = MOCK_FORECAST.filter(
      (f) => f.confidenceIntervalLow === f.confidenceIntervalHigh
    );
    const projected = MOCK_FORECAST.filter(
      (f) => f.confidenceIntervalLow !== f.confidenceIntervalHigh
    );
    expect(historical.length).toBe(6);
    expect(projected.length).toBe(6);
  });

  it("projected months have wider confidence intervals", () => {
    const projected = MOCK_FORECAST.filter(
      (f) => f.confidenceIntervalLow !== f.confidenceIntervalHigh
    );
    for (const f of projected) {
      expect(f.confidenceIntervalHigh).toBeGreaterThan(f.predictedCostUsd);
      expect(f.confidenceIntervalLow).toBeLessThan(f.predictedCostUsd);
    }
  });
});

describe("Budget Alerts", () => {
  it("has correct status for each budget", () => {
    for (const b of MOCK_BUDGETS) {
      if (b.status === "over-budget") {
        expect(b.currentSpendUsd).toBeGreaterThan(b.amountUsd);
      }
      if (b.status === "on-track") {
        expect(b.currentSpendUsd / b.amountUsd).toBeLessThan(0.8);
      }
    }
  });

  it("has thresholds at 50%, 80%, and 100%", () => {
    for (const b of MOCK_BUDGETS) {
      expect(b.thresholds).toEqual([0.5, 0.8, 1.0]);
    }
  });
});
