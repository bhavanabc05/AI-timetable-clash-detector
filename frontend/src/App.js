// frontend/src/App.js
import React, { useState, useCallback } from "react";
import { uploadTimetable, fetchSuggestions } from "./api/api";
import Header from "./components/Header";
import UploadSection from "./components/sections/UploadSection";
import ResultsSection from "./components/sections/ResultsSection";
import AnalyticsSection from "./components/sections/AnalyticsSection";
import "./index.css";
import "./App.css";

// ============================================
// CUSTOM HOOKS - State Logic
// ============================================

/**
 * useTimetableData Hook
 * Manages all timetable-related state in one place
 * - Clashes: detected scheduling conflicts
 * - Suggestions: AI-generated fixes
 * - Timetable: parsed CSV data
 * - Loading/Error: UI state management
 */
function useTimetableData() {
  const [clashes, setClashes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFile, setLastFile] = useState(null);

  const reset = useCallback(() => {
    setClashes([]);
    setSuggestions([]);
    setTimetable([]);
    setError(null);
    setLastFile(null);
  }, []);

  return {
    clashes,
    setClashes,
    suggestions,
    setSuggestions,
    timetable,
    setTimetable,
    loading,
    setLoading,
    error,
    setError,
    lastFile,
    setLastFile,
    reset,
  };
}

// ============================================
// SERVICE LAYER - API Logic
// ============================================

/**
 * processTimetableUpload
 * Orchestrates the complete upload workflow:
 * 1. Upload CSV file
 * 2. Parse and detect clashes
 * 3. Generate AI suggestions (if clashes exist)
 * 4. Handle errors gracefully
 *
 * @param {File} file - CSV file from user
 * @param {Object} handlers - State setter functions
 */
async function processTimetableUpload(file, handlers) {
  const {
    setClashes,
    setSuggestions,
    setTimetable,
    setLoading,
    setError,
    setLastFile,
  } = handlers;

  // Reset previous state
  setError(null);
  setLoading(true);
  setLastFile(file?.name || null);
  setSuggestions([]);

  try {
    // ============================================
    // Step 1: Upload and detect clashes
    // ============================================
    console.log("📤 Uploading file:", file?.name);
    const uploadRes = await uploadTimetable(file);

    if (!uploadRes.success) {
      throw new Error(uploadRes.error || "Upload failed");
    }

    console.log("✅ Upload successful");
    console.log("📊 Total entries:", uploadRes.totalEntries);
    console.log("⚠️ Clashes detected:", uploadRes.clashes?.length || 0);

    setClashes(uploadRes.clashes || []);
    setTimetable(uploadRes.timetable || []);

    // ============================================
    // Step 2: Fetch AI suggestions if clashes exist
    // ============================================
    if (uploadRes.clashes && uploadRes.clashes.length > 0) {
      try {
        console.log("🤖 Fetching AI suggestions...");
        const suggestRes = await fetchSuggestions(
          uploadRes.timetable || [],
          uploadRes.clashes
        );

        console.log("💡 Suggestions generated:", suggestRes.suggestions?.length || 0);
        setSuggestions(suggestRes.suggestions || []);
      } catch (suggestErr) {
        console.warn("⚠️ Could not fetch suggestions:", suggestErr);
        console.warn("📌 Note: Clashes detected but suggestions unavailable");
        // Don't fail the whole operation if suggestions fail
        // User can still see clash details
      }
    } else {
      console.log("🎉 No clashes detected - timetable is clean!");
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    setError(err.message || "Upload failed");
    setClashes([]);
    setTimetable([]);
  } finally {
    setLoading(false);
  }
}

// ============================================
// MAIN APP COMPONENT
// ============================================

/**
 * App Component
 * Main entry point of the application
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────┐
 * │          HEADER                     │
 * ├───────────────────────┬─────────────┤
 * │                       │             │
 * │  LEFT SECTION:        │   RIGHT:    │
 * │  - Upload Card        │   Analytics │
 * │  - Clashes Results    │   Dashboard │
 * │  - AI Suggestions     │             │
 * │                       │             │
 * ├───────────────────────┴─────────────┤
 * │          FOOTER                     │
 * └─────────────────────────────────────┘
 */
export default function App() {
  // Initialize all state
  const timetableData = useTimetableData();
  const { clashes, suggestions, loading, error, reset } = timetableData;

  /**
   * handleUpload
   * Callback triggered when user selects a CSV file
   */
  const handleUpload = useCallback(
    (file) => processTimetableUpload(file, timetableData),
    [timetableData]
  );

  /**
   * handleReset
   * Clears all data and returns to initial state
   * Triggered by error dismiss button
   */
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="app">
      {/* ========================================
          HEADER: Branding & Status
          ======================================== */}
      <Header />

      {/* ========================================
          MAIN CONTENT: Two-column layout
          ======================================== */}
      <main className="container">
        {/* LEFT COLUMN: Upload & Results */}
        <div className="left">
          {/* Upload Section with file input & error handling */}
          <UploadSection
            onUpload={handleUpload}
            loading={loading}
            error={error}
            onReset={handleReset}
          />

          {/* Clash Results & AI Suggestions */}
          <ResultsSection clashes={clashes} suggestions={suggestions} />
        </div>

        {/* RIGHT COLUMN: Analytics Dashboard */}
        <div className="right">
          <AnalyticsSection clashes={clashes} />
        </div>
      </main>

      {/* ========================================
          FOOTER: Credit & Info
          ======================================== */}
      <footer className="footer">
        <div>Built with ⚡ AI vibes</div>
        <div className="muted">Frontend • Backend integrated</div>
      </footer>
    </div>
  );
}