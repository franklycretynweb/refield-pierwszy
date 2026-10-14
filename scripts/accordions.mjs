import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
try{
 for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:1716,height:1000},reducedMotion:'no-preference'});
  await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5182');await page.locator('.benefit-detail-body').first().waitFor({state:'attached'});await page.evaluate(()=>document.fonts.ready);
  const cards=page.locator('.benefit');const detail=cards.first().locator('details');const summary=detail.locator('summary');
  const heights=()=>cards.evaluateAll(items=>items.map(e=>e.getBoundingClientRect().height));
  const before=await heights();await summary.click();
  await page.waitForFunction(()=>document.querySelector('.benefit-detail-body').getAnimations().some(a=>a.playState==='running'&&a.currentTime>50&&a.currentTime<280));
  const during=await heights();assert.ok(during[0]>before[0]);for(let i=1;i<3;i++)assert.ok(Math.abs(during[i]-before[i])<.5);
  await page.waitForTimeout(400);const after=await heights();assert.ok(after[0]>during[0]);for(let i=1;i<3;i++)assert.ok(Math.abs(after[i]-before[i])<.5);
  await summary.click();assert.equal(await detail.evaluate(d=>d.open),true);
  assert.ok(await detail.locator('.benefit-detail-body').evaluate(e=>e.getAnimations().some(a=>a.playState==='running')));
  await page.waitForTimeout(400);assert.equal(await detail.evaluate(d=>d.open),false);assert.ok(Math.abs((await heights())[0]-before[0])<.5);
  await summary.click();await summary.click();await summary.click();await page.waitForTimeout(400);assert.equal(await detail.evaluate(d=>d.open),true);
  await summary.focus();await page.keyboard.press('Enter');await page.waitForTimeout(400);assert.equal(await detail.evaluate(d=>d.open),false);
  await page.emulateMedia({reducedMotion:'reduce'});await summary.click();assert.equal(await detail.evaluate(d=>d.open),true);assert.equal(await detail.locator('.benefit-detail-body').evaluate(e=>e.getAnimations().length),0);
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: animated opening/closing, unchanged sibling heights, rapid reversal, keyboard activation and reduced motion in both themes.');
}finally{await browser.close();}
