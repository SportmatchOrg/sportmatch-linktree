# SportMatch project hub

Static project hub for the SportMatch leadership views, development tools,
interactive prototype, and shared design assets.

## Repository map

- `index.html`: public Leadership entry point.
- `leadership/`: PERT/CPM and Gantt views.
- `tools/`: `/tools` entry point and its pages, including the `Inicio`
  introduction and team platform links.
- `prototype/sportmatch/`: canonical mobile and desktop prototype.
- `assets/`: public brand, icon, photo, token, and vendor assets.
- `generated/figma/`: derived Figma and standalone exports.
- `docs/`: planning material and references.
- `scripts/`: local project utilities.
- `DESIGN.md`: product design-system reference.

## Run locally

Serve the repository root over HTTP so root-relative asset paths and iframes
resolve exactly as they do in production:

```sh
python3 -m http.server 8000
```

Then open:

- Leadership: `http://localhost:8000/`
- Development tools (opens on Inicio): `http://localhost:8000/tools/`
- Mobile prototype: `http://localhost:8000/prototype/sportmatch/mobile.html`
- Desktop prototype: `http://localhost:8000/prototype/sportmatch/desktop.html`

Check local HTML references after moving files:

```sh
node scripts/check-static-links.mjs
```

## Source-of-truth rules

- Edit prototype code only under `prototype/sportmatch/`.
- Treat `generated/figma/` as derived output, not source code.
- Add public reusable files under `assets/` and use `/assets/...` URLs.
- Keep planning documents under `docs/planning/`.
- Keep `index.html` and `tools/index.html` stable because Vercel routes point to
  those entry files.
- Legacy public URLs are preserved as compatibility rewrites in `vercel.json`.
