/* ============================================================
   Dev Mobile Emulator — mobile-first pregled dok se radi dizajn
   Kako radi: otvara iframe iste stranice u telefon-frame-u.
   Media query-ji reaguju na širinu iframe-a (pravi mobilni layout).
   Unutar iframe-a se toggle NE prikazuje (nema ugnježđivanja).
   ============================================================ */
(function () {
  // Ako smo unutar emulator iframe-a → ne dodaj toggle
  if (window.self !== window.top) {
    document.documentElement.setAttribute("data-devmob-embed", "1");
    return;
  }

  var DEVICES = [
    { name: "iPhone SE",        w: 375, h: 667 },
    { name: "iPhone 14 / 15",   w: 390, h: 844 },
    { name: "iPhone Pro Max",   w: 430, h: 932 },
    { name: "Pixel 7",          w: 412, h: 915 },
    { name: "Galaxy S8+",       w: 360, h: 740 },
    { name: "Tablet (mini)",    w: 768, h: 1024 }
  ];

  var idx = 1;          // default iPhone 14/15
  var landscape = false;
  var open = false;

  // ---- FAB dugme -------------------------------------------------
  var fab = document.createElement("button");
  fab.className = "devmob-fab";
  fab.type = "button";
  fab.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" ' +
    'height="20" rx="3"/><line x1="11" y1="18" x2="13" y2="18"/></svg>' +
    '<span class="devmob-fab-label">Mobile</span>';
  document.body.appendChild(fab);

  // ---- Overlay + frame ------------------------------------------
  var overlay = document.createElement("div");
  overlay.className = "devmob-overlay";
  overlay.innerHTML =
    '<div class="devmob-toolbar">' +
      '<select class="devmob-select"></select>' +
      '<span class="devmob-dims"></span>' +
      '<button class="devmob-rotate" type="button">⟳ Rotiraj</button>' +
      '<button class="devmob-close" type="button">✕ Zatvori</button>' +
    '</div>' +
    '<div class="devmob-stage">' +
      '<div class="devmob-device">' +
        '<div class="devmob-screen"><iframe title="Mobile preview"></iframe></div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var select  = overlay.querySelector(".devmob-select");
  var dims    = overlay.querySelector(".devmob-dims");
  var stage   = overlay.querySelector(".devmob-stage");
  var device  = overlay.querySelector(".devmob-device");
  var screen  = overlay.querySelector(".devmob-screen");
  var iframe  = overlay.querySelector("iframe");

  DEVICES.forEach(function (d, i) {
    var o = document.createElement("option");
    o.value = i;
    o.textContent = d.name + " — " + d.w + "×" + d.h;
    select.appendChild(o);
  });
  select.value = idx;

  function currentSize() {
    var d = DEVICES[idx];
    return landscape ? { w: d.h, h: d.w } : { w: d.w, h: d.h };
  }

  function apply() {
    var s = currentSize();
    iframe.style.width  = s.w + "px";
    iframe.style.height = s.h + "px";
    screen.style.width  = s.w + "px";
    screen.style.height = s.h + "px";
    device.classList.toggle("is-landscape", landscape);
    dims.textContent = s.w + " × " + s.h;
    fit();
  }

  function fit() {
    // Uklopi telefon u dostupnu visinu/širinu ekrana (vizuelno skaliranje)
    var availH = window.innerHeight - 150;
    var availW = window.innerWidth - 48;
    var frameW = currentSize().w + 24;   // + padding bezela
    var frameH = currentSize().h + 24;
    var scale = Math.min(1, availH / frameH, availW / frameW);
    stage.style.transform = "scale(" + scale + ")";
  }

  function loadFrame() {
    // Ista stranica, ali unutar iframe-a → toggle se sam sakrije
    iframe.src = window.location.pathname + window.location.search;
  }

  function openEmu() {
    open = true;
    if (!iframe.src || iframe.src === "about:blank") loadFrame();
    apply();
    overlay.classList.add("is-open");
    fab.classList.add("is-active");
    fab.querySelector(".devmob-fab-label").textContent = "Mobile: ON";
  }

  function closeEmu() {
    open = false;
    overlay.classList.remove("is-open");
    fab.classList.remove("is-active");
    fab.querySelector(".devmob-fab-label").textContent = "Mobile";
  }

  fab.addEventListener("click", function () { open ? closeEmu() : openEmu(); });
  overlay.querySelector(".devmob-close").addEventListener("click", closeEmu);
  overlay.querySelector(".devmob-rotate").addEventListener("click", function () {
    landscape = !landscape;
    apply();
  });
  select.addEventListener("change", function () {
    idx = parseInt(select.value, 10);
    landscape = false;
    apply();
  });
  // Klik na tamnu pozadinu (van telefona) zatvara
  overlay.addEventListener("mousedown", function (e) {
    if (e.target === overlay) closeEmu();
  });
  // ESC zatvara, Ctrl/Cmd+M otvara/zatvara
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) closeEmu();
    if ((e.ctrlKey || e.metaKey) && (e.key === "m" || e.key === "M")) {
      e.preventDefault();
      open ? closeEmu() : openEmu();
    }
  });
  window.addEventListener("resize", function () { if (open) fit(); });
})();
