'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';


/** Przełącznik c-theme-toggler — ten sam klucz localStorage co refield.webcheck.ovh. */
export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <button
      type="button"
      className={styles.toggler}
      aria-pressed={theme === 'dark'}
      aria-label="Tryb ciemny"
      onClick={toggle}
    >
      <span className={styles.icon}>
        <svg className={styles.light} width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path
            d="M9.08333 0.75V2.41667M9.08333 15.75V17.4167M2.41667 9.08333H0.75M4.3451 4.3451L3.16658 3.16658M13.8216 4.3451L15.0001 3.16658M4.3451 13.825L3.16658 15.0035M13.8216 13.825L15.0001 15.0035M17.4167 9.08333H15.75M13.25 9.08333C13.25 11.3845 11.3845 13.25 9.08333 13.25C6.78215 13.25 4.91667 11.3845 4.91667 9.08333C4.91667 6.78215 6.78215 4.91667 9.08333 4.91667C11.3845 4.91667 13.25 6.78215 13.25 9.08333Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg className={styles.dark} width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
          <path
            d="M14.2502 1.5835L14.7393 2.56166C14.9494 2.98202 15.0545 3.1922 15.1949 3.37433C15.3195 3.53595 15.4643 3.68083 15.626 3.80542C15.8081 3.94581 16.0183 4.0509 16.4386 4.26108L17.4168 4.75016L16.4386 5.23925C16.0183 5.44943 15.8081 5.55452 15.626 5.69491C15.4643 5.81949 15.3195 5.96437 15.1949 6.12599C15.0545 6.30812 14.9494 6.5183 14.7393 6.93866L14.2502 7.91683L13.7611 6.93866C13.5509 6.5183 13.4458 6.30812 13.3054 6.12599C13.1809 5.96437 13.036 5.81949 12.8743 5.69491C12.6922 5.55452 12.4821 5.44943 12.0617 5.23925L11.0835 4.75016L12.0617 4.26108C12.4821 4.0509 12.6922 3.94581 12.8743 3.80542C13.036 3.68083 13.1809 3.53595 13.3054 3.37433C13.4458 3.1922 13.5509 2.98202 13.7611 2.56166L14.2502 1.5835Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.6252 10.5999C15.5873 12.4205 13.6283 13.6479 11.3827 13.6479C8.05228 13.6479 5.35242 10.9481 5.35242 7.61768C5.35242 5.37189 6.58009 3.41283 8.40093 2.375C4.57583 2.73768 1.5835 5.95881 1.5835 9.87881C1.5835 14.0419 4.95831 17.4167 9.12135 17.4167C13.0412 17.4167 16.2622 14.4246 16.6252 10.5999Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.text} aria-hidden="true">
        <span>light mode</span>
        <span>dark mode</span>
      </span>
    </button>
  );
}
