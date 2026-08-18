import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

const ALLOWED_CATEGORIES = new Set(['cut', 'perm', 'color', 'care', 'extra']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
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
    throw Object.assign(new Error('관리자 로그인이 필요합니다.'), { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const email = String(decoded.email || '').toLowerCase();

  if (!email || !allowedEmails().has(email)) {
    throw Object.assign(new Error('관리자 권한이 없습니다.'), { status: 403 });
  }

  return { uid: decoded.uid, email };
}

function cleanItem(item) {
  const category = String(item?.category || '').trim();
  const name = String(item?.name || '').trim().slice(0, 120);
  const price = String(item?.price || '').trim().slice(0, 80);
  const note = String(item?.note || '').trim().slice(0, 300);

  if (!ALLOWED_CATEGORIES.has(category) || !name || !price) return null;
  return { category, name, price, note };
}

async function getPrices(adminDb) {
  const snap = await adminDb.collection('site').doc('prices').get();
  if (!snap.exists) return [];

  const data = snap.data() || {};
  return Array.isArray(data.items)
    ? data.items.map(cleanItem).filter(Boolean)
    : [];
}

async function savePrices(request, adminDb, adminAuth, Timestamp) {
  if (!allowedEmails().size) {
    return json({
      ok: false,
      code: 'ADMIN_EMAILS_NOT_CONFIGURED',
      message: '관리자 이메일 허용 목록이 설정되지 않았습니다.',
    }, 503);
  }

  const admin = await requireAdmin(request, adminAuth);
  const body = await request.json();
  const rawItems = Array.isArray(body?.items) ? body.items : [];

  if (rawItems.length > 300) {
    return json(
      { ok: false, message: '가격 항목은 최대 300개까지 저장할 수 있습니다.' },
      400
    );
  }

  const items = rawItems.map(cleanItem).filter(Boolean);

  await adminDb.collection('site').doc('prices').set({
    items,
    updatedAt: Timestamp.now(),
    updatedBy: admin.email,
  });

  return json({ ok: true, items });
}

export default {
  async fetch(request) {
    if (!['GET', 'POST'].includes(request.method)) {
      return json({ ok: false, message: '지원하지 않는 요청입니다.' }, 405);
    }

    try {
      if (!isAdminConfigured()) {
        return json({
          ok: false,
          code: 'SERVICE_NOT_CONFIGURED',
          message: 'Firebase Admin 서버 설정이 아직 완료되지 않았습니다.',
        }, 503);
      }

      const { adminDb, adminAuth, Timestamp } = getAdminServices();

      if (request.method === 'GET') {
        const items = await getPrices(adminDb);
        return json({ ok: true, items });
      }

      return await savePrices(request, adminDb, adminAuth, Timestamp);
    } catch (error) {
      console.error('prices api error:', error);

      const status = error?.status || 500;

      return json(
        {
          ok: false,
          code: error?.code || 'PRICES_ERROR',
          message:
            status === 500
              ? '가격표 서버 처리 중 오류가 발생했습니다.'
              : error.message,
        },
        status
      );
    }
  },
};
