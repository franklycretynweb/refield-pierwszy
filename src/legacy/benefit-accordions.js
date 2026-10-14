// Animate the content's measured height; grid siblings keep their natural heights.
export function initializeBenefitAccordions(root, signal) {
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const cleanups=[];
 root.querySelectorAll('.benefit details').forEach(details=>{
  const summary=details.querySelector('summary');
  const body=document.createElement('div');body.className='benefit-detail-body';
  [...details.children].filter(child=>child!==summary).forEach(child=>body.append(child));
  details.append(body);
  let expanded=details.open,animation=null;
  const updateState=()=>{
   details.dataset.expanded=String(expanded);
   summary.setAttribute('aria-expanded',String(expanded));
   body.inert=!expanded;
  };
  const settle=()=>{
   if(animation){animation.onfinish=null;animation.cancel();animation=null;}
   details.open=expanded;
   body.style.removeProperty('height');body.style.removeProperty('opacity');
   updateState();
  };
  updateState();
  const toggle=event=>{
   event.preventDefault();
   const height=details.open?body.getBoundingClientRect().height:0;
   const opacity=details.open?getComputedStyle(body).opacity:'0';
   expanded=!expanded;
   if(motion.matches){settle();return;}
   if(animation){animation.onfinish=null;animation.cancel();}
   details.open=true;
   body.style.height='auto';
   const naturalHeight=body.getBoundingClientRect().height;
   body.style.height=height+'px';body.style.opacity=opacity;
   updateState();
   animation=body.animate([
    {height:height+'px',opacity},
    {height:(expanded?naturalHeight:0)+'px',opacity:expanded?1:0}
   ],{duration:320,easing:'cubic-bezier(.165,.84,.44,1)',fill:'both'});
   animation.onfinish=settle;
  };
  summary.addEventListener('click',toggle,{signal});
  motion.addEventListener('change',settle,{signal});
  window.addEventListener('resize',()=>{if(animation)settle();},{signal});
  cleanups.push(()=>{
   settle();
   while(body.firstChild)details.append(body.firstChild);
   body.remove();delete details.dataset.expanded;summary.removeAttribute('aria-expanded');
  });
 });
 return()=>cleanups.forEach(cleanup=>cleanup());
}
