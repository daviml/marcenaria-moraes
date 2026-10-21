// Motor 3D da Cristaleira Veio: monta a peça a partir do model.mjs e expõe uma API para fotos e vídeos.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PARTS, HINGES, LATCH, PULL, DOOR } from './model.mjs';

// ---------- madeira procedural ----------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function noise1(seed) { const r = rng(seed), g = Array.from({ length: 512 }, r); return x => { const i = Math.floor(x), f = x - i, a = g[i & 511], b = g[(i + 1) & 511]; const t = f * f * (3 - 2 * f); return a + (b - a) * t; }; }
const FIN = {
  mel: { base: '#CF9550', light: '#E2AE6C', dark: '#9C6230', streak: '#B87A3C' },
  nog: { base: '#6F4529', light: '#86573A', dark: '#3D2414', streak: '#5A3520' },
};
function woodCanvas(fin, seed) {
  const W = 1024, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), r = rng(seed * 31 + 7), n1 = noise1(seed), n2 = noise1(seed + 5);
  const F = FIN[fin];
  x.fillStyle = F.base; x.fillRect(0, 0, W, H);
  // faixas largas e suaves (diferença de tom entre as fibras)
  for (let i = 0; i < 26; i++) {
    const y = r() * H, h = 20 + r() * 90; x.globalAlpha = 0.10 + r() * 0.16;
    x.fillStyle = r() < 0.5 ? F.light : F.streak; x.fillRect(0, y, W, h);
  }
  // veios: linhas finas e onduladas, densas e irregulares
  const lines = 150;
  for (let i = 0; i < lines; i++) {
    const y0 = r() * H, amp = 3 + r() * 14, ph = r() * 50, k = 0.4 + r() * 1.4;
    x.globalAlpha = 0.05 + Math.pow(r(), 2.2) * 0.38;
    x.strokeStyle = r() < 0.85 ? F.dark : F.light; x.lineWidth = 0.6 + Math.pow(r(), 3) * 3.2;
    x.beginPath();
    for (let u = -8; u <= W + 8; u += 8) {
      const y = y0 + (n1(u / 260 * k + ph) - 0.5) * amp * 2 + (n2(u / 70 + ph) - 0.5) * 2.2;
      u < 0 ? x.moveTo(u, y) : x.lineTo(u, y);
    }
    x.stroke();
    // repete deslocada para fechar a emenda vertical da textura
    x.save(); x.translate(0, y0 > H / 2 ? -H : H); x.stroke(); x.restore();
  }
  // poros: tracinhos curtos
  x.globalAlpha = 0.18; x.fillStyle = F.dark;
  for (let i = 0; i < 2600; i++) x.fillRect(r() * W, r() * H, 2 + r() * 7, 0.8);
  x.globalAlpha = 1;
  return c;
}
const texCache = {};
function woodTex(fin, seed) {
  const k = fin + seed; if (texCache[k]) return texCache[k];
  const t = new THREE.CanvasTexture(woodCanvas(fin, seed));
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return (texCache[k] = t);
}

// UV por face: u corre no sentido do veio, escala em cm (a textura cobre 60 × 18 cm)
const AX = { x: 0, y: 1, z: 2 };
function applyUV(geo, grain, off) {
  const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
  const g = AX[grain];
  for (let i = 0; i < pos.count; i++) {
    const p = [pos.getX(i), pos.getY(i), pos.getZ(i)], n = [Math.abs(nor.getX(i)), Math.abs(nor.getY(i)), Math.abs(nor.getZ(i))];
    const na = n.indexOf(Math.max(...n)); // eixo da normal (coordenadas three)
    const axes = [0, 1, 2].filter(a => a !== na);
    let ua = axes.includes(g) ? g : axes[0];
    const va = axes.find(a => a !== ua);
    uv.setXY(i, p[ua] / 60 + off[0], p[va] / 18 + off[1]);
  }
  uv.needsUpdate = true;
}

// ---------- cena ----------
const toV = (x, y, z) => new THREE.Vector3(x - 25, z, 20 - y); // projeto → three
const GRAIN3 = { x: 'x', y: 'z', z: 'y' };                      // eixo do veio no three
let renderer, scene, camera, root, doorG, drawerG, parts3 = [], woodMats = {}, state = { fin: 'mel' };
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdfeeee, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.16, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide });
const ironMat = new THREE.MeshStandardMaterial({ color: 0x1b1a1a, metalness: 0.55, roughness: 0.42 });
const compMat = new THREE.MeshStandardMaterial({ color: 0xcfa878, roughness: 0.8 });

function woodMat(fin, seed) {
  const k = fin + seed; if (woodMats[k]) return woodMats[k];
  const t = woodTex(fin, seed);
  return (woodMats[k] = new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.35, roughness: fin === 'mel' ? 0.52 : 0.46, metalness: 0 }));
}

