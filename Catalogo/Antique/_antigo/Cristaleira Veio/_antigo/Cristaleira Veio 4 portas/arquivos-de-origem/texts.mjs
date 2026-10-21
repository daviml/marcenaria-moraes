// Legenda, LEIA-ME e prévia do post de cada versão: node texts.mjs 4 (salva em ../out/v4/)
import fs from 'node:fs';
import { make } from './model.mjs';
import { info } from './info.mjs';
const v = +(process.argv[2] || 1), M = make(v), I = info(M), out = `../out/v${v}`;
fs.mkdirSync(out, { recursive: true });
const { name, slug, L, H } = M, med = `${H} × ${L} × 40 cm`, prazo = I.prazo;
const hoje = '10/10/2026';

const intro = {
  1: 'Madeira maciça e vidro nos três lados, para mostrar louças, taças e lembranças de família de qualquer canto da sala.',
  2: 'Madeira maciça e vidro nos três lados, agora com duas portas: mais espaço para louças, taças e lembranças de família.',
  4: 'A maior da linha Veio: 1,60 m de madeira maciça e vidro nos três lados, para a parede principal da sala de jantar.',
}[v];
const item3 = { 1: 'Porta e laterais de vidro, 3 prateleiras e gaveta', 2: 'Duas portas e laterais de vidro, 3 prateleiras e gaveta de 80 cm', 4: 'Quatro portas e laterais de vidro, 6 prateleiras e 2 gavetas' }[v];
const item4 = { 1: 'Dobradiças borboleta, tramela e puxador de ferro preto', 2: 'Dobradiças borboleta, tramela e puxadores de ferro preto', 4: 'Dobradiças borboleta, tramelas e puxadores de ferro preto' }[v];
const tags = '#marcenariamoraes #cristaleira ' + { 1: '', 2: '#cristaleira2portas ', 4: '#cristaleira4portas ' }[v] + '#cristaleirarustica #cristaleirademadeira #madeiramacica #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #decoracaorustica #uberlandia #udi #uberlandiamg #triangulomineiro';
const legenda = `${name} 🌳

${intro}

✔️ ${med}
✔️ Madeira maciça escura, com óleo de linhaça e cera de abelha
✔️ ${item3}
✔️ ${item4}
✔️ Duas madeiras: cambará nogueira ou jatobá (madeira de lei)

📦 Sob encomenda, pronta em ${prazo}. Entrega em Uberlândia.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio) e peça seu orçamento.

Arraste para ver as medidas e os acabamentos 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

${tags}`;
const portaTxt = { 1: 'porta e laterais de vidro', 2: 'duas portas e laterais de vidro', 4: 'quatro portas e laterais de vidro' }[v];
const alt = [
  `Cristaleira de madeira maciça escura, cor nogueira, com ${portaTxt} e dobradiças de ferro preto, título ${name}, feita sob encomenda em Uberlândia.`,
  `Vídeo da cristaleira sendo montada e girando, com medidas, detalhe das ferragens, ${v === 1 ? 'porta e gaveta abrindo' : 'portas e gavetas abrindo'} e os dois acabamentos.`,
  'Detalhe do topo com friso, da dobradiça borboleta e dos vidros da porta e da lateral.',
  `Desenho com as medidas: ${H} cm de altura, ${L} de largura e 40 de profundidade.`,
  'As duas madeiras lado a lado: nogueira e jatobá.',
  `Como encomendar: chamar no direct ou WhatsApp para orçamento, sinal de 50% e entrega em ${prazo}.`,
];
const wa = `Lançamento da Marcenaria Moraes 🌳
${name}: madeira maciça e vidro nos três lados, ${med}, nogueira ou jatobá.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!`;
const vReels = `${slug}-reels-vertical-9x16.mp4`, vHor = `${slug}-horizontal-jatoba.mp4`;
const upd = v === 1 ? '\nATUALIZADO EM ' + hoje + ': a cristaleira passou a ter 2 m de altura (era 1,80 m),\npara ficar igual às versões de 2 e 4 portas. A versão antiga está em "versao-anterior-180cm".\n' : '';

