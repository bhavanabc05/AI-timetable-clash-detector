// frontend/src/components/sections/UploadSection.jsx
import React from "react";
import UploadCSV from "../UploadCSV";

/**
 * UploadSection Component
 * Handles file upload UI and error display
 * 
 * Features:
 * - File input with drag-drop support
 * - Error message display with dismiss
 * - Loading spinner
 * 
 * @param {Function} onUpload - Callback when file is selected
 * @param {Boolean} loading - Loading state
 * @param {String} error - Error message (if any)
 * @param {Function} onReset - Callback to dismiss error
 */
export default function UploadSection({ onUpload, loading, error, onReset }) {
  return (
    <section className="upload-section">
      {/* ========================================
          FILE UPLOAD CARD
          ======================================== */}
      <UploadCSV onUpload={onUpload} disabled={loading} />

      {/* ========================================
          ERROR ALERT
          ======================================== */}
      {error && (
        <div
          className="err"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 107, 157, 0.1)",
            borderLeft: "3px solid #ffb3b3",
          }}
        >
          <span style={{ color: "#ffb3b3" }}>
            <strong>Error:</strong> {error}
          </span>
          <button
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              color: "#ffb3b3",
              cursor: "pointer",
              fontSize: "18px",
              transition: "opacity 0.2s",
            }}
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================
          LOADING SPINNER
          ======================================== */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#6ef0ff",
            marginTop: "12px",
            borderRadius: "8px",
            backgroundColor: "rgba(110, 240, 255, 0.05)",
            borderLeft: "3px solid #6ef0ff",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            ⏳ Processing your timetable...
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>
            Analyzing clashes and generating suggestions
          </div>
        </div>
      )}
    </section>
  );
}