# SportMatch Design System

**SportMatch** is a premium, mobile-first sports-discovery platform — a way to *find people to play with right now*. It is deliberately **not** a SaaS dashboard. It feels like a consumer lifestyle app in the lineage of **Apple Sports / Apple Invites / Apple Fitness, Airbnb, Nike Run Club, Strava and Blue Banana** — visual-first, full-screen photography, frosted glass, big type, lots of air, and one clear action per screen.

> The whole system exists to make a player feel one thing: **"I want to go play right now."**

This project is the design system that backs that product: tokens, fonts, photography, a React component library, and a full interactive UI kit of the app.

---

## Sources & provenance

- **Brief:** product vision supplied by the SportMatch team (mobile-first sports discovery; Apple/Airbnb/Strava references; glassmorphism; electric-blue accent on black).
- **Photography:** real, licensed outdoor-sports photographs provided by the team (football, streetball, tennis/clay, aerial court). Stored, resized, in `assets/photos/`. The Blue Banana product card shared as inspiration is **not** included as an asset — it informed the floating-glass, photo-first direction only.
- **Codebase / Figma:** none provided. This system was built from the written brief + supplied imagery. Where a production source of truth appears later, reconcile tokens and components against it.

No external design-system repo or Figma link was attached; if one exists, drop it here for future reference.

---

## CONTENT FUNDAMENTALS — how SportMatch writes

The voice is **warm, direct, second-person and low on words.** Copy gets out of the way of the photography.

- **You, not we.** Speak to the player: "Find your next match.", "You're in.", "Who's in".
- **Short, confident, lowercase-energy.** Headlines are imperative and tight: *"Find your next match."*, *"Ready to publish?"*, *"When's kick-off?"*. Rarely more than 4–5 words.
- **One idea per screen.** A screen asks one thing and offers one primary action ("Join match", "Continue", "Publish match").
- **Sport-native, not corporate.** "kick-off", "7-a-side", "streetball run", "rally", "the cage". Never "session", "booking flow", "engagement".
- **Numbers do the talking.** "3 spots left", "2.3 km", "4.9", "128 matches". Metadata is glanceable, never a paragraph.
- **Encouraging confirmations.** "You're in. See you on the pitch ⚡" — friendly, a little spark.
- **Casing:** Sentence case for everything human-facing. UPPERCASE only for tiny overlines ("RECOMMENDED FOR YOU", "STEP 2 · PLACE") with wide tracking.
- **Emoji:** extremely sparing — a single ⚡ in a success toast is the ceiling. Never decorative emoji in lists or cards.
- **Tone words:** effortless, alive, social, local, energetic. Avoid: dashboard, manage, configure, optimize.

---

## VISUAL FOUNDATIONS

**Mood.** Dark, cinematic, premium. A true-black canvas lets full-bleed photography and frosted glass do the work. The UI is almost monochrome; **electric blue is the only chromatic voice** and it is rationed hard (primary CTA, active states, focus, one swipe affordance).

**Color.**
- Canvas is pure `#000`. Raised/sunken surfaces are near-black (`#0B0B0E` / `#060608`).
- Text is white at descending opacities (`ink-100 → ink-16`) — never grey hex values.
- **Glass** surfaces are white at 6–14% with a 15% white hairline border and a top-edge sheen (`inset 0 1px 0 rgba(255,255,255,.40)`); `glass-solid` (dark, ~72%) is used where legibility must beat translucency (sheets, modals, nav).
- Accent `#4EA8FF`; success `#66D575`; danger `#FF5A5F`; warning `#FFCB57`. Swipe: yes = green, no = red-pink.

**Type.** `Inter Tight` for display (big, tight, `-0.02/-0.03em` tracking) and `Inter` for text/UI. Hierarchy is steep: 56px heroes down to 11px overlines. **Numbers are heroes** — tabular, heavy (`Inter Tight 800`), oversized (44–64px) for ratings and stats.

**Imagery.** Authentic, editorial, outdoor, energetic — people mid-play, never posed studio/business stock. A deliberate mix of **moody B&W street sport** and **warm, saturated court/pitch color** (clay red, golden-hour green, court tan). Always full-bleed, always under a **protection gradient** (bottom-up black 0→85%) so white text and glass read on top. Cool teal and B&W shots add range; warm shots carry the "go play now" energy.

**Background.** Photography or true black. No decorative gradients-as-background, no patterns, no illustrations. The only gradients are *protection* gradients over photos and a faint accent *glow* radial behind the profile avatar / hero.

**Corner radii.** Soft and generous: chips/tags 8–12px, cards 20–28px, sheets 36–44px, and **pills (∞)** for every button, nav, chip and avatar. Nothing is sharp.

**Cards.** A card = frosted fill + hairline ring + top sheen + a wide soft ambient shadow (`0 18px 50px rgba(0,0,0,.5)`) + big radius. Media cards are full-bleed photo with the info panel floating over a gradient. Cards float; they never sit flat with a flat border.

**Shadows & blur.** Two ideas working together: **backdrop-blur** (12 / 24 / 40px) frosts glass over photography, and **ambient shadows** (float / card / sheet) lift floating elements off the canvas. Accent CTAs add a blue **glow** (`0 8px 30px rgba(78,168,255,.45)`).

