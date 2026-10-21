// Motor 3D do Guarda-Roupa Veio (2 e 4 portas): monta as peças do model.mjs e expõe uma API para fotos e vídeos.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { make } from './model.mjs';
export const MS = { 2: make(2), 4: make(4) };

// ---------- madeira procedural ----------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function noise1(seed) { const r = rng(seed), g = Array.from({ length: 512 }, r); return x => { const i = Math.floor(x), f = x - i, a = g[i & 511], b = g[(i + 1) & 511]; const t = f * f * (3 - 2 * f); return a + (b - a) * t; }; }
const FIN = {
  mel: { base: '#CF9550', light: '#E2AE6C', dark: '#9C6230', streak: '#B87A3C' },
  nog: { base: '#553824', light: '#6A4831', dark: '#2A1A0F', streak: '#45301F' },
  jat: { base: '#4F2A1D', light: '#64382A', dark: '#230F09', streak: '#3E1F15' }, // jatobá: castanho-avermelhado escuro
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


// ---------- cena: os dois guarda-roupas (2 e 4 portas) ficam montados; mostra um ou os dois ----------
const GRAIN3 = { x: 'x', y: 'z', z: 'y' };                      // eixo do veio no three
let renderer, scene, camera, woodMats = {}, state = { fin: 'nog' }, cur = 2;
const O = {};                                                    // por versão: { M, root, doorGs, drawerGs, parts3, latches }
const ironMat = new THREE.MeshStandardMaterial({ color: 0x1b1a1a, metalness: 0.55, roughness: 0.42 });
const compMat = new THREE.MeshStandardMaterial({ color: 0xcfa878, roughness: 0.8 });
const toV = (M, x, y, z) => new THREE.Vector3(x - M.L / 2, z, M.D / 2 - y); // projeto → three (local de cada guarda-roupa)

function woodMat(fin, seed) {
  const k = fin + seed; if (woodMats[k]) return woodMats[k];
  const t = woodTex(fin, seed);
  return (woodMats[k] = new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.35, roughness: 0.46, metalness: 0 }));
}

