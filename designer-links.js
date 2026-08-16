(() => {
  const designerPages = {
    '박상일': '/designer-park-sangil.html',
    '설빈': '/designer-seolbin.html',
    '정민': '/designer-jeongmin.html',
    '서단': '/designer-seodan.html',
    '혜진': '/designer-hyejin.html',
    '지형': '/designer-jihyeong.html',
    '호빈': '/designer-hobin.html',
    '백건': '/designer-baekgeon.html'
  };

  function loadDesignerAdminEditor() {
    if (document.querySelector('script[data-designer-detail-admin]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/designer-detail-admin.js';
    script.dataset.designerDetailAdmin = '1';
    document.head.appendChild(script);
  }

  function addTopGuideLink() {
    const nav = document.querySelector('.top .links');
    if (!nav || nav.querySelector('[data-salon-guide-link]')) return;

    const link = document.createElement('a');
    link.href = '/salon-guide.html';
    link.textContent = '살롱가이드';
    link.dataset.salonGuideLink = '1';

    const hairTip = [...nav.querySelectorAll('a')].find(a => a.textContent.trim() === '헤어TIP');
    if (hairTip) nav.insertBefore(link, hairTip);
    else nav.prepend(link);
  }

  function addDesignerGuideLink() {
    const section = document.querySelector('#designers');
    if (!section) return;
    const head = section.querySelector('.head');
    if (!head || head.querySelector('[data-designer-guide-link]')) return;

    const link = document.createElement('a');
    link.href = '/designer-guide.html';
    link.className = 'mini';
    link.textContent = '디자이너 상세보기';
    link.dataset.designerGuideLink = '1';
    head.appendChild(link);
  }

  function enhanceDesignerCards() {
    const list = document.querySelector('#designerList');
    if (!list) return;

    list.querySelectorAll('.designer').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      const href = designerPages[name];
      if (!href) return;

      card.style.cursor = 'pointer';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${name} 디자이너 상세 프로필 보기`);

      card.onclick = (event) => {
        if (event.target.closest('a,button,input,select,textarea')) return;
        window.location.href = href;
      };

      card.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = href;
        }
      };

      const body = card.querySelector('.body');
      if (body && !body.querySelector('[data-profile-link]')) {
        const link = document.createElement('a');
        link.href = href;
        link.className = 'mini';
        link.textContent = '상세 프로필 보기 →';
        link.dataset.profileLink = '1';
        body.appendChild(link);
      }
    });
  }

  function init() {
    loadDesignerAdminEditor();
    addTopGuideLink();
    addDesignerGuideLink();
    enhanceDesignerCards();

    const list = document.querySelector('#designerList');
    if (list) {
      const observer = new MutationObserver(() => enhanceDesignerCards());
      observer.observe(list, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
