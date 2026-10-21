import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const v = process.argv[2] || '1';
const env = await start();
const NAMES = { s1: '1-capa', s3: '3-detalhes', s4: '4-medidas', s5: '5-acabamentos', s6: '6-como-encomendar' };
for (const [dsf, dir] of [[1, `../out/v${v}/post-1x`], [2, `../out/v${v}/post-2x`]]) {
  fs.mkdirSync(dir, { recursive: true });
  const page = await openPage(env, 1080, 1350, 'posts.html?v=' + v);
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: dsf });
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  for (const [id, n] of Object.entries(NAMES)) { const el = await page.$('#' + id); await el.screenshot({ path: `${dir}/${n}.png` }); }
  await page.close();
}
await env.close(); console.log('ok');
