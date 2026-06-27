import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { friendStories, members, placesSeongsu } from '../data/mock';

export default function PlaceDetail({ place: placeProp, space }) {
  const { back, go, showToast } = useNav();
  const place = placeProp || placesSeongsu[0];
  const reels = place.reels?.length ? place.reels : placesSeongsu[0].reels;

  const openReel = () => {
    showToast('인스타그램 릴스를 여는 중…');
    setTimeout(() => window.open('https://www.instagram.com/reel/', '_blank'), 300);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', overflow: 'hidden' }}>
      {/* hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, background: place.thumb || 'radial-gradient(circle at 35% 28%,#ffd9a8,transparent 55%),linear-gradient(150deg,#f0a868,#9a3a2e)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, background: 'linear-gradient(180deg,rgba(13,13,15,.15),rgba(13,13,15,.05) 40%,#0D0D0F)' }} />

      <Notch />
      <StatusBar />
      <div className="pm-tap" onClick={back} style={{ position: 'absolute', top: 60, left: 18, zIndex: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="10" height="17" viewBox="0 0 9 16"><path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>

      <div className="pm-scroll" style={{ position: 'absolute', top: 178, left: 0, right: 0, bottom: 0 }}>
        {/* 기본 정보 */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ font: '800 26px/1 system-ui', letterSpacing: '-.7px', color: '#fff' }}>{place.name}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>⭐ {place.rating || '4.8'}</span>
                <span style={{ font: '500 13px/1 system-ui', color: '#6a6a70' }}>{place.cat} · {place.area}</span>
              </div>
            </div>
            <div className="pm-tap" onClick={() => showToast('저장했어요 📍')} style={{ width: 46, height: 46, borderRadius: '50%', background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(41,151,255,.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /></svg>
            </div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pm-tap" onClick={() => showToast(`${place.count || 5}명이 저장: 나, 지윤, 도윤…`)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#18181B', borderRadius: 13, padding: '9px 12px' }}>
              <div style={{ display: 'flex' }}>{['me', 'jiyoon', 'doyoon'].map((k, i) => <div key={k} style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #18181B', background: members[k].color, marginLeft: i === 0 ? 0 : -7 }} />)}</div>
              <span style={{ font: '700 12px/1 system-ui', color: '#fff' }}>{place.count || 5}명 저장</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#18181B', borderRadius: 13, padding: '9px 12px' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#30d158' }} /><span style={{ font: '700 12px/1 system-ui', color: '#fff' }}>영업중 · 22시까지</span></div>
          </div>
          <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ font: '600 13px/1 system-ui' }}>📍</span><span style={{ font: '500 13px/1.2 system-ui', color: 'rgba(255,255,255,.7)' }}>{place.addr || '서울 성동구 연무장길 33 · 320m'}</span></div>
        </div>

        {/* 릴스 */}
        <div style={{ marginTop: 24, padding: '0 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: '800 18px/1 system-ui', letterSpacing: '-.4px', color: '#fff' }}>이 장소를 저장한 릴스 ▶️</div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="#6a6a70" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg><span style={{ font: '500 11.5px/1.3 system-ui', color: '#6a6a70' }}>탭하면 인스타에서 열려요</span></div>
          </div>
          <span style={{ font: '800 13px/1 system-ui', color: '#2997ff' }}>{reels.length}</span>
        </div>
        <div className="pm-scroll" style={{ marginTop: 13, padding: '0 20px', display: 'flex', gap: 13, overflowX: 'auto' }}>
          {reels.map((r, i) => (
            <div key={i} className="pm-tap" onClick={openReel} style={{ position: 'relative', width: 139, height: 200, flexShrink: 0, borderRadius: 18, overflow: 'hidden', background: r.g, boxShadow: '0 10px 24px rgba(0,0,0,.45)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.04) 32%,rgba(0,0,0,.8))' }} />
              <div style={{ position: 'absolute', top: 9, left: 9, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,.42)', backdropFilter: 'blur(8px)', borderRadius: 9999, padding: '4px 8px' }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span style={{ font: '700 9px/1 system-ui', color: '#fff' }}>Reels</span></div>
              <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(6px)', border: '1.5px solid rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="15" height="15" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5Z" fill="#fff" /></svg></div>
              <div style={{ position: 'absolute', left: 11, right: 11, bottom: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 19, height: 19, borderRadius: '50%', background: 'linear-gradient(140deg,#f9ce7a,#e0683e)', border: '1.5px solid #fff' }} /><span style={{ font: '800 12px/1 system-ui', color: '#fff' }}>{r.user}</span></div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><svg width="11" height="11" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5Z" fill="rgba(255,255,255,.85)" /></svg><span style={{ font: '600 10.5px/1 system-ui', color: 'rgba(255,255,255,.85)' }}>{r.views}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: '22px 20px 0', height: '.5px', background: 'rgba(255,255,255,.08)' }} />

        {/* 친구들 후기 */}
        <div style={{ marginTop: 18, padding: '0 20px', font: '800 18px/1 system-ui', letterSpacing: '-.4px', color: '#fff' }}>친구들 후기</div>
        <div style={{ marginTop: 13, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {friendStories.map((s, i) => {
            const who = members[s.who];
            return (
              <div key={i} className="pm-tap" onClick={() => go('friendLog', { log: { who: s.who, when: s.when, place: place.name, area: place.area, photo: s.g, caption: s.text, action: '다녀왔어요', wantBy: '나 외 1명 가고싶어해요', wantAvatars: ['me', 'doyoon'] }, space })} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#18181B', borderRadius: 18, padding: '11px 13px' }}>
                <div style={{ width: 54, height: 54, flexShrink: 0, borderRadius: '50%', padding: 2.5, background: 'conic-gradient(from 210deg,#f0a868,#d76a8a,#a83a5a,#f0a868)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2.5px solid #18181B', background: who.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 14px/1 system-ui', color: '#fff' }}>{who.initial}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>{who.name}</span><span style={{ font: '600 10.5px/1 system-ui', color: '#6a6a70' }}>{s.when}</span></div>
                  <div style={{ marginTop: 5, font: "700 18px/1.05 'Caveat',cursive", color: '#fff' }}>{s.text}</div>
                </div>
                <div style={{ width: 50, height: 64, borderRadius: 11, flexShrink: 0, background: s.g }} />
              </div>
            );
          })}
        </div>
        <div style={{ height: 110 }} />
      </div>

      {/* 후기 올리기 CTA */}
      <div className="pm-tap" onClick={() => go('writeReview', { place, space })} style={{ position: 'absolute', left: 20, right: 20, bottom: 26, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#fff', borderRadius: 18, padding: 16, boxShadow: '0 12px 30px rgba(0,0,0,.5)' }}>
        <span style={{ font: '700 17px/1 system-ui' }}>📸</span><span style={{ font: '800 16px/1 system-ui', color: '#0D0D0F' }}>다녀왔어요, 후기 올리기</span>
      </div>
      <HomeIndicator />
    </div>
  );
}
