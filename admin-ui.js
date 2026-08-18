import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from './firebase.js';
import { $, toast, esc, cats, faqCats, faqCategoryOf } from './app.js';

let adminTab='site';
let inquiryCache=[];
const dialog=$('adminDialog');

$('adminOpen').onclick=()=>dialog.showModal();

async function adminApi(action,payload={}){
  const user=auth.currentUser;
  if(!user) throw new Error('관리자 로그인이 필요합니다.');
  const token=await user.getIdToken();

  const res=await fetch('/api/admin',{
    method:'POST',
    headers:{
      'content-type':'application/json',
      'authorization':`Bearer ${token}`
    },
    body:JSON.stringify({action,...payload})
  });

  const data=await res.json().catch(()=>({ok:false,message:'관리자 서버 응답 오류'}));
  if(!res.ok || !data.ok) throw new Error(data.message||'관리자 요청 실패');
  return data;
}

$('loginBtn').onclick=async(e)=>{
  e.preventDefault();
  const email=$('adminEmail').value.trim();
  const password=$('adminPw').value;

  try{
    await signInWithEmailAndPassword(auth,email,password);
    await adminApi('whoami');
    toast('관리자 로그인 완료');
    openAdmin();
  }catch(err){
    await signOut(auth).catch(()=>{});
    toast('관리자 이메일 또는 비밀번호/권한을 확인해 주세요.');
    console.error(err);
  }
};

$('logoutBtn').onclick=async()=>{
  await signOut(auth);
  showLogin();
};

onAuthStateChanged(auth,async(user)=>{
  if(!user){showLogin();return;}
  try{
    await adminApi('whoami');
    openAdmin();
  }catch(err){
    console.error(err);
    await signOut(auth).catch(()=>{});
    showLogin();
  }
});

function showLogin(){
  $('loginPanel').classList.remove('hidden');
  $('adminPanel').classList.add('hidden');
}

function openAdmin(){
  $('loginPanel').classList.add('hidden');
  $('adminPanel').classList.remove('hidden');
  renderAdmin();
}

document.querySelector('.adminTabs')?.addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON' || !e.target.dataset.admin)return;
  document.querySelectorAll('.adminTabs button[data-admin]').forEach(b=>b.classList.remove('on'));
  e.target.classList.add('on');
  adminTab=e.target.dataset.admin;
  renderAdmin();
});

function state(){return window.__JUNO_STATE__ || window.__JUNO_DEFAULTS__;}
function clone(v){return JSON.parse(JSON.stringify(v||[]));}

async function save(name,items){
  await adminApi('saveSite',{name,items});
  const key=name==='settings'?'site':name;
  window.__JUNO_STATE__[key]=items;
  toast('저장 완료');
}

function catOptions(selected,map=cats){
  return Object.entries(map).map(([k,v])=>`<option value="${k}" ${selected===k?'selected':''}>${v}</option>`).join('');
}
function imgInput(id){
  return `<input id="${id}" type="file" accept="image/*"><p class="hint">사진은 자동 압축 후 저장됩니다. Firestore 문서 1MB 한도를 넘지 않도록 큰 사진은 한 장씩 올려주세요.</p>`;
}
function compress(file,max=900,quality=.72){
  return new Promise((resolve,reject)=>{
    if(!file){resolve('');return}
    const r=new FileReader();
    r.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>h&&w>max){h=Math.round(h*max/w);w=max}
        else if(h>max){w=Math.round(w*max/h);h=max}
        const c=document.createElement('canvas');
        c.width=w;c.height=h;
        const ctx=c.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        resolve(c.toDataURL('image/jpeg',quality));
      };
      img.onerror=reject;
      img.src=r.result;
    };
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}

