import { adminAuth, adminDb, Timestamp } from './_firebaseAdmin.js';

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
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });

  const decoded = await adminAuth.verifyIdToken(token);
  const email = String(decoded.email || '').toLowerCase();
  if (!email || !allowedEmails().has(email)) {
    throw Object.assign(new Error('관리자 권한이 없습니다.'), { status: 403 });
  }
  return email;
}

function cleanItem(raw) {
  const category = String(raw?.category || '').trim().slice(0, 20);
  const name = String(raw?.name || '').trim().slice(0, 80);
  const price = String(raw?.price || '').trim().slice(0, 50);
  const note = String(raw?.note || '').trim().slice(0, 140);
  if (!category || !name || !price) return null;
  return { category, name, price, note };
}

export default {
  async fetch(request) {
    try {
      if (request.method === 'GET') {
        const snap = await adminDb.collection('site').doc('prices').get();
        const items = snap.exists && Array.isArray(snap.data()?.items) ? snap.data().items : [];
        return json({ ok: true, items });
      }

      if (request.method === 'POST') {
        const email = await requireAdmin(request);
        const body = await request.json().catch(() => ({}));
        const rawItems = Array.isArray(body.items) ? body.items : [];
        if (rawItems.length > 200) return json({ ok: false, message: '가격 항목은 최대 200개까지 저장할 수 있습니다.' }, 400);

        const items = rawItems.map(cleanItem).filter(Boolean);
        const size = JSON.stringify(items).length;
        if (size > 300_000) return json({ ok: false, message: '가격표 데이터가 너무 큽니다.' }, 413);

        await adminDb.collection('site').doc('prices').set({
          items,
          updatedAt: Timestamp.now(),
          updatedBy: email,
        });
        return json({ ok: true, items });
      }

      return json({ ok: false, message: '지원하지 않는 요청입니다.' }, 405);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return json({
        ok: false,
        message: status === 500 ? '가격표 처리 중 오류가 발생했습니다.' : error.message,
      }, status);
    }
  },
};
