// frontend/src/components/Header.js
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and hook

export default function Header() {
  const location = useLocation(); // To highlight active link

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#6c5ce7" : "#666",
    textDecoration: "none",
    fontWeight: "bold",
    marginRight: "20px",
    paddingBottom: "5px",
    borderBottom: location.pathname === path ? "2px solid #6c5ce7" : "none"
  });

  return (
    <header className="topbar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
          <div className="logo-glow">AI</div>
          <div>
            <div className="title">Timetable AI</div>
          </div>
        </Link>
        
        {/* New Navigation Links */}
        <nav style={{ marginLeft: "40px" }}>
          <Link to="/" style={linkStyle("/")}>Home</Link>
          <Link to="/analytics" style={linkStyle("/analytics")}>Analytics</Link>
        </nav>
      </div>

      <div className="status">
        <div className="status-badge">✨ Ready to analyze</div>
      </div>
    </header>
  );
}