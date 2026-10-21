// Ficha de uma versão (usada pelo build-ficha.mjs, que junta as três numa página só)
import fs from 'node:fs';
import { make } from './model.mjs';
import { info } from './info.mjs';

export function variantFicha(v) {
const M = make(v), I = info(M);
const { L, H, ZC, ZL, ZLS, bays, DOORS, DRAWERS, PARTS, SCREWS, stats } = M;
const nd = DOORS.length, nb = bays.length, pairs = nd > 1;
const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
const r = n => Math.round(n * 10) / 10;

// ---------- lista de corte a partir das peças ----------
const AXI = { x: 0, y: 1, z: 2 };
const dimsOf = p => { const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain]; const len = ext[gi]; const o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x); return [len, o[0], o[1]].map(r); };
const rows = new Map();
PARTS.forEach(p => {
  if (p.m === 'vidro' || p.u === 'bg') return;
  const u = p.u || p.id, d = dimsOf(p); if (u === 'pTr') d[1] = 6; // a de cima é cortada com 6 e ajustada para 5,8
  const k = u + '|' + d.join('x');
  if (!rows.has(k)) rows.set(k, { u, d, q: 0, m: p.m }); rows.get(k).q++;
});
const C = I.cut; // nomes, material e observação por peça
const cutRows = [...rows.values()].sort((a, b) => (C[a.u]?.o ?? 99) - (C[b.u]?.o ?? 99));
const matOf = row => {
  if (row.m === 'comp') return '<span class="mat comp"></span>Compensado 6 mm';
  const c = C[row.u]; if (c?.mat) return `<span class="mat w"></span>${c.mat}`;
  return '<span class="mat w"></span>Cambará';
};
const cutHTML = cutRows.map(row => { const c = C[row.u] || { n: row.u, obs: '' }; return `<tr><td>${c.n}</td><td class="num">${row.q}</td><td class="num">${row.d.map(f).join(' × ')}</td><td>${matOf(row)}</td><td>${c.obs || ''}</td></tr>`; }).join('\n          ');

// informações de cada peça para o toque no 3D
const PINFO = {};
cutRows.forEach(row => { const c = C[row.u] || { n: row.u, obs: '' }; if (PINFO[row.u]) { PINFO[row.u][1] += ' ou ' + row.d.map(f).join(' × '); PINFO[row.u][2] = String(+PINFO[row.u][2] + row.q); return; } PINFO[row.u] = [c.n1 || c.n, row.d.map(f).join(' × '), String(row.q), (c.obs || '').replace(/<[^>]+>/g, '')]; });
const g0 = PARTS.find(p => p.u === 'vP'), gL = PARTS.find(p => p.u === 'vL');
PINFO.vP = ['Vidro da porta', `${f(I.glass.door[0])} × ${f(I.glass.door[1])} × 0,3`, String(4 * nd), 'Vidro 3 mm lapidado, entre baguetes de 1 × 1'];
PINFO.vL = ['Vidro da lateral', `${f(I.glass.side[0])} × ${f(I.glass.side[1])} × 0,3`, '8 · 4 por lado', 'Vidro 3 mm lapidado, entre baguetes de 1 × 1'];
PINFO.bg = ['Baguete', '1 × 1', `~${Math.round(stats.bgLen)} m`, 'Por fora colada; por dentro com preguinho sem cabeça 15 mm'];

