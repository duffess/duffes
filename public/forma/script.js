const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');function closeMenu(){nav.classList.remove('open');nav.inert=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu')}menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.inert=!open});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));const dialog=document.querySelector('#demo-dialog');document.querySelector('#contact-button').addEventListener('click',()=>dialog.showModal());dialog.querySelectorAll('.close,.dialog-close').forEach(button=>button.addEventListener('click',()=>dialog.close()));

// A native-scroll fallback remains available when motion is reduced or a library fails.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = gsap.timeline({defaults:{ease:'power2.out'}});
    intro.from('.hero > img',{scale:1.045,duration:2.2,clearProps:'transform'})
      .from('.header, .hero-content > *, .hero-bottom',{autoAlpha:0,y:18,duration:1,stagger:.12},.12);

    document.querySelectorAll('.project .image-wrap').forEach((frame) => {
      gsap.from(frame,{clipPath:'inset(8% 0 8% 0)',duration:1.35,ease:'power3.out',scrollTrigger:{trigger:frame,start:'top 88%',once:true}});
      gsap.fromTo(frame.querySelector('img'),{scale:1.08},{scale:1,duration:1.5,ease:'power2.out',clearProps:'transform',scrollTrigger:{trigger:frame,start:'top 88%',once:true}});
    });
    gsap.fromTo('.studio-image img',{yPercent:-4,scale:1.1},{yPercent:4,scale:1.1,ease:'none',scrollTrigger:{trigger:'.studio',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.from('.service-list > div',{y:22,autoAlpha:0,stagger:.13,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'.service-list',start:'top 88%',once:true}});
    gsap.from('.contact-inner > *',{y:22,autoAlpha:0,stagger:.12,duration:.9,ease:'power2.out',scrollTrigger:{trigger:'.contact',start:'top 80%',once:true}});
    let lenis;
    if (window.Lenis) {
      lenis = new Lenis({lerp:.09, smoothWheel:true, syncTouch:false, anchors:true});
      lenis.on('scroll',ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      dialog.addEventListener('close', () => lenis.start());
      document.querySelector('#contact-button').addEventListener('click', () => lenis.stop());
      return () => { gsap.ticker.remove(tick); lenis.destroy(); };
    }
  });
}

