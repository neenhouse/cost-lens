import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const WastePage = lazy(() => import("./pages/WastePage"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const RIPage = lazy(() => import("./pages/RIPage"));
const ForecastPage = lazy(() => import("./pages/ForecastPage"));
const BudgetsPage = lazy(() => import("./pages/BudgetsPage"));

const NAV_ITEMS = [
  { to: "/dashboard", icon: "⊞", label: "Dashboard" },
  { to: "/waste", icon: "⚠", label: "Waste" },
  { to: "/recommendations", icon: "◈", label: "Savings" },
  { to: "/teams", icon: "◎", label: "Teams" },
  { to: "/ri-planner", icon: "↻", label: "RI Planner" },
  { to: "/forecast", icon: "∿", label: "Forecast" },
  { to: "/budgets", icon: "◐", label: "Budgets" },
];

function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={onClose}>
            <span className="logo-icon">$</span>
            CostLens
          </Link>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Analytics</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="sidebar-link"
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <span className="sidebar-section-label">Data</span>
          <NavLink
            to="/upload"
            className="sidebar-link cta-link"
            onClick={onClose}
          >
            Upload Data
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          Data never leaves your browser.
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <div className="app-layout">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="mobile-header">
          <Link to="/" className="sidebar-logo">
            <span className="logo-icon">$</span>
            CostLens
          </Link>
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? "\u2715" : "\u2630"}
          </button>
        </div>

        <main id="main-content" className="app-main">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/waste" element={<WastePage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/ri-planner" element={<RIPage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
