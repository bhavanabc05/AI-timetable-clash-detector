// frontend/src/components/ClashResults.js
import React from "react";
import "./ClashResults.css";

export default function ClashResults({ clashes }) {
  if (!clashes || clashes.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>🔍 Detected Clashes</h3>
          <div className="badge">0</div>
        </div>
        <div className="panel-body">
          <div className="no-clash">
            <div className="sparkle-animation">✨</div>
            <h4>All Clear!</h4>
            <p>No scheduling conflicts detected</p>
            <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.6 }}>
              Your timetable is perfectly scheduled
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Color mapping for clash types
  const typeConfig = {
    "Teacher Clash": {
      color: "#ff6b9d",
      bgColor: "rgba(255, 107, 157, 0.1)",
      icon: "👨‍🏫",
      label: "Teacher Conflict",
    },
    "Room Clash": {
      color: "#ffa502",
      bgColor: "rgba(255, 165, 2, 0.1)",
      icon: "🏫",
      label: "Room Conflict",
    },
    "Year Clash": {
      color: "#6ef0ff",
      bgColor: "rgba(110, 240, 255, 0.1)",
      icon: "📚",
      label: "Student Year Conflict",
    },
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>🔍 Detected Clashes</h3>
          <p style={{ fontSize: "12px", margin: "4px 0 0 0", opacity: 0.6 }}>
            {clashes.length} conflict{clashes.length !== 1 ? "s" : ""} found in schedule
          </p>
        </div>
        <div className="badge-large">{clashes.length}</div>
      </div>

      <div className="panel-body">
        <div className="clashes-container">
          {clashes.map((clash, idx) => (
            <ClashCard
              key={idx}
              clash={clash}
              config={typeConfig[clash.type]}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClashCard({ clash, config, index }) {
  const [A, B] = clash.entries;

  return (
    <div className="clash-card" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Header with type badge */}
      <div className="clash-header" style={{ backgroundColor: config.bgColor }}>
        <div className="clash-type-badge" style={{ borderLeftColor: config.color }}>
          <span className="type-icon">{config.icon}</span>
          <div>
            <div className="type-name">{config.label}</div>
            <div className="type-day">📅 {clash.day}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="clash-content">
        {/* Entry A */}
        <div className="entry-column">
          <div className="entry-course" style={{ color: config.color }}>
            {A.course}
          </div>
          <div className="entry-details">
            <div className="detail-row">
              <span className="detail-label">👨‍🏫 Teacher</span>
              <span className="detail-value">{A.teacher}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">🏫 Room</span>
              <span className="detail-value">{A.room}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">⏰ Time</span>
              <span className="detail-value">{A.start} - {A.end}</span>
            </div>
            {A.year && (
              <div className="detail-row">
                <span className="detail-label">📚 Year</span>
                <span className="detail-value">Year {A.year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Conflict indicator */}
        <div className="conflict-separator">
          <div className="pulse-circle"></div>
          <div className="conflict-lines">
            <div className="line-top"></div>
            <div className="icon-center">⚡</div>
            <div className="line-bottom"></div>
          </div>
          <div className="pulse-circle"></div>
        </div>

        {/* Entry B */}
        <div className="entry-column">
          <div className="entry-course" style={{ color: config.color }}>
            {B.course}
          </div>
          <div className="entry-details">
            <div className="detail-row">
              <span className="detail-label">👨‍🏫 Teacher</span>
              <span className="detail-value">{B.teacher}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">🏫 Room</span>
              <span className="detail-value">{B.room}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">⏰ Time</span>
              <span className="detail-value">{B.start} - {B.end}</span>
            </div>
            {B.year && (
              <div className="detail-row">
                <span className="detail-label">📚 Year</span>
                <span className="detail-value">Year {B.year}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with action hint */}
      <div className="clash-footer" style={{ borderTopColor: config.color }}>
        <div style={{ fontSize: "12px", color: "#98a0b3" }}>
          💡 Check AI suggestions for resolution
        </div>
      </div>
    </div>
  );
}