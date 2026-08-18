import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

const SITE_DOCS = new Set(['settings', 'events', 'designers', 'styles', 'tips', 'blogLinks', 'faqs']);
const DATA_IMAGE_RE = /^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,/i;
const MAX_IMAGE_DATA_LENGTH = 800000;

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

  if (!token) throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });

  const decoded = await adminAuth.verifyIdToken(token);
  const email = String(decoded.email || '').toLowerCase();

  if (!email || !allowedEmails().has(email)) {
    throw Object.assign(new Error('관리자 권한이 없습니다.'), { status: 403 });
  }

  return { uid: decoded.uid, email };
}

function ts(value) {
  return value && typeof value.toMillis === 'function' ? value.toMillis() : null;
}

async function saveImageData(dataUrl, admin, adminDb, Timestamp) {
  const value = String(dataUrl || '');
  const match = value.match(DATA_IMAGE_RE);
  if (!match) return value;

  if (value.length > MAX_IMAGE_DATA_LENGTH) {
    const error = new Error('압축된 이미지가 아직 너무 큽니다. 이미지 크기를 조금만 더 줄여 주세요.');
    error.status = 413;
    throw error;
  }

  const ref = adminDb
    .collection('site')
    .doc('_media')
    .collection('images')
    .doc();

  await ref.set({
    dataUrl: value,
    contentType: match[1].toLowerCase().replace('image/jpg', 'image/jpeg'),
    createdAt: Timestamp.now(),
    createdBy: admin.email,
  });

  return `/api/image?id=${encodeURIComponent(ref.id)}`;
}

async function externalizeImages(value, admin, adminDb, Timestamp) {
  if (typeof value === 'string') {
    return DATA_IMAGE_RE.test(value)
      ? await saveImageData(value, admin, adminDb, Timestamp)
      : value;
  }

  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      out.push(await externalizeImages(item, admin, adminDb, Timestamp));
    }
    return out;
  }

  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = await externalizeImages(item, admin, adminDb, Timestamp);
    }
    return out;
  }

  return value;
}

async function saveSite(body, admin, adminDb, Timestamp) {
  const name = String(body.name || '');
  if (!SITE_DOCS.has(name)) return json({ ok:false, message:'허용되지 않은 설정입니다.' }, 400);

  // Base64 이미지는 각각 별도 Firestore 문서에 저장하고,
  // 사이트 데이터에는 짧은 /api/image URL만 남깁니다.
  // 기존 Base64 이미지도 다음 저장 시 자동으로 URL 방식으로 이전됩니다.
  const items = await externalizeImages(body.items, admin, adminDb, Timestamp);

  if (JSON.stringify(items ?? null).length > 850000) {
    return json({ ok:false, message:'저장 데이터가 너무 큽니다. 이미지 외의 등록 데이터가 너무 많은지 확인해 주세요.' }, 413);
  }

  await adminDb.collection('site').doc(name).set({
    items,
    updatedAt: Timestamp.now(),
    updatedBy: admin.email,
  });

  return json({ ok:true, items });
}

async function listInquiries(adminDb) {
  const snap = await adminDb.collection('inquiries').orderBy('createdAt','desc').limit(100).get();

  return json({
    ok:true,
    items:snap.docs.map(doc=>{
      const d=doc.data();
      return {
        id:doc.id,
        customerId:d.customerId||'',
        language:d.language||'ko',
        category:d.category||'other',
        title:d.title||'',
        content:d.content||'',
        answer:d.answer||'',
        status:d.status||'waiting',
        createdAt:ts(d.createdAt),
        answeredAt:ts(d.answeredAt),
        answeredBy:d.answeredBy||'',
      };
    }),
  });
}

async function answerInquiry(body, admin, adminDb, Timestamp) {
  const inquiryId=String(body.inquiryId||'').trim();
  const answer=String(body.answer||'').trim().slice(0,3000);

  if(!inquiryId || !answer) return json({ok:false,message:'답변 내용을 입력해 주세요.'},400);

  const ref=adminDb.collection('inquiries').doc(inquiryId);
  const snap=await ref.get();
  if(!snap.exists) return json({ok:false,message:'문의를 찾을 수 없습니다.'},404);

  await ref.update({
    answer,
    status:'answered',
    answeredAt:Timestamp.now(),
    answeredBy:admin.email,
  });

  return json({ok:true});
}

async function deleteInquiry(body, adminDb) {
  const inquiryId=String(body.inquiryId||'').trim();
  if(!inquiryId) return json({ok:false,message:'문의 ID가 없습니다.'},400);

  await adminDb.collection('inquiries').doc(inquiryId).delete();
  return json({ok:true});
}

export default {
  async fetch(request) {
    if(request.method==='GET') {
      return json({
        ok:true,
        service:'admin',
        configured:isAdminConfigured() && allowedEmails().size>0,
      });
    }

    if(request.method!=='POST') return json({ok:false,message:'POST 요청만 지원합니다.'},405);

    try {
      if(!isAdminConfigured()) {
        return json({ok:false,code:'SERVICE_NOT_CONFIGURED',message:'관리자 서버 설정이 아직 완료되지 않았습니다.'},503);
      }

      if(!allowedEmails().size) {
        return json({ok:false,code:'ADMIN_EMAILS_NOT_CONFIGURED',message:'관리자 이메일 허용 목록이 설정되지 않았습니다.'},503);
      }

      const {adminDb,adminAuth,Timestamp}=getAdminServices();
      const admin=await requireAdmin(request,adminAuth);
      const body=await request.json();

      if(body.action==='whoami') return json({ok:true,email:admin.email});
      if(body.action==='saveSite') return await saveSite(body,admin,adminDb,Timestamp);
      if(body.action==='listInquiries') return await listInquiries(adminDb);
      if(body.action==='answerInquiry') return await answerInquiry(body,admin,adminDb,Timestamp);
      if(body.action==='deleteInquiry') return await deleteInquiry(body,adminDb);

      return json({ok:false,message:'지원하지 않는 관리자 요청입니다.'},400);
    } catch(error) {
      console.error('admin api error:',error);
      return json({
        ok:false,
        code:error?.code||'ADMIN_ERROR',
        message:(error?.status||500)===500?'관리자 서버 처리 중 오류가 발생했습니다.':error.message,
      },error?.status||500);
    }
  },
};
