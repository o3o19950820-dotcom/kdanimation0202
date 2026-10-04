
document.addEventListener('click', (e)=>{
  if(!e.target.matches('.tip-tab')) return;
  const name=e.target.dataset.tab;
  document.querySelectorAll('.tip-tab').forEach(x=>x.classList.toggle('active',x===e.target));
  document.querySelectorAll('.tip-panel').forEach(x=>x.classList.toggle('active',x.dataset.panel===name));
});
