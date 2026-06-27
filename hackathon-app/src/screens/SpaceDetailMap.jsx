import { useEffect, useRef, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator, Avatar } from '../components/Chrome';
import { loadKakaoMapSdk } from '../utils/kakaoMap';
import { DetailTabs } from '../components/TabBar';
import { ManageBtn, MemberManageModal } from '../components/SpaceHeader';
import { placesSeongsu, members } from '../data/mock';

// 폴라로이드 핀 데이터 (위치는 와이어프레임 기준 — 402x874 좌표를 % 로 환산)
const PINS = [
  { ...placesSeongsu[0], left: '44%', top: '41%', size: 76, dot: '#ff3b30', cap: '트러플 파스타 🤤', rot: -5, heat: true, badge: 5 },
  { ...placesSeongsu[1], left: '67%', top: '32%', size: 62, dot: '#2997ff', cap: '분위기 짱 ✨', rot: 4, badge: 3 },
  { ...placesSeongsu[2], left: '27%', top: '38%', size: 52, dot: '#d76a8a', cap: '소금빵 최고🥐', rot: -5, badge: 2 },
];
// 사진 없는 단일 핀
const DOTS = [
  { left: '78%', top: '47%', color: '#2997ff', size: 26 },
  { left: '37%', top: '53%', color: '#d76a8a', size: 22 },
  { left: '82%', top: '37%', color: '#5e8a4e', size: 22 },
];

