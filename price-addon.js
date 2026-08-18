const PRICE_CATEGORIES = [
  ['cut','커트'],
  ['perm','펌'],
  ['color','컬러'],
  ['care','케어'],
  ['extra','기타']
];

const priceEsc = (s='') => String(s).replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));

function injectPriceStyles(){
  if(document.getElementById('priceAddonStyle')) return;
  const style=document.createElement('style');
  style.id='priceAddonStyle';
  style.textContent=`
    .priceAdminTable{display:grid;gap:10px;margin-top:14px}
    .priceAdminRow{display:grid;grid-template-columns:120px 1.1fr .7fr 1.2fr auto;gap:8px;align-items:center;padding:10px;border:1px solid var(--line,#e8ddd2);border-radius:14px;background:#fff}
    .priceAdminRow select,.priceAdminRow input{width:100%;min-width:0;padding:10px 11px;border:1px solid var(--line,#e8ddd2);border-radius:10px;background:#fff;font:inherit}
    .priceAdminActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
    .priceAdminEmpty{padding:18px;border:1px dashed var(--line,#e8ddd2);border-radius:14px;color:#806f62;background:#fffaf5}
    .utilityGrid.priceAddonGrid{grid-template-columns:repeat(5,1fr)}
    @media(max-width:900px){.utilityGrid.priceAddonGrid{grid-template-columns:1fr 1fr}}
    @media(max-width:640px){.utilityGrid.priceAddonGrid{grid-template-columns:1fr}}
    @media(max-width:760px){.priceAdminRow{grid-template-columns:1fr}.priceAdminRow .mini{width:100%}}
  `;
  document.head.appendChild(style);
}

function injectPublicPriceLink(){
  const nav=document.querySelector('.top .links, header .links, nav.links');
  if(nav && !nav.querySelector('[data-price-link]')){
    const adminBtn=nav.querySelector('#adminOpen,.adminTopBtn');
    const a=document.createElement('a');
    a.href='/price.html';
    a.textContent='가격표';
    a.dataset.priceLink='1';
    if(adminBtn) nav.insertBefore(a,adminBtn); else nav.appendChild(a);
  }

  const utility=document.querySelector('.utilityGrid');
  if(utility && !utility.querySelector('[data-price-utility]')){
    utility.classList.add('priceAddonGrid');
    const a=document.createElement('a');
    a.className='utilityCard';
    a.href='/price.html';
    a.dataset.priceUtility='1';
    a.innerHTML='<span class="utilityIcon">₩</span><span><strong>가격표</strong><small>커트 · 펌 · 컬러 · 케어</small></span><i>→</i>';
    utility.prepend(a);
  }
}

function categoryOptions(selected='cut'){
  return PRICE_CATEGORIES.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('');
}

async function getPriceItems(){
  const res=await fetch('/api/prices',{cache:'no-store'});
  const data=await res.json().catch(()=>({ok:false,message:'가격표 응답 오류'}));
  if(!res.ok || !data.ok) throw new Error(data.message||'가격표를 불러오지 못했습니다.');
  return Array.isArray(data.items)?data.items:[];
}

async function savePriceItems(items){
  const {auth}=await import('./firebase.js');
  const user=auth.currentUser;
  if(!user) throw new Error('관리자 로그인이 필요합니다.');
  const token=await user.getIdToken();
  const res=await fetch('/api/prices',{
    method:'POST',
    headers:{'content-type':'application/json','authorization':`Bearer ${token}`},
    body:JSON.stringify({items})
  });
  const data=await res.json().catch(()=>({ok:false,message:'가격표 저장 응답 오류'}));
  if(!res.ok || !data.ok) throw new Error(data.message||'가격표 저장에 실패했습니다.');
  return data.items||[];
}

