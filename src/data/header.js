// Copied from /Users/mateusz/refield; independent local snapshot.
export const REFIELD_URL = 'https://refield.webcheck.ovh';

export const refieldNav = [
  { label: 'o nas', href: `${REFIELD_URL}/o-nas/` },
  { label: 'zespół', href: `${REFIELD_URL}/zespol/` },
  { label: 'aktualności', href: `${REFIELD_URL}/aktualnosci/` },
  { label: 'inwestycje', href: `${REFIELD_URL}/inwestycje/` },
  { label: 'homes', href: '/', current: true },
  { label: 'zgłoś grunt', href: `${REFIELD_URL}/zglos-grunt/` },
  { label: 'kontakt', href: `${REFIELD_URL}/kontakt/` },
];


// Same pre-paint theme initialization as the source header.
export const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){d.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.setAttribute('data-theme','dark')}}catch(e){}})();`;
