// Migrate the confirmed, immutable Vite snapshot. Never reads the live project.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';
import { adoptRefieldArrows } from './refield-adapter.mjs';
const source = new URL('../work/vite-matching/', import.meta.url);
const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, source), 'utf8');
const main = await read('src/main.js');
const homes = await read('src/homes.js');
const pricing = await read('src/pricing-journal.js');
const team = await read('src/team.js');
const nodes = new Map();
function query(selector) {
 if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', hidden: false, value: '', setAttribute() {} });
 return nodes.get(selector);
}
const sandbox = { document: { querySelector: query, querySelectorAll: () => [] }, Intl };
vm.createContext(sandbox);
vm.runInContext('{' + main.slice(main.indexOf('const asset'), main.indexOf('const menu')) + '}', sandbox);
vm.runInContext(homes.slice(0, homes.indexOf('function applyFilters')).replaceAll('export ', '') + '\nrenderCards();', sandbox);
vm.runInContext(`{
${pricing.slice(pricing.indexOf('const number'), pricing.indexOf("$('#price-sort-select').addEventListener"))}
renderPrices();
${pricing.slice(pricing.indexOf('const entries='), pricing.indexOf('let entryIndex='))}
}`, sandbox);
vm.runInContext(`{${team}}`, sandbox);
let html = (await read('index.html')).split('<body>')[1].split('<script')[0];
// The React header replaces the legacy project header and mobile navigation.
html = html.replace(/<header class="header container">[\s\S]*?<\/header>/, '').replace(/<nav id="mobile-nav"[\s\S]*?<\/nav>/, '');
for (const id of ['standard-details', 'house-list', 'price-rows', 'journal-sequence', 'team-grid']) {
 const pattern = new RegExp(`(<(?:div|tbody)[^>]*id="${id}"[^>]*>)(</(?:div|tbody)>)`);
 html = html.replace(pattern, (_, open, close) => open + query('#' + id).innerHTML + close);
}
html = html.replace('<p id="list-progress" aria-live="polite"></p>', `<p id="list-progress" aria-live="polite">${query('#list-progress').textContent}</p>`);
// Changes visible in the supplied Figma frame, excluding the location section
// which the user confirmed was not part of this original version.
html = html.replace(/<section id="w-skrocie"[\s\S]*?<\/section>/, '');
html = html.replace('<div class="hero-eyebrow">Nektarowa / Kameralnie. Po swojemu.</div>', '');
html = html.replace('<em>Domy,</em> które<br>podnoszą standard<br>codzienności.', '<em>Domy,</em> które podnoszą<br>standard codzienności.');
html = html.replace('Własny ogród. Przestrzeń dla najbliższych.<br>Dwanaście domów zaprojektowanych tak,<br class="desktop"> by dobrze było być u siebie.', 'Projektujemy osiedla, w których nie musicie tłumaczyć się z decyzji zakupu. <em>Sześć bliźniaków, dwanaście prywatnych ogrodów, jeden etap budowy</em>. Odbiór IV kw. 2027.');
// Preserve the two original navigation links to "W skrócie" with a useful target.
html = html.replace('id="standard"', 'id="standard"').replace('href="#w-skrocie"', 'href="#standard"').replace('href="#w-skrocie"', 'href="#standard"');
html = html.replace(/<div class="section-label">[^<]*<\/div>/g, '<div class="section-label" aria-hidden="true"></div>');
html = html.replace('05 / Przebieg budowy', '').replace('06 / Dziennik budowy · 04 odsłony', '');
html = html.replace('<div class="team-section-heading"><div class="section-label" aria-hidden="true"></div><h2 id="team-title">Doświadczenie, które<br><em>tworzą konkretni ludzie.</em></h2></div><div class="team-grid" id="team-grid">', '<div class="team-grid" id="team-grid"><div class="team-lead"><h2 id="team-title">Doświadczenie,<br><em>które tworzą ludzie.</em></h2></div>');
html = html.replace(/<img class="hero-line"[^>]*>/, await readFile(new URL('src/data/hero-monogram.svg', root), 'utf8'));
html = html.replace(/<span class="hero-wordmark"[\s\S]*?<\/span>/, '');
html = html.replace(/<p class="ref-footer-credit">[\s\S]*?<\/p>/, '<p class="ref-footer-credit">Wizualizacje i strona www – <a href="https://kokonat.pl/" target="_blank" rel="noopener noreferrer">kokonat.pl</a></p>');
html = html.replace(/<dialog /g, '<dialog data-lenis-prevent="" ');
html = adoptRefieldArrows(html);
await writeFile(new URL('src/data/page-markup.json', root), JSON.stringify(html));
function runtime(text) {
 text = adoptRefieldArrows(text);
 text = text.replace(/^import .*;\n/gm, '').replace(/\bexport /g, '');
 text = text.replace(/(document\.querySelector\('[^']*'\)|\$\('[^']*'\)|\b[A-Za-z_$][\w$]*)\.addEventListener\(/g, 'on($1,');
 if (text.includes('.addEventListener(')) throw new Error('Unhandled event receiver');
 return text.replaceAll('document.querySelectorAll(', 'root.querySelectorAll(').replaceAll('document.querySelector(', 'root.querySelector(');
}
const homeRuntime = runtime(homes);
const priceRuntime = runtime(pricing);
const mainRuntime = runtime(main.slice(0, main.indexOf('const menu')) + main.slice(main.indexOf('const gallery=')));
const constructionRuntime = runtime(await read('src/construction-timeline.js'));
const enhancement = `// Preserved Vite interactions with explicit mount/unmount lifecycle.\nexport function initializeSite(root, signal) {\n const on = (target, type, handler) => target.addEventListener(type, handler, { signal });\n function initializeHomes() {\n${homeRuntime}\nreturn { units, statusLabels, openHouse };\n}\n const { units, statusLabels, openHouse } = initializeHomes();\n function initializePricing() {\n${priceRuntime}\n}\n function initializeMain() {\n${mainRuntime}\n}\n function initializeConstruction() {\n${constructionRuntime}\n}\n initializePricing(); initializeMain(); initializeConstruction();\n}\n`;
await writeFile(new URL('src/legacy/interactions.js', root), enhancement);
const cssImports = [...main.matchAll(/^import '\.\/(.*\.css)';/gm)].map(m => m[1]);
for (const css of cssImports) await writeFile(new URL('src/legacy/' + css, root), await read('src/' + css));
const fonts = main.split('\n').filter(line => line.startsWith("import '@fontsource"));
const imports = cssImports.map(file => `import '../legacy/${file}';`);
await writeFile(new URL('src/app/layout.jsx', root), [...fonts, ...imports, "import './figma-match.css';", "import { RefieldHeader } from '../components/layout/RefieldHeader';", "import { themeScript } from '../data/header';", "import './refield-system.css';", "import { SiteEffects } from '../components/layout/SiteEffects';", `
export const metadata = { title: 'Nektarowa — Refield Homes', description: 'Nektarowa by Refield Homes. Domy, które podnoszą standard codzienności.' };
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f4f4f4' }, { media: '(prefers-color-scheme: dark)', color: '#112420' }] };
export default function RootLayout({ children }) { return <html lang="pl" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><RefieldHeader />{children}<SiteEffects /></body></html>; }
`].join('\n'));
console.log('Migrated confirmed Vite snapshot: server markup, original assets/styles, lifecycle-safe interactions.');
