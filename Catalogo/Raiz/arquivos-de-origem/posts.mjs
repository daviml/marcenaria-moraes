// Slides do post de cada peça da linha Raiz: node posts.mjs mj|bc|bg
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const keys = process.argv.slice(2).length ? process.argv.slice(2) : ['mj', 'bc', 'bg'];
const NAMES = { s1: '1-capa', s3: '3-detalhes', s4: '4-medidas', s5: '5-madeiras', s6: '6-como-encomendar' };
const env = await start();
for (const k of keys) for (const [dsf, dir] of [[1, `../out/ra-${k}/post-1x`], [2, `../out/ra-${k}/post-2x`]]) {
  fs.mkdirSync(dir, { recursive: true });
  const page = await openPage(env, 1080, 1350, 'posts.html?k=' + k);
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: dsf });
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  for (const [id, n] of Object.entries(NAMES)) { const el = await page.$('#' + id); await el.screenshot({ path: `${dir}/${n}.png` }); }
  await page.close();
}
await env.close(); console.log('ok');
