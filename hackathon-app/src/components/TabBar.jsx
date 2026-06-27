import { useNav } from '../context/Nav';

// 01 화면 하단 탭바 (스페이스 / + 추가 / 알림 / 프로필)
export function TabBar({ active = 'space', onPlus, onProfile }) {
  const { reset } = useNav();
  const muted = '#6a6a70';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, zIndex: 40, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', padding: '11px 14px 0', background: 'rgba(13,13,15,.82)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderTop: '.5px solid rgba(255,255,255,.08)' }}>
      {/* 내 지도 */}
      <div className="pm-tap" onClick={() => reset('myspace')} style={col}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" stroke={muted} strokeWidth="1.8" /></svg>
        <span style={{ font: `600 10px/1 system-ui`, color: muted }}>내 지도</span>
      </div>
      {/* 스페이스 */}
      <div className="pm-tap" onClick={() => reset('spaces')} style={col}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6.2" fill={active === 'space' ? '#2997ff' : 'none'} fillOpacity=".25" stroke={active === 'space' ? '#2997ff' : muted} strokeWidth="1.9" /><circle cx="15" cy="12" r="6.2" fill={active === 'space' ? '#2997ff' : 'none'} fillOpacity=".25" stroke={active === 'space' ? '#2997ff' : muted} strokeWidth="1.9" /></svg>
        <span style={{ font: `${active === 'space' ? 800 : 600} 10px/1 system-ui`, color: active === 'space' ? '#2997ff' : muted }}>스페이스</span>
      </div>
      {/* + 추가 */}
      <div className="pm-tap" onClick={onPlus} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 52, height: 38, borderRadius: 15, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(41,151,255,.4)', marginTop: -2 }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </div>
      </div>
      {/* 알림 */}
      <div className="pm-tap" style={col}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" stroke={muted} strokeWidth="1.8" strokeLinejoin="round" /><path d="M10.5 21a2 2 0 0 0 3 0" stroke={muted} strokeWidth="1.8" strokeLinecap="round" /></svg>
        <span style={{ font: `600 10px/1 system-ui`, color: muted }}>알림</span>
      </div>
      {/* 프로필 */}
      <div className="pm-tap" onClick={onProfile} style={col}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(140deg,#5aa0ef,#0066cc)' }} />
        <span style={{ font: `600 10px/1 system-ui`, color: muted }}>프로필</span>
      </div>
    </div>
  );
}

const col = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 };

// 03/04/10 공용 3탭 토글 (지도 / 리스트 / 로그)
export function DetailTabs({ active, onMap, onList, onLog, floating = false, hasNew = false }) {
  const tab = (label, on, isActive, extraDot) => (
    <div className="pm-tap" onClick={on} style={{ flex: floating ? undefined : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: extraDot ? 5 : 0, textAlign: 'center', borderRadius: floating ? 9 : 10, padding: floating ? '8px 18px' : '9px 0', background: isActive ? '#2997ff' : 'transparent', font: `${isActive ? 800 : 700} 13px/1 system-ui`, color: isActive ? '#fff' : '#6a6a70' }}>
      {label}
      {extraDot && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />}
    </div>
  );
  const wrap = floating
    ? { position: 'absolute', top: 172, left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: 'rgba(24,24,27,.9)', backdropFilter: 'blur(14px)', borderRadius: 12, padding: 4, display: 'flex', boxShadow: '0 6px 18px rgba(0,0,0,.4)' }
    : { margin: '16px 20px 0', background: '#18181B', borderRadius: 13, padding: 4, display: 'flex' };
  return (
    <div style={wrap}>
      {tab('지도', onMap, active === 'map')}
      {tab('리스트', onList, active === 'list')}
      {tab('로그', onLog, active === 'log', hasNew)}
    </div>
  );
}
