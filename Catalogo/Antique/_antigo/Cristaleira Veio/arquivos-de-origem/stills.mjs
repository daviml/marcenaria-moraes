// Fotos para os slides da Cristaleira Veio (as três versões; salva em renders/)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const only = process.argv.slice(2);
const SHOTS = {
  capa: { w: 1080, h: 1350, fin: 'nog', v: 'all', fit: [0.06, 0.12, 0.97, 0.53], az: 20, el: 6 },
  detalhe: { w: 1080, h: 700, fin: 'nog', v: 4, cam: { az: 36, el: 12, dist: 175, ty: 178, tx: 67 } },
  card1: { w: 480, h: 800, fin: 'nog', v: 2, fit: [0.1, 0.08, 0.9, 0.6], az: 26, el: 7 },
  card2: { w: 480, h: 800, fin: 'jat', v: 4, fit: [0.05, 0.12, 0.95, 0.6], az: 26, el: 7 },
  faixa: { w: 936, h: 250, fin: 'nog', v: 4, cam: { az: 16, el: 11, dist: 320, ty: 27, tx: 2 }, pose: { drawer: 0.35 } },
  aberta4: { w: 1080, h: 1350, fin: 'nog', v: 4, fit: [0.06, 0.27, 0.94, 0.84], az: 18, el: 9, pose: { door: 0.7, drawer: 0.5, latch: 1 } },
};
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const page = await openPage(env, s.w, s.h);
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => { S.init({ w: s.w, h: s.h, fin: s.fin, dpr: 2.5, v: s.v === 'all' ? 4 : s.v }); S.setModel(s.v); S.setPose({ build: 6, ...(s.pose || {}) }); const c = s.cam || S.fit(s.fit, { az: s.az, el: s.el }); S.setCam(c); S.render(); }, s);
  await page.screenshot({ path: `renders/${name}.png` });
  await page.close();
  console.log('ok', name);
}
await env.close();
