// Ficha de uma peça da linha Modern: node build-ficha.mjs es|mc|ap saida.html
import fs from 'node:fs';
import { MAKERS } from './models.mjs';
import { info } from './info.mjs';
const key = process.argv[2] || 'es', out = process.argv[3] || `../out/mo-${key}/ficha.html`;
const M = MAKERS[key](), I = info(M), C = I.cut, T = I.t;
const { L, D, H, PARTS, SCREWS } = M;
const f = n => String(Math.round(n * 10) / 10).replace('.', ','), r = n => Math.round(n * 10) / 10;
const AXI = { x: 0, y: 1, z: 2 };
const dimsOf = p => { const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain]; const o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x); return [ext[gi], o[0], o[1]].map(r); };
const rows = new Map();
PARTS.forEach(p => { if (p.part) return; const u = p.u || p.id, d = dimsOf(p), ds = C[u]?.d || d.map(f).join(' × '), kk = u + '|' + ds; if (!rows.has(kk)) rows.set(kk, { u, ds, q: 0, m: p.m, black: p.black }); rows.get(kk).q++; });
const cutRows = [...rows.values()].sort((a, b) => (C[a.u]?.o ?? 99) - (C[b.u]?.o ?? 99));
const matOf = row => row.m === 'comp' ? '<span class="mat comp"></span>Compensado 6 mm' : `<span class="mat w"></span>${C[row.u]?.mat || 'Madeira'}${row.black ? ' <span class="tag nao">preta na opção</span>' : ''}`;
const cutHTML = cutRows.map(row => { const c = C[row.u] || { n: row.u, obs: '' }; return `<tr><td>${row.q === 1 && c.n1 ? c.n1 : c.n}</td><td class="num">${row.q}</td><td class="num">${row.ds}</td><td>${matOf(row)}</td><td>${c.obs || ''}</td></tr>`; }).join('\n');
const PINFO = {}; cutRows.forEach(row => { const c = C[row.u] || { n: row.u, obs: '' }; PINFO[row.u] = [c.n1 || c.n, row.ds, String(row.q), (c.obs || '').replace(/<[^>]+>/g, '')]; });
const parts = PARTS.map(p => { const o = { id: p.id, g: p.g, b: p.b.map(r), m: p.m }; if (p.u) o.u = p.u; if (p.drawer) o.drawer = p.drawer; if (p.black) o.black = 1; return o; });
const screws = SCREWS.map(s => ({ a: s.a.map(r), b: s.b.map(r), t: s.t }));
const GROUPS = [['tampo', 'Tampo e engrossos'], ['pernas', 'Pernas'], ...(PARTS.some(p => p.g === 'saia') ? [['saia', 'Saia']] : []), ...(PARTS.some(p => p.g === 'gaveteiro') ? [['gaveteiro', 'Gaveteiro']] : []), ['sarrafos', 'Sarrafos e reforços'], ...(PARTS.some(p => p.g === 'prateleira') ? [['prateleira', 'Prateleira']] : []), ...(M.DRAWERS.length ? [['gaveta', 'Gavetas']] : [])];
const CFG = { L, D, H, GROUPS, PINFO, detail: key === 'ap' ? 'gaveta' : 'perna', fdims: key === 'es' ? [[0, 74, '74'], [72, 76, '4']] : key === 'mc' ? [[0, 9, '9'], [36, 40, '4']] : [[62, 76, 'gavetas'], [0, 14, '14']] };
const css = fs.readFileSync('ficha.css', 'utf8') + `
.ortho svg{max-height:560px}
.grid2 .wide{grid-column:1/-1}
:root{--k-top:#3a373b;--k-front:#2a272b;--k-side:#1f1d20}
.wrap.preto .bk{fill:var(--k-front)!important}
.fin button.pr[aria-pressed="true"]{background:#1f1d20;border-color:#1f1d20;color:#fff}
`;
const client = fs.readFileSync('ficha-client.js', 'utf8').replace("const vis=sc.t.startsWith('vis')", "const vis=sc.t==='allen'");
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${M.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style>
<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · linha Modern · ficha do produto</div>
    <h1>${M.name}</h1>
    <p class="lead">${T.lead}</p>
    <div class="specs"><span><b>C</b> ${L} cm</span><span><b>P</b> ${D} cm</span><span><b>A</b> ${H} cm</span><span><b>Madeira</b> nogueira ou jatobá</span><span><b>Opção</b> detalhes pretos</span><span><b>Post</b> sem preço · valor sob consulta</span></div>
  </header>
  <section id="produto">
    <h2>O produto</h2>
    <div class="prod">
      <div class="sheet"><h3>Ficha técnica</h3><dl class="facts">${T.facts.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl></div>
      <div class="sheet">
        <h3>Custo e preço (uso interno)</h3>
        <div class="price"><span><b>~R$ ${I.cost.matTxt}</b><br><span class="note">material, versão nogueira</span></span><span><b>R$ ${I.cost.priceTxt}</b><br><span class="note">preço sugerido · jatobá: R$ ${I.cost.priceJatTxt}</span></span></div>
        <p class="note">${T.priceNote}</p>
        <h3>Por que vale</h3><ul class="keep tight">${T.why.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
    <h3>Madeiras e opção preta</h3>
    <div class="opts">
      <div class="opt"><div class="sw"><i style="background:var(--nog-top)"></i><i style="background:var(--nog-front)"></i></div><b>Nogueira · principal</b><span class="note">Cambará maciço com tingidor nogueira, óleo de linhaça e cera de abelha. Tom de chocolate.</span></div>
      <div class="opt"><div class="sw"><i style="background:var(--jat-top)"></i><i style="background:var(--jat-front)"></i></div><b>Jatobá · madeira de lei</b><span class="note">Escuro por natureza: só óleo e cera. Mais duro, mais pesado e mais caro.</span></div>
      <div class="opt"><div class="sw"><i style="background:var(--nog-front)"></i><i style="background:#1f1d20"></i></div><b>Detalhes pretos · opção</b><span class="note">Base em preto fosco (tinta à base d'água) e tampo em madeira. Combina com cadeira e luminária pretas. Mesmo preço.</span></div>
    </div>
    <h3>Texto de venda</h3>
    <div class="sheet" style="display:flex;flex-direction:column;gap:10px"><p class="copy" id="copyTxt">${T.sale}</p><button type="button" class="cbtn" id="copyBtn">Copiar texto</button></div>
    <h3>Cuidados (para passar ao cliente)</h3>
    <ul class="keep tight">${T.care.map(x => `<li>${x}</li>`).join('')}</ul>
  </section>
  <section>
    <h2>Vista 3D</h2>
    <div class="sheet iso">
      <div class="fin" role="group" aria-label="Madeira"><span>Madeira:</span><button type="button" data-fin="nog" aria-pressed="true">Nogueira</button><button type="button" data-fin="jat" aria-pressed="false">Jatobá</button><button type="button" class="pr" id="pretoBtn" aria-pressed="false">Detalhes pretos</button></div>
      <div class="views" role="group" aria-label="Ângulo da vista">
        <button type="button" data-view="frente" aria-pressed="true">Frente</button><button type="button" data-view="tras" aria-pressed="false">Trás</button>
        ${M.DRAWERS.length ? '<button type="button" data-view="aberta" aria-pressed="false">Gavetas abertas</button>' : ''}<button type="button" class="xr" id="xray" aria-pressed="false">Ver parafusos (raio-X)</button>
      </div>
      <svg id="iso" role="img" aria-label="Desenho 3D"></svg>
      <div class="pinfo" id="pinfo" hidden aria-live="polite"></div>
      <div class="chips" id="chips" role="group" aria-label="Destacar peça"></div>
      <div class="xlegend" id="xleg" hidden><span><i style="background:var(--scr)"></i>Parafuso de madeira, escondido embaixo ou por dentro</span><span><i style="background:var(--scr-vis)"></i>Allen M6 em bucha com rosca: as ligações que desmontam</span></div>
      <p class="note">Toque numa peça para ver as medidas dela. No raio-X, a madeira fica transparente e aparecem os ${SCREWS.length} parafusos: nenhum fica à vista.</p>
    </div>
  </section>
  <section>
    <h2>Vistas cotadas</h2>
    <div class="sheet scroll"><table><thead><tr><th>Conferência</th><th>Conta</th><th>Fecha com</th></tr></thead><tbody>
      ${T.check.map(([a, b, c]) => `<tr><td>${a}</td><td${b.length > 70 ? '' : ' class="num"'}>${b}</td><td class="num">${c}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="grid2">
      <div class="sheet ortho wide"><p class="vt">Frente</p><div class="scroll"><svg id="vFront" role="img" aria-label="Vista de frente"></svg></div></div>
      <div class="sheet ortho"><p class="vt">Lateral</p><div class="scroll"><svg id="vSide" role="img" aria-label="Vista lateral"></svg></div></div>
      <div class="sheet ortho"><p class="vt">${key === 'ap' ? 'Frente da gaveta, com a cava' : 'Perna de painel'}</p><div class="scroll"><svg id="vDet" role="img" aria-label="Detalhe"></svg></div></div>
      <div class="sheet ortho wide"><p class="vt">Por baixo do tampo: vigas, sarrafos e pernas</p><div class="scroll"><svg id="vPlan" role="img" aria-label="Vista por baixo"></svg></div></div>
    </div>
  </section>
  <section>
    <h2>Lista de corte</h2>
    <div class="sheet scroll"><table><thead><tr><th>Peça</th><th>Qtd</th><th>Medida final</th><th>Material</th><th>Observação</th></tr></thead><tbody>
${cutHTML}
    </tbody></table></div>
    <p class="note">Sarrafos e reforços ficam escondidos: podem ser de pinus, com o mesmo acabamento da base. Na opção detalhes pretos, as peças marcadas vão pintadas de preto fosco.</p>
  </section>
  <section>
    <h2>Como cada peça se prende</h2>
    <div class="sheet scroll"><table><thead><tr><th>Ligação</th><th>Cola</th><th>Como</th></tr></thead><tbody>
      ${T.joints.map(([a, cola, c]) => `<tr><td>${a}</td><td><span class="tag ${cola === 'não' ? 'nao' : 'sim'}">${cola}</span></td><td>${c}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="note">Furo oval: dois furos de 5 mm encostados, unidos com a broca inclinada, no sentido em que a madeira se mexe. Bucha com rosca M6: furo com a broca da embalagem (em geral 8 mm), 13 mm de fundo, cravada com chave allen. Nunca tape os parafusos em furo oval.</p>
  </section>
  <section>
    <h2>Ordem de montagem</h2>
    <ol class="steps">${T.steps.map(x => `<li>${x}</li>`).join('')}</ol>
  </section>
  <section>
    <h2>O que comprar</h2>
    <div class="buy">${T.buy.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <p class="note"><b>Custo total: ~R$ ${I.cost.matTxt} (nogueira) ou ~R$ ${I.cost.matJatTxt} (jatobá).</b> Você já tem cola, alicates e tico-tico.</p>
  </section>
</div>
<script>
${client}
run(${JSON.stringify(parts)},${JSON.stringify(screws)},${JSON.stringify(CFG)});
</script>
</html>
`;
fs.mkdirSync(out.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
fs.writeFileSync(out, html); console.log('ok', out, html.length);
