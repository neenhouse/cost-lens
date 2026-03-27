import { Link } from "react-router-dom";

const features = [
  { title: "Billing Data Upload", desc: "Drag-and-drop CSV/JSON from AWS, GCP, or Azure. Parsed in seconds." },
  { title: "Waste Detection", desc: "Find idle compute, unattached storage, unused IPs, and stale snapshots." },
  { title: "Optimization Recommendations", desc: "Prioritized actions with dollar savings, effort level, and confidence." },
  { title: "Team Cost Attribution", desc: "Auto-detect teams from tags. Chargeback and showback reports." },
  { title: "Reserved Instance Planner", desc: "Break-even analysis, coverage gaps, and savings by term and payment." },
  { title: "Monthly Forecast", desc: "Predict next month's spend with confidence intervals and anomaly flags." },
  { title: "Budget Alerts", desc: "Set budgets per team. Track burn rate. Get alerts at configurable thresholds." },
];

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>See where your cloud money goes.</h1>
        <p>
          Upload your billing data. Get waste detection, optimization recommendations with
          dollar savings, team attribution, and monthly forecasts -- in under 60 seconds.
        </p>
        <Link to="/upload" className="cta-button">
          Upload Billing Data
        </Link>
      </section>

      <section className="features">
        <h2>Everything you need to control cloud costs</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <strong>Upload</strong>
            <span>Drop your billing CSV or JSON export</span>
          </li>
          <li>
            <strong>Analyze</strong>
            <span>CostLens detects waste and generates recommendations</span>
          </li>
          <li>
            <strong>Save</strong>
            <span>Act on prioritized recommendations with clear dollar impact</span>
          </li>
        </ol>
      </section>

      <footer className="landing-footer">
        <p>Your billing data never leaves your browser. Privacy by design.</p>
      </footer>
    </main>
  );
}
