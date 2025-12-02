// frontend/src/components/sections/AnalyticsSection.jsx
import React from "react";
import Analytics from "../Analytics";
import TimetableTable from "../TimetableTable";

/**
 * AnalyticsSection Component
 * Displays comprehensive analytics dashboard and timetable preview
 * 
 * Contains:
 * 1. Analytics Dashboard (7 charts + KPI cards)
 * 2. Timetable Preview (raw data view)
 * 
 * @param {Array} clashes - Array of detected clashes from backend
 */
export default function AnalyticsSection({ clashes }) {
  return (
    <section className="analytics-section">
      {/* ========================================
          ANALYTICS DASHBOARD
          ======================================== */}
      <div className="panel">
        <div className="panel-header">
          <h3>📊 Analytics Dashboard</h3>
          <span className="badge">{clashes?.length || 0}</span>
        </div>

        <div className="panel-body" style={{ padding: "16px" }}>
          <Analytics clashes={clashes} />
        </div>
      </div>

      {/* Spacing */}
      <div style={{ height: "12px" }} />

      {/* ========================================
          TIMETABLE PREVIEW TABLE
          ======================================== */}
      <TimetableTable clashes={clashes} />
    </section>
  );
}