// Fixed and cleaned combined script
(() => {
  // normalize global flags
  window.autoClickerSt = window.autoClickerSt || false;
  window.adBGoneSt = window.adBGoneSt || false;
  window.dvdLogoSt = window.dvdLogoSt || false;
  window.pageMarkerSt = window.pageMarkerSt || false;

  /* ---------------------- lunarPrompt ---------------------- */
  function lunarPrompt(options = {}) {
    return new Promise(resolve => {
      if (document.getElementById('lunarPromptGUI')) return resolve(null);
      const gui = document.createElement('div');
      gui.id = 'lunarPromptGUI';
      Object.assign(gui.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#1e1e2f',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(0,0,0,0.7)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        zIndex: 2147483647,
        width: '320px',
        textAlign: 'center'
      });

      gui.innerHTML = `
        <h3 style="margin:0 0 10px 0;font-size:16px;">${options.title || 'Enter Value'}</h3>
        <input id="lunarPromptInput" type="text" placeholder="${options.placeholder || ''}"
          style="width:100%; padding:8px; border-radius:6px; border:none; margin-bottom:10px; font-size:14px;">
        <div style="display:flex;gap:8px;justify-content:center">
          <button id="lunarPromptBtn" style="padding:8px 14px;border:none;border-radius:6px;background:#4e4eff;color:#fff;cursor:pointer">OK</button>
          <button id="lunarPromptCancel" style="padding:8px 14px;border:1px solid #666;border-radius:6px;background:#222;color:#ccc;cursor:pointer">Cancel</button>
        </div>
      `;

      document.body.appendChild(gui);
      const input = document.getElementById('lunarPromptInput');
      const ok = document.getElementById('lunarPromptBtn');
      const cancel = document.getElementById('lunarPromptCancel');

      input.focus();
      const cleanup = () => { gui.remove(); document.removeEventListener('keydown', onKey); };

      ok.addEventListener('click', () => { const v = input.value; cleanup(); resolve(v); });
      cancel.addEventListener('click', () => { cleanup(); resolve(null); });

      function onKey(e) {
        if (e.key === 'Enter') { ok.click(); }
        if (e.key === 'Escape') { cancel.click(); }
      }
      document.addEventListener('keydown', onKey);
    });
  }

  /* ---------------------- autoClicker ---------------------- */
  function autoClicker() {
    if (window.__spamClickerActive) {
      window.__spamClickerActive = false;
      window.__spamClickerUI?.remove();
      window.removeEventListener('mousemove', window.__spamClickerMouseMove, true);
      window.removeEventListener('keydown', window.__spamClickerKey);
      return;
    }

    window.__spamClickerActive = true;
    window.__spamClickerMouse = { x: 0, y: 0 };
    window.__spamClickerMouseMove = e => window.__spamClickerMouse = { x: e.clientX, y: e.clientY };
    window.addEventListener('mousemove', window.__spamClickerMouseMove, true);

    let batch = 5, paused = false;

    const ui = document.createElement('div');
    Object.assign(ui.style, {
      position: 'fixed',
      right: '12px',
      bottom: '12px',
      zIndex: 2147483647,
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontFamily: 'system-ui',
      fontSize: '12px',
      borderRadius: '8px'
    });
    ui.textContent = 'Click spamming • S pause/resume • + / - speed • Esc stop';
    document.body.appendChild(ui);
    window.__spamClickerUI = ui;

    window.__spamClickerKey = e => {
      if (e.key === 'Escape') {
        window.__spamClickerActive = false;
        ui.remove();
        window.removeEventListener('mousemove', window.__spamClickerMouseMove, true);
        window.removeEventListener('keydown', window.__spamClickerKey);
        return;
      }
      if (e.key.toLowerCase() === 's') {
        paused = !paused;
        ui.textContent = paused
          ? 'Paused • S resume • Esc stop'
          : 'Click spamming • S pause/resume • + / - speed • Esc stop';
      }
      if (e.key === '+' || e.key === '=') batch = Math.min(batch + 1, 50);
      if (e.key === '-') batch = Math.max(batch - 1, 1);
    };
    window.addEventListener('keydown', window.__spamClickerKey);

    function spam() {
      if (!paused && window.__spamClickerActive) {
        const el = document.elementFromPoint(window.__spamClickerMouse.x, window.__spamClickerMouse.y);
        if (el) for (let i = 0; i < batch; i++) el.click();
      }
      if (window.__spamClickerActive) requestAnimationFrame(spam);
    }
    requestAnimationFrame(spam);
  }

  /* ---------------------- adBGone ---------------------- */
  function adBGone() {
    // If already running, toggle off: simple approach — reload state not persisted here
    if (window.__adBGoneRunning) return;
    window.__adBGoneRunning = true;

    const selectors = [
      '#sidebar-wrap','#advert','#xrail','#middle-article-advert-container','#sponsored-recommendations',
      '#around-the-web','.ad','.advertisement','.GoogleActiveViewClass','.ad-slot',
      '.ad-banner','.ad-anchored','.trc_rbox_outer','.OUTBRAIN','iframe[title*="ad"]','iframe[src*="ads"]',
      'video[aria-label*="ad"]','amp-ad','ins.adsbygoogle',
      'div[id^="google_ads_iframe"]'
    ];

    const removeAds = () => {
      selectors.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => el?.remove());
        } catch (err) {
          // some selectors may throw on weird pages; ignore
        }
      });
    };

    removeAds();
    const intervalId = setInterval(removeAds, 1500);
    window.__adBGoneInterval = intervalId;

    // MutationObserver
    if (window.MutationObserver) {
      const mo = new MutationObserver(removeAds);
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
      window.__adBGoneMO = mo;
    }

    // history wrappers
    const wrapHistory = (obj, method) => {
      const orig = obj[method];
      obj[method] = function () {
        const result = orig.apply(this, arguments);
        setTimeout(removeAds, 60);
        return result;
      };
    };
    wrapHistory(history, 'pushState');
    wrapHistory(history, 'replaceState');
    window.addEventListener('popstate', () => setTimeout(removeAds, 60));

    let lastUrl = location.href;
    const urlCheck = setInterval(() => {
      if (location.href !== lastUrl) { lastUrl = location.href; removeAds(); }
    }, 500);
    window.__adBGoneUrlCheck = urlCheck;

    // Create draggable button using pointer events (won't stomp existing handlers)
    if (!document.getElementById('adBGoneBtn')) {
      const btn = document.createElement('button');
      btn.id = 'adBGoneBtn';
      btn.innerText = '💥 Ad-B-Gone';
      Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 2147483647,
        padding: '10px 16px',
        background: '#1a1a1a',
        color: '#00ffff',
        border: '2px solid #00ffff',
        borderRadius: '8px',
        cursor: 'grab',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '700',
        boxShadow: '0 0 8px #00ffff, 0 0 16px #00ffff33',
        transition: 'all 0.12s ease',
        touchAction: 'none'
      });

      btn.addEventListener('pointerdown', (ev) => {
        btn.setPointerCapture(ev.pointerId);
        btn.dataset.dragging = '1';
        btn.dataset.offsetX = ev.clientX - btn.getBoundingClientRect().left;
        btn.dataset.offsetY = ev.clientY - btn.getBoundingClientRect().top;
        btn.style.cursor = 'grabbing';
      });

      btn.addEventListener('pointermove', (ev) => {
        if (btn.dataset.dragging !== '1') return;
        const x = ev.clientX - Number(btn.dataset.offsetX);
        const y = ev.clientY - Number(btn.dataset.offsetY);
        btn.style.left = Math.max(0, x) + 'px';
        btn.style.top = Math.max(0, y) + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
      });

      btn.addEventListener('pointerup', (ev) => {
        btn.releasePointerCapture && btn.releasePointerCapture(ev.pointerId);
        btn.dataset.dragging = '0';
        btn.style.cursor = 'grab';
      });

      btn.addEventListener('click', removeAds);
      document.body.appendChild(btn);
    }
  }

  /* ---------------------- dvdLogo ---------------------- */
  function dvdLogo() {
    // LCM/GCD helpers
    function GCD(a, b) {
      a = Math.abs(a | 0); b = Math.abs(b | 0);
      if (!a) return b;
      if (!b) return a;
      while (b) { const t = a % b; a = b; b = t; }
      return a;
    }
    function LCM(a, b) {
      if (!a || !b) return 0;
      return Math.abs((a / GCD(a, b)) * b);
    }

    const W = innerWidth;
    const H = innerHeight;

    // create DVD div
    const dvd = document.createElement('div');
    dvd.id = "dvdLogoAnim";
    Object.assign(dvd.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      height: '60px',
      width: '136px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '75px',
      backgroundPosition: 'center',
      backgroundColor: '#f80',
      zIndex: 2147483647,
      pointerEvents: 'none'
    });
    // optional mask/icon; if browser blocks mask, color remains visible
    dvd.style.maskImage = 'url(https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg)';
    dvd.style.WebkitMaskImage = dvd.style.maskImage;
    document.body.appendChild(dvd);

    // initial positions & settings
    let x = Math.floor(Math.random() * Math.max(1, W - 136));
    let y = Math.floor(Math.random() * Math.max(1, H - 60));
    let dirX = 1, dirY = 1;
    const speed = Math.max(2, Math.min(W, H) / 200);
    const palette = ["#ff8800", "#e124ff", "#6a19ff", "#ff2188"];
    let prevColorIndex = -1;
    const dvdWidth = parseInt(getComputedStyle(dvd).width, 10) || 136;
    const dvdHeight = parseInt(getComputedStyle(dvd).height, 10) || 60;
    const d = LCM(Math.max(1, W - dvdWidth), Math.max(1, H - dvdHeight)) || 1;
    let steps = 0;

    function getNewColor() {
      let idx = Math.floor(Math.random() * palette.length);
      while (idx === prevColorIndex) idx = Math.floor(Math.random() * palette.length);
      prevColorIndex = idx;
      return palette[idx];
    }

    function animate() {
      if (!document.body.contains(dvd)) return; // stop if removed
      if (y + dvdHeight >= innerHeight || y <= 0) { dirY *= -1; dvd.style.backgroundColor = getNewColor(); }
      if (x + dvdWidth >= innerWidth || x <= 0) { dirX *= -1; dvd.style.backgroundColor = getNewColor(); }

      x += dirX * speed;
      y += dirY * speed;
      dvd.style.left = x + "px";
      dvd.style.top = y + "px";

      steps++;
      if (steps >= d) steps = 0;
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);

    function keyHandler(e) {
      if (!document.body.contains(dvd)) {
        document.removeEventListener('keydown', keyHandler);
        window.dvdLogoSt = false;
        return;
      }
      if (e.key === '1') dvd.style.display = dvd.style.display === 'none' ? 'block' : 'none';
      if (e.key === 'Escape') { dvd.remove(); window.dvdLogoSt = false; document.removeEventListener('keydown', keyHandler); }
    }
    document.addEventListener('keydown', keyHandler);
  }

  /* ---------------------- openTabs ---------------------- */
  function openTabs(count) {
    if (!count || isNaN(count) || count <= 0) return;
    const n = Math.min(50, Math.floor(count)); // cap to avoid catastrophic opening
    for (let i = 0; i < n; i++) window.open('about:blank', '_blank');
  }

  /* ---------------------- cloak ---------------------- */
  function cloak() {
    if (document.getElementById('cloakGUI')) return;
    const gui = document.createElement('div');
    gui.id = 'cloakGUI';
    Object.assign(gui.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#222',
      color: '#fff',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'sans-serif',
      zIndex: 2147483647,
      width: '280px'
    });
    gui.innerHTML = `
      <h4 style="margin:0 0 10px 0;font-size:15px">Tab Cloak</h4>
      <label style="display:block;margin-bottom:8px">Title: <input id="cloakTitleInput" placeholder="New tab title" style="width:100%;box-sizing:border-box"></label>
      <label style="display:block;margin-bottom:8px">Icon:
        <select id="cloakIconSelect" style="width:100%;box-sizing:border-box;margin-top:6px">
          <option value="">-- choose or paste URL --</option>
          <option value="https://www.google.com/favicon.ico">Google</option>
          <option value="https://www.microsoft.com/favicon.ico">Microsoft</option>
          <option value="https://github.githubassets.com/favicons/favicon.png">GitHub</option>
        </select>
      </label>
      <input id="cloakIconInput" placeholder="Custom icon URL" style="width:100%;box-sizing:border-box;margin-top:6px">
      <div style="margin-top:10px"><button id="cloakApplyBtn" style="width:100%;padding:8px;cursor:pointer">Apply</button></div>
    `;
    document.body.appendChild(gui);

    document.getElementById('cloakApplyBtn').onclick = () => {
      const title = document.getElementById('cloakTitleInput').value;
      const iconSelect = document.getElementById('cloakIconSelect').value;
      const iconInput = document.getElementById('cloakIconInput').value;
      if (title) document.title = title;
      const iconURL = iconInput || iconSelect;
      if (iconURL) {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.type = 'image/x-icon';
        link.href = iconURL;
      }
      gui.remove();
    };
  }

  /* ---------------------- pageMarker ---------------------- */
  function pageMarker() {
    if (window.__pageMarker) { window.__pageMarker.toggle(); return; }

    let active = false, drawing = false, lastX = 0, lastY = 0, color = "#ff0000", size = 3, eraser = false;
    const undoStack = [], maxUndo = 20;

    const cvs = document.createElement('canvas');
    // set pixel size attributes BEFORE getContext
    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      cvs.width = Math.round(window.innerWidth * ratio);
      cvs.height = Math.round(window.innerHeight * ratio);
      cvs.style.width = window.innerWidth + 'px';
      cvs.style.height = window.innerHeight + 'px';
      const ctx = cvs.getContext('2d');
      if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    Object.assign(cvs.style, { position: 'fixed', top: '0', left: '0', zIndex: 2147483646, pointerEvents: 'none' });
    resizeCanvas();
    const ctx = cvs.getContext('2d');
    if (!ctx) {
      console.warn('pageMarker: failed to get 2d context');
      return;
    }
    document.body.appendChild(cvs);
    window.addEventListener('resize', resizeCanvas);

    function saveState() {
      try {
        if (undoStack.length >= maxUndo) undoStack.shift();
        undoStack.push(ctx.getImageData(0, 0, cvs.width, cvs.height));
      } catch (err) { /* ignore big canvases or cross-origin issues */ }
    }

    function getEventPos(e) {
      const pt = (e.touches && e.touches[0]) || e;
      return { x: pt.clientX, y: pt.clientY };
    }

    function start(e) {
      if (!active) return;
      drawing = true;
      const p = getEventPos(e);
      lastX = p.x; lastY = p.y;
      saveState();
      e.preventDefault();
    }
    function move(e) {
      if (!drawing || !active) return;
      const p = getEventPos(e);
      const x = p.x, y = p.y;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size;

      if (eraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastX = x; lastY = y;
      e.preventDefault();
    }
    function end() { drawing = false; }

    // pointer events (covers mouse + touch)
    cvs.addEventListener('pointerdown', start);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);

    // toolbar
    const bar = document.createElement('div');
    bar.innerHTML = `
      <button id="pm-toggle" title="Toggle draw">🖊️</button>
      <button id="pm-eraser" title="Eraser">🩹</button>
      <input type="color" id="pm-color" value="#ff0000" title="Color">
      <input type="range" id="pm-size" min="1" max="40" value="3" title="Size">
      <button id="pm-undo" title="Undo">↩️</button>
      <button id="pm-clear" title="Clear">🧹</button>
      <button id="pm-exit" title="Exit">❌</button>
    `;
    Object.assign(bar.style, {
      position: 'fixed',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#111',
      padding: '8px 10px',
      borderRadius: '10px',
      zIndex: 2147483647,
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      boxShadow: '0 0 10px rgba(0,255,255,0.12)',
      userSelect: 'none',
      cursor: 'grab'
    });
    document.body.appendChild(bar);

    // draggable toolbar using pointer events
    let dragOn = false, dragOffsetX = 0, dragOffsetY = 0;
    bar.addEventListener('pointerdown', (ev) => {
      if (![...ev.composedPath()].some(n => n.id === 'pm-toggle' || n.id === 'pm-eraser' || n.id === 'pm-undo' || n.id === 'pm-clear' || n.id === 'pm-exit')) {
        dragOn = true;
        dragOffsetX = ev.clientX - bar.getBoundingClientRect().left;
        dragOffsetY = ev.clientY - bar.getBoundingClientRect().top;
        bar.setPointerCapture && bar.setPointerCapture(ev.pointerId);
        bar.style.cursor = 'grabbing';
      }
    });
    bar.addEventListener('pointermove', (ev) => {
      if (!dragOn) return;
      bar.style.left = Math.max(6, ev.clientX - dragOffsetX) + 'px';
      bar.style.top = Math.max(6, ev.clientY - dragOffsetY) + 'px';
      bar.style.right = 'auto';
      bar.style.bottom = 'auto';
    });
    bar.addEventListener('pointerup', () => { dragOn = false; bar.style.cursor = 'grab'; });

    // controls wiring
    const byId = id => bar.querySelector('#' + id);
    byId('pm-toggle').onclick = () => { active = !active; cvs.style.pointerEvents = active ? 'auto' : 'none'; };
    byId('pm-eraser').onclick = function () { eraser = !eraser; this.style.background = eraser ? '#333' : ''; };
    byId('pm-color').oninput = (e) => color = e.target.value;
    byId('pm-size').oninput = (e) => size = +e.target.value;
    byId('pm-clear').onclick = () => { ctx.clearRect(0, 0, cvs.width, cvs.height); undoStack.length = 0; };
    byId('pm-undo').onclick = () => { if (undoStack.length) { const img = undoStack.pop(); try { ctx.putImageData(img, 0, 0); } catch(e){} } };
    byId('pm-exit').onclick = () => {
      window.removeEventListener('resize', resizeCanvas);
      cvs.remove();
      bar.remove();
      window.__pageMarker = undefined;
      window.pageMarkerSt = false;
      // remove pointer listeners
      cvs.removeEventListener('pointerdown', start);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };

    function keyHandler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') byId('pm-undo').click();
      if (e.key.toLowerCase() === 'e') byId('pm-eraser').click();
      if (e.key.toLowerCase() === 'c') byId('pm-clear').click();
      if (e.key.toLowerCase() === 'p') byId('pm-toggle').click();
    }
    document.addEventListener('keydown', keyHandler);

    window.__pageMarker = { toggle: () => { active = !active; cvs.style.pointerEvents = active ? 'auto' : 'none'; } };
    window.pageMarkerSt = true;
  }

  /* ---------------------- floating menu ---------------------- */
  (function createFloatingMenu() {
    const ID = 'Menu-M.M.';
    const existing = document.getElementById(ID);
    if (existing) {
      existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
      return;
    }

    const host = document.createElement('div');
    host.id = ID;
    Object.assign(host.style, { position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647 });
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const css = `
      :host { font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial; }
      .card {
        width: 260px;
        background: rgba(26,26,26,0.95);
        color: #00ffff;
        border-radius: 12px;
        box-shadow: 0 0 12px #00ffff22;
        padding: 10px;
        backdrop-filter: blur(6px);
        border: 1px solid rgba(0,255,255,0.12);
      }
      .header {
        display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;
        cursor:grab; user-select:none;
      }
      .title { font-weight:600; font-size:14px; color:#bff; }
      .btn {
        display:block; width:100%; padding:8px 10px; margin:6px 0; border-radius:8px; cursor:pointer;
        border:1px solid rgba(0,255,255,0.12); background:#111; font-size:13px; text-align:left;
        color:#00ffff; box-shadow:0 0 6px #00ffff16; transition:all .12s ease;
      }
      .btn:hover { box-shadow:0 0 12px #00ffff33; background:#1b1b1b; transform:translateY(-1px); }
      .close-x { cursor:pointer; padding:4px 6px; border-radius:6px; background:transparent; border:none; font-weight:700; color:#00ffff; }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = css;

    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.innerHTML = `
      <div class="header"><div class="title">Quick Menu</div><button class="close-x" title="Close">✕</button></div>
      <button class="btn" id="btn-clicker">Auto Clicker</button>
      <button class="btn" id="btn-ads">Remove all ads</button>
      <button class="btn" id="btn-cloak">Cloaker</button>
      <button class="btn" id="btn-dvd">A DVD Bounces around</button>
      <button class="btn" id="btn-tab">Tab Opener</button>
      <button class="btn" id="btn-marker">Draw on the Page</button>
      <button class="btn" id="btn-scroll">Scroll to top</button>
      <button class="btn" id="btn-dark">Toggle dark</button>
    `;

    shadow.appendChild(styleEl);
    shadow.appendChild(wrapper);

    const $ = sel => shadow.querySelector(sel);

    $('#btn-clicker').onclick = () => { if (!window.autoClickerSt) { window.autoClickerSt = true; autoClicker(); } };
    $('#btn-marker').onclick = () => { if (!window.pageMarkerSt) { window.pageMarkerSt = true; pageMarker(); } else window.__pageMarker?.toggle(); };
    $('#btn-tab').onclick = async () => {
      const count = await lunarPrompt({ title: 'How many tabs do you want to open?', placeholder: 'Type a number...' });
      if (!count) return;
      openTabs(Number(count));
    };
    $('#btn-cloak').onclick = () => cloak();
    $('#btn-dvd').onclick = () => { if (!window.dvdLogoSt) { window.dvdLogoSt = true; dvdLogo(); } };
    $('#btn-ads').onclick = () => { if (!window.adBGoneSt) { window.adBGoneSt = true; adBGone(); } };
    $('#btn-scroll').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    let dark = false;
    $('#btn-dark').onclick = () => {
      dark = !dark;
      const card = wrapper;
      card.style.background = dark ? 'rgba(6,6,6,0.95)' : 'rgba(26,26,26,0.95)';
      card.style.border = '1px solid rgba(0,255,255,0.12)';
    };

    shadow.querySelector('.close-x').onclick = () => host.remove();

    // drag the host by header using pointer events
    (function enableDrag() {
      const el = wrapper;
      let dragging = false, startX = 0, startY = 0, startRight = 16, startBottom = 16;
      wrapper.addEventListener('pointerdown', (e) => {
        const path = e.composedPath();
        const headerEl = path.find(n => n && n.classList && n.classList.contains && n.classList.contains('header'));
        if (!headerEl) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        startRight = parseFloat(getComputedStyle(host).right) || 16;
        startBottom = parseFloat(getComputedStyle(host).bottom) || 16;
        wrapper.setPointerCapture && wrapper.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        host.style.right = (startRight - dx) + 'px';
        host.style.bottom = (startBottom - dy) + 'px';
      });
      window.addEventListener('pointerup', (e) => {
        dragging = false;
      });
    })();

    // auto-focus first button
    const firstBtn = shadow.querySelector('.btn');
    firstBtn && firstBtn.focus();

    // auto remove after 2 minutes to avoid clutter
    setTimeout(() => { try { host.remove(); } catch (e) {} }, 120000);
  })();

  // expose functions to window for console use
  window.lunarPrompt = lunarPrompt;
  window.autoClicker = autoClicker;
  window.adBGone = adBGone;
  window.dvdLogo = dvdLogo;
  window.openTabs = openTabs;
  window.cloak = cloak;
  window.pageMarker = pageMarker;
})();