// ---------- dados para o desenho ----------
const rd = n => Math.round(n * 10) / 10;
// no desenho, pisos e prateleiras viram caixas dentro do vão (não se sobrepõem às colunas e a ordem de pintura não se confunde)
const clip = p => { if (p.g !== 'pisos' && p.g !== 'prateleiras') return p.b; const cx = (p.b[0] + p.b[3]) / 2, b = bays.find(b => cx > b.x0 && cx < b.x1); return [b.x0, p.b[1], p.b[2], b.x1, p.b[4], p.b[5]]; };
const parts = PARTS.map(p => { const o = { id: p.id, g: p.g, b: clip(p).map(rd), m: p.m }; if (p.u) o.u = p.u; if (p.door) o.door = p.door; if (p.drawer) o.drawer = p.drawer; if (p.thin) o.thin = 1; return o; });
const screws = SCREWS.map(s => ({ a: s.a.map(rd), b: s.b.map(rd), t: s.t }));
const GROUPS = [['colunas', 'Colunas'], ['travessas', 'Travessas'], ['laterais', 'Laterais'], ...(v === 4 ? [['divisoria', 'Divisória central']] : []), ['fundo', 'Fundo'], ['pisos', 'Pisos'], ['prateleiras', 'Prateleiras'], ['apoios', 'Apoios e sarrafos'], ['chapeu', 'Chapéu (friso e topo)'], ['porta', nd > 1 ? 'Portas' : 'Porta'], ['vidros', 'Vidros'], ['gaveta', nb > 1 ? 'Gavetas' : 'Gaveta']];
const CFG = { L, D: M.D, H, LT: M.DIM.LT, ZC, ZL, ZLS, ZD: M.ZD, ZPR: M.ZPR, SIDE_OPEN: M.SIDE_OPEN, DOOR_OPEN: M.DOOR_OPEN, HINGES: M.HINGES, DOORS: DOORS.map(d => ({ x0: d.x0, x1: d.x1, side: d.side, hinge: rd(d.hinge) })), LATCHES: M.LATCHES, PULLS: M.PULLS, bays: bays.map(b => ({ x0: b.x0, x1: b.x1, w: b.w, cx: b.cx })), GROUPS, PINFO };

// ---------- página ----------
const css = fs.readFileSync('ficha.css', 'utf8');
const client = fs.readFileSync('ficha-client.js', 'utf8');
const T = I.t;
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${M.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}
.ortho svg{max-height:640px}
.grid2 .wide{grid-column:1/-1}</style>

