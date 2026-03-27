# CostLens -- Product Requirements Document

## Overview

CostLens is a cloud cost intelligence platform. Users upload billing data and receive waste detection, optimization recommendations with dollar savings, team-level cost attribution, reserved instance planning, monthly forecasts, and budget alerts.

---

## Feature 1: Landing Page

### Summary
Marketing and entry point for the application. Communicates value proposition, shows key features, and funnels users to upload their first billing file.

### Requirements
- F1.1: Hero section with headline, subheading, and primary CTA ("Upload Billing Data")
- F1.2: Feature grid highlighting the 7 core capabilities with icons and short descriptions
- F1.3: "How it works" 3-step flow: Upload -> Analyze -> Save
- F1.4: Social proof section (placeholder for testimonials / logos)
- F1.5: Footer with links to docs, GitHub, and privacy policy
- F1.6: Fully responsive (mobile, tablet, desktop)
- F1.7: Page load < 1.5s on 3G, Lighthouse performance > 90

### Acceptance Criteria
- [ ] Landing page renders at `/`
- [ ] CTA navigates to `/upload`
- [ ] Lighthouse performance score >= 90
- [ ] Mobile layout passes visual QA

---

## Feature 2: Billing Data Upload & Parser

### Summary
File upload interface that accepts cloud billing exports (AWS CUR CSV, GCP BigQuery export JSON, Azure cost export CSV). Parses, normalizes, and stores the data client-side for analysis.

### Requirements
- F2.1: Drag-and-drop upload zone with file type validation (CSV, JSON)
- F2.2: File size limit of 100 MB with progress indicator
- F2.3: Auto-detect cloud provider from file schema (AWS, GCP, Azure)
- F2.4: Normalize all providers into a unified cost line-item schema:
  - `date`, `service`, `resource_id`, `region`, `team`, `usage_quantity`, `usage_unit`, `cost_usd`
- F2.5: Parse in a Web Worker to avoid blocking the UI thread
- F2.6: Show parsing progress and row count
- F2.7: Display parsed data summary (total spend, date range, service breakdown) before proceeding
- F2.8: Store normalized data in IndexedDB for persistence across sessions

### Acceptance Criteria
- [ ] Upload accepts CSV and JSON files up to 100 MB
- [ ] AWS CUR, GCP export, and Azure export files parse correctly
- [ ] Normalized schema matches F2.4 spec
- [ ] Parsing runs in a Web Worker; UI remains responsive
- [ ] Summary screen shows correct totals

---

## Feature 3: Waste Detector

### Summary
Analyzes normalized billing data to identify wasteful spend: idle resources, over-provisioned instances, unattached storage, unused load balancers, and stale snapshots.

### Requirements
- F3.1: Detect idle compute (CPU utilization data if present, or zero-usage line items)
- F3.2: Detect unattached EBS volumes / persistent disks (storage with no associated instance)
- F3.3: Detect unused Elastic IPs / static IPs
- F3.4: Detect old snapshots (> 90 days, configurable threshold)
- F3.5: Detect unused load balancers (zero request count)
- F3.6: Each waste item shows: resource ID, service, region, monthly cost, waste category
- F3.7: Summary card showing total detected waste in dollars and as percentage of total spend
- F3.8: Sortable and filterable waste table
- F3.9: Export waste report as CSV

### Acceptance Criteria
- [ ] At least 5 waste categories detected
- [ ] Each waste item displays resource ID, cost, and category
- [ ] Summary shows total waste in USD
- [ ] Table is sortable by cost (descending default)
- [ ] CSV export contains all waste items

---

## Feature 4: Optimization Recommendations

### Summary
Generates prioritized, actionable recommendations with projected dollar savings. Each recommendation explains what to do, why, and how much it saves.

### Requirements
- F4.1: Right-sizing recommendations for compute instances (based on usage vs. provisioned)
- F4.2: Storage tier optimization (e.g., move infrequent-access data to cheaper tiers)
- F4.3: Region arbitrage suggestions (same service, cheaper region)
- F4.4: Consolidation recommendations (merge underutilized resources)
- F4.5: Each recommendation includes:
  - Title, description, affected resources, estimated monthly savings (USD), effort level (low/medium/high), confidence level
- F4.6: Priority score = (monthly_savings * confidence) / effort
- F4.7: Recommendations sorted by priority score descending
- F4.8: Aggregate savings summary at the top of the page
- F4.9: Mark recommendations as "accepted", "dismissed", or "in progress"

### Acceptance Criteria
- [ ] At least 4 recommendation categories generated
- [ ] Each recommendation shows dollar savings and effort level
- [ ] Priority score formula is applied and sorting is correct
- [ ] Status tracking (accepted/dismissed/in-progress) persists in IndexedDB
- [ ] Aggregate savings updates when recommendations are dismissed

---

