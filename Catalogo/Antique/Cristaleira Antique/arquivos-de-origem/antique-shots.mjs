// Fotos para o post da linha Antique (cristaleira): node antique-shots.mjs
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const SHOTS = {
  'cl-borboleta': { w: 700, h: 700, v: 1, cam: { az: 28, el: 6, dist: 34, ty: 108, tx: 20.9, tz: 20 } },
  'cl-concha': { w: 700, h: 700, v: 1, cam: { az: 20, el: 14, dist: 36, ty: 16, tx: 0, tz: 20 } },
  'cl-tramela': { w: 700, h: 700, v: 1, cam: { az: 30, el: 6, dist: 30, ty: 108, tx: -22, tz: 20 } },
  'painel': { w: 540, h: 840, v: 4, fit: [0.05, 0.06, 0.95, 0.94], az: 24, el: 7 },
  'story': { w: 1080, h: 1920, v: 'all', fit: [0.06, 0.3, 0.94, 0.72], az: 18, el: 7 },
};
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  const page = await openPage(env, s.w, s.h);
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => { S.init({ w: s.w, h: s.h, fin: 'nog', dpr: 2.5, v: s.v === 'all' ? 4 : s.v }); S.setModel(s.v); S.setPose({ build: 6 }); S.setCam(s.cam || S.fit(s.fit, { az: s.az, el: s.el })); S.render(); }, s);
  await page.screenshot({ path: `renders/an-${name}.png` }); await page.close(); console.log('ok', name);
}
await env.close();
