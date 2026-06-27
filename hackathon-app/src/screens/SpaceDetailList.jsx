import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { SpaceHeaderTop } from '../components/SpaceHeader';
import { DetailTabs } from '../components/TabBar';
import { placesSeongsu, members } from '../data/mock';

export default function SpaceDetailList({ space }) {
  const { go, replace } = useNav();

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      {/* 고정 영역 */}
      <div style={{ flexShrink: 0 }}>
        <SpaceHeaderTop space={space} />
        <DetailTabs
          active="list"
          onMap={() => replace('spaceMap', { space })}
          onList={() => {}}
          onLog={() => replace('spaceLog', { space })}
        />
        <div style={{ padding: '16px 20px 6px', font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>🔥 많이 겹친 순</div>
      </div>

      {/* 스크롤 영역 (장소들만) */}
      <div className="pm-scroll" style={{ flex: 1, padding: '0 20px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {placesSeongsu.map((p, idx) => <PlaceRow key={p.id} p={p} hot={idx === 0} onTap={() => go('placeDetail', { place: p, space })} />)}
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

function PlaceRow({ p, hot, onTap }) {
  const saverAvatars = p.savers.map((k) => members[k]);
  // 사진 후기가 있는 hot 카드
  if (hot) {
    return (
      <div className="pm-tap" onClick={onTap} style={{ background: '#18181B', borderRadius: 22, padding: 13, boxShadow: '0 0 0 1.5px rgba(41,151,255,.4)' }}>
        <div style={{ display: 'flex', gap: 13 }}>
          <Thumb p={p} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '800 17px/1.1 system-ui', letterSpacing: '-.3px', color: '#fff' }}>{p.name}</div>
            <div style={{ marginTop: 5, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{p.cat} · {p.area}</div>
            <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ display: 'flex' }}>{saverAvatars.map((m, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #18181B', background: m.color, marginLeft: i === 0 ? 0 : -6 }} />)}</div>
              <span style={{ font: '700 11px/1 system-ui', color: 'rgba(255,255,255,.5)' }}>{p.saverText}</span>
            </div>
          </div>
        </div>
        {/* 후기 strip */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 9, background: '#0D0D0F', borderRadius: 14, padding: '9px 11px' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '700 12px/1.2 system-ui', color: '#fff' }}>{p.reviewer}이 다녀왔어요</div>
            <div style={{ marginTop: 3, font: "600 11.5px/1.2 'Caveat',cursive", color: 'rgba(255,255,255,.65)' }}>{p.review}</div>
          </div>
          <span style={{ font: '700 17px/1 system-ui' }}>📸</span>
        </div>
      </div>
    );
  }
  // 일반 카드 (2명 이상)
  if (p.count > 1) {
    return (
      <div className="pm-tap" onClick={onTap} style={{ background: '#18181B', borderRadius: 22, padding: 13 }}>
        <div style={{ display: 'flex', gap: 13 }}>
          <Thumb p={p} size={72} blue={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '800 17px/1.1 system-ui', letterSpacing: '-.3px', color: '#fff' }}>{p.name}</div>
            <div style={{ marginTop: 5, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{p.cat} · {p.area}</div>
            <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ display: 'flex' }}>{saverAvatars.map((m, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #18181B', background: m.color, marginLeft: i === 0 ? 0 : -6 }} />)}</div>
              <span style={{ font: '700 11px/1 system-ui', color: 'rgba(255,255,255,.5)' }}>{p.saverText}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // 단일 저장 카드
  return (
    <div className="pm-tap" onClick={onTap} style={{ background: '#18181B', borderRadius: 22, padding: 13, display: 'flex', gap: 13, alignItems: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: 14, flexShrink: 0, background: p.thumb }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '800 16px/1.1 system-ui', letterSpacing: '-.3px', color: '#fff' }}>{p.name}</div>
        <div style={{ marginTop: 5, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{p.cat} · {p.area}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: members.doyoon.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 9px/1 system-ui', color: '#fff' }}>도윤</div>
        <span style={{ font: '700 11px/1 system-ui', color: '#6a6a70' }}>{p.count}명</span>
      </div>
    </div>
  );
}

function Thumb({ p, size }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: 16, flexShrink: 0, background: p.thumb }}>
      <div style={{ position: 'absolute', left: -4, top: -6, background: p.count >= 4 ? '#2997ff' : '#1c1c20', border: '2px solid #18181B', borderRadius: 9999, padding: '3px 8px' }}>
        <span style={{ font: '800 11px/1 system-ui', color: '#fff' }}>{p.count}명</span>
      </div>
    </div>
  );
}
