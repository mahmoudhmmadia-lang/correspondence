import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtml, ROOT } from './build-html.mjs';
import { localizeGuideLinks } from './guide-links.mjs';

export function createServer() {
  const site = path.join(ROOT, 'site');
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400).end(); return; }
    let file = path.resolve(site, '.' + pathname);
    if (file !== site && !file.startsWith(site + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    // Local preview: links between guides open the local servers, not production.
    if (path.extname(file) === '.html') res.end(localizeGuideLinks(fs.readFileSync(file, 'utf8')));
    else fs.createReadStream(file).pipe(res);
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildHtml();
  const port = process.env.PORT === undefined ? 4324 : Number(process.env.PORT);
  const server = createServer();
  server.listen(port, '127.0.0.1', () => console.log(`Guide: http://127.0.0.1:${server.address().port}/ar/`));
  // Rebuild in a fresh process so edits to the local renderer are
  // picked up; an in-process rebuild reuses the modules loaded at startup and would
  // overwrite the site with stale markup.
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        execFileSync(process.execPath, [fileURLToPath(new URL('./build-html.mjs', import.meta.url))], { stdio: 'inherit' });
        console.log('Rebuilt; refresh the browser.');
      } catch (e) { console.error(e.message); }
    }, 200);
  };
  fs.watch(ROOT, { recursive: true }, (_event, file) => {
    if (file && /^(chapters[\\/].*\.tex|main\.tex|web[\\/].*\.(css|js|svg)|tools[\\/].*\.mjs)$/.test(file)) rebuild();
  });
}
