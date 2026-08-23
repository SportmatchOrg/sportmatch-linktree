/* SportMatch — screen overrides.
   Plain-JS (no JSX) reimplementations of CreateMatch and MapScreen that
   reassign the window globals the bundle defines, applying the requested
   fixes. Loaded AFTER the DS bundle; waits for the namespace to finish so
   it always wins the assignment, then announces itself so the running app
   re-renders and picks them up. */
(function () {
  var h = React.createElement;

  /* ---------- shared little glyphs the icon set doesn't ship ---------- */
  function svg(size, children) {
    return h('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round',
      strokeLinejoin: 'round', style: { display: 'block', flex: 'none' }
    }, children);
  }
  var MinusGlyph = svg(18, h('path', { key: 'm', d: 'M5 12h14' }));  var PlusGlyph = svg(18, [
    h('path', { key: 'a', d: 'M5 12h14' }),
    h('path', { key: 'b', d: 'M12 5v14' })
  ]);
  // Symmetric "locate me" crosshair — reads centered in its circular button.
  var LocateGlyph = svg(22, [
    h('line', { key: 1, x1: 12, y1: 2, x2: 12, y2: 5 }),
    h('line', { key: 2, x1: 12, y1: 19, x2: 12, y2: 22 }),
    h('line', { key: 3, x1: 2, y1: 12, x2: 5, y2: 12 }),
    h('line', { key: 4, x1: 19, y1: 12, x2: 22, y2: 12 }),
    h('circle', { key: 5, cx: 12, cy: 12, r: 7 }),
    h('circle', { key: 6, cx: 12, cy: 12, r: 3 })
  ]);

  function photoFor(i) { var g = window.SM_IMG.gallery; return window.SM_IMG.url(g[((i % g.length) + g.length) % g.length]); }

  /* ---------- sport glyphs: Lucide Lab (ISC), verbatim ---------- */
  var SPORT_SVG = {
    // lucide-lab/soccer-ball
    Football: '<circle cx="12" cy="12" r="10"/><path d="M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9 0 0 3.1.7 6.2 0 0 0 1.9-2.3 1.9-5.9 0 .1-2-2.3-5-3.6"/><path d="M11.9 6.7V2"/><path d="M16.9 10.4s3-1.4 4.5-1.6"/><path d="M15 16.3s1.9 2.7 2.9 3.7"/><path d="M8.8 16.3S6.9 19 6 20"/><path d="M2.6 8.7C4 9 7 10.4 7 10.4"/>',
    // lucide-lab/basketball
    Basketball: '<circle cx="12" cy="12" r="10"/><path d="M2.1 13.4A10.1 10.1 0 0 0 13.4 2.1"/><path d="m5 4.9 14 14.2"/><path d="M21.9 10.6a10.1 10.1 0 0 0-11.3 11.3"/>',
    // lucide-lab/tennis-ball
    Tennis: '<path d="M2 12c5.5 0 10-4.5 10-10"/><circle cx="12" cy="12" r="10"/><path d="M22 12c-5.5 0-10 4.5-10 10"/>',
    // lucide-lab/tennis-racket
    Padel: '<path d="M10.7 4.7c3-3 7.4-3.6 9.8-1.2s1.8 6.8-1.2 9.8a9.5 9.5 0 0 1-4.3 2.5c-2.1.5-4.1.1-5.5-1.3S7.7 11.1 8.2 9a9.5 9.5 0 0 1 2.5-4.3"/><path d="M8.2 9 6 18l9-2.2"/><path d="m2 22 4-4"/><circle cx="20" cy="20" r="2"/>',
    // lucide/footprints
    Running: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>'
  };
  var SPORT_ALIAS = { football: 'Football', basketball: 'Basketball', tennis: 'Tennis', padel: 'Padel', running: 'Running', 'Fútbol': 'Football', 'Básquet': 'Basketball', 'Tenis': 'Tennis', 'Pádel': 'Padel' };
  function sportGlyph(label, size) {
    var inner = SPORT_SVG[label] || SPORT_SVG[SPORT_ALIAS[label]];
    if (!inner) return null;
    return React.cloneElement(lucideGlyph(inner, size || 18), { key: 'sg' });
  }
  // Bundle screens read s.icon straight through to FilterChip/Badge, both of
  // which accept a React element as well as a name — so swap in real glyphs.
  function applySportIcons() {
    var d = window.SM_DATA; if (!d || !d.SPORTS || d.__sportIconsPatched) return;
    d.SPORTS.forEach(function (s) { var g = sportGlyph(s.key, 16); if (g) s.icon = g; });
    d.__sportIconsPatched = true;
  }

  /* =====================================================================
     CreateMatch
     ===================================================================== */
  function buildDays() {
    var out = [], now = new Date();
    var wd = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (var i = 0; i < 14; i++) {
      var d = new Date(now); d.setDate(now.getDate() + i);
      var label = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : wd[d.getDay()] + ' ' + d.getDate();
      out.push({ key: i, weekday: wd[d.getDay()], dayNum: d.getDate(), label: label });
    }
    return out;
  }
  var DAYS = buildDays();
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var HOURS = []; for (var hh = 6; hh <= 23; hh++) HOURS.push(hh);
  var MINUTES = []; for (var mm = 0; mm < 60; mm += 5) MINUTES.push(mm);
  var STEPS = ['Deporte', 'Lugar', 'Horario', 'Jugadores', 'Revisión'];

  function Question(props) {
    return h('h1', { style: { font: 'var(--text-display)', fontSize: 36, letterSpacing: 'var(--tracking-title)', color: '#fff', marginBottom: 26, textWrap: 'balance' } }, props.children);
  }
  function Hint(props) {
    return h('div', { style: { font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: 'var(--tracking-overline)', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 } }, props.children);
  }
  function FieldLabel(props) {
    return h('div', { style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 } }, props.children);
  }

  function CreateMatch(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var FilterChip = DS.FilterChip, Input = DS.Input, Button = DS.Button,
        IconButton = DS.IconButton, SegmentedControl = DS.SegmentedControl,
        Badge = DS.Badge, Icon = DS.Icon, Avatar = DS.Avatar;
    var data = props.data, onClose = props.onClose, onPublish = props.onPublish;

    var st = React.useState(props.initialStep || 0); var step = st[0], setStep = st[1];
    var fs = React.useState({ sport: 'Fútbol', sportKey: 'football', place: '', day: 'Today', dayKey: 0, hour: 19, minute: 30, time: '19:30', players: 12, level: 'casual', title: '', description: '' });
    var form = fs[0], setForm = fs[1];
    var set = function (k, v) { setForm(function (f) { var n = Object.assign({}, f); n[k] = v; return n; }); };
    var setTime = function (hour, minute) {
      setForm(function (f) { return Object.assign({}, f, { hour: hour, minute: minute, time: pad2(hour) + ':' + pad2(minute) }); });
    };
    var last = step === STEPS.length - 1;
    var next = function () { if (last) onPublish(form); else setStep(function (s) { return s + 1; }); };
    var back = function () { if (step === 0) onClose(); else setStep(function (s) { return s - 1; }); };

    /* ---- horizontal scroller used by day / hour / minute ----
       vertical padding leaves room for the active glow so it isn't
       clipped by the scroller's overflow box / the next section. */
    function pickerRow(children) {
      return h('div', {
        style: {
          display: 'flex', gap: 10, overflowX: 'auto',
          margin: '0 -24px', padding: '14px 24px 26px',
          WebkitOverflowScrolling: 'touch'
          /* no scroll-snap: snapping auto-scrolls past the gutter,
             pulling the first item left of the content edge. */
        }
      }, children);
    }
    function pillBtn(key, on, onClick, label, sub) {
      return h('button', {
        key: key, onClick: onClick,
        style: {
          flex: '0 0 auto', width: 62, padding: '12px 0', border: 0, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          borderRadius: 'var(--radius-md)',
          background: on ? 'var(--accent)' : 'var(--glass)',
          color: on ? 'var(--accent-ink)' : '#fff',
          boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)'
        }
      }, [
        sub != null ? h('span', { key: 's', style: { font: 'var(--text-caption)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' } }, sub) : null,
        h('span', { key: 'n', style: { fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 22, lineHeight: 1, fontVariantNumeric: 'tabular-nums' } }, label)
      ]);
    }

    var bodyChildren = [h(Hint, { key: 'hint' }, 'Paso ' + (step + 1) + ' \u00B7 ' + STEPS[step])];

    if (step === 0) {
      bodyChildren.push(h(Question, { key: 'q' }, '¿A qué vas a jugar?'));
      bodyChildren.push(h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
        data.SPORTS.slice(1).map(function (s) {
          var on = form.sport === s.label;
          return h('button', {
            key: s.key, onClick: function () { setForm(function (f) { return Object.assign({}, f, { sport: s.label, sportKey: s.key }); }); },
            style: {
              display: 'flex', alignItems: 'center', gap: 12, padding: '18px 16px', border: 0, cursor: 'pointer',
              borderRadius: 'var(--radius-md)', textAlign: 'left',
              background: on ? 'var(--accent)' : 'var(--glass)', color: on ? 'var(--accent-ink)' : '#fff',
              boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em'
            }
          }, [sportGlyph(s.label, 22) || h(Icon, { key: 'i', name: s.icon, size: 22 }), s.label]);
        })
      ));
    } else if (step === 1) {
      bodyChildren.push(h(Question, { key: 'q' }, '¿Dónde se juega?'));
      bodyChildren.push(h(Input, {
        key: 'in', variant: 'search', icon: 'map-pin', placeholder: 'Buscá una cancha o dirección',
        value: form.place, onChange: function (e) { set('place', e.target.value); }
      }));
      bodyChildren.push(h('div', { key: 'chips', style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 } },
        ['River Courts', 'Club Víbora', 'The Cage', 'Parque Sur'].map(function (pl) {
          return h(FilterChip, { key: pl, icon: 'navigation', selected: form.place === pl, onClick: function () { set('place', pl); } }, pl);
        })
      ));
    } else if (step === 2) {
      bodyChildren.push(h(Question, { key: 'q' }, '¿A qué hora arranca?'));
      // Day
      bodyChildren.push(h(FieldLabel, { key: 'dl' }, 'Día'));
      bodyChildren.push(h('div', { key: 'dr' },
        pickerRow(DAYS.map(function (d) {
          return pillBtn('d' + d.key, form.dayKey === d.key,
            function () { setForm(function (f) { return Object.assign({}, f, { dayKey: d.key, day: d.label }); }); },
            String(d.dayNum), d.key === 0 ? 'Hoy' : d.weekday);
        }), form.dayKey)
      ));
      // Hour
      bodyChildren.push(h(FieldLabel, { key: 'hl' }, ['Hora \u00B7 ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, pad2(form.hour))]));
      bodyChildren.push(h('div', { key: 'hr' },
        pickerRow(HOURS.map(function (H) {
          return pillBtn('h' + H, form.hour === H, function () { setTime(H, form.minute); }, pad2(H), 'h');
        }), HOURS.indexOf(form.hour))
      ));
      // Minute
      bodyChildren.push(h(FieldLabel, { key: 'ml' }, ['Minutos \u00B7 ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, pad2(form.minute))]));
      bodyChildren.push(h('div', { key: 'mr' },
        pickerRow(MINUTES.map(function (M) {
          return pillBtn('m' + M, form.minute === M, function () { setTime(form.hour, M); }, pad2(M), 'min');
        }), MINUTES.indexOf(form.minute))
      ));
    } else if (step === 3) {
      bodyChildren.push(h(Question, { key: 'q' }, '¿Cuántos jugadores?'));
      bodyChildren.push(h('div', {
        key: 'count',
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)', marginBottom: 22 }
      }, [
        h('span', { key: 'l', style: { color: 'var(--ink-64)', fontSize: 16, fontWeight: 600 } }, 'Jugadores totales'),
        h('div', { key: 'ctrl', style: { display: 'flex', alignItems: 'center', gap: 18 } }, [
          h(IconButton, { key: 'minus', icon: MinusGlyph, variant: 'glass', size: 'sm', 'aria-label': 'Menos jugadores', onClick: function () { set('players', Math.max(2, form.players - 1)); } }),
          h('span', { key: 'n', style: { fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 30, minWidth: 44, textAlign: 'center', color: '#fff', fontVariantNumeric: 'tabular-nums' } }, form.players),
          h(IconButton, { key: 'plus', icon: PlusGlyph, variant: 'solid', size: 'sm', 'aria-label': 'Más jugadores', onClick: function () { set('players', Math.min(22, form.players + 1)); } })
        ])
      ]));
      bodyChildren.push(h(FieldLabel, { key: 'll', children: 'Nivel' }));
      bodyChildren.push(h(SegmentedControl, {
        key: 'seg', fullWidth: true, value: form.level, onChange: function (v) { set('level', v); },
        options: [{ value: 'casual', label: 'Casual' }, { value: 'intermediate', label: 'Intermedio' }, { value: 'advanced', label: 'Avanzado' }]
      }));
      bodyChildren.push(h('div', { key: 'titlewrap', style: { marginTop: 24 } }, [
        h(FieldLabel, { key: 'tl' }, 'Título'),
        h('input', {
          key: 'ti', value: form.title, onChange: function (e) { set('title', e.target.value); },
          placeholder: 'Ej. Picado de los jueves', autoComplete: 'off',
          style: {
            width: '100%', boxSizing: 'border-box', height: 52, border: 0, outline: 'none',
            borderRadius: 'var(--radius-sm)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)',
            color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 500,
            letterSpacing: '-0.01em', padding: '0 16px'
          }
        })
      ]));
      bodyChildren.push(h('div', { key: 'descwrap', style: { marginTop: 24 } }, [
        h(FieldLabel, { key: 'dl' }, 'Descripción'),
        h('textarea', {
          key: 'ta', value: form.description, onChange: function (e) { set('description', e.target.value); },
          placeholder: 'Agregá una nota \u2014 qué llevar, cómo se arman los equipos, dónde encontrarse\u2026', rows: 4,
          style: {
            width: '100%', boxSizing: 'border-box', resize: 'none', border: 0, outline: 'none',
            borderRadius: 'var(--radius-sm)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)',
            color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 500, lineHeight: 1.45,
            letterSpacing: '-0.01em', padding: '14px 16px', minHeight: 112
          }
        })
      ]));
    } else if (step === 4) {
      bodyChildren.push(h(Question, { key: 'q' }, '¿Listo para publicar?'));
      bodyChildren.push(h('div', { key: 'card', style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative' } }, [
        h('img', { key: 'img', src: window.SM_IMG.bySport(form.sportKey || 'football'), alt: '', style: { width: '100%', height: 180, objectFit: 'cover' } }),
        h('div', { key: 'grad', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)' } }),
        h('div', { key: 'cap', style: { position: 'absolute', left: 16, right: 16, bottom: 14 } }, [
          h(Badge, { key: 'b', tone: 'solid' }, form.sport),
          h('div', { key: 't', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#fff', marginTop: 8, letterSpacing: '-0.02em' } }, form.title.trim() || (form.sport + ' \u00B7 ' + esLevel(form.level)))
        ])
      ]));
      bodyChildren.push(h('div', { key: 'sum', style: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 } }, [
        h(Summary, { key: 's1', icon: 'map-pin', label: 'Lugar', value: form.place || 'River Courts' }),
        h(Summary, { key: 's2', icon: 'calendar', label: 'Cuándo', value: form.day + ' \u00B7 ' + form.time }),
        h(Summary, { key: 's3', icon: 'users', label: 'Jugadores', value: form.players + ' \u00B7 ' + esLevel(form.level) }),
        h('div', { key: 'host', style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
          h(Avatar, { key: 'av', name: 'Alex Moreno', ring: 'accent' }),
          h('div', { key: 'tx' }, [
            h('div', { key: 'a', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Anfitrión'),
            h('div', { key: 'b', style: { color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' } }, 'Vos \u00B7 Alex Moreno')
          ])
        ])
      ]));
    }

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', zIndex: 80 } }, [
      // progress + close
      h('div', { key: 'top', style: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 3, display: 'flex', alignItems: 'center', gap: 14 } }, [
        h(IconButton, { key: 'back', icon: step === 0 ? 'x' : 'chevron-left', variant: 'glass', size: 'sm', 'aria-label': 'Atrás', onClick: back }),
        h('div', { key: 'bar', style: { flex: 1, height: 5, borderRadius: 99, background: 'var(--ink-16)', overflow: 'hidden' } },
          h('div', { style: { width: ((step + 1) / STEPS.length) * 100 + '%', height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 320ms cubic-bezier(0.16,1,0.3,1)' } })),
        h('span', { key: 'c', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', fontVariantNumeric: 'tabular-nums' } }, (step + 1) + '/' + STEPS.length)
      ]),
      // body
      h('div', { key: 'body', style: { position: 'absolute', top: 120, left: 0, right: 0, bottom: 120, overflowY: 'auto', padding: '20px 24px' } }, bodyChildren),
      // footer CTA
      h('div', { key: 'foot', style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px 24px calc(20px + var(--safe-bottom))', background: 'linear-gradient(to top, var(--bg-base) 60%, rgba(0,0,0,0))', zIndex: 5 } },
        h(Button, { fullWidth: true, size: 'lg', variant: 'primary', iconRight: last ? 'check' : 'arrow-right', onClick: next }, last ? 'Publicar partido' : 'Continuar'))
    ]);
  }

  function Summary(props) {
    var Icon = (window.SportMatchDesignSystem_7eff40 || {}).Icon;
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
      h(Icon, { key: 'i', name: props.icon, size: 20, color: 'var(--accent)' }),
      h('span', { key: 'l', style: { flex: 1, color: 'var(--ink-46)', font: 'var(--text-caption)' } }, props.label),
      h('span', { key: 'v', style: { color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 } }, props.value)
    ]);
  }

  /* =====================================================================
     MapScreen — identical to the bundle, but the recenter control uses a
     symmetric crosshair glyph so it sits dead-center in its circle.
     ===================================================================== */
  var COORDS = {
    m1: [41.3851, 2.1734], m2: [41.3954, 2.1620], m3: [41.3779, 2.1899],
    m4: [41.4036, 2.1744], m5: [41.3699, 2.1540], m6: [41.3925, 2.1957], m7: [41.3812, 2.1620]
  };
  /* Pill + tail read as ONE shape: both parts share the same solid fill and the
     hairline is drawn as a 1px outline around their merged silhouette with
     stacked drop-shadows (a per-part border would show the seam). Solid fill
     instead of backdrop blur — `filter` and `backdrop-filter` can't co-exist
     on the same element without the blur being clipped per-part. */
  function pinHtml(sport, accent) {
    var fill = 'rgba(18,20,26,0.94)';
    var hairline = 'rgba(255,255,255,0.16)';
    var ring = ['0 1px 0', '0 -1px 0', '1px 0 0', '-1px 0 0']
      .map(function (o) { return 'drop-shadow(' + o + ' ' + hairline + ')'; }).join(' ');
    return '' +
      '<div style="position:relative;display:flex;flex-direction:column;align-items:center;' +
        'transform:translateY(-6px);filter:' + ring + ' drop-shadow(0 8px 18px rgba(0,0,0,0.55))">' +
        '<div style="display:flex;align-items:center;gap:6px;height:38px;padding:0 13px;border-radius:99px;' +
          'background:' + fill + ';color:#fff;font:700 13px/1 var(--font-text,system-ui);letter-spacing:-0.01em;' +
          'white-space:nowrap">' +
          '<span style="width:8px;height:8px;border-radius:50%;background:' + accent + ';box-shadow:0 0 8px ' + accent + '"></span>' + sport +
        '</div>' +
        '<div style="width:16px;height:9px;margin-top:-1px;background:' + fill + ';' +
          '-webkit-clip-path:polygon(0 0,100% 0,50% 100%);clip-path:polygon(0 0,100% 0,50% 100%)"></div>' +
      '</div>';
  }

  function MapScreen(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var FilterChip = DS.FilterChip, Input = DS.Input, IconButton = DS.IconButton, BottomSheet = DS.BottomSheet, Button = DS.Button;
    var data = props.data, onOpen = props.onOpen;
    var fst = React.useState(false); var filters = fst[0], setFilters = fst[1];
    var mapRef = React.useRef(null);
    var elRef = React.useRef(null);

    React.useEffect(function () {
      if (!window.L || !elRef.current || mapRef.current) return;
      var accents = { 'Fútbol': '#4EA8FF', 'Básquet': '#FF9F4E', 'Tenis': '#66D575', 'Pádel': '#C77DFF' };
      var map = window.L.map(elRef.current, { center: [41.388, 2.173], zoom: 14, zoomControl: false, attributionControl: false, fadeAnimation: false });
      mapRef.current = map;
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
      data.MATCHES.forEach(function (m) {
        var c = COORDS[m.id]; if (!c) return;
        var icon = window.L.divIcon({ html: pinHtml(m.sport, accents[m.sport] || '#4EA8FF'), className: '', iconSize: [0, 0], iconAnchor: [0, 0] });
        window.L.marker(c, { icon: icon }).addTo(map).on('click', function () { onOpen(m); });
      });
      var here = window.L.divIcon({ html: '<div style="width:18px;height:18px;border-radius:50%;background:#4EA8FF;box-shadow:0 0 0 4px rgba(78,168,255,0.3),0 0 0 2px #fff"></div>', className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
      window.L.marker([41.388, 2.173], { icon: here }).addTo(map);
      setTimeout(function () { map.invalidateSize(); }, 60);
      return function () { map.remove(); mapRef.current = null; };
    }, []);

    function recenter() { if (mapRef.current) mapRef.current.flyTo([41.388, 2.173], 14, { duration: 0.6 }); }

    var cst = React.useState({ 'Cerca': true }); var chips = cst[0], setChips = cst[1];
    var toggleChip = function (k) { setChips(function (c) { var n = Object.assign({}, c); n[k] = !n[k]; return n; }); };
    var sps = React.useState({}); var sportSel = sps[0], setSportSel = sps[1];
    var toggleSport = function (k) { setSportSel(function (c) { var n = Object.assign({}, c); n[k] = !n[k]; return n; }); };
    var lvs = React.useState('Casual'); var level = lvs[0], setLevel = lvs[1];

    return h('div', { style: { position: 'absolute', inset: 0, background: '#0a0d12' } }, [
      h('div', { key: 'map', ref: elRef, style: { position: 'absolute', inset: 0, zIndex: 0, background: '#0a0d12' } }),
      h('div', { key: 'vig', style: { position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(5,6,10,0.55) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 72%, rgba(5,6,10,0.5) 100%)' } }),
      h('div', { key: 'top', style: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 12 } }, [
        h('div', { key: 'srow', style: { display: 'flex', gap: 12, alignItems: 'center' } }, [
          h('div', { key: 's', style: { flex: 1, minWidth: 0 } }, h(Input, { variant: 'search', icon: 'search', placeholder: 'Buscá en esta zona' })),
          // 48px to match the search field exactly.
          h(IconButton, { key: 'f', icon: 'sliders', variant: 'glass', 'aria-label': 'Filtros', style: { width: 48, height: 48, flex: 'none' }, onClick: function () { setFilters(true); } })
        ]),
        h('div', { key: 'chips', style: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 } },
          [['Cerca', 'navigation'], ['Hoy', 'calendar'], ['Esta noche', 'clock'], ['Mañana', 'calendar'], ['Fin de semana', 'calendar'], ['Lugares libres', null], ['Principiante', null], ['Intermedio', null], ['Avanzado', null]].map(function (it) {
            return h(FilterChip, { key: it[0], selected: !!chips[it[0]], icon: it[1] || undefined, onClick: function () { toggleChip(it[0]); } }, it[0]);
          })
        )
      ]),
      h('div', { key: 'rc', style: { position: 'absolute', right: 20, bottom: 140, zIndex: 20 } },
        h(IconButton, { icon: LocateGlyph, variant: 'glass', 'aria-label': 'Centrar', onClick: recenter })),
      h(BottomSheet, {
        key: 'sheet', open: filters, onClose: function () { setFilters(false); }, title: 'Filtros',
        headerRight: h(IconButton, { icon: 'x', variant: 'plain', size: 'sm', 'aria-label': 'Cerrar', onClick: function () { setFilters(false); } })
      }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 4 } }, [
        h('div', { key: 'sport' }, [
          h('div', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 } }, 'Deporte'),
          h('div', { key: 'c', style: { display: 'flex', gap: 10, flexWrap: 'wrap' } }, data.SPORTS.slice(1).map(function (s) { return h(FilterChip, { key: s.key, icon: s.icon, selected: !!sportSel[s.key], onClick: function () { toggleSport(s.key); } }, s.label); }))
        ]),
        h('div', { key: 'level' }, [
          h('div', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 } }, 'Nivel'),
          h('div', { key: 'c', style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
            ['Casual', 'Intermedio', 'Avanzado'].map(function (lv) { return h(FilterChip, { key: lv, selected: level === lv, onClick: function () { setLevel(lv); } }, lv); }))
        ]),
        h(Button, { key: 'cta', fullWidth: true, onClick: function () { setFilters(false); } }, 'Ver 24 partidos')
      ]))
    ]);
  }

  /* =====================================================================
     MatchDetail — payments removed (no price badge, no price block) and
     the Follow action removed (no friend system).
     ===================================================================== */
  function MetaTile(props) {
    var Icon = (window.SportMatchDesignSystem_7eff40 || {}).Icon;
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, padding: 14, borderRadius: 'var(--radius-sm)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
      h(Icon, { key: 'i', name: props.icon, size: 18, color: 'var(--accent)' }),
      h('span', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, props.label),
      h('span', { key: 'v', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff' } }, props.value)
    ]);
  }

  function MatchDetail(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var Badge = DS.Badge, Button = DS.Button, IconButton = DS.IconButton, Avatar = DS.Avatar, AvatarStack = DS.AvatarStack, Rating = DS.Rating, Icon = DS.Icon;
    var m = props.match, onClose = props.onClose, onJoin = props.onJoin, onCancel = props.onCancel, joined = props.joined;
    var sv = React.useState(false); var saved = sv[0], setSaved = sv[1];
    // Two-step cancel so a stray tap never drops your spot.
    var cf = React.useState(false); var confirming = cf[0], setConfirming = cf[1];
    React.useEffect(function () {
      if (!confirming) return;
      var t = setTimeout(function () { setConfirming(false); }, 4000);
      return function () { clearTimeout(t); };
    }, [confirming]);
    React.useEffect(function () { if (!joined) setConfirming(false); }, [joined]);

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', zIndex: 70 } }, [
      h(window.SMScreen, { key: 'scr' }, [
        // Hero
        h('div', { key: 'hero', style: { position: 'relative', height: 460 } }, [
          h('img', { key: 'img', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
          h('div', { key: 'grad', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-base) 1%, rgba(0,0,0,0) 38%), linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 22%)' } }),
          h('div', { key: 'topctl', style: { position: 'absolute', top: 60, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 2 } }, [
            h(IconButton, { key: 'back', icon: 'chevron-left', variant: 'glass', 'aria-label': 'Atrás', onClick: onClose }),
            h('div', { key: 'r', style: { display: 'flex', gap: 10 } }, [
              h(IconButton, { key: 'share', icon: 'share', variant: 'glass', 'aria-label': 'Compartir' })
            ])
          ]),
          h('div', { key: 'badges', style: { position: 'absolute', left: 20, right: 20, bottom: 22, zIndex: 2, display: 'flex', gap: 8 } }, [
            h(Badge, { key: 's', tone: 'solid', size: 'lg' }, m.sport),
            h(Badge, { key: 'l', tone: 'glass', size: 'lg', icon: 'signal' }, m.level)
          ])
        ]),
        // Body
        h('div', { key: 'body', style: { padding: '6px 20px 200px', display: 'flex', flexDirection: 'column', gap: 22 } }, [
          h('div', { key: 'titleblock' }, [
            h('div', { key: 'row', style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 } }, [
              h('h1', { key: 't', style: { font: 'var(--text-display)', fontSize: 34, letterSpacing: 'var(--tracking-title)', color: '#fff' } }, m.title),
              h(Rating, { key: 'rt', value: m.rating, count: m.ratingCount })
            ]),
            h('div', { key: 'loc', style: { marginTop: 8, color: 'var(--ink-64)', fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 } }, [
              h(Icon, { key: 'i', name: 'map-pin', size: 16 }), m.location + ' \u00B7 ' + m.distance
            ])
          ]),
          // Organizer (Follow removed)
          h('div', { key: 'org', style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
            h(Avatar, { key: 'av', name: m.organizer, size: 'lg', ring: 'accent' }),
            h('div', { key: 'tx', style: { flex: 1 } }, [
              h('div', { key: 'a', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Organiza'),
              h('div', { key: 'b', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff' } }, m.organizer)
            ])
          ]),
          // Meta grid
          h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } }, [
            h(MetaTile, { key: '1', icon: 'calendar', label: 'Fecha', value: m.date }),
            h(MetaTile, { key: '2', icon: 'clock', label: 'Arranca', value: m.time }),
            h(MetaTile, { key: '3', icon: 'users', label: 'Jugadores', value: (m.total - m.spots) + '/' + m.total }),
            h(MetaTile, { key: '4', icon: 'signal', label: 'Nivel', value: m.level })
          ]),
          // Participants
          h('div', { key: 'who' }, [
            h('div', { key: 'head', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } }, [
              h('h3', { key: 'h', style: { font: 'var(--text-headline)', color: '#fff' } }, 'Quién juega'),
              h(Badge, { key: 'b', tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots + ' lugares libres')
            ]),
            h(AvatarStack, { key: 'stack', avatars: m.players.map(function (p, i) { return { name: p, src: window.SM_IMG.url(window.SM_IMG.gallery[i % window.SM_IMG.gallery.length]) }; }), size: 'lg', max: 6 })
          ]),
          h('p', { key: 'desc', style: { font: 'var(--text-body)', color: 'var(--ink-64)', textWrap: 'pretty' } }, 'Partido tranquilo y bien organizado \u2014 traé remera clara y oscura. Rotamos equipos cada 15 minutos para que jueguen todos. Llegá 10 minutos antes para entrar en calor.')
        ])
      ]),
      // Sticky CTA \u2014 join, or (once in) a confirmed line + two-step cancel.
      h('div', { key: 'cta', style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 20px calc(20px + var(--safe-bottom))', background: 'linear-gradient(to top, var(--bg-base) 55%, rgba(0,0,0,0))', zIndex: 5 } },
        joined
          ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, [
              h('div', { key: 'in', style: { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRadius: '999px', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
                h('span', { key: 'ic', style: { width: 24, height: 24, borderRadius: '999px', background: 'var(--success)', color: '#05210a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, h(Icon, { name: 'check', size: 15 })),
                h('span', { key: 'tx', style: { fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 700, color: '#fff' } }, 'Estás dentro'),
                h('span', { key: 'sb', style: { marginLeft: 'auto', font: 'var(--text-caption)', color: 'var(--ink-46)' } }, m.date + ' \u00B7 ' + m.time)
              ]),
              confirming
                ? h('div', { key: 'cfm', style: { display: 'flex', gap: 10 } }, [
                    h('button', { key: 'keep', onClick: function () { setConfirming(false); }, style: { flex: 1, height: 48, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--glass-strong)', color: '#fff', boxShadow: 'var(--ring-glass)', fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 600 } }, 'Me quedo'),
                    h('button', { key: 'yes', onClick: function () { setConfirming(false); onCancel && onCancel(); }, style: { flex: 1, height: 48, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7 } }, [h(Icon, { key: 'i', name: 'x', size: 17 }), 'Sí, cancelar'])
                  ])
                : h('button', { key: 'cxl', onClick: function () { setConfirming(true); }, style: { width: '100%', height: 48, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 700 } }, 'Cancelar mi lugar')
            ])
          : h(Button, { fullWidth: true, variant: 'primary', iconRight: 'arrow-right', onClick: onJoin }, 'Unirme al partido'))
    ]);
  }

  /* =====================================================================
     SwipeDeck — "Swipe" title + counter removed; the card stack rises to
     fill that space.
     ===================================================================== */
  function SwipeDeck(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var SwipeCard = esSwipeCard(DS.SwipeCard), EmptyState = DS.EmptyState, Button = DS.Button;
    var data = props.data, onLike = props.onLike;
    var THRESHOLD = 110;
    var is = React.useState(0); var index = is[0], setIndex = is[1];
    var dgs = React.useState({ x: 0, y: 0, active: false }); var drag = dgs[0], setDrag = dgs[1];
    var fls = React.useState(null); var flyout = fls[0], setFlyout = fls[1];
    var start = React.useRef(null);
    var deck = data.MATCHES;
    var current = deck[index];
    var decision = flyout || (Math.abs(drag.x) > 40 ? (drag.x > 0 ? 'yes' : 'no') : null);

    function onDown(e) { if (flyout) return; start.current = { x: e.clientX, y: e.clientY }; setDrag({ x: 0, y: 0, active: true }); if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); }
    function onMove(e) { if (!start.current) return; setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true }); }
    function onUp() { if (!start.current) return; start.current = null; if (Math.abs(drag.x) > THRESHOLD) { commit(drag.x > 0 ? 'yes' : 'no'); } else { setDrag({ x: 0, y: 0, active: false }); } }
    function commit(dir) { setFlyout(dir); setDrag(function (d) { return Object.assign({}, d, { active: false }); }); if (dir === 'yes' && onLike) onLike(current); setTimeout(function () { setFlyout(null); setDrag({ x: 0, y: 0, active: false }); setIndex(function (i) { return i + 1; }); }, 300); }

    if (!current) {
      return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        h(EmptyState, { icon: 'check', title: 'Viste todo por hoy', text: 'Ya viste todos los partidos cerca. Volvé más tarde o ampliá el radio de búsqueda.', action: h(Button, { iconLeft: 'compass', onClick: function () { setIndex(0); } }, 'Empezar de nuevo') }));
    }
    var pal = current.palette || { avg: '#3a463a', vibrant: '#d52019' };
    var dx = flyout ? (flyout === 'yes' ? 600 : -600) : drag.x;
    var dy = flyout ? -40 : drag.y;
    var rot = dx / 22;
    var topTransform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + rot + 'deg)';
    var topTransition = drag.active ? 'none' : 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)';

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', overflow: 'hidden' } }, [
      h('style', { key: 'kf' }, '@keyframes smAmbient{from{opacity:0}to{opacity:1}}'),
      // Background sampled from the current card's photo \u2014 changes per card.
      h('div', { key: 'amb-' + current.id, 'aria-hidden': true, style: { position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', animation: 'smAmbient 700ms ease both' } }, [
        h('img', { key: 'img', src: current.photoUrl, alt: '', style: { position: 'absolute', inset: '-12%', width: '124%', height: '124%', objectFit: 'cover', filter: 'blur(46px) saturate(1.35) brightness(0.6)', transform: 'scale(1.08)' } }),
        h('div', { key: 'tint', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.80) 100%)' } })
      ]),
      h('div', { key: 'stack', style: { position: 'absolute', top: 70, left: 16, right: 16, bottom: 120, zIndex: 1 } },
        [2, 1, 0].map(function (depth) {
          var mm = deck[index + depth]; if (!mm) return null;
          var isTop = depth === 0;
          var behind = { transform: 'scale(' + (1 - depth * 0.05) + ') translateY(' + (depth * 14) + 'px)', transition: 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)', filter: depth ? 'brightness(0.7)' : 'none' };
          return h(SwipeCard, {
            key: mm.id + '-' + (index + depth),
            photo: mm.photoUrl, sport: mm.sport, title: mm.title,
            subtitle: mm.location.split(' \u00B7 ')[0] + ' \u00B7 ' + mm.distance,
            date: mm.date, time: mm.time,
            spots: mm.spots, level: mm.level, rating: mm.rating, ratingCount: mm.ratingCount,
            decision: isTop ? decision : null,
            onPointerDown: isTop ? onDown : undefined,
            onPointerMove: isTop ? onMove : undefined,
            onPointerUp: isTop ? onUp : undefined,
            onPointerCancel: isTop ? onUp : undefined,
            style: isTop ? { transform: topTransform, transition: topTransition, cursor: 'grab', touchAction: 'none', zIndex: 10 } : Object.assign({}, behind, { zIndex: 10 - depth })
          });
        }))
    ]);
  }

  /* =====================================================================
     Matches — split into matches you HOST (with accept/decline of pending
     join requests) and matches you've JOINED.
     ===================================================================== */
  var HOSTED_IDS = ['m6', 'm7'];
  var INIT_REQUESTS = {
    m6: ['Inès Faye', 'Noah Klein', 'Liam Walsh'],
    m7: ['Rosa Lima', 'Diego Sanz']
  };

  function Matches(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var Badge = DS.Badge, Icon = DS.Icon, Avatar = DS.Avatar, Button = DS.Button, EmptyState = DS.EmptyState;
    var data = props.data, joined = props.joined, onOpen = props.onOpen, onTab = props.onTab, onCancel = props.onCancel;

    var cs = React.useState(null); var confirmId = cs[0], setConfirmId = cs[1];
    var hc = React.useState(null); var hostConfirm = hc[0], setHostConfirm = hc[1];
    var kd = React.useState({}); var killed = kd[0], setKilled = kd[1];

    var hosted = data.MATCHES.filter(function (m) { return HOSTED_IDS.indexOf(m.id) >= 0 && !killed[m.id]; });
    var invited = data.MATCHES.filter(function (m) { return joined && joined[m.id] && HOSTED_IDS.indexOf(m.id) < 0; });

    var rs = React.useState(function () {
      var o = {}; Object.keys(INIT_REQUESTS).forEach(function (k) {
        o[k] = INIT_REQUESTS[k].map(function (name, i) { return { name: name, status: 'pending', src: photoFor(i + 2) }; });
      }); return o;
    });
    var reqs = rs[0], setReqs = rs[1];
    function setStatus(mid, idx, status) {
      setReqs(function (c) { var n = Object.assign({}, c); n[mid] = n[mid].map(function (r, i) { return i === idx ? Object.assign({}, r, { status: status }) : r; }); return n; });
    }

    var roundBtn = function (bg, color, shadow) {
      return { width: 40, height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: bg, color: color, boxShadow: shadow, flex: 'none' };
    };

    function sectionLabel(title, sub) {
      return h('div', { style: { marginBottom: 4 } }, [
        h('h2', { key: 't', style: { font: 'var(--text-title)', letterSpacing: 'var(--tracking-title)', color: '#fff' } }, title),
        h('div', { key: 's', style: { color: 'var(--ink-46)', fontSize: 14, marginTop: 2 } }, sub)
      ]);
    }

    function media(m, tone, label, icon, onClick) {
      return h('div', { key: 'media', onClick: onClick, style: { position: 'relative', height: 132, cursor: onClick ? 'pointer' : 'default' } }, [
        h('img', { key: 'img', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { key: 'grad', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.05) 55%)' } }),
        h('div', { key: 'badges', style: { position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 } }, [
          h(Badge, { key: 's', tone: 'solid' }, m.sport),
          h(Badge, { key: 'c', tone: tone, icon: icon }, label)
        ]),
        h('div', { key: 'title', style: { position: 'absolute', left: 14, right: 14, bottom: 12 } },
          h('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.title))
      ]);
    }

    function footer(m) {
      return h('div', { key: 'foot', style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' } }, [
        h('span', { key: 'd', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-80)', fontSize: 14, fontWeight: 600 } }, [h(Icon, { key: 'i', name: 'calendar', size: 15, color: 'var(--accent)' }), m.date + ' \u00B7 ' + m.time]),
        h('span', { key: 'l', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-64)', fontSize: 14, fontWeight: 500, minWidth: 0 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 15 }), h('span', { key: 't', style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.location.split(' \u00B7 ')[0])])
      ]);
    }

    // A joined match — simple clickable ticket.
    function invitedTicket(m) {
      var confirming = confirmId === m.id;
      return h('div', { key: m.id, style: { position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)', color: '#fff' } }, [
        media(m, 'success', 'Confirmado', 'check', function () { onOpen(m); }),
        h('div', { key: 'f', onClick: function () { onOpen(m); }, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' } }, [
          h('span', { key: 'd', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-80)', fontSize: 14, fontWeight: 600 } }, [h(Icon, { key: 'i', name: 'calendar', size: 15, color: 'var(--accent)' }), m.date + ' \u00B7 ' + m.time]),
          h('span', { key: 'l', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-64)', fontSize: 14, fontWeight: 500, minWidth: 0 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 15 }), h('span', { key: 't', style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.location.split(' \u00B7 ')[0])]),
          h('span', { key: 'det', style: { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 14, fontWeight: 600, flex: 'none' } }, ['Ver más', h(Icon, { key: 'i', name: 'chevron-right', size: 16 })])
        ]),
        h('div', { key: 'cxl', style: { borderTop: '1px solid var(--glass-border)', padding: '10px 12px' } },
          confirming
            ? h('div', { style: { display: 'flex', gap: 8 } }, [
                h('button', { key: 'keep', onClick: function () { setConfirmId(null); }, style: { flex: 1, height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--glass-strong)', color: '#fff', boxShadow: 'var(--ring-glass)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 600 } }, 'Me quedo'),
                h('button', { key: 'yes', onClick: function () { setConfirmId(null); onCancel && onCancel(m); }, style: { flex: 1, height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'x', size: 16 }), 'Sí, cancelar'])
              ])
            : h('button', { onClick: function () { setConfirmId(m.id); }, style: { width: '100%', height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700 } }, 'Cancelar mi lugar'))
      ]);
    }

    // A hosted match — ticket + pending join requests with accept/decline.
    function hostingCard(m) {
      var list = reqs[m.id] || [];
      var pending = list.filter(function (r) { return r.status === 'pending'; }).length;
      var accepted = list.filter(function (r) { return r.status === 'accepted'; }).length;
      return h('div', { key: m.id, style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        media(m, 'accent', 'Organizás', 'user', function () { onOpen(m); }),
        footer(m),
        h('div', { key: 'reqs', style: { borderTop: '1px solid var(--glass-border)', padding: '14px 16px 16px' } }, [
          h('div', { key: 'rh', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } }, [
            h('span', { key: 'a', style: { font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-46)' } }, 'Solicitudes'),
            h(Badge, { key: 'b', tone: pending ? 'accent' : 'success', dot: true }, pending ? pending + ' pendientes' : 'Todo listo')
          ]),
          h('div', { key: 'cf', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginBottom: 10 } }, (m.total - m.spots + accepted) + '/' + m.total + ' jugadores confirmados'),
          h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column' } }, list.map(function (r, idx) {
            return h('div', { key: idx, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', opacity: r.status === 'declined' ? 0.45 : 1 } }, [
              h(Avatar, { key: 'av', name: r.name, src: r.src, size: 'md' }),
              h('div', { key: 'n', style: { flex: 1, minWidth: 0 } }, [
                h('div', { key: 'nm', style: { fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.name),
                h('div', { key: 'sb', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, r.status === 'accepted' ? 'En el equipo' : r.status === 'declined' ? 'Rechazado' : 'quiere sumarse')
              ]),
              r.status === 'pending'
                ? h('div', { key: 'act', style: { display: 'flex', gap: 8, flex: 'none' } }, [
                    h('button', { key: 'dec', 'aria-label': 'Rechazar a ' + r.name, onClick: function () { setStatus(m.id, idx, 'declined'); }, style: roundBtn('var(--glass-strong)', '#fff', 'var(--ring-glass)') }, h(Icon, { name: 'x', size: 18 })),
                    h('button', { key: 'acc', 'aria-label': 'Aceptar a ' + r.name, onClick: function () { setStatus(m.id, idx, 'accepted'); }, style: roundBtn('var(--accent)', 'var(--accent-ink)', 'var(--shadow-glow)') }, h(Icon, { name: 'check', size: 18 }))
                  ])
                : h('span', { key: 'st', style: { flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: r.status === 'accepted' ? 'var(--success)' : 'var(--ink-46)' } }, [h(Icon, { key: 'i', name: r.status === 'accepted' ? 'check' : 'x', size: 15 }), r.status === 'accepted' ? 'Aceptado' : 'Rechazado'])
            ]);
          }))
        ]),
        h('div', { key: 'cxl', style: { borderTop: '1px solid var(--glass-border)', padding: '10px 12px 12px' } },
          hostConfirm === m.id
            ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, [
                h('div', { key: 'w', style: { font: 'var(--text-caption)', color: 'var(--ink-64)', padding: '2px 4px' } }, 'Se cancela para todos los jugadores. No se puede deshacer.'),
                h('div', { key: 'b', style: { display: 'flex', gap: 8 } }, [
                  h('button', { key: 'keep', onClick: function () { setHostConfirm(null); }, style: { flex: 1, height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--glass-strong)', color: '#fff', boxShadow: 'var(--ring-glass)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 600 } }, 'Volver'),
                  h('button', { key: 'yes', onClick: function () { setHostConfirm(null); setKilled(function (k) { var n = Object.assign({}, k); n[m.id] = true; return n; }); props.onCancelHosted && props.onCancelHosted(m); }, style: { flex: 1, height: 40, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'x', size: 16 }), 'Sí, cancelar'])
                ])
              ])
            : h('button', { onClick: function () { setHostConfirm(m.id); }, style: { width: '100%', height: 40, border: 0, background: 'transparent', boxShadow: 'none', cursor: 'pointer', color: 'var(--danger)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7 } }, [h(Icon, { key: 'i', name: 'x', size: 16 }), 'Cancelar partido']))
      ]);
    }

    var children = [
      h('div', { key: 'head', style: { padding: '64px 20px 8px' } }, [
        h('h1', { key: 'h', style: { font: 'var(--text-display)', letterSpacing: 'var(--tracking-title)', color: '#fff' } }, 'Tus partidos'),
        h('div', { key: 's', style: { color: 'var(--ink-46)', fontSize: 15, marginTop: 4 } }, hosted.length + ' organizando \u00B7 ' + invited.length + ' anotado')
      ])
    ];
    if (hosted.length) {
      children.push(h('div', { key: 'hsec', style: { padding: '14px 20px 0' } }, [
        sectionLabel('Organizás', 'Aprobá quién se suma a los partidos que creaste'),
        h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 } }, hosted.map(hostingCard))
      ]));
    }
    children.push(h('div', { key: 'isec', style: { padding: '26px 20px 150px' } }, [
      sectionLabel('Estás dentro', 'Partidos a los que te sumaste'),
      invited.length
        ? h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 } }, invited.map(invitedTicket))
        : h('div', { key: 'e', style: { marginTop: 12 } }, h(EmptyState, { icon: 'layers', title: 'Todavía no hay partidos', text: 'Desliz\u00e1 a la derecha en los partidos que te gusten. Cuando te acepten, aparecen ac\u00e1.', action: h(Button, { iconLeft: 'layers', onClick: function () { onTab && onTab('swipe'); } }, 'Empezar a deslizar') }))
    ]));

    return h(window.SMScreen, { style: { background: 'var(--bg-base)' } }, children);
  }

  /* ---------- glyphs lifted verbatim from Lucide / Lucide Lab (ISC) ----------
     Same 24px grid, 2px stroke and round caps/joins as the shipped icon set,
     so they sit consistently beside it. */
  function lucideGlyph(inner, size) {
    return h('svg', {
      width: size || 18, height: size || 18, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round',
      strokeLinejoin: 'round', style: { display: 'block', flex: 'none' },
      dangerouslySetInnerHTML: { __html: inner }
    });
  }
  // lucide/mail, lucide/lock, lucide/user, lucide/eye, lucide/eye-off
  var LUCIDE = {
    mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    'eye-off': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'
  };
  var MailGlyph = function (s) { return lucideGlyph(LUCIDE.mail, s); };
  var LockGlyph = function (s) { return lucideGlyph(LUCIDE.lock, s); };
  var UserGlyph = function (s) { return lucideGlyph(LUCIDE.user, s); };
  var EyeGlyph = function (s) { return lucideGlyph(LUCIDE.eye, s); };
  var EyeOffGlyph = function (s) { return lucideGlyph(LUCIDE['eye-off'], s); };
  var PinGlyph = function (s) { return lucideGlyph(LUCIDE['map-pin'], s); };
  function GoogleMark(size) {
    var s = size || 18;
    return h('svg', { width: s, height: s, viewBox: '0 0 48 48', style: { display: 'block', flex: 'none' } }, [
      h('path', { key: 'b', fill: '#4285F4', d: 'M45.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12c-.2 2-1.5 5-4.4 7l6.7 5.2c4-3.7 6.8-9.1 6.8-15.9z' }),
      h('path', { key: 'g', fill: '#34A853', d: 'M24 46c6 0 11.1-2 14.8-5.4l-6.7-5.2c-1.9 1.3-4.5 2.2-8.1 2.2-5.9 0-10.9-3.9-12.7-9.2l-7 5.4C7.9 41 15.4 46 24 46z' }),
      h('path', { key: 'y', fill: '#FBBC05', d: 'M11.3 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7-5.4A22 22 0 0 0 2 24c0 3.5.9 6.9 2.3 9.8l7-5.4z' }),
      h('path', { key: 'r', fill: '#EA4335', d: 'M24 10.4c4.2 0 7 1.8 8.6 3.3l6.2-6C35 4.2 30 2 24 2 15.4 2 7.9 7 4.3 14.2l7 5.4C13.1 14.3 18.1 10.4 24 10.4z' })
    ]);
  }

  /* =====================================================================
     Auth — sign in / create account. Field set and copy follow the supplied
     spec; the visual language is the app's own dark glass over photography.
     ===================================================================== */
  function AuthField(props) {
    var showState = React.useState(false); var shown = showState[0], setShown = showState[1];
    var isPw = props.type === 'password';
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } }, [
      h('div', { key: 'f', style: { display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 16px', borderRadius: '999px', background: 'var(--glass)', boxShadow: props.invalid ? '0 0 0 1px var(--danger)' : 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        h('span', { key: 'i', style: { color: 'var(--ink-46)', flex: 'none' } }, props.glyph),
        h('input', {
          key: 'in', type: isPw && !shown ? 'password' : 'text', value: props.value, onChange: props.onChange,
          placeholder: props.placeholder, autoComplete: 'off', 'aria-label': props.placeholder,
          onKeyDown: function (e) { if (e.key === 'Enter' && props.onEnter) props.onEnter(); },
          style: { flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 500 }
        }),
        isPw ? h('button', { key: 'e', type: 'button', 'aria-label': shown ? 'Ocultar contraseña' : 'Mostrar contraseña', onClick: function () { setShown(!shown); }, style: { border: 0, background: 'transparent', padding: 4, cursor: 'pointer', color: shown ? 'var(--accent)' : 'var(--ink-46)', display: 'inline-flex', flex: 'none' } }, shown ? EyeOffGlyph(19) : EyeGlyph(19)) : null
      ]),
      props.error ? h('span', { key: 'er', style: { font: 'var(--text-caption)', color: 'var(--danger)', paddingLeft: 18 } }, props.error) : null
    ]);
  }

  function AuthScreen(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var Button = DS.Button;
    var ms = React.useState(props.initialMode === 'register' ? 'register' : 'login'); var mode = ms[0], setMode = ms[1];
    var fs = React.useState({ name: '', email: '', password: '', confirm: '' });
    var form = fs[0], setForm = fs[1];
    var ts = React.useState(false); var tried = ts[0], setTried = ts[1];
    function set(k, v) { setForm(function (f) { var n = Object.assign({}, f); n[k] = v; return n; }); }
    function go(next) { setMode(next); setTried(false); setForm({ name: '', email: '', password: '', confirm: '' }); }

    var isReg = mode === 'register';
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    var pwOk = form.password.length >= 8;
    var nameOk = !isReg || !!form.name.trim();
    var confirmOk = !isReg || (form.confirm === form.password && !!form.confirm);
    var valid = emailOk && pwOk && nameOk && confirmOk;

    function submit() {
      setTried(true);
      if (!valid) return;
      props.onAuth({ name: isReg ? form.name.trim() : null, email: form.email.trim() });
    }

    var fields = [];
    if (isReg) {
      fields.push(h(AuthField, { key: 'n', glyph: UserGlyph(19), placeholder: 'Nombre completo', value: form.name, onChange: function (e) { set('name', e.target.value); }, invalid: tried && !nameOk, error: tried && !nameOk ? 'Ingresá tu nombre' : null, onEnter: submit }));
    }
    fields.push(h(AuthField, { key: 'e', glyph: MailGlyph(19), placeholder: 'Email', value: form.email, onChange: function (e) { set('email', e.target.value); }, invalid: tried && !emailOk, error: tried && !emailOk ? 'Ingresá un email válido' : null, onEnter: submit }));
    fields.push(h(AuthField, { key: 'p', type: 'password', glyph: LockGlyph(19), placeholder: 'Contraseña', value: form.password, onChange: function (e) { set('password', e.target.value); }, invalid: tried && !pwOk, error: tried && !pwOk ? 'Mínimo 8 caracteres' : null, onEnter: submit }));
    if (isReg) {
      fields.push(h(AuthField, { key: 'c', type: 'password', glyph: LockGlyph(19), placeholder: 'Repetir contraseña', value: form.confirm, onChange: function (e) { set('confirm', e.target.value); }, invalid: tried && !confirmOk, error: tried && !confirmOk ? 'Las contraseñas no coinciden' : null, onEnter: submit }));
    }

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', overflow: 'hidden', display: 'flex', flexDirection: 'column' } }, [
      // Photographic hero with the wordmark — register borrows ~40px more from
      // the photo so its CTA + Google buttons land at the same height as login's.
      h('div', { key: 'hero', style: { position: 'relative', flex: 'none', height: isReg ? 225 : 330, transition: 'height 360ms cubic-bezier(0.16,1,0.3,1)' } }, [
        h('img', { key: 'img', src: window.SM_IMG.url('football-sunset'), alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { key: 'tint', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,6,10,0.45) 0%, rgba(5,6,10,0.62) 55%, rgba(5,6,10,0.92) 100%)' } }),
        h('div', { key: 'wm', style: { position: 'absolute', left: 0, right: 0, bottom: 54, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 24px' } }, [
          h('div', { key: 'l', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.035em', color: '#fff', lineHeight: 1 } }, ['Sport', h('span', { key: 'm', style: { color: 'var(--accent)' } }, 'Match')]),
          h('div', { key: 's', style: { fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 500, color: 'var(--ink-80)' } }, 'Encontrá tu próximo partido')
        ])
      ]),
      // Glass sheet with the form
      h('div', { key: 'sheet', style: { flex: 1, minHeight: 0, marginTop: -34, borderRadius: '36px 36px 0 0', background: 'var(--glass-solid, rgba(12,14,18,0.86))', boxShadow: 'var(--ring-glass), var(--inset-top-sheen), 0 -18px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(var(--blur-lg))', WebkitBackdropFilter: 'blur(var(--blur-lg))', overflowY: 'auto', padding: '28px 24px calc(28px + var(--safe-bottom))', display: 'flex', flexDirection: 'column', gap: 18 } }, [
        h('div', { key: 'ttl' }, [
          h('h1', { key: 'h', style: { font: 'var(--text-display)', letterSpacing: 'var(--tracking-title)', color: '#fff' } }, isReg ? 'Creá tu cuenta' : 'Bienvenido'),
          h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 15, color: 'var(--ink-64)', marginTop: 6, textWrap: 'pretty' } }, isReg ? 'Sumate y empezá a jugar con gente cerca tuyo' : 'Iniciá sesión para encontrar tu próximo partido')
        ]),
        h('div', { key: 'fl', style: { display: 'flex', flexDirection: 'column', gap: 12 } }, fields),
        !isReg ? h('button', { key: 'fp', onClick: function () {}, style: { alignSelf: 'flex-end', border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--accent)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 600, padding: 0, marginTop: -4 } }, '¿Olvidaste tu contraseña?') : null,
        h(Button, { key: 'cta', fullWidth: true, variant: 'primary', size: 'lg', style: { height: 54, flex: 'none' }, onClick: submit }, isReg ? 'Crear cuenta' : 'Iniciar sesión'),
        h('div', { key: 'div', style: { display: 'flex', alignItems: 'center', gap: 14, padding: '2px 0' } }, [
          h('span', { key: 'a', style: { flex: 1, height: 1, background: 'var(--glass-border)' } }),
          h('span', { key: 'l', style: { font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: '0.12em', color: 'var(--ink-46)', whiteSpace: 'nowrap' } }, isReg ? 'O REGISTRATE CON' : 'O CONTINUÁ CON'),
          h('span', { key: 'b', style: { flex: 1, height: 1, background: 'var(--glass-border)' } })
        ]),
        h('button', { key: 'g', onClick: function () { props.onAuth({ name: null, email: 'alex.moreno@gmail.com', google: true }); }, style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', height: 54, flex: 'none', boxSizing: 'border-box', borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600 } }, [GoogleMark(19), 'Google']),
        h('div', { key: 'sw', style: { textAlign: 'center', paddingTop: 2, fontFamily: 'var(--font-text)', fontSize: 14, color: 'var(--ink-64)' } }, [
          isReg ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? ',
          h('button', { key: 'b', onClick: function () { go(isReg ? 'login' : 'register'); }, style: { border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--accent)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700 } }, isReg ? 'Iniciá sesión' : 'Registrate')
        ])
      ])
    ]);
  }

  /* =====================================================================
     Profile — same layout as the bundle, but Settings › Edit profile opens a
     real editor (photo, name, email, password).
     ===================================================================== */
  function StatCard(props) {
    var Icon = (window.SportMatchDesignSystem_7eff40 || {}).Icon;
    return h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 8px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
      h(Icon, { key: 'i', name: props.icon, size: 17, color: props.accent || 'var(--accent)', filled: props.icon === 'star' || props.icon === 'flame' }),
      h('span', { key: 'v', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: '#fff' } }, props.value),
      h('span', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textAlign: 'center' } }, props.label)
    ]);
  }

  function SettingsRow(props) {
    var Icon = (window.SportMatchDesignSystem_7eff40 || {}).Icon;
    var danger = props.danger;
    return h('button', { onClick: props.onClick, style: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', padding: '16px 18px', border: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)', color: danger ? 'var(--swipe-no)' : '#fff' } }, [
      h('span', { key: 'ic', style: { display: 'inline-flex', width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', background: 'var(--glass-strong)', color: danger ? 'var(--swipe-no)' : 'var(--accent)', flex: 'none' } }, h(Icon, { name: props.icon, size: 19 })),
      h('span', { key: 'tx', style: { flex: 1, minWidth: 0 } }, [
        h('span', { key: 'l', style: { display: 'block', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' } }, props.label),
        props.sub ? h('span', { key: 's', style: { display: 'block', font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: 2 } }, props.sub) : null
      ]),
      !danger ? h(Icon, { key: 'ch', name: 'chevron-right', size: 18, color: 'var(--ink-46)' }) : null
    ]);
  }

  // Mismo campo que login / registro (AuthField): pill de 56px con glifo.
  function EditField(props) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, [
      h('span', { key: 'l', style: { display: 'block', font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-46)' } }, props.label),
      props.sub ? h('span', { key: 'sb', style: { display: 'block', font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: -4 } }, props.sub) : null,
      h(AuthField, {
        key: 'f', type: props.type === 'password' ? 'password' : 'text', glyph: props.glyph,
        value: props.value, onChange: props.onChange, placeholder: props.placeholder || props.label,
        invalid: props.invalid, error: props.hint
      })
    ]);
  }

  function EditProfilePanel(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var IconButton = DS.IconButton, Button = DS.Button, Icon = DS.Icon;
    var p = props.profile, open = props.open;

    var fs = React.useState(null); var form = fs[0], setForm = fs[1];
    React.useEffect(function () {
      if (!open) return;
      setForm({ name: p.name || '', email: p.email || '', city: p.city || '', avatar: p.avatar, pwCurrent: '', pwNew: '', pwConfirm: '' });
    }, [open]);
    var fileRef = React.useRef(null);
    if (!form) return h('div', { style: { position: 'absolute', inset: 0, zIndex: 240, pointerEvents: 'none', transform: 'translateX(100%)' } });

    function set(k, v) { setForm(function (f) { var n = Object.assign({}, f); n[k] = v; return n; }); }

    var wantsPw = !!(form.pwCurrent || form.pwNew || form.pwConfirm);
    var pwTooShort = !!form.pwNew && form.pwNew.length < 8;
    var pwMismatch = !!form.pwConfirm && form.pwNew !== form.pwConfirm;
    var pwIncomplete = wantsPw && (!form.pwCurrent || !form.pwNew || !form.pwConfirm);
    var nameBad = !(form.name || '').trim();
    var emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((form.email || '').trim());
    var canSave = !nameBad && !emailBad && !pwTooShort && !pwMismatch && !pwIncomplete;

    function pickFile(e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { set('avatar', String(r.result)); };
      r.readAsDataURL(f);
    }

    return h('div', { style: { position: 'absolute', inset: 0, zIndex: 240, background: 'linear-gradient(180deg, rgba(12,14,18,0.90), rgba(5,6,10,0.96))', backdropFilter: 'blur(var(--blur-lg))', WebkitBackdropFilter: 'blur(var(--blur-lg))', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 360ms cubic-bezier(0.32,0.72,0,1)', display: 'flex', flexDirection: 'column' } }, [
      h('div', { key: 'hd', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 20px 14px', flex: 'none' } }, [
        h(IconButton, { key: 'b', icon: 'chevron-left', variant: 'glass', size: 'sm', 'aria-label': 'Volver a ajustes', onClick: props.onClose }),
        h('h1', { key: 't', style: { flex: 1, textAlign: 'center', font: 'var(--text-title)', color: '#fff' } }, 'Editar perfil'),
        h('span', { key: 'sp', style: { width: 36 } })
      ]),
      h('div', { key: 'bd', style: { flex: 1, overflowY: 'auto', padding: '6px 20px 24px', display: 'flex', flexDirection: 'column', gap: 22 } }, [
        // Photo
        h('div', { key: 'photo', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 } }, [
          h('div', { key: 'av', style: { position: 'relative' } }, [
            h('img', { key: 'i', src: form.avatar, alt: '', style: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 3px var(--bg-base), 0 0 0 6px var(--accent)' } }),
            h('button', { key: 'cam', 'aria-label': 'Cambiar foto', onClick: function () { fileRef.current && fileRef.current.click(); }, style: { position: 'absolute', right: -4, bottom: -4, width: 34, height: 34, borderRadius: '999px', border: 0, cursor: 'pointer', background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' } }, h(Icon, { name: 'image', size: 17 }))
          ]),
          h('input', { key: 'f', ref: fileRef, type: 'file', accept: 'image/*', onChange: pickFile, style: { display: 'none' } }),
          h('span', { key: 'hint', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Tocá para subir una foto nueva')
        ]),
        h(EditField, { key: 'nm', label: 'Nombre', glyph: UserGlyph(19), value: form.name, invalid: nameBad, hint: nameBad ? 'El nombre no puede estar vacío' : null, onChange: function (e) { set('name', e.target.value); } }),
        h(EditField, { key: 'hd2', label: 'Email', glyph: MailGlyph(19), value: form.email, invalid: emailBad, hint: emailBad ? 'Ingresá un email válido' : null, onChange: function (e) { set('email', e.target.value); } }),
        h(EditField, { key: 'ct', label: 'Ciudad', glyph: PinGlyph(19), value: form.city, onChange: function (e) { set('city', e.target.value); } }),
        h('div', { key: 'pw', style: { display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 } }, [
          h(EditField, { key: 'c', label: 'Contraseña actual', glyph: LockGlyph(19), sub: 'Dejalo vacío para mantener la actual', type: 'password', value: form.pwCurrent, placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', invalid: wantsPw && !form.pwCurrent, onChange: function (e) { set('pwCurrent', e.target.value); } }),
          h(EditField, { key: 'n', label: 'Contraseña nueva', glyph: LockGlyph(19), type: 'password', value: form.pwNew, placeholder: 'Mínimo 8 caracteres', invalid: pwTooShort, hint: pwTooShort ? 'Usá al menos 8 caracteres' : null, onChange: function (e) { set('pwNew', e.target.value); } }),
          h(EditField, { key: 'r', label: 'Repetir contraseña nueva', glyph: LockGlyph(19), type: 'password', value: form.pwConfirm, placeholder: 'Repetila', invalid: pwMismatch, hint: pwMismatch ? 'Las contraseñas no coinciden' : null, onChange: function (e) { set('pwConfirm', e.target.value); } })
        ])
      ]),
      h('div', { key: 'cta', style: { flex: 'none', padding: '14px 20px calc(20px + var(--safe-bottom))', background: 'linear-gradient(to top, rgba(5,6,10,0.96) 55%, rgba(0,0,0,0))' } },
        h(Button, { fullWidth: true, variant: 'primary', iconRight: 'check', disabled: !canSave, onClick: function () { props.onSave(form); } }, 'Guardar cambios'))
    ]);
  }

  function SettingsPanel(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var IconButton = DS.IconButton;
    var profile = props.profile, open = props.open;
    return h('div', { style: { position: 'absolute', inset: 0, zIndex: 200, background: 'linear-gradient(180deg, rgba(12,14,18,0.86), rgba(5,6,10,0.94))', backdropFilter: 'blur(var(--blur-lg))', WebkitBackdropFilter: 'blur(var(--blur-lg))', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 360ms cubic-bezier(0.32,0.72,0,1)', display: 'flex', flexDirection: 'column' } }, [
      h('div', { key: 'hd', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 20px 18px' } }, [
        h(IconButton, { key: 'b', icon: 'chevron-left', variant: 'glass', size: 'sm', 'aria-label': 'Atrás', onClick: props.onClose }),
        h('h1', { key: 't', style: { flex: 1, textAlign: 'center', font: 'var(--text-title)', color: '#fff' } }, 'Ajustes'),
        h('span', { key: 'sp', style: { width: 36 } })
      ]),
      h('div', { key: 'card', style: { display: 'flex', alignItems: 'center', gap: 14, margin: '0 20px 22px', padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        h('img', { key: 'a', src: profile.avatar, alt: profile.name, style: { width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--ring-glass)' } }),
        h('div', { key: 'n', style: { minWidth: 0 } }, [
          h('div', { key: 'nm', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' } }, profile.name),
          h('div', { key: 'hn', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, profile.email || '')
        ])
      ]),
      h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' } }, [
        h(SettingsRow, { key: 'e', icon: 'pencil', label: 'Editar perfil', sub: 'Foto, nombre, ciudad y contraseña', onClick: props.onEdit }),
        h(SettingsRow, { key: 's', icon: 'share', label: 'Compartir perfil', sub: 'Enviá tu link de SportMatch', onClick: props.onClose })
      ]),
      h('div', { key: 'out', style: { marginTop: 'auto', padding: '0 20px 40px' } },
        h(SettingsRow, { icon: 'log-out', label: 'Cerrar sesión', danger: true, onClick: props.onLogout }))
    ]);
  }

  function Profile(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var IconButton = DS.IconButton, Icon = DS.Icon;
    var data = props.data, onOpen = props.onOpen;
    var base = data.PROFILE;
    var history = data.MATCHES.slice(1, 5);
    var st = React.useState(props.forcePanel === 'settings' || props.forcePanel === 'edit'); var settings = st[0], setSettings = st[1];
    var et = React.useState(props.forcePanel === 'edit'); var editing = et[0], setEditing = et[1];
    // Local edits layer over the shared PROFILE record.
    var ov = React.useState({}); var edits = ov[0], setEdits = ov[1];
    var p = Object.assign({ email: 'alex.moreno@gmail.com' }, base, props.account || {}, edits);

    function save(form) {
      setEdits({ name: form.name.trim(), email: form.email.trim(), city: form.city, avatar: form.avatar });
      setEditing(false);
      setSettings(false);
      props.onSaved && props.onSaved(!!form.pwNew);
    }

    // Panels live OUTSIDE the scrolling screen body: as absolute children of
    // SMScreen they scrolled with the content, exposing the nav + sections below.
    var panelOpen = settings || editing;
    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)' } }, [
      h(window.SMScreen, { key: 'body', style: { background: 'var(--bg-base)', overflowY: panelOpen ? 'hidden' : 'auto' } }, [
      h('div', { key: 'hero', style: { position: 'relative', height: 196 } }, [
        h('img', { key: 'c', src: p.cover, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-base) 3%, rgba(0,0,0,0) 62%)' } }),
        h('div', { key: 's', style: { position: 'absolute', top: 60, right: 20, zIndex: 3 } },
          h(IconButton, { icon: 'settings', variant: 'glass', 'aria-label': 'Ajustes', onClick: function () { setSettings(true); } }))
      ]),
      h('div', { key: 'id', style: { position: 'relative', marginTop: -54, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '0 20px' } }, [
        h('img', { key: 'a', src: p.avatar, alt: p.name, style: { width: 104, height: 104, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 3px var(--bg-base), 0 0 0 6px var(--accent), var(--ring-glass)' } }),
        h('div', { key: 'n', style: { textAlign: 'center' } }, [
          h('h1', { key: 'nm', style: { font: 'var(--text-title)', color: '#fff' } }, p.name),
          h('div', { key: 'ct', style: { color: 'var(--ink-46)', fontSize: 15, marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 6 } }, [
            h(Icon, { key: 'i', name: 'map-pin', size: 14 }), p.city
          ])
        ])
      ]),
      h('div', { key: 'stats', style: { display: 'flex', gap: 12, padding: '24px 20px 0' } }, [
        h(StatCard, { key: 'r', value: p.rating, label: 'Puntaje', icon: 'star', accent: '#FFC857' }),
        h(StatCard, { key: 'm', value: p.matches, label: 'Partidos', icon: 'trophy' }),
        h(StatCard, { key: 's', value: p.streak, label: 'Semanas', icon: 'flame', accent: 'var(--warning)' })
      ]),
      h('div', { key: 'hist', style: { padding: '28px 20px 150px' } }, [
        h('div', { key: 'h', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } }, [
          h('h2', { key: 't', style: { font: 'var(--text-title)', color: '#fff' } }, 'Partidos recientes')
        ]),
        h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 12 } },
          history.map(function (m) { return h(window.MatchRow, { key: m.id, match: m, onOpen: onOpen }); }))
      ])
      ]),
      h(SettingsPanel, { key: 'set', open: settings, profile: p, onClose: function () { setSettings(false); }, onEdit: function () { setEditing(true); }, onLogout: props.onLogout }),
      h(EditProfilePanel, { key: 'edit', open: editing, profile: p, onClose: function () { setEditing(false); }, onSave: save })
    ]);
  }

  /* =====================================================================
     MatchRow — same row as the bundle, but the photo bleeds to the card's
     left/top/bottom edges instead of floating inside the padding.
     ===================================================================== */
  function MatchRow(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var Badge = DS.Badge, Rating = DS.Rating, Icon = DS.Icon;
    var m = props.match, onOpen = props.onOpen;
    return h('button', {
      onClick: function () { onOpen(m); },
      style: {
        display: 'flex', alignItems: 'stretch', gap: 14, padding: 0, width: '100%', height: 100,
        textAlign: 'left', cursor: 'pointer', border: 0, overflow: 'hidden',
        borderRadius: 'var(--radius-md)', background: 'var(--glass)', color: '#fff',
        boxShadow: 'var(--ring-glass)', backdropFilter: 'blur(var(--blur-md))',
        WebkitBackdropFilter: 'blur(var(--blur-md))'
      }
    }, [
      h('img', { key: 'img', src: m.photoUrl, alt: '', style: { width: 96, height: '100%', objectFit: 'cover', flex: 'none', display: 'block' } }),
      h('div', { key: 'body', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '12px 0' } }, [
        h('div', { key: 'top', style: { display: 'flex', alignItems: 'center', gap: 8 } }, [
          h('span', { key: 's', style: { font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-46)' } }, m.sport),
          h(Rating, { key: 'r', value: m.rating, size: 13 })
        ]),
        h('div', { key: 'ttl', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.title),
        h('div', { key: 'meta', style: { display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-64)', fontSize: 13, fontWeight: 500 } }, [
          h('span', { key: 't', style: { display: 'inline-flex', alignItems: 'center', gap: 5 } }, [h(Icon, { key: 'i', name: 'clock', size: 14 }), m.time]),
          h('span', { key: 'd', style: { display: 'inline-flex', alignItems: 'center', gap: 5 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 14 }), m.distance])
        ])
      ]),
      h('div', { key: 'sp', style: { flex: 'none', display: 'flex', alignItems: 'center', paddingRight: 14 } },
        h(Badge, { tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots))
    ]);
  }

  /* ---------- capa en español ----------
     El bundle del DS trae copy y datos mock en inglés; el producto es en
     español. Los datos se traducen in situ y los dos componentes del DS con
     texto embebido se re-renderizan a través de un mapa de strings. */
  var LEVEL_ES = { Casual: 'Casual', Intermediate: 'Intermedio', Advanced: 'Avanzado', Open: 'Abierto', Beginner: 'Principiante', casual: 'Casual', intermediate: 'Intermedio', advanced: 'Avanzado' };
  function esLevel(v) { return LEVEL_ES[v] || v; }
  var ES = {
    SPORT: { Football: 'Fútbol', Basketball: 'Básquet', Tennis: 'Tenis', Padel: 'Pádel', Running: 'Running', All: 'Todos' },
    DATE: { Today: 'Hoy', Tomorrow: 'Mañana', Mon: 'Lun', Tue: 'Mar', Wed: 'Mié', Thu: 'Jue', Fri: 'Vie', Sat: 'Sáb', Sun: 'Dom' },
    TITLE: {
      'Sunset 7-a-side': 'Fútbol 7',
      'Streetball run': 'Picado de streetball',
      'Clay court rally': 'Peloteo en polvo de ladrillo',
      'Rooftop hoops': 'Básquet en la terraza',
      'Night doubles': 'Dobles nocturnos',
      'Golden hour kickabout': 'Picado a la hora dorada',
      'Half-court 3v3': '3 vs 3 en media cancha'
    },
    PLACE: {
      'River Courts \u00B7 Pitch 2': 'River Courts \u00B7 Cancha 2',
      'The Cage \u00B7 Riverside': 'The Cage \u00B7 Costanera',
      'Club V\u00edbora \u00B7 Court 5': 'Club V\u00edbora \u00B7 Cancha 5',
      'Skyline Court': 'Cancha Skyline',
      'Indoor Center \u00B7 Court 1': 'Indoor Center \u00B7 Cancha 1',
      'Parque Sur \u00B7 Field A': 'Parque Sur \u00B7 Cancha A',
      'Central Playground': 'Play\u00f3n Central'
    }
  };
  function translateData() {
    var d = window.SM_DATA; if (!d || d.__es) return;
    d.MATCHES.forEach(function (m) {
      m.sport = ES.SPORT[m.sport] || m.sport;
      m.date = ES.DATE[m.date] || m.date;
      m.title = ES.TITLE[m.title] || m.title;
      m.location = ES.PLACE[m.location] || m.location;
      m.level = esLevel(m.level);
    });
    d.SPORTS.forEach(function (s) { s.label = ES.SPORT[s.label] || s.label; });
    d.__es = true;
  }
  // El SwipeCard del DS trae "Interested" / "Skip" / "spots" embebidos: se
  // re-renderiza su árbol pasando los strings por un mapa, sin forkear el DS.
  var CARD_ES = { Interested: 'Me interesa', Skip: 'Paso', ' spots': ' lugares', ' spots left': ' lugares libres', Today: 'Hoy', Tmrw: 'Mañana' };
  function mapStrings(node) {
    if (typeof node === 'string') return CARD_ES[node] || node;
    if (Array.isArray(node)) return node.map(mapStrings);
    if (node && node.props && node.type) {
      var kids = node.props.children;
      if (kids === undefined) return node;
      return React.cloneElement(node, undefined, mapStrings(kids));
    }
    return node;
  }
  function esSwipeCard(Card) {
    if (!Card) return Card;
    if (Card.__esWrapped) return Card.__esWrapped;
    var render = Card.render || Card;
    var Wrapped = React.forwardRef(function (props, ref) { return mapStrings(render(props, ref)); });
    Card.__esWrapped = Wrapped;
    return Wrapped;
  }

  /* ---------- apply once the bundle namespace is fully populated ---------- */
  function apply() {
    var ns = window.SportMatchDesignSystem_7eff40;
    if (!ns || !ns.BottomNav || !ns.Input) { return setTimeout(apply, 30); }
    translateData();
    applySportIcons();
    window.MatchRow = MatchRow;
    window.AuthScreen = AuthScreen;
    window.CreateMatch = CreateMatch;
    window.MapScreen = MapScreen;
    window.MatchDetail = MatchDetail;
    window.SwipeDeck = SwipeDeck;
    window.Matches = Matches;
    window.Profile = Profile;
    // Dedicated namespace the bundle never assigns — immune to load-order races.
    window.SM_OVR = { CreateMatch: CreateMatch, MapScreen: MapScreen, MatchDetail: MatchDetail, SwipeDeck: SwipeDeck, Matches: Matches, Profile: Profile, AuthScreen: AuthScreen };
    window.__smOverridesReady = true;
    try { window.dispatchEvent(new Event('sm-overrides-ready')); } catch (e) {}
  }
  apply();
})();