fs.writeFileSync(`${out}/LEGENDA-E-TEXTOS.txt`, `${name.toUpperCase()} · POST DE LANÇAMENTO
========================================
${upd}
LEGENDA (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (pasta 1-carrossel-para-postar, formato 4:5)
  1 · 1-capa.png
  2 · 2-video.mp4  (já tem música)
  3 · 3-detalhes.png
  4 · 4-medidas.png
  5 · 5-acabamentos.png
  6 · 6-como-encomendar.png


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


COMO PUBLICAR
  1. Novo post → selecione os 6 itens na ordem acima (capa primeiro). Mantenha o formato 4:5.
  2. O vídeo já tem música (Wind Leaves, do Mixkit, livre para uso comercial). Não adicione outra no Instagram.
  3. Cole a legenda e os textos alternativos.
  4. Em "Local", marque Uberlândia.
  5. Poste entre 18h e 21h, de terça a quinta.
  6. Na primeira hora, responda todo comentário e direct. Quem perguntar o valor recebe o orçamento no direct.
  ${v === 1 ? '' : `7. Não poste no mesmo dia de outra cristaleira: deixe pelo menos 3 dias entre um lançamento e outro.\n`}

STORIES NO MESMO DIA
  1. Vídeo vertical (3-outros-videos/${vReels}) com a figurinha "Link" para o WhatsApp: "Peça seu orçamento".
  2. Compartilhe o post no story: "Post novo 👉".
  3. Enquete com o slide 5: "Qual você escolheria? Nogueira / Jatobá".
  4. No dia seguinte, caixa de perguntas: "Ficou com dúvida sobre a ${name}? Pergunta aqui".
${v === 1 ? '' : `  5. Depois dos três lançamentos, um story com as três lado a lado: "1, 2 ou 4 portas: qual cabe na sua sala?"\n`}

STATUS DO WHATSAPP (junto com o vídeo vertical)
----------------------------------------
${wa}
----------------------------------------


CONFIRA ANTES DE POSTAR
  - Prazo de ${prazo} (slide 6 e legenda)
  - Nenhum slide nem a legenda tem preço. O preço sugerido (uso interno) está na ficha do produto
`);

fs.writeFileSync(`${out}/LEIA-ME-post.txt`, `${name.toUpperCase()} · POST DE LANÇAMENTO NO INSTAGRAM
Marcenaria Moraes · ${hoje}

previa-do-post.html
  Abra com dois cliques para ver o post inteiro, com botões para copiar a legenda.

LEGENDA-E-TEXTOS.txt
  Legenda, hashtags, ordem do carrossel, textos alternativos, stories e status do WhatsApp.

1-carrossel-para-postar/
  Os 6 itens do post, na ordem, prontos para o Instagram (1080 × 1350, formato 4:5).
  O vídeo 2-video.mp4 é a versão 4:5 feita para o carrossel, já com música.
  Não use o vídeo vertical no carrossel: o Instagram corta ele.

2-imagens-alta-resolucao/
  As mesmas 5 imagens em 2160 × 2700 (o dobro), para impressão, site ou WhatsApp.

3-outros-videos/
  Reels vertical 9:16 em nogueira (stories, Reels e status) e o comercial horizontal 16:9 em jatobá.
  Todos com música (Wind Leaves, Mixkit: uso comercial liberado, sem precisar dar crédito).

4-ficha-do-produto/
  Ficha completa da ${name}: 3D com medidas e raio-X dos parafusos, vistas cotadas,
  lista de corte, vidros, ligações, montagem e compras.

Nenhuma imagem nem a legenda tem preço: no post a cristaleira aparece como "valor sob consulta".
`);

