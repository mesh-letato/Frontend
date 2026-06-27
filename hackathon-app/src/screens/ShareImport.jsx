import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { mySpace, grad } from '../data/mock';

// 인스타 릴스 공유 → PWA 진입 → 어느 스페이스에 핀을 꽂을지 선택
export default function ShareImport({ place }) {
  const { back, reset, spaces, showToast } = useNav();
  const p = place || { name: '미오 성수', cat: '이탈리안', addr: '서울 성동구 연무장길 33', g: grad.pasta };
  // 내 스페이스는 기본 선택(고정), 참여 스페이스는 토글
  const [picked, setPicked] = useState(() => new Set(['my']));

  const toggle = (id) => setPicked((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const confirm = () => {
    showToast(`${picked.size}개 스페이스에 핀을 꽂았어요 📌`);
    reset('spaces');
  };

  const allSpaces = [
    { id: 'my', name: mySpace.name, sub: '나만의 공간 · 기본 저장', locked: true, emoji: '🗺️' },
    ...spaces.map((s) => ({ id: s.id, name: s.name, sub: `${s.placeCount}곳 · 멤버 ${s.memberCount}`, emoji: s.emoji })),
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(48,209,88,.15)', borderRadius: 9999, padding: '6px 12px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
          <span style={{ font: '700 12px/1 system-ui', color: '#30d158' }}>릴스에서 장소 확인됨</span>
        </div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div className="pm-scroll" style={{ flex: 1, paddingBottom: 150 }}>
        <div style={{ padding: '16px 20px 0', font: '800 26px/1.2 system-ui', letterSpacing: '-.8px', color: '#fff' }}>어디에 저장할까요?</div>
        <div style={{ padding: '6px 20px 0', font: '500 14px/1.35 system-ui', color: 'rgba(255,255,255,.5)' }}>이 장소를 추가할 스페이스를 골라주세요</div>

        {/* 확인된 장소 카드 */}
        <div style={{ margin: '16px 20px 0', display: 'flex', gap: 13, background: '#18181B', borderRadius: 20, padding: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 15, flexShrink: 0, background: p.g || grad.pasta }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '800 17px/1.1 system-ui', color: '#fff' }}>{p.name}</div>
            <div style={{ marginTop: 5, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{p.cat} · {p.addr}</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#2997ff" strokeWidth="2" /><circle cx="12" cy="12" r="4.5" stroke="#2997ff" strokeWidth="2" /></svg><span style={{ font: '600 11px/1 system-ui', color: '#2997ff' }}>@seongsu.foodie 릴스에서 가져옴</span></div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 6px', font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>스페이스 선택 ({picked.size})</div>
        <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {allSpaces.map((s) => {
            const on = picked.has(s.id);
            return (
              <div key={s.id} className="pm-tap" onClick={() => !s.locked && toggle(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 13, background: on ? 'rgba(41,151,255,.12)' : '#18181B', border: on ? '2px solid #2997ff' : '2px solid transparent', borderRadius: 18, padding: '13px 14px', transition: 'all .15s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: on ? '#2997ff' : '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '400 20px/1 system-ui' }}>{s.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ font: '700 15.5px/1.1 system-ui', color: '#fff' }}>{s.name}</span>
                    {s.locked && <span style={{ font: '700 10px/1 system-ui', color: '#2997ff', background: 'rgba(41,151,255,.16)', borderRadius: 9999, padding: '3px 7px' }}>기본</span>}
                  </div>
                  <div style={{ marginTop: 4, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{s.sub}</div>
                </div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: on ? '#2997ff' : 'transparent', border: on ? 'none' : '2px solid #3a3a40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 30px', background: 'linear-gradient(180deg,rgba(13,13,15,0),#0D0D0F 38%)' }}>
        <div className="pm-tap" onClick={confirm} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', borderRadius: 18, padding: 17, boxShadow: '0 10px 24px rgba(0,0,0,.4)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#0D0D0F" /></svg>
          <span style={{ font: '800 16px/1 system-ui', color: '#0D0D0F' }}>확인</span>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
