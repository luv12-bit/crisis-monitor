import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSatelliteDish,
  FaExclamationTriangle,
  FaChartPie,
  FaSearch,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaBell,
  FaBellSlash,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useResponsive from "../hooks/useResponsive";

const typeColors = {
  conflict: "#ff4365",
  famine: "#f97316",
  disease: "#7c5cfc",
  disaster: "#ffb830",
  economic: "#00e5a0",
};
const sevColor = (s) => (s >= 8 ? "#ff4365" : s >= 5 ? "#ffb830" : "#00e5a0");

export default function RegionDetail() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [alertId, setAlertId] = useState(null);
  const [subMsg, setSubMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/crisis/events/${countryCode}`)
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryCode]);

  useEffect(() => {
    if (user.email) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/alerts/my/${user.email}`)
        .then((res) => {
          const ex = res.data.find((a) => a.countryCode === countryCode);
          if (ex) {
            setSubscribed(true);
            setAlertId(ex._id);
          }
        });
    }
    // eslint-disable-next-line
  }, [countryCode]);

  const avgSeverity = events.length
    ? (events.reduce((a, e) => a + e.severity, 0) / events.length).toFixed(1)
    : 0;

  const typeCounts = ["conflict", "famine", "disease", "disaster", "economic"]
    .filter((type) => events.some((e) => e.type === type))
    .map((type) => ({
      type,
      count: events.filter((e) => e.type === type).length,
    }));

  const riskColor =
    avgSeverity >= 8 ? "#ff4365" : avgSeverity >= 5 ? "#ffb830" : "#00e5a0";
  const riskLevel =
    avgSeverity >= 8 ? "CRITICAL" : avgSeverity >= 5 ? "HIGH" : "MEDIUM";

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/alerts/subscribe`,
        {
          region: events[0]?.region,
          countryCode,
          userEmail: user.email,
          threshold: 7,
        },
      );
      setSubscribed(true);
      setAlertId(res.data._id);
      setSubMsg("Subscribed!");
    } catch (err) {
      setSubMsg(err.response?.data?.message || "Error");
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/alerts/${alertId}`);
      setSubscribed(false);
      setAlertId(null);
      setSubMsg("Unsubscribed.");
    } catch {
      setSubMsg("Error");
    }
  };

  const statItems = [
    {
      label: "EVENTS",
      value: events.length,
      icon: <FaSatelliteDish />,
      color: "#00d4ff",
    },
    {
      label: "AVG SEV",
      value: avgSeverity,
      icon: <FaExclamationTriangle />,
      color: riskColor,
    },
    {
      label: "TYPES",
      value: typeCounts.length,
      icon: <FaChartPie />,
      color: "#7c5cfc",
    },
    {
      label: "SOURCE",
      value: events[0]?.source?.slice(0, 12) || "—",
      icon: <FaSearch />,
      color: "#ffb830",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04080f",
        color: "#e8f4ff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "20px 16px" : "40px 24px",
        }}
      >
        {loading && (
          <div
            style={{ textAlign: "center", padding: "80px", color: "#3d6080" }}
          >
            Loading...
          </div>
        )}

        {!loading && events.length > 0 && (
          <>
            {/* BACK */}
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.15)",
                borderRadius: "8px",
                color: "#00d4ff",
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "24px",
              }}
            >
              <FaArrowLeft /> Back
            </button>

            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 12px",
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "6px",
                    color: "#00d4ff",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "3px",
                    marginBottom: "12px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {countryCode}
                </div>
                <h1
                  style={{
                    fontSize: isMobile ? "22px" : "32px",
                    fontWeight: "800",
                    margin: "0 0 6px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "-1px",
                  }}
                >
                  {events[0]?.region} Intelligence Report
                </h1>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#3d6080",
                    margin: "0 0 16px",
                  }}
                >
                  {events.length} events · {new Date().toLocaleDateString()}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {!subscribed ? (
                    <button
                      onClick={handleSubscribe}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "9px 18px",
                        background: "linear-gradient(135deg,#00d4ff,#7c5cfc)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#04080f",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      <FaBell /> Subscribe
                    </button>
                  ) : (
                    <button
                      onClick={handleUnsubscribe}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "9px 18px",
                        background: "rgba(255,67,101,0.08)",
                        border: "1px solid rgba(255,67,101,0.2)",
                        borderRadius: "8px",
                        color: "#ff4365",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      <FaBellSlash /> Unsubscribe
                    </button>
                  )}
                  {subMsg && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: subscribed ? "#00e5a0" : "#ffb830",
                      }}
                    >
                      {subMsg}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  padding: "18px 24px",
                  borderRadius: "12px",
                  background: `${riskColor}12`,
                  border: `1px solid ${riskColor}30`,
                  borderTop: `3px solid ${riskColor}`,
                  textAlign: "center",
                  minWidth: "120px",
                }}
              >
                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: "900",
                    color: riskColor,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {avgSeverity}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#3d6080",
                    letterSpacing: "2px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  AVG SEV
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: riskColor,
                    letterSpacing: "1px",
                    marginTop: "4px",
                  }}
                >
                  {riskLevel}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {statItems.map((st, i) => (
                <div
                  key={i}
                  style={{
                    background: "#0a1628",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderTop: `2px solid ${st.color}`,
                    borderRadius: "12px",
                    padding: isMobile ? "14px 10px" : "18px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: st.color,
                      fontSize: isMobile ? "16px" : "20px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {st.icon}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "20px" : "26px",
                      fontWeight: "800",
                      color: st.color,
                      fontFamily: "'Space Grotesk', sans-serif",
                      wordBreak: "break-word",
                    }}
                  >
                    {st.value}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#3d6080",
                      letterSpacing: "1px",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginTop: "4px",
                    }}
                  >
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CHART */}
            {typeCounts.length > 0 && (
              <div
                style={{
                  background: "#0a1628",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#7aa0c4",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Crisis Type Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={typeCounts}
                    margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="type"
                      tick={{ fill: "#3d6080", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#3d6080", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0d1220",
                        border: "1px solid rgba(0,212,255,0.15)",
                        borderRadius: "8px",
                        color: "#e8f4ff",
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                      {typeCounts.map((e, i) => (
                        <Cell
                          key={i}
                          fill={typeColors[e.type]}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* EVENTS */}
            <div
              style={{
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "18px 20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#7aa0c4",
                }}
              >
                All Events
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {events.map((event) => {
                  const sc = sevColor(event.severity);
                  const tc = typeColors[event.type] || "#64748b";
                  return (
                    <div
                      key={event._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "14px",
                        background: "linear-gradient(135deg,#0a1628,#08121f)",
                        border: `1px solid rgba(255,255,255,0.05)`,
                        borderLeft: `3px solid ${tc}`,
                        borderRadius: "12px",
                        padding: isMobile ? "14px" : "18px",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: "99px",
                              fontSize: "10px",
                              fontWeight: "700",
                              background: `${tc}18`,
                              color: tc,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {event.type.toUpperCase()}
                          </span>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: "700",
                              background: "#0a2238",
                              color: "#00d4ff",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {event.countryCode}
                          </span>
                        </div>
                        <h4
                          style={{
                            margin: "0 0 5px",
                            fontSize: isMobile ? "13px" : "15px",
                            fontWeight: "700",
                            color: "#c8dff0",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {event.title}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: "12px",
                            color: "#3d6080",
                            lineHeight: 1.6,
                          }}
                        >
                          {event.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            fontSize: "11px",
                            color: "#1f3b5c",
                            flexWrap: "wrap",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
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
                          <span>{event.source}</span>
                          <span>
                            {new Date(event.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: isMobile ? "36px" : "44px",
                            height: isMobile ? "36px" : "44px",
                            borderRadius: "50%",
                            border: `2px solid ${sc}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            color: sc,
                            fontSize: isMobile ? "14px" : "16px",
                          }}
                        >
                          {event.severity}
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            marginTop: "5px",
                            color: sc,
                            fontWeight: "600",
                          }}
                        >
                          {event.severity >= 8
                            ? "Critical"
                            : event.severity >= 5
                              ? "High"
                              : "Low"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
