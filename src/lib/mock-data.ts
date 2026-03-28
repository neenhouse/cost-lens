/**
 * Realistic mock billing data: ~$50K/month across 8 services, 5 teams, 6 months.
 */
import type {
  BillingData,
  CostLineItem,
  WasteItem,
  Recommendation,
  TeamAttribution,
  RIRecommendation,
  Forecast,
  Budget,
} from "../types/billing";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function id() {
  return Math.random().toString(36).slice(2, 10);
}

const SERVICES = [
  "EC2",
  "S3",
  "RDS",
  "Lambda",
  "EBS",
  "CloudFront",
  "ELB",
  "ElastiCache",
] as const;

const REGIONS = [
  "us-east-1",
  "us-west-2",
  "eu-west-1",
  "ap-southeast-1",
] as const;

const TEAMS = ["Platform", "Data", "ML", "Backend", "Frontend"] as const;

// Monthly cost per service (sums roughly to $50K)
const SERVICE_MONTHLY_COST: Record<string, number> = {
  EC2: 18_500,
  S3: 4_200,
  RDS: 9_800,
  Lambda: 2_100,
  EBS: 3_600,
  CloudFront: 5_300,
  ELB: 3_200,
  ElastiCache: 3_300,
};

// ---------------------------------------------------------------------------
// Generate 6 months of line items
// ---------------------------------------------------------------------------
function generateLineItems(): CostLineItem[] {
  const items: CostLineItem[] = [];
  const months = [
    "2025-10",
    "2025-11",
    "2025-12",
    "2026-01",
    "2026-02",
    "2026-03",
  ];

  for (const month of months) {
    for (const service of SERVICES) {
      // Each service produces 3-5 line items per month across teams/regions
      const numItems = 3 + Math.floor(Math.random() * 3);
      const baseCost = SERVICE_MONTHLY_COST[service];
      const growthMultiplier = 1 + months.indexOf(month) * 0.03; // 3% MoM growth

      for (let i = 0; i < numItems; i++) {
        const team = TEAMS[Math.floor(Math.random() * TEAMS.length)];
        const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
        const fraction = (0.5 + Math.random()) / numItems;
        const cost =
          Math.round(baseCost * fraction * growthMultiplier * 100) / 100;

        items.push({
          date: `${month}-${String(10 + Math.floor(Math.random() * 18)).padStart(2, "0")}`,
          service,
          resourceId: `${service.toLowerCase()}-${region.split("-").slice(0, 2).join("")}-${id()}`,
          region,
          team,
          usageQuantity: Math.round(100 + Math.random() * 5000),
          usageUnit: service === "Lambda" ? "invocations" : "hours",
          costUsd: cost,
        });
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Billing data
// ---------------------------------------------------------------------------
const lineItems = generateLineItems();

export const MOCK_BILLING_DATA: BillingData = {
  provider: "aws",
  lineItems,
  dateRange: { start: "2025-10-01", end: "2026-03-31" },
  totalCostUsd: Math.round(lineItems.reduce((s, i) => s + i.costUsd, 0) * 100) / 100,
  rowCount: lineItems.length,
  parsedAt: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Waste items
// ---------------------------------------------------------------------------
export const MOCK_WASTE_ITEMS: WasteItem[] = [
  {
    resourceId: "ec2-useast-idle01",
    service: "EC2",
    region: "us-east-1",
    monthlyCostUsd: 438,
    category: "idle-compute",
    description: "Instance running at <2% CPU for 30+ days",
  },
  {
    resourceId: "ec2-uswest-idle02",
    service: "EC2",
    region: "us-west-2",
    monthlyCostUsd: 612,
    category: "idle-compute",
    description: "Instance with no network traffic for 14 days",
  },
  {
    resourceId: "ec2-euwest-idle03",
    service: "EC2",
    region: "eu-west-1",
    monthlyCostUsd: 285,
    category: "idle-compute",
    description: "Staging instance running 24/7, zero traffic",
  },
  {
    resourceId: "ebs-useast-unat01",
    service: "EBS",
    region: "us-east-1",
    monthlyCostUsd: 230,
    category: "unattached-storage",
    description: "500 GB gp3 volume not attached to any instance",
  },
  {
    resourceId: "ebs-uswest-unat02",
    service: "EBS",
    region: "us-west-2",
    monthlyCostUsd: 184,
    category: "unattached-storage",
    description: "400 GB gp2 volume, detached 45 days ago",
  },
  {
    resourceId: "eip-useast-unused01",
    service: "EC2",
    region: "us-east-1",
    monthlyCostUsd: 7.2,
    category: "unused-ip",
    description: "Elastic IP not associated with a running instance",
  },
  {
    resourceId: "snap-useast-old01",
    service: "EBS",
    region: "us-east-1",
    monthlyCostUsd: 45,
    category: "old-snapshot",
    description: "EBS snapshot 180 days old, no AMI reference",
  },
  {
    resourceId: "snap-uswest-old02",
    service: "EBS",
    region: "us-west-2",
    monthlyCostUsd: 32,
    category: "old-snapshot",
    description: "EBS snapshot 120 days old, superseded by newer version",
  },
  {
    resourceId: "elb-useast-unused01",
    service: "ELB",
    region: "us-east-1",
    monthlyCostUsd: 162,
    category: "unused-load-balancer",
    description: "ALB with zero target group registrations",
  },
  {
    resourceId: "elb-euwest-unused02",
    service: "ELB",
    region: "eu-west-1",
    monthlyCostUsd: 162,
    category: "unused-load-balancer",
    description: "NLB with no healthy targets for 21 days",
  },
  {
    resourceId: "rds-useast-oversized01",
    service: "RDS",
    region: "us-east-1",
    monthlyCostUsd: 820,
    category: "idle-compute",
    description: "db.r5.2xlarge at 8% avg CPU -- consider db.r5.large",
  },
  {
    resourceId: "rds-uswest-oversized02",
    service: "RDS",
    region: "us-west-2",
    monthlyCostUsd: 650,
    category: "idle-compute",
    description: "db.m5.xlarge read replica with zero connections",
  },
];

export const MOCK_TOTAL_WASTE = MOCK_WASTE_ITEMS.reduce(
  (s, w) => s + w.monthlyCostUsd,
  0
);

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    title: "Right-size oversized RDS instance",
    description:
      "rds-useast-oversized01 is running db.r5.2xlarge at 8% CPU. Downgrade to db.r5.large to save $615/mo with no performance impact.",
    affectedResources: ["rds-useast-oversized01"],
    monthlySavingsUsd: 615,
    effortLevel: "low",
    confidence: 0.92,
    priorityScore: 0,
    status: "pending",
    category: "right-sizing",
  },
  {
    id: "rec-2",
    title: "Terminate idle EC2 instances",
    description:
      "3 EC2 instances have been idle for 14-30+ days. Terminate or schedule auto-stop to recover $1,335/mo.",
    affectedResources: [
      "ec2-useast-idle01",
      "ec2-uswest-idle02",
      "ec2-euwest-idle03",
    ],
    monthlySavingsUsd: 1335,
    effortLevel: "low",
    confidence: 0.95,
    priorityScore: 0,
    status: "pending",
    category: "consolidation",
  },
  {
    id: "rec-3",
    title: "Move infrequent S3 data to Glacier",
    description:
      "42% of S3 objects haven't been accessed in 90+ days. Moving to S3 Glacier Instant Retrieval saves ~$180/mo.",
    affectedResources: ["s3-useast-data-lake"],
    monthlySavingsUsd: 180,
    effortLevel: "medium",
    confidence: 0.8,
    priorityScore: 0,
    status: "pending",
    category: "storage-tier",
  },
  {
    id: "rec-4",
    title: "Delete unattached EBS volumes",
    description:
      "2 EBS volumes totaling 900 GB are not attached to any instance. Delete to save $414/mo.",
    affectedResources: ["ebs-useast-unat01", "ebs-uswest-unat02"],
    monthlySavingsUsd: 414,
    effortLevel: "low",
    confidence: 0.98,
    priorityScore: 0,
    status: "pending",
    category: "consolidation",
  },
  {
    id: "rec-5",
    title: "Move CloudFront to us-west-2 origin",
    description:
      "Switching primary CloudFront origin from eu-west-1 to us-west-2 reduces cross-region transfer, saving ~$320/mo.",
    affectedResources: ["cloudfront-dist-main"],
    monthlySavingsUsd: 320,
    effortLevel: "high",
    confidence: 0.7,
    priorityScore: 0,
    status: "pending",
    category: "region-arbitrage",
  },
  {
    id: "rec-6",
    title: "Right-size ElastiCache cluster",
    description:
      "ElastiCache cluster is at 15% memory utilization. Downgrade from cache.r6g.xlarge to cache.r6g.large.",
    affectedResources: ["elasticache-prod-01"],
    monthlySavingsUsd: 245,
    effortLevel: "medium",
    confidence: 0.85,
    priorityScore: 0,
    status: "pending",
    category: "right-sizing",
  },
  {
    id: "rec-7",
    title: "Consolidate underused RDS read replicas",
    description:
      "Read replica rds-uswest-oversized02 has zero connections. Remove it and route reads to primary.",
    affectedResources: ["rds-uswest-oversized02"],
    monthlySavingsUsd: 650,
    effortLevel: "medium",
    confidence: 0.88,
    priorityScore: 0,
    status: "pending",
    category: "consolidation",
  },
  {
    id: "rec-8",
    title: "Clean up old EBS snapshots",
    description:
      "2 snapshots older than 90 days with no AMI reference. Delete to save $77/mo.",
    affectedResources: ["snap-useast-old01", "snap-uswest-old02"],
    monthlySavingsUsd: 77,
    effortLevel: "low",
    confidence: 0.97,
    priorityScore: 0,
    status: "pending",
    category: "consolidation",
  },
];

// Calculate priority scores: (savings * confidence) / effort
const effortMap = { low: 1, medium: 2, high: 3 };
MOCK_RECOMMENDATIONS.forEach((r) => {
  r.priorityScore =
    Math.round(
      ((r.monthlySavingsUsd * r.confidence) / effortMap[r.effortLevel]) * 100
    ) / 100;
});
MOCK_RECOMMENDATIONS.sort((a, b) => b.priorityScore - a.priorityScore);

export const MOCK_TOTAL_SAVINGS = MOCK_RECOMMENDATIONS.reduce(
  (s, r) => s + r.monthlySavingsUsd,
  0
);

// ---------------------------------------------------------------------------
// Team attribution
// ---------------------------------------------------------------------------
function buildTeamAttribution(): TeamAttribution[] {
  const teams = new Map<
    string,
    {
      totalCostUsd: number;
      services: Map<string, number>;
      months: Map<string, number>;
    }
  >();

  for (const item of lineItems) {
    const t = item.team || "Unattributed";
    if (!teams.has(t)) {
      teams.set(t, {
        totalCostUsd: 0,
        services: new Map(),
        months: new Map(),
      });
    }
    const entry = teams.get(t)!;
    entry.totalCostUsd += item.costUsd;
    entry.services.set(
      item.service,
      (entry.services.get(item.service) || 0) + item.costUsd
    );
    const month = item.date.slice(0, 7);
    entry.months.set(month, (entry.months.get(month) || 0) + item.costUsd);
  }

  return Array.from(teams.entries())
    .map(([team, data]) => ({
      team,
      totalCostUsd: Math.round(data.totalCostUsd * 100) / 100,
      services: Array.from(data.services.entries())
        .map(([service, costUsd]) => ({
          service,
          costUsd: Math.round(costUsd * 100) / 100,
        }))
        .sort((a, b) => b.costUsd - a.costUsd),
      monthOverMonth: Array.from(data.months.entries())
        .map(([month, costUsd]) => ({
          month,
          costUsd: Math.round(costUsd * 100) / 100,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    }))
    .sort((a, b) => b.totalCostUsd - a.totalCostUsd);
}

export const MOCK_TEAM_ATTRIBUTION = buildTeamAttribution();

// ---------------------------------------------------------------------------
// Reserved Instance recommendations
// ---------------------------------------------------------------------------
export const MOCK_RI_RECOMMENDATIONS: RIRecommendation[] = [
  {
    instanceType: "m5.xlarge",
    region: "us-east-1",
    currentMonthlyCostUsd: 2920,
    term: "1-year",
    paymentOption: "no-upfront",
    monthlySavingsUsd: 876,
    breakEvenMonth: 1,
    annualSavingsUsd: 10512,
  },
  {
    instanceType: "m5.xlarge",
    region: "us-east-1",
    currentMonthlyCostUsd: 2920,
    term: "1-year",
    paymentOption: "all-upfront",
    monthlySavingsUsd: 1022,
    breakEvenMonth: 1,
    annualSavingsUsd: 12264,
  },
  {
    instanceType: "m5.xlarge",
    region: "us-east-1",
    currentMonthlyCostUsd: 2920,
    term: "3-year",
    paymentOption: "all-upfront",
    monthlySavingsUsd: 1460,
    breakEvenMonth: 1,
    annualSavingsUsd: 17520,
  },
  {
    instanceType: "r5.2xlarge",
    region: "us-east-1",
    currentMonthlyCostUsd: 4380,
    term: "1-year",
    paymentOption: "no-upfront",
    monthlySavingsUsd: 1314,
    breakEvenMonth: 1,
    annualSavingsUsd: 15768,
  },
  {
    instanceType: "r5.2xlarge",
    region: "us-east-1",
    currentMonthlyCostUsd: 4380,
    term: "1-year",
    paymentOption: "all-upfront",
    monthlySavingsUsd: 1533,
    breakEvenMonth: 1,
    annualSavingsUsd: 18396,
  },
  {
    instanceType: "c5.large",
    region: "us-west-2",
    currentMonthlyCostUsd: 1460,
    term: "1-year",
    paymentOption: "no-upfront",
    monthlySavingsUsd: 438,
    breakEvenMonth: 1,
    annualSavingsUsd: 5256,
  },
  {
    instanceType: "c5.large",
    region: "us-west-2",
    currentMonthlyCostUsd: 1460,
    term: "3-year",
    paymentOption: "all-upfront",
    monthlySavingsUsd: 730,
    breakEvenMonth: 1,
    annualSavingsUsd: 8760,
  },
  {
    instanceType: "t3.medium",
    region: "eu-west-1",
    currentMonthlyCostUsd: 730,
    term: "1-year",
    paymentOption: "partial-upfront",
    monthlySavingsUsd: 248,
    breakEvenMonth: 2,
    annualSavingsUsd: 2976,
  },
];

// ---------------------------------------------------------------------------
// Forecast (6 months historical + 6 months projected)
// ---------------------------------------------------------------------------
export const MOCK_FORECAST: Forecast[] = [
  // Historical actuals
  { month: "2025-10", predictedCostUsd: 48200, confidenceIntervalLow: 48200, confidenceIntervalHigh: 48200 },
  { month: "2025-11", predictedCostUsd: 49600, confidenceIntervalLow: 49600, confidenceIntervalHigh: 49600 },
  { month: "2025-12", predictedCostUsd: 51100, confidenceIntervalLow: 51100, confidenceIntervalHigh: 51100 },
  { month: "2026-01", predictedCostUsd: 52700, confidenceIntervalLow: 52700, confidenceIntervalHigh: 52700 },
  { month: "2026-02", predictedCostUsd: 54300, confidenceIntervalLow: 54300, confidenceIntervalHigh: 54300 },
  { month: "2026-03", predictedCostUsd: 55900, confidenceIntervalLow: 55900, confidenceIntervalHigh: 55900 },
  // Projected
  { month: "2026-04", predictedCostUsd: 57600, confidenceIntervalLow: 54700, confidenceIntervalHigh: 60500 },
  { month: "2026-05", predictedCostUsd: 59300, confidenceIntervalLow: 55500, confidenceIntervalHigh: 63100 },
  { month: "2026-06", predictedCostUsd: 61100, confidenceIntervalLow: 56200, confidenceIntervalHigh: 66000 },
  { month: "2026-07", predictedCostUsd: 62900, confidenceIntervalLow: 56800, confidenceIntervalHigh: 69000 },
  { month: "2026-08", predictedCostUsd: 64800, confidenceIntervalLow: 57200, confidenceIntervalHigh: 72400 },
  { month: "2026-09", predictedCostUsd: 66700, confidenceIntervalLow: 57500, confidenceIntervalHigh: 75900 },
];

// ---------------------------------------------------------------------------
// Budgets
// ---------------------------------------------------------------------------
export const MOCK_BUDGETS: Budget[] = [
  {
    id: "budget-overall",
    name: "Overall Cloud Budget",
    amountUsd: 55000,
    scope: "overall",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 55900,
    projectedSpendUsd: 57600,
    status: "over-budget",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "budget-platform",
    name: "Platform Team",
    amountUsd: 14000,
    scope: "Platform",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 12600,
    projectedSpendUsd: 13800,
    status: "at-risk",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "budget-data",
    name: "Data Team",
    amountUsd: 12000,
    scope: "Data",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 8400,
    projectedSpendUsd: 9200,
    status: "on-track",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "budget-ml",
    name: "ML Team",
    amountUsd: 10000,
    scope: "ML",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 10800,
    projectedSpendUsd: 11500,
    status: "over-budget",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "budget-backend",
    name: "Backend Team",
    amountUsd: 8000,
    scope: "Backend",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 6100,
    projectedSpendUsd: 6500,
    status: "on-track",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "budget-frontend",
    name: "Frontend Team",
    amountUsd: 5000,
    scope: "Frontend",
    thresholds: [0.5, 0.8, 1.0],
    currentSpendUsd: 4800,
    projectedSpendUsd: 5200,
    status: "at-risk",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// CSV-style sample data for paste-in upload
export const SAMPLE_CSV = `date,service,resource_id,region,team,usage_quantity,usage_unit,cost_usd
2026-03-01,EC2,ec2-useast-prod01,us-east-1,Platform,720,hours,2190.00
2026-03-01,EC2,ec2-uswest-idle02,us-west-2,Backend,720,hours,612.00
2026-03-01,RDS,rds-useast-prod01,us-east-1,Data,720,hours,1850.00
2026-03-01,RDS,rds-useast-oversized01,us-east-1,ML,720,hours,820.00
2026-03-01,S3,s3-useast-datalake,us-east-1,Data,5000000,requests,4200.00
2026-03-01,Lambda,lambda-api-gateway,us-east-1,Backend,12500000,invocations,2100.00
2026-03-01,EBS,ebs-useast-unat01,us-east-1,,500,GB-months,230.00
2026-03-01,CloudFront,cf-dist-main,us-east-1,Frontend,85000000,requests,5300.00
2026-03-01,ELB,elb-useast-unused01,us-east-1,,720,hours,162.00
2026-03-01,ElastiCache,cache-prod-01,us-east-1,Platform,720,hours,3300.00`;
