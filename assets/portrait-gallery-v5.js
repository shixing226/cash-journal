// Decorative carousel only. No account, ledger or receipt data access.
(() => {
  'use strict';
  let photo = document.getElementById('portraitPhoto');
  if (!photo) return;
  const panel = photo.parentElement;
  const gallery = [
    ['gallery-scene-01-v1.webp', '雨夜城市中的蓝衣女孩', '25%'],
    ['gallery-01-v1.webp', '窗边女孩与慵懒猫咪', '30%'],
    ['gallery-scene-05-v1.webp', '阳光温室里的植物小机器人', '40%'],
    ['gallery-04-v1.webp', '落日山巅的温暖回眸', '30%'],
    ['gallery-scene-03-v1.webp', '雪山湖畔的旅行女孩', '25%'],
    ['gallery-02-v1.webp', '温暖夜景中的惬意时光', '30%'],
    ['gallery-scene-02-v1.webp', '阳光花园中的清新女孩', '25%'],
    ['gallery-05-v1.webp', '夜色窗畔的温柔女孩', '30%'],
    ['gallery-scene-06-v1.webp', '星空观测台的小机器人', '40%'],
    ['gallery-03-v1.webp', '温暖午后，与猫相伴', '30%'],
    ['gallery-scene-04-v1.webp', '暖光书店里的阅读女孩', '25%'],
    ['gallery-07-v1.webp', '落日山野中的温柔时光', '40%']
  ];
  const key = 'cash-journal:portrait-next:v1';
  const script = document.querySelector('script[src$="/portrait-gallery-v5.js"]');
  const base = script ? script.src : new URL('./assets/portrait-gallery-v5.js', document.baseURI).href;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer = 0, busy = false, visible = false, hovered = false;
  let paused = reduced.matches, touch = null;
  try {
    const saved = Number(localStorage.getItem(key));
    if (Number.isSafeInteger(saved) && saved >= 0) index = saved % gallery.length;
  } catch (_) { /* Optional appearance preference only. */ }
  function remember() {
    panel.dataset.photoIndex = String(index);
    try { localStorage.setItem(key, String((index + 1) % gallery.length)); } catch (_) {}
  }
  function configure(img, item) {
    img.className = 'carousel-image';
    img.alt = item[1];
    img.width = 1440; img.height = 810;
    img.draggable = false;
    img.decoding = 'async';
    img.style.setProperty('--banner-y', item[2]);
    img.src = new URL(item[0], base).href;
  }
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-roledescription', '轮播图');
  panel.setAttribute('aria-label', '人物与机器人风景照片');
  panel.tabIndex = 0;
  panel.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Space');
  function allowed() {
    return !paused && !document.hidden && visible && !hovered && !touch &&
      !panel.contains(document.activeElement) && !document.querySelector('.overlay.show');
  }
  function schedule() {
    clearTimeout(timer);
    if (!busy && allowed()) timer = setTimeout(() => change(1, false), 6000);
  }
  function updateToggle() {
    panel.dataset.autoplay = paused ? 'paused' : 'playing';
    schedule();
  }
  async function change(direction, manual) {
    if (busy || (!manual && !allowed())) return;
    clearTimeout(timer); busy = true;
    const target = (index + direction + gallery.length) % gallery.length;
    const incoming = new Image();
    let loadingTimeout;
    try {
      await new Promise((resolve, reject) => {
        incoming.onload = resolve;
        incoming.onerror = () => reject(new Error('Image unavailable'));
        loadingTimeout = setTimeout(() => reject(new Error('Image timeout')), 15000);
        configure(incoming, gallery[target]);
      });
      clearTimeout(loadingTimeout);
      if (incoming.decode) await incoming.decode();
      if (!manual && !allowed()) return;
      const old = photo;
      panel.append(incoming);
      if (!reduced.matches && incoming.animate) {
        const options = {duration:450, easing:'cubic-bezier(.22,.61,.36,1)', fill:'both'};
        const a = incoming.animate([{transform:`translateX(${direction * 100}%)`},{transform:'translateX(0)'}], options);
        const b = old.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction * 100}%)`}], options);
        await Promise.all([a.finished, b.finished]);
        a.cancel(); b.cancel();
      }
      old.remove();
      incoming.id = 'portraitPhoto'; photo = incoming;
      index = target; remember();
    } catch (_) {
      incoming.remove();
    } finally {
      clearTimeout(loadingTimeout);
      incoming.onload = incoming.onerror = null;
      busy = false; schedule();
    }
  }
  panel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); change(e.key === 'ArrowLeft' ? -1 : 1, true);
    }
    if (e.key === ' ') { e.preventDefault(); paused = !paused; updateToggle(); }
  });
  panel.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse'){hovered = true; schedule();} });
  panel.addEventListener('pointerleave', e => { if(e.pointerType === 'mouse'){hovered = false; schedule();} });
  panel.addEventListener('focusin', schedule);
  panel.addEventListener('focusout', () => setTimeout(schedule, 0));
  panel.addEventListener('pointerdown', e => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    touch = {id:e.pointerId,x:e.clientX,y:e.clientY};
    panel.setPointerCapture(e.pointerId); schedule();
  });
  panel.addEventListener('pointerup', e => {
    if (!touch || e.pointerId !== touch.id) return;
    const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
    touch = null;
    if(e.pointerType === 'touch' && document.activeElement === panel) panel.blur();
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) change(dx < 0 ? 1 : -1, true);
    else schedule();
  });
  panel.addEventListener('pointercancel', e => {
    touch = null;
    if(e.pointerType === 'touch' && document.activeElement === panel) panel.blur();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', schedule);
  reduced.addEventListener('change', () => { if(reduced.matches) paused = true; updateToggle(); });
  new MutationObserver(schedule).observe(document.body, {attributes:true, attributeFilter:['class']});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1; schedule(); }, {threshold:0.1}).observe(panel);
  } else { visible = true; }
  photo.addEventListener('load', schedule, {once:true});
  photo.addEventListener('error', () => {
    photo.alt = '阳光房间中的女性与猫';
    photo.src = new URL('cozy-photo-v1.webp', base).href;
  }, {once:true});
  configure(photo, gallery[index]); remember(); updateToggle();
})();
