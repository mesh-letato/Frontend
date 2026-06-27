import { api } from './client';

// SpaceResponse: { id, ownerId, name, emoji, type, inviteCode, createdAt }
// type: 'MY' | 'SHARED'

export function listSpaces() {
  return api.get('/api/core/spaces');
}

export function getSpace(spaceId) {
  return api.get(`/api/core/spaces/${spaceId}`);
}

// 스페이스 멤버 목록 → [{ userId, nickname, profileImageUrl, role }]
export function getSpaceMembers(spaceId) {
  return api.get(`/api/core/spaces/${spaceId}/members`);
}

export function createSpace({ name, emoji, type = 'SHARED' }) {
  return api.post('/api/core/spaces', { name, emoji, type });
}

// 초대 코드로 스페이스 참여 → SpaceResponse
export function joinSpace(inviteCode) {
  return api.post(`/api/core/spaces/join?inviteCode=${encodeURIComponent(inviteCode)}`);
}

export function updateSpace(spaceId, { name, emoji }) {
  return api.patch(`/api/core/spaces/${spaceId}`, { name, emoji });
}

export function deleteSpace(spaceId) {
  return api.del(`/api/core/spaces/${spaceId}`);
}

// 백엔드에 "가입 시 내 스페이스 자동 생성"이 미구현이라,
// 클라이언트에서 MY 타입 스페이스가 없으면 생성해 보장한다.
export async function ensureMySpace() {
  const spaces = await listSpaces();
  const mine = spaces.find((s) => s.type === 'MY');
  if (mine) return mine;
  return createSpace({ name: '내 스페이스', emoji: '🗺️', type: 'MY' });
}
