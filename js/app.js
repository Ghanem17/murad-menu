// Murad menu: landing film + "Plates" menu. Content lives in data/menu.json.
let DATA = [], GROUPS = [], BEST = [];
let L = 'ar';
try { L = localStorage.getItem('murad-lang') || 'ar'; } catch (e) {}
const $ = s => document.querySelector(s);
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const num = p => Number(p).toLocaleString('en-US');
const cur = () => L === 'ar' ? 'د.ع' : 'IQD';
const price = p => p ? num(p) + ' ' + cur() : (L === 'ar' ? 'حسب الطلب' : 'On request');
const nm = o => L === 'ar' ? o.ar : (o.en || o.ar), alt = o => L === 'ar' ? o.en : o.ar;
const ds = o => L === 'ar' ? o.d : (o.de || o.d);
const T = {best: ['الأكثر مبيعاً', 'Best Sellers'], sig: ['توقيع مراد', 'Signature'], ask: ['حسب<br>الطلب', 'On<br>request'], q: ['دوّر على طبق…', 'Search a dish…']};
const t = k => T[k][L === 'ar' ? 0 : 1];
// search ignores diacritics and common Arabic letter variants
const norm = s => String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/[ىی]/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ');

function seal(p) { return p ? `<span class="seal">${num(p)}<i>${cur()}</i></span>` : `<span class="seal ask">${t('ask')}</span>`; }
function dish(it, s, si, ii) {
  const q = norm([it.ar, it.en, s.ar, s.en].join(' '));
  return `<button class="dish${it.i ? '' : ' nophoto'}" data-k="${si}|${ii}" data-q="${esc(q)}">${it.i ? `<span class="pl"><img src="${it.i}" alt="" loading="lazy"></span>` : ''}${seal(it.p)}${it.s && !s.compact ? `<span class="sig">${t('sig')}</span>` : ''}<b>${esc(nm(it))}</b><small>${esc(alt(it))}</small></button>`;
}
function render() {
  BEST = DATA.flatMap((s, si) => s.items.map((it, ii) => [s, si, it, ii]).filter(x => x[2].best));
  $('#rail').innerHTML = (BEST.length ? `<button class="cat" data-t="best"><span class="disc"><img src="${BEST[0][2].i}" alt=""></span><span>${t('best')}</span></button>` : '') +
    DATA.map((s, si) => `<button class="cat" data-t="s${si}"><span class="disc"><img src="${s.c}" alt="" loading="lazy"></span><span>${esc(nm(s))}</span></button>`).join('');
  let h = BEST.length ? `<div class="best" id="best"><div class="sec-h"><div><h3>${t('best')}</h3><em>${L === 'ar' ? 'Best Sellers' : 'الأكثر مبيعاً'}</em></div></div><div class="carousel">` +
    BEST.map(([s, si, it, ii]) => `<button class="big" data-k="${si}|${ii}"><span class="plate"><img src="${it.i}" alt="" loading="lazy"></span><b>${esc(nm(it))}</b><small>${price(it.p)}</small></button>`).join('') + '</div></div>' : '';
  let g = '';
  DATA.forEach((s, si) => {
    if (s.g !== g) { g = s.g; const G = GROUPS.find(x => x.k === g); h += `<div class="group">${esc(G ? nm(G) : g)}</div>`; }
    h += `<section class="sec" id="s${si}"><div class="sec-h"><div><h3>${esc(nm(s))}</h3><em>${esc(alt(s))}</em></div></div>
      <div class="grid${s.compact ? ' small' : ''}">${s.items.map((it, ii) => dish(it, s, si, ii)).join('')}</div></section>`;
  });
  $('#list').innerHTML = h;
  document.querySelectorAll('#list [data-k]').forEach(b => b.onclick = () => serve(b.dataset.k));
  document.querySelectorAll('.cat').forEach(c => c.onclick = () => { const el = document.getElementById(c.dataset.t); if (el) scrollTo({top: el.offsetTop - 165, behavior: 'smooth'}); });
  spy(); search();
}
let obs;
function spy() {
  if (obs) obs.disconnect();
  obs = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    document.querySelectorAll('.cat').forEach(c => c.classList.toggle('on', c.dataset.t === e.target.id));
    const on = $('.cat.on'); if (on) on.scrollIntoView({inline: 'center', block: 'nearest', behavior: 'smooth'});
  }), {rootMargin: '-180px 0px -65% 0px'});
  document.querySelectorAll('#best,section.sec').forEach(s => obs.observe(s));
}
function search() {
  const q = norm($('#q').value.trim()); let n = 0;
  $('#qx').hidden = !q;
  const best = $('#best'), bc = $('.cat[data-t="best"]'); if (best) best.hidden = !!q; if (bc) bc.hidden = !!q;
  document.querySelectorAll('section.sec').forEach(sec => {
    let c = 0; sec.querySelectorAll('.dish').forEach(d => { const ok = !q || d.dataset.q.includes(q); d.hidden = !ok; if (ok) c++; });
    sec.hidden = !c; n += c; const cat = $(`.cat[data-t="${sec.id}"]`); if (cat) cat.hidden = !c;
  });
  document.querySelectorAll('.group').forEach(g => { let el = g.nextElementSibling, any = false;
    while (el && !el.classList.contains('group')) { if (el.matches('section.sec') && !el.hidden) any = true; el = el.nextElementSibling; } g.hidden = !any; });
  $('#empty').hidden = !DATA.length || n > 0;
}
function serve(k) {
  const [si, ii] = k.split('|').map(Number), s = DATA[si], it = s.items[ii], d = ds(it);
  const x = '<button class="x" id="x" aria-label="close">×</button>';
  $('#serve').innerHTML = `${it.i ? `<div class="photo">${x}<img src="${it.i}" alt="${esc(nm(it))}"></div>` : ''}<div class="card${it.i ? '' : ' solo'}">${it.i ? '' : x}
    <h4>${esc(nm(it))}</h4><div class="alt">${esc(alt(it))}</div>${d ? `<p class="ds">${esc(d)}</p>` : ''}
    <div class="row"><span class="pr">${it.p ? num(it.p) + `<i>${cur()}</i>` : price(0)}</span></div></div>`;
  $('#serve').scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('open')));
  $('#x').onclick = closeServe;
}
function closeServe() { document.body.classList.remove('open'); }
function setLang(l) {
  L = l; try { localStorage.setItem('murad-lang', l); } catch (e) {}
  document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar]').forEach(el => el.innerHTML = el.dataset[l]);
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === l));
  $('#lbtn').textContent = l === 'ar' ? 'EN' : 'ع';
  $('#q').placeholder = t('q');
  if (DATA.length) render();
}
// landing <-> menu
const film = $('#film');
function openMenu() {
  document.body.classList.add('menu-open'); history.pushState({m: 1}, '');
  if (film) film.pause(); scrollTo(0, 0);
}
window.onpopstate = () => { closeServe(); document.body.classList.remove('menu-open'); if (film) film.play().catch(() => {}); };
if (film && matchMedia('(prefers-reduced-motion: reduce)').matches) { film.removeAttribute('autoplay'); film.pause(); }
$('#all').onclick = openMenu;
$('#back').onclick = () => history.back();
$('#veil').onclick = closeServe;
addEventListener('keydown', e => e.key === 'Escape' && closeServe());
document.querySelectorAll('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
$('#lbtn').onclick = () => setLang(L === 'ar' ? 'en' : 'ar');
$('#q').addEventListener('input', () => { search(); const top = $('.hero').offsetHeight; if (scrollY > top) scrollTo({top}); });
$('#qx').onclick = () => { $('#q').value = ''; search(); $('#q').focus(); };
setLang(L);
fetch('data/menu.json', {cache: 'no-cache'})
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(m => { DATA = m.sections; GROUPS = m.groups; render(); })
  .catch(e => { console.error('menu.json failed to load', e); $('#empty').hidden = false; });
