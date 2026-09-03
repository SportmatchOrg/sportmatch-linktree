# Public bugs end-to-end plan

## Goal

Add a minimal public bug-reporting section to the SportMatch Developers view. Anyone with the URL can:

- Post a bug with a title and description.
- Optionally attach images, Markdown files, or PDFs.
- See the current bug list.
- Open a bug to inspect its full description and attachments.

User accounts are not required. Public visitors cannot edit or delete reports. Those are moderation actions performed through the Neon Console or Neon MCP.

## MVP boundaries

Include only:

- Public bug list.
- Public bug detail.
- Public submission form.
- Stored file attachments.
- Basic upload validation and submission throttling.

Do not include authentication, status workflows, priorities, labels, assignments, comments, votes, notifications, search, filters, pagination, or public edit/delete controls.

If public edit/delete becomes necessary later, add either authentication or a private management token per report. Do not make update and delete endpoints anonymous.

## Minimal architecture

```text
Public browser
  │
  ├── SportMatch Bugs UI on Vercel
  │
  └── /api/bugs (one Vercel Function)
        ├── Neon Postgres: reports + attachment metadata
        └── Neon Object Storage: uploaded file bytes
```

Responsibilities:

- **Vercel static hosting:** serves the existing tools shell and `bugs.html`.
- **One Vercel Function:** provides public read and create operations, validates submissions, applies a basic rate limit, and signs storage uploads.
- **Neon Postgres:** stores report text and attachment metadata. It never stores file bytes.
- **Neon Object Storage:** stores images, Markdown, and PDF files in one `public_read` bucket.

The browser never connects directly to Postgres and never receives a database connection string or storage credential. Neon Auth and the Neon Data API are not needed for this version.

## Neon Object Storage constraint

Neon Object Storage is currently beta, free during the beta, and limited to Neon projects in `us-east-2`. Post-beta pricing is not yet published. This is acceptable for the university prototype but must be reviewed before production use.

If Neon Object Storage is unavailable, replace it with Vercel Blob without changing the UI or database model.

## Repository changes

```text
tools/index.html                       add the Bugs navigation item
tools/pages/bugs.html                  list, post dialog, and detail UI
api/bugs.js                            public reads, report creation, upload signing
db/migrations/001_bug_reports.sql      tables and indexes
neon.ts                                Postgres project and public-read bucket
.env.example                           required variable names without values
package.json                           minimal server dependencies and scripts
```

Keep the initial page CSS and JavaScript inside `bugs.html`, matching the existing tools pages. Do not add a frontend framework or router.

## Navigation

- Add `Bugs` to the sidebar in `tools/index.html`, directly after `Dev Tools`.
- Load `/tools/pages/bugs.html` in the existing iframe.
- Use `bugs.html#bug/<id>` for the selected report so refresh and browser history work without a router.

## UI

### Bug list

Header:

- Eyebrow: `SportMatch developer tools`
- Title: `Bugs`
- Description: `Report and inspect issues found in the app.`
- Primary action: `Post bug`

Show the newest reports first. Each compact card contains:

- Title.
- Description preview limited to two lines.
- Creation date.
- Attachment count when greater than zero.

Selecting a card opens its detail view.

Empty state:

- `No bugs reported`
- `Issues posted by the team will appear here.`
- `Post bug`

### Post bug dialog

Fields:

- `Title` — required, 1–120 characters.
- `Description` — required, 1–5,000 characters.
- `Attachments` — optional, up to 5 files.

Allowed attachments:

- PNG, JPEG, and WebP.
- Markdown.
- PDF.
- Maximum 10 MB per file.

Files can be selected with the system picker or dragged onto the attachment drop zone. Show selected files as a plain list with filename, size, and a remove action. Do not add a rich editor or upload gallery.

Actions:

- Primary: `Post bug`.
- Secondary: `Cancel`.

Disable submission until the required fields contain non-whitespace text. While saving or uploading, disable the form and show the current progress. If one file fails, keep the bug and show that attachment with a `Retry` action.

### Bug detail

Replace the list content within `bugs.html`.

Show:

- `All bugs` back action.
- Full title.
- Creation date.
- Full description with line breaks preserved.
- Attachments section when files exist.

Images display as small previews and open at full size. PDFs and Markdown files display as file rows with filename, size, and `Open` or `Download`. Markdown is downloaded as a file; it is not rendered as HTML.

