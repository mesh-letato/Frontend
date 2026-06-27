import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import kakaoLogin from '../assets/kakao_login.png';

export default function Login() {
  const { reset, go } = useNav();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const valid = id.trim() && pw.trim();

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%,#16263f,#0D0D0F 55%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div className="pm-scroll" style={{ flex: 1, padding: '0 24px' }}>
        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: 60, height: 60, borderRadius: 19, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-5deg)', boxShadow: '0 10px 28px rgba(41,151,255,.42)' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /><circle cx="12" cy="9.6" r="2.4" fill="#2997ff" /></svg>
          </div>
          <div style={{ marginTop: 22, font: '800 30px/1.15 system-ui', letterSpacing: '-1px', color: '#fff' }}>다시 만나서<br />반가워요 👋</div>
          <div style={{ marginTop: 12, font: '500 14px/1.4 system-ui', color: 'rgba(255,255,255,.5)' }}>로그인하고 친구들의 지도를 확인하세요</div>
        </div>

        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="아이디" value={id} onChange={setId} placeholder="아이디를 입력하세요" />
          <Field label="비밀번호" value={pw} onChange={setPw} placeholder="비밀번호를 입력하세요" type="password" />
        </div>

        <div style={{ marginTop: 10, textAlign: 'right', font: '600 12.5px/1 system-ui', color: '#6a6a70' }}>비밀번호를 잊으셨나요?</div>

        <div className="pm-tap" onClick={() => valid && reset('spaces')} style={{ marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: valid ? '#fff' : '#2a2a2e', borderRadius: 18, padding: 17, boxShadow: valid ? '0 10px 24px rgba(0,0,0,.4)' : 'none', transition: 'background .2s' }}>
          <span style={{ font: '800 16px/1 system-ui', color: valid ? '#0D0D0F' : '#6a6a70' }}>로그인</span>
        </div>

        {/* 소셜 로그인 */}
        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: '.5px', background: 'rgba(255,255,255,.12)' }} />
          <span style={{ font: '500 12px/1 system-ui', color: '#6a6a70' }}>또는</span>
          <div style={{ flex: 1, height: '.5px', background: 'rgba(255,255,255,.12)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {/* 노란 컨테이너는 애플 버튼과 동일한 전체 폭 규격, 로고+글씨(이미지)는 원본 크기 유지 */}
          <div className="pm-tap" onClick={() => reset('spaces')} style={{ width: '100%', background: '#FEE500', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1px 0' }}>
            <img src={kakaoLogin} alt="카카오 로그인" style={{ width: 183, height: 45, display: 'block' }} />
          </div>
          <Social bg="#fff" color="#191600" label="Apple로 시작하기" onClick={() => reset('spaces')} icon="" />
        </div>
      </div>

      <div style={{ padding: '14px 24px 36px', textAlign: 'center' }}>
        <span style={{ font: '500 13px/1 system-ui', color: '#6a6a70' }}>아직 계정이 없으신가요? </span>
        <span className="pm-tap" onClick={() => go('signup')} style={{ font: '800 13px/1 system-ui', color: '#2997ff' }}>회원가입</span>
      </div>
      <HomeIndicator />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <div style={{ marginBottom: 8, font: '700 12.5px/1 system-ui', color: 'rgba(255,255,255,.55)' }}>{label}</div>
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ width: '100%', background: '#18181B', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '15px 16px', font: '500 15px/1 system-ui', color: '#fff', outline: 'none' }}
      />
    </div>
  );
}

function Social({ bg, color, label, onClick, icon }) {
  return (
    <div className="pm-tap" onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: bg, borderRadius: 14, padding: 15 }}>
      {icon ? <span style={{ font: '900 15px/1 system-ui', color }}>{icon}</span> : <svg width="15" height="17" viewBox="0 0 24 24" fill={color}><path d="M17 12.5c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2 .8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5ZM14.8 6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2Z" /></svg>}
      <span style={{ font: '700 15px/1 system-ui', color }}>{label}</span>
    </div>
  );
}
