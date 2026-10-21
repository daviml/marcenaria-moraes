// Fotos do post e dos stories da linha Modern (salva em renders/line-*.png)
import { start, openPage } from './lib.mjs';
const H3 = ['ap', 'es', 'mc'];
const SH = {
  capa: { w: 1080, h: 1350, ids: H3, fit: [0.02, 0.16, 0.98, 0.6], az: 34, el: 20 },
  capaK: { w: 1080, h: 1350, ids: H3, preto: 1, fit: [0.04, 0.2, 0.96, 0.56], az: 20, el: 12 },
  story: { w: 1080, h: 1920, ids: H3, fit: [0.02, 0.36, 0.98, 0.7], az: 34, el: 20 },
  es: { w: 1080, h: 1350, ids: ['es'], fit: [0.06, 0.16, 0.94, 0.56], az: 26, el: 14 },
  mc: { w: 1080, h: 1350, ids: ['mc'], fit: [0.06, 0.2, 0.94, 0.56], az: 26, el: 16 },
  ap: { w: 1080, h: 1350, ids: ['ap'], fit: [0.08, 0.14, 0.92, 0.56], az: 26, el: 12, pose: { drawer: [0, 0.6] } },
  esS: { w: 1080, h: 1920, ids: ['es'], fit: [0.06, 0.38, 0.94, 0.7], az: 26, el: 14 },
  mcS: { w: 1080, h: 1920, ids: ['mc'], fit: [0.06, 0.4, 0.94, 0.7], az: 26, el: 16 },
  apS: { w: 1080, h: 1920, ids: ['ap'], fit: [0.08, 0.36, 0.92, 0.72], az: 26, el: 12, pose: { drawer: [0, 0.6] } },
  borda: { w: 700, h: 700, ids: ['es'], det: ['es', 150, 0, 74, { az: 36, el: 8, dist: 90 }, [-10, -6]] },
  cava: { w: 700, h: 700, ids: ['ap'], det: ['ap', 'cava', 2, 66, { az: 22, el: 6, dist: 80 }, [-4, 0]], pose: { drawer: [0, 0.5] } },
  perna: { w: 700, h: 700, ids: ['mc'], det: ['mc', 9, 6, 20, { az: 58, el: 10, dist: 110 }, [0, 0]] },
  preto: { w: 700, h: 700, ids: ['es'], preto: 1, det: ['es', 150, 0, 60, { az: 34, el: 10, dist: 170 }, [-20, -10]] },
};
const env = await start();
for (const [name, s] of Object.entries(SH)) {
  const page = await openPage(env, s.w, s.h, 'page.html?video=none');
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => {
    S.init({ w: s.w, h: s.h, fin: 'nog', dpr: 2.5, ids: s.ids }); S.setLayout(s.ids, { gap: 45 }); S.setPreto(!!s.preto, s.ids);
    S.setPose({ build: 6, ...(s.pose || {}) });
    let c;
    if (s.det) { const [id, xs, y, z, cam, off] = s.det, M = S.getM(id); const x = xs === 'cava' ? (M.DRAWERS[1].cava[0] + M.DRAWERS[1].cava[1]) / 2 : xs; const w = S.world(x, y, z, id); c = { ...cam, tx: w.x + off[0], ty: w.y + off[1], tz: w.z }; }
    else c = S.fit(s.fit, { az: s.az, el: s.el });
    S.setCam(c); S.render();
  }, s);
  await page.screenshot({ path: `renders/line-${name}.png` }); await page.close(); console.log('ok', name);
}
await env.close();