There are no public edit or delete actions.

## Visual direction

Match the existing Developers tools area rather than the consumer mobile app:

- Light canvas and white panels.
- Existing blue brand accent.
- Inter/system font stack.
- 8px corners.
- Hairline borders and restrained shadows.
- Full-width content using the same 1,180px container and page padding as Dev Tools.
- One accent-filled action per view.

At widths below 720px, use 12px page gutters, full-width cards and dialog, and interactive targets at least 44px high.

## Database schema

```sql
create extension if not exists pgcrypto;

create table public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 5000),
  source_hash text not null,
  created_at timestamptz not null default now()
);

create table public.bug_attachments (
  id uuid primary key default gen_random_uuid(),
  bug_id uuid not null references public.bug_reports(id) on delete cascade,
  storage_key text not null unique,
  public_url text not null,
  original_name text not null,
  mime_type text not null check (mime_type in (
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/markdown',
    'application/pdf'
  )),
  size_bytes integer not null check (size_bytes between 1 and 10485760),
  upload_state text not null default 'pending'
    check (upload_state in ('pending', 'ready')),
  created_at timestamptz not null default now()
);

create index bug_reports_created_at_idx
  on public.bug_reports (created_at desc);

create index bug_reports_source_created_idx
  on public.bug_reports (source_hash, created_at desc);

create index bug_attachments_bug_id_idx
  on public.bug_attachments (bug_id);
```

`source_hash` is a salted server-side hash of the request IP used only for basic throttling. Never store or return the raw IP. API reads must select an explicit safe column list and never expose `source_hash`.

Only attachments with `upload_state = 'ready'` appear in public responses.

## Storage

Provision one public-read bucket:

```text
bucket: bug-attachments
access: public_read
object key: bugs/<bug-id>/<random-uuid>.<validated-extension>
```

Rules:

- Generate object keys in the server function.
- Preserve the original filename only as display metadata.
- Store the object key and public URL in Postgres.
- Never expose S3-compatible credentials to the browser.
- Use a signed upload request that expires after approximately 5 minutes.
- Upload directly from the browser to storage rather than streaming files through the Vercel Function.
- Validate MIME type, extension, file size, and attachment count in both the UI and function.

Because the bucket is public-read, anyone with the attachment URL can access it. The form should say: `Attachments are public. Do not upload passwords, tokens, or private user data.`

Suggested `neon.ts` declaration:

```ts
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig({
  preview: {
    buckets: {
      'bug-attachments': { access: 'public_read' },
    },
  },
});
```

Run `neonctl config plan` before applying the configuration.

## API contract

Everything uses one Vercel Function at `/api/bugs`.

### Read

```text
GET /api/bugs
GET /api/bugs?id=<bug-id>
```

- The collection response returns safe report fields plus ready attachment counts, newest first.
- The detail response returns one report and its ready attachments.
- Unknown IDs return `404`.

### Create report

```text
POST /api/bugs?action=create
```

Request:

```json
{
  "title": "Map does not center",
  "description": "Steps to reproduce…"
}
```

The function:

1. Validates and trims both fields.
2. Hashes the request source with `SUBMISSION_PEPPER`.
3. Applies a basic limit, initially 10 reports per source per hour.
4. Inserts the report.
5. Returns the report ID and a signed, opaque upload token scoped to that report for 15 minutes.

The upload token allows attachments to be added only to the report created by that request. It is not a login and grants no edit/delete access.

### Sign attachment upload

```text
POST /api/bugs?action=sign-upload
```

Request includes the upload token, filename, MIME type, and size. The function:

1. Validates the token and report ID.
2. Checks the report has fewer than 5 attachments.
3. Validates file type, extension, and size.
4. Creates a random storage key.
5. Inserts a `pending` attachment row.
6. Returns its attachment ID, public URL, and short-lived signed upload request.

### Complete attachment upload

```text
POST /api/bugs?action=complete-upload
```

The function validates the upload token, confirms that the object exists and matches the expected size/type, and changes the attachment to `ready`. The UI then shows the attachment as uploaded.

### Cancel or clean up a failed upload

```text
DELETE /api/bugs?action=cancel-upload
```

The request includes the upload token and attachment ID. The function removes any partial object and then deletes the pending metadata row. Deletion is idempotent so it can be retried safely.

No public endpoint updates or deletes a ready report or attachment.

