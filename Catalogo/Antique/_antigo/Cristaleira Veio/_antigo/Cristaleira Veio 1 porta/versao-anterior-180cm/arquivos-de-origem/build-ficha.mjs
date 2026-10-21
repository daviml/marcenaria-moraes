import fs from 'node:fs';
import { PARTS, SCREWS } from './model.mjs';
const r = n => Math.round(n * 10) / 10;
// no desenho da ficha, as peças com recorte em volta das colunas viram caixas que não se sobrepõem (a ordem de pintura não se confunde)
const clip = p => (p.g === 'pisos' || p.g === 'prateleiras') ? [4, p.b[1], p.b[2], 46, p.b[4], p.b[5]] : p.b;
const parts = PARTS.map(p => { const o = { id: p.id, g: p.g, b: clip(p).map(r), m: p.m }; if (p.u) o.u = p.u; if (p.door) o.door = 1; if (p.drawer) o.drawer = 1; if (p.thin) o.thin = 1; return o; });
const screws = SCREWS.map(s => ({ a: s.a.map(r), b: s.b.map(r), t: s.t }));
const html = fs.readFileSync('ficha-template.html', 'utf8').replace('__PARTS__', JSON.stringify(parts)).replace('__SCREWS__', JSON.stringify(screws));
fs.writeFileSync('../out/Cristaleira-Veio.html', html); console.log('ok', html.length);
