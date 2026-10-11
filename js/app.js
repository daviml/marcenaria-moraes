// Site da Marcenaria Moraes: catálogo com todas as peças, ficha da peça, provador de madeiras em 3D e orçamento pelo WhatsApp.
import { LINES, PRODUCTS, WOODS, WHATSAPP, WHATSAPP_TXT } from './data.js';
import { make as cr } from './models/cr-model.mjs';
import { make as gr } from './models/gr-model.mjs';
import { make as rk } from './models/rk-model.mjs';
import { make as bf } from './models/bf-model.mjs';
import { MAKERS as MO } from './models/modern.mjs';
import { MAKERS as RA } from './models/raiz.mjs';

const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const f1 = n => String(Math.round(n * 10) / 10).replace('.', ',');

// medidas de cada versão, direto do projeto 3D
const MAKE = { cr1: () => cr(1), cr2: () => cr(2), cr4: () => cr(4), gr2: () => gr(2), gr4: () => gr(4), rk180: () => rk(180), rk140: () => rk(140), bf150: () => bf(150), bf110: () => bf(110), ...MO, ...RA };
const MODELS = {};
const model = id => MODELS[id] || (MODELS[id] = MAKE[id]());
const prodById = id => PRODUCTS.find(p => p.id === id);
const lineById = id => LINES.find(l => l.id === id);
const woodById = id => WOODS.find(w => w.id === id);
const imgOf = vid => `assets/img/pecas/${vid}.webp`;
const canOpen = vid => { const M = model(vid); return (M.DOORS?.length || 0) + (M.DRAWERS?.length || 0) > 0; };
const dimsHTML = vid => { const M = model(vid), tbl = ['mj', 'bc', 'bg', 'es', 'mc', 'ap'].includes(vid); return `<div><b>${f1(M.L)}</b><span>${tbl ? 'comprimento' : 'largura'}</span></div><div><b>${f1(M.D)}</b><span>profundidade</span></div><div><b>${f1(M.H)}</b><span>altura · cm</span></div>`; };

// ---------- WhatsApp ----------
const wa = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const HELLO = 'Olá, Davi! Vi o site da Marcenaria Moraes e quero conversar sobre um móvel.';
function quoteText({ prod, vid, wood, preto, contra, nome, cidade, medida, msg }) {
  const p = prodById(prod), v = p && p.variants.find(x => x.id === vid), lines = [];
  lines.push(`Olá, Davi!${nome ? ` Aqui é ${nome}.` : ''} Vi o site da Marcenaria Moraes e quero um orçamento.`);
  lines.push('');
  if (p) lines.push(`• Peça: ${p.name}${v && p.variants.length > 1 ? ` (${v.label})` : ''}`); else lines.push('• Peça: sob medida / outra');
  if (wood) lines.push(`• Madeira: ${woodById(wood)?.name || wood}`);
  if (p?.opts.includes('preto') && preto != null) lines.push(`• Detalhes pretos: ${preto ? 'sim' : 'não'}`);
  if (p?.opts.includes('contra') && contra != null) lines.push(`• Cavilhas e gravatas: ${contra ? 'claras (contraste)' : 'na mesma madeira'}`);
  if (medida) lines.push(`• Medida: ${medida}`);
  if (cidade) lines.push(`• Cidade: ${cidade}`);
  if (msg) { lines.push(''); lines.push(msg); }
  return lines.join('\n');
}
['#waFloat', '#waDirect', '#footWa'].forEach(s => { const a = $(s); if (a) a.href = wa(HELLO); });
$('#waNum').textContent = WHATSAPP_TXT;
$('#year').textContent = new Date().getFullYear();

// ---------- abertura ----------
const t0 = performance.now();
addEventListener('load', () => setTimeout(() => $('#intro').classList.add('done'), Math.max(0, (reduce ? 0 : 1100) - (performance.now() - t0))));
setTimeout(() => $('#intro').classList.add('done'), 3500);

