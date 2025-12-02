import React from "react";
import SuggestionItem from "./SuggestionItem";

export default function SuggestionsPanel({ suggestions }) {
  return (
    <div className="card" style={{ marginBottom: '12px', borderLeft: '4px solid #00f0ff' }}>
      <h3 className="section-title">⚡ AI Suggestions</h3>
      <ul style={{ paddingLeft: '20px', margin: '10px 0', color: '#ccc' }}>
        {suggestions.map((suggestion, idx) => (
          <SuggestionItem key={idx} suggestion={suggestion} />
        ))}
      </ul>
    </div>
  );
}