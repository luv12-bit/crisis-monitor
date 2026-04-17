import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import useResponsive from '../hooks/useResponsive';

const COLORS = {
  conflict: '#f43f5e', famine: '#f97316',
  disease:  '#8b5cf6', disaster: '#f59e0b', economic: '#14b8a6',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
      <p style={{ color: '#475569', fontSize: '11px', margin: '0 0 4px', fontFamily: "'JetBrains Mono'" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#00f5d4', fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function CrisisChart({ events }) {
  const { isMobile } = useResponsive();

  const typeData = ['conflict','famine','disease','disaster','economic'].map(type => ({
    type, count: events.filter(e => e.type === type).length,
  }));

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label   = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    const dateStr = d.toISOString().slice(0, 10);
    last7.push({
      date:     label,
      events:   events.filter(e => e.eventDate?.slice(0, 10) === dateStr).length,
      critical: events.filter(e => e.eventDate?.slice(0, 10) === dateStr && e.severity >= 8).length,
    });
  }

  const radarData = ['conflict','famine','disease','disaster','economic'].map(type => {
    const typeEvents = events.filter(e => e.type === type);
    const avg = typeEvents.length
      ? parseFloat((typeEvents.reduce((a, e) => a + e.severity, 0) / typeEvents.length).toFixed(1)) : 0;
    return { type: type.charAt(0).toUpperCase() + type.slice(1), avgSeverity: avg, count: typeEvents.length };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

      {/* Row 1 — stack on mobile */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div style={card}>
          <h3 style={title}>Events by Crisis Type</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={typeData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="type" tick={{ fill: '#475569', fontSize: 9, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Events" radius={[6,6,0,0]}>
                {typeData.map((e, i) => <Cell key={i} fill={COLORS[e.type]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={title}>Events Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={last7} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00f5d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 8, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="events"   name="All Events"    stroke="#00f5d4" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="critical" name="Critical (8+)" stroke="#f43f5e" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Row 2 — Radar — stack on mobile */}
      <div style={card}>
        <h3 style={title}>Crisis Intelligence Radar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={isMobile ? 220 : 260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="type"
                tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#334155', fontSize: 9 }} axisLine={false} />
              <Radar name="Avg Severity" dataKey="avgSeverity" stroke="#00f5d4" fill="#00f5d4" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Event Count"  dataKey="count"       stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1}  strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {radarData.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: Object.values(COLORS)[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0' }}>{d.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#00f5d4', fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' }}>{d.avgSeverity}/10</span>
                  <span style={{ fontSize: '11px', color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const card  = { background: '#0d1220', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '18px 20px' };
const title = { margin: '0 0 14px', fontSize: '13px', fontWeight: '700', color: '#64748b', fontFamily: "'Space Grotesk', sans-serif" };