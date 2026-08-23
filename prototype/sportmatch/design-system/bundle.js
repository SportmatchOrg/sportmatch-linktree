/* @ds-bundle: {"format":3,"namespace":"SportMatchDesignSystem_7eff40","components":[{"name":"MatchCard","sourcePath":"components/cards/MatchCard.jsx"},{"name":"SwipeCard","sourcePath":"components/cards/SwipeCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"AvatarStack","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"GlassCard","sourcePath":"components/core/GlassCard.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Rating","sourcePath":"components/core/Rating.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"BottomSheet","sourcePath":"components/feedback/BottomSheet.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"MatchCardSkeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"FilterChip","sourcePath":"components/navigation/FilterChip.jsx"},{"name":"MapPin","sourcePath":"components/navigation/MapPin.jsx"}],"sourceHashes":{"assets/imagery.js":"d2ba787042c5","components/cards/MatchCard.jsx":"330b8ef0eefe","components/cards/SwipeCard.jsx":"f29e8dcdc5c1","components/core/Avatar.jsx":"8e500cf21ff9","components/core/Badge.jsx":"27efae31c8af","components/core/Button.jsx":"4e969d800332","components/core/GlassCard.jsx":"4a79113ac08e","components/core/IconButton.jsx":"e935501297dc","components/core/Rating.jsx":"bdb321523504","components/core/SegmentedControl.jsx":"5015c728f07b","components/feedback/BottomSheet.jsx":"0e94cbdd8a0f","components/feedback/EmptyState.jsx":"7437b8a05ec6","components/feedback/Skeleton.jsx":"a3634491a96e","components/feedback/Toast.jsx":"4a2d4a1a746c","components/forms/Input.jsx":"a056cbbfd9d6","components/icon/Icon.jsx":"c3fb0227fa01","components/navigation/BottomNav.jsx":"a68dad5bbda2","components/navigation/FilterChip.jsx":"9c8c05f4f7ea","components/navigation/MapPin.jsx":"77e754536a45","ui_kits/sportmatch-app/CreateMatch.jsx":"be112546bfa1","ui_kits/sportmatch-app/Discover.jsx":"a7242b9ac14e","ui_kits/sportmatch-app/Home.jsx":"1c23b724a4fa","ui_kits/sportmatch-app/MapScreen.jsx":"05f0d3563a2e","ui_kits/sportmatch-app/MatchDetail.jsx":"30802b52dec4","ui_kits/sportmatch-app/Matches.jsx":"cbf1f860b093","ui_kits/sportmatch-app/Profile.jsx":"5b622ec9ea61","ui_kits/sportmatch-app/SwipeDeck.jsx":"7c98e8065a9c","ui_kits/sportmatch-app/app.jsx":"f17ff9f9c749","ui_kits/sportmatch-app/data.js":"c4825cbf13d5","ui_kits/sportmatch-app/parts.jsx":"4226051b2e02"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SportMatchDesignSystem_7eff40 = window.SportMatchDesignSystem_7eff40 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/imagery.js
try { (() => {
/* ============================================================
   SportMatch — Imagery catalog
   Photography is the product's primary surface. These are the
   real, licensed outdoor-sports photographs that ship with the
   system (provided by the SportMatch team). Authentic, editorial,
   high-contrast — a mix of moody B&W street sport and warm,
   saturated court/pitch color.

   Paths resolve relative to THIS script, so any page can include
   it from any depth:  <script src="…/assets/imagery.js"></script>

   Usage:
     SM_IMG.url('football-match')   -> resolved photo URL
     SM_IMG.sports                  -> sport taxonomy with hero photo
     SM_IMG.bySport('tennis')       -> photo url for a sport key
   ============================================================ */
