// Fotos para os slides do Guarda-Roupa Antique (salva em renders/)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const only = process.argv.slice(2);
const SHOTS = {
  capa: { w: 1080, h: 1350, fin: 'nog', v: 'both', fit: [0.07, 0.13, 0.97, 0.53], az: 22, el: 6 },
  detalhe: { w: 1080, h: 700, fin: 'nog', v: 2, cam: { az: 38, el: 14, dist: 230, ty: 168, tx: 47 } },
  card1: { w: 480, h: 800, fin: 'nog', v: 2, fit: [0.08, 0.1, 0.92, 0.6], az: 26, el: 7 },
  card2: { w: 480, h: 800, fin: 'jat', v: 4, fit: [0.05, 0.12, 0.95, 0.6], az: 26, el: 7 },
  faixa: { w: 936, h: 250, fin: 'nog', v: 4, cam: { az: 16, el: 9, dist: 380, ty: 40, tx: 0 }, pose: { drawer: [0.5, 0.3, 0.3, 0.5, 0.3, 0.3] } },
  aberta2: { w: 1080, h: 1350, fin: 'nog', v: 2, fit: [0.1, 0.26, 0.9, 0.84], az: 16, el: 10, pose: { door: 0.75, drawer: [0.5, 0.3, 0.3], latch: 1 } },
  aberta4: { w: 1080, h: 1350, fin: 'nog', v: 4, fit: [0.04, 0.3, 0.96, 0.84], az: 16, el: 10, pose: { door: 0.75, drawer: [0.5, 0.3, 0.3, 0.5, 0.3, 0.3], latch: 1 } },
};
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const page = await openPage(env, s.w, s.h);
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => { S.init({ w: s.w, h: s.h, fin: s.fin, dpr: 2.5, v: s.v === 'both' ? 2 : s.v }); S.setModel(s.v); S.setPose({ build: 6, ...(s.pose || {}) }); const c = s.cam || S.fit(s.fit, { az: s.az, el: s.el }); S.setCam(c); S.render(); }, s);
  await page.screenshot({ path: `renders/${name}.png` });
  await page.close();
  console.log('ok', name);
}
await env.close();
