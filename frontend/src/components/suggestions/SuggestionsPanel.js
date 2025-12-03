// frontend/src/components/suggestions/SuggestionsPanel.jsx
import React, { useState } from "react";
import SuggestionItem from "./SuggestionItem";
import "./SuggestionsPanel.css";

/**
 * SuggestionsPanel Component
 * Displays AI-generated suggestions with professional styling
 * 
 * @param {Array} suggestions - Array of suggestion objects from backend
 */
export default function SuggestionsPanel({ suggestions }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  // Group suggestions by issue for better organization
  const groupedSuggestions = suggestions.reduce((acc, suggestion, idx) => {
    const type = suggestion.clashType || "General";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ ...suggestion, originalIndex: idx });
    return acc;
  }, {});

  const suggestionTypes = Object.keys(groupedSuggestions);

  return (
    <div className="suggestions-panel">
      {/* Header */}
      <div className="suggestions-header">
        <div className="header-content">
          <div className="header-icon">💡</div>
          <div className="header-text">
            <h3>AI-Powered Suggestions</h3>
            <p>Intelligent solutions to resolve scheduling conflicts</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-number">{suggestions.length}</span>
          <span className="badge-label">Fixes</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="suggestions-stats">
        <div className="stat-item">
          <span className="stat-value">
            {suggestions.filter((s) => s.confidence >= 0.8).length}
          </span>
          <span className="stat-label">High Confidence</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">
            {suggestions.filter((s) => s.confidence >= 0.5 && s.confidence < 0.8).length}
          </span>
          <span className="stat-label">Medium Confidence</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">
            {suggestions.filter((s) => s.confidence < 0.5).length}
          </span>
          <span className="stat-label">Low Confidence</span>
        </div>
      </div>

      {/* Suggestions by Type */}
      <div className="suggestions-container">
        {suggestionTypes.map((type, typeIdx) => (
          <div key={typeIdx} className="suggestion-group">
            {/* Group Header */}
            <div className="group-header">
              <h4 className="group-title">
                {type === "Teacher Clash" && "👨‍🏫"}
                {type === "Room Clash" && "🏫"}
                {type === "Year Clash" && "📚"}
                {type === "General" && "⚡"} {type}
              </h4>
              <span className="group-count">
                {groupedSuggestions[type].length}
              </span>
            </div>

            {/* Suggestions in Group */}
            <div className="suggestions-list">
              {groupedSuggestions[type].map((suggestion, itemIdx) => (
                <SuggestionItem
                  key={suggestion.originalIndex}
                  suggestion={suggestion}
                  index={itemIdx}
                  groupIndex={typeIdx}
                  isExpanded={expandedIndex === suggestion.originalIndex}
                  onToggle={() =>
                    setExpandedIndex(
                      expandedIndex === suggestion.originalIndex
                        ? null
                        : suggestion.originalIndex
                    )
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="suggestions-footer">
        <div className="footer-content">
          <span className="footer-icon">🎯</span>
          <div>
            <strong>Ready to implement?</strong>
            <p>Review suggestions and apply fixes to resolve all clashes</p>
          </div>
        </div>
      </div>
    </div>
  );
}