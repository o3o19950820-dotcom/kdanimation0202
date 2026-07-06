import { db, collection, doc, getDoc, setDoc, onSnapshot, query, orderBy } from './firebase.js';

export const $ = (id)=>document.getElementById(id);
export const cats = {cut:'커트',perm:'펌',color:'컬러',care:'케어'};
export const defaults = {
  site:{reserveUrl:'https://map.naver.com/', blogUrl:'https://blog.naver.com/', salonName:'준오헤어 건대역2호점'},
  designers:[
    {name:'박상일', position:'대표원장', keyword:'프리미엄 상담', intro:'고객님의 분위기와 모발 컨디션을 함께 보고 완성도 높은 스타일을 제안합니다.', photo:''},
    {name:'설빈', position:'디자이너', keyword:'감성 스타일', intro:'자연스럽고 손질 편한 디자인을 제안합니다.', photo:''},
    {name:'정민', position:'디자이너', keyword:'맞춤 상담', intro:'라이프스타일에 맞는 현실적인 스타일을 추천합니다.', photo:''},
    {name:'서단', position:'디자이너', keyword:'트렌디 무드', intro:'세련된 무드와 부드러운 컬러감을 제안합니다.', photo:''},
    {name:'혜진', position:'디자이너', keyword:'섬세한 디테일', intro:'고객님의 얼굴형과 결을 살린 디자인을 만듭니다.', photo:''},
    {name:'지형', position:'디자이너', keyword:'깔끔한 디자인', intro:'정돈된 실루엣과 깔끔한 스타일을 제안합니다.', photo:''},
    {name:'호빈', position:'디자이너', keyword:'남성 스타일', intro:'다운펌과 커트 밸런스를 중요하게 봅니다.', photo:''},
    {name:'백건', position:'디자이너', keyword:'손질 쉬운 스타일', intro:'매일 손질하기 쉬운 스타일을 제안합니다.', photo:''}
  ],
  events:[{title:'첫 방문 상담 이벤트', desc:'첫 방문 고객님께 어울리는 스타일 상담을 자세히 도와드립니다.', image:'', link:'#'}],
  styles:[
    {cat:'cut', title:'레이어드컷', desc:'가벼운 움직임과 얼굴형 보완에 좋은 커트 스타일입니다.', image:''},
    {cat:'perm', title:'빌드펌', desc:'볼륨감과 부드러운 흐름을 살리는 펌 스타일입니다.', image:''},
    {cat:'color', title:'브라운 컬러', desc:'피부톤을 부드럽게 살려주는 데일리 컬러입니다.', image:''},
    {cat:'care', title:'손상모 케어', desc:'건조하고 푸석한 모발을 위한 집중 케어입니다.', image:''}
  ],
  tips:[
    {cat:'cut', title:'레이어드컷 손질법', body:'드라이 방향과 컬 크림 사용량을 줄이면 자연스러운 움직임이 오래갑니다.'},
    {cat:'perm', title:'펌 유지기간 늘리는 법', body:'시술 직후 강한 샴푸와 고열 스타일링을 줄이면 컬 유지에 도움이 됩니다.'},
    {cat:'color', title:'염색 오래 유지하는 법', body:'컬러 전용 샴푸와 낮은 온도의 물 사용이 컬러 유지에 좋습니다.'},
    {cat:'care', title:'클리닉 주기', body:'손상 정도에 따라 2~4주 간격으로 관리하면 모발 컨디션 유지에 도움이 됩니다.'}
  ],
  blogLinks:[{title:'네이버 블로그 글을 연결해 주세요', url:'https://blog.naver.com/'}],
  faqs:[{q:'예약은 어떻게 하나요?', a:'네이버예약 또는 전화로 가능합니다.'},{q:'첫 방문 상담 가능한가요?', a:'가능합니다. 원하는 스타일 사진을 가져오시면 상담이 더 정확합니다.'}]
};

export async function ensureDoc(name, data){const ref=doc(db,'site',name); const snap=await getDoc(ref); if(!snap.exists()) await setDoc(ref,{items:data, updatedAt:Date.now()});}
export async function ensureSite(){await ensureDoc('settings', defaults.site); await ensureDoc('designers', defaults.designers); await ensureDoc('events', defaults.events); await ensureDoc('styles', defaults.styles); await ensureDoc('tips', defaults.tips); await ensureDoc('blogLinks', defaults.blogLinks); await ensureDoc('faqs', defaults.faqs);}
export function toast(t){const el=$('toast'); el.textContent=t; el.style.display='block'; setTimeout(()=>el.style.display='none',2200)}
export function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
export function imageBox(src, alt){return src?`<img src="${esc(src)}" alt="${esc(alt)}">`:'JUNO';}

let activeStyle='cut', activeTip='cut';
let state={...defaults};

function render(){
  $('reserveTop').href=state.site.reserveUrl||'#'; $('blogHome').href=state.site.blogUrl||'#';
  $('eventList').innerHTML=(state.events||[]).map(x=>`<article class="item"><div class="photo">${imageBox(x.image,x.title)}</div><div class="body"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>${x.link?`<a class="btn light" target="_blank" href="${esc(x.link)}">자세히 보기</a>`:''}</div></article>`).join('')||'<p>등록된 이벤트가 없습니다.</p>';
  $('designerList').innerHTML=(state.designers||[]).map(d=>`<article class="designer"><div class="photo">${imageBox(d.photo,d.name)}</div><div class="body"><h3>${esc(d.name)}</h3><p>${esc(d.position)}</p><span class="tag">${esc(d.keyword)}</span><p>${esc(d.intro)}</p></div></article>`).join('');
  $('styleList').innerHTML=(state.styles||[]).filter(x=>x.cat===activeStyle).map(x=>`<article class="item"><div class="photo">${imageBox(x.image,x.title)}</div><div class="body"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><span class="tag">${cats[x.cat]}</span></div></article>`).join('')||'<p>등록된 스타일이 없습니다.</p>';
  $('tipList').innerHTML=(state.tips||[]).filter(x=>x.cat===activeTip).map(x=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><span class="tag">${cats[x.cat]}</span></article>`).join('')||'<p>등록된 헤어TIP이 없습니다.</p>';
  $('blogLinks').innerHTML=(state.blogLinks||[]).map(x=>`<a target="_blank" rel="noopener" href="${esc(x.url)}">${esc(x.title)}</a>`).join('');
  $('faqList').innerHTML=(state.faqs||[]).map(x=>`<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('');
}

ensureSite().then(()=>{
  ['settings','designers','events','styles','tips','blogLinks','faqs'].forEach(name=>{
    onSnapshot(doc(db,'site',name),snap=>{if(snap.exists()){const v=snap.data().items; state[name==='settings'?'site':name]=v; render(); window.__JUNO_STATE__=state;}});
  });
}).catch(err=>{console.error(err); toast('Firebase 설정/규칙을 확인해줘'); render();});

document.querySelectorAll('.tabs').forEach(tab=>tab.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return; tab.querySelectorAll('button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); if(tab.dataset.target==='style')activeStyle=e.target.dataset.cat; else activeTip=e.target.dataset.cat; render();}));

window.__JUNO_DEFAULTS__=defaults; window.__JUNO_RENDER__=render; window.__JUNO_STATE__=state;


// ===== Motion effects =====
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 28));
    const timer = setInterval(()=>{
      start += step;
      if(start >= target){ start = target; clearInterval(timer); }
      el.textContent = start;
    }, 36);
    countObserver.unobserve(el);
  });
},{threshold:.6});

document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));

window.addEventListener('load',()=>{
  document.querySelector('.heroGrid')?.classList.add('show');
});
