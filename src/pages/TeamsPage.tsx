import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOCK_TEAM_ATTRIBUTION } from "../lib/mock-data";
import { formatUsd } from "../lib/format";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const totalSpend = MOCK_TEAM_ATTRIBUTION.reduce(
    (s, t) => s + t.totalCostUsd,
    0
  );

  const pieData = MOCK_TEAM_ATTRIBUTION.map((t) => ({
    name: t.team,
    value: Math.round(t.totalCostUsd),
  }));

  const detail = selectedTeam
    ? MOCK_TEAM_ATTRIBUTION.find((t) => t.team === selectedTeam)
    : null;

  function exportCsv() {
    const header = "Team,Service,Cost USD";
    const rows = MOCK_TEAM_ATTRIBUTION.flatMap((t) =>
      t.services.map(
        (s) => `${t.team},${s.service},${s.costUsd}`
      )
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "costlens-team-attribution.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Team Cost Attribution</h1>
        <p className="page-subtitle">
          Break down cloud costs by team for chargeback and showback
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total 6-Month Spend</span>
          <span className="summary-value">{formatUsd(totalSpend)}</span>
          <span className="summary-sub">across {MOCK_TEAM_ATTRIBUTION.length} teams</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Highest Spend Team</span>
          <span className="summary-value emerald">
            {MOCK_TEAM_ATTRIBUTION[0]?.team}
          </span>
          <span className="summary-sub">
            {formatUsd(MOCK_TEAM_ATTRIBUTION[0]?.totalCostUsd ?? 0)}
          </span>
        </div>
      </div>

      <div className="teams-layout">
        <div className="chart-section">
          <h2>Cost Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                onClick={(_, idx) =>
                  setSelectedTeam(MOCK_TEAM_ATTRIBUTION[idx].team)
                }
                style={{ cursor: "pointer" }}
              >
                {pieData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={COLORS[idx % COLORS.length]}
                    stroke="var(--color-bg)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-text)",
                }}
                formatter={(value: number) => formatUsd(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="table-controls" style={{ marginTop: "1rem" }}>
            <button className="btn-secondary" onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </div>

        <div className="team-table-section">
          <h2>Team Breakdown</h2>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Total Cost</th>
                  <th>% of Total</th>
                  <th>Top Service</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEAM_ATTRIBUTION.map((t, idx) => (
                  <tr
                    key={t.team}
                    className={`clickable ${selectedTeam === t.team ? "selected" : ""}`}
                    onClick={() => setSelectedTeam(t.team)}
                  >
                    <td>
                      <span
                        className="color-dot"
                        style={{ background: COLORS[idx % COLORS.length] }}
                      />
                      {t.team}
                    </td>
                    <td>{formatUsd(t.totalCostUsd)}</td>
                    <td>
                      {((t.totalCostUsd / totalSpend) * 100).toFixed(1)}%
                    </td>
                    <td>{t.services[0]?.service ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {detail && (
            <div className="team-detail">
              <h3>{detail.team} -- Service Breakdown</h3>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.services.map((s) => (
                      <tr key={s.service}>
                        <td>{s.service}</td>
                        <td>{formatUsd(s.costUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
