import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Upload billing data to see your cost intelligence dashboard.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Waste Detected</h2>
          <p className="metric">--</p>
          <span>Upload data to detect waste</span>
        </div>
        <div className="dashboard-card">
          <h2>Potential Savings</h2>
          <p className="metric">--</p>
          <span>Optimization recommendations</span>
        </div>
        <div className="dashboard-card">
          <h2>Teams</h2>
          <p className="metric">--</p>
          <span>Cost attribution by team</span>
        </div>
        <div className="dashboard-card">
          <h2>Forecast</h2>
          <p className="metric">--</p>
          <span>Next month prediction</span>
        </div>
      </div>

      <Link to="/upload" className="cta-button">
        Upload Billing Data
      </Link>
    </main>
  );
}