// ---------- título palavra a palavra ----------
$$('[data-split]').forEach(el => {
  let i = 0; el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span style="--i:${i++}">${w}</span></span>`).join(' ');
  requestAnimationFrame(() => setTimeout(() => el.classList.add('in'), reduce ? 0 : 700));
});

// ---------- revelar ao rolar, contadores ----------
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  $$('[data-count]', e.target).forEach(countUp);
}), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
function observe(root = document) {
  $$('.reveal', root).forEach(el => {
    const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(sib.indexOf(el), 6) * 0.08}s`); io.observe(el);
  });
}
function countUp(el) {
  const to = +el.dataset.count, suf = el.dataset.suffix || '', t = performance.now(), ms = reduce ? 1 : 1400;
  const tick = () => { const k = Math.min(1, (performance.now() - t) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(tick); };
  tick();
}

// ---------- navegação, barra de progresso, passos ----------
const nav = $('#nav'), prog = $('#progress'), fill = $('#stepsFill'), steps = $('#steps'), waF = $('#waFloat');
const secs = ['linhas', 'provador', 'como', 'sobre', 'duvidas'].map(id => document.getElementById(id));
function onScroll() {
  const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('solid', y > 30);
  prog.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
  waF.classList.toggle('show', y > innerHeight * 0.6);
  const r = steps.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.2)));
  fill.style.transform = `scaleX(${k})`;
  let on = null; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) on = s.id; });
  $$('.menu a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + on));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const burger = $('#burger'), menu = $('#menu');
burger.onclick = () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; };
$$('.menu a').forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); document.body.style.overflow = ''; }));

// ---------- botões magnéticos e brilho ----------
function magnet(root = document) {
  if (!fine) return;
  $$('.magnet, .btn', root).forEach(b => {
    if (b.dataset.mg) return; b.dataset.mg = 1;
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; b.style.setProperty('--mx', x + 'px'); b.style.setProperty('--my', y + 'px'); if (b.classList.contains('magnet')) { b.style.setProperty('--bx', (x - r.width / 2) * 0.18 + 'px'); b.style.setProperty('--by', (y - r.height / 2) * 0.25 + 'px'); } });
    b.addEventListener('mouseleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
  });
}

// ---------- hero: vitrine das linhas e inclinação com o mouse ----------
const slides = $$('#heroSlides figure'), dots = $('#heroDots');
let si = 0, sTimer;
slides.forEach((_, i) => { const b = h('button', { type: 'button', 'aria-label': `Linha ${i + 1}` }); b.onclick = () => goSlide(i, true); dots.appendChild(b); });
function goSlide(i, user) { si = (i + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('on', k === si)); $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === si)); if (user) restart(); }
function restart() { clearInterval(sTimer); if (!reduce) sTimer = setInterval(() => goSlide(si + 1), 4200); }
goSlide(0); restart();
const art = $('#heroArt'), card = $('.hero-card', art);
if (fine && !reduce) {
  art.addEventListener('mousemove', e => { const r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; $$('.chip-float', art).forEach((c, i) => c.style.translate = `${x * (14 + i * 8)}px ${y * (14 + i * 8)}px`); });
  art.addEventListener('mouseleave', () => { card.style.transform = ''; $$('.chip-float', art).forEach(c => c.style.translate = ''); });
}

// ---------- faixa corrida ----------
const mq = ['Madeira maciça', 'Feito à mão', 'Nogueira', 'Jatobá', 'Sob encomenda', 'Roxinho', 'Uberlândia-MG', 'Imbuia', 'Ferragens de época', 'Tampo de 5 cm', 'Freijó', 'Nada de MDF'];
$('#marquee').innerHTML = [...mq, ...mq].map(t => `<span>${t}</span>`).join('');

