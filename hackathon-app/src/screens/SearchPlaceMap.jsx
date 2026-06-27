import { useEffect, useMemo, useRef, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { loadKakaoMapSdk } from '../utils/kakaoMap';
import { MY_SPACE, nextId, grad } from '../data/mock';

const DEFAULT_QUERY = '미오 성수';

export default function SearchPlaceMap({ initialQuery = DEFAULT_QUERY }) {
  const { back, reset, go, saveToMySpace, showToast } = useNav();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      if (!mapRef.current) return;
      try {
        const kakaoMaps = await loadKakaoMapSdk();
        if (cancelled || !mapRef.current) return;

        kakaoMaps.load(() => {
          const map = new kakaoMaps.Map(mapRef.current, {
            center: new kakaoMaps.LatLng(37.5445, 127.0558),
            level: 4,
          });
          mapInstanceRef.current = map;
          searchPlaces(initialQuery, map);
        });
      } catch (err) {
        console.error(err);
        setError('카카오맵 SDK를 불러오지 못했습니다. 환경 변수 설정을 확인해주세요.');
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && initialQuery) {
      searchPlaces(initialQuery, mapInstanceRef.current);
    }
  }, [initialQuery]);

  const normalizeText = (value = '') => value.toLowerCase().replace(/[^가-힣a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const searchPlaces = (keyword, map = mapInstanceRef.current) => {
    const trimmed = keyword?.trim();
    if (!trimmed) return;
    if (!window.kakao?.maps?.services) {
      setError('카카오맵 서비스가 아직 준비되지 않았어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(trimmed, (data, status) => {
      setLoading(false);
      if (status !== window.kakao.maps.services.Status.OK) {
        setResults([]);
        setSelectedId(null);
        setError('검색 결과가 없어요. 다른 키워드로 다시 검색해보세요.');
        return;
      }

      const queryText = normalizeText(trimmed);
      const ranked = data
        .map((item) => {
          const name = normalizeText(item.place_name);
          const address = normalizeText(item.road_address_name || item.address_name);
          const category = normalizeText(item.category_name || '');
          let score = 0;
          if (name === queryText) score += 100;
          if (name.includes(queryText)) score += 80;
          queryText.split(' ').forEach((token) => {
            if (token && name.includes(token)) score += 20;
            if (token && address.includes(token)) score += 10;
            if (token && category.includes(token)) score += 8;
          });
          return { ...item, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          name: item.place_name,
          address: item.road_address_name || item.address_name,
          category: item.category_name || '장소',
          phone: item.phone || '',
          lat: Number(item.y),
          lng: Number(item.x),
        }));

      setResults(ranked);
      setSelectedId(ranked[0]?.id ?? null);

      if (!map || !ranked.length) return;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const bounds = new window.kakao.maps.LatLngBounds();
      ranked.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng);
        const marker = new window.kakao.maps.Marker({ map, position, title: place.name });
        window.kakao.maps.event.addListener(marker, 'click', () => setSelectedId(place.id));
        markersRef.current.push(marker);
        bounds.extend(position);
      });

      map.setBounds(bounds);
    });
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !results.length) return;
    const map = mapInstanceRef.current;
    const selected = results.find((item) => item.id === selectedId);
    if (!selected) return;
    const position = new window.kakao.maps.LatLng(selected.lat, selected.lng);
    map.panTo(position);
  }, [selectedId, results]);

  const selectedPlace = useMemo(() => results.find((item) => item.id === selectedId) || results[0] || null, [results, selectedId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPlaces(query, mapInstanceRef.current);
  };

  const handleSave = () => {
    if (!selectedPlace) return;
    saveToMySpace({
      id: nextId(),
      name: selectedPlace.name,
      cat: selectedPlace.category.split(' > ').pop() || '장소',
      area: selectedPlace.address.split(' ').slice(0, 2).join(' ') || selectedPlace.address,
      thumb: grad.pasta,
      isNew: true,
    });
    showToast('내 지도에 저장했어요 📍');
    reset('spaces');
    go('spaceList', { space: MY_SPACE, mine: true });
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0', zIndex: 20 }}>
        <BackBtn onClick={back} />
        <div style={{ font: '800 18px/1 system-ui', letterSpacing: '-.4px', color: '#fff' }}>장소 검색</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ position: 'relative', margin: '12px 16px 0', zIndex: 20 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, padding: '12px 14px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,.55)" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 미오 성수" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', font: '500 15px/1 system-ui', color: '#fff' }} />
          <button type="submit" style={{ background: '#2997ff', color: '#fff', border: 'none', borderRadius: 9999, padding: '8px 12px', font: '700 13px/1 system-ui' }}>{loading ? '검색중' : '검색'}</button>
        </form>
      </div>

      <div ref={mapRef} style={{ flex: 1, marginTop: 12, position: 'relative' }} />

      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 24, zIndex: 20 }}>
        <div style={{ background: 'rgba(24,24,27,.95)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: 14, boxShadow: '0 16px 44px rgba(0,0,0,.45)' }}>
          {error ? (
            <div style={{ font: '600 13px/1.4 system-ui', color: '#ff7a7a' }}>{error}</div>
          ) : selectedPlace ? (
            <>
              <div style={{ font: '800 17px/1.1 system-ui', color: '#fff', marginBottom: 4 }}>{selectedPlace.name}</div>
              <div style={{ font: '500 12.5px/1.4 system-ui', color: '#8d8d95', marginBottom: 8 }}>{selectedPlace.address}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {results.map((place) => (
                  <button key={place.id} type="button" onClick={() => setSelectedId(place.id)} style={{ background: selectedPlace.id === place.id ? '#2997ff' : 'rgba(255,255,255,.08)', color: '#fff', border: 'none', borderRadius: 9999, padding: '8px 10px', font: '700 12px/1 system-ui' }}>
                    {place.name}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <button type="button" onClick={handleSave} disabled={!selectedPlace} style={{ marginTop: 12, width: '100%', border: 'none', borderRadius: 16, padding: '13px 0', background: selectedPlace ? '#fff' : 'rgba(255,255,255,.15)', color: selectedPlace ? '#0D0D0F' : '#8d8d95', font: '800 15px/1 system-ui' }}>
            내 스페이스에 저장
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
