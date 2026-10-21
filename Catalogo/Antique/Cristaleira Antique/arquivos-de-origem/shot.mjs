import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const h of ['1-porta', '2-portas', '4-portas']) {
  const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CON', m.text()); });
  await p.setViewport({ width: 1100, height: 900 });
  await p.goto('file:///C:/Users/davim/AppData/Local/Temp/claude/d--Marcenaria-Moraes/ffa5e90a-bc89-42ed-831f-87196a551122/scratchpad/out/cvu/ficha.html#' + h, { waitUntil: 'networkidle0' });
  await p.screenshot({ path: `../teste/cvf${h}.png`, fullPage: true });
}
await b.close();
