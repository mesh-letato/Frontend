import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, spacesApi } from '../api';

const NavCtx = createContext(null);
export const useNav = () => useContext(NavCtx);

let uid = 100;
export const nextId = () => ++uid;

// PWA 공유 진입 감지: 인스타에서 릴스 공유 시 manifest share_target 이 /?share=... 로 연다
function initialStack() {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search);
    if (q.has('share') || q.has('url') || q.has('text')) {
      const url = q.get('url') || q.get('text') || '';
      // 로그인 상태면 분석 화면으로, 아니면 로그인 후 진행
      const authed = authApi.isAuthenticated();
      return [
        { name: authed ? 'spaces' : 'login', params: {} },
        ...(authed ? [{ name: 'linkAnalyzing', params: { url, target: 'spaces' } }] : []),
      ];
    }
  }
  return [{ name: 'splash', params: {} }];
}

export function NavProvider({ children }) {
  // 화면 스택: { name, params }
  const [stack, setStack] = useState(initialStack);
  const [anim, setAnim] = useState('pm-fade');

  // 인증 / 앱 전역 데이터
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [spaces, setSpaces] = useState([]); // SHARED 스페이스 목록 (스페이스 화면)
  const [mySpace, setMySpace] = useState(null); // MY 타입 스페이스
  const [spacesLoading, setSpacesLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const go = useCallback((name, params = {}, transition = 'pm-slide') => {
    setAnim(transition);
    setStack((s) => [...s, { name, params }]);
  }, []);

  const replace = useCallback((name, params = {}, transition = 'pm-fade') => {
    setAnim(transition);
    setStack((s) => [...s.slice(0, -1), { name, params }]);
  }, []);

  const back = useCallback(() => {
    setAnim('pm-fade');
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const reset = useCallback((name, params = {}) => {
    setAnim('pm-fade');
    setStack([{ name, params }]);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  // 스페이스 목록 + 내 스페이스 동기화
  const refreshSpaces = useCallback(async () => {
    if (!authApi.isAuthenticated()) return;
    setSpacesLoading(true);
    try {
      const all = await spacesApi.listSpaces();
      let mine = all.find((s) => s.type === 'MY');
      if (!mine) {
        // 백엔드 미구현: 내 스페이스가 없으면 생성
        mine = await spacesApi.ensureMySpace();
      }
      setMySpace(mine);
      setSpaces(all.filter((s) => s.type !== 'MY'));
    } catch (e) {
      console.error('스페이스 동기화 실패', e);
    } finally {
      setSpacesLoading(false);
    }
  }, []);

  // 로그인 직후 호출: 사용자 저장 + 내 스페이스 보장 + 스페이스 로드
  const onAuthenticated = useCallback(async () => {
    setUser(authApi.getCurrentUser());
    await refreshSpaces();
  }, [refreshSpaces]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setSpaces([]);
    setMySpace(null);
    reset('login');
  }, [reset]);

  // 인증된 상태로 앱이 시작되면 스페이스 미리 로드
  useEffect(() => {
    if (authApi.isAuthenticated()) refreshSpaces();
  }, [refreshSpaces]);

  const current = stack[stack.length - 1];

  const value = useMemo(
    () => ({
      current, stack, anim,
      go, replace, back, reset,
      user, setUser, onAuthenticated, logout,
      spaces, mySpace, spacesLoading, refreshSpaces,
      toast, showToast,
    }),
    [current, stack, anim, go, replace, back, reset, user, onAuthenticated, logout, spaces, mySpace, spacesLoading, refreshSpaces, toast, showToast]
  );

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}
