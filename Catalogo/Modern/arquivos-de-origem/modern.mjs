// Gera o post, os stories e as capas de destaque da linha Antique: node antique.mjs
import { start, openPage } from './lib.mjs';
import fs from 'node:fs';
const OUT = '../out/mo-line';
const POST = { p1: '1-capa', p2: '2-nada-a-vista', p3: '3-escrivaninha-cerne', p4: '4-mesa-de-centro-modern', p4b: '5-aparador-modern', p5: '6-madeira-ou-preto', p6: '7-como-encomendar' };
const STORY = { s1: 'story-1-nova-linha', s2: 'story-2-escrivaninha', s3: 'story-3-mesa-de-centro', s3r: 'story-4-aparador', s4: 'story-5-nada-a-vista', s5: 'story-6-orcamento' };
const DQ = { d1: 'destaque-icone-modern', d2: 'destaque-modern' };
const env = await start();
for (const [dsf, sub] of [[1, ''], [2, '-2x']]) {
  const page = await openPage(env, 1080, 1350, 'modern.html');
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
