const state = {
  animals: [],
  query: "",
  featuredOnly: false,
};

const els = {
  home: document.getElementById("view-home"),
  animal: document.getElementById("view-animal"),
  about: document.getElementById("view-about"),
  gallery: document.getElementById("gallery"),
  count: document.getElementById("count"),
  q: document.getElementById("q"),
};

function show(view) {
  for (const node of [els.home, els.animal, els.about]) {
    const on = node === view;
    node.classList.toggle("hidden", !on);
    node.hidden = !on;
  }
  document.querySelectorAll("nav a").forEach((a) => {
    const hash = a.getAttribute("href");
    a.setAttribute("aria-current", location.hash === hash || (hash === "#/" && (location.hash === "" || location.hash === "#/")) ? "page" : null);
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let list = null;
  const flushList = () => {
    if (list) {
      html.push(`<ul>${list.join("")}</ul>`);
      list = null;
    }
  };
  const inline = (t) =>
    escapeHtml(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      list = list || [];
      list.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    flushList();
    if (line.startsWith("# ")) html.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith("## ")) html.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith("### ")) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else html.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  return html.join("\n");
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  return state.animals
    .filter((a) => !state.featuredOnly || a.featured)
    .filter((a) => {
      if (!q) return true;
      return [a.name, a.scientific, a.id, a.tagline, a.status, a.range]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => a.order - b.order);
}

function renderGallery() {
  const items = filtered();
  els.count.textContent = `${items.length} sticker${items.length === 1 ? "" : "s"} in view`;
  if (!items.length) {
    els.gallery.innerHTML = `<p class="empty">No stickers match that search.</p>`;
    return;
  }
  els.gallery.innerHTML = items
    .map(
      (a) => `
      <a class="card" href="#/animal/${a.id}" data-nav>
        <div class="sheet" style="background:${a.sheet}">
          <img src="${a.sticker}" alt="${escapeHtml(a.name)} die-cut sticker" width="400" height="400" loading="lazy">
        </div>
        <div class="meta">
          <h2>${escapeHtml(a.name)}</h2>
          <p>${escapeHtml(a.scientific)}</p>
          <span class="pill">${escapeHtml(a.status)}</span>
        </div>
      </a>`
    )
    .join("");
}

function setStage(animal, src) {
  const img = document.getElementById("stage-img");
  if (img) img.src = src;
  document.querySelectorAll(".alts button").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.src === src ? "true" : "false");
  });
}

async function renderAnimal(id) {
  const animal = state.animals.find((a) => a.id === id);
  if (!animal) {
    els.animal.innerHTML = `<p class="empty">Unknown animal. <a href="#/" data-nav>Back to pack</a></p>`;
    show(els.animal);
    return;
  }
  document.title = `${animal.name} — Animal Stickers`;
  let lore = "";
  try {
    const res = await fetch(animal.lore);
    lore = res.ok ? renderMarkdown(await res.text()) : "<p>Lore file could not be loaded.</p>";
  } catch {
    lore = "<p>Lore file could not be loaded.</p>";
  }
  const alts = [animal.sticker, animal.portrait].filter((v, i, arr) => arr.indexOf(v) === i);
  els.animal.innerHTML = `
    <article class="animal">
      <div class="stage" style="background:${animal.sheet}">
        <img id="stage-img" src="${animal.sticker}" alt="${escapeHtml(animal.name)} sticker">
        ${
          alts.length > 1
            ? `<div class="alts">${alts
                .map(
                  (src, i) =>
                    `<button type="button" data-src="${src}" aria-pressed="${i === 0}" aria-label="View sticker ${i + 1}">
                       <img src="${src}" alt="">
                     </button>`
                )
                .join("")}</div>`
            : ""
        }
      </div>
      <div class="lore">
        <a class="back" href="#/" data-nav>← Pack</a>
        <p class="kicker">${escapeHtml(animal.tagline)}</p>
        <div class="status-row">
          <span class="pill">${escapeHtml(animal.status)}</span>
          <span class="pill">${escapeHtml(animal.range)}</span>
        </div>
        ${lore}
      </div>
    </article>`;
  els.animal.querySelectorAll(".alts button").forEach((btn) => {
    btn.addEventListener("click", () => setStage(animal, btn.dataset.src));
  });
  show(els.animal);
  window.scrollTo(0, 0);
}

function route() {
  const hash = location.hash || "#/";
  const animal = hash.match(/^#\/animal\/([a-z0-9-]+)/i);
  state.featuredOnly = hash === "#/featured";
  if (hash === "#/about") {
    document.title = "About — Animal Stickers";
    show(els.about);
    return;
  }
  if (animal) {
    renderAnimal(animal[1]);
    return;
  }
  document.title = "Animal Stickers — majestic die-cut wildlife";
  renderGallery();
  show(els.home);
}

async function init() {
  const res = await fetch("data/animals.json");
  const pack = await res.json();
  state.animals = pack.animals;
  els.q.addEventListener("input", () => {
    state.query = els.q.value;
    if ((location.hash || "#/") === "#/" || location.hash === "#/featured") renderGallery();
  });
  window.addEventListener("hashchange", route);
  document.body.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      if (location.hash !== href) location.hash = href;
      else route();
    }
  });
  route();
}

init().catch((err) => {
  els.gallery.innerHTML = `<p class="empty">Could not load the pack. ${escapeHtml(err.message)}</p>`;
});
