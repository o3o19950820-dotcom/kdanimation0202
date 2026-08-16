import { $, toast, esc } from './app.js';

const categoryNames = {
  reservation:'예약', price:'가격', cut:'커트', perm:'펌',
  color:'컬러', care:'케어', foreign:'외국인 고객 문의', other:'기타'
};
const languageNames = {ko:'한국어',en:'English',ja:'日本語',zh:'中文'};

let lookupCredentials = null;
let inquiryServiceReady = true;

async function inquiryApi(payload){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),12000);

  let res;
  try{
    res = await fetch('/api/inquiries',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(payload),
      signal:controller.signal
    });
  }catch(err){
    if(err?.name==='AbortError') throw new Error('문의 서버 응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.');
    throw new Error('문의 서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
  }finally{
    clearTimeout(timer);
  }

  const text=await res.text();
  let data=null;
  try{data=text?JSON.parse(text):null}catch(_){data=null}

  if(!data){
    throw new Error(res.status>=500
      ? '문의 서버 설정을 확인 중이에요. 잠시 후 다시 이용해 주세요.'
      : '서버 응답을 확인할 수 없어요.');
  }

  if(!res.ok || !data.ok) throw new Error(data.message||'요청 처리에 실패했습니다.');
  return data;
}

async function checkInquiryService(){
  const submit=$('inquirySubmitBtn');

  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),6000);
    const res=await fetch('/api/inquiries',{cache:'no-store',signal:controller.signal});
    clearTimeout(timer);
    const data=await res.json();
    inquiryServiceReady=Boolean(data?.configured);
  }catch(_){
    inquiryServiceReady=false;
  }

  if(submit) submit.disabled=!inquiryServiceReady;

  if(!inquiryServiceReady){
    const result=$('inquiryCreateResult');
    if(result){
      result.innerHTML='<div class="messageBubble waitingMessage"><strong>문의 시스템 준비 중</strong><br>회원가입이 필요한 것은 아닙니다. 서버 설정 완료 후 별도 가입 없이 아이디와 비밀번호만 정해서 문의할 수 있어요.</div>';
    }
  }
}

function formatDate(ms){
  if(!ms)return '';
  return new Intl.DateTimeFormat('ko-KR',{
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'
  }).format(new Date(ms));
}

function setInquiryTab(tab){
  document.querySelectorAll('[data-inquiry-tab]').forEach(btn=>{
    btn.classList.toggle('on',btn.dataset.inquiryTab===tab);
  });
  $('inquiryCreatePanel').classList.toggle('hidden',tab!=='create');
  $('inquiryLookupPanel').classList.toggle('hidden',tab!=='lookup');
}

document.querySelectorAll('[data-inquiry-tab]').forEach(btn=>{
  btn.addEventListener('click',()=>setInquiryTab(btn.dataset.inquiryTab));
});

$('inquiryCreateForm')?.addEventListener('submit',async(e)=>{
  e.preventDefault();

  if(!inquiryServiceReady){
    toast('문의 시스템 서버 설정이 아직 완료되지 않았어요.');
    return;
  }

  const btn=$('inquirySubmitBtn');
  btn.disabled=true;
  btn.textContent='등록 중...';

  try{
    const data=await inquiryApi({
      action:'create',
      customerId:$('inqCustomerId').value,
      password:$('inqPassword').value,
      language:$('inqLanguage').value,
      category:$('inqCategory').value,
      title:$('inqTitle').value,
      content:$('inqContent').value,
      website:$('inqWebsite').value
    });

    $('inquiryCreateResult').innerHTML=`
      <div class="successBox">
        <strong>문의가 등록되었습니다.</strong>
        <p>문의번호 <b>${esc(data.reference)}</b></p>
        <p>회원가입 없이 같은 아이디와 비밀번호로 답변을 확인할 수 있어요.</p>
      </div>`;

    e.target.reset();
    toast('문의 등록 완료');
  }catch(err){
    $('inquiryCreateResult').innerHTML=`<div class="messageBubble waitingMessage">${esc(err.message)}</div>`;
    toast(err.message);
  }finally{
    btn.disabled=!inquiryServiceReady;
    btn.textContent='문의 등록';
  }
});

$('inquiryLookupForm')?.addEventListener('submit',async(e)=>{
  e.preventDefault();

  const customerId=$('lookupCustomerId').value;
  const password=$('lookupPassword').value;

  try{
    const data=await inquiryApi({action:'list',customerId,password});
    lookupCredentials={customerId,password};
    renderMine(data.items);
  }catch(err){
    $('myInquiryList').innerHTML=`<p class="hint">${esc(err.message)}</p>`;
    $('myInquiryDetail').innerHTML='';
  }
});

function renderMine(items){
  $('myInquiryDetail').innerHTML='';
  $('myInquiryList').innerHTML=items.map(item=>`
    <button class="myInquiryItem" data-open-inquiry="${esc(item.id)}">
      <span>
        <b>${esc(item.title)}</b>
        <small>${esc(categoryNames[item.category]||item.category)} · ${esc(formatDate(item.createdAt))}</small>
      </span>
      <span class="status ${item.status==='answered'?'answered':'waiting'}">
        ${item.status==='answered'?'답변완료':'답변대기'}
      </span>
    </button>
  `).join('');

  document.querySelectorAll('[data-open-inquiry]').forEach(btn=>{
    btn.addEventListener('click',()=>openMine(btn.dataset.openInquiry));
  });
}

async function openMine(inquiryId){
  if(!lookupCredentials)return;

  try{
    const data=await inquiryApi({
      action:'read',
      inquiryId,
      ...lookupCredentials
    });

    const x=data.item;

    $('myInquiryDetail').innerHTML=`
      <article class="inquiryDetail">
        <div class="inquiryMeta">
          <span>${esc(categoryNames[x.category]||x.category)}</span>
          <span>${esc(languageNames[x.language]||x.language)}</span>
          <span>${esc(formatDate(x.createdAt))}</span>
        </div>
        <h3>${esc(x.title)}</h3>
        <div class="messageBubble customerMessage">${esc(x.content).replace(/\n/g,'<br>')}</div>
        <h4>매장 답변</h4>
        ${x.answer
          ? `<div class="messageBubble adminMessage">${esc(x.answer).replace(/\n/g,'<br>')}</div>`
          : `<div class="messageBubble waitingMessage">아직 답변 전입니다. 확인 후 답변드릴게요.</div>`}
      </article>`;
  }catch(err){
    toast(err.message);
  }
}

const params=new URLSearchParams(location.search);
const lang=params.get('lang');
if(lang && ['ko','en','ja','zh'].includes(lang) && $('inqLanguage')){
  $('inqLanguage').value=lang;
}

checkInquiryService();
