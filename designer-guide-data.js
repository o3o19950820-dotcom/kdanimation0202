import { db, doc, onSnapshot } from './firebase.js';

const SLOTS = [
  {slug:'park-sangil', legacyName:'박상일', href:'/designer-park-sangil.html'},
  {slug:'seolbin', legacyName:'설빈', href:'/designer-seolbin.html'},
  {slug:'jeongmin', legacyName:'정민', href:'/designer-jeongmin.html'},
  {slug:'seodan', legacyName:'서단', href:'/designer-seodan.html'},
  {slug:'hyejin', legacyName:'혜진', href:'/designer-hyejin.html'},
  {slug:'jihyeong', legacyName:'지형', href:'/designer-jihyeong.html'},
  {slug:'hobin', legacyName:'호빈', href:'/designer-hobin.html'},
  {slug:'baekgeon', legacyName:'백건', href:'/designer-baekgeon.html'}
];

function findItem(items, slot, index){
  return items.find(x=>String(x?.slug||'').trim()===slot.slug)
    || items.find(x=>String(x?.name||'').trim()===slot.legacyName)
    || (items.length===SLOTS.length ? items[index] : null);
}

function updateSchema(items){
  const old=document.querySelector('script[data-live-guide-schema]');
  if(old) old.remove();

  const people=SLOTS.map((slot,index)=>{
    const item=findItem(items,slot,index);
    if(!item) return null;
    const person={
      '@type':'Person',
      name:item.name||slot.legacyName,
      jobTitle:item.position||'디자이너',
      url:`https://junokd02.com${slot.href}`,
      worksFor:{'@type':'HairSalon',name:'준오헤어 건대역2호점',url:'https://junokd02.com/'}
    };
    if(item.intro) person.description=item.intro;
    if(item.photo) person.image=item.photo;
    if(item.specialties) person.knowsAbout=item.specialties;
    return person;
  }).filter(Boolean);

  const script=document.createElement('script');
  script.type='application/ld+json';
  script.dataset.liveGuideSchema='1';
  script.textContent=JSON.stringify({
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    name:'준오헤어 건대역2호점 디자이너 가이드',
    url:'https://junokd02.com/designer-guide.html',
    about:people
  });
  document.head.appendChild(script);
}

onSnapshot(doc(db,'site','designers'),snap=>{
  if(!snap.exists()) return;
  const items=Array.isArray(snap.data().items)?snap.data().items:[];

  SLOTS.forEach((slot,index)=>{
    const item=findItem(items,slot,index);
    if(!item) return;
    const card=document.querySelector(`a.seoCard[href="${slot.href}"]`);
    if(!card) return;
    const badge=card.querySelector('.badge');
    const h2=card.querySelector('h2');
    const p=card.querySelector('p');
    if(badge && item.position) badge.textContent=item.position;
    if(h2 && item.name) h2.textContent=item.name;
    if(p){
      const summary=[item.keyword,item.intro].filter(Boolean).join(' · ');
      if(summary) p.textContent=summary;
    }
  });

  updateSchema(items);
},err=>console.error('Designer guide sync error:',err));
