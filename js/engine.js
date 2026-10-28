// Motor 3D do site: monta qualquer peça do catálogo (linhas Antique, Modern e Raiz) e deixa o cliente
// girar, abrir portas e gavetas e trocar a madeira. As peças são as mesmas da documentação, em cm.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { make as cr } from './models/cr-model.mjs';
import { make as gr } from './models/gr-model.mjs';
import { make as rk } from './models/rk-model.mjs';
import { make as bf } from './models/bf-model.mjs';
import { MAKERS as MO } from './models/modern.mjs';
import { MAKERS as RA } from './models/raiz.mjs';
const MAKE = {
  cr1: () => cr(1), cr2: () => cr(2), cr4: () => cr(4), gr2: () => gr(2), gr4: () => gr(4),
  rk180: () => rk(180), rk140: () => rk(140), bf150: () => bf(150), bf110: () => bf(110),
  es: MO.es, mc: MO.mc, ap: MO.ap, pf40: MO.pf40, pf60: MO.pf60, pf90: MO.pf90, mj: RA.mj, bc: RA.bc, bg: RA.bg,
};
const MS = {};
export const getM = id => MS[id] || (MS[id] = MAKE[id]());
export const IDS = Object.keys(MAKE);

// ---------- madeira procedural ----------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function noise1(seed) { const r = rng(seed), g = Array.from({ length: 512 }, r); return x => { const i = Math.floor(x), f = x - i, a = g[i & 511], b = g[(i + 1) & 511]; const t = f * f * (3 - 2 * f); return a + (b - a) * t; }; }
const FIN = {
  mel: { base: '#CF9550', light: '#E2AE6C', dark: '#9C6230', streak: '#B87A3C' },
  cla: { base: '#BE9065', light: '#D3A97E', dark: '#8E6440', streak: '#A97C54' }, // cambará natural, sem tingidor
  rox: { base: '#6A2E44', light: '#82405A', dark: '#371222', streak: '#57233A' },  // roxinho
  mar: { base: '#DCC394', light: '#E9D5AC', dark: '#B39866', streak: '#C9AE7E' },  // pau-marfim
  fre: { base: '#A57C4C', light: '#BC925F', dark: '#6B4B2A', streak: '#90693D' },  // freijó
  imb: { base: '#3E2D1F', light: '#55402B', dark: '#1D140C', streak: '#33251A' },  // imbuia
  per: { base: '#BF8667', light: '#D09B7D', dark: '#88563D', streak: '#AC7657' },  // peroba-rosa
  cum: { base: '#87582F', light: '#9E6B3E', dark: '#4C2E15', streak: '#764C28' },  // cumaru
  nog: { base: '#553824', light: '#6A4831', dark: '#2A1A0F', streak: '#45301F' },
  jat: { base: '#4F2A1D', light: '#64382A', dark: '#230F09', streak: '#3E1F15' }, // jatobá: castanho-avermelhado escuro
};
export function woodCanvas(fin, seed, W = 1024) {
  const H = W, k0 = W / 1024, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), r = rng(seed * 31 + 7), n1 = noise1(seed), n2 = noise1(seed + 5);
  const F = FIN[fin];
  x.fillStyle = F.base; x.fillRect(0, 0, W, H);
  // faixas largas e suaves (diferença de tom entre as fibras)
  for (let i = 0; i < 26; i++) {
    const y = r() * H, h = (20 + r() * 90) * k0; x.globalAlpha = 0.10 + r() * 0.16;
    x.fillStyle = r() < 0.5 ? F.light : F.streak; x.fillRect(0, y, W, h);
  }
  // veios: linhas finas e onduladas, densas e irregulares
  const lines = 150;
  for (let i = 0; i < lines; i++) {
    const y0 = r() * H, amp = (3 + r() * 14) * k0, ph = r() * 50, k = 0.4 + r() * 1.4;
    x.globalAlpha = 0.05 + Math.pow(r(), 2.2) * 0.38;
    x.strokeStyle = r() < 0.85 ? F.dark : F.light; x.lineWidth = Math.max(0.5, (0.6 + Math.pow(r(), 3) * 3.2) * k0);
    x.beginPath();
    for (let u = -8; u <= W + 8; u += 8) {
      const y = y0 + (n1(u / k0 / 260 * k + ph) - 0.5) * amp * 2 + (n2(u / k0 / 70 + ph) - 0.5) * 2.2 * k0;
      u < 0 ? x.moveTo(u, y) : x.lineTo(u, y);
    }
    x.stroke();
    // repete deslocada para fechar a emenda vertical da textura
    x.save(); x.translate(0, y0 > H / 2 ? -H : H); x.stroke(); x.restore();
  }
  // poros: tracinhos curtos
  x.globalAlpha = 0.18; x.fillStyle = F.dark;
  for (let i = 0; i < 2600 * k0 * k0; i++) x.fillRect(r() * W, r() * H, (2 + r() * 7) * k0, 0.8 * k0);
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

