import { auth } from './firebase.js';

const DETAIL_FIELDS = [
  ['name', '이름', 'input'],
  ['position', '직급', 'input'],
  ['keyword', '메인 키워드', 'input'],
  ['intro', '메인 소개글', 'textarea'],
  ['specialties', '전문 분야', 'textarea'],
  ['recommendedFor', '추천 고객', 'textarea'],
  ['consultationPoint', '상담 포인트', 'textarea'],
  ['bookingInfo', '예약 안내', 'textarea'],
  ['professionalStyles', '전문 스타일', 'textarea'],
  ['consultationMethod', '상담 방식', 'textarea'],
  ['caseStory', '시술 사례', 'textarea'],
  ['homeCare', '홈케어 팁', 'textarea'],
  ['faq1q', 'FAQ 1 질문', 'input'],
  ['faq1a', 'FAQ 1 답변', 'textarea'],
  ['faq2q', 'FAQ 2 질문', 'input'],
  ['faq2a', 'FAQ 2 답변', 'textarea'],
  ['faq3q', 'FAQ 3 질문', 'input'],
  ['faq3a', 'FAQ 3 답변', 'textarea']
];

const $id = (id) => document.getElementById(id);
const esc = (s='') => String(s).replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));

function toast(text) {
  const el = $id('toast');
  if (!el) return alert(text);
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 2200);
}

async function adminSaveDesigners(items) {
  const user = auth.currentUser;
  if (!user) throw new Error('관리자 로그인이 필요합니다.');
  const token = await user.getIdToken();

  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ action:'saveSite', name:'designers', items })
  });

  const data = await res.json().catch(() => ({ok:false,message:'관리자 서버 응답 오류'}));
  if (!res.ok || !data.ok) throw new Error(data.message || '저장 실패');
  return data;
}

function compress(file, max=900, quality=.72) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
        else if (h > max) { w = Math.round(w * max / h); h = max; }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fieldHtml([key, label, type], value='') {
  const help = {
    specialties:'예: 레이어드컷 / 남성 커트 / 디자인 컬러',
    recommendedFor:'예: 손질이 쉬운 스타일을 원하는 고객, 얼굴형 보완이 필요한 고객',
    consultationPoint:'예: 얼굴형·모질·손질 습관·최근 시술 이력을 함께 확인합니다.',
    bookingInfo:'예: 네이버예약에서 디자이너 선택 후 예약 / 당일 예약은 매장 문의',
    professionalStyles:'실제로 많이 하는 스타일 3~5개와 각 스타일 특징을 적어주세요.',
    consultationMethod:'상담할 때 중요하게 보는 요소와 스타일을 제안하는 방식을 적어주세요.',
    caseStory:'실제 상담 사례를 고객 고민 → 모발 상태 → 제안 → 결과 순서로 적어주세요.',
    homeCare:'시술 후 집에서 관리하는 방법과 손질 팁을 적어주세요.'
  }[key] || label;

  if (type === 'textarea') {
    return `<label><b>${esc(label)}</b><textarea id="dd_${key}" placeholder="${esc(help)}">${esc(value)}</textarea></label>`;
  }
  return `<label><b>${esc(label)}</b><input id="dd_${key}" value="${esc(value)}" placeholder="${esc(help)}"></label>`;
}

function goBackToDesignerList() {
  const btn = document.querySelector('.adminTabs button[data-admin="designer"]');
  if (btn) btn.click();
}

function openDetailEditor(index) {
  const state = window.__JUNO_STATE__ || window.__JUNO_DEFAULTS__;
  const designers = JSON.parse(JSON.stringify(state?.designers || []));
  const item = designers[index];
  if (!item) return;

  const content = $id('adminContent');
  if (!content) return;

  content.innerHTML = `
    <div class="adminInquiryHead">
      <div>
        <h3>${esc(item.name || '디자이너')} 상세페이지 편집</h3>
        <p class="hint">여기서 저장하면 메인 프로필 + 상세 프로필 내용이 함께 바뀝니다.</p>
      </div>
      <button class="mini" id="dd_back">← 디자이너 목록</button>
    </div>

    <div class="card" style="margin-bottom:14px">
      <h4>프로필 사진</h4>
      ${item.photo ? `<img src="${item.photo}" alt="" style="width:150px;height:190px;object-fit:cover;border-radius:16px;margin-bottom:12px">` : '<p class="hint">현재 등록된 사진이 없습니다.</p>'}
      <input id="dd_photo" type="file" accept="image/*">
      <p class="hint">새 사진을 고르지 않으면 기존 사진이 유지됩니다.</p>
    </div>

    <div class="form card">
      ${DETAIL_FIELDS.map(f => fieldHtml(f, item[f[0]] || '')).join('')}
      <button class="btn" id="dd_save">상세페이지 저장</button>
      <button class="btn light" id="dd_cancel">취소</button>
    </div>
  `;

  $id('dd_back').onclick = goBackToDesignerList;
  $id('dd_cancel').onclick = goBackToDesignerList;

  $id('dd_save').onclick = async () => {
    const saveBtn = $id('dd_save');
    try {
      saveBtn.disabled = true;
      saveBtn.textContent = '저장 중...';

      const updated = {...item};
      DETAIL_FIELDS.forEach(([key]) => {
        updated[key] = ($id(`dd_${key}`)?.value || '').trim();
      });

      const photoFile = $id('dd_photo')?.files?.[0];
      if (photoFile) updated.photo = await compress(photoFile);

      designers[index] = updated;
      await adminSaveDesigners(designers);

      if (window.__JUNO_STATE__) {
        window.__JUNO_STATE__.designers = designers;
        window.__JUNO_RENDER__?.();
      }

      toast('디자이너 상세페이지 저장 완료');
      goBackToDesignerList();
    } catch (err) {
      console.error(err);
      toast(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '상세페이지 저장';
      }
    }
  };
}

function injectDetailButtons() {
  const content = $id('adminContent');
  if (!content) return;

  const editButtons = content.querySelectorAll('button[data-edit="designers"]');
  editButtons.forEach(editBtn => {
    const row = editBtn.closest('.row');
    const actions = editBtn.parentElement;
    if (!row || !actions || actions.querySelector('[data-detail-designer]')) return;

    const btn = document.createElement('button');
    btn.className = 'mini';
    btn.textContent = '상세페이지 편집';
    btn.dataset.detailDesigner = editBtn.dataset.i;
    btn.style.marginLeft = '4px';

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openDetailEditor(Number(btn.dataset.detailDesigner));
    };

    actions.insertBefore(btn, editBtn);
  });
}

const observer = new MutationObserver(() => injectDetailButtons());
observer.observe(document.body, {childList:true, subtree:true});

document.addEventListener('click', (e) => {
  const designerTab = e.target.closest?.('.adminTabs button[data-admin="designer"]');
  if (designerTab) setTimeout(injectDetailButtons, 0);
});

injectDetailButtons();
