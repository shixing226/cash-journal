// Appearance only: no account, ledger, network API, or receipt access.
(() => {
  'use strict';
  const photo = document.getElementById('portraitPhoto');
  const caption = document.getElementById('portraitCaption');
  if (!photo || !caption) return;
  const gallery = [
    ['gallery-01-v1.webp', '窗边女孩与慵懒猫咪', '31%', '30%'],
    ['gallery-02-v1.webp', '温暖夜景中的惬意时光', '36%', '30%'],
    ['gallery-03-v1.webp', '温暖午后，与猫相伴', '34%', '30%'],
    ['gallery-04-v1.webp', '落日山巅的温暖回眸', '64%', '30%'],
    ['gallery-05-v1.webp', '夜色窗畔的温柔女孩', '36%', '30%'],
    ['gallery-07-v1.webp', '落日山野中的温柔时光', '62%', '40%'],
    ['gallery-08-v1.webp', '温暖阳光下的创意工作室', '55%', '25%'],
    ['gallery-09-v1.webp', '温暖创意工作室里的她与猫', '58%', '25%'],
    ['gallery-11-v1.webp', '温馨开发者桌前的自拍时光', '52%', '25%'],
    ['gallery-12-v1.webp', '温暖创意工作台与猫咪陪伴', '52%', '25%'],
    ['gallery-13-v1.webp', '温馨办公桌前的微笑时光', '50%', '25%'],
    ['gallery-14-v1.webp', '温馨夜灯下的机器人伙伴', '57%', '20%'],
    ['gallery-15-v1.webp', '温馨书桌旁的友好机器人助手', '54%', '20%'],
    ['gallery-single-01-v1.webp', '山巅夕照', '50%', '25%'],
    ['gallery-single-02-v1.webp', '一杯咖啡的午后', '50%', '25%'],
    ['gallery-single-03-v1.webp', '与猫相伴', '50%', '25%'],
    ['gallery-single-04-v1.webp', '窗边夜景', '50%', '25%'],
    ['gallery-single-05-v1.webp', '工作中的微笑', '50%', '25%'],
    ['gallery-single-06-v1.webp', '咖啡时光', '50%', '25%'],
    ['gallery-single-07-v1.webp', '海边远行', '50%', '25%'],
    ['gallery-single-08-v1.webp', '和小猫一起休息', '50%', '25%'],
    ['gallery-single-09-v1.webp', '运动好心情', '50%', '25%'],
    ['gallery-single-10-v1.webp', '生活里的烟火气', '50%', '25%'],
    ['gallery-single-11-v1.webp', '夜晚专注工作', '50%', '25%'],
    ['gallery-single-12-v1.webp', '围巾自拍', '50%', '25%']
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
  const [file, label, desktopX, mobileY] = gallery[index];
  const panel = photo.parentElement;
  panel.dataset.photoIndex = String(index);
  panel.style.setProperty('--portrait-x', desktopX);
  panel.style.setProperty('--portrait-mobile-y', mobileY);
  photo.alt = label;
  caption.textContent = `${index + 1} / ${gallery.length} · 重新打开切换`;
  photo.addEventListener('load', () => { caption.hidden = false; });
  photo.addEventListener('error', () => {
    photo.alt = '阳光房间中的女性与猫';
    panel.style.setProperty('--portrait-x', '31%');
    caption.textContent = '备用照片 · 重新打开切换';
    photo.src = new URL('cozy-photo-v1.webp', base).href;
  }, { once: true });
  const script = document.querySelector('script[src$="/portrait-gallery-v2.js"]');
  const base = script ? script.src : new URL('./assets/portrait-gallery-v2.js', document.baseURI).href;
  photo.src = new URL(file, base).href;
})();
