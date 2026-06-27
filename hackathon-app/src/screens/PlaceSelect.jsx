import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { grad } from '../data/mock';

const GRADS = [grad.pasta, grad.cafe, grad.pink, grad.green];

// category 문자열의 마지막 토큰만 (예: "음식점 > 양식 > 이탈리안" → "이탈리안")
const shortCat = (c) => (c ? c.split(' > ').pop() : '장소');

export default function PlaceSelect({ candidates = [] }) {
  const { back, go } = useNav();
  const list = candidates;
  const [sel, setSel] = useState(list[0]?.kakaoPlaceId ?? null);

  const selected = list.find((c) => c.kakaoPlaceId === sel) || list[0] || null;

  // 선택한 장소를 어느 스페이스(들)에 담을지 고르는 화면으로 이동
  const save = () => {
    if (!selected) return;
    go('shareImport', { place: selected });
  };

  if (list.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Notch />
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px 0' }}><BackBtn onClick={back} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ font: '800 20px/1.3 Pinmoa, system-ui', color: '#fff' }}>장소를 찾지 못했어요</div>
          <div style={{ marginTop: 10, font: '500 14px/1.5 Pinmoa, system-ui', color: '#6a6a70' }}>다른 링크로 다시 시도해보세요</div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(41,151,255,.18)', borderRadius: 9999, padding: '6px 12px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#2997ff" /></svg>
          <span style={{ font: '700 12px/1 Pinmoa, system-ui', color: '#2997ff' }}>장소 {list.length}곳 찾음</span>
        </div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div className="pm-scroll" style={{ flex: 1, paddingBottom: 150 }}>
        <div style={{ padding: '16px 20px 0', font: '800 26px/1.2 Pinmoa, system-ui', letterSpacing: '-.8px', color: '#fff' }}>이 장소가 맞나요?</div>
        <div style={{ padding: '6px 20px 0', font: '500 14px/1.35 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>영상에서 <span style={{ color: '#2997ff', fontWeight: 800 }}>{list.length}곳</span>을 찾았어요. 맞는 곳을 골라주세요.</div>

        {/* 첫 후보 (강조) */}
        {list.slice(0, 1).map((c) => {
          const on = sel === c.kakaoPlaceId;
          return (
            <div key={c.kakaoPlaceId} className="pm-tap" onClick={() => setSel(c.kakaoPlaceId)} style={{ margin: '16px 20px 0', background: '#18181B', borderRadius: 22, border: on ? '2px solid #2997ff' : '2px solid transparent', padding: 14, boxShadow: on ? '0 8px 22px rgba(41,151,255,.2)' : 'none' }}>
              <div style={{ display: 'flex', gap: 13 }}>
                <div style={{ width: 66, height: 66, borderRadius: 16, flexShrink: 0, background: GRADS[0] }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ font: '800 17px/1.1 Pinmoa, system-ui', letterSpacing: '-.4px', color: '#fff' }}>{c.name}</span><span style={{ font: '500 11px/1 Pinmoa, system-ui', color: '#6a6a70' }}>{shortCat(c.category)}</span></div>
                  <div style={{ marginTop: 5, font: '500 12.5px/1.3 Pinmoa, system-ui', color: '#6a6a70' }}>{c.roadAddress || c.address}</div>
                  <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(48,209,88,.15)', borderRadius: 9999, padding: '4px 9px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} /><span style={{ font: '700 11px/1 Pinmoa, system-ui', color: '#30d158' }}>가장 정확한 후보예요</span></div>
                </div>
                <Radio on={on} />
              </div>
            </div>
          );
        })}

        {list.length > 1 && (
          <>
            <div style={{ padding: '14px 20px 6px', font: '700 12px/1 Pinmoa, system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>다른 후보</div>
            <div style={{ margin: '0 20px', background: '#18181B', borderRadius: 18, overflow: 'hidden' }}>
              {list.slice(1).map((c, i) => {
                const on = sel === c.kakaoPlaceId;
                return (
                  <div key={c.kakaoPlaceId} className="pm-tap" onClick={() => setSel(c.kakaoPlaceId)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 14px', borderBottom: i < list.length - 2 ? '.5px solid rgba(255,255,255,.06)' : 'none', background: on ? 'rgba(41,151,255,.08)' : 'transparent' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: GRADS[(i + 1) % GRADS.length] }} />
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ font: '700 15px/1.1 Pinmoa, system-ui', color: '#fff' }}>{c.name}</div><div style={{ marginTop: 3, font: '500 12px/1 Pinmoa, system-ui', color: '#6a6a70' }}>{c.roadAddress || c.address}</div></div>
                    <Radio on={on} small />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 하단 CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 30px', background: 'linear-gradient(180deg,rgba(13,13,15,0),#0D0D0F 38%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <span style={{ font: '500 13px/1 Pinmoa, system-ui', color: '#6a6a70' }}>저장 위치</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#18181B', borderRadius: 9999, padding: '7px 12px' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#2997ff" /></svg><span style={{ font: '700 13px/1 Pinmoa, system-ui', color: '#fff' }}>다음 단계에서 선택</span></div>
        </div>
        <div className="pm-tap" onClick={save} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', borderRadius: 18, padding: 17, boxShadow: '0 10px 24px rgba(0,0,0,.4)' }}>
          <span style={{ font: '800 16px/1 Pinmoa, system-ui', color: '#0D0D0F' }}>다음</span>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function Radio({ on, small }) {
  const sz = small ? 22 : 26;
  if (on) return (
    <div style={{ width: sz, height: sz, borderRadius: '50%', background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width={small ? 11 : 13} height={small ? 11 : 13} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
  );
  return <div style={{ width: sz, height: sz, borderRadius: '50%', border: '2px solid #3a3a40', flexShrink: 0 }} />;
}
