import puppeteer from 'puppeteer-core';
const [file, out, w = 1100] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
await p.setViewport({ width: +w, height: 900 });
await p.goto('file:///' + file, { waitUntil: 'networkidle0' });
await p.screenshot({ path: out, fullPage: true });
await b.close();
