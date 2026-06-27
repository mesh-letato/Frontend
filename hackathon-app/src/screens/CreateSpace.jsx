import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { members, nextId } from '../data/mock';

const DEFAULT_NAME = '새 스페이스';
// 대표 색 (빨주노초파남보) — 나중에 지도 핀 색으로 사용
const COLORS = [
  { key: '빨', hex: '#FF3B30' },
  { key: '주', hex: '#FF9500' },
  { key: '노', hex: '#FFCC00' },
  { key: '초', hex: '#34C759' },
  { key: '파', hex: '#2997FF' },
  { key: '남', hex: '#5E5CE6' },
  { key: '보', hex: '#AF52DE' },
];
const cardBg = (hex) => `radial-gradient(circle at 42% 28%,${hex}3a,transparent 62%),linear-gradient(160deg,#17171b,#0a0a0d)`;

export default function CreateSpace() {
  const { back, reset, addSpace, showToast } = useNav();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].hex);
  const [copied, setCopied] = useState(false);

  const named = name.trim().length > 0;
  const displayName = named ? name : DEFAULT_NAME;
  const code = 'SEONGSU' + (1000 + (name.length * 7) % 9000);

  const copyCode = () => {
    const text = `친구와 핀모아에서 ${displayName} 같이 모아요! 초대코드 : ${code}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    showToast('초대 코드를 복사했어요 📋');
  };

  const create = () => {
    addSpace({
      id: nextId(), name: displayName, color, placeCount: 0, memberCount: 1,
      bg: cardBg(color),
    });
    showToast('새 스페이스를 만들었어요 ✨');
    reset('spaces');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={() => (step === 2 ? setStep(1) : back())} />
        <div style={{ font: '700 16px/1 Pinmoa, system-ui', color: '#fff' }}>새 스페이스</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* step indicator */}
      <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 9999, background: '#2997ff' }} />
        <div style={{ flex: 1, height: 5, borderRadius: 9999, background: step === 2 ? '#2997ff' : '#2a2a2e', transition: 'background .3s' }} />
      </div>
      <div style={{ padding: '8px 20px 0', font: '700 12px/1 Pinmoa, system-ui', letterSpacing: '.3px', color: '#2997ff' }}>
        {step === 1 ? 'STEP 1 / 2 · 스페이스 이름 설정' : 'STEP 2 / 2 · 친구 초대'}
      </div>

      <div className="pm-scroll" style={{ flex: 1 }}>
        {step === 1 ? (
          <div className="pm-fade">
            <div style={{ padding: '26px 20px 0', font: '800 24px/1.2 Pinmoa, system-ui', letterSpacing: '-.7px', color: '#fff' }}>어떤 곳을 모을까요?</div>
            <div style={{ padding: '8px 20px 0', font: '500 14px/1.4 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>스페이스 이름과 대표 색을 정해주세요</div>

            <div style={{ padding: '24px 20px 0', font: '700 13px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>스페이스 이름</div>
            <div style={{ margin: '10px 20px 0', display: 'flex', alignItems: 'center', gap: 12, background: '#18181B', borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: color, boxShadow: `0 4px 12px ${color}66` }} />
              <input
                value={name} onChange={(e) => setName(e.target.value)} placeholder={DEFAULT_NAME}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', font: '800 19px/1 Pinmoa, system-ui', letterSpacing: '-.4px', color: named ? '#fff' : '#6a6a70' }}
              />
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 14l5-2 9-9 2 2-9 9-2 5-1-1-3-1Z" stroke="rgba(255,255,255,.45)" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            </div>

            <div style={{ padding: '24px 20px 0', font: '700 13px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>대표 색 선택</div>
            <div style={{ padding: '5px 20px 0', font: '500 12px/1.4 Pinmoa, system-ui', color: '#6a6a70' }}>지도에서 이 스페이스의 핀 색으로 표시돼요</div>
            <div style={{ margin: '14px 20px 0', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {COLORS.map((c) => {
                const on = color === c.hex;
                return (
                  <div key={c.hex} className="pm-tap" onClick={() => setColor(c.hex)} style={{ width: 44, height: 44, borderRadius: '50%', background: c.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', border: on ? '3px solid #fff' : '3px solid transparent', boxShadow: on ? `0 6px 16px ${c.hex}88` : 'none', transition: 'all .15s' }}>
                    {on && <svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="pm-slide">
            {/* step1 recap */}
            <div style={{ padding: '20px 20px 0', font: '700 13px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>스페이스 이름</div>
            <div style={{ margin: '10px 20px 0', display: 'flex', alignItems: 'center', gap: 12, background: '#18181B', borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: color, boxShadow: `0 4px 12px ${color}66` }} />
              <span style={{ font: '800 19px/1 Pinmoa, system-ui', letterSpacing: '-.4px', color: '#fff' }}>{displayName}</span>
            </div>

            <div style={{ padding: '24px 20px 0', font: '700 13px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>친구 초대</div>
            <div style={{ margin: '11px 20px 0', background: '#18181B', borderRadius: 18, padding: 16 }}>
              <div style={{ font: '500 12.5px/1.5 Pinmoa, system-ui', color: 'rgba(255,255,255,.55)' }}>아래 코드를 친구에게 보내면, 친구가 들어왔을 때 지도가 합쳐져요.</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#0D0D0F', borderRadius: 14, padding: '14px 16px' }}>
                <span style={{ font: '800 20px/1 Pinmoa, system-ui', letterSpacing: '2px', color: '#fff' }}>{code}</span>
                <div className="pm-tap" onClick={copyCode} style={{ display: 'flex', alignItems: 'center', gap: 6, background: copied ? 'rgba(48,209,88,.16)' : '#2997ff', borderRadius: 9999, padding: '8px 13px' }}>
                  {copied
                    ? <><svg width="12" height="12" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#30d158" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg><span style={{ font: '800 12px/1 Pinmoa, system-ui', color: '#30d158' }}>복사됨</span></>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="#fff" strokeWidth="1.9" /><path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></svg><span style={{ font: '800 12px/1 Pinmoa, system-ui', color: '#fff' }}>초대 코드 복사</span></>}
                </div>
              </div>
            </div>

            {/* 이미 초대된 미리보기 */}
            <div style={{ padding: '24px 20px 0', font: '700 13px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>멤버</div>
            <div style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: members.me.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 15px/1 Pinmoa, system-ui', color: '#fff' }}>나</div>
              <div style={{ flex: 1 }}><div style={{ font: '700 15.5px/1.1 Pinmoa, system-ui', color: '#fff' }}>나</div><div style={{ marginTop: 4, font: '500 12px/1 Pinmoa, system-ui', color: '#6a6a70' }}>방장 · @me</div></div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '14px 20px 30px', background: 'linear-gradient(180deg,rgba(13,13,15,0),#0D0D0F 38%)' }}>
        {step === 1 ? (
          <div className="pm-tap" onClick={() => named && setStep(2)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: named ? '#fff' : '#2a2a2e', borderRadius: 18, padding: 17, transition: 'background .2s', boxShadow: named ? '0 10px 24px rgba(0,0,0,.4)' : 'none' }}>
            <span style={{ font: '800 16px/1 Pinmoa, system-ui', color: named ? '#0D0D0F' : '#6a6a70' }}>다음</span>
          </div>
        ) : (
          <div className="pm-tap" onClick={create} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 18, padding: 17, boxShadow: '0 10px 24px rgba(0,0,0,.4)' }}>
            <span style={{ font: '800 16px/1 Pinmoa, system-ui', color: '#0D0D0F' }}>스페이스 만들기</span>
          </div>
        )}
      </div>
      <HomeIndicator />
    </div>
  );
}
