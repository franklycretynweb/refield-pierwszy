import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
const luminance=color=>{
 const values=color.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{if(!color.startsWith('color(srgb'))v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
 return values[0]*.2126+values[1]*.7152+values[2]*.0722;
};
const contrast=(a,b)=>{const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(l[0]+.05)/(l[1]+.05);};
try {
 await mkdir('work/qa',{recursive:true});
 for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:1716,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  await context.addInitScript(value=>localStorage.setItem('theme',value),theme);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5182');await page.locator('header nav a').first().waitFor();await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  const colors=await page.evaluate(()=>({background:getComputedStyle(document.documentElement).backgroundColor,links:[...document.querySelectorAll('header nav a')].map(a=>getComputedStyle(a).color),logo:getComputedStyle(document.querySelector('header svg')).color}));
  colors.links.forEach(c=>assert.ok(contrast(c,colors.background)>=4.5,`${theme}: insufficient navigation contrast`));
  assert.ok(contrast(colors.logo,colors.background)>=3,`${theme}: insufficient logo contrast`);
  await page.screenshot({path:`work/qa/header-${theme}-hero.png`});
  await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(100);await page.evaluate(()=>scrollTo(0,250));await page.waitForTimeout(100);
  const background=await page.locator('header>div').evaluate(el=>getComputedStyle(el,'::before').backgroundColor);
  colors.links.forEach(c=>assert.ok(contrast(c,background)>=4.5,`${theme}: insufficient scrolled contrast`));
  await page.evaluate(()=>scrollTo(0,0));await page.setViewportSize({width:390,height:844});
  const hamburger=await page.locator('header button[aria-controls="refield-menu"] span').first().evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.ok(contrast(hamburger,colors.background)>=3);
  await page.getByRole('button',{name:'Otwórz menu'}).click();
  const mobileBg=await page.locator('#refield-menu').evaluate(el=>getComputedStyle(el).backgroundColor);
  colors.links.forEach(c=>assert.ok(contrast(c,mobileBg)>=4.5));
  await page.screenshot({path:`work/qa/header-${theme}-mobile-open.png`});await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: header contrast with light/dark preferences, hero, scrolled background, mobile menu and logo.');
} finally {await browser.close();}
