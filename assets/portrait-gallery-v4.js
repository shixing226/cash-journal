// Appearance only: landscape gallery, no ledger/auth access.
(() => {
  'use strict';
  const photo = document.getElementById('portraitPhoto');
  if (!photo) return;
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
  let index = 0;
  try {
    const saved = Number(localStorage.getItem(key));
    if (Number.isSafeInteger(saved) && saved >= 0) index = saved % gallery.length;
    localStorage.setItem(key, String((index + 1) % gallery.length));
  } catch (_) { /* Storage restrictions must not prevent bookkeeping. */ }
  const [file, label, y] = gallery[index];
  const panel = photo.parentElement;
  panel.dataset.photoIndex = String(index);
  panel.style.setProperty('--banner-y', y);
  photo.alt = label;
  const script = document.querySelector('script[src$="/portrait-gallery-v4.js"]');
  const base = script ? script.src : new URL('./assets/portrait-gallery-v4.js', document.baseURI).href;
  photo.addEventListener('error', () => {
    photo.alt = '阳光房间中的女性与猫';
    panel.style.setProperty('--banner-y', '30%');
    photo.src = new URL('cozy-photo-v1.webp', base).href;
  }, { once: true });
  photo.src = new URL(file, base).href;
})();
