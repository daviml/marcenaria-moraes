# Marcenaria Moraes · site do catálogo

Site estático para os clientes: catálogo por linha (Antique, Modern e Raiz), ficha resumida de cada peça,
provador de madeiras em 3D e pedido de orçamento direto no WhatsApp. Nenhum preço aparece no site.

## Publicar no GitHub Pages

1. Envie os arquivos para o branch `main`.
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em 1 ou 2 minutos o site fica em `https://daviml.github.io/marcenaria-moraes/`.

Não precisa de build: é HTML, CSS e JavaScript puro. O three.js já está em `js/vendor`.

## Testar no computador

Os módulos JavaScript não abrem com dois cliques no arquivo; use um servidor local na pasta do site:

```
npx serve .
```

ou `python -m http.server` e abra `http://localhost:8000`.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Textos das peças, prazos, madeiras do provador, número do WhatsApp | `js/data.js` |
| Modelos 3D (medidas reais de cada peça) | `js/models/` (cópia dos scripts do catálogo) |
| Motor 3D (madeiras, luz, portas abrindo) | `js/engine.js` |
| Página e seções | `index.html` |
| Visual e animações | `css/style.css` |
| Imagens e vídeos | `assets/` |
| Projetos de oficina (3D, vistas cotadas, plano de corte, custo) | `projetos/` (têm preço: não linkar no site) |

Peça nova: copie o modelo para `js/models/`, registre o id em `js/engine.js` (MAKE) e em `js/app.js` (MAKE),
acrescente a peça em `js/data.js` e coloque a imagem em `assets/img/pecas/<id>.webp` e o vídeo em `assets/video/`.

## Prévia ao compartilhar (WhatsApp, Instagram, Facebook)

Os metadados ficam no topo do `index.html` e usam o endereço completo do site
(`https://daviml.github.io/marcenaria-moraes/`). Se o endereço mudar (por exemplo, um domínio próprio),
troque esse endereço em todas as linhas `og:` e `twitter:` e no `canonical`. A imagem da prévia é
`assets/img/og.jpg` (1200 × 630, menos de 300 KB).

Depois de publicar ou mudar algo, peça para o Facebook ler a página de novo em
https://developers.facebook.com/tools/debug/ (cole o endereço → **Depurar** → **Extrair novamente**).
