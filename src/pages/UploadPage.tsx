import { useCallback, useState } from "react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }, []);

  return (
    <main className="upload-page">
      <h1>Upload Billing Data</h1>
      <p>Drop your AWS CUR (CSV), GCP BigQuery export (JSON), or Azure cost export (CSV).</p>

      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <p>Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
        ) : (
          <p>Drag & drop a billing file here, or click to browse</p>
        )}
        <input type="file" accept=".csv,.json" onChange={handleFileChange} />
      </div>

      {file && (
        <button className="cta-button" onClick={() => { /* TODO: trigger parse */ }}>
          Analyze
        </button>
      )}
    </main>
  );
}
