import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator, Avatar } from '../components/Chrome';
import { TabBar } from '../components/TabBar';
import { members, mySpace } from '../data/mock';

export default function Spaces() {
  const { go, reset, spaces, showToast } = useNav();
  const [menu, setMenu] = useState(null); // 'plus' | 'profile' | null
  const [join, setJoin] = useState(false);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      <div className="pm-scroll" style={{ flex: 1, paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 0' }}>
          <div style={{ font: '800 34px/1 system-ui', letterSpacing: '-1.4px', color: '#fff' }}>스페이스</div>
          <div className="pm-tap" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} style={{ width: 38, height: 38, borderRadius: '50%', background: menu === 'profile' ? '#2997ff' : 'linear-gradient(140deg,#5aa0ef,#0066cc)' }} />
        </div>
        <div style={{ padding: '6px 22px 0', font: '500 14px/1.3 system-ui', letterSpacing: '-.2px', color: 'rgba(255,255,255,.5)' }}>친구들과 저장한 곳이 한 지도에 모여요</div>

        {/* 내 스페이스 (최상단 고정) */}
        <div style={{ padding: '16px 16px 0' }}>
          <div className="pm-tap" onClick={() => reset('myspace')} style={{ borderRadius: 22, overflow: 'hidden', background: 'radial-gradient(circle at 65% 30%,rgba(41,151,255,.25),transparent 60%),linear-gradient(160deg,#14213a,#0b1220)' }}>
            <div style={{ height: 84, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#2997ff" /></svg>
                  <div style={{ font: '800 20px/1 system-ui', letterSpacing: '-.5px', color: '#fff' }}>내 스페이스</div>
                </div>
                <div style={{ marginTop: 7, font: '500 11.5px/1 system-ui', color: 'rgba(255,255,255,.5)' }}>나만의 공간 · 링크로 장소 저장</div>
              </div>
              <div style={{ background: '#2997ff', borderRadius: 9999, padding: '6px 12px', font: '800 13px/1 system-ui', color: '#fff' }}>{mySpace.count}곳</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 22px 0', font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>참여 중인 스페이스</div>

        {/* 스페이스 카드들 */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16, padding: '0 16px' }}>
          {spaces.map((sp) => <SpaceCard key={sp.id} sp={sp} onTap={() => go('spaceList', { space: sp })} />)}
        </div>
      </div>

      <TabBar
        active="space"
        onPlus={() => setMenu(menu === 'plus' ? null : 'plus')}
        onProfile={() => setMenu(menu === 'profile' ? null : 'profile')}
      />

      {/* + 드롭다운 */}
      {menu === 'plus' && (
        <>
          <div onClick={() => setMenu(null)} style={overlay} />
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 100, zIndex: 120, background: '#1c1c20', borderRadius: 20, padding: 8, boxShadow: '0 20px 50px rgba(0,0,0,.6)', animation: 'pmUp .25s ease' }}>
            <MenuRow icon="✨" title="새 스페이스 생성" sub="친구와 함께할 새 지도 만들기" onClick={() => { setMenu(null); go('createSpace'); }} />
            <div style={{ height: '.5px', background: 'rgba(255,255,255,.08)', margin: '2px 12px' }} />
            <MenuRow icon="🔑" title="스페이스 참가 코드 입력" sub="친구한테 받은 코드로 참여하기" onClick={() => { setMenu(null); setJoin(true); }} />
          </div>
        </>
      )}

      {/* 프로필 드롭다운 */}
      {menu === 'profile' && (
        <>
          <div onClick={() => setMenu(null)} style={overlay} />
          <div style={{ position: 'absolute', top: 96, right: 16, left: 16, zIndex: 120, background: '#1c1c20', borderRadius: 20, padding: 8, boxShadow: '0 20px 50px rgba(0,0,0,.6)', animation: 'pmFade .2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 14px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(140deg,#5aa0ef,#0066cc)' }} />
              <div>
                <div style={{ font: '800 17px/1 system-ui', color: '#fff' }}>나</div>
                <div style={{ marginTop: 5, font: '500 12px/1 system-ui', color: '#6a6a70' }}>@me</div>
              </div>
            </div>
            <div style={{ height: '.5px', background: 'rgba(255,255,255,.08)', margin: '0 12px 4px' }} />
            <MenuRow icon="🗺️" title="내 지도" sub="저장한 장소 모아보기" onClick={() => { setMenu(null); reset('myspace'); }} />
            <MenuRow icon="✏️" title="프로필 편집" sub="이름·아이디·사진 변경" onClick={() => { setMenu(null); showToast('프로필 편집 (준비 중)'); }} />
            <MenuRow icon="⚙️" title="계정 관리" sub="알림·보안·로그아웃" onClick={() => { setMenu(null); reset('login'); }} />
          </div>
        </>
      )}

      {/* 참가 코드 모달 */}
      {join && <JoinModal onClose={() => setJoin(false)} onJoin={() => { setJoin(false); showToast('스페이스에 참가했어요 🎉'); }} />}

      <HomeIndicator />
    </div>
  );
}

const overlay = { position: 'absolute', inset: 0, zIndex: 110, background: 'rgba(0,0,0,.35)' };

