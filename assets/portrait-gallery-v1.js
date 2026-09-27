// Appearance only: no account, ledger, network API, or receipt access.
(() => {
  'use strict';
  const photo = document.getElementById('portraitPhoto');
  const caption = document.getElementById('portraitCaption');
  if (!photo || !caption) return;
  const gallery = [
    ['窗边女孩与慵懒猫咪', '31%', '30%'],
    ['温暖夜景中的惬意时光', '36%', '30%'],
    ['温暖午后，与猫相伴', '34%', '30%'],
    ['落日山巅的温暖回眸', '64%', '30%'],
    ['夜色窗畔的温柔女孩', '36%', '30%'],
    ['四季心境与美好瞬间', '50%', '50%', true],
    ['落日山野中的温柔时光', '62%', '40%'],
    ['温暖阳光下的创意工作室', '55%', '25%'],
    ['温暖创意工作室里的她与猫', '58%', '25%'],
    ['温暖日常：工作、生活与远方', '50%', '50%', true],
    ['温馨开发者桌前的自拍时光', '52%', '25%'],
    ['温暖创意工作台与猫咪陪伴', '52%', '25%'],
    ['温馨办公桌前的微笑时光', '50%', '25%'],
    ['温馨夜灯下的机器人伙伴', '57%', '20%'],
    ['温馨书桌旁的友好机器人助手', '54%', '20%']
  ];
  const key = 'cash-journal:portrait-next:v1';
  let index = 0;
  try {
    const saved = Number(localStorage.getItem(key));
    if (Number.isSafeInteger(saved) && saved >= 0) index = saved % gallery.length;
    localStorage.setItem(key, String((index + 1) % gallery.length));
  } catch (_) {
    // Private/blocked storage must never prevent bookkeeping or photo display.
  }
  const [label, desktopX, mobileY, whole] = gallery[index];
  const panel = photo.parentElement;
  panel.dataset.photoIndex = String(index);
  panel.style.setProperty('--portrait-x', desktopX);
  panel.style.setProperty('--portrait-mobile-y', mobileY);
  panel.classList.toggle('portrait-whole', Boolean(whole));
  photo.alt = label;
  caption.textContent = `${index + 1} / ${gallery.length} · 重新打开切换`;
  photo.addEventListener('load', () => { caption.hidden = false; });
  photo.addEventListener('error', () => {
    photo.alt = '阳光房间中的女性与猫';
    panel.classList.remove('portrait-whole');
    panel.style.setProperty('--portrait-x', '31%');
    caption.textContent = '备用照片 · 重新打开切换';
    photo.src = new URL('cozy-photo-v1.webp', base).href;
  }, { once: true });
  // Resolve relative to the script so both domain root and GitHub subpath work.
  const script = document.querySelector('script[src$="/portrait-gallery-v1.js"]');
  const base = script ? script.src : new URL('./assets/portrait-gallery-v1.js', document.baseURI).href;
  photo.src = new URL(`gallery-${String(index + 1).padStart(2, '0')}-v1.webp`, base).href;
})();