// ---------- cena: qualquer peça da linha (id = 'cr1', 'cr2', 'cr4', 'gr2', 'gr4', 'rk180', 'rk140') ----------
const GRAIN3 = { x: 'x', y: 'z', z: 'y' };
let renderer, scene, camera, woodMats = {}, state = { fin: 'nog' }, cur = null;
const blackMat = new THREE.MeshStandardMaterial({ color: 0x1f1d20, roughness: 0.62, metalness: 0.05 });
const O = {};
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdfeeee, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.16, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide });
const ironMat = new THREE.MeshStandardMaterial({ color: 0x1b1a1a, metalness: 0.55, roughness: 0.42 });
const ironMat2 = new THREE.MeshStandardMaterial({ color: 0x1b1a1a, metalness: 0.55, roughness: 0.42, side: THREE.DoubleSide });
const compMat = new THREE.MeshStandardMaterial({ color: 0x4a3324, roughness: 0.85 });
const toV = (M, x, y, z) => new THREE.Vector3(x - M.L / 2, z, M.D / 2 - y);

function woodMat(fin, seed) {
  const k = fin + seed; if (woodMats[k]) return woodMats[k];
  const t = woodTex(fin, seed);
  return (woodMats[k] = new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.35, roughness: 0.46, metalness: 0 }));
}

