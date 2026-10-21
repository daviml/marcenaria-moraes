// Gera os arquivos da marca Marcenaria Moraes (opção 3: selo com folha de amoreira).
// Todo texto vira contorno vetorial, então nenhum arquivo depende de fonte instalada.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const { Resvg } = require('@resvg/resvg-js');
const potrace = require('potrace');

const OUT = process.argv[2];
if (!OUT) throw new Error('uso: node build.js <pasta de saída>');
const dir = (...p) => { const d = path.join(OUT, ...p); fs.mkdirSync(d, { recursive: true }); return d; };

const load = f => { const b = fs.readFileSync(require.resolve(f)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const BITTER = load('@fontsource/bitter/files/bitter-latin-700-normal.woff');
const YOUNG = load('@fontsource/young-serif/files/young-serif-latin-400-normal.woff');
const INST = load('@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff');
const INST6 = load('@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff');

const C = {
  amora: '#4A1C3C', amoraClaro: '#D7A3C6', cerne: '#B0782C', cerneClaro: '#DDAE62',
  papel: '#FAF7F3', creme: '#F3ECEF', carvao: '#1C1519', preto: '#000000', branco: '#FFFFFF', cinza: '#6B5E66',
};

const r2 = n => Math.round(n * 100) / 100;
// Converte os comandos do contorno em "d" do SVG (o toPathData do opentype.js gera NaN em alguns glifos)
const toD = p => p.commands.map(c => c.type === 'Z' ? 'Z'
  : c.type === 'Q' ? `Q${r2(c.x1)} ${r2(c.y1)} ${r2(c.x)} ${r2(c.y)}`
  : c.type === 'C' ? `C${r2(c.x1)} ${r2(c.y1)} ${r2(c.x2)} ${r2(c.y2)} ${r2(c.x)} ${r2(c.y)}`
  : `${c.type}${r2(c.x)} ${r2(c.y)}`).join('');
const glyphs = (font, str, size, ls) => {
  // um glifo por caractere: evita as substituições contextuais que o opentype.js não suporta
  const gs = [...str].map(ch => font.charToGlyph(ch));
  const adv = gs.map(g => g.advanceWidth * size / font.unitsPerEm);
  const width = adv.reduce((a, b) => a + b, 0) + ls * (gs.length - 1);
  return { gs, adv, width };
};
// Texto em linha reta, alinhado à esquerda, ao centro ou à direita
function lineText(font, str, size, x, y, { anchor = 'middle', ls = 0 } = {}) {
  const { gs, adv, width } = glyphs(font, str, size, ls);
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let d = '';
  gs.forEach((g, i) => { d += toD(g.getPath(cx, y, size)); cx += adv[i] + ls; });
  return d;
}
// Texto em arco, centrado no topo (top=true, letras para fora) ou na base (letras para dentro)
function arcText(font, str, size, ls, r, cx, cy, top) {
  const { gs, adv, width } = glyphs(font, str, size, ls);
  let s = Math.PI * r / 2 - width / 2;
  let out = '';
  gs.forEach((g, i) => {
    const sc = s + adv[i] / 2;
    const th = top ? Math.PI + sc / r : Math.PI - sc / r;
    const px = cx + r * Math.cos(th), py = cy + r * Math.sin(th);
    const rot = (top ? th + Math.PI / 2 : th - Math.PI / 2) * 180 / Math.PI;
    out += `<path transform="translate(${r2(px)} ${r2(py)}) rotate(${r2(rot)})" d="${toD(g.getPath(-adv[i] / 2, 0, size))}"/>`;
    s += adv[i] + ls;
  });
  return out;
}

const LEAF = 'M50 6 C58 18 80 30 86 55 C91 78 76 98 58 100 C54 100.5 51.5 98.5 50 96 C48.5 98.5 46 100.5 42 100 C24 98 9 78 14 55 C20 30 42 18 50 6 Z';
const VEINS = '<path d="M50 24 V92" stroke-width="4.5"/><path d="M50 44 L31 33 M50 44 L69 33 M50 61 L25 50 M50 61 L75 50 M50 77 L30 72 M50 77 L70 72" stroke-width="3.6"/>';
function leafGroup(color, id, transform) {
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="120"><rect width="100" height="120" fill="#fff"/><g fill="none" stroke="#000" stroke-linecap="round">${VEINS}</g></mask>` +
    `<g transform="${transform}" fill="${color}"><path mask="url(#${id})" d="${LEAF}"/><path d="M50 97 V115" stroke="${color}" stroke-width="6" stroke-linecap="round" fill="none"/></g>`;
}
const TOP = arcText(BITTER, 'MORAES', 21, 5, 68, 100, 100, true);
const BOT = arcText(BITTER, 'MARCENARIA', 11.5, 4.5, 79, 100, 100, false);
// Conteúdo do selo num quadro de 200 × 200
function sealInner(color, id = 'veias') {
  return `<g fill="${color}"><circle cx="100" cy="100" r="92" fill="none" stroke="${color}" stroke-width="5"/>` +
    `<circle cx="100" cy="100" r="60" fill="none" stroke="${color}" stroke-width="2.6"/>${TOP}${BOT}` +
    `<circle cx="25" cy="100" r="2.8"/><circle cx="175" cy="100" r="2.8"/></g>` +
    leafGroup(color, id, 'translate(61.67 54) scale(0.76667)');
}
const svgDoc = (w, h, body, extra = '') => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}</svg>\n`;
const sealSVG = (color, bg) => svgDoc(200, 200, (bg ? `<rect width="200" height="200" fill="${bg}"/>` : '') + sealInner(color));
const leafSVG = color => svgDoc(100, 120, leafGroup(color, 'veias', ''));
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
const write = (d, name, data) => fs.writeFileSync(path.join(d, name), data);

(async () => {
  // 1. Selo e folha em SVG e PNG, nas cores da marca
  const dSvg = dir('01-logo', 'svg'), dPng = dir('01-logo', 'png');
  const variants = [
    ['amora', C.amora, null], ['cerne', C.cerne, null], ['cerne-claro', C.cerneClaro, null], ['preto', C.preto, null], ['branco', C.branco, null],
    ['amora-fundo-papel', C.amora, C.papel], ['creme-fundo-amora', C.creme, C.amora], ['cerne-fundo-carvao', C.cerneClaro, C.carvao],
  ];
  for (const [n, c, bg] of variants) {
    const s = sealSVG(c, bg);
    write(dSvg, `moraes-selo-${n}.svg`, s);
    write(dPng, `moraes-selo-${n}-3000px.png`, png(s, 3000));
    write(dPng, `moraes-selo-${n}-1000px.png`, png(s, 1000));
  }
  for (const [n, c] of [['amora', C.amora], ['cerne', C.cerne], ['cerne-claro', C.cerneClaro], ['preto', C.preto], ['branco', C.branco]]) {
    const s = leafSVG(c);
    write(dSvg, `moraes-folha-${n}.svg`, s);
    write(dPng, `moraes-folha-${n}-1000px.png`, png(s, 1000));
  }

  // 2. Vetor de peça única (sem máscara nem transformações) para ferro de marcar, laser e CNC
  const dIron = dir('02-ferro-e-laser');
  const big = png(sealSVG('#000', '#fff'), 4000);
  const traced = await new Promise((ok, ko) => potrace.trace(big, { threshold: 128, turdSize: 30, optTolerance: 0.2, color: '#000000', background: 'transparent' }, (e, s) => e ? ko(e) : ok(s)));
  const d = traced.match(/ d="([^"]+)"/)[1];
  const mm = 35;
  const ironDoc = (mirror, size) => svgDoc(4000, 4000, `<path fill="#000" fill-rule="evenodd" ${mirror ? 'transform="translate(4000 0) scale(-1 1)" ' : ''}d="${d}"/>`)
    .replace('width="4000" height="4000"', `width="${size}mm" height="${size}mm"`);
  write(dIron, 'moraes-selo-vetor-unico.svg', ironDoc(false, mm));
  write(dIron, 'moraes-selo-FERRO-ESPELHADO-35mm.svg', ironDoc(true, mm));
  write(dIron, 'moraes-selo-FERRO-ESPELHADO-50mm.svg', ironDoc(true, 50));
  write(dIron, 'moraes-selo-FERRO-ESPELHADO-preview.png', png(ironDoc(true, mm).replace(/width="35mm" height="35mm"/, 'width="4000" height="4000"'), 1200));

  // 3. Instagram
  const dIg = dir('03-instagram');
  // Foto de perfil: o selo cabe inteiro no círculo do Instagram
  const avatar = (fg, bg) => svgDoc(1080, 1080, `<rect width="1080" height="1080" fill="${bg}"/><g transform="translate(75.6 75.6) scale(4.644)">${sealInner(fg)}</g>`);
  write(dIg, 'perfil-amora.png', png(avatar(C.creme, C.amora), 1080));
  write(dIg, 'perfil-papel.png', png(avatar(C.amora, C.papel), 1080));

  // Capas dos destaques (1080 × 1920; o Instagram mostra só o círculo central)
  const covers = [['tabuas', 'Tábuas'], ['encomendas', 'Encomendas'], ['processo', 'Processo'], ['cuidados', 'Cuidados'], ['clientes', 'Clientes']];
  for (const [file, label] of covers) {
    const body = `<rect width="1080" height="1920" fill="${C.amora}"/>` +
      leafGroup(C.cerneClaro, 'v', 'translate(440 620) scale(2)') +
      `<path fill="${C.creme}" d="${lineText(INST6, label, 104, 540, 1230)}"/>`;
    write(dIg, `destaque-${file}.png`, png(svgDoc(1080, 1920, body), 1080));
  }

  // Posts de abertura (1080 × 1350)
  const post1 = `<rect width="1080" height="1350" fill="${C.papel}"/>` +
    `<g transform="translate(340 150) scale(2)">${sealInner(C.amora, 'p1')}</g>` +
    `<path fill="${C.carvao}" d="${lineText(YOUNG, 'Madeira maciça,', 86, 540, 780)}"/>` +
    `<path fill="${C.carvao}" d="${lineText(YOUNG, 'feita à mão.', 86, 540, 885)}"/>` +
    `<path fill="${C.cinza}" d="${lineText(INST, 'Tábuas, mesas e peças rústicas sob encomenda', 36, 540, 1000)}"/>` +
    `<path fill="${C.cerne}" d="${lineText(INST6, 'UBERLÂNDIA · MG', 28, 540, 1210, { ls: 6 })}"/>`;
  write(dIg, 'post-01-apresentacao.png', png(svgDoc(1080, 1350, post1), 1080));

  const post2 = `<rect width="1080" height="1350" fill="${C.amora}"/>` +
    leafGroup(C.cerneClaro, 'p2', 'translate(450 150) scale(1.8)') +
    `<path fill="${C.creme}" d="${lineText(YOUNG, 'Moraes vem', 92, 540, 620)}"/>` +
    `<path fill="${C.creme}" d="${lineText(YOUNG, 'de amoreira.', 92, 540, 730)}"/>` +
    [['O sobrenome nasce de Morais, em Portugal:', 860], ['o lugar das amoreiras. Da árvore', 912], ['à sua mesa, cada peça é feita à mão.', 964]]
      .map(([t, y]) => `<path fill="${C.amoraClaro}" d="${lineText(INST, t, 36, 540, y)}"/>`).join('') +
    `<path fill="${C.cerneClaro}" d="${lineText(INST6, 'MARCENARIA MORAES', 28, 540, 1210, { ls: 6 })}"/>`;
  write(dIg, 'post-02-historia-do-nome.png', png(svgDoc(1080, 1350, post2), 1080));

  // Selo de assinatura para colocar no canto das fotos
  write(dIg, 'marca-dagua-branca-600px.png', png(sealSVG(C.branco), 600));

  // 4. Conteúdo que não depende de foto
  // Ícones dos destaques (quadro 100 × 100): no círculo pequeno o texto não se lê, e o Instagram já escreve o nome embaixo
  const ICONS = {
    tabuas: f => `<g fill="${f}"><rect x="6" y="28" width="68" height="52" rx="10"/><rect x="66" y="42" width="28" height="24" rx="9"/></g>` +
      `<circle cx="84" cy="54" r="4.5" fill="${C.amora}"/><g fill="none" stroke="${C.amora}" stroke-width="3" stroke-linecap="round"><path d="M16 42 C34 38 46 46 64 42 M16 54 C30 58 48 50 64 55 M16 67 C34 63 46 71 64 67"/></g>`,
    encomendas: f => `<path fill="${f}" d="M50 8 L90 29 V73 L50 94 L10 73 V29 Z"/><g fill="none" stroke="${C.amora}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"><path d="M10 29 L50 50 L90 29 M50 50 V94 M30 18.5 L70 39.5 V52"/></g>`,
    processo: f => `<path fill="${f}" d="M6 50 L64 28 V70 H6 Z"/><path fill="${f}" d="${Array.from({ length: 10 }, (_, i) => `M${6 + i * 5.8} 69 l2.9 7 l2.9 -7 Z`).join('')}"/>` +
      `<rect x="58" y="22" width="36" height="54" rx="13" fill="${f}"/><rect x="70" y="34" width="13" height="30" rx="6.5" fill="${C.amora}"/>`,
    cuidados: f => `<path fill="${f}" d="M50 6 C42 20 20 44 20 64 A30 30 0 0 0 80 64 C80 44 58 20 50 6 Z"/><path d="M34 64 A16 16 0 0 0 50 80" fill="none" stroke="${C.amora}" stroke-width="4.5" stroke-linecap="round"/>`,
    clientes: f => `<path fill="${f}" d="M50 88 C20 66 6 50 6 33 C6 19 17 10 29 10 C39 10 46 16 50 24 C54 16 61 10 71 10 C83 10 94 19 94 33 C94 50 80 66 50 88 Z"/>`,
  };
  for (const [name, icon] of Object.entries(ICONS)) {
    const body = `<rect width="1080" height="1920" fill="${C.amora}"/><g transform="translate(280 700) scale(5.2)">${icon(C.cerneClaro)}</g>`;
    write(dIg, `destaque-icone-${name}.png`, png(svgDoc(1080, 1920, body), 1080));
  }

  // Quebra o texto em linhas que caibam na largura
  const wrap = (font, str, size, max) => str.split(' ').reduce((lines, w) => {
    const t = lines.length ? `${lines[lines.length - 1]} ${w}` : w;
    if (lines.length && glyphs(font, t, size, 0).width <= max) lines[lines.length - 1] = t; else lines.push(w);
    return lines;
  }, []);
  const para = (font, str, size, x, y, lh, max, fill, anchor = 'middle') =>
    wrap(font, str, size, max).map((t, i) => `<path fill="${fill}" d="${lineText(font, t, size, x, y + i * lh, { anchor })}"/>`).join('');
  const footer = (fill, label) => `<path fill="${fill}" d="${lineText(INST6, label, 26, 540, 1250, { ls: 6 })}"/>`;

  // Post 8: carrossel "Como cuidar da sua tábua" (1080 × 1350)
  const dCar = dir('03-instagram', 'post-08-cuidados');
  const steps = [
    ['Lave à mão.', 'Detergente neutro e água corrente. Seque e guarde em pé. Nunca deixe de molho nem coloque na lava-louças.', 'cuidados'],
    ['Passe óleo.', 'Quando a madeira parecer seca, passe óleo mineral, espere 20 minutos e tire o excesso com um pano.', 'cuidados'],
    ['Uma lixada leve.', 'Marcou muito? Lixe no sentido do veio e passe óleo de novo. A tábua volta a ficar como nova.', 'tabuas'],
  ];
  const slides = [];
  slides.push(`<rect width="1080" height="1350" fill="${C.amora}"/>` + leafGroup(C.cerneClaro, 'c0', 'translate(476 200) scale(1.28)') +
    `<path fill="${C.cerneClaro}" d="${lineText(INST6, 'CUIDADOS', 28, 540, 470, { ls: 8 })}"/>` +
    para(YOUNG, 'Sua tábua dura muitos anos com 3 cuidados.', 88, 540, 640, 108, 860, C.creme) +
    `<path fill="${C.amoraClaro}" d="${lineText(INST, 'Arraste para o lado', 34, 520, 1130)}"/>` +
    `<path d="M686 1118 H726 M712 1104 L726 1118 L712 1132" fill="none" stroke="${C.amoraClaro}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  steps.forEach(([title, text], i) => slides.push(`<rect width="1080" height="1350" fill="${C.papel}"/>` +
    `<path fill="${C.cerne}" d="${lineText(YOUNG, String(i + 1), 300, 120, 560, { anchor: 'start' })}"/>` +
    `<path fill="${C.carvao}" d="${lineText(YOUNG, title, 92, 120, 720, { anchor: 'start' })}"/>` +
    para(INST, text, 44, 120, 840, 64, 840, C.cinza, 'start') + footer(C.cerne, `MARCENARIA MORAES  ·  ${i + 2}/5`)));
  slides.push(`<rect width="1080" height="1350" fill="${C.amora}"/>` +
    `<path fill="${C.cerneClaro}" d="${lineText(INST6, 'NUNCA USE', 28, 540, 260, { ls: 8 })}"/>` +
    [['Óleo de cozinha', 'fica rançoso'], ['Verniz', 'descasca e vai para a comida'], ['Lava-louças', 'racha e empena a madeira']]
      .map(([a, b], i) => `<path fill="${C.creme}" d="${lineText(YOUNG, a, 64, 540, 400 + i * 170)}"/><path fill="${C.amoraClaro}" d="${lineText(INST, b, 36, 540, 455 + i * 170)}"/>`).join('') +
    `<g transform="translate(440 880) scale(1)">${sealInner(C.creme, 'c4')}</g>` +
    footer(C.cerneClaro, 'SALVE ESTE POST'));
  slides.forEach((b, i) => write(dCar, `post-08-cuidados-${i + 1}.png`, png(svgDoc(1080, 1350, b), 1080)));

  // Story para o destaque "Encomendas" (1080 × 1920; topo e base livres para os botões do Instagram)
  const how = [
    ['Escolha a peça', 'Mande a medida ou uma foto de referência pelo WhatsApp.'],
    ['Sinal de 50%', 'Pelo Pix. Ele separa a madeira e começa a produção.'],
    ['De 10 a 15 dias', 'Você recebe fotos da sua peça sendo feita.'],
    ['Entrega', 'Retire ou receba em Uberlândia. O restante se paga na entrega.'],
  ];
  const story = `<rect width="1080" height="1920" fill="${C.amora}"/>` +
    `<path fill="${C.cerneClaro}" d="${lineText(INST6, 'ENCOMENDAS', 30, 540, 340, { ls: 8 })}"/>` +
    `<path fill="${C.creme}" d="${lineText(YOUNG, 'Como encomendar', 96, 540, 470)}"/>` +
    how.map(([t, d], i) => { const y = 650 + i * 250; return `<circle cx="170" cy="${y - 28}" r="46" fill="${C.cerneClaro}"/>` +
      `<path fill="${C.amora}" d="${lineText(YOUNG, String(i + 1), 56, 170, y - 8)}"/>` +
      `<path fill="${C.creme}" d="${lineText(INST6, t, 50, 260, y - 10, { anchor: 'start' })}"/>` +
      para(INST, d, 36, 260, y + 50, 48, 700, C.amoraClaro, 'start'); }).join('') +
    `<path fill="${C.cerneClaro}" d="${lineText(INST6, 'WHATSAPP · LINK NA BIO', 30, 540, 1660, { ls: 6 })}"/>`;
  write(dIg, 'story-encomendas.png', png(svgDoc(1080, 1920, story), 1080));

  console.log('ok', fs.readdirSync(OUT));
})().catch(e => { console.error(e); process.exit(1); });
