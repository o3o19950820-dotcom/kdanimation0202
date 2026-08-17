import bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';
import { adminDb, Timestamp } from './_firebaseAdmin.js';

const LANGUAGES = new Set(['ko', 'en', 'ja', 'zh']);
const CATEGORIES = new Set(['reservation', 'price', 'cut', 'perm', 'color', 'care', 'foreign', 'other']);

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

function cleanText(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function normalizeId(value) {
  return cleanText(value, 40).toLowerCase();
}

function customerKey(customerId) {
  return createHash('sha256').update(normalizeId(customerId)).digest('hex');
}

function validCustomerId(id) {
  return /^[0-9a-zA-Z가-힣._-]{3,40}$/.test(id);
}

function validPassword(password) {
  const p = String(password ?? '');
  const bytes = new TextEncoder().encode(p).length;
  return p.length >= 4 && bytes <= 64;
}

function timestampToMs(value) {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  return null;
}

async function createInquiry(body) {
  const customerId = cleanText(body.customerId, 40);
  const password = String(body.password ?? '');
  const title = cleanText(body.title, 80);
  const content = cleanText(body.content, 2500);
  const language = LANGUAGES.has(body.language) ? body.language : 'ko';
  const category = CATEGORIES.has(body.category) ? body.category : 'other';

  // 아주 단순한 봇 방지용 honeypot
  if (body.website) return json({ ok: true });

  if (!validCustomerId(customerId)) {
    return json({ ok: false, message: '아이디는 3~40자의 한글/영문/숫자/._- 만 사용할 수 있어요.' }, 400);
  }
  if (!validPassword(password)) {
    return json({ ok: false, message: '비밀번호는 4자 이상, UTF-8 기준 64바이트 이하로 입력해 주세요.' }, 400);
  }
  if (title.length < 2 || content.length < 2) {
    return json({ ok: false, message: '제목과 문의내용을 입력해 주세요.' }, 400);
  }

  const passwordHash = await bcrypt.hash(password, 11);
  const ref = await adminDb.collection('inquiries').add({
    customerId,
    customerKey: customerKey(customerId),
    passwordHash,
    language,
    category,
    title,
    content,
    answer: '',
    status: 'waiting',
    createdAt: Timestamp.now(),
    answeredAt: null,
    answeredBy: '',
  });

  return json({
    ok: true,
    id: ref.id,
    reference: ref.id.slice(0, 8).toUpperCase(),
    message: '문의가 등록되었습니다.',
  }, 201);
}

async function listMine(body) {
  const customerId = cleanText(body.customerId, 40);
  const password = String(body.password ?? '');

  if (!validCustomerId(customerId) || !validPassword(password)) {
    return json({ ok: false, message: '아이디 또는 비밀번호를 확인해 주세요.' }, 401);
  }

  const snap = await adminDb
    .collection('inquiries')
    .where('customerKey', '==', customerKey(customerId))
    .limit(50)
    .get();

  const matched = [];
  for (const doc of snap.docs) {
    const data = doc.data();
    if (await bcrypt.compare(password, data.passwordHash || '')) {
      matched.push({
        id: doc.id,
        title: data.title || '',
        category: data.category || 'other',
        language: data.language || 'ko',
        status: data.status || 'waiting',
        createdAt: timestampToMs(data.createdAt),
        answeredAt: timestampToMs(data.answeredAt),
      });
    }
  }

  matched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!matched.length) {
    return json({ ok: false, message: '아이디 또는 비밀번호가 일치하는 문의가 없습니다.' }, 401);
  }

  return json({ ok: true, items: matched });
}

async function readMine(body) {
  const inquiryId = cleanText(body.inquiryId, 120);
  const customerId = cleanText(body.customerId, 40);
  const password = String(body.password ?? '');

  if (!inquiryId || !validCustomerId(customerId) || !validPassword(password)) {
    return json({ ok: false, message: '확인 정보가 올바르지 않습니다.' }, 400);
  }

  const doc = await adminDb.collection('inquiries').doc(inquiryId).get();
  if (!doc.exists) {
    return json({ ok: false, message: '문의를 찾을 수 없습니다.' }, 404);
  }

  const data = doc.data();
  const sameCustomer = data.customerKey === customerKey(customerId);
  const samePassword = sameCustomer && (await bcrypt.compare(password, data.passwordHash || ''));

  if (!samePassword) {
    return json({ ok: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' }, 401);
  }

  return json({
    ok: true,
    item: {
      id: doc.id,
      title: data.title || '',
      content: data.content || '',
      answer: data.answer || '',
      category: data.category || 'other',
      language: data.language || 'ko',
      status: data.status || 'waiting',
      createdAt: timestampToMs(data.createdAt),
      answeredAt: timestampToMs(data.answeredAt),
    },
  });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ ok: false, message: 'POST 요청만 지원합니다.' }, 405);
    }

    try {
      const body = await request.json();
      if (body.action === 'create') return await createInquiry(body);
      if (body.action === 'list') return await listMine(body);
      if (body.action === 'read') return await readMine(body);

      return json({ ok: false, message: '지원하지 않는 요청입니다.' }, 400);
    } catch (error) {
      console.error(error);
      return json({ ok: false, message: '서버 처리 중 오류가 발생했습니다.' }, 500);
    }
  },
};
