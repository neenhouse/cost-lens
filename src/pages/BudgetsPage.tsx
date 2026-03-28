import { useState } from "react";
import { MOCK_BUDGETS } from "../lib/mock-data";
import { formatUsd, formatPercent } from "../lib/format";
import type { Budget } from "../types/billing";

function getStatusColor(status: Budget["status"]) {
  switch (status) {
    case "on-track":
      return "var(--color-emerald)";
    case "at-risk":
      return "var(--color-warning)";
    case "over-budget":
      return "var(--color-danger)";
  }
}

function getProgressColor(ratio: number) {
  if (ratio >= 1) return "var(--color-danger)";
  if (ratio >= 0.8) return "var(--color-warning)";
  return "var(--color-emerald)";
}

export default function BudgetsPage() {
  const [budgets] = useState<Budget[]>([...MOCK_BUDGETS]);

  const onTrack = budgets.filter((b) => b.status === "on-track").length;
  const atRisk = budgets.filter((b) => b.status === "at-risk").length;
  const overBudget = budgets.filter((b) => b.status === "over-budget").length;

  const totalBudget = budgets.reduce((s, b) => s + b.amountUsd, 0);
  const totalSpend = budgets.reduce((s, b) => s + b.currentSpendUsd, 0);

  function exportCsv() {
    const header = "Budget,Amount,Current Spend,Projected,Status";
    const rows = budgets.map(
      (b) =>
        `"${b.name}",${b.amountUsd},${b.currentSpendUsd},${b.projectedSpendUsd},${b.status}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "costlens-budget-status.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Budget Alerts</h1>
        <p className="page-subtitle">
          Monitor spend against budget thresholds with real-time alerts
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total Budgets</span>
          <span className="summary-value">{budgets.length}</span>
          <span className="summary-sub">{formatUsd(totalBudget)} allocated</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">On Track</span>
          <span className="summary-value" style={{ color: "var(--color-emerald)" }}>
            {onTrack}
          </span>
          <span className="summary-sub">within budget</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">At Risk</span>
          <span className="summary-value" style={{ color: "var(--color-warning)" }}>
            {atRisk}
          </span>
          <span className="summary-sub">approaching limit</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Over Budget</span>
          <span className="summary-value danger">{overBudget}</span>
          <span className="summary-sub">exceeded limit</span>
        </div>
      </div>

      <div className="table-controls">
        <span className="burn-rate">
          Burn Rate:{" "}
          <strong>{formatUsd(Math.round(totalSpend / 30))}/day</strong>{" "}
          <span className="muted">
            (pace: {formatUsd(Math.round((totalSpend / 30) * 30))}/mo vs{" "}
            {formatUsd(totalBudget)} budget)
          </span>
        </span>
        <button className="btn-secondary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="budget-list">
        {budgets.map((b) => {
          const ratio = b.currentSpendUsd / b.amountUsd;
          const projectedRatio = b.projectedSpendUsd / b.amountUsd;

          return (
            <div key={b.id} className="budget-card">
              <div className="budget-header">
                <div>
                  <h3>{b.name}</h3>
                  <span className="budget-scope">
                    {b.scope === "overall" ? "Overall" : `Team: ${b.scope}`}
                  </span>
                </div>
                <span
                  className="budget-status-badge"
                  style={{
                    background: getStatusColor(b.status),
                    color: "#fff",
                  }}
                >
                  {b.status.replace("-", " ")}
                </span>
              </div>

              <div className="budget-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(ratio * 100, 100)}%`,
                      background: getProgressColor(ratio),
                    }}
                  />
                  {/* threshold markers */}
                  {b.thresholds.map((t) => (
                    <div
                      key={t}
                      className="threshold-marker"
                      style={{ left: `${t * 100}%` }}
                      title={`${t * 100}% threshold`}
                    />
                  ))}
                </div>
                <div className="budget-amounts">
                  <span>
                    {formatUsd(b.currentSpendUsd)} /{" "}
                    {formatUsd(b.amountUsd)}
                  </span>
                  <span className="muted">
                    {formatPercent(ratio)} used
                  </span>
                </div>
              </div>

              <div className="budget-footer">
                <span>
                  Projected:{" "}
                  <strong
                    style={{
                      color:
                        projectedRatio > 1
                          ? "var(--color-danger)"
                          : "var(--color-text)",
                    }}
                  >
                    {formatUsd(b.projectedSpendUsd)}
                  </strong>
                  {projectedRatio > 1 && (
                    <span className="overspend-warn">
                      {" "}
                      ({formatUsd(b.projectedSpendUsd - b.amountUsd)} over)
                    </span>
                  )}
                </span>
                <span className="muted">
                  Daily burn: {formatUsd(Math.round(b.currentSpendUsd / 30))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
