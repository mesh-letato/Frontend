import { useEffect } from 'react';
import { useNav } from '../context/Nav';
import { HomeIndicator } from '../components/Chrome';

export default function Splash() {
  const { replace } = useNav();
  useEffect(() => {
    const t = setTimeout(() => replace('login', {}, 'pm-fade'), 1700);
    return () => clearTimeout(t);
  }, [replace]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 38%,#16263f,#0D0D0F 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ animation: 'pmPop .6s cubic-bezier(.2,.9,.3,1.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 96, height: 96, borderRadius: 30, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)', boxShadow: '0 18px 50px rgba(41,151,255,.5)' }}>
          {/* 지도 핀 + 폴라로이드 결합 로고 */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /><circle cx="12" cy="9.6" r="2.6" fill="#2997ff" /></svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ font: '800 36px/1 Pinmoa, system-ui', letterSpacing: '-1.4px', color: '#fff' }}>핀모아</div>
          <div style={{ marginTop: 12, font: '500 14px/1.4 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>친구들과 저장한 곳이<br />한 지도에 모여요</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 70, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 20, height: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid rgba(41,151,255,.25)', borderTopColor: '#2997ff', animation: 'pmSpin .9s linear infinite' }} />
        </div>
        <span style={{ font: '600 12px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.4)' }}>불러오는 중…</span>
      </div>
      <HomeIndicator />
    </div>
  );
}
