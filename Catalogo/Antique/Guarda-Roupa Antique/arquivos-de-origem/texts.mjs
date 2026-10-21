// Legenda, LEIA-ME e prévia do post do Guarda-Roupa Antique (as duas versões juntas): node texts.mjs
import fs from 'node:fs';
import { make } from './model.mjs';
import { info } from './info.mjs';
const M2 = make(2), M4 = make(4), I2 = info(M2), I4 = info(M4), out = '../out/gr';
fs.mkdirSync(out, { recursive: true });
const hoje = '10/10/2026', slug = 'Guarda-Roupa-Antique';
const m2 = `${M2.H} × ${M2.L} × ${M2.D} cm`, m4 = `${M4.H} × ${M4.L} × ${M4.D} cm`;

const legenda = `Guarda-Roupa Antique 🌳 · linha Antique

Madeira maciça, portas almofadadas e ferragens de ferro, para durar a vida inteira. Em dois tamanhos:

🔹 2 portas · ${m2}
Prateleiras de um lado, cabideiro com maleiro do outro e 3 gavetas.

🔹 4 portas · ${m4}
Cabideiro inteiro, 3 prateleiras, 2 maleiros e 6 gavetas.

✔️ Madeira maciça escura: cambará nogueira ou jatobá (madeira de lei)
✔️ Óleo de linhaça e cera de abelha
✔️ 58 cm de fundo: cabide de frente, com 98 cm para pendurar
✔️ Ferragens de época em ferro: dobradiças rústicas e puxadores argola, com taramelas de madeira
✔️ Base com sapatas recortadas e chapéu com friso

📦 Sob encomenda, feito à mão em Uberlândia. Prazo de 6 a 10 semanas, conforme o modelo.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio) e diga qual tamanho cabe no seu quarto.

Arraste para ver os dois 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhaantique #guardaroupa #guardaroupademadeira #guardarouparustico #guardaroupa2portas #guardaroupa4portas #madeiramacica #jatoba #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #quartorustico #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'Os dois guarda-roupas de madeira maciça escura lado a lado, de 2 e de 4 portas, com portas almofadadas, gavetas embaixo e ferragens de ferro, título Guarda-Roupa Antique, feito sob encomenda em Uberlândia.',
  'Vídeo do guarda-roupa de 2 portas sendo montado, com medidas, portas e gavetas abrindo e o detalhe das ferragens; depois o de 4 portas e as duas madeiras, nogueira e jatobá.',
  'Detalhe do topo com friso, da dobradiça de ferro e da porta almofadada.',
  `Desenho das duas frentes com as medidas: 2 portas com ${M2.L} cm e 4 portas com ${M4.L} cm de largura, as duas com 200 cm de altura e 58 de fundo.`,
  'As duas madeiras lado a lado: nogueira e jatobá.',
  'Como encomendar: chamar no direct ou WhatsApp para orçamento, sinal de 50% e entrega em 6 a 10 semanas, conforme o modelo.',
];
const wa = `Novidade da Marcenaria Moraes 🌳
Guarda-Roupa Antique: madeira maciça e portas almofadadas, em 2 portas (${m2}) ou 4 portas (${m4}), nogueira ou jatobá.
Feito sob encomenda. Me chama aqui para pedir seu orçamento!`;

fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `GUARDA-ROUPA ANTIQUE · POST DE LANÇAMENTO (2 E 4 PORTAS)
========================================

