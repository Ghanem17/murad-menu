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
  .santa.pic{width:min(540px,125vw)}
  .santa.pic .arc{position:relative;display:flex;justify-content:flex-end;animation:santa-arc 7s ease-in-out forwards}
  .santa.pic svg{animation:none;position:absolute;left:0;width:36%;top:calc(var(--rope) * 100%);transform:translateY(-50%)}
  .santa.pic img{display:block;width:var(--w);height:auto;position:relative;filter:drop-shadow(0 10px 14px #0007);animation:gallop .42s ease-in-out infinite alternate}
  .santa.pic .run{width:var(--w);aspect-ratio:var(--ar);position:relative;background-repeat:no-repeat;background-position:0 0;
    filter:drop-shadow(0 10px 14px #0007);animation:run .5s steps(8,jump-none) infinite,gallop .42s ease-in-out infinite alternate}
  @keyframes run{to{background-position:100% 0}}
  @keyframes gallop{from{transform:translateY(-3px) rotate(-1deg)}to{transform:translateY(3px) rotate(1deg)}}
  /* a Santa hat on every price seal */
  .seal::before{content:"";position:absolute;z-index:1;pointer-events:none;width:119%;aspect-ratio:100/90;left:-9.5%;top:-47%;
    background:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 90%22%3E %3Cdefs%3E %3ClinearGradient id=%22r%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22%23d81e2a%22/%3E%3Cstop offset=%22.55%22 stop-color=%22%23a70d19%22/%3E%3Cstop offset=%221%22 stop-color=%22%236a0610%22/%3E%3C/linearGradient%3E %3CradialGradient id=%22w%22 cx=%22.35%22 cy=%22.3%22 r=%22.8%22%3E%3Cstop offset=%220%22 stop-color=%22%23fff%22/%3E%3Cstop offset=%22.7%22 stop-color=%22%23f3f1ee%22/%3E%3Cstop offset=%221%22 stop-color=%22%23d9d5cf%22/%3E%3C/radialGradient%3E %3C/defs%3E %3Cpath d=%22M21 56 C18 31 33 9 57 6 C75 4 90 12 95 26 C97 32 96 38 93 44 C90 49 85 53 80 56 Z%22 fill=%22url%28%23r%29%22 stroke=%22%233d040a%22 stroke-width=%222.4%22 stroke-linejoin=%22round%22/%3E %3Cpath d=%22M36 46 C38 30 46 18 60 13%22 stroke=%22%23fff%22 stroke-opacity=%22.2%22 stroke-width=%225%22 fill=%22none%22 stroke-linecap=%22round%22/%3E %3Cpath d=%22M70 44 C76 36 84 30 90 30%22 stroke=%22%233d040a%22 stroke-opacity=%22.35%22 stroke-width=%223%22 fill=%22none%22 stroke-linecap=%22round%22/%3E %3Cpath d=%22M20.6 57 A34 34 0 0 1 79.4 57%22 stroke=%22%23bdb7ae%22 stroke-width=%2215.5%22 stroke-linecap=%22round%22 fill=%22none%22/%3E%3Cpath d=%22M20.6 57 A34 34 0 0 1 79.4 57%22 stroke=%22%23e9e6e1%22 stroke-width=%2213%22 stroke-linecap=%22round%22 fill=%22none%22/%3E %3Cg fill=%22url%28%23w%29%22%3E %3Ccircle cx=%2220.6%22 cy=%2257%22 r=%227.5%22/%3E%3Ccircle cx=%2228.1%22 cy=%2248%22 r=%227.8%22/%3E%3Ccircle cx=%2238.4%22 cy=%2242.1%22 r=%228%22/%3E%3Ccircle cx=%2250%22 cy=%2240%22 r=%228%22/%3E%3Ccircle cx=%2261.6%22 cy=%2242.1%22 r=%228%22/%3E%3Ccircle cx=%2271.9%22 cy=%2248%22 r=%227.8%22/%3E%3Ccircle cx=%2279.4%22 cy=%2257%22 r=%227.5%22/%3E %3C/g%3E %3Ccircle cx=%2293%22 cy=%2245%22 r=%229%22 fill=%22url%28%23w%29%22/%3E%3Ccircle cx=%2290%22 cy=%2242%22 r=%222.6%22 fill=%22%23fff%22/%3E %3C/svg%3E") no-repeat center/contain;transform-origin:50% 82.2%;transform:rotate(-8deg) scaleX(-1);filter:drop-shadow(0 3px 3px #0006)}
  /* lean outwards, away from the dish photo: the seal is on the left in Arabic and on the right in English */
  [dir=ltr] .seal::before{transform:rotate(32deg)}
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
  // picture options: rope = height (0..1) where the banner rope meets the back of the sleigh,
  // w = picture width within the flying row, cw = width of the whole row (banner + picture)
  const PICS = {
    // Santa from one drawing, reindeer from another; 8 frames side by side so the reindeer legs gallop
    sleigh: {src: 'img/xmas/santa-run.webp', frames: 8, ar: '900/316', rope: .5, w: '70%', cw: 'min(700px,160vw)'},
    ours: {src: 'img/xmas/santa-ours.webp', rope: .55, w: '52%', cw: 'min(560px,125vw)'},   // the restaurant's own picture
  };
  const DEFAULT_SANTA = 'sleigh';   // ?santa=ours or ?santa=draw to compare
  const pick = new URLSearchParams(location.search).get('santa') || DEFAULT_SANTA;
  if (PICS[pick]) new Image().src = PICS[pick].src;   // preload so it is ready when the menu opens
  const banner = (x2) => `<path d="M-40 60 Q${(x2 - 40) / 2} 72 ${x2} 62" stroke="#5A3A1E" stroke-width="1.8" fill="none"/>
      <g class="banner">
        <rect x="-210" y="42" width="172" height="36" rx="6" fill="#C8102E" stroke="#F5C451" stroke-width="2.5"/>
        <circle cx="-210" cy="60" r="5" fill="#F5C451"/><circle cx="-38" cy="60" r="5" fill="#F5C451"/>
        <text x="-124" y="67.5" text-anchor="middle" font-size="22" fill="#fff" textLength="148" lengthAdjust="spacingAndGlyphs">Merry Christmas</text>
      </g>`;
  function flyPicture(o) {
    const s = document.createElement('div');
    s.className = 'santa pic'; s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--rope', o.rope); s.style.setProperty('--w', o.w); if (o.cw) s.style.width = o.cw;
    const pic = o.frames
      ? `<div class="run" style="--ar:${o.ar};background-image:url(${o.src});background-size:${o.frames * 100}% 100%"></div>`
      : `<img src="${o.src}" alt="">`;
    s.innerHTML = `<div class="arc"><svg viewBox="-214 30 270 60">${banner(60)}</svg>${pic}</div>`;
    document.body.appendChild(s);
    s.addEventListener('animationend', e => { if (e.animationName === 'santa-fly') s.remove(); });
  }
  function flySanta() {
    if (PICS[pick]) return flyPicture(PICS[pick]);
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
