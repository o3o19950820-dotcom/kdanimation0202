import { db, doc, onSnapshot } from './firebase.js';

const pageName = document.querySelector('.profileHero h1')?.textContent?.trim();

function setText(el, value) {
  if (el && value) el.textContent = value;
}

if (pageName) {
  onSnapshot(
    doc(db, 'site', 'designers'),
    (snap) => {
      if (!snap.exists()) return;

      const items = Array.isArray(snap.data().items) ? snap.data().items : [];
      const designer = items.find((item) => String(item?.name || '').trim() === pageName);
      if (!designer) return;

      const photoBox = document.querySelector('.profilePhoto');
      if (photoBox && designer.photo) {
        photoBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = designer.photo;
        img.alt = `${pageName} 디자이너 프로필 사진`;
        img.loading = 'eager';
        photoBox.appendChild(img);
      }

      const badge = document.querySelector('.profileHero .badge');
      setText(badge, designer.position);

      const metaSpans = document.querySelectorAll('.profileMeta span');
      if (metaSpans[0]) setText(metaSpans[0], designer.keyword);

      const intro = document.querySelector('.profileHero > div:last-child > p');
      setText(intro, designer.intro);

      // 검색엔진/공유 미리보기용 title·description도 실제 관리자 정보에 맞춰 갱신
      if (designer.position) {
        document.title = `${pageName} ${designer.position} | 준오헤어 건대역2호점`;
      }
      const description = document.querySelector('meta[name="description"]');
      if (description && designer.intro) {
        description.setAttribute(
          'content',
          `준오헤어 건대역2호점 ${pageName} ${designer.position || '디자이너'}. ${designer.keyword || ''} ${designer.intro}`.trim()
        );
      }
    },
    (err) => console.error('Designer profile sync error:', err)
  );
}
