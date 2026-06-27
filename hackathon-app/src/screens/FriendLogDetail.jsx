import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { members, spaceLogs } from '../data/mock';

// 나무 핀보드 질감 배경
const WOOD = 'repeating-linear-gradient(95deg,#6b4a2f,#6b4a2f 3px,#634428 3px,#634428 7px),linear-gradient(160deg,#7a5436,#4e3621)';

export default function FriendLogDetail({ log: logProp, space }) {
  const { back } = useNav();
  const log = logProp || spaceLogs[0];
  const who = members[log.who];
  const detail = log.detail || '웨이팅 30분 했는데 그만한 가치 있었음. 트러플 향 미쳤고 면 익힘 완벽. 분위기도 좋아서 데이트 코스로 강추 🍝';

  return (
    <div style={{ position: 'absolute', inset: 0, background: WOOD, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 20%,rgba(0,0,0,0),rgba(0,0,0,.45))' }} />
      <Notch />
      <StatusBar />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0', zIndex: 5 }}>
        <BackBtn onClick={back} light />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(10px)', borderRadius: 9999, padding: '6px 12px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /></svg>
          <span style={{ font: '700 12px/1 system-ui', color: '#fff' }}>{log.place}</span>
        </div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div className="pm-scroll" style={{ position: 'relative', zIndex: 5, flex: 1, padding: '8px 0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'calc(100% - 110px)' }}>
        {/* 장소 헤더 */}
        <div style={{ textAlign: 'center', padding: '10px 20px 0' }}>
          <div style={{ font: '800 24px/1.1 system-ui', letterSpacing: '-.6px', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>📍 {log.place}</div>
          <div style={{ marginTop: 7, font: '600 12.5px/1 system-ui', color: 'rgba(255,255,255,.85)' }}>이탈리안 · {log.area}</div>
        </div>

        {/* 폴라로이드 (상단 중앙에 작성자 핀) */}
        <div style={{ position: 'relative', marginTop: 28, width: 262, background: '#fff', padding: '13px 13px 0', borderRadius: 4, transform: `rotate(${(log.rot || -2)}deg)`, boxShadow: '0 22px 50px rgba(0,0,0,.6)' }}>
          {/* 핀 */}
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: who.color, border: '3px solid #fff', boxShadow: `0 4px 12px ${who.color}aa` }} />
            <div style={{ width: 3, height: 12, background: 'rgba(0,0,0,.35)', borderRadius: 1, marginTop: -1 }} />
          </div>
          <div style={{ height: 252, borderRadius: 2, background: log.photo }} />
          <div style={{ padding: '14px 6px 18px' }}>
            <div style={{ font: "700 22px/1.1 'Caveat',cursive", color: '#333', textAlign: 'center' }}>{log.caption}</div>
          </div>
        </div>

        {/* 작성자 */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: who.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 11px/1 system-ui', color: '#fff', border: '2px solid rgba(255,255,255,.6)' }}>{who.initial}</div>
          <span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>{who.name}</span>
          <span style={{ font: '500 12px/1 system-ui', color: 'rgba(255,255,255,.7)' }}>· {log.when} {log.action}</span>
        </div>

        {/* 후기 상세 */}
        <div style={{ margin: '20px 24px 0', background: 'rgba(20,12,6,.55)', backdropFilter: 'blur(4px)', borderRadius: 18, padding: '16px 18px', maxWidth: 340 }}>
          <div style={{ font: '500 14px/1.6 system-ui', color: 'rgba(255,255,255,.92)' }}>{detail}</div>
        </div>

        {/* 가고싶어요 */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(41,151,255,.2)', backdropFilter: 'blur(6px)', borderRadius: 9999, padding: '8px 14px' }}>
          <div style={{ display: 'flex' }}>{(log.wantAvatars || ['me', 'doyoon']).map((k, i) => <div key={k} style={{ width: 20, height: 20, borderRadius: '50%', background: members[k].color, border: '1.5px solid rgba(255,255,255,.5)', marginLeft: i === 0 ? 0 : -6, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 8px/1 system-ui', color: '#fff' }}>{k === 'me' ? '나' : ''}</div>)}</div>
          <span style={{ font: '700 12px/1 system-ui', color: '#fff' }}>{log.wantBy}</span>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
