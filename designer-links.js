(() => {
  const SLOTS = [
    {slug:'park-sangil', legacyName:'박상일', href:'/designer-park-sangil.html'},
    {slug:'seolbin', legacyName:'설빈', href:'/designer-seolbin.html'},
    {slug:'jeongmin', legacyName:'정민', href:'/designer-jeongmin.html'},
    {slug:'seodan', legacyName:'서단', href:'/designer-seodan.html'},
    {slug:'hyejin', legacyName:'혜진', href:'/designer-hyejin.html'},
    {slug:'jihyeong', legacyName:'지형', href:'/designer-jihyeong.html'},
    {slug:'hobin', legacyName:'호빈', href:'/designer-hobin.html'},
    {slug:'baekgeon', legacyName:'백건', href:'/designer-baekgeon.html'}
  ];

  async function loadEditor(){
    if(window.__JUNO_DESIGNER_DETAIL_LOADED__){
      window.__JUNO_INJECT_DESIGNER_DETAIL__?.();
      return;
    }

    try{
      await import('/designer-detail-admin.js?v=20260830-1');
      window.__JUNO_INJECT_DESIGNER_DETAIL__?.();
    }catch(err){
      console.error('designer detail admin load error', err);
    }
  }

  function currentDesigners(){
    return window.__JUNO_STATE__?.designers || window.__JUNO_DEFAULTS__?.designers || [];
  }

  function resolveSlot(card,index){
    const items=currentDesigners();
    const item=items[index] || {};
    const slug=String(item.slug||'').trim();

    if(slug){
      const bySlug=SLOTS.find(x=>x.slug===slug);
      if(bySlug) return bySlug;
    }

    const name=card.querySelector('h3')?.textContent?.trim() || String(item.name||'').trim();
    const byName=SLOTS.find(x=>x.legacyName===name);
    if(byName) return byName;

    if(items.length===SLOTS.length) return SLOTS[index] || null;
    return null;
  }

  function enhance(){
    const list=document.querySelector('#designerList');
    if(!list) return;

    [...list.querySelectorAll('.designer')].forEach((card,index)=>{
      const slot=resolveSlot(card,index);
      if(!slot) return;

      card.dataset.designerSlug=slot.slug;
      card.style.cursor='pointer';
      card.tabIndex=0;
      card.setAttribute('role','link');
      card.setAttribute('aria-label',`${card.querySelector('h3')?.textContent?.trim() || '디자이너'} 상세 프로필 보기`);

      card.onclick=e=>{
        if(!e.target.closest('a,button,input,select,textarea')) location.href=slot.href;
      };

      card.onkeydown=e=>{
        if(e.key==='Enter') location.href=slot.href;
      };

      const body=card.querySelector('.body');
      let a=body?.querySelector('[data-profile-link]');
      if(body && !a){
        a=document.createElement('a');
        a.className='profileLink';
        a.dataset.profileLink='1';
        a.textContent='상세 프로필 보기 →';
        body.appendChild(a);
      }
      if(a) a.href=slot.href;
    });
  }

  function init(){
    loadEditor();
    enhance();

    const list=document.querySelector('#designerList');
    if(list) new MutationObserver(enhance).observe(list,{childList:true,subtree:true});

    document.addEventListener('click', e=>{
      if(e.target.closest?.('.adminTabs button[data-admin="designer"]')){
        loadEditor();
        setTimeout(()=>window.__JUNO_INJECT_DESIGNER_DETAIL__?.(), 100);
      }
    });
  }

  document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',init)
    : init();
})();

// 가격표 애드온: 기존 사이트 구조는 건드리지 않고 가격표 링크/관리자 탭만 추가합니다.
import('/price-addon.js').catch(err=>console.error('price addon load error', err));

// 브랜드 포털: 첫 화면만 공식 사이트형 진입 구조로 강화하고 기존 기능은 그대로 유지합니다.
import('/brand-portal.js?v=20260830-1').catch(err=>console.error('brand portal load error', err));
