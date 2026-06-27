import { useRef, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { placesSeongsu } from '../data/mock';
import { reviewsApi } from '../api';

const GRADS = [
  'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)',
  'radial-gradient(circle at 40% 30%,#c9b6e8,transparent),linear-gradient(150deg,#6b5b95,#2b2a4a)',
  'radial-gradient(circle at 40% 30%,#ffd0db,transparent),linear-gradient(150deg,#f3a9b9,#a83a5a)',
  'radial-gradient(circle at 40% 30%,#d8e8c8,transparent),linear-gradient(150deg,#8aaa6a,#3e5a2e)',
];

// 사진 없이 컬러만 선택했을 때 사용할 대체 이미지 URL (imageUrl 은 필수값)
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/png?text=PinMoa';

export default function WriteReview({ place: placeProp, space }) {
  const { back, showToast } = useNav();
  const place = placeProp || placesSeongsu[0];
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null); // dataURL
  const [grad, setGrad] = useState(GRADS[0]);
  const [caption, setCaption] = useState('');
  const [mode, setMode] = useState('visited'); // visited | want
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };

  const randomGrad = () => {
    setPhoto(null);
    setGrad(GRADS[Math.floor(Math.random() * GRADS.length)]);
  };

  const submit = async () => {
    if (saving) return;
    // '가고싶어요'는 백엔드 미지원 → 로컬 토스트만
    if (mode !== 'visited') {
      showToast('가고싶어요에 추가했어요 💙');
      back();
      return;
    }
    if (!caption.trim()) {
      setError('한 줄 후기를 입력해주세요');
      return;
    }
    if (!place?.id) {
      setError('이 장소는 아직 저장되지 않아 후기를 올릴 수 없어요');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await reviewsApi.createReview({
        placeId: place.id,
        spaceId: space?.id,
        imageUrl: photo || PLACEHOLDER_IMAGE,
        content: caption.trim(),
      });
      showToast('후기를 올렸어요 📸');
      back();
    } catch (e) {
      setError(e.message || '후기 작성에 실패했어요');
    } finally {
      setSaving(false);
    }
  };

  const photoStyle = photo
    ? { backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: grad };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0D0F', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <span className="pm-tap" onClick={back} style={{ font: '700 15px/1 system-ui', color: '#6a6a70' }}>취소</span>
        <div style={{ font: '800 16px/1 system-ui', color: '#fff' }}>후기 올리기</div>
        <span className="pm-tap" onClick={submit} style={{ font: '800 15px/1 system-ui', color: '#2997ff' }}>올리기</span>
      </div>

      <div className="pm-scroll" style={{ flex: 1 }}>
        <div style={{ padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: '700 14px/1 system-ui' }}>📍</span>
          <span style={{ font: '700 15px/1 system-ui', color: '#fff' }}>{place.name}</span>
          <span style={{ font: '500 12px/1 system-ui', color: '#6a6a70' }}>· {place.cat}</span>
        </div>

        {/* 다녀왔어요 / 가고싶어요 토글 */}
        <div style={{ margin: '14px 20px 0', background: '#18181B', borderRadius: 13, padding: 4, display: 'flex' }}>
          {[['visited', '✅ 다녀왔어요'], ['want', '💙 가고싶어요']].map(([k, label]) => (
            <div key={k} className="pm-tap" onClick={() => setMode(k)} style={{ flex: 1, textAlign: 'center', borderRadius: 10, padding: '10px 0', background: mode === k ? '#2997ff' : 'transparent', font: `${mode === k ? 800 : 700} 13px/1 system-ui`, color: mode === k ? '#fff' : '#6a6a70' }}>{label}</div>
          ))}
        </div>

        {/* 폴라로이드 업로드 */}
        <div style={{ margin: '20px auto 0', width: 236, background: '#fff', padding: '11px 11px 0', borderRadius: 4, transform: 'rotate(-1.5deg)', boxShadow: '0 14px 32px rgba(0,0,0,.5)' }}>
          <div className="pm-tap" onClick={() => fileRef.current?.click()} style={{ position: 'relative', height: 224, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', ...photoStyle }}>
            {!photo && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.25)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L18 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12.5" r="3.4" stroke="#fff" strokeWidth="1.8" /></svg>
                </div>
                <span style={{ font: '800 12px/1 system-ui', color: '#fff' }}>사진 추가</span>
              </div>
            )}
          </div>
          <div style={{ padding: '12px 6px 16px' }}>
            <div style={{ font: "700 18px/1.15 'Caveat',cursive", color: caption ? '#333' : '#bbb' }}>{caption || '한 줄 후기를 적어줘…'}</div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />

        <div className="pm-tap" onClick={randomGrad} style={{ margin: '14px auto 0', width: 'fit-content', display: 'flex', alignItems: 'center', gap: 6, background: '#18181B', borderRadius: 9999, padding: '8px 14px' }}>
          <span style={{ font: '600 12px/1 system-ui', color: '#fff' }}>🎨 사진 없이 랜덤 컬러로</span>
        </div>

        {/* 한 줄 후기 입력 (최대 20자) */}
        <div style={{ margin: '20px 20px 0', background: '#18181B', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input value={caption} onChange={(e) => setCaption(e.target.value.slice(0, 20))} placeholder="한 줄 후기 (최대 20자)" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', font: "700 17px/1.2 'Caveat',cursive", color: '#fff' }} />
          <span style={{ font: '600 11px/1 system-ui', color: caption.length >= 20 ? '#ff3b30' : '#6a6a70' }}>{caption.length}/20</span>
        </div>
        <div style={{ height: 110 }} />
      </div>

      <div style={{ padding: '14px 20px 30px', background: 'linear-gradient(180deg,rgba(13,13,15,0),#0D0D0F 38%)' }}>
        {error && <div style={{ marginBottom: 10, font: '600 12.5px/1.4 system-ui', color: '#ff7a7a' }}>{error}</div>}
        <div className="pm-tap" onClick={submit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#2997ff', borderRadius: 18, padding: 17, boxShadow: '0 12px 28px rgba(41,151,255,.36)', opacity: saving ? 0.6 : 1 }}>
          <span style={{ font: '700 17px/1 system-ui' }}>{mode === 'visited' ? '📸' : '💙'}</span>
          <span style={{ font: '800 16px/1 system-ui', color: '#fff' }}>{saving ? '올리는 중…' : mode === 'visited' ? '후기 올리기' : '가고싶어요 추가'}</span>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
