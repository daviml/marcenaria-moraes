// Fotos dos slides (rack e linha Antique): node stills.mjs [nomes...] (salva em renders/)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const only = process.argv.slice(2);
const SHOTS = {
  // rack
  'rk-capa': { w: 1080, h: 1350, ids: ['rk140', 'rk180'], fit: [0.06, 0.2, 0.97, 0.56], az: 22, el: 10 },
  'rk-detalhe': { w: 1080, h: 700, ids: ['rk180'], close: ['rk180', 'L-4', 0, 38], cam: { az: 30, el: 10, dist: 70 } },
  'rk-card1': { w: 480, h: 800, ids: ['rk180'], fin: 'nog', fit: [0.06, 0.25, 0.94, 0.55], az: 26, el: 12 },
  'rk-card2': { w: 480, h: 800, ids: ['rk180'], fin: 'jat', fit: [0.06, 0.25, 0.94, 0.55], az: 26, el: 12 },
  'rk-faixa': { w: 936, h: 250, ids: ['rk180'], fit: [0.03, 0.04, 0.97, 0.96], az: 14, el: 12, pose: { drawer: 0.5 } },
  'rk-aberta': { w: 1080, h: 1350, ids: ['rk180'], fit: [0.04, 0.3, 0.96, 0.75], az: 14, el: 16, pose: { door: 0.75, drawer: 0.7, latch: 1 } },
  'rk-tramela': { w: 700, h: 700, ids: ['rk180'], close: ['rk180', 'd2+3', 0, 31.5], cam: { az: 14, el: 6, dist: 36 } },
  // buffet
  'bf-capa': { w: 1080, h: 1350, ids: ['bf110', 'bf150'], fit: [0.05, 0.2, 0.97, 0.56], az: 22, el: 10 },
  'bf-detalhe': { w: 1080, h: 700, ids: ['bf150'], close: ['bf150', 'div', 0, 40], cam: { az: 16, el: 6, dist: 120 } },
  'bf-card1': { w: 480, h: 800, ids: ['bf150'], fin: 'nog', fit: [0.06, 0.25, 0.94, 0.55], az: 26, el: 12 },
  'bf-card2': { w: 480, h: 800, ids: ['bf150'], fin: 'jat', fit: [0.06, 0.25, 0.94, 0.55], az: 26, el: 12 },
  'bf-faixa': { w: 936, h: 250, ids: ['bf150'], fit: [0.03, 0.04, 0.97, 0.96], az: 14, el: 12, pose: { drawer: 0.5 } },
  'bf-aberta': { w: 1080, h: 1350, ids: ['bf150'], fit: [0.04, 0.3, 0.96, 0.75], az: 14, el: 16, pose: { door: 0.75, drawer: 0.7 } },
  // linha
  'line-capa': { w: 1080, h: 1350, ids: ['cr4', 'gr2', 'rk180'], fit: [0.04, 0.14, 0.96, 0.58], az: 20, el: 8 },
  'line-story': { w: 1080, h: 1920, ids: ['cr4', 'gr2', 'rk180'], fit: [0.04, 0.34, 0.96, 0.7], az: 20, el: 8 },
  'rk-story': { w: 1080, h: 1920, ids: ['rk140', 'rk180'], fit: [0.04, 0.4, 0.96, 0.66], az: 20, el: 10 },
  'line-cr': { w: 1080, h: 1350, ids: ['cr1', 'cr2', 'cr4'], fit: [0.05, 0.12, 0.96, 0.56], az: 18, el: 7 },
  'line-gr': { w: 1080, h: 1350, ids: ['gr2', 'gr4'], fit: [0.06, 0.12, 0.96, 0.56], az: 20, el: 7 },
  'line-rk': { w: 1080, h: 1350, ids: ['rk140', 'rk180'], fit: [0.05, 0.22, 0.96, 0.55], az: 20, el: 10 },
};
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const page = await openPage(env, s.w, s.h, 'page.html?video=none');
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => {
    S.init({ w: s.w, h: s.h, fin: s.fin || 'nog', dpr: 2.5, ids: s.ids }); S.setLayout(s.ids, { gap: 45 }); S.setPose({ build: 6, ...(s.pose || {}) });
    let c = s.cam;
    if (s.close) { const [id, xs, y, z] = s.close, M = S.getM(id); const x = xs === 'L-4' ? M.L - 4 : xs === 'd2+3' ? M.d2 + 3 : xs === 'div' ? M.divs[M.divs.length - 1] + 1 : +xs; const w = S.world(x, y, z, id); c = { ...s.cam, tx: w.x, ty: w.y, tz: w.z }; }
    S.setCam(c || S.fit(s.fit, { az: s.az, el: s.el })); S.render();
  }, s);
  await page.screenshot({ path: `renders/${name}.png` }); await page.close(); console.log('ok', name);
}
await env.close();
