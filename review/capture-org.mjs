// Read-only screenshots using the existing inspection capture profile.
// Authentication and profile data stay outside the guide. Never log page content.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { open, go, mark, mask } from '../../inspection/review/capture/lib.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets/screens');
fs.mkdirSync(out, { recursive: true });
const report = [];
let ctx;
try {
  const session = await open('org');
  ctx = session.ctx;
  for (const shot of [
    { name: 'org-correspondence-tray', url: '/official-correspondence/tray', marks: [{ t: '^مراسلة جديدة$' }, { t: '^بانتظار اعتمادي$' }] },
    { name: 'org-correspondence-compose', url: '/official-correspondence/compose', marks: [{ t: '^لا يمكنك حفظ المراسلات أو إرسالها بعد$' }, { t: '^الموضوع$' }, { t: '^المخاطَبون$' }, { t: '^حفظ كمسودة$' }] },
    { name: 'org-correspondence-types', url: '/official-correspondence/settings', marks: [{ t: '^أنواع المراسلات$' }, { t: '^إضافة نوع$' }] },
  ]) {
    await go(session.page, session.base + shot.url, 20000);
    if (/login|sign-in|signin/.test(session.page.url())) {
      report.push({ name: shot.name, status: 'blocked', reason: 'Existing organization profile requires sign-in' });
      break;
    }
    const placed = await mark(session.page, shot.marks);
    if (placed.missing.length) {
      const signInVisible = await session.page.locator('input[type="password"], input[type="email"]').count() > 0;
      await mask(session.page, { texts: ['mahmoudHmmadia', 'mmasri', 'rightcode.io'], sels: ['[data-slot="avatar"]'] });
      await session.page.screenshot({ path: path.join(root, 'review', `${shot.name}-diagnostic.png`) });
      report.push({ name: shot.name, status: 'not-captured', reason: signInVisible ? 'Organization session requires authentication' : 'Expected controls not all visible', path: new URL(session.page.url()).pathname, title: await session.page.title(), missing: placed.missing });
      if (signInVisible) break;
      continue;
    }
    await mask(session.page, { texts: ['mahmoudHmmadia', 'mmasri', 'rightcode.io'], sels: ['[data-slot="avatar"]'] });
    await session.page.screenshot({ path: path.join(out, `${shot.name}.png`) });
    report.push({ name: shot.name, status: 'captured', source: session.base + shot.url, markers: placed.marks, capturedOn: new Date().toISOString(), scope: 'Read only. Empty compose is not a completed workflow.' });
  }
} catch (e) {
  report.push({ status: 'blocked', reason: String(e.message).split('\n')[0].slice(0, 180) });
} finally {
  await ctx?.close();
  fs.writeFileSync(path.join(root, 'review/capture-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.map(({ name, status, reason }) => ({ name, status, reason }))));
}
