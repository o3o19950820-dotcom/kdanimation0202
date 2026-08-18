import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

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

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return json({ ok:false, message:'GET 요청만 지원합니다.' }, 405);
    }

    try {
      if (!isAdminConfigured()) {
        return json({ ok:false, message:'이미지 서버 설정이 완료되지 않았습니다.' }, 503);
      }

      const url = new URL(request.url);
      const id = String(url.searchParams.get('id') || '').trim();

      if (!/^[A-Za-z0-9_-]{10,80}$/.test(id)) {
        return json({ ok:false, message:'올바르지 않은 이미지 주소입니다.' }, 400);
      }

      const { adminDb } = getAdminServices();
      const snap = await adminDb
        .collection('site')
        .doc('_media')
        .collection('images')
        .doc(id)
        .get();

      if (!snap.exists) {
        return json({ ok:false, message:'이미지를 찾을 수 없습니다.' }, 404);
      }

      const data = snap.data() || {};
      const dataUrl = String(data.dataUrl || '');
      const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,(.+)$/s);

      if (!match) {
        return json({ ok:false, message:'저장된 이미지 형식이 올바르지 않습니다.' }, 500);
      }

      const contentType = String(data.contentType || match[1] || 'image/jpeg')
        .toLowerCase()
        .replace('image/jpg', 'image/jpeg');

      const bytes = Buffer.from(match[2], 'base64');

      return new Response(bytes, {
        status: 200,
        headers: {
          'content-type': contentType,
          'content-length': String(bytes.length),
          'cache-control': 'public, max-age=31536000, immutable',
          'x-content-type-options': 'nosniff',
        },
      });
    } catch (error) {
      console.error('image api error:', error);
      return json({ ok:false, message:'이미지를 불러오지 못했습니다.' }, 500);
    }
  },
};
