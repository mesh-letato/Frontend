import { useEffect, useRef, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator, Avatar } from '../components/Chrome';
import { loadKakaoMapSdk } from '../utils/kakaoMap';
import { DetailTabs } from '../components/TabBar';
import { ManageBtn, MemberManageModal } from '../components/SpaceHeader';
import { grad } from '../data/mock';
import { placesApi, spacesApi } from '../api';
import { toAvatar, memberColor } from '../utils/member';

const THUMBS = [grad.pasta, grad.cafe, grad.pink, grad.green];
const shortCat = (c) => (c ? c.split(' > ').pop() : '장소');
const DEFAULT_CENTER = { lat: 37.5445, lng: 127.0558 }; // 성수 인근 기본 중심

// 멤버 색상 커스텀 핀 (카카오맵 기본 파란 마커 대체) — 저장한 사람의 색으로 꽂힘
function makePinImage(kakaoMaps, color, big = false) {
  const w = big ? 42 : 34;
  const h = big ? 54 : 44;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 34 44'><path d='M17 42.5S3.5 26.5 3.5 15a13.5 13.5 0 1 1 27 0c0 11.5-13.5 27.5-13.5 27.5z' fill='${color}' stroke='#fff' stroke-width='2.6' stroke-linejoin='round'/><circle cx='17' cy='15' r='5.2' fill='#fff'/></svg>`;
  const src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  return new kakaoMaps.MarkerImage(src, new kakaoMaps.Size(w, h), { offset: new kakaoMaps.Point(w / 2, h) });
}

