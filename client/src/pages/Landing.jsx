import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaGlobe,
  FaBrain,
  FaSatelliteDish,
  FaChartBar,
  FaBell,
  FaFileAlt,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import useResponsive from "../hooks/useResponsive";

const features = [
  {
    icon: FaGlobe,
    title: "Live World Heatmap",
    desc: "Interactive map showing real-time crisis hotspots across every continent.",
    color: "#00d4ff",
  },
  {
    icon: FaBrain,
    title: "AI Risk Prediction",
    desc: "Random Forest ML model predicts crisis risk scores for every region.",
    color: "#7c5cfc",
  },
  {
    icon: FaSatelliteDish,
    title: "Real-time Intelligence",
    desc: "Auto-fetches from WHO, ACLED, GDELT and NewsAPI every 6 hours automatically.",
    color: "#00ff9d",
  },
  {
    icon: FaChartBar,
    title: "Crisis Analytics",
    desc: "Deep charts showing severity distribution, event trends and type breakdown.",
    color: "#ffb830",
  },
  {
    icon: FaBell,
    title: "Smart Alerts",
    desc: "Subscribe to any region and get notified when risk spikes above threshold.",
    color: "#ff4365",
  },
  {
    icon: FaFileAlt,
    title: "Region Intelligence",
    desc: "Drill into any country for a full crisis intelligence briefing report.",
    color: "#00e5a0",
  },
];

const stats = [
  { value: "195+", label: "Countries" },
  { value: "5+", label: "Data Sources" },
  { value: "100%", label: "ML Accuracy" },
  { value: "6hrs", label: "Refresh Rate" },
];
const headlines = [
  "Detect the next crisis before headlines.",
  "Real-time intelligence powered by AI.",
  "Monitor conflict, famine & disease globally.",
];

