import { start, openPage } from './lib.mjs';
const [video = 'video-rk', fmt = '45', fin = 'nog', ...ts] = process.argv.slice(2);
const [w, h] = { '45': [1080, 1350], '916': [1080, 1920], '169': [1920, 1080] }[fmt];
const env = await start();
const page = await openPage(env, w, h, 'page.html?video=' + video);
await page.evaluate(async (fmt, fin) => { await V.setup({ fmt, fin }); }, fmt, fin);
for (const [i, t] of ts.map(Number).entries()) { await page.evaluate(t => V.frame(t), t); await page.screenshot({ path: `../kf/${video}-${fmt}-${String(i).padStart(2, '0')}.png` }); }
await env.close();
