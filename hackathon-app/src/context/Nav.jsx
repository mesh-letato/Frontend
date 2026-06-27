import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialSpaces, mySpace } from '../data/mock';

const NavCtx = createContext(null);
export const useNav = () => useContext(NavCtx);

let uid = 100;
export const nextId = () => ++uid;

// PWA 공유 진입 감지: 인스타에서 릴스 공유 시 manifest share_target 이 /?share=... 로 연다
function initialStack() {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search);
    if (q.has('share') || q.has('url') || q.has('text')) {
      const url = q.get('url') || q.get('text') || 'instagram.com/reel/Cx8q…seongsu';
      return [
        { name: 'spaces', params: {} },
        { name: 'linkAnalyzing', params: { url, target: 'spaces' } },
      ];
    }
  }
  return [{ name: 'splash', params: {} }];
}

export function NavProvider({ children }) {
  // 화면 스택: { name, params }
  const [stack, setStack] = useState(initialStack);
  const [anim, setAnim] = useState('pm-fade');

  // 앱 전역 데이터 (API 대신 로컬 상태)
  const [spaces, setSpaces] = useState(initialSpaces);
  const [myPlaces, setMyPlaces] = useState(mySpace.places);
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

  // 새 스페이스 추가
  const addSpace = useCallback((space) => {
    setSpaces((s) => [...s, space]);
  }, []);

  // 내 스페이스에 장소 저장
  const saveToMySpace = useCallback((place) => {
    setMyPlaces((p) => [place, ...p]);
  }, []);

  const current = stack[stack.length - 1];

  const value = useMemo(
    () => ({
      current, stack, anim,
      go, replace, back, reset,
      spaces, addSpace,
      myPlaces, saveToMySpace,
      toast, showToast,
    }),
    [current, stack, anim, go, replace, back, reset, spaces, addSpace, myPlaces, saveToMySpace, toast, showToast]
  );

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}
