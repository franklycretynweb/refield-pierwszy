import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
const errors=[];const report=[];
const lum=color=>{const v=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{if(!color.startsWith('color(srgb'))n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
const contrast=(a,b)=>{const l=[lum(a),lum(b)].sort((x,y)=>y-x);return(l[0]+.05)/(l[1]+.05);};

try {
 await mkdir('work/qa/style',{recursive:true});
 for(const theme of ['light','dark'])for(const width of [1716,1024,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  await context.addInitScript(value=>localStorage.setItem('theme',value),theme);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.goto('http://127.0.0.1:5182');await page.waitForTimeout(200);
  await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{})));});
  assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  assert.equal(await page.locator('.hero-monogram').count(),1);assert.equal(await page.locator('.hero-line,.hero-wordmark').count(),0);
  assert.equal(await page.locator('#hero-title').evaluate(el=>getComputedStyle(el).fontWeight),'700');
  const audit=await page.evaluate(()=>{
   const sections=[...document.querySelectorAll('main>section,.ref-footer')];
   const canvases=sections.map(el=>({id:el.id,bg:getComputedStyle(el).backgroundColor}));
   const overflow=[...document.querySelectorAll('main h1,main h2,.benefit h3,.home-card,.shared-cta-title,.shared-cta-copy,.shared-cta-button,.price-table')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({class:el.className,text:el.textContent.slice(0,70),overflow:el.scrollWidth-el.clientWidth}));
   const ctas=[...document.querySelectorAll('.shared-cta')].map(el=>({height:el.clientHeight,children:[...el.children].map(c=>{const a=el.getBoundingClientRect(),b=c.getBoundingClientRect();return{inside:b.top>=a.top-1&&b.bottom<=a.bottom+1&&b.left>=a.left-1&&b.right<=a.right+1,text:c.textContent.slice(0,35)};})}));
   return{width:innerWidth,documentWidth:document.documentElement.scrollWidth,canvases,overflow,ctas};
  });
  assert.ok(audit.documentWidth<=width,JSON.stringify({theme,width,audit}));
  assert.deepEqual(audit.overflow,[],JSON.stringify({theme,width,audit}));
  audit.ctas.forEach(cta=>cta.children.forEach(child=>assert.ok(child.inside,JSON.stringify({theme,width,cta}))));
  const expected=theme==='dark'?'rgb(17, 36, 32)':'rgb(244, 244, 244)';
  audit.canvases.forEach(section=>assert.equal(section.bg,expected,`${theme}/${width}/${section.id}`));
  const textColors=await page.evaluate(()=>[...document.querySelectorAll('#hero-title em,.gallery h2 em,.standard h2 em,.construction h2 em,.journal h2 em,#zespol h2 em,.benefit h3,.home-name,.price-amount strong,.stage-heading,.ref-footer nav a')].map(el=>({text:el.textContent.slice(0,35),color:getComputedStyle(el).color})));
  textColors.forEach(item=>assert.ok(contrast(item.color,expected)>=4.5,JSON.stringify({theme,width,item,contrast:contrast(item.color,expected)})));
  report.push({theme,...audit});
  if(width===1716||width===390)await page.screenshot({path:`work/qa/style/${theme}-${width}.png`,fullPage:true});
  if(width===1716){
   await page.locator('.home-card[data-unit="01"]').click();
   assert.equal(await page.locator('#house-dialog-title').evaluate(el=>getComputedStyle(el).fontWeight),'700');
   assert.equal(await page.locator('#house-dialog').evaluate(el=>getComputedStyle(el).backgroundColor),theme==='dark'?'rgb(13, 28, 25)':'rgb(255, 255, 255)');
   await page.screenshot({path:`work/qa/style/${theme}-house.png`});await page.keyboard.press('Escape');
   await page.locator('.stage-2 button').click();await page.screenshot({path:`work/qa/style/${theme}-journal.png`});await page.keyboard.press('Escape');
   await page.locator('.gallery-garden .image-button').click();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#gallery-position').textContent(),'02 / 03');await page.keyboard.press('Escape');
   assert.equal(await page.locator('.gallery-garden .image-button').evaluate(el=>el===document.activeElement),true);
  }
  await context.close();
 }
 // Check smooth scrolling with normal motion, and native scrolling within the modal.
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5182');
 await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
 await page.locator('.hero .actions a').first().click();await page.waitForTimeout(1400);
 assert.ok(await page.evaluate(()=>Math.abs(document.querySelector('#wybierz-dom').getBoundingClientRect().top)<150));
 await page.locator('.home-card').first().click();assert.equal(await page.locator('#house-dialog').getAttribute('data-lenis-prevent'),'');await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);await writeFile('work/qa/style/report.json',JSON.stringify(report,null,2));
 console.log('PASS: both themes, 4 viewport sizes, preserved grids, no overflow/CTA collision, typography/monogram, modal themes, focus restoration, smooth anchor scrolling.');
}finally{await browser.close();}
