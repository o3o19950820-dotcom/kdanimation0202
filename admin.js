import { adminAuth, adminDb, Timestamp } from './_firebaseAdmin.js';

const SITE_DOCS = new Set(['settings', 'events', 'designers', 'styles', 'tips', 'blogLinks', 'faqs']);

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

  return { uid: decoded.uid, email };
}

function ts(value) {
  if (!value) return null;
  return typeof value.toMillis === 'function' ? value.toMillis() : null;
}

async function saveSite(body, admin) {
  const name = String(body.name || '');
  if (!SITE_DOCS.has(name)) return json({ ok: false, message: '허용되지 않은 설정입니다.' }, 400);

  const items = body.items;
  const size = JSON.stringify(items ?? null).length;
  if (size > 850_000) {
    return json({ ok: false, message: '저장 데이터가 너무 큽니다. 이미지 용량을 줄여 주세요.' }, 413);
  }

  await adminDb.collection('site').doc(name).set({
    items,
    updatedAt: Timestamp.now(),
    updatedBy: admin.email,
  });

  return json({ ok: true });
}

async function listInquiries() {
  const snap = await adminDb
    .collection('inquiries')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  return json({
    ok: true,
    items: snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        customerId: d.customerId || '',
        language: d.language || 'ko',
        category: d.category || 'other',
        title: d.title || '',
        content: d.content || '',
        answer: d.answer || '',
        status: d.status || 'waiting',
        createdAt: ts(d.createdAt),
        answeredAt: ts(d.answeredAt),
        answeredBy: d.answeredBy || '',
      };
    }),
  });
}

async function answerInquiry(body, admin) {
  const inquiryId = String(body.inquiryId || '').trim();
  const answer = String(body.answer || '').trim().slice(0, 3000);

  if (!inquiryId || answer.length < 1) {
    return json({ ok: false, message: '답변 내용을 입력해 주세요.' }, 400);
  }

  const ref = adminDb.collection('inquiries').doc(inquiryId);
  const snap = await ref.get();
  if (!snap.exists) return json({ ok: false, message: '문의를 찾을 수 없습니다.' }, 404);

  await ref.update({
    answer,
    status: 'answered',
    answeredAt: Timestamp.now(),
    answeredBy: admin.email,
  });

  return json({ ok: true });
}

async function deleteInquiry(body) {
  const inquiryId = String(body.inquiryId || '').trim();
  if (!inquiryId) return json({ ok: false, message: '문의 ID가 없습니다.' }, 400);

  await adminDb.collection('inquiries').doc(inquiryId).delete();
  return json({ ok: true });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ ok: false, message: 'POST 요청만 지원합니다.' }, 405);
    }

    try {
      const admin = await requireAdmin(request);
      const body = await request.json();

      if (body.action === 'whoami') return json({ ok: true, email: admin.email });
      if (body.action === 'saveSite') return await saveSite(body, admin);
      if (body.action === 'listInquiries') return await listInquiries();
      if (body.action === 'answerInquiry') return await answerInquiry(body, admin);
      if (body.action === 'deleteInquiry') return await deleteInquiry(body);

      return json({ ok: false, message: '지원하지 않는 관리자 요청입니다.' }, 400);
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      return json(
        { ok: false, message: status === 500 ? '관리자 서버 처리 중 오류가 발생했습니다.' : error.message },
        status
      );
    }
  },
};
