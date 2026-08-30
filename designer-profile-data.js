import { db, doc, onSnapshot } from './firebase.js';

const DESIGNER_SLOTS = [
  { slug:'park-sangil', legacyName:'박상일', path:'/designer-park-sangil.html' },
  { slug:'seolbin', legacyName:'설빈', path:'/designer-seolbin.html' },
  { slug:'jeongmin', legacyName:'정민', path:'/designer-jeongmin.html' },
  { slug:'seodan', legacyName:'서단', path:'/designer-seodan.html' },
  { slug:'hyejin', legacyName:'혜진', path:'/designer-hyejin.html' },
  { slug:'jihyeong', legacyName:'지형', path:'/designer-jihyeong.html' },
  { slug:'hobin', legacyName:'호빈', path:'/designer-hobin.html' },
  { slug:'baekgeon', legacyName:'백건', path:'/designer-baekgeon.html' }
];

const currentPath = location.pathname.replace(/\/+$/, '') || '/';
const slot = DESIGNER_SLOTS.find(x => x.path === currentPath) || null;
const originalPageName = document.querySelector('.profileHero h1')?.textContent?.trim() || slot?.legacyName || '';

function setText(el, value) {
  if (!el || !value) return;
  el.textContent = value;
}

function setMultiline(el, value) {
  if (!el || !value) return;
  el.textContent = value;
  el.style.whiteSpace = 'pre-line';
}

function factByLabel(label) {
  return [...document.querySelectorAll('.fact')].find(x => x.querySelector('b')?.textContent?.trim() === label);
}

function sectionCardByTitle(title) {
  return [...document.querySelectorAll('.seoCard')].find(x => x.querySelector('h2')?.textContent?.trim() === title);
}

function findDesigner(items) {
  if (!Array.isArray(items) || !items.length) return null;

  if (slot?.slug) {
    const bySlug = items.find(v => String(v?.slug || '').trim() === slot.slug);
    if (bySlug) return bySlug;
  }

  if (slot?.legacyName) {
    const byLegacyName = items.find(v => String(v?.name || '').trim() === slot.legacyName);
    if (byLegacyName) return byLegacyName;
  }

  if (originalPageName) {
    const byPageName = items.find(v => String(v?.name || '').trim() === originalPageName);
    if (byPageName) return byPageName;
  }

  const index = slot ? DESIGNER_SLOTS.findIndex(x => x.slug === slot.slug) : -1;
  if (index >= 0 && items.length === DESIGNER_SLOTS.length) return items[index] || null;

  return null;
}

function updateFaq(item) {
  const faqCard = sectionCardByTitle('자주 묻는 질문');
  if (!faqCard) return;

  const placeholders = faqCard.querySelectorAll('.placeholder');
  const faqData = [
    [item.faq1q, item.faq1a],
    [item.faq2q, item.faq2a],
    [item.faq3q, item.faq3a]
  ];

  placeholders.forEach((el, i) => {
    const [q, a] = faqData[i] || [];
    if (!q && !a) return;
    el.innerHTML = '';
    if (q) {
      const strong = document.createElement('strong');
      strong.textContent = q;
      el.appendChild(strong);
    }
    if (a) {
      const p = document.createElement('div');
      p.textContent = a;
      p.style.whiteSpace = 'pre-line';
      el.appendChild(p);
    }
  });
}

function updateStructuredData(item, displayName) {
  const old = document.querySelector('script[data-live-designer-schema]');
  if (old) old.remove();

  const faq = [
    [item.faq1q,item.faq1a],
    [item.faq2q,item.faq2a],
    [item.faq3q,item.faq3a]
  ].filter(([q,a]) => q && a)
   .map(([q,a]) => ({
     '@type':'Question',
     name:q,
     acceptedAnswer:{'@type':'Answer',text:a}
   }));

  const person = {
    '@type':'Person',
    name:displayName,
    jobTitle:item.position || '디자이너',
    description:item.intro || item.keyword || '',
    url:location.href,
    worksFor:{
      '@type':'HairSalon',
      name:'준오헤어 건대역2호점',
      url:'https://junokd02.com/'
    }
  };

  if (item.photo) person.image = item.photo;
  if (item.specialties) person.knowsAbout = item.specialties;

  const graph = [person];
  if (faq.length) graph.push({'@type':'FAQPage',mainEntity:faq});

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.liveDesignerSchema = '1';
  script.textContent = JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(script);
}

function updatePage(item) {
  const displayName = String(item.name || originalPageName || slot?.legacyName || '디자이너').trim();
  const displayPosition = String(item.position || '디자이너').trim();

  setText(document.querySelector('.profileHero h1'), displayName);
  setText(document.querySelector('.profileHero .badge'), displayPosition);

  const breadcrumb = document.querySelector('.breadcrumb span:last-child');
  setText(breadcrumb, displayName);

  const meta = document.querySelectorAll('.profileMeta span');
  setText(meta[0], item.keyword);

  const intro = document.querySelector('.profileHero > div:last-child > p');
  setMultiline(intro, item.intro);

  const photoBox = document.querySelector('.profilePhoto');
  if (photoBox && item.photo) {
    photoBox.innerHTML = '';
    const img = document.createElement('img');
    img.src = item.photo;
    img.alt = `${displayName} ${displayPosition} 프로필 사진`;
    img.loading = 'eager';
    photoBox.appendChild(img);
  }

  const factMap = {
    '전문 분야':'specialties',
    '추천 고객':'recommendedFor',
    '상담 포인트':'consultationPoint',
    '예약 안내':'bookingInfo'
  };
  Object.entries(factMap).forEach(([label,key]) => {
    const box = factByLabel(label)?.querySelector('.placeholder');
    setMultiline(box, item[key]);
  });

  const cardMap = {
    '전문 스타일':'professionalStyles',
    '상담 방식':'consultationMethod',
    '시술 사례':'caseStory',
    '홈케어 팁':'homeCare'
  };
  Object.entries(cardMap).forEach(([title,key]) => {
    const box = sectionCardByTitle(title)?.querySelector('.placeholder');
    setMultiline(box, item[key]);
  });

  updateFaq(item);

  const ctaTitle = document.querySelector('.ctaBox h2');
  if (ctaTitle) ctaTitle.textContent = `${displayName} ${displayPosition}에게 상담 전 문의하기`;

  document.title = `${displayName} ${displayPosition} | 준오헤어 건대역2호점`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    const summary = [item.keyword, item.intro, item.specialties].filter(Boolean).join(' ');
    desc.setAttribute('content', `준오헤어 건대역2호점 ${displayName} ${displayPosition}. ${summary}`.trim());
  }

  updateStructuredData(item, displayName);
}

if (slot || originalPageName) {
  onSnapshot(
    doc(db, 'site', 'designers'),
    (snap) => {
      if (!snap.exists()) return;
      const items = Array.isArray(snap.data().items) ? snap.data().items : [];
      const item = findDesigner(items);
      if (item) updatePage(item);
    },
    (err) => console.error('Designer profile sync error:', err)
  );
}
