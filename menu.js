/*
  Fun Menu - A floating menu with various utilities
  Author: Mukilan Madhusudhanan
  Version: DEV 1.9
*/

let autoClickerSt = false;
let adBGoneSt = false;
let dvdLogoSt = false;
let pageMarkerSt = false;

function autoClicker() {
    if (window.__spamClickerActive) {
        window.__spamClickerActive = false;
        window.__spamClickerUI?.remove();
        window.removeEventListener("mousemove", window.__spamClickerMouseMove, true);
        window.removeEventListener("keydown", window.__spamClickerKey);
        return;
    }

    window.__spamClickerActive = true;
    window.__spamClickerMouse = { x: 0, y: 0 };
    window.__spamClickerMouseMove = e => window.__spamClickerMouse = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", window.__spamClickerMouseMove, true);

    let batch = 5, paused = false;

    const ui = document.createElement("div");
    Object.assign(ui.style, {
        position: "fixed",
        right: "12px",
        bottom: "12px",
        zIndex: 2147483647,
        padding: "6px 10px",
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        fontFamily: "system-ui",
        fontSize: "12px",
        borderRadius: "8px"
    });
    ui.textContent = "Click spamming • S pause/resume • + / - speed • Esc stop";
    document.body.appendChild(ui);
    window.__spamClickerUI = ui;

    window.__spamClickerKey = e => {
        if (e.key === "Escape") {
            window.__spamClickerActive = false;
            ui.remove();
            window.removeEventListener("mousemove", window.__spamClickerMouseMove, true);
            window.removeEventListener("keydown", window.__spamClickerKey);
            return;
        }
        if (e.key.toLowerCase() === "s") {
            paused = !paused;
            ui.textContent = paused
                ? "Paused • S resume • Esc stop"
                : "Click spamming • S pause/resume • + / - speed • Esc stop";
        }
        if (e.key === "+" || e.key === "=") batch = Math.min(batch + 1, 20);
        if (e.key === "-") batch = Math.max(batch - 1, 1);
    };
    window.addEventListener("keydown", window.__spamClickerKey);

    function spam() {
        if (!paused && window.__spamClickerActive) {
            const el = document.elementFromPoint(window.__spamClickerMouse.x, window.__spamClickerMouse.y);
            if (el) for (let i = 0; i < batch; i++) el.click();
        }
        if (window.__spamClickerActive) requestAnimationFrame(spam);
    }

    requestAnimationFrame(spam);
}
function adBGone() {
    const selectors = [
        '#sidebar-wrap','#advert','#xrail','#middle-article-advert-container','#sponsored-recommendations',
        '#around-the-web','#taboola-content','.ad','.advertisement','.GoogleActiveViewClass','.ad-slot',
        '.ad-banner','.ad-anchored','.trc_rbox_outer','.OUTBRAIN','iframe','video','amp-ad','ins.adsbygoogle',
        'div[id^="google_ads_iframe"]'
    ];

    const removeAds = () => {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el?.remove());
        });
    };

    removeAds(); // initial cleanup
    setInterval(removeAds, 1500);

    if (window.MutationObserver) {
        new MutationObserver(removeAds).observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    }

    let lastUrl = location.href;

    const wrapHistory = (obj, method) => {
        const orig = obj[method];
        obj[method] = function() {
            const result = orig.apply(this, arguments);
            setTimeout(removeAds, 60);
            return result;
        };
    };
    wrapHistory(history, 'pushState');
    wrapHistory(history, 'replaceState');

    window.addEventListener('popstate', () => setTimeout(removeAds, 60));
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            removeAds();
        }
    }, 300);

    // Add Lunar Client style button
    if (!document.getElementById('adBGoneBtn')) {
        const btn = document.createElement('button');
        btn.id = 'adBGoneBtn';
        btn.innerText = '💥 Ad-B-Gone';

        Object.assign(btn.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            padding: '10px 16px',
            background: '#1a1a1a',
            color: '#00ffff',
            border: '2px solid #00ffff',
            borderRadius: '8px',
            cursor: 'grab',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 0 8px #00ffff, 0 0 16px #00ffff33',
            transition: 'all 0.2s ease'
        });

        // Hover glow only (no scaling)
        btn.onmouseover = () => {
            btn.style.boxShadow = '0 0 12px #00ffff, 0 0 24px #00ffff66';
        };
        btn.onmouseout = () => {
            btn.style.boxShadow = '0 0 8px #00ffff, 0 0 16px #00ffff33';
        };

        btn.onclick = removeAds;

        // Draggable
        let isDragging = false, offsetX = 0, offsetY = 0;
        btn.onmousedown = e => {
            isDragging = true;
            offsetX = e.clientX - btn.offsetLeft;
            offsetY = e.clientY - btn.offsetTop;
            btn.style.cursor = 'grabbing';
        };
        document.onmousemove = e => {
            if (isDragging) {
                btn.style.left = e.clientX - offsetX + 'px';
                btn.style.top = e.clientY - offsetY + 'px';
            }
        };
        document.onmouseup = () => {
            isDragging = false;
            btn.style.cursor = 'grab';
        };

        document.body.appendChild(btn);
    }
}
function dvdLogo() {
  // helper for LCM
  function LCM(a, b) {
    function GCD(a, b) { return b === 0 ? a : GCD(b, a % b); }
    return (a * b) / GCD(a, b);
  }

  const W = document.body.clientWidth;
  const H = document.body.clientHeight;

  // create DVD div
  const dvd = document.createElement("div");
  dvd.id = "dvd";
  dvd.style.cssText = `
    position:fixed;left:0;top:0;height:60px;width:136px;mask:url(https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg);-webkit-mask:url(https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg);background-repeat:no-repeat;background-size:75px;background-position:center;background-color:#f80;z-index:9999999999;
  `;
  document.body.insertBefore(dvd, document.body.firstChild);

  // initial positions & settings
  let x = Math.floor(Math.random() * (W - 100));
  let y = Math.floor(Math.random() * (H - 50));
  let dirX = 1, dirY = 1;
  const speed = Math.max(2, Math.min(W, H) / 200);
  const palette = ["#ff8800", "#e124ff", "#6a19ff", "#ff2188"];
  let prevColorIndex = 0;
  const dvdWidth = dvd.clientWidth;
  const dvdHeight = dvd.clientHeight;
  const d = LCM(W - dvdWidth, H - dvdHeight);
  let steps = 0;

  function getNewColor() {
    const c = [...palette];
    c.splice(prevColorIndex, 1);
    const idx = Math.floor(Math.random() * c.length);
    prevColorIndex = idx < prevColorIndex ? idx : idx + 1;
    return c[idx];
  }

  function animate() {
    if (y + dvdHeight >= H || y < 0) { dirY *= -1; dvd.style.backgroundColor = getNewColor(); }
    if (x + dvdWidth >= W || x < 0) { dirX *= -1; dvd.style.backgroundColor = getNewColor(); }

    x += dirX * speed;
    y += dirY * speed;
    dvd.style.left = x + "px";
    dvd.style.top = y + "px";

    steps++;
    const remaining = d - steps;
    if (remaining <= 0) steps = 0;

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);

  // key controls
  document.addEventListener("keydown", e => {
    if (!dvd) return;
    if (e.key === "1") dvd.style.display = dvd.style.display === "none" ? "block" : "none";
    if (e.key === "Escape") { dvd.remove(); dvdLogoSt = false; }
  });
}
function openTabs(count) {
  if (!count || isNaN(count) || count <= 0) return;
  for (let i = 0; i < count; i++) {
    window.open("about:blank", "_blank");
  }
}
function pageMarker() {
  if (window.__pageMarker) { window.__pageMarker.toggle(); return; }

  let active = false, drawing = false, lastX = 0, lastY = 0, color = "#ff0000", size = 3, eraser = false;
  const undoStack = [], maxUndo = 20;

  const cvs = document.createElement("canvas");
  cvs.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;pointer-events:none;";
  const ctx = cvs.getContext("2d");

  function resize() { cvs.width = innerWidth; cvs.height = innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  document.body.appendChild(cvs);

  function saveState() {
    if (undoStack.length >= maxUndo) undoStack.shift();
    undoStack.push(ctx.getImageData(0, 0, cvs.width, cvs.height));
  }

  function start(e) {
    if (!active) return;
    drawing = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    [lastX, lastY] = [x, y];
    saveState();
  }

  function move(e) {
    if (!drawing || !active) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;

    if (eraser) {
      ctx.globalCompositeOperation = "destination-out";
      const dx = x - lastX, dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.ceil(dist / (size / 2));
      for (let i = 0; i <= steps; i++) {
        const cx = lastX + dx * (i / steps);
        const cy = lastY + dy * (i / steps);
        ctx.beginPath();
        ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    [lastX, lastY] = [x, y];
  }

  function end() { drawing = false; }

  // mouse events
  cvs.addEventListener("mousedown", start);
  cvs.addEventListener("mousemove", move);
  cvs.addEventListener("mouseup", end);
  cvs.addEventListener("mouseleave", end);

  // touch events
  cvs.addEventListener("touchstart", start);
  cvs.addEventListener("touchmove", move);
  cvs.addEventListener("touchend", end);

  // Lunar Client–style toolbar
  const bar = document.createElement("div");
  bar.innerHTML = `
    <button id="pm-toggle">🖊️</button>
    <button id="pm-eraser">🩹</button>
    <input type="color" id="pm-color" value="#ff0000">
    <input type="range" id="pm-size" min="1" max="20" value="3">
    <button id="pm-undo">↩️</button>
    <button id="pm-clear">🧹</button>
    <button id="pm-exit">❌</button>
  `;
  Object.assign(bar.style, {
    position: "fixed",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1a1a1a",
    padding: "8px 12px",
    borderRadius: "8px",
    zIndex: 1000000,
    display: "flex",
    gap: "6px",
    boxShadow: "0 0 10px #00ffff55",
    cursor: "grab",
    userSelect: "none"
  });
  document.body.appendChild(bar);

  // draggable toolbar
  let isDragging = false, offsetX = 0, offsetY = 0;
  bar.onmousedown = e => { isDragging = true; offsetX = e.clientX - bar.offsetLeft; offsetY = e.clientY - bar.offsetTop; bar.style.cursor = "grabbing"; };
  document.onmousemove = e => { if (isDragging) { bar.style.left = e.clientX - offsetX + "px"; bar.style.top = e.clientY - offsetY + "px"; } };
  document.onmouseup = () => { isDragging = false; bar.style.cursor = "grab"; };

  bar.querySelector("#pm-toggle").onclick = () => { active = !active; cvs.style.pointerEvents = active ? "auto" : "none"; };
  bar.querySelector("#pm-eraser").onclick = () => { eraser = !eraser; bar.querySelector("#pm-eraser").style.background = eraser ? "#555" : ""; };
  bar.querySelector("#pm-color").oninput = e => color = e.target.value;
  bar.querySelector("#pm-size").oninput = e => size = +e.target.value;
  bar.querySelector("#pm-clear").onclick = () => ctx.clearRect(0, 0, cvs.width, cvs.height);
  bar.querySelector("#pm-undo").onclick = () => { if (undoStack.length) ctx.putImageData(undoStack.pop(), 0, 0); };
  bar.querySelector("#pm-exit").onclick = () => { window.removeEventListener("resize", resize); document.removeEventListener("keydown", keyHandler); cvs.remove(); bar.remove(); delete window.__pageMarker; };

  function keyHandler(e) {
    if (e.ctrlKey && e.key === "z") bar.querySelector("#pm-undo").click();
    if (e.key.toLowerCase() === "e") bar.querySelector("#pm-eraser").click();
    if (e.key.toLowerCase() === "c") bar.querySelector("#pm-clear").click();
    if (e.key.toLowerCase() === "p") bar.querySelector("#pm-toggle").click();
  }
  document.addEventListener("keydown", keyHandler);

  window.__pageMarker = { toggle: () => { active = !active; cvs.style.pointerEvents = active ? "auto" : "none"; } };
}
function cloakPage(newTitle = "Google", newFavicon = "https://www.google.com/favicon.ico") {
  const w = window.open("about:blank", "_blank");

  if (!w) return;

  // Load the current page inside the new window
  w.document.write(`
    <head>
      <title>${newTitle}</title>
      <link rel="icon" href="${newFavicon}">
    </head>
    <body style="margin:0;overflow:hidden;">
      <iframe src="${location.href}"
        style="position:fixed;top:0;left:0;width:100vw;height:100vh;border:0;">
      </iframe>
    </body>
  `);
}

(function createFloatingMenu() {
  const ID = 'Menu-M.M.';
  const existing = document.getElementById(ID);
  if (existing) { existing.style.display = existing.style.display === 'none' ? 'block' : 'none'; return; }

  const host = document.createElement('div');
  host.id = ID;
  Object.assign(host.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: 2147483647,
  });
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const css = `
    :host { font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial; }
    .card {
      width: 260px;
      background: rgba(26,26,26,0.95);
      color: #00ffff;
      border-radius: 12px;
      box-shadow: 0 0 12px #00ffff55;
      padding: 10px;
      backdrop-filter: blur(6px);
      border: 1px solid rgba(0,255,255,0.2);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      cursor: grab;
      user-select: none;
    }
    .title { font-weight: 600; font-size: 14px; }
    .btn {
      display: block;
      width: 100%;
      padding: 8px 10px;
      margin: 6px 0;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid rgba(0,255,255,0.2);
      background: #111;
      font-size: 13px;
      text-align: left;
      color: #00ffff;
      box-shadow: 0 0 6px #00ffff33;
      transition: all 0.15s ease;
    }
    .btn:hover { box-shadow: 0 0 12px #00ffff55; background: #222; }
    .btn:active { transform: translateY(1px); }
    .small { font-size: 12px; color: #555; margin-top: 6px; }
    .close-x {
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      background: transparent;
      border: none;
      font-weight: 700;
      color: #00ffff;
    }
    .close-x:hover { color: #fff; }
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `
    <div class="header"><div class="title">Quick Menu</div><button class="close-x" title="Close">✕</button></div>
    <button class="btn" id="btn-clicker">Auto Clicker</button>
    <button class="btn" id="btn-ads">Remove all ads</button>
    <button class="btn" id="btn-dvd">A DVD Bounces around</button>
    <button class="btn" id="btn-tab">Tab Opener</button>
    <button class="btn" id="btn-marker">Draw on the Page</button>
    <button class="btn" id="btn-cloak">Hide the current tab</button>
    <button class="btn" id="btn-scroll">Scroll to top</button>
    <button class="btn" id="btn-dark">Toggle dark</button>
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  shadow.appendChild(styleEl);
  shadow.appendChild(wrapper);

  const $ = sel => shadow.querySelector(sel);

  $('#btn-clicker').onclick = () => { if (!window.autoClickerSt) { window.autoClickerSt = true; autoClicker(); } };
  $('#btn-marker').onclick = () => { if (!window.pageMarkerSt) { window.pageMarkerSt = true; pageMarker(); } };
  $('#btn-tab').onclick = () => openTabs(prompt('How many tabs do you want to open?'));
  $('#btn-dvd').onclick = () => { if (!window.dvdLogoSt) { window.dvdLogoSt = true; dvdLogo(); } };
  $('#btn-ads').onclick = () => { if (!window.adBGoneSt) { window.adBGoneSt = true; adBGone(); } };
  $('#btn-scroll').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#btn-cloak').onclick = () => cloakPage();

  let dark = false;
  $('#btn-dark').onclick = () => {
    dark = !dark;
    const card = wrapper;
    if (dark) {
      card.style.background = 'rgba(10,10,10,0.95)';
      card.style.color = '#00ffff';
      card.style.border = '1px solid rgba(0,255,255,0.2)';
    } else {
      card.style.background = 'rgba(26,26,26,0.95)';
      card.style.color = '#00ffff';
      card.style.border = '1px solid rgba(0,255,255,0.2)';
    }
  };

  $('.close-x').onclick = () => host.remove();

  (function enableDrag() {
    const el = wrapper;
    let isDown = false, startX = 0, startY = 0, origRight = 0, origBottom = 0;
    el.addEventListener('mousedown', e => {
      const headerClicked = e.composedPath().some(node => node.classList && node.classList.contains && node.classList.contains('header'));
      if (!headerClicked) return;
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      origRight = parseFloat(getComputedStyle(host).right) || 16;
      origBottom = parseFloat(getComputedStyle(host).bottom) || 16;
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      host.style.right = (origRight - dx) + 'px';
      host.style.bottom = (origBottom - dy) + 'px';
    });
    window.addEventListener('mouseup', () => { isDown = false; });
  })();

  shadow.querySelector('.btn').focus();
  setTimeout(() => { try { host.remove(); } catch(e){} }, 120000);
})();
