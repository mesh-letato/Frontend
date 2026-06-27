import { useEffect, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { SpaceHeaderTop } from '../components/SpaceHeader';
import { DetailTabs } from '../components/TabBar';
import { grad } from '../data/mock';
import { placesApi } from '../api';

const THUMBS = [grad.pasta, grad.cafe, grad.pink, grad.green];
const shortCat = (c) => (c ? c.split(' > ').pop() : '장소');
const shortArea = (addr) => (addr ? addr.split(' ').slice(0, 3).join(' ') : '');

export default function SpaceDetailList({ space, mine = false }) {
  const { go, replace } = useNav();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!space?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    placesApi
      .getPlacesBySpace(space.id)
      .then((data) => { if (!cancelled) setPlaces(data); })
      .catch((e) => { if (!cancelled) console.error('장소 목록 로드 실패', e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [space?.id]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      {/* 고정 영역 */}
      <div style={{ flexShrink: 0 }}>
        <SpaceHeaderTop space={space} mine={mine} placeCount={places.length} />
        <DetailTabs
          active="list"
          onMap={() => replace('spaceMap', { space, mine })}
          onList={() => {}}
          onLog={() => replace('spaceLog', { space, mine })}
        />
        <div style={{ padding: '16px 20px 6px', font: '700 12px/1 system-ui', letterSpacing: '.3px', color: '#6a6a70' }}>📍 최근 저장순</div>
      </div>

      {/* 스크롤 영역 (장소들만) */}
      <div className="pm-scroll" style={{ flex: 1, padding: '0 20px 30px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', font: '600 13px/1 system-ui', color: '#6a6a70' }}>불러오는 중…</div>
        ) : places.length === 0 ? (
          <div style={{ margin: '24px 0', padding: '28px 20px', background: '#18181B', borderRadius: 22, textAlign: 'center' }}>
            <div style={{ font: '700 15px/1.4 system-ui', color: '#fff' }}>아직 저장한 장소가 없어요</div>
            <div style={{ marginTop: 8, font: '500 13px/1.5 system-ui', color: '#6a6a70' }}>릴스 링크나 검색으로 장소를 추가해보세요</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {places.map((p, idx) => (
              <PlaceRow key={p.id} p={p} thumb={THUMBS[idx % THUMBS.length]} onTap={() => go('placeDetail', { place: mapToDetail(p, THUMBS[idx % THUMBS.length]), space })} />
            ))}
          </div>
        )}
      </div>
      <HomeIndicator />
    </div>
  );
}

// PlaceResponse → PlaceDetail 이 기대하는 형태로 변환
function mapToDetail(p, thumb) {
  return {
    id: p.id,
    name: p.name,
    cat: shortCat(p.category),
    area: shortArea(p.address),
    addr: p.address,
    thumb,
    lat: p.latitude != null ? Number(p.latitude) : undefined,
    lng: p.longitude != null ? Number(p.longitude) : undefined,
  };
}

function PlaceRow({ p, thumb, onTap }) {
  return (
    <div className="pm-tap" onClick={onTap} style={{ background: '#18181B', borderRadius: 22, padding: 13, display: 'flex', gap: 13, alignItems: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: 15, flexShrink: 0, background: p.thumbnailUrl ? `center/cover url(${p.thumbnailUrl})` : thumb }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '800 16px/1.1 system-ui', letterSpacing: '-.3px', color: '#fff' }}>{p.name}</div>
        <div style={{ marginTop: 4, font: '500 12px/1 system-ui', color: '#6a6a70' }}>{shortCat(p.category)}{p.address ? ` · ${shortArea(p.address)}` : ''}</div>
      </div>
    </div>
  );
}