async function renderAdmin(){
  const s=state();
  const c=$('adminContent');

  if(adminTab==='site'){
    const site=s.site||{};
    const imgs=Array.isArray(site.salonImages)?site.salonImages:[];
    c.innerHTML=`<div class="form siteAdminForm"><h3>기본 설정</h3>
      <label><b>히어로 메인 문구</b><textarea id="siteHeroTitle" placeholder="줄바꿈 가능">${esc(site.heroTitle||'')}</textarea></label>
      <label><b>히어로 설명</b><textarea id="siteHeroLead">${esc(site.heroLead||'')}</textarea></label>
      <label><b>매장 소개 제목</b><input id="siteSalonTitle" value="${esc(site.salonTitle||'')}"></label>
      <label><b>매장 소개 문구</b><textarea id="siteSalonDesc">${esc(site.salonDesc||'')}</textarea></label>
      <div class="twoCol"><label><b>주소</b><input id="siteAddressInput" value="${esc(site.address||'')}"></label><label><b>영업시간</b><input id="siteHoursInput" value="${esc(site.hours||'')}"></label></div>
      <label><b>전화번호</b><input id="sitePhoneInput" value="${esc(site.phone||'')}"></label>
      <label><b>네이버예약 주소</b><input id="siteReserve" value="${esc(site.reserveUrl||'')}"></label>
      <label><b>네이버 블로그 주소</b><input id="siteBlog" value="${esc(site.blogUrl||'')}"></label>
      <div class="card"><h4>메인 히어로 사진</h4>${site.heroImage?`<img class="adminPreview" src="${esc(site.heroImage)}" alt="">`:''}${imgInput('siteHeroImage')}</div>
      <div class="card"><h4>매장 분위기 사진 3장</h4><div class="adminPreviewGrid">${imgs.map(x=>`<img class="adminPreview" src="${esc(x)}" alt="">`).join('')}</div>${imgInput('siteSalonImage1')}${imgInput('siteSalonImage2')}${imgInput('siteSalonImage3')}</div>
      <button class="btn" id="saveSite">기본 설정 저장</button></div>`;
    bindAdmin();
    return;
  }
  if(adminTab==='event') c.innerHTML=manageList('events',s.events,['title','desc','link'],true);
  if(adminTab==='designer') c.innerHTML=manageList('designers',s.designers,['name','position','keyword','intro'],true);
  if(adminTab==='style') c.innerHTML=manageList('styles',s.styles,['cat','title','desc'],true);
  if(adminTab==='tip') c.innerHTML=manageList('tips',s.tips,['cat','title','body'],false);
  if(adminTab==='blog') c.innerHTML=manageList('blogLinks',s.blogLinks,['title','url'],false);
  if(adminTab==='faq') c.innerHTML=manageList('faqs',s.faqs,['cat','q','a'],false);

  if(adminTab==='inquiry'){
    c.innerHTML='<p class="hint">고객 문의를 불러오는 중...</p>';
    try{
      const data=await adminApi('listInquiries');
      inquiryCache=data.items||[];
      renderInquiryList();
    }catch(err){
      c.innerHTML=`<p class="hint">${esc(err.message)}</p>`;
    }
    return;
  }

  bindAdmin();
}

function label(k){
  return {
    title:'제목',desc:'설명',link:'링크',name:'이름',position:'직급',keyword:'키워드',
    intro:'소개글',cat:'카테고리',body:'본문',url:'주소',q:'질문',a:'답변'
  }[k]||k;
}

function sectionTitle(name){
  return {
    events:'이벤트',designers:'디자이너',styles:'스타일',tips:'헤어TIP',
    blogLinks:'블로그',faqs:'Q&A 게시판'
  }[name]||name;
}

function manageList(name,arr=[],fields=[],hasImage=false){
  const help=name==='faqs'?'<p class="hint">카테고리를 선택하면 사이트의 Q&A 탭에 자동으로 분류됩니다. 기존 질문 중 카테고리가 없던 글은 질문 내용에 따라 자동 분류되어 보입니다.</p>':'';
  return `<h3>${sectionTitle(name)}</h3>${help}<div class="adminGrid"><div class="card"><h4>새로 추가</h4><div class="form" id="addForm">${fields.map(f=>fieldHtml(f,'',name)).join('')}${hasImage?imgInput('newImage'):''}<button class="btn" data-add="${name}">추가</button></div></div><div class="card"><h4>등록 목록</h4>${arr.map((x,i)=>{
    const meta=name==='faqs'?(faqCats[faqCategoryOf(x)]||'기타'):(x.keyword||x.cat||x.url||'');
    return `<div class="row"><div><b>${esc(x.title||x.name||x.q||'항목')}</b><br><span class="hint">${esc(meta)}</span></div><div><button class="mini" data-edit="${name}" data-i="${i}">수정</button> <button class="mini" data-del="${name}" data-i="${i}">삭제</button></div></div>`;
  }).join('')||'<p class="hint">등록된 항목이 없습니다.</p>'}</div></div>`;
}

