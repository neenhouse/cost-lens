import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SAMPLE_CSV } from "../lib/mock-data";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) setFile(selected);
    },
    []
  );

  function loadSampleData() {
    setCsvText(SAMPLE_CSV);
    setMode("paste");
  }

  function analyze() {
    // In a real app, parse and store in IndexedDB.
    // For the demo, navigate to the dashboard with sample data loaded.
    navigate("/dashboard");
  }

  const hasData = mode === "paste" ? csvText.trim().length > 0 : file !== null;

  return (
    <main className="page-container upload-page-content">
      <div className="page-header">
        <h1>Upload Billing Data</h1>
        <p className="page-subtitle">
          Paste your billing CSV, drop a file, or use sample AWS/GCP data to explore.
        </p>
      </div>

      <div className="upload-tabs">
        <button
          className={`tab-btn ${mode === "paste" ? "active" : ""}`}
          onClick={() => setMode("paste")}
        >
          Paste CSV
        </button>
        <button
          className={`tab-btn ${mode === "file" ? "active" : ""}`}
          onClick={() => setMode("file")}
        >
          Upload File
        </button>
      </div>

      {mode === "paste" ? (
        <div className="paste-section">
          <textarea
            className="csv-textarea"
            placeholder={`Paste your billing CSV here...\n\ndate,service,resource_id,region,team,usage_quantity,usage_unit,cost_usd\n2026-03-01,EC2,ec2-prod01,us-east-1,Platform,720,hours,2190.00`}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={12}
          />
          <div className="sample-actions">
            <button className="btn-secondary" onClick={loadSampleData}>
              Load Sample AWS Data
            </button>
            <span className="muted">
              {csvText
                ? `${csvText.split("\n").length - 1} rows`
                : "No data yet"}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <p>
              Selected: <strong>{file.name}</strong> (
              {(file.size / 1024 / 1024).toFixed(1)} MB)
            </p>
          ) : (
            <p>Drag & drop a billing CSV or JSON file here, or click to browse</p>
          )}
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
          />
        </div>
      )}

      {hasData && (
        <div className="upload-actions">
          <button className="cta-button" onClick={analyze}>
            Analyze Data
          </button>
        </div>
      )}
    </main>
  );
}
