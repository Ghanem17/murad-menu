// Shared helpers for the menu design prototypes (data loading, formatting, "my order" tray)
window.MU = (() => {
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const num = n => Number(n).toLocaleString('ar-EG');           // ٣٬٠٠٠
  const price = p => p ? num(p) : 'حسب الطلب';
  const load = () => fetch('data/menu.json').then(r => r.json()).then(m => {
    m.sections.forEach((s, si) => s.items.forEach((it, ii) => { it.key = si + '-' + ii; it.sec = s; }));
    m.all = m.sections.flatMap(s => s.items);
    m.best = m.all.filter(it => it.best);
    return m;
  });
  const desc = it => it.d || '';
  // tray: a list of dishes the guest wants to show the waiter
  let tray = {};
  try { tray = JSON.parse(localStorage.getItem('murad-tray') || '{}'); } catch (e) {}
  const save = () => { try { localStorage.setItem('murad-tray', JSON.stringify(tray)); } catch (e) {} };
  const T = {
    get: k => tray[k] || 0,
    add(k, d = 1) { tray[k] = Math.max(0, (tray[k] || 0) + d); if (!tray[k]) delete tray[k]; save(); },
    count: () => Object.values(tray).reduce((a, b) => a + b, 0),
    lines: m => Object.entries(tray).map(([k, q]) => ({it: m.all.find(x => x.key === k), q})).filter(x => x.it),
    total: m => T.lines(m).reduce((a, x) => a + x.it.p * x.q, 0),
    clear() { tray = {}; save(); }
  };
  return {esc, num, price, load, desc, tray: T};
})();
