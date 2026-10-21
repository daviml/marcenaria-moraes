// Gera a ficha única da Cristaleira Veio, com seletor 1 / 2 / 4 portas: node build-ficha.mjs saida.html
import fs from 'node:fs';
import { variantFicha } from './ficha-variant.mjs';

const out = process.argv[2] || '../out/cvu/ficha.html';
const VS = [1, 2, 4], F = {};
for (const v of VS) {
  const r = variantFicha(v);
  // corpo da ficha de cada versão: tudo depois do cabeçalho, até o fim da .wrap
  const a = r.html.indexOf('</header>') + 9, b = r.html.lastIndexOf('</div>\n\n<script>');
  const lead = r.html.match(/<p class="lead">([\s\S]*?)<\/p>/)[1], specs = r.html.match(/<div class="specs">[\s\S]*?<\/div>/)[0];
  const body = r.html.slice(a, b).replace('<h2>O produto</h2>', `<h2>O produto · ${r.M.short}</h2>\n    <p class="lead">${lead}</p>\n    ${specs}`);
  F[v] = { ...r, body };
}
const css = fs.readFileSync('ficha.css', 'utf8');
const client = fs.readFileSync('ficha-client.js', 'utf8');
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cristaleira Veio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}
.ortho svg{max-height:640px}
.grid2 .wide{grid-column:1/-1}
.model{display:flex;flex-wrap:wrap;gap:8px;align-items:center;position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0;border-bottom:1px solid var(--line)}
.model span{font:500 13px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-right:4px}
.model button{font:600 15px var(--f-body);border:1px solid var(--line);background:var(--paper);color:var(--ink);padding:9px 18px;border-radius:999px;cursor:pointer}
.model button small{font-weight:400;color:var(--muted);margin-left:6px}
.model button[aria-pressed="true"]{background:var(--amora);border-color:var(--amora);color:var(--paper)}
.model button[aria-pressed="true"] small{color:var(--paper);opacity:.8}
.model button:focus-visible{outline:2px solid var(--cerne);outline-offset:2px}
#content{display:flex;flex-direction:column;gap:40px}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · catálogo · ficha do produto</div>
    <h1>Cristaleira Veio</h1>
    <p class="lead">Cristaleira rústica de madeira maciça com vidro nos três lados, em três larguras: 1 porta (${F[1].M.L} cm), 2 portas (${F[2].M.L} cm) e 4 portas (${F[4].M.L} cm). Todas com 2 m de altura e 40 de fundo, com as mesmas laterais, vidros das laterais e alturas de nicho. Escolha o modelo abaixo: a ficha inteira muda.</p>
  </header>
  <div class="model" role="group" aria-label="Modelo">
    <span>Modelo</span>
    ${VS.map((v, i) => `<button type="button" data-v="${v}" aria-pressed="${i === 0}">${F[v].M.short} <small>${F[v].M.L} cm</small></button>`).join('\n    ')}
  </div>
  <div id="content"></div>
</div>
${VS.map(v => `<template id="t${v}">${F[v].body}</template>`).join('\n')}
<script>
const DATA={${VS.map(v => `${v}:${JSON.stringify(F[v].data)}`).join(',')}};
${client}
function show(v){
  const c=document.getElementById('content');c.innerHTML='';c.appendChild(document.getElementById('t'+v).content.cloneNode(true));
  document.querySelector('.wrap').classList.remove('jat');
  document.querySelectorAll('.model button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==String(v)?'true':'false'));
  run(DATA[v].PARTS,DATA[v].SCREWS,DATA[v].CFG);
  try{history.replaceState(null,'','#'+v+(v===1?'-porta':'-portas'))}catch(_){}
}
document.querySelectorAll('.model button').forEach(b=>b.onclick=()=>show(+b.dataset.v));
const h=location.hash;show(h.startsWith('#4')?4:h.startsWith('#2')?2:1);
</script>
</html>
`;
fs.mkdirSync(out.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
fs.writeFileSync(out, html); console.log('ok', out, html.length);
