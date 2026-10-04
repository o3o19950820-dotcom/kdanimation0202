(() => {
  const CSS_ID = 'juno-brand-portal-css';
  const VERSION = '20260830-1';

  function loadStyles(){
    if(document.getElementById(CSS_ID)) return;
    const link=document.createElement('link');
    link.id=CSS_ID;
    link.rel='stylesheet';
    link.href=`/brand-portal.css?v=${VERSION}`;
    document.head.appendChild(link);
  }

  function makePortalCard({no,en,title,desc,href}){
    const a=document.createElement('a');
    a.className='brandPortalCard';
    a.href=href;
    a.innerHTML=`
      <span class="brandPortalCardNo">${no}</span>
      <span class="brandPortalCardEn">${en}</span>
      <strong>${title}</strong>
      <small>${desc}</small>
      <span class="brandPortalArrow" aria-hidden="true">↘</span>
    `;
    return a;
  }

  function syncReservationLinks(){
    const source=document.getElementById('reserveHeader') || document.getElementById('reserveTop');
    const href=source?.getAttribute('href') || '#';
    const target=document.getElementById('brandPortalReserve');
    if(target) target.setAttribute('href',href);
  }

  function enhanceHeader(){
    const header=document.querySelector('.top');
    if(!header) return;
    document.documentElement.classList.add('brandPortalActive');
    header.classList.add('brandPortalHeader');
    const logo=header.querySelector('.logoImage img');
    if(logo){
      logo.src='/assets/logo-white.png';
      logo.alt='준오헤어 건대역2호점';
    }
  }

  function enhanceHero(){
    const hero=document.querySelector('.hero.heroPhoto');
    const grid=hero?.querySelector('.heroGrid');
    const heroText=hero?.querySelector('.heroText');
    if(!hero || !grid || !heroText || hero.dataset.brandPortalReady==='1') return;

    hero.dataset.brandPortalReady='1';
    hero.classList.add('brandPortal');
    grid.classList.add('brandPortalGrid');
    heroText.classList.add('brandPortalIntro');

    const kicker=heroText.querySelector('.heroKicker');
    if(kicker) kicker.textContent='JUNO HAIR · KONKUK UNIV. 2';

    const oldTitle=document.getElementById('heroTitle');
    if(oldTitle && oldTitle.tagName.toLowerCase()==='h1'){
      const statement=document.createElement('p');
      statement.id='heroTitle';
      statement.className='brandPortalStatement';
      statement.innerHTML=oldTitle.innerHTML;
      oldTitle.replaceWith(statement);
    }else if(oldTitle){
      oldTitle.classList.add('brandPortalStatement');
    }

    if(!heroText.querySelector('.brandPortalName')){
      const name=document.createElement('h1');
      name.className='brandPortalName';
      name.innerHTML='준오헤어 <span>건대역2호점</span>';
      const title=document.getElementById('heroTitle');
      heroText.insertBefore(name,title || heroText.firstChild);
    }

    const actions=heroText.querySelector('.actions');
    if(actions) actions.classList.add('brandPortalLegacyActions');

    const portal=document.createElement('nav');
    portal.className='brandPortalMenu';
    portal.setAttribute('aria-label','준오헤어 건대역2호점 주요 메뉴');
    [
      {no:'01',en:'RESERVATION & LOCATION',title:'예약 & 오시는 길',desc:'네이버 예약 · 전화 · 지도 · 방문 안내',href:'#contact'},
      {no:'02',en:'DESIGNER MATCH',title:'디자이너 소개<br>& 나에게 맞는 디자이너',desc:'전문 분야 · 상세 프로필 · 맞춤 추천',href:'#designers'},
      {no:'03',en:'STYLE PORTFOLIO',title:'스타일 사진',desc:'커트 · 펌 · 컬러 · 케어 포트폴리오',href:'#styles'},
      {no:'04',en:'STORE',title:'매장 페이지 바로가기',desc:'매장 공간 · 이벤트 · 이용 안내 · FAQ',href:'#salon'}
    ].forEach(item=>portal.appendChild(makePortalCard(item)));
    grid.appendChild(portal);

    const scroll=document.createElement('a');
    scroll.className='brandPortalScroll';
    scroll.href='#salon';
    scroll.innerHTML='<span>EXPLORE JUNO HAIR KONKUK 2</span><b aria-hidden="true">↓</b>';
    hero.appendChild(scroll);
  }

  function enhanceDesignerSection(){
    const section=document.getElementById('designers');
    const head=section?.querySelector('.head');
    if(!section || !head || head.querySelector('.brandDesignerMatch')) return;

    const a=document.createElement('a');
    a.className='brandDesignerMatch';
    a.href='/hair-match.html';
    a.innerHTML='<span>DESIGNER MATCH</span><strong>나에게 맞는 디자이너 찾기</strong><i aria-hidden="true">→</i>';
    head.appendChild(a);
  }

  function enhanceContact(){
    const section=document.getElementById('contact');
    const wrap=section?.querySelector('.wrap');
    if(!section || !wrap || wrap.querySelector('.brandContactPanel')) return;

    const panel=document.createElement('div');
    panel.className='brandContactPanel';
    panel.innerHTML=`
      <div>
        <span>RESERVATION · LOCATION</span>
        <h3>준오헤어 건대역2호점 예약 & 오시는 길</h3>
        <p>서울 광진구 능동로 109 2층 · 건대입구역 인근<br>월~토 10:00~20:30 / 일요일 10:00~18:30 · 02-497-6050</p>
      </div>
      <div class="brandContactActions">
        <a id="brandPortalReserve" class="brandContactPrimary" target="_blank" rel="noopener"><b>N</b> 네이버 예약</a>
        <a class="brandContactSecondary" href="tel:02-497-6050">전화 문의</a>
      </div>
    `;
    const cards=wrap.querySelector('.grid.cards');
    if(cards) wrap.insertBefore(panel,cards);
    else wrap.appendChild(panel);
    syncReservationLinks();
  }

  function enhanceMeta(){
    const theme=document.querySelector('meta[name="theme-color"]');
    if(theme) theme.setAttribute('content','#2b1712');
    document.body.classList.add('brandPortalBody');
  }

  function init(){
    loadStyles();
    enhanceHeader();
    enhanceHero();
    enhanceDesignerSection();
    enhanceContact();
    enhanceMeta();
    syncReservationLinks();

    const reserve=document.getElementById('reserveHeader');
    if(reserve){
      new MutationObserver(syncReservationLinks).observe(reserve,{attributes:true,attributeFilter:['href']});
    }
  }

  document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',init,{once:true})
    : init();
})();
