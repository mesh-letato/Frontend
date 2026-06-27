import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { authApi } from '../api';

// 스페이스 대표 색(빨주노초파남보) — 핀 미리보기 장식
const PIN_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#2997FF', '#5E5CE6', '#AF52DE'];

export default function Login() {
  const { reset, go, onAuthenticated, showToast } = useNav();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = email.trim() && pw.trim();

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError('');
    try {
      await authApi.login({ email: email.trim(), password: pw });
      await onAuthenticated();
      showToast('로그인했어요 👋');
      reset('spaces');
    } catch (e) {
      setError(e.message || '로그인에 실패했어요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 12%,#16263f,#0D0D0F 60%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      {/* 브랜드 블록 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{ width: 76, height: 76, borderRadius: 24, background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)', boxShadow: '0 18px 44px rgba(41,151,255,.5)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /><circle cx="12" cy="9.6" r="2.5" fill="#2997ff" /></svg>
        </div>
        <div style={{ marginTop: 20, font: '800 36px/1 Pinmoa, system-ui', letterSpacing: '-1.4px', color: '#fff' }}>핀모아</div>
        <div style={{ marginTop: 12, textAlign: 'center', font: '500 14px/1.55 Pinmoa, system-ui', color: 'rgba(255,255,255,.6)' }}>릴스로 발견한 장소를<br />친구들과 한 지도에 모아요</div>

        <div style={{ marginTop: 20, display: 'flex' }}>
          {PIN_COLORS.map((c, i) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: '2.5px solid #0D0D0F', marginLeft: i === 0 ? 0 : -7, boxShadow: `0 4px 10px ${c}55` }} />
          ))}
        </div>

        {/* 로그인 폼 */}
        <div style={{ width: '100%', marginTop: 30, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <Field value={email} onChange={setEmail} placeholder="이메일" type="email" />
          <Field value={pw} onChange={setPw} placeholder="비밀번호" type="password" onEnter={submit} />
          {error && <div style={{ font: '600 12.5px/1.4 Pinmoa, system-ui', color: '#ff7a7a', paddingLeft: 4 }}>{error}</div>}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ padding: '0 24px 30px' }}>
        <div className="pm-tap" onClick={submit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: valid && !loading ? '#fff' : '#2a2a2e', borderRadius: 16, padding: 16, transition: 'background .2s', boxShadow: valid ? '0 10px 24px rgba(0,0,0,.4)' : 'none' }}>
          <span style={{ font: '800 16px/1 Pinmoa, system-ui', color: valid && !loading ? '#0D0D0F' : '#6a6a70' }}>{loading ? '로그인 중…' : '로그인'}</span>
        </div>
        <div className="pm-tap" onClick={() => go('signup')} style={{ marginTop: 16, textAlign: 'center', font: '500 13px/1.5 Pinmoa, system-ui', color: '#8d8d95' }}>
          아직 계정이 없나요? <span style={{ color: '#2997ff', fontWeight: 700 }}>회원가입</span>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}

function Field({ value, onChange, placeholder, type = 'text', onEnter }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 13, padding: '0 16px' }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        placeholder={placeholder}
        type={type}
        style={{ flex: 1, background: 'transparent', border: 'none', padding: '15px 0', font: '500 15px/1 Pinmoa, system-ui', color: '#fff', outline: 'none' }}
      />
    </div>
  );
}
