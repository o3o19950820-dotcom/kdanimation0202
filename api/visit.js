import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

const BOT_RE = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|twitterbot|linkedinbot|discordbot|whatsapp|headlesschrome|lighthouse|pagespeed/i;

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

function cleanPath(value) {
  let path = String(value || '/').trim();
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.split('?')[0].split('#')[0];
  return path.slice(0, 240) || '/';
}

function hashVisitorId(value) {
  return createHash('sha256').update(value).digest('hex');
}

function validVisitorId(value) {
  return typeof value === 'string'
    && value.length >= 16
    && value.length <= 100
    && /^[a-zA-Z0-9._:-]+$/.test(value);
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
          message: 'Firebase Admin 서버 설정이 필요합니다.'
        }, 503);
      }

      const userAgent = request.headers.get('user-agent') || '';
      if (BOT_RE.test(userAgent)) {
        return json({ ok: true, counted: false, reason: 'bot' });
      }

      const body = await request.json().catch(() => ({}));
      const visitorId = String(body.visitorId || '').trim();

      if (!validVisitorId(visitorId)) {
        return json({ ok: false, message: '올바르지 않은 방문자 ID입니다.' }, 400);
      }

      const path = cleanPath(body.path);
      const visitorHash = hashVisitorId(visitorId);
      const day = kstDateKey();
      const { adminDb, Timestamp } = getAdminServices();

      const dailyRef = adminDb.collection('visitor_daily').doc(day);
      const dailyVisitorRef = dailyRef.collection('visitors').doc(visitorHash);
      const uniqueRef = adminDb.collection('visitor_unique').doc(visitorHash);
      const summaryRef = adminDb.collection('visitor_summary').doc('all');

      let newToday = false;
      let newTotal = false;

      await adminDb.runTransaction(async (tx) => {
        const dailyVisitorSnap = await tx.get(dailyVisitorRef);
        const uniqueSnap = await tx.get(uniqueRef);

        const now = Timestamp.now();
        newToday = !dailyVisitorSnap.exists;
        newTotal = !uniqueSnap.exists;

        tx.set(dailyRef, {
          uniqueVisitors: FieldValue.increment(newToday ? 1 : 0),
          pageviews: FieldValue.increment(1),
          updatedAt: now
        }, { merge: true });

        tx.set(dailyVisitorRef, {
          firstSeenAt: dailyVisitorSnap.exists
            ? (dailyVisitorSnap.data().firstSeenAt || now)
            : now,
          lastSeenAt: now,
          pageviews: FieldValue.increment(1),
          lastPath: path
        }, { merge: true });

        tx.set(uniqueRef, {
          firstSeenAt: uniqueSnap.exists
            ? (uniqueSnap.data().firstSeenAt || now)
            : now,
          lastSeenAt: now,
          lastPath: path
        }, { merge: true });

        tx.set(summaryRef, {
          totalVisitors: FieldValue.increment(newTotal ? 1 : 0),
          totalPageviews: FieldValue.increment(1),
          updatedAt: now
        }, { merge: true });
      });

      return json({
        ok: true,
        counted: true,
        newToday,
        newTotal
      });
    } catch (error) {
      console.error('visit api error:', error);
      return json({
        ok: false,
        code: error?.code || 'VISIT_ERROR',
        message: '방문자 기록 중 오류가 발생했습니다.'
      }, 500);
    }
  }
};
