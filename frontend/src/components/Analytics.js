// frontend/src/components/Analytics.js
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

export default function Analytics({ clashes }) {
  const metrics = useMemo(() => {
    if (!clashes || clashes.length === 0) {
      return {
        totalClashes: 0,
        clashByType: [],
        clashByDay: [],
        clashByTime: [],
        teacherWorkload: [],
        busyTeachers: [],
        busyRooms: [],
        busyYears: [],
        clashIntensity: [],
        roomUtilization: [],
        yearDistribution: [],
        clashSeverity: { high: 0, medium: 0, low: 0 },
      };
    }

    const totalClashes = clashes.length;

    // 1. Clashes by Type
    const typeCount = {};
    clashes.forEach((c) => {
      typeCount[c.type] = (typeCount[c.type] || 0) + 1;
    });
    const clashByType = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));

    // 2. Clashes by Day
    const dayCount = {};
    clashes.forEach((c) => {
      dayCount[c.day] = (dayCount[c.day] || 0) + 1;
    });
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const clashByDay = dayOrder
      .filter((day) => dayCount[day])
      .map((day) => ({ day, clashes: dayCount[day] }));

    // 3. Clashes by Time (extracted from start time)
    const timeCount = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        const hour = e.start.split(":")[0];
        const timeSlot = `${hour}:00`;
        timeCount[timeSlot] = (timeCount[timeSlot] || 0) + 1;
      });
    });
    const clashByTime = Object.entries(timeCount)
      .map(([time, count]) => ({ time, clashes: count }))
      .sort((a, b) => parseInt(a.time) - parseInt(b.time));

    // 4. Teacher Workload Distribution
    const teacherWorkload = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        if (!teacherWorkload[e.teacher]) {
          teacherWorkload[e.teacher] = { teacher: e.teacher, clashes: 0, classes: 0 };
        }
        teacherWorkload[e.teacher].clashes++;
      });
    });
    const teacherWorkloadData = Object.values(teacherWorkload)
      .sort((a, b) => b.clashes - a.clashes)
      .slice(0, 6);

    // 5. Busy Teachers
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

    // 6. Busy Rooms
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

    // 7. Busy Years
    const yearClashes = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        yearClashes[e.year] = (yearClashes[e.year] || 0) + 1;
      });
    });
    const busyYears = Object.entries(yearClashes)
      .map(([name, count]) => ({ name: `Year ${name}`, clashes: count }))
      .sort((a, b) => b.clashes - a.clashes);

    // 8. Clash Intensity (scatter plot: day vs clashes per entry)
    const clashIntensity = clashes.map((c, idx) => ({
      day: dayOrder.indexOf(c.day),
      entries: c.entries.length,
      type: c.type,
      label: c.day,
    }));

    // 9. Room Utilization (percentage of clashes per room)
    const roomUtil = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        if (!roomUtil[e.room]) {
          roomUtil[e.room] = { room: e.room, usage: 0 };
        }
        roomUtil[e.room].usage++;
      });
    });
    const roomUtilization = Object.values(roomUtil)
      .map((r) => ({
        ...r,
        utilization: Math.round((r.usage / totalClashes) * 100),
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 6);

    // 10. Year Distribution
    const yearDist = {};
    clashes.forEach((c) => {
      c.entries.forEach((e) => {
        yearDist[e.year] = (yearDist[e.year] || 0) + 1;
      });
    });
    const yearDistribution = Object.entries(yearDist)
      .map(([year, count]) => ({
        name: `Year ${year}`,
        clashes: count,
        percentage: Math.round((count / totalClashes) * 100),
      }))
      .sort((a, b) => b.clashes - a.clashes);

    // 11. Clash Severity
    let high = 0, medium = 0, low = 0;
    clashes.forEach((c) => {
      if (c.entries.length > 2) high++;
      else if (teacherClashes[c.entries[0]?.teacher] >= 2) medium++;
      else low++;
    });

    return {
      totalClashes,
      clashByType,
      clashByDay,
      clashByTime,
      teacherWorkload: teacherWorkloadData,
      busyTeachers,
      busyRooms,
      busyYears,
      clashIntensity,
      roomUtilization,
      yearDistribution,
      clashSeverity: { high, medium, low },
    };
  }, [clashes]);

  const COLORS = ["#6ef0ff", "#9b6bff", "#ff6b9d", "#ffa502"];
  const typeColors = {
    "Teacher Clash": "#ff6b9d",
    "Room Clash": "#ffa502",
    "Year Clash": "#6ef0ff",
  };

  return (
    <div className="analytics-dashboard">
      {/* KPI CARDS */}
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

      {/* CHARTS SECTION */}
      <div className="charts-section">
        <h2 className="section-title">Analysis</h2>

        {/* Row 1: Type & Day & Time */}
        {metrics.clashByType.length > 0 && (
          <ChartPanel title="Distribution by Clash Type" icon="📊" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
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
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {metrics.clashByDay.length > 0 && (
          <ChartPanel title="Weekly Distribution" icon="📅" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.clashByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="clashes" fill="#6ef0ff" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {metrics.clashByTime.length > 0 && (
          <ChartPanel title="Clashes by Time Slot" icon="🕐" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={metrics.clashByTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="clashes" stroke="#9b6bff" strokeWidth={2} dot={{ fill: "#9b6bff", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Row 2: Teacher Workload & Room Utilization */}
        {metrics.teacherWorkload.length > 0 && (
          <ChartPanel title="Teacher Workload Distribution" icon="👥" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={metrics.teacherWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="teacher" angle={-45} textAnchor="end" height={80} stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="clashes" stroke="#4de6a4" fill="url(#colorClashes)" animationDuration={800} />
                <defs>
                  <linearGradient id="colorClashes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4de6a4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4de6a4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {metrics.roomUtilization.length > 0 && (
          <ChartPanel title="Room Utilization Rate" icon="🏢" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.roomUtilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="room" angle={-45} textAnchor="end" height={80} stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} 
                  formatter={(value) => `${value}%`} />
                <Bar dataKey="utilization" fill="#ff6b9d" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Row 3: Clash Intensity & Year Distribution */}
        {metrics.clashIntensity.length > 0 && (
          <ChartPanel title="Clash Intensity by Day" icon="📍" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" type="number" stroke="#98a0b3" name="Day" />
                <YAxis dataKey="entries" type="number" stroke="#98a0b3" name="Entries" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                <Scatter name="Clashes" data={metrics.clashIntensity} fill="#ffa502" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {metrics.yearDistribution.length > 0 && (
          <ChartPanel title="Year-wise Impact Analysis" icon="📈" fullWidth={false}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.yearDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#98a0b3" />
                <YAxis stroke="#98a0b3" />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="clashes" fill="#6ef0ff" radius={[8, 8, 0, 0]} animationDuration={800} />
                <Bar dataKey="percentage" fill="#9b6bff" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {/* Row 4: Full Width Charts */}
        {metrics.busyTeachers.length > 0 && (
          <ChartPanel title="Most Conflicted Teachers" icon="👨‍🏫" fullWidth={true}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.busyTeachers} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={140} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="clashes" fill="#9b6bff" radius={[0, 8, 8, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}

        {metrics.busyRooms.length > 0 && (
          <ChartPanel title="Most Overbooked Rooms" icon="🏫" fullWidth={true}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.busyRooms} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#98a0b3" />
                <YAxis dataKey="name" type="category" stroke="#98a0b3" width={90} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,23,32,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="clashes" fill="#ffa502" radius={[0, 8, 8, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        )}
      </div>

      {/* EMPTY STATE */}
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

// SUB COMPONENTS
function KPICard({ title, value, icon, color, gradient, description }) {
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