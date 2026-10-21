// Fotos do post e dos stories da linha Raiz (salva em renders/line-*.png)
import { start, openPage } from './lib.mjs';
const ALL = ['mj', 'bc', 'bg'], SET = [['bg', -205, -10], ['mj', 0, 0], ['bc', 0, 78]];
const SH = {
  capa: { w: 1080, h: 1350, ids: ALL, set: 1, fit: [0.03, 0.16, 0.97, 0.6], az: 26, el: 18 },
  capaJ: { w: 1080, h: 1350, ids: ALL, set: 1, fin: 'jat', fit: [0.03, 0.2, 0.97, 0.56], az: 26, el: 18 },
  story: { w: 1080, h: 1920, ids: ALL, set: 1, fit: [0.03, 0.36, 0.97, 0.7], az: 26, el: 18 },
  mj: { w: 1080, h: 1350, ids: ['mj'], fit: [0.06, 0.18, 0.94, 0.56], az: 28, el: 16 },
  bc: { w: 1080, h: 1350, ids: ['bc'], fit: [0.06, 0.24, 0.94, 0.56], az: 28, el: 16 },
  bg: { w: 1080, h: 1350, ids: ['bg'], fit: [0.1, 0.14, 0.9, 0.58], az: 28, el: 14, pose: { drawer: 0.5 } },
  mjS: { w: 1080, h: 1920, ids: ['mj'], fit: [0.06, 0.38, 0.94, 0.7], az: 28, el: 16 },
  bcS: { w: 1080, h: 1920, ids: ['bc'], fit: [0.06, 0.42, 0.94, 0.7], az: 28, el: 16 },
  bgS: { w: 1080, h: 1920, ids: ['bg'], fit: [0.08, 0.36, 0.92, 0.74], az: 28, el: 14, pose: { drawer: 0.5 } },
  grav: { w: 700, h: 700, ids: ['mj'], det: ['mj', 90, 60, 76, { az: 22, el: 42, dist: 60 }] },
  cunha: { w: 700, h: 700, ids: ['mj'], det: ['mj', 20, 45, 36, { az: -40, el: 10, dist: 85 }] },
  cavilha: { w: 700, h: 700, ids: ['mj'], det: ['mj', 25, 45, 6, { az: -62, el: 14, dist: 80 }] },
  gancho: { w: 700, h: 700, ids: ['bg'], det: ['bg', 0, 25, 74, { az: -60, el: 10, dist: 90 }] },
};
const env = await start();
for (const [name, s] of Object.entries(SH)) {
  const page = await openPage(env, s.w, s.h, 'page.html?video=none');
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate((s, SET) => {
    S.init({ w: s.w, h: s.h, fin: s.fin || 'nog', dpr: 2.5, ids: s.ids });
    if (s.set) S.place(SET); else S.setLayout(s.ids, { gap: 45 });
    S.setPose({ build: 6, ...(s.pose || {}) });
    let c;
    if (s.det) { const [id, x, y, z, cam] = s.det, w = S.world(x, y, z, id); c = { ...cam, tx: w.x, ty: w.y, tz: w.z }; }
    else c = S.fit(s.fit, { az: s.az, el: s.el });
    S.setCam(c); S.render();
  }, s, SET);
  await page.screenshot({ path: `renders/line-${name}.png` }); await page.close(); console.log('ok', name);
}
await env.close();
