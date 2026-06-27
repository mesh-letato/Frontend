import { api } from './client';

// 카카오맵 장소 검색 (서버 경유)
// → [{ kakaoPlaceId, name, category, address, latitude, longitude }]
export function searchPlaces(query) {
  return api.get(`/api/core/places/search?query=${encodeURIComponent(query)}`);
}

// 장소 저장 (스페이스에 담기)
// req: { kakaoPlaceId, name, category, address, latitude, longitude, thumbnailUrl?, spaceIds: [] }
// → PlaceResponse { id, kakaoPlaceId, name, category, address, latitude, longitude, thumbnailUrl, createdAt }
export function savePlace(place) {
  return api.post('/api/core/places', place);
}

export function getPlace(placeId) {
  return api.get(`/api/core/places/${placeId}`);
}

// 장소 저장자 → { savedCount, savers: [{ userId, nickname, profileImageUrl }] }
export function getPlaceSavers(placeId) {
  return api.get(`/api/core/places/${placeId}/savers`);
}

export function getPlacesBySpace(spaceId) {
  return api.get(`/api/core/places?spaceId=${spaceId}`);
}

export function removePlaceFromSpace(placeId, spaceId) {
  return api.del(`/api/core/places/${placeId}/spaces/${spaceId}`);
}