let controls = null, floor = null, host = null, dirty = true, anim = null, openNow = 0;
// liga o motor num elemento da página (o canvas ocupa o elemento inteiro, fundo transparente)
export function init({ container, dpr = Math.min(2, window.devicePixelRatio || 1), fin = 'nog', interactive = true, preserve = false }) {
  state.fin = fin; host = container;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: preserve });
  renderer.setPixelRatio(dpr); renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  camera = new THREE.PerspectiveCamera(28, 1, 5, 5000);
  const key = new THREE.SpotLight(0xfff1e0, 16000, 0, Math.PI / 3.6, 0.55, 1.6);
  key.position.set(-110, 380, 260); key.target.position.set(0, 60, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.6; key.shadow.radius = 8;
  key.shadow.camera.near = 100; key.shadow.camera.far = 1000;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xdfe6ff, 0.6); rim.position.set(180, 160, -220); scene.add(rim);
  const fill = new THREE.HemisphereLight(0xfff4ea, 0x1d1c20, 0.3); scene.add(fill);
  floor = new THREE.Mesh(new THREE.CircleGeometry(700, 96), new THREE.ShadowMaterial({ opacity: 0.32 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  if (interactive) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
    controls.minPolarAngle = 0.15; controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.autoRotateSpeed = 0.9;
    controls.addEventListener('change', () => { dirty = true; });
  }
  resize();
  new ResizeObserver(() => resize()).observe(container);
  const loop = () => {
    requestAnimationFrame(loop);
    if (anim) { const t = Math.min(1, (performance.now() - anim.t0) / anim.ms); anim.step(t); if (t >= 1) anim = null; dirty = true; }
    if (controls) { controls.update(); if (controls.autoRotate) dirty = true; }
    if (dirty) { renderer.render(scene, camera); dirty = false; }
  };
  if (interactive) loop();
}
export function resize() {
  if (!renderer || !host) return;
  const w = host.clientWidth || 1, h = host.clientHeight || 1;
  renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
  camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true;
}
export const invalidate = () => { dirty = true; };
export function setAutoRotate(on) { if (controls) controls.autoRotate = on; dirty = true; }
// monta a peça na primeira vez que ela aparece
function ensure(id) { if (!O[id]) { O[id] = build(getM(id)); O[id].root.visible = false; O[id].contra = true; O[id].preto = false; setFinish(state.fin); } return O[id]; }
// mostra uma peça só, enquadrada; com assemble, ela se monta peça por peça (como no vídeo)
export function show(id, { assemble = true, az = 28, el = 14, rect = [0.08, 0.1, 0.92, 0.9], pose = {} } = {}) {
  ensure(id); setLayout([id]); openNow = pose.door ? 1 : 0;
  setPose({ id, build: 6, ...pose });
  const c = fit(rect, { az, el });
  if (controls) { controls.target.set(c.tx, c.ty, c.tz || 0); controls.minDistance = c.dist * 0.45; controls.maxDistance = c.dist * 1.8; controls.update(); }
  if (assemble) {
    const t0 = performance.now();
    anim = { t0, ms: 1700, step: t => setPose({ id, build: t * 6.2, ...pose }) };
    setPose({ id, build: 0, ...pose });
  }
  dirty = true; return c;
}
// abre portas e gavetas (0 a 1), animando a partir da posição atual
export function setOpen(k, id = cur) {
  const a = openNow, t0 = performance.now(); openNow = k;
  anim = { t0, ms: 650, step: t => { const e = t * t * (3 - 2 * t), v = a + (k - a) * e; setPose({ id, build: 6, door: v * 0.85, drawer: v * 0.9, latch: Math.min(1, v * 3) }); } };
}
export function setPreto(on, id = cur) { if (O[id]) O[id].preto = on; setFinish(state.fin); }
export const woods = () => Object.keys(FIN).filter(k => k !== 'mel');
function boxGeo(p) {
  const [x0, y0, z0, x1, y1, z1] = p.b;
  const sx = x1 - x0, sy = z1 - z0, sz = y1 - y0;
  if (p.cyl) { // cilindro no eixo p.cyl ('x', 'y' ou 'z' do projeto); true = x
    const a = p.cyl === true ? 'x' : p.cyl, len = { x: sx, y: sz, z: sy }[a], r = Math.min(...['x', 'y', 'z'].filter(k => k !== a).map(k => ({ x: sx, y: sz, z: sy }[k]))) / 2;
    const g = new THREE.CylinderGeometry(r, r, len, 24);
    if (a === 'x') g.rotateZ(Math.PI / 2); else if (a === 'y') g.rotateX(Math.PI / 2);
    return g;
  }
  if (p.bow) { // gravata-borboleta vista de cima: pontas largas (sx) e cintura estreita, comprida em y
    const w = sx / 2, d = sz / 2, c = w * 0.42, sh = new THREE.Shape();
    sh.moveTo(-w, -d); sh.lineTo(w, -d); sh.lineTo(c, 0); sh.lineTo(w, d); sh.lineTo(-w, d); sh.lineTo(-c, 0); sh.lineTo(-w, -d);
    const g = new THREE.ExtrudeGeometry(sh, { depth: sy, bevelEnabled: false });
    g.rotateX(-Math.PI / 2); g.translate(0, -sy / 2, 0); g.computeVertexNormals(); return g;
  }
  if (p.rr) { // cantos arredondados: p.rr = raio (todos) ou [frente-esq, frente-dir, trás-dir, trás-esq]
    const R = Array.isArray(p.rr) ? p.rr : [p.rr, p.rr, p.rr, p.rr], w = sx / 2, d = sz / 2, sh = new THREE.Shape();
    const [fl, fr, br, bl] = R;   // no desenho: y negativo = frente
    sh.moveTo(-w + fl, -d); sh.lineTo(w - fr, -d); if (fr) sh.quadraticCurveTo(w, -d, w, -d + fr);
    sh.lineTo(w, d - br); if (br) sh.quadraticCurveTo(w, d, w - br, d);
    sh.lineTo(-w + bl, d); if (bl) sh.quadraticCurveTo(-w, d, -w, d - bl);
    sh.lineTo(-w, -d + fl); if (fl) sh.quadraticCurveTo(-w, -d, -w + fl, -d);
    const b = 0.25, g = new THREE.ExtrudeGeometry(sh, { depth: sy - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.translate(0, -(sy - 2 * b) / 2, 0); g.computeVertexNormals(); return g;
  }
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
    if (p.m === 'vidro') mat = glassMat; else if (p.m === 'comp') mat = compMat;
    else applyUV(geo, GRAIN3[p.grain], [((i * 37) % 13) / 13, ((i * 53) % 7) / 7]);
    const mesh = new THREE.Mesh(geo, mat || woodMat(state.fin, 1 + (i % 4)));
    mesh.userData = { p, seed: 1 + (i % 4), wood: !mat, black: !!p.black };
    mesh.castShadow = p.m !== 'vidro'; mesh.receiveShadow = true;
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

// ---------- ferragens de época ----------
function wingShape(w, hIn, hOut) { // borboleta: estreita no eixo, larga na ponta
  const s = new THREE.Shape(); const r = 0.5;
  s.moveTo(0, -hIn / 2); s.lineTo(w - r, -hOut / 2); s.quadraticCurveTo(w, -hOut / 2, w, -hOut / 2 + r);
  s.lineTo(w, hOut / 2 - r); s.quadraticCurveTo(w, hOut / 2, w - r, hOut / 2); s.lineTo(0, hIn / 2); s.lineTo(0, -hIn / 2);
  return s;
}
function flagShape(w, h) { // dobradiça rústica: chapa com a ponta chanfrada
  const s = new THREE.Shape(); const c = 1.2;
  s.moveTo(0, -h / 2); s.lineTo(w - c, -h / 2); s.lineTo(w, -h / 2 + c); s.lineTo(w, h / 2 - c); s.lineTo(w - c, h / 2); s.lineTo(0, h / 2); s.lineTo(0, -h / 2);
  return s;
}
const screwHead = () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 16), ironMat); m.rotation.x = Math.PI / 2; return m; };
function argola(parent, pos) {
  const ros = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.3, 24), ironMat); ros.rotation.x = Math.PI / 2; ros.position.copy(pos); ros.castShadow = true; parent.add(ros);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.26, 10, 28), ironMat); ring.position.set(pos.x, pos.y - 1.9, pos.z + 0.45); ring.rotation.x = -0.25; ring.castShadow = true; parent.add(ring);
}
function concha(parent, pp, z) {
  const base = new THREE.Mesh(new RoundedBoxGeometry(9.5, 3.4, 0.22, 3, 0.6), ironMat); base.position.set(pp.x, z, pp.z); base.castShadow = true; parent.add(base);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 7.6, 24, 1, true, 0, Math.PI), ironMat2);
  cup.rotation.z = Math.PI / 2; cup.rotation.y = Math.PI / 2; cup.position.set(pp.x, z + 0.2, pp.z + 0.05); cup.castShadow = true; parent.add(cup);
  [-3.9, 3.9].forEach(dx => { const sh = screwHead(); sh.position.set(pp.x + dx, z, pp.z + 0.2); parent.add(sh); });
}
function buildIron(o) {
  const { M } = o, hw = M.hw, ex = { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.05, bevelSegments: 2 };
  M.DOORS.forEach((d, k) => {
    const dg = o.doorGs[k], toDoor = d.side === 'R' ? -1 : 1;
    M.HINGES.forEach(z => {
      for (const onDoor of [true, false]) {
        const shape = hw.hinge === 'flag' ? flagShape(onDoor ? 5.5 : 3.7, onDoor ? 5 : 6.5) : wingShape(3.9, 3.2, 7.4);
        const g = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, ex), ironMat); g.castShadow = true;
        const grp = new THREE.Group(); grp.add(g);
        const holes = hw.hinge === 'flag' ? (onDoor ? [[2.2, 1.5], [2.2, -1.5], [4.3, 0]] : [[2, 2.3], [2, -2.3]]) : [[2.6, 2.4], [2.6, -2.4], [1.2, 0]];
        holes.forEach(([u, v]) => { const sh = screwHead(); sh.position.set(u, v, 0.32); grp.add(sh); });
        grp.scale.x = onDoor ? toDoor : -toDoor;
        if (onDoor) { grp.position.set(0, z, -0.43); dg.add(grp); }
        else { const p = toV(M, d.hinge, -0.02, z); grp.position.set(p.x, z, p.z); o.root.add(grp); }
      }
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(hw.hinge === 'flag' ? 0.45 : 0.42, hw.hinge === 'flag' ? 0.45 : 0.42, hw.hinge === 'flag' ? 6.6 : 3.4, 20), ironMat); kn.castShadow = true;
      kn.position.set(0, z, 0); dg.add(kn);
    });
  });
  if (hw.latch === 'wood') M.LATCHES.forEach(l => {
    const p = toV(M, l.x, -0.6, l.z), piv = new THREE.Group(); piv.position.copy(p); o.root.add(piv);
    const geo = new RoundedBoxGeometry(1.8, 7, 1.1, 2, 0.3); applyUV(geo, 'y', [0.3, 0.2]);
    const bar = new THREE.Mesh(geo, woodMat(state.fin, 2)); bar.userData = { woodLatch: true }; bar.castShadow = true; piv.add(bar);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10), ironMat); pin.position.set(0, 0, 0.6); piv.add(pin);
    o.latches.push({ piv, bar, wood: true });
  });
  else M.LATCHES.forEach(l => {
    const parent = l.on ? o.doorGs[l.on - 1] : o.root;
    const lp = toV(M, l.px ?? (l.on ? l.x + 2 : 2), -0.15, l.z); if (l.on) lp.sub(parent.position);
    const plate = new THREE.Mesh(new RoundedBoxGeometry(2.6, 3.4, 0.25, 2, 0.3), ironMat); plate.position.set(lp.x, l.z, lp.z); plate.castShadow = true; parent.add(plate);
    const piv = new THREE.Group(); piv.position.set(lp.x, l.z, lp.z + 0.3); parent.add(piv);
    const bar = new THREE.Mesh(new RoundedBoxGeometry(5.2, 1.0, 0.3, 2, 0.25), ironMat); bar.position.set(2.2 * l.dir, 0, 0); bar.castShadow = true; piv.add(bar);
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), ironMat); pin.position.set(lp.x, l.z, lp.z + 0.55); parent.add(pin);
    o.latches.push({ piv, dir: l.dir });
  });
  M.PULLS.forEach(pl => {
    const dg = o.drawerGs[pl.drawer - 1];
    if (hw.pull === 'argola') argola(dg, toV(M, pl.x, -0.15, pl.z + 1)); else concha(dg, toV(M, pl.x, -0.12, pl.z), pl.z);
  });
  (M.DOOR_PULLS || []).forEach(pl => { const dg = o.doorGs[pl.door - 1]; argola(dg, toV(M, pl.x, -0.15, pl.z).sub(dg.position)); });
}

