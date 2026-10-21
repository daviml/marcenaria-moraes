// Textos do post, dos stories e do destaque da linha Antique: node antique-texts.mjs
import fs from 'node:fs';
const OUT = '../out/mo-line';
fs.mkdirSync(OUT, { recursive: true });

const legenda = `Linha Modern 🌳

Nossa nova linha de móveis em madeira maciça, de linhas retas e com nada à vista: nenhum parafuso, cantoneira ou puxador de metal. Três peças com o mesmo desenho:

🔹 Escrivaninha Cerne
150 × 60 × 76 cm · tampo de 1,50 m, desmonta em 4 partes

🔹 Mesa de Centro Modern
100 × 60 × 40 cm · prateleira embaixo

🔹 Aparador Modern
120 × 35 × 80 cm · duas gavetas com cava, sem puxador

✔️ Madeira maciça escura: cambará nogueira ou jatobá (madeira de lei)
✔️ Pernas de painel e tampo com borda de 4 cm e cantos arredondados
✔️ Opção com detalhes pretos: base em preto fosco e tampo em madeira, mesmo preço
✔️ Escritório, sala e hall combinando

📦 Sob encomenda, feita à mão em Uberlândia. Prazo de 2 a 4 semanas, conforme a peça.
💬 Valor sob consulta: chame no direct ou no WhatsApp (link na bio).

Arraste para ver peça a peça 👉

Imagens do projeto em 3D. Cada peça sai com o veio único da sua madeira.

#marcenariamoraes #linhamodern #moveisminimalistas #designminimalista #escrivaninha #mesadecentro #aparador #homeoffice #madeiramacica #jatoba #feitoamao #moveisdemadeira #marcenariaartesanal #uberlandia #udi #uberlandiamg #triangulomineiro`;
const alt = [
  'Um aparador, uma escrivaninha e uma mesa de centro de madeira maciça escura lado a lado, com pernas de painel, título Modern, nova linha da Marcenaria Moraes.',
  'Vídeo da linha Modern mostrando peça a peça: a escrivaninha, a mesa de centro e o aparador com as gavetas abrindo, a opção com detalhes pretos e as duas madeiras.',
  'Quatro detalhes da linha: a borda de 4 cm, a perna de painel, a gaveta com cava e a base preta.',
  'A Escrivaninha Cerne, com tampo de 1,50 m e pernas de painel.',
  'A Mesa de Centro Modern, com prateleira embaixo.',
  'O Aparador Modern, com duas gavetas sem puxador e prateleira baixa.',
  'O aparador em madeira inteira e com detalhes pretos, lado a lado.',
  'Como encomendar: chamar no direct ou WhatsApp, sinal de 50% e entrega em 2 a 4 semanas.',
];
const stories = [
  ['story-1-nova-linha.png', 'No dia do post. Figurinha "Mencionar post"', 'Nova linha no ar! 👀'],
  ['story-2-escrivaninha.png', 'Figurinha de enquete', 'Enquete: "Home office: madeira ou detalhes pretos?"'],
  ['story-3-mesa-de-centro.png', 'Figurinha de enquete', 'Enquete: "Sua sala precisa de uma? Sim / Já tenho"'],
  ['story-4-aparador.png', 'Figurinha de enquete', 'Enquete: "No hall ou atrás do sofá?"'],
  ['story-5-nada-a-vista.png', 'No dia seguinte. Figurinha de pergunta', 'Caixa de perguntas: "Ficou com dúvida sobre a linha Modern?"'],
  ['story-6-orcamento.png', 'Sempre por último. Figurinha "Link" no quadro tracejado', 'Link: WhatsApp · texto "Peça seu orçamento"'],
];
fs.writeFileSync(`${OUT}/LEGENDA-E-TEXTOS.txt`, `LINHA MODERN · POST, STORIES E DESTAQUE
========================================

LEGENDA DO POST (copie tudo entre as linhas)
----------------------------------------
${legenda}
----------------------------------------


ORDEM DO CARROSSEL (formato 4:5)
  1 · post/1-capa.png
  2 · video/video-linha-modern-4x5.mp4  (38 s, já tem música: peça a peça)
  3 · post/2-nada-a-vista.png
  4 · post/3-escrivaninha-cerne.png
  5 · post/4-mesa-de-centro-modern.png
  6 · post/5-aparador-modern.png
  7 · post/6-madeira-ou-preto.png
  8 · post/7-como-encomendar.png


TEXTO ALTERNATIVO (Configurações avançadas → Acessibilidade)
${alt.map((a, i) => `  ${i + 1} · ${a}`).join('\n')}


VÍDEO PARA O STORY E REELS
  video/story-linha-modern-9x16.mp4 (38 s, com música): poste primeiro, com a figurinha "Link" para o
  WhatsApp. Ele também serve como Reels: na hora de postar o Reels, use a mesma legenda acima.

STORIES (pasta stories, 1080 × 1920), depois do vídeo
${stories.map(([f, q, s], i) => `  ${i + 1} · ${f}\n      ${q}\n      ${s}`).join('\n')}
  Extra: os Reels verticais das duas peças (pasta 3-outros-videos de cada produto) também
  funcionam como story, com a figurinha "Link".


DESTAQUE "MODERN" (pasta destaque)
  Capa: destaque-icone-modern.png (mesa de pernas de painel, no mesmo estilo dos outros ícones).
  A reserva destaque-modern.png tem a folha e o nome escrito.
  1. Publique o vídeo da linha e os stories 1 a 6.
  2. No perfil, toque em "+ Novo" nos destaques e escolha o vídeo da linha e os 6 stories.
  3. Nome do destaque: Modern
  4. Editar capa → ícone da galeria → destaque-icone-modern.png → centralize.
  Deixe o destaque Modern ao lado do Antique.


STATUS DO WHATSAPP
----------------------------------------
Nova linha da Marcenaria Moraes 🌳
Linha Modern: escrivaninha, mesa de centro e aparador de madeira maciça, sem parafuso nem puxador à vista, com opção de detalhes pretos.
Feita sob encomenda. Me chama aqui para pedir seu orçamento!
----------------------------------------


COMO PUBLICAR
  1. Poste primeiro a linha (este post + vídeo no story). Nos dias seguintes, poste cada peça com o post
     próprio (pasta de cada produto), com 3 dias entre eles: Escrivaninha Cerne, Mesa de Centro e Aparador Modern.
  2. Entre 18h e 21h, de terça a quinta. Em "Local", marque Uberlândia.
  3. Na primeira hora, responda todo comentário e direct. Quem perguntar o valor recebe o orçamento no direct.

Nenhuma imagem nem a legenda tem preço.
`);

