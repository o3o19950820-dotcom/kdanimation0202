// JUNO Hair - SEO Search Page Admin Add-on
// index.html 하단 </body> 바로 전에 아래 한 줄만 추가하세요.
// <script type="module" src="/seo-admin-addon.js"></script>

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuGSghmDO-daKTpBArSyB9jfKBOSAAc48",
  authDomain: "junokd02.firebaseapp.com",
  projectId: "junokd02",
  storageBucket: "junokd02.firebasestorage.app",
  messagingSenderId: "876136442795",
  appId: "1:876136442795:web:a5bbb63bc9587769b780ee",
  measurementId: "G-E24C2CYS4M"
};

const DEFAULT = {
  seoTitle:"건대 레이어드컷 | 중단발·긴머리 레이어드 스타일 | 준오헤어 건대역2호점",
  metaDescription:"건대 레이어드컷을 고민한다면 얼굴형, 모량, 모발 길이와 손질 방법을 함께 확인해보세요. 준오헤어 건대역2호점에서 중단발·긴머리 레이어드컷과 C컬, 레이어드펌 스타일을 상담할 수 있습니다.",
  keywords:["건대 레이어드컷","중단발 레이어드컷","긴머리 레이어드컷","레이어드 C컬"],
  heroTitle:"건대 레이어드컷,\n얼굴형과 길이에 맞게",
  heroIntro:"레이어드컷은 단순히 층을 많이 내는 커트가 아니라 얼굴 주변 라인, 모발 길이와 양, 평소 손질 방법에 따라 완성되는 분위기가 달라지는 스타일입니다. 건대에서 레이어드컷을 고민하고 있다면 먼저 내 모발에 맞는 디자인을 확인해보세요.",
  sections:[
    {title:"레이어드컷은 어떤 스타일인가요?",body:"레이어드컷은 모발에 층을 만들어 무거운 느낌을 줄이고 자연스러운 움직임을 표현하는 커트입니다. 같은 레이어드컷이라도 얼굴 주변 층이 어디에서 시작하는지, 전체 층을 얼마나 높게 만드는지에 따라 차분한 느낌부터 가볍고 풍성한 느낌까지 달라질 수 있습니다.\n\n특히 긴머리나 중단발에서 많이 선택하지만, 단순히 유행하는 사진을 그대로 따라가기보다는 현재 모발 길이와 모량, 얼굴 주변에서 원하는 볼륨을 함께 고려하는 것이 좋습니다."},
    {title:"중단발과 긴머리, 무엇이 다를까요?",body:"중단발은 층의 위치가 전체 실루엣에 큰 영향을 줍니다. 얼굴 주변에 자연스러운 라인을 만들면서도 끝부분이 지나치게 가벼워지지 않도록 현재 모량과 손질 습관을 함께 보는 것이 중요합니다.\n\n긴머리는 길이를 크게 줄이지 않아도 층을 이용해 답답한 느낌을 덜고 움직임을 만들 수 있습니다. 드라이했을 때 자연스럽게 흐르는 라인을 원하거나 긴머리의 무거움을 줄이고 싶을 때 고려할 수 있습니다."},
    {title:"레이어드컷과 펌을 같이 고민한다면",body:"레이어드컷은 C컬이나 자연스러운 레이어드펌과 함께 디자인하기도 합니다. 커트로 만든 층에 컬이 더해지면 움직임을 표현하기 쉬워질 수 있지만, 모든 모발에 같은 방식의 펌이 적합한 것은 아닙니다.\n\n반복적인 염색이나 탈색, 최근 펌 이력, 가는 모발이나 곱슬 등은 결과에 영향을 줄 수 있으므로 현재 모발 상태를 먼저 확인한 뒤 커트만 할지 펌을 함께 진행할지 정하는 것이 좋습니다."},
    {title:"건대에서 레이어드컷을 찾을 때 확인할 것",body:"건대 미용실을 검색할 때는 단순히 거리만 보기보다 원하는 스타일과 비슷한 포트폴리오가 있는지, 상담할 때 모발 상태와 평소 손질 방법까지 함께 확인하는지를 보는 것이 도움이 됩니다.\n\n준오헤어 건대역2호점은 서울 광진구 능동로 109 2층에 있으며, 레이어드컷을 포함한 커트·펌·컬러·헤어케어 상담이 가능합니다. 원하는 이미지와 현재 모발 상태를 함께 확인한 뒤 시술 방향을 상담해보세요."}
  ],
  faqs:[
    {q:"건대에서 레이어드컷 상담을 받을 수 있나요?",a:"네. 준오헤어 건대역2호점에서 현재 모발 길이, 모량, 얼굴 주변 라인과 평소 손질 방법을 확인한 뒤 레이어드컷 방향을 상담할 수 있습니다."},
    {q:"중단발도 레이어드컷이 가능한가요?",a:"가능합니다. 중단발은 층의 시작 위치와 양에 따라 분위기가 크게 달라지므로 현재 길이와 원하는 볼륨감, 손질 방법을 함께 고려하는 것이 좋습니다."},
    {q:"레이어드컷과 C컬펌을 같이 할 수 있나요?",a:"모발 상태에 따라 가능합니다. 펌이나 염색 이력과 손상도를 먼저 확인한 뒤 가능한 시술 범위와 디자인을 상담하는 것이 좋습니다."}
  ]
};

