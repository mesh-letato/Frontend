import { useNav } from '../context/Nav';
import { MY_SPACE } from '../data/mock';

// 01 화면 하단 탭바 — 3버튼 구성 (내 지도 / + 추가 / 스페이스)
export function TabBar({ active = 'space', onPlus }) {
  const { go, reset } = useNav();
  const muted = '#6a6a70';
  const mineActive = active === 'myspace';
  const spaceActive = active === 'space';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, zIndex: 40, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', padding: '11px 14px 0', background: 'rgba(13,13,15,.82)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderTop: '.5px solid rgba(255,255,255,.08)' }}>
      {/* 내 지도 (+ 좌측) */}
      <div className="pm-tap" onClick={() => go('spaceMap', { space: MY_SPACE, mine: true })} style={col}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill={mineActive ? '#2997ff' : 'none'} fillOpacity=".25" stroke={mineActive ? '#2997ff' : muted} strokeWidth="1.8" /></svg>
        <span style={{ font: `${mineActive ? 800 : 600} 10px/1 system-ui`, color: mineActive ? '#2997ff' : muted }}>내 지도</span>
      </div>
      {/* + 추가 (가운데) */}
      <div className="pm-tap" onClick={onPlus} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 56, height: 40, borderRadius: 16, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(41,151,255,.4)', marginTop: -2 }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </div>
      </div>
      {/* 스페이스 (+ 우측) */}
      <div className="pm-tap" onClick={() => reset('spaces')} style={col}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6.2" fill={spaceActive ? '#2997ff' : 'none'} fillOpacity=".25" stroke={spaceActive ? '#2997ff' : muted} strokeWidth="1.9" /><circle cx="15" cy="12" r="6.2" fill={spaceActive ? '#2997ff' : 'none'} fillOpacity=".25" stroke={spaceActive ? '#2997ff' : muted} strokeWidth="1.9" /></svg>
        <span style={{ font: `${spaceActive ? 800 : 600} 10px/1 system-ui`, color: spaceActive ? '#2997ff' : muted }}>스페이스</span>
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