fs.writeFileSync(`${OUT}/LEIA-ME.txt`, `LINHA MODERN · INSTAGRAM
Marcenaria Moraes · 10/10/2026

A linha Modern junta as peças de linhas retas e nada à vista: a Escrivaninha Cerne, a Mesa de Centro
Modern e o Aparador Modern, todas com opção de detalhes pretos. Cada peça tem a própria pasta, com ficha, vídeos e post.
Esta pasta é para apresentar a linha inteira.

previa-do-post.html  · abra com dois cliques: post, stories e destaque, com botões para copiar os textos
LEGENDA-E-TEXTOS.txt · legenda, textos alternativos, roteiro dos stories, destaque e status do WhatsApp
video/               · vídeo da linha: story/Reels 9:16 e versão 4:5 para o carrossel (38 s, com música)
post/                · 7 imagens 1080 × 1350 (formato 4:5), na ordem
post-2x/             · as mesmas em 2160 × 2700
stories/             · 6 stories 1080 × 1920, com espaço livre em cima e embaixo para os botões
destaque/            · capa do destaque Modern (ícone de mesa de pernas de painel) e a reserva com texto
`);

// prévia
const tpl = fs.readFileSync('previa-template.html', 'utf8');
const head = tpl.slice(0, tpl.indexOf('</style>') + 8).replace(/<title>[^<]*<\/title>/, '<title>Linha Modern</title>');
const post = ['1-capa', '2-nada-a-vista', '3-escrivaninha-cerne', '4-mesa-de-centro-modern', '5-aparador-modern', '6-madeira-ou-preto', '7-como-encomendar'];
const pcap = ['Capa · nova linha', 'Nada à vista', 'Escrivaninha Cerne', 'Mesa de Centro Modern', 'Aparador Modern', 'Madeira ou preto', 'Como encomendar'];
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `${head}
<style>.st9 img{aspect-ratio:9/16!important}.dq img{aspect-ratio:9/16!important;border-radius:50%!important;object-fit:cover;max-width:180px}</style>
<div class="wrap">
  <header>
    <div class="eyebrow">Marcenaria Moraes · Instagram</div>
    <h1>Linha Modern</h1>
    <p class="lead">Post de apresentação da linha (com vídeo peça a peça), vídeo para o story, 6 stories e a capa do destaque. Cada peça tem também o próprio post na pasta do produto.</p>
  </header>
  <section>
    <h2>O carrossel</h2>
    <div class="car">
      ${post.map((n, i) => `<div class="item"><img src="post/${n}.png" alt="${pcap[i]}"><div class="cap"><b>${i < 1 ? 1 : i + 2}</b><span>${pcap[i]}</span></div></div>`).join('\n      ').replace('</div></div>', '</div></div>\n      <div class="item"><video src="video/video-linha-modern-4x5.mp4" controls muted playsinline loop preload="metadata" poster="post/1-capa.png"></video><div class="cap"><b>2</b><span>Vídeo 4:5 · 38 s</span></div></div>')}
    </div>
  </section>
  <section>
    <h2>Legenda</h2>
    <div class="box"><pre class="copy" id="cap">${esc(legenda)}</pre><button type="button" class="btn" data-copy="cap">Copiar legenda</button></div>
  </section>
  <section>
    <h2>Stories</h2>
    <div class="car st9">
      <div class="item"><video src="video/story-linha-modern-9x16.mp4" controls muted playsinline loop preload="metadata" style="aspect-ratio:9/16;width:100%;border-radius:10px;background:#0F1013"></video><div class="cap"><b>vídeo</b><span>Primeiro, com a figurinha Link</span></div></div>
      ${stories.map(([f, q, s], i) => `<div class="item"><img src="stories/${f}" alt="Story ${i + 1}"><div class="cap"><b>${i + 1}</b><span>${s}</span></div></div>`).join('\n      ')}
    </div>
  </section>
  <div class="grid2">
    <section>
      <h2>Destaque "Modern"</h2>
      <div class="car dq"><div class="item"><img src="destaque/destaque-icone-modern.png" alt="Ícone do destaque"><div class="cap"><b>capa</b><span>use esta</span></div></div><div class="item"><img src="destaque/destaque-modern.png" alt="Capa com texto"><div class="cap"><b>reserva</b><span>com texto</span></div></div></div>
      <ol class="list"><li>Publique o vídeo e os 6 stories.</li><li>No perfil: "+ Novo" nos destaques, escolha os stories, nome <b>Modern</b>.</li><li>Editar capa → galeria → <b>destaque-icone-modern.png</b>.</li></ol>
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