export default function SpaceDetailMap({ space, mine = false }) {
  const { back, go, replace, showToast } = useNav();
  const [selected, setSelected] = useState(0); // 기본 첫 핀 선택
  const [manage, setManage] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const sel = PINS[selected];

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    const initializeMap = async () => {
      try {
        const kakaoMaps = await loadKakaoMapSdk();
        if (cancelled || !mapRef.current) return;

        kakaoMaps.load(() => {
          const container = mapRef.current;
          if (!container || cancelled) return;

          const map = new kakaoMaps.Map(container, {
            center: new kakaoMaps.LatLng(PINS[0].lat, PINS[0].lng),
            level: 4,
            draggable: true,
            scrollwheel: true,
          });

          mapInstanceRef.current = map;
          markersRef.current = PINS.map((pin, index) => {
            const position = new kakaoMaps.LatLng(pin.lat, pin.lng);
            const marker = new kakaoMaps.Marker({
              map,
              position,
              title: pin.name,
            });

            const infoWindow = new kakaoMaps.InfoWindow({
              content: `<div style="padding:8px 10px;font-size:12px;font-weight:700;color:#111;">${pin.name}</div>`,
            });

            kakaoMaps.event.addListener(marker, 'click', () => {
              setSelected(index);
              infoWindow.open(map, marker);
            });

            return { marker, infoWindow };
          });

          const bounds = new kakaoMaps.LatLngBounds();
          PINS.forEach((pin) => bounds.extend(new kakaoMaps.LatLng(pin.lat, pin.lng)));
          map.setBounds(bounds);
        });
      } catch (err) {
        console.error(err);
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach(({ infoWindow }) => infoWindow.close());
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;
    const map = mapInstanceRef.current;
    const target = PINS[selected];
    if (!target || !kakaoMaps?.LatLng) return;

    const position = new kakaoMaps.LatLng(target.lat, target.lng);
    map.panTo(position);

    markersRef.current.forEach(({ marker, infoWindow }, index) => {
      if (index === selected) {
        infoWindow.open(map, marker);
      } else {
        infoWindow.close();
      }
    });
  }, [selected]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#12141a', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0e1117' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.35))', zIndex: 1, pointerEvents: 'none' }} />

      {/* 선택 시 어두운 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: selected != null ? 0.4 : 0, transition: 'opacity .3s', pointerEvents: 'none', zIndex: 2 }} />

      <Notch />
      <StatusBar />

      {/* 헤더 카드 */}
      <div style={{ position: 'absolute', top: 62, left: 14, right: 14, zIndex: 20, background: 'rgba(24,24,27,.82)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '12px 15px', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <BackBtn onClick={back} />
          <div style={{ flex: 1, font: '800 17px/1 system-ui', letterSpacing: '-.4px', color: '#fff' }}>{space?.name || '성수 맛집 🍝'}</div>
          {mine ? (
            <Avatar m={members.me} size={28} border="#18181B" />
          ) : (
            <>
              <div style={{ display: 'flex' }}>
                {['me', 'jiyoon', 'doyoon'].map((k, i) => <Avatar key={k} m={members[k]} size={28} border="#18181B" ml={i === 0 ? 0 : -9} />)}
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #18181B', background: '#2a2a2e', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 9px/1 system-ui', color: '#fff' }}>+2</div>
              </div>
              <ManageBtn onClick={() => setManage(true)} />
            </>
          )}
        </div>
        {/* legend */}
        <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 12 }}>
          {[['me', '나'], ['jiyoon', '지윤'], ['doyoon', '도윤']].map(([k, label]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: members[k].color }} />
              <span style={{ font: '700 10.5px/1 system-ui', color: 'rgba(255,255,255,.7)' }}>{label}</span>
            </div>
          ))}
          <div style={{ width: 1, height: 11, background: 'rgba(255,255,255,.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ font: '700 11px/1 system-ui' }}>🔥</span><span style={{ font: '700 10.5px/1 system-ui', color: 'rgba(255,255,255,.7)' }}>여러명 겹침</span></div>
        </div>
      </div>

      {/* 토글 */}
      <DetailTabs floating active="map" onMap={() => {}} onList={() => replace('spaceList', { space, mine })} onLog={() => replace('spaceLog', { space, mine })} />

      {/* 폴라로이드 핀들 */}
      {PINS.map((pin, i) => {
        const isSel = selected === i;
        const dim = selected != null && !isSel;
        return (
          <div key={i} className="pm-tap" onClick={() => setSelected(i)}
            style={{ position: 'absolute', left: pin.left, top: pin.top, zIndex: isSel ? 19 : 16 - i, transform: `translate(-50%,-100%) scale(${isSel ? 1.08 : 1})`, transition: 'transform .25s', opacity: dim ? 0.55 : 1, filter: dim ? 'brightness(.7)' : 'none' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {pin.heat && isSel && <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,59,48,.28)', animation: 'pmPulse 2.2s ease-out infinite', zIndex: -1 }} />}
              <div style={{ width: pin.heat ? 18 : 14, height: pin.heat ? 18 : 14, borderRadius: '50%', background: pin.dot, border: '3px solid #fff', boxShadow: `0 3px 10px ${pin.dot}88`, zIndex: 4 }} />
              <div style={{ width: 3, height: 9, background: 'rgba(60,30,20,.65)', borderRadius: 1, marginTop: -1, zIndex: 3 }} />
              {dim ? (
                // 선택 안 됨 → 핀 아이콘만 (사진 사라짐)
                <div style={{ width: 0, height: 0 }} />
              ) : (
                <div style={{ position: 'relative', background: '#fff', padding: '5px 5px 0', borderRadius: 3, transform: `rotate(${pin.rot}deg)`, boxShadow: '0 10px 28px rgba(0,0,0,.6)', marginTop: -2 }}>
                  <div style={{ width: pin.size, height: pin.size, borderRadius: 1, background: pin.thumb }} />
                  <div style={{ padding: '5px 3px 9px', font: "700 10.5px/1.2 'Caveat',cursive", color: '#333', textAlign: 'center' }}>{pin.cap}</div>
                  <div style={{ position: 'absolute', top: -9, right: -9, background: '#2997ff', border: '2.5px solid #fff', borderRadius: 9999, padding: '2px 7px', zIndex: 5, transform: `rotate(${-pin.rot}deg)` }}><span style={{ font: '800 12px/1 system-ui', color: '#fff' }}>{pin.badge}</span></div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 사진 없는 단일 핀 */}
      {DOTS.map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: d.left, top: d.top, zIndex: 12, transform: 'translate(-50%,-100%)', opacity: selected != null ? 0.5 : 1, transition: 'opacity .3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: d.size, height: d.size, borderRadius: '50%', background: d.color, border: '3px solid #fff', boxShadow: `0 4px 12px ${d.color}88` }} />
            <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `10px solid ${d.color}`, marginTop: -3 }} />
          </div>
        </div>
      ))}

      {/* 하단 상세 카드 */}
      {sel && (
        <div className="pm-up" key={selected} style={{ position: 'absolute', left: 12, right: 12, bottom: 34, zIndex: 25, background: '#18181B', borderRadius: 26, padding: 15, boxShadow: '0 16px 44px rgba(0,0,0,.55)' }}>
          <div className="pm-tap" onClick={() => go('placeDetail', { place: sel, space })} style={{ display: 'flex', gap: 13 }}>
            <div style={{ position: 'relative', width: 78, height: 78, borderRadius: 18, flexShrink: 0, background: sel.thumb }}>
              <div style={{ position: 'absolute', left: -4, top: -6, background: '#2997ff', border: '2px solid #18181B', borderRadius: 9999, padding: '3px 8px' }}><span style={{ font: '800 11px/1 system-ui', color: '#fff' }}>{sel.count}명</span></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ font: '800 18px/1.1 system-ui', letterSpacing: '-.4px', color: '#fff' }}>{sel.name}</span>
                <span style={{ font: '700 14px/1 system-ui', color: '#fff' }}>⭐ {sel.rating}</span>
              </div>
              <div style={{ marginTop: 5, font: '500 12.5px/1.2 system-ui', color: '#6a6a70' }}>{sel.addr}</div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, background: '#0D0D0F', borderRadius: 12, padding: '7px 10px', width: 'fit-content' }}>
                <span style={{ font: "700 13px/1 'Caveat',cursive", color: '#fff' }}>"{sel.review}"</span>
                <span style={{ font: '700 11px/1 system-ui', color: '#6a6a70' }}>– {sel.reviewer}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 9 }}>
            <div className="pm-tap" onClick={() => showToast(`${sel.count}명이 이 장소를 저장했어요`)} style={{ flex: 1, textAlign: 'center', background: '#0D0D0F', borderRadius: 12, padding: '10px 0', font: '800 13px/1 system-ui', color: '#fff' }}>{sel.count}명 저장</div>
            <div className="pm-tap" onClick={() => go('placeDetail', { place: sel, space })} style={{ flex: 1, textAlign: 'center', background: '#2997ff', borderRadius: 12, padding: '10px 0', font: '800 13px/1 system-ui', color: '#fff' }}>자세히 보기</div>
          </div>
        </div>
      )}
      {manage && <MemberManageModal space={space} onClose={() => setManage(false)} />}
      <HomeIndicator />
    </div>
  );
}
