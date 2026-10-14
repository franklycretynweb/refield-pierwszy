'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SiteEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let lastWheel = 0;
    let nativeGesture = false;
    const lenis = new Lenis({
      autoRaf: false,
      autoToggle: true,
      anchors: true,
      smoothWheel: true,
      lerp: 0.18,
      stopInertiaOnNavigate: true,
      // Touchpad ma własną bezwładność. Nie nakładamy drugiej na drobne gesty pikselowe.
      virtualScroll: ({ event }) => {
        if (event.type !== 'wheel') return true;
        const wheel = event;
        const now = performance.now();
        if (now - lastWheel > 200) {
          nativeGesture = lenis.isScrolling !== 'smooth' && wheel.deltaMode === 0 && Math.abs(wheel.deltaY) < 50;
        }
        lastWheel = now;
        return !nativeGesture;
      },
    });
    // Pętla pracuje tylko podczas animacji, nie przez cały czas otwarcia strony.
    const tick = (time) => {
      frame = 0;
      lenis.raf(time);
      if (lenis.isScrolling === 'smooth') frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame) return;
      lenis.raf(performance.now());
      frame = requestAnimationFrame(tick);
    };
    const off = lenis.on('virtual-scroll', wake);
    // Lenis obsługuje kotwicę wcześniej w tym samym zdarzeniu click.
    window.addEventListener('click', wake);
    return () => {
      cancelAnimationFrame(frame);
      off();
      window.removeEventListener('click', wake);
      lenis.destroy();
    };
  }, []);

  return null;
}
