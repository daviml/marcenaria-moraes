import { start, openPage } from './lib.mjs';
const SHOTS = {
  capa: { w: 1080, h: 1350, fin: 'mel', cam: { az: 30, el: 6, dist: 540, ty: 96, tx: -46 } },
  detalhe: { w: 1080, h: 700, fin: 'mel', cam: { az: 36, el: 12, dist: 175, ty: 158, tx: 12 } },
  mel: { w: 480, h: 800, fin: 'mel', cam: { az: 28, el: 7, dist: 470, ty: 94, tx: 0 } },
  nog: { w: 480, h: 800, fin: 'nog', cam: { az: 28, el: 7, dist: 470, ty: 94, tx: 0 } },
  faixa: { w: 936, h: 250, fin: 'mel', cam: { az: 24, el: 16, dist: 150, ty: 20, tx: 6 }, pose: { drawer: 0.35 } },
  aberta: { w: 1080, h: 1350, fin: 'mel', cam: { az: 22, el: 9, dist: 440, ty: 100, tx: -20 }, pose: { door: 0.7, drawer: 0.5, latch: 1 } },
};
const only = process.argv.slice(2);
const env = await start();
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  const page = await openPage(env, s.w, s.h);
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
  await page.evaluate(s => { S.init({ w: s.w, h: s.h, fin: s.fin, dpr: 2.5 }); S.setPose({ build: 6, ...(s.pose || {}) }); S.setCam(s.cam); S.render(); }, s);
  await page.screenshot({ path: `renders/${name}.png` });
  await page.close();
  console.log('ok', name);
}
await env.close();
