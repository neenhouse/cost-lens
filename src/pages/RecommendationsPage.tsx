import { useState } from "react";
import { MOCK_RECOMMENDATIONS } from "../lib/mock-data";
import { formatUsd } from "../lib/format";
import type { Recommendation } from "../types/billing";

const EFFORT_COLORS: Record<string, string> = {
  low: "var(--color-emerald)",
  medium: "var(--color-warning)",
  high: "var(--color-danger)",
};

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([...MOCK_RECOMMENDATIONS]);

  const activeSavings = recs
    .filter((r) => r.status !== "dismissed")
    .reduce((s, r) => s + r.monthlySavingsUsd, 0);

  const totalSavings = recs.reduce((s, r) => s + r.monthlySavingsUsd, 0);

  function updateStatus(id: string, status: Recommendation["status"]) {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Optimization Recommendations</h1>
        <p className="page-subtitle">
          Prioritized actions to reduce your cloud spend
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total Potential Savings</span>
          <span className="summary-value emerald">{formatUsd(totalSavings)}/mo</span>
          <span className="summary-sub">{formatUsd(totalSavings * 12)}/year</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Active Savings</span>
          <span className="summary-value emerald">{formatUsd(activeSavings)}/mo</span>
          <span className="summary-sub">excluding dismissed</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Recommendations</span>
          <span className="summary-value">{recs.length}</span>
          <span className="summary-sub">
            {recs.filter((r) => r.status === "accepted").length} accepted,{" "}
            {recs.filter((r) => r.status === "dismissed").length} dismissed
          </span>
        </div>
      </div>

      <div className="rec-list">
        {recs.map((rec) => (
          <div
            key={rec.id}
            className={`rec-card ${rec.status === "dismissed" ? "dismissed" : ""}`}
          >
            <div className="rec-header">
              <div>
                <h3>{rec.title}</h3>
                <span className={`badge badge-cat-${rec.category}`}>
                  {rec.category.replace("-", " ")}
                </span>
              </div>
              <div className="rec-savings">
                <span className="emerald">{formatUsd(rec.monthlySavingsUsd)}/mo</span>
              </div>
            </div>
            <p className="rec-desc">{rec.description}</p>
            <div className="rec-meta">
              <span>
                Effort:{" "}
                <strong style={{ color: EFFORT_COLORS[rec.effortLevel] }}>
                  {rec.effortLevel}
                </strong>
              </span>
              <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
              <span>Priority: {rec.priorityScore.toFixed(0)}</span>
              <span className="mono">
                Resources: {rec.affectedResources.length}
              </span>
            </div>
            <div className="rec-actions">
              <button
                className={`btn-status ${rec.status === "accepted" ? "active" : ""}`}
                onClick={() => updateStatus(rec.id, "accepted")}
              >
                Accept
              </button>
              <button
                className={`btn-status ${rec.status === "in-progress" ? "active" : ""}`}
                onClick={() => updateStatus(rec.id, "in-progress")}
              >
                In Progress
              </button>
              <button
                className={`btn-status btn-dismiss ${rec.status === "dismissed" ? "active" : ""}`}
                onClick={() => updateStatus(rec.id, "dismissed")}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
