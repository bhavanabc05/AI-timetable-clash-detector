import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import ClashResults from "./components/ClashResults";
import TimetableTable from "./components/TimetableTable";
import { uploadTimetable } from "./api/api";

function App() {
  const [clashes, setClashes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload(file) {
    setLoading(true);
    try {
      const res = await uploadTimetable(file);
      setClashes(res.clashes);
    } catch (err) {
      alert("Upload Failed: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Timetable Clash Detector</h1>

      <UploadCSV onUpload={handleUpload} />

      {loading && <p>Processing…</p>}

      <hr />

      <ClashResults clashes={clashes} />

      <hr />

      <TimetableTable clashes={clashes} />
    </div>
  );
}

export default App;
