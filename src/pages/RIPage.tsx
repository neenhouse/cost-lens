import { useState } from "react";
import { MOCK_RI_RECOMMENDATIONS } from "../lib/mock-data";
import { formatUsd } from "../lib/format";

type TermFilter = "all" | "1-year" | "3-year";
type PaymentFilter = "all" | "no-upfront" | "partial-upfront" | "all-upfront";

export default function RIPage() {
  const [termFilter, setTermFilter] = useState<TermFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const filtered = MOCK_RI_RECOMMENDATIONS.filter((r) => {
    if (termFilter !== "all" && r.term !== termFilter) return false;
    if (paymentFilter !== "all" && r.paymentOption !== paymentFilter) return false;
    return true;
  });

  const totalAnnualSavings = filtered.reduce(
    (s, r) => s + r.annualSavingsUsd,
    0
  );

  const totalCurrentMonthly = filtered.reduce(
    (s, r) => s + r.currentMonthlyCostUsd,
    0
  );

  const totalMonthlySavings = filtered.reduce(
    (s, r) => s + r.monthlySavingsUsd,
    0
  );

  // Coverage: mock 35% already reserved
  const reservedPercent = 35;
  const onDemandPercent = 100 - reservedPercent;

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Reserved Instance Planner</h1>
        <p className="page-subtitle">
          Compare on-demand vs reserved vs savings plans pricing
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Potential Annual Savings</span>
          <span className="summary-value emerald">
            {formatUsd(totalAnnualSavings)}
          </span>
          <span className="summary-sub">from RI adoption</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Monthly Savings</span>
          <span className="summary-value emerald">
            {formatUsd(totalMonthlySavings)}
          </span>
          <span className="summary-sub">
            vs {formatUsd(totalCurrentMonthly)} on-demand
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Current RI Coverage</span>
          <span className="summary-value">{reservedPercent}%</span>
          <span className="summary-sub">
            {onDemandPercent}% still on-demand
          </span>
        </div>
      </div>

      <div className="coverage-bar-section">
        <h2>Coverage Analysis</h2>
        <div className="coverage-bar">
          <div
            className="coverage-reserved"
            style={{ width: `${reservedPercent}%` }}
          >
            Reserved {reservedPercent}%
          </div>
          <div
            className="coverage-ondemand"
            style={{ width: `${onDemandPercent}%` }}
          >
            On-Demand {onDemandPercent}%
          </div>
        </div>
      </div>

      <div className="table-controls">
        <select
          value={termFilter}
          onChange={(e) => setTermFilter(e.target.value as TermFilter)}
          className="filter-select"
        >
          <option value="all">All Terms</option>
          <option value="1-year">1-Year</option>
          <option value="3-year">3-Year</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
          className="filter-select"
        >
          <option value="all">All Payment Options</option>
          <option value="no-upfront">No Upfront</option>
          <option value="partial-upfront">Partial Upfront</option>
          <option value="all-upfront">All Upfront</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Instance Type</th>
              <th>Region</th>
              <th>On-Demand/mo</th>
              <th>Term</th>
              <th>Payment</th>
              <th>Monthly Savings</th>
              <th>Annual Savings</th>
              <th>Break-Even</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={idx}>
                <td className="mono">{r.instanceType}</td>
                <td>{r.region}</td>
                <td>{formatUsd(r.currentMonthlyCostUsd)}</td>
                <td>
                  <span className="badge badge-term">{r.term}</span>
                </td>
                <td>{r.paymentOption.replace("-", " ")}</td>
                <td className="emerald">{formatUsd(r.monthlySavingsUsd)}</td>
                <td className="emerald">{formatUsd(r.annualSavingsUsd)}</td>
                <td>Month {r.breakEvenMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
