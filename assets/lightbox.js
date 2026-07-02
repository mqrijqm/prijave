/* ============================================================
   LIGHTBOX — klik na hero sliku (ili zoom dugme) otvara punu
   sliku preko cijelog ekrana. Zatvara se klikom van, X, ili Esc.
   Bonus: #zoom u URL-u automatski otvara sliku (shareable link).
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const img = hero.querySelector('img');
  const trigger = hero.querySelector('.hero-zoom');
  if (!img) return;

  let box = null;

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Zatvori">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>' +
      '</button><img alt="" />';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.lightbox-close')) close();
    });
  }

  function open() {
    if (!box) build();
    box.querySelector('img').src = img.currentSrc || img.src;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('open'); });
  }

  function close() {
    if (!box) return;
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  img.addEventListener('click', open);
  if (trigger) trigger.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  if (location.hash === '#zoom') open();
})();
