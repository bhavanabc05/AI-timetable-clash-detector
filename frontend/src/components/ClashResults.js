// frontend/src/components/ClashResults.js
import React from "react";
import "./ClashResults.css";

export default function ClashResults({ clashes }) {
  if (!clashes || clashes.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Detected Clashes</h3>
          <div className="badge">0</div>
        </div>
        <div className="panel-body">
          <div className="no-clash">
            <div className="sparkle">🎉</div>
            <div>No clashes detected — nice!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Detected Clashes</h3>
        <div className="badge">{clashes.length}</div>
      </div>

      <div className="panel-body">
        <div className="clashes-container">
          {clashes.map((clash, idx) => (
            <ClashCard key={idx} clash={clash} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClashCard({ clash }) {
  const [A, B] = clash.entries;

  // Determine clash type color
  const typeColors = {
    "Teacher Clash": "#ff6b9d",
    "Room Clash": "#ffa502",
    "Year Clash": "#6ef0ff",
  };

  const typeColor = typeColors[clash.type] || "#9b6bff";

  return (
    <div className="clash-card-modern">
      <div className="clash-header">
        <div className="clash-badge" style={{ borderLeftColor: typeColor }}>
          <span className="clash-type-label">{clash.type}</span>
          <span className="clash-day">{clash.day}</span>
        </div>
      </div>

      <div className="clash-entries">
        {/* Entry A */}
        <div className="entry-block">
          <div className="entry-course">{A.course}</div>
          <div className="entry-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Teacher</span>
              <span className="meta-value">{A.teacher}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Room</span>
              <span className="meta-value">{A.room}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Time</span>
              <span className="meta-value">{A.start}–{A.end}</span>
            </div>
          </div>
        </div>

        {/* Conflict Indicator */}
        <div className="conflict-indicator">
          <div className="conflict-line"></div>
          <div className="conflict-icon">⚡</div>
          <div className="conflict-line"></div>
        </div>

        {/* Entry B */}
        <div className="entry-block">
          <div className="entry-course">{B.course}</div>
          <div className="entry-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Teacher</span>
              <span className="meta-value">{B.teacher}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Room</span>
              <span className="meta-value">{B.room}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Time</span>
              <span className="meta-value">{B.start}–{B.end}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}