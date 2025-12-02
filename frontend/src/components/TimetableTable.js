import React from "react";

export default function TimetableTable({ clashes }) {
  // reconstruct unique rows from clash entries (backend returns entries with start/end)
  const rowsMap = new Map();
  if (clashes && clashes.length) {
    clashes.forEach((c) => c.entries.forEach((e) => {
      const key = `${e.course}-${e.day}-${e.start}-${e.end}-${e.room}-${e.teacher}`;
      rowsMap.set(key, e);
    }));
  }

  const rows = Array.from(rowsMap.values());

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Timetable Preview</h3>
        <div className="muted">{rows.length} rows</div>
      </div>

      <div className="panel-body">
        {rows.length === 0 ? (
          <div className="empty">No timetable loaded.</div>
        ) : (
          <div className="table-wrap">
            <table className="fancy-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="cell-course">{r.course}</td>
                    <td>{r.teacher}</td>
                    <td>{r.year}</td>
                    <td>{r.room}</td>
                    <td>{r.day}</td>
                    <td>{r.start}</td>
                    <td>{r.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
