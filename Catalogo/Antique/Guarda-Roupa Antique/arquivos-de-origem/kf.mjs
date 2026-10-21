import { start, openPage } from './lib.mjs';
const [fmt = '45', fin = 'nog'] = process.argv.slice(2);
const [w, h] = { '45': [1080, 1350], '916': [1080, 1920], '169': [1920, 1080] }[fmt];
const env = await start();
const page = await openPage(env, w, h);
await page.evaluate(async (fmt, fin) => { await V.setup({ fmt, fin }); }, fmt, fin);
const T = [17.5, 19, 24.5, 24.65, 25.1, 26.2];
for (const [i, t] of T.entries()) { await page.evaluate(t => V.frame(t), t); await page.screenshot({ path: `../kf/gr-${fmt}-${String(i).padStart(2, '0')}.png` }); }
await env.close();
