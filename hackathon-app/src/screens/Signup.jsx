import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';

export default function Signup() {
  const { back, reset, showToast } = useNav();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [agree, setAgree] = useState(false);
  const valid = name.trim() && id.trim() && pw.trim() && agree;

  const submit = () => {
    if (!valid) return;
    showToast('내 스페이스가 자동으로 만들어졌어요 ✨');
    reset('spaces');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div style={{ font: '700 16px/1 Pinmoa, system-ui', color: '#fff' }}>회원가입</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div className="pm-scroll" style={{ flex: 1, padding: '0 24px' }}>
        <div style={{ marginTop: 22, font: '800 26px/1.2 Pinmoa, system-ui', letterSpacing: '-.8px', color: '#fff' }}>핀모아 시작하기</div>
        <div style={{ marginTop: 10, font: '500 14px/1.45 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>가입하면 나만의 <span style={{ color: '#2997ff', fontWeight: 800 }}>내 스페이스</span>가 자동으로 만들어져요</div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="닉네임" value={name} onChange={setName} placeholder="지도에 표시될 이름" />
          <Field label="아이디" value={id} onChange={setId} placeholder="영문·숫자 4자 이상" prefix="@" />
          <Field label="비밀번호" value={pw} onChange={setPw} placeholder="8자 이상" type="password" />
        </div>

        <div className="pm-tap" onClick={() => setAgree(!agree)} style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: agree ? '#2997ff' : 'transparent', border: agree ? 'none' : '2px solid #3a3a40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {agree && <svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <span style={{ font: '500 13px/1.4 Pinmoa, system-ui', color: 'rgba(255,255,255,.7)' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>이용약관</span> 및 <span style={{ color: '#fff', fontWeight: 700 }}>개인정보 처리방침</span>에 동의합니다
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 24px 34px' }}>
        <div className="pm-tap" onClick={submit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: valid ? '#fff' : '#2a2a2e', borderRadius: 18, padding: 17, transition: 'background .2s', boxShadow: valid ? '0 10px 24px rgba(0,0,0,.4)' : 'none' }}>
          <span style={{ font: '800 16px/1 Pinmoa, system-ui', color: valid ? '#0D0D0F' : '#6a6a70' }}>가입하고 시작하기</span>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', prefix }) {
  return (
    <div>
      <div style={{ marginBottom: 8, font: '700 12.5px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.55)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#18181B', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '0 16px' }}>
        {prefix && <span style={{ font: '600 15px/1 Pinmoa, system-ui', color: '#6a6a70', marginRight: 2 }}>{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} style={{ flex: 1, background: 'transparent', border: 'none', padding: '15px 0', font: '500 15px/1 Pinmoa, system-ui', color: '#fff', outline: 'none' }} />
      </div>
    </div>
  );
}
