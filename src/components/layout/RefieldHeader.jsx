'use client';

import { useEffect, useRef, useState } from 'react';
import { REFIELD_URL, refieldNav } from '../../data/header';
import { RefieldLogo } from './RefieldLogo';
import { ThemeToggle } from './ThemeToggle';
import styles from './RefieldHeader.module.css';

/** Globalny header Refield (l-header + c-navbar) — zachowanie jak w pages.min.js 1.0.12. */
export function RefieldHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [direction, setDirection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);
  const previousDirection = useRef(null);
  const toggler = useRef(null);

  useEffect(() => {
    let frame = 0;
    let previousScrolled = false;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const nextScrolled = y > 40;
      const delta = y - lastScroll.current;
      const nextDirection = y <= 0 ? null : Math.abs(delta) < 2 ? previousDirection.current
        : delta > 0 && y > 40 ? 'down' : 'up';
      if (nextScrolled !== previousScrolled) {
        previousScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
      if (nextDirection !== previousDirection.current) {
        previousDirection.current = nextDirection;
        setDirection(nextDirection);
      }
      lastScroll.current = y;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggler.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const className = [
    styles.header,
    scrolled && styles.scroll,
    direction === 'down' && !menuOpen && styles.down,
    direction === 'up' && styles.up,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={className} onFocus={() => { previousDirection.current = 'up'; setDirection('up'); }}>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <a className={styles.brand} href={`${REFIELD_URL}/`} aria-label="Refield — strona główna">
            <RefieldLogo />
          </a>
          <nav data-lenis-prevent="" id="refield-menu" className={`${styles.collapse} ${menuOpen ? styles.show : ''}`} aria-label="Refield">
            <ul className={styles.nav}>
              {refieldNav.map((item) => (
                <li key={item.label}>
                  <a
                    className={styles.link}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <a className={styles.language} href={`${REFIELD_URL}/en/`} lang="en" hrefLang="en">
              eng
            </a>
            <ThemeToggle />
            <button
              ref={toggler}
              type="button"
              className={`${styles.toggler} ${menuOpen ? styles.active : ''}`}
              aria-expanded={menuOpen}
              aria-controls="refield-menu"
              aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
