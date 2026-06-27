import { api } from './client';

// SNS 링크에서 장소 후보 추출
// req: { url }
// → { platform, candidates: [{ kakaoPlaceId, name, category, address, roadAddress, latitude, longitude, placeUrl, phone }] }
export function extractLink(url) {
  return api.post('/api/link/links/extract', { url });
}