// ---------- catálogo: todas as peças num grid, com filtro por linha e por ambiente ----------
const AMB = { cr: 'Sala de jantar', bf: 'Sala de jantar', mj: 'Sala de jantar', bc: 'Sala de jantar', gr: 'Quarto', rk: 'Sala de estar', mc: 'Sala de estar', es: 'Escritório', ap: 'Hall e entrada', bg: 'Área gourmet' };
const AMBS = [...new Set(PRODUCTS.map(p => AMB[p.id]))];
const grid = $('#grid'), tabs = $('#lineTabs'), ink = $('#tabInk'), rooms = $('#rooms'), banner = $('#lineBanner'), count = $('#count');
const flt = { line: 'all', amb: 'all' };
const sizeTxt = p => p.variants.length > 1 ? p.variants.map(v => v.label.split(' · ')[0]).join(' · ') : (() => { const M = model(p.variants[0].id); return `${M.L} × ${M.D} × ${M.H} cm`; })();
[['all', 'Todas', PRODUCTS.length], ...LINES.map(L => [L.id, L.name, PRODUCTS.filter(p => p.line === L.id).length])].forEach(([id, name, n], i) => {
  const t = h('button', { class: 'tab', type: 'button', 'data-line': id, 'aria-pressed': i === 0 }, `${name}<small>${n}</small>`);
  t.onclick = () => { flt.line = id; applyFilter(); }; tabs.appendChild(t);
});
['all', ...AMBS].forEach((a, i) => {
  const b = h('button', { class: 'room', type: 'button', 'data-amb': a, 'aria-pressed': i === 0 }, a === 'all' ? 'Todos os ambientes' : a);
  b.onclick = () => { flt.amb = a; applyFilter(); }; rooms.appendChild(b);
});
grid.innerHTML = PRODUCTS.map(p => { const L = lineById(p.line); return `
  <article class="card" data-prod="${p.id}" data-line="${p.line}" data-amb="${AMB[p.id]}">
    <button class="card-hit" type="button" aria-label="${p.name}: ver detalhes"></button>
    <span class="card-line l-${p.line}">${L.name}</span>
    <div class="card-img"><img src="${imgOf(p.variants[0].id)}" alt="" loading="lazy"></div>
    <div class="card-body">
      <span class="card-room">${AMB[p.id]}</span>
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
      <div class="card-size">${sizeTxt(p)}</div>
      <div class="card-actions">
        <span class="card-more">Ver detalhes <i class="arr">→</i></span>
        <button class="card-try" type="button" data-try="${p.id}" title="Provar madeiras em 3D">Provar madeiras</button>
      </div>
    </div>
  </article>`; }).join('');