function MenuRow({ icon, title, sub, onClick }) {
  return (
    <div className="pm-tap" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px', borderRadius: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 19px/1 system-ui' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ font: '700 15px/1.1 system-ui', color: '#fff' }}>{title}</div>
        <div style={{ marginTop: 4, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{sub}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#3a3a40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

function SpaceCard({ sp, onTap }) {
  const big = sp.big;
  return (
    <div className="pm-tap" onClick={onTap} style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', height: big ? 260 : 172, background: sp.bg }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,rgba(13,13,15,${big ? '.05' : '.1'}) 40%,rgba(13,13,15,.92) 100%)` }} />

      {/* 미니 폴라로이드 (큰 카드) */}
      {big && sp.polaroid && (
        <div style={{ position: 'absolute', right: 16, top: 18, width: 88, background: '#fff', padding: '6px 6px 18px', borderRadius: 3, transform: 'rotate(6deg)', boxShadow: '0 10px 24px rgba(0,0,0,.5)' }}>
          <div style={{ height: 78, borderRadius: 2, background: sp.polaroid.g }} />
          <div style={{ marginTop: 5, font: "700 11px/1 'Caveat',cursive", color: '#333', textAlign: 'center' }}>{sp.polaroid.cap}</div>
        </div>
      )}

      {/* NEW 배지 */}
      {sp.isNew && big && (
        <div style={{ position: 'absolute', left: 18, top: 18, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(10px)', borderRadius: 9999, padding: '6px 12px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158' }} />
          <span style={{ font: '700 11px/1 system-ui', color: '#fff' }}>{sp.newText}</span>
        </div>
      )}

      {/* 겹침 배지 (작은 카드 우상단) */}
      {!big && (
        <div style={{ position: 'absolute', right: 14, top: 16, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(10px)', borderRadius: 9999, padding: '6px 11px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6" stroke="#fff" strokeWidth="2.4" /><circle cx="15" cy="12" r="6" stroke="#fff" strokeWidth="2.4" /></svg>
          <span style={{ font: '800 11px/1 system-ui', color: '#fff' }}>겹침 {sp.overlap}</span>
        </div>
      )}

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
        {big ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ font: '800 26px/1 system-ui', letterSpacing: '-.8px', color: '#fff' }}>{sp.name}</div>
                <div style={{ marginTop: 8, font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.7)' }}>{sp.placeCount}곳 저장 · 후기 {sp.reviewCount}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#2997ff', borderRadius: 9999, padding: '7px 12px', boxShadow: '0 6px 16px rgba(41,151,255,.4)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6" stroke="#fff" strokeWidth="2.4" /><circle cx="15" cy="12" r="6" stroke="#fff" strokeWidth="2.4" /></svg>
                <span style={{ font: '800 12px/1 system-ui', color: '#fff' }}>겹침 {sp.overlap}</span>
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex' }}>
              <CardAvatars sp={sp} size={34} />
            </div>
          </>
        ) : (
          <>
            <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff' }}>{sp.name}</div>
            <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}><CardAvatars sp={sp} size={30} /></div>
              <span style={{ font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.65)' }}>{sp.placeCount}곳 · 멤버 {sp.memberCount}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardAvatars({ sp, size }) {
  const list = (sp.avatars || []).map((k) => members[k]);
  return (
    <>
      {list.map((m, i) => <Avatar key={i} m={m} size={size} border="#0D0D0F" ml={i === 0 ? 0 : -11} />)}
      {sp.gradAvatars?.map((g, i) => (
        <div key={'g' + i} style={{ width: size, height: size, borderRadius: '50%', border: '2.5px solid #0D0D0F', background: `linear-gradient(140deg,${g},#333)`, marginLeft: -11 }} />
      ))}
      {sp.extra > 0 && (
        <div style={{ width: size, height: size, borderRadius: '50%', border: '2.5px solid #0D0D0F', background: '#2a2a2e', marginLeft: -11, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 11px/1 system-ui', color: '#fff' }}>+{sp.extra}</div>
      )}
    </>
  );
}

function JoinModal({ onClose, onJoin }) {
  const [code, setCode] = useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div className="pm-up" onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1e', borderRadius: '28px 28px 0 0', padding: '22px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,.2)', margin: '0 auto 24px' }} />
        <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff', marginBottom: 8 }}>스페이스 참여하기</div>
        <div style={{ font: '500 14px/1.5 system-ui', color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>친구한테 스페이스 코드를 받으세요</div>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="참가 코드 입력 (예: SEONGSU2025)" style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '14px 16px', font: '600 15px/1 system-ui', color: '#fff', outline: 'none', textAlign: 'center', letterSpacing: '1px' }} />
        <div className="pm-tap" onClick={() => code.trim() && onJoin()} style={{ marginTop: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: code.trim() ? '#0D0D0F' : '#2a2a2e', borderRadius: 16, padding: 16, transition: 'background .2s' }}>
          <span style={{ font: '800 16px/1 system-ui', color: code.trim() ? '#fff' : '#6a6a70' }}>코드 전송</span>
        </div>
      </div>
    </div>
  );
}
