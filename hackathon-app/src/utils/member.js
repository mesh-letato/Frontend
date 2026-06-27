// 백엔드 SpaceMemberResponse({ userId, nickname, profileImageUrl, role }) 를
// 화면 아바타 표시용으로 변환하는 헬퍼.

// 사람별 핀/아바타 색 (빨주노초파남보 계열)
const MEMBER_COLORS = ['#2997ff', '#d76a8a', '#5e8a4e', '#6b5b95', '#f0a868', '#34c759', '#af52de'];

export function memberColor(userId) {
  return MEMBER_COLORS[Math.abs(Number(userId) || 0) % MEMBER_COLORS.length];
}

// 닉네임 앞 1~2글자 (한글은 1글자, 영문은 2글자)
export function memberInitial(nickname = '') {
  const n = nickname.trim();
  if (!n) return '?';
  // 한글 등 멀티바이트면 1글자, 아스키면 최대 2글자
  return /^[\x00-\x7F]+$/.test(n) ? n.slice(0, 2) : n.slice(0, 1);
}

// Avatar 컴포넌트가 기대하는 { color, initial } 형태로 변환
export function toAvatar(member) {
  return {
    color: memberColor(member.userId),
    initial: memberInitial(member.nickname),
    name: member.nickname,
  };
}
