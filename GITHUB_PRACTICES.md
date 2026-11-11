# GitHub practices for this project (2026)

Read November 2026 from GitHub Docs, the official Pages starter workflow, and current Pages limits. This file is the source of truth for how `animal-stickers` is published.

## Repository

- Public repository on GitHub Free. Pages on the Free plan only serves public repos.
- Default branch: `main`.
- Site source lives in `src/`. Do not publish the whole repo (docs, lore drafts, and this file stay in git; they are not the Pages artifact).
- Add `.nojekyll` in the published root so GitHub skips Jekyll. This site is plain HTML, CSS, and JS.
- Keep the published site and the repo well under the 1 GB Pages ceiling. Sticker WebPs are compressed before commit.
- Never commit tokens, `.env`, or Vercel credentials. Use `GITHUB_TOKEN` in Actions.

## GitHub Pages (current recommended path)

GitHub still allows **Deploy from a branch** (`/` or `/docs`). For a site whose files live in `src/`, **GitHub Actions** is the correct source.

Official flow ([Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)):

1. Settings → Pages → Source = **GitHub Actions**.
2. Workflow checks out the repo, uploads `src/` as a Pages artifact, deploys it.
3. The `github-pages` environment is created automatically. Only `main` should deploy to it.

Starter workflow shape (from [actions/starter-workflows `pages/static.yml`](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)):

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false
```

Pinned actions used here:

| Step | Action |
| --- | --- |
| Checkout | `actions/checkout@v4` |
| Configure Pages | `actions/configure-pages@v5` |
| Upload artifact | `actions/upload-pages-artifact@v3` with `path: src` |
| Deploy | `actions/deploy-pages@v5` |

`id-token: write` is required for OIDC to the Pages environment. `contents: read` is enough; do not grant `contents: write` unless the workflow must commit.

A custom Actions workflow is exempt from the soft **10 builds per hour** cap that applies to branch-based Pages builds.

## Project site URL

This is a **project site**, not a user site:

```
https://longdenjay00-sketch.github.io/animal-stickers/
```

All asset URLs in `src/` are **relative** (`css/style.css`, `assets/stickers/lion.webp`). Absolute paths starting with `/` would 404 on a project site.

User/org sites (`username.github.io`) are limited to one per account. Project sites are one per repository.

## Pages limits (GitHub Free, 2026)

| Limit | Value |
| --- | --- |
| Published site size | 1 GB hard |
| Source repo size | 1 GB recommended |
| Bandwidth | 100 GB / month, soft |
| Branch builds | 10 / hour, soft (Actions deploy is exempt) |
| Deploy timeout | 10 minutes hard |
| Visibility | Public on GitHub Free |
| Custom domain + HTTPS | Included |

Pages is not a commercial storefront host. This project is a public art/lore gallery.

## Relative paths, MIME types, 404s

- GitHub Pages serves 750+ MIME types from [mime-db](https://github.com/jshttp/mime-db), including `image/webp` and `application/json`.
- SPA-style hash routing (`#/animal/lion`) keeps every lore page on `index.html`, so no extra 404 rewrite is required.
- A `404.html` still exists in `src/` as a friendly fallback.

## Security and hygiene

- Least-privilege workflow permissions (read contents, write pages, write id-token).
- Do not use a personal access token for Pages deploy. `GITHUB_TOKEN` is enough.
- Commits from Actions that use `GITHUB_TOKEN` do not retrigger a branch-based Pages build. That is expected.
- Pin Actions to a major version tag. Dependabot can bump them later.
- `.gitignore` excludes `.vercel/`, `.env`, and editor junk.

## Enabling Pages from the API

After the first push of `.github/workflows/pages.yml`:

```bash
gh api --method POST /repos/longdenjay00-sketch/animal-stickers/pages \
  -f build_type=workflow
```

If the Pages resource already exists:

```bash
gh api --method PUT /repos/longdenjay00-sketch/animal-stickers/pages \
  -f build_type=workflow
```

Then open **Actions** and confirm the deploy job printed `page_url`.

## What we are not doing

- Jekyll themes, `docs/`-folder publishing, or a `gh-pages` branch.
- Custom domains in this first ship.
- Server-side languages (Pages does not run PHP, Python, or Node at request time).

## Sources

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages limits (summary, Oct 2026)](https://formsubmit.app/blog/github-pages-limits)
- [actions/starter-workflows pages/static.yml](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)