## End-to-end flows

### Load list or detail

1. The page calls the matching public `GET /api/bugs` endpoint.
2. The function queries Neon with explicit safe columns.
3. The UI renders the loading, success, empty, `404`, or error state.

### Post without files

1. Validate the form in the browser.
2. Call `action=create`.
3. Return to the list and place the new report first.

### Post with files

1. Validate the complete form and selected files in the browser.
2. Call `action=create` and receive the report ID and upload token.
3. For each file, call `action=sign-upload`.
4. Upload the file directly to Neon Object Storage.
5. Call `action=complete-upload`.
6. If upload or completion fails, call `cancel-upload` and show `Retry`.
7. Keep the valid report even when one attachment fails.
8. Return to the list after all files are complete or explicitly skipped.

### Moderate content

There is no moderation UI in the MVP. A maintainer uses Neon MCP or the Neon Console to remove inappropriate reports and their stored objects. When deleting manually, remove storage objects before deleting the report row.

## Configuration

Server-only Vercel environment variables:

- `DATABASE_URL` — Neon pooled database connection string.
- `AWS_ENDPOINT_URL_S3` — branch-scoped Neon Object Storage endpoint.
- `AWS_REGION` — storage region (`us-east-2`).
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — branch-scoped storage credential.
- `SUBMISSION_TOKEN_SECRET` — random server secret for signing upload tokens.
- `SUBMISSION_PEPPER` — separate random server secret for hashing request sources.

`BUG_STORAGE_BUCKET` defaults to `bug-attachments`, and `BUG_STORAGE_FORCE_PATH_STYLE` defaults to `true`, so neither override is required on Vercel.

Use the exact variable names generated by Neon after linking the project and document them in `.env.example` without values. Never commit `.env.local`, database URLs, storage credentials, API keys, peppers, token secrets, or generated upload tokens.

## Failure and accessibility states

- Initial load: three skeleton rows.
- Empty: dedicated empty state with `Post bug`.
- Read failure: compact error panel with `Try again`.
- Submission failure: preserve all form content.
- Individual upload failure: retain other completed uploads and offer `Retry` or `Skip`.
- Missing report: `Bug not found` with `All bugs`.
- Rate limit: explain when the visitor can try again.

All controls need visible keyboard focus. The dialog traps focus, closes with Escape, and restores focus to its trigger.

## Implementation sequence

1. Create or select a non-production Neon project in `us-east-2`.
2. Add `neon.ts`; review and provision the public-read bucket.
3. Add and run the database migration.
4. Configure Vercel environment variables.
5. Implement and test the `/api/bugs` read/create/upload actions.
6. Add `Bugs` to the Developers sidebar.
7. Build the list, form, and hash-based detail UI.
8. Connect the UI to the API and direct signed uploads.
9. Test validation, throttling, failed-upload cleanup, public file access, responsive layout, keyboard navigation, and iframe history.

## Acceptance criteria

- `Bugs` loads inside the existing Developers iframe.
- No login is requested.
- Anyone can read the bug list and details.
- Anyone can post valid title and description text within the rate limit.
- Allowed attachments upload to Neon Object Storage and become visible after completion.
- Invalid types, files over 10 MB, and a sixth attachment are rejected by both client and server.
- PostgreSQL contains text and attachment metadata only; the bucket contains file bytes.
- Pending or failed attachments never appear in public responses.
- Failed uploads can be retried or cleaned up without deleting the report.
- Database and storage credentials never appear in browser code or API responses.
- Public API responses never expose request-source hashes.
- There are no anonymous update or delete endpoints.
- The page works on desktop and narrow screens without horizontal scrolling.
- No frontend framework or unrelated issue-management feature is added.

## Accepted public-access risk

Authentication is not required, but public submission and public storage carry unavoidable risks: spam, offensive content, malicious-but-allowed file uploads, and free-tier quota exhaustion. Type/size limits and basic throttling reduce these risks but do not eliminate them.

If the URL is published broadly, add a CAPTCHA or authentication before relying on this feature. Public attachments must never contain secrets, personal data, private screenshots, or production logs.

## References

- [Neon Object Storage architecture](https://neon.com/blog/building-neon-object-storage)
- [Neon backend beta availability and constraints](https://neon.com/blog/neon-backend-is-beta)
- [Neon infrastructure as code](https://neon.com/blog/introducing-neon-ts)
