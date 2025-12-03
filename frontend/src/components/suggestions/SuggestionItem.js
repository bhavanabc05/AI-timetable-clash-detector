// frontend/src/components/suggestions/SuggestionItem.jsx
import React from "react";
import "./SuggestionItem.css";

/**
 * SuggestionItem Component
 * Individual suggestion card with confidence visualization
 * 
 * @param {Object} suggestion - Single suggestion object
 * @param {Number} index - Position in list
 * @param {Number} groupIndex - Group position
 * @param {Boolean} isExpanded - Is card expanded
 * @param {Function} onToggle - Toggle expand/collapse
 */
export default function SuggestionItem({
  suggestion,
  index,
  groupIndex,
  isExpanded,
  onToggle,
}) {
  const confidence = Math.round(suggestion.confidence * 100);

  // Determine confidence level and color
  const getConfidenceLevel = (conf) => {
    if (conf >= 80) return { level: "High", color: "#4de6a4", icon: "⭐⭐⭐" };
    if (conf >= 60) return { level: "Medium", color: "#ffa502", icon: "⭐⭐" };
    return { level: "Low", color: "#ff6b9d", icon: "⭐" };
  };

  const confLevel = getConfidenceLevel(confidence);

  // Determine suggestion priority and icon
  const getSuggestionPriority = (fix) => {
    if (fix.includes("Move") || fix.includes("Swap")) return "priority-high";
    if (fix.includes("Reschedule") || fix.includes("Alternative")) return "priority-medium";
    return "priority-low";
  };

  const priority = getSuggestionPriority(suggestion.fix);

  return (
    <div
      className={`suggestion-item ${priority}`}
      style={{
        animationDelay: `${(groupIndex * 3 + index) * 0.05}s`,
      }}
    >
      {/* Card Header - Always Visible */}
      <div
        className="suggestion-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter") onToggle();
        }}
      >
        {/* Confidence Visual */}
        <div className="confidence-indicator" style={{ backgroundColor: confLevel.color }}>
          <span className="confidence-icon">{confLevel.icon}</span>
          <span className="confidence-percent">{confidence}%</span>
        </div>

        {/* Main Content */}
        <div className="suggestion-main">
          <div className="suggestion-fix">{suggestion.fix}</div>
          <div className="suggestion-issue">{suggestion.issue}</div>
        </div>

        {/* Expand Toggle */}
        <div className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
          ⮕
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="suggestion-details">
          <div className="details-row">
            <span className="detail-label">📊 Confidence Level</span>
            <span className="detail-value">
              {confLevel.level} ({confidence}%)
            </span>
          </div>

          <div className="confidence-bar-wrapper">
            <div
              className="confidence-bar"
              style={{
                width: `${confidence}%`,
                backgroundColor: confLevel.color,
              }}
            ></div>
          </div>

          <div className="details-row">
            <span className="detail-label">🎯 Recommended Fix</span>
            <span className="detail-value highlight">{suggestion.fix}</span>
          </div>

          <div className="details-row">
            <span className="detail-label">⚠️ Related Issue</span>
            <span className="detail-value">{suggestion.issue}</span>
          </div>

          {suggestion.clashType && (
            <div className="details-row">
              <span className="detail-label">🏷️ Clash Type</span>
              <span className="detail-value">{suggestion.clashType}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="suggestion-actions">
            <button className="action-btn primary" onClick={() => copyToClipboard(suggestion.fix)}>
              📋 Copy Fix
            </button>
            <button className="action-btn secondary">
              ✅ Mark as Applied
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Suggestion copied to clipboard!");
}