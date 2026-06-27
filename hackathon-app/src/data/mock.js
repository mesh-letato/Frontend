import { grad } from '../theme';

// 새로 추가되는 항목용 ID 생성기
let _uid = 1000;
export const nextId = () => ++_uid;

export { grad };

// 멤버(핀 색상)
export const members = {
  me: { name: '나', color: '#2997ff', initial: '나' },
  jiyoon: { name: '지윤', color: '#d76a8a', initial: '지윤' },
  doyoon: { name: '도윤', color: '#5e8a4e', initial: '도윤' },
  seoa: { name: '서아', color: '#6b5b95', initial: '서아' },
};

// 장소 (스페이스 상세 공용)
export const placesSeongsu = [
  {
    id: 1, name: '미오 성수', cat: '이탈리안', area: '연무장길', addr: '서울 성동구 연무장길 33 · 320m',
    thumb: grad.pasta, count: 5, savers: ['me', 'jiyoon', 'doyoon'], saverText: '나·지윤 외 3명 저장',
    review: '트러플 파스타 인생맛 🤤', reviewer: '지윤', rating: '4.8',
    reels: [
      { user: '@seongsu.foodie', views: '12.4만', g: 'radial-gradient(circle at 42% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)' },
      { user: '@daily.mukbang', views: '8.7만', g: 'radial-gradient(circle at 42% 30%,#ffd2c2,transparent),linear-gradient(150deg,#c8584a,#561d18)' },
    ],
    pinSize: 'big',
  },
  {
    id: 2, name: '센터커피 성수', cat: '카페', area: '성수이로', addr: '서울 성동구 성수이로 88 · 510m',
    thumb: grad.cafe, count: 3, savers: ['me', 'jiyoon'], saverText: '나·지윤 외 1명 저장',
    review: '분위기 짱 ✨', reviewer: '도윤', rating: '4.6', reels: [], pinSize: 'mid',
  },
  {
    id: 3, name: '소금집델리', cat: '샌드위치', area: '서울숲길', addr: '서울 성동구 서울숲길 17 · 240m',
    thumb: grad.pink, count: 2, savers: ['doyoon'], saverText: '도윤 외 1명 저장',
    review: '소금빵 최고 🥐', reviewer: '도윤', rating: '4.7', reels: [], pinSize: 'small',
  },
];

// 스페이스 로그 (최신 후기)
export const spaceLogs = [
  {
    id: 'l1', who: 'jiyoon', when: '방금', place: '미오 성수', area: '연무장길 33',
    photo: 'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)',
    caption: '트러플 파스타 인생맛 🤤', action: '다녀왔어요', wantBy: '나 외 1명 가고싶어해요',
    wantAvatars: ['me', 'doyoon'], rot: -2.5, live: true,
  },
  {
    id: 'l2', who: 'doyoon', when: '2시간 전', place: '센터커피 성수', area: '성수이로',
    photo: 'radial-gradient(circle at 40% 30%,#c9b6e8,transparent),linear-gradient(150deg,#6b5b95,#2b2a4a)',
    caption: '분위기 미쳤음 ✨', action: '다녀왔어요', wantBy: '지윤이 가고싶어해요',
    wantAvatars: ['jiyoon'], rot: 2,
  },
  {
    id: 'l3', who: 'seoa', when: '어제', place: '소금집델리', area: '서울숲길',
    photo: 'radial-gradient(circle at 40% 30%,#ffd0db,transparent),linear-gradient(150deg,#f3a9b9,#a83a5a)',
    caption: '소금빵 줄서서 먹음 🥐', action: '다녀왔어요', wantBy: '나 외 2명 가고싶어해요',
    wantAvatars: ['me', 'jiyoon', 'doyoon'], rot: -1.5,
  },
];

// 친구 후기(05 장소상세)
export const friendStories = [
  { who: 'seoa', when: '방금', text: '여기 오도록 🔥', g: 'radial-gradient(circle at 40% 30%,#ffe0bd,transparent),linear-gradient(150deg,#e89a5a,#7a2e22)' },
  { who: 'doyoon', when: '2시간 전', text: '분위기 미쳤음 ✨', g: 'radial-gradient(circle at 40% 30%,#d8e8c8,transparent),linear-gradient(150deg,#8aaa6a,#3e5a2e)' },
];

// 내 스페이스 (가입 시 자동 생성)
export const mySpace = {
  id: 0, name: '내 스페이스', isMine: true, count: 48,
  places: [
    { id: 11, name: '미오 성수', cat: '이탈리안', area: '성수동', thumb: grad.pasta, count: 5 },
    { id: 12, name: '센터커피 성수', cat: '카페', area: '성수이로', thumb: grad.cafe },
    { id: 13, name: '소금집델리', cat: '샌드위치', area: '서울숲길', thumb: grad.pink },
    { id: 14, name: '카멜로', cat: '카페', area: '성수동', thumb: grad.green },
  ],
};

// 내 지도 (하단 네비 좌측 버튼 → 타 스페이스 상세와 동일한 화면으로 진입)
export const MY_SPACE = { id: 0, name: '내 지도', mine: true, memberCount: 1 };

// 참가 중인 스페이스 목록 (01 화면)
export const initialSpaces = [
  {
    id: 1, name: '성수 맛집 🍝', emoji: '🍝', placeCount: 18, reviewCount: 7, memberCount: 5,
    overlap: 7, isNew: true, newText: '방금 지윤이 후기 올림', big: true, code: 'SEONGSU24',
    avatars: ['me', 'jiyoon', 'doyoon'], extra: 2,
    bg: 'radial-gradient(circle at 65% 30%,#5a3a2a,transparent 60%),linear-gradient(160deg,#3a2418,#0f0a06)',
    polaroid: { g: 'radial-gradient(circle at 35% 30%,#ffd9a8,transparent),linear-gradient(150deg,#f0a868,#9a3a2e)', cap: '미오 파스타 🤤' },
  },
  {
    id: 2, name: '여름 MT 🏖️', emoji: '🏖️', placeCount: 11, memberCount: 6, overlap: 3, code: 'SUMMER25',
    avatars: ['me'], extra: 3, gradAvatars: ['#f0a868', '#6b5b95'],
    bg: 'radial-gradient(circle at 30% 30%,#2e4a2a,transparent 60%),linear-gradient(160deg,#24351c,#0a0d07)',
  },
  {
    id: 3, name: '카페 투어 ☕', emoji: '☕', placeCount: 24, memberCount: 4, overlap: 5, code: 'CAFETOUR7',
    avatars: ['me', 'seoa'], extra: 2,
    bg: 'radial-gradient(circle at 40% 30%,#3a2e4a,transparent 60%),linear-gradient(160deg,#2a2238,#0c0a10)',
  },
];

// 장소 선택(09) 후보
export const placeCandidates = [
  { id: 'c1', name: '미오 성수', cat: '이탈리안', addr: '서울 성동구 연무장길 33 · 320m', best: true, g: grad.pasta },
  { id: 'c2', name: '미오 카페 (분점)', cat: '카페', addr: '성수동2가 · 1.1km', g: 'linear-gradient(140deg,#e9c9a0,#b98a5e)' },
  { id: 'c3', name: '미오리스토란테', cat: '이탈리안', addr: '한남동 · 4.8km', g: 'linear-gradient(140deg,#a8c98a,#5e8a4e)' },
];
