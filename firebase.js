import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getFirestore,
  doc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

export const firebaseConfig = {
  apiKey: "AIzaSyAuGSghmDO-daKTpBArSyB9jfKBOSAAc48",
  authDomain: "junokd02.firebaseapp.com",
  projectId: "junokd02",
  storageBucket: "junokd02.firebasestorage.app",
  messagingSenderId: "876136442795",
  appId: "1:876136442795:web:a5bbb63bc9587769b780ee",
  measurementId: "G-E24C2CYS4M"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  doc,
  onSnapshot,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};

// ============================================================
// JUNO 방문자 통계
// - 같은 브라우저는 localStorage의 익명 ID로 구분합니다.
// - 오늘 방문자는 같은 브라우저를 하루 1명으로 계산합니다.
// - 최근 7일 방문자는 최근 7일 내 접속한 고유 브라우저 수입니다.
// - 총 방문자는 이 기능 설치 이후 접속한 고유 브라우저 수입니다.
// ============================================================

const VISITOR_STORAGE_KEY = 'juno_visitor_id_v1';
let visitorStatsTimer = null;

function makeVisitorId() {
  try {
    const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (saved && saved.length >= 16 && saved.length <= 100) return saved;

    const id = globalThis.crypto?.randomUUID?.()
      || `juno-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    return `juno-session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

async function trackVisit() {
  try {
    if (location.pathname.startsWith('/api/')) return;

    await fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      body: JSON.stringify({
        visitorId: makeVisitorId(),
        path: location.pathname || '/'
      })
    });
  } catch (error) {
    console.debug('visitor tracking skipped:', error);
  }
}

function setVisitorStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = Number(value || 0).toLocaleString('ko-KR');
}

async function refreshVisitorStats(user = auth.currentUser) {
  if (!user) return;

  // 관리자 통계 카드가 없는 페이지에서는 API를 부르지 않습니다.
  if (
    !document.getElementById('todayVisitors') &&
    !document.getElementById('weeklyVisitors') &&
    !document.getElementById('totalVisitors')
  ) return;

  try {
    const token = await user.getIdToken();

    const res = await fetch('/api/visitor-stats', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      credentials: 'same-origin',
      body: JSON.stringify({})
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.message || '방문자 통계를 불러오지 못했습니다.');

    setVisitorStat('todayVisitors', data.todayVisitors);
    setVisitorStat('weeklyVisitors', data.weeklyVisitors);
    setVisitorStat('totalVisitors', data.totalVisitors);
  } catch (error) {
    console.warn('visitor stats load failed:', error);
  }
}

// 페이지가 열릴 때 1회 기록합니다.
if (typeof window !== 'undefined') {
  setTimeout(trackVisit, 0);

  // 관리자 로그인 상태일 때 통계를 자동 갱신합니다.
  onAuthStateChanged(auth, (user) => {
    if (visitorStatsTimer) {
      clearInterval(visitorStatsTimer);
      visitorStatsTimer = null;
    }

    if (!user) return;

    refreshVisitorStats(user);
    visitorStatsTimer = setInterval(() => refreshVisitorStats(user), 60_000);
  });

  // 이미 로그인한 상태에서 관리자 버튼을 다시 열어도 즉시 갱신합니다.
  document.addEventListener('click', (event) => {
    if (!event.target.closest?.('#adminOpen')) return;
    const user = auth.currentUser;
    if (user) setTimeout(() => refreshVisitorStats(user), 150);
  });
}