function fieldHtml(f,v,name=''){
  if(f==='cat'){
    const map=name==='faqs'?faqCats:cats;
    const selected=name==='faqs'?(map[v]?v:'other'):v;
    return `<label><b>카테고리</b><select id="f_cat">${catOptions(selected,map)}</select></label>`;
  }
  if(['desc','intro','body','a'].includes(f))return `<label><b>${label(f)}</b><textarea id="f_${f}" placeholder="${label(f)}">${esc(v)}</textarea></label>`;
  return `<label><b>${label(f)}</b><input id="f_${f}" placeholder="${label(f)}" value="${esc(v)}"></label>`;
}

function getForm(fields){
  const o={};
  fields.forEach(f=>o[f]=$(`f_${f}`).value.trim());
  return o;
}

function fieldsFor(name){
  return {
    events:['title','desc','link'],
    designers:['name','position','keyword','intro'],
    styles:['cat','title','desc'],
    tips:['cat','title','body'],
    blogLinks:['title','url'],
    faqs:['cat','q','a']
  }[name];
}

function validateItem(name,item){
  if(name==='faqs'){
    if(!faqCats[item.cat]) item.cat='other';
    if(!item.q || !item.a) throw new Error('질문과 답변을 모두 입력해 주세요.');
  }
  return item;
}

function bindAdmin(){
  const saveSite=$('saveSite');
  if(saveSite) saveSite.onclick=async()=>{
    try{
      const oldSite=state().site||{};
      let heroImage=oldSite.heroImage||'/assets/salon-hero.webp';
      const salonImages=Array.isArray(oldSite.salonImages)?[...oldSite.salonImages]:['/assets/salon-01.webp','/assets/salon-02.webp','/assets/salon-03.webp'];
      const heroFile=$('siteHeroImage')?.files?.[0];
      if(heroFile) heroImage=await compress(heroFile,1400,.78);
      for(let i=0;i<3;i++){
        const file=$(`siteSalonImage${i+1}`)?.files?.[0];
        if(file) salonImages[i]=await compress(file,1200,.76);
      }
      await save('settings',{
        ...oldSite,
        reserveUrl:$('siteReserve').value.trim(),
        blogUrl:$('siteBlog').value.trim(),
        salonName:'준오헤어 건대역2호점',
        heroTitle:$('siteHeroTitle').value.trim(),
        heroLead:$('siteHeroLead').value.trim(),
        salonTitle:$('siteSalonTitle').value.trim(),
        salonDesc:$('siteSalonDesc').value.trim(),
        address:$('siteAddressInput').value.trim(),
        hours:$('siteHoursInput').value.trim(),
        phone:$('sitePhoneInput').value.trim(),
        heroImage, salonImages
      });
      renderAdmin();
    }catch(err){toast(err.message)}
  };

  document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=async()=>{
    try{
      const name=btn.dataset.add,fields=fieldsFor(name),arr=clone(state()[name]);
      const item=validateItem(name,getForm(fields));
      const file=$('newImage')?.files?.[0];
      if(file)item.image=await compress(file);
      if(name==='designers'&&file){item.photo=item.image;delete item.image}
      arr.unshift(item);
      await save(name,arr);
      renderAdmin();
    }catch(err){toast(err.message)}
  });

  document.querySelectorAll('[data-del]').forEach(btn=>btn.onclick=async()=>{
    try{
      const name=btn.dataset.del,i=+btn.dataset.i,arr=clone(state()[name]);
      arr.splice(i,1);
      await save(name,arr);
      renderAdmin();
    }catch(err){toast(err.message)}
  });

  document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>editItem(btn.dataset.edit,+btn.dataset.i));
}

function editItem(name,i){
  const arr=clone(state()[name]);
  const item=arr[i];
  const fields=fieldsFor(name);
  const c=$('adminContent');
  const imgKey=name==='designers'?'photo':'image';

  c.innerHTML=`<h3>수정</h3><div class="form card">${fields.map(f=>{
    const value=(name==='faqs'&&f==='cat')?faqCategoryOf(item):(item[f]||'');
    return fieldHtml(f,value,name);
  }).join('')}${(name==='events'||name==='designers'||name==='styles')?imgInput('editImage'):''}<button class="btn" id="saveEdit">수정 저장</button><button class="btn light" id="cancelEdit">취소</button></div>`;

  $('cancelEdit').onclick=renderAdmin;
  $('saveEdit').onclick=async()=>{
    try{
      const updated=validateItem(name,{...item,...getForm(fields)});
      const file=$('editImage')?.files?.[0];
      if(file)updated[imgKey]=await compress(file);
      arr[i]=updated;
      await save(name,arr);
      renderAdmin();
    }catch(err){toast(err.message)}
  };
}

