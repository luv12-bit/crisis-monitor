import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo } from "react";

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 250);
  }, [map]);
  return null;
}

const countryNames = {
  AF: "Afghanistan", AG: "Antigua & Barbuda", AL: "Albania",
  AM: "Armenia", AO: "Angola", AR: "Argentina",
  AU: "Australia", AZ: "Azerbaijan", BA: "Bosnia & Herzegovina",
  BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso",
  BG: "Bulgaria", BI: "Burundi", BJ: "Benin",
  BO: "Bolivia", BR: "Brazil", BY: "Belarus",
  CA: "Canada", CD: "DR Congo", CF: "Central African Republic",
  CG: "Congo", CH: "Switzerland", CI: "Ivory Coast",
  CL: "Chile", CM: "Cameroon", CN: "China",
  CO: "Colombia", CU: "Cuba", DE: "Germany",
  DJ: "Djibouti", DZ: "Algeria", EC: "Ecuador",
  EG: "Egypt", ER: "Eritrea", ES: "Spain",
  ET: "Ethiopia", FR: "France", GA: "Gabon",
  GB: "United Kingdom", GE: "Georgia", GH: "Ghana",
  GM: "Gambia", GN: "Guinea", GQ: "Equatorial Guinea",
  GR: "Greece", GT: "Guatemala", GW: "Guinea-Bissau",
  GY: "Guyana", HN: "Honduras", HR: "Croatia",
  HT: "Haiti", HU: "Hungary", ID: "Indonesia",
  IN: "India", IQ: "Iraq", IR: "Iran",
  IL: "Israel", IT: "Italy", JO: "Jordan",
  JP: "Japan", KE: "Kenya", KG: "Kyrgyzstan",
  KH: "Cambodia", KP: "North Korea", KR: "South Korea",
  LB: "Lebanon", LY: "Libya", MA: "Morocco",
  MD: "Moldova", ML: "Mali", MM: "Myanmar",
  MR: "Mauritania", MW: "Malawi", MX: "Mexico",
  MZ: "Mozambique", NG: "Nigeria", NI: "Nicaragua",
  NE: "Niger", NO: "Norway", NP: "Nepal",
  NZ: "New Zealand", OM: "Oman", PA: "Panama",
  PE: "Peru", PH: "Philippines", PK: "Pakistan",
  PL: "Poland", PS: "Palestine", PT: "Portugal",
  PY: "Paraguay", RO: "Romania", RS: "Serbia",
  RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia",
  SD: "Sudan", SE: "Sweden", SI: "Slovenia",
  SL: "Sierra Leone", SO: "Somalia", SS: "South Sudan",
  SV: "El Salvador", SY: "Syria", TD: "Chad",
  TG: "Togo", TH: "Thailand", TJ: "Tajikistan",
  TM: "Turkmenistan", TN: "Tunisia", TR: "Turkey",
  TZ: "Tanzania", UA: "Ukraine", UG: "Uganda",
  US: "United States", UZ: "Uzbekistan", VE: "Venezuela",
  VN: "Vietnam", YE: "Yemen", ZA: "South Africa",
  ZM: "Zambia", ZW: "Zimbabwe",
};