export function init({ w, h, dpr = 2, fin = 'mel' }) {
  state.fin = fin;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(dpr); renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('stage').appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.38;
  camera = new THREE.PerspectiveCamera(28, w / h, 5, 3000);

  // luz: foco de cima, como no estúdio
  const key = new THREE.SpotLight(0xfff1e0, 9000, 0, Math.PI / 5.5, 0.55, 1.6);
  key.position.set(-90, 330, 170); key.target.position.set(0, 60, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.6; key.shadow.radius = 6;
  key.shadow.camera.near = 100; key.shadow.camera.far = 700;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xdfe6ff, 0.55); rim.position.set(160, 140, -200); scene.add(rim);
  const fill = new THREE.HemisphereLight(0xfff4ea, 0x1d1c20, 0.22); scene.add(fill);

  // palco: piso cinza com mancha de luz e anel fino
  const fc = document.createElement('canvas'); fc.width = fc.height = 1024; const fx = fc.getContext('2d');
  const gr = fx.createRadialGradient(512, 512, 30, 512, 512, 512);
  gr.addColorStop(0, 'rgba(150,154,162,1)'); gr.addColorStop(0.45, 'rgba(98,101,108,1)'); gr.addColorStop(0.8, 'rgba(46,47,52,0.9)'); gr.addColorStop(1, 'rgba(20,20,23,0)');
  fx.fillStyle = gr; fx.fillRect(0, 0, 1024, 1024);
  const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(420, 96), new THREE.MeshStandardMaterial({ map: ft, transparent: true, roughness: 0.9, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(118, 118.6, 160), new THREE.MeshBasicMaterial({ color: 0xc9c4bc, transparent: true, opacity: 0.35 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; scene.add(ring);

  build();
}

function boxGeo(p) {
  const [x0, y0, z0, x1, y1, z1] = p.b;
  const sx = x1 - x0, sy = z1 - z0, sz = y1 - y0;
  const geo = p.round ? new RoundedBoxGeometry(sx, sy, sz, 3, p.round) : new THREE.BoxGeometry(sx, sy, sz);
  return geo;
}

function build() {
  root = new THREE.Group(); scene.add(root);
  doorG = new THREE.Group(); drawerG = new THREE.Group();
  const hp = toV(DOOR.hinge + 0.1, -0.45, 0); // eixo das dobradiças
  doorG.position.set(hp.x, 0, hp.z); root.add(doorG, drawerG);
  PARTS.forEach((p, i) => {
    const geo = boxGeo(p);
    let mat;
    if (p.m === 'vidro') mat = glassMat;
    else if (p.m === 'comp') mat = compMat;
    else { applyUV(geo, GRAIN3[p.grain], [((i * 37) % 13) / 13, ((i * 53) % 7) / 7]); mat = null; }
    const mesh = new THREE.Mesh(geo, mat || woodMat(state.fin, 1 + (i % 4)));
    mesh.userData = { p, seed: 1 + (i % 4), wood: !mat };
    mesh.castShadow = p.m !== 'vidro'; mesh.receiveShadow = true;
    const [x0, y0, z0, x1, y1, z1] = p.b;
    const c = toV((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const parent = p.door ? doorG : p.drawer ? drawerG : root;
    if (p.door) c.sub(doorG.position);
    mesh.position.copy(c); mesh.userData.home = c.clone();
    parent.add(mesh); parts3.push(mesh);
  });
  buildIron();
  setFinish(state.fin);
}

// ---------- ferragens ----------
function wingShape(w, hIn, hOut) { // asa de borboleta: estreita no eixo, larga na ponta
  const s = new THREE.Shape(); const r = 0.5;
  s.moveTo(0, -hIn / 2); s.lineTo(w - r, -hOut / 2); s.quadraticCurveTo(w, -hOut / 2, w, -hOut / 2 + r);
  s.lineTo(w, hOut / 2 - r); s.quadraticCurveTo(w, hOut / 2, w - r, hOut / 2); s.lineTo(0, hIn / 2); s.lineTo(0, -hIn / 2);
  return s;
}
const screwHead = () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 16), ironMat); m.rotation.x = Math.PI / 2; return m; };
function buildIron() {
  const ex = { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.05, bevelSegments: 2 };
  HINGES.forEach(z => {
    // asa da porta (vai junto com a porta) e asa da coluna
    for (const side of [-1, 1]) {
      const g = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape(3.9, 3.2, 7.4), ex), ironMat);
      g.castShadow = true;
      const grp = new THREE.Group(); grp.add(g);
      g.position.z = 0; // espessura para a frente
      [[2.6, 2.4], [2.6, -2.4], [1.2, 0]].forEach(([u, v]) => { const sh = screwHead(); sh.position.set(u, v, 0.32); grp.add(sh); });
      grp.scale.x = side; // -1: para a esquerda (porta)
      if (side < 0) { grp.position.set(0, z, -0.43); doorG.add(grp); grp.userData.hinge = 1; }
      else { const p = toV(DOOR.hinge + 0.1, -0.02, z); grp.position.set(p.x, z, p.z); root.add(grp); }
    }
    const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 3.4, 20), ironMat); kn.castShadow = true;
    kn.position.set(0, z, 0); doorG.add(kn);
  });
  // tramela: chapa na coluna da esquerda e lingueta que gira por cima do montante da porta
  const lp = toV(2, -0.15, LATCH.z);
  const plate = new THREE.Mesh(new RoundedBoxGeometry(2.6, 3.4, 0.25, 2, 0.3), ironMat); plate.position.set(lp.x, LATCH.z, lp.z); plate.castShadow = true; root.add(plate);
  const bar = new THREE.Mesh(new RoundedBoxGeometry(5.2, 1.0, 0.3, 2, 0.25), ironMat); bar.position.set(lp.x + 2.2, LATCH.z, lp.z + 0.3); bar.castShadow = true; root.add(bar);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), ironMat); pin.position.set(lp.x, LATCH.z, lp.z + 0.55); root.add(pin);
  state.latch = bar;
  // puxador concha na gaveta
  const pp = toV(PULL.x, -0.12, PULL.z);
  const base = new THREE.Mesh(new RoundedBoxGeometry(9.5, 3.4, 0.22, 3, 0.6), ironMat); base.position.set(pp.x, PULL.z, pp.z); base.castShadow = true; drawerG.add(base);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 7.6, 24, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x1b1a1a, metalness: 0.55, roughness: 0.42, side: THREE.DoubleSide }));
  cup.rotation.z = Math.PI / 2; cup.rotation.y = Math.PI / 2; cup.position.set(pp.x, PULL.z + 0.2, pp.z + 0.05); cup.castShadow = true; drawerG.add(cup);
  [-3.9, 3.9].forEach(dx => { const sh = screwHead(); sh.position.set(pp.x + dx, PULL.z, pp.z + 0.2); drawerG.add(sh); });
}