LEGENDA (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (pasta 1-carrossel-para-postar, formato 4:5)
  1 · 1-capa.png
  2 · 2-video.mp4  (já tem música; mostra os dois modelos)
  3 · 3-detalhes.png
  4 · 4-medidas.png
  5 · 5-madeiras.png
  6 · 6-como-encomendar.png
  Opcional: 7-por-dentro-2-portas.png e 8-por-dentro-4-portas.png (interior aberto)


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


COMO PUBLICAR
  1. Novo post → selecione os itens na ordem acima (capa primeiro). Mantenha o formato 4:5.
  2. O vídeo já tem música (Wind Leaves, do Mixkit, livre para uso comercial). Não adicione outra no Instagram.
  3. Cole a legenda e os textos alternativos.
  4. Em "Local", marque Uberlândia.
  5. Poste entre 18h e 21h, de terça a quinta.
  6. Na primeira hora, responda todo comentário e direct. Quem perguntar o valor recebe o orçamento no direct.


STORIES NO MESMO DIA
  1. Vídeo vertical (3-outros-videos/${slug}-reels-vertical-9x16.mp4) com a figurinha "Link" para o WhatsApp: "Peça seu orçamento".
  2. Compartilhe o post no story: "Post novo 👉".
  3. Enquete: "Qual cabe no seu quarto? 2 portas / 4 portas".
  4. No dia seguinte, enquete com o slide 5: "Nogueira ou jatobá?".


STATUS DO WHATSAPP (junto com o vídeo vertical)
----------------------------------------
${wa}
----------------------------------------


CONFIRA ANTES DE POSTAR
  - Prazo de 6 a 10 semanas (slide 6 e legenda): 2 portas 6 a 8, 4 portas 8 a 10
  - Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha do produto
`);

fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `GUARDA-ROUPA ANTIQUE · POST DE LANÇAMENTO NO INSTAGRAM
Marcenaria Moraes · ${hoje}

Um post só para os dois modelos (2 e 4 portas).

previa-do-post.html
  Abra com dois cliques para ver o post inteiro, com botões para copiar a legenda.

LEGENDA-E-TEXTOS.txt
  Legenda, hashtags, ordem do carrossel, textos alternativos, stories e status do WhatsApp.

1-carrossel-para-postar/
  Os itens do post, na ordem, prontos para o Instagram (1080 × 1350, formato 4:5).
  O vídeo 2-video.mp4 é a versão 4:5 feita para o carrossel, já com música.
  7 e 8 (interior aberto) são opcionais.

2-imagens-alta-resolucao/
  As mesmas imagens em 2160 × 2700 (o dobro), para impressão, site ou WhatsApp.

3-outros-videos/
  Reels vertical 9:16 em nogueira e comercial horizontal 16:9 em jatobá. Os dois com música
  (Wind Leaves, Mixkit: uso comercial liberado, sem precisar dar crédito).

4-ficha-do-produto/
  Ficha completa, com botão para escolher 2 ou 4 portas.

Nenhuma imagem nem a legenda tem preço: no post o guarda-roupa aparece como "valor sob consulta".
`);

fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `GUARDA-ROUPA ANTIQUE - Marcenaria Moraes
Atualizado em ${hoje}

Guarda-roupa rústico de madeira maciça, baseado na foto de referência (2 m × 1,30 m), em duas versões:
  2 portas · ${m2} · prateleiras + cabideiro com maleiro · 3 gavetas · ~${I2.kg} kg
  4 portas · ${m4} · cabideiro inteiro + prateleiras · 2 maleiros · 6 gavetas · ~${I4.kg} kg
Madeira: nogueira (cambará tingido, principal) ou jatobá (madeira de lei).

${slug}.html
  Ficha completa, com botão no alto para escolher o modelo (2 ou 4 portas). A ficha inteira muda:
  - O produto: ficha técnica, custo e preço sugerido (USO INTERNO, não vai no post):
      2 portas: ~R$ ${I2.cost.matTxt} de material · R$ ${I2.cost.priceTxt} (jatobá R$ ${I2.cost.priceJatTxt})
      4 portas: ~R$ ${I4.cost.matTxt} de material · R$ ${I4.cost.priceTxt} (jatobá R$ ${I4.cost.priceJatTxt})
  - Vista 3D: toque numa peça para ver as medidas; botões Nogueira / Jatobá, "Portas e gavetas abertas"
    e "Ver parafusos (raio-X)"
  - Vistas cotadas, lista de corte, como cada peça se prende, ordem de montagem e o que comprar

${slug}-video-vertical-instagram.mp4
  Reels 9:16 (38 s), nogueira, com música. Mostra o 2 portas e depois o 4 portas.

${slug}-video-horizontal-jatoba.mp4
  Comercial 16:9 (38 s), jatobá, com música.

A pasta "arquivos-de-origem" (ao lado) tem o modelo 3D (model.mjs, as duas versões) e os scripts.
Para rodar: npm install, depois node stills.mjs · node posts.mjs · node build-ficha.mjs saida.html ·
node texts.mjs · node rendervideo.mjs 916 nog saida.mp4 musica.mp3 (precisa do Chrome e do ffmpeg).
`);

// prévia do post
let p = fs.readFileSync('previa-template.html', 'utf8');
const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
rp('<title>Post Cristaleira Antique</title>', '<title>Post Guarda-Roupa Antique</title>');
rp('Post de lançamento da Cristaleira Antique', 'Post de lançamento do Guarda-Roupa Antique');
rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeiras.png" alt="Madeiras"><div class="cap"><b>5</b><span>Madeiras</span>');
rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 38 s · os dois modelos</span>');
rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de 6 a 10 semanas');
p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
p = p.replace(/"Qual você escolheria\? [^"]*"/, '"Qual cabe no seu quarto? 2 portas / 4 portas"');
p = p.replace('"Ficou com dúvida sobre a Cristaleira Antique?', '"Ficou com dúvida sobre o Guarda-Roupa Antique?');
p = p.replace('<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>',
  '<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>\n      <div class="item"><img src="1-carrossel-para-postar/7-por-dentro-2-portas.png" alt="Por dentro, 2 portas"><div class="cap"><b>7</b><span>Opcional · por dentro, 2 portas</span></div></div>\n      <div class="item"><img src="1-carrossel-para-postar/8-por-dentro-4-portas.png" alt="Por dentro, 4 portas"><div class="cap"><b>8</b><span>Opcional · por dentro, 4 portas</span></div></div>');
if (p.includes('Cristaleira')) console.log('AVISO: sobrou "Cristaleira" na prévia');
fs.writeFileSync(`${out}/previa-do-post.html`, p);
console.log('ok');