export function setFinish(fin) {
  state.fin = fin;
  for (const k in O) {
    O[k].parts3.forEach(m => {
      if (!m.userData.wood) return;
      const p = m.userData.p, f = O[k].fin || fin;
      m.material = p.black && O[k].preto ? blackMat : p.peg && O[k].contra ? woodMat(fin === 'cla' || fin === 'mar' ? 'nog' : 'cla', m.userData.seed) : woodMat(f, m.userData.seed);
    });
    O[k].latches.forEach(l => { if (l.wood) l.bar.material = woodMat(O[k].fin || fin, 2); });
  }
  dirty = true;
}
// contraste: cavilhas, cunhas, gravatas, ganchos e puxador em cambará claro (padrão) ou na mesma madeira do móvel ("discreta")
export function setContra(on, ids = Object.keys(O)) { (Array.isArray(ids) ? ids : [ids]).forEach(id => { if (O[id]) O[id].contra = on; }); setFinish(state.fin); }
// madeira fixa para uma peça (o gêmeo na outra madeira); null volta a seguir a madeira geral
export function setTwin(id, fin) { if (O[id]) O[id].fin = fin; setFinish(state.fin); }

// mostra as peças da lista lado a lado (na ordem dada), com espaço entre elas; as outras somem
export function setLayout(ids, { gap = 40, x = 0 } = {}) {
  for (const k in O) O[k].root.visible = false;
  ids.forEach(ensure);
  const ws = ids.map(id => getM(id).L), tot = ws.reduce((s, w) => s + w, 0) + gap * (ids.length - 1);
  let px = x - tot / 2;
  ids.forEach((id, i) => { O[id].root.visible = true; O[id].root.position.set(px + ws[i] / 2, 0, 0); O[id].root.rotation.y = 0; px += ws[i] + gap; });
  cur = ids[ids.length - 1];
}
export function setOffset(id, x, vis = true) { O[id].root.position.x = x; O[id].root.visible = vis; }
// posição livre: [[id, x, z (para a frente), giro em graus], ...]; as outras somem
export function place(list) {
  for (const k in O) { O[k].root.visible = false; O[k].root.position.set(0, 0, 0); O[k].root.rotation.y = 0; }
  list.forEach(([id, x, z = 0, rot = 0]) => { const r = O[id].root; r.visible = true; r.position.set(x, 0, z); r.rotation.y = rot * Math.PI / 180; });
  cur = list[list.length - 1][0];
}

