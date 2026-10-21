// Legenda, LEIA-ME e prévia do post do Buffet Antique (as duas medidas juntas): node bf-texts.mjs
import fs from 'node:fs';
import { make } from './bf-model.mjs';
import { info } from './bf-info.mjs';
const A = make(150), B = make(110), IA = info(A), IB = info(B), out = '../out/bf', slug = 'Buffet-Antique', hoje = '10/10/2026';
fs.mkdirSync(out, { recursive: true });
const mA = `${A.L} × ${A.H} × ${A.D} cm`, mB = `${B.L} × ${B.H} × ${B.D} cm`;
const legenda = `Buffet Antique 🌳 · linha Antique

Para a sala de jantar: madeira maciça, portas almofadadas e ferragens de época em ferro, para fazer par com a Cristaleira Antique.

🔹 150 cm · ${mA} · 3 gavetas e 3 portas
🔹 110 cm · ${mB} · 2 gavetas e 2 portas

✔️ Madeira maciça escura: cambará nogueira ou jatobá (madeira de lei)
✔️ Dobradiças rústicas, puxador concha e argola de ferro preto
✔️ Gavetas para talheres e toalhas, armários com prateleira para a louça
✔️ Topo de aparador para servir na hora do almoço

📦 Sob encomenda, feito à mão em Uberlândia. Pronto em 3 a 5 semanas.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver as medidas 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhaantique #buffet #buffetdemadeira #buffetrustico #aparador #saladejantar #madeiramacica #jatoba #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #decoracaorustica #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'Dois buffets de madeira maciça escura, de 110 e 150 cm, com gavetas em cima, portas almofadadas embaixo e ferragens de ferro preto, título Buffet Antique.',
  'Vídeo do buffet sendo montado, com medidas, portas e gavetas abrindo, detalhe das ferragens e as duas madeiras.',
  'Detalhe das portas almofadadas com a dobradiça rústica e as argolas de ferro.',
  'Desenho das duas frentes com as medidas: 150 e 110 cm de largura, 90 de altura e 45 de fundo.',
  'As duas madeiras lado a lado: nogueira e jatobá.',
  'Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em 3 a 5 semanas.',
  'O buffet aberto: três gavetas e três armários com prateleira.',
];
const wa = `Novidade da linha Antique 🌳
Buffet Antique: madeira maciça, portas almofadadas e ferragens de época, em 150 cm (3 portas) ou 110 cm (2 portas), nogueira ou jatobá.
Feito sob encomenda. Me chama aqui para pedir seu orçamento!`;
fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `BUFFET ANTIQUE · POST (150 E 110 CM) · LINHA ANTIQUE
========================================

LEGENDA (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (pasta 1-carrossel-para-postar, formato 4:5)
  1 · 1-capa.png
  2 · 2-video.mp4  (já tem música; mostra as duas medidas)
  3 · 3-detalhes.png
  4 · 4-medidas.png
  5 · 5-madeiras.png
  6 · 6-como-encomendar.png
  7 · 7-por-dentro.png  (opcional)


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


STORIES NO MESMO DIA
  1. Vídeo vertical (3-outros-videos/${slug}-reels-vertical-9x16.mp4) com a figurinha "Link" para o WhatsApp.
  2. Enquete: "Qual cabe na sua sala de jantar? 110 / 150 cm".
  3. Guarde os dois no destaque Antique.


STATUS DO WHATSAPP
----------------------------------------
${wa}
----------------------------------------

Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha.
`);
fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `BUFFET ANTIQUE · POST NO INSTAGRAM
Marcenaria Moraes · ${hoje}

previa-do-post.html  · o post inteiro, com botão para copiar a legenda
LEGENDA-E-TEXTOS.txt · legenda, textos alternativos, stories e status do WhatsApp
1-carrossel-para-postar/ · os itens do post na ordem (1080 × 1350); o vídeo já tem música
2-imagens-alta-resolucao/ · as mesmas imagens em 2160 × 2700
3-outros-videos/     · Reels vertical 9:16 (nogueira) e horizontal 16:9 (jatobá), com música
4-ficha-do-produto/  · ficha completa, com botão para escolher 150 ou 110 cm
`);
fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `BUFFET ANTIQUE - Marcenaria Moraes
Atualizado em ${hoje}

Buffet de sala de jantar em madeira maciça da linha Antique, em duas medidas:
  150 cm · ${mA} · 3 gavetas e 3 portas · ~${IA.kg} kg · ${IA.prazo}
  110 cm · ${mB} · 2 gavetas e 2 portas · ~${IB.kg} kg · ${IB.prazo}
Portas almofadadas com dobradiças rústicas de ferro e argola, gavetas com puxador concha, prateleira em
cada armário, montante de 5 cm entre as portas e pés de 10 cm. Madeira: nogueira (principal) ou jatobá.

${slug}.html
  Ficha completa, com botão no alto para escolher 150 ou 110 cm:
  - Custo e preço sugerido (USO INTERNO, não vai no post):
      150 cm: ~R$ ${IA.cost.matTxt} de material · R$ ${IA.cost.priceTxt} (jatobá R$ ${IA.cost.priceJatTxt})
      110 cm: ~R$ ${IB.cost.matTxt} de material · R$ ${IB.cost.priceTxt} (jatobá R$ ${IB.cost.priceJatTxt})
  - Vista 3D com raio-X dos parafusos, vistas cotadas, lista de corte, ligações, montagem e compras

${slug}-video-vertical-instagram.mp4 · Reels 9:16 (34 s), nogueira, com música
${slug}-video-horizontal-jatoba.mp4  · comercial 16:9 (34 s), jatobá, com música

Feito em série: as portas e as gavetas são iguais entre si. ~${IB.cost.hours} a ${IA.cost.hours} h de trabalho.
Os scripts (bf-model.mjs e os outros) estão em Rack Antique/arquivos-de-origem, junto com o motor da linha inteira.
`);
let p = fs.readFileSync('previa-template.html', 'utf8');
const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
rp('<title>Post Cristaleira Antique</title>', '<title>Post Buffet Antique</title>');
rp('Post de lançamento da Cristaleira Antique', 'Post de lançamento do Buffet Antique');
rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeiras.png" alt="Madeiras"><div class="cap"><b>5</b><span>Madeiras</span>');
rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 34 s · as duas medidas</span>');
rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de 3 a 5 semanas');
p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
p = p.replace(/"Qual você escolheria\? [^"]*"/, '"Qual cabe na sua sala de jantar? 110 / 150 cm"');
p = p.replace('"Ficou com dúvida sobre a Cristaleira Antique?', '"Ficou com dúvida sobre o Buffet Antique?');
p = p.replace('<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>',
  '<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>\n      <div class="item"><img src="1-carrossel-para-postar/7-por-dentro.png" alt="Por dentro"><div class="cap"><b>7</b><span>Opcional · por dentro</span></div></div>');
if (p.includes('Cristaleira')) console.log('AVISO: sobrou "Cristaleira" na prévia');
fs.writeFileSync(`${out}/previa-do-post.html`, p);
console.log('ok');
