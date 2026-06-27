import { useEffect } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';

export default function LinkAnalyzing({ url, target }) {
  const { back, replace } = useNav();
  const display = url || 'instagram.com/reel/Cx8q…seongsu';

  // 2초 후 자동으로 장소 선택 화면으로
  useEffect(() => {
    const t = setTimeout(() => replace('placeSelect', { target }), 2100);
    return () => clearTimeout(t);
  }, [replace, target]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b0b0d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div style={{ font: '700 16px/1 Pinmoa, system-ui', color: '#fff' }}>장소 가져오기</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* 링크 칩 */}
      <div style={{ margin: '22px 20px 0', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.13)', borderRadius: 16, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <div style={{ flex: 1, font: '500 13px/1.3 Pinmoa, system-ui', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158' }} />
      </div>

      {/* 릴스 미리보기 */}
      <div style={{ margin: '16px 20px 0', background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: 14, display: 'flex', gap: 13 }}>
        <div style={{ position: 'relative', width: 84, height: 112, borderRadius: 13, flexShrink: 0, background: 'radial-gradient(circle at 35% 30%,rgba(255,255,255,.35),transparent 55%),linear-gradient(150deg,#f0a868,#9a3a2e)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="13" height="15" viewBox="0 0 13 15"><path d="M1 1l11 6.5L1 14V1Z" fill="#fff" /></svg></div></div>
          <div style={{ position: 'absolute', left: 7, top: 7, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,.42)', borderRadius: 9999, padding: '3px 7px' }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#fff" strokeWidth="2" /><circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.4" fill="#fff" /></svg><span style={{ font: '600 9px/1 Pinmoa, system-ui', color: '#fff' }}>Reels</span></div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(140deg,#f3a9b9,#d76a8a)' }} /><span style={{ font: '700 12.5px/1 Pinmoa, system-ui', color: '#fff' }}>seongsu.foodie</span></div>
          <div style={{ marginTop: 9, font: '500 13px/1.45 Pinmoa, system-ui', color: 'rgba(255,255,255,.8)' }}>성수동 갑성비 끝판왕 파스타집 찾았다… 웨이팅 30분 각오</div>
          <div style={{ marginTop: 9, display: 'flex', gap: 6 }}><span style={{ font: '500 11px/1 Pinmoa, system-ui', color: '#2997ff' }}>#성수맛집</span><span style={{ font: '500 11px/1 Pinmoa, system-ui', color: '#2997ff' }}>#파스타</span></div>
        </div>
      </div>

      {/* 로딩 */}
      <div style={{ margin: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 24, height: 24 }}><div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid rgba(41,151,255,.25)', borderTopColor: '#2997ff', animation: 'pmSpin .9s linear infinite' }} /></div>
          <span style={{ font: '700 15px/1 Pinmoa, system-ui', color: '#fff' }}>장소를 불러오는 중</span>
        </div>
        <div style={{ marginTop: 10, font: '500 14px/1.4 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>잠시만 기다려 주세요</div>
        <div style={{ marginTop: 18, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 9999, background: '#2997ff', animation: 'pmBar 2s ease forwards' }} /></div>
        <div style={{ marginTop: 24, background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={shimmer(52, 52)} />
          <div style={{ flex: 1 }}>
            <div style={shimmer('60%', 13)} />
            <div style={{ marginTop: 9, ...shimmer('85%', 11) }} />
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

const shimmer = (w, h) => ({
  width: w, height: h, borderRadius: 8,
  background: 'linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.14),rgba(255,255,255,.06))',
  backgroundSize: '220px 100%', animation: 'pmShimmer 1.3s linear infinite',
});
