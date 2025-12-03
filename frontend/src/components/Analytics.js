// frontend/src/components/Analytics.js
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

/**
 * Enhanced Analytics Dashboard Component
 * Displays comprehensive timetable clash analytics
 * 
 * Features:
 * - 4 KPI cards with severity breakdown
 * - 5 interactive charts
 * - Responsive grid layout
 * - Professional styling & animations
 */
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

    // Busy teachers
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

    // Busy rooms
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

    // Busy years
    const yearClashes = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        yearClashes[e.year] = (yearClashes[e.year] || 0) + 1;
      });
    });
    const busyYears = Object.entries(yearClashes)
      .map(([name, count]) => ({ name: `Year ${name}`, clashes: count }))
      .sort((a, b) => b.clashes - a.clashes);

    // Clash severity
    let high = 0,
      medium = 0,
      low = 0;
    clashes.forEach((c) => {
      if (c.entries.length > 2) high++;
      else if (teacherClashes[c.entries[0]?.teacher] >= 2) medium++;
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
      {/* ===== KPI CARDS SECTION ===== */}
      <div className="kpi-section">
        <h2 className="section-title">Overview</h2>
        <div className="kpi-grid">
          <KPICard
            title="Total Clashes"
            value={metrics.totalClashes}
            icon="⚡"
            color="#ff6b9d"
            gradient="linear-gradient(135deg, #ff6b9d, #ff1493)"
            description={`${metrics.totalClashes} scheduling conflicts detected`}
          />
          <KPICard
            title="High Severity"
            value={metrics.clashSeverity.high}
            icon="🔴"
            color="#ff6b9d"
            gradient="linear-gradient(135deg, #ff6b9d, #ff4757)"
            description="3+ courses overlapping"
          />
          <KPICard
            title="Medium Severity"
            value={metrics.clashSeverity.medium}
            icon="🟡"
            color="#ffa502"
            gradient="linear-gradient(135deg, #ffa502, #ffb84d)"
            description="Repeated conflicts"
          />
          <KPICard
            title="Low Severity"
            value={metrics.clashSeverity.low}
            icon="🟢"
            color="#4de6a4"
            gradient="linear-gradient(135deg, #4de6a4, #26d0ce)"
            description="Single incidents"
          />
        </div>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="charts-section">
        <h2 className="section-title">Analysis</h2>

        {/* 1. Clash by Type */}
        {metrics.clashByType.length > 0 && (
          <ChartPanel
            title="Distribution by Clash Type"
            icon="📊"
            fullWidth={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.clashByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
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
                <Tooltip
                  formatter={(value) => `${value} clash${value !== 1 ? "es" : ""}`}
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* 2. Clashes by Day */}
        {metrics.clashByDay.length > 0 && (
          <ChartPanel title="Weekly Distribution" icon="📅" fullWidth={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.clashByDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="day" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="clashes"
                  fill="#6ef0ff"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* 3. Busy Teachers */}
        {metrics.busyTeachers.length > 0 && (
          <ChartPanel
            title="Most Conflicted Teachers"
            icon="👨‍🏫"
            fullWidth={true}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.busyTeachers}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="clashes"
                  fill="#9b6bff"
                  radius={[0, 8, 8, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* 4. Busy Rooms */}
        {metrics.busyRooms.length > 0 && (
          <ChartPanel title="Most Overbooked Rooms" icon="🏫" fullWidth={true}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.busyRooms}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="clashes"
                  fill="#ffa502"
                  radius={[0, 8, 8, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* 5. Clash by Year */}
        {metrics.busyYears.length > 0 && (
          <ChartPanel
            title="Impact by Student Year Level"
            icon="📚"
            fullWidth={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.busyYears}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="name" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,32,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="clashes"
                  fill="#ff6b9d"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}
      </div>

      {/* ===== EMPTY STATE ===== */}
      {metrics.totalClashes === 0 && (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <h3>No clashes detected</h3>
          <p>Your timetable is perfectly scheduled!</p>
        </div>
      )}
    </div>
  );
}

// =====================================================
// SUB COMPONENTS
// =====================================================

/**
 * KPI Card Component
 * Displays key performance indicator with icon and description
 */
function KPICard({
  title,
  value,
  icon,
  color,
  gradient,
  description,
}) {
  return (
    <div className="kpi-card" style={{ borderLeftColor: color }}>
      <div className="kpi-header">
        <div className="kpi-icon" style={{ background: gradient }}>
          {icon}
        </div>
        <div className="kpi-title">{title}</div>
      </div>

      <div className="kpi-value">{value}</div>
      <div className="kpi-description">{description}</div>

      <div className="kpi-badge" style={{ backgroundColor: `${color}20` }}>
        <span style={{ color }}>●</span>
        <span>{title.toLowerCase()}</span>
      </div>
    </div>
  );
}

/**
 * Chart Panel Component
 * Container for chart with title and styling
 */
function ChartPanel({ title, icon, children, fullWidth }) {
  return (
    <div className={`chart-panel ${fullWidth ? "full-width" : ""}`}>
      <div className="chart-header">
        <div className="chart-icon">{icon}</div>
        <h3 className="chart-title">{title}</h3>
      </div>
      <div className="chart-body">{children}</div>
    </div>
  );
}