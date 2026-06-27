import { useEffect, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator, Avatar } from '../components/Chrome';
import { reviewsApi, placesApi } from '../api';
import { memberColor, memberInitial, toAvatar } from '../utils/member';

const REVIEW_GRADS = [
  'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)',
  'radial-gradient(circle at 40% 30%,#d8e8c8,transparent),linear-gradient(150deg,#8aaa6a,#3e5a2e)',
  'radial-gradient(circle at 40% 30%,#c9b6e8,transparent),linear-gradient(150deg,#6b5b95,#2b2a4a)',
];
const HERO_FALLBACK = 'radial-gradient(circle at 35% 28%,#ffd9a8,transparent 55%),linear-gradient(150deg,#f0a868,#9a3a2e)';

const shortCat = (c) => (c ? c.split(' > ').pop() : '장소');
const isImg = (url) => typeof url === 'string' && /^https?:|^data:/.test(url);

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

export default function PlaceDetail({ place: placeProp, space }) {
  const { back, go, showToast, mySpace } = useNav();
  // 네비게이션으로 받은 값으로 초기 렌더 → API 로 권위 있는 상세를 덮어쓴다.
  const [detail, setDetail] = useState(placeProp || null);
  const [reviews, setReviews] = useState([]);
  const [savers, setSavers] = useState(null);
  const [saving, setSaving] = useState(false);

  const placeId = placeProp?.id;

  useEffect(() => {
    let cancelled = false;
    if (!placeId) return;
    placesApi.getPlace(placeId)
      .then((data) => { if (!cancelled) setDetail((prev) => ({ ...prev, ...data })); })
      .catch((e) => console.error('장소 상세 로드 실패', e));
    reviewsApi.getReviewsByPlace(placeId)
      .then((data) => { if (!cancelled) setReviews(data); })
      .catch((e) => console.error('후기 로드 실패', e));
    placesApi.getPlaceSavers(placeId)
      .then((data) => { if (!cancelled) setSavers(data); })
      .catch((e) => console.error('저장자 로드 실패', e));
    return () => { cancelled = true; };
  }, [placeId]);

  const saverList = savers?.savers || [];
  const savedCount = savers?.savedCount ?? 0;

  // 표시값 (API 우선, 없으면 prop 폴백)
  const name = detail?.name || '장소';
  const category = shortCat(detail?.category);
  const address = detail?.address || detail?.addr || '';
  const heroBg = isImg(detail?.thumbnailUrl) ? `center/cover url(${detail.thumbnailUrl})` : (detail?.thumb || HERO_FALLBACK);
  const kakaoId = detail?.kakaoPlaceId;

  const openKakao = () => {
    if (!kakaoId) { showToast('카카오맵 정보가 없어요'); return; }
    window.open(`https://place.map.kakao.com/${kakaoId}`, '_blank');
  };

  const saveToMine = async () => {
    if (saving) return;
    if (!mySpace) { showToast('내 스페이스를 찾지 못했어요'); return; }
    if (!detail?.kakaoPlaceId || detail.latitude == null || detail.longitude == null) {
      showToast('저장에 필요한 정보가 부족해요');
      return;
    }
    setSaving(true);
    try {
      await placesApi.savePlace({
        kakaoPlaceId: String(detail.kakaoPlaceId),
        name: detail.name,
        category: detail.category || null,
        address: detail.address || null,
        latitude: Number(detail.latitude),
        longitude: Number(detail.longitude),
        thumbnailUrl: detail.thumbnailUrl || null,
        spaceIds: [mySpace.id],
      });
      showToast('내 스페이스에 저장했어요 📍');
    } catch (e) {
      // 중복 저장 등은 안내만
      showToast(e.message || '저장에 실패했어요');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', overflow: 'hidden' }}>
      {/* hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, background: heroBg }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 280, background: 'linear-gradient(180deg,rgba(13,13,15,.15),rgba(13,13,15,.05) 40%,#0D0D0F)' }} />

      <Notch />
      <StatusBar />
      <div className="pm-tap" onClick={back} style={{ position: 'absolute', top: 14, left: 18, zIndex: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="10" height="17" viewBox="0 0 9 16"><path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>

      <div className="pm-scroll" style={{ position: 'absolute', top: 178, left: 0, right: 0, bottom: 0 }}>
        {/* 기본 정보 */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '800 26px/1.1 Pinmoa, system-ui', letterSpacing: '-.7px', color: '#fff' }}>{name}</div>
              <div style={{ marginTop: 8, font: '500 13px/1 Pinmoa, system-ui', color: '#6a6a70' }}>{category}</div>
            </div>
            <div className="pm-tap" onClick={saveToMine} style={{ width: 46, height: 46, borderRadius: '50%', background: '#2997ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(41,151,255,.4)', flexShrink: 0, opacity: saving ? 0.6 : 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.5-7-11a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 19 10c0 5.5-7 11-7 11Z" fill="#fff" /></svg>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pm-tap" onClick={() => showToast(savedCount ? `${savedCount}명이 저장: ${saverList.map((s) => s.nickname).slice(0, 3).join(', ')}` : '아직 저장한 사람이 없어요')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#18181B', borderRadius: 13, padding: '9px 12px' }}>
              {saverList.length > 0 && (
                <div style={{ display: 'flex' }}>{saverList.slice(0, 3).map((s, i) => <Avatar key={s.userId} m={toAvatar(s)} size={22} border="#18181B" ml={i === 0 ? 0 : -7} />)}</div>
              )}
              <span style={{ font: '700 12px/1 Pinmoa, system-ui', color: '#fff' }}>{savedCount}명 저장</span>
            </div>
          </div>

          {address && (
            <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ font: '600 13px/1 Pinmoa, system-ui' }}>📍</span><span style={{ font: '500 13px/1.3 Pinmoa, system-ui', color: 'rgba(255,255,255,.7)' }}>{address}</span></div>
          )}

          {/* 카카오맵에서 보기 */}
          <div className="pm-tap" onClick={openKakao} style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#18181B', borderRadius: 14, padding: '13px 0' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="#2997ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ font: '700 14px/1 Pinmoa, system-ui', color: '#fff' }}>카카오맵에서 보기</span>
          </div>
        </div>

        <div style={{ margin: '22px 20px 0', height: '.5px', background: 'rgba(255,255,255,.08)' }} />

        {/* 친구들 후기 */}
        <div style={{ marginTop: 18, padding: '0 20px', font: '800 18px/1 Pinmoa, system-ui', letterSpacing: '-.4px', color: '#fff' }}>친구들 후기 {reviews.length > 0 && <span style={{ color: '#2997ff' }}>{reviews.length}</span>}</div>
        <div style={{ marginTop: 13, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {reviews.length === 0 ? (
            <div style={{ background: '#18181B', borderRadius: 18, padding: '20px 16px', textAlign: 'center', font: '500 13px/1.5 Pinmoa, system-ui', color: '#6a6a70' }}>
              아직 후기가 없어요. 첫 후기를 남겨보세요 📸
            </div>
          ) : (
            reviews.map((r, i) => {
              const thumbStyle = isImg(r.imageUrl)
                ? { background: `center/cover url(${r.imageUrl})` }
                : { background: REVIEW_GRADS[i % REVIEW_GRADS.length] };
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#18181B', borderRadius: 18, padding: '11px 13px' }}>
                  <div style={{ width: 54, height: 54, flexShrink: 0, borderRadius: '50%', padding: 2.5, background: 'conic-gradient(from 210deg,#f0a868,#d76a8a,#a83a5a,#f0a868)' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2.5px solid #18181B', background: memberColor(r.userId), display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 13px/1 Pinmoa, system-ui', color: '#fff' }}>{memberInitial(r.nickname)}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ font: '700 14px/1 Pinmoa, system-ui', color: '#fff' }}>{r.nickname || '회원'}</span><span style={{ font: '600 10.5px/1 Pinmoa, system-ui', color: '#6a6a70' }}>{timeAgo(r.createdAt)}</span></div>
                    <div style={{ marginTop: 5, font: "700 18px/1.05 Pinmoa, system-ui", color: '#fff' }}>{r.content}</div>
                  </div>
                  <div style={{ width: 50, height: 64, borderRadius: 11, flexShrink: 0, ...thumbStyle }} />
                </div>
              );
            })
          )}
        </div>
        <div style={{ height: 110 }} />
      </div>

      {/* 후기 올리기 CTA */}
      <div className="pm-tap" onClick={() => go('writeReview', { place: detail, space })} style={{ position: 'absolute', left: 20, right: 20, bottom: 26, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#fff', borderRadius: 18, padding: 16, boxShadow: '0 12px 30px rgba(0,0,0,.5)' }}>
        <span style={{ font: '700 17px/1 Pinmoa, system-ui' }}>📸</span><span style={{ font: '800 16px/1 Pinmoa, system-ui', color: '#0D0D0F' }}>다녀왔어요, 후기 올리기</span>
      </div>
      <HomeIndicator />
    </div>
  );
}
