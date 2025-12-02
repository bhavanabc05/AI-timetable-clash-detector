// frontend/src/components/Analytics.js
import React, { useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Analytics({ clashes }) {
  // =====================================================
  // CALCULATED METRICS
  // =====================================================

  const metrics = useMemo(() => {
    if (!clashes || clashes.length === 0) {
      return {
        totalClashes: 0,
        clashByType: [],
        clashByDay: [],
        busyTeachers: [],
        busyRooms: [],
        busyYears: [],
        clashSeverity: { high: 0, medium: 0, low: 0 },
      };
    }

    // Total clashes
    const totalClashes = clashes.length;

    // Clashes by type
    const typeCount = {};
    clashes.forEach((c) => {
      typeCount[c.type] = (typeCount[c.type] || 0) + 1;
    });
    const clashByType = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));

    // Clashes by day
    const dayCount = {};
    clashes.forEach((c) => {
      dayCount[c.day] = (dayCount[c.day] || 0) + 1;
    });
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const clashByDay = dayOrder
      .filter((day) => dayCount[day])
      .map((day) => ({ day, clashes: dayCount[day] }));

    // Busy teachers (involved in clashes)
    const teacherClashes = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        teacherClashes[e.teacher] = (teacherClashes[e.teacher] || 0) + 1;
      });
    });
    const busyTeachers = Object.entries(teacherClashes)
      .map(([name, count]) => ({ name, clashes: count }))
      .sort((a, b) => b.clashes - a.clashes)
      .slice(0, 8);

    // Busy rooms (involved in clashes)
    const roomClashes = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        roomClashes[e.room] = (roomClashes[e.room] || 0) + 1;
      });
    });
    const busyRooms = Object.entries(roomClashes)
      .map(([name, count]) => ({ name, clashes: count }))
      .sort((a, b) => b.clashes - a.clashes)
      .slice(0, 8);

    // Busy years (involved in clashes)
    const yearClashes = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        yearClashes[e.year] = (yearClashes[e.year] || 0) + 1;
      });
    });
    const busyYears = Object.entries(yearClashes)
      .map(([name, count]) => ({ name: `Year ${name}`, clashes: count }))
      .sort((a, b) => b.clashes - a.clashes);

    // Clash severity calculation
    let high = 0, medium = 0, low = 0;
    clashes.forEach((c) => {
      if (c.entries.length > 2) high++;
      else if (teacherClashes[c.entries[0].teacher] >= 2) medium++;
      else low++;
    });

    return {
      totalClashes,
      clashByType,
      clashByDay,
      busyTeachers,
      busyRooms,
      busyYears,
      clashSeverity: { high, medium, low },
    };
  }, [clashes]);

  // =====================================================
  // COLOR PALETTE
  // =====================================================

  const COLORS = ["#6ef0ff", "#9b6bff", "#ff6b9d", "#ffa502"];
  const typeColors = {
    "Teacher Clash": "#ff6b9d",
    "Room Clash": "#ffa502",
    "Year Clash": "#6ef0ff",
  };

  // =====================================================
  // COMPONENT RENDERING
  // =====================================================

  return (
    <div className="analytics-dashboard">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Clashes"
          value={metrics.totalClashes}
          icon="⚡"
          color="#ff6b9d"
        />
        <KPICard
          title="High Severity"
          value={metrics.clashSeverity.high}
          icon="🔴"
          color="#ff6b9d"
        />
        <KPICard
          title="Medium Severity"
          value={metrics.clashSeverity.medium}
          icon="🟡"
          color="#ffa502"
        />
        <KPICard
          title="Low Severity"
          value={metrics.clashSeverity.low}
          icon="🟢"
          color="#4de6a4"
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Clash by Type */}
        {metrics.clashByType.length > 0 && (
          <ChartPanel title="Clashes by Type">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.clashByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.clashByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={typeColors[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} clashes`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Clashes by Day */}
        {metrics.clashByDay.length > 0 && (
          <ChartPanel title="Clashes by Day">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.clashByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="clashes" fill="#6ef0ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Busy Teachers - REMOVED fullWidth={true} */}
        {metrics.busyTeachers.length > 0 && (
          <ChartPanel title="Teachers with Most Clashes">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.busyTeachers}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="clashes" fill="#9b6bff" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Busy Rooms - REMOVED fullWidth={true} */}
        {metrics.busyRooms.length > 0 && (
          <ChartPanel title="Most Booked Rooms">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.busyRooms}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="clashes" fill="#ffa502" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Clash by Year */}
        {metrics.busyYears.length > 0 && (
          <ChartPanel title="Clashes by Year Level">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.busyYears}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="clashes" fill="#ff6b9d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}
      </div>
    </div>
  );
}

// =====================================================
// SUB COMPONENTS
// =====================================================

function KPICard({ title, value, icon, color }) {
  return (
    <div className="kpi-card" style={{ borderLeftColor: color }}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <div className="kpi-value">{value}</div>
        <div className="kpi-title">{title}</div>
      </div>
    </div>
  );
}

function ChartPanel({ title, children, fullWidth }) {
  return (
    <div className={`chart-panel ${fullWidth ? "full-width" : ""}`}>
      <h4 className="chart-title">{title}</h4>
      {children}
    </div>
  );
}