# GitHub sources

This project is not generated from a repository — the app is built against the
bound **SportMatch Design System**. Upstream repos are referenced only as icon
sources: individual glyph path data was read and inlined into `overrides.js`.

repo: lucide-icons/lucide-lab
branch: main
path: icons

## Also read

repo: lucide-icons/lucide
branch: main
path: icons

## Last sync

date: 2026-08-17T16:30:28Z

### Updated in this project

- Replaced hand-drawn sport glyphs with verbatim Lucide Lab paths: `soccer-ball` (Football), `basketball`, `tennis-ball` (Tennis), `tennis-racket` (Padel).
- Running now uses Lucide `footprints`.
- Auth field glyphs now use Lucide `mail`, `lock`, `user`, `eye`, `eye-off`.
- All inlined at the 24px grid with 2px stroke and round caps/joins, matching the design system's icon set.

## Screen map

| Screen / element | Built from |
| --- | --- |
| Sport icons (map filters, create-match picker, home chips) | lucide-lab `icons/soccer-ball.svg`, `icons/basketball.svg`, `icons/tennis-ball.svg`, `icons/tennis-racket.svg`; lucide `icons/footprints.svg` |
| Login / Register fields | lucide `icons/mail.svg`, `icons/lock.svg`, `icons/user.svg`, `icons/eye.svg`, `icons/eye-off.svg` |
