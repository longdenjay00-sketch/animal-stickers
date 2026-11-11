# Animal Stickers

Majestic die-cut wildlife stickers (WebP) plus lore, facts, and known history.

**Pack:** lion, golden eagle, Bengal tiger, black stallion, African savanna elephant, Arctic wolf, barn owl, snow leopard, red fox, orca, jaguar.

## Daily-report links

| Surface | URL |
| --- | --- |
| GitHub repo | https://github.com/longdenjay00-sketch/animal-stickers |
| GitHub Pages | https://longdenjay00-sketch.github.io/animal-stickers/ |
| Vercel (target) | https://animal-stickers.vercel.app |
| Practices | [GITHUB_PRACTICES.md](GITHUB_PRACTICES.md) |
| Hosting | [HOSTING.md](HOSTING.md) |
| Vercel handoff JSON | [data/vercel-launch.json](data/vercel-launch.json) |
| Animal catalog JSON | [data/animals.json](data/animals.json) |

## Layout

```
src/                 static site (Pages + Vercel root)
  index.html
  css/style.css
  js/app.js
  data/animals.json
  lore/*.md
  assets/stickers/*.webp
lore/                same Markdown, browsable on GitHub
data/                catalog + Vercel launch payload
.github/workflows/pages.yml
```

## Local

```bash
python3 -m http.server 4173 --directory src
```

## Featured lore

- [lion.md](lore/lion.md)
- [eagle.md](lore/eagle.md)
- [tiger.md](lore/tiger.md)
- [stallion.md](lore/stallion.md)
- [elephant.md](lore/elephant.md)
