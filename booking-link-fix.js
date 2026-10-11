/* Official reservation entry, verified manually in Naver Maps on 2026-10-11.
   Limit changes to booking links; do not alter map/directions links. */
(()=>{
  'use strict';
  const BOOK='https://map.naver.com/p/entry/place/33431131?placePath=%2Fstylist';
  const OLD=/^https:\/\/map\.naver\.com\/p\/search\//i;
  const ids=new Set(['reserveHeader','reserveTop','reserveTopMobile','reserveBottom']);
  function update(){
    document.querySelectorAll('a[href]').forEach(a=>{
      const href=a.getAttribute('href')||'';
      if(!OLD.test(href))return;
      const label=(a.textContent||'')+' '+(a.getAttribute('aria-label')||'');
      if(ids.has(a.id)||/예약/.test(label)){
        a.href=BOOK;a.target='_blank';a.rel='noopener noreferrer';
      }
    });
  }
  update();
  let scheduled=false;
  const mo=new MutationObserver(()=>{
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;update()});
  });
  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();
