import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell } from "react-icons/fa";

export default function AlertsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.email) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/alerts/my/${user.email}`)
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/alerts/${id}`);
    setAlerts(alerts.filter((a) => a._id !== id));
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.label}>SUBSCRIPTIONS</p>
        <h1 style={s.title}>My Alert Subscriptions</h1>
        <p style={s.sub}>
          You will be notified when risk spikes in these regions.
        </p>
      </div>

      {loading && <div style={s.empty}>Loading your subscriptions...</div>}

      {!loading && alerts.length === 0 && (
        <div style={s.emptyCard}>
          <div style={s.emptyIcon}>
            <FaBell style={{ color: "#00d4ff", fontSize: "48px" }} />
          </div>
          <h3 style={s.emptyTitle}>No subscriptions yet</h3>
          <p style={s.emptySub}>
            Go to any region page and click "Subscribe to Alerts"
          </p>
          <button style={s.btn} onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      <div style={s.grid}>
        {alerts.map((alert, i) => (
          <div key={alert._id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.cc}>{alert.countryCode}</span>
              <span style={s.active}>● ACTIVE</span>
            </div>
            <h3 style={s.region}>{alert.region}</h3>
            <div style={s.meta}>
              <span style={s.metaItem}>Threshold: {alert.threshold}/10</span>
              <span style={s.metaItem}>
                Since: {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={s.cardBtns}>
              <button
                style={s.viewBtn}
                onClick={() => navigate(`/region/${alert.countryCode}`)}
              >
                View Region →
              </button>
              <button
                style={s.deleteBtn}
                onClick={() => handleDelete(alert._id)}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        ))}
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
  header: { marginBottom: "48px" },
  label: {
    fontSize: "10px",
    color: "#00f5d4",
    letterSpacing: "4px",
    marginBottom: "10px",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: "700",
  },
  title: {
    fontSize: "clamp(28px,4vw,42px)",
    fontWeight: "800",
    margin: "0 0 12px",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-1px",
  },
  sub: { fontSize: "15px", color: "#475569" },
  empty: { textAlign: "center", padding: "80px", color: "#334155" },
  emptyCard: {
    textAlign: "center",
    padding: "60px 40px",
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
  },
  // emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 8px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  emptySub: { fontSize: "14px", color: "#334155", margin: "0 0 24px" },
  btn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg,#00f5d4,#00b4d8)",
    border: "none",
    borderRadius: "8px",
    color: "#060912",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "16px",
  },
  card: {
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "24px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cc: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#00f5d4",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "2px",
  },
  active: {
    fontSize: "10px",
    color: "#10b981",
    letterSpacing: "1px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  region: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 12px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "20px",
  },
  metaItem: {
    fontSize: "12px",
    color: "#334155",
    fontFamily: "'JetBrains Mono', monospace",
  },
  cardBtns: { display: "flex", gap: "10px" },
  viewBtn: {
    flex: 1,
    padding: "9px",
    background: "rgba(0,245,212,0.08)",
    border: "1px solid rgba(0,245,212,0.2)",
    borderRadius: "8px",
    color: "#00f5d4",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
  },
  deleteBtn: {
    flex: 1,
    padding: "9px",
    background: "rgba(244,63,94,0.08)",
    border: "1px solid rgba(244,63,94,0.2)",
    borderRadius: "8px",
    color: "#f43f5e",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
  },
};
