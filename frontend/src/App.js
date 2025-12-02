import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import ClashResults from "./components/ClashResults";
import TimetableTable from "./components/TimetableTable";
import Charts from "./components/Charts";
import { uploadTimetable } from "./api/api";

export default function App() {
  const [clashes, setClashes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const [error, setError] = useState(null);

  async function handleUpload(file) {
    setError(null);
    setLoading(true);
    setLastFile(file?.name || null);
    try {
      const res = await uploadTimetable(file);
      setClashes(res.clashes || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
      setClashes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo-glow">AI</div>
          <div>
            <div className="title">AI Timetable Clash Detector</div>
            <div className="subtitle">Realtime clash analysis · neon UI</div>
          </div>
        </div>
        <div className="status">
          {loading ? <div className="pill">Processing…</div> : <div className="pill ok">Ready</div>}
        </div>
      </header>

      <main className="container">
        <div className="left">
          <UploadCSV onUpload={handleUpload} />
          {error && <div className="err">Upload Failed: {error}</div>}
          <div style={{height:14}} />
          <ClashResults clashes={clashes} />
        </div>

        <div className="right">
          <Charts clashes={clashes} />
          <div style={{height:12}} />
          <TimetableTable clashes={clashes} />
          <div className="meta">
            <div>Last file: <span className="mono">{lastFile || "—"}</span></div>
            <div className="muted">Tip: Use a CSV with headers: course,teacher,year,room,day,start,end,resource</div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div>Built with ⚡ AI vibes</div>
        <div className="muted">Frontend • Backend integrated</div>
      </footer>
    </div>
  );
}
