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

  /* =====================================================================
     CreateMatch
     ===================================================================== */
  function buildDays() {
    var out = [], now = new Date();
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < 14; i++) {
      var d = new Date(now); d.setDate(now.getDate() + i);
      var label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : wd[d.getDay()] + ' ' + d.getDate();
      out.push({ key: i, weekday: wd[d.getDay()], dayNum: d.getDate(), label: label });
    }
    return out;
  }
  var DAYS = buildDays();
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var HOURS = []; for (var hh = 6; hh <= 23; hh++) HOURS.push(hh);
  var MINUTES = []; for (var mm = 0; mm < 60; mm += 5) MINUTES.push(mm);
  var STEPS = ['Sport', 'Place', 'Time', 'Players', 'Review'];

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

    var st = React.useState(0); var step = st[0], setStep = st[1];
    var fs = React.useState({ sport: 'Football', place: '', day: 'Today', dayKey: 0, hour: 19, minute: 30, time: '19:30', players: 12, level: 'casual', description: '' });
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

    var bodyChildren = [h(Hint, { key: 'hint' }, 'Step ' + (step + 1) + ' \u00B7 ' + STEPS[step])];

    if (step === 0) {
      bodyChildren.push(h(Question, { key: 'q' }, 'What are you playing?'));
      bodyChildren.push(h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
        data.SPORTS.slice(1).map(function (s) {
          var on = form.sport === s.label;
          return h('button', {
            key: s.key, onClick: function () { set('sport', s.label); },
            style: {
              display: 'flex', alignItems: 'center', gap: 12, padding: '18px 16px', border: 0, cursor: 'pointer',
              borderRadius: 'var(--radius-md)', textAlign: 'left',
              background: on ? 'var(--accent)' : 'var(--glass)', color: on ? 'var(--accent-ink)' : '#fff',
              boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em'
            }
          }, [h(Icon, { key: 'i', name: s.icon, size: 22 }), s.label]);
        })
      ));
    } else if (step === 1) {
      bodyChildren.push(h(Question, { key: 'q' }, "Where's the match?"));
      bodyChildren.push(h(Input, {
        key: 'in', variant: 'search', icon: 'map-pin', placeholder: 'Search venue or address',
        value: form.place, onChange: function (e) { set('place', e.target.value); }
      }));
      bodyChildren.push(h('div', { key: 'chips', style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 } },
        ['River Courts', 'Club Víbora', 'The Cage', 'Parque Sur'].map(function (pl) {
          return h(FilterChip, { key: pl, icon: 'navigation', selected: form.place === pl, onClick: function () { set('place', pl); } }, pl);
        })
      ));
    } else if (step === 2) {
      bodyChildren.push(h(Question, { key: 'q' }, "When's kick-off?"));
      // Day
      bodyChildren.push(h(FieldLabel, { key: 'dl' }, 'Day'));
      bodyChildren.push(h('div', { key: 'dr' },
        pickerRow(DAYS.map(function (d) {
          return pillBtn('d' + d.key, form.dayKey === d.key,
            function () { setForm(function (f) { return Object.assign({}, f, { dayKey: d.key, day: d.label }); }); },
            String(d.dayNum), d.key === 0 ? 'Now' : d.weekday);
        }), form.dayKey)
      ));
      // Hour
      bodyChildren.push(h(FieldLabel, { key: 'hl' }, ['Hour \u00B7 ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, pad2(form.hour))]));
      bodyChildren.push(h('div', { key: 'hr' },
        pickerRow(HOURS.map(function (H) {
          return pillBtn('h' + H, form.hour === H, function () { setTime(H, form.minute); }, pad2(H), 'hr');
        }), HOURS.indexOf(form.hour))
      ));
      // Minute
      bodyChildren.push(h(FieldLabel, { key: 'ml' }, ['Minute \u00B7 ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, pad2(form.minute))]));
      bodyChildren.push(h('div', { key: 'mr' },
        pickerRow(MINUTES.map(function (M) {
          return pillBtn('m' + M, form.minute === M, function () { setTime(form.hour, M); }, pad2(M), 'min');
        }), MINUTES.indexOf(form.minute))
      ));
    } else if (step === 3) {
      bodyChildren.push(h(Question, { key: 'q' }, 'How big is the game?'));
      bodyChildren.push(h('div', {
        key: 'count',
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)', marginBottom: 22 }
      }, [
        h('span', { key: 'l', style: { color: 'var(--ink-64)', fontSize: 16, fontWeight: 600 } }, 'Total players'),
        h('div', { key: 'ctrl', style: { display: 'flex', alignItems: 'center', gap: 18 } }, [
          h(IconButton, { key: 'minus', icon: MinusGlyph, variant: 'glass', size: 'sm', 'aria-label': 'Fewer players', onClick: function () { set('players', Math.max(2, form.players - 1)); } }),
          h('span', { key: 'n', style: { fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 30, minWidth: 44, textAlign: 'center', color: '#fff', fontVariantNumeric: 'tabular-nums' } }, form.players),
          h(IconButton, { key: 'plus', icon: PlusGlyph, variant: 'solid', size: 'sm', 'aria-label': 'More players', onClick: function () { set('players', Math.min(22, form.players + 1)); } })
        ])
      ]));
      bodyChildren.push(h(FieldLabel, { key: 'll', children: 'Level' }));
      bodyChildren.push(h(SegmentedControl, {
        key: 'seg', fullWidth: true, value: form.level, onChange: function (v) { set('level', v); },
        options: [{ value: 'casual', label: 'Casual' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }]
      }));
      bodyChildren.push(h('div', { key: 'descwrap', style: { marginTop: 24 } }, [
        h(FieldLabel, { key: 'dl' }, 'Description'),
        h('textarea', {
          key: 'ta', value: form.description, onChange: function (e) { set('description', e.target.value); },
          placeholder: 'Add a note \u2014 what to bring, how teams work, where to meet\u2026', rows: 4,
          style: {
            width: '100%', boxSizing: 'border-box', resize: 'none', border: 0, outline: 'none',
            borderRadius: 'var(--radius-sm)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)',
            color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 500, lineHeight: 1.45,
            letterSpacing: '-0.01em', padding: '14px 16px', minHeight: 112
          }
        })
      ]));
    } else if (step === 4) {
      bodyChildren.push(h(Question, { key: 'q' }, 'Ready to publish?'));
      bodyChildren.push(h('div', { key: 'card', style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative' } }, [
        h('img', { key: 'img', src: window.SM_IMG.bySport(form.sport.toLowerCase()), alt: '', style: { width: '100%', height: 180, objectFit: 'cover' } }),
        h('div', { key: 'grad', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)' } }),
        h('div', { key: 'cap', style: { position: 'absolute', left: 16, right: 16, bottom: 14 } }, [
          h(Badge, { key: 'b', tone: 'solid' }, form.sport),
          h('div', { key: 't', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#fff', marginTop: 8, letterSpacing: '-0.02em' } }, form.sport + ' \u00B7 ' + form.level)
        ])
      ]));
      bodyChildren.push(h('div', { key: 'sum', style: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 } }, [
        h(Summary, { key: 's1', icon: 'map-pin', label: 'Place', value: form.place || 'River Courts' }),
        h(Summary, { key: 's2', icon: 'calendar', label: 'When', value: form.day + ' \u00B7 ' + form.time }),
        h(Summary, { key: 's3', icon: 'users', label: 'Players', value: form.players + ' \u00B7 ' + form.level }),
        h('div', { key: 'host', style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
          h(Avatar, { key: 'av', name: 'Alex Moreno', ring: 'accent' }),
          h('div', { key: 'tx' }, [
            h('div', { key: 'a', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Host'),
            h('div', { key: 'b', style: { color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' } }, 'You \u00B7 Alex Moreno')
          ])
        ])
      ]));
    }

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', zIndex: 80 } }, [
      // progress + close
      h('div', { key: 'top', style: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 3, display: 'flex', alignItems: 'center', gap: 14 } }, [
        h(IconButton, { key: 'back', icon: step === 0 ? 'x' : 'chevron-left', variant: 'glass', size: 'sm', 'aria-label': 'Back', onClick: back }),
        h('div', { key: 'bar', style: { flex: 1, height: 5, borderRadius: 99, background: 'var(--ink-16)', overflow: 'hidden' } },
          h('div', { style: { width: ((step + 1) / STEPS.length) * 100 + '%', height: '100%', background: 'var(--accent)', borderRadius: 99, transition: 'width 320ms cubic-bezier(0.16,1,0.3,1)' } })),
        h('span', { key: 'c', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', fontVariantNumeric: 'tabular-nums' } }, (step + 1) + '/' + STEPS.length)
      ]),
      // body
      h('div', { key: 'body', style: { position: 'absolute', top: 120, left: 0, right: 0, bottom: 120, overflowY: 'auto', padding: '20px 24px' } }, bodyChildren),
      // footer CTA
      h('div', { key: 'foot', style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px 24px calc(20px + var(--safe-bottom))', background: 'linear-gradient(to top, var(--bg-base) 60%, rgba(0,0,0,0))', zIndex: 5 } },
        h(Button, { fullWidth: true, size: 'lg', variant: 'primary', iconRight: last ? 'check' : 'arrow-right', onClick: next }, last ? 'Publish match' : 'Continue'))
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
  function pinHtml(sport, accent) {
    return '' +
      '<div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translateY(-6px)">' +
        '<div style="display:flex;align-items:center;gap:6px;height:38px;padding:0 12px;border-radius:99px;' +
          'background:rgba(20,22,28,0.72);color:#fff;font:700 13px/1 var(--font-text,system-ui);letter-spacing:-0.01em;' +
          'box-shadow:0 0 0 1px rgba(255,255,255,0.14), 0 8px 22px rgba(0,0,0,0.5);' +
          'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);white-space:nowrap">' +
          '<span style="width:8px;height:8px;border-radius:50%;background:' + accent + ';box-shadow:0 0 8px ' + accent + '"></span>' + sport +
        '</div>' +
        '<div style="width:2px;height:10px;background:rgba(255,255,255,0.4)"></div>' +
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
      var accents = { Football: '#4EA8FF', Basketball: '#FF9F4E', Tennis: '#66D575', Padel: '#C77DFF' };
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

    var cst = React.useState({ Nearby: true }); var chips = cst[0], setChips = cst[1];
    var toggleChip = function (k) { setChips(function (c) { var n = Object.assign({}, c); n[k] = !n[k]; return n; }); };
    var sps = React.useState({}); var sportSel = sps[0], setSportSel = sps[1];
    var toggleSport = function (k) { setSportSel(function (c) { var n = Object.assign({}, c); n[k] = !n[k]; return n; }); };
    var lvs = React.useState('Casual'); var level = lvs[0], setLevel = lvs[1];

    return h('div', { style: { position: 'absolute', inset: 0, background: '#0a0d12' } }, [
      h('div', { key: 'map', ref: elRef, style: { position: 'absolute', inset: 0, zIndex: 0, background: '#0a0d12' } }),
      h('div', { key: 'vig', style: { position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(5,6,10,0.55) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 72%, rgba(5,6,10,0.5) 100%)' } }),
      h('div', { key: 'top', style: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 12 } }, [
        h('div', { key: 'srow', style: { display: 'flex', gap: 12 } }, [
          h('div', { key: 's', style: { flex: 1 } }, h(Input, { variant: 'search', icon: 'search', placeholder: 'Search this area' })),
          h(IconButton, { key: 'f', icon: 'sliders', variant: 'glass', 'aria-label': 'Filters', onClick: function () { setFilters(true); } })
        ]),
        h('div', { key: 'chips', style: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 } },
          [['Nearby', 'navigation'], ['Today', 'calendar'], ['Tonight', 'clock'], ['Tomorrow', 'calendar'], ['Weekend', 'calendar'], ['Open spots', null], ['Beginner', null], ['Intermediate', null], ['Advanced', null]].map(function (it) {
            return h(FilterChip, { key: it[0], selected: !!chips[it[0]], icon: it[1] || undefined, onClick: function () { toggleChip(it[0]); } }, it[0]);
          })
        )
      ]),
      h('div', { key: 'rc', style: { position: 'absolute', right: 20, bottom: 140, zIndex: 20 } },
        h(IconButton, { icon: LocateGlyph, variant: 'glass', 'aria-label': 'Recenter', onClick: recenter })),
      h(BottomSheet, {
        key: 'sheet', open: filters, onClose: function () { setFilters(false); }, title: 'Filters',
        headerRight: h(IconButton, { icon: 'x', variant: 'plain', size: 'sm', 'aria-label': 'Close', onClick: function () { setFilters(false); } })
      }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 4 } }, [
        h('div', { key: 'sport' }, [
          h('div', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 } }, 'Sport'),
          h('div', { key: 'c', style: { display: 'flex', gap: 10, flexWrap: 'wrap' } }, data.SPORTS.slice(1).map(function (s) { return h(FilterChip, { key: s.key, icon: s.icon, selected: !!sportSel[s.key], onClick: function () { toggleSport(s.key); } }, s.label); }))
        ]),
        h('div', { key: 'level' }, [
          h('div', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 } }, 'Level'),
          h('div', { key: 'c', style: { display: 'flex', gap: 10, flexWrap: 'wrap' } },
            ['Casual', 'Intermediate', 'Advanced'].map(function (lv) { return h(FilterChip, { key: lv, selected: level === lv, onClick: function () { setLevel(lv); } }, lv); }))
        ]),
        h(Button, { key: 'cta', fullWidth: true, onClick: function () { setFilters(false); } }, 'Show 24 matches')
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
    var m = props.match, onClose = props.onClose, onJoin = props.onJoin, joined = props.joined;
    var sv = React.useState(false); var saved = sv[0], setSaved = sv[1];

    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', zIndex: 70 } }, [
      h(window.SMScreen, { key: 'scr' }, [
        // Hero
        h('div', { key: 'hero', style: { position: 'relative', height: 460 } }, [
          h('img', { key: 'img', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
          h('div', { key: 'grad', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-base) 1%, rgba(0,0,0,0) 38%), linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 22%)' } }),
          h('div', { key: 'topctl', style: { position: 'absolute', top: 60, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', zIndex: 2 } }, [
            h(IconButton, { key: 'back', icon: 'chevron-left', variant: 'glass', 'aria-label': 'Back', onClick: onClose }),
            h('div', { key: 'r', style: { display: 'flex', gap: 10 } }, [
              h(IconButton, { key: 'share', icon: 'share', variant: 'glass', 'aria-label': 'Share' })
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
              h('div', { key: 'a', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Organised by'),
              h('div', { key: 'b', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff' } }, m.organizer)
            ])
          ]),
          // Meta grid
          h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } }, [
            h(MetaTile, { key: '1', icon: 'calendar', label: 'Date', value: m.date }),
            h(MetaTile, { key: '2', icon: 'clock', label: 'Kick-off', value: m.time }),
            h(MetaTile, { key: '3', icon: 'users', label: 'Players', value: (m.total - m.spots) + '/' + m.total }),
            h(MetaTile, { key: '4', icon: 'signal', label: 'Level', value: m.level })
          ]),
          // Participants
          h('div', { key: 'who' }, [
            h('div', { key: 'head', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } }, [
              h('h3', { key: 'h', style: { font: 'var(--text-headline)', color: '#fff' } }, "Who's in"),
              h(Badge, { key: 'b', tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots + ' spots left')
            ]),
            h(AvatarStack, { key: 'stack', avatars: m.players.map(function (p, i) { return { name: p, src: window.SM_IMG.url(window.SM_IMG.gallery[i % window.SM_IMG.gallery.length]) }; }), size: 'lg', max: 6 })
          ]),
          h('p', { key: 'desc', style: { font: 'var(--text-body)', color: 'var(--ink-64)', textWrap: 'pretty' } }, 'Friendly, well-organised game \u2014 bring light and dark. We rotate teams every 15 minutes so everyone plays. Arrive 10 minutes early to warm up.')
        ])
      ]),
      // Sticky CTA \u2014 price block removed, Join spans full width
      h('div', { key: 'cta', style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 20px calc(20px + var(--safe-bottom))', background: 'linear-gradient(to top, var(--bg-base) 55%, rgba(0,0,0,0))', zIndex: 5 } },
        h(Button, { fullWidth: true, variant: joined ? 'success' : 'primary', iconRight: joined ? 'check' : 'arrow-right', onClick: onJoin }, joined ? "You're in" : 'Join match'))
    ]);
  }

  /* =====================================================================
     SwipeDeck — "Swipe" title + counter removed; the card stack rises to
     fill that space.
     ===================================================================== */
  function SwipeDeck(props) {
    var DS = window.SportMatchDesignSystem_7eff40 || {};
    var SwipeCard = DS.SwipeCard, EmptyState = DS.EmptyState, Button = DS.Button;
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
        h(EmptyState, { icon: 'check', title: "You're all caught up", text: "You've seen every match nearby. Check back later or widen your radius.", action: h(Button, { iconLeft: 'compass', onClick: function () { setIndex(0); } }, 'Start over') }));
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
            subtitle: mm.location.split(' \u00B7 ')[0] + ' \u00B7 ' + mm.distance + ' away',
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
    var data = props.data, joined = props.joined, onOpen = props.onOpen, onTab = props.onTab;

    var hosted = data.MATCHES.filter(function (m) { return HOSTED_IDS.indexOf(m.id) >= 0; });
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
      return h('button', { key: m.id, onClick: function () { onOpen(m); }, style: { position: 'relative', display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: 0, padding: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)', backdropFilter: 'blur(var(--blur-md))', WebkitBackdropFilter: 'blur(var(--blur-md))', color: '#fff' } }, [
        media(m, 'success', 'Confirmed', 'check', null),
        h('div', { key: 'f', style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' } }, [
          h('span', { key: 'd', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-80)', fontSize: 14, fontWeight: 600 } }, [h(Icon, { key: 'i', name: 'calendar', size: 15, color: 'var(--accent)' }), m.date + ' \u00B7 ' + m.time]),
          h('span', { key: 'l', style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ink-64)', fontSize: 14, fontWeight: 500, minWidth: 0 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 15 }), h('span', { key: 't', style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, m.location.split(' \u00B7 ')[0])]),
          h('span', { key: 'det', style: { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 14, fontWeight: 600, flex: 'none' } }, ['Details', h(Icon, { key: 'i', name: 'chevron-right', size: 16 })])
        ])
      ]);
    }

    // A hosted match — ticket + pending join requests with accept/decline.
    function hostingCard(m) {
      var list = reqs[m.id] || [];
      var pending = list.filter(function (r) { return r.status === 'pending'; }).length;
      var accepted = list.filter(function (r) { return r.status === 'accepted'; }).length;
      return h('div', { key: m.id, style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        media(m, 'accent', 'Hosting', 'user', function () { onOpen(m); }),
        footer(m),
        h('div', { key: 'reqs', style: { borderTop: '1px solid var(--glass-border)', padding: '14px 16px 16px' } }, [
          h('div', { key: 'rh', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } }, [
            h('span', { key: 'a', style: { font: 'var(--weight-bold) 11px/1 var(--font-text)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-46)' } }, 'Join requests'),
            h(Badge, { key: 'b', tone: pending ? 'accent' : 'success', dot: true }, pending ? pending + ' pending' : 'All set')
          ]),
          h('div', { key: 'cf', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginBottom: 10 } }, (m.total - m.spots + accepted) + '/' + m.total + ' players confirmed'),
          h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column' } }, list.map(function (r, idx) {
            return h('div', { key: idx, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', opacity: r.status === 'declined' ? 0.45 : 1 } }, [
              h(Avatar, { key: 'av', name: r.name, src: r.src, size: 'md' }),
              h('div', { key: 'n', style: { flex: 1, minWidth: 0 } }, [
                h('div', { key: 'nm', style: { fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.name),
                h('div', { key: 'sb', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, r.status === 'accepted' ? 'In the squad' : r.status === 'declined' ? 'Declined' : 'wants to join')
              ]),
              r.status === 'pending'
                ? h('div', { key: 'act', style: { display: 'flex', gap: 8, flex: 'none' } }, [
                    h('button', { key: 'dec', 'aria-label': 'Decline ' + r.name, onClick: function () { setStatus(m.id, idx, 'declined'); }, style: roundBtn('var(--glass-strong)', '#fff', 'var(--ring-glass)') }, h(Icon, { name: 'x', size: 18 })),
                    h('button', { key: 'acc', 'aria-label': 'Accept ' + r.name, onClick: function () { setStatus(m.id, idx, 'accepted'); }, style: roundBtn('var(--accent)', 'var(--accent-ink)', 'var(--shadow-glow)') }, h(Icon, { name: 'check', size: 18 }))
                  ])
                : h('span', { key: 'st', style: { flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: r.status === 'accepted' ? 'var(--success)' : 'var(--ink-46)' } }, [h(Icon, { key: 'i', name: r.status === 'accepted' ? 'check' : 'x', size: 15 }), r.status === 'accepted' ? 'Accepted' : 'Declined'])
            ]);
          }))
        ])
      ]);
    }

    var children = [
      h('div', { key: 'head', style: { padding: '64px 20px 8px' } }, [
        h('h1', { key: 'h', style: { font: 'var(--text-display)', letterSpacing: 'var(--tracking-title)', color: '#fff' } }, 'Your matches'),
        h('div', { key: 's', style: { color: 'var(--ink-46)', fontSize: 15, marginTop: 4 } }, hosted.length + ' hosting \u00B7 ' + invited.length + ' joined')
      ])
    ];
    if (hosted.length) {
      children.push(h('div', { key: 'hsec', style: { padding: '14px 20px 0' } }, [
        sectionLabel('Hosting', 'Approve who joins the games you created'),
        h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 } }, hosted.map(hostingCard))
      ]));
    }
    children.push(h('div', { key: 'isec', style: { padding: '26px 20px 150px' } }, [
      sectionLabel("You're in", 'Matches you joined'),
      invited.length
        ? h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 } }, invited.map(invitedTicket))
        : h('div', { key: 'e', style: { marginTop: 12 } }, h(EmptyState, { icon: 'layers', title: 'No matches yet', text: "Swipe right on games you like. When you're accepted, they show up here.", action: h(Button, { iconLeft: 'layers', onClick: function () { onTab && onTab('swipe'); } }, 'Start swiping') }))
    ]));

    return h(window.SMScreen, { style: { background: 'var(--bg-base)' } }, children);
  }

  /* ---------- apply once the bundle namespace is fully populated ---------- */
  function apply() {
    var ns = window.SportMatchDesignSystem_7eff40;
    if (!ns || !ns.BottomNav || !ns.Input) { return setTimeout(apply, 30); }
    window.CreateMatch = CreateMatch;
    window.MapScreen = MapScreen;
    window.MatchDetail = MatchDetail;
    window.SwipeDeck = SwipeDeck;
    window.Matches = Matches;
    // Dedicated namespace the bundle never assigns — immune to load-order races.
    window.SM_OVR = { CreateMatch: CreateMatch, MapScreen: MapScreen, MatchDetail: MatchDetail, SwipeDeck: SwipeDeck, Matches: Matches };
    window.__smOverridesReady = true;
    try { window.dispatchEvent(new Event('sm-overrides-ready')); } catch (e) {}
  }
  apply();
})();
