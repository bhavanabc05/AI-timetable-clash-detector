import React from "react";

export default function SuggestionItem({ suggestion }) {
  const confidencePercent = (suggestion.confidence * 100).toFixed(0);
  
  return (
    <li style={{ marginBottom: '8px' }}>
      <strong style={{ color: '#fff' }}>{suggestion.fix}</strong>
      <div style={{ fontSize: '0.85em', opacity: 0.7 }}>
        {suggestion.issue} (Confidence: {confidencePercent}%)
      </div>
    </li>
  );
}