let fbApp;
try{
  fbApp = getApps().find(a => a.options?.projectId === firebaseConfig.projectId) || initializeApp(firebaseConfig);
}catch{
  fbApp = initializeApp(firebaseConfig, "seo-admin-addon");
}
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

let editorState = structuredClone(DEFAULT);
let overlay;

const css = `
#seoAdminOverlay{position:fixed;inset:0;background:rgba(32,24,20,.72);z-index:99999;display:none;padding:20px;overflow:auto;font-family:system-ui,-apple-system,"Pretendard","Noto Sans KR",sans-serif}
#seoAdminOverlay.open{display:block}
#seoAdminPanel{max-width:980px;margin:20px auto;background:#fffaf4;border-radius:26px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.28);color:#33271f}
#seoAdminPanel *{box-sizing:border-box}
#seoAdminPanel h2{margin:0 0 5px;font-size:26px}
#seoAdminPanel .seoHint{color:#7d6a5a;font-size:13px;margin:0 0 18px}
#seoAdminPanel .seoTop{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
#seoAdminPanel .seoGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#seoAdminPanel label{display:grid;gap:6px;font-size:13px;font-weight:750;color:#665446}
#seoAdminPanel input,#seoAdminPanel textarea{width:100%;border:1px solid #ddcdbd;border-radius:14px;padding:11px 12px;background:white;font:inherit}
#seoAdminPanel textarea{min-height:110px;resize:vertical}
#seoAdminPanel .wide{grid-column:1/-1}
#seoAdminPanel .seoCard{border:1px solid #e5d8cc;background:white;border-radius:18px;padding:14px;margin-top:12px}
#seoAdminPanel .seoCardHead{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px}
#seoAdminPanel button{border:0;border-radius:999px;padding:10px 15px;font-weight:800;cursor:pointer}
#seoAdminPanel .primary{background:#6f5440;color:white}
#seoAdminPanel .light{background:#eee3d7;color:#5a4637}
#seoAdminPanel .danger{background:#f3dada;color:#9b3030}
#seoAdminPanel .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
#seoAdminPanel .status{margin-top:12px;padding:10px 12px;border-radius:12px;background:#f0e6db;font-size:13px}
#seoAdminPanel .loginBox{max-width:480px;margin:20px auto;display:grid;gap:10px}
#seoAdminPanel .loginBox input{width:100%}
.seoAdminTab{white-space:nowrap}
@media(max-width:700px){#seoAdminOverlay{padding:8px}#seoAdminPanel{padding:18px;margin:8px auto}#seoAdminPanel .seoGrid{grid-template-columns:1fr}#seoAdminPanel .wide{grid-column:auto}}
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

function esc(v){
  return String(v ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function ensureOverlay(){
  if(overlay) return;
  overlay = document.createElement("div");
  overlay.id = "seoAdminOverlay";
  overlay.innerHTML = `<div id="seoAdminPanel"></div>`;
  overlay.addEventListener("click", e => {
    if(e.target === overlay) closeEditor();
  });
  document.body.appendChild(overlay);
}

function closeEditor(){
  if(overlay) overlay.classList.remove("open");
}

function showLogin(){
  ensureOverlay();
  overlay.classList.add("open");
  document.getElementById("seoAdminPanel").innerHTML = `
    <div class="seoTop">
      <div><h2>검색페이지 관리</h2><p class="seoHint">기존 Firebase 관리자 계정으로 로그인해 주세요.</p></div>
      <button class="light" id="seoClose">닫기</button>
    </div>
    <div class="loginBox">
      <input id="seoEmail" type="email" autocomplete="username" placeholder="Firebase 관리자 이메일">
      <input id="seoPw" type="password" autocomplete="current-password" placeholder="비밀번호">
      <button class="primary" id="seoLogin">로그인 후 편집</button>
      <div class="status" id="seoStatus">기존 관리자 로그인과 같은 Firebase 계정을 사용합니다.</div>
    </div>`;
  document.getElementById("seoClose").onclick = closeEditor;
  document.getElementById("seoLogin").onclick = async () => {
    const email = document.getElementById("seoEmail").value.trim();
    const pw = document.getElementById("seoPw").value;
    const st = document.getElementById("seoStatus");
    if(!email || !pw){ st.textContent = "이메일과 비밀번호를 입력해 주세요."; return; }
    try{
      st.textContent = "로그인 확인 중...";
      await signInWithEmailAndPassword(auth,email,pw);
      await openEditor();
    }catch(err){
      console.error(err);
      st.textContent = "로그인 실패: 이메일/비밀번호 또는 Firebase 인증 설정을 확인해 주세요.";
    }
  };
}

async function loadData(){
  const snap = await getDoc(doc(db,"seoPages","kondae-layered-cut"));
  editorState = snap.exists() ? {...structuredClone(DEFAULT), ...snap.data()} : structuredClone(DEFAULT);
  if(!Array.isArray(editorState.sections)) editorState.sections = structuredClone(DEFAULT.sections);
  if(!Array.isArray(editorState.faqs)) editorState.faqs = structuredClone(DEFAULT.faqs);
  if(!Array.isArray(editorState.keywords)) editorState.keywords = structuredClone(DEFAULT.keywords);
}

function collect(){
  editorState.seoTitle = document.getElementById("seoTitle").value.trim();
  editorState.metaDescription = document.getElementById("seoDesc").value.trim();
  editorState.heroTitle = document.getElementById("seoHero").value.trim();
  editorState.heroIntro = document.getElementById("seoIntro").value.trim();
  editorState.keywords = document.getElementById("seoKeywords").value.split(",").map(v=>v.trim()).filter(Boolean);

  editorState.sections = [...document.querySelectorAll("[data-section-card]")].map(card => ({
    title:card.querySelector("[data-section-title]").value.trim(),
    body:card.querySelector("[data-section-body]").value.trim()
  })).filter(x => x.title || x.body);

  editorState.faqs = [...document.querySelectorAll("[data-faq-card]")].map(card => ({
    q:card.querySelector("[data-faq-q]").value.trim(),
    a:card.querySelector("[data-faq-a]").value.trim()
  })).filter(x => x.q || x.a);
}

function renderEditor(){
  const panel = document.getElementById("seoAdminPanel");
  panel.innerHTML = `
    <div class="seoTop">
      <div>
        <h2>네이버 검색페이지 관리</h2>
        <p class="seoHint">` + "kondae-layered-cut.html" + ` · 저장하면 방문자 화면에 바로 반영됩니다.</p>
      </div>
      <button class="light" id="seoClose">닫기</button>
    </div>

    <div class="seoGrid">
      <label class="wide">검색 제목(title)
        <input id="seoTitle" value="${esc(editorState.seoTitle)}">
      </label>
      <label class="wide">검색 설명(description)
        <textarea id="seoDesc">${esc(editorState.metaDescription)}</textarea>
      </label>
      <label class="wide">연관 키워드 — 쉼표로 구분
        <input id="seoKeywords" value="${esc(editorState.keywords.join(", "))}">
      </label>
      <label>페이지 큰 제목
        <textarea id="seoHero">${esc(editorState.heroTitle)}</textarea>
      </label>
      <label>페이지 첫 설명
        <textarea id="seoIntro">${esc(editorState.heroIntro)}</textarea>
      </label>
    </div>

    <div class="seoCard">
      <div class="seoCardHead"><strong>본문 문단</strong><button class="light" id="addSection">+ 문단 추가</button></div>
      <div id="sectionEditor"></div>
    </div>

    <div class="seoCard">
      <div class="seoCardHead"><strong>FAQ</strong><button class="light" id="addFaq">+ FAQ 추가</button></div>
      <div id="faqEditor"></div>
    </div>

    <div class="actions">
      <button class="primary" id="saveSeo">저장</button>
      <button class="light" id="previewSeo">페이지 보기</button>
      <button class="light" id="resetSeo">기본 내용 불러오기</button>
    </div>
    <div class="status" id="seoStatus">내용을 수정한 뒤 저장을 눌러주세요.</div>
  `;
  document.getElementById("seoClose").onclick = closeEditor;
  renderSectionCards();
  renderFaqCards();

  document.getElementById("addSection").onclick = () => {
    collect();
    editorState.sections.push({title:"새 문단 제목",body:"새 내용을 입력해 주세요."});
    renderEditor();
  };
  document.getElementById("addFaq").onclick = () => {
    collect();
    editorState.faqs.push({q:"새 질문",a:"답변을 입력해 주세요."});
    renderEditor();
  };
  document.getElementById("previewSeo").onclick = () => window.open("/kondae-layered-cut.html","_blank");
  document.getElementById("resetSeo").onclick = () => {
    editorState = structuredClone(DEFAULT);
    renderEditor();
    document.getElementById("seoStatus").textContent = "기본 내용을 불러왔습니다. 실제 반영하려면 저장을 눌러주세요.";
  };
  document.getElementById("saveSeo").onclick = saveData;
}

function renderSectionCards(){
  const root = document.getElementById("sectionEditor");
  root.innerHTML = editorState.sections.map((s,i)=>`
    <div class="seoCard" data-section-card>
      <div class="seoCardHead"><strong>문단 ${i+1}</strong><button class="danger" data-remove-section="${i}">삭제</button></div>
      <label>제목<input data-section-title value="${esc(s.title)}"></label>
      <label style="margin-top:8px">내용<textarea data-section-body>${esc(s.body)}</textarea></label>
    </div>`).join("");
  root.querySelectorAll("[data-remove-section]").forEach(btn => btn.onclick = () => {
    collect();
    editorState.sections.splice(Number(btn.dataset.removeSection),1);
    renderEditor();
  });
}

function renderFaqCards(){
  const root = document.getElementById("faqEditor");
  root.innerHTML = editorState.faqs.map((f,i)=>`
    <div class="seoCard" data-faq-card>
      <div class="seoCardHead"><strong>FAQ ${i+1}</strong><button class="danger" data-remove-faq="${i}">삭제</button></div>
      <label>질문<input data-faq-q value="${esc(f.q)}"></label>
      <label style="margin-top:8px">답변<textarea data-faq-a>${esc(f.a)}</textarea></label>
    </div>`).join("");
  root.querySelectorAll("[data-remove-faq]").forEach(btn => btn.onclick = () => {
    collect();
    editorState.faqs.splice(Number(btn.dataset.removeFaq),1);
    renderEditor();
  });
}

async function saveData(){
  collect();
  const st = document.getElementById("seoStatus");
  if(!editorState.seoTitle || !editorState.heroTitle){
    st.textContent = "검색 제목과 페이지 큰 제목은 비워둘 수 없습니다.";
    return;
  }
  try{
    st.textContent = "저장 중...";
    await setDoc(doc(db,"seoPages","kondae-layered-cut"),{
      ...editorState,
      updatedAt:serverTimestamp(),
      updatedBy:auth.currentUser?.email || ""
    },{merge:true});
    st.textContent = "저장 완료. 검색페이지에 바로 반영됩니다.";
  }catch(err){
    console.error(err);
    st.textContent = "저장 실패: Firestore 권한 규칙에서 seoPages 쓰기가 허용되어 있는지 확인해 주세요.";
  }
}

async function openEditor(){
  ensureOverlay();
  overlay.classList.add("open");
  if(!auth.currentUser){
    showLogin();
    return;
  }
  document.getElementById("seoAdminPanel").innerHTML = `<h2>검색페이지 관리</h2><div class="status">내용 불러오는 중...</div>`;
  try{
    await loadData();
    renderEditor();
  }catch(err){
    console.error(err);
    document.getElementById("seoAdminPanel").innerHTML = `
      <div class="seoTop"><h2>검색페이지 관리</h2><button class="light" id="seoClose">닫기</button></div>
      <div class="status">불러오기 실패: Firestore 읽기 권한 또는 인터넷 연결을 확인해 주세요.</div>`;
    document.getElementById("seoClose").onclick = closeEditor;
  }
}
window.openSeoSearchPageAdmin = openEditor;

function sameStyleButton(reference){
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "검색페이지";
  b.className = (reference?.className || "") + " seoAdminTab";
  b.onclick = openEditor;
  return b;
}

function injectAdminTab(){
  if(document.querySelector(".seoAdminTab")) return true;
  const buttons = [...document.querySelectorAll("button")];
  const anchor = buttons.find(b => ["고객문의","FAQ","블로그","헤어TIP"].includes(b.textContent.trim()));
  if(!anchor) return false;
  anchor.insertAdjacentElement("afterend", sameStyleButton(anchor));
  return true;
}

// 관리자 DOM은 로그인 후 동적으로 만들어질 수 있으므로 계속 감시합니다.
const observer = new MutationObserver(() => injectAdminTab());
observer.observe(document.documentElement,{childList:true,subtree:true});
injectAdminTab();

// 현재 페이지의 Firebase 인증상태를 조용히 확인합니다.
onAuthStateChanged(auth, () => {});
