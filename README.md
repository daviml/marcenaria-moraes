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

Peça nova: copie o modelo para `js/models/`, registre o id em `js/engine.js` (MAKE) e em `js/app.js` (MAKE),
acrescente a peça em `js/data.js` e coloque a imagem em `assets/img/pecas/<id>.webp` e o vídeo em `assets/video/`.