const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
export function setPose({ id, build = 6, door = 0, drawer = 0, latch = 0, hide = [] } = {}) {
  for (const k of (id ? [id] : Object.keys(O))) {
    const o = O[k];
    o.parts3.forEach(m => {
      const p = m.userData.p, kk = ease(build - p.step), dist = 70 * (1 - kk);
      const e = p.ex, vv = new THREE.Vector3(e[0], e[2], -e[1]).normalize();
      m.position.copy(m.userData.home).addScaledVector(vv, dist);
      m.visible = kk > 0.001 && !hide.includes(p.g) && !hide.includes(p.id);
      if (p.m === 'vidro') m.visible = m.visible && kk > 0.3;
    });
    const kd = ease(build - 4);
    const isIron = c => !c.userData.p && !o.doorGs.includes(c) && !o.drawerGs.includes(c);
    [...o.doorGs, ...o.drawerGs].forEach(g => g.children.forEach(c => { if (isIron(c)) c.visible = kd > 0.6; }));
    o.root.children.forEach(c => { if (isIron(c)) c.visible = kd > 0.6; });
    const dz = (1 - kd) * 60, reach = o.M.D > 50 ? 30 : 24;
    o.doorGs.forEach((g, i) => { const a = Array.isArray(door) ? (door[i] || 0) : door; g.rotation.y = a * 1.75 * (g.userData.d.side === 'R' ? 1 : -1); g.position.z = g.userData.home.z + dz; });
    o.drawerGs.forEach((g, i) => { const a = Array.isArray(drawer) ? (drawer[i] || 0) : drawer; g.position.z = a * reach + dz; });
    o.latches.forEach(l => { l.piv.rotation.z = l.wood ? latch * Math.PI / 2 : -l.dir * latch * Math.PI / 2; });
  }
}

