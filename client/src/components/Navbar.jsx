import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaGlobe, FaTachometerAlt, FaBell, FaInfoCircle,
  FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaUser, FaBrain,
} from "react-icons/fa";
import LiveClock from "./LiveClock";
import useResponsive from "../hooks/useResponsive";

const getLinks = (token) => token ? [
  { to: "/dashboard", label: "Dashboard",      icon: <FaTachometerAlt /> },
  { to: "/ml",        label: "AI Predictions", icon: <FaBrain />         },
  { to: "/alerts",    label: "My Alerts",       icon: <FaBell />          },
  { to: "/about",     label: "About",           icon: <FaInfoCircle />    },
] : [
  { to: "/",      label: "Home",  icon: <FaGlobe />      },
  { to: "/about", label: "About", icon: <FaInfoCircle /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const logout = () => { localStorage.clear(); window.location.href = "/"; };
  const links  = getLinks(token);

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Brand */}
        <div style={s.brand} onClick={() => navigate(token ? "/dashboard" : "/")}>
          <div style={s.brandIcon}>
            <FaGlobe style={{ color: "#00d4ff", fontSize: "15px" }} />
          </div>
          <span style={{ ...s.brandText, fontSize: isMobile ? "13px" : "17px" }}>
            {isMobile ? "SCM" : "Shadow Crisis"}
          </span>
          <span style={s.livePill}>
            <span style={s.liveDot} />
            {!isMobile && "LIVE"}
          </span>
        </div>

        {/* Clock — hide on small mobile */}
        {!isMobile && (
          <div style={s.center}><LiveClock /></div>
        )}

        {/* Desktop links — hide on tablet */}
        {!isTablet && (
          <div style={s.links}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end style={({ isActive }) => ({
                ...s.link,
                color:       isActive ? "#00d4ff" : "#3d6080",
                background:  isActive ? "rgba(0,212,255,0.08)" : "transparent",
                borderColor: isActive ? "rgba(0,212,255,0.3)"  : "transparent",
              })}>
                <span style={{ fontSize: "12px" }}>{l.icon}</span>
                {l.label}
              </NavLink>
            ))}
            {token ? (
              <div style={s.userRow}>
                <div style={s.userBadge}>
                  <FaUser style={{ fontSize: "11px", color: "#7aa0c4" }} />
                  <span style={s.userName}>{user.name || "User"}</span>
                </div>
                <button style={s.logoutBtn} onClick={logout}>
                  <FaSignOutAlt style={{ fontSize: "12px" }} /> Logout
                </button>
              </div>
            ) : (
              <button style={s.loginBtn} onClick={() => navigate("/login")}>
                <FaSignInAlt style={{ fontSize: "13px" }} /> Sign In
              </button>
            )}
          </div>
        )}

        {/* Hamburger — show on tablet/mobile */}
        {isTablet && (
          <button style={s.hamburger} onClick={() => setOpen(!open)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isTablet && open && (
        <div style={s.mobile}>
          {isMobile && (
            <div style={{ padding: "10px 16px 14px", borderBottom: "1px solid rgba(0,212,255,0.08)", marginBottom: "6px" }}>
              <LiveClock />
            </div>
          )}
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                ...s.mobileLink,
                color:      isActive ? "#00d4ff" : "#7aa0c4",
                background: isActive ? "rgba(0,212,255,0.06)" : "transparent",
              })}>
              <span style={{ fontSize: "16px" }}>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
          {token ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px" }}>
              <span style={{ fontSize: "13px", color: "#3d6080" }}>👤 {user.name}</span>
              <button style={s.logoutBtn} onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <button style={{ ...s.loginBtn, margin: "4px 16px" }}
              onClick={() => { navigate("/login"); setOpen(false); }}>
              <FaSignInAlt /> Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

const s = {
  nav:        { background: "rgba(4,8,15,0.97)", borderBottom: "1px solid rgba(0,212,255,0.08)", position: "sticky", top: 0, zIndex: 9999, backdropFilter: "blur(20px)" },
  inner:      { maxWidth: "1200px", margin: "0 auto", padding: "0 20px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  brand:      { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flexShrink: 0 },
  brandIcon:  { width: "32px", height: "32px", borderRadius: "9px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brandText:  { fontWeight: "800", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", color: "#e8f4ff" },
  livePill:   { display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", padding: "3px 8px", borderRadius: "99px", background: "rgba(255,67,101,0.12)", color: "#ff4365", border: "1px solid rgba(255,67,101,0.25)", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" },
  liveDot:    { width: "5px", height: "5px", borderRadius: "50%", background: "#ff4365" },
  center:     { flex: 1, display: "flex", justifyContent: "center" },
  links:      { display: "flex", alignItems: "center", gap: "4px" },
  link:       { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", padding: "7px 12px", borderRadius: "8px", border: "1px solid transparent", transition: "all 0.2s" },
  userRow:    { display: "flex", alignItems: "center", gap: "8px", marginLeft: "6px" },
  userBadge:  { display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "rgba(122,160,196,0.08)", border: "1px solid rgba(122,160,196,0.12)", borderRadius: "8px" },
  userName:   { fontSize: "12px", color: "#7aa0c4", fontWeight: "500" },
  logoutBtn:  { display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: "rgba(255,67,101,0.08)", border: "1px solid rgba(255,67,101,0.18)", borderRadius: "8px", color: "#ff4365", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  loginBtn:   { display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", background: "linear-gradient(135deg,#00d4ff,#7c5cfc)", border: "none", borderRadius: "8px", color: "#04080f", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" },
  hamburger:  { display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e8f4ff", fontSize: "18px", width: "38px", height: "38px", cursor: "pointer", flexShrink: 0 },
  mobile:     { padding: "8px 8px 16px", display: "flex", flexDirection: "column", gap: "2px", borderTop: "1px solid rgba(0,212,255,0.06)" },
  mobileLink: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" },
};