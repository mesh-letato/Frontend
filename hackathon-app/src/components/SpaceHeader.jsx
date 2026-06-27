import { useState } from 'react';
import { useNav } from '../context/Nav';
import { BackBtn, Avatar } from './Chrome';
import { members } from '../data/mock';

// 03/10 공용 상단 (뒤로/멤버관리 + 제목 + 멤버수) — 스크롤 시 고정
export function SpaceHeaderTop({ space, mine = false }) {
  const { back, myPlaces } = useNav();
  const [manage, setManage] = useState(false);
  const placeCount = mine ? myPlaces.length : (space?.placeCount ?? 18);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        {/* 내 지도(개인)는 멤버 관리/초대 버튼 없음 */}
        {mine ? <div style={{ width: 36, height: 36 }} /> : <ManageBtn onClick={() => setManage(true)} />}
      </div>
      <div style={{ padding: '12px 20px 0', font: '800 28px/1 system-ui', letterSpacing: '-1px', color: '#fff' }}>{space?.name || '성수 맛집 🍝'}</div>
      <div style={{ padding: '9px 20px 0', display: 'flex', alignItems: 'center', gap: 9 }}>
        {mine ? (
          <>
            <Avatar m={members.me} size={26} border="#0D0D0F" />
            <span style={{ font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.55)' }}>{placeCount}곳 · 나만의 지도</span>
          </>
        ) : (
          <>
            <div style={{ display: 'flex' }}>
              {['me', 'jiyoon', 'doyoon'].map((k, i) => <Avatar key={k} m={members[k]} size={26} border="#0D0D0F" ml={i === 0 ? 0 : -9} />)}
              <div style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid #0D0D0F', background: '#2a2a2e', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 9px/1 system-ui', color: '#fff' }}>+2</div>
            </div>
            <span style={{ font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.55)' }}>{placeCount}곳 · 멤버 {space?.memberCount ?? 5}</span>
          </>
        )}
      </div>
      {manage && <MemberManageModal space={space} onClose={() => setManage(false)} />}
    </>
  );
}

// 멤버 관리/초대 버튼 (사람+ 아이콘)
export function ManageBtn({ onClick, light = false }) {
  return (
    <div className="pm-tap" onClick={onClick} style={{ width: 36, height: 36, borderRadius: '50%', background: light ? 'rgba(0,0,0,.4)' : '#1c1c20', backdropFilter: light ? 'blur(10px)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="#fff" strokeWidth="1.8" /><path d="M5 19c0-3.3 3.1-5 7-5s7 1.7 7 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><path d="M19 7v4M21 9h-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
    </div>
  );
}

// 멤버 관리 + 스페이스 참가코드 공유 모달 (바텀시트)
export function MemberManageModal({ space, onClose }) {
  const { showToast } = useNav();
  const [copied, setCopied] = useState(false);
  const code = space?.code || 'PINMOA' + String((space?.id ?? 1) * 137 % 9000 + 1000);
  const memberKeys = ['me', 'jiyoon', 'doyoon', 'seoa'];

  const copy = () => {
    const text = `핀모아에서 "${space?.name || '스페이스'}" 같이 모아요! 참가코드 : ${code}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    showToast('참가코드를 복사했어요 📋');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div className="pm-up" onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1e', borderRadius: '28px 28px 0 0', padding: '22px 20px 40px', maxHeight: '82%', overflowY: 'auto' }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,.2)', margin: '0 auto 22px' }} />
        <div style={{ font: '800 23px/1 system-ui', letterSpacing: '-.7px', color: '#fff', marginBottom: 6 }}>멤버 관리</div>
        <div style={{ font: '500 13.5px/1.5 system-ui', color: 'rgba(255,255,255,.5)', marginBottom: 20 }}>참가코드를 친구에게 보내면 이 스페이스에 초대할 수 있어요</div>

        {/* 참가코드 + 복사 */}
        <div style={{ font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70', marginBottom: 10 }}>참가 코드</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#0D0D0F', borderRadius: 16, padding: '15px 16px', marginBottom: 24 }}>
          <span style={{ font: '800 21px/1 system-ui', letterSpacing: '2px', color: '#fff' }}>{code}</span>
          <div className="pm-tap" onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 6, background: copied ? 'rgba(48,209,88,.16)' : '#2997ff', borderRadius: 9999, padding: '9px 14px' }}>
            {copied
              ? <><svg width="12" height="12" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#30d158" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg><span style={{ font: '800 12px/1 system-ui', color: '#30d158' }}>복사됨</span></>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="#fff" strokeWidth="1.9" /><path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></svg><span style={{ font: '800 12px/1 system-ui', color: '#fff' }}>코드 복사</span></>}
          </div>
        </div>

        {/* 멤버 목록 */}
        <div style={{ font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70', marginBottom: 12 }}>멤버 {memberKeys.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {memberKeys.map((k, i) => {
            const m = members[k];
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 2px' }}>
                <Avatar m={m} size={40} border="#1a1a1e" fontSize={14} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '700 15px/1.1 system-ui', color: '#fff' }}>{m.name}{k === 'me' && <span style={{ marginLeft: 6, font: '600 11px/1 system-ui', color: '#6a6a70' }}>나</span>}</div>
                  <div style={{ marginTop: 3, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{i === 0 ? '방장' : '멤버'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