function fmt(ms){
  if(!ms)return '';
  return new Intl.DateTimeFormat('ko-KR',{
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'
  }).format(new Date(ms));
}

function renderInquiryList(){
  const c=$('adminContent');
  c.innerHTML=`
    <div class="adminInquiryHead">
      <div><h3>고객 문의</h3><p class="hint">최근 100건 · 고객 비밀번호는 관리자 화면에도 표시되지 않습니다.</p></div>
      <button class="mini" id="refreshInquiry">새로고침</button>
    </div>
    <div class="adminInquiryFilters">
      <button class="mini on" data-inq-filter="all">전체</button>
      <button class="mini" data-inq-filter="waiting">답변대기</button>
      <button class="mini" data-inq-filter="answered">답변완료</button>
    </div>
    <div id="adminInquiryRows"></div>`;

  $('refreshInquiry').onclick=renderAdmin;
  document.querySelectorAll('[data-inq-filter]').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('[data-inq-filter]').forEach(x=>x.classList.remove('on'));
    btn.classList.add('on');
    renderInquiryRows(btn.dataset.inqFilter);
  });
  renderInquiryRows('all');
}

function renderInquiryRows(filter){
  const rows=filter==='all'?inquiryCache:inquiryCache.filter(x=>x.status===filter);
  $('adminInquiryRows').innerHTML=rows.map(x=>`
    <div class="row inquiryAdminRow">
      <div>
        <b>${esc(x.title)}</b>
        <div class="hint">${esc(x.customerId)} · ${esc(x.language)} · ${esc(x.category)} · ${esc(fmt(x.createdAt))}</div>
      </div>
      <div>
        <span class="status ${x.status==='answered'?'answered':'waiting'}">${x.status==='answered'?'답변완료':'대기'}</span>
        <button class="mini" data-inq-open="${esc(x.id)}">보기/답변</button>
      </div>
    </div>
  `).join('')||'<p class="hint">해당 문의가 없습니다.</p>';

  document.querySelectorAll('[data-inq-open]').forEach(btn=>btn.onclick=()=>openInquiryAdmin(btn.dataset.inqOpen));
}

function openInquiryAdmin(id){
  const x=inquiryCache.find(v=>v.id===id);
  if(!x)return;
  const c=$('adminContent');

  c.innerHTML=`
    <button class="mini" id="backInquiry">← 목록</button>
    <div class="card adminInquiryDetail">
      <div class="inquiryMeta">
        <span>${esc(x.customerId)}</span><span>${esc(x.language)}</span><span>${esc(x.category)}</span><span>${esc(fmt(x.createdAt))}</span>
      </div>
      <h3>${esc(x.title)}</h3>
      <div class="messageBubble customerMessage">${esc(x.content).replace(/\n/g,'<br>')}</div>
      <label><b>답변</b></label>
      <textarea id="adminAnswer" placeholder="고객에게 보여질 답변을 작성해 주세요.">${esc(x.answer||'')}</textarea>
      <div class="actions">
        <button class="btn" id="saveAnswer">답변 저장</button>
        <button class="btn light" id="deleteInquiry">문의 삭제</button>
      </div>
    </div>`;

  $('backInquiry').onclick=renderInquiryList;
  $('saveAnswer').onclick=async()=>{
    try{
      await adminApi('answerInquiry',{inquiryId:id,answer:$('adminAnswer').value});
      toast('답변 저장 완료');
      await renderAdmin();
    }catch(err){toast(err.message)}
  };
  $('deleteInquiry').onclick=async()=>{
    if(!confirm('이 문의를 삭제할까요? 삭제 후 복구할 수 없습니다.'))return;
    try{
      await adminApi('deleteInquiry',{inquiryId:id});
      toast('문의 삭제 완료');
      await renderAdmin();
    }catch(err){toast(err.message)}
  };
}
