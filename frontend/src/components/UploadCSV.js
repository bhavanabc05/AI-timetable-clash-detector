import React, { useRef, useState } from "react";
import "./upload.css"; // optional small CSS import (we style in main files)

export default function UploadCSV({ onUpload }) {
  const ref = useRef();
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function handleSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    onUpload(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    onUpload(file);
  }

  return (
    <div className={`upload-card ${dragOver ? "drag" : ""}`}
         onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
         onDragLeave={() => setDragOver(false)}
         onDrop={handleDrop}
    >
      <div className="upload-left">
        <svg className="neon-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="16" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>

        <div>
          <div className="upload-title">Upload CSV Timetable</div>
          <div className="upload-sub">Drag & drop or click to choose a <span className="mono">.csv</span> file</div>
        </div>
      </div>

      <div className="upload-actions">
        <label className="btn-gradient" htmlFor="file-input">Choose file</label>
        <input id="file-input" type="file" accept=".csv" ref={ref} onChange={handleSelect} style={{display:"none"}} />
        <div className="filename">{fileName || "No file selected"}</div>
      </div>
    </div>
  );
}
