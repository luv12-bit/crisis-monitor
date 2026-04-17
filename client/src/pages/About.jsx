import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import useResponsive from "../hooks/useResponsive";

// ── Inline SVG icons — zero dependencies ──────────────────────────────────────
const Icon = ({ children, size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

const IconSignal = (p) => (
  <Icon {...p}>
    <path d="M2 20h.01" />
    <path d="M7 20v-4" />
    <path d="M12 20v-8" />
    <path d="M17 20V8" />
    <path d="M22 4v16" />
  </Icon>
);
const IconBrain = (p) => (
  <Icon {...p}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.49-4.27A3 3 0 0 1 5 12a3 3 0 0 1 .5-1.67 2.5 2.5 0 0 1-.09-4.83A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.49-4.27A3 3 0 0 0 19 12a3 3 0 0 0-.5-1.67 2.5 2.5 0 0 0 .09-4.83A2.5 2.5 0 0 0 14.5 2Z" />
  </Icon>
);
const IconMap = (p) => (
  <Icon {...p}>
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" />
    <path d="M9 3.236v15" />
  </Icon>
);
const IconBell = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);
const IconBarChart2 = (p) => (
  <Icon {...p}>
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </Icon>
);
const IconFileText = (p) => (
  <Icon {...p}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </Icon>
);
// ──────────────────────────────────────────────────────────────────────────────

const features = [
  {
    Icon: IconSignal,
    title: "Live Data Pipeline",
    desc: "Fetches from WHO, ACLED, GDELT & NewsAPI every 6 hours automatically.",
  },
  {
    Icon: IconBrain,
    title: "AI Risk Prediction",
    desc: "Random Forest model predicts crisis risk score (0-100%) per country.",
  },
  {
    Icon: IconMap,
    title: "Interactive World Map",
    desc: "Leaflet heatmap shows real-time crisis hotspots across 195+ countries.",
  },
  {
    Icon: IconBell,
    title: "Alert Subscriptions",
    desc: "Users subscribe to regions and get notified when risk spikes.",
  },
  {
    Icon: IconBarChart2,
    title: "Crisis Analytics",
    desc: "Charts visualize severity distribution, trends & type breakdown.",
  },
  {
    Icon: IconFileText,
    title: "Region Intelligence",
    desc: "Per-country briefing reports with full event history & ML score.",
  },
];

const COLORS = {
  conflict: "#f43f5e",
  famine: "#f97316",
  disease: "#8b5cf6",
  disaster: "#f59e0b",
  economic: "#14b8a6",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0d1220",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "12px 16px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          fontSize: "12px",
          margin: "0 0 6px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            color: p.color,
            fontSize: "13px",
            fontWeight: "700",
            margin: "2px 0",
          }}
        >
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function About() {
  const [events, setEvents] = useState([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    axios
      .get("${process.env.REACT_APP_API_URL}/api/crisis/events")
      .then((res) => setEvents(res.data))
      .catch(() => {});
  }, []);

  const typeData = [
    "conflict",
    "famine",
    "disease",
    "disaster",
    "economic",
  ].map((type) => ({
    type,
    count: events.filter((e) => e.type === type).length,
  }));

  const pieData = typeData
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: d.type,
      value: d.count,
      color: COLORS[d.type],
    }));

  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    });
    const dateStr = d.toISOString().slice(0, 10);
    last14.push({
      date: label,
      events: events.filter((e) => e.eventDate?.slice(0, 10) === dateStr)
        .length,
      critical: events.filter(
        (e) => e.eventDate?.slice(0, 10) === dateStr && e.severity >= 8,
      ).length,
    });
  }

  const regionData = Object.entries(
    events.reduce((acc, e) => {
      acc[e.region] = (acc[e.region] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([region, count]) => ({
      region: region.split(" ").slice(-1)[0],
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const avgSeverityByType = [
    "conflict",
    "famine",
    "disease",
    "disaster",
    "economic",
  ].map((type) => {
    const typeEvents = events.filter((e) => e.type === type);
    const avg = typeEvents.length
      ? (
          typeEvents.reduce((a, e) => a + e.severity, 0) / typeEvents.length
        ).toFixed(1)
      : 0;
    return { type, avg: parseFloat(avg), color: COLORS[type] };
  });

  // Responsive chart row style
  const chartRow = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <p style={s.label}>ABOUT THE PROJECT</p>
        <h1 style={s.title}>Shadow Crisis Monitor</h1>
        <p style={s.sub}>
          A full-stack AI-powered platform that detects global crises before
          headlines by fusing live data from multiple sources with machine
          learning prediction.
        </p>
      </div>

      {/* PROBLEM CARD */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>The Problem We Solve</h2>
        <p style={s.cardText}>
          Every major crisis — famine, armed conflict, disease outbreak,
          economic collapse — has early warning signals days or weeks before it
          explodes. No existing free tool monitors ALL signals together in real
          time and predicts risk before headlines catch it. Shadow Crisis
          Monitor fills this gap.
        </p>
        <div style={s.targetRow}>
          {[
            "NGOs",
            "Journalists",
            "Researchers",
            "Govt Analysts",
            "Students",
          ].map((t, i) => (
            <span key={i} style={s.pill}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={s.section}>
        <h2 style={s.secTitle}>Key Features</h2>
        <div style={s.featGrid}>
          {features.map(({ Icon: FeatureIcon, title, desc }, i) => (
            <div key={i} style={s.featCard}>
              <span style={s.featIconWrap}>
                <FeatureIcon size={18} style={{ color: "#00f5d4" }} />
              </span>
              <div>
                <h3 style={s.featTitle}>{title}</h3>
                <p style={s.featDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={s.section}>
        <p style={s.label}>LIVE CRISIS ANALYTICS</p>
        <h2 style={s.secTitle}>Real-time Data Insights</h2>

        {/* Row 1 — Bar + Pie */}
        <div style={chartRow}>
          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Events by Crisis Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={typeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="type"
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                  {typeData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[entry.type]}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Crisis Type Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(val) => (
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono'",
                      }}
                    >
                      {val}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 — Area chart */}
        <div style={{ ...s.chartCard, marginBottom: "20px" }}>
          <h3 style={s.chartTitle}>Event Activity — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={last14}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f5d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "#475569",
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono'",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="events"
                name="All Events"
                stroke="#00f5d4"
                strokeWidth={2}
                fill="url(#gradEvents)"
              />
              <Area
                type="monotone"
                dataKey="critical"
                name="Critical (8+)"
                stroke="#f43f5e"
                strokeWidth={2}
                fill="url(#gradCritical)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Row 3 — Region + Avg severity */}
        <div style={chartRow}>
          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Top Affected Regions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={regionData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar
                  dataKey="count"
                  name="Events"
                  radius={[0, 6, 6, 0]}
                  fill="#8b5cf6"
                  fillOpacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Avg Severity by Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={avgSeverityByType}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="type"
                  tick={{
                    fill: "#475569",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono'",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fill: "#475569", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="avg" name="Avg Severity" radius={[6, 6, 0, 0]}>
                  {avgSeverityByType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PIPELINE */}
      <div style={s.section}>
        <h2 style={s.secTitle}>Data Pipeline</h2>
        <div style={s.pipeline}>
          {[
            {
              step: "01",
              title: "Fetch",
              desc: "NewsAPI + WHO + ACLED + GDELT pull real crisis data every 6 hours.",
            },
            {
              step: "02",
              title: "Process",
              desc: "ETL pipeline cleans, classifies and stores events in MongoDB.",
            },
            {
              step: "03",
              title: "Predict",
              desc: "Random Forest reads events and outputs risk scores per country.",
            },
            {
              step: "04",
              title: "Display",
              desc: "React dashboard renders heatmap, charts and ML predictions.",
            },
          ].map((p, i) => (
            <div key={i} style={s.pipeCard}>
              <div style={s.pipeStep}>{p.step}</div>
              <div>
                <div style={s.pipeTitle}>{p.title}</div>
                <div style={s.pipeDesc}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#060912",
    color: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  header: { textAlign: "center", marginBottom: "56px" },
  label: {
    fontSize: "10px",
    color: "#00f5d4",
    letterSpacing: "4px",
    marginBottom: "12px",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: "700",
    margin: "0 0 10px",
  },
  title: {
    fontSize: "clamp(32px,5vw,52px)",
    fontWeight: "800",
    margin: "0 0 20px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-1.5px",
    background: "linear-gradient(135deg,#ffffff,#00f5d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sub: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: 1.8,
    maxWidth: "640px",
    margin: "0 auto",
  },
  card: {
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "32px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 16px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  cardText: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: 1.8,
    margin: "0 0 20px",
  },
  targetRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  pill: {
    padding: "5px 14px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    background: "rgba(0,245,212,0.08)",
    color: "#00f5d4",
    border: "1px solid rgba(0,245,212,0.2)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  section: { marginBottom: "48px" },
  secTitle: {
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 24px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.5px",
  },
  featGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  featCard: {
    display: "flex",
    gap: "16px",
    padding: "16px 20px",
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    alignItems: "flex-start",
  },
  featIconWrap: {
    flexShrink: 0,
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
  },
  featTitle: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  featDesc: { fontSize: "13px", color: "#334155", lineHeight: 1.6, margin: 0 },
  chartCard: {
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "20px 24px",
  },
  chartTitle: {
    fontSize: "14px",
    fontWeight: "700",
    margin: "0 0 16px",
    fontFamily: "'Space Grotesk', sans-serif",
    color: "#94a3b8",
  },
  pipeline: { display: "flex", flexDirection: "column", gap: "12px" },
  pipeCard: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderLeft: "3px solid #00f5d4",
    borderRadius: "12px",
    alignItems: "flex-start",
  },
  pipeStep: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#00f5d4",
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    opacity: 0.4,
  },
  pipeTitle: {
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 6px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  pipeDesc: { fontSize: "13px", color: "#334155", lineHeight: 1.6 },
};