const desc = {
  1: '1 porta de vidro, laterais de vidro, 3 prateleiras, gaveta embaixo, chapéu com friso e ferragens de ferro preto.',
  2: '2 portas de vidro que abrem ao meio, laterais de vidro, 3 prateleiras de 85 cm, gaveta de 80 cm\ncom dois puxadores, chapéu com friso e ferragens de ferro preto.',
  4: '4 portas de vidro em dois pares, coluna central, laterais de vidro, 6 prateleiras, 2 gavetas com\ndois puxadores cada, chapéu com friso e ferragens de ferro preto (como a foto de referência, 2 m × 1,60 m).',
}[v];
fs.writeFileSync(`${out}/LEIA-ME-produto.txt`, `${name.toUpperCase()} - Marcenaria Moraes
Atualizado em ${hoje}
${upd}
Linha Cristaleira Veio: 1, 2 e 4 portas, todas com 2 m de altura e 40 cm de fundo, com as mesmas
laterais, os mesmos vidros das laterais e as mesmas alturas de nicho. Esta é a de ${M.short}: ${med}.
${desc}

${slug}.html
  Ficha completa do produto. Abra com dois cliques (Chrome ou Edge).
  - O produto: ficha técnica, custo (~R$ ${I.cost.matTxt} de material) e preço sugerido (R$ ${I.cost.priceTxt}),
    só para USO INTERNO e fora do post. Acabamentos, texto de venda (botão Copiar) e cuidados para o cliente
  - Vista 3D: toque numa peça para ver as medidas dela; botões Nogueira / Jatobá,
    "${v === 1 ? 'Porta e gaveta abertas' : 'Portas e gavetas abertas'}" e "Ver parafusos (raio-X)"
  - Vistas cotadas (frente, lateral, porta e corte) + tabela de conferência das medidas
  - Lista de corte, vidros e baguetes, como cada peça se prende (cavilha 8 × 40,
    parafusos 4 × 30 e 4 × 40, furos ovais), como esconder os parafusos,
    ordem de montagem e o que comprar

${slug}-video-vertical-instagram.mp4
  Reels 9:16 (35 s), acabamento nogueira, com música.

${slug}-video-horizontal-jatoba.mp4
  Comercial 16:9 (35 s), em jatobá, com música.

A pasta "arquivos-de-origem" (ao lado) tem o modelo 3D e os scripts que geraram tudo. São os mesmos
nas três cristaleiras: model.mjs monta as peças da versão 1, 2 ou 4 portas e info.mjs tem os textos e as contas.
Para rodar: npm install, depois (trocando 4 pela versão):
  node stills.mjs 4 · node posts.mjs 4 · node build-ficha.mjs 4 saida.html · node texts.mjs 4
  V=4 node rendervideo.mjs 916 nog saida.mp4 musica.mp3   (precisa do Chrome e do ffmpeg instalados)
`);

// prévia do post
let p = fs.readFileSync('previa-template.html', 'utf8');
const rp = (a, b) => { if (!p.includes(a)) throw new Error('prévia: ' + a.slice(0, 40)); p = p.split(a).join(b); };
rp('<title>Post Cristaleira Veio</title>', `<title>Post ${name}</title>`);
rp('Post de lançamento da Cristaleira Veio', 'Post de lançamento da ' + name);
rp('Confira o prazo de 4 a 5 semanas', 'Confira o prazo de ' + prazo);
p = p.replace(/<pre class="copy" id="cap">[\s\S]*?<\/pre>/, `<pre class="copy" id="cap">${legenda}</pre>`);
p = p.replace(/<pre class="copy" id="wa">[\s\S]*?<\/pre>/, `<pre class="copy" id="wa">${wa}</pre>`);
p = p.replace(/<dl class="alt">[\s\S]*?<\/dl>/, `<dl class="alt">\n${alt.map((a, i) => `        <dt>${i + 1}</dt><dd>${a}</dd>`).join('\n')}\n      </dl>`);
rp('"Ficou com dúvida sobre a Cristaleira Veio?', `"Ficou com dúvida sobre a ${name}?`);
fs.writeFileSync(`${out}/previa-do-post.html`, p);
console.log('ok', v);
