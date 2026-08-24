import { getAdminServices, isAdminConfigured } from './_firebaseAdmin.js';

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
      'x-content-type-options':'nosniff',
    }
  });
}

function allowedEmails(){
  return new Set(
    String(process.env.ADMIN_EMAILS||'')
      .split(',')
      .map(x=>x.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function requireAdmin(request,adminAuth){
  const authHeader=request.headers.get('authorization')||'';
  const token=authHeader.startsWith('Bearer ')?authHeader.slice(7):'';
  if(!token) throw Object.assign(new Error('로그인이 필요합니다.'),{status:401});

  const decoded=await adminAuth.verifyIdToken(token);
  const email=String(decoded.email||'').toLowerCase();
  if(!email || !allowedEmails().has(email)){
    throw Object.assign(new Error('관리자 권한이 없습니다.'),{status:403});
  }
  return {uid:decoded.uid,email};
}

export default {
  async fetch(request){
    if(request.method==='GET'){
      return json({ok:true,service:'seo-pages',configured:isAdminConfigured()&&allowedEmails().size>0});
    }
    if(request.method!=='POST') return json({ok:false,message:'POST 요청만 지원합니다.'},405);

    try{
      if(!isAdminConfigured()) return json({ok:false,message:'관리자 서버 설정이 아직 완료되지 않았습니다.'},503);
      if(!allowedEmails().size) return json({ok:false,message:'관리자 이메일 허용 목록이 설정되지 않았습니다.'},503);

      const {adminDb,adminAuth,Timestamp}=getAdminServices();
      const admin=await requireAdmin(request,adminAuth);
      const body=await request.json();
      const items=body?.items;

      if(!items || typeof items!=='object' || Array.isArray(items)){
        return json({ok:false,message:'검색페이지 데이터 형식이 올바르지 않습니다.'},400);
      }
      const raw=JSON.stringify(items);
      if(raw.length>800000){
        return json({ok:false,message:'검색페이지 저장 데이터가 너무 큽니다.'},413);
      }

      await adminDb.collection('site').doc('seoPages').set({
        items,
        updatedAt:Timestamp.now(),
        updatedBy:admin.email
      });

      return json({ok:true});
    }catch(error){
      console.error('seo pages api error:',error);
      return json({
        ok:false,
        code:error?.code||'SEO_PAGES_ERROR',
        message:(error?.status||500)===500?'검색페이지 저장 중 오류가 발생했습니다.':error.message
      },error?.status||500);
    }
  }
};