const countryCoords = {
  AF: [33.93, 67.71], AG: [17.06, -61.8],  AL: [41.15, 20.17],
  AM: [40.07, 45.04], AO: [-11.2, 17.87],  AR: [-38.42, -63.62],
  AU: [-25.27, 133.78], AZ: [40.14, 47.58], BA: [43.92, 17.68],
  BD: [23.68, 90.36], BE: [50.5, 4.47],    BF: [12.36, -1.56],
  BG: [42.73, 25.49], BI: [-3.37, 29.92],  BJ: [9.31, 2.32],
  BO: [-16.29, -63.59], BR: [-14.24, -51.93], BY: [53.71, 27.95],
  CA: [56.13, -106.35], CD: [-4.04, 21.76], CF: [6.61, 20.94],
  CG: [-0.23, 15.83], CH: [46.82, 8.23],   CI: [7.54, -5.55],
  CL: [-35.68, -71.54], CM: [3.85, 11.5],  CN: [35.86, 104.2],
  CO: [4.57, -74.3],  CU: [21.52, -77.78], DE: [51.17, 10.45],
  DJ: [11.83, 42.59], DZ: [28.03, 1.66],   EC: [-1.83, -78.18],
  EG: [26.82, 30.8],  ER: [15.18, 39.78],  ES: [40.46, -3.75],
  ET: [9.15, 40.49],  FR: [46.23, 2.21],   GA: [-0.8, 11.61],
  GB: [55.38, -3.44], GE: [42.32, 43.36],  GH: [7.95, -1.02],
  GM: [13.44, -15.31], GN: [9.95, -11.43], GQ: [1.65, 10.27],
  GR: [39.07, 21.82], GT: [15.78, -90.23], GW: [11.8, -15.18],
  GY: [4.86, -58.93], HN: [15.2, -86.24],  HR: [45.1, 15.2],
  HT: [18.97, -72.29], HU: [47.16, 19.5],  ID: [-0.79, 113.92],
  IN: [20.59, 78.96], IQ: [33.22, 43.68],  IR: [32.43, 53.69],
  IL: [31.05, 34.85], IT: [41.87, 12.57],  JO: [30.59, 36.24],
  JP: [36.2, 138.25], KE: [-0.02, 37.91],  KG: [41.2, 74.77],
  KH: [12.57, 104.99], KP: [40.34, 127.51], KR: [35.91, 127.77],
  LB: [33.85, 35.86], LY: [26.34, 17.23],  MA: [31.79, -7.09],
  MD: [47.41, 28.37], ML: [17.57, -3.99],  MM: [21.92, 95.96],
  MR: [21.01, -10.94], MW: [-13.25, 34.3], MX: [23.63, -102.55],
  MZ: [-18.67, 35.53], NG: [9.08, 8.68],   NI: [12.87, -85.21],
  NE: [17.61, 8.08],  NO: [60.47, 8.47],   NP: [28.39, 84.12],
  NZ: [-40.9, 174.89], OM: [21.51, 55.92], PA: [8.54, -80.78],
  PE: [-9.19, -75.02], PH: [12.88, 121.77], PK: [30.38, 69.35],
  PL: [51.92, 19.15], PS: [31.95, 35.23],  PT: [39.4, -8.22],
  PY: [-23.44, -58.44], RO: [45.94, 24.97], RS: [44.02, 21.01],
  RU: [61.52, 105.32], RW: [-1.94, 29.87], SA: [23.89, 45.08],
  SD: [12.86, 30.22], SE: [60.13, 18.64],  SI: [46.15, 14.99],
  SL: [8.46, -11.78], SO: [5.15, 46.2],    SS: [6.88, 31.31],
  SV: [13.79, -88.9], SY: [34.8, 38.99],   TD: [15.45, 18.73],
  TG: [8.62, 0.82],   TH: [15.87, 100.99], TJ: [38.86, 71.28],
  TM: [38.97, 59.56], TN: [33.89, 9.54],   TR: [38.96, 35.24],
  TZ: [-6.37, 34.89], UA: [48.38, 31.17],  UG: [1.37, 32.29],
  US: [37.09, -95.71], UZ: [41.38, 64.59], VE: [6.42, -66.59],
  VN: [14.06, 108.28], YE: [15.55, 48.52], ZA: [-30.56, 22.94],
  ZM: [-13.13, 27.85], ZW: [-19.02, 29.15],
};

