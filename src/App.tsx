import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function Nav() {
  return (
    <nav className="site-nav">
      <Link to="/" className="nav-logo">CostLens</Link>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
