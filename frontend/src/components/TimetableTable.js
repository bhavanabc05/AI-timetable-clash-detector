import React from "react";

export default function TimetableTable({ clashes }) {
  if (!clashes || clashes.length === 0)
    return <p>No timetable loaded.</p>;

  const rows = [];

  clashes.forEach((c) => {
    c.entries.forEach((e) => rows.push(e));
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table border="1" cellPadding="6">
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
              <td>{r.course}</td>
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
  );
}
