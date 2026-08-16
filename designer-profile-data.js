import { db, doc, onSnapshot } from './firebase.js';

const pageName = document.querySelector('.profileHero h1')?.textContent?.trim();

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

function updateStructuredData(item) {
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

  const graph = [{
    '@type':'Person',
    name:item.name || pageName,
    jobTitle:item.position || '디자이너',
    description:item.intro || '',
    url:location.href,
    worksFor:{
      '@type':'HairSalon',
      name:'준오헤어 건대역2호점',
      url:'https://junokd02.com/'
    }
  }];

  if (faq.length) graph.push({'@type':'FAQPage',mainEntity:faq});

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.liveDesignerSchema = '1';
  script.textContent = JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(script);
}

if (pageName) {
  onSnapshot(
    doc(db, 'site', 'designers'),
    (snap) => {
      if (!snap.exists()) return;

      const items = Array.isArray(snap.data().items) ? snap.data().items : [];
      const item = items.find(v => String(v?.name || '').trim() === pageName);
      if (!item) return;

      const photoBox = document.querySelector('.profilePhoto');
      if (photoBox && item.photo) {
        photoBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = item.photo;
        img.alt = `${pageName} ${item.position || '디자이너'} 프로필 사진`;
        img.loading = 'eager';
        photoBox.appendChild(img);
      }

      setText(document.querySelector('.profileHero .badge'), item.position);

      const meta = document.querySelectorAll('.profileMeta span');
      setText(meta[0], item.keyword);

      const intro = document.querySelector('.profileHero > div:last-child > p');
      setMultiline(intro, item.intro);

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

      if (item.position) document.title = `${pageName} ${item.position} | 준오헤어 건대역2호점`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && (item.intro || item.keyword)) {
        desc.setAttribute('content',
          `준오헤어 건대역2호점 ${pageName} ${item.position || '디자이너'}. ${item.keyword || ''} ${item.intro || ''}`.trim()
        );
      }

      updateStructuredData(item);
    },
    (err) => console.error('Designer profile sync error:', err)
  );
}
