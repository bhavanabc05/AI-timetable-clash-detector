import React from "react";

export default function ClashResults({ clashes }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Detected Clashes</h3>
        <div className="badge">{clashes ? clashes.length : 0}</div>
      </div>

      <div className="panel-body">
        {!clashes || clashes.length === 0 ? (
          <div className="no-clash">
            <div className="sparkle">🎉</div>
            <div>No clashes detected — nice!</div>
          </div>
        ) : (
          <div className="clash-grid">
            {clashes.map((c, idx) => (
              <div key={idx} className="clash-card">
                <div className="clash-type">{c.type}</div>
                <div className="clash-day">Day: {c.day}</div>
                <div className="entries">
                  {c.entries.map((e, i) => (
                    <div key={i} className="entry">
                      <div className="course">{e.course}</div>
                      <div className="meta">
                        <span>{e.teacher}</span> • <span>Room {e.room}</span> • <span>{e.start}–{e.end}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