function readRows(){
  return [...document.querySelectorAll('#priceAdminRows .priceAdminRow')].map(row=>({
    category:row.querySelector('[data-f="category"]').value,
    name:row.querySelector('[data-f="name"]').value.trim(),
    price:row.querySelector('[data-f="price"]').value.trim(),
    note:row.querySelector('[data-f="note"]').value.trim()
  })).filter(x=>x.name && x.price);
}

function rowHtml(item={category:'cut',name:'',price:'',note:''}){
  return `<div class="priceAdminRow">
    <select data-f="category">${categoryOptions(item.category)}</select>
    <input data-f="name" value="${priceEsc(item.name)}" placeholder="시술명 예: 여성 커트">
    <input data-f="price" value="${priceEsc(item.price)}" placeholder="가격 예: 35,000원~">
    <input data-f="note" value="${priceEsc(item.note||'')}" placeholder="비고/안내 (선택)">
    <button type="button" class="mini" data-price-remove>삭제</button>
  </div>`;
}

async function renderPriceAdmin(){
  const content=document.getElementById('adminContent');
  if(!content) return;
  content.innerHTML='<p class="hint">가격표를 불러오는 중...</p>';
  try{
    const items=await getPriceItems();
    content.innerHTML=`
      <h3>가격표 관리</h3>
      <p class="hint">여기서 저장하면 /price.html에 바로 반영됩니다. 실제 매장 가격만 입력해 주세요.</p>
      <div id="priceAdminRows" class="priceAdminTable">${items.length?items.map(rowHtml).join(''):'<div class="priceAdminEmpty">아직 등록된 가격이 없습니다. 아래 버튼으로 첫 항목을 추가해 주세요.</div>'}</div>
      <div class="priceAdminActions">
        <button type="button" class="btn light" id="priceAddRow">+ 가격 항목 추가</button>
        <button type="button" class="btn" id="priceSaveAll">가격표 전체 저장</button>
      </div>`;

    const rows=document.getElementById('priceAdminRows');
    document.getElementById('priceAddRow').onclick=()=>{
      rows.querySelector('.priceAdminEmpty')?.remove();
      rows.insertAdjacentHTML('beforeend',rowHtml());
    };
    rows.addEventListener('click',e=>{
      const btn=e.target.closest('[data-price-remove]');
      if(!btn)return;
      btn.closest('.priceAdminRow')?.remove();
      if(!rows.querySelector('.priceAdminRow')) rows.innerHTML='<div class="priceAdminEmpty">등록된 가격이 없습니다.</div>';
    });
    document.getElementById('priceSaveAll').onclick=async()=>{
      try{
        const saved=await savePriceItems(readRows());
        if(window.toast) window.toast('가격표 저장 완료');
        else alert('가격표 저장 완료');
        renderPriceAdmin();
      }catch(err){ alert(err.message); }
    };
  }catch(err){
    content.innerHTML=`<p class="hint">${priceEsc(err.message)}</p>`;
  }
}

function injectAdminPriceTab(){
  const tabs=document.querySelector('.adminTabs');
  if(!tabs || tabs.querySelector('[data-price-admin-tab]')) return;
  const btn=document.createElement('button');
  btn.type='button';
  btn.textContent='가격표';
  btn.dataset.priceAdminTab='1';
  const inquiry=tabs.querySelector('[data-admin="inquiry"]');
  if(inquiry) tabs.insertBefore(btn,inquiry); else tabs.appendChild(btn);

  tabs.addEventListener('click',e=>{
    if(e.target.closest('button[data-admin]')) btn.classList.remove('on');
  },true);

  btn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    tabs.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    renderPriceAdmin();
  },true);
}

function initPriceAddon(){
  injectPriceStyles();
  injectPublicPriceLink();
  injectAdminPriceTab();
  const dialog=document.getElementById('adminDialog');
  if(dialog) new MutationObserver(()=>injectAdminPriceTab()).observe(dialog,{childList:true,subtree:true});
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPriceAddon);
else initPriceAddon();