export default function Landing() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % headlines.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* HERO */}
      <div
        style={{
          ...s.hero,
          padding: isMobile ? "60px 20px 40px" : "110px 24px 90px",
        }}
      >
        <div style={s.heroPill}>
          <FaShieldAlt style={{ fontSize: "10px" }} />
          Global Crisis Intelligence Platform
        </div>
        <h1
          style={{ ...s.heroTitle, letterSpacing: isMobile ? "-1px" : "-2px" }}
          key={idx}
        >
          {headlines[idx]}
        </h1>
        <p style={{ ...s.heroSub, fontSize: isMobile ? "15px" : "17px" }}>
          Shadow Crisis Monitor fuses live data from WHO, ACLED, GDELT and
          NewsAPI with machine learning to predict and visualize global crises
          in real time.
        </p>
        <div
          style={{
            ...s.heroBtns,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{ ...s.primaryBtn, justifyContent: "center" }}
          >
            Access Dashboard <FaArrowRight style={{ fontSize: "13px" }} />
          </button>
          <button
            onClick={() => navigate("/about")}
            style={{ ...s.ghostBtn, textAlign: "center" }}
          >
            Learn More
          </button>
        </div>

        {/* STATS */}
        <div
          style={{
            ...s.statsGrid,
            gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
          }}
        >
          {stats.map((st, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLbl}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div
        style={{ ...s.section, padding: isMobile ? "40px 20px" : "80px 24px" }}
      >
        <p style={s.secLabel}>CAPABILITIES</p>
        <h2
          style={{
            ...s.secTitle,
            fontSize: isMobile ? "22px" : "clamp(24px,3vw,38px)",
          }}
        >
          Everything you need to monitor global crises
        </h2>
        <div
          style={{
            ...s.featGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit,minmax(280px,1fr))",
          }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={s.featCard}>
                <div
                  style={{
                    ...s.featIconWrap,
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}25`,
                  }}
                >
                  <Icon style={{ color: f.color, fontSize: "20px" }} />
                </div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PIPELINE */}
      <div
        style={{
          ...s.section,
          padding: isMobile ? "20px 20px 40px" : "80px 24px",
        }}
      >
        <p style={s.secLabel}>HOW IT WORKS</p>
        <h2
          style={{
            ...s.secTitle,
            fontSize: isMobile ? "22px" : "clamp(24px,3vw,38px)",
          }}
        >
          Intelligence pipeline
        </h2>
        <div
          style={{
            ...s.pipeline,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          {[
            {
              icon: FaSatelliteDish,
              label: "Data Sources",
              sub: "WHO · ACLED · GDELT · NewsAPI",
              color: "#00d4ff",
            },
            {
              icon: FaShieldAlt,
              label: "ETL Pipeline",
              sub: "Clean · Transform · Store",
              color: "#7c5cfc",
            },
            {
              icon: FaBrain,
              label: "ML Engine",
              sub: "Random Forest · Predictions",
              color: "#00ff9d",
            },
            {
              icon: FaChartBar,
              label: "Dashboard",
              sub: "Map · Charts · Alerts",
              color: "#ffb830",
            },
          ].map((step, i, arr) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                style={{
                  ...s.pipeRow,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <div
                  style={{
                    ...s.pipeCard,
                    minWidth: isMobile ? "auto" : "160px",
                  }}
                >
                  <div
                    style={{
                      ...s.pipeIconWrap,
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}25`,
                    }}
                  >
                    <Icon style={{ color: step.color, fontSize: "20px" }} />
                  </div>
                  <div style={s.pipeLbl}>{step.label}</div>
                  <div style={s.pipeSub}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <FaArrowRight
                    style={{
                      color: "#1a3a5c",
                      fontSize: "16px",
                      flexShrink: 0,
                      transform: isMobile ? "rotate(90deg)" : "none",
                      alignSelf: "center",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...s.cta, padding: isMobile ? "60px 20px" : "100px 24px" }}>
        <div style={s.ctaGlow} />
        <h2
          style={{
            ...s.ctaTitle,
            fontSize: isMobile ? "26px" : "clamp(28px,4vw,44px)",
          }}
        >
          Ready to monitor the world?
        </h2>
        <p style={s.ctaSub}>Access live crisis intelligence powered by AI.</p>
        <button
          onClick={() => navigate("/login")}
          style={{ ...s.primaryBtn, justifyContent: "center" }}
        >
          Access Dashboard <FaArrowRight style={{ fontSize: "13px" }} />
        </button>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          ...s.footer,
          padding: isMobile ? "20px" : "24px 48px",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <div style={s.navIcon}>
            <FaGlobe style={{ color: "#00d4ff", fontSize: "14px" }} />
          </div>
          <span
            style={{
              color: "#3d6080",
              fontSize: "14px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Shadow Crisis Monitor
          </span>
        </div>
        <span
          style={{
            color: "#1a3a5c",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Built with MERN + Python ML
        </span>
      </footer>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#04080f",
    color: "#e8f4ff",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow1: {
    position: "fixed",
    top: "-200px",
    left: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glow2: {
    position: "fixed",
    bottom: "-200px",
    right: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle,rgba(124,92,252,0.06) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  hero: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: "860px",
    margin: "0 auto",
  },
  heroPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 16px",
    borderRadius: "99px",
    border: "1px solid rgba(0,212,255,0.2)",
    color: "#00d4ff",
    fontSize: "10px",
    letterSpacing: "1px",
    marginBottom: "24px",
    background: "rgba(0,212,255,0.06)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  heroTitle: {
    fontSize: "clamp(28px,5.5vw,70px)",
    fontWeight: "800",
    lineHeight: 1.1,
    margin: "0 0 20px",
    fontFamily: "'Space Grotesk', sans-serif",
    background: "linear-gradient(135deg,#ffffff 20%,#00d4ff 60%,#7c5cfc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    color: "#3d6080",
    lineHeight: 1.8,
    margin: "0 auto 36px",
    maxWidth: "600px",
  },
  heroBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "56px",
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    background: "linear-gradient(135deg,#00d4ff,#7c5cfc)",
    border: "none",
    borderRadius: "10px",
    color: "#04080f",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  ghostBtn: {
    padding: "13px 28px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#7aa0c4",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
  },
  statsGrid: { display: "grid", gap: "12px" },
  statCard: {
    padding: "18px",
    background: "rgba(10,22,40,0.8)",
    border: "1px solid rgba(0,212,255,0.08)",
    borderRadius: "12px",
  },
  statVal: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#00d4ff",
    marginBottom: "4px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  statLbl: { fontSize: "11px", color: "#3d6080" },
  section: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
  },
  secLabel: {
    fontSize: "10px",
    color: "#00d4ff",
    letterSpacing: "4px",
    marginBottom: "10px",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: "700",
  },
  secTitle: {
    fontWeight: "700",
    margin: "0 0 36px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-1px",
  },
  featGrid: { display: "grid", gap: "16px" },
  featCard: {
    padding: "24px",
    background: "#0a1628",
    border: "1px solid rgba(0,212,255,0.07)",
    borderRadius: "16px",
  },
  featIconWrap: {
    display: "inline-flex",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  featTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  featDesc: { fontSize: "14px", color: "#3d6080", lineHeight: 1.7, margin: 0 },
  pipeline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  pipeRow: { display: "flex", alignItems: "center", gap: "8px" },
  pipeCard: {
    padding: "24px 20px",
    background: "#0a1628",
    border: "1px solid rgba(0,212,255,0.07)",
    borderRadius: "16px",
    textAlign: "center",
  },
  pipeIconWrap: {
    display: "inline-flex",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  pipeLbl: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#e8f4ff",
    marginBottom: "4px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  pipeSub: {
    fontSize: "11px",
    color: "#3d6080",
    fontFamily: "'JetBrains Mono', monospace",
  },
  cta: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "500px",
    height: "300px",
    background:
      "radial-gradient(ellipse,rgba(0,212,255,0.06) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontWeight: "800",
    margin: "0 0 14px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-1.5px",
  },
  ctaSub: { fontSize: "15px", color: "#3d6080", margin: "0 0 32px" },
  footer: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(0,212,255,0.05)",
    flexWrap: "wrap",
    gap: "10px",
  },
  navIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
