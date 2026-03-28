import { Link } from "react-router-dom";

const features = [
  {
    icon: "^",
    title: "Billing Data Upload",
    desc: "Paste CSV or use sample AWS/GCP data. Parsed instantly in your browser.",
  },
  {
    icon: "!",
    title: "Waste Detection",
    desc: "Find idle EC2 instances, unused EBS volumes, oversized RDS, and more.",
  },
  {
    icon: "$",
    title: "Optimization Recommendations",
    desc: "Prioritized actions with dollar savings, effort level, and confidence scores.",
  },
  {
    icon: "%",
    title: "Team Cost Attribution",
    desc: "Pie charts and tables breaking down cost by team and service.",
  },
  {
    icon: "R",
    title: "Reserved Instance Planner",
    desc: "Compare on-demand vs reserved vs spot. Break-even analysis included.",
  },
  {
    icon: "~",
    title: "Monthly Forecast",
    desc: "Line chart projecting next 6 months with confidence intervals.",
  },
  {
    icon: "#",
    title: "Budget Alerts",
    desc: "Set thresholds, track burn rate, see which teams are over budget.",
  },
];

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-badge">Cloud Cost Intelligence</div>
        <h1>
          Stop overpaying<br />for cloud.
        </h1>
        <p>
          Upload your billing data and get instant waste detection, optimization
          recommendations with dollar savings, team attribution, RI planning,
          forecasts, and budget alerts -- all in your browser.
        </p>
        <div className="hero-actions">
          <Link to="/upload" className="cta-button">
            Upload Billing Data
          </Link>
          <Link to="/dashboard" className="cta-button cta-secondary">
            View Demo Dashboard
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need to control cloud costs</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
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
            <div className="step-number">1</div>
            <strong>Upload</strong>
            <span>Paste your billing CSV or load sample data</span>
          </li>
          <li>
            <div className="step-number">2</div>
            <strong>Analyze</strong>
            <span>CostLens detects waste and generates recommendations</span>
          </li>
          <li>
            <div className="step-number">3</div>
            <strong>Save</strong>
            <span>Act on prioritized recommendations with clear dollar impact</span>
          </li>
        </ol>
      </section>

      <section className="social-proof">
        <h2>Trusted by engineering teams</h2>
        <div className="proof-grid">
          <div className="proof-stat">
            <span className="proof-number">$2.4M</span>
            <span className="proof-label">waste detected</span>
          </div>
          <div className="proof-stat">
            <span className="proof-number">340+</span>
            <span className="proof-label">teams optimized</span>
          </div>
          <div className="proof-stat">
            <span className="proof-number">30%</span>
            <span className="proof-label">avg cost reduction</span>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Your billing data never leaves your browser. Privacy by design.</p>
      </footer>
    </main>
  );
}
