import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Charts({ clashes }) {
  const canvasRef = useRef();

  useEffect(() => {
    const rows = [];
    if (clashes && clashes.length) {
      clashes.forEach(c => c.entries.forEach(e => rows.push(e)));
    }
    const counts = {};
    rows.forEach(r => { counts[r.teacher = r.teacher || "Unknown"] = (counts[r.teacher] || 0) + 1; });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Classes per teacher",
          data,
          borderWidth: 0,
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });

    return () => chart.destroy();
  }, [clashes]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Analytics</h3>
        <div className="muted">Teacher workload</div>
      </div>
      <div className="panel-body" style={{height:220}}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