<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · catálogo · ficha do produto</div>
    <h1>${M.name}</h1>
    <p class="lead">${T.lead}</p>
    <div class="specs"><span><b>C</b> ${L} cm (${L + 6} no topo)</span><span><b>P</b> 40 cm (43 no topo)</span><span><b>A</b> ${H} cm</span><span><b>Madeira</b> nogueira ou jatobá</span><span><b>Post</b> sem preço · valor sob consulta</span></div>
  </header>

  <section id="produto">
    <h2>O produto</h2>
    <div class="prod">
      <div class="sheet">
        <h3>Ficha técnica</h3>
        <dl class="facts">
          ${T.facts.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('\n          ')}
        </dl>
      </div>
      <div class="sheet">
        <h3>Custo e preço (uso interno)</h3>
        <div class="price"><span><b>~R$ ${I.cost.matTxt}</b><br><span class="note">material, versão nogueira</span></span><span><b>R$ ${I.cost.priceTxt}</b><br><span class="note">preço sugerido · jatobá: R$ ${I.cost.priceJatTxt}</span></span></div>
        <p class="note">${T.priceNote}</p>
        <h3>Por que vale</h3>
        <ul class="keep tight">
          ${T.why.map(x => `<li>${x}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
    <h3>Acabamentos</h3>
    <div class="opts">
      <div class="opt"><div class="sw"><i style="background:var(--nog-top)"></i><i style="background:var(--nog-front)"></i></div><b>Nogueira · principal</b><span class="note">Cambará maciço com tingidor nogueira à base d'água, óleo de linhaça e cera de abelha. Tom de chocolate, combina com aparador e mesa rústica. Mais leve e mais em conta.</span></div>
      <div class="opt"><div class="sw"><i style="background:var(--jat-top)"></i><i style="background:var(--jat-front)"></i></div><b>Jatobá · madeira de lei</b><span class="note">Jatobá maciço, escuro por natureza: só óleo e cera, sem tingidor. Castanho-avermelhado que escurece com o tempo. Mais dura, mais pesada e mais cara (preço ao lado).</span></div>
    </div>
    <h3>Texto de venda</h3>
    <div class="sheet" style="display:flex;flex-direction:column;gap:10px">
      <p class="copy" id="copyTxt">${T.sale}</p>
      <button type="button" class="cbtn" id="copyBtn">Copiar texto</button>
    </div>
    <h3>Cuidados (para passar ao cliente)</h3>
    <ul class="keep tight">
      ${T.care.map(x => `<li>${x}</li>`).join('\n      ')}
    </ul>
  </section>

  <section>
    <h2>Vista 3D</h2>
    <div class="sheet iso">
      <div class="fin" role="group" aria-label="Acabamento"><span>Acabamento:</span>
        <button type="button" data-fin="nog" aria-pressed="true">Nogueira</button>
        <button type="button" data-fin="jat" aria-pressed="false">Jatobá</button>
      </div>
      <div class="views" role="group" aria-label="Ângulo da vista">
        <button type="button" data-view="frente" aria-pressed="true">Frente</button>
        <button type="button" data-view="tras" aria-pressed="false">Trás</button>
        <button type="button" data-view="aberta" aria-pressed="false">${nd > 1 ? 'Portas e gavetas abertas' : 'Porta e gaveta abertas'}</button>
        <button type="button" class="xr" id="xray" aria-pressed="false">Ver parafusos (raio-X)</button>
      </div>
      <svg id="iso" role="img" aria-label="Desenho 3D da cristaleira"></svg>
      <div class="pinfo" id="pinfo" hidden aria-live="polite"></div>
      <div class="chips" id="chips" role="group" aria-label="Destacar peça"></div>
      <div class="legend"><span><span class="mat w"></span>Madeira (nogueira ou jatobá)</span><span><span class="mat gl"></span>Vidro 3 mm</span><span><span class="mat comp"></span>Compensado 6 mm (fundo da gaveta)</span><span><span class="mat iron"></span>Ferro preto</span></div>
      <div class="xlegend" id="xleg" hidden><span><i style="background:var(--scr)"></i>Parafuso escondido (por dentro ou por baixo)</span><span><i style="background:var(--scr-vis)"></i>Aparece só no fundo, que fica contra a parede</span></div>
      <p class="note">Toque numa peça para ver as medidas dela. No raio-X, a madeira fica transparente para mostrar os ${SCREWS.length} parafusos; gire para "Trás" para ver os do fundo. As ${I.cav} cavilhas não aparecem no desenho.</p>
    </div>
  </section>

  <section>
    <h2>Vistas cotadas</h2>
    <p class="note">Medidas em centímetros.</p>
    <div class="sheet scroll">
      <table>
        <thead><tr><th>Conferência</th><th>Conta</th><th>Fecha com</th></tr></thead>
        <tbody>
          ${T.check.map(([a, b, c]) => `<tr><td>${a}</td><td${b.length > 70 ? '' : ' class="num"'}>${b}</td><td class="num">${c}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="grid2">
      <div class="sheet ortho${L > 100 ? ' wide' : ''}"><p class="vt">Frente</p><div class="scroll"><svg id="vFront" role="img" aria-label="Vista de frente cotada"></svg></div></div>
      <div class="sheet ortho"><p class="vt">Lateral (lado direito)</p><div class="scroll"><svg id="vSide" role="img" aria-label="Vista lateral cotada"></svg></div></div>
      <div class="sheet ortho"><p class="vt">${nd > 1 ? 'Uma porta, vista de frente (as ' + nd + ' são iguais)' : 'Porta, vista de frente'}</p><div class="scroll"><svg id="vDoor" role="img" aria-label="Porta cotada"></svg></div></div>
      <div class="sheet ortho${L > 60 ? ' wide' : ''}"><p class="vt">Corte por cima, no meio de um nicho</p><div class="scroll"><svg id="vPlan" role="img" aria-label="Corte horizontal"></svg></div></div>
    </div>
  </section>

  <section>
    <h2>Lista de corte</h2>
    <div class="sheet scroll">
      <table>
        <thead><tr><th>Peça</th><th>Qtd</th><th>Medida final</th><th>Material</th><th>Observação</th></tr></thead>
        <tbody>
          ${cutHTML}
        </tbody>
      </table>
    </div>
    <p class="note">${T.cutNote}</p>
  </section>

  <section>
    <h2>Vidros e baguetes</h2>
    <div class="sheet scroll">
      <table>
        <thead><tr><th>Peça</th><th>Qtd</th><th>Medida</th><th>Observação</th></tr></thead>
        <tbody>
          <tr><td>Vidros das portas</td><td class="num">${4 * nd}</td><td class="num">${f(I.glass.door[0])} × ${f(I.glass.door[1])} cm</td><td>Vidro incolor 3 mm com bordas lapidadas (sem fio)</td></tr>
          <tr><td>Vidros das laterais</td><td class="num">8</td><td class="num">${f(I.glass.side[0])} × ${f(I.glass.side[1])} cm</td><td>4 de cada lado. Mesmo vidro</td></tr>
          <tr><td>Baguete de madeira 1 × 1 cm</td><td class="num">~${Math.round(stats.bgLen)} m</td><td class="num">compre ${I.bgBuy} m</td><td>Dos dois lados de cada vidro: por fora colada no vão, por dentro com preguinho sem cabeça de 15 mm a cada 10 cm, sem cola. Assim o vidro troca por dentro</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note"><b>Meça os vãos depois da peça montada</b> e só então encomende os vidros: a vidraçaria corta 2 mm menor que o vão em cada sentido. Se um vão saiu diferente, o vidro dele também muda. Total: ~${f(stats.m2Glass)} m² de vidro (~${Math.round(stats.kgGlass)} kg).</p>
  </section>

  <section>
    <h2>Como cada peça se prende</h2>
    <div class="sheet scroll">
      <table>
        <thead><tr><th>Ligação</th><th>Cola</th><th>Como</th></tr></thead>
        <tbody>
          ${T.joints.map(([a, cola, c]) => `<tr><td>${a}</td><td><span class="tag ${cola === 'não' ? 'nao' : 'sim'}">${cola}</span></td><td>${c}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <p class="note">Furo oval: dois furos de 5 mm encostados, unidos com a broca inclinada, sempre no sentido em que a madeira se mexe (atravessado ao veio). Parafuso de madeira: furo-guia de 3 mm e furo de passagem de 5 mm na peça de cima. Cavilha: broca de 8 mm com fita marcando 21 mm de fundo; marque a outra peça com <b>marcador de cavilha</b> (pino de centrar) para os furos baterem.</p>
  </section>

  <section>
    <h2>Como esconder os parafusos</h2>
    <p class="note" style="font-size:14px;color:var(--ink)">São ${SCREWS.length} parafusos de madeira e ${I.cav} cavilhas. Na frente e nas laterais <b>não aparece nenhum</b>: a estrutura é toda em cavilha, e os parafusos dos apoios, guias, frisos e topo entram por dentro ou por baixo. Use o botão <b>Ver parafusos (raio-X)</b> na vista 3D.</p>
    <ul class="keep">
      <li><b>O que aparece de propósito:</b> dobradiças, ${pairs ? 'tramelas' : 'tramela'} e ${M.PULLS.length > 1 ? 'puxadores' : 'puxador'} de ferro preto, com parafusos pretos. São a "joia" da peça.</li>
      <li><b>O fundo</b> leva ${SCREWS.filter(s => s.t.startsWith('vis')).length} parafusos por fora, contra a parede. Se a cristaleira for ficar solta no meio da sala, troque os das colunas por cavilha de 8 mm colada só na coluna, cortada rente e lixada.</li>
      <li><b>Nunca tape os parafusos em furo oval</b> (pisos, topo e fundo): eles precisam deslizar quando a madeira se mexe.</li>
      <li>Dentro dos nichos, os parafusos dos apoios das prateleiras ficam atrás da travessa e não aparecem pelo vidro.</li>
    </ul>
  </section>

  <section>
    <h2>Ordem de montagem</h2>
    <ol class="steps">
      ${T.steps.map(x => `<li>${x}</li>`).join('\n      ')}
    </ol>
  </section>

  <section>
    <h2>O que comprar</h2>
    <p class="note">Para uma cristaleira, versão nogueira.</p>
    <div class="buy">
      ${I.buy.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('\n      ')}
    </div>
    <p class="note"><b>Custo total: ~R$ ${I.cost.matTxt} (nogueira) ou ~R$ ${I.cost.matJatTxt} (jatobá).</b> Você já tem cola (Titebond III), alicates e tico-tico. A plaina manual ajuda muito no ajuste ${pairs ? 'das portas' : 'da porta'}.</p>
  </section>
</div>

<script>
const PARTS=${JSON.stringify(parts)};
const SCREWS=${JSON.stringify(screws)};
const CFG=${JSON.stringify(CFG)};
${client}
</script>

</html>
`;
  return { M, I, html, data: { PARTS: parts, SCREWS: screws, CFG } };
}
