import { useNav } from '../context/Nav';
import { BackBtn, Avatar } from './Chrome';
import { members } from '../data/mock';

// 03/10 공용 상단 (뒤로/멤버관리 + 제목 + 멤버수) — 스크롤 시 고정
export function SpaceHeaderTop({ space }) {
  const { back, showToast } = useNav();
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div className="pm-tap" onClick={() => showToast('멤버 관리 (준비 중)')} style={{ width: 36, height: 36, borderRadius: '50%', background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="#fff" strokeWidth="1.8" /><path d="M5 19c0-3.3 3.1-5 7-5s7 1.7 7 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><path d="M19 7v4M21 9h-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </div>
      </div>
      <div style={{ padding: '12px 20px 0', font: '800 28px/1 system-ui', letterSpacing: '-1px', color: '#fff' }}>{space?.name || '성수 맛집 🍝'}</div>
      <div style={{ padding: '9px 20px 0', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ display: 'flex' }}>
          {['me', 'jiyoon', 'doyoon'].map((k, i) => <Avatar key={k} m={members[k]} size={26} border="#0D0D0F" ml={i === 0 ? 0 : -9} />)}
          <div style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid #0D0D0F', background: '#2a2a2e', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 9px/1 system-ui', color: '#fff' }}>+2</div>
        </div>
        <span style={{ font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.55)' }}>{space?.placeCount ?? 18}곳 · 멤버 {space?.memberCount ?? 5}</span>
      </div>
    </>
  );
}
