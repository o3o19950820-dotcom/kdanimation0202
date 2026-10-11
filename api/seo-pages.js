import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});

const allowedEmails = () => new Set(String(process.env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));

function isPlainObject(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
function cleanText(v, limit) { return String(v ?? '').trim().slice(0, limit); }
function cleanPage(page) {
  if (!isPlainObject(page)) return null;
  const sections = Array.isArray(page.sections) ? page.sections.slice(0, 30).map(s => ({ title: cleanText(s?.title, 180), body: cleanText(s?.body, 9000) })) : [];
  const faqs = Array.isArray(page.faqs) ? page.faqs.slice(0, 30).map(f => ({ q: cleanText(f?.q, 400), a: cleanText(f?.a, 5000) })) : [];
  return {
    seoTitle: cleanText(page.seoTitle, 250),
    metaDescription: cleanText(page.metaDescription, 1000),
    keywords: Array.isArray(page.keywords) ? page.keywords.slice(0, 40).map(k => cleanText(k, 100)).filter(Boolean) : [],
    heroTitle: cleanText(page.heroTitle, 300),
    heroIntro: cleanText(page.heroIntro, 4000),
    sections,
    faqs,
  };
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return json({ ok: false, message: 'POST 요청만 지원합니다.' }, 405);
    try {
      if (!isAdminConfigured()) return json({ ok: false, message: 'Firebase Admin 서버 설정이 없습니다.' }, 503);
      const allowed = allowedEmails();
      if (!allowed.size) return json({ ok: false, message: 'ADMIN_EMAILS 설정이 없습니다.' }, 503);
      const bearer = request.headers.get('authorization') || '';
      if (!bearer.startsWith('Bearer ')) return json({ ok: false, message: '관리자 로그인이 필요합니다.' }, 401);
      const { adminDb, adminAuth, Timestamp } = getAdminServices();
      const decoded = await adminAuth.verifyIdToken(bearer.slice(7));
      const email = String(decoded.email || '').toLowerCase();
      if (!email || !allowed.has(email)) return json({ ok: false, message: '관리자 권한이 없습니다.' }, 403);
      const raw = await request.text();
      if (raw.length > 400000) return json({ ok: false, message: '저장할 내용이 너무 큽니다.' }, 413);
      const body = JSON.parse(raw);
      if (!isPlainObject(body?.items)) return json({ ok: false, message: '페이지 데이터 형식이 올바르지 않습니다.' }, 400);
      const entries = Object.entries(body.items);
      if (entries.length > 60) return json({ ok: false, message: '페이지 항목이 너무 많습니다.' }, 400);
      const items = {};
      for (const [key, value] of entries) {
        if (!/^[a-z0-9-]{1,100}$/.test(key)) return json({ ok: false, message: '페이지 ID가 올바르지 않습니다.' }, 400);
        const p = cleanPage(value);
        if (!p) return json({ ok: false, message: '페이지 내용이 올바르지 않습니다.' }, 400);
        items[key] = p;
      }
      await adminDb.collection('site').doc('seoPages').set({ items, updatedAt: Timestamp.now(), updatedBy: email });
      return json({ ok: true });
    } catch (error) {
      console.error('seo-pages save failed:', error?.code || error?.message || error);
      const status = error?.code?.startsWith?.('auth/') ? 401 : (error instanceof SyntaxError ? 400 : 500);
      return json({ ok: false, message: status === 401 ? '관리자 인증이 만료됐습니다. 다시 로그인해 주세요.' : status === 400 ? '저장 데이터 형식이 잘못됐습니다.' : '서버 저장에 실패했습니다. Vercel 로그를 확인해 주세요.' }, status);
    }
  }
};