(function () {
  // Resolve the directory this script lives in. Prefer the live <script>
  // element in the DOM (its .src is reliably resolved), and fall back to
  // document.currentScript. This avoids a stale/relative currentScript.src
  // at load time pointing the photo paths at the wrong directory.
  function resolveBase() {
    try {
      var el = [].slice.call(document.scripts || []).filter(function (x) {
        return x.src && /(^|\/)imagery\.js(\?|$)/.test(x.src);
      }).pop();
      var s = el && el.src || document.currentScript && document.currentScript.src;
      if (s) return s.slice(0, s.lastIndexOf('/') + 1);
    } catch (e) {}
    return '';
  }
  // Resolve lazily on each call. At very early load the document base can be
  // the flattened /serve/ root, yielding a wrong base; by deferring resolution
  // to first real use (render time) we read the element's corrected .src.
  function getBase() {
    return resolveBase() || '';
  }
  var PHOTOS = {
    'streetball-bw': {
      file: 'streetball-bw.jpg',
      w: 1600,
      h: 902,
      tone: 'bw'
    },
    'basketball-bw': {
      file: 'basketball-bw.jpg',
      w: 1600,
      h: 974,
      tone: 'bw'
    },
    'basketball-aerial': {
      file: 'basketball-aerial.jpg',
      w: 1600,
      h: 1144,
      tone: 'warm'
    },
    'tennis-clay': {
      file: 'tennis-clay.jpg',
      w: 1067,
      h: 1600,
      tone: 'warm'
    },
    'tennis-net': {
      file: 'tennis-net.jpg',
      w: 1200,
      h: 1600,
      tone: 'cool'
    },
    'football-match': {
      file: 'football-match.jpg',
      w: 1600,
      h: 1054,
      tone: 'color'
    },
    'football-sunset': {
      file: 'football-sunset.jpg',
      w: 1067,
      h: 1600,
      tone: 'warm'
    }
  };
  function url(key) {
    var p = PHOTOS[key] || PHOTOS['football-match'];
    return getBase() + '../media/photos/' + p.file;
  }

  // Dominant-color palettes (sampled from each photo) for ambient backgrounds.
  var PALETTES = {
    'streetball-bw': {
      avg: '#a1a1a1',
      vibrant: '#8d9298'
    },
    'basketball-bw': {
      avg: '#7c7d7d',
      vibrant: '#3a423f'
    },
    'basketball-aerial': {
      avg: '#b09566',
      vibrant: '#c9a23a'
    },
    'tennis-clay': {
      avg: '#7a2410',
      vibrant: '#c0532a'
    },
    'tennis-net': {
      avg: '#96bdc2',
      vibrant: '#2bb3d3'
    },
    'football-match': {
      avg: '#3a463a',
      vibrant: '#d52019'
    },
    'football-sunset': {
      avg: '#70633d',
      vibrant: '#cf8350'
    }
  };
  function palette(key) {
    return PALETTES[key] || PALETTES['football-match'];
  }

  // Sport taxonomy — each sport maps to a hero photo we actually have.
  var sports = [{
    key: 'football',
    label: 'Football',
    photo: 'football-match'
  }, {
    key: 'basketball',
    label: 'Basketball',
    photo: 'basketball-aerial'
  }, {
    key: 'tennis',
    label: 'Tennis',
    photo: 'tennis-clay'
  }, {
    key: 'padel',
    label: 'Padel',
    photo: 'tennis-net'
  }, {
    key: 'running',
    label: 'Running',
    photo: 'football-sunset'
  }];
  function bySport(key) {
    var s = sports.find(function (x) {
      return x.key === key;
    });
    return url(s ? s.photo : 'football-match');
  }
  window.SM_IMG = {
    get base() {
      return getBase();
    },
    palette: palette,
    keys: Object.keys(PHOTOS),
    meta: PHOTOS,
    url: url,
    sports: sports,
    bySport: bySport,
    // ordered list for galleries / swipe stacks
    gallery: ['football-match', 'streetball-bw', 'tennis-clay', 'basketball-aerial', 'tennis-net', 'football-sunset', 'basketball-bw']
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/imagery.js", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Avatar
 * Round player photo. Optional accent/online ring. Falls back to
 * initials on a glass disc when no image is given. AvatarStack
 * overlaps several to show participants.
 */

const CSS = `
.sm-avatar{
  position:relative; display:inline-flex; align-items:center; justify-content:center;
  border-radius:50%; overflow:hidden; flex:none; color:#fff;
  background:var(--glass-strong); box-shadow: var(--ring-glass);
  font-family:var(--font-display); font-weight:700; letter-spacing:-0.02em;
}
.sm-avatar img{ width:100%; height:100%; object-fit:cover; }
.sm-avatar--ring{ box-shadow: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--accent); }
.sm-avatar--ring-success{ box-shadow: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--success); }
.sm-avatarstack{ display:inline-flex; }
.sm-avatarstack > *{ box-shadow: 0 0 0 2px var(--bg-base); }
.sm-avatarstack > * + *{ margin-left:-12px; }
.sm-avatarstack__more{
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:50%; background:var(--glass-strong); color:#fff;
  font-family:var(--font-display); font-weight:700; font-size:13px;
  box-shadow: 0 0 0 2px var(--bg-base), var(--ring-glass);
}
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-avatar-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const SIZES = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96
};
function Avatar({
  src,
  name = '',
  size = 'md',
  ring,
  className = '',
  style,
  ...rest
}) {
  inject();
  const px = typeof size === 'number' ? size : SIZES[size] || 44;
  const ringCls = ring === 'accent' ? 'sm-avatar--ring' : ring === 'success' ? 'sm-avatar--ring-success' : '';
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['sm-avatar', ringCls, className].filter(Boolean).join(' '),
    style: {
      width: px,
      height: px,
      fontSize: px * 0.4,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", null, initials || '?'));
}
function AvatarStack({
  avatars = [],
  size = 'md',
  max = 4,
  more,
  className = '',
  style,
  ...rest
}) {
  inject();
  const px = typeof size === 'number' ? size : SIZES[size] || 44;
  const shown = avatars.slice(0, max);
  const extra = more != null ? more : avatars.length - shown.length;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['sm-avatarstack', className].filter(Boolean).join(' '),
    style: style
  }, rest), shown.map((a, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: i,
    src: a.src || a,
    name: a.name,
    size: size
  })), extra > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "sm-avatarstack__more",
    style: {
      width: px,
      height: px,
      fontSize: px * 0.3,
      marginLeft: -12
    }
  }, "+", extra) : null);
}
Object.assign(__ds_scope, { Avatar, AvatarStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/GlassCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch GlassCard
 * The frosted surface primitive. Floats over photography or black
 * canvas: translucent white fill, hairline border, top sheen, soft
 * shadow, big radius. Everything that holds content sits in one.
 */

const CSS = `
.sm-glass{
  position:relative;
  background:var(--glass);
  border-radius:var(--radius-md);
  box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-card);
  backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  color:#fff;
}
.sm-glass--thin{ background:var(--glass-thin); }
.sm-glass--strong{ background:var(--glass-strong); }
.sm-glass--solid{
  background:var(--glass-solid);
  backdrop-filter: blur(var(--blur-lg)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(1.4);
}
.sm-glass--r-sm{ border-radius:var(--radius-sm); }
.sm-glass--r-lg{ border-radius:var(--radius-lg); }
.sm-glass--r-xl{ border-radius:var(--radius-xl); }
.sm-glass--interactive{
  cursor:pointer; -webkit-tap-highlight-color:transparent;
  transition: transform var(--dur-base) var(--ease-spring), background var(--dur-base);
}
.sm-glass--interactive:hover{ background:var(--glass-strong); }
.sm-glass--interactive:active{ transform: scale(0.985); }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-glass-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const PAD = {
  none: '0',
  sm: '14px',
  md: '20px',
  lg: '28px'
};
const RADII = {
  sm: 'r-sm',
  md: '',
  lg: 'r-lg',
  xl: 'r-xl'
};
function GlassCard({
  variant = 'glass',
  radius = 'md',
  padding = 'md',
  interactive = false,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) {
  inject();
  const cls = ['sm-glass', variant !== 'glass' ? `sm-glass--${variant}` : '', RADII[radius] ? `sm-glass--${RADII[radius]}` : '', interactive ? 'sm-glass--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: {
      padding: PAD[padding] ?? padding,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { GlassCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GlassCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch SegmentedControl
 * A frosted track with a sliding white thumb. Two or three short
 * options — "For you / Nearby", skill levels, list/map. iOS-style.
 */

const CSS = `
.sm-seg{
  position:relative; display:inline-flex; padding:4px;
  background:var(--glass-strong); border-radius:var(--radius-pill);
  box-shadow: var(--ring-glass);
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
}
.sm-seg--full{ display:flex; width:100%; }
.sm-seg__thumb{
  position:absolute; top:4px; bottom:4px; left:4px;
  border-radius:var(--radius-pill); background:#fff;
  box-shadow: var(--shadow-float);
  transition: transform var(--dur-base) var(--ease-spring), width var(--dur-base) var(--ease-spring);
}
.sm-seg__opt{
  position:relative; z-index:1; flex:1 1 0; min-width:0;
  display:inline-flex; align-items:center; justify-content:center;
  height:36px; padding:0 14px; border:0; background:transparent; cursor:pointer;
  font-family:var(--font-text); font-size:14px; font-weight:600; letter-spacing:-0.01em;
  color:var(--ink-64); white-space:nowrap; -webkit-tap-highlight-color:transparent;
  transition: color var(--dur-base);
}
.sm-seg__opt[aria-selected="true"]{ color:#000; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-seg-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function SegmentedControl({
  options = [],
  value,
  onChange,
  fullWidth = false,
  className = '',
  style,
  ...rest
}) {
  inject();
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length || 1;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['sm-seg', fullWidth ? 'sm-seg--full' : '', className].filter(Boolean).join(' '),
    style: style,
    role: "tablist"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-seg__thumb",
    style: {
      width: `calc((100% - 8px) / ${n})`,
      transform: `translateX(${idx * 100}%)`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    role: "tab",
    "aria-selected": o.value === value,
    className: "sm-seg__opt",
    onClick: () => onChange && onChange(o.value)
  }, o.label)));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/feedback/BottomSheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch BottomSheet
 * A frosted sheet that rises from the bottom with a grab handle and a
 * big top radius. Holds nearby matches, filters, share. Presentational:
 * `open` drives the slide + scrim. Place inside a position:relative
 * phone frame (it positions absolutely and covers it with a scrim).
 */

const CSS = `
.sm-sheet-root{ position:absolute; inset:0; z-index:50; pointer-events:none; }
.sm-sheet-scrim{
  position:absolute; inset:0; background:var(--scrim); opacity:0;
  transition: opacity var(--dur-base) var(--ease-out); pointer-events:none;
}
.sm-sheet-root[data-open="true"] .sm-sheet-scrim{ opacity:1; pointer-events:auto; }
.sm-sheet{
  position:absolute; left:0; right:0; bottom:0; pointer-events:auto;
  max-height:88%; display:flex; flex-direction:column;
  padding:10px 20px calc(20px + var(--safe-bottom));
  background:var(--glass-solid);
  border-radius:var(--radius-2xl) var(--radius-2xl) 0 0;
  box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-sheet);
  backdrop-filter: blur(var(--blur-lg)) saturate(1.5); -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(1.5);
  transform: translateY(100%);
  transition: transform var(--dur-slow) var(--ease-spring);
}
.sm-sheet-root[data-open="true"] .sm-sheet{ transform: translateY(0); }
.sm-sheet__grip{ width:40px; height:5px; border-radius:99px; background:var(--ink-32); margin:6px auto 4px; flex:none; }
.sm-sheet__head{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 0 14px; }
.sm-sheet__title{ font-family:var(--font-display); font-weight:700; font-size:22px; letter-spacing:-0.02em; color:#fff; }
.sm-sheet__body{ overflow-y:auto; -webkit-overflow-scrolling:touch; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-sheet-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function BottomSheet({
  open = false,
  onClose,
  title,
  headerRight,
  children,
  className = '',
  style,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sheet-root",
    "data-open": open ? 'true' : 'false',
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-sheet-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", _extends({
    className: ['sm-sheet', className].filter(Boolean).join(' '),
    style: style,
    role: "dialog",
    "aria-modal": "true"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-sheet__grip"
  }), title || headerRight ? /*#__PURE__*/React.createElement("div", {
    className: "sm-sheet__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-sheet__title"
  }, title), headerRight) : null, /*#__PURE__*/React.createElement("div", {
    className: "sm-sheet__body"
  }, children)));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Skeleton
 * Loading placeholders with a soft glass shimmer. Generic Skeleton for
 * lines/blocks/circles; MatchCardSkeleton mirrors the discover card so
 * loading feels like the real layout settling in.
 */

const CSS = `
@keyframes sm-shimmer { 100% { transform: translateX(100%); } }
.sm-skel{
  position:relative; overflow:hidden; background:var(--glass);
  border-radius:var(--radius-sm);
}
.sm-skel::after{
  content:""; position:absolute; inset:0; transform:translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent);
  animation: sm-shimmer 1.4s var(--ease-in-out) infinite;
}
@media (prefers-reduced-motion: reduce){ .sm-skel::after{ animation:none; } }
.sm-skel--circle{ border-radius:50%; }
.sm-skel--text{ border-radius:6px; }
.sm-skelcard{ width:100%; aspect-ratio:4/5; border-radius:var(--radius-lg); position:relative; overflow:hidden; }
.sm-skelcard__foot{ position:absolute; left:18px; right:18px; bottom:18px; display:flex; flex-direction:column; gap:10px; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-skel-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Skeleton({
  width = '100%',
  height = 16,
  radius,
  variant = 'block',
  className = '',
  style,
  ...rest
}) {
  inject();
  const v = variant === 'circle' ? 'sm-skel--circle' : variant === 'text' ? 'sm-skel--text' : '';
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['sm-skel', v, className].filter(Boolean).join(' '),
    style: {
      display: 'block',
      width,
      height,
      borderRadius: radius,
      ...style
    }
  }, rest));
}
function MatchCardSkeleton({
  className = '',
  style,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['sm-skel', 'sm-skelcard', className].filter(Boolean).join(' '),
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sm-skelcard__foot"
  }, /*#__PURE__*/React.createElement(Skeleton, {
    variant: "text",
    width: "40%",
    height: 12,
    style: {
      background: 'rgba(255,255,255,.14)'
    }
  }), /*#__PURE__*/React.createElement(Skeleton, {
    variant: "text",
    width: "75%",
    height: 24,
    style: {
      background: 'rgba(255,255,255,.14)'
    }
  }), /*#__PURE__*/React.createElement(Skeleton, {
    variant: "text",
    width: "55%",
    height: 14,
    style: {
      background: 'rgba(255,255,255,.14)'
    }
  })));
}
Object.assign(__ds_scope, { Skeleton, MatchCardSkeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Icon
 * Line iconography from the Lucide set (ISC licensed) — 24px grid,
 * 2px stroke, round caps/joins. Curated to the symbols SportMatch
 * actually uses so the system ships self-contained (no CDN needed).
 */

const PATHS = {
  // Navigation
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  // Match metadata
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  signal: '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  // Actions / UI
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
};

// Icons that read better as solid fills (rating, likes)
const FILLABLE = {
  star: true,
  heart: true,
  flame: true
};
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  filled = false,
  color,
  style,
  className,
  ...rest
}) {
  const inner = PATHS[name];
  const solid = filled && FILLABLE[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: solid ? 'currentColor' : 'none',
    stroke: solid ? 'none' : 'currentColor',
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": rest['aria-label'] ? undefined : true,
    style: {
      display: 'block',
      flex: 'none',
      color,
      ...style
    },
    dangerouslySetInnerHTML: inner ? {
      __html: inner
    } : undefined
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Badge
 * Compact metadata pill — sport name, distance, skill level, spots
 * left, date. Frosted by default so it reads on photography. Tones
 * carry meaning: accent = featured, success = spots open, danger =
 * almost full.
 */

const CSS = `
.sm-badge{
  display:inline-flex; align-items:center; gap:6px;
  height:28px; padding:0 11px; border-radius:var(--radius-pill);
  font-family:var(--font-text); font-size:13px; font-weight:600;
  letter-spacing:-0.01em; line-height:1; white-space:nowrap; color:#fff;
}
.sm-badge--lg{ height:34px; padding:0 14px; font-size:14px; }
.sm-badge--glass{
  background:var(--glass-strong);
  box-shadow: var(--ring-glass);
  backdrop-filter: blur(var(--blur-sm)); -webkit-backdrop-filter: blur(var(--blur-sm));
}
.sm-badge--solid{ background:rgba(0,0,0,.55); box-shadow: var(--ring-glass);
  backdrop-filter: blur(var(--blur-sm)); -webkit-backdrop-filter: blur(var(--blur-sm)); }
.sm-badge--accent{ background:var(--accent); color:var(--accent-ink); }
.sm-badge--success{ background:var(--success-tint); color:var(--success); box-shadow: inset 0 0 0 1px rgba(102,213,117,.35); }
.sm-badge--danger{ background:var(--danger-tint); color:var(--danger); box-shadow: inset 0 0 0 1px rgba(255,90,95,.35); }
.sm-badge--ink{ background:var(--ink-100); color:#000; }
.sm-badge__dot{ width:7px; height:7px; border-radius:50%; background:currentColor; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-badge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  tone = 'glass',
  size = 'md',
  icon,
  dot = false,
  children,
  className = '',
  style,
  ...rest
}) {
  inject();
  const cls = ['sm-badge', `sm-badge--${tone}`, size === 'lg' ? 'sm-badge--lg' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: style
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "sm-badge__dot"
  }) : null, icon ? typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'lg' ? 16 : 14
  }) : icon : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Button
 * One primary action per screen. Primary = electric-blue fill with a
 * soft glow; secondary = frosted glass; ghost = bare. Pill shaped,
 * presses inward (scale) on tap.
 */

const CSS = `
.sm-btn{
  --_pad: 0 22px; --_h: 52px; --_fs: 17px;
  appearance:none; border:0; margin:0;
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  height:var(--_h); padding:var(--_pad); font-size:var(--_fs);
  font-family:var(--font-display); font-weight:700;
  letter-spacing:-0.01em; border-radius:var(--radius-pill);
  color:#fff; background:transparent; cursor:pointer;
  transition: transform var(--dur-fast) var(--ease-spring),
              background var(--dur-base) var(--ease-out),
              box-shadow var(--dur-base) var(--ease-out), opacity var(--dur-base);
  -webkit-tap-highlight-color:transparent; user-select:none; white-space:nowrap;
}
.sm-btn:active{ transform: scale(var(--press-scale)); }
.sm-btn--full{ width:100%; }
.sm-btn[disabled]{ opacity:.4; pointer-events:none; }
.sm-btn--sm{ --_h:40px; --_pad:0 16px; --_fs:15px; }
.sm-btn--lg{ --_h:60px; --_pad:0 28px; --_fs:19px; }

.sm-btn--primary{ background:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow-glow); }
.sm-btn--primary:hover{ background:var(--accent-bright); }

.sm-btn--secondary{
  background:var(--glass-strong); color:#fff;
  box-shadow: var(--ring-glass), var(--inset-top-sheen);
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
}
.sm-btn--secondary:hover{ background:rgba(255,255,255,.20); }

.sm-btn--ghost{ background:transparent; color:#fff; }
.sm-btn--ghost:hover{ background:var(--glass); }

.sm-btn--success{ background:var(--success); color:#05210a; }
.sm-btn--danger{ background:var(--danger); color:#fff; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-btn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  style,
  ...rest
}) {
  inject();
  const cls = ['sm-btn', `sm-btn--${variant}`, size !== 'md' ? `sm-btn--${size}` : '', fullWidth ? 'sm-btn--full' : '', className].filter(Boolean).join(' ');
  const isz = size === 'lg' ? 22 : size === 'sm' ? 18 : 20;
  const renderIcon = ic => typeof ic === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: isz
  }) : ic;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    style: style
  }, rest), iconLeft ? renderIcon(iconLeft) : null, children, iconRight ? renderIcon(iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch IconButton
 * A circular, floating control. Default is frosted glass that sits on
 * top of photography (back button, share, like). Solid/accent for the
 * one emphasised action.
 */

const CSS = `
.sm-iconbtn{
  --_sz: 44px; --_ic: 22px;
  appearance:none; border:0; padding:0; margin:0;
  display:inline-flex; align-items:center; justify-content:center;
  width:var(--_sz); height:var(--_sz); border-radius:var(--radius-pill);
  color:#fff; cursor:pointer; -webkit-tap-highlight-color:transparent;
  transition: transform var(--dur-fast) var(--ease-spring),
              background var(--dur-base) var(--ease-out), opacity var(--dur-base);
}
.sm-iconbtn:active{ transform: scale(var(--press-scale)); }
.sm-iconbtn[disabled]{ opacity:.4; pointer-events:none; }
.sm-iconbtn--sm{ --_sz:36px; --_ic:18px; }
.sm-iconbtn--lg{ --_sz:60px; --_ic:28px; }

.sm-iconbtn--glass{
  background:var(--glass-strong);
  box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-float);
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
}
.sm-iconbtn--glass:hover{ background:rgba(255,255,255,.22); }

.sm-iconbtn--solid{ background:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow-glow); }
.sm-iconbtn--solid:hover{ background:var(--accent-bright); }

.sm-iconbtn--plain{ background:transparent; }
.sm-iconbtn--plain:hover{ background:var(--glass); }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-iconbtn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function IconButton({
  icon,
  variant = 'glass',
  size = 'md',
  filled = false,
  className = '',
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  inject();
  const cls = ['sm-iconbtn', `sm-iconbtn--${variant}`, size !== 'md' ? `sm-iconbtn--${size}` : '', className].filter(Boolean).join(' ');
  const isz = size === 'lg' ? 28 : size === 'sm' ? 18 : 22;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    style: style,
    "aria-label": ariaLabel
  }, rest), typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: isz,
    filled: filled
  }) : icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Rating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Rating
 * A score is a hero. Shows a big tabular number with a filled star.
 * 'inline' for compact metadata, 'block' for the profile hero.
 */

