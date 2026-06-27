import { useNav } from '../context/Nav';
import { Notch, StatusBar, HomeIndicator } from '../components/Chrome';
import { members, spaceLogs } from '../data/mock';

// 아카이브 전시 보드 팔레트
const BOARD = '#cdc8bd';                 // 타공 펀치보드(크라프트 톤)
const DOTS = 'radial-gradient(circle, rgba(70,60,45,.22) 1.5px, transparent 1.7px)';
const STRING = '#d4622e';                // 연결용 주황 실
const PAPER = '#f6f3ea';                 // 문서 카드
const INK = '#3a342b';                   // 본문 잉크

// 은색 바인더 집게 (카드 상단 고정)
function Clip({ left = '50%', rot = 0 }) {
  return (
    <div style={{ position: 'absolute', top: -13, left, transform: `translateX(-50%) rotate(${rot}deg)`, zIndex: 9, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.3))' }}>
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect x="6" y="7" width="20" height="16" rx="2.2" fill="#cfd2d6" stroke="#92969c" strokeWidth="1.1" />
        <rect x="8.5" y="9.5" width="15" height="11" rx="1.4" fill="#e9ebee" />
        <path d="M8 7 Q16 -3 24 7" fill="none" stroke="#aeb2b8" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M11 7 Q16 1 21 7" fill="none" stroke="#c8ccd1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 압정 (실 끝 고정점)
function Pin({ left, top, color = STRING }) {
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', zIndex: 12, width: 11, height: 11, borderRadius: '50%', background: color, boxShadow: '0 2px 3px rgba(0,0,0,.4), inset 0 1px 1px rgba(255,255,255,.6)' }} />
  );
}

export default function FriendLogDetail({ log: logProp }) {
  const { back } = useNav();
  const log = logProp || spaceLogs[0];
  const who = members[log.who];
  const detail = log.detail || '웨이팅 30분 했는데 그만한 가치 있었음. 트러플 향 미쳤고 면 익힘 완벽. 분위기도 좋아서 데이트 코스로 강추 🍝';
  const date = log.date || '4월 26';
  const code = 'MS-' + String(log.id || 'l1').toUpperCase().replace(/[^0-9A-Z]/g, '') + '-26';

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#1b1916', overflow: 'hidden' }}>
      <Notch />
      <StatusBar />

      {/* 상단 바 */}
      <div style={{ position: 'relative', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 6px' }}>
        <div className="pm-tap" onClick={back} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="9" height="16" viewBox="0 0 9 16"><path d="M8 1L1 8l7 7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span style={{ font: '800 13px/1 system-ui', letterSpacing: '2px', color: '#e8e2d4' }}>ARCHIVE — 친구의 기록</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* 금속 프레임 + 펀치보드 */}
      <div style={{ position: 'absolute', top: 92, left: 9, right: 9, bottom: 12, borderRadius: 10, border: '7px solid #a9adb2', boxShadow: 'inset 0 0 0 2px #c9ccd0, inset 0 0 0 3px #84888d, 0 16px 36px rgba(0,0,0,.55)', overflow: 'hidden' }}>
        <div className="pm-scroll" style={{ position: 'absolute', inset: 0, background: BOARD, backgroundImage: DOTS, backgroundSize: '18px 18px' }}>

          {/* 전시 콘텐츠 보드 (고정 높이 → 스크롤) */}
          <div style={{ position: 'relative', width: '100%', height: 792 }}>

            {/* ── 주황 실(타임라인 연결선) ── */}
            <svg viewBox="0 0 100 792" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: 792, zIndex: 3, pointerEvents: 'none' }}>
              <path d="M24 150 C 45 110, 64 92, 80 84" fill="none" stroke={STRING} strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".85" />
              <path d="M80 104 C 70 210, 56 300, 47 352" fill="none" stroke={STRING} strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".85" />
              <path d="M30 360 C 22 345, 17 336, 14 320" fill="none" stroke={STRING} strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".85" />
              <path d="M60 452 C 70 520, 74 575, 76 612" fill="none" stroke={STRING} strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".85" />
              <path d="M30 470 C 22 540, 18 580, 16 612" fill="none" stroke={STRING} strokeWidth="1.6" vectorEffect="non-scaling-stroke" opacity=".85" />
            </svg>
            <Pin left="24%" top={150} /><Pin left="80%" top={84} />
            <Pin left="47%" top={352} /><Pin left="14%" top={320} />
            <Pin left="76%" top={612} /><Pin left="16%" top={612} />

            {/* ── ① 헤더 문서 카드 ── */}
            <div style={{ position: 'absolute', left: '3%', top: 26, width: 198, transform: 'rotate(-1.2deg)', zIndex: 5 }}>
              <Clip left="32%" rot={-4} />
              <div style={{ background: PAPER, borderRadius: 3, padding: '16px 15px 14px', boxShadow: '0 8px 20px rgba(0,0,0,.28)', borderTop: '1px solid #fff' }}>
                <div style={{ font: '700 8px/1.2 system-ui', letterSpacing: '1.5px', color: '#9a8f7a', textTransform: 'uppercase' }}>Department of</div>
                <div style={{ font: '700 8px/1.2 system-ui', letterSpacing: '1.5px', color: '#9a8f7a', textTransform: 'uppercase', marginBottom: 8 }}>Memory Archives</div>
                <div style={{ font: '900 21px/1.05 system-ui', letterSpacing: '-.6px', color: '#2a251d' }}>{log.place}</div>
                {/* 분류 폼 테이블 */}
                <div style={{ marginTop: 11, border: '1px solid #cabfa6', borderRadius: 2 }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #cabfa6' }}>
                    <div style={{ flex: '0 0 46px', padding: '4px 6px', font: '700 6.5px/1.4 system-ui', letterSpacing: '.5px', color: '#a99c82', borderRight: '1px solid #cabfa6', textTransform: 'uppercase' }}>분류</div>
                    <div style={{ padding: '4px 6px', font: '800 10px/1.2 system-ui', color: '#5a4a30' }}>이탈리안 · {log.area}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: '0 0 46px', padding: '4px 6px', font: '700 6.5px/1.4 system-ui', letterSpacing: '.5px', color: '#a99c82', borderRight: '1px solid #cabfa6', textTransform: 'uppercase' }}>코드</div>
                    <div style={{ padding: '4px 6px', font: "700 10px/1.2 'Caveat',cursive", color: '#5a4a30', letterSpacing: '.5px' }}>{code}</div>
                  </div>
                </div>
                <div style={{ marginTop: 9, font: '500 8.5px/1.55 system-ui', color: '#7c715c' }}>
                  성수 연무장길에 보존된 기록. 친구가 다녀온 장소와 그날의 감상을 아카이브로 남깁니다.
                </div>
                {/* 빨강 보존 스탬프 */}
                <div style={{ position: 'absolute', right: 10, bottom: 12, transform: 'rotate(-9deg)', border: '1.5px dashed #c0432e', borderRadius: 4, padding: '3px 7px', opacity: .82 }}>
                  <div style={{ font: '900 8px/1.1 system-ui', letterSpacing: '.5px', color: '#c0432e', textAlign: 'center' }}>기록 보존</div>
                  <div style={{ font: '700 7px/1.1 system-ui', color: '#c0432e', textAlign: 'center' }}>{date}</div>
                </div>
              </div>
            </div>

            {/* ── ② 메인 사진 (폴라로이드) ── */}
            <div style={{ position: 'absolute', right: '4%', top: 32, width: 134, transform: `rotate(${(log.rot || -2) + 5}deg)`, zIndex: 6 }}>
              <Clip left="50%" rot={6} />
              <div style={{ background: '#fff', padding: '7px 7px 0', borderRadius: 2, boxShadow: '0 10px 22px rgba(0,0,0,.3)' }}>
                <div style={{ height: 132, borderRadius: 1, background: log.photo }} />
                <div style={{ padding: '7px 2px 9px', font: "700 16px/1.05 'Caveat',cursive", color: '#4a3a28', textAlign: 'center' }}>{log.caption}</div>
              </div>
            </div>

            {/* ── ③ 날짜 라벨 박스 ── */}
            <div style={{ position: 'absolute', left: '5%', top: 296, transform: 'rotate(-4deg)', zIndex: 7, background: '#fbf8f0', border: '1px solid #d8cdb4', borderRadius: 2, padding: '7px 13px', boxShadow: '0 5px 12px rgba(0,0,0,.2)' }}>
              <div style={{ font: '900 19px/1 system-ui', letterSpacing: '.5px', color: '#2f2a22' }}>{date}</div>
              <div style={{ font: '700 7px/1.2 system-ui', letterSpacing: '1px', color: '#a0937a', marginTop: 2 }}>RECORDED</div>
            </div>

            {/* ── ④ 증거 스와치(작은 사진) ── */}
            <div style={{ position: 'absolute', right: '8%', top: 300, width: 88, transform: 'rotate(-8deg)', zIndex: 6 }}>
              <Clip left="50%" rot={-6} />
              <div style={{ background: '#fff', padding: 5, borderRadius: 2, boxShadow: '0 7px 16px rgba(0,0,0,.26)' }}>
                <div style={{ height: 64, borderRadius: 1, background: log.photo, filter: 'saturate(.85) contrast(1.05)' }} />
              </div>
            </div>

            {/* ── ⑤ 노란 포스트잇 (감상 메모) ── */}
            <div style={{ position: 'absolute', left: '23%', top: 360, width: 212, transform: 'rotate(-2deg)', zIndex: 8 }}>
              <div style={{ position: 'relative', background: 'linear-gradient(165deg,#fff2a8,#ffe873)', padding: '14px 15px 18px', boxShadow: '0 9px 20px rgba(0,0,0,.22)' }}>
                {/* 접힌 모서리 */}
                <div style={{ position: 'absolute', right: 0, bottom: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 0 18px 18px', borderColor: 'transparent transparent rgba(0,0,0,.12) transparent' }} />
                <div style={{ font: '800 7.5px/1 system-ui', letterSpacing: '1.5px', color: '#a8902e', textTransform: 'uppercase' }}>Field Note</div>
                <div style={{ marginTop: 8, font: "700 16px/1.5 'Caveat',cursive", color: '#5a4818' }}>{detail}</div>
              </div>
            </div>

            {/* ── ⑥ 기록자 인덱스 카드 ── */}
            <div style={{ position: 'absolute', left: '6%', top: 558, transform: 'rotate(2.5deg)', zIndex: 7 }}>
              <Clip left="22%" rot={3} />
              <div style={{ background: PAPER, borderRadius: 3, padding: '10px 13px', boxShadow: '0 7px 16px rgba(0,0,0,.24)', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: who.color, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 10px/1 system-ui', color: '#fff', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,.2)' }}>{who.initial}</div>
                <div>
                  <div style={{ font: '700 6.5px/1.2 system-ui', letterSpacing: '1px', color: '#a99c82', textTransform: 'uppercase' }}>기록자 · {log.when} {log.action}</div>
                  <div style={{ font: '900 14px/1.15 system-ui', color: '#2f2a22', marginTop: 2 }}>{who.name}</div>
                </div>
              </div>
            </div>

            {/* ── ⑦ "가고싶어요" 고무 스탬프 + 아바타 ── */}
            <div style={{ position: 'absolute', right: '5%', top: 596, transform: 'rotate(-6deg)', zIndex: 8, textAlign: 'center' }}>
              <div style={{ border: '2.5px solid #c0432e', borderRadius: 7, padding: '6px 12px', opacity: .9 }}>
                <div style={{ font: '900 13px/1 system-ui', letterSpacing: '1px', color: '#c0432e' }}>GO LIST ★</div>
                <div style={{ font: '800 8px/1.2 system-ui', letterSpacing: '.5px', color: '#c0432e', marginTop: 3 }}>가고싶어요</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 7 }}>
                {(log.wantAvatars || ['me', 'doyoon']).map((k, i) => (
                  <div key={k} style={{ width: 21, height: 21, borderRadius: '50%', background: members[k].color, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -7, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 8px/1 system-ui', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }}>{members[k].initial?.[0] || ''}</div>
                ))}
              </div>
              <div style={{ marginTop: 5, font: "700 13px/1.1 'Caveat',cursive", color: '#5a4a35' }}>{log.wantBy}</div>
            </div>

            {/* ── 장식: 작은 위치 태그 / 핀 ── */}
            <div style={{ position: 'absolute', left: '57%', top: 244, transform: 'rotate(7deg)', zIndex: 7, background: '#fff2a8', padding: '5px 9px', font: "700 13px/1.1 'Caveat',cursive", color: '#7a6420', boxShadow: '0 4px 10px rgba(0,0,0,.18)' }}>
              📍 {log.area}
            </div>
            <div style={{ position: 'absolute', left: '8%', top: 690, transform: 'rotate(-3deg)', zIndex: 7, border: '1px solid #cabfa6', background: '#fbf8f0', padding: '4px 9px', font: '800 8px/1.2 system-ui', letterSpacing: '1px', color: '#8a7d64' }}>
              MESH FIELD ARCHIVE · No.{String(log.id || 'l1').replace(/\D/g, '') || '1'}
            </div>

          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