export default function SpaceDetailMap({ space, mine = false }) {
  const { back, go, replace, user } = useNav();
  const [places, setPlaces] = useState([]);
  const [members, setMembers] = useState([]);
  const [colors, setColors] = useState({}); // placeId → 저장자 멤버색
  const [selected, setSelected] = useState(0);
  const [manage, setManage] = useState(false);
  const myColor = memberColor(user?.id);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // 실제 장소 로드
  useEffect(() => {
    let cancelled = false;
    if (!space?.id) return;
    placesApi
      .getPlacesBySpace(space.id)
      .then((data) => { if (!cancelled) { setPlaces(data); setSelected(0); } })
      .catch((e) => console.error('장소 로드 실패', e));
    return () => { cancelled = true; };
  }, [space?.id]);

  // 공유 스페이스 멤버 로드
  useEffect(() => {
    let cancelled = false;
    if (mine || !space?.id) return;
    spacesApi
      .getSpaceMembers(space.id)
      .then((data) => { if (!cancelled) setMembers(data); })
      .catch((e) => console.error('멤버 로드 실패', e));
    return () => { cancelled = true; };
  }, [space?.id, mine]);

  // 공유 스페이스: 장소별 저장자 색 로드 (내 지도는 전부 내 색)
  useEffect(() => {
    if (mine || !places.length) return;
    let cancelled = false;
    Promise.all(
      places.map((p) =>
        placesApi
          .getPlaceSavers(p.id)
          .then((r) => [p.id, r?.savers?.[0]?.userId != null ? memberColor(r.savers[0].userId) : null])
          .catch(() => [p.id, null])
      )
    ).then((entries) => {
      if (cancelled) return;
      const m = {};
      entries.forEach(([id, c]) => { if (c) m[id] = c; });
      setColors(m);
    });
    return () => { cancelled = true; };
  }, [places, mine]);

  // 지도 초기화 + 마커 렌더
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const kakaoMaps = await loadKakaoMapSdk();
        if (cancelled || !mapRef.current) return;

        kakaoMaps.load(() => {
          const container = mapRef.current;
          if (!container || cancelled) return;

          const first = places[0];
          const center = first
            ? new kakaoMaps.LatLng(Number(first.latitude), Number(first.longitude))
            : new kakaoMaps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);

          const map = new kakaoMaps.Map(container, { center, level: 5 });
          mapInstanceRef.current = map;

          markersRef.current.forEach(({ marker }) => marker.setMap(null));
          markersRef.current = places
            .filter((p) => p.latitude != null && p.longitude != null)
            .map((pin, index) => {
              const position = new kakaoMaps.LatLng(Number(pin.latitude), Number(pin.longitude));
              const color = mine ? myColor : (colors[pin.id] || myColor);
              const marker = new kakaoMaps.Marker({ map, position, title: pin.name, image: makePinImage(kakaoMaps, color, index === selected) });
              const infoWindow = new kakaoMaps.InfoWindow({
                content: `<div style="padding:7px 10px;font-size:12px;font-weight:700;color:#111;">${pin.name}</div>`,
              });
              kakaoMaps.event.addListener(marker, 'click', () => setSelected(index));
              return { marker, infoWindow, index, placeId: pin.id };
            });

          if (markersRef.current.length) {
            const bounds = new kakaoMaps.LatLngBounds();
            places.forEach((p) => {
              if (p.latitude != null && p.longitude != null) {
                bounds.extend(new kakaoMaps.LatLng(Number(p.latitude), Number(p.longitude)));
              }
            });
            map.setBounds(bounds);
          }
        });
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach(({ infoWindow }) => infoWindow?.close());
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, [places]);

  // 선택/색 변경 시 핀 색·강조 갱신 + 해당 마커로 이동 + 인포윈도우
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) return;
    const kakaoMaps = window.kakao.maps;
    const map = mapInstanceRef.current;
    const target = places[selected];
    if (target && target.latitude != null) {
      map.panTo(new kakaoMaps.LatLng(Number(target.latitude), Number(target.longitude)));
    }
    markersRef.current.forEach(({ marker, infoWindow, index, placeId }) => {
      const color = mine ? myColor : (colors[placeId] || myColor);
      marker.setImage(makePinImage(kakaoMaps, color, index === selected));
      if (index === selected) infoWindow.open(map, marker);
      else infoWindow.close();
    });
  }, [selected, places, colors, mine, myColor]);

  const sel = places[selected];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#12141a', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0e1117' }} />

      <Notch />
      <StatusBar />

      {/* 헤더 카드 */}
      <div style={{ position: 'absolute', top: 62, left: 14, right: 14, zIndex: 20, background: 'rgba(24,24,27,.82)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '12px 15px', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <BackBtn onClick={back} />
          <div style={{ flex: 1, font: '800 17px/1 Pinmoa, system-ui', letterSpacing: '-.4px', color: '#fff' }}>{space?.emoji ? `${space.emoji} ` : ''}{space?.name || '스페이스'}</div>
          {mine ? (
            <Avatar m={{ color: '#2997ff', initial: (user?.nickname || '나').slice(0, 1) }} size={28} border="#18181B" />
          ) : (
            <>
              <div style={{ display: 'flex', marginRight: 4 }}>
                {members.slice(0, 3).map((m, i) => <Avatar key={m.userId} m={toAvatar(m)} size={28} border="#18181B" ml={i === 0 ? 0 : -9} />)}
                {(space?.memberCount ?? members.length) > 3 && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #18181B', background: '#2a2a2e', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 9px/1 Pinmoa, system-ui', color: '#fff' }}>+{(space?.memberCount ?? members.length) - 3}</div>
                )}
              </div>
              <ManageBtn onClick={() => setManage(true)} />
            </>
          )}
        </div>
        <div style={{ marginTop: 9, font: '600 12px/1 Pinmoa, system-ui', color: 'rgba(255,255,255,.55)' }}>장소 {places.length}곳</div>
      </div>

      {/* 토글 */}
      <DetailTabs floating active="map" onMap={() => {}} onList={() => replace('spaceList', { space, mine })} onLog={() => replace('spaceLog', { space, mine })} />

      {/* 하단 상세 카드 */}
      {sel ? (
        <div className="pm-up" key={selected} style={{ position: 'absolute', left: 12, right: 12, bottom: 34, zIndex: 25, background: '#18181B', borderRadius: 26, padding: 15, boxShadow: '0 16px 44px rgba(0,0,0,.55)' }}>
          <div className="pm-tap" onClick={() => go('placeDetail', { place: mapToDetail(sel, THUMBS[selected % THUMBS.length]), space })} style={{ display: 'flex', gap: 13 }}>
            <div style={{ width: 78, height: 78, borderRadius: 18, flexShrink: 0, background: sel.thumbnailUrl ? `center/cover url(${sel.thumbnailUrl})` : THUMBS[selected % THUMBS.length] }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ font: '800 18px/1.1 Pinmoa, system-ui', letterSpacing: '-.4px', color: '#fff' }}>{sel.name}</span>
              <div style={{ marginTop: 5, font: '500 12.5px/1.3 Pinmoa, system-ui', color: '#6a6a70' }}>{shortCat(sel.category)}{sel.address ? ` · ${sel.address}` : ''}</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 9 }}>
            <div className="pm-tap" onClick={() => go('placeDetail', { place: mapToDetail(sel, THUMBS[selected % THUMBS.length]), space })} style={{ flex: 1, textAlign: 'center', background: '#2997ff', borderRadius: 12, padding: '11px 0', font: '800 13px/1 Pinmoa, system-ui', color: '#fff' }}>자세히 보기</div>
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 34, zIndex: 25, background: '#18181B', borderRadius: 26, padding: '20px 18px', boxShadow: '0 16px 44px rgba(0,0,0,.55)', textAlign: 'center' }}>
          <div style={{ font: '700 14px/1.4 Pinmoa, system-ui', color: '#fff' }}>아직 저장한 장소가 없어요</div>
          <div style={{ marginTop: 6, font: '500 12.5px/1.5 Pinmoa, system-ui', color: '#6a6a70' }}>릴스 링크나 검색으로 장소를 추가해보세요</div>
        </div>
      )}

      {manage && <MemberManageModal space={space} onClose={() => setManage(false)} />}
      <HomeIndicator />
    </div>
  );
}

function mapToDetail(p, thumb) {
  return {
    id: p.id,
    name: p.name,
    cat: shortCat(p.category),
    area: p.address ? p.address.split(' ').slice(0, 3).join(' ') : '',
    addr: p.address,
    thumb,
    lat: p.latitude != null ? Number(p.latitude) : undefined,
    lng: p.longitude != null ? Number(p.longitude) : undefined,
  };
}
