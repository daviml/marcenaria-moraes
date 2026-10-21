// Legenda, LEIA-ME e prévia do post da Cristaleira Antique (as três versões juntas): node texts.mjs
import fs from 'node:fs';
import { make } from './model.mjs';
import { info } from './info.mjs';
const VS = [1, 2, 4], MS = {}, IS = {};
VS.forEach(v => { MS[v] = make(v); IS[v] = info(MS[v]); });
const out = '../out/cvu', hoje = '10/10/2026', slug = 'Cristaleira-Antique';
fs.mkdirSync(out, { recursive: true });
const med = v => `${MS[v].H} × ${MS[v].L} × ${MS[v].D} cm`;

const legenda = `Cristaleira Antique 🌳 · linha Antique

Madeira maciça e vidro nos três lados, em três tamanhos. Todas com 2 metros de altura, para combinar entre si ou com a sua sala.

🔹 1 porta · ${med(1)}
Cabe num canto da sala, da copa ou do corredor.

🔹 2 portas · ${med(2)}
Menos de 1 metro de parede, com gaveta larga.

🔹 4 portas · ${med(4)}
A vitrine da sala de jantar, com 6 prateleiras e 2 gavetas.

✔️ Madeira maciça escura: cambará nogueira ou jatobá (madeira de lei)
✔️ Óleo de linhaça e cera de abelha
✔️ Portas e laterais de vidro, prateleiras soltas
✔️ Ferragens de época em ferro preto: dobradiças borboleta, tramela e puxador concha

📦 Sob encomenda, feitas à mão em Uberlândia. Prazo de 4 a 8 semanas, conforme o modelo.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio) e diga qual tamanho cabe na sua casa.

Arraste para ver as três 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhaantique #cristaleira #cristaleirarustica #cristaleirademadeira #cristaleira2portas #cristaleira4portas #madeiramacica #jatoba #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #decoracaorustica #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'As três cristaleiras de madeira maciça escura lado a lado, de 1, 2 e 4 portas, com portas e laterais de vidro e dobradiças de ferro preto, título Cristaleira Antique, feita sob encomenda em Uberlândia.',
  'Vídeo da cristaleira de 4 portas sendo montada, com medidas, detalhe das ferragens e portas abrindo; depois a de 2 portas, a de 1 porta e as três juntas nas duas madeiras, nogueira e jatobá.',
  'Detalhe do topo com friso, da dobradiça borboleta e dos vidros da porta e da lateral.',
  `Desenho das três frentes com as medidas: 50, 90 e 160 cm de largura, todas com 200 cm de altura e 40 de fundo.`,
  'As duas madeiras lado a lado: nogueira e jatobá.',
  'Como encomendar: chamar no direct ou WhatsApp para orçamento, sinal de 50% e entrega em 4 a 8 semanas, conforme o modelo.',
  'A cristaleira de 4 portas com as portas e as gavetas abertas, mostrando as prateleiras.',
];
const wa = `Lançamento da Marcenaria Moraes 🌳
Cristaleira Antique: madeira maciça e vidro nos três lados, em 1, 2 ou 4 portas (50, 90 ou 160 cm de largura, 2 m de altura), nogueira ou jatobá.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!`;

fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `CRISTALEIRA ANTIQUE · POST (1, 2 E 4 PORTAS) · LINHA ANTIQUE
========================================

