import { useEffect, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { SpaceHeaderTop } from '../components/SpaceHeader';
import { DetailTabs } from '../components/TabBar';
import { reviewsApi } from '../api';
import { memberColor, memberInitial } from '../utils/member';

const clip = (s = '') => (s.length > 20 ? s.slice(0, 20) + '…' : s);

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

const isImg = (url) => typeof url === 'string' && /^https?:|^data:/.test(url);

export default function SpaceLog({ space, mine = false }) {
  const { replace } = useNav();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!space?.id) { setLoading(false); return; }
    setLoading(true);
    reviewsApi
      .getReviewsBySpace(space.id)
      .then((data) => { if (!cancelled) setLogs(data); })
      .catch((e) => { if (!cancelled) console.error('로그 로드 실패', e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [space?.id]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ flexShrink: 0 }}>
        <SpaceHeaderTop space={space} mine={mine} />
        <DetailTabs active="log" onMap={() => replace('spaceMap', { space, mine })} onList={() => replace('spaceList', { space, mine })} onLog={() => {}} />
        <div style={{ padding: '16px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>최신순</span>
          <span style={{ font: '600 11.5px/1 system-ui', color: '#6a6a70' }}>후기 {logs.length}개</span>
        </div>
      </div>

      <div className="pm-scroll" style={{ flex: 1, padding: '0 20px 30px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', font: '600 13px/1 system-ui', color: '#6a6a70' }}>불러오는 중…</div>
        ) : logs.length === 0 ? (
          <div style={{ margin: '24px 0', padding: '28px 20px', background: '#18181B', borderRadius: 22, textAlign: 'center' }}>
            <div style={{ font: '700 15px/1.4 system-ui', color: '#fff' }}>아직 올라온 후기가 없어요</div>
            <div style={{ marginTop: 8, font: '500 13px/1.5 system-ui', color: '#6a6a70' }}>장소에 다녀온 후기를 남겨보세요 📸</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {logs.map((log) => <LogItem key={log.id} log={log} />)}
          </div>
        )}
      </div>
      <HomeIndicator />
    </div>
  );
}

const POLAROID_GRADS = [
  'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)',
  'radial-gradient(circle at 40% 30%,#c9b6e8,transparent),linear-gradient(150deg,#6b5b95,#2b2a4a)',
  'radial-gradient(circle at 40% 30%,#ffd0db,transparent),linear-gradient(150deg,#f3a9b9,#a83a5a)',
];

function LogItem({ log }) {
  const photoStyle = isImg(log.imageUrl)
    ? { backgroundImage: `url(${log.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: POLAROID_GRADS[Math.abs(Number(log.id) || 0) % POLAROID_GRADS.length] };
  const rot = (Number(log.id) % 2 === 0 ? 1 : -1) * 2;

  return (
    <div style={{ background: '#18181B', borderRadius: 22, padding: 13 }}>
      {/* 작성자 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', padding: 2, background: 'conic-gradient(from 210deg,#f0a868,#d76a8a,#a83a5a,#f0a868)', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #18181B', background: memberColor(log.userId), display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 12px/1 system-ui', color: '#fff' }}>{memberInitial(log.nickname)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>{log.nickname || '회원'}</span>
            <span style={{ font: '500 11px/1 system-ui', color: '#6a6a70' }}>{timeAgo(log.createdAt)}</span>
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#2997ff" /></svg>
            <span style={{ font: '500 11px/1 system-ui', color: '#6a6a70' }}>다녀왔어요</span>
          </div>
        </div>
      </div>
      {/* 폴라로이드 + 한 줄 후기 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 88, background: '#fff', padding: '5px 5px 0', borderRadius: 3, transform: `rotate(${rot}deg)`, boxShadow: '0 8px 22px rgba(0,0,0,.55)', flexShrink: 0 }}>
          <div style={{ height: 74, borderRadius: 1, ...photoStyle }} />
          <div style={{ padding: '5px 3px 9px', font: "700 10.5px/1.2 'Caveat',cursive", color: '#333', textAlign: 'center', overflow: 'hidden' }}>{clip(log.content)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <div style={{ font: "700 17px/1.3 'Caveat',cursive", color: '#fff' }}>{log.content}</div>
        </div>
      </div>
    </div>
  );
}
