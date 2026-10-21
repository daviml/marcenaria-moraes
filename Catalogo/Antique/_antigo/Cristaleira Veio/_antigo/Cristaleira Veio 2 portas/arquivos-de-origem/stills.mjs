// Fotos da cristaleira para os slides: node stills.mjs 4 (salva em renders/v4/)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const v = +(process.argv[2] || 1), only = process.argv.slice(3);
const L = { 1: 50, 2: 90, 4: 160 }[v];
// fit: área [x0, y0, x1, y1] da tela onde a cristaleira inteira cabe; cam: câmera fixa (closes)
const SHOTS = {
  capa: { w: 1080, h: 1350, fin: 'nog', fit: { 1: [0.5, 0.17, 0.87, 0.98], 2: [0.42, 0.15, 0.95, 0.93], 4: [0.24, 0.16, 0.97, 0.80] }[v], az: 30, el: 6 },
  detalhe: { w: 1080, h: 700, fin: 'nog', cam: { az: 36, el: 12, dist: 175, ty: 178, tx: L / 2 - 13 } },
  card1: { w: 480, h: 800, fin: 'nog', fit: [0.07, 0.07, 0.93, 0.6], az: 28, el: 7 },
  card2: { w: 480, h: 800, fin: 'jat', fit: [0.07, 0.07, 0.93, 0.6], az: 28, el: 7 },
  faixa: { w: 936, h: 250, fin: 'nog', cam: { 1: { az: 24, el: 16, dist: 150, ty: 20, tx: 6 }, 2: { az: 20, el: 12, dist: 200, ty: 24, tx: 2 }, 4: { az: 16, el: 11, dist: 320, ty: 27, tx: 2 } }[v], pose: { drawer: 0.35 } },
  aberta: { w: 1080, h: 1350, fin: 'nog', fit: [0.06, 0.05, 0.94, 0.95], az: 22, el: 9, pose: { door: 0.7, drawer: 0.5, latch: 1 } },
};
fs.mkdirSync(`renders/v${v}`, { recursive: true });
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const page = await openPage(env, s.w, s.h, 'page.html?v=' + v);
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => { S.init({ w: s.w, h: s.h, fin: s.fin, dpr: 2.5 }); S.setPose({ build: 6, ...(s.pose || {}) }); const c = s.cam || S.fit(s.fit, { az: s.az, el: s.el }); S.setCam(c); S.render(); }, s);
  await page.screenshot({ path: `renders/v${v}/${name}.png` });
  await page.close();
  console.log('ok', v, name);
}
await env.close();
