import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { MOCK_FORECAST } from "../lib/mock-data";
import { formatUsd, formatMonth } from "../lib/format";

export default function ForecastPage() {
  // Split into historical (first 6) and projected (last 6)
  const historicalCount = 6;

  const chartData = MOCK_FORECAST.map((f, idx) => ({
    month: formatMonth(f.month + "-01"),
    actual: idx < historicalCount ? f.predictedCostUsd : undefined,
    predicted: idx >= historicalCount ? f.predictedCostUsd : undefined,
    // For the bridge between historical and predicted
    bridge: idx === historicalCount - 1 || idx === historicalCount ? f.predictedCostUsd : undefined,
    low: idx >= historicalCount ? f.confidenceIntervalLow : undefined,
    high: idx >= historicalCount ? f.confidenceIntervalHigh : undefined,
    confidenceBand:
      idx >= historicalCount
        ? [f.confidenceIntervalLow, f.confidenceIntervalHigh]
        : undefined,
  }));

  const nextMonth = MOCK_FORECAST[historicalCount];
  const lastActual = MOCK_FORECAST[historicalCount - 1];
  const monthChange = nextMonth
    ? ((nextMonth.predictedCostUsd - lastActual.predictedCostUsd) /
        lastActual.predictedCostUsd) *
      100
    : 0;

  const sixMonthProjected = MOCK_FORECAST.slice(historicalCount).reduce(
    (s, f) => s + f.predictedCostUsd,
    0
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Forecast Model</h1>
        <p className="page-subtitle">
          Projected spend for the next 6 months based on historical trends
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Next Month Forecast</span>
          <span className="summary-value">
            {nextMonth ? formatUsd(nextMonth.predictedCostUsd) : "--"}
          </span>
          <span className={`summary-sub ${monthChange > 0 ? "danger" : "emerald"}`}>
            {monthChange > 0 ? "+" : ""}
            {monthChange.toFixed(1)}% vs current
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-label">6-Month Projected Total</span>
          <span className="summary-value">{formatUsd(sixMonthProjected)}</span>
          <span className="summary-sub">Apr-Sep 2026</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Confidence Range (Next Mo)</span>
          <span className="summary-value">
            {nextMonth
              ? `${formatUsd(nextMonth.confidenceIntervalLow)} - ${formatUsd(nextMonth.confidenceIntervalHigh)}`
              : "--"}
          </span>
          <span className="summary-sub">80% confidence interval</span>
        </div>
      </div>

      <div className="chart-container">
        <h2>Spend Trend & Forecast</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-text)",
              }}
              formatter={(value: number) => formatUsd(value)}
            />
            <ReferenceLine
              x={chartData[historicalCount - 1]?.month}
              stroke="var(--color-border)"
              strokeDasharray="4 4"
              label={{
                value: "Forecast",
                fill: "var(--color-text-muted)",
                fontSize: 11,
              }}
            />
            <Area
              dataKey="low"
              fill="transparent"
              stroke="transparent"
            />
            <Area
              dataKey="high"
              fill="rgba(16, 185, 129, 0.1)"
              stroke="transparent"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 4 }}
              connectNulls={false}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="bridge"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              connectNulls
              name="Bridge"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ fill: "#10b981", r: 4, strokeDasharray: "0" }}
              connectNulls={false}
              name="Predicted"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="forecast-table">
        <h2>Monthly Detail</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Predicted Spend</th>
                <th>Low (80% CI)</th>
                <th>High (80% CI)</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FORECAST.map((f, idx) => (
                <tr key={f.month}>
                  <td>{formatMonth(f.month + "-01")}</td>
                  <td>{formatUsd(f.predictedCostUsd)}</td>
                  <td>{formatUsd(f.confidenceIntervalLow)}</td>
                  <td>{formatUsd(f.confidenceIntervalHigh)}</td>
                  <td>
                    <span
                      className={`badge ${idx < historicalCount ? "badge-actual" : "badge-forecast"}`}
                    >
                      {idx < historicalCount ? "Actual" : "Forecast"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
