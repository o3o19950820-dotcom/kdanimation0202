import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

function allowedEmails() {
  return new Set(
    String(process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(x => x.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function requireAdmin(request, adminAuth) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const email = String(decoded.email || '').toLowerCase();

  if (!email || !allowedEmails().has(email)) {
    throw Object.assign(new Error('관리자 권한이 없습니다.'), { status: 403 });
  }

  return { uid: decoded.uid, email };
}

function kstDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ ok: false, message: 'POST 요청만 지원합니다.' }, 405);
    }

    try {
      if (!isAdminConfigured()) {
        return json({
          ok: false,
          code: 'FIREBASE_ADMIN_NOT_CONFIGURED',
          message: 'Firebase Admin 서버 설정이 아직 완료되지 않았습니다.'
        }, 503);
      }

      if (!allowedEmails().size) {
        return json({
          ok: false,
          code: 'ADMIN_EMAILS_NOT_CONFIGURED',
          message: '관리자 이메일 허용 목록이 설정되지 않았습니다.'
        }, 503);
      }

      const { adminDb, adminAuth, Timestamp } = getAdminServices();
      await requireAdmin(request, adminAuth);

      const todayKey = kstDateKey();
      const todayRef = adminDb.collection('visitor_daily').doc(todayKey);
      const summaryRef = adminDb.collection('visitor_summary').doc('all');

      const sevenDaysAgo = Timestamp.fromMillis(Date.now() - (7 * 24 * 60 * 60 * 1000));

      const [todaySnap, summarySnap, weeklySnap] = await Promise.all([
        todayRef.get(),
        summaryRef.get(),
        adminDb
          .collection('visitor_unique')
          .where('lastSeenAt', '>=', sevenDaysAgo)
          .get()
      ]);

      const today = todaySnap.exists ? todaySnap.data() : {};
      const summary = summarySnap.exists ? summarySnap.data() : {};

      return json({
        ok: true,
        date: todayKey,
        todayVisitors: Number(today.uniqueVisitors || 0),
        weeklyVisitors: weeklySnap.size,
        totalVisitors: Number(summary.totalVisitors || 0),

        // 추후 대시보드 확장용. 현재 화면에는 표시하지 않아도 됩니다.
        todayPageviews: Number(today.pageviews || 0),
        totalPageviews: Number(summary.totalPageviews || 0)
      });
    } catch (error) {
      console.error('visitor stats api error:', error);
      const status = error?.status || 500;

      return json({
        ok: false,
        code: error?.code || 'VISITOR_STATS_ERROR',
        message: status === 500
          ? '방문자 통계를 불러오는 중 오류가 발생했습니다.'
          : error.message
      }, status);
    }
  }
};
