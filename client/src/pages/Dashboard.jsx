import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaBell,
  FaBellSlash,
  FaSatellite,
  FaExclamationTriangle,
  FaGlobe,
  FaBolt,
} from "react-icons/fa";
import CrisisChart from "../components/CrisisChart";
import WorldMap from "../components/WorldMap";
import useResponsive from "../hooks/useResponsive";

const typeColors = {
  famine: { bg: "#f97316", light: "rgba(249,115,22,0.12)" },
  conflict: { bg: "#ff4365", light: "rgba(255,67,101,0.12)" },
  disease: { bg: "#7c5cfc", light: "rgba(124,92,252,0.12)" },
  disaster: { bg: "#ffb830", light: "rgba(255,184,48,0.12)" },
  economic: { bg: "#00e5a0", light: "rgba(0,229,160,0.12)" },
};
const sevColor = (s) => (s >= 8 ? "#ff4365" : s >= 5 ? "#ffb830" : "#00e5a0");

export default function Dashboard() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [eventsRes, alertsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/crisis/events`),
          user?.email
            ? axios.get(`${process.env.REACT_APP_API_URL}/api/alerts/my/${user.email}`)
            : Promise.resolve({ data: [] }),
        ]);
        if (!mounted) return;
        setEvents(eventsRes.data.slice(0, 280));
        setAlerts(alertsRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (events.length > 0) setTimeout(() => setShowMap(true), 200);
  }, [events]);

  const isSubscribed = (code) => alerts.some((a) => a.countryCode === code);
  const toggleSubscribe = async (event) => {
    try {
      const existing = alerts.find((a) => a.countryCode === event.countryCode);
      if (existing) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/alerts/${existing._id}`);
        setAlerts((prev) => prev.filter((a) => a._id !== existing._id));
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/alerts/subscribe`,
          {
            region: event.region,
            countryCode: event.countryCode,
            userEmail: user.email,
            threshold: 7,
          },
        );
        setAlerts((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const types = [
    "all",
    "conflict",
    "famine",
    "disease",
    "disaster",
    "economic",
  ];
  const filtered = useMemo(
    () =>
      events
        .filter((e) => filter === "all" || e.type === filter)
        .filter(
          (e) =>
            search === "" ||
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.region.toLowerCase().includes(search.toLowerCase()),
        ),
    [events, filter, search],
  );

  const totalEvents = events.length;
  const criticalEvents = events.filter((e) => e.severity >= 8).length;
  const regions = new Set(events.map((e) => e.region)).size;
  const latestType = events.length ? events[events.length - 1].type : "N/A";

  const statItems = [
    {
      icon: <FaSatellite />,
      value: totalEvents,
      label: "Total Events",
      color: "#00d4ff",
      bg: "rgba(0,212,255,0.08)",
    },
    {
      icon: <FaExclamationTriangle />,
      value: criticalEvents,
      label: "Critical",
      color: "#ff4365",
      bg: "rgba(255,67,101,0.08)",
    },
    {
      icon: <FaGlobe />,
      value: regions,
      label: "Regions",
      color: "#ffb830",
      bg: "rgba(255,184,48,0.08)",
    },
    {
      icon: <FaBolt />,
      value: latestType.charAt(0).toUpperCase() + latestType.slice(1),
      label: "Latest Type",
      color: "#7c5cfc",
      bg: "rgba(124,92,252,0.08)",
    },
  ];

  if (loading)
    return (
      <div
        style={{
          color: "#00d4ff",
          textAlign: "center",
          padding: "120px 20px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Loading dashboard...
      </div>
    );

  return (
    <div style={s.page}>
      <div style={{ ...s.container, padding: isMobile ? "20px 16px" : "40px" }}>
        {/* HERO */}
        <div style={s.hero}>
          <h1 style={{ ...s.heroTitle, fontSize: isMobile ? "26px" : "42px" }}>
            Global Crisis Intelligence
          </h1>
        </div>

        {/* MAP */}
        {showMap && <WorldMap events={events.slice(0, 100)} />}

        {/* CHARTS */}
        <CrisisChart events={events} />

        {/* STATS */}
        <div
          style={{
            ...s.statsGrid,
            gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
            gap: isMobile ? "12px" : "20px",
          }}
        >
          {statItems.map((st, i) => (
            <div
              key={i}
              style={{
                background: "#0a1628",
                border: "1px solid #1a2c44",
                borderTop: `3px solid ${st.color}`,
                borderRadius: "14px",
                padding: isMobile ? "16px 12px" : "24px 20px",
                textAlign: "center",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 30px -8px ${st.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: isMobile ? "8px" : "10px",
                  borderRadius: "12px",
                  background: st.bg,
                  color: st.color,
                  fontSize: isMobile ? "16px" : "20px",
                  marginBottom: isMobile ? "8px" : "12px",
                }}
              >
                {st.icon}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: "900",
                  color: st.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-1px",
                  marginBottom: "4px",
                }}
              >
                {st.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#3d6080",
                  letterSpacing: "1px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: "600",
                }}
              >
                {st.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={s.searchWrap}>
          <FaSearch style={s.searchIcon} />
          <input
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={s.searchInput}
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")} style={s.clearBtn}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* FILTER */}
        <div style={s.filterRow}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                ...s.filterBtn,
                ...(filter === t ? s.filterActive : {}),
                padding: isMobile ? "5px 10px" : "6px 14px",
                fontSize: isMobile ? "10px" : "12px",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* COUNT */}
        <div
          style={{
            fontSize: "12px",
            color: "#3d6080",
            marginBottom: "12px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {filtered.length} events
        </div>

        {/* EVENTS */}
        <div style={s.list}>
          {filtered.map((event) => {
            const tc = typeColors[event.type] || typeColors.conflict;
            const subscribed = isSubscribed(event.countryCode);
            return (
              <div key={event._id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={s.cardLeft}>
                    <span
                      style={{
                        ...s.typePill,
                        background: tc.light,
                        color: tc.bg,
                      }}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span style={s.ccPill}>{event.countryCode}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubscribe(event);
                    }}
                    style={{
                      ...s.subBtn,
                      background: subscribed
                        ? "rgba(255,67,101,0.1)"
                        : "rgba(0,212,255,0.1)",
                      color: subscribed ? "#ff4365" : "#00d4ff",
                    }}
                  >
                    {subscribed ? <FaBellSlash /> : <FaBell />}
                    {!isMobile && (
                      <span style={{ marginLeft: 6 }}>
                        {subscribed ? "Subscribed" : "Subscribe"}
                      </span>
                    )}
                  </button>
                </div>
                <h3
                  style={s.cardTitle}
                  onClick={() => navigate(`/region/${event.countryCode}`)}
                >
                  {event.title}
                </h3>
                <p style={s.cardDesc}>{event.description}</p>
                <div style={s.cardFoot}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FaMapMarkerAlt
                      style={{ color: "#3d6080", fontSize: "10px" }}
                    />
                    {event.region}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {event.source}
                  </span>
                </div>
                <div style={s.sevTrack}>
                  <div
                    style={{
                      ...s.sevFill,
                      width: `${event.severity * 10}%`,
                      background: sevColor(event.severity),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    background: "#04080f",
    minHeight: "100vh",
    color: "#e8f4ff",
    fontFamily: "'Inter', sans-serif",
  },
  container: { maxWidth: "1100px", margin: "auto" },
  hero: { textAlign: "center", marginBottom: "24px" },
  heroTitle: {
    fontWeight: "800",
    letterSpacing: "-1px",
    background: "linear-gradient(135deg,#e8f4ff,#00d4ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  statsGrid: { display: "grid", marginBottom: "24px" },
  searchWrap: { position: "relative", margin: "16px 0" },
  searchInput: {
    width: "100%",
    padding: "11px 40px",
    background: "#0a1628",
    borderRadius: "10px",
    border: "1px solid #1a2c44",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#3d6080",
    fontSize: "14px",
  },
  clearBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterBtn: {
    borderRadius: "20px",
    border: "1px solid #1a2c44",
    background: "#0a1628",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "0.2s",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: "600",
  },
  filterActive: {
    background: "#00d4ff20",
    color: "#00d4ff",
    border: "1px solid #00d4ff40",
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    background: "#0a1628",
    border: "1px solid #1a2c44",
    borderRadius: "14px",
    padding: "16px",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cardLeft: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  typePill: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "600",
  },
  ccPill: {
    padding: "3px 8px",
    background: "#0e2238",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  subBtn: {
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    gap: "4px",
    transition: "0.2s",
    flexShrink: 0,
  },
  cardTitle: {
    margin: "0 0 6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#c8dff0",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  cardDesc: {
    color: "#3d6080",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 10px",
  },
  cardFoot: {
    display: "flex",
    gap: "12px",
    fontSize: "11px",
    color: "#3d6080",
    flexWrap: "wrap",
    fontFamily: "'JetBrains Mono', monospace",
  },
  sevTrack: {
    height: "3px",
    background: "#111",
    borderRadius: "10px",
    marginTop: "10px",
  },
  sevFill: { height: "100%", borderRadius: "10px" },
};
