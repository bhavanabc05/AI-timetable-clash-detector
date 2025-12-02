// frontend/src/components/sections/ResultsSection.jsx
import React from "react";
import ClashResults from "../ClashResults";
import SuggestionsPanel from "../suggestions/SuggestionsPanel";

/**
 * ResultsSection Component
 * Displays detected clashes and AI-generated suggestions
 * 
 * Features:
 * - Professional clash card layout
 * - AI suggestions panel
 * - Empty state handling
 * 
 * @param {Array} clashes - Array of detected clashes
 * @param {Array} suggestions - Array of AI suggestions
 */
export default function ResultsSection({ clashes, suggestions }) {
  return (
    <section className="results-section">
      {/* ========================================
          CLASH RESULTS
          ======================================== */}
      <ClashResults clashes={clashes} />

      {/* ========================================
          AI SUGGESTIONS (if clashes exist)
          ======================================== */}
      {suggestions && suggestions.length > 0 && (
        <>
          <div style={{ height: "8px" }} />
          <SuggestionsPanel suggestions={suggestions} />
        </>
      )}
    </section>
  );
}