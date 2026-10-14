import { units, statusLabels, openHouse } from './homes.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const number = value => new Intl.NumberFormat('pl-PL',{maximumFractionDigits:0}).format(value);
let priceFilter='available', sortKey=null, sortDirection=1;
const priceUnits=()=>units.filter(u=>priceFilter==='all'||u.status==='available').sort((a,b)=>{
  if(!sortKey)return Number(a.id)-Number(b.id);
  if(sortKey==='garden')return (a.garden-b.garden)*sortDirection;
  if(a.demoPrice===null)return 1;
  if(b.demoPrice===null)return -1;
  return (a.demoPrice-b.demoPrice)*sortDirection;
});
function renderPrices(){
  const rows=priceUnits();
  $('#price-rows').innerHTML=rows.map(u=>`<tr data-status="${u.status}">
    <th scope="row"><span class="price-house-prefix">Dom</span> <span class="price-house-number">${u.id}<em>.</em></span></th>
    <td class="price-area" data-label="Pow. domu">${u.area} <small>m²</small></td>
    <td class="price-garden" data-label="Ogród">${u.garden} <small>m²</small></td>
    <td class="price-availability"><span class="home-status"><i class="status-dot"></i>${statusLabels[u.status]}</span></td>
    <td class="price-amount" data-label="Cena całkowita">${u.demoPrice!==null?`<strong>${number(u.demoPrice)} <small>zł</small></strong><span>${number(u.demoPrice/u.area)} zł/m²</span>`:'<strong class="price-unavailable">—</strong><span>Cena niedostępna</span>'}</td>
    <td class="price-row-action"><button data-price-house="${u.id}" aria-label="Zobacz szczegóły domu ${u.id}" aria-haspopup="dialog"><span>Zobacz dom</span><img class="arrow" src="/assets/arrow-green.svg" alt=""></button></td>
  </tr>`).join('');
  $('#price-count').textContent=priceFilter==='available'?`${rows.length} dostępnych domów`:`${rows.length} domów / pełne zestawienie`;
  $('#price-sort-select').value=sortKey?`${sortKey}:${sortDirection}`:'number';
  $$('[data-price-filter]').forEach(b=>{const active=b.dataset.priceFilter===priceFilter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $$('[data-price-sort]').forEach(b=>{
    const active=b.dataset.priceSort===sortKey;
    b.closest('th').setAttribute('aria-sort',active?(sortDirection===1?'ascending':'descending'):'none');
    b.querySelector('span').textContent=active?(sortDirection===1?'↑':'↓'):'↕';
  });
}
$('#price-from').textContent=number(Math.min(...units.filter(u=>u.status==='available').map(u=>u.demoPrice)));
$('#price-sort-select').addEventListener('change',e=>{
  const [key,direction]=e.target.value.split(':');sortKey=key==='number'?null:key;sortDirection=Number(direction)||1;renderPrices();
});
$$('[data-price-filter]').forEach(b=>b.addEventListener('click',()=>{priceFilter=b.dataset.priceFilter;renderPrices();}));
$$('[data-price-sort]').forEach(b=>b.addEventListener('click',()=>{
  if(sortKey===b.dataset.priceSort)sortDirection*=-1;else{sortKey=b.dataset.priceSort;sortDirection=1;}
  renderPrices();
}));
$('#price-rows').addEventListener('click',e=>{const b=e.target.closest('[data-price-house]');if(b)openHouse(b.dataset.priceHouse,b);});
$('#download-prices').addEventListener('click',()=>{
  const lines=[['DANE DEMONSTRACYJNE — NIE STANOWIĄ OFERTY'],['Dom','Powierzchnia domu (m²)','Ogród (m²)','Status przykładowy','Cena przykładowa (zł)','Cena przykładowa za m² (zł)'],...priceUnits().map(u=>[u.id,u.area,u.garden,statusLabels[u.status],u.demoPrice??'',u.demoPrice?Math.round(u.demoPrice/u.area):''])];
  const csv='\uFEFF'+lines.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='nektarowa-cennik-DEMO.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
renderPrices();

// Exact visual assets, dates and stage titles from the user's Figma 616:548.
// The source is a design concept, not a verified construction report.
const entries=[
  {date:'14.06.2026',iso:'2026-06-14',title:'Fundamenty<br>i płyta',image:'journal-01-foundations.png',alt:'Zdjęcie z koncepcji: zbrojenie płyty fundamentowej na placu budowy',intro:'Wszystko zaczyna się od solidnej podstawy.',copy:'Pierwszy rozdział Nektarowej: przygotowanie podłoża, zbrojenie i płyta fundamentowa. To tutaj przyszły dom po raz pierwszy zyskuje swój rzeczywisty obrys.',facts:['Przygotowanie podłoża','Zbrojenie fundamentów','Płyta fundamentowa'],next:'Kolejny krok: ściany parteru i piętra.'},
  {date:'05.07.2026',iso:'2026-07-05',title:'Mury<br>piętra',image:'journal-02-walls.png',alt:'Zdjęcie z koncepcji: ściany domu w stanie surowym i rusztowanie',intro:'Z planów wyłania się przestrzeń.',copy:'Ściany wyznaczają już proporcje pomieszczeń, a otwory okienne pokazują, którędy do wnętrz będzie wpadać światło. Architektura zyskuje kolejną kondygnację.',facts:['Ściany zewnętrzne','Otwory okienne','Konstrukcja piętra'],next:'Kolejny krok: konstrukcja i pokrycie dachów.'},
  {date:'26.07.2026',iso:'2026-07-26',title:'Zamknięte<br>dachy',image:'journal-03-roofs.png',alt:'Zdjęcie z koncepcji: dwuspadowe dachy budowanych domów',intro:'Domy nabierają swoich proporcji.',copy:'Charakterystyczne szczyty porządkują rytm zabudowy. Prace przy dachach przybliżają budynki do zamknięcia bryły i przygotowania kolejnych warstw zewnętrznych.',facts:['Konstrukcja dachów','Prace dekarskie','Detale szczytów'],next:'Kolejny krok: wykończenie elewacji.'},
  {date:'12.08.2026',iso:'2026-08-12',title:'Fasady nabierają<br>wyrazu',image:'journal-04-facades.png',alt:'Zdjęcie z koncepcji: jasne fasady domów z drewnianymi detalami',intro:'To już nie tylko bryła. To charakter.',copy:'Jasny tynk i drewniane akcenty podkreślają prostą geometrię domów. Z bliska widać fakturę materiałów; z perspektywy ulicy — spójną całość.',facts:['Jasne powierzchnie elewacji','Drewniane detale szczytów','Prace wykończeniowe'],next:'Kolejny rozdział: otoczenie domów.'}
];
$('#journal-sequence').innerHTML=entries.map((e,i)=>`<article class="journal-stage stage-${i+1}"><button data-journal-open="${i}" aria-haspopup="dialog" aria-label="Przeczytaj wpis: ${e.title.replace('<br>',' ')}, ${e.date}"><span class="stage-image"><img src="/assets/${e.image}" alt="${e.alt}" loading="lazy"><span class="stage-number">0${i+1}</span>${i===3?'<span class="stage-newest">Najnowsza odsłona</span>':''}<span class="stage-image-action">Zajrzyjcie bliżej <img src="/assets/journal-arrow.svg" alt=""></span></span><time datetime="${e.iso}">${e.date.slice(0,5)} <span>· 2026</span></time><span class="stage-heading"><span>${e.title}</span><img src="/assets/journal-arrow.svg" alt=""></span></button></article>`).join('');
let entryIndex=3, journalTrigger=null;
const journalDialog=$('#journal-dialog');
function renderEntry(){
  const e=entries[entryIndex];
  $('#journal-dialog-content').innerHTML=`<figure class="entry-image"><img src="/assets/${e.image}" alt="${e.alt}"><figcaption>Materiał z koncepcji wizualnej / Nektarowa</figcaption></figure><article class="entry-copy"><div class="entry-meta"><span>Odsłona 0${entryIndex+1}</span><time datetime="${e.iso}">${e.date}</time></div><h2 id="journal-dialog-title">${e.title}<em>.</em></h2><h3>${e.intro}</h3><p>${e.copy}</p><div class="entry-scope"><span>W tej odsłonie</span>${e.facts.map((f,i)=>`<div><small>0${i+1}</small>${f}</div>`).join('')}</div><p class="entry-next">${e.next}</p><p class="entry-disclaimer">Wpis demonstracyjny na podstawie projektu w Figmie. Opis, zdjęcie i data wymagają potwierdzenia jako dokumentacja tej inwestycji.</p></article>`;
  $('#journal-position').textContent=`0${entryIndex+1} / 04`;
  $('.entry-image').dataset.stage=String(entryIndex);
  $('#journal-prev').disabled=entryIndex===0;$('#journal-next').disabled=entryIndex===entries.length-1;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-journal-open]');if(!b)return;
  entryIndex=Number(b.dataset.journalOpen);journalTrigger=b;renderEntry();journalDialog.showModal();journalDialog.scrollTop=0;
});
function moveEntry(step){
  const next=entryIndex+step;if(next<0||next>=entries.length)return;
  entryIndex=next;renderEntry();
  const button=step>0?$('#journal-next'):$('#journal-prev');
  if(button.disabled)(step>0?$('#journal-prev'):$('#journal-next')).focus({preventScroll:true});
}
$('#journal-prev').addEventListener('click',()=>moveEntry(-1));
$('#journal-next').addEventListener('click',()=>moveEntry(1));
journalDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveEntry(e.key==='ArrowLeft'?-1:1);}});
journalDialog.addEventListener('close',()=>journalTrigger?.focus({preventScroll:true}));
$('#open-journal-notifications').addEventListener('click',()=>{$('#notification-result').textContent='';$('#journal-notifications').showModal();});
$('#journal-notification-form').addEventListener('submit',e=>{
  e.preventDefault();$('#notification-result').textContent='Tak będzie wyglądał zapis. To tylko podgląd — adres nie został wysłany ani zapisany.';
});
