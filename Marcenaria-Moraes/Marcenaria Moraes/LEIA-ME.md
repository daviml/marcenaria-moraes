# Marcenaria Moraes · Arquivos da marca

Logo: **selo redondo com a folha de amoreira** ("Moraes" vem de *Morais*, o lugar das amoreiras).
Todas as letras foram convertidas em desenho (contorno), então os arquivos abrem iguais em qualquer computador, sem precisar instalar fonte.

## Pastas

| Pasta | O que tem | Para que usar |
|---|---|---|
| `01-logo/svg` | Selo e folha em vetor (SVG), em várias cores | Gráfica, adesivo, etiqueta, site. Aumenta sem perder qualidade |
| `01-logo/png` | Os mesmos em imagem PNG (1000 px e 3000 px) | WhatsApp, documentos, montagens no celular |
| `02-ferro-e-laser` | Vetor de peça única, sem máscaras, e versão **espelhada** | Ferro de marcar, gravação a laser, CNC |
| `03-instagram` | Foto de perfil, capas dos destaques, 2 posts prontos e marca-d'água | Montar o perfil (veja `INSTAGRAM.md`) |
| `04-arquivos-de-origem` | Script que gerou tudo | Para refazer os arquivos com outra cor ou tamanho: `npm install` e depois `node build.js "<pasta de saída>"` |

## Versões do selo

| Arquivo | Quando usar |
|---|---|
| `moraes-selo-amora` | Versão principal, em fundo claro |
| `moraes-selo-creme-fundo-amora` | Versão principal invertida (perfil, embalagem) |
| `moraes-selo-cerne` | Dourado sobre fundo claro (fundo transparente) |
| `moraes-selo-cerne-claro` | **Versão escura**: dourado-claro para colocar sobre fotos ou fundos escuros (fundo transparente) |
| `moraes-selo-cerne-fundo-carvao` | Versão escura já com o fundo carvão |
| `moraes-selo-preto` / `branco` | Uma cor só: carimbo, impressão barata, marca-d'água |
| `moraes-folha-*` | Só a folha, para espaços pequenos (canto da tábua, ícone, etiqueta mínima) |

## Cores

| Nome | Código | Uso |
|---|---|---|
| Amora | `#4A1C3C` | Cor principal |
| Cerne de amoreira | `#B0782C` | Cor de apoio (detalhes, títulos pequenos) |
| Cerne claro | `#DDAE62` | Cor de apoio em fundo escuro |
| Papel | `#FAF7F3` | Fundo claro |
| Creme | `#F3ECEF` | Selo sobre fundo amora |
| Carvão | `#1C1519` | Texto e fundo escuro |

## Fontes (gratuitas, do Google Fonts)

- **Bitter Bold**: o nome no selo.
- **Young Serif**: títulos dos posts.
- **Instrument Sans**: textos menores.

## Ferro de marcar

1. Mande para quem vai fazer o ferro o arquivo **`moraes-selo-FERRO-ESPELHADO-35mm.svg`**. Ele já está espelhado, para a marca sair certa na madeira.
2. Tamanho sugerido para tábuas: **35 mm**. Para móveis grandes, existe a versão de **50 mm**.
3. Abaixo de ~30 mm, a palavra "MARCENARIA" fica pequena demais e pode borrar no ferro. Se precisar de um ferro menor, use só a folha (`moraes-folha-preto.svg`).
4. Para gravação a laser, use `moraes-selo-vetor-unico.svg` (sem espelhar).
5. Teste sempre numa sobra de madeira antes: tempo e temperatura mudam muito entre cambará, pinus e peroba.

## Regras rápidas

- Deixe uma margem livre em volta do selo de pelo menos a largura da folha.
- Não estique, não incline, não troque as cores fora das versões acima.
- Tamanho mínimo impresso: **20 mm** para o selo completo; abaixo disso, use a folha.
