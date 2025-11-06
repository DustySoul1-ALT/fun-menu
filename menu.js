function autoClicker() {if(window.__spamClickerActive){window.__spamClickerActive=false;clearTimeout(window.__spamClickerTimeout);window.removeEventListener('mousemove',window.__spamClickerMouseMove,true);window.removeEventListener('keydown',window.__spamClickerKey);if(window.__spamClickerUI)window.__spamClickerUI.remove();return;}window.__spamClickerActive=true;window.__spamClickerMouse={x:0,y:0};window.__spamClickerMouseMove=e=>window.__spamClickerMouse={x:e.clientX,y:e.clientY};window.addEventListener('mousemove',window.__spamClickerMouseMove,true);let interval=5,paused=false,batch=5;function spam(){if(!paused){for(let i=0;i<batch;i++){const el=document.elementFromPoint(window.__spamClickerMouse.x,window.__spamClickerMouse.y);if(el)el.click();}}if(window.__spamClickerActive)window.__spamClickerTimeout=setTimeout(spam,interval);}spam();const ui=document.createElement('div');Object.assign(ui.style,{position:'fixed',right:'12px',bottom:'12px',zIndex:2147483647,padding:'6px 10px',background:'rgba(0,0,0,0.75)',color:'#fff',fontFamily:'system-ui',fontSize:'12px',borderRadius:'8px'});ui.textContent='Click spamming • S pause/resume • + / - speed • Esc stop';document.body.appendChild(ui);window.__spamClickerUI=ui;window.__spamClickerKey=e=>{if(e.key==='Escape'){window.__spamClickerActive=false;clearTimeout(window.__spamClickerTimeout);window.removeEventListener('mousemove',window.__spamClickerMouseMove,true);window.removeEventListener('keydown',window.__spamClickerKey);ui.remove();return;}if(e.key.toLowerCase()==='s'){paused=!paused;ui.textContent=paused?'Paused • S resume • Esc stop':'Click spamming • S pause/resume • + / - speed • Esc stop';}if(e.key==='+'||e.key==='='){interval=Math.max(5,interval-1);}if(e.key==='-'){interval=Math.min(2000,interval+1);}};window.addEventListener('keydown',window.__spamClickerKey);}
function adBGone() {
  const selectors = [
    '#sidebar-wrap','#advert','#xrail','#middle-article-advert-container','#sponsored-recommendations',
    '#around-the-web','#taboola-content','.ad','.advertisement','.GoogleActiveViewClass','.ad-slot',
    '.ad-banner','.ad-anchored','.trc_rbox_outer','.OUTBRAIN','iframe','video','amp-ad','ins.adsbygoogle',
    'div[id^="google_ads_iframe"]'
  ];

  const removeAds = () => {
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el && el.remove());
    });
  };

  removeAds(); // initial cleanup

  // Run every 1.5 seconds to catch new ads
  setInterval(removeAds, 1500);

  // Observe DOM mutations for dynamic content
  if (window.MutationObserver) {
    new MutationObserver(removeAds).observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }

  // Hook history changes to remove ads on navigation
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

  // Add draggable button if it doesn’t exist
  if (!document.getElementById('adBGoneBtn')) {
    const btn = document.createElement('button');
    btn.id = 'adBGoneBtn';
    btn.innerText = '💥 Ad-B-Gone';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      padding: '8px',
      background: 'red',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    });
    btn.onclick = removeAds;
    document.body.appendChild(btn);
  }

  console.log('Ad-B-Gone helper ready');
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
    position: fixed;
    left: 0;
    top: 0;
    height: 60px;
    width: 136px;
    mask: url('https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg');
    -webkit-mask: url('https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg');
    background-repeat: no-repeat;
    background-size: 75px;
    background-position: center;
    background-color: #ff8800;
    z-index: 9999999999;
  `;
  document.body.insertBefore(dvd, document.body.firstChild);

  // create counter
  const counter = document.createElement("div");
  counter.style.cssText = `
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 4px 8px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    font: 14px/1 system-ui, Arial;
    border-radius: 6px;
    z-index: 1000000;
    pointer-events: none;
  `;
  document.body.appendChild(counter);

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
    counter.textContent = "Seconds to corner: " + (remaining / 60).toFixed(1);
    if (remaining <= 0) steps = 0;

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);

  // key controls
  document.addEventListener("keydown", e => {
    if (!dvd) return;
    if (e.key === "1") dvd.style.display = dvd.style.display === "none" ? "block" : "none";
    if (e.key === "Escape") { dvd.remove(); counter.remove(); }
  });
}
function openTabs(count) {
  if (!count || isNaN(count) || count <= 0) return;
  for (let i = 0; i < count; i++) {
    window.open("about:blank", "_blank");
  }
}


(function createFloatingMenu() {
  // If the menu already exists, toggle visibility instead of creating again
  const ID = 'my-floater-unique-elm-98123';
  const existing = document.getElementById(ID);
  if (existing) {
    existing.style.display = (existing.style.display === 'none') ? 'block' : 'none';
    return;
  }

  // Host element to attach a shadow root (avoids page CSS collisions)
  const host = document.createElement('div');
  host.id = ID;
  // Position fixed so it stays on screen
  Object.assign(host.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    zIndex: 2147483647, // as high as we can go
  });
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // Basic styles for the menu (change sizes/colors here)
  const css = `
    :host { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    .card {
      width: 260px;
      background: rgba(255,255,255,0.96);
      color: #111;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      padding: 10px;
      backdrop-filter: blur(6px);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .header {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
      margin-bottom:8px;
    }
    .title { font-weight:600; font-size:14px; }
    .btn {
      display:block;
      width:100%;
      padding:8px 10px;
      margin:6px 0;
      border-radius:8px;
      cursor:pointer;
      border:1px solid rgba(0,0,0,0.08);
      background:#f6f6f7;
      font-size:13px;
      text-align:left;
    }
    .btn:active { transform: translateY(1px); }
    .small {
      font-size:12px; color:#555; margin-top:6px;
    }
    .close-x {
      cursor:pointer;
      padding:4px 6px;
      border-radius:6px;
      background:transparent;
      border:none;
      font-weight:700;
    }
  `;

  // HTML structure
  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `
    <div class="header">
      <div class="title">Quick Menu</div>
      <button class="close-x" title="Close">✕</button>
    </div>

    <button class="btn" id="btn-clicker">Auto Clicker</button>
    <button class="btn" id="btn-ads">Remove all ads</button>
    <button class="btn" id="btn-dvd">A DVD Bounces around</button>
    <button class="btn" id="btn-tab">Tab Opener </button>
    <button class="btn" id="btn-scroll">Scroll to top</button>
    <button class="btn" id="btn-dark">Toggle dark</button>
  `;

  // Attach CSS and node to shadow root
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  shadow.appendChild(styleEl);
  shadow.appendChild(wrapper);

  // Helpers for the buttons
  const $ = (sel) => shadow.querySelector(sel);

  // Button: Copy selected text to clipboard
  $('#btn-clicker').addEventListener('click', async () => {
    autoClicker();
  });
  
  $('#btn-tab').addEventListener('click', async () => {
    openTabs(prompt('How many tabs do you want to open?'))
  });

  $('#btn-dvd').addEventListener('click', async () => {
    dvdLogo();
  });

  // Button: Fill first visible input with a prompt value
  $('#btn-ads').addEventListener('click', () => {
    adBGone();
  });

  // Button: Scroll to top
  $('#btn-scroll').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Button: Toggle a dark-ish theme for the menu only
  let dark = false;
  $('#btn-dark').addEventListener('click', () => {
    dark = !dark;
    const card = wrapper;
    if (dark) {
      card.style.background = 'rgba(20,20,20,0.95)';
      card.style.color = '#eee';
      card.style.border = '1px solid rgba(255,255,255,0.04)';
    } else {
      card.style.background = 'rgba(255,255,255,0.96)';
      card.style.color = '#111';
      card.style.border = '1px solid rgba(0,0,0,0.06)';
    }
  });

  // Close button: remove the menu entirely
  $('.close-x').addEventListener('click', () => {
    host.remove();
  });

  // Drag support so the user can move it around
  (function enableDrag() {
    const el = wrapper;
    let isDown = false, startX=0, startY=0, origRight=0, origBottom=0;
    el.addEventListener('mousedown', (e) => {
      // only start drag when clicking the header/title area
      const header = e.composedPath().some(node => node.classList && node.classList.contains && node.classList.contains('header'));
      if (!header) return;
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      // compute current position from host styles
      origRight = parseFloat(getComputedStyle(host).right) || 16;
      origBottom = parseFloat(getComputedStyle(host).bottom) || 16;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // invert because we're using right/bottom positioning
      host.style.right = (origRight - dx) + 'px';
      host.style.bottom = (origBottom - dy) + 'px';
    });
    window.addEventListener('mouseup', () => { isDown = false; });
  })();

  // small accessibility: focus first button
  shadow.querySelector('.btn').focus();

  // Clean up if the page navigates (optional). Remove after 2 minutes to avoid permanence.
  const cleanupTimer = setTimeout(() => { try { host.remove(); } catch(e){} }, 120000);
})();
