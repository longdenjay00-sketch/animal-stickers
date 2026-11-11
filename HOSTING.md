# Hosting — GitHub Pages first, Vercel next

## GitHub Pages (this repo)

Project site URL:

```
https://longdenjay00-sketch.github.io/animal-stickers/
```

Repository:

```
https://github.com/longdenjay00-sketch/animal-stickers
```

How it publishes:

1. `src/` is the whole static site (HTML, CSS, JS, WebP, JSON, lore Markdown).
2. `.github/workflows/pages.yml` uploads `src/` with `actions/upload-pages-artifact` and deploys with `actions/deploy-pages`.
3. Settings → Pages → Source must be **GitHub Actions**.
4. First enable:

```bash
gh api --method POST /repos/longdenjay00-sketch/animal-stickers/pages \
  -f build_type=workflow
```

Practices and limits: [`GITHUB_PRACTICES.md`](GITHUB_PRACTICES.md).

## Vercel — `animal-stickers.vercel.app`

Vercel CLI in this environment was **logged out**. A Hobby production alias `animal-stickers.vercel.app` needs a logged-in account that owns the project name.

### Launch recipe (when logged in)

```bash
cd animal-stickers
# Root Directory = src  (set in dashboard, or deploy the folder)
vercel link --yes --project animal-stickers
vercel deploy src --yes --name animal-stickers --prod
```

Dashboard path if you prefer git:

1. [vercel.com/new](https://vercel.com/new)
2. Import `longdenjay00-sketch/animal-stickers`
3. **Root Directory:** `src`
4. Framework preset: Other
5. Project name: `animal-stickers`
6. Production URL: `https://animal-stickers.vercel.app`

CLI notes from current Vercel docs (Sept 2026):

- `vercel` / `vercel deploy` from the site folder.
- First deployment of a new project is always production.
- Later production deploys need `--prod`.
- `--yes` skips setup questions.
- Fast static deploys skip the build for tiny HTML/MD folders; this pack has WebP + JS so it uses the standard static flow.
- Logged-out option: `vercel deploy src --temporary` creates a claimable URL.

### If CLI cannot create the alias

Use [`data/vercel-launch.json`](data/vercel-launch.json). It has the project name, root directory, file inventory, and claim steps.

## Local preview

```bash
python3 -m http.server 4173 --directory src
```

Open `http://127.0.0.1:4173/`.