export function setCam({ az = 30, el = 12, dist = 430, ty = 92, tx = 0, tz = 0, fov = 28 } = {}) {
  const a = az * Math.PI / 180, e = el * Math.PI / 180;
  camera.fov = fov;
  camera.position.set(tx + dist * Math.sin(a) * Math.cos(e), ty + dist * Math.sin(e), tz + dist * Math.cos(a) * Math.cos(e));
  camera.lookAt(tx, ty, tz);
  const c = renderer.domElement; camera.aspect = c.width / c.height;
  camera.updateProjectionMatrix(); dirty = true;
  if (controls) { controls.target.set(tx, ty, tz); }
}
export function render() { renderer.render(scene, camera); }
export function project(x, y, z, id = cur) {
  const o = O[id], p = toV(o.M, x, y, z).add(o.root.position).project(camera), c = renderer.domElement;
  return [(p.x + 1) / 2 * c.clientWidth, (1 - p.y) / 2 * c.clientHeight];
}
// posição de um ponto do projeto (cm) da peça id no mundo three (para câmeras de detalhe)
export function world(x, y, z, id = cur) { const o = O[id], p = toV(o.M, x, y, z).add(o.root.position); return { x: p.x, y: p.y, z: p.z }; }
export const three = () => ({ THREE, scene, camera, renderer });
export function fit(r, { az = 25, el = 10, fov = 28 } = {}) {
  const c = renderer.domElement, W = c.clientWidth, H = c.clientHeight;
  const pts = []; for (const k in O) if (O[k].root.visible) { const M = O[k].M; for (const x of [-3, M.L + 3]) for (const y of [-3, M.D]) for (const z of [0, M.H]) pts.push([x, y, z, k]); }
  let cam = { az, el, fov, dist: 500, ty: 80, tx: 0 };
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