function applyFilter() {
  $$('.tab', tabs).forEach(t => t.setAttribute('aria-pressed', t.dataset.line === flt.line));
  // ambientes sem peça na linha escolhida ficam apagados
  $$('.room', rooms).forEach(b => { const a = b.dataset.amb, has = a === 'all' || PRODUCTS.some(p => AMB[p.id] === a && (flt.line === 'all' || p.line === flt.line)); b.disabled = !has; b.setAttribute('aria-pressed', a === flt.amb); });
  if (flt.amb !== 'all' && $(`.room[data-amb="${flt.amb}"]`, rooms).disabled) { flt.amb = 'all'; $$('.room', rooms).forEach(b => b.setAttribute('aria-pressed', b.dataset.amb === 'all')); }
  moveInk();
  // FLIP: guarda a posição antes, filtra, anima até a posição nova
  const cards = $$('.card', grid), before = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
  let n = 0;
  cards.forEach(c => { const show = (flt.line === 'all' || c.dataset.line === flt.line) && (flt.amb === 'all' || c.dataset.amb === flt.amb); c.hidden = !show; if (show) n++; });
  count.textContent = `${n} ${n === 1 ? 'peça' : 'peças'}${flt.line !== 'all' ? ` da linha ${lineById(flt.line).name}` : ''}${flt.amb !== 'all' ? ` para ${flt.amb.toLowerCase()}` : ''}`;
  if (!reduce) cards.filter(c => !c.hidden).forEach((c, i) => {
    const a = before.get(c), b = c.getBoundingClientRect();
    if (a.width) c.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.1,1)' });
    else c.animate([{ opacity: 0, transform: 'translateY(24px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: i * 40, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'backwards' });
  });
  // faixa da linha escolhida
  const L = lineById(flt.line);
  banner.hidden = !L;
  if (L) banner.innerHTML = `<div class="lb-txt"><span class="line-kicker">${L.kicker}</span><h3 class="lb-name">Linha ${L.name}</h3><p>${L.lead}</p><div class="marks">${L.marks.map(m => `<span class="mark">${m}</span>`).join('')}</div></div>
    <button class="lb-video" type="button" data-video="${L.video}" data-poster="${L.img}"><img src="${L.img}" alt=""><span><i>▶</i>Assistir ao vídeo da linha</span></button>`;
}
function moveInk() { const t = $('.tab[aria-pressed="true"]', tabs); if (!t) return; ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; }
addEventListener('resize', moveInk); setTimeout(moveInk, 60); document.fonts?.ready.then(moveInk);
applyFilter();
grid.addEventListener('click', e => {
  const tr = e.target.closest('[data-try]'); if (tr) { setProvador(tr.dataset.try); document.getElementById('provador').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
  const c = e.target.closest('.card'); if (c) openSheet(c.dataset.prod);
});
// cartões: inclinam de leve com o mouse
if (fine && !reduce) $$('.card', grid).forEach(c => {
  c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty('--ry', (x - 0.5) * 6 + 'deg'); c.style.setProperty('--rx', (0.5 - y) * 5 + 'deg'); c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); });
  c.addEventListener('mouseleave', () => { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); });
});
// vídeo da linha numa janela
const vbox = $('#vbox');
banner.addEventListener('click', e => { const b = e.target.closest('[data-video]'); if (!b) return; const v = $('video', vbox); v.poster = b.dataset.poster; v.src = b.dataset.video; vbox.hidden = false; document.body.style.overflow = 'hidden'; v.addEventListener('loadedmetadata', () => { v.currentTime = 3.4; }, { once: true }); v.play().catch(() => {}); $('.sheet-x', vbox).focus(); });
function closeVideo() { if (vbox.hidden) return; const v = $('video', vbox); v.pause(); v.removeAttribute('src'); v.load(); vbox.hidden = true; document.body.style.overflow = ''; }
$$('[data-vclose]', vbox).forEach(b => b.addEventListener('click', closeVideo));
addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

