// Preserved Vite interactions with explicit mount/unmount lifecycle.
export function initializeSite(root, signal) {
 const on = (target, type, handler) => target.addEventListener(type, handler, { signal });
 function initializeHomes() {
const asset = name => `/assets/${name}`;
const $ = selector => root.querySelector(selector);
const $$ = selector => [...root.querySelectorAll(selector)];

// Prototype data. Prices added for visual demonstration only, never represented as a sales offer.
const demoPrices = [1289000,1279000,null,1249000,1239000,1309000,null,null,1269000,null,1249000,1299000];
const units = [
 ['01',320,'available'],['02',280,'reserved'],['03',250,'sold'],['04',260,'available'],['05',240,'reserved'],['06',350,'available'],
 ['07',310,'sold'],['08',260,'sold'],['09',280,'available'],['10',230,'sold'],['11',240,'reserved'],['12',330,'available']
].map(([id,garden,status],i)=>({id,garden,status,area:148,rooms:5,demoPrice:demoPrices[i]}));
const statusLabels = {available:'Dostępny',reserved:'Rezerwacja',sold:'Sprzedany'};
let activeFilter='all', minGarden=0, visibleLimit=6, selectedId=null, activeFloor='ground';
let returnFocus=null;
const houseDialog=$('#house-dialog');
const floors={
  ground:{label:'Parter',title:'Miejsce na wspólny czas.',copy:'Otwarta strefa dzienna, kuchnia i wyjście na taras. Zobaczcie przykładową aranżację.',image:'floor-ground-v2.png',alt:'Poglądowy model 3D parteru z salonem, kuchnią i ogrodem'},
  upper:{label:'Piętro',title:'Każdy ma swoją przestrzeń.',copy:'Pokoje na odpoczynek, pracę i własny rytm. Zobaczcie przykładową aranżację.',image:'floor-upper-v2.png',alt:'Poglądowy model 3D piętra z sypialniami i łazienką'},
  garden:{label:'Ogród',title:'Jeszcze więcej Waszego świata.',copy:'Miejsce na śniadanie na tarasie i spokojne popołudnia. Propozycja aranżacji ogrodu.',image:'gallery-garden.webp',alt:'Przykładowa aranżacja prywatnego ogrodu i tarasu'}
};
const filteredUnits=()=>units.filter(u=>(activeFilter==='all'||u.status==='available')&&u.garden>=minGarden);
const plural=n=>n===1?'dom':n>=2&&n<=4?'domy':'domów';
function renderCards() {
  const filtered=filteredUnits(), shown=filtered.slice(0,visibleLimit);
  $('#house-list').innerHTML=shown.map(u=>`<button class="home-card" data-unit="${u.id}" data-status="${u.status}" aria-haspopup="dialog" aria-label="Zobacz dom ${u.id}, ${statusLabels[u.status]}, ${u.area} m², ogród ${u.garden} m²">
    <span class="home-card-top"><span class="home-name">Dom ${u.id}<em>.</em></span><span class="home-status"><i class="status-dot"></i>${statusLabels[u.status]}</span></span>
    <span class="home-card-body"><span class="home-dimensions"><span><small>Powierzchnia domu</small><strong>${u.area} <span>m²</span></strong></span><span><small>Prywatny ogród</small><strong>${u.garden} <span>m²</span></strong></span></span><span class="home-plan"><img src="${asset('floor-ground-v2.png')}" alt="" loading="lazy"><span>Podgląd 3D</span></span></span>
    <span class="home-card-bottom"><span>${u.rooms} pokoi <b>·</b> 2 kondygnacje</span><span class="home-open">Zobacz dom <svg class="arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>
  </button>`).join('');
  $('#empty-state').hidden=filtered.length>0;
  $('.selector-count').textContent=`${filtered.length} ${plural(filtered.length)}`;
  $('#list-progress').textContent=`Pokazujemy ${shown.length} z ${filtered.length} domów`;
  $('#show-more').hidden=shown.length>=filtered.length;
  $$('[data-filter]').forEach(button=>{
    const active=button.dataset.filter===activeFilter;
    button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active));
  });
}
function applyFilters(){visibleLimit=6;renderCards();}
$$('[data-filter]').forEach(button=>on(button,'click',()=>{activeFilter=button.dataset.filter;applyFilters();}));
on($('#garden-filter'),'change',e=>{minGarden=Number(e.target.value);applyFilters();});
on($('#reset-filters'),'click',()=>{minGarden=0;activeFilter='all';$('#garden-filter').value='0';applyFilters();$('[data-filter="all"]').focus();});
on($('#show-more'),'click',()=>{
  const previousCount=Math.min(visibleLimit,filteredUnits().length);visibleLimit+=6;renderCards();
  $$('.home-card')[previousCount]?.focus({preventScroll:true});
});
on($('#show-available'),'click',()=>{
  activeFilter='available';minGarden=0;$('#garden-filter').value='0';applyFilters();
  $('.selector-toolbar').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  $('[data-filter="available"]').focus({preventScroll:true});
});
on($('#house-list'),'click',e=>{
  const card=e.target.closest('[data-unit]');if(card)openHouse(card.dataset.unit,card);
});
function updateHouseURL(id,push=false){
  const url=new URL(location.href);
  if(id)url.searchParams.set('dom',id);else url.searchParams.delete('dom');
  if(push)history.pushState({refieldHouse:true},'',url);
  else history.replaceState(history.state,'',url);
}
function openHouse(id,trigger=null,fromHistory=false){
  selectedId=id;activeFloor='ground';returnFocus=trigger;
  renderHouse();if(!fromHistory)updateHouseURL(id,true);
  if(!houseDialog.open)houseDialog.showModal();
  houseDialog.scrollTop=0;$('.back-to-houses').focus({preventScroll:true});
}
function renderHouse(){
  const u=units.find(u=>u.id===selectedId);
  let sequence=filteredUnits();if(!sequence.some(item=>item.id===selectedId))sequence=units;
  const index=sequence.findIndex(item=>item.id===selectedId);
  $('#house-dialog-content').innerHTML=`<div class="home-detail-heading"><div><span class="detail-eyebrow">Wasz dom przy Nektarowej</span><h2 id="house-dialog-title">Dom ${u.id}<em>.</em><span class="home-status" data-status="${u.status}"><i class="status-dot"></i>${statusLabels[u.status]}</span></h2></div><div class="house-pager"><span>${String(index+1).padStart(2,'0')} / ${String(sequence.length).padStart(2,'0')} <small>${activeFilter==='available'?'dostępnych domów':'domów w wyborze'}</small></span><button data-step="-1" aria-label="Poprzedni dom" ${index===0?'disabled':''}>←</button><button data-step="1" aria-label="Następny dom" ${index===sequence.length-1?'disabled':''}>→</button></div></div>
    <div class="home-detail-layout"><div class="home-viewer"><div class="floor-navigation"><div role="tablist" aria-label="Przestrzenie domu">${Object.entries(floors).map(([key,f],i)=>`<button role="tab" id="tab-${key}" aria-controls="floor-panel" aria-selected="${activeFloor===key}" tabindex="${activeFloor===key?0:-1}" data-floor="${key}"><span>0${i+1}</span> ${f.label}</button>`).join('')}</div><span class="viewer-label">Widok poglądowy</span></div><div id="floor-panel" role="tabpanel" tabindex="0"></div></div>
    <aside class="home-specification" aria-label="Dom w skrócie"><div class="spec-intro"><span>Dom w skrócie</span><svg class="editorial-arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div><dl><div class="spec-main"><dt>Powierzchnia domu</dt><dd>${u.area} <small>m²</small></dd></div><div class="spec-main"><dt>Prywatny ogród</dt><dd>${u.garden} <small>m²</small></dd></div><div><dt>Liczba pokoi</dt><dd>${u.rooms}</dd></div><div><dt>Kondygnacje</dt><dd>2</dd></div><div><dt>Planowany odbiór</dt><dd>IV kw. 2027</dd></div></dl><div class="price-note"><small>Cena przykładowa · podgląd</small><p>${u.demoPrice ? new Intl.NumberFormat('pl-PL').format(u.demoPrice)+' zł' : 'Cena niedostępna'}</p></div><p class="detail-disclaimer">Koncepcja prezentacji. Dostępność i parametry są demonstracyjne. Rzuty 3D pokazują przykładową aranżację, nie projekt wybranego domu.</p></aside></div>`;
  renderFloor();
  $('#copy-house').innerHTML='Kopiuj link <span aria-hidden="true">↗</span>';
  $('#house-notice').textContent='';
}
function renderFloor(){
  const f=floors[activeFloor], panel=$('#floor-panel');
  panel.setAttribute('aria-labelledby',`tab-${activeFloor}`);
  panel.innerHTML=`<div class="floor-image ${activeFloor==='garden'?'is-garden':''}"><img src="${asset(f.image)}" alt="${f.alt}"><span class="floor-watermark" aria-hidden="true">refield homes.</span><span class="floor-view-index">${f.label} / Nektarowa</span></div><div class="floor-caption"><h3>${f.title}</h3><p>${f.copy}</p></div>`;
  $$('[data-floor]').forEach(tab=>{const active=tab.dataset.floor===activeFloor;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
}
on($('#house-dialog-content'),'click',e=>{
  const tab=e.target.closest('[data-floor]');if(tab){activeFloor=tab.dataset.floor;renderFloor();}
  const step=e.target.closest('[data-step]');
  if(step&&!step.disabled){
    let sequence=filteredUnits();if(!sequence.some(u=>u.id===selectedId))sequence=units;
    const index=sequence.findIndex(u=>u.id===selectedId)+Number(step.dataset.step);
    selectedId=sequence[index].id;renderHouse();updateHouseURL(selectedId);
    const nextFocus=$(`[data-step="${step.dataset.step}"]`);
    (nextFocus.disabled?$(`[data-step="${-Number(step.dataset.step)}"]`):nextFocus).focus({preventScroll:true});
  }
});
on($('#house-dialog-content'),'keydown',e=>{
  const tab=e.target.closest('[data-floor]');if(!tab)return;
  const keys=Object.keys(floors), index=keys.indexOf(activeFloor);
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
  e.preventDefault();
  activeFloor=e.key==='Home'?keys[0]:e.key==='End'?keys.at(-1):keys[(index+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length];
  renderFloor();$(`[data-floor="${activeFloor}"]`).focus();
});
on(houseDialog,'close',()=>{
  if(history.state?.refieldHouse)history.back();
  else updateHouseURL(null);
  if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
});
on(window,'popstate',()=>{
  const id=new URLSearchParams(location.search).get('dom');
  if(units.some(u=>u.id===id))openHouse(id,returnFocus,true);
  else if(houseDialog.open)houseDialog.close();
});
on($('#print-house'),'click',()=>window.print());
on($('#copy-house'),'click',async()=>{
  try{await navigator.clipboard.writeText(location.href);$('#copy-house').innerHTML='Link skopiowany <span aria-hidden="true">✓</span>';$('#house-notice').textContent='Skopiowano link do wybranego domu.';}
  catch{$('#house-notice').classList.remove('sr-only');$('#house-notice').textContent='Skopiuj link z paska adresu przeglądarki.';}
});
renderCards();
const initialId=new URLSearchParams(location.search).get('dom');
if(units.some(u=>u.id===initialId))openHouse(initialId,null,true);

return { units, statusLabels, openHouse };
}
 const { units, statusLabels, openHouse } = initializeHomes();
 function initializePricing() {

const $ = selector => root.querySelector(selector);
const $$ = selector => [...root.querySelectorAll(selector)];
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
    <td class="price-row-action"><button data-price-house="${u.id}" aria-label="Zobacz szczegóły domu ${u.id}" aria-haspopup="dialog"><span>Zobacz dom</span><svg class="arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></td>
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
on($('#price-sort-select'),'change',e=>{
  const [key,direction]=e.target.value.split(':');sortKey=key==='number'?null:key;sortDirection=Number(direction)||1;renderPrices();
});
$$('[data-price-filter]').forEach(b=>on(b,'click',()=>{priceFilter=b.dataset.priceFilter;renderPrices();}));
$$('[data-price-sort]').forEach(b=>on(b,'click',()=>{
  if(sortKey===b.dataset.priceSort)sortDirection*=-1;else{sortKey=b.dataset.priceSort;sortDirection=1;}
  renderPrices();
}));
on($('#price-rows'),'click',e=>{const b=e.target.closest('[data-price-house]');if(b)openHouse(b.dataset.priceHouse,b);});
on($('#download-prices'),'click',()=>{
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
$('#journal-sequence').innerHTML=entries.map((e,i)=>`<article class="journal-stage stage-${i+1}"><button data-journal-open="${i}" aria-haspopup="dialog" aria-label="Przeczytaj wpis: ${e.title.replace('<br>',' ')}, ${e.date}"><span class="stage-image"><img src="/assets/${e.image}" alt="${e.alt}" loading="lazy"><span class="stage-number">0${i+1}</span>${i===3?'<span class="stage-newest">Najnowsza odsłona</span>':''}<span class="stage-image-action">Zajrzyjcie bliżej <svg class="refield-arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span><time datetime="${e.iso}">${e.date.slice(0,5)} <span>· 2026</span></time><span class="stage-heading"><span>${e.title}</span><svg class="refield-arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button></article>`).join('');
let entryIndex=3, journalTrigger=null;
const journalDialog=$('#journal-dialog');
function renderEntry(){
  const e=entries[entryIndex];
  $('#journal-dialog-content').innerHTML=`<figure class="entry-image"><img src="/assets/${e.image}" alt="${e.alt}"><figcaption>Materiał z koncepcji wizualnej / Nektarowa</figcaption></figure><article class="entry-copy"><div class="entry-meta"><span>Odsłona 0${entryIndex+1}</span><time datetime="${e.iso}">${e.date}</time></div><h2 id="journal-dialog-title">${e.title}<em>.</em></h2><h3>${e.intro}</h3><p>${e.copy}</p><div class="entry-scope"><span>W tej odsłonie</span>${e.facts.map((f,i)=>`<div><small>0${i+1}</small>${f}</div>`).join('')}</div><p class="entry-next">${e.next}</p><p class="entry-disclaimer">Wpis demonstracyjny na podstawie projektu w Figmie. Opis, zdjęcie i data wymagają potwierdzenia jako dokumentacja tej inwestycji.</p></article>`;
  $('#journal-position').textContent=`0${entryIndex+1} / 04`;
  $('.entry-image').dataset.stage=String(entryIndex);
  $('#journal-prev').disabled=entryIndex===0;$('#journal-next').disabled=entryIndex===entries.length-1;
}
on(document,'click',e=>{
  const b=e.target.closest('[data-journal-open]');if(!b)return;
  entryIndex=Number(b.dataset.journalOpen);journalTrigger=b;renderEntry();journalDialog.showModal();journalDialog.scrollTop=0;
});
function moveEntry(step){
  const next=entryIndex+step;if(next<0||next>=entries.length)return;
  entryIndex=next;renderEntry();
  const button=step>0?$('#journal-next'):$('#journal-prev');
  if(button.disabled)(step>0?$('#journal-prev'):$('#journal-next')).focus({preventScroll:true});
}
on($('#journal-prev'),'click',()=>moveEntry(-1));
on($('#journal-next'),'click',()=>moveEntry(1));
on(journalDialog,'keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveEntry(e.key==='ArrowLeft'?-1:1);}});
on(journalDialog,'close',()=>journalTrigger?.focus({preventScroll:true}));
on($('#open-journal-notifications'),'click',()=>{$('#notification-result').textContent='';$('#journal-notifications').showModal();});
on($('#journal-notification-form'),'submit',e=>{
  e.preventDefault();$('#notification-result').textContent='Tak będzie wyglądał zapis. To tylko podgląd — adres nie został wysłany ani zapisany.';
});

}
 function initializeMain() {

const asset = name => `/assets/${name}`;
const benefits = [
  {tag:'Komfort',image:'standard-comfort.webp',alt:'Salon z jadalnią i otwartą strefą dzienną',title:'Komfort przez cały rok',copy:'Ogrzewanie podłogowe i wentylacja mechaniczna pracują na wygodę w każdym sezonie.',facts:[['Ogrzewanie','Podłogowe'],['Wentylacja','Mechaniczna']],detail:'Pompa ciepła, ogrzewanie podłogowe i wentylacja mechaniczna z odzyskiem ciepła tworzą jeden system. Szczegółowe parametry urządzeń i instalacji określa standard wybranego domu.'},
  {tag:'Działka',image:'standard-garden.webp',alt:'Prywatne ogrody i tarasy przy domach',title:'Prywatny ogród',copy:'Taras i ogród są naturalnym przedłużeniem salonu — z miejscem na własny rytm.',facts:[['Twoja przestrzeń','Prywatny ogród'],['Otoczenie','Zieleń i taras']],detail:'Własny ogród przy każdym domu, uporządkowany teren i miejsce na taras. Powierzchnia działki oraz zakres nasadzeń zależą od wybranego segmentu. Elementy wyposażenia na wizualizacji są propozycją aranżacji.'},
  {tag:'Energia',image:'standard-energy.png',alt:'Połacie dachowe przygotowane pod fotowoltaikę',title:'Energia pod kontrolą',copy:'Dach przygotowany pod fotowoltaikę wspiera niższe koszty użytkowania domu.',facts:[['Instalacja','Przygotowanie PV'],['Decyzja','We własnym czasie']],detail:'Przygotowanie instalacji pod fotowoltaikę obejmuje przewidziane w projekcie trasy i miejsce na osprzęt. Panele widoczne na wizualizacji nie oznaczają ich dostawy w standardzie.'},
  {tag:'Wnętrze',image:'standard-kitchen.webp',alt:'Otwarta kuchnia z wyspą i dużymi przeszkleniami',title:'Przestrzeń pełna światła',copy:'Duże przeszklenia i otwarta strefa dzienna pozwalają światłu pracować przez cały dzień.',facts:[['Strefa dzienna','35 m²'],['Światło','Duże przeszklenia']],detail:'Dwie pełne kondygnacje i otwarta strefa dzienna pozostawiają swobodę aranżacji. Wykończenie i zabudowy pokazane na wizualizacjach są inspiracją, a zakres odbioru opisuje dokumentacja domu.'},
  {tag:'Otoczenie',image:'standard-street.webp',alt:'Ulica osiedlowa z chodnikiem, zielenią i podjazdami',title:'Gotowe od pierwszego dnia',copy:'Zieleń, światłowód, podjazdy i dojścia są zaplanowane jako część gotowej całości.',facts:[['Internet','Światłowód'],['Otoczenie','Spójna przestrzeń']],detail:'Zaplanowane dojścia, miejsca postojowe, uporządkowana zieleń oraz przygotowanie infrastruktury internetowej. Szczegóły przyłączy, nawierzchni i przygotowania do ładowania EV należy potwierdzić dla wybranego domu.'},
];
root.querySelector('#standard-details').innerHTML = benefits.map(b=>`<article class="benefit"><div class="benefit-image"><img src="${asset(b.image)}" alt="${b.alt}" loading="lazy"><span class="tag">${b.tag}</span></div><h3>${b.title}</h3><p>${b.copy}</p><div class="benefit-metadata">${b.facts.map(f=>`<div><small>${f[0]}</small>${f[1]}</div>`).join('')}<svg class="arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 13.5L14 4M6.5 4H14V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div><details><summary>Co obejmuje standard <span aria-hidden="true">+</span></summary><p>${b.detail}</p></details></article>`).join('');

const gallery=[{src:'gallery-garden.webp',caption:'01 — Ogród, drugi salon',alt:'Prywatny taras i ogród przy domu'},{src:'gallery-living.webp',caption:'02 — Miejsce na wspólny czas',alt:'Jasny salon z otwartą jadalnią'},{src:'gallery-bedroom.webp',caption:'03 — Przestrzeń tylko dla Was',alt:'Sypialnia z dużym oknem i drewnianymi detalami'}];
let galleryIndex=0;
const galleryDialog=root.querySelector('#gallery-dialog');
function updateGallery(){const item=gallery[galleryIndex];const img=root.querySelector('#gallery-full-image');img.src=asset(item.src);img.alt=item.alt;root.querySelector('#gallery-caption').textContent=item.caption;root.querySelector('#gallery-position').textContent=`0${galleryIndex+1} / 03`;}
function cycleGallery(direction){galleryIndex=(galleryIndex+direction+gallery.length)%gallery.length;updateGallery();}
root.querySelectorAll('[data-gallery]').forEach(button=>on(button,'click',()=>{galleryIndex=Number(button.dataset.gallery);updateGallery();galleryDialog.showModal();}));
on(root.querySelector('#gallery-prev'),'click',()=>cycleGallery(-1));on(root.querySelector('#gallery-next'),'click',()=>cycleGallery(1));
on(galleryDialog,'keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();cycleGallery(1);}if(e.key==='ArrowLeft'){e.preventDefault();cycleGallery(-1);}});
root.querySelectorAll('[data-close]').forEach(button=>on(button,'click',()=>document.getElementById(button.dataset.close).close()));
root.querySelectorAll('dialog').forEach(dialog=>on(dialog,'click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}}));

}
 function initializeConstruction() {
// Animate the content, not the details box: the numbered node stays outside it.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
root.querySelectorAll('.construction-step').forEach(step => {
  const summary = step.querySelector('summary');
  const content = step.querySelector('.construction-detail');
  let animation = null;
  let targetOpen = step.open;
  on(summary,'click', event => {
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

}
 initializePricing(); initializeMain(); initializeConstruction();
}
