import { useState, useMemo } from "react";
import { MOCK_WASTE_ITEMS, MOCK_TOTAL_WASTE } from "../lib/mock-data";
import { MOCK_BILLING_DATA } from "../lib/mock-data";
import { formatUsd, formatPercent } from "../lib/format";
import type { WasteCategory } from "../types/billing";

type SortField = "monthlyCostUsd" | "service" | "category";
type SortDir = "asc" | "desc";

const CATEGORY_LABELS: Record<WasteCategory, string> = {
  "idle-compute": "Idle Compute",
  "unattached-storage": "Unattached Storage",
  "unused-ip": "Unused IP",
  "old-snapshot": "Old Snapshot",
  "unused-load-balancer": "Unused Load Balancer",
};

export default function WastePage() {
  const [sortField, setSortField] = useState<SortField>("monthlyCostUsd");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const wastePercent = MOCK_TOTAL_WASTE / MOCK_BILLING_DATA.totalCostUsd;

  const filtered = useMemo(() => {
    let items = [...MOCK_WASTE_ITEMS];
    if (categoryFilter !== "all") {
      items = items.filter((w) => w.category === categoryFilter);
    }
    items.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal;
      }
      return sortDir === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
    return items;
  }, [sortField, sortDir, categoryFilter]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function exportCsv() {
    const header = "Resource ID,Service,Region,Monthly Cost,Category,Description";
    const rows = MOCK_WASTE_ITEMS.map(
      (w) =>
        `${w.resourceId},${w.service},${w.region},${w.monthlyCostUsd},${w.category},"${w.description}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "costlens-waste-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const categories = Array.from(new Set(MOCK_WASTE_ITEMS.map((w) => w.category)));

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Waste Detector</h1>
        <p className="page-subtitle">
          Identify idle resources, unattached storage, and other wasteful spend
        </p>
      </div>

      <div className="summary-cards">
        <div className="summary-card waste-card">
          <span className="summary-label">Total Monthly Waste</span>
          <span className="summary-value danger">{formatUsd(MOCK_TOTAL_WASTE)}</span>
          <span className="summary-sub">{formatPercent(wastePercent)} of total spend</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Waste Items</span>
          <span className="summary-value">{MOCK_WASTE_ITEMS.length}</span>
          <span className="summary-sub">across {categories.length} categories</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Annual Waste Impact</span>
          <span className="summary-value danger">{formatUsd(MOCK_TOTAL_WASTE * 12)}</span>
          <span className="summary-sub">projected yearly</span>
        </div>
      </div>

      <div className="table-controls">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Resource ID</th>
              <th className="sortable" onClick={() => handleSort("service")}>
                Service {sortField === "service" ? (sortDir === "desc" ? " v" : " ^") : ""}
              </th>
              <th>Region</th>
              <th className="sortable" onClick={() => handleSort("monthlyCostUsd")}>
                Monthly Cost {sortField === "monthlyCostUsd" ? (sortDir === "desc" ? " v" : " ^") : ""}
              </th>
              <th className="sortable" onClick={() => handleSort("category")}>
                Category {sortField === "category" ? (sortDir === "desc" ? " v" : " ^") : ""}
              </th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.resourceId}>
                <td className="mono">{w.resourceId}</td>
                <td>{w.service}</td>
                <td>{w.region}</td>
                <td className="danger">{formatUsd(w.monthlyCostUsd)}</td>
                <td>
                  <span className={`badge badge-${w.category}`}>
                    {CATEGORY_LABELS[w.category]}
                  </span>
                </td>
                <td className="muted">{w.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
