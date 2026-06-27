import { T } from '../theme';

// 노치 (다이나믹 아일랜드) — PWA 전체화면에서는 사용하지 않음
export function Notch() {
  return null;
}

// 상단 안전영역 스페이서 (노치 기기에서 콘텐츠가 가려지지 않도록 여백만 확보)
// 기존의 가짜 상태바(9:41/배터리)는 제거.
export function StatusBar() {
  return (
    <div style={{ height: 'max(env(safe-area-inset-top, 0px), 12px)', flexShrink: 0 }} />
  );
}

// 하단 홈 인디케이터 — PWA 전체화면에서는 사용하지 않음
export function HomeIndicator() {
  return null;
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
      font: `800 ${fontSize || Math.round(size * 0.36)}px/1 system-ui`, color: '#fff', flexShrink: 0,
    }}>
      {showInitial ? m.initial : ''}
    </div>
  );
}
