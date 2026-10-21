// Gera a ficha única do Guarda-Roupa Veio, com seletor 2 portas / 4 portas: node build-ficha.mjs saida.html
import fs from 'node:fs';
import { make } from './model.mjs';
import { info } from './info.mjs';

const out = process.argv[2] || '../out/gr/ficha.html';
const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
const r = n => Math.round(n * 10) / 10;
const AXI = { x: 0, y: 1, z: 2 };
const dimsOf = p => { const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain]; const len = ext[gi]; const o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x); return [len, o[0], o[1]].map(r); };

function variant(v) {
  const M = make(v), I = info(M), C = I.cut, T = I.t;
  const { L, H, D, bays, DOORS, PARTS, SCREWS } = M;
  const nd = DOORS.length;
  // lista de corte
  const rows = new Map();
  PARTS.forEach(p => {
    if (p.u === 'mold') return;
    const u = p.u || p.id, d = dimsOf(p); if (p.cyl) { d[1] = 3; d[2] = 3; }
    const k = u + '|' + d.join('x');
    if (!rows.has(k)) rows.set(k, { u, d, q: 0, m: p.m }); rows.get(k).q++;
  });
  const cutRows = [...rows.values()].sort((a, b) => (C[a.u]?.o ?? 99) - (C[b.u]?.o ?? 99));
  const matOf = row => row.m === 'comp' ? '<span class="mat comp"></span>Compensado 6 mm' : `<span class="mat w"></span>${C[row.u]?.mat || 'Madeira'}`;
  const cutHTML = cutRows.map(row => { const c = C[row.u] || { n: row.u, obs: '' }; return `<tr><td>${row.q === 1 && c.n1 ? c.n1 : c.n}</td><td class="num">${row.q}</td><td class="num">${row.u === 'rod' ? `${f(row.d[0])} × ⌀3` : row.d.map(f).join(' × ')}</td><td>${matOf(row)}</td><td>${c.obs || ''}</td></tr>`; }).join('\n') +
    `\n<tr><td>Moldura das almofadas</td><td class="num">~${Math.round(M.stats.moldLen)} m</td><td class="num">1 × 1</td><td><span class="mat w"></span>Baguete</td><td>Compre ${I.moldBuy} m. Em volta de cada vão das portas, colada só no quadro, com cantos a 45°</td></tr>`;
  const PINFO = {};
  cutRows.forEach(row => { const c = C[row.u] || { n: row.u, obs: '' }; const ds = row.u === 'rod' ? `${f(row.d[0])} × ⌀3` : row.d.map(f).join(' × '); if (PINFO[row.u]) { PINFO[row.u][1] += ' ou ' + ds; PINFO[row.u][2] = String(+PINFO[row.u][2] + row.q); return; } PINFO[row.u] = [c.n1 || c.n, ds, String(row.q), (c.obs || '').replace(/<[^>]+>/g, '')]; });
  PINFO.mold = ['Moldura', '1 × 1', `~${Math.round(M.stats.moldLen)} m`, 'Em volta dos vãos das portas, colada só no quadro'];
  const rd = n => Math.round(n * 10) / 10;
  const clip = p => { if (p.g !== 'pisos' && p.g !== 'interno' || p.u === 'dGav' || p.u === 'divI' || p.u === 'rod') return p.b; const cx = (p.b[0] + p.b[3]) / 2, b = bays.find(b => cx > b.x0 && cx < b.x1); return b ? [Math.max(p.b[0], b.x0), p.b[1], p.b[2], Math.min(p.b[3], b.x1), p.b[4], p.b[5]] : p.b; };
  const parts = PARTS.map(p => { const o = { id: p.id, g: p.g, b: clip(p).map(rd), m: p.m }; if (p.u) o.u = p.u; if (p.door) o.door = p.door; if (p.drawer) o.drawer = p.drawer; if (p.thin) o.thin = 1; return o; });
  const screws = SCREWS.map(s => ({ a: s.a.map(rd), b: s.b.map(rd), t: s.t }));
  const GROUPS = [['colunas', 'Colunas'], ['laterais', 'Laterais'], ['travessas', 'Travessas'], ['base', 'Base (sapatas e cinta)'], ['fundo', 'Fundo'], ['pisos', 'Pisos'], ['interno', 'Por dentro'], ['apoios', 'Apoios e sarrafos'], ['chapeu', 'Chapéu'], ['porta', 'Portas'], ['moldura', 'Molduras'], ['gaveta', 'Gavetas']];
  const CFG = { L, D, H, LT: M.DIM.LT, ZC: M.ZC, ZD: M.ZD, ST: M.ST, DOOR_OPEN: M.DOOR_OPEN, HINGES: M.HINGES, DOORS: DOORS.map(d => ({ x0: d.x0, x1: d.x1, side: d.side, hinge: rd(d.hinge) })), LATCHES: M.LATCHES, PULLS: M.PULLS, DOOR_PULLS: M.DOOR_PULLS, bays: bays.map(b => ({ x0: b.x0, x1: b.x1, w: b.w, cx: b.cx })), GROUPS, PINFO, zcut: 144.5, shelfZ: M.ZS[1] };
  const vis = SCREWS.filter(s => s.t.startsWith('vis')).length;
  const body = `
  <section id="produto">
    <h2>O produto · ${M.short}</h2>
    <p class="lead">${T.lead}</p>
    <div class="specs"><span><b>C</b> ${L} cm (${L + 6} no topo)</span><span><b>P</b> ${D} cm</span><span><b>A</b> ${H} cm</span><span><b>Madeira</b> nogueira ou jatobá</span><span><b>Post</b> sem preço · valor sob consulta</span></div>
    <div class="prod">
      <div class="sheet"><h3>Ficha técnica</h3><dl class="facts">${T.facts.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></div>
      <div class="sheet">
        <h3>Custo e preço (uso interno)</h3>
        <div class="price"><span><b>~R$ ${I.cost.matTxt}</b><br><span class="note">material, versão nogueira</span></span><span><b>R$ ${I.cost.priceTxt}</b><br><span class="note">preço sugerido · jatobá: R$ ${I.cost.priceJatTxt}</span></span></div>
        <p class="note">${T.priceNote}</p>
        <h3>Por que vale</h3>
        <ul class="keep tight">${T.why.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
    <h3>Madeiras</h3>
    <div class="opts">
      <div class="opt"><div class="sw"><i style="background:var(--nog-top)"></i><i style="background:var(--nog-front)"></i></div><b>Nogueira · principal</b><span class="note">Cambará maciço com tingidor nogueira à base d'água, óleo de linhaça e cera de abelha. Tom de chocolate. Mais leve e mais em conta.</span></div>
      <div class="opt"><div class="sw"><i style="background:var(--jat-top)"></i><i style="background:var(--jat-front)"></i></div><b>Jatobá · madeira de lei</b><span class="note">Jatobá maciço, escuro por natureza: só óleo e cera. Castanho-avermelhado que escurece com o tempo. Mais dura, mais pesada e mais cara.</span></div>
    </div>
    <h3>Texto de venda</h3>
    <div class="sheet" style="display:flex;flex-direction:column;gap:10px"><p class="copy" id="copyTxt">${T.sale}</p><button type="button" class="cbtn" id="copyBtn">Copiar texto</button></div>
    <h3>Cuidados (para passar ao cliente)</h3>
    <ul class="keep tight">${T.care.map(x => `<li>${x}</li>`).join('')}</ul>
  </section>

  <section>
    <h2>Vista 3D</h2>
    <div class="sheet iso">
      <div class="fin" role="group" aria-label="Madeira"><span>Madeira:</span><button type="button" data-fin="nog" aria-pressed="true">Nogueira</button><button type="button" data-fin="jat" aria-pressed="false">Jatobá</button></div>
      <div class="views" role="group" aria-label="Ângulo da vista">
        <button type="button" data-view="frente" aria-pressed="true">Frente</button><button type="button" data-view="tras" aria-pressed="false">Trás</button>
        <button type="button" data-view="aberta" aria-pressed="false">Portas e gavetas abertas</button><button type="button" class="xr" id="xray" aria-pressed="false">Ver parafusos (raio-X)</button>
      </div>
      <svg id="iso" role="img" aria-label="Desenho 3D do guarda-roupa"></svg>
      <div class="pinfo" id="pinfo" hidden aria-live="polite"></div>
      <div class="chips" id="chips" role="group" aria-label="Destacar peça"></div>
      <div class="legend"><span><span class="mat w"></span>Madeira (nogueira ou jatobá)</span><span><span class="mat comp"></span>Compensado 6 mm (fundo das gavetas)</span><span><span class="mat iron"></span>Ferro</span></div>
      <div class="xlegend" id="xleg" hidden><span><i style="background:var(--scr)"></i>Parafuso escondido (por dentro ou por baixo)</span><span><i style="background:var(--scr-vis)"></i>Aparece só no fundo, contra a parede</span></div>
      <p class="note">Toque numa peça para ver as medidas dela. No raio-X, a madeira fica transparente para mostrar os ${SCREWS.length} parafusos; gire para "Trás" para ver os do fundo. As ~${I.cav} cavilhas não aparecem no desenho.</p>
    </div>
  </section>

  <section>
    <h2>Vistas cotadas</h2>
    <p class="note">Medidas em centímetros.</p>
    <div class="sheet scroll"><table><thead><tr><th>Conferência</th><th>Conta</th><th>Fecha com</th></tr></thead><tbody>
      ${T.check.map(([a, b, c]) => `<tr><td>${a}</td><td${b.length > 70 ? '' : ' class="num"'}>${b}</td><td class="num">${c}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="grid2">
      <div class="sheet ortho${L > 150 ? ' wide' : ''}"><p class="vt">Frente</p><div class="scroll"><svg id="vFront" role="img" aria-label="Vista de frente cotada"></svg></div></div>
      <div class="sheet ortho"><p class="vt">Lateral (lado direito)</p><div class="scroll"><svg id="vSide" role="img" aria-label="Vista lateral cotada"></svg></div></div>
      <div class="sheet ortho"><p class="vt">Uma porta, vista de frente (as ${nd} são iguais)</p><div class="scroll"><svg id="vDoor" role="img" aria-label="Porta cotada"></svg></div></div>
      <div class="sheet ortho wide"><p class="vt">Corte por cima, na altura do varão</p><div class="scroll"><svg id="vPlan" role="img" aria-label="Corte horizontal"></svg></div></div>
    </div>
  </section>

  <section>
    <h2>Lista de corte</h2>
    <div class="sheet scroll"><table><thead><tr><th>Peça</th><th>Qtd</th><th>Medida final</th><th>Material</th><th>Observação</th></tr></thead><tbody>
${cutHTML}
    </tbody></table></div>
    <p class="note">${T.cutNote}</p>
  </section>

  <section>
    <h2>Como cada peça se prende</h2>
    <div class="sheet scroll"><table><thead><tr><th>Ligação</th><th>Cola</th><th>Como</th></tr></thead><tbody>
      ${T.joints.map(([a, cola, c]) => `<tr><td>${a}</td><td><span class="tag ${cola === 'não' ? 'nao' : 'sim'}">${cola}</span></td><td>${c}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="note">Furo oval: dois furos de 5 mm encostados, unidos com a broca inclinada, no sentido em que a madeira se mexe (atravessado ao veio). Parafuso: furo-guia de 3 mm e furo de passagem de 5 mm na peça de cima. Cavilha: broca de 8 mm com fita marcando 21 mm de fundo, e marcador de cavilha para os furos baterem.</p>
  </section>

  <section>
    <h2>Como esconder os parafusos</h2>
    <p class="note" style="font-size:14px;color:var(--ink)">São ${SCREWS.length} parafusos de madeira e ~${I.cav} cavilhas. Na frente e nos lados <b>não aparece nenhum</b>: a estrutura é em cavilha, e os parafusos de apoios, guias, base, frisos e topo entram por dentro ou por baixo.</p>
    <ul class="keep">
      <li><b>O que aparece de propósito:</b> dobradiças e argolas de ferro, com parafusos pretos, e as taramelas de madeira.</li>
      <li><b>O fundo</b> leva ${vis} parafusos por fora, contra a parede.</li>
      <li><b>Nunca tape os parafusos em furo oval</b> (pisos, topo, fundo): eles precisam deslizar quando a madeira se mexe.</li>
      <li><b>As presilhas das almofadas</b> ficam por dentro da porta e só aparecem com ela aberta.</li>
    </ul>
  </section>

  <section>
    <h2>Ordem de montagem</h2>
    <ol class="steps">${T.steps.map(x => `<li>${x}</li>`).join('')}</ol>
  </section>

  <section>
    <h2>O que comprar</h2>
    <p class="note">Para um guarda-roupa de ${M.short}, versão nogueira.</p>
    <div class="buy">${I.buy.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <p class="note"><b>Custo total: ~R$ ${I.cost.matTxt} (nogueira) ou ~R$ ${I.cost.matJatTxt} (jatobá).</b> Você já tem cola, alicates e tico-tico. A plaina manual ajuda muito no ajuste das portas.</p>
  </section>`;
  return { M, body, data: { PARTS: parts, SCREWS: screws, CFG } };
}

const V2 = variant(2), V4 = variant(4);
const css = fs.readFileSync('ficha.css', 'utf8');
const client = fs.readFileSync('ficha-client.js', 'utf8');
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guarda-Roupa Veio</title>
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
#content{display:flex;flex-direction:column;gap:40px}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · catálogo · ficha do produto</div>
    <h1>Guarda-Roupa Veio</h1>
    <p class="lead">Guarda-roupa rústico de madeira maciça em duas versões: 2 portas (${V2.M.H} × ${V2.M.L} × ${V2.M.D}) e 4 portas (${V4.M.H} × ${V4.M.L} × ${V4.M.D}). Mesma construção, mesmas portas almofadadas, base com gavetas e chapéu com friso. Escolha o modelo abaixo: a ficha inteira muda.</p>
  </header>
  <div class="model" role="group" aria-label="Modelo">
    <span>Modelo</span>
    <button type="button" data-v="2" aria-pressed="true">2 portas <small>${V2.M.L} cm</small></button>
    <button type="button" data-v="4" aria-pressed="false">4 portas <small>${V4.M.L} cm</small></button>
  </div>
  <div id="content"></div>
</div>
<template id="t2">${V2.body}</template>
<template id="t4">${V4.body}</template>
<script>
const DATA={2:${JSON.stringify(V2.data)},4:${JSON.stringify(V4.data)}};
${client}
function show(v){
  const c=document.getElementById('content');c.innerHTML='';c.appendChild(document.getElementById('t'+v).content.cloneNode(true));
  document.querySelector('.wrap').classList.remove('jat');
  document.querySelectorAll('.model button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==String(v)?'true':'false'));
  run(DATA[v].PARTS,DATA[v].SCREWS,DATA[v].CFG);
  try{history.replaceState(null,'','#'+v+'-portas')}catch(_){}
}
document.querySelectorAll('.model button').forEach(b=>b.onclick=()=>show(+b.dataset.v));
show(location.hash.startsWith('#4')?4:2);
</script>
</html>
`;
fs.mkdirSync(out.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
fs.writeFileSync(out, html); console.log('ok', out, html.length);