export function init({ w, h, dpr = 2, fin = 'nog', v = 2 }) {
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
  scene.environmentIntensity = 0.42;
  camera = new THREE.PerspectiveCamera(28, w / h, 5, 4000);

  // luz: foco de cima, como no estúdio (mais aberto: o guarda-roupa é largo)
  const key = new THREE.SpotLight(0xfff1e0, 14000, 0, Math.PI / 4.2, 0.55, 1.6);
  key.position.set(-110, 360, 230); key.target.position.set(0, 70, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.6; key.shadow.radius = 6;
  key.shadow.camera.near = 100; key.shadow.camera.far = 900;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xdfe6ff, 0.6); rim.position.set(180, 160, -220); scene.add(rim);
  const fill = new THREE.HemisphereLight(0xfff4ea, 0x1d1c20, 0.26); scene.add(fill);

  const fc = document.createElement('canvas'); fc.width = fc.height = 1024; const fx = fc.getContext('2d');
  const gr = fx.createRadialGradient(512, 512, 30, 512, 512, 512);
  gr.addColorStop(0, 'rgba(150,154,162,1)'); gr.addColorStop(0.45, 'rgba(98,101,108,1)'); gr.addColorStop(0.8, 'rgba(46,47,52,0.9)'); gr.addColorStop(1, 'rgba(20,20,23,0)');
  fx.fillStyle = gr; fx.fillRect(0, 0, 1024, 1024);
  const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(520, 96), new THREE.MeshStandardMaterial({ map: ft, transparent: true, roughness: 0.9, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.RingGeometry(190, 190.7, 160), new THREE.MeshBasicMaterial({ color: 0xc9c4bc, transparent: true, opacity: 0.35 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; scene.add(ring);

  for (const k of [2, 4]) O[k] = build(MS[k]);
  setModel(v);
  setFinish(fin);
}

function boxGeo(p) {
  const [x0, y0, z0, x1, y1, z1] = p.b;
  const sx = x1 - x0, sy = z1 - z0, sz = y1 - y0;
  if (p.cyl) { const g = new THREE.CylinderGeometry(sy / 2, sy / 2, sx, 20); g.rotateZ(Math.PI / 2); return g; }
  return p.round ? new RoundedBoxGeometry(sx, sy, sz, 3, p.round) : new THREE.BoxGeometry(sx, sy, sz);
}

function build(M) {
  const o = { M, root: new THREE.Group(), doorGs: [], drawerGs: [], parts3: [], latches: [] };
  scene.add(o.root);
  M.DOORS.forEach(d => { const g = new THREE.Group(), hp = toV(M, d.hinge, -0.45, 0); g.position.set(hp.x, 0, hp.z); g.userData.home = hp.clone(); g.userData.d = d; o.doorGs.push(g); o.root.add(g); });
  M.DRAWERS.forEach(() => { const g = new THREE.Group(); o.drawerGs.push(g); o.root.add(g); });
  M.PARTS.forEach((p, i) => {
    const geo = boxGeo(p);
    let mat = null;
    if (p.m === 'comp') mat = compMat;
    else applyUV(geo, GRAIN3[p.grain], [((i * 37) % 13) / 13, ((i * 53) % 7) / 7]);
    const mesh = new THREE.Mesh(geo, mat || woodMat(state.fin, 1 + (i % 4)));
    mesh.userData = { p, seed: 1 + (i % 4), wood: !mat };
    mesh.castShadow = true; mesh.receiveShadow = true;
    const [x0, y0, z0, x1, y1, z1] = p.b;
    const c = toV(M, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const parent = p.door ? o.doorGs[p.door - 1] : p.drawer ? o.drawerGs[p.drawer - 1] : o.root;
    if (p.door) c.sub(parent.position);
    mesh.position.copy(c); mesh.userData.home = c.clone();
    parent.add(mesh); o.parts3.push(mesh);
  });
  buildIron(o);
  return o;
}

// ---------- ferragens ----------
const screwHead = () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 16), ironMat); m.rotation.x = Math.PI / 2; return m; };
function flagShape(w, h) { // chapa da dobradiça rústica: retângulo com a ponta chanfrada
  const s = new THREE.Shape(); const c = 1.2;
  s.moveTo(0, -h / 2); s.lineTo(w - c, -h / 2); s.lineTo(w, -h / 2 + c); s.lineTo(w, h / 2 - c); s.lineTo(w - c, h / 2); s.lineTo(0, h / 2); s.lineTo(0, -h / 2);
  return s;
}
function argola(parent, pos) { // espelho redondo + argola pendurada
  const ros = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.3, 24), ironMat); ros.rotation.x = Math.PI / 2; ros.position.copy(pos); ros.castShadow = true; parent.add(ros);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.26, 10, 28), ironMat); ring.position.set(pos.x, pos.y - 1.9, pos.z + 0.45); ring.rotation.x = -0.25; ring.castShadow = true; parent.add(ring);
}
function buildIron(o) {
  const { M } = o, ex = { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.05, bevelSegments: 2 };
  M.DOORS.forEach((d, k) => {
    const dg = o.doorGs[k], toDoor = d.side === 'R' ? -1 : 1;
    M.HINGES.forEach(z => {
      for (const onDoor of [true, false]) {
        const g = new THREE.Mesh(new THREE.ExtrudeGeometry(flagShape(onDoor ? 5.5 : 3.7, onDoor ? 5 : 6.5), ex), ironMat);
        g.castShadow = true;
        const grp = new THREE.Group(); grp.add(g);
        (onDoor ? [[2.2, 1.5], [2.2, -1.5], [4.3, 0]] : [[2, 2.3], [2, -2.3]]).forEach(([u, v]) => { const sh = screwHead(); sh.position.set(u, v, 0.32); grp.add(sh); });
        grp.scale.x = onDoor ? toDoor : -toDoor;
        if (onDoor) { grp.position.set(0, z, -0.43); dg.add(grp); }
        else { const p = toV(M, d.hinge, -0.02, z); grp.position.set(p.x, z, p.z); o.root.add(grp); }
      }
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 6.6, 20), ironMat); kn.castShadow = true;
      kn.position.set(0, z, 0); dg.add(kn);
    });
  });
  // argolas nas portas
  M.DOOR_PULLS.forEach(pl => { const dg = o.doorGs[pl.door - 1], p = toV(M, pl.x, -0.15, pl.z).sub(dg.position); argola(dg, p); });
  // argolas nas gavetas
  M.PULLS.forEach(pl => { const dg = o.drawerGs[pl.drawer - 1]; argola(dg, toV(M, pl.x, -0.15, pl.z + 1)); });
  // taramelas de madeira no encontro das portas (giram para soltar)
  M.LATCHES.forEach(l => {
    const p = toV(M, l.x, -0.6, l.z);
    const piv = new THREE.Group(); piv.position.copy(p); o.root.add(piv);
    const geo = new RoundedBoxGeometry(1.8, 7, 1.1, 2, 0.3); applyUV(geo, 'y', [0.3, 0.2]);
    const bar = new THREE.Mesh(geo, woodMat(state.fin, 2)); bar.userData = { wood: true, seed: 2, iron: true }; bar.castShadow = true; piv.add(bar);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), ironMat); pin.position.set(0, 0, 0.6); piv.add(pin);
    o.latches.push({ piv, bar });
  });
}

export function setFinish(fin) {
  state.fin = fin;
  for (const k in O) { O[k].parts3.forEach(m => { if (m.userData.wood) m.material = woodMat(fin, m.userData.seed); }); O[k].latches.forEach(l => l.bar.material = woodMat(fin, 2)); }
}

