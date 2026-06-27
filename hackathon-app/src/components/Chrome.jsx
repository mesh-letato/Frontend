import { T } from '../theme';

// 노치 (다이나믹 아일랜드)
export function Notch() {
  return (
    <div style={{ position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 22, background: '#000', zIndex: 50 }} />
  );
}

// 상단 상태바 9:41
export function StatusBar({ dark = false }) {
  const c = dark ? '#0D0D0F' : '#fff';
  return (
    <div style={{ position: 'relative', height: 54, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '19px 32px 0', flexShrink: 0 }}>
      <span style={{ font: `600 16px/1 Pinmoa, system-ui`, color: c }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx=".6" fill={c} /><rect x="4.5" y="5" width="3" height="6" rx=".6" fill={c} /><rect x="9" y="2.5" width="3" height="8.5" rx=".6" fill={c} /><rect x="13.5" y="0" width="3" height="11" rx=".6" fill={c} /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.8C10.1 2.8 12 3.6 13.4 5l1-1C12.7 2.3 10.5 1.3 8 1.3 5.5 1.3 3.3 2.3 1.6 4l1 1C4 3.6 5.9 2.8 8 2.8Z" fill={c} /><circle cx="8" cy="9.3" r="1.3" fill={c} /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity=".35" fill="none" /><rect x="2" y="2" width="16" height="8" rx="1.5" fill={c} /><path d="M23 4v4c.7-.3 1.2-1 1.2-2s-.5-1.7-1.2-2Z" fill={c} fillOpacity=".4" /></svg>
      </span>
    </div>
  );
}

// 하단 홈 인디케이터
export function HomeIndicator() {
  return (
    <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 139, height: 5, borderRadius: 100, background: 'rgba(255,255,255,.5)', zIndex: 60 }} />
  );
}

// 뒤로가기 버튼 (원형)
export function BackBtn({ onClick, light = false }) {
  return (
    <div className="pm-tap" onClick={onClick} style={{ width: 36, height: 36, borderRadius: '50%', background: light ? 'rgba(0,0,0,.4)' : T.card2, backdropFilter: light ? 'blur(10px)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="9" height="16" viewBox="0 0 9 16"><path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

// 아바타 (이니셜 또는 색상 원)
export function Avatar({ m, size = 26, border = T.bg, ml = 0, fontSize }) {
  const showInitial = m.initial && m.initial !== '·';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', border: `2px solid ${border}`,
      background: m.color, marginLeft: ml, display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: `800 ${fontSize || Math.round(size * 0.36)}px/1 Pinmoa, system-ui`, color: '#fff', flexShrink: 0,
    }}>
      {showInitial ? m.initial : ''}
    </div>
  );
}
