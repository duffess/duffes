/* GSAP enhances a fully visible, usable static page. */
if(window.gsap && window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero-frame',{clipPath:'inset(0 0 100% 0)',duration:1.5,ease:'power3.inOut'});
  gsap.from('.hero h1,.hero p,.hero .button',{y:35,opacity:0,duration:1,stagger:.13,delay:.25,ease:'power3.out'});
  gsap.utils.toArray('.wrap h2,.intro>p,.service,.steps article,.quote,.contact h2').forEach(el=>{
   gsap.from(el,{y:30,opacity:0,duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
  });
  gsap.fromTo('.panorama',{backgroundPosition:'50% 35%'},{backgroundPosition:'50% 65%',ease:'none',scrollTrigger:{trigger:'.panorama',start:'top bottom',end:'bottom top',scrub:1}});
 });
 const image=document.getElementById('project-image');
 const frame=document.createElement('div');
 frame.className='project-frame';
 image.before(frame);
 frame.append(image);
 const details=['project-title','project-caption','project-text','type','counter'].map(id=>document.getElementById(id));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let transitioning=false;
 let queued=0;
 const status=document.createElement('span');
 status.className='carousel-status';
 status.setAttribute('role','status');
 document.querySelector('.controls').append(status);
 async function changeProject(delta){
  if(transitioning){queued=delta;return;}
  transitioning=true;
  const target=(current+delta+projects.length)%projects.length;
  const preload=new Image();
  preload.src='https://images.unsplash.com/photo-'+projects[target][3]+'?auto=format&fit=crop&w=1000&q=85';
  status.textContent='';
  try{
   await Promise.race([preload.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),12000))]);
  }catch{
   status.textContent='Não foi possível carregar a imagem. Tente novamente.';
   transitioning=false;queued=0;return;
  }
  const finish=()=>{
   transitioning=false;
   status.textContent=projects[current][0];
   if(queued){const next=queued;queued=0;changeProject(next);}
  };
  if(reduced.matches){show(delta);image.alt=projects[current][0]+' — fotografia ilustrativa';finish();return;}
  const outgoing=image.cloneNode();
  outgoing.removeAttribute('id');
  outgoing.alt='';
  outgoing.setAttribute('aria-hidden','true');
  outgoing.className='outgoing-image';
  frame.append(outgoing);
  const timeline=gsap.timeline({onComplete:()=>{
   outgoing.remove();
   gsap.set([image,...details],{clearProps:'transform,opacity,clipPath'});
   finish();
  }});
  timeline.to(details,{opacity:0,y:-8,duration:.18,ease:'power1.in'})
   .call(()=>{show(delta);image.alt=projects[current][0]+' — fotografia ilustrativa';})
   .fromTo(image,{xPercent:delta*12,scale:1.06,clipPath:delta>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)'},{xPercent:0,scale:1,clipPath:'inset(0 0 0 0)',duration:.85,ease:'power3.inOut'},.18)
   .to(outgoing,{xPercent:-delta*10,opacity:0,duration:.85,ease:'power3.inOut'},.18)
   .fromTo(details,{opacity:0,y:12},{opacity:1,y:0,duration:.45,stagger:.035,ease:'power2.out'},.55);
 }
 for(const [id,delta] of [['prev',-1],['next',1]]){
  document.getElementById(id).onclick=()=>changeProject(delta);
 }
 window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
