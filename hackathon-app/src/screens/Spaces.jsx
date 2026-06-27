import { useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { TabBar } from '../components/TabBar';
import { MY_SPACE } from '../data/mock';

export default function Spaces() {
  const { go, reset, spaces, showToast } = useNav();
  const [menu, setMenu] = useState(null); // 'plus' | 'profile' | null
  const [join, setJoin] = useState(false);
  const [link, setLink] = useState(false);
  const [search, setSearch] = useState(false);
  const openMyMap = () => go('spaceMap', { space: MY_SPACE, mine: true });

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      <div className="pm-scroll" style={{ flex: 1, paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px 0' }}>
          <div style={{ font: '800 34px/1 system-ui', letterSpacing: '-1.4px', color: '#fff' }}>스페이스</div>
          <div className="pm-tap" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} style={{ width: 38, height: 38, borderRadius: '50%', background: menu === 'profile' ? '#2997ff' : 'linear-gradient(140deg,#5aa0ef,#0066cc)' }} />
        </div>
        <div style={{ padding: '6px 22px 0', font: '500 14px/1.3 system-ui', letterSpacing: '-.2px', color: 'rgba(255,255,255,.5)' }}>친구들과 함께 모은 지도예요</div>

        <div style={{ padding: '22px 22px 0', font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>참여 중인 스페이스</div>

        {/* 스페이스 카드들 (친구들과 함께한 스페이스만) */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16, padding: '0 16px' }}>
          {spaces.map((sp) => <SpaceCard key={sp.id} sp={sp} onTap={() => go('spaceMap', { space: sp })} />)}
        </div>
      </div>

      <TabBar
        active="space"
        onPlus={() => setMenu(menu === 'plus' ? null : 'plus')}
      />

      {/* + 드롭다운 (장소 추가 2 + 스페이스 추가 2) */}
      {menu === 'plus' && (
        <>
          <div onClick={() => setMenu(null)} style={overlay} />
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 100, zIndex: 120, background: '#1c1c20', borderRadius: 20, padding: 8, boxShadow: '0 20px 50px rgba(0,0,0,.6)', animation: 'pmUp .25s ease' }}>
            <div style={{ padding: '8px 12px 4px', font: '700 11px/1 system-ui', letterSpacing: '.4px', color: '#6a6a70' }}>장소 추가</div>
            <MenuRow icon="🔗" title="URL로 장소 추가" sub="릴스·틱톡 링크로 장소 저장" onClick={() => { setMenu(null); setLink(true); }} />
            <MenuRow icon="🔍" title="검색해서 장소 추가" sub="장소 이름으로 찾아 저장" onClick={() => { setMenu(null); setSearch(true); }} />
            <div style={{ height: '.5px', background: 'rgba(255,255,255,.08)', margin: '6px 12px' }} />
            <div style={{ padding: '6px 12px 4px', font: '700 11px/1 system-ui', letterSpacing: '.4px', color: '#6a6a70' }}>스페이스 추가</div>
            <MenuRow icon="✨" title="스페이스 생성하기" sub="친구와 함께할 새 지도 만들기" onClick={() => { setMenu(null); go('createSpace'); }} />
            <MenuRow icon="🔑" title="스페이스 참가코드 입력" sub="친구한테 받은 코드로 참여하기" onClick={() => { setMenu(null); setJoin(true); }} />
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
            <MenuRow icon="🗺️" title="내 지도" sub="저장한 장소 모아보기" onClick={() => { setMenu(null); openMyMap(); }} />
            <MenuRow icon="✏️" title="프로필 편집" sub="이름·아이디·사진 변경" onClick={() => { setMenu(null); showToast('프로필 편집 (준비 중)'); }} />
            <MenuRow icon="⚙️" title="계정 관리" sub="알림·보안·로그아웃" onClick={() => { setMenu(null); reset('login'); }} />
          </div>
        </>
      )}

      {/* 참가 코드 모달 */}
      {join && <JoinModal onClose={() => setJoin(false)} onJoin={() => { setJoin(false); showToast('스페이스에 참가했어요 🎉'); }} />}

      {/* URL로 장소 추가 */}
      {link && <LinkModal onClose={() => setLink(false)} onSubmit={(url) => { setLink(false); go('linkAnalyzing', { url, target: 'myspace' }); }} />}

      {/* 검색해서 장소 추가 */}
      {search && <SearchModal onClose={() => setSearch(false)} onSubmit={() => { setSearch(false); go('placeSelect'); }} />}

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
  return (
    <div className="pm-tap" onClick={onTap} style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', height: 168, background: sp.bg }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(13,13,15,.1) 40%,rgba(13,13,15,.92) 100%)' }} />
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
        <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff' }}>{sp.name}</div>
        <div style={{ marginTop: 8, font: '600 13px/1 system-ui', color: 'rgba(255,255,255,.65)' }}>{sp.placeCount}곳 · 멤버 {sp.memberCount}명</div>
      </div>
    </div>
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

// URL로 장소 추가 (릴스·틱톡 링크 → 자동 분석)
function LinkModal({ onClose, onSubmit }) {
  const [url, setUrl] = useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div className="pm-up" onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1e', borderRadius: '28px 28px 0 0', padding: '22px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,.2)', margin: '0 auto 24px' }} />
        <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff', marginBottom: 8 }}>URL로 장소 추가</div>
        <div style={{ font: '500 14px/1.5 system-ui', color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>릴스·틱톡 링크를 붙여넣으면 장소를 자동으로 찾아줘요</div>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '14px 16px', font: '500 14px/1 system-ui', color: '#fff', outline: 'none' }} />
        <div className="pm-tap" onClick={() => onSubmit(url || 'instagram.com/reel/Cx8q…seongsu')} style={{ marginTop: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2997ff', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(41,151,255,.36)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></svg>
          <span style={{ font: '800 16px/1 system-ui', color: '#fff' }}>가져오기</span>
        </div>
        <div className="pm-tap" onClick={onClose} style={{ marginTop: 12, textAlign: 'center', font: '700 14px/1 system-ui', color: 'rgba(255,255,255,.4)', padding: 10 }}>취소</div>
      </div>
    </div>
  );
}

// 검색해서 장소 추가 (장소 이름으로 검색)
function SearchModal({ onClose, onSubmit }) {
  const [q, setQ] = useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div className="pm-up" onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1e', borderRadius: '28px 28px 0 0', padding: '22px 20px 44px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,.2)', margin: '0 auto 24px' }} />
        <div style={{ font: '800 24px/1 system-ui', letterSpacing: '-.7px', color: '#fff', marginBottom: 8 }}>검색해서 장소 추가</div>
        <div style={{ font: '500 14px/1.5 system-ui', color: 'rgba(255,255,255,.5)', marginBottom: 22 }}>장소 이름이나 키워드로 검색해 저장해요</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '13px 14px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,.55)" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="예: 미오 성수" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', font: '500 15px/1 system-ui', color: '#fff' }} />
        </div>
        <div className="pm-tap" onClick={() => onSubmit(q || '미오 성수')} style={{ marginTop: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2997ff', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(41,151,255,.36)' }}>
          <span style={{ font: '800 16px/1 system-ui', color: '#fff' }}>검색</span>
        </div>
        <div className="pm-tap" onClick={onClose} style={{ marginTop: 12, textAlign: 'center', font: '700 14px/1 system-ui', color: 'rgba(255,255,255,.4)', padding: 10 }}>취소</div>
      </div>
    </div>
  );
}
