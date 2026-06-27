import { api, tokenStore } from './client';

// 회원가입: { email, password, nickname } → UserResponse { id, email, nickname, profileImageUrl }
export function signup({ email, password, nickname }) {
  return api.post('/api/core/users/signup', { email, password, nickname }, { auth: false });
}

// 로그인: { email, password } → { userId, email, nickname, accessToken, refreshToken }
export async function login({ email, password }) {
  const data = await api.post('/api/core/users/login', { email, password }, { auth: false });
  tokenStore.set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: { id: data.userId, email: data.email, nickname: data.nickname },
  });
  return data;
}

export function logout() {
  tokenStore.clear();
}

export function getCurrentUser() {
  return tokenStore.getUser();
}

export function isAuthenticated() {
  return Boolean(tokenStore.getAccess());
}

// 회원 조회
export function getUser(userId) {
  return api.get(`/api/core/users/${userId}`);
}
