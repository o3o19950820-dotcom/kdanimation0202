/* JUNO HAIR: three existing tests grouped into one pre-visit hub. No database changes. */
(() => {
  'use strict';
  const CSS = `
  #junoVisitTestHub{padding:76px 20px;background:linear-gradient(125deg,#f9f3ed 0%,#f0e4d8 58%,#e8d7c7 100%);color:#422f25;scroll-margin-top:90px}
  #junoVisitTestHub *{box-sizing:border-box}
  #junoVisitTestHub .jvInner{max-width:1140px;margin:auto}
  #junoVisitTestHub .jvHeader{text-align:center;max-width:760px;margin:0 auto 32px}
  #junoVisitTestHub .jvEyebrow{display:inline-block;font-size:12px;letter-spacing:.18em;color:#8a6751;font-weight:800;margin-bottom:14px}
  #junoVisitTestHub h2{font-size:clamp(28px,4vw,45px);line-height:1.28;letter-spacing:-.045em;margin:0 0 18px;color:#3f2b22}
  #junoVisitTestHub .jvLead{font-size:clamp(14px,1.6vw,17px);color:#756053;line-height:1.85;margin:0}
  #junoVisitTestHub .jvGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  #junoVisitTestHub .jvCard{background:#fffbf7;border:1px solid rgba(110,77,53,.13);border-radius:23px;padding:30px 25px 25px;box-shadow:0 15px 32px rgba(85,55,38,.065);display:flex;flex-direction:column;min-height:324px;transition:transform .2s,box-shadow .2s}
  #junoVisitTestHub .jvCard:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(85,55,38,.12)}
  #junoVisitTestHub .jvNumber{font-size:12px;letter-spacing:.16em;font-weight:850;color:#af8b74}
  #junoVisitTestHub .jvIcon{font-size:30px;margin:20px 0 10px;line-height:1}
  #junoVisitTestHub h3{font-size:clamp(21px,2.2vw,25px);letter-spacing:-.04em;line-height:1.35;margin:0 0 12px;color:#443026}
  #junoVisitTestHub .jvCopy{font-size:14px;line-height:1.8;color:#776459;margin:0 0 20px;flex:1}
  #junoVisitTestHub .jvButton{display:flex;align-items:center;justify-content:space-between;text-decoration:none;background:#654534;border:1px solid #654534;color:#fff;border-radius:12px;padding:14px 17px;font-size:14px;font-weight:800;transition:background .2s}
  #junoVisitTestHub .jvButton:hover,#junoVisitTestHub .jvButton:focus-visible{background:#483126;color:#fff}
  #junoVisitTestHub .jvNote{margin:23px 0 0;text-align:center;color:#837064;font-size:12px;line-height:1.7}
  @media(max-width:850px){#junoVisitTestHub .jvGrid{grid-template-columns:1fr;max-width:540px;margin:auto}#junoVisitTestHub .jvCard{min-height:0;padding:25px}#junoVisitTestHub{padding:55px 18px}}
  @media(prefers-reduced-motion:reduce){#junoVisitTestHub .jvCard{transition:none}}
  `;
  function init(){
    if(document.querySelector('#junoVisitTestHub'))return;
    const anchor=document.querySelector('.junoQuizPromo') || document.querySelector('#salon') || document.querySelector('.quickInfoBar');
    if(!anchor)return;
    const style=document.createElement('style');style.id='junoVisitTestHubStyle';style.textContent=CSS;document.head.appendChild(style);
    const section=document.createElement('section');section.id='junoVisitTestHub';section.setAttribute('aria-labelledby','junoVisitTestHubTitle');
    section.innerHTML=`<div class="jvInner"><div class="jvHeader"><span class="jvEyebrow">JUNO HAIR · PERSONAL STYLE DISCOVERY</span><h2 id="junoVisitTestHubTitle">건대역2호점 방문 전,<br>나에게 어울리는 스타일을 찾아보세요</h2><p class="jvLead">어떤 머리가 나에게 잘 어울릴지 고민이라면? 세 가지 셀프 테스트로 얼굴형부터 모발 고민, 나와 맞는 디자이너까지 가볍게 알아보세요.</p></div><div class="jvGrid"><article class="jvCard"><span class="jvNumber">01 · FACE SHAPE</span><span class="jvIcon" aria-hidden="true">♡</span><h3>내 얼굴형에 어울리는 머리</h3><p class="jvCopy">둥근형·긴형·각진형·역삼각형·계란형. 남성·여성 스타일과 취향을 선택해 나만의 헤어 아이디어를 찾아보세요.</p><a class="jvButton" href="/face-shape-game.html">얼굴형 미니게임 시작 <span aria-hidden="true">↗</span></a></article><article class="jvCard"><span class="jvNumber">02 · HAIR CONSULTATION</span><span class="jvIcon" aria-hidden="true">✂</span><h3>나에게 맞는 헤어 시술 찾기</h3><p class="jvCopy">곱슬과 부스스함, 부족한 볼륨, 손상도, 평소 손질 습관을 체크하고 상담해 볼 만한 시술을 알아보세요.</p><a class="jvButton" href="/hair-consultation.html">헤어 시술 테스트 시작 <span aria-hidden="true">↗</span></a></article><article class="jvCard"><span class="jvNumber">03 · DESIGNER MATCH</span><span class="jvIcon" aria-hidden="true">✧</span><h3>나에게 맞는 디자이너 찾기</h3><p class="jvCopy">원하는 스타일과 헤어 고민에 맞는 담당 디자이너를 탐색해 보고, 프로필과 전문 분야를 확인해 보세요.</p><a class="jvButton" href="/hair-match.html">디자이너 찾기 시작 <span aria-hidden="true">↗</span></a></article></div><p class="jvNote">※ 테스트 결과는 스타일 선택에 도움을 드리는 참고용입니다. 최종 시술은 모발 상태 및 담당 디자이너와 상담 후 결정됩니다.</p></div>`;
    anchor.parentNode.insertBefore(section,anchor);
    // The previous add-on already renders the exact same three links. Collapse the older duplicate, leaving its other enhancements intact.
    const duplicate=document.querySelector('#junoFaceGamePromo');
    if(duplicate)duplicate.remove();
    const observer=new MutationObserver(()=>{const dup=document.querySelector('#junoFaceGamePromo');if(dup)dup.remove();});
    observer.observe(document.body,{childList:true,subtree:true});
    // Put the new unified category into the main navigation without changing the existing test pages.
    const nav=document.querySelector('.top .links');
    if(nav&&!nav.querySelector('[data-juno-test-hub]')){
      const link=document.createElement('a');link.href='/#junoVisitTestHub';link.textContent='방문 전 스타일 테스트';link.dataset.junoTestHub='true';
      const existing=nav.querySelector('a[href="/hair-consultation.html"]');
      if(existing){existing.replaceWith(link);}else{nav.insertBefore(link,nav.querySelector('#adminOpen')||null);}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
