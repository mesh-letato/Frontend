import { useEffect, useState } from 'react';
import { useNav } from '../context/Nav';
import { Notch, StatusBar, BackBtn, HomeIndicator } from '../components/Chrome';
import { linksApi } from '../api';

export default function LinkAnalyzing({ url, target }) {
  const { back, replace, showToast } = useNav();
  const display = url || '링크 분석 중…';
  const [error, setError] = useState('');

  // 링크 추출 API 호출 (yt-dlp → LLM → 카카오). 완료되면 장소 선택 화면으로.
  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setError('분석할 링크가 없어요');
      return;
    }
    (async () => {
      try {
        const res = await linksApi.extractLink(url);
        if (cancelled) return;
        const candidates = res?.candidates || [];
        if (candidates.length === 0) {
          setError('영상에서 장소를 찾지 못했어요. 다른 링크로 시도해보세요.');
          return;
        }
        replace('placeSelect', { target, candidates, platform: res.platform });
      } catch (e) {
        if (cancelled) return;
        setError(e.message || '링크 분석에 실패했어요');
      }
    })();
    return () => { cancelled = true; };
  }, [url, target, replace]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b0b0d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
        <BackBtn onClick={back} />
        <div style={{ font: '700 16px/1 Pinmoa, system-ui', color: '#fff' }}>장소 가져오기</div>
        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* 링크 칩 */}
      <div style={{ margin: '22px 20px 0', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.13)', borderRadius: 16, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <div style={{ flex: 1, font: '500 13px/1.3 Pinmoa, system-ui', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{display}</div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158' }} />
      </div>

      {/* 분석 안내 (가짜 미리보기 대신 중립적인 일러스트) */}
      <div style={{ margin: '16px 20px 0', background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: 18, display: 'flex', gap: 13, alignItems: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: 'rgba(41,151,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#2997ff" strokeWidth="2" /><circle cx="12" cy="12" r="4.5" stroke="#2997ff" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.4" fill="#2997ff" /></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '700 14px/1.3 Pinmoa, system-ui', color: '#fff' }}>영상에서 장소를 찾는 중</div>
          <div style={{ marginTop: 6, font: '500 12.5px/1.45 Pinmoa, system-ui', color: 'rgba(255,255,255,.55)' }}>캡션·해시태그를 분석해 장소를 추출하고 있어요</div>
        </div>
      </div>

      {/* 로딩 */}
      <div style={{ margin: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!error && <div style={{ position: 'relative', width: 24, height: 24 }}><div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid rgba(41,151,255,.25)', borderTopColor: '#2997ff', animation: 'pmSpin .9s linear infinite' }} /></div>}
          <span style={{ font: '700 15px/1 Pinmoa, system-ui', color: error ? '#ff7a7a' : '#fff' }}>{error ? '분석 실패' : '장소를 불러오는 중'}</span>
        </div>
        <div style={{ marginTop: 10, font: '500 14px/1.4 Pinmoa, system-ui', color: 'rgba(255,255,255,.5)' }}>{error || 'AI가 영상을 분석하고 있어요. 최대 30초 정도 걸려요.'}</div>
        {error ? (
          <div className="pm-tap" onClick={back} style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 14, padding: 14 }}>
            <span style={{ font: '800 15px/1 Pinmoa, system-ui', color: '#0D0D0F' }}>돌아가기</span>
          </div>
        ) : (
          <div style={{ marginTop: 18, height: 6, borderRadius: 9999, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 9999, background: '#2997ff', animation: 'pmBar 2s ease forwards' }} /></div>
        )}
        <div style={{ marginTop: 24, background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={shimmer(52, 52)} />
          <div style={{ flex: 1 }}>
            <div style={shimmer('60%', 13)} />
            <div style={{ marginTop: 9, ...shimmer('85%', 11) }} />
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}

const shimmer = (w, h) => ({
  width: w, height: h, borderRadius: 8,
  background: 'linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.14),rgba(255,255,255,.06))',
  backgroundSize: '220px 100%', animation: 'pmShimmer 1.3s linear infinite',
});
