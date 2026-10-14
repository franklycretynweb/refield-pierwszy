const asset = name => `/assets/${name}`;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// Prototype data. Prices added for visual demonstration only, never represented as a sales offer.
const demoPrices = [1289000,1279000,null,1249000,1239000,1309000,null,null,1269000,null,1249000,1299000];
export const units = [
 ['01',320,'available'],['02',280,'reserved'],['03',250,'sold'],['04',260,'available'],['05',240,'reserved'],['06',350,'available'],
 ['07',310,'sold'],['08',260,'sold'],['09',280,'available'],['10',230,'sold'],['11',240,'reserved'],['12',330,'available']
].map(([id,garden,status],i)=>({id,garden,status,area:148,rooms:5,demoPrice:demoPrices[i]}));
export const statusLabels = {available:'Dostępny',reserved:'Rezerwacja',sold:'Sprzedany'};
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
    <span class="home-card-bottom"><span>${u.rooms} pokoi <b>·</b> 2 kondygnacje</span><span class="home-open">Zobacz dom <img class="arrow" src="${asset('arrow-green.svg')}" alt=""></span></span>
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
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;applyFilters();}));
$('#garden-filter').addEventListener('change',e=>{minGarden=Number(e.target.value);applyFilters();});
$('#reset-filters').addEventListener('click',()=>{minGarden=0;activeFilter='all';$('#garden-filter').value='0';applyFilters();$('[data-filter="all"]').focus();});
$('#show-more').addEventListener('click',()=>{
  const previousCount=Math.min(visibleLimit,filteredUnits().length);visibleLimit+=6;renderCards();
  $$('.home-card')[previousCount]?.focus({preventScroll:true});
});
$('#show-available').addEventListener('click',()=>{
  activeFilter='available';minGarden=0;$('#garden-filter').value='0';applyFilters();
  $('.selector-toolbar').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  $('[data-filter="available"]').focus({preventScroll:true});
});
$('#house-list').addEventListener('click',e=>{
  const card=e.target.closest('[data-unit]');if(card)openHouse(card.dataset.unit,card);
});
function updateHouseURL(id,push=false){
  const url=new URL(location.href);
  if(id)url.searchParams.set('dom',id);else url.searchParams.delete('dom');
  if(push)history.pushState({refieldHouse:true},'',url);
  else history.replaceState(history.state,'',url);
}
export function openHouse(id,trigger=null,fromHistory=false){
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
    <aside class="home-specification" aria-label="Dom w skrócie"><div class="spec-intro"><span>Dom w skrócie</span><img class="editorial-arrow" src="${asset('arrow-green.svg')}" alt=""></div><dl><div class="spec-main"><dt>Powierzchnia domu</dt><dd>${u.area} <small>m²</small></dd></div><div class="spec-main"><dt>Prywatny ogród</dt><dd>${u.garden} <small>m²</small></dd></div><div><dt>Liczba pokoi</dt><dd>${u.rooms}</dd></div><div><dt>Kondygnacje</dt><dd>2</dd></div><div><dt>Planowany odbiór</dt><dd>IV kw. 2027</dd></div></dl><div class="price-note"><small>Cena przykładowa · podgląd</small><p>${u.demoPrice ? new Intl.NumberFormat('pl-PL').format(u.demoPrice)+' zł' : 'Cena niedostępna'}</p></div><p class="detail-disclaimer">Koncepcja prezentacji. Dostępność i parametry są demonstracyjne. Rzuty 3D pokazują przykładową aranżację, nie projekt wybranego domu.</p></aside></div>`;
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
$('#house-dialog-content').addEventListener('click',e=>{
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
$('#house-dialog-content').addEventListener('keydown',e=>{
  const tab=e.target.closest('[data-floor]');if(!tab)return;
  const keys=Object.keys(floors), index=keys.indexOf(activeFloor);
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
  e.preventDefault();
  activeFloor=e.key==='Home'?keys[0]:e.key==='End'?keys.at(-1):keys[(index+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length];
  renderFloor();$(`[data-floor="${activeFloor}"]`).focus();
});
houseDialog.addEventListener('close',()=>{
  if(history.state?.refieldHouse)history.back();
  else updateHouseURL(null);
  if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
});
window.addEventListener('popstate',()=>{
  const id=new URLSearchParams(location.search).get('dom');
  if(units.some(u=>u.id===id))openHouse(id,returnFocus,true);
  else if(houseDialog.open)houseDialog.close();
});
$('#print-house').addEventListener('click',()=>window.print());
$('#copy-house').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(location.href);$('#copy-house').innerHTML='Link skopiowany <span aria-hidden="true">✓</span>';$('#house-notice').textContent='Skopiowano link do wybranego domu.';}
  catch{$('#house-notice').classList.remove('sr-only');$('#house-notice').textContent='Skopiuj link z paska adresu przeglądarki.';}
});
renderCards();
const initialId=new URLSearchParams(location.search).get('dom');
if(units.some(u=>u.id===initialId))openHouse(initialId,null,true);
