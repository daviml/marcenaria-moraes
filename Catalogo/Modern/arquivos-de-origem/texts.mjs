// Legenda, LEIA-ME e prévia do post de cada peça da linha Modern: node texts.mjs
import fs from 'node:fs';
import { MAKERS } from './models.mjs';
import { info } from './info.mjs';
const hoje = '10/10/2026';
const SLUG = { es: 'Escrivaninha-Cerne', mc: 'Mesa-de-Centro-Modern', ap: 'Aparador-Modern' };
const D = {
  es: { intro: 'Madeira maciça de verdade, do tampo às pernas. Tampo largo de 1,50 m para trabalhar e estudar com espaço, borda de 4 cm e cantos arredondados. Agora da linha Modern.', it: ['Pernas de painel e saia traseira que esconde os fios', 'Nenhum parafuso à vista: desmonta em 4 partes com uma chave allen', 'Reforçada por baixo: o tampo fica reto por muitos anos'], tags: '#escrivaninha #escrivaninhademadeira #homeoffice #mesadeescritorio', enq: '"Madeira inteira ou detalhes pretos?"', alt3: 'Detalhe da borda de 4 cm e dos cantos arredondados do tampo.' },
  mc: { intro: 'O mesmo desenho da Escrivaninha Cerne, na altura do sofá: tampo com borda de 4 cm, pernas de painel e prateleira embaixo.', it: ['Prateleira para revistas, livros e controles', 'Zero ferragem: nem parafuso, nem dobradiça, nem puxador à vista', 'Tampo com cantos arredondados'], tags: '#mesadecentro #mesadecentrodemadeira #saladeestar', enq: '"Madeira inteira ou detalhes pretos?"', alt3: 'Detalhe da prateleira embaixo do tampo, entre as pernas de painel.' },
  ap: { intro: 'Para o hall, a sala de jantar ou atrás do sofá: duas gavetas sem puxador, que abrem pela cava recortada na madeira. Fechado, parece uma faixa lisa.', it: ['2 gavetas com cava: nenhum puxador nem ferragem à vista', 'Prateleira baixa para cestos, livros ou sapatos', 'Só 35 cm de fundo'], tags: '#aparador #aparadordemadeira #hall #decoracaodehall', enq: '"Madeira inteira ou detalhes pretos?"', alt3: 'Detalhe da gaveta aberta, mostrando a cava recortada na borda da frente.' },
};
for (const k of ['es', 'mc', 'ap']) {
  const M = MAKERS[k](), I = info(M), d = D[k], slug = SLUG[k], out = `../out/mo-${k}`, med = `${M.L} × ${M.D} × ${M.H} cm`;
  fs.mkdirSync(out, { recursive: true });
  const legenda = `${M.name} 🌳 · linha Modern

${d.intro}

✔️ ${med}
✔️ Madeira maciça escura: cambará nogueira ou jatobá
✔️ Opção com detalhes pretos: base em preto fosco e tampo em madeira
${d.it.map(x => '✔️ ' + x).join('\n')}

📦 Sob encomenda, feita à mão em Uberlândia. Pronta em ${I.prazo}.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver os detalhes 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhamodern ${d.tags} #madeiramacica #moveisdemadeira #designminimalista #feitoamao #marcenariaartesanal #uberlandia #udi #uberlandiamg #triangulomineiro`;
  const alt = [
    `${M.name} de madeira maciça escura, com pernas de painel e tampo de cantos arredondados, título ${M.name}, linha Modern.`,
    `Vídeo da peça sendo montada, com as medidas, um detalhe, a opção com detalhes pretos e as duas madeiras.`,
    d.alt3,
    `Desenho com as medidas: ${M.L} cm de largura, ${M.D} de profundidade e ${M.H} de altura.`,
    'A peça em madeira inteira e com detalhes pretos, lado a lado.',
    `Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em ${I.prazo}.`,
  ];
  const wa = `Linha Modern da Marcenaria Moraes 🌳
${M.name}: madeira maciça, ${med}, nogueira ou jatobá, com opção de detalhes pretos. Nenhum parafuso nem puxador à vista.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!`;
  fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `${M.name.toUpperCase()} · POST · LINHA MODERN
========================================

LEGENDA (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (pasta 1-carrossel-para-postar, formato 4:5)
  1 · 1-capa.png
  2 · 2-video.mp4  (já tem música)
  3 · 3-detalhes.png
  4 · 4-medidas.png
  5 · 5-madeira-ou-preto.png
  6 · 6-como-encomendar.png


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


STORIES NO MESMO DIA
  1. Vídeo vertical (3-outros-videos/${slug}-reels-vertical-9x16.mp4) com a figurinha "Link" para o WhatsApp.
  2. Enquete com o slide 5: ${d.enq}
  3. Guarde no destaque Modern.


STATUS DO WHATSAPP
----------------------------------------
${wa}
----------------------------------------

Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha.
`);
  fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `${M.name.toUpperCase()} · POST NO INSTAGRAM
Marcenaria Moraes · ${hoje}

previa-do-post.html       · o post inteiro, com botão para copiar a legenda
LEGENDA-E-TEXTOS.txt      · legenda, textos alternativos, stories e status do WhatsApp
1-carrossel-para-postar/  · os 6 itens do post na ordem (1080 × 1350); o vídeo já tem música
2-imagens-alta-resolucao/ · as mesmas imagens em 2160 × 2700
3-outros-videos/          · Reels vertical 9:16 (nogueira) e horizontal 16:9 (jatobá), com música
4-ficha-do-produto/       · ficha completa
`);
  fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `${M.name.toUpperCase()} - Marcenaria Moraes · linha Modern
Atualizado em ${hoje}

${med} · ~${I.kg} kg (nogueira) · ${I.prazo}
Madeira: nogueira (principal) ou jatobá. Opção com detalhes pretos (base em preto fosco), mesmo preço.
Nenhum parafuso, cantoneira ou puxador à vista.

${slug}.html
  Ficha completa: ficha técnica, custo (~R$ ${I.cost.matTxt}) e preço sugerido (R$ ${I.cost.priceTxt};
  jatobá R$ ${I.cost.priceJatTxt}), só para USO INTERNO. Vista 3D com botões Nogueira / Jatobá / Detalhes pretos
  e raio-X dos parafusos, vistas cotadas, lista de corte, ligações, montagem e compras.

${slug}-video-vertical-instagram.mp4 · Reels 9:16 (31 s), nogueira, com música
${slug}-video-horizontal-jatoba.mp4  · comercial 16:9 (31 s), jatobá, com música

A pasta "arquivos-de-origem" da linha Modern tem o modelo 3D (models.mjs) e os scripts das três peças.
`);
  let p = fs.readFileSync('previa-template.html', 'utf8');
  const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
  rp('<title>Post Cristaleira Antique</title>', `<title>Post ${M.name}</title>`);
  rp('Post de lançamento da Cristaleira Antique', `Post de lançamento: ${M.name}`);
  rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeira-ou-preto.png" alt="Madeira ou preto"><div class="cap"><b>5</b><span>Madeira ou detalhes pretos</span>');
  rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 31 s</span>');
  rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de ' + I.prazo);
  p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
  p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
  p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
  p = p.replace(/"Qual você escolheria\? [^"]*"/, d.enq);
  p = p.replace(/"Ficou com dúvida sobre a Cristaleira Antique\?/, `"Ficou com dúvida sobre a ${M.name}?`);
  p = p.replace(/Mel \/ Nogueira|Nogueira \/ Jatobá/g, 'Madeira / Preto');
  if (/Cristaleira/.test(p)) console.log('AVISO', k, 'sobrou Cristaleira');
  fs.writeFileSync(`${out}/previa-do-post.html`, p);
}
console.log('ok');
