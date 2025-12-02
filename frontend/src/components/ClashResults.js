import React from "react";

export default function ClashResults({ clashes }) {
  if (!clashes) return null;

  return (
    <div>
      <h3>Detected Clashes</h3>

      {clashes.length === 0 ? (
        <p>No clashes 🎉</p>
      ) : (
        clashes.map((c, i) => (
          <div key={i} style={{ padding: 8, marginBottom: 10, background: "#ffe9e9" }}>
            <strong>{c.type}</strong>
            <div>Day: {c.day}</div>

            {c.entries.map((e, idx) => (
              <div key={idx} style={{ marginLeft: 10 }}>
                {e.course} — {e.teacher} — {e.start}-{e.end} (Room {e.room})
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
