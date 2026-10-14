import '@fontsource/poppins/latin-ext-400.css';
import '@fontsource/poppins/latin-ext-500.css';
import '@fontsource/poppins/latin-ext-600.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import './style.css';
import './refinement.css';
import './homes.js';
import './pricing-journal.css';
import './pricing-journal.js';
import './construction-timeline.css';
import './construction-timeline.js';
import './team.css';
import './team.js';
import './offer-journal-refinement.css';
import './visual-system.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/poppins/latin-ext-700.css';
import './refield-team-footer.css';
import './shared-cta-team-heading.css';

const asset = name => `/assets/${name}`;
const benefits = [
  {tag:'Komfort',image:'standard-comfort.webp',alt:'Salon z jadalnią i otwartą strefą dzienną',title:'Komfort przez cały rok',copy:'Ogrzewanie podłogowe i wentylacja mechaniczna pracują na wygodę w każdym sezonie.',facts:[['Ogrzewanie','Podłogowe'],['Wentylacja','Mechaniczna']],detail:'Pompa ciepła, ogrzewanie podłogowe i wentylacja mechaniczna z odzyskiem ciepła tworzą jeden system. Szczegółowe parametry urządzeń i instalacji określa standard wybranego domu.'},
  {tag:'Działka',image:'standard-garden.webp',alt:'Prywatne ogrody i tarasy przy domach',title:'Prywatny ogród',copy:'Taras i ogród są naturalnym przedłużeniem salonu — z miejscem na własny rytm.',facts:[['Twoja przestrzeń','Prywatny ogród'],['Otoczenie','Zieleń i taras']],detail:'Własny ogród przy każdym domu, uporządkowany teren i miejsce na taras. Powierzchnia działki oraz zakres nasadzeń zależą od wybranego segmentu. Elementy wyposażenia na wizualizacji są propozycją aranżacji.'},
  {tag:'Energia',image:'standard-energy.png',alt:'Połacie dachowe przygotowane pod fotowoltaikę',title:'Energia pod kontrolą',copy:'Dach przygotowany pod fotowoltaikę wspiera niższe koszty użytkowania domu.',facts:[['Instalacja','Przygotowanie PV'],['Decyzja','We własnym czasie']],detail:'Przygotowanie instalacji pod fotowoltaikę obejmuje przewidziane w projekcie trasy i miejsce na osprzęt. Panele widoczne na wizualizacji nie oznaczają ich dostawy w standardzie.'},
  {tag:'Wnętrze',image:'standard-kitchen.webp',alt:'Otwarta kuchnia z wyspą i dużymi przeszkleniami',title:'Przestrzeń pełna światła',copy:'Duże przeszklenia i otwarta strefa dzienna pozwalają światłu pracować przez cały dzień.',facts:[['Strefa dzienna','35 m²'],['Światło','Duże przeszklenia']],detail:'Dwie pełne kondygnacje i otwarta strefa dzienna pozostawiają swobodę aranżacji. Wykończenie i zabudowy pokazane na wizualizacjach są inspiracją, a zakres odbioru opisuje dokumentacja domu.'},
  {tag:'Otoczenie',image:'standard-street.webp',alt:'Ulica osiedlowa z chodnikiem, zielenią i podjazdami',title:'Gotowe od pierwszego dnia',copy:'Zieleń, światłowód, podjazdy i dojścia są zaplanowane jako część gotowej całości.',facts:[['Internet','Światłowód'],['Otoczenie','Spójna przestrzeń']],detail:'Zaplanowane dojścia, miejsca postojowe, uporządkowana zieleń oraz przygotowanie infrastruktury internetowej. Szczegóły przyłączy, nawierzchni i przygotowania do ładowania EV należy potwierdzić dla wybranego domu.'},
];
document.querySelector('#standard-details').innerHTML = benefits.map(b=>`<article class="benefit"><div class="benefit-image"><img src="${asset(b.image)}" alt="${b.alt}" loading="lazy"><span class="tag">${b.tag}</span></div><h3>${b.title}</h3><p>${b.copy}</p><div class="benefit-metadata">${b.facts.map(f=>`<div><small>${f[0]}</small>${f[1]}</div>`).join('')}<img class="arrow" src="${asset('arrow-green.svg')}" alt=""></div><details><summary>Co obejmuje standard <span aria-hidden="true">+</span></summary><p>${b.detail}</p></details></article>`).join('');

const menu = document.querySelector('.menu-button');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.querySelector('#mobile-nav').hidden=expanded;menu.querySelector('span').textContent=expanded?'+':'−';});
document.querySelectorAll('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('#mobile-nav').hidden=true;menu.querySelector('span').textContent='+';}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});

const gallery=[{src:'gallery-garden.webp',caption:'01 — Ogród, drugi salon',alt:'Prywatny taras i ogród przy domu'},{src:'gallery-living.webp',caption:'02 — Miejsce na wspólny czas',alt:'Jasny salon z otwartą jadalnią'},{src:'gallery-bedroom.webp',caption:'03 — Przestrzeń tylko dla Was',alt:'Sypialnia z dużym oknem i drewnianymi detalami'}];
let galleryIndex=0;
const galleryDialog=document.querySelector('#gallery-dialog');
function updateGallery(){const item=gallery[galleryIndex];const img=document.querySelector('#gallery-full-image');img.src=asset(item.src);img.alt=item.alt;document.querySelector('#gallery-caption').textContent=item.caption;document.querySelector('#gallery-position').textContent=`0${galleryIndex+1} / 03`;}
function cycleGallery(direction){galleryIndex=(galleryIndex+direction+gallery.length)%gallery.length;updateGallery();}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{galleryIndex=Number(button.dataset.gallery);updateGallery();galleryDialog.showModal();}));
document.querySelector('#gallery-prev').addEventListener('click',()=>cycleGallery(-1));document.querySelector('#gallery-next').addEventListener('click',()=>cycleGallery(1));
galleryDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();cycleGallery(1);}if(e.key==='ArrowLeft'){e.preventDefault();cycleGallery(-1);}});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}}));
