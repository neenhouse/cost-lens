/** Supported cloud providers */
export type CloudProvider = "aws" | "gcp" | "azure";

/** Normalized cost line item -- unified schema across all providers */
export interface CostLineItem {
  date: string; // ISO date (YYYY-MM-DD)
  service: string;
  resourceId: string;
  region: string;
  team: string; // from tags or manual mapping, empty if unattributed
  usageQuantity: number;
  usageUnit: string;
  costUsd: number;
}

/** Parsed billing data with metadata */
export interface BillingData {
  provider: CloudProvider;
  lineItems: CostLineItem[];
  dateRange: { start: string; end: string };
  totalCostUsd: number;
  rowCount: number;
  parsedAt: string; // ISO timestamp
}

/** Waste category types */
export type WasteCategory =
  | "idle-compute"
  | "unattached-storage"
  | "unused-ip"
  | "old-snapshot"
  | "unused-load-balancer";

/** Detected waste item */
export interface WasteItem {
  resourceId: string;
  service: string;
  region: string;
  monthlyCostUsd: number;
  category: WasteCategory;
  description: string;
}

/** Optimization recommendation */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  affectedResources: string[];
  monthlySavingsUsd: number;
  effortLevel: "low" | "medium" | "high";
  confidence: number; // 0-1
  priorityScore: number;
  status: "pending" | "accepted" | "dismissed" | "in-progress";
  category: "right-sizing" | "storage-tier" | "region-arbitrage" | "consolidation";
}

/** Team cost attribution */
export interface TeamAttribution {
  team: string;
  totalCostUsd: number;
  services: { service: string; costUsd: number }[];
  monthOverMonth: { month: string; costUsd: number }[];
}

/** Reserved instance recommendation */
export interface RIRecommendation {
  instanceType: string;
  region: string;
  currentMonthlyCostUsd: number;
  term: "1-year" | "3-year";
  paymentOption: "no-upfront" | "partial-upfront" | "all-upfront";
  monthlySavingsUsd: number;
  breakEvenMonth: number;
  annualSavingsUsd: number;
}

/** Monthly forecast */
export interface Forecast {
  month: string; // YYYY-MM
  predictedCostUsd: number;
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
  isAnomaly?: boolean;
}

/** Budget definition */
export interface Budget {
  id: string;
  name: string;
  amountUsd: number;
  scope: "overall" | string; // "overall" or team name
  thresholds: number[]; // e.g., [0.5, 0.8, 1.0]
  currentSpendUsd: number;
  projectedSpendUsd: number;
  status: "on-track" | "at-risk" | "over-budget";
  createdAt: string;
}
