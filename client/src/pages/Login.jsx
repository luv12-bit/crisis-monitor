import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaBrain, FaSatellite, FaBell, FaTimesCircle } from "react-icons/fa";
import useResponsive from '../hooks/useResponsive';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form,        setForm]       = useState({ name: '', email: '', password: '' });
  const [message,     setMessage]    = useState('');
  const [loading,     setLoading]    = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handle = async () => {
    setLoading(true); setMessage('');
    try {
      const url = isRegister
        ? '${process.env.REACT_APP_API_URL}/api/auth/register'
        : '${process.env.REACT_APP_API_URL}/api/auth/login';
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      setMessage('success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const features = [
    { icon: <FaGlobe />,    text: 'Live crisis events from 195+ countries'    },
    { icon: <FaBrain />,    text: 'AI-powered risk prediction engine'          },
    { icon: <FaSatellite />,text: 'Auto-refreshes from WHO, ACLED & GDELT'    },
    { icon: <FaBell />,     text: 'Subscribe to region-specific alerts'        },
  ];

  return (
    <div style={{ ...s.page, flexDirection: isMobile ? 'column' : 'row' }}>
      <div style={s.grid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      {/* Left panel — hide on mobile */}
      {!isMobile && (
        <div style={s.left}>
          <div style={s.leftInner}>
            <div style={s.brand}>
              <div style={s.dot} />
              <span style={s.brandText}>Shadow Crisis Monitor</span>
            </div>
            <h1 style={s.leftTitle}>Global Crisis<br />Intelligence</h1>
            <p style={s.leftSub}>
              Real-time monitoring of conflict, famine, disease and disaster signals
              worldwide — powered by live data and ML prediction.
            </p>
            <div style={s.feats}>
              {features.map((f, i) => (
                <div key={i} style={s.feat}>
                  <div style={s.featDot} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {f.icon} {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right panel — form */}
      <div style={{ ...s.right, width: isMobile ? '100%' : '480px', padding: isMobile ? '30px 20px' : '40px 48px', minHeight: isMobile ? '100vh' : 'auto', alignItems: isMobile ? 'flex-start' : 'center' }}>
        <div style={{ ...s.card, padding: isMobile ? '28px 20px' : '40px' }}>

          {/* Mobile brand */}
          {isMobile && (
            <div style={{ ...s.brand, marginBottom: '24px' }}>
              <div style={s.dot} />
              <span style={s.brandText}>Shadow Crisis Monitor</span>
            </div>
          )}

          <div style={s.cardTop}>
            <div style={s.secDot} />
            <span style={s.secLabel}>SECURE ACCESS</span>
          </div>

          <h2 style={s.formTitle}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={s.formSub}>{isRegister ? 'Join the global monitoring network' : 'Sign in to access live crisis data'}</p>

          {isRegister && (
            <div style={s.fieldWrap}>
              <label style={s.label}>FULL NAME</label>
              <input style={s.input} placeholder="Your full name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handle()} />
            </div>
          )}

          <div style={s.fieldWrap}>
            <label style={s.label}>EMAIL ADDRESS</label>
            <input style={s.input} placeholder="you@example.com" type="email"
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>PASSWORD</label>
            <input style={s.input} placeholder="••••••••" type="password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>

          <button style={{ ...s.btn, opacity: loading ? 0.75 : 1 }} onClick={handle} disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Create Account →' : 'Access Dashboard →'}
          </button>

          {message && (
            <div style={{ ...s.msg,
              background:  message === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              borderColor: message === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)',
              color:       message === 'success' ? '#10b981' : '#f43f5e',
            }}>
              {message === 'success' ? 'Success! Loading dashboard...' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <FaTimesCircle /> {message}
                </span>
              )}
            </div>
          )}

          <div style={s.divider} />
          <button style={s.toggle} onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>
            {isRegister ? '← Already have an account? Sign In' : "Don't have an account? Register →"}
          </button>
          <p style={s.footNote}>JWT Secured · MongoDB · Real-time</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:      { minHeight: '100vh', background: '#060912', display: 'flex', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' },
  grid:      { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,245,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.025) 1px,transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' },
  glow1:     { position: 'fixed', top: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,245,212,0.06) 0%,transparent 70%)', pointerEvents: 'none' },
  glow2:     { position: 'fixed', bottom: '-150px', right: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)', pointerEvents: 'none' },
  left:      { flex: 1, display: 'flex', alignItems: 'center', padding: '60px', borderRight: '1px solid rgba(255,255,255,0.05)' },
  leftInner: { maxWidth: '440px' },
  brand:     { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' },
  dot:       { width: '10px', height: '10px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 12px rgba(0,245,212,0.7)', flexShrink: 0 },
  brandText: { fontSize: '13px', color: '#475569', letterSpacing: '0.5px', fontFamily: "'JetBrains Mono', monospace" },
  leftTitle: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: '800', lineHeight: 1.1, margin: '0 0 18px', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-1.5px', background: 'linear-gradient(135deg,#ffffff 20%,#00f5d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  leftSub:   { fontSize: '14px', color: '#475569', lineHeight: 1.8, margin: '0 0 28px' },
  feats:     { display: 'flex', flexDirection: 'column', gap: '12px' },
  feat:      { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#94a3b8' },
  featDot:   { width: '6px', height: '6px', borderRadius: '50%', background: '#00f5d4', flexShrink: 0 },
  right:     { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card:      { width: '100%', background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', boxSizing: 'border-box' },
  cardTop:   { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
  secDot:    { width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px rgba(244,63,94,0.5)' },
  secLabel:  { fontSize: '10px', color: '#475569', letterSpacing: '3px', fontFamily: "'JetBrains Mono', monospace" },
  formTitle: { fontSize: '24px', fontWeight: '800', margin: '0 0 6px', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' },
  formSub:   { fontSize: '13px', color: '#475569', margin: '0 0 28px' },
  fieldWrap: { marginBottom: '16px' },
  label:     { display: 'block', fontSize: '10px', color: '#334155', letterSpacing: '2px', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' },
  input:     { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', outline: 'none' },
  btn:       { width: '100%', padding: '13px', background: 'linear-gradient(135deg,#00f5d4,#00b4d8)', border: 'none', borderRadius: '10px', color: '#060912', fontSize: '15px', fontWeight: '700', marginTop: '8px', cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" },
  msg:       { textAlign: 'center', marginTop: '14px', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid', fontWeight: '500' },
  divider:   { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' },
  toggle:    { width: '100%', padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: '#475569', fontSize: '13px', cursor: 'pointer' },
  footNote:  { textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#1e293b', fontFamily: "'JetBrains Mono', monospace' " },
};