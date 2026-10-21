// Fotos dos slides da linha Modern: node stills.mjs es|mc|ap (salva em renders/<k>-*.png)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const keys = process.argv.slice(2).length ? process.argv.slice(2) : ['es', 'mc', 'ap'];
const det = { es: { at: ['L', 0, 74], cam: { az: 36, el: 10, dist: 130 }, off: [-16, -10] }, mc: { at: ['L/2', 10, 16], cam: { az: 28, el: 14, dist: 175 }, off: [0, 0] }, ap: { at: ['cava', 2, 66], cam: { az: 22, el: 6, dist: 110 }, off: [-6, 2], pose: { drawer: [0, 0.6] } } };
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const k of keys) {
  const SH = {
    capa: { w: 1080, h: 1350, ids: [k], fit: [0.06, 0.16, 0.94, 0.56], az: 26, el: 14 },
    detalhe: { w: 1080, h: 700, ids: [k], det: det[k] },
    madeira: { w: 480, h: 800, ids: [k], fit: [0.06, 0.18, 0.94, 0.56], az: 26, el: 14 },
    preto: { w: 480, h: 800, ids: [k], preto: 1, fit: [0.06, 0.18, 0.94, 0.56], az: 26, el: 14 },
    faixa: { w: 936, h: 250, ids: [k, k + 'K'], fit: [0.04, 0.05, 0.96, 0.95], az: 16, el: 10 },
    par: { w: 1080, h: 1350, ids: [k, k + 'K'], fit: [0.05, 0.2, 0.95, 0.55], az: 20, el: 12 },
  };
  for (const [name, s] of Object.entries(SH)) {
    const page = await openPage(env, s.w, s.h, 'page.html?video=none');
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
    await page.evaluate((s, k) => {
      S.init({ w: s.w, h: s.h, fin: 'nog', dpr: 2.5, ids: s.ids }); S.setLayout(s.ids, { gap: 50 });
      S.setPreto(!!s.preto, s.ids[0]); if (s.ids[1]) S.setPreto(true, s.ids[1]);
      S.setPose({ build: 6, ...((s.det && s.det.pose) || {}) });
      let c;
      if (s.det) { const M = S.getM(k), [xs, y, z] = s.det.at; const x = xs === 'L' ? M.L : xs === 'L/2' ? M.L / 2 : (M.DRAWERS[1].cava[0] + M.DRAWERS[1].cava[1]) / 2; const w = S.world(x, y, z, k); c = { ...s.det.cam, tx: w.x + s.det.off[0], ty: w.y + s.det.off[1], tz: w.z }; }
      else c = S.fit(s.fit, { az: s.az, el: s.el });
      S.setCam(c); S.render();
    }, s, k);
    await page.screenshot({ path: `renders/${k}-${name}.png` }); await page.close(); console.log('ok', k, name);
  }
}
await env.close();
