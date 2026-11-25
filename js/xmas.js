// Christmas season effects (self-contained). Remove the <script src="js/xmas.js"> tag to switch them off.
// - Snow falls from the moment the site opens, over the film and the menu; it fades out while a dish is open.
// - The first time "browse the full menu" is pressed, Santa's sleigh crosses the screen left to right,
//   pulled by reindeer, trailing a "Merry Christmas" banner.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&display=swap';
  document.head.appendChild(font);

  const css = document.createElement('style');
  css.textContent = `
  #snow{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:15;transition:opacity .4s}
  body.open #snow{opacity:0}
  .santa{position:fixed;left:0;top:34vh;z-index:16;pointer-events:none;
    width:min(680px,160vw);transform:translateX(-100%);animation:santa-fly 7s linear forwards;direction:ltr}
  .santa svg{display:block;width:100%;height:auto;overflow:visible;animation:santa-arc 7s ease-in-out forwards;filter:drop-shadow(0 6px 10px #0006)}
  @keyframes santa-fly{to{transform:translateX(100vw)}}
  @keyframes santa-arc{0%{transform:translateY(40px) rotate(-4deg)}50%{transform:translateY(-6px) rotate(0)}100%{transform:translateY(18px) rotate(3deg)}}
  .santa .banner{transform-box:fill-box;transform-origin:100% 50%;animation:banner-wave 1.1s ease-in-out infinite alternate}
  .santa .banner text{font-family:'Mountains of Christmas','Readex Pro',cursive;font-weight:700}
  @keyframes banner-wave{from{transform:skewY(-4deg) translateY(2px)}to{transform:skewY(4deg) translateY(-2px)}}
  .santa .leg-f{transform-box:fill-box;transform-origin:25% 0;animation:leg-f .38s ease-in-out infinite alternate}
  .santa .leg-b{transform-box:fill-box;transform-origin:85% 0;animation:leg-b .38s ease-in-out infinite alternate}
  @keyframes leg-f{from{transform:rotate(-24deg)}to{transform:rotate(20deg)}}
  @keyframes leg-b{from{transform:rotate(22deg)}to{transform:rotate(-22deg)}}
  .santa .bob{animation:bob .38s ease-in-out infinite alternate}
  .santa .wave{transform-box:fill-box;transform-origin:0 100%;animation:wave .5s ease-in-out infinite alternate}
  .santa .glow{animation:glow .7s ease-in-out infinite alternate}
  @keyframes bob{from{transform:translateY(-2px)}to{transform:translateY(2px)}}
  @keyframes wave{from{transform:rotate(-18deg)}to{transform:rotate(14deg)}}
  @keyframes glow{from{opacity:.35}to{opacity:.9}}
  `;
  document.head.appendChild(css);

  /* ---------------- snow ---------------- */
  const cv = document.createElement('canvas');
  cv.id = 'snow';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, flakes = [], last = 0, running = true;
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(160, Math.max(60, W * H / 7000)));
    while (flakes.length < n) flakes.push(flake(true));
    flakes.length = n;
  }
  function flake(anywhere) {
    const z = Math.random();                       // depth: 0 far, 1 near
    return {x: Math.random() * W, y: anywhere ? Math.random() * H : -10, r: .8 + z * 2.6, vy: 18 + z * 46,
      sway: 8 + Math.random() * 22, f: .4 + Math.random() * 1.1, p: Math.random() * 6.3, a: .45 + z * .5};
  }
  function frame(t) {
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const s of flakes) {
      s.y += s.vy * dt; s.p += s.f * dt;
      const x = s.x + Math.sin(s.p) * s.sway;
      if (s.y > H + 10) Object.assign(s, flake(false), {x: Math.random() * W});
      ctx.globalAlpha = s.a; ctx.beginPath(); ctx.arc(x, s.y, s.r, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill();
    }
    if (running) requestAnimationFrame(frame);
  }
  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) { last = performance.now(); requestAnimationFrame(frame); }
  }
  size(); addEventListener('resize', size);
  requestAnimationFrame(frame);
  // pause while a dish is open or the tab is hidden
  const sync = () => setRunning(!document.body.classList.contains('open') && !document.hidden);
  new MutationObserver(sync).observe(document.body, {attributes: true, attributeFilter: ['class']});
  document.addEventListener('visibilitychange', sync);

  /* ---------------- Santa ---------------- */
  const deer = (x, y, delay, rudolph) => `
    <g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:${delay}s">
      <g class="leg-b" style="animation-delay:${delay}s"><path d="M-16 5 L-27 20 M-19 6 L-24 25" stroke="#7A4A22" stroke-width="4" stroke-linecap="round"/></g>
      <g class="leg-f" style="animation-delay:${delay}s"><path d="M14 5 L25 19 M11 6 L17 25" stroke="#7A4A22" stroke-width="4" stroke-linecap="round"/></g>
      <circle cx="-24" cy="-5" r="3.5" fill="#F3E3C8"/>
      <ellipse cx="0" cy="0" rx="25" ry="11" fill="#8B5A2B"/>
      <ellipse cx="2" cy="5" rx="16" ry="5" fill="#B07A45"/>
      <path d="M14 -6 L25 -21 L33 -18 L23 2 Z" fill="#8B5A2B"/>
      <path d="M7 -9 Q13 0 7 10" stroke="#C8102E" stroke-width="3" fill="none"/>
      <circle cx="11" cy="1" r="2" fill="#F5C451"/>
      <path d="M27 -27 L23 -41 M23 -41 L16 -45 M23 -41 L26 -48 M32 -27 L35 -42 M35 -42 L30 -48 M35 -42 L41 -46" stroke="#6B3E1E" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <ellipse cx="25" cy="-27" rx="4" ry="2.2" fill="#7A4A22" transform="rotate(-30 25 -27)"/>
      <ellipse cx="33" cy="-22" rx="9.5" ry="6.2" fill="#8B5A2B" transform="rotate(-12 33 -22)"/>
      <circle cx="31" cy="-24" r="1.4" fill="#1B1B1B"/>
      ${rudolph ? '<circle class="glow" cx="43" cy="-20" r="7" fill="#ff3b3b"/><circle cx="43" cy="-20" r="3.4" fill="#ff2a2a"/>' : '<circle cx="42.5" cy="-20" r="2.6" fill="#2A1A10"/>'}
    </g></g>`;
  const sleigh = `
    <g class="bob">
      <path d="M118 50 Q150 42 176 56 M118 54 Q205 46 270 52" stroke="#5A3A1E" stroke-width="1.6" fill="none"/>
      <g transform="translate(0 -9)">
      <circle cx="44" cy="40" r="15" fill="#8B5E3C"/><path d="M38 27 Q44 22 50 27" stroke="#5A3A1E" stroke-width="3" fill="none"/>
      <ellipse cx="72" cy="44" rx="19" ry="17" fill="#E3262F"/>
      <rect x="54" y="38" width="36" height="6" rx="2" fill="#1B1B1B"/><rect x="69" y="37" width="7" height="8" rx="1.5" fill="none" stroke="#F5C451" stroke-width="1.8"/>
      <path d="M60 30 Q72 36 84 30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="wave"><path d="M86 34 L101 20" stroke="#E3262F" stroke-width="7" stroke-linecap="round"/><circle cx="102" cy="18" r="4.2" fill="#fff"/></g>
      <circle cx="73" cy="20" r="8.5" fill="#F2C9A0"/>
      <path d="M64 21 Q66 38 73 38 Q81 38 82 21 Q78 27 73 27 Q68 27 64 21 Z" fill="#fff"/>
      <path d="M63 16 L83 16 L94 4 Z" fill="#E3262F"/><circle cx="95" cy="4" r="3.6" fill="#fff"/>
      <rect x="62" y="13.5" width="22" height="5" rx="2.5" fill="#fff"/>
      <circle cx="77" cy="19" r="1.2" fill="#1B1B1B"/>
      </g>
      <path d="M20 58 Q16 38 34 38 L106 38 Q118 38 118 52 L118 70 Q118 80 106 80 L36 80 Q22 80 20 58 Z" fill="#9E0F23"/>
      <path d="M22 44 Q24 38 34 38 L106 38 Q116 38 118 46" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M24 52 L114 52" stroke="#F5C451" stroke-width="2.4"/>
      <path d="M40 80 L36 92 M96 80 L100 92" stroke="#F5C451" stroke-width="3"/>
      <path d="M8 92 L116 92 Q132 92 133 78 Q133 70 126 71" stroke="#F5C451" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  function flySanta() {
    const s = document.createElement('div');
    s.className = 'santa'; s.setAttribute('aria-hidden', 'true');
    s.innerHTML = `<svg viewBox="-214 -56 566 152">
      <path d="M-40 60 Q-10 72 22 62" stroke="#5A3A1E" stroke-width="1.8" fill="none"/>
      <g class="banner">
        <rect x="-210" y="42" width="172" height="36" rx="6" fill="#C8102E" stroke="#F5C451" stroke-width="2.5"/>
        <circle cx="-210" cy="60" r="5" fill="#F5C451"/><circle cx="-38" cy="60" r="5" fill="#F5C451"/>
        <text x="-124" y="67.5" text-anchor="middle" font-size="22" fill="#fff" textLength="148" lengthAdjust="spacingAndGlyphs">Merry Christmas</text>
      </g>
      ${sleigh}${deer(196, 62, 0, false)}${deer(292, 56, .19, true)}
    </svg>`;
    document.body.appendChild(s);
    s.addEventListener('animationend', e => { if (e.animationName === 'santa-fly') s.remove(); });
  }
  let flown = false;
  const enter = document.getElementById('all');
  if (enter) enter.addEventListener('click', () => { if (!flown) { flown = true; setTimeout(flySanta, 350); } });
})();
