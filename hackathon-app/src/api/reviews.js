import { api } from './client';

// 후기 작성: { placeId, spaceId?, imageUrl, content }
// → ReviewResponse { id, userId, spaceId, placeId, imageUrl, content, expiresAt, createdAt }
export function createReview({ placeId, spaceId, imageUrl, content }) {
  return api.post('/api/core/reviews', { placeId, spaceId, imageUrl, content });
}

// 장소별 후기 목록(최신순)
export function getReviewsByPlace(placeId) {
  return api.get(`/api/core/reviews?placeId=${placeId}`);
}

// 스페이스별 후기 피드(최신순)
export function getReviewsBySpace(spaceId) {
  return api.get(`/api/core/reviews?spaceId=${spaceId}`);
}
