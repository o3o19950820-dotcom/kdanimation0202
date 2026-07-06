import { db, doc, setDoc } from './firebase.js';
import { $, toast, esc, cats } from './app.js';

const ADMIN_ID='junokd02';
const ADMIN_PW='junokd1917';
let adminTab='site';
const dialog=$('adminDialog');

$('adminOpen').onclick=()=>dialog.showModal();
$('loginBtn').onclick=(e)=>{e.preventDefault(); if($('adminId').value.trim()===ADMIN_ID && $('adminPw').value===ADMIN_PW){localStorage.setItem('juno_admin','yes'); openAdmin();}else toast('아이디 또는 비밀번호가 달라요');};
$('logoutBtn').onclick=()=>{localStorage.removeItem('juno_admin'); $('loginPanel').classList.remove('hidden'); $('adminPanel').classList.add('hidden');};
if(localStorage.getItem('juno_admin')==='yes') openAdmin();

document.querySelector('.adminTabs').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return; document.querySelectorAll('.adminTabs button').forEach(b=>b.classList.remove('on')); e.target.classList.add('on'); adminTab=e.target.dataset.admin; renderAdmin();});

function state(){return window.__JUNO_STATE__ || window.__JUNO_DEFAULTS__;}
function clone(v){return JSON.parse(JSON.stringify(v||[]));}
async function save(name, items){await setDoc(doc(db,'site',name),{items, updatedAt:Date.now()}); toast('저장 완료');}
function openAdmin(){ $('loginPanel').classList.add('hidden'); $('adminPanel').classList.remove('hidden'); renderAdmin(); }
function catOptions(selected){return Object.entries(cats).map(([k,v])=>`<option value="${k}" ${selected===k?'selected':''}>${v}</option>`).join('')}
function imgInput(id){return `<input id="${id}" type="file" accept="image/*"><p class="hint">사진은 자동 압축 후 Firestore에 저장됩니다. 너무 큰 사진은 1장씩 올려주세요.</p>`}
function compress(file, max=900, quality=.72){return new Promise((resolve,reject)=>{if(!file){resolve('');return} const r=new FileReader(); r.onload=()=>{const img=new Image(); img.onload=()=>{let w=img.width,h=img.height; if(w>h&&w>max){h=Math.round(h*max/w);w=max}else if(h>max){w=Math.round(w*max/h);h=max} const c=document.createElement('canvas'); c.width=w;c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h); resolve(c.toDataURL('image/jpeg',quality));}; img.onerror=reject; img.src=r.result}; r.onerror=reject; r.readAsDataURL(file)});}

function renderAdmin(){const s=state(); const c=$('adminContent');
 if(adminTab==='site') c.innerHTML=`<div class="form"><h3>기본 설정</h3><input id="siteReserve" placeholder="네이버예약 주소" value="${esc(s.site.reserveUrl||'')}"><input id="siteBlog" placeholder="네이버 블로그 주소" value="${esc(s.site.blogUrl||'')}"><button class="btn" id="saveSite">저장</button></div>`;
 if(adminTab==='event') c.innerHTML=manageList('events',s.events,['title','desc','link'],true);
 if(adminTab==='designer') c.innerHTML=manageList('designers',s.designers,['name','position','keyword','intro'],true);
 if(adminTab==='style') c.innerHTML=manageList('styles',s.styles,['cat','title','desc'],true);
 if(adminTab==='tip') c.innerHTML=manageList('tips',s.tips,['cat','title','body'],false);
 if(adminTab==='blog') c.innerHTML=manageList('blogLinks',s.blogLinks,['title','url'],false);
 if(adminTab==='faq') c.innerHTML=manageList('faqs',s.faqs,['q','a'],false);
 bindAdmin();
}
function label(k){return {title:'제목',desc:'설명',link:'링크',name:'이름',position:'직급',keyword:'키워드',intro:'소개글',cat:'카테고리',body:'본문',url:'주소',q:'질문',a:'답변'}[k]||k}
function manageList(name, arr=[], fields=[], hasImage=false){return `<h3>${name}</h3><div class="adminGrid"><div class="card"><h4>새로 추가</h4><div class="form" id="addForm">${fields.map(f=>fieldHtml(f,'')).join('')}${hasImage?imgInput('newImage'):''}<button class="btn" data-add="${name}">추가</button></div></div><div class="card"><h4>등록 목록</h4>${arr.map((x,i)=>`<div class="row"><div><b>${esc(x.title||x.name||x.q||'항목')}</b><br><span class="hint">${esc(x.keyword||x.cat||x.url||'')}</span></div><div><button class="mini" data-edit="${name}" data-i="${i}">수정</button> <button class="mini" data-del="${name}" data-i="${i}">삭제</button></div></div>`).join('')||'<p class="hint">등록된 항목이 없습니다.</p>'}</div></div>`}
function fieldHtml(f,v){if(f==='cat')return `<select id="f_cat">${catOptions(v)}</select>`; if(['desc','intro','body','a'].includes(f))return `<textarea id="f_${f}" placeholder="${label(f)}">${esc(v)}</textarea>`; return `<input id="f_${f}" placeholder="${label(f)}" value="${esc(v)}">`}
function getForm(fields){const o={}; fields.forEach(f=>o[f]=$(`f_${f}`).value.trim()); return o;}
function fieldsFor(name){return {events:['title','desc','link'],designers:['name','position','keyword','intro'],styles:['cat','title','desc'],tips:['cat','title','body'],blogLinks:['title','url'],faqs:['q','a']}[name]}
function bindAdmin(){
 const saveSite=$('saveSite'); if(saveSite) saveSite.onclick=()=>save('settings',{reserveUrl:$('siteReserve').value.trim(), blogUrl:$('siteBlog').value.trim(), salonName:'준오헤어 건대역2호점'});
 document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=async()=>{const name=btn.dataset.add, fields=fieldsFor(name), arr=clone(state()[name]); const item=getForm(fields); const file=$('newImage')?.files?.[0]; if(file)item.image=await compress(file); if(name==='designers'&&file)item.photo=item.image, delete item.image; arr.unshift(item); await save(name,arr); renderAdmin();});
 document.querySelectorAll('[data-del]').forEach(btn=>btn.onclick=async()=>{const name=btn.dataset.del, i=+btn.dataset.i, arr=clone(state()[name]); arr.splice(i,1); await save(name,arr); renderAdmin();});
 document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>editItem(btn.dataset.edit,+btn.dataset.i));
}
function editItem(name,i){const arr=clone(state()[name]); const item=arr[i]; const fields=fieldsFor(name); const c=$('adminContent'); const imgKey=name==='designers'?'photo':'image'; c.innerHTML=`<h3>수정</h3><div class="form card">${fields.map(f=>fieldHtml(f,item[f]||'')).join('')}${(name==='events'||name==='designers'||name==='styles')?imgInput('editImage'):''}<button class="btn" id="saveEdit">수정 저장</button><button class="btn light" id="cancelEdit">취소</button></div>`; $('cancelEdit').onclick=renderAdmin; $('saveEdit').onclick=async()=>{const updated={...item,...getForm(fields)}; const file=$('editImage')?.files?.[0]; if(file)updated[imgKey]=await compress(file); arr[i]=updated; await save(name,arr); renderAdmin();};}
