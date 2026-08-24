import { db, doc, onSnapshot } from "/firebase.js";

const pageId = document.body.dataset.seoPage;
if(!pageId) console.warn("SEO page id missing");

function esc(v){
  return String(v ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function nl(v){ return esc(v).replace(/\n/g,"<br>"); }

function render(d){
  if(!d || typeof d!=="object") return;
  if(d.seoTitle) document.title=d.seoTitle;
  const desc=document.querySelector('meta[name="description"]');
  if(desc && d.metaDescription) desc.content=d.metaDescription;
  const kw=document.querySelector('meta[name="keywords"]');
  if(kw && Array.isArray(d.keywords)) kw.content=d.keywords.join(", ");
  const ogt=document.querySelector('meta[property="og:title"]');
  if(ogt && d.seoTitle) ogt.content=d.seoTitle;
  const ogd=document.querySelector('meta[property="og:description"]');
  if(ogd && d.metaDescription) ogd.content=d.metaDescription;

  const hero=document.getElementById("heroTitle");
  const intro=document.getElementById("heroIntro");
  const chips=document.getElementById("keywordChips");
  if(hero && d.heroTitle) hero.innerHTML=nl(d.heroTitle);
  if(intro && d.heroIntro) intro.textContent=d.heroIntro;
  if(chips && Array.isArray(d.keywords)) chips.innerHTML=d.keywords.map(k=>`<span>${esc(k)}</span>`).join("");

  const sectionList=document.getElementById("sectionList");
  if(sectionList && Array.isArray(d.sections) && d.sections.length){
    sectionList.innerHTML=d.sections.map(s=>`<section class="content-card"><h2>${esc(s.title)}</h2><p>${nl(s.body)}</p></section>`).join("");
  }
  const faqList=document.getElementById("faqList");
  if(faqList && Array.isArray(d.faqs) && d.faqs.length){
    faqList.innerHTML=d.faqs.map((f,i)=>`<details ${i===0?"open":""}><summary>${esc(f.q)}</summary><p>${nl(f.a)}</p></details>`).join("");
    const schema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":d.faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))};
    const node=document.getElementById("faqSchema");
    if(node) node.textContent=JSON.stringify(schema);
  }
}

if(pageId){
  onSnapshot(doc(db,"site","seoPages"),snap=>{
    const all=snap.exists()?snap.data()?.items:null;
    if(all && all[pageId]) render(all[pageId]);
  },err=>console.warn("SEO dynamic content load failed; static content remains.",err));
}
