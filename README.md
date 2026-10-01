# SportMatch project hub

Static project hub for the SportMatch leadership views, development tools,
interactive prototype, and shared design assets.

## Repository map

- `index.html`: public Leadership entry point.
- `leadership/`: WBS, PERT/CPM and Gantt views (each with a v1/v2 switch), plus the
v1 → v2 changelog.
- `tools/`: `/tools` entry point and its pages, including the `Inicio`
introduction and team platform links.
- `prototype/sportmatch/`: canonical mobile and desktop prototype.
- `assets/`: public brand, icon, photo, token, and vendor assets.
- `generated/figma/`: derived Figma and standalone exports.
- `docs/`: planning material and references.
- `scripts/`: local project utilities.
- `DESIGN.md`: product design-system reference.

## Run locally

Serve the repository with the Vercel CLI so root-relative asset paths, iframes,
`vercel.json` routes and the `api/` functions (Status, Bugs, Resources) behave
exactly as they do in production:

```sh
vercel dev --listen 8000
```

`python3 -m http.server 8000` still serves the static pages, but every `/api/*`
call answers 404, so Status shows "No se pudo consultar el estado: HTTP 404".

Then open:

- Leadership: `http://localhost:8000/`
- Development tools (opens on Inicio): `http://localhost:8000/tools/`
- Mobile prototype: `http://localhost:8000/prototype/sportmatch/mobile.html`
- Desktop prototype: `http://localhost:8000/prototype/sportmatch/desktop.html`

Check local HTML references after moving files:

```sh
node scripts/check-static-links.mjs
```

## Database migrations

Apply the SQL files in `db/migrations/` in numeric order to the Neon database.
`002_dev_resources.sql` creates the dynamic developer-resource directory and
idempotently seeds the 75 resources that were previously embedded in the page.

## Status history

`/status` charts uptime by day, week, month and year from the `status_checks`
table (`005_status_checks.sql`). A cron-job.org job records one row per service
every 5 minutes:

- URL: `https://<deployment>/api/status-history`, method `POST`
- Header: `Authorization: Bearer <STATUS_CRON_SECRET>`
- Schedule: every 5 minutes

`STATUS_CRON_SECRET` must be set in the Vercel project; without it the endpoint
answers 503 and records nothing.

## Source-of-truth rules

- Edit prototype code only under `prototype/sportmatch/`.
- Treat `generated/figma/` as derived output, not source code.
- Add public reusable files under `assets/` and use `/assets/...` URLs.
- Keep planning documents under `docs/planning/`.
- Keep `index.html` and `tools/index.html` stable because Vercel routes point to
those entry files.
- Legacy public URLs are preserved as compatibility rewrites in `vercel.json`.
