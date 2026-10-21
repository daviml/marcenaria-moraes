// Fotos dos slides da linha Raiz: node stills.mjs mj|bc|bg (salva em renders/<k>-*.png)
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const keys = process.argv.slice(2).length ? process.argv.slice(2) : ['mj', 'bc', 'bg'];
const det = { mj: { at: [21, 45, 36], cam: { az: -42, el: 10, dist: 125 } }, bc: { at: [40, 17.5, 44], cam: { az: 24, el: 42, dist: 62 } }, bg: { at: [0, 25, 70], cam: { az: -58, el: 12, dist: 120 } } };
fs.mkdirSync('renders', { recursive: true });
const env = await start();
for (const k of keys) {
  const SH = {
    capa: { w: 1080, h: 1350, ids: [k], fit: [0.06, 0.18, 0.94, 0.56], az: 28, el: 16 },
    detalhe: { w: 1080, h: 700, ids: [k], det: det[k] },
    madeira: { w: 480, h: 800, ids: [k], fit: [0.06, 0.2, 0.94, 0.56], az: 28, el: 16 },
    jatoba: { w: 480, h: 800, ids: [k], fin: 'jat', fit: [0.06, 0.2, 0.94, 0.56], az: 28, el: 16 },
    faixa: { w: 936, h: 250, ids: [k, k + 'J'], fit: [0.04, 0.05, 0.96, 0.95], az: 18, el: 12 },
    par: { w: 1080, h: 1350, ids: [k, k + 'J'], fit: [0.05, 0.2, 0.95, 0.55], az: 20, el: 12 },
  };
  for (const [name, s] of Object.entries(SH)) {
    const page = await openPage(env, s.w, s.h, 'page.html?video=none');
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
    await page.evaluate((s, k) => {
      S.init({ w: s.w, h: s.h, fin: s.fin || 'nog', dpr: 2.5, ids: s.ids }); S.setLayout(s.ids, { gap: 50 });
      if (s.ids[1]) S.setTwin(s.ids[1], 'jat');
      S.setPose({ build: 6, ...((s.det && s.det.pose) || {}) });
      let c;
      if (s.det) { const w = S.world(...s.det.at, k); c = { ...s.det.cam, tx: w.x, ty: w.y, tz: w.z }; }
      else c = S.fit(s.fit, { az: s.az, el: s.el });
      S.setCam(c); S.render();
    }, s, k);
    await page.screenshot({ path: `renders/${k}-${name}.png` }); await page.close(); console.log('ok', k, name);
  }
}
await env.close();
