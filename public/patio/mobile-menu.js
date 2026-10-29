(()=>{
 const toggle=document.querySelector('.menu-toggle');
 const nav=document.getElementById('main-nav');
 const mobile=matchMedia('(max-width:700px)');
 function setOpen(open,restoreFocus=false){
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
  nav.classList.toggle('is-open',open);
  nav.inert=mobile.matches&&!open;
  if(restoreFocus)toggle.focus();
 }
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',event=>{if(event.target.closest('a')&&mobile.matches)setOpen(false,true)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')setOpen(false,true)});
 document.addEventListener('click',event=>{if(!event.target.closest('header')&&mobile.matches)setOpen(false)});
 document.querySelector('header').addEventListener('focusout',event=>{if(mobile.matches&&!event.currentTarget.contains(event.relatedTarget))setOpen(false)});
 mobile.addEventListener('change',()=>setOpen(false));
 setOpen(false);
})();
