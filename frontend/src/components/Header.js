// frontend/src/components/Header.jsx
import React from "react";

/**
 * Header Component
 * Displays app branding and status information
 * 
 * Features:
 * - Logo with glow animation
 * - App title and tagline
 * - Clean, professional design
 */
export default function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        {/* Animated Logo */}
        <div className="logo-glow">AI</div>

        {/* Title & Tagline */}
        <div>
          <div className="title">AI Timetable Clash Detector</div>
          <div className="subtitle">
            Intelligent clash detection • AI-powered suggestions
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="status">
        <div className="status-badge">✨ Ready to analyze</div>
      </div>
    </header>
  );
}