// ---------- ficha da peça ----------
const sheet = $('#sheet');
let shState = { prod: null, vi: 0 }, lastFocus = null;
function openSheet(pid, vi = 0) {
  const p = prodById(pid), L = lineById(p.line); shState = { prod: pid, vi };
  lastFocus = document.activeElement;
  $('#shLine').textContent = `Linha ${L.name} · ${p.room}`;
  $('#shName').textContent = p.name; $('#shTag').textContent = p.tagline; $('#shAbout').textContent = p.about;
  $('#shHl').innerHTML = p.highlights.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('');
  $('#shSpecs').innerHTML = `<dt>Madeira</dt><dd>Nogueira (cambará tingido) ou jatobá. Outras sob consulta</dd><dt>Prazo</dt><dd>${p.prazo}, sob encomenda</dd><dt>Feito</dt><dd>À mão, em Uberlândia-MG</dd><dt>Valor</dt><dd>Sob consulta · orçamento grátis</dd>`;
  const vs = $('#shVar'); vs.innerHTML = ''; vs.hidden = p.variants.length < 2;
  p.variants.forEach((v, i) => { const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': i === vi }, v.label); b.onclick = () => { shState.vi = i; $$('.chip', vs).forEach((c, k) => c.setAttribute('aria-pressed', k === i)); fillSheetVariant(); }; vs.appendChild(b); });
  fillSheetVariant();
  sheet.hidden = false; sheet.classList.remove('closing'); document.body.style.overflow = 'hidden';
  $('.sheet-card', sheet).scrollTop = 0; magnet(sheet);
  setTimeout(() => $('.sheet-x', sheet).focus(), 50);
}
function fillSheetVariant() {
  const p = prodById(shState.prod), v = p.variants[shState.vi];
  $('#shDims').innerHTML = dimsHTML(v.id);
  $('#shQuote').href = wa(quoteText({ prod: p.id, vid: v.id, wood: 'nog' }));
  const media = [{ t: 'img', src: imgOf(v.id), main: 1 }, ...p.imgs.map(src => ({ t: 'img', src, photo: 1 })), { t: 'video', src: p.video, poster: imgOf(v.id) }];
  const th = $('#shThumbs'); th.innerHTML = '';
  media.forEach((m, i) => { const b = h('button', { type: 'button', class: 'thumb' + (m.t === 'video' ? ' vid' : ''), 'aria-label': m.t === 'video' ? 'Vídeo' : `Imagem ${i + 1}`, 'aria-current': i === 0 }, `<img src="${m.poster || m.src}" alt="" loading="lazy">`); b.onclick = () => showMedia(m, b); th.appendChild(b); });
  showMedia(media[0], th.firstChild);
}
function showMedia(m, btn) {
  $$('.thumb', sheet).forEach(t => t.setAttribute('aria-current', t === btn));
  const box = $('#shMain');
  box.innerHTML = m.t === 'video' ? `<video src="${m.src}" poster="${m.poster}" controls autoplay playsinline></video>` : `<img src="${m.src}" alt="${prodById(shState.prod).name}" class="${m.photo ? 'photo' : ''}">`;
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.classList.add('closing'); $$('video', sheet).forEach(v => v.pause());
  setTimeout(() => { sheet.hidden = true; $('#shMain').innerHTML = ''; document.body.style.overflow = ''; lastFocus?.focus(); }, reduce ? 0 : 330);
}
$$('[data-close]', sheet).forEach(b => b.addEventListener('click', closeSheet));
addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSheet();
  if (e.key === 'Tab' && !sheet.hidden) { const f = $$('button, a[href], video', $('.sheet-card', sheet)).filter(x => x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
});
$('#shTry').onclick = () => { const { prod, vi } = shState; closeSheet(); setTimeout(() => { setProvador(prod, vi); document.getElementById('provador').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 200); };

// ---------- amostras de madeira (desenhadas pelo mesmo gerador do 3D) ----------
const FALLBACK = { nog: '#553824', jat: '#4F2A1D', imb: '#3E2D1F', rox: '#6A2E44', cum: '#87582F', per: '#BF8667', fre: '#A57C4C', cla: '#BE9065', mar: '#DCC394' };
const swatchURL = {};
$$('.sw[data-wood]').forEach(s => s.style.background = FALLBACK[s.dataset.wood]);
let E = null;
const engineReady = import('./engine.js').then(mod => {
  E = mod;
  WOODS.forEach(w => { swatchURL[w.id] = E.woodCanvas(w.id, 3, 192).toDataURL('image/jpeg', 0.85); });
  $$('[data-wood]').forEach(s => { if (swatchURL[s.dataset.wood]) s.style.backgroundImage = `url(${swatchURL[s.dataset.wood]})`; });
  return mod;
});

// ---------- provador ----------
const st = { prod: 'bf', vi: 0, wood: 'nog', preto: false, contra: true, open: false };
const sel = $('#pPiece');
LINES.forEach(L => { const g = h('optgroup', { label: `Linha ${L.name}` }); PRODUCTS.filter(p => p.line === L.id).forEach(p => g.appendChild(h('option', { value: p.id }, p.name))); sel.appendChild(g); });
const wbox = $('#pWood');
WOODS.forEach(w => { const b = h('button', { type: 'button', class: 'swatch', role: 'radio', 'aria-checked': w.id === st.wood, 'aria-label': w.name, 'data-wood': w.id }, `<span class="tip">${w.name}</span>`); b.style.background = FALLBACK[w.id]; b.onclick = () => setWood(w.id); wbox.appendChild(b); });
wbox.addEventListener('keydown', e => { if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return; e.preventDefault(); const i = WOODS.findIndex(w => w.id === st.wood), n = (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + WOODS.length) % WOODS.length; setWood(WOODS[n].id); $(`[data-wood="${WOODS[n].id}"]`, wbox).focus(); });
let started = false, hintT;
const stage = $('#stage');
function startEngine() {
  if (started) return; started = true;
  engineReady.then(() => {
    E.init({ container: stage, fin: st.wood });
    renderProvador(true);
    $('#stageLoading').classList.add('off');
    stage.addEventListener('pointerdown', () => { $('#stageHint').classList.add('off'); E.setAutoRotate(false); $('#tRotate').setAttribute('aria-pressed', 'false'); }, { once: false });
  }).catch(err => { $('#stageLoading').innerHTML = 'O 3D não abriu neste aparelho. Veja as fotos no catálogo.'; console.error(err); });
}
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { startEngine(); o.disconnect(); } }, { rootMargin: '300px' }).observe(stage);
function vid() { return prodById(st.prod).variants[st.vi].id; }
function renderProvador(assemble) {
  const p = prodById(st.prod), v = vid();
  sel.value = p.id;
  const vb = $('#pVar'); vb.innerHTML = ''; $('#pVarWrap').hidden = p.variants.length < 2;
  p.variants.forEach((x, i) => { const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': i === st.vi }, x.label); b.onclick = () => { st.vi = i; renderProvador(true); }; vb.appendChild(b); });
  $('#sOpenWrap').hidden = !canOpen(v); $('#sPretoWrap').hidden = !p.opts.includes('preto'); $('#sContraWrap').hidden = !p.opts.includes('contra');
  if (!canOpen(v)) st.open = false;
  $('#sOpen').checked = st.open; $('#sPreto').checked = st.preto; $('#sContra').checked = st.contra;
  $('#pDims').innerHTML = dimsHTML(v);
  $('#stageTag').innerHTML = `<small>Linha ${lineById(p.line).name}</small>${p.name}`;
  updateWoodInfo(); updateQuote();
  if (!E || !started) return;
  E.show(v, { assemble: assemble && !reduce, pose: st.open ? { door: 0.85, drawer: 0.9, latch: 1 } : {} });
  E.setPreto(st.preto && p.opts.includes('preto'), v); E.setContra(st.contra, v);
}
function setProvador(pid, vi = 0) { st.prod = pid; st.vi = vi; st.open = false; renderProvador(true); }
function setWood(id) { st.wood = id; $$('.swatch', wbox).forEach(b => b.setAttribute('aria-checked', b.dataset.wood === id)); updateWoodInfo(); updateQuote(); if (E && started) E.setFinish(id); }
function updateWoodInfo() { const w = woodById(st.wood); $('#pWoodName').textContent = w.name; $('#pWoodNote').textContent = w.note + (w.main ? '' : ' Sob consulta.'); }
function updateQuote() { $('#pQuote').href = wa(quoteText({ prod: st.prod, vid: vid(), wood: st.wood, preto: st.preto, contra: st.contra })); }
sel.onchange = () => setProvador(sel.value);
$('#sOpen').onchange = e => { st.open = e.target.checked; if (E && started) E.setOpen(st.open ? 1 : 0, vid()); };
$('#sPreto').onchange = e => { st.preto = e.target.checked; updateQuote(); if (E && started) E.setPreto(st.preto, vid()); };
$('#sContra').onchange = e => { st.contra = e.target.checked; updateQuote(); if (E && started) E.setContra(st.contra, vid()); };
$('#tAssemble').onclick = () => { st.open = false; renderProvador(true); };
$('#tRotate').onclick = e => { const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', on); E?.setAutoRotate(on); };
$('#tShot').onclick = () => {
  if (!E || !started) return; E.render();
  const c = $('canvas', stage), out = document.createElement('canvas'); out.width = c.width; out.height = c.height;
  const x = out.getContext('2d'), g = x.createRadialGradient(out.width / 2, out.height * 0.62, 10, out.width / 2, out.height * 0.62, out.width * 0.7);
  g.addColorStop(0, '#6B6670'); g.addColorStop(0.45, '#3A3540'); g.addColorStop(1, '#1B171D'); x.fillStyle = g; x.fillRect(0, 0, out.width, out.height); x.drawImage(c, 0, 0);
  x.fillStyle = 'rgba(243,236,239,.85)'; x.font = `${Math.round(out.width / 46)}px "Young Serif", serif`; x.fillText(`${prodById(st.prod).name} · ${woodById(st.wood).name}`, out.width * 0.04, out.height * 0.95);
  const a = h('a', { download: `marcenaria-moraes-${st.prod}-${st.wood}.png`, href: out.toDataURL('image/png') }); a.click(); toast('Imagem salva');
};
renderProvador(false);

// ---------- orçamento ----------
const fP = $('#fPeca'), fV = $('#fVar'), fM = $('#fMadeira'), bubble = $('#bubble'), form = $('#form');
LINES.forEach(L => { const g = h('optgroup', { label: `Linha ${L.name}` }); PRODUCTS.filter(p => p.line === L.id).forEach(p => g.appendChild(h('option', { value: p.id }, p.name))); fP.appendChild(g); });
fP.appendChild(h('option', { value: '' }, 'Outra peça / sob medida'));
WOODS.forEach(w => fM.appendChild(h('option', { value: w.id }, w.name + (w.main ? '' : ' (sob consulta)'))));
fM.appendChild(h('option', { value: '' }, 'Ainda não sei'));
function fillVar() { const p = prodById(fP.value); fV.innerHTML = ''; (p ? p.variants : [{ id: '', label: '—' }]).forEach(v => fV.appendChild(h('option', { value: v.id }, v.label))); fV.disabled = !p || p.variants.length < 2; }
function formData() { const d = Object.fromEntries(new FormData(form)); return { prod: d.peca, vid: d.versao || fV.value, wood: d.madeira, nome: d.nome?.trim(), cidade: d.cidade?.trim(), medida: d.medida?.trim(), msg: d.msg?.trim() }; }
function preview() { bubble.textContent = quoteText(formData()); bubble.classList.add('pop'); clearTimeout(bubble._t); bubble._t = setTimeout(() => bubble.classList.remove('pop'), 160); }
fP.onchange = () => { fillVar(); preview(); };
form.addEventListener('input', preview);
form.addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#fNome'); if (!n.value.trim()) { n.parentElement.classList.remove('err'); void n.offsetWidth; n.parentElement.classList.add('err'); n.focus(); toast('Coloque seu nome para eu saber com quem estou falando'); return; }
  n.parentElement.classList.remove('err');
  window.open(wa(quoteText(formData())), '_blank', 'noopener');
});
fP.value = 'bf'; fillVar(); fM.value = 'nog'; preview();
// do provador para o formulário: botão "pedir orçamento" da ficha preenche também
$('#shQuote').addEventListener('click', () => { fP.value = shState.prod; fillVar(); fV.value = prodById(shState.prod).variants[shState.vi].id; preview(); });
$('#pQuote').addEventListener('click', () => { fP.value = st.prod; fillVar(); fV.value = vid(); fM.value = st.wood; preview(); });

// ---------- aviso rápido ----------
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2600); }

observe(); magnet();
