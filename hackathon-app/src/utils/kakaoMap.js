export function loadKakaoMapSdk() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao.maps);
      return;
    }

    const existing = document.querySelector('script[data-kakao-map-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.kakao.maps), { once: true });
      existing.addEventListener('error', () => reject(new Error('카카오맵 SDK 로드에 실패했습니다.')), { once: true });
      return;
    }

    const key = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!key) {
      reject(new Error('VITE_KAKAO_MAP_KEY가 설정되지 않았습니다. .env.local에 추가해주세요.'));
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.setAttribute('data-kakao-map-sdk', 'true');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
    script.onload = () => {
      if (window.kakao?.maps) {
        resolve(window.kakao.maps);
      } else {
        reject(new Error('카카오맵 SDK가 정상적으로 초기화되지 않았습니다.'));
      }
    };
    script.onerror = () => reject(new Error('카카오맵 SDK 로드에 실패했습니다.'));
    document.head.appendChild(script);
  });
}