**Borders.** Almost always a 1px inset white hairline (`--glass-border`) rather than an outset stroke — it reads as the lit edge of glass. Selected/emphasis raises it to 26%.

**Transparency & blur — when.** Any surface that floats *over photography or the map* is glass (nav, chips, badges, search, pins, swipe panel). Full-screen sheets/modals use the darker `glass-solid` + 40px blur so text stays crisp. Plain black panels are used for content wells away from imagery.

**Motion.** iOS-grade. Springy overshoot (`cubic-bezier(0.34,1.56,0.64,1)`) for taps, sheet/nav/segmented-thumb transitions and the swipe fly-out; smooth decel (`cubic-bezier(0.16,1,0.3,1)`) for progress and reveals. Durations 140 / 240 / 420ms. Shared-element feel: cards expand into detail; the segmented thumb and nav dot glide.

**Hover / press.** (Touch-first, but states exist.) Hover lightens glass (`.08 → .14/.20`) or brightens the accent. **Press shrinks** (`scale(0.96)`, controls `0.9`) — the whole system feels tappable and physical. Active nav item shows a glowing accent dot; active chip flips to a solid white fill.

**Layout.** 390px mobile canvas, 20px gutters, 4px spacing grid. Fixed/floating elements: the status bar, the floating bottom-nav pill (with its raised center Create button), sticky CTAs over a fade, and peeking bottom sheets. Content scrolls under floating chrome behind protection fades. Generous vertical rhythm — fewer elements, more air.

---

## ICONOGRAPHY

- **System:** a curated **line set derived from [Lucide](https://lucide.dev) (ISC licensed)**, shipped in-repo as the `Icon` component (`components/icon/Icon.jsx`) so the system is self-contained — no icon-font or CDN dependency. 24px grid, **2px stroke, round caps/joins**, inherits `currentColor`.
- **Curated, not exhaustive:** only the glyphs SportMatch actually uses (compass, layers, map, user, plus, map-pin, navigation, calendar, clock, users, signal, star, heart, flame, trophy, search, sliders, x, check, arrows, chevrons, share, bell, zap). Add new ones by extending the `PATHS` map with the matching Lucide path.
- **Fills:** `star`, `heart`, `flame` can render solid (`filled`) for ratings / likes / streaks; everything else is stroked.
- **Status-bar glyphs** (signal / wifi / battery) are drawn inline in the UI kit as system chrome — not part of the icon set.
- **Emoji as icons:** no. A lone ⚡ may appear *in copy*; never as UI iconography.
- **Logo / brand mark:** `assets/logo-mark.svg` — two play-triangles meeting (a "match"/versus) on a black rounded tile, white + electric blue. The wordmark sets **SportMatch** in Inter Tight 800 with "Match" in accent (rendered in markup, not a binary).

> Substitution flag: the brief asked for *Inter or SF Pro Display*. SF Pro is Apple-proprietary and cannot ship, so display/text use **Inter Tight + Inter** (the closest open match), loaded from Google Fonts. Swap in licensed SF Pro / offline `.woff2` if desired — see `tokens/fonts.css`.

---

## Index / manifest

**Global entry**
- `styles.css` — the one file consumers link. `@import`s the tokens + base only.

**Tokens** (`tokens/`)
- `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `effects.css` · `base.css`

**Assets** (`assets/`)
- `logo-mark.svg` — app/brand mark
- `imagery.js` — photo catalog (`SM_IMG`), resolves paths relative to itself
- `photos/` — 7 resized sport photographs

**Components** (`components/`) — namespace `window.SportMatchDesignSystem_7eff40`
- `icon/` — `Icon`
- `core/` — `Button`, `IconButton`, `GlassCard`, `Badge`, `Avatar` + `AvatarStack`, `Rating`, `SegmentedControl`
- `forms/` — `Input`
- `navigation/` — `BottomNav`, `FilterChip`, `MapPin`
- `feedback/` — `BottomSheet`, `Toast`, `EmptyState`, `Skeleton` + `MatchCardSkeleton`
- `cards/` — `MatchCard`, `SwipeCard`

**UI kit** (`ui_kits/sportmatch-app/`)
- `index.html` — the interactive app inside a phone frame
- Screens: `Home`, `Discover`, `MatchDetail`, `SwipeDeck`, `MapScreen`, `Profile`, `CreateMatch` (+ `parts`, `data`, `app`)

**Guidelines** (`guidelines/foundations/`)
- Specimen cards for Colors, Type, Spacing, Brand (rendered in the Design System tab).

**Skill**
- `SKILL.md` — makes this folder usable as a downloadable Claude Skill.

---

## Working with this system

- Link `styles.css`; everything keys off CSS custom properties — reference the **semantic aliases** (`--text-secondary`, `--surface-glass`, `--accent`) over base values.
- Mount components from `window.SportMatchDesignSystem_7eff40` after loading `_ds_bundle.js`.
- Build mobile-first at 390px. One primary action per screen. Let photography lead; keep chrome minimal and floating; ration the blue.
