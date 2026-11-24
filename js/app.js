// menu content lives in data/menu.json (loaded at the bottom of this file)
let DATA = [], GROUPS = [], HALLS = [];
let L = 'ar';
try { L = localStorage.getItem('murad-lang') || 'ar'; } catch (e) {}
const $ = s => document.querySelector(s);
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = p => p ? p.toLocaleString('en-US') + (L === 'ar' ? ' د.ع' : ' IQD') : (L === 'ar' ? 'حسب الطلب' : 'On request');
const nm = o => L === 'ar' ? o.ar : (o.en || o.ar), alt = o => L === 'ar' ? o.en : o.ar;

function setLang(l) {
  L = l; try { localStorage.setItem('murad-lang', l); } catch (e) {}
  document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar]').forEach(el => el.innerHTML = el.dataset[l]);
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === l));
  $('#lbtn').textContent = l === 'ar' ? 'EN' : 'ع';
  $('#q').placeholder = l === 'ar' ? 'دوّر على طبق…' : 'Search a dish…';
  render(); halls();
}
function tiles() {
  $('#tiles').innerHTML = GROUPS.map((g, i) => {
    const pick = g.tile;
    const sec = DATA.find(s => s.ar === pick) || DATA.find(s => s.g === g.k); const img = sec && sec.c;
    return `<button class="tile" data-g="${g.k}"><img src="${img || ''}" alt="" loading="lazy"><span>${esc(L === 'ar' ? g.ar : g.en)}<small>${esc(L === 'ar' ? g.sa : g.se)}</small></span></button>`;
  }).join('');
  document.querySelectorAll('.tile').forEach(t => t.onclick = () => openMenu('g-' + t.dataset.g));
}
function itemHTML(s, si, it, ii) {
  const d = L === 'ar' ? it.d : (it.de || it.d);
  return `<button class="item${it.s ? ' sig' : ''}" data-k="${si}|${ii}">${it.i ? `<img src="${it.i}" alt="" loading="lazy">` : ''}<div class="t"><div class="nm">${esc(nm(it))}</div><div class="alt">${esc(alt(it))}</div>${!s.compact && d ? `<div class="ds">${esc(d)}</div>` : ''}<div class="row2"><span class="price${it.p ? '' : ' ask'}">${fmt(it.p)}</span>${it.s ? `<span class="badge">${L === 'ar' ? 'توقيع مراد' : 'Signature'}</span>` : ''}</div></div></button>`;
}
function render() {
  tiles();
  const q = ($('#q').value || '').trim().toLowerCase();
  let html = '', chips = '', shown = 0, lastG = '';
  // best sellers: items flagged "best": true, shown first (hidden while searching to avoid duplicates)
  const best = q ? [] : DATA.flatMap((s, si) => s.items.map((it, ii) => [s, si, it, ii]).filter(x => x[2].best));
  if (best.length) {
    chips += `<button class="chip" data-s="best">${L === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</button>`;
    html += `<section id="best"><div class="sec-h"><h2>${L === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</h2><small>${L === 'ar' ? 'Best Sellers' : 'الأكثر مبيعاً'}</small></div>` +
      best.map(([s, si, it, ii]) => itemHTML(s, si, it, ii)).join('') + '</section>';
  }
  DATA.forEach((s, si) => {
    const its = s.items.filter(it => !q || (it.ar + ' ' + it.en).toLowerCase().includes(q));
    if (!its.length) return;
    shown += its.length;
    if (s.g !== lastG) { const g = GROUPS.find(x => x.k === s.g); html += `<div class="group-h" id="g-${s.g}">${esc(L === 'ar' ? g.ar : g.en.toUpperCase())}</div>`; lastG = s.g; }
    chips += `<button class="chip" data-s="s${si}">${esc(nm(s))}</button>`;
    html += `<section id="s${si}" class="${s.compact ? 'compact' : ''}"><div class="sec-h"><h2>${esc(nm(s))}</h2><small>${esc(alt(s))}</small></div>` +
      its.map(it => itemHTML(s, si, it, s.items.indexOf(it))).join('') + '</section>';
  });
  $('#list').innerHTML = html; $('#chips').innerHTML = chips; $('#empty').style.display = shown ? 'none' : 'block';
  document.querySelectorAll('.chip').forEach(c => c.onclick = () => { const el = document.getElementById(c.dataset.s); window.scrollTo({top: el.offsetTop - 112, behavior: 'smooth'}); });
  document.querySelectorAll('.item').forEach(b => b.onclick = () => sheet(b.dataset.k));
  spy();
}
let obs;
function spy() {
  if (obs) obs.disconnect();
  obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.s === e.target.id));
    const on = document.querySelector('.chip.on'); if (on) on.scrollIntoView({inline: 'center', block: 'nearest', behavior: 'smooth'});
  }}), {rootMargin: '-130px 0px -65% 0px'});
  document.querySelectorAll('section').forEach(s => obs.observe(s));
}
function sheet(k) {
  const [si, ii] = k.split('|').map(Number); const s = DATA[si], it = s.items[ii];
  const d = L === 'ar' ? it.d : (it.de || it.d);
  $('#sheet').innerHTML = `<div class="grab"></div><button class="close" id="x" aria-label="close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>${it.i ? `<img class="ph" src="${it.i}" alt="">` : '<div style="height:40px"></div>'}<div class="bd"><div class="nm">${esc(nm(it))}</div><div class="alt">${esc(alt(it))} · ${esc(nm(s))}</div>${d ? `<div class="ds">${esc(d)}</div>` : ''}<div class="row2"><span class="price${it.p ? '' : ' ask'}">${fmt(it.p)}</span>${it.s ? `<span class="badge">${L === 'ar' ? 'توقيع مراد' : 'Signature'}</span>` : ''}</div></div>`;
  document.body.classList.add('open'); $('#x').onclick = closeSheet;
}
function closeSheet() { document.body.classList.remove('open'); }
function openMenu(target) {
  document.body.classList.add('menu-open'); history.pushState({m: 1}, '');
  requestAnimationFrame(() => { const el = target && document.getElementById(target); window.scrollTo({top: el ? el.offsetTop - 112 : 0}); });
}
$('#veil').onclick = closeSheet;
$('#all').onclick = () => openMenu();
$('#back').onclick = () => history.back();
window.onpopstate = () => { closeSheet(); document.body.classList.remove('menu-open'); const f = document.querySelector('.finale'); window.scrollTo(0, f ? f.offsetTop : 0); };
document.querySelectorAll('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
$('#lbtn').onclick = () => setLang(L === 'ar' ? 'en' : 'ar');
$('#sbtn').onclick = () => { $('#search').classList.toggle('on'); if ($('#search').classList.contains('on')) $('#q').focus(); else { $('#q').value = ''; render(); } };
$('#q').oninput = () => { render(); window.scrollTo({top: 0}); };
window.addEventListener('scroll', () => $('#totop').classList.toggle('on', document.body.classList.contains('menu-open') && scrollY > 900), {passive: true});
$('#totop').onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
/* ---------- cinematic landing ---------- */
function halls() {
  $('#rail').innerHTML = HALLS.map((h, i) => `<div class="hall${i ? '' : ' on'}" data-i="${i}"><video data-src="v/${h.v}.mp4" poster="v/${h.v}.jpg" muted playsinline loop preload="none"></video><span class="no">0${i + 1}</span><div class="cap"><b>${esc(L === 'ar' ? h.ar : h.en)}</b><small>${esc(L === 'ar' ? h.da : h.de)}</small></div></div>`).join('');
  $('#raildots').innerHTML = HALLS.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  const ro = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target.querySelector('video'); e.target.classList.toggle('on', e.isIntersecting);
    if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {});
      document.querySelectorAll('#raildots i').forEach((d, k) => d.classList.toggle('on', k == e.target.dataset.i)); }
    else v.pause();
  }), {root: $('#rail'), threshold: .6});
  document.querySelectorAll('.hall').forEach(h => ro.observe(h));
}
function openGate() {
  const g = $('#gate'); if (g.classList.contains('open')) return;
  g.classList.add('open');
  setTimeout(() => { const nx = g.nextElementSibling; if (nx && scrollY < 40) window.scrollTo({top: nx.offsetTop, behavior: 'smooth'}); }, 1700);
}
$('#enter').onclick = openGate;
document.querySelectorAll('.door').forEach(d => d.onclick = openGate);
$('#skip').onclick = () => openMenu();
const sceneObs = new IntersectionObserver(es => es.forEach(e => {
  const s = e.target, v = s.querySelector(':scope > video.bg');
  if (e.isIntersecting) {
    s.classList.add('in');
    if (v) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); }
    const st = s.dataset.step; $('#steps').classList.toggle('on', st !== undefined);
    if (st !== undefined) document.querySelectorAll('#steps i').forEach((d, k) => d.classList.toggle('on', k == st));
    if (s.id !== 'gate') openGate();
  } else if (v && s.id !== 'gate') v.pause();
}), {threshold: .55});
document.querySelectorAll('#home .scene').forEach(s => sceneObs.observe(s));
// deep link: #s3 opens the door and jumps to scene 3 (also handy for sharing a hall)
if (/^#s\d+$/.test(location.hash)) { const n = +location.hash.slice(2), sc = document.querySelectorAll('#home .scene')[n];
  $('#gate').classList.add('open'); if (sc) requestAnimationFrame(() => window.scrollTo(0, sc.offsetTop)); }
// preload the next scene's video while the door is closed
setTimeout(() => { const v = document.querySelector('[data-step="0"] video'); if (v && !v.src) { v.src = v.dataset.src; v.load(); } }, 1200);

setLang(L);
fetch('data/menu.json', {cache: 'no-cache'})
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(m => { DATA = m.sections; GROUPS = m.groups; HALLS = m.halls; render(); halls(); })
  .catch(e => { console.error('menu.json failed to load', e); $('#empty').style.display = 'block'; });