const WW_SPREAD_COORDS = [
  [15.55, 48.52],  [12.86, 30.22],  [6.88, 31.31],
  [5.15, 46.2],    [33.22, 43.68],  [34.8, 38.99],
  [9.08, 8.68],    [15.45, 18.73],  [23.68, 90.36],
  [28.39, 84.12],  [21.92, 95.96],  [3.85, 11.5],
  [18.97, -72.29], [48.38, 31.17],  [-6.37, 34.89],
  [14.06, 108.28], [40.34, 127.51], [-1.94, 29.87],
  [11.83, 42.59],  [26.82, 30.8],   [17.57, -3.99],
  [9.15, 40.49],   [31.05, 34.85],  [-4.04, 21.76],
  [6.61, 20.94],
];

const TYPE_CONFIG = {
  conflict: { fill: "#e11d48", stroke: "#9f1239" },
  famine:   { fill: "#ea580c", stroke: "#9a3412" },
  disease:  { fill: "#7c3aed", stroke: "#4c1d95" },
  disaster: { fill: "#d97706", stroke: "#92400e" },
  economic: { fill: "#0d9488", stroke: "#134e4a" },
};

export default function WorldMap({ events = [] }) {
  const [hoveredId, setHoveredId] = useState(null);

  const processedData = useMemo(() => {
    const byKey = {};
    let wwIdx = 0;

    events.forEach((e) => {
      const cc = e.countryCode;
      const isGlobal =
        !cc || cc === "WW" || cc === "GLOBAL" || !countryCoords[cc];

      if (isGlobal) {
        const slotKey = `WW_${wwIdx}`;
        const coord = WW_SPREAD_COORDS[wwIdx % WW_SPREAD_COORDS.length];
        wwIdx++;
        byKey[slotKey] = {
          events: [e],
          maxSev: e.severity || 0,
          // For WW events, try to get a meaningful name from the event itself
          displayName: e.country || e.location || "Global Event",
          coords: [
            coord[0] + (Math.random() - 0.5) * 0.8,
            coord[1] + (Math.random() - 0.5) * 0.8,
          ],
          isWW: true,
        };
        return;
      }

      if (!byKey[cc]) {
        byKey[cc] = {
          events: [],
          maxSev: 0,
          // FIX: resolve proper country name from cc, ignore e.region entirely
          displayName: countryNames[cc] || cc,
          coords: [...countryCoords[cc]],
          isWW: false,
        };
      }

      byKey[cc].events.push(e);
      if ((e.severity || 0) > byKey[cc].maxSev) {
        byKey[cc].maxSev = e.severity || 0;
      }
    });

    return byKey;
  }, [events]);

  const getTopType = (evts) => {
    const count = {};
    evts.forEach((e) => {
      count[e.type] = (count[e.type] || 0) + 1;
    });
    return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
  };

  const sevLabel = (s) => s >= 8 ? "CRITICAL" : s >= 5 ? "HIGH" : "LOW";
  const sevColor = (s) => s >= 8 ? "#e11d48" : s >= 5 ? "#d97706" : "#10b981";
  const sevBg   = (s) => s >= 8 ? "rgba(225,29,72,0.15)" : s >= 5 ? "rgba(217,119,6,0.15)" : "rgba(16,185,129,0.15)";

  const countryCount  = Object.values(processedData).filter((d) => !d.isWW).length;
  const criticalCount = Object.values(processedData).filter((d) => d.maxSev >= 8).length;

  return (
    <div style={s.wrapper}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.liveDot} />
          <span style={s.headerTitle}>Live Crisis Heatmap</span>
        </div>
        <div style={s.legend}>
          {Object.entries(TYPE_CONFIG).map(([type, { fill }]) => (
            <div key={type} style={s.legendItem}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: fill }} />
              <span style={s.legendLabel}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div style={s.mapWrap}>
        <MapContainer
          center={[20, 10]}
          zoom={2}
          zoomControl={false}
          style={s.map}
          scrollWheelZoom={true}
        >
          <ResizeMap />
          <ZoomControl position="bottomright" />
          <TileLayer
            // url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            // attribution='&copy; <a href="https://stadiamaps.com/"></a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Object.entries(processedData).map(([key, data]) => {
            const type = getTopType(data.events);
            const cfg  = TYPE_CONFIG[type] || TYPE_CONFIG.conflict;
            const isHovered = hoveredId === key;

            return (
              <CircleMarker
                key={key}
                center={data.coords}
                radius={Math.min(Math.max((data.maxSev || 5) * 1.8, 5), 18)}
                pathOptions={{
                  color: cfg.stroke,
                  fillColor: cfg.fill,
                  fillOpacity: isHovered ? 1 : 0.78,
                  weight: isHovered ? 2 : 1,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredId(key),
                  mouseout:  () => setHoveredId(null),
                }}
              >
                <Popup>
                  <div style={p.box}>
                    {/* Popup header */}
                    <div style={p.header}>
                      <strong style={p.title}>
                        {data.displayName}
                      </strong>
                      <span style={{
                        ...p.badge,
                        color:      sevColor(data.maxSev),
                        background: sevBg(data.maxSev),
                        border:     `1px solid ${sevColor(data.maxSev)}40`,
                      }}>
                        {sevLabel(data.maxSev)}
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={p.meta}>
                      {data.events.length} event{data.events.length !== 1 ? "s" : ""}
                      &nbsp;·&nbsp;Max severity {data.maxSev}/10
                    </div>

                    {/* Event list */}
                    <div style={p.divider} />
                    {data.events.slice(0, 4).map((ev, i) => (
                      <div key={i} style={p.eventRow}>
                        <span style={{
                          ...p.typeDot,
                          background: (TYPE_CONFIG[ev.type] || TYPE_CONFIG.conflict).fill,
                        }} />
                        <span style={p.eventTitle}>
                          {ev.title
                            ? ev.title.length > 55
                              ? ev.title.slice(0, 55) + "…"
                              : ev.title
                            : ev.type}
                        </span>
                      </div>
                    ))}
                    {data.events.length > 4 && (
                      <div style={p.more}>
                        +{data.events.length - 4} more events
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* STATS OVERLAY */}
        <div style={s.stats}>
          <div style={s.statItem}>
            <b style={{ fontSize: 18, color: "#fff" }}>{countryCount}</b>
            <span style={{ fontSize: 10, color: "#64748b" }}>Countries</span>
          </div>
          <div style={s.statItem}>
            <b style={{ fontSize: 18, color: "#e11d48" }}>{criticalCount}</b>
            <span style={{ fontSize: 10, color: "#64748b" }}>Critical</span>
          </div>
          <div style={s.statItem}>
            <b style={{ fontSize: 18, color: "#fff" }}>{events.length}</b>
            <span style={{ fontSize: 10, color: "#64748b" }}>Total Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Map styles ─── */
const s = {
  wrapper: {
    width: "100%",
    marginBottom: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  legend: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  legendLabel: {
    color: "#64748b",
    fontSize: "11px",
    textTransform: "capitalize",
  },
  mapWrap: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  map: {
    height: "420px",
    width: "100%",
  },
  stats: {
    position: "absolute",
    bottom: 12,
    left: 12,
    background: "rgba(10,22,40,0.9)",
    backdropFilter: "blur(8px)",
    padding: "8px 14px",
    borderRadius: "8px",
    display: "flex",
    gap: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    zIndex: 1000,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
};

/* ─── Popup styles ─── */
const p = {
  box: {
    minWidth: 210,
    fontFamily: "'Inter', sans-serif",
    background: "#0d1b2e",
    borderRadius: 8,
    padding: "2px 0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 13,
    color: "#f1f5f9",
    fontWeight: 700,
  },
  badge: {
    fontSize: 9,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 4,
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  meta: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    marginBottom: 7,
  },
  eventRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    marginBottom: 5,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    marginTop: 3,
    flexShrink: 0,
  },
  eventTitle: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 1.4,
  },
  more: {
    fontSize: 10,
    color: "#475569",
    marginTop: 4,
    paddingTop: 4,
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
};