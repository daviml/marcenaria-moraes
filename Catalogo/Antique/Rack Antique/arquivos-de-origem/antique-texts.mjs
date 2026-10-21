// Textos do post, dos stories e do destaque da linha Antique: node antique-texts.mjs
import fs from 'node:fs';
const OUT = '../out/line';
fs.mkdirSync(OUT, { recursive: true });

const legenda = `Linha Antique 🌳

Nossa linha de móveis em madeira maciça escura com ferragens de época em ferro preto: dobradiças, tramelas e puxadores como nos móveis antigos. Três peças, feitas para combinar:

🔹 Cristaleira Antique
1, 2 ou 4 portas · 50, 90 ou 160 cm · 2 m de altura
Vidro nos três lados, para louças e lembranças.

🔹 Guarda-Roupa Antique
2 ou 4 portas · 130 ou 200 cm · 2 m de altura
Portas almofadadas, gavetas e cabide de frente.

🔹 Rack Antique
140 ou 180 cm · 55 de altura · TV de até 75"
Nicho para os aparelhos, gaveta e pés de 10 cm.

✔️ Madeira maciça: cambará nogueira ou jatobá (madeira de lei)
✔️ Óleo de linhaça e cera de abelha
✔️ Dobradiças borboleta e rústicas, tramelas, puxadores concha e argola
✔️ Mesmo estilo, mesmas madeiras e mesmas ferragens: sala e quarto combinando

📦 Sob encomenda, feita à mão em Uberlândia. Prazo de 3 a 10 semanas, conforme a peça.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver peça a peça 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhaantique #moveisantigos #ferragensantigas #cristaleira #guardaroupa #rack #rackdesala #madeiramacica #jatoba #feitoamao #moveisrusticos #moveisdemadeira #marcenariaartesanal #decoracaorustica #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'Uma cristaleira, um guarda-roupa e um rack de madeira maciça escura lado a lado, com ferragens de ferro preto, título Antique, nova linha da Marcenaria Moraes.',
  'Vídeo da linha Antique mostrando peça a peça: a cristaleira, o guarda-roupa e o rack, com as portas abrindo, os tamanhos de cada um e as duas madeiras.',
  'Quatro detalhes das ferragens de ferro: dobradiça borboleta, dobradiça rústica, puxador concha e puxador argola.',
  'As três cristaleiras da linha, de 1, 2 e 4 portas, com vidro nos três lados.',
  'Os dois guarda-roupas da linha, de 2 e 4 portas, com portas almofadadas e gavetas.',
  'Os dois racks da linha, de 140 e 180 cm, com portas almofadadas e nicho no meio.',
  'As duas madeiras lado a lado: nogueira e jatobá.',
  'Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em 3 a 10 semanas.',
];
const stories = [
  ['story-1-nova-linha.png', 'No dia do post, antes de tudo. Figurinha "Mencionar post"', 'Nova linha no ar! 👀'],
  ['story-2-cristaleira.png', 'Figurinha de enquete na parte de baixo', 'Enquete: "Qual cabe na sua sala? 1 / 2 / 4 portas"'],
  ['story-3-guarda-roupa.png', 'Figurinha de enquete', 'Enquete: "No seu quarto: 2 ou 4 portas?"'],
  ['story-4-rack.png', 'Figurinha de enquete', 'Enquete: "Rack de 140 ou de 180?"'],
  ['story-5-ferragens.png', 'No dia seguinte. Figurinha de pergunta', 'Caixa de perguntas: "Ficou com dúvida sobre a linha Antique?"'],
  ['story-6-orcamento.png', 'Sempre por último. Figurinha "Link" no quadro tracejado', 'Link: WhatsApp · texto "Peça seu orçamento"'],
];
fs.writeFileSync(`${OUT}/LEGENDA-E-TEXTOS.txt`, `LINHA ANTIQUE · POST, STORIES E DESTAQUE
========================================

