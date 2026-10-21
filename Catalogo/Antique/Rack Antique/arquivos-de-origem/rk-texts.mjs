// Legenda, LEIA-ME e prévia do post do Rack Antique (as duas medidas juntas): node rk-texts.mjs
import fs from 'node:fs';
import { make } from './rk-model.mjs';
import { info } from './rk-info.mjs';
const A = make(180), B = make(140), IA = info(A), IB = info(B), out = '../out/rk', slug = 'Rack-Antique', hoje = '10/10/2026';
fs.mkdirSync(out, { recursive: true });
const mA = `${A.L} × ${A.H} × ${A.D} cm`, mB = `${B.L} × ${B.H} × ${B.D} cm`;
const legenda = `Rack Antique 🌳 · linha Antique

O rack que faltava na sala: madeira maciça, portas almofadadas e ferragens de época em ferro, para combinar com a Cristaleira Antique.

🔹 180 cm · ${mA} · TV de até 75"
🔹 140 cm · ${mB} · TV de até 55"

✔️ Madeira maciça escura: cambará nogueira ou jatobá (madeira de lei)
✔️ Dobradiças borboleta, tramelas e puxador concha de ferro preto
✔️ Nicho para os aparelhos, gaveta para os controles e furo para os fios
✔️ Pés de 10 cm: dá para limpar embaixo

📦 Sob encomenda, feito à mão em Uberlândia. Pronto em 3 a 4 semanas.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver as medidas 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhaantique #rack #rackdesala #rackdemadeira #racktv #madeiramacica #jatoba #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #decoracaorustica #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'Dois racks de madeira maciça escura, de 140 e 180 cm, com portas almofadadas, nicho aberto no meio e dobradiças de ferro preto, título Rack Antique.',
  'Vídeo do rack sendo montado, com medidas, portas e gaveta abrindo, detalhe das ferragens e as duas madeiras.',
  'Detalhe do rack com o topo de beiral e a dobradiça borboleta de ferro.',
  'Desenho das duas frentes com as medidas: 180 e 140 cm de largura, 55 de altura e 42 de fundo.',
  'As duas madeiras lado a lado: nogueira e jatobá.',
  'Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em 3 a 4 semanas.',
  'O rack aberto: dois armários com prateleira, nicho para os aparelhos e gaveta rasa.',
];
const wa = `Novidade da linha Antique 🌳
Rack Antique: madeira maciça, portas almofadadas e ferragens de época, em 180 cm (TV até 75") ou 140 cm (TV até 55"), nogueira ou jatobá.
Feito sob encomenda. Me chama aqui para pedir seu orçamento!`;
fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `RACK ANTIQUE · POST (180 E 140 CM) · LINHA ANTIQUE
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
  2. Enquete: "Qual cabe na sua sala? 140 / 180 cm".
  3. Guarde os dois no destaque Antique.


STATUS DO WHATSAPP
----------------------------------------
${wa}
----------------------------------------

Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha.
`);
fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `RACK ANTIQUE · POST NO INSTAGRAM
Marcenaria Moraes · ${hoje}

previa-do-post.html  · o post inteiro, com botão para copiar a legenda
LEGENDA-E-TEXTOS.txt · legenda, textos alternativos, stories e status do WhatsApp
1-carrossel-para-postar/ · os itens do post na ordem (1080 × 1350); o vídeo já tem música
2-imagens-alta-resolucao/ · as mesmas imagens em 2160 × 2700
3-outros-videos/     · Reels vertical 9:16 (nogueira) e horizontal 16:9 (jatobá), com música
4-ficha-do-produto/  · ficha completa, com botão para escolher 180 ou 140 cm
`);
fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `RACK ANTIQUE - Marcenaria Moraes
Atualizado em ${hoje}

Rack de sala de madeira maciça da linha Antique, em duas medidas:
  180 cm · ${mA} · TV de até 75" · ~${IA.kg} kg
  140 cm · ${mB} · TV de até 55" · ~${IB.kg} kg
Portas almofadadas com dobradiça borboleta e tramela de ferro, nicho aberto com prateleira, gaveta rasa
para os controles, furo para os fios e pés de 10 cm. Madeira: nogueira (principal) ou jatobá.

${slug}.html
  Ficha completa, com botão no alto para escolher 180 ou 140 cm:
  - Custo e preço sugerido (USO INTERNO, não vai no post):
      180 cm: ~R$ ${IA.cost.matTxt} de material · R$ ${IA.cost.priceTxt} (jatobá R$ ${IA.cost.priceJatTxt})
      140 cm: ~R$ ${IB.cost.matTxt} de material · R$ ${IB.cost.priceTxt} (jatobá R$ ${IB.cost.priceJatTxt})
  - Vista 3D com raio-X dos parafusos, vistas cotadas, lista de corte, ligações, montagem e compras

${slug}-video-vertical-instagram.mp4 · Reels 9:16 (34 s), nogueira, com música
${slug}-video-horizontal-jatoba.mp4  · comercial 16:9 (34 s), jatobá, com música

É a peça mais fácil da linha: tábuas curtas, 2 portas e 1 gaveta, ~25 a 28 h de trabalho.
A pasta "arquivos-de-origem" tem o modelo 3D (rk-model.mjs) e os scripts, os mesmos da linha inteira.
`);
let p = fs.readFileSync('previa-template.html', 'utf8');
const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
rp('<title>Post Cristaleira Antique</title>', '<title>Post Rack Antique</title>');
rp('Post de lançamento da Cristaleira Antique', 'Post de lançamento do Rack Antique');
rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeiras.png" alt="Madeiras"><div class="cap"><b>5</b><span>Madeiras</span>');
rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 34 s · as duas medidas</span>');
rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de 3 a 4 semanas');
p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
p = p.replace(/"Qual você escolheria\? [^"]*"/, '"Qual cabe na sua sala? 140 / 180 cm"');
p = p.replace('"Ficou com dúvida sobre a Cristaleira Antique?', '"Ficou com dúvida sobre o Rack Antique?');
p = p.replace('<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>',
  '<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>\n      <div class="item"><img src="1-carrossel-para-postar/7-por-dentro.png" alt="Por dentro"><div class="cap"><b>7</b><span>Opcional · por dentro</span></div></div>');
if (p.includes('Cristaleira')) console.log('AVISO: sobrou "Cristaleira" na prévia');
fs.writeFileSync(`${out}/previa-do-post.html`, p);
console.log('ok');
