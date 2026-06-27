// 공통 API 클라이언트
// - 토큰 저장/주입, JSON 처리, 에러 정규화, access 토큰 만료 시 자동 refresh 후 1회 재시도
//
// 개발 환경에서는 VITE_API_BASE 가 비어 있어 same-origin('') 으로 호출하고,
// vite dev 프록시가 /api → 게이트웨이(:8080) 로 포워딩한다.
// 배포 시에는 VITE_API_BASE 에 게이트웨이 주소를 지정한다.

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const ACCESS_KEY = 'pinmoa.accessToken';
const REFRESH_KEY = 'pinmoa.refreshToken';
const USER_KEY = 'pinmoa.user';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: ({ accessToken, refreshToken, user }) => {
    if (accessToken !== undefined) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken !== undefined && refreshToken !== null) localStorage.setItem(REFRESH_KEY, refreshToken);
    if (user !== undefined) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setAccess: (accessToken) => localStorage.setItem(ACCESS_KEY, accessToken),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function rawRequest(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  let payload = body;

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = tokenStore.getAccess();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
  });

  return res;
}

// access 토큰으로 refresh 시도. 성공하면 새 access 토큰 저장 후 true.
let refreshPromise = null;
async function tryRefresh() {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  // 동시 401 들이 각각 refresh 하지 않도록 단일 프라미스 공유
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await rawRequest('/api/core/users/refresh', {
          method: 'POST',
          body: { refreshToken },
          auth: false,
        });
        if (!res.ok) return false;
        const data = await parseBody(res);
        if (data?.accessToken) {
          tokenStore.setAccess(data.accessToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function request(path, options = {}) {
  let res = await rawRequest(path, options);

  // access 토큰 만료(401) → refresh 후 1회 재시도
  if (res.status === 401 && options.auth !== false && tokenStore.getRefresh()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawRequest(path, options);
    }
  }

  if (res.status === 204) return null;

  const data = await parseBody(res);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `요청에 실패했어요 (${res.status})`;
    const code = data && data.code;
    throw new ApiError(message, { status: res.status, code });
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
