import { useEffect, useState } from "react";
import axios from "axios";

// Inline SVG icons — no external dependency needed
const Brain = ({ size = 16, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.49-4.27A3 3 0 0 1 5 12a3 3 0 0 1 .5-1.67 2.5 2.5 0 0 1-.09-4.83A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.49-4.27A3 3 0 0 0 19 12a3 3 0 0 0-.5-1.67 2.5 2.5 0 0 0 .09-4.83A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const AlertTriangle = ({ size = 16, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const Radio = ({ size = 16, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
    <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
  </svg>
);

const Zap = ({ size = 16, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

// ── Session cache (5-min TTL) ─────────────────────────────────────────────────
const CACHE_KEY = "__ml_predictions__";
const CACHE_TTL = 5 * 60 * 1000;

function getCached() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}
// ─────────────────────────────────────────────────────────────────────────────

const levelColors = {
  CRITICAL: {
    bg: "rgba(230,57,70,0.12)",
    border: "rgba(230,57,70,0.3)",
    text: "#e63946",
  },
  HIGH: {
    bg: "rgba(244,162,97,0.12)",
    border: "rgba(244,162,97,0.3)",
    text: "#f4a261",
  },
  LOW: {
    bg: "rgba(46,196,182,0.12)",
    border: "rgba(46,196,182,0.3)",
    text: "#2ec4b6",
  },
};

function SkeletonCard() {
  return (
    <div
      style={{
        ...s.card,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        animation: "mlPulse 1.4s ease-in-out infinite",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div style={skBar("40px", "16px")} />
        <div style={skBar("36px", "10px")} />
      </div>
      <div style={{ ...skBar("75%", "10px"), marginBottom: "16px" }} />
      <div
        style={{
          ...skBar("100%", "5px"),
          borderRadius: "3px",
          marginBottom: "12px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={skBar("40%", "9px")} />
        <div style={skBar("32%", "9px")} />
      </div>
    </div>
  );
}

const skBar = (w, h) => ({
  width: w,
  height: h,
  borderRadius: "4px",
  background: "rgba(255,255,255,0.08)",
});

export default function MLPredictions() {
  const cached = getCached();
  const [predictions, setPredictions] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(cached ? new Date() : null);

  if (error)
    return (
      <div
        style={{
          padding: "20px 24px",
          background: "rgba(255,184,48,0.06)",
          border: "1px solid rgba(255,184,48,0.2)",
          borderRadius: "12px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <AlertTriangle size={18} color="#ffb830" />
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffb830",
            }}
          >
            ML Engine Offline
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#3d6080",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Start your Python FastAPI server locally: uvicorn main:app --port
            8000
          </p>
        </div>
      </div>
    );
  // if (error) return null;

  return (
    <div style={s.wrapper}>
      <style>{`@keyframes mlPulse { 0%,100%{opacity:.35} 50%{opacity:.8} }`}</style>

      <div style={s.header}>
        <div style={s.titleRow}>
          <span style={s.dot} />
          <Brain size={18} color="#e8eaf0" />
          <h3 style={s.title}>ML Risk Predictions</h3>
          <span style={s.badge}>
            <Zap size={10} style={{ marginRight: "4px" }} />
            AI POWERED
          </span>
          {lastUpdated && !loading && (
            <span style={s.updated}>
              cached ·{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <p style={s.sub}>
          {loading
            ? "Running Random Forest model — this may take a moment…"
            : `Risk scores trained on ${predictions.reduce((a, p) => a + p.eventCount, 0)} crisis events`}
        </p>
      </div>

      {/* Skeleton placeholders while the ML server responds */}
      {loading && (
        <div style={s.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Real prediction cards */}
      {!loading && (
        <div style={s.grid}>
          {predictions
            .filter((p) => p.countryCode !== "WW")
            .map((p, i) => {
              const c = levelColors[p.riskLevel] || levelColors.LOW;
              return (
                <div
                  key={i}
                  style={{
                    ...s.card,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <div style={s.cardTop}>
                    <span style={s.countryCode}>{p.countryCode}</span>
                    <span style={{ ...s.level, color: c.text }}>
                      {p.riskLevel}
                    </span>
                  </div>
                  <div style={s.region}>{p.region}</div>

                  <div style={s.barLabel}>
                    <span style={s.barText}>Risk Score</span>
                    <span style={{ ...s.barNum, color: c.text }}>
                      {p.riskScore}%
                    </span>
                  </div>
                  <div style={s.track}>
                    <div
                      style={{
                        ...s.fill,
                        width: `${p.riskScore}%`,
                        background: c.text,
                      }}
                    />
                  </div>

                  <div style={s.cardBottom}>
                    <span style={s.stat}>
                      <AlertTriangle
                        size={11}
                        style={{ marginRight: "4px", flexShrink: 0 }}
                      />
                      Avg: {p.avgSeverity}/10
                    </span>
                    <span style={s.stat}>
                      <Radio
                        size={11}
                        style={{ marginRight: "4px", flexShrink: 0 }}
                      />
                      {p.eventCount} events
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper: { marginBottom: "32px" },
  header: { marginBottom: "16px" },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
    flexWrap: "wrap",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#9b5de5",
    boxShadow: "0 0 8px #9b5de5",
    flexShrink: 0,
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#e8eaf0" },
  badge: {
    display: "flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    background: "rgba(155,93,229,0.15)",
    color: "#9b5de5",
    border: "1px solid rgba(155,93,229,0.3)",
  },
  updated: {
    fontSize: "10px",
    color: "#475569",
    fontFamily: "'JetBrains Mono', monospace",
  },
  sub: { margin: 0, fontSize: "13px", color: "#8892b0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  card: { borderRadius: "10px", padding: "16px" },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  countryCode: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#e8eaf0",
    letterSpacing: "1px",
  },
  level: { fontSize: "10px", fontWeight: "700", letterSpacing: "1px" },
  region: { fontSize: "12px", color: "#8892b0", marginBottom: "12px" },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  barText: { fontSize: "10px", color: "#8892b0", letterSpacing: "1px" },
  barNum: { fontSize: "11px", fontWeight: "700" },
  track: {
    height: "5px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  fill: { height: "100%", borderRadius: "3px" },
  cardBottom: { display: "flex", justifyContent: "space-between" },
  stat: {
    fontSize: "11px",
    color: "#8892b0",
    display: "flex",
    alignItems: "center",
  },
};
