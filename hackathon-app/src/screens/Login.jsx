import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import kakaoLogin from '../assets/kakao_login.png';

// 스페이스 대표 색(빨주노초파남보) — 핀 미리보기 장식
const PIN_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#2997FF', '#5E5CE6', '#AF52DE'];

export default function Login() {
  const { reset } = useNav();

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 12%,#16263f,#0D0D0F 60%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      {/* 브랜드 블록 (세로 가운데 정렬) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        {/* 로고 */}
        <div style={{ width: 88, height: 88, borderRadius: 27, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)', boxShadow: '0 18px 44px rgba(41,151,255,.5)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /><circle cx="12" cy="9.6" r="2.5" fill="#2997ff" /></svg>
        </div>

        {/* 워드마크 + 태그라인 */}
        <div style={{ marginTop: 26, font: '800 40px/1 system-ui', letterSpacing: '-1.6px', color: '#fff' }}>핀모아</div>
        <div style={{ marginTop: 14, textAlign: 'center', font: '500 15px/1.55 system-ui', color: 'rgba(255,255,255,.6)' }}>릴스로 발견한 장소를<br />친구들과 한 지도에 모아요</div>

        {/* 핀 색 미리보기 (장식) */}
        <div style={{ marginTop: 32, display: 'flex' }}>
          {PIN_COLORS.map((c, i) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: '2.5px solid #0D0D0F', marginLeft: i === 0 ? 0 : -8, boxShadow: `0 4px 10px ${c}55` }} />
          ))}
        </div>
      </div>

      {/* 하단 카카오 로그인 */}
      <div style={{ padding: '0 24px 30px' }}>
        <div className="pm-tap" onClick={() => reset('spaces')} style={{ width: '100%', background: '#FEE500', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1px 0', boxShadow: '0 12px 30px rgba(254,229,0,.2)' }}>
          <img src={kakaoLogin} alt="카카오 로그인" style={{ width: 183, height: 45, display: 'block' }} />
        </div>
        <div style={{ marginTop: 16, textAlign: 'center', font: '500 12px/1.5 system-ui', color: '#6a6a70' }}>카카오로 3초 만에 시작해요</div>
      </div>

      <HomeIndicator />
    </div>
  );
}
