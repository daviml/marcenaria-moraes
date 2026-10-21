// Servidor local + Chrome headless para renderizar a cena
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import puppeteer from 'puppeteer-core';
const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css' };
export async function start() {
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
  await new Promise(ok => srv.listen(0, ok));
  const port = srv.address().port;
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--hide-scrollbars'] });
  return { port, browser, close: async () => { await browser.close(); srv.close(); } };
}
export async function openPage(env, w, h, file = 'page.html') {
  const page = await env.browser.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('PAGE:', m.text()); });
  page.on('pageerror', e => console.log('PAGEERR:', e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${env.port}/${file}`);
  await page.waitForFunction('window.ready===true', { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
