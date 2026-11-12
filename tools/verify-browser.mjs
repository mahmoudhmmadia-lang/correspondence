import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { buildHtml, ROOT } from './build-html.mjs';
import { createServer } from './serve-html.mjs';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = createRequire(new URL('../../inspection/tools/package.json', import.meta.url))('playwright-core')); }
buildHtml();
const server = createServer();
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/ar`;
const out = path.join(ROOT, 'review/screenshots');
fs.mkdirSync(out, { recursive: true });
let browser;
const evidence = [], errors = [];
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const width of [1440, 390]) for (const theme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    for (const file of ['index', 'c1']) {
      await page.goto(`${base}/${file}.html`);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file} ${width}: overflow`);
      if (file === 'c1') {
        assert.ok(await page.locator('main').innerText().then((s) => s.includes('اختبار الإتقان')));
        for (const img of await page.locator('main figure.shot img').all()) {
          await img.scrollIntoViewIfNeeded();
          assert.ok(await img.evaluate((e) => e.decode().then(() => e.naturalWidth > 0)));
        }
        await page.locator('[data-zoom]').first().click();
        assert.equal(await page.locator('.lightbox').isVisible(), true);
        await page.locator('.lightbox-close').click();
        assert.equal(await page.locator('.lightbox').isVisible(), false);
        await page.locator('main svg.diagram').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(out, `route-${width}-${theme}.png`) });
        const done = page.locator('[data-done]').first();
        await done.click();
        assert.equal(await done.getAttribute('aria-pressed'), 'true');
        await page.reload();
        assert.equal(await page.locator('[data-done]').first().getAttribute('aria-pressed'), 'true');
        await page.locator('[data-done]').first().click();
        await page.locator('[data-open-search]').first().click();
        await page.locator('.palette input').fill('سجّل التسليم الحقيقي');
        await page.locator('.palette-list a').first().click();
        await page.waitForLoadState();
        assert.ok(page.url().includes('c1.html#'));
        await page.screenshot({ path: path.join(out, `dispatch-${width}-${theme}.png`) });
        await page.goto(`${base}/${file}.html`);
        // Exercise every step's layout, including wide field tables near the end.
        for (const step of await page.locator('main section.step').all()) {
          await step.scrollIntoViewIfNeeded();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        }
        await page.evaluate(() => scrollTo(0, 0));
      }
      await page.screenshot({ path: path.join(out, `${file}-${width}-${theme}.png`) });
      evidence.push({ width, theme, file, passed: true });
    }
    await ctx.close();
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(ROOT, 'review/browser-verification.json'), JSON.stringify({ checkedOn: new Date().toISOString(), scope: 'Local guide only; not a live correspondence workflow', checks: ['desktop/mobile, light/dark', 'all steps fit viewport', 'all screenshots decode; image zoom opens and closes', 'search navigates to dispatch step', 'reading completion persists after reload', 'no browser errors or missing resources'], evidence, errors }, null, 2));
  console.log(`PASS ${evidence.length} page cases`);
} finally { await browser?.close(); server.close(); }
