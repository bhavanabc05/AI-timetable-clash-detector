import React from "react";
import AnalyticsSection from "../components/sections/AnalyticsSection";
import { Link } from "react-router-dom";

export default function AnalyticsPage({ clashes }) {
  if (!clashes || clashes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>No Data Available</h2>
        <p>Please upload a timetable first to view analytics.</p>
        <Link to="/" className="btn-gradient" style={{ textDecoration: 'none', padding: '10px 20px', color: 'white' }}>
          Go to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <AnalyticsSection clashes={clashes} />
      </div>
    </div>
  );
}