const CSS = `
.sm-rating{ display:inline-flex; align-items:center; gap:6px; color:#fff; font-family:var(--font-display); }
.sm-rating__star{ color:var(--warning); }
.sm-rating__score{ font-weight:800; letter-spacing:-0.02em; font-variant-numeric:tabular-nums; }
.sm-rating__count{ color:var(--ink-46); font-family:var(--font-text); font-weight:500; }
.sm-rating--block{ flex-direction:column; gap:2px; align-items:flex-start; }
.sm-rating--block .sm-rating__score{ font-size:64px; line-height:1; }
.sm-rating--block .sm-rating__row{ display:flex; align-items:center; gap:6px; }
.sm-stars{ display:inline-flex; gap:2px; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-rating-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Rating({
  value = 0,
  count,
  variant = 'inline',
  showStars = false,
  size = 15,
  className = '',
  style,
  ...rest
}) {
  inject();
  const v = Number(value).toFixed(1);
  if (variant === 'block') {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: ['sm-rating', 'sm-rating--block', className].filter(Boolean).join(' '),
      style: style
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "sm-rating__row"
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "star",
      filled: true,
      size: 26,
      className: "sm-rating__star"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-rating__score"
    }, v)), count != null ? /*#__PURE__*/React.createElement("span", {
      className: "sm-rating__count",
      style: {
        fontSize: 14
      }
    }, count, " ratings") : null);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['sm-rating', className].filter(Boolean).join(' '),
    style: {
      fontSize: size,
      ...style
    }
  }, rest), showStars ? /*#__PURE__*/React.createElement("span", {
    className: "sm-stars"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: i,
    name: "star",
    filled: i < Math.round(value),
    size: size,
    className: "sm-rating__star",
    style: i < Math.round(value) ? null : {
      color: 'var(--ink-32)'
    }
  }))) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    filled: true,
    size: size + 1,
    className: "sm-rating__star"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-rating__score"
  }, v), count != null ? /*#__PURE__*/React.createElement("span", {
    className: "sm-rating__count"
  }, "(", count, ")") : null);
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rating.jsx", error: String((e && e.message) || e) }); }

// components/cards/MatchCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch MatchCard
 * The discover workhorse — an immersive, almost-full-width photo card
 * à la Airbnb Experiences. Large photography, a save control floating
 * top-right, and a frosted info panel over a protection gradient at
 * the bottom. One tap opens detail; the heart saves.
 */

const CSS = `
.sm-match{
  position:relative; display:block; width:100%; overflow:hidden;
  border-radius:var(--radius-lg); background:var(--bg-sunken);
  box-shadow: var(--shadow-card); cursor:pointer; text-align:left;
  -webkit-tap-highlight-color:transparent; border:0; padding:0; color:#fff;
  transition: transform var(--dur-base) var(--ease-spring);
}
.sm-match:active{ transform: scale(0.985); }
.sm-match__media{ position:relative; width:100%; aspect-ratio:4/5; }
.sm-match--wide .sm-match__media{ aspect-ratio:16/11; }
.sm-match__img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.sm-match__top{
  position:absolute; top:14px; left:14px; right:14px; z-index:2;
  display:flex; align-items:flex-start; justify-content:space-between; gap:8px;
}
.sm-match__chips{ display:flex; gap:8px; flex-wrap:wrap; }
.sm-match__veil{
  position:absolute; inset:0; z-index:1; pointer-events:none;
  background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.45) 32%, rgba(0,0,0,0) 62%);
}
.sm-match__body{
  position:absolute; left:0; right:0; bottom:0; z-index:2;
  padding:18px 18px 20px; display:flex; flex-direction:column; gap:12px;
}
.sm-match__overline{
  font-family:var(--font-text); font-size:12px; font-weight:700;
  letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,.7);
}
.sm-match__title{ font-family:var(--font-display); font-weight:700; font-size:26px; line-height:1.08; letter-spacing:-0.02em; }
.sm-match__meta{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; color:rgba(255,255,255,.82); font-family:var(--font-text); font-size:14px; font-weight:500; }
.sm-match__metaitem{ display:inline-flex; align-items:center; gap:6px; }
.sm-match__foot{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-match-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function MatchCard({
  photo,
  sport,
  title,
  distance,
  date,
  time,
  spots,
  rating,
  ratingCount,
  level,
  saved = false,
  onSave,
  variant = 'default',
  className = '',
  style,
  children,
  ...rest
}) {
  inject();
  const spotsTone = typeof spots === 'number' && spots <= 2 ? 'danger' : 'success';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: ['sm-match', variant === 'wide' ? 'sm-match--wide' : '', className].filter(Boolean).join(' '),
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-match__media"
  }, photo ? /*#__PURE__*/React.createElement("img", {
    className: "sm-match__img",
    src: photo,
    alt: title || sport
  }) : null, /*#__PURE__*/React.createElement("span", {
    className: "sm-match__veil"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-match__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-match__chips"
  }, level ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "solid",
    icon: "signal"
  }, level) : null), onSave !== undefined ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "heart",
    filled: saved,
    variant: "glass",
    size: "sm",
    "aria-label": saved ? 'Saved' : 'Save match',
    onClick: e => {
      e.stopPropagation();
      onSave && onSave();
    },
    style: saved ? {
      color: 'var(--danger)'
    } : null
  }) : null)), /*#__PURE__*/React.createElement("span", {
    className: "sm-match__body"
  }, sport ? /*#__PURE__*/React.createElement("span", {
    className: "sm-match__overline"
  }, sport) : null, /*#__PURE__*/React.createElement("span", {
    className: "sm-match__title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "sm-match__meta"
  }, distance != null ? /*#__PURE__*/React.createElement("span", {
    className: "sm-match__metaitem"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 16
  }), distance) : null, date ? /*#__PURE__*/React.createElement("span", {
    className: "sm-match__metaitem"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 16
  }), date, time ? ` · ${time}` : '') : null), /*#__PURE__*/React.createElement("span", {
    className: "sm-match__foot"
  }, spots != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: spotsTone,
    dot: true
  }, spots, " spots left") : /*#__PURE__*/React.createElement("span", null), rating != null ? /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: ratingCount
  }) : null), children));
}
Object.assign(__ds_scope, { MatchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MatchCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/SwipeCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch SwipeCard
 * The full-screen, photography-first swipe card — the heart of the
 * product. A frosted glass information panel floats at the bottom;
 * INTERESTED / SKIP stamps fade in as the user drags. This component
 * is presentational — the deck/kit owns the gesture and passes a
 * `decision` and transform `style` while dragging.
 */

const CSS = `
.sm-swipe{
  position:absolute; inset:0; overflow:hidden; color:#fff;
  border-radius:var(--radius-xl); background:var(--bg-sunken);
  box-shadow: var(--shadow-card); will-change: transform;
}
.sm-swipe__img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.sm-swipe__veil{
  position:absolute; inset:0; pointer-events:none;
  background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.30) 40%, rgba(0,0,0,0) 66%),
              linear-gradient(to bottom, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 22%);
}
.sm-swipe__top{ position:absolute; top:18px; left:18px; right:18px; display:flex; gap:8px; }
.sm-swipe__body{ position:absolute; left:16px; right:16px; bottom:16px; }
.sm-swipe__panel{
  padding:20px; border-radius:var(--radius-lg);
  background:var(--glass-solid); box-shadow: var(--ring-glass), var(--inset-top-sheen);
  backdrop-filter: blur(var(--blur-lg)) saturate(1.4); -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(1.4);
  display:flex; flex-direction:column; gap:14px;
}
.sm-swipe__head{ display:flex; align-items:flex-end; justify-content:space-between; gap:12px; }
.sm-swipe__title{ font-family:var(--font-display); font-weight:800; font-size:30px; line-height:1.04; letter-spacing:-0.03em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sm-swipe__sub{ margin-top:7px; font-family:var(--font-text); font-size:15px; font-weight:500; color:rgba(255,255,255,.7); }
.sm-swipe__meta{ display:flex; gap:8px; flex-wrap:nowrap; align-items:center; }
.sm-swipe__meta > *{ flex:0 0 auto; }
.sm-swipe__stamp{
  position:absolute; top:64px; z-index:5; padding:8px 18px; border-radius:14px;
  font-family:var(--font-display); font-weight:800; font-size:30px; letter-spacing:0.04em;
  text-transform:uppercase; opacity:0; transition: opacity 90ms linear;
}
.sm-swipe__stamp--yes{ left:24px; transform: rotate(-14deg); color:var(--swipe-yes); box-shadow: inset 0 0 0 4px var(--swipe-yes); }
.sm-swipe__stamp--no{ right:24px; transform: rotate(14deg); color:var(--swipe-no); box-shadow: inset 0 0 0 4px var(--swipe-no); }
.sm-swipe[data-decision="yes"] .sm-swipe__stamp--yes{ opacity:1; }
.sm-swipe[data-decision="no"] .sm-swipe__stamp--no{ opacity:1; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-swipe-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

// Keep the date pill compact so the meta row never wraps.
function shortDate(d) {
  if (!d) return d;
  const map = {
    Tomorrow: 'Tmrw',
    Today: 'Today'
  };
  return map[d] || d;
}
const SwipeCard = React.forwardRef(function SwipeCard({
  photo,
  sport,
  title,
  subtitle,
  distance,
  date,
  time,
  spots,
  level,
  rating,
  ratingCount,
  decision = null,
  className = '',
  style,
  ...rest
}, ref) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: ['sm-swipe', className].filter(Boolean).join(' '),
    "data-decision": decision || undefined,
    style: style
  }, rest), photo ? /*#__PURE__*/React.createElement("img", {
    className: "sm-swipe__img",
    src: photo,
    alt: title || sport
  }) : null, /*#__PURE__*/React.createElement("span", {
    className: "sm-swipe__veil"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-swipe__stamp sm-swipe__stamp--yes"
  }, "Interested"), /*#__PURE__*/React.createElement("span", {
    className: "sm-swipe__stamp sm-swipe__stamp--no"
  }, "Skip"), /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__top"
  }, sport ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "solid",
    size: "lg"
  }, sport) : null, level ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "glass",
    size: "lg",
    icon: "signal"
  }, level) : null), /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__title"
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__sub"
  }, subtitle) : null), rating != null ? /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: ratingCount
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "sm-swipe__meta"
  }, distance != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "glass",
    icon: "map-pin"
  }, distance) : null, date ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "glass",
    icon: "calendar"
  }, shortDate(date), time ? ` · ${time}` : '') : null, spots != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: spots <= 2 ? 'danger' : 'success',
    dot: true
  }, spots, " spots") : null))));
});
Object.assign(__ds_scope, { SwipeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/SwipeCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch EmptyState
 * Calm, centered, lots of air. A glass icon disc, a short headline,
 * one supporting line, and at most one action. Never busy.
 */

const CSS = `
.sm-empty{
  display:flex; flex-direction:column; align-items:center; text-align:center;
  gap:8px; padding:40px 28px; color:#fff;
}
.sm-empty__disc{
  width:84px; height:84px; border-radius:50%; margin-bottom:8px;
  display:flex; align-items:center; justify-content:center; color:var(--ink-64);
  background:var(--glass); box-shadow: var(--ring-glass), var(--inset-top-sheen);
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
}
.sm-empty__title{ font-family:var(--font-display); font-weight:700; font-size:22px; letter-spacing:-0.02em; }
.sm-empty__text{ max-width:280px; font-family:var(--font-text); font-size:15px; font-weight:500; line-height:1.45; color:var(--ink-46); text-wrap:pretty; }
.sm-empty__action{ margin-top:14px; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-empty-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function EmptyState({
  icon = 'compass',
  title,
  text,
  action,
  className = '',
  style,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['sm-empty', className].filter(Boolean).join(' '),
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-empty__disc"
  }, typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 34
  }) : icon), title ? /*#__PURE__*/React.createElement("div", {
    className: "sm-empty__title"
  }, title) : null, text ? /*#__PURE__*/React.createElement("div", {
    className: "sm-empty__text"
  }, text) : null, action ? /*#__PURE__*/React.createElement("div", {
    className: "sm-empty__action"
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Toast
 * A floating frosted confirmation that drops from the top. Quiet,
 * glassy, one line. Tones carry an icon: success / info / danger.
 */

const CSS = `
.sm-toast{
  display:inline-flex; align-items:center; gap:11px;
  max-width:340px; padding:13px 18px 13px 14px; border-radius:var(--radius-pill);
  background:var(--glass-solid); color:#fff;
  box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-float);
  backdrop-filter: blur(var(--blur-lg)) saturate(1.5); -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(1.5);
  font-family:var(--font-text); font-size:15px; font-weight:600; letter-spacing:-0.01em;
}
.sm-toast__icon{ display:inline-flex; flex:none; width:28px; height:28px; align-items:center; justify-content:center; border-radius:50%; }
.sm-toast--success .sm-toast__icon{ background:var(--success-tint); color:var(--success); }
.sm-toast--info .sm-toast__icon{ background:var(--accent-tint); color:var(--accent); }
.sm-toast--danger .sm-toast__icon{ background:var(--danger-tint); color:var(--danger); }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-toast-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const ICONS = {
  success: 'check',
  info: 'zap',
  danger: 'x'
};
function Toast({
  tone = 'success',
  icon,
  children,
  className = '',
  style,
  ...rest
}) {
  inject();
  const name = icon || ICONS[tone] || 'check';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['sm-toast', `sm-toast--${tone}`, className].filter(Boolean).join(' '),
    role: "status",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sm-toast__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: 17,
    strokeWidth: 2.4
  })), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch Input
 * Frosted text field. Big, soft, minimal — one field per question in
 * the create flow. Optional leading icon. 'search' variant is the
 * floating glass search bar.
 */

const CSS = `
.sm-field{ display:flex; flex-direction:column; gap:8px; width:100%; }
.sm-field__label{ font-family:var(--font-text); font-size:13px; font-weight:600; color:var(--ink-64); letter-spacing:-0.01em; padding-left:4px; }
.sm-inputwrap{
  display:flex; align-items:center; gap:10px;
  height:56px; padding:0 18px; border-radius:var(--radius-sm);
  background:var(--glass); box-shadow: var(--ring-glass);
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
  transition: box-shadow var(--dur-base), background var(--dur-base);
}
.sm-inputwrap:focus-within{ box-shadow: inset 0 0 0 1.5px var(--accent); background:var(--glass-strong); }
.sm-inputwrap--search{ height:48px; border-radius:var(--radius-pill); }
.sm-inputwrap--lg{ height:64px; }
.sm-inputwrap__icon{ color:var(--ink-46); flex:none; }
.sm-input{
  flex:1 1 auto; min-width:0; border:0; background:transparent; outline:none;
  color:#fff; font-family:var(--font-text); font-size:17px; font-weight:500; letter-spacing:-0.01em;
}
.sm-input::placeholder{ color:var(--ink-32); }
.sm-inputwrap--lg .sm-input{ font-size:22px; font-family:var(--font-display); font-weight:600; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-input-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  label,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  wrapStyle,
  ...rest
}) {
  inject();
  const wrapCls = ['sm-inputwrap', variant === 'search' ? 'sm-inputwrap--search' : '', size === 'lg' ? 'sm-inputwrap--lg' : ''].filter(Boolean).join(' ');
  const field = /*#__PURE__*/React.createElement("div", {
    className: wrapCls,
    style: wrapStyle
  }, icon ? /*#__PURE__*/React.createElement("span", {
    className: "sm-inputwrap__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: typeof icon === 'string' ? icon : 'search',
    size: 20
  })) : null, /*#__PURE__*/React.createElement("input", _extends({
    className: ['sm-input', className].filter(Boolean).join(' '),
    style: style
  }, rest)));
  if (!label) return field;
  return /*#__PURE__*/React.createElement("label", {
    className: "sm-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-field__label"
  }, label), field);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch BottomNav
 * Floating frosted navigation pill. Icons only. A raised electric-blue
 * Create button breaks the center. Sits above the home indicator.
 */

const CSS = `
.sm-nav{
  position:absolute; left:50%; bottom:18px; transform:translateX(-50%);
  z-index:40; display:flex; align-items:center; gap:6px;
  padding:8px; border-radius:var(--radius-pill);
  background:var(--glass-solid); box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-float);
  backdrop-filter: blur(var(--blur-lg)) saturate(1.5); -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(1.5);
}
.sm-nav__item{
  position:relative; display:inline-flex; align-items:center; justify-content:center;
  width:50px; height:50px; border:0; background:transparent; border-radius:var(--radius-pill);
  color:var(--ink-46); cursor:pointer; -webkit-tap-highlight-color:transparent;
  transition: color var(--dur-base), background var(--dur-base), transform var(--dur-fast) var(--ease-spring);
}
.sm-nav__item:hover{ color:var(--ink-80); }
.sm-nav__item:active{ transform: scale(0.9); }
.sm-nav__item[aria-current="page"]{ color:#fff; }
.sm-nav__item[aria-current="page"]::after{
  content:""; position:absolute; bottom:7px; width:5px; height:5px; border-radius:50%;
  background:var(--accent); box-shadow:0 0 8px var(--accent-glow);
}
.sm-nav__create{
  width:58px; height:58px; margin:0 2px; border-radius:var(--radius-pill);
  background:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow-glow);
}
.sm-nav__create:hover{ background:var(--accent-bright); color:var(--accent-ink); }
.sm-nav__create::after{ display:none; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-nav-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const DEFAULT_ITEMS = [{
  key: 'discover',
  icon: 'compass',
  label: 'Discover'
}, {
  key: 'swipe',
  icon: 'layers',
  label: 'Swipe'
}, {
  key: 'create',
  icon: 'plus',
  label: 'Create',
  center: true
}, {
  key: 'map',
  icon: 'map',
  label: 'Map'
}, {
  key: 'profile',
  icon: 'user',
  label: 'Profile'
}];
function BottomNav({
  items = DEFAULT_ITEMS,
  active = 'discover',
  onSelect,
  className = '',
  style,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: ['sm-nav', className].filter(Boolean).join(' '),
    style: style
  }, rest), items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    type: "button",
    "aria-label": it.label,
    "aria-current": !it.center && active === it.key ? 'page' : undefined,
    className: ['sm-nav__item', it.center ? 'sm-nav__create' : ''].filter(Boolean).join(' '),
    onClick: () => onSelect && onSelect(it.key)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: it.center ? 26 : 24
  }))));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch FilterChip
 * Frosted selectable pill for filters — sport, distance, date.
 * Floats over the map / discover. Selected state flips to a solid
 * white fill so the active filter reads instantly.
 */

const CSS = `
.sm-chip{
  display:inline-flex; align-items:center; gap:7px;
  height:38px; padding:0 16px; border-radius:var(--radius-pill);
  font-family:var(--font-text); font-size:14px; font-weight:600;
  letter-spacing:-0.01em; line-height:1; white-space:nowrap;
  color:#fff; background:var(--glass-strong); border:0;
  box-shadow: var(--ring-glass); cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  backdrop-filter: blur(var(--blur-md)); -webkit-backdrop-filter: blur(var(--blur-md));
  transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-base), color var(--dur-base);
}
.sm-chip:hover{ background:rgba(255,255,255,.20); }
.sm-chip:active{ transform: scale(0.95); }
.sm-chip[aria-pressed="true"]{ background:#fff; color:#000; box-shadow:none; }
.sm-chip__count{ opacity:.5; font-variant-numeric:tabular-nums; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-chip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function FilterChip({
  selected = false,
  icon,
  count,
  children,
  className = '',
  style,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    className: ['sm-chip', className].filter(Boolean).join(' '),
    style: style
  }, rest), icon ? typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : icon : null, children, count != null ? /*#__PURE__*/React.createElement("span", {
    className: "sm-chip__count"
  }, count) : null);
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MapPin.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * SportMatch MapPin
 * A floating marker for the dark map. A frosted/accent capsule with a
 * sport icon (or label), a little tail, and a selected state that pops
 * to the electric-blue fill. Position it with left/top on the map.
 */

const CSS = `
.sm-pin{
  position:relative; display:inline-flex; align-items:center; gap:7px;
  height:38px; padding:0 14px; border:0; cursor:pointer;
  border-radius:var(--radius-pill); color:#fff; background:var(--glass-solid);
  box-shadow: var(--ring-glass), var(--inset-top-sheen), var(--shadow-float);
  backdrop-filter: blur(var(--blur-md)) saturate(1.4); -webkit-backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  font-family:var(--font-text); font-size:14px; font-weight:700; letter-spacing:-0.01em; white-space:nowrap;
  -webkit-tap-highlight-color:transparent;
  transition: transform var(--dur-base) var(--ease-spring), background var(--dur-base);
}
.sm-pin::after{
  content:""; position:absolute; left:50%; bottom:-5px; width:11px; height:11px;
  background:inherit; transform:translateX(-50%) rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0,0,0,.25);
}
.sm-pin:active{ transform: scale(0.94); }
.sm-pin[aria-pressed="true"]{ background:var(--accent); color:var(--accent-ink); box-shadow:var(--shadow-glow); transform: scale(1.06); z-index:2; }
.sm-pin--dot{ width:16px; height:16px; padding:0; border-radius:50%; background:var(--accent); box-shadow:0 0 0 4px rgba(78,168,255,.25), var(--shadow-float); }
.sm-pin--dot::after{ display:none; }
`;
let injected = false;
function inject() {
  if (typeof document === 'undefined' || injected) return;
  injected = true;
  const s = document.createElement('style');
  s.id = 'sm-pin-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function MapPin({
  icon,
  label,
  selected = false,
  dot = false,
  className = '',
  style,
  ...rest
}) {
  inject();
  if (dot) {
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      className: ['sm-pin', 'sm-pin--dot', className].filter(Boolean).join(' '),
      style: style
    }, rest));
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    className: ['sm-pin', className].filter(Boolean).join(' '),
    style: style
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : null, label != null ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { MapPin });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MapPin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/CreateMatch.jsx
try { (() => {
/* SportMatch — Create match wizard (one question per screen) */
(function () {
  const {
    FilterChip,
    Input,
    Button,
    IconButton,
    SegmentedControl,
    Badge,
    Icon,
    Avatar
  } = window.SportMatchDesignSystem_7eff40;
  const STEPS = ['Sport', 'Place', 'Time', 'Players', 'Review'];

  // Real calendar days (next 14) — every option is selectable & valid.
  function buildDays() {
    const out = [];
    const now = new Date();
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${wd[d.getDay()]} ${d.getDate()}`;
      out.push({
        key: i,
        weekday: wd[d.getDay()],
        dayNum: d.getDate(),
        label
      });
    }
    return out;
  }
  // 30-min slots from 08:00 to 23:00.
  function buildTimes() {
    const out = [];
    for (let h = 8; h <= 23; h++) {
      out.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 23) out.push(`${String(h).padStart(2, '0')}:30`);
    }
    return out;
  }
  const DAYS = buildDays();
  const TIMES = buildTimes();
  function Question({
    children
  }) {
    return /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-display)',
        fontSize: 36,
        letterSpacing: 'var(--tracking-title)',
        color: '#fff',
        marginBottom: 26,
        textWrap: 'balance'
      }
    }, children);
  }
  function Hint({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) 11px/1 var(--font-text)',
        letterSpacing: 'var(--tracking-overline)',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        marginBottom: 14
      }
    }, children);
  }
  function CreateMatch({
    data,
    onClose,
    onPublish
  }) {
    const [step, setStep] = React.useState(0);
    const [form, setForm] = React.useState({
      sport: 'Football',
      place: '',
      day: 'Today',
      dayKey: 0,
      time: '19:30',
      players: 12,
      level: 'casual'
    });
    const set = (k, v) => setForm(f => ({
      ...f,
      [k]: v
    }));
    const last = step === STEPS.length - 1;
    function next() {
      if (last) onPublish(form);else setStep(s => s + 1);
    }
    function back() {
      if (step === 0) onClose();else setStep(s => s - 1);
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-base)',
        zIndex: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: step === 0 ? 'x' : 'chevron-left',
      variant: "glass",
      size: "sm",
      "aria-label": "Back",
      onClick: back
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 5,
        borderRadius: 99,
        background: 'var(--ink-16)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${(step + 1) / STEPS.length * 100}%`,
        height: '100%',
        background: 'var(--accent)',
        borderRadius: 99,
        transition: 'width 320ms cubic-bezier(0.16,1,0.3,1)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, step + 1, "/", STEPS.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        bottom: 120,
        overflowY: 'auto',
        padding: '20px 24px'
      }
    }, /*#__PURE__*/React.createElement(Hint, null, `Step ${step + 1} · ${STEPS[step]}`), step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Question, null, "What are you playing?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, data.SPORTS.slice(1).map(s => {
      const on = form.sport === s.label;
      return /*#__PURE__*/React.createElement("button", {
        key: s.key,
        onClick: () => set('sport', s.label),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 16px',
          border: 0,
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          background: on ? 'var(--accent)' : 'var(--glass)',
          color: on ? 'var(--accent-ink)' : '#fff',
          boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '-0.02em'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 22
      }), s.label);
    }))), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Question, null, "Where's the match?"), /*#__PURE__*/React.createElement(Input, {
      variant: "search",
      icon: "map-pin",
      placeholder: "Search venue or address",
      value: form.place,
      onChange: e => set('place', e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginTop: 16
      }
    }, ['River Courts', 'Club Víbora', 'The Cage', 'Parque Sur'].map(pl => /*#__PURE__*/React.createElement(FilterChip, {
      key: pl,
      icon: "navigation",
      selected: form.place === pl,
      onClick: () => set('place', pl)
    }, pl)))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Question, null, "When's kick-off?"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12
      }
    }, "Day"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        margin: '0 -24px 26px',
        padding: '0 24px 6px',
        scrollSnapType: 'x mandatory'
      }
    }, DAYS.map(d => {
      const on = form.dayKey === d.key;
      return /*#__PURE__*/React.createElement("button", {
        key: d.key,
        onClick: () => setForm(f => ({
          ...f,
          dayKey: d.key,
          day: d.label
        })),
        style: {
          flex: '0 0 auto',
          scrollSnapAlign: 'start',
          width: 62,
          padding: '12px 0',
          border: 0,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          borderRadius: 'var(--radius-md)',
          background: on ? 'var(--accent)' : 'var(--glass)',
          color: on ? 'var(--accent-ink)' : '#fff',
          boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--text-caption)',
          opacity: 0.8,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }
      }, d.key === 0 ? 'Now' : d.weekday), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-numeric)',
          fontWeight: 800,
          fontSize: 22,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums'
        }
      }, d.dayNum));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12
      }
    }, "Time \xB7 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)'
      }
    }, form.time)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10
      }
    }, TIMES.map(t => {
      const on = form.time === t;
      return /*#__PURE__*/React.createElement("button", {
        key: t,
        onClick: () => set('time', t),
        style: {
          padding: '12px 0',
          border: 0,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-numeric)',
          fontWeight: 700,
          fontSize: 15,
          fontVariantNumeric: 'tabular-nums',
          background: on ? 'var(--accent)' : 'var(--glass)',
          color: on ? 'var(--accent-ink)' : 'var(--ink-80)',
          boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)'
        }
      }, t);
    }))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Question, null, "How big is the game?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)',
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--ink-64)',
        fontSize: 16,
        fontWeight: 600
      }
    }, "Total players"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      variant: "glass",
      size: "sm",
      "aria-label": "Fewer",
      onClick: () => set('players', Math.max(2, form.players - 2))
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-numeric)',
        fontWeight: 800,
        fontSize: 30,
        minWidth: 44,
        textAlign: 'center',
        color: '#fff',
        fontVariantNumeric: 'tabular-nums'
      }
    }, form.players), /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      variant: "solid",
      size: "sm",
      "aria-label": "More",
      onClick: () => set('players', Math.min(22, form.players + 2))
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 10
      }
    }, "Level"), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: form.level,
      onChange: v => set('level', v),
      options: [{
        value: 'casual',
        label: 'Casual'
      }, {
        value: 'intermediate',
        label: 'Intermediate'
      }, {
        value: 'advanced',
        label: 'Advanced'
      }]
    })), step === 4 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Question, null, "Ready to publish?"), /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: window.SM_IMG.bySport(form.sport.toLowerCase()),
      alt: "",
      style: {
        width: '100%',
        height: 180,
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 14
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "solid"
    }, form.sport), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 24,
        color: '#fff',
        marginTop: 8,
        letterSpacing: '-0.02em'
      }
    }, form.sport, " \xB7 ", form.level))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Summary, {
      icon: "map-pin",
      label: "Place",
      value: form.place || 'River Courts'
    }), /*#__PURE__*/React.createElement(Summary, {
      icon: "calendar",
      label: "When",
      value: `${form.day} · ${form.time}`
    }), /*#__PURE__*/React.createElement(Summary, {
      icon: "users",
      label: "Players",
      value: `${form.players} · ${form.level}`
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Alex Moreno",
      ring: "accent"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, "Host"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#fff',
        fontWeight: 700,
        fontFamily: 'var(--font-display)'
      }
    }, "You \xB7 Alex Moreno")))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '16px 24px calc(20px + var(--safe-bottom))',
        background: 'linear-gradient(to top, var(--bg-base) 60%, rgba(0,0,0,0))',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      size: "lg",
      variant: "primary",
      iconRight: last ? 'check' : 'arrow-right',
      onClick: next
    }, last ? 'Publish match' : 'Continue')));
  }
  function Summary({
    icon,
    label,
    value
  }) {
    const {
      Icon
    } = window.SportMatchDesignSystem_7eff40;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 20,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--ink-46)',
        font: 'var(--text-caption)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#fff',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        fontSize: 16
      }
    }, value));
  }
  Object.assign(window, {
    CreateMatch
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/CreateMatch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/Discover.jsx
try { (() => {
/* SportMatch — Discover screen (immersive vertical feed) */
(function () {
  const {
    MatchCard,
    FilterChip,
    Input,
    IconButton
  } = window.SportMatchDesignSystem_7eff40;
  function Discover({
    data,
    onOpen
  }) {
    const [sport, setSport] = React.useState('all');
    const [saved, setSaved] = React.useState({});
    const list = data.MATCHES.filter(m => sport === 'all' || m.sport.toLowerCase() === sport);
    return /*#__PURE__*/React.createElement(window.SMScreen, {
      style: {
        background: 'var(--bg-base)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '64px 20px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-display)',
        letterSpacing: 'var(--tracking-title)',
        color: '#fff'
      }
    }, "Discover"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "sliders",
      variant: "glass",
      "aria-label": "Filters"
    })), /*#__PURE__*/React.createElement(Input, {
      variant: "search",
      icon: "search",
      placeholder: "Search sports, places\u2026"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        padding: '18px 20px',
        WebkitOverflowScrolling: 'touch'
      }
    }, data.SPORTS.map(s => /*#__PURE__*/React.createElement(FilterChip, {
      key: s.key,
      icon: s.icon,
      selected: sport === s.key,
      onClick: () => setSport(s.key)
    }, s.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        padding: '4px 20px 150px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch'
      }
    }, list.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: {
        flex: '0 0 320px',
        scrollSnapAlign: 'start'
      }
    }, /*#__PURE__*/React.createElement(MatchCard, {
      photo: m.photoUrl,
      sport: m.sport,
      title: m.title,
      distance: m.distance,
      date: m.date,
      time: m.time,
      spots: m.spots,
      rating: m.rating,
      ratingCount: m.ratingCount,
      level: m.level,
      saved: !!saved[m.id],
      onSave: () => setSaved(s => ({
        ...s,
        [m.id]: !s[m.id]
      })),
      onClick: () => onOpen(m)
    }))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '1 1 auto'
      }
    }, /*#__PURE__*/React.createElement(window.SportMatchDesignSystem_7eff40.EmptyState, {
      icon: "search",
      title: "Nothing here yet",
      text: "No matches for this sport nearby. Try another filter."
    })) : null));
  }
  Object.assign(window, {
    Discover
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/Discover.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/Home.jsx
try { (() => {
/* SportMatch — Home screen */
(function () {
  const {
    MatchCard,
    Badge,
    IconButton,
    Icon,
    SegmentedControl
  } = window.SportMatchDesignSystem_7eff40;
  function LocationPill() {
    return /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 40,
        padding: '0 8px 0 14px',
        borderRadius: 'var(--radius-pill)',
        border: 0,
        cursor: 'pointer',
        color: '#fff',
        background: 'var(--glass-strong)',
        boxShadow: 'var(--ring-glass)',
        backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))',
        fontFamily: 'var(--font-text)',
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: '-0.01em'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 16,
      color: "var(--accent)"
    }), "Barcelona", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 16,
      color: "var(--ink-46)"
    }));
  }
  function SectionHead({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--text-title)',
        letterSpacing: 'var(--tracking-title)',
        color: '#fff'
      }
    }, title), action ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-callout)',
        color: 'var(--accent)',
        fontWeight: 600
      }
    }, action) : null);
  }
  function Home({
    data,
    onOpen,
    onTab
  }) {
    const [seg, setSeg] = React.useState('foryou');
    const rec = data.MATCHES.slice(0, 4);
    const today = data.MATCHES.filter(m => m.date === 'Today');
    return /*#__PURE__*/React.createElement(window.SMScreen, {
      style: {
        background: 'var(--bg-base)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 500
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: window.SM_IMG.url('football-sunset'),
      alt: "",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, var(--bg-base) 2%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.45) 100%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 64,
        left: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement(LocationPill, null), /*#__PURE__*/React.createElement(IconButton, {
      icon: "bell",
      variant: "glass",
      "aria-label": "Notifications"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 26,
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--size-micro)/1 var(--font-text)',
        letterSpacing: 'var(--tracking-overline)',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.72)',
        marginBottom: 14
      }
    }, "Good evening, Alex"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-hero)',
        fontSize: 52,
        letterSpacing: 'var(--tracking-hero)',
        color: '#fff',
        textWrap: 'balance'
      }
    }, "Find your", /*#__PURE__*/React.createElement("br", null), "next match."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 20px 22px'
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: seg,
      onChange: setSeg,
      options: [{
        value: 'foryou',
        label: 'For you'
      }, {
        value: 'nearby',
        label: 'Nearby'
      }, {
        value: 'friends',
        label: 'Friends'
      }]
    })), /*#__PURE__*/React.createElement(SectionHead, {
      title: "Recommended",
      action: "See all"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        padding: '0 20px 4px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch'
      }
    }, rec.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: {
        flex: '0 0 300px',
        scrollSnapAlign: 'start'
      }
    }, /*#__PURE__*/React.createElement(MatchCard, {
      photo: m.photoUrl,
      sport: m.sport,
      title: m.title,
      distance: m.distance,
      date: m.date,
      time: m.time,
      spots: m.spots,
      rating: m.rating,
      ratingCount: m.ratingCount,
      level: m.level,
      onClick: () => onOpen(m)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 34
      }
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Happening today",
      action: "Map"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '0 20px 150px'
      }
    }, today.map(m => /*#__PURE__*/React.createElement(window.MatchRow, {
      key: m.id,
      match: m,
      onOpen: onOpen
    })))));
  }

  /* Compact horizontal list row reused across screens */
  function MatchRow({
    match: m,
    onOpen
  }) {
    const {
      Badge,
      Rating,
      Icon
    } = window.SportMatchDesignSystem_7eff40;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpen(m),
      style: {
        display: 'flex',
        gap: 14,
        padding: 10,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        border: 0,
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        color: '#fff',
        boxShadow: 'var(--ring-glass)',
        backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: m.photoUrl,
      alt: "",
      style: {
        width: 76,
        height: 76,
        borderRadius: 'var(--radius-sm)',
        objectFit: 'cover',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) 11px/1 var(--font-text)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--ink-46)'
      }
    }, m.sport), /*#__PURE__*/React.createElement(Rating, {
      value: m.rating,
      size: 13
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, m.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--ink-64)',
        fontSize: 13,
        fontWeight: 500
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 14
    }), m.time), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 14
    }), m.distance))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: m.spots <= 2 ? 'danger' : 'success',
      dot: true
    }, m.spots)));
  }
  Object.assign(window, {
    Home,
    MatchRow
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/MapScreen.jsx
try { (() => {
/* SportMatch — Map screen (real dark map via Leaflet + CARTO tiles) */
(function () {
  const {
    FilterChip,
    Input,
    IconButton,
    Icon,
    BottomSheet,
    Button
  } = window.SportMatchDesignSystem_7eff40;

  // Barcelona-area coordinates for each match pin.
  const COORDS = {
    m1: [41.3851, 2.1734],
    m2: [41.3954, 2.1620],
    m3: [41.3779, 2.1899],
    m4: [41.4036, 2.1744],
    m5: [41.3699, 2.1540],
    m6: [41.3925, 2.1957],
    m7: [41.3812, 2.1620]
  };
  function pinHtml(sport, accent) {
    return `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translateY(-6px)">
        <div style="display:flex;align-items:center;gap:6px;height:38px;padding:0 12px;border-radius:99px;
          background:rgba(20,22,28,0.72);color:#fff;font:700 13px/1 var(--font-text,system-ui);letter-spacing:-0.01em;
          box-shadow:0 0 0 1px rgba(255,255,255,0.14), 0 8px 22px rgba(0,0,0,0.5);
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);white-space:nowrap">
          <span style="width:8px;height:8px;border-radius:50%;background:${accent};box-shadow:0 0 8px ${accent}"></span>${sport}
        </div>
        <div style="width:2px;height:10px;background:rgba(255,255,255,0.4)"></div>
      </div>`;
  }
  function MapScreen({
    data,
    onOpen
  }) {
    const [filters, setFilters] = React.useState(false);
    const mapRef = React.useRef(null);
    const elRef = React.useRef(null);
    React.useEffect(() => {
      if (!window.L || !elRef.current || mapRef.current) return;
      const accents = {
        Football: '#4EA8FF',
        Basketball: '#FF9F4E',
        Tennis: '#66D575',
        Padel: '#C77DFF'
      };
      const map = window.L.map(elRef.current, {
        center: [41.388, 2.173],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false
      });
      mapRef.current = map;
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      data.MATCHES.forEach(m => {
        const c = COORDS[m.id];
        if (!c) return;
        const icon = window.L.divIcon({
          html: pinHtml(m.sport, accents[m.sport] || '#4EA8FF'),
          className: '',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        window.L.marker(c, {
          icon
        }).addTo(map).on('click', () => onOpen(m));
      });

      // 'You are here' dot
      const here = window.L.divIcon({
        html: '<div style="width:18px;height:18px;border-radius:50%;background:#4EA8FF;box-shadow:0 0 0 4px rgba(78,168,255,0.3),0 0 0 2px #fff"></div>',
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      window.L.marker([41.388, 2.173], {
        icon: here
      }).addTo(map);
      setTimeout(() => map.invalidateSize(), 60);
      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, []);
    function recenter() {
      if (mapRef.current) mapRef.current.flyTo([41.388, 2.173], 14, {
        duration: 0.6
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: '#0a0d12'
      }
    }, /*#__PURE__*/React.createElement("div", {
      ref: elRef,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: '#0a0d12'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(5,6,10,0.55) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 72%, rgba(5,6,10,0.5) 100%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      variant: "search",
      icon: "search",
      placeholder: "Search this area"
    })), /*#__PURE__*/React.createElement(IconButton, {
      icon: "sliders",
      variant: "glass",
      "aria-label": "Filters",
      onClick: () => setFilters(true)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement(FilterChip, {
      selected: true,
      icon: "navigation"
    }, "Nearby"), /*#__PURE__*/React.createElement(FilterChip, {
      icon: "calendar"
    }, "Today"), /*#__PURE__*/React.createElement(FilterChip, null, "Free"), /*#__PURE__*/React.createElement(FilterChip, null, "Open spots"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 20,
        bottom: 140,
        zIndex: 20
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "navigation",
      variant: "glass",
      "aria-label": "Recenter",
      onClick: recenter
    })), /*#__PURE__*/React.createElement(BottomSheet, {
      open: filters,
      onClose: () => setFilters(false),
      title: "Filters",
      headerRight: /*#__PURE__*/React.createElement(IconButton, {
        icon: "x",
        variant: "plain",
        size: "sm",
        "aria-label": "Close",
        onClick: () => setFilters(false)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 10
      }
    }, "Sport"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, data.SPORTS.slice(1).map(s => /*#__PURE__*/React.createElement(FilterChip, {
      key: s.key,
      icon: s.icon
    }, s.label)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 10
      }
    }, "Level"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(FilterChip, {
      selected: true
    }, "Casual"), /*#__PURE__*/React.createElement(FilterChip, null, "Intermediate"), /*#__PURE__*/React.createElement(FilterChip, null, "Advanced"))), /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      onClick: () => setFilters(false)
    }, "Show 24 matches"))));
  }
  Object.assign(window, {
    MapScreen
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/MapScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/MatchDetail.jsx
try { (() => {
/* SportMatch — Match detail (immersive hero + floating glass sheet) */
(function () {
  const {
    Badge,
    Button,
    IconButton,
    Avatar,
    AvatarStack,
    Rating,
    Icon,
    GlassCard
  } = window.SportMatchDesignSystem_7eff40;
  function MetaTile({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 14,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        color: '#fff'
      }
    }, value));
  }
  function MatchDetail({
    match: m,
    onClose,
    onJoin,
    joined
  }) {
    const [saved, setSaved] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-base)',
        zIndex: 70
      }
    }, /*#__PURE__*/React.createElement(window.SMScreen, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 460
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: m.photoUrl,
      alt: "",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, var(--bg-base) 1%, rgba(0,0,0,0) 38%), linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 22%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "chevron-left",
      variant: "glass",
      "aria-label": "Back",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "share",
      variant: "glass",
      "aria-label": "Share"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "heart",
      filled: saved,
      variant: "glass",
      "aria-label": "Save",
      onClick: () => setSaved(!saved),
      style: saved ? {
        color: 'var(--danger)'
      } : null
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 22,
        zIndex: 2,
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "solid",
      size: "lg"
    }, m.sport), /*#__PURE__*/React.createElement(Badge, {
      tone: "glass",
      size: "lg",
      icon: "signal"
    }, m.level), /*#__PURE__*/React.createElement(Badge, {
      tone: "glass",
      size: "lg",
      icon: "navigation"
    }, m.price))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 20px 200px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-display)',
        fontSize: 34,
        letterSpacing: 'var(--tracking-title)',
        color: '#fff'
      }
    }, m.title), /*#__PURE__*/React.createElement(Rating, {
      value: m.rating,
      count: m.ratingCount
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        color: 'var(--ink-64)',
        fontSize: 15,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 16
    }), m.location, " \xB7 ", m.distance)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.organizer,
      size: "lg",
      ring: "accent"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, "Organised by"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 17,
        color: '#fff'
      }
    }, m.organizer)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Follow")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(MetaTile, {
      icon: "calendar",
      label: "Date",
      value: m.date
    }), /*#__PURE__*/React.createElement(MetaTile, {
      icon: "clock",
      label: "Kick-off",
      value: m.time
    }), /*#__PURE__*/React.createElement(MetaTile, {
      icon: "users",
      label: "Players",
      value: `${m.total - m.spots}/${m.total}`
    }), /*#__PURE__*/React.createElement(MetaTile, {
      icon: "signal",
      label: "Level",
      value: m.level
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--text-headline)',
        color: '#fff'
      }
    }, "Who's in"), /*#__PURE__*/React.createElement(Badge, {
      tone: m.spots <= 2 ? 'danger' : 'success',
      dot: true
    }, m.spots, " spots left")), /*#__PURE__*/React.createElement(AvatarStack, {
      avatars: m.players.map(p => ({
        name: p
      })),
      size: "lg",
      max: 6
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--text-body)',
        color: 'var(--ink-64)',
        textWrap: 'pretty'
      }
    }, "Friendly, well-organised game \u2014 bring light and dark. We rotate teams every 15 minutes so everyone plays. Arrive 10 minutes early to warm up."))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '18px 20px calc(20px + var(--safe-bottom))',
        background: 'linear-gradient(to top, var(--bg-base) 55%, rgba(0,0,0,0))',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, "Price"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 22,
        color: '#fff'
      }
    }, m.price)), /*#__PURE__*/React.createElement(Button, {
      fullWidth: true,
      variant: joined ? 'success' : 'primary',
      iconRight: joined ? 'check' : 'arrow-right',
      onClick: onJoin
    }, joined ? "You're in" : 'Join match')));
  }
  Object.assign(window, {
    MatchDetail
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/MatchDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/Matches.jsx
try { (() => {
/* SportMatch — Your Matches: games you've been accepted to. */
(function () {
  const {
    Badge,
    Rating,
    Icon,
    Avatar,
    EmptyState,
    Button
  } = window.SportMatchDesignSystem_7eff40;
  function MatchTicket({
    match: m,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpen(m),
      style: {
        position: 'relative',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        border: 0,
        padding: 0,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass), var(--inset-top-sheen)',
        backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 132
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: m.photoUrl,
      alt: "",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.05) 55%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "solid"
    }, m.sport), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      icon: "check"
    }, "Confirmed")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, m.title))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--ink-80)',
        fontSize: 14,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 15,
      color: "var(--accent)"
    }), m.date, " \xB7 ", m.time), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--ink-64)',
        fontSize: 14,
        fontWeight: 500,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 15
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, m.location.split(' · ')[0])), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--accent)',
        fontSize: 14,
        fontWeight: 600,
        flex: 'none'
      }
    }, "Details ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16
    }))));
  }
  function Matches({
    data,
    joined,
    onOpen,
    onTab
  }) {
    const list = data.MATCHES.filter(m => joined && joined[m.id]);
    return /*#__PURE__*/React.createElement(window.SMScreen, {
      style: {
        background: 'var(--bg-base)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '64px 20px 8px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-display)',
        letterSpacing: 'var(--tracking-title)',
        color: '#fff'
      }
    }, "Your matches"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink-46)',
        fontSize: 15,
        marginTop: 4
      }
    }, list.length ? `${list.length} confirmed · tap to see the full info` : 'Matches you join will land here')), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '60px 20px'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "layers",
      title: "No matches yet",
      text: "Swipe right on games you like. When you're accepted, they show up here.",
      action: /*#__PURE__*/React.createElement(Button, {
        iconLeft: "layers",
        onClick: () => onTab && onTab('swipe')
      }, "Start swiping")
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '14px 20px 150px'
      }
    }, list.map(m => /*#__PURE__*/React.createElement(MatchTicket, {
      key: m.id,
      match: m,
      onOpen: onOpen
    }))));
  }
  Object.assign(window, {
    Matches
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/Matches.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/Profile.jsx
try { (() => {
/* SportMatch — Profile (sports identity, stats, history) */
(function () {
  const {
    Rating,
    Button,
    IconButton,
    Icon
  } = window.SportMatchDesignSystem_7eff40;
  function StatCard({
    value,
    label,
    icon,
    accent
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '16px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass), var(--inset-top-sheen)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      color: accent || 'var(--accent)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-numeric)',
        fontWeight: 800,
        fontSize: 28,
        letterSpacing: '-0.03em',
        color: '#fff',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, label));
  }

  /* A neutral image slot — marks where a photo belongs. */
  function ImageSlot({
    circle,
    size,
    icon = 'image',
    label,
    ring,
    style
  }) {
    const radius = circle ? '50%' : 'var(--radius-md)';
    const shadow = ring ? '0 0 0 3px var(--bg-base), 0 0 0 6px var(--accent), var(--ring-glass)' : 'var(--ring-glass), var(--inset-top-sheen)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: circle ? size : '100%',
        height: circle ? size : '100%',
        borderRadius: radius,
        background: 'var(--glass-strong)',
        boxShadow: shadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'var(--ink-46)',
        overflow: 'hidden',
        ...style
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: circle ? 32 : 30
    }), label ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-caption)',
        letterSpacing: '0.01em'
      }
    }, label) : null);
  }
  function SettingsRow({
    icon,
    label,
    sub,
    onClick,
    danger
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        textAlign: 'left',
        padding: '16px 18px',
        border: 0,
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass)',
        color: danger ? 'var(--swipe-no)' : '#fff'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--glass-strong)',
        color: danger ? 'var(--swipe-no)' : 'var(--accent)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 19
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-text)',
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '-0.01em'
      }
    }, label), sub ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        marginTop: 2
      }
    }, sub) : null), !danger ? /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--ink-46)"
    }) : null);
  }
  function SettingsPanel({
    open,
    profile,
    onClose
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: 'linear-gradient(180deg, rgba(12,14,18,0.86), rgba(5,6,10,0.94))',
        backdropFilter: 'blur(var(--blur-lg))',
        WebkitBackdropFilter: 'blur(var(--blur-lg))',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 360ms cubic-bezier(0.32,0.72,0,1)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '64px 20px 18px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-title)',
        color: '#fff'
      }
    }, "Settings"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      variant: "glass",
      "aria-label": "Close settings",
      onClick: onClose
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        margin: '0 20px 22px',
        padding: 16,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--glass)',
        boxShadow: 'var(--ring-glass), var(--inset-top-sheen)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: profile.avatar,
      alt: profile.name,
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: 'var(--ring-glass)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18,
        color: '#fff',
        letterSpacing: '-0.02em'
      }
    }, profile.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)'
      }
    }, profile.handle))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '0 20px'
      }
    }, /*#__PURE__*/React.createElement(SettingsRow, {
      icon: "pencil",
      label: "Edit profile",
      sub: "Name, photo, sports & city",
      onClick: onClose
    }), /*#__PURE__*/React.createElement(SettingsRow, {
      icon: "share",
      label: "Share profile",
      sub: "Send your SportMatch link",
      onClick: onClose
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        padding: '0 20px 40px'
      }
    }, /*#__PURE__*/React.createElement(SettingsRow, {
      icon: "log-out",
      label: "Log out",
      danger: true,
      onClick: onClose
    })));
  }
  function Profile({
    data,
    onOpen
  }) {
    const p = data.PROFILE;
    const history = data.MATCHES.slice(1, 5);
    const [settings, setSettings] = React.useState(false);
    return /*#__PURE__*/React.createElement(window.SMScreen, {
      style: {
        background: 'var(--bg-base)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 196
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: p.cover,
      alt: "",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, var(--bg-base) 3%, rgba(0,0,0,0) 62%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "settings",
      variant: "glass",
      "aria-label": "Settings",
      onClick: () => setSettings(true)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        marginTop: -54,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: p.avatar,
      alt: p.name,
      style: {
        width: 104,
        height: 104,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 0 0 3px var(--bg-base), 0 0 0 6px var(--accent), var(--ring-glass)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-title)',
        color: '#fff'
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink-46)',
        fontSize: 15,
        marginTop: 3,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 14
    }), p.city, " \xB7 ", p.handle))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        padding: '24px 20px 0'
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      value: p.rating,
      label: "Rating",
      icon: "star",
      accent: "#FFC857"
    }), /*#__PURE__*/React.createElement(StatCard, {
      value: p.matches,
      label: "Matches",
      icon: "trophy"
    }), /*#__PURE__*/React.createElement(StatCard, {
      value: p.streak,
      label: "Week streak",
      icon: "flame",
      accent: "var(--warning)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '28px 20px 150px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--text-title)',
        color: '#fff'
      }
    }, "Recent matches"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-callout)',
        color: 'var(--accent)',
        fontWeight: 600
      }
    }, "All")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, history.map(m => /*#__PURE__*/React.createElement(window.MatchRow, {
      key: m.id,
      match: m,
      onOpen: onOpen
    })))), /*#__PURE__*/React.createElement(SettingsPanel, {
      open: settings,
      profile: p,
      onClose: () => setSettings(false)
    }));
  }
  Object.assign(window, {
    Profile
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/Profile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/SwipeDeck.jsx
try { (() => {
/* SportMatch — Swipe deck (the centerpiece). Real drag + spring. */
(function () {
  const {
    SwipeCard,
    IconButton,
    Icon,
    EmptyState,
    Button
  } = window.SportMatchDesignSystem_7eff40;
  const THRESHOLD = 110;
  function SwipeDeck({
    data,
    onOpen,
    onLike
  }) {
    const [index, setIndex] = React.useState(0);
    const [drag, setDrag] = React.useState({
      x: 0,
      y: 0,
      active: false
    });
    const [flyout, setFlyout] = React.useState(null); // 'yes' | 'no' | null
    const start = React.useRef(null);
    const deck = data.MATCHES;
    const current = deck[index];
    const decision = flyout || (Math.abs(drag.x) > 40 ? drag.x > 0 ? 'yes' : 'no' : null);
    function onDown(e) {
      if (flyout) return;
      start.current = {
        x: e.clientX,
        y: e.clientY
      };
      setDrag({
        x: 0,
        y: 0,
        active: true
      });
      e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!start.current) return;
      setDrag({
        x: e.clientX - start.current.x,
        y: e.clientY - start.current.y,
        active: true
      });
    }
    function onUp() {
      if (!start.current) return;
      start.current = null;
      if (Math.abs(drag.x) > THRESHOLD) {
        commit(drag.x > 0 ? 'yes' : 'no');
      } else {
        setDrag({
          x: 0,
          y: 0,
          active: false
        });
      }
    }
    function commit(dir) {
      setFlyout(dir);
      setDrag(d => ({
        ...d,
        active: false
      }));
      if (dir === 'yes' && onLike) onLike(current);
      setTimeout(() => {
        setFlyout(null);
        setDrag({
          x: 0,
          y: 0,
          active: false
        });
        setIndex(i => i + 1);
      }, 300);
    }
    if (!current) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(EmptyState, {
        icon: "check",
        title: "You're all caught up",
        text: "You've seen every match nearby. Check back later or widen your radius.",
        action: /*#__PURE__*/React.createElement(Button, {
          iconLeft: "compass",
          onClick: () => setIndex(0)
        }, "Start over")
      }));
    }
    const pal = current.palette || {
      avg: '#3a463a',
      vibrant: '#d52019'
    };
    const dx = flyout ? flyout === 'yes' ? 600 : -600 : drag.x;
    const dy = flyout ? -40 : drag.y;
    const rot = dx / 22;
    const topTransform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    const topTransition = drag.active ? 'none' : 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-base)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `@keyframes smAmbient{from{opacity:0}to{opacity:1}}`), /*#__PURE__*/React.createElement("div", {
      key: current.id,
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        animation: 'smAmbient 700ms ease both',
        background: `radial-gradient(120% 72% at 50% 14%, ${pal.vibrant}66, rgba(0,0,0,0) 56%), radial-gradient(115% 70% at 50% 104%, ${pal.avg}59, rgba(0,0,0,0) 72%)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 62,
        left: 20,
        right: 20,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--text-title)',
        color: '#fff'
      }
    }, "Swipe"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--ink-46)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, index + 1, " / ", deck.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 104,
        left: 16,
        right: 16,
        bottom: 120,
        zIndex: 1
      }
    }, [2, 1, 0].map(depth => {
      const m = deck[index + depth];
      if (!m) return null;
      const isTop = depth === 0;
      const behind = {
        transform: `scale(${1 - depth * 0.05}) translateY(${depth * 14}px)`,
        transition: 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)',
        filter: depth ? 'brightness(0.7)' : 'none'
      };
      return /*#__PURE__*/React.createElement(SwipeCard, {
        key: m.id + '-' + (index + depth),
        photo: m.photoUrl,
        sport: m.sport,
        title: m.title,
        subtitle: `${m.location.split(' · ')[0]} · ${m.distance} away`,
        distance: m.distance,
        date: m.date,
        time: m.time,
        spots: m.spots,
        level: m.level,
        rating: m.rating,
        ratingCount: m.ratingCount,
        decision: isTop ? decision : null,
        onPointerDown: isTop ? onDown : undefined,
        onPointerMove: isTop ? onMove : undefined,
        onPointerUp: isTop ? onUp : undefined,
        onPointerCancel: isTop ? onUp : undefined,
        style: isTop ? {
          transform: topTransform,
          transition: topTransition,
          cursor: 'grab',
          touchAction: 'none',
          zIndex: 10
        } : {
          ...behind,
          zIndex: 10 - depth
        }
      });
    })));
  }
  Object.assign(window, {
    SwipeDeck
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/SwipeDeck.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/app.jsx
try { (() => {
/* SportMatch — App shell: phone frame, router, overlays, toast. */
(function () {
  const {
    BottomNav,
    Toast
  } = window.SportMatchDesignSystem_7eff40;
  const NAV_ITEMS = [{
    key: 'map',
    icon: 'map',
    label: 'Map'
  }, {
    key: 'swipe',
    icon: 'layers',
    label: 'Swipe'
  }, {
    key: 'create',
    icon: 'plus',
    label: 'Create',
    center: true
  }, {
    key: 'matches',
    icon: 'calendar',
    label: 'Matches'
  }, {
    key: 'profile',
    icon: 'user',
    label: 'Profile'
  }];
  function AppShell() {
    const data = window.SM_DATA;
    const [tab, setTab] = React.useState('map');
    const [detail, setDetail] = React.useState(null);
    const [create, setCreate] = React.useState(false);
    const [joined, setJoined] = React.useState({
      m1: true,
      m3: true
    });
    const [toast, setToast] = React.useState(null);
    const toastTimer = React.useRef(null);
    function flash(node) {
      setToast(node);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2800);
    }
    function openDetail(m) {
      setDetail(m);
    }
    function onSelect(key) {
      if (key === 'create') {
        setCreate(true);
        return;
      }
      setDetail(null);
      setTab(key);
    }
    function joinCurrent() {
      if (!detail) return;
      setJoined(j => ({
        ...j,
        [detail.id]: true
      }));
      flash(/*#__PURE__*/React.createElement(Toast, {
        tone: "success"
      }, "You're in. See you on the ", detail.sport.toLowerCase(), " \u26A1"));
    }
    function publish(form) {
      setCreate(false);
      flash(/*#__PURE__*/React.createElement(Toast, {
        tone: "success"
      }, "Match published \xB7 ", form.sport, " ", form.day, " ", form.time));
    }
    function acceptMatch(m) {
      setJoined(j => ({
        ...j,
        [m.id]: true
      }));
      flash(/*#__PURE__*/React.createElement(Toast, {
        tone: "success"
      }, "You're in. ", m.title, " added to your matches \u26A1"));
    }
    const screens = {
      discover: /*#__PURE__*/React.createElement(window.Discover, {
        data: data,
        onOpen: openDetail
      }),
      matches: /*#__PURE__*/React.createElement(window.Matches, {
        data: data,
        joined: joined,
        onOpen: openDetail,
        onTab: setTab
      }),
      home: /*#__PURE__*/React.createElement(window.Home, {
        data: data,
        onOpen: openDetail,
        onTab: setTab
      }),
      swipe: /*#__PURE__*/React.createElement(window.SwipeDeck, {
        data: data,
        onOpen: openDetail,
        onLike: acceptMatch
      }),
      map: /*#__PURE__*/React.createElement(window.MapScreen, {
        data: data,
        onOpen: openDetail
      }),
      profile: /*#__PURE__*/React.createElement(window.Profile, {
        data: data,
        onOpen: openDetail
      })
    };
    const overlay = detail || create;
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-screen-root"
    }, screens[tab], detail ? /*#__PURE__*/React.createElement(window.MatchDetail, {
      match: detail,
      joined: !!joined[detail.id],
      onClose: () => setDetail(null),
      onJoin: joinCurrent
    }) : null, create ? /*#__PURE__*/React.createElement(window.CreateMatch, {
      data: data,
      onClose: () => setCreate(false),
      onPublish: publish
    }) : null, !overlay ? /*#__PURE__*/React.createElement(BottomNav, {
      items: NAV_ITEMS,
      active: tab,
      onSelect: onSelect
    }) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 95,
        pointerEvents: 'none',
        transform: toast ? 'translateY(0)' : 'translateY(-140%)',
        opacity: toast ? 1 : 0,
        transition: 'transform 420ms cubic-bezier(0.34,1.56,0.64,1), opacity 240ms'
      }
    }, toast), /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement(window.HomeIndicator, null));
  }

  // Scale the fixed phone canvas to fit the viewport.
  function fit() {
    const frame = document.getElementById('frame');
    if (!frame) return;
    const pad = 24;
    const s = Math.min((window.innerWidth - pad) / 390, (window.innerHeight - pad) / 844, 1.15);
    frame.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  window.addEventListener('resize', fit);
  setTimeout(fit, 0);

  // Mount only when every screen + data is ready. This file gets compiled
  // into the DS bundle AND loaded as a standalone script; the bundle copy
  // can execute before the per-screen scripts define their globals, so we
  // bail out until everything exists and retry on window 'load'.
  function ready() {
    return !!(window.SM_DATA && window.MapScreen && window.SwipeDeck && window.Matches && window.Discover && window.Profile && window.MatchDetail && window.CreateMatch && window.StatusBar && window.HomeIndicator && window.SMScreen && (window.SportMatchDesignSystem_7eff40 || {}).BottomNav);
  }
  function boot() {
    if (!ready()) return;
    const mountEl = document.getElementById('app');
    if (!mountEl) return;
    if (!mountEl.__smRoot) mountEl.__smRoot = ReactDOM.createRoot(mountEl);
    mountEl.__smRoot.render(/*#__PURE__*/React.createElement(AppShell, null));
    setTimeout(fit, 60);
  }
  boot();
  window.addEventListener('load', boot);
  window.__fitFrame = fit;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/data.js
try { (() => {
/* SportMatch — mock data for the UI kit. Loaded after assets/imagery.js. */
(function () {
  var img = window.SM_IMG;
  var MATCHES = [{
    id: 'm1',
    sport: 'Football',
    photo: 'football-match',
    title: 'Sunset 7-a-side',
    distance: '2.3 km',
    date: 'Today',
    time: '19:30',
    spots: 3,
    total: 14,
    level: 'Intermediate',
    rating: 4.8,
    ratingCount: 126,
    organizer: 'Marco Díaz',
    location: 'River Courts · Pitch 2',
    price: 'Free',
    players: ['Marco Díaz', 'Lucía Romero', 'Sam Okafor', 'Pau Vidal', 'Nadia Khan']
  }, {
    id: 'm2',
    sport: 'Basketball',
    photo: 'streetball-bw',
    title: 'Streetball run',
    distance: '1.2 km',
    date: 'Tomorrow',
    time: '18:00',
    spots: 2,
    total: 10,
    level: 'Advanced',
    rating: 4.9,
    ratingCount: 210,
    organizer: 'Sofía Park',
    location: 'The Cage · Riverside',
    price: 'Free',
    players: ['Sofía Park', 'Theo Blanc', 'Ivan Petrov', 'Maya Lind']
  }, {
    id: 'm3',
    sport: 'Tennis',
    photo: 'tennis-clay',
    title: 'Clay court rally',
    distance: '2.0 km',
    date: 'Tomorrow',
    time: '20:00',
    spots: 2,
    total: 4,
    level: 'Intermediate',
    rating: 4.9,
    ratingCount: 143,
    organizer: 'Elena Cruz',
    location: 'Club Víbora · Court 5',
    price: '€8',
    players: ['Elena Cruz', 'Diego Sanz']
  }, {
    id: 'm4',
    sport: 'Basketball',
    photo: 'basketball-aerial',
    title: 'Rooftop hoops',
    distance: '3.0 km',
    date: 'Sat',
    time: '11:00',
    spots: 4,
    total: 12,
    level: 'Open',
    rating: 4.7,
    ratingCount: 58,
    organizer: 'Jordan Lee',
    location: 'Skyline Court',
    price: 'Free',
    players: ['Jordan Lee', 'Amara Diop', 'Liam Walsh']
  }, {
    id: 'm5',
    sport: 'Padel',
    photo: 'tennis-net',
    title: 'Night doubles',
    distance: '5.4 km',
    date: 'Fri',
    time: '21:00',
    spots: 1,
    total: 4,
    level: 'Open',
    rating: 4.5,
    ratingCount: 37,
    organizer: 'Carla Ruiz',
    location: 'Indoor Center · Court 1',
    price: '€10',
    players: ['Carla Ruiz', 'Bea Soto', 'Tom Lang']
  }, {
    id: 'm6',
    sport: 'Football',
    photo: 'football-sunset',
    title: 'Golden hour kickabout',
    distance: '4.1 km',
    date: 'Today',
    time: '20:00',
    spots: 5,
    total: 12,
    level: 'Casual',
    rating: 4.6,
    ratingCount: 84,
    organizer: 'Hugo Martín',
    location: 'Parque Sur · Field A',
    price: 'Free',
    players: ['Hugo Martín', 'Inès Faye', 'Noah Klein']
  }, {
    id: 'm7',
    sport: 'Basketball',
    photo: 'basketball-bw',
    title: 'Half-court 3v3',
    distance: '0.8 km',
    date: 'Today',
    time: '17:30',
    spots: 6,
    total: 12,
    level: 'Casual',
    rating: 4.4,
    ratingCount: 29,
    organizer: 'Kofi Mensah',
    location: 'Central Playground',
    price: 'Free',
    players: ['Kofi Mensah', 'Rosa Lima']
  }];

  // Resolve lazily (getter) so the photo URL is computed at render time,
  // when the imagery.js script element's resolved src is stable — avoids a
  // wrong base captured during early page load.
  MATCHES.forEach(function (m) {
    var key = m.photo;
    Object.defineProperty(m, 'photoUrl', {
      enumerable: true,
      get: function () {
        return img.url(key);
      }
    });
    m.palette = img.palette(key);
  });
  var SPORTS = [{
    key: 'all',
    label: 'All'
  }, {
    key: 'football',
    label: 'Football',
    icon: 'compass'
  }, {
    key: 'basketball',
    label: 'Basketball',
    icon: 'flame'
  }, {
    key: 'tennis',
    label: 'Tennis',
    icon: 'trophy'
  }, {
    key: 'padel',
    label: 'Padel',
    icon: 'zap'
  }, {
    key: 'running',
    label: 'Running',
    icon: 'navigation'
  }];
  var PROFILE = {
    name: 'Alex Moreno',
    handle: '@alexm',
    rating: 4.9,
    ratingCount: 64,
    matches: 128,
    hours: 312,
    streak: 7,
    sports: ['Football', 'Basketball', 'Padel'],
    city: 'Barcelona'
  };
  Object.defineProperty(PROFILE, 'cover', {
    enumerable: true,
    get: function () {
      return img.url('football-sunset');
    }
  });
  Object.defineProperty(PROFILE, 'avatar', {
    enumerable: true,
    get: function () {
      return img.url('streetball-bw');
    }
  });
  window.SM_DATA = {
    MATCHES: MATCHES,
    SPORTS: SPORTS,
    PROFILE: PROFILE
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/sportmatch-app/parts.jsx
try { (() => {
/* SportMatch UI kit — shared chrome (status bar, screen header). */
const SM = window.SportMatchDesignSystem_7eff40;
function StatusBar({
  dark
}) {
  const color = dark ? '#fff' : '#fff';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 26px',
      color,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '-0.01em'
    }
  }, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "12",
    viewBox: "0 0 18 12",
    fill: color
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "8",
    width: "3",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "5",
    width: "3",
    height: "7",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "2.5",
    width: "3",
    height: "9.5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "0",
    width: "3",
    height: "12",
    rx: "1"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "12",
    viewBox: "0 0 16 12",
    fill: "none",
    stroke: color,
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.2a10 10 0 0 1 14 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 6.8a6.3 6.3 0 0 1 9 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 9.3a2.7 2.7 0 0 1 4 0"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "13",
    viewBox: "0 0 26 13",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "22",
    height: "12",
    rx: "3.5",
    stroke: color,
    strokeOpacity: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "17",
    height: "9",
    rx: "2",
    fill: color
  }), /*#__PURE__*/React.createElement("rect", {
    x: "24",
    y: "4",
    width: "2",
    height: "5",
    rx: "1",
    fill: color,
    fillOpacity: "0.5"
  }))));
}
function HomeIndicator() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      zIndex: 60,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 134,
      height: 5,
      borderRadius: 99,
      background: 'rgba(255,255,255,0.5)'
    }
  }));
}

/* A scrollable screen body with consistent gutters + safe areas. */
function SMScreen({
  children,
  style,
  scrollRef
}) {
  return /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      ...style
    }
  }, children);
}
Object.assign(window, {
  StatusBar,
  HomeIndicator,
  SMScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sportmatch-app/parts.jsx", error: String((e && e.message) || e) }); }

__ds_ns.MatchCard = __ds_scope.MatchCard;

__ds_ns.SwipeCard = __ds_scope.SwipeCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarStack = __ds_scope.AvatarStack;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.GlassCard = __ds_scope.GlassCard;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.MatchCardSkeleton = __ds_scope.MatchCardSkeleton;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.MapPin = __ds_scope.MapPin;

})();
