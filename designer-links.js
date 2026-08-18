(() => {
  const designerPages = {'박상일':'/designer-park-sangil.html','설빈':'/designer-seolbin.html','정민':'/designer-jeongmin.html','서단':'/designer-seodan.html','혜진':'/designer-hyejin.html','지형':'/designer-jihyeong.html','호빈':'/designer-hobin.html','백건':'/designer-baekgeon.html'};
  function loadEditor(){ if(document.querySelector('script[data-designer-detail-admin]'))return; const s=document.createElement('script');s.type='module';s.src='/designer-detail-admin.js';s.dataset.designerDetailAdmin='1';document.head.appendChild(s); }
  function enhance(){ const list=document.querySelector('#designerList'); if(!list)return; list.querySelectorAll('.designer').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim(),href=designerPages[name];if(!href)return;card.style.cursor='pointer';card.tabIndex=0;card.setAttribute('role','link');card.onclick=e=>{if(!e.target.closest('a,button,input,select,textarea'))location.href=href};card.onkeydown=e=>{if(e.key==='Enter'){location.href=href}};const body=card.querySelector('.body');if(body&&!body.querySelector('[data-profile-link]')){const a=document.createElement('a');a.href=href;a.className='profileLink';a.dataset.profileLink='1';a.textContent='상세 프로필 보기 →';body.appendChild(a)}}); }
  function init(){loadEditor();enhance();const l=document.querySelector('#designerList');if(l)new MutationObserver(enhance).observe(l,{childList:true,subtree:true});}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
// 가격표 애드온: 기존 사이트 구조는 건드리지 않고 가격표 링크/관리자 탭만 추가합니다.
import('/price-addon.js').catch(err=>console.error('price addon load error', err));
