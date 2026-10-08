// Serves the repository over http and opens index.html in headless Chromium.
// The page's CDN libraries are answered from node_modules, so the tests run offline.
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const MODS = path.join(ROOT, 'node_modules');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.pdf': 'application/pdf', '.json': 'application/json' };
const CDN = [
  [/\/pdf\.min\.js$/, 'pdfjs-dist/build/pdf.min.js'],
  [/\/pdf\.worker\.min\.js$/, 'pdfjs-dist/build/pdf.worker.min.js'],
  [/\/jszip\.min\.js$/, 'jszip/dist/jszip.min.js'],
  [/\/mammoth\.browser\.min\.js$/, 'mammoth/mammoth.browser.min.js'],
  [/\/xslt-polyfill\.min\.js$/, 'xslt-polyfill/xslt-polyfill.min.js'],
];

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// opts: viewport, colorScheme, init (a function run in the page before its scripts), blockFirstCdn,
//       query (appended to the page URL), routes ([pattern, handler] pairs for other sites)
async function openPage(opts = {}) {
  const server = await serve();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: opts.viewport || { width: 1440, height: 900 }, colorScheme: opts.colorScheme || 'light', acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.route(/^https:\/\//, (route) => {
    const url = route.request().url();
    if (opts.blockFirstCdn && /cdnjs\.cloudflare\.com/.test(url)) return route.abort();
    for (const [re, mod] of CDN) if (re.test(url)) return route.fulfill({ path: path.join(MODS, mod), contentType: 'application/javascript; charset=utf-8' });
    const m = /pdfjs-dist@[\d.]+\/((?:cmaps|standard_fonts)\/.+)$/.exec(url);
    if (m && fs.existsSync(path.join(MODS, 'pdfjs-dist', m[1]))) return route.fulfill({ path: path.join(MODS, 'pdfjs-dist', m[1]) });
    return route.abort(); // fonts and anything else: not needed
  });
  for (const [re, handler] of opts.routes || []) await page.route(re, handler); // registered later, so tried first
  if (opts.init) await page.addInitScript(opts.init);
  await page.goto('http://127.0.0.1:' + server.address().port + '/index.html' + (opts.query || ''));
  await page.waitForFunction(() => window.CutGL && window.CutGL.S.root && window.CutGL.S.links.length > 0);
  const close = async () => { await browser.close(); server.close(); };
  return { page, errors, close };
}

// A tree row by element name: row('Recommendation', 1) is the second <Recommendation> shown.
const row = (page, tag, nth = 0) => page.locator('#tree .row', { has: page.locator('.tag', { hasText: new RegExp('^<' + tag + '>$') }) }).nth(nth);
const lastToast = (page) => page.evaluate(() => { const t = Array.from(document.querySelectorAll('.toast')).pop(); return t ? t.textContent : ''; });

module.exports = { ROOT, openPage, row, lastToast };