## Feature 5: Team Cost Attribution

### Summary
Attributes cloud costs to teams based on resource tags, naming conventions, or user-defined mapping rules. Enables chargeback and showback workflows.

### Requirements
- F5.1: Auto-detect team attribution from resource tags (e.g., `team`, `owner`, `cost-center`)
- F5.2: Manual mapping UI: assign resource ID patterns (regex) to teams
- F5.3: Team dashboard showing per-team spend with month-over-month trend
- F5.4: Drill-down from team to individual services and resources
- F5.5: Unattributed costs bucket with tools to assign them
- F5.6: Comparison view: overlay 2-3 teams on the same chart
- F5.7: Export team attribution report as CSV
- F5.8: Shareable per-team URL with read-only view

### Acceptance Criteria
- [ ] Auto-detection identifies teams from common tag keys
- [ ] Manual mapping regex rules correctly assign resources
- [ ] Per-team spend totals match overall spend (no double-counting)
- [ ] Unattributed bucket captures all unmatched resources
- [ ] CSV export includes team, service, and cost columns

---

## Feature 6: Reserved Instance Planner

### Summary
Analyzes on-demand usage patterns and recommends reserved instance (RI) or savings plan purchases with break-even analysis and projected savings.

### Requirements
- F6.1: Identify consistently-running on-demand instances (>= 70% uptime over analysis period)
- F6.2: Calculate RI savings for 1-year and 3-year terms (no upfront, partial upfront, all upfront)
- F6.3: Break-even timeline for each RI option
- F6.4: Coverage analysis: what percentage of spend is already reserved vs. on-demand
- F6.5: Recommendation list with: instance type, region, term, payment option, monthly savings, break-even month
- F6.6: Summary showing total potential annual savings from RI adoption
- F6.7: Amortization view showing RI cost spread over the term
- F6.8: Configurable utilization threshold (default 70%)

### Acceptance Criteria
- [ ] Consistently-running instances are correctly identified
- [ ] Savings calculations for all 3 payment options are within 5% of published RI pricing
- [ ] Break-even month is calculated and displayed for each option
- [ ] Coverage percentage is accurate
- [ ] Summary annual savings matches sum of individual recommendations

---

## Feature 7: Forecast Model

### Summary
Time-series forecasting model that predicts next month's cloud spend based on historical billing data. Supports overall and per-service forecasts.

### Requirements
- F7.1: Minimum 3 months of historical data required for forecasting
- F7.2: Linear regression baseline with seasonal adjustment
- F7.3: Per-service and aggregate forecast
- F7.4: Confidence interval (80% band) displayed on forecast chart
- F7.5: Chart showing historical spend + forecast with clear visual separation
- F7.6: Forecast accuracy tracking (compare prediction vs. actual when new data is uploaded)
- F7.7: Anomaly detection: flag months where actual deviated > 20% from forecast
- F7.8: Export forecast data as CSV

### Acceptance Criteria
- [ ] Forecast generates with >= 3 months of data
- [ ] Confidence interval renders on chart
- [ ] Per-service and aggregate views are both available
- [ ] Accuracy tracking works when subsequent month's data is uploaded
- [ ] Anomaly flags appear for > 20% deviations

---

## Feature 8: Budget Alerts Dashboard

### Summary
Users define monthly budgets (overall and per-team). The dashboard shows current spend vs. budget with visual indicators and configurable alert thresholds.

### Requirements
- F8.1: Create, edit, and delete budgets (name, amount, scope: overall or team-specific)
- F8.2: Budget progress bar showing current spend vs. budget (green/yellow/red)
- F8.3: Configurable alert thresholds (default: 50%, 80%, 100% of budget)
- F8.4: Projected end-of-month spend indicator (using forecast model)
- F8.5: Alert history log showing when thresholds were crossed
- F8.6: Dashboard summary: total budgets, on-track count, at-risk count, over-budget count
- F8.7: Burn rate indicator (daily spend rate vs. budget pace)
- F8.8: Budgets persist in IndexedDB across sessions
- F8.9: Export budget status report as CSV

### Acceptance Criteria
- [ ] CRUD operations for budgets work correctly
- [ ] Progress bars update with correct spend-to-budget ratio
- [ ] Alert thresholds trigger visual warnings at configured levels
- [ ] Projected end-of-month uses forecast model data
- [ ] Budget data persists across browser sessions

---

## Technical Constraints

- All data processing runs client-side (browser + Web Workers)
- No billing data is sent to any server -- privacy by design
- Cloudflare Worker serves the SPA and handles optional auth/sharing features
- D1 database stores user preferences, budgets, and sharing metadata (no raw billing data)
- R2 bucket available for optional server-side file storage (future, behind explicit opt-in)
- Target bundle size < 500 KB gzipped (initial load)
- All charts use a lightweight charting library (e.g., Recharts or lightweight alternative)