export function setFinish(fin) {
  state.fin = fin;
  parts3.forEach(m => { if (m.userData.wood) m.material = woodMat(fin, m.userData.seed); });
}

// ---------- estado: explosão, porta, gaveta ----------
const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
export function setPose({ build = 1, door = 0, drawer = 0, latch = 0, hide = [] } = {}) {
  // build: 0..6 (cada passo, uma etapa de montagem)
  parts3.forEach(m => {
    const p = m.userData.p, k = ease(build - p.step);
    const dist = 70 * (1 - k);
    const e = p.ex; const v = new THREE.Vector3(e[0], e[2], -e[1]).normalize();
    m.position.copy(m.userData.home).addScaledVector(v, dist);
    m.visible = k > 0.001 && !hide.includes(p.g) && !hide.includes(p.id);
    if (m.material && m.material.opacity !== undefined && p.m === 'vidro') m.visible = m.visible && k > 0.3;
  });
  // ferragens aparecem junto com a porta
  const kd = ease(build - 4);
  doorG.children.forEach(c => { if (!c.userData.p) c.visible = kd > 0.6; });
  root.children.forEach(c => { if (!c.userData.p && c !== doorG && c !== drawerG) c.visible = kd > 0.6; });
  drawerG.children.forEach(c => { if (!c.userData.p) c.visible = kd > 0.6; });
  doorG.position.y = 0;
  doorG.rotation.y = door * 1.75;
  const dz = (1 - kd) * 60;
  doorG.position.z = toV(DOOR.hinge + 0.1, -0.45, 0).z + dz;
  drawerG.position.z = drawer * 24 + dz;
  if (state.latch) state.latch.rotation.z = latch * Math.PI / 2;
}

// ---------- câmera ----------
export function setCam({ az = 30, el = 12, dist = 430, ty = 92, tx = 0, fov = 28, sx = 0, sy = 0 } = {}) {
  const a = az * Math.PI / 180, e = el * Math.PI / 180;
  camera.fov = fov; camera.updateProjectionMatrix();
  camera.position.set(tx + dist * Math.sin(a) * Math.cos(e), ty + dist * Math.sin(e), dist * Math.cos(a) * Math.cos(e));
  camera.lookAt(tx, ty, 0);
  const c = renderer.domElement; camera.aspect = c.width / c.height; camera.clearViewOffset();
  if (sx || sy) camera.setViewOffset(c.width, c.height, sx * c.width, sy * c.height, c.width, c.height);
  camera.updateProjectionMatrix();
}
export function render() { renderer.render(scene, camera); }
// projeta um ponto do projeto (cm) para pixels da tela (CSS)
export function project(x, y, z) {
  const v = toV(x, y, z).project(camera), c = renderer.domElement;
  return [(v.x + 1) / 2 * c.clientWidth, (1 - v.y) / 2 * c.clientHeight];
}
export const three = () => ({ THREE, scene, camera, renderer });