LEGENDA (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (pasta 1-carrossel-para-postar, formato 4:5)
  1 · 1-capa.png
  2 · 2-video.mp4  (já tem música; mostra as três)
  3 · 3-detalhes.png
  4 · 4-medidas.png
  5 · 5-madeiras.png
  6 · 6-como-encomendar.png
  7 · 7-abre-e-guarda.png  (opcional)


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
  3. Enquete: "Qual cabe na sua sala? 1, 2 ou 4 portas" (use a enquete de 3 opções do Instagram).
  4. No dia seguinte, enquete com o slide 5: "Nogueira ou jatobá?".


STATUS DO WHATSAPP (junto com o vídeo vertical)
----------------------------------------
${wa}
----------------------------------------


CONFIRA ANTES DE POSTAR
  - Prazo de 4 a 8 semanas (slide 6 e legenda): 1 porta ${IS[1].prazo}, 2 portas ${IS[2].prazo}, 4 portas ${IS[4].prazo}
  - Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha do produto
`);

fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `CRISTALEIRA ANTIQUE · POST DA LINHA NO INSTAGRAM
Marcenaria Moraes · ${hoje}

Um post só para as três cristaleiras (1, 2 e 4 portas).

previa-do-post.html
  Abra com dois cliques para ver o post inteiro, com botões para copiar a legenda.

LEGENDA-E-TEXTOS.txt
  Legenda, hashtags, ordem do carrossel, textos alternativos, stories e status do WhatsApp.

1-carrossel-para-postar/
  Os itens do post, na ordem, prontos para o Instagram (1080 × 1350, formato 4:5).
  O vídeo 2-video.mp4 é a versão 4:5 feita para o carrossel, já com música. O 7 é opcional.

2-imagens-alta-resolucao/
  As mesmas imagens em 2160 × 2700 (o dobro), para impressão, site ou WhatsApp.

3-outros-videos/
  Reels vertical 9:16 em nogueira e comercial horizontal 16:9 em jatobá. Os dois com música
  (Wind Leaves, Mixkit: uso comercial liberado, sem precisar dar crédito).

4-ficha-do-produto/
  Ficha completa, com botão para escolher 1, 2 ou 4 portas.

Nenhuma imagem nem a legenda tem preço: no post a cristaleira aparece como "valor sob consulta".
`);

fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `CRISTALEIRA ANTIQUE - Marcenaria Moraes
Atualizado em ${hoje}

Linha de cristaleiras rústicas de madeira maciça com vidro nos três lados, em três larguras. Todas com
2 m de altura e 40 de fundo, com as mesmas laterais, vidros das laterais e alturas de nicho:
${VS.map(v => `  ${MS[v].short.padEnd(8)} · ${med(v)} · ~${Math.round(MS[v].stats.kg)} kg · ${IS[v].prazo}`).join('\n')}
Madeira: nogueira (cambará tingido, principal) ou jatobá (madeira de lei).

${slug}.html
  Ficha completa, com botão no alto para escolher o modelo (1, 2 ou 4 portas). A ficha inteira muda:
  - O produto: ficha técnica, custo e preço sugerido (USO INTERNO, não vai no post):
${VS.map(v => `      ${MS[v].short}: ~R$ ${IS[v].cost.matTxt} de material · R$ ${IS[v].cost.priceTxt} (jatobá R$ ${IS[v].cost.priceJatTxt})`).join('\n')}
  - Vista 3D: toque numa peça para ver as medidas; botões Nogueira / Jatobá, portas abertas e raio-X
  - Vistas cotadas, lista de corte, vidros, como cada peça se prende, montagem e o que comprar

${slug}-video-vertical-instagram.mp4
  Reels 9:16 (38 s), nogueira, com música: a de 4 portas montando, depois a de 2, a de 1 e as três juntas.

${slug}-video-horizontal-jatoba.mp4
  Comercial 16:9 (38 s), jatobá, com música.

A pasta "arquivos-de-origem" (ao lado) tem o modelo 3D (model.mjs, as três versões) e os scripts.
Para rodar: npm install, depois node stills.mjs · node posts.mjs · node build-ficha.mjs saida.html ·
node texts.mjs · node rendervideo.mjs 916 nog saida.mp4 musica.mp3 (precisa do Chrome e do ffmpeg).

A pasta "_antigo" tem as pastas separadas de antes (uma por cristaleira) e a versão de 1,80 m da 1 porta.
`);

// prévia do post
let p = fs.readFileSync('previa-template.html', 'utf8');
const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
rp('Post de lançamento da Cristaleira Antique', 'Post da linha Cristaleira Antique (1, 2 e 4 portas)');
rp('5-acabamentos.png" alt="Acabamentos"><div class="cap"><b>5</b><span>Acabamentos</span>', '5-madeiras.png" alt="Madeiras"><div class="cap"><b>5</b><span>Madeiras</span>');
rp('<span>Vídeo 4:5 · 35 s</span>', '<span>Vídeo 4:5 · 38 s · as três</span>');
rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de 4 a 8 semanas');
p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
p = p.replace(/"Qual você escolheria\? [^"]*"/, '"Qual cabe na sua sala? 1, 2 ou 4 portas"');
p = p.replace('<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>',
  '<div class="item"><img src="1-carrossel-para-postar/6-como-encomendar.png" alt="Como encomendar"><div class="cap"><b>6</b><span>Como encomendar</span></div></div>\n      <div class="item"><img src="1-carrossel-para-postar/7-abre-e-guarda.png" alt="Abre e guarda"><div class="cap"><b>7</b><span>Opcional · abre e guarda</span></div></div>');
fs.writeFileSync(`${out}/previa-do-post.html`, p);
console.log('ok');
