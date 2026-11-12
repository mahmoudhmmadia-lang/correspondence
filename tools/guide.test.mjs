import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildHtml, ROOT, STORE } from './build-html.mjs';
import { loadDocument } from './latex-parse.mjs';

buildHtml();
const pages = Object.fromEntries(['index.html', 'c1.html', 'c2.html'].map((name) => [name, fs.readFileSync(path.join(ROOT, 'site/ar', name), 'utf8')]));
const doc = loadDocument(ROOT, { lang: 'ar' });
test('Arabic walkthrough builds with its own saved progress', () => {
  assert.deepEqual(Object.keys(pages).sort(), ['c1.html', 'c2.html', 'index.html']);
  for (const html of Object.values(pages)) {
    assert.match(html, /<html lang="ar" dir="rtl"/);
    assert.ok(html.includes(STORE));
    assert.doesNotMatch(html, /inspection-walkthrough-progress|\.\.\/en\//);
  }
});
test('all generated local destinations and fragments exist', () => {
  for (const [name, html] of Object.entries(pages)) {
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = raw.replaceAll('&amp;', '&');
      if (/^(https?:|data:|mailto:)/.test(href)) continue;
      const [url, fragment] = href.split('#');
      const dest = path.resolve(ROOT, 'site/ar', url ? url.split('?')[0] : name);
      assert.ok(fs.existsSync(dest), `${name}: ${href}`);
      if (fragment && dest.endsWith('.html')) assert.ok(fs.readFileSync(dest, 'utf8').includes(`id="${fragment}"`), href);
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate ids`);
    assert.doesNotMatch(html, />\?\?</);
  }
});
test('every step has an observable completion check', () => {
  const steps = pages['c1.html'].split(/<section class="step/).slice(1);
  assert.ok(steps.length >= 30);
  for (const step of steps) assert.match(step, /تحقق:/);
});
test('organization identities match the inspection reference', () => {
  const org = JSON.parse(fs.readFileSync(path.join(ROOT, 'review/organization-reference.json'), 'utf8'));
  const html = pages['c1.html'];
  for (const member of org.members) assert.ok(html.includes(member.name.ar));
  for (const node of org.nodes) assert.ok(html.includes(node.name.ar));
  assert.doesNotMatch(html, /شركة الأفق|عمر حداد|سارة الخطيب/);
});
test('figures have explanations and use existing assets', () => {
  const shots = doc.blocks.filter((b) => b.type === 'figure' && b.image);
  assert.equal(shots.length, 3);
  for (const shot of shots) assert.ok(shot.noteKeys?.length, `${shot.image}: missing numbered legend`);
  for (const b of doc.blocks.filter((b) => b.type === 'figure')) {
    assert.ok(b.note);
    if (b.image) assert.ok(fs.existsSync(path.join(ROOT, b.image)));
    if (b.tikz) assert.match(pages['c1.html'], /svg class="diagram"/);
  }
});
test('companies chapter follows the real directorate flow', () => {
  const html = pages['c2.html'];
  const steps = html.split(/<section class="step/).slice(1);
  assert.ok(steps.length >= 15);
  for (const step of steps) assert.match(step, /تحقق:/);
  for (const name of ['مديرية الشركات', 'دائرة الشركات', 'ديوان مديرية الشركات', 'الإدارة العامة للتجارة الداخلية وحماية المستهلك']) assert.ok(html.includes(name), name);
  for (const pos of ['مدير الشركات', 'رئيس دائرة الشركات', 'مدقق ملفات الشركات — 01', 'أمين سجل الشركاء', 'رئيس ديوان مديرية الشركات']) assert.ok(html.includes(pos), pos);
  assert.match(html, /يُصدّق النظام الأساسي لشركة/);
  assert.match(html, /سجل الشركاء/);
  for (const m of html.matchAll(/(سامر العلي|لينا درويش|باسل يوسف|هبة منصور|خالد عيسى)(?! — تجريبي)/g)) assert.fail('demo member without marker: ' + m[0]);
});
