// Animate the content, not the details box: the numbered node stays outside it.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.construction-step').forEach(step => {
  const summary = step.querySelector('summary');
  const content = step.querySelector('.construction-detail');
  let animation = null;
  let targetOpen = step.open;
  summary.addEventListener('click', event => {
    event.preventDefault();
    targetOpen = !targetOpen;
    const current = getComputedStyle(content);
    const start = step.open ? {
      height: `${content.getBoundingClientRect().height}px`,
      paddingTop: current.paddingTop,
      marginBottom: current.marginBottom,
      opacity: current.opacity
    } : { height: '0px', paddingTop: '0px', marginBottom: '0px', opacity: 0 };
    if (animation) { animation.onfinish = null; animation.cancel(); }
    if (reducedMotion.matches) { step.open = targetOpen; return; }
    step.open = true;
    const natural = getComputedStyle(content);
    const end = targetOpen ? {
      height: `${content.getBoundingClientRect().height}px`,
      paddingTop: natural.paddingTop,
      marginBottom: natural.marginBottom,
      opacity: 1
    } : { height: '0px', paddingTop: '0px', marginBottom: '0px', opacity: 0 };
    animation = content.animate([start, end], {
      duration: 360, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both'
    });
    animation.onfinish = () => {
      step.open = targetOpen;
      animation.cancel();
      animation = null;
    };
  });
});
