/* Progressive enhancement for junokd02.com; never touches admin/Firebase state. */
(()=>{'use strict';
const ROOT='/'; const styles={
'layered-cut':['레이어드컷',['seodan','hyejin','jihyung'],[['숱이 적어도 레이어드컷이 어울리나요?','층을 과하게 내기보다 얼굴 주변과 끝선 위주로 조절하면 볼륨을 유지하는 데 도움이 됩니다.'],['묶는 머리를 자주 해도 괜찮나요?','묶었을 때 빠지는 옆머리 길이까지 상담 후 조정하는 편이 좋습니다.']]],
'hush-cut':['허쉬컷',['hyejin','seodan'],[['숱이 많은 머리도 허쉬컷이 가능한가요?','모량과 모발 굵기에 맞춰 질감과 층을 조절할 수 있습니다.'],['손질이 많이 필요한가요?','모발의 곱슬과 손질 시간에 따라 스타일링 방법이 달라집니다.']]],
'layered-perm':['레이어드펌',['seodan','hyejin'],[['숱이 적어도 레이어드펌이 어울리나요?','모발 끝의 밀도를 고려해 층과 컬 크기를 조정하는 것이 중요합니다.'],['펌 후 집에서 어떻게 말리나요?','두피를 먼저 말린 후 컬 흐름에 맞춰 모발을 부드럽게 말아 건조해 보세요.']]],
'c-curl-perm':['C컬펌',['seodan','hyejin'],[['중단발에도 C컬펌이 어울리나요?','모발 길이와 끝선 두께에 맞춰 컬을 설계하면 중단발에도 자연스럽습니다.']]],
'volume-magic':['볼륨매직',['baekgun'],[['일반 매직과 볼륨매직의 차이는 무엇인가요?','곱슬 정돈에 더해 뿌리와 끝의 자연스러운 볼륨을 함께 고려하는 방식입니다.'],['손상된 모발도 시술할 수 있나요?','탈색 및 열시술 이력에 따라 가능 여부가 달라져 사전 모발 진단이 필요합니다.']]],
'straight-magic':['매직',['baekgun'],[['탈색한 머리에도 매직이 가능한가요?','모발의 손상도에 따라 시술이 제한될 수 있으므로 직접 진단이 우선입니다.']]],
'mens-down-perm':['다운펌',['jungmin','hobin'],[['옆머리만 다운펌할 수 있나요?','뜨는 부위를 중심으로 부분 시술을 상담할 수 있습니다.'],['유지 기간은 얼마나 되나요?','모발 성장 속도와 모질, 일상 관리에 따라 달라집니다.']]],
'mens-iron-perm':['아이롱펌',['jungmin'],[['직모에도 아이롱펌이 가능한가요?','모질과 길이가 맞는다면 컬과 방향을 설계할 수 있습니다.'],['손질할 때 주의할 점은 무엇인가요?','컬 방향을 유지하며 말리고 과도한 열 사용은 피하는 편이 좋습니다.']]],
'root-direction-perm':['모류교정',['seolbin'],[['앞머리가 갈라지는 것도 교정할 수 있나요?','갈라지는 방향과 모류 상태를 확인하고 가능한 방법을 상담합니다.'],['한 번 시술하면 영구적으로 바뀌나요?','새로 자라는 모발의 방향까지 영구적으로 바꾸는 시술은 아니므로 유지 관리를 상담해 주세요.']]],
'jelly-perm':['젤리펌',['seodan'],[['컬이 부스스해지지 않게 하려면?','젖은 상태에서 컬을 잡아주고 적합한 보습·스타일링 제품을 사용해 보세요.']]],
'personal-color':['헤어컬러',['seodan','jihyung'],[['탈색 없이 원하는 색을 낼 수 있나요?','기존 모발 밝기와 염색 이력에 따라 가능한 색 범위가 달라집니다.']]],
'hair-clinic':['모발 케어',['jihyung'],[['손상된 머리가 트리트먼트만으로 회복되나요?','케어는 촉감과 관리에 도움을 줄 수 있지만 이미 손상된 모발 구조를 완전히 원상복구하지는 못합니다.']]]};
const ds={seodan:['서단 부원장',['layered-cut','layered-perm','jelly-perm','personal-color']],hyejin:['혜진 수석실장',['hush-cut','layered-cut','layered-perm']],jihyung:['지형 디자이너',['layered-cut','personal-color','hair-clinic']],hobin:['호빈 디자이너',['mens-down-perm','mens-iron-perm']],baekgun:['백건 디자이너',['straight-magic','volume-magic']],seolbin:['차설빈 원장',['root-direction-perm']],jungmin:['정민 부원장',['mens-iron-perm','mens-down-perm']]};
const mk=(tag,cls,txt)=>{let e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e};
const link=(txt,url,cls)=>{let a=mk('a',cls,txt);a.href=url;return a};
const getConfig=async()=>{try{let r=await fetch('/data/site-config.json',{cache:'no-store'});return r.ok?await r.json():{}}catch{return {}}};
const path=location.pathname; const slug=path.split('/').pop().replace(/\.html$/,''); const style=path.startsWith('/styles/')?styles[slug]:null; const designer=path.startsWith('/designers/')?ds[slug]:null;
function section(title){let e=mk('section','ju-panel');e.append(mk('h2','',title));return e}
function addCases(parent,cases){if(!cases.length)return;let sec=section('준오헤어 건대역2호점 시술 사례');let grid=mk('div','ju-case-grid');cases.forEach(c=>{if(!c.image||!c.title)return;let art=mk('article','ju-case');let im=mk('img');im.src=c.image;im.alt=c.alt||c.title;im.loading='lazy';let body=mk('div');body.append(mk('h3','',c.title));if(c.description)body.append(mk('p','',c.description));if(c.designer&&ds[c.designer])body.append(link(ds[c.designer][0]+' 자세히 보기','/designers/'+c.designer+'.html','ju-btn alt'));art.append(im,body);grid.append(art)});if(grid.childElementCount){sec.append(grid);parent.append(sec)}}
function mount(config){const booking=config.reservationUrl||'https://map.naver.com/p/entry/place/33431131?placePath=%2Fstylist';const target=document.querySelector('main')||document.querySelector('article')||document.body;const panel=section('스타일 상담과 예약 안내');let p=mk('p','',style?'이 스타일이 나에게 어울릴지 궁금하다면 모발 상태와 평소 손질 습관을 바탕으로 상담해 보세요.':designer?'담당 디자이너의 주요 시술을 확인하고 방문 예약을 진행해 보세요.':'시술별 스타일 가이드와 담당 디자이너를 확인하고 편하게 예약해 보세요.');panel.append(p);let actions=mk('div','ju-actions');let b=link('네이버에서 예약 확인',booking,'ju-btn');b.target='_blank';b.rel='noopener noreferrer';actions.append(b,link('스타일 가이드','/styles/','ju-btn alt'));panel.append(actions);target.append(panel);
if(style){let sec=section(style[0]+' 자주 묻는 질문');style[2].forEach(([q,a])=>{let d=mk('details','ju-faq');d.append(mk('summary','',q),mk('p','',a));sec.append(d)});target.append(sec);let assoc=section('이 스타일을 상담할 수 있는 디자이너');let links=mk('div','ju-links');style[1].forEach(id=>{if(ds[id])links.append(link(ds[id][0],'/designers/'+id+'.html'))});assoc.append(links);target.append(assoc)}
if(designer){let sec=section(designer[0]+' 관련 스타일');let links=mk('div','ju-links');designer[1].forEach(id=>{if(styles[id])links.append(link(styles[id][0],'/styles/'+id+'.html'))});sec.append(links);let ig=(config.designerInstagram||{})[slug]||config.instagramUrl;if(ig&&/^https:\/\/(www\.)?instagram\.com\//.test(ig)){let a=link('인스타그램에서 더 보기',ig,'ju-btn alt');a.target='_blank';a.rel='noopener noreferrer';sec.append(mk('p')).lastChild.append(a)}target.append(sec)}
let cases=(Array.isArray(config.cases)?config.cases:[]).filter(c=>c.published===true&&(style?c.style===slug:designer?c.designer===slug:true));if(style||designer||path==='/')addCases(target,cases);
if(!path.startsWith('/admin')&&!/login/i.test(path)){let bar=mk('nav','ju-bar');bar.setAttribute('aria-label','모바일 빠른 예약');bar.append(link('가격·이용 안내','/#faq'),link('네이버 예약',booking));bar.lastChild.target='_blank';bar.lastChild.rel='noopener noreferrer';document.body.append(bar);document.body.classList.add('ju-mobile-padding')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>getConfig().then(mount));else getConfig().then(mount);
})();
