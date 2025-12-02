import React from "react";

export default function UploadCSV({ onUpload }) {
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
  }

  return (
    <div>
      <h3>Upload CSV Timetable</h3>
      <input type="file" accept=".csv" onChange={handleFile} />
    </div>
  );
}