// mostra um guarda-roupa (2 ou 4) ou os dois lado a lado; x = deslocamento de cada um, em cm
export function setModel(v, { x = 0, both = false, gap = 40 } = {}) {
  cur = v === 'both' ? 4 : v;
  if (v === 'both' || both) {
    const w2 = MS[2].L, w4 = MS[4].L, tot = w2 + gap + w4;
    O[2].root.visible = O[4].root.visible = true;
    O[2].root.position.x = -tot / 2 + w2 / 2; O[4].root.position.x = tot / 2 - w4 / 2;
  } else {
    for (const k of [2, 4]) { O[k].root.visible = +k === v; O[k].root.position.x = 0; }
    O[v].root.position.x = x;
  }
}
export function setOffset(v, x, vis = true) { O[v].root.position.x = x; O[v].root.visible = vis; }
export const models = () => MS;

// ---------- estado: explosão, portas, gavetas ----------
const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
export function setPose({ build = 6, door = 0, drawer = 0, latch = 0, hide = [], v } = {}) {
  for (const k of (v ? [v] : [2, 4])) {
    const o = O[k];
    o.parts3.forEach(m => {
      const p = m.userData.p, kk = ease(build - p.step), dist = 70 * (1 - kk);
      const e = p.ex, vv = new THREE.Vector3(e[0], e[2], -e[1]).normalize();
      m.position.copy(m.userData.home).addScaledVector(vv, dist);
      m.visible = kk > 0.001 && !hide.includes(p.g) && !hide.includes(p.id);
    });
    const kd = ease(build - 4);
    const isIron = c => !c.userData.p && !o.doorGs.includes(c) && !o.drawerGs.includes(c);
    [...o.doorGs, ...o.drawerGs].forEach(g => g.children.forEach(c => { if (isIron(c)) c.visible = kd > 0.6; }));
    o.root.children.forEach(c => { if (isIron(c)) c.visible = kd > 0.6; });
    const dz = (1 - kd) * 60;
    o.doorGs.forEach((g, i) => { const a = Array.isArray(door) ? (door[i] || 0) : door; g.rotation.y = a * 1.75 * (g.userData.d.side === 'R' ? 1 : -1); g.position.z = g.userData.home.z + dz; });
    o.drawerGs.forEach((g, i) => { const a = Array.isArray(drawer) ? (drawer[i] || 0) : drawer; g.position.z = a * 30 + dz; });
    o.latches.forEach(l => { l.piv.rotation.z = latch * Math.PI / 2; });
  }
}

// ---------- câmera ----------
export function setCam({ az = 30, el = 12, dist = 430, ty = 92, tx = 0, fov = 28 } = {}) {
  const a = az * Math.PI / 180, e = el * Math.PI / 180;
  camera.fov = fov;
  camera.position.set(tx + dist * Math.sin(a) * Math.cos(e), ty + dist * Math.sin(e), dist * Math.cos(a) * Math.cos(e));
  camera.lookAt(tx, ty, 0);
  const c = renderer.domElement; camera.aspect = c.width / c.height; camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
export function render() { renderer.render(scene, camera); }
// projeta um ponto do projeto (cm) do guarda-roupa v para pixels da tela (CSS)
export function project(x, y, z, v = cur) {
  const o = O[v], p = toV(o.M, x, y, z).add(o.root.position).project(camera), c = renderer.domElement;
  return [(p.x + 1) / 2 * c.clientWidth, (1 - p.y) / 2 * c.clientHeight];
}
export const three = () => ({ THREE, scene, camera, renderer });
// enquadra o(s) guarda-roupa(s) visível(is) no retângulo r = [x0, y0, x1, y1] (frações da tela)
export function fit(r, { az = 25, el = 10, fov = 28 } = {}) {
  const c = renderer.domElement, W = c.clientWidth, H = c.clientHeight;
  const pts = []; for (const k of [2, 4]) if (O[k].root.visible) { const M = O[k].M; for (const x of [-3, M.L + 3]) for (const y of [-3, M.D]) for (const z of [0, M.H]) pts.push([x, y, z, k]); }
  let cam = { az, el, fov, dist: 500, ty: 100, tx: 0 };
  for (let it = 0; it < 40; it++) {
    setCam(cam);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => { const [a, b] = project(...p); x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
    const tw = (r[2] - r[0]) * W, th = (r[3] - r[1]) * H, k = Math.max((x1 - x0) / tw, (y1 - y0) / th);
    const ex = ((r[0] + r[2]) / 2 * W - (x0 + x1) / 2), ey = ((r[1] + r[3]) / 2 * H - (y0 + y1) / 2);
    const cmPerPx = cam.dist * Math.tan(fov * Math.PI / 360) * 2 / H;
    cam.tx -= ex * cmPerPx / Math.cos(az * Math.PI / 180); cam.ty += ey * cmPerPx;
    cam.dist *= 0.5 + 0.5 * k;
    if (Math.abs(k - 1) < 0.002 && Math.abs(ex) < 0.5 && Math.abs(ey) < 0.5) break;
  }
  return cam;
}
