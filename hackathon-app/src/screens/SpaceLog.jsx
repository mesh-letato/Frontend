import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { SpaceHeaderTop } from '../components/SpaceHeader';
import { DetailTabs } from '../components/TabBar';
import { spaceLogs, members } from '../data/mock';

// 한 줄 리뷰 최대 20자 제한
const clip = (s) => (s.length > 20 ? s.slice(0, 20) + '…' : s);

export default function SpaceLog({ space }) {
  const { go, replace } = useNav();

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ flexShrink: 0 }}>
        <SpaceHeaderTop space={space} />
        <DetailTabs active="log" hasNew onMap={() => replace('spaceMap', { space })} onList={() => replace('spaceList', { space })} onLog={() => {}} />
        <div style={{ padding: '16px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>최신순</span>
          <span style={{ font: '600 11.5px/1 system-ui', color: '#6a6a70' }}>후기 {spaceLogs.length}개</span>
        </div>
      </div>

      <div className="pm-scroll" style={{ flex: 1, padding: '0 20px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {spaceLogs.map((log) => <LogItem key={log.id} log={log} onTap={() => go('friendLog', { log, space })} />)}
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function LogItem({ log, onTap }) {
  const who = members[log.who];
  return (
    <div className="pm-tap" onClick={onTap} style={{ background: '#18181B', borderRadius: 22, padding: 13 }}>
      {/* 작성자 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', padding: 2, background: 'conic-gradient(from 210deg,#f0a868,#d76a8a,#a83a5a,#f0a868)', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #18181B', background: who.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 12px/1 system-ui', color: '#fff' }}>{who.initial}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>{who.name}</span>
            <span style={{ font: '500 11px/1 system-ui', color: '#6a6a70' }}>{log.when}</span>
            {log.live && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#30d158' }} />}
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#2997ff" /></svg>
            <span style={{ font: '700 11.5px/1 system-ui', color: '#2997ff' }}>{log.place}</span>
            <span style={{ font: '500 11px/1 system-ui', color: '#6a6a70' }}>{log.action}</span>
          </div>
        </div>
      </div>
      {/* 폴라로이드 + 정보 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 88, background: '#fff', padding: '5px 5px 0', borderRadius: 3, transform: `rotate(${log.rot}deg)`, boxShadow: '0 8px 22px rgba(0,0,0,.55)', flexShrink: 0 }}>
          <div style={{ height: 74, borderRadius: 1, background: log.photo }} />
          <div style={{ padding: '5px 3px 9px', font: "700 10.5px/1.2 'Caveat',cursive", color: '#333', textAlign: 'center', overflow: 'hidden' }}>{clip(log.caption)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(41,151,255,.12)', borderRadius: 9999, padding: '5px 9px' }}>
            <span style={{ font: '600 11px/1 system-ui', color: '#2997ff' }}>{log.area}</span>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex' }}>
              {log.wantAvatars.map((k, i) => (
                <div key={k} style={{ width: 18, height: 18, borderRadius: '50%', background: members[k].color, border: '1.5px solid #18181B', marginLeft: i === 0 ? 0 : -5, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 7px/1 system-ui', color: '#fff' }}>{k === 'me' ? '나' : ''}</div>
              ))}
            </div>
            <span style={{ font: '500 11px/1.3 system-ui', color: '#6a6a70' }}>{log.wantBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
