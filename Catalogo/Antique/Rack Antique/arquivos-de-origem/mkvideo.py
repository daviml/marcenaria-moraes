# Monta os vídeos (cabeçalho comum + linha do tempo de cada um)
import sys
head = open('vhead.txt', encoding='utf-8').read()
logo = '''
// abertura com o selo, igual em todos os vídeos
function logoAt(t) {
  const logo = document.getElementById('logo');
  if (t < 3.3) {
    logo.style.display = 'flex';
    logo.style.opacity = 1 - sm((t - 2.6) / 0.6);
    const svg = document.getElementById('lsvg'), ring = document.getElementById('lring'), det = document.getElementById('ldet');
    const a = sm(t / 0.5);
    svg.style.opacity = a; svg.style.transform = `scale(${lerp(0.9, 1, a) + 0.02 * sm((t - 1.9) / 1.2)})`;
    svg.style.filter = `drop-shadow(0 0 ${Math.min(W, H) * 0.03}px rgba(170,95,150,${0.55 * a}))`;
    ring.style.strokeDashoffset = +ring.dataset.len * (1 - sm((t - 0.25) / 1.15));
    det.style.opacity = sm((t - 1.25) / 0.6);
    document.getElementById('lshine').setAttribute('x', lerp(-70, 230, sm((t - 1.85) / 0.75)));
  } else logo.style.display = 'none';
}
'''
def build(out, title, ids, end_tt, end_st, tail):
    h = head.replace('// Guarda-Roupa Antique: linha do tempo do vídeo (38 s, as duas versões)', '// ' + title)
    a = '<div class="tt">Guarda-Roupa Antique</div><div class="st" id="endst">2 ou 4 portas · nogueira ou jatobá · feito à mão</div>'
    assert a in h
    h = h.replace(a, f'<div class="tt">{end_tt}</div><div class="st" id="endst">{end_st}</div>')
    h = h.replace("let FMT = '45'", f"const IDS = {ids};\nlet FMT = '45'", 1)
    open(out, 'w', encoding='utf-8').write(h + logo + open(tail, encoding='utf-8').read())

build('video-bf.js', 'Buffet Antique: linha do tempo do vídeo (34 s, as duas medidas)', "['bf150', 'bf110']", 'Buffet Antique', '150 ou 110 cm · nogueira ou jatobá · feito à mão', 'vtail-bf.js')
build('video-rk.js', 'Rack Antique: linha do tempo do vídeo (34 s, as duas medidas)', "['rk180', 'rk140']", 'Rack Antique', '180 ou 140 cm · nogueira ou jatobá · feito à mão', 'vtail-rk.js')
if len(sys.argv) > 1:
    build('video-line.js', 'Linha Antique: vídeo da linha inteira, peça a peça (~44 s)', "['cr1', 'cr2', 'cr4', 'gr2', 'gr4', 'rk140', 'rk180']", 'Linha Antique', 'Sob encomenda · valor sob consulta · Uberlândia', 'vtail-line.js')
print('ok')
