// Legenda, LEIA-ME e prévia do post de cada peça da linha Raiz: node texts.mjs
import fs from 'node:fs';
import { MAKERS } from './models.mjs';
import { info } from './info.mjs';
const hoje = '10/10/2026';
const SLUG = { mj: 'Mesa-de-Jantar-Raiz', bc: 'Banco-Raiz', bg: 'Bancada-Gourmet-Raiz' };
const D = {
  mj: { intro: 'Mesa para 6 lugares com tampo de 5 cm: três pranchas maciças coladas, com gravatas-borboleta em cambará claro nas emendas. Os cavaletes são presos por uma longarina com cunha passante: tira a cunha e a mesa desmonta.', it: ['Cavilhas claras à mostra no pé e na travessa', 'Desmonta em 4 partes para a mudança', 'Faz par com o Banco Raiz'], tags: '#mesadejantar #mesademadeira #saladejantar #mesarustica', enq: '"Mesa para 6: nogueira ou jatobá?"', alt3: 'Detalhe da cunha passante, que aperta o cavalete na longarina.' },
  bc: { intro: 'O par da Mesa de Jantar Raiz: assento de 5 cm de duas pranchas coladas, com gravatas-borboleta na emenda, e o mesmo cavalete com cunha passante.', it: ['3 lugares: substitui duas cadeiras de um lado da mesa', '45 cm de altura, a medida certa para a mesa', 'Cavilhas claras à mostra'], tags: '#bancodemadeira #banco #saladejantar #moveisrusticos', enq: '"Banco ou cadeira de um lado da mesa?"', alt3: 'Detalhe da gravata-borboleta de madeira clara na emenda do assento.' },
  bg: { intro: 'Para a área gourmet, a varanda ou a cozinha: tampo de 5 cm para apoiar tábua e travessa, gaveta de talheres, ganchos para pano e avental, toalheiro e prateleira de ripas embaixo.', it: ['Gaveta com puxador torneado em cambará claro', '3 ganchos de cavilha e toalheiro', 'Prateleira de ripas para panelas, carvão e cestos'], tags: '#areagourmet #espacogourmet #bancadagourmet #churrasco', enq: '"Sua área gourmet precisa de uma? Sim / Já tenho"', alt3: 'Detalhe dos três ganchos de cavilha clara na lateral da bancada.' },
};
for (const k of ['mj', 'bc', 'bg']) {
  const M = MAKERS[k](), I = info(M), d = D[k], slug = SLUG[k], out = `../out/ra-${k}`, med = `${M.L} × ${M.D} × ${M.H} cm`;
  fs.mkdirSync(out, { recursive: true });
  const legenda = `${M.name} 🌳 · linha Raiz

${d.intro}

✔️ ${med}
✔️ Madeira maciça escura: cambará nogueira ou jatobá
✔️ Cavilhas e gravatas em cambará claro, ou discretas na mesma madeira
${d.it.map(x => '✔️ ' + x).join('\n')}

📦 Sob encomenda, feita à mão em Uberlândia. Pronta em ${I.prazo}.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver os detalhes 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linharaiz ${d.tags} #madeiramacica #moveisdemadeira #moveisrusticos #feitoamao #marcenariaartesanal #uberlandia #udi #uberlandiamg #triangulomineiro`;
  const alt = [
    `${M.name} de madeira maciça escura, com tampo de 5 cm e cavilhas e gravatas-borboleta em madeira clara, título ${M.name}, linha Raiz.`,
    `Vídeo da peça sendo montada, com as medidas, um detalhe, a opção com cavilhas discretas e as duas madeiras.`,
    d.alt3,
    `Desenho com as medidas: ${M.L} cm de largura, ${M.D} de profundidade e ${M.H} de altura.`,
    'A peça em nogueira e em jatobá, lado a lado.',
    `Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em ${I.prazo}.`,
  ];
  const wa = `Linha Raiz da Marcenaria Moraes 🌳
${M.name}: madeira maciça, ${med}, nogueira ou jatobá, tampo de 5 cm e encaixes à mostra em cambará claro.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!`;
  fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `${M.name.toUpperCase()} · POST · LINHA RAIZ
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
  5 · 5-madeiras.png
  6 · 6-como-encomendar.png


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


STORIES NO MESMO DIA
  1. Vídeo vertical (3-outros-videos/${slug}-reels-vertical-9x16.mp4) com a figurinha "Link" para o WhatsApp.
  2. Enquete com o slide 5: ${d.enq}
  3. Guarde no destaque Raiz.


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
  fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `${M.name.toUpperCase()} - Marcenaria Moraes · linha Raiz
Atualizado em ${hoje}

${med} · ~${I.kg} kg (nogueira) · ${I.prazo}
Madeira: nogueira (principal) ou jatobá. Cavilhas, cunhas e gravatas em cambará claro (ou discretas), mesmo preço.
Tampo de 5 cm e encaixes à mostra.

${slug}.html
  Ficha completa: ficha técnica, custo (~R$ ${I.cost.matTxt}) e preço sugerido (R$ ${I.cost.priceTxt};
  jatobá R$ ${I.cost.priceJatTxt}), só para USO INTERNO. Vista 3D com botões Nogueira / Jatobá / Detalhes claros
  e raio-X dos parafusos, vistas cotadas, lista de corte, ligações, montagem e compras.

${slug}-video-vertical-instagram.mp4 · Reels 9:16 (31 s), nogueira, com música
${slug}-video-horizontal-jatoba.mp4  · comercial 16:9 (31 s), jatobá, com música

A pasta "arquivos-de-origem" da linha Raiz tem o modelo 3D (models.mjs) e os scripts das três peças.
`);
  let p = fs.readFileSync('previa-template.html', 'utf8');
  const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
  rp('<title>Post Cristaleira Antique</title>', `<title>Post ${M.name}</title>`);
  rp('Post de lançamento da Cristaleira Antique', `Post de lançamento: ${M.name}`);
  rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeiras.png" alt="Madeiras"><div class="cap"><b>5</b><span>Nogueira ou jatobá</span>');
  rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 31 s</span>');
  rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de ' + I.prazo);
  p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
  p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
  p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
  p = p.replace(/"Qual você escolheria\? [^"]*"/, d.enq);
  p = p.replace(/"Ficou com dúvida sobre a Cristaleira Antique\?/, `"Ficou com dúvida sobre a ${M.name}?`);
  p = p.replace(/Mel \/ Nogueira/g, 'Nogueira / Jatobá');
  if (/Cristaleira/.test(p)) console.log('AVISO', k, 'sobrou Cristaleira');
  fs.writeFileSync(`${out}/previa-do-post.html`, p);
}
console.log('ok');