LEGENDA DO POST (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (formato 4:5)
  1 · post/1-capa.png
  2 · video/video-linha-antique-4x5.mp4  (41 s, já tem música: peça a peça)
  3 · post/2-ferragens-de-epoca.png
  4 · post/3-cristaleira-antique.png
  5 · post/4-guarda-roupa-antique.png
  6 · post/5-rack-antique.png
  7 · post/6-madeiras.png
  8 · post/7-como-encomendar.png


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


VÍDEO PARA O STORY E REELS
  video/story-linha-antique-9x16.mp4 (41 s, com música): poste primeiro, com a figurinha "Link" para o
  WhatsApp. Ele também serve como Reels: na hora de postar o Reels, use a mesma legenda acima.

STORIES (pasta stories, 1080 × 1920), depois do vídeo
${stories.map(([f, q, s], i) => `  ${i + 1} · ${f}\n      ${q}\n      ${s}`).join('\n')}
  Extra: os Reels verticais das duas peças (pasta 3-outros-videos de cada produto) também
  funcionam como story, com a figurinha "Link".


DESTAQUE "ANTIQUE" (pasta destaque)
  Capa: destaque-icone-antique.png (dobradiça borboleta, no mesmo estilo dos outros ícones).
  A reserva destaque-antique.png tem a folha e o nome escrito.
  1. Publique o vídeo da linha e os stories 1 a 6.
  2. No perfil, toque em "+ Novo" nos destaques e escolha o vídeo da linha e os 6 stories.
  3. Nome do destaque: Antique
  4. Editar capa → ícone da galeria → destaque-icone-antique.png → centralize.
  Deixe o destaque Antique logo depois do Encomendas.


STATUS DO WHATSAPP
----------------------------------------
Nova linha da Marcenaria Moraes 🌳
Linha Antique: cristaleira, guarda-roupa e rack de madeira maciça escura com ferragens de época em ferro.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!
----------------------------------------


COMO PUBLICAR
  1. Poste primeiro a linha (este post + vídeo no story). Nos dias seguintes, poste cada peça com o post
     próprio (pasta de cada produto), com 3 dias entre eles: Cristaleira, Guarda-Roupa e Rack Antique.
  2. Entre 18h e 21h, de terça a quinta. Em "Local", marque Uberlândia.
  3. Na primeira hora, responda todo comentário e direct. Quem perguntar o valor recebe o orçamento no direct.

Nenhuma imagem nem a legenda tem preço.
`);

fs.writeFileSync(`${OUT}/LEIA-ME.txt`, `LINHA ANTIQUE · INSTAGRAM
Marcenaria Moraes · 10/10/2026

A linha Antique junta as peças com ferragens de época em ferro: a Cristaleira Antique (1, 2 ou 4 portas),
o Guarda-Roupa Antique (2 ou 4 portas) e o Rack Antique (140 ou 180 cm). Cada peça tem a própria pasta, com ficha, vídeos e post.
Esta pasta é para apresentar a linha inteira.

previa-do-post.html  · abra com dois cliques: post, stories e destaque, com botões para copiar os textos
LEGENDA-E-TEXTOS.txt · legenda, textos alternativos, roteiro dos stories, destaque e status do WhatsApp
video/               · vídeo da linha: story/Reels 9:16 e versão 4:5 para o carrossel (41 s, com música)
post/                · 7 imagens 1080 × 1350 (formato 4:5), na ordem
post-2x/             · as mesmas em 2160 × 2700
stories/             · 6 stories 1080 × 1920, com espaço livre em cima e embaixo para os botões
destaque/            · capa do destaque Antique (ícone de dobradiça borboleta) e a reserva com texto
`);

// prévia
const tpl = fs.readFileSync('previa-template.html', 'utf8');
const head = tpl.slice(0, tpl.indexOf('</style>') + 8).replace(/<title>[^<]*<\/title>/, '<title>Linha Antique</title>');
const post = ['1-capa', '2-ferragens-de-epoca', '3-cristaleira-antique', '4-guarda-roupa-antique', '5-rack-antique', '6-madeiras', '7-como-encomendar'];
const pcap = ['Capa · nova linha', 'Ferragens de época', 'Cristaleira Antique', 'Guarda-Roupa Antique', 'Rack Antique', 'Madeiras', 'Como encomendar'];
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `${head}
<style>.st9 img{aspect-ratio:9/16!important}.dq img{aspect-ratio:9/16!important;border-radius:50%!important;object-fit:cover;max-width:180px}</style>
<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · Instagram</div>
    <h1>Linha Antique</h1>
    <p class="lead">Post de apresentação da linha (com vídeo peça a peça), vídeo para o story, 6 stories e a capa do destaque. Cada peça tem também o próprio post na pasta do produto.</p>
  </header>
  <section>
    <h2>O carrossel</h2>
    <div class="car">
      ${post.map((n, i) => `<div class="item"><img src="post/${n}.png" alt="${pcap[i]}"><div class="cap"><b>${i < 1 ? 1 : i + 2}</b><span>${pcap[i]}</span></div></div>`).join('\n      ').replace('</div></div>', '</div></div>\n      <div class="item"><video src="video/video-linha-antique-4x5.mp4" controls muted playsinline loop preload="metadata" poster="post/1-capa.png"></video><div class="cap"><b>2</b><span>Vídeo 4:5 · 41 s</span></div></div>')}
    </div>
  </section>
  <section>
    <h2>Legenda</h2>
    <div class="box"><pre class="copy" id="cap">${esc(legenda)}</pre><button type="button" class="btn" data-copy="cap">Copiar legenda</button></div>
  </section>
  <section>
    <h2>Stories</h2>
    <div class="car st9">
      <div class="item"><video src="video/story-linha-antique-9x16.mp4" controls muted playsinline loop preload="metadata" style="aspect-ratio:9/16;width:100%;border-radius:10px;background:#0F1013"></video><div class="cap"><b>vídeo</b><span>Primeiro, com a figurinha Link</span></div></div>
      ${stories.map(([f, q, s], i) => `<div class="item"><img src="stories/${f}" alt="Story ${i + 1}"><div class="cap"><b>${i + 1}</b><span>${s}</span></div></div>`).join('\n      ')}
    </div>
  </section>
  <div class="grid2">
    <section>
      <h2>Destaque "Antique"</h2>
      <div class="car dq"><div class="item"><img src="destaque/destaque-icone-antique.png" alt="Ícone do destaque"><div class="cap"><b>capa</b><span>use esta</span></div></div><div class="item"><img src="destaque/destaque-antique.png" alt="Capa com texto"><div class="cap"><b>reserva</b><span>com texto</span></div></div></div>
      <ol class="list"><li>Publique o vídeo e os 6 stories.</li><li>No perfil: "+ Novo" nos destaques, escolha os stories, nome <b>Antique</b>.</li><li>Editar capa → galeria → <b>destaque-icone-antique.png</b>.</li></ol>
    </section>
    <section>
      <h2>Texto alternativo</h2>
      <dl class="alt">${alt.map((a, i) => `<dt>${i + 1}</dt><dd>${a}</dd>`).join('')}</dl>
    </section>
  </div>
</div>
<script>
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
  const el=document.getElementById(b.dataset.copy),label=b.textContent;
  const done=()=>{b.textContent='Copiado';setTimeout(()=>b.textContent=label,1600)};
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Texto selecionado, copie com Ctrl+C'};
  try{navigator.clipboard.writeText(el.textContent).then(done,fallback)}catch(e){fallback()}
}));
</script>
</html>
`;
fs.writeFileSync(`${OUT}/previa-do-post.html`, html);
console.log('ok');
