import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const h   = pad(time.getHours());
  const m   = pad(time.getMinutes());
  const sec = pad(time.getSeconds());

  return (
    <div style={s.wrap}>
      <div style={s.dot} />
      <span style={s.time}>
        <span style={s.num}>{h}</span>
        <span style={{ ...s.colon, opacity: time.getSeconds() % 2 === 0 ? 1 : 0.2 }}>:</span>
        <span style={s.num}>{m}</span>
        <span style={{ ...s.colon, opacity: time.getSeconds() % 2 === 0 ? 1 : 0.2 }}>:</span>
        <span style={{ ...s.num, color: '#791425' }}>{sec}</span>
      </span>
    </div>
  );
}

const s = {
  wrap:  { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,245,212,0.06)', border: '1px solid rgba(0,245,212,0.15)', borderRadius: '8px', padding: '5px 12px' },
  dot:   { width: '6px', height: '6px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 6px #00f5d4', animation: 'pulse 2s infinite' },
  time:  { display: 'flex', alignItems: 'center', gap: '1px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '700' },
  num:   { color: '#e2e8f0' },
  colon: { color: '#00f5d4', transition: 'opacity 0.1s', margin: '0 1px' },
};