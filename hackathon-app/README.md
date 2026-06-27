# 핀모아 (Pinmoa) — 프론트 프로토타입

릴스로 발견한 장소를 친구들과 **한 지도에 모으는** 앱웹(PWA). 와이어프레임(`핀모아 v2.dc.html`, `01_스페이스탭_목록.html`)의 디자인을 그대로 유지한 React 프로토타입입니다. (API 미연동 · 로컬 상태로 화면 플로우만 구현)

## 실행 방법

> 이 VM은 glibc가 오래되어(2.23) Vite 8(rolldown 네이티브)이 동작하지 않아 **Vite 5**로 고정했습니다.
> 또한 VMware 공유폴더(hgfs)는 심볼릭 링크를 못 만들어 `node_modules/.bin`이 비므로 npm 스크립트가 vite를 직접 호출합니다.

```bash
cd frontend/hackathon-app

# 의존성 설치 (공유폴더라면 --no-bin-links 필수)
npm install --no-bin-links

npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```

휴대폰에서 PWA로 테스트하려면 같은 와이파이에서 `http://<PC-IP>:5173` 접속 (vite `server.host: true` 설정됨).

## 화면 구성 / 플로우

```
splash → login ⇄ signup → spaces(01)
                                │
   ┌────────────────────────────┼──────────────────────────────┐
 내 스페이스(07) ── 링크(08) ── 장소선택(09) ── 저장 → 07로
   │
 spaces(01) ── + ── 새 스페이스(02) / 참가코드 모달
   │        └ 프로필 드롭다운(내 지도·편집·계정)
   └ 스페이스 카드 → 상세 리스트(03) ⇄ 지도(04) ⇄ 로그(10)
                        04 핀 탭 → 하단카드 → 장소상세(05) → 후기쓰기(06)
                        10 로그 탭 → 친구 로그 상세(+1, 나무 핀보드)
```

- **온보딩**: `Splash` / `Login` / `Signup` (와프에 없던 화면 → 디자인 시스템에 맞춰 추가)
- **01 스페이스 탭**: `Spaces` — 내 스페이스 고정 + 참여 스페이스 카드, + 드롭다운(생성/참가코드), 프로필 드롭다운
- **PWA 공유 진입**: 인스타에서 릴스 공유 → `manifest.share_target` 이 `/?share=...` 로 열림 → 분석(08) → 장소선택(09) → **스페이스 선택(ShareImport)** 에서 핀 꽂기. 로컬 테스트는 `http://localhost:5173/?share=1`
- **02 스페이스 만들기**: 2단계(이름 → 초대코드 복사)
- **03/04/10 스페이스 상세**: 리스트 / 스티커핀 지도 / 로그 (상단·탭 고정, 목록만 스크롤)
- **05 장소 상세 / 06 후기 올리기**: 폴라로이드 업로드(이미지 or 랜덤 그라데이션), 한 줄 후기 20자 제한, 다녀왔어요/가고싶어요 구분
- **07/08/09 장소 가져오기**: 내 스페이스 목록 → 링크 분석(2초 자동 진행) → 후보 선택 → 저장

## 폴더 구조

```
src/
  main.jsx            진입점 + 서비스워커 등록
  App.jsx             화면 라우팅(스택 기반)
  theme.js            디자인 토큰(색/그라데이션)
  context/Nav.jsx     네비게이션 스택 + 전역 데이터 + PWA 공유 진입 감지
  data/mock.js        목 데이터
  components/          StatusBar·Notch·TabBar·SpaceHeader 등 공용 UI
  screens/            화면별 컴포넌트
public/
  manifest.webmanifest, sw.js, icon.svg   PWA 설정
```
