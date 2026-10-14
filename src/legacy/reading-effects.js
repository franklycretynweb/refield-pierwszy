// Reading-progress treatment from ConstructionTrack, adapted to this page's accordion.
export function initializeReadingEffects(root, signal) {
 const list=root.querySelector('.construction-steps');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,visible=false,top=0,start=0,length=1,centers=[];
 const rail=document.createElement('div');rail.className='construction-reading-rail';rail.setAttribute('aria-hidden','true');rail.innerHTML='<span></span>';
 const steps=[...list.querySelectorAll('.construction-step')];
 const numbers=steps.map(step=>step.querySelector('.construction-number'));
 list.append(rail);
 const paint=()=>{
  frame=0;if(!visible||motion.matches)return;
  const position=innerHeight*.46-(top-scrollY);
  rail.style.setProperty('--rail-progress',String(Math.max(0,Math.min(1,(position-start)/length))));
  steps.forEach((step,i)=>{
   step.parentElement.dataset.scrollPassed=String(position>=centers[i]);
   const reveal=Math.max(0,Math.min(1,(innerHeight*.86-(top-scrollY)-centers[i])/180));
   step.style.setProperty('--step-reveal',String(reveal));
  });
 };
 const schedule=()=>{if(visible&&!motion.matches&&!frame)frame=requestAnimationFrame(paint);};
 const measure=()=>{
  const box=list.getBoundingClientRect();top=box.top+scrollY;
  centers=numbers.map(n=>{const b=n.getBoundingClientRect();return b.top-box.top+b.height/2;});
  start=centers[0]??0;length=Math.max(1,(centers.at(-1)??start)-start);
  rail.style.top=start+'px';rail.style.height=length+'px';schedule();
 };
 const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{rootMargin:'150px'});
 const size=new ResizeObserver(measure);size.observe(list);size.observe(document.body);visibility.observe(list);measure();
 window.addEventListener('scroll',schedule,{passive:true,signal});window.addEventListener('resize',measure,{signal});
 motion.addEventListener('change',()=>{steps.forEach(step=>step.style.removeProperty('--step-reveal'));schedule();},{signal});
 // Give every dialog the source component's focus restoration, including gallery and notifications.
 const openers=new WeakMap();
 root.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('beforetoggle',event=>{if(event.newState==='open')openers.set(dialog,document.activeElement);},{signal});
  dialog.addEventListener('close',()=>{const opener=openers.get(dialog);if(opener instanceof HTMLElement&&opener.isConnected)opener.focus({preventScroll:true});},{signal});
 });
 return ()=>{cancelAnimationFrame(frame);visibility.disconnect();size.disconnect();rail.remove();steps.forEach(step=>{step.style.removeProperty('--step-reveal');step.parentElement.removeAttribute('data-scroll-passed');});};
}
