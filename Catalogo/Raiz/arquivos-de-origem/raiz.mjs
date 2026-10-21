// Gera o post, os stories e as capas de destaque da linha Raiz: node antique.mjs
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const OUT = '../out/ra-line';
const POST = { p1: '1-capa', p2: '2-o-encaixe-a-mostra', p3: '3-mesa-de-jantar-raiz', p4: '4-banco-raiz', p4b: '5-bancada-gourmet-raiz', p5: '6-nogueira-ou-jatoba', p6: '7-como-encomendar' };
const STORY = { s1: 'story-1-nova-linha', s2: 'story-2-mesa-de-jantar', s3: 'story-3-banco', s3r: 'story-4-bancada-gourmet', s4: 'story-5-o-encaixe', s5: 'story-6-orcamento' };
const DQ = { d1: 'destaque-icone-raiz', d2: 'destaque-raiz' };
const env = await start();
for (const [dsf, sub] of [[1, ''], [2, '-2x']]) {
  const page = await openPage(env, 1080, 1350, 'raiz.html');
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: dsf });
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => i.onload = r))));
  await page.evaluate(() => document.fonts.ready);
  for (const [grp, dir] of [[POST, `post${sub}`], [STORY, 'stories'], [DQ, 'destaque']]) {
    if (dsf === 2 && grp !== POST) continue;
    fs.mkdirSync(`${OUT}/${dir}`, { recursive: true });
    for (const [id, n] of Object.entries(grp)) { const el = await page.$('#' + id); await el.screenshot({ path: `${OUT}/${dir}/${n}.png` }); }
  }
  await page.close();
}
await env.close(); console.log('ok');
