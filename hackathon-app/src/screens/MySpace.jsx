import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';

export default function MySpace() {
  const { reset, go, myPlaces } = useNav();
  const [linkModal, setLinkModal] = useState(false);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      <div className="pm-scroll" style={{ flex: 1, paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 0' }}>
          <div style={{ font: '800 34px/1 system-ui', letterSpacing: '-1.4px', color: '#fff' }}>내 스페이스</div>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(140deg,#5aa0ef,#0066cc)' }} />
        </div>
        <div style={{ padding: '6px 22px 0', font: '500 14px/1.3 system-ui', color: 'rgba(255,255,255,.45)' }}>가입 시 자동 생성 · 나만의 공간이에요</div>

        {/* 링크 붙여넣기 */}
        <div className="pm-tap" onClick={() => setLinkModal(true)} style={{ margin: '16px 22px 0', display: 'flex', alignItems: 'center', gap: 12, background: '#2997ff', borderRadius: 18, padding: '15px 16px', boxShadow: '0 10px 22px rgba(41,151,255,.32)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M12 9v6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /><path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="#fff" strokeWidth="1.8" opacity=".6" /></svg></div>
          <div style={{ flex: 1 }}><div style={{ font: '700 15px/1.1 system-ui', color: '#fff' }}>링크 붙여넣기</div><div style={{ marginTop: 3, font: '500 12px/1.2 system-ui', color: 'rgba(255,255,255,.8)' }}>릴스·틱톡 링크를 붙여넣어 저장</div></div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#2997ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        </div>

        {/* 저장된 장소 헤더 */}
        <div style={{ margin: '20px 16px 0', borderRadius: 22, overflow: 'hidden', background: 'radial-gradient(circle at 65% 30%,rgba(41,151,255,.25),transparent 60%),linear-gradient(160deg,#14213a,#0b1220)' }}>
          <div style={{ height: 80, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
            <div><div style={{ font: '800 20px/1 system-ui', letterSpacing: '-.5px', color: '#fff' }}>저장된 장소</div><div style={{ marginTop: 5, font: '500 11.5px/1 system-ui', color: 'rgba(255,255,255,.5)' }}>스페이스로 친구와 합칠 수 있어요</div></div>
            <div style={{ background: '#2997ff', borderRadius: 9999, padding: '6px 12px', font: '800 13px/1 system-ui', color: '#fff' }}>{myPlaces.length}곳</div>
          </div>
        </div>

        <div style={{ padding: '18px 22px 8px', font: '800 18px/1 system-ui', letterSpacing: '-.5px', color: '#fff' }}>최근 저장</div>
        <div style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myPlaces.map((p, i) => (
            <div key={p.id} className="pm-tap" onClick={() => go('placeDetail', { place: { ...p, addr: `${p.area}`, rating: '4.7' } })} style={{ background: '#18181B', borderRadius: 20, padding: 13, display: 'flex', gap: 12, alignItems: 'center', animation: i === 0 ? 'pmPop .35s ease' : 'none' }}>
              <div style={{ position: 'relative', width: 60, height: 60, borderRadius: 15, flexShrink: 0, background: p.thumb }}>
                {p.count && <div style={{ position: 'absolute', left: -4, top: -6, background: '#2997ff', border: '2px solid #18181B', borderRadius: 9999, padding: '2px 7px', font: '800 10px/1 system-ui', color: '#fff' }}>{p.count}명</div>}
                {i === 0 && p.isNew && <div style={{ position: 'absolute', right: -4, top: -6, background: '#30d158', border: '2px solid #18181B', borderRadius: 9999, padding: '2px 7px', font: '800 9px/1 system-ui', color: '#0D0D0F' }}>NEW</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ font: '800 16px/1.1 system-ui', letterSpacing: '-.3px', color: '#fff' }}>{p.name}</div><div style={{ marginTop: 4, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{p.cat} · {p.area}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 탭 (스페이스 / 추가) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, zIndex: 40, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '11px 60px 0', background: 'rgba(13,13,15,.92)', backdropFilter: 'blur(20px) saturate(160%)', borderTop: '.5px solid rgba(255,255,255,.08)' }}>
        <div className="pm-tap" onClick={() => reset('spaces')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingTop: 3 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6.2" stroke="#6a6a70" strokeWidth="1.8" /><circle cx="15" cy="12" r="6.2" stroke="#6a6a70" strokeWidth="1.8" /></svg>
          <span style={{ font: '600 10px/1 system-ui', color: '#6a6a70' }}>스페이스</span>
        </div>
        <div className="pm-tap" onClick={() => setLinkModal(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: -5 }}>
          <div style={{ width: 60, height: 42, borderRadius: 17, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 22px rgba(41,151,255,.5)' }}><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg></div>
          <span style={{ font: '600 10px/1 system-ui', color: '#6a6a70' }}>추가</span>
        </div>
      </div>

      {linkModal && <LinkModal onClose={() => setLinkModal(false)} onSubmit={(url) => { setLinkModal(false); go('linkAnalyzing', { url }); }} />}
      <HomeIndicator />
    </div>
  );
}

function LinkModal({ onClose, onSubmit }) {
  const [url, setUrl] = useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div className="pm-up" onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1e', borderRadius: '28px 28px 0 0', padding: '22px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,.2)', margin: '0 auto 24px' }} />
        <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff', marginBottom: 8 }}>장소 가져오기</div>
        <div style={{ font: '500 14px/1.5 system-ui', color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>릴스·틱톡 링크를 붙여넣으면 장소를 자동으로 찾아줘요</div>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '14px 16px', font: '500 14px/1 system-ui', color: '#fff', outline: 'none' }} />
        <div className="pm-tap" onClick={() => onSubmit(url || 'instagram.com/reel/Cx8q…seongsu')} style={{ marginTop: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2997ff', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(41,151,255,.36)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></svg>
          <span style={{ font: '800 16px/1 system-ui', color: '#fff' }}>가져오기</span>
        </div>
        <div className="pm-tap" onClick={onClose} style={{ marginTop: 12, textAlign: 'center', font: '700 14px/1 system-ui', color: 'rgba(255,255,255,.4)', padding: 10 }}>취소</div>
      </div>
    </div>
  );
}
