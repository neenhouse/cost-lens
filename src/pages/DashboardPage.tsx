import { Link } from "react-router-dom";
import {
  MOCK_BILLING_DATA,
  MOCK_TOTAL_WASTE,
  MOCK_TOTAL_SAVINGS,
  MOCK_FORECAST,
  MOCK_BUDGETS,
} from "../lib/mock-data";
import { formatUsd, formatPercent } from "../lib/format";

export default function DashboardPage() {
  const totalSpend = MOCK_BILLING_DATA.totalCostUsd;
  const wastePercent = MOCK_TOTAL_WASTE / (totalSpend / 6); // per-month basis
  const nextForecast = MOCK_FORECAST[6]; // first projected month
  const overBudget = MOCK_BUDGETS.filter((b) => b.status === "over-budget").length;
  const atRisk = MOCK_BUDGETS.filter((b) => b.status === "at-risk").length;

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Cost Intelligence Dashboard</h1>
        <p className="page-subtitle">
          Overview of your cloud spend across {MOCK_BILLING_DATA.rowCount} line items
          from {MOCK_BILLING_DATA.dateRange.start} to {MOCK_BILLING_DATA.dateRange.end}
        </p>
      </div>

      <div className="dashboard-grid">
        <Link to="/waste" className="dashboard-card clickable">
          <h2>Monthly Waste</h2>
          <p className="metric danger">{formatUsd(MOCK_TOTAL_WASTE)}</p>
          <span>{formatPercent(wastePercent)} of monthly spend</span>
        </Link>
        <Link to="/recommendations" className="dashboard-card clickable">
          <h2>Potential Savings</h2>
          <p className="metric emerald">{formatUsd(MOCK_TOTAL_SAVINGS)}/mo</p>
          <span>{formatUsd(MOCK_TOTAL_SAVINGS * 12)}/year</span>
        </Link>
        <Link to="/teams" className="dashboard-card clickable">
          <h2>Total 6-Mo Spend</h2>
          <p className="metric">{formatUsd(totalSpend)}</p>
          <span>5 teams tracked</span>
        </Link>
        <Link to="/forecast" className="dashboard-card clickable">
          <h2>Next Month Forecast</h2>
          <p className="metric">
            {nextForecast ? formatUsd(nextForecast.predictedCostUsd) : "--"}
          </p>
          <span>
            {nextForecast
              ? `${formatUsd(nextForecast.confidenceIntervalLow)} - ${formatUsd(nextForecast.confidenceIntervalHigh)}`
              : ""}
          </span>
        </Link>
        <Link to="/ri-planner" className="dashboard-card clickable">
          <h2>RI Coverage</h2>
          <p className="metric">35%</p>
          <span>65% on-demand opportunity</span>
        </Link>
        <Link to="/budgets" className="dashboard-card clickable">
          <h2>Budget Status</h2>
          <p className="metric">
            {overBudget > 0 && (
              <span className="danger">{overBudget} over</span>
            )}
            {overBudget > 0 && atRisk > 0 && " / "}
            {atRisk > 0 && (
              <span style={{ color: "var(--color-warning)" }}>
                {atRisk} at risk
              </span>
            )}
            {overBudget === 0 && atRisk === 0 && (
              <span className="emerald">All clear</span>
            )}
          </p>
          <span>{MOCK_BUDGETS.length} budgets configured</span>
        </Link>
      </div>

      <div className="dashboard-quick-actions">
        <Link to="/waste" className="quick-link">
          View Waste Details &rarr;
        </Link>
        <Link to="/recommendations" className="quick-link">
          See Recommendations &rarr;
        </Link>
        <Link to="/upload" className="quick-link">
          Upload New Data &rarr;
        </Link>
      </div>
    </main>
  );
}
