import { start, openPage } from './lib.mjs';
const [fmt = '45', fin = 'mel'] = process.argv.slice(2);
const [w, h] = { '45': [1080, 1350], '916': [1080, 1920], '169': [1920, 1080] }[fmt];
const env = await start();
const page = await openPage(env, w, h);
await page.evaluate(async (fmt, fin) => { await V.setup({ fmt, fin }); }, fmt, fin);
const T = [0.8, 2.2, 4.6, 6.6, 8.6, 10.5, 14.5, 18.5, 21.2, 23.2, 25.6, 26.6, 28.8, 30.8, 33.2];
for (const [i, t] of T.entries()) { await page.evaluate(t => V.frame(t), t); await page.screenshot({ path: `../kf/${fmt}-${String(i).padStart(2, '0')}.png` }); }
await env.close();
