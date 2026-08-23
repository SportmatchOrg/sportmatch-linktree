/* SportMatch — Desktop (1440 × 900).
   Same product, same design system, re-laid-out for a pointer + wide canvas:
   top bar instead of the floating pill nav, map with a results rail, deck with
   explicit yes/no controls, wizard as a modal with a step rail.
   Mount one screen per frame: <SportMatchDesktop screen="map" />
   Depends on the DS bundle (SM_DATA / SM_IMG / namespace), overrides.js
   (Spanish data + sport glyphs) and Leaflet. */
(function () {
  var h = React.createElement;
  var W = 1440, H = 900;
  var COORDS = {
    m1: [41.3851, 2.1734], m2: [41.3954, 2.1620], m3: [41.3779, 2.1899],
    m4: [41.4036, 2.1744], m5: [41.3699, 2.1540], m6: [41.3925, 2.1957], m7: [41.3812, 2.1620]
  };
  var ACCENTS = { 'Fútbol': '#4EA8FF', 'Básquet': '#FF9F4E', 'Tenis': '#66D575', 'Pádel': '#C77DFF' };
  function DS() { return window.SportMatchDesignSystem_7eff40 || {}; }

  /* one continuous silhouette: pill + tail share a fill, hairline drawn as an
     outline around the union (same trick as the mobile pin) */
  function pinHtml(sport, accent) {
    var fill = 'rgba(18,20,26,0.94)', line = 'rgba(255,255,255,0.16)';
    var ring = ['0 1px 0', '0 -1px 0', '1px 0 0', '-1px 0 0']
      .map(function (o) { return 'drop-shadow(' + o + ' ' + line + ')'; }).join(' ');
    return '<div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-6px);' +
      'filter:' + ring + ' drop-shadow(0 10px 22px rgba(0,0,0,0.55))">' +
      '<div style="display:flex;align-items:center;gap:7px;height:40px;padding:0 15px;border-radius:99px;background:' + fill + ';' +
      'color:#fff;font:700 14px/1 var(--font-text,system-ui);letter-spacing:-0.01em;white-space:nowrap">' +
      '<span style="width:8px;height:8px;border-radius:50%;background:' + accent + ';box-shadow:0 0 8px ' + accent + '"></span>' + sport +
      '</div><div style="width:17px;height:10px;margin-top:-1px;background:' + fill + ';' +
      '-webkit-clip-path:polygon(0 0,100% 0,50% 100%);clip-path:polygon(0 0,100% 0,50% 100%)"></div></div>';
  }

  function Stack(props) {
    var Avatar = DS().Avatar;
    var names = props.names.slice(0, props.max || 4);
    var extra = props.names.length - names.length;
    return h('span', { style: { display: 'inline-flex', alignItems: 'center' } },
      names.map(function (n, i) {
        return h('span', { key: n, style: { marginLeft: i ? -11 : 0, borderRadius: '50%', boxShadow: '0 0 0 2px var(--bg-base)', display: 'inline-flex' } },
          h(Avatar, { name: n, size: props.size || 32 }));
      }).concat(extra > 0 ? [h('span', {
        key: 'more',
        style: {
          marginLeft: -11, width: props.size || 32, height: props.size || 32, borderRadius: '50%',
          background: 'var(--glass-strong)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: (props.size || 32) * 0.32, boxShadow: '0 0 0 2px var(--bg-base)'
        }
      }, '+' + extra)] : []));
  }

  function Overline(props) {
    return h('div', { style: Object.assign({ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 11, lineHeight: '16px', letterSpacing: '0.14em', textTransform: 'uppercase', color: props.tone || 'var(--ink-46)' }, props.style) }, props.children);
  }
  function Title(props) {
    return h('h2', { style: Object.assign({ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: props.size || 26, letterSpacing: '-0.025em', color: '#fff', margin: 0 }, props.style) }, props.children);
  }
  function Wordmark(props) {
    var sz = props.size || 22;
    return h('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: sz * 1.15, letterSpacing: '-0.035em', color: '#fff', lineHeight: 1 } },
      ['Sport', h('span', { key: 's', style: { color: 'var(--accent)' } }, 'Match')]);
  }

  var GLYPH_PATHS = {
    mail: ['M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Zm1.8-.2 6.5 5a1.2 1.2 0 0 0 1.4 0l6.5-5'],
    lock: ['M7 10V8a5 5 0 0 1 10 0v2M5.5 10h13a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-7A1.5 1.5 0 0 1 5.5 10Z'],
    user: ['M20 21v-1.5A4.5 4.5 0 0 0 15.5 15h-7A4.5 4.5 0 0 0 4 19.5V21M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
    pin: ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', 'M15 10a3 3 0 1 0-6 0 3 3 0 0 0 6 0'],
    tag: ['M7.5 7.5h.01', 'm3 9.5V4.5A1.5 1.5 0 0 1 4.5 3h5a1.5 1.5 0 0 1 1.06.44l9 9a1.5 1.5 0 0 1 0 2.12l-5.94 5.94a1.5 1.5 0 0 1-2.12 0l-9-9A1.5 1.5 0 0 1 3 9.5Z']
  };
  function glyph(kind) {
    var ps = GLYPH_PATHS[kind] || [];
    return h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      ps.map(function (dd, i) { return h('path', { key: i, d: dd }); }));
  }
  function AuthInput(props) {
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 18px', borderRadius: 99,
        background: 'var(--glass)', boxShadow: 'var(--ring-glass)', color: 'var(--ink-32)'
      }
    }, [
      h('span', { key: 'i', style: { display: 'inline-flex', flex: 'none', color: 'var(--ink-46)' } }, glyph(props.glyph)),
      h('span', { key: 't', style: { fontFamily: 'var(--font-text)', fontSize: 17, fontWeight: 500 } }, props.placeholder)
    ]);
  }

  var NAV = [['map', 'Mapa', 'map'], ['discover', 'Descubrir', 'search'], ['matches', 'Partidos', 'calendar'], ['profile', 'Perfil', 'user']];

  function TopBar(props) {
    var d = DS(), Icon = d.Icon, Button = d.Button, IconButton = d.IconButton;
    var p = window.SM_DATA.PROFILE;
    return h('header', {
      style: {
        flex: 'none', height: 76, display: 'flex', alignItems: 'center', gap: 32, padding: '0 32px',
        background: props.bg || 'rgba(8,9,12,0.90)', boxShadow: 'inset 0 -1px 0 var(--glass-border)',
        backdropFilter: 'blur(var(--blur-lg))', WebkitBackdropFilter: 'blur(var(--blur-lg))', zIndex: 60, position: 'relative'
      }
    }, [
      h(Wordmark, { key: 'wm', size: 20 }),
      h('nav', { key: 'nav', style: { display: 'flex', alignItems: 'center', gap: 6 } }, NAV.map(function (it) {
        var on = props.active === it[0];
        return h('button', {
          key: it[0],
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 9, height: 42, padding: '0 18px', border: 0, cursor: 'pointer',
            borderRadius: 99, background: on ? 'var(--glass-strong)' : 'transparent',
            boxShadow: on ? 'var(--ring-glass)' : 'none', color: on ? '#fff' : 'var(--ink-46)',
            fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em'
          }
        }, [h(Icon, { key: 'i', name: it[2], size: 18 }), it[1],
          on ? h('span', { key: 'd', style: { width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' } }) : null]);
      })),
      h('div', { key: 'sp', style: { flex: 1 } }),
      h(Button, { key: 'c', variant: props.active === 'create' ? 'primary' : 'primary', iconLeft: 'plus', style: { height: 46 } }, 'Crear partido'),
      h('img', { key: 'av', src: p.avatar, alt: p.name, style: { width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 2px var(--bg-base), 0 0 0 4px var(--accent)' } })
    ]);
  }

  function Frame(props) {
    return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' } }, props.children);
  }

  /* ---------------- shared cards ---------------- */
  function MatchRowWide(props) {
    var d = DS(), Badge = d.Badge, Rating = d.Rating, Icon = d.Icon;
    var m = props.match;
    return h('div', {
      style: {
        display: 'flex', gap: 16, height: 126, flex: 'none', borderRadius: 'var(--radius-md)', overflow: 'hidden',
        background: 'var(--glass)', boxShadow: props.selected ? 'inset 0 0 0 1.5px var(--accent)' : 'var(--ring-glass)', cursor: 'pointer'
      }
    }, [
      h('img', { key: 'i', src: m.photoUrl, alt: '', style: { width: 132, height: '100%', objectFit: 'cover', flex: 'none' } }),
      h('div', { key: 'b', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, padding: '10px 16px 10px 0' } }, [
        h('div', { key: 't', style: { display: 'flex', alignItems: 'center', gap: 10, flex: 'none' } }, [
          h(Overline, { key: 's' }, m.sport), h(Rating, { key: 'r', value: m.rating, size: 13 })
        ]),
        h('div', { key: 'ti', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, lineHeight: 1.3, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 'none' } }, m.title),
        h('div', { key: 'm', style: { display: 'flex', alignItems: 'center', gap: 14, color: 'var(--ink-64)', fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', flex: 'none' } }, [
          h('span', { key: 'a', style: { display: 'inline-flex', alignItems: 'center', gap: 5 } }, [h(Icon, { key: 'i', name: 'clock', size: 14 }), m.date + ' · ' + m.time]),
          h('span', { key: 'b', style: { display: 'inline-flex', alignItems: 'center', gap: 5 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 14 }), m.distance])
        ])
      ]),
      props.host
        ? h('div', { key: 'sp', style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 10, paddingRight: 16, flex: 'none' } }, [
            h(Badge, { key: 'b', tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots),
            h('button', { key: 'c', style: { height: 36, padding: 0, border: 0, cursor: 'pointer', background: 'transparent', boxShadow: 'none', color: 'var(--danger)', fontFamily: 'var(--font-text)', fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' } }, [h(Icon, { key: 'i', name: 'x', size: 15 }), 'Cancelar partido'])
          ])
        : h('div', { key: 'sp', style: { display: 'flex', alignItems: 'center', paddingRight: 16, flex: 'none' } },
            h(Badge, { tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots))
    ]);
  }

  function MatchCardTall(props) {
    var d = DS(), Badge = d.Badge, Rating = d.Rating, Icon = d.Icon, AvatarStack = d.AvatarStack;
    var m = props.match;
    return h('div', { style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--shadow-card)', display: 'flex', flexDirection: 'column' } }, [
      h('div', { key: 'ph', style: { position: 'relative', height: props.photoHeight || 176, flex: 'none' } }, [
        h('img', { key: 'i', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0) 62%)' } }),
        h('div', { key: 'sp', style: { position: 'absolute', top: 14, right: 14 } }, h(Badge, { tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots + ' lugares')),
        h('div', { key: 'ov', style: { position: 'absolute', left: 16, bottom: 14 } }, h(Overline, { tone: 'var(--ink-80)' }, m.sport + ' · ' + m.level))
      ]),
      h('div', { key: 'bd', style: { padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 } }, [
        h(Title, { key: 't', size: 20 }, m.title),
        h('div', { key: 'm', style: { display: 'flex', alignItems: 'center', gap: 14, color: 'var(--ink-64)', fontSize: 14 } }, [
          h('span', { key: 'a', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'clock', size: 15 }), m.date + ' · ' + m.time]),
          h('span', { key: 'b', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 15 }), m.distance])
        ]),
        h('div', { key: 'f', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 } }, [
          h(Stack, { key: 'a', names: m.players, size: 30, max: 4 }),
          h(Rating, { key: 'r', value: m.rating, count: m.ratingCount, size: 14 })
        ])
      ])
    ]);
  }

  /* ---------------- auth ---------------- */
  function AuthDesktop(props) {
    var d = DS(), Button = d.Button, Input = d.Input;
    var isReg = props.mode === 'register';
    var fields = (isReg ? [['Nombre completo', 'user'], ['Email', 'mail'], ['Contraseña', 'lock'], ['Repetir contraseña', 'lock']]
      : [['Email', 'mail'], ['Contraseña', 'lock']]);
    return h('div', { style: { position: 'absolute', inset: 0, display: 'flex', background: 'var(--bg-base)' } }, [
      h('div', { key: 'ph', style: { position: 'relative', width: 760, flex: 'none' } }, [
        h('img', { key: 'i', src: window.SM_IMG.url('football-sunset'), alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
        h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.72) 80%, #000 100%)' } }),
        h('div', { key: 'wm', style: { position: 'absolute', top: 40, left: 44 } }, h(Wordmark, { size: 30 })),
        h('div', { key: 'cl', style: { position: 'absolute', left: 44, bottom: 56, maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 14 } }, [
          h('h1', { key: 'h', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 54, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#fff', margin: 0, textWrap: 'balance' } }, 'Encontrá tu próximo partido.'),
          h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 17, color: 'var(--ink-64)', margin: 0, textWrap: 'pretty' } }, 'Gente que juega cerca, hoy. Sumate en dos clics.')
        ])
      ]),
      h('div', { key: 'fm', style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 72px' } },
        h('div', { style: { width: 420, display: 'flex', flexDirection: 'column', gap: 20 } }, [
          h('div', { key: 't' }, [
            h('h2', { key: 'h', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', color: '#fff', margin: 0 } }, isReg ? 'Creá tu cuenta' : 'Bienvenido'),
            h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 15, color: 'var(--ink-64)', marginTop: 8 } }, isReg ? 'Sumate y empezá a jugar con gente cerca tuyo' : 'Iniciá sesión para encontrar tu próximo partido')
          ]),
          h('div', { key: 'f', style: { display: 'flex', flexDirection: 'column', gap: 12 } }, fields.map(function (f) {
            return h(AuthInput, { key: f[0], placeholder: f[0], glyph: f[1] });
          })),
          !isReg ? h('button', { key: 'fp', style: { alignSelf: 'flex-end', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--accent)', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 600 } }, '¿Olvidaste tu contraseña?') : null,
          h(Button, { key: 'cta', fullWidth: true, variant: 'primary', size: 'lg', style: { height: 56 } }, isReg ? 'Crear cuenta' : 'Iniciar sesión'),
          h('div', { key: 'or', style: { display: 'flex', alignItems: 'center', gap: 14 } }, [
            h('span', { key: 'a', style: { flex: 1, height: 1, background: 'var(--glass-border)' } }),
            h(Overline, { key: 'l' }, isReg ? 'O registrate con' : 'O continuá con'),
            h('span', { key: 'b', style: { flex: 1, height: 1, background: 'var(--glass-border)' } })
          ]),
          h('button', { key: 'g', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', height: 56, borderRadius: 99, border: 0, cursor: 'pointer', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)', color: '#fff', fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600 } }, [
            h('svg', { key: 's', width: 19, height: 19, viewBox: '0 0 48 48' }, [
              h('path', { key: 'a', fill: '#FFC107', d: 'M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9Z' }),
              h('path', { key: 'b', fill: '#FF3D00', d: 'm6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z' }),
              h('path', { key: 'c', fill: '#4CAF50', d: 'M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z' }),
              h('path', { key: 'd', fill: '#1976D2', d: 'M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40.9 35.7 44 30.3 44 24c0-1.3-.1-2.6-.4-3.9Z' })
            ]), 'Google'
          ]),
          h('div', { key: 'sw', style: { textAlign: 'center', fontFamily: 'var(--font-text)', fontSize: 14, color: 'var(--ink-64)' } }, [
            isReg ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? ',
            h('span', { key: 'b', style: { color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' } }, isReg ? 'Iniciá sesión' : 'Registrate')
          ])
        ]))
    ]);
  }

  /* ---------------- map + results rail ---------------- */
  function MapDesktop(props) {
    var d = DS(), Input = d.Input, IconButton = d.IconButton, FilterChip = d.FilterChip, Icon = d.Icon;
    var data = window.SM_DATA;
    var elRef = React.useRef(null), mapRef = React.useRef(null);
    React.useEffect(function () {
      if (!window.L || !elRef.current || mapRef.current) return;
      var map = window.L.map(elRef.current, { center: [41.389, 2.176], zoom: 14, zoomControl: false, attributionControl: false, fadeAnimation: false });
      mapRef.current = map;
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
      data.MATCHES.forEach(function (m) {
        var c = COORDS[m.id]; if (!c) return;
        window.L.marker(c, { icon: window.L.divIcon({ html: pinHtml(m.sport, ACCENTS[m.sport] || '#4EA8FF'), className: '', iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(map);
      });
      window.L.marker([41.388, 2.173], { icon: window.L.divIcon({ html: '<div style="width:18px;height:18px;border-radius:50%;background:#4EA8FF;box-shadow:0 0 0 5px rgba(78,168,255,0.28),0 0 0 2px #fff"></div>', className: '', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
      setTimeout(function () { map.invalidateSize(); }, 80);
      return function () { map.remove(); mapRef.current = null; };
    }, []);

    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'map' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, display: 'flex' } }, [
        h('aside', { key: 'rail', style: { width: 428, flex: 'none', display: 'flex', flexDirection: 'column', gap: 16, padding: '22px 24px', background: 'rgba(8,9,12,0.90)', boxShadow: 'inset -1px 0 0 var(--glass-border)' } }, [
          h('div', { key: 'sr', style: { display: 'flex', gap: 12, alignItems: 'center' } }, [
            h('div', { key: 's', style: { flex: 1, minWidth: 0 } }, h(Input, { variant: 'search', icon: 'search', placeholder: 'Buscá en esta zona' })),
            h(IconButton, { key: 'f', icon: 'sliders', variant: 'glass', 'aria-label': 'Filtros', style: { width: 48, height: 48, flex: 'none' } })
          ]),
          h('div', { key: 'ch', style: { display: 'flex', gap: 8, flexWrap: 'nowrap', overflow: 'hidden', flex: 'none' } },
            [['Cerca', 'navigation'], ['Hoy', 'calendar'], ['Esta noche', 'clock'], ['Mañana', 'calendar'], ['Lugares libres', null]].map(function (c, i) {
              return h('span', { key: c[0], style: { flex: 'none' } }, h(FilterChip, { icon: c[1] || undefined, selected: i === 0 }, c[0]));
            })),
          h('div', { key: 'hd', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 4 } }, [
            h(Title, { key: 't', size: 22 }, '7 partidos cerca'),
            h('span', { key: 's', style: { color: 'var(--accent)', fontSize: 14, fontWeight: 600, cursor: 'pointer' } }, 'Más cercanos')
          ]),
          h('div', { key: 'ls', style: { flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 } },
            data.MATCHES.slice(0, 4).map(function (m) { return h(MatchRowWide, { key: m.id, match: m }); }))
        ]),
        h('div', { key: 'map', style: { flex: 1, position: 'relative', background: '#0a0d12' } }, [
          h('div', { key: 'mp', ref: elRef, style: { position: 'absolute', inset: 0 } }),
          h('div', { key: 'ct', style: { position: 'absolute', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 20 } }, [
            h(IconButton, { key: 'l', icon: 'navigation', variant: 'glass', 'aria-label': 'Centrar', style: { width: 48, height: 48 } }),
            h(IconButton, { key: 'p', icon: 'plus', variant: 'glass', 'aria-label': 'Acercar', style: { width: 48, height: 48 } })
          ]),
          h('div', { key: 'lg', style: { position: 'absolute', left: 24, bottom: 24, display: 'flex', gap: 8, alignItems: 'center', padding: '12px 16px', borderRadius: 99, background: 'rgba(12,14,18,0.82)', boxShadow: 'var(--ring-glass)', backdropFilter: 'blur(var(--blur-md))', zIndex: 20 } },
            Object.keys(ACCENTS).map(function (k) {
              return h('span', { key: k, style: { display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink-64)', fontSize: 13, fontWeight: 600, paddingRight: 8 } }, [
                h('span', { key: 'd', style: { width: 8, height: 8, borderRadius: '50%', background: ACCENTS[k], boxShadow: '0 0 8px ' + ACCENTS[k] } }), k
              ]);
            }))
        ])
      ])
    ]);
  }

  /* ---------------- discover deck ---------------- */
  function DiscoverDesktop() {
    var d = DS(), Icon = d.Icon, Badge = d.Badge, Rating = d.Rating, AvatarStack = d.AvatarStack;
    var data = window.SM_DATA, m = data.MATCHES[0], next = data.MATCHES[1], prev = data.MATCHES[6];
    function ghost(mm, side) {
      return h('div', { style: { position: 'absolute', top: 56, bottom: 56, width: 300, borderRadius: 'var(--radius-lg)', overflow: 'hidden', opacity: 0.34, filter: 'blur(1px)', left: side === 'l' ? -170 : undefined, right: side === 'r' ? -170 : undefined, transform: 'scale(0.94)' } },
        h('img', { src: mm.photoUrl, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover' } }));
    }
    function circle(kind) {
      var no = kind === 'no';
      return h('button', {
        style: {
          width: 76, height: 76, borderRadius: '50%', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: no ? 'var(--glass-strong)' : 'var(--swipe-yes, #66D575)', color: no ? 'var(--swipe-no, #FF5A5F)' : '#06210C',
          boxShadow: no ? 'var(--ring-glass), var(--shadow-float)' : '0 10px 34px rgba(102,213,117,0.42)'
        }
      }, h(Icon, { name: no ? 'x' : 'check', size: 32 }));
    }
    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'discover' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '30px 0 34px' } }, [
        h('div', { key: 'hd', style: { textAlign: 'center' } },
          h(Overline, { key: 'o', tone: 'var(--accent)' }, 'Recomendado para vos')),
        h('div', { key: 'deck', style: { position: 'relative', width: 470, flex: 1, minHeight: 0 } }, [
          ghost(prev, 'l'), ghost(next, 'r'),
          h('div', { key: 'card', style: { position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow-card)' } }, [
            h('img', { key: 'i', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
            h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.18) 52%, rgba(0,0,0,0.35) 100%)' } }),
            h('div', { key: 'tp', style: { position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              h(Badge, { key: 'l', tone: 'neutral' }, m.sport + ' · ' + m.level),
              h(Badge, { key: 's', tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots + ' lugares')
            ]),
            h('div', { key: 'in', style: { position: 'absolute', left: 22, right: 22, bottom: 22, display: 'flex', flexDirection: 'column', gap: 12 } }, [
              h('h3', { key: 't', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', color: '#fff', margin: 0 } }, m.title),
              h('div', { key: 'm', style: { display: 'flex', alignItems: 'center', gap: 16, color: 'var(--ink-80)', fontSize: 15, fontWeight: 500 } }, [
                h('span', { key: 'a', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'clock', size: 16 }), m.date + ' · ' + m.time]),
                h('span', { key: 'b', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 16 }), m.location.split(' · ')[0] + ' · ' + m.distance])
              ]),
              h('div', { key: 'f', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
                h(Stack, { key: 'a', names: m.players, size: 34, max: 5 }),
                h(Rating, { key: 'r', value: m.rating, count: m.ratingCount, size: 15 })
              ])
            ])
          ])
        ]),
        h('div', { key: 'ctl', style: { display: 'flex', alignItems: 'center', gap: 40 } }, [
          circle('no'),
          circle('yes')
        ])
      ])
    ]);
  }

  /* ---------------- match detail ---------------- */
  function DetailDesktop() {
    var d = DS(), Icon = d.Icon, Badge = d.Badge, Rating = d.Rating, Button = d.Button, Avatar = d.Avatar, IconButton = d.IconButton;
    var m = window.SM_DATA.MATCHES[0];
    function fact(icon, label, value) {
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
        h('span', { key: 'i', style: { width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--glass-strong)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, h(Icon, { name: icon, size: 19 })),
        h('div', { key: 't' }, [
          h(Overline, { key: 'l' }, label),
          h('div', { key: 'v', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff', marginTop: 5, letterSpacing: '-0.02em' } }, value)
        ])
      ]);
    }
    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'map' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, display: 'flex', gap: 32, padding: '26px 32px 32px', overflow: 'hidden' } }, [
        h('div', { key: 'l', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 } }, [
          h('div', { key: 'ph', style: { position: 'relative', height: 330, borderRadius: 'var(--radius-lg)', overflow: 'hidden', flex: 'none' } }, [
            h('img', { key: 'i', src: m.photoUrl, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
            h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0) 58%)' } }),
            h('div', { key: 'bk', style: { position: 'absolute', top: 18, left: 18 } }, h(IconButton, { icon: 'chevron-left', variant: 'glass', 'aria-label': 'Volver' })),
            h('div', { key: 'ac', style: { position: 'absolute', top: 18, right: 18, display: 'flex', gap: 10 } }, [
              h(IconButton, { key: 'h', icon: 'heart', variant: 'glass', 'aria-label': 'Guardar' }),
              h(IconButton, { key: 's', icon: 'share', variant: 'glass', 'aria-label': 'Compartir' })
            ]),
            h('div', { key: 'tx', style: { position: 'absolute', left: 26, right: 26, bottom: 24, display: 'flex', flexDirection: 'column', gap: 12 } }, [
              h('div', { key: 'b', style: { display: 'flex', gap: 10 } }, [
                h(Badge, { key: 's', tone: 'neutral' }, m.sport), h(Badge, { key: 'l', tone: 'neutral' }, m.level),
                h(Badge, { key: 'sp', tone: m.spots <= 2 ? 'danger' : 'success', dot: true }, m.spots + ' lugares')
              ]),
              h('h1', { key: 't', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, letterSpacing: '-0.035em', color: '#fff', margin: 0 } }, m.title),
              h('div', { key: 'm', style: { display: 'flex', gap: 18, color: 'var(--ink-80)', fontSize: 15.5 } }, [
                h('span', { key: 'a', style: { display: 'inline-flex', alignItems: 'center', gap: 7 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 16 }), m.location]),
                h(Rating, { key: 'r', value: m.rating, count: m.ratingCount, size: 15 })
              ])
            ])
          ]),
          h('div', { key: 'facts', style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 } }, [
            fact('calendar', 'Día', m.date), fact('clock', 'Hora', m.time),
            fact('users', 'Jugadores', m.players.length + '/' + m.total), fact('signal', 'Nivel', m.level)
          ]),
          h('div', { key: 'ab', style: { display: 'flex', flexDirection: 'column', gap: 10 } }, [
            h(Overline, { key: 'o' }, 'Sobre el partido'),
            h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 16, lineHeight: 1.55, color: 'var(--ink-64)', margin: 0, maxWidth: 720, textWrap: 'pretty' } },
              'Partido de 7 en césped sintético, luz artificial. Equipos se arman al llegar. Traé pechera clara y oscura si tenés — la cancha se reserva 15 minutos antes del horario.')
          ])
        ]),
        h('aside', { key: 'r', style: { width: 380, flex: 'none', display: 'flex', flexDirection: 'column', gap: 16 } }, [
          h('div', { key: 'org', style: { display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
            h(Avatar, { key: 'a', name: m.organizer, size: 'lg', ring: 'accent' }),
            h('div', { key: 't', style: { flex: 1, minWidth: 0 } }, [
              h(Overline, { key: 'o' }, 'Organiza'),
              h('div', { key: 'n', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 5 } }, m.organizer)
            ]),
            h(Button, { key: 'b', variant: 'secondary', size: 'sm' }, 'Ver perfil')
          ]),
          h('div', { key: 'pl', style: { flex: 1, minHeight: 0, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' } }, [
            h('div', { key: 'h', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
              h(Overline, { key: 'o' }, 'Quién juega'),
              h('span', { key: 'c', style: { fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 15, color: 'var(--accent)' } }, m.players.length + '/' + m.total)
            ]),
            h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 10 } }, m.players.map(function (n, i) {
              return h('div', { key: n, style: { display: 'flex', alignItems: 'center', gap: 12 } }, [
                h(Avatar, { key: 'a', name: n, size: 'sm' }),
                h('span', { key: 'n', style: { flex: 1, fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 500, color: '#fff' } }, n),
                i === 0 ? h(Badge, { key: 'b', tone: 'neutral' }, 'Organiza') : null
              ]);
            }))
          ]),
          h('div', { key: 'cta', style: { display: 'flex', flexDirection: 'column', gap: 10 } }, [
            h(Button, { key: 'b', fullWidth: true, variant: 'primary', size: 'lg', iconRight: 'arrow-right', style: { height: 58 } }, 'Unirme al partido')
          ])
        ])
      ])
    ]);
  }

  /* ---------------- create wizard ---------------- */
  var STEPS = ['Deporte', 'Lugar', 'Horario', 'Jugadores', 'Revisión'];
  var QUESTIONS = ['¿A qué vas a jugar?', '¿Dónde se juega?', '¿A qué hora arranca?', '¿Cuántos jugadores?', '¿Listo para publicar?'];
  function CreateDesktop(props) {
    var d = DS(), Icon = d.Icon, Button = d.Button, Input = d.Input, FilterChip = d.FilterChip, SegmentedControl = d.SegmentedControl, IconButton = d.IconButton, Badge = d.Badge;
    var data = window.SM_DATA, step = props.step;
    var form = { sport: 'Fútbol', sportKey: 'football', place: 'River Courts', day: 'Hoy', time: '19:30', players: 12, level: 'Casual', title: 'Picado de los jueves' };

    function stepRail() {
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }, STEPS.map(function (s, i) {
        var done = i < step, on = i === step;
        return h('div', { key: s, style: { display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 'var(--radius-md)', background: on ? 'var(--glass)' : 'transparent', boxShadow: on ? 'var(--ring-glass)' : 'none' } }, [
          h('span', { key: 'n', style: { width: 30, height: 30, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 13, background: done ? 'var(--success)' : on ? 'var(--accent)' : 'var(--glass)', color: done || on ? '#05101c' : 'var(--ink-46)', boxShadow: on ? 'var(--shadow-glow)' : 'none' } },
            done ? h(Icon, { name: 'check', size: 16 }) : String(i + 1)),
          h('span', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 15.5, fontWeight: 600, color: on ? '#fff' : done ? 'var(--ink-64)' : 'var(--ink-32)' } }, s)
        ]);
      }));
    }

    var body;
    if (step === 0) {
      body = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 } }, data.SPORTS.slice(1).map(function (s) {
        var on = s.label === form.sport;
        return h('div', { key: s.key, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '20px 18px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: on ? '#fff' : 'var(--glass)', color: on ? '#0A0B0E' : '#fff', boxShadow: on ? '0 10px 28px rgba(0,0,0,0.5)' : 'var(--ring-glass)' } }, [
          h('span', { key: 'i', style: { display: 'inline-flex', color: on ? '#0A0B0E' : 'var(--accent)' } }, s.icon || null),
          h('span', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600 } }, s.label)
        ]);
      }));
    } else if (step === 1) {
      body = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } }, [
        h(Input, { key: 'i', variant: 'search', icon: 'map-pin', placeholder: 'Buscá una cancha o dirección', defaultValue: form.place }),
        h('div', { key: 'c', style: { display: 'flex', gap: 10, flexWrap: 'wrap' } }, ['River Courts', 'Club Víbora', 'The Cage', 'Parque Sur'].map(function (pl) {
          return h(FilterChip, { key: pl, icon: 'navigation', selected: pl === form.place }, pl);
        })),
        h('div', { key: 'mp', style: { height: 240, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--ring-glass)' } }, [
          h('img', { key: 'i', src: window.SM_IMG.url('basketball-aerial'), alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.5)' } }),
          h('div', { key: 'p', style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, dangerouslySetInnerHTML: { __html: pinHtml(form.place, '#4EA8FF') } })
        ])
      ]);
    } else if (step === 2) {
      // Day, hour and minute are the same control: a full, horizontally
      // scrollable strip of numbers (all 14 days / 24 hours / 12 minute steps).
      function strip(items, sel, width) {
        return h('div', { style: { display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'visible', padding: '14px 0 22px', margin: '-14px 0 -18px', position: 'relative', zIndex: 1 } }, items.map(function (x) {
          var on = x === sel;
          return h('div', {
            key: x,
            style: {
              width: width, flex: 'none', padding: '13px 0', textAlign: 'center', borderRadius: 16, cursor: 'pointer',
              background: on ? 'var(--accent)' : 'var(--glass)', color: on ? 'var(--accent-ink)' : '#fff',
              fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 20,
              boxShadow: on ? 'var(--shadow-glow)' : 'var(--ring-glass)', fontVariantNumeric: 'tabular-nums'
            }
          }, x);
        }));
      }
      var days = [], di;
      for (di = 18; di <= 31; di++) days.push(String(di));
      var mins = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
      body = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 22 } }, [
        h('div', { key: 'd', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 12 } }, ['Día · ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, '18 de agosto')]),
          strip(days, '18', 62)
        ]),
        h('div', { key: 'h', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 12 } }, ['Hora · ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, '19')]),
          strip(['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'], '19', 62)
        ]),
        h('div', { key: 'm', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 12 } }, ['Minutos · ', h('span', { key: 'v', style: { color: 'var(--accent)' } }, '30')]),
          strip(mins, '30', 62)
        ])
      ]);
    } else if (step === 3) {
      body = h('div', { style: { display: 'flex', flexDirection: 'column', gap: 28 } }, [
        h('div', { key: 'p', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)', flex: 'none' } }, [
          h('span', { key: 'l', style: { color: 'var(--ink-64)', fontSize: 17, fontWeight: 600 } }, 'Jugadores totales'),
          h('div', { key: 'c', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
            h(IconButton, { key: 'm', icon: h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }, h('path', { d: 'M5 12h14' })), variant: 'glass', size: 'sm', 'aria-label': 'Menos' }),
            h('span', { key: 'n', style: { fontFamily: 'var(--font-numeric)', fontWeight: 800, fontSize: 34, color: '#fff', minWidth: 56, textAlign: 'center' } }, form.players),
            h(IconButton, { key: 'p', icon: 'plus', variant: 'solid', size: 'sm', 'aria-label': 'Más' })
          ])
        ]),
        h('div', { key: 'lv', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 14, lineHeight: 1.2 } }, 'Nivel'),
          h(SegmentedControl, { key: 's', fullWidth: true, value: 'casual', options: [{ value: 'casual', label: 'Casual' }, { value: 'intermediate', label: 'Intermedio' }, { value: 'advanced', label: 'Avanzado' }] })
        ]),
        h('div', { key: 'ti', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 12 } }, 'Título'),
          h('div', { key: 'f', style: { display: 'flex', alignItems: 'center', gap: 12, height: 56, borderRadius: 99, background: 'var(--glass)', boxShadow: 'var(--ring-glass)', padding: '0 18px' } }, [
            h('span', { key: 'g', style: { display: 'inline-flex', flex: 'none', color: 'var(--ink-46)' } }, glyph('tag')),
            h('span', { key: 't', style: { color: '#fff', fontFamily: 'var(--font-text)', fontSize: 17, fontWeight: 500 } }, form.title)
          ])
        ]),
        h('div', { key: 'ds', style: { flex: 'none' } }, [
          h(Overline, { key: 'l', style: { marginBottom: 12 } }, 'Descripción'),
          h('div', { key: 't', style: { minHeight: 96, borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)', padding: '16px 18px', color: 'var(--ink-32)', fontFamily: 'var(--font-text)', fontSize: 16 } }, 'Agregá una nota — qué llevar, cómo se arman los equipos, dónde encontrarse…')
        ])
      ]);
    } else {
      var m = data.MATCHES[0];
      body = h('div', { style: { display: 'flex', gap: 22 } }, [
        h('div', { key: 'c', style: { width: 380, flex: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', position: 'relative' } }, [
          h('img', { key: 'i', src: window.SM_IMG.bySport(form.sportKey), alt: '', style: { width: '100%', height: 230, objectFit: 'cover', display: 'block' } }),
          h('div', { key: 'g', style: { position: 'absolute', top: 0, left: 0, right: 0, height: 230, background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%)' } }),
          h('div', { key: 't', style: { position: 'absolute', left: 18, bottom: 96, right: 18 } }, [
            h(Badge, { key: 'b', tone: 'neutral' }, form.sport + ' · ' + form.level),
            h('div', { key: 'n', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: '#fff', marginTop: 10 } }, form.title)
          ]),
          h('div', { key: 'f', style: { background: 'var(--glass)', padding: '16px 18px', display: 'flex', gap: 18, color: 'var(--ink-64)', fontSize: 14 } }, [
            h('span', { key: 'a', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'calendar', size: 15 }), form.day + ' · ' + form.time]),
            h('span', { key: 'b', style: { display: 'inline-flex', alignItems: 'center', gap: 6 } }, [h(Icon, { key: 'i', name: 'users', size: 15 }), form.players])
          ])
        ]),
        h('div', { key: 's', style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10 } }, [
          ['Título', form.title], ['Deporte', form.sport], ['Lugar', form.place], ['Día y hora', form.day + ' · ' + form.time],
          ['Jugadores', String(form.players)], ['Nivel', form.level]
        ].map(function (r) {
          return h('div', { key: r[0], style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
            h('span', { key: 'l', style: { color: 'var(--ink-46)', fontSize: 14.5 } }, r[0]),
            h('span', { key: 'v', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff' } }, r[1])
          ]);
        }))
      ]);
    }

    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'create' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, position: 'relative' } }, [
        h('img', { key: 'bg', src: window.SM_IMG.url('football-match'), alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, filter: 'blur(3px)' } }),
        h('div', { key: 'sc', style: { position: 'absolute', inset: 0, background: 'rgba(4,5,8,0.72)' } }),
        h('div', {
          key: 'md', style: {
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 1120, height: 700,
            display: 'flex', borderRadius: 32, overflow: 'hidden', background: 'rgba(10,11,15,0.94)',
            boxShadow: 'var(--ring-glass), 0 40px 100px rgba(0,0,0,0.65)', backdropFilter: 'blur(var(--blur-lg))'
          }
        }, [
          h('div', { key: 'rail', style: { width: 300, flex: 'none', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24, boxShadow: 'inset -1px 0 0 var(--glass-border)' } }, [
            h('div', { key: 'h' }, [
              h(Overline, { key: 'o', tone: 'var(--accent)' }, 'Nuevo partido'),
              h(Title, { key: 't', size: 24, style: { marginTop: 10 } }, 'Crear partido')
            ]),
            stepRail(),
            h('div', { key: 'sp', style: { flex: 1 } }),
            h('div', { key: 'pr', style: { display: 'flex', flexDirection: 'column', gap: 10 } }, [
              h('div', { key: 'b', style: { height: 5, borderRadius: 99, background: 'var(--ink-16)', overflow: 'hidden' } },
                h('div', { style: { width: ((step + 1) / 5) * 100 + '%', height: '100%', background: 'var(--accent)', borderRadius: 99 } })),
              h('span', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)' } }, 'Paso ' + (step + 1) + ' de 5')
            ])
          ]),
          h('div', { key: 'main', style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } }, [
            h('div', { key: 'hd', style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '34px 36px 0' } }, [
              h('div', { key: 't' }, [
                h(Overline, { key: 'o', tone: 'var(--accent)' }, 'Paso ' + (step + 1) + ' · ' + STEPS[step]),
                h('h2', { key: 'q', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.03em', color: '#fff', margin: '14px 0 0' } }, QUESTIONS[step])
              ]),
              h(IconButton, { key: 'x', icon: 'x', variant: 'glass', size: 'sm', 'aria-label': 'Cerrar' })
            ]),
            h('div', { key: 'bd', style: { flex: 1, minHeight: 0, overflow: 'hidden', padding: '28px 36px' } }, body),
            h('div', { key: 'ft', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 36px 28px', boxShadow: 'inset 0 1px 0 var(--glass-border)' } }, [
              h(Button, { key: 'b', variant: 'secondary', size: 'lg', iconLeft: 'chevron-left', style: { height: 54, visibility: step === 0 ? 'hidden' : 'visible' } }, 'Atrás'),
              h(Button, { key: 'n', variant: 'primary', size: 'lg', iconRight: step === 4 ? 'zap' : 'arrow-right', style: { height: 54, minWidth: 220 } }, step === 4 ? 'Publicar partido' : 'Continuar')
            ])
          ])
        ])
      ])
    ]);
  }

  /* ---------------- my matches ---------------- */
  function MatchesDesktop() {
    var d = DS(), Button = d.Button, Avatar = d.Avatar, Badge = d.Badge, Icon = d.Icon;
    var data = window.SM_DATA;
    var hosting = data.MATCHES.slice(0, 2), playing = data.MATCHES.slice(2, 5);
    function request(name, sport) {
      return h('div', { key: name, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--glass-strong)', boxShadow: 'var(--ring-glass)' } }, [
        h(Avatar, { key: 'a', name: name, size: 'sm' }),
        h('div', { key: 't', style: { flex: 1, minWidth: 0 } }, [
          h('div', { key: 'n', style: { fontFamily: 'var(--font-text)', fontSize: 15, fontWeight: 600, color: '#fff' } }, name),
          h('div', { key: 's', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: 2 } }, 'Quiere sumarse · ' + sport)
        ]),
        h('button', { key: 'x', style: { width: 38, height: 38, borderRadius: '50%', border: 0, cursor: 'pointer', background: 'var(--glass)', color: 'var(--ink-64)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, h(Icon, { name: 'x', size: 17 })),
        h('button', { key: 'v', style: { height: 38, padding: '0 16px', borderRadius: 99, border: 0, cursor: 'pointer', background: 'var(--success)', color: '#06210C', fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 700 } }, 'Aceptar')
      ]);
    }
    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'matches' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 22, padding: '28px 32px 32px', overflow: 'hidden' } }, [
        h('div', { key: 'hd', style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' } }, [
          h('div', { key: 't' }, [
            h(Overline, { key: 'o', tone: 'var(--accent)' }, 'Tu agenda'),
            h('h1', { key: 'h', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, letterSpacing: '-0.035em', color: '#fff', margin: '12px 0 0' } }, 'Tus partidos')
          ]),
          null
        ]),
        h('div', { key: 'cols', style: { flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, overflow: 'hidden' } }, [
          h('section', { key: 'host', style: { display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 } }, [
            h('div', { key: 'h', style: { display: 'flex', alignItems: 'center', gap: 10 } }, [
              h(Title, { key: 't', size: 22 }, 'Organizás'),
              h(Badge, { key: 'b', tone: 'neutral' }, hosting.length)
            ]),
            h('div', { key: 'rq', style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
              h(Overline, { key: 'o', tone: 'var(--warning)' }, '2 solicitudes pendientes'),
              request('Lucía Romero', 'Fútbol 7'), request('Theo Blanc', 'Picado de streetball')
            ]),
            h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, overflow: 'hidden' } },
              hosting.map(function (m) { return h(MatchRowWide, { key: m.id, match: m, host: true }); }))
          ]),
          h('section', { key: 'play', style: { display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 } }, [
            h('div', { key: 'h', style: { display: 'flex', alignItems: 'center', gap: 10 } }, [
              h(Title, { key: 't', size: 22 }, 'Jugás'),
              h(Badge, { key: 'b', tone: 'neutral' }, playing.length)
            ]),
            h('div', { key: 'g', style: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' } },
              playing.map(function (m) { return h(MatchRowWide, { key: m.id, match: m }); }))
          ])
        ])
      ])
    ]);
  }

  /* ---------------- profile ---------------- */
  function StatWide(props) {
    var Icon = DS().Icon;
    return h('div', { style: { flex: 1, display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
      h('span', { key: 'i', style: { width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--glass-strong)', color: props.accent || 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } },
        h(Icon, { name: props.icon, size: 22, filled: props.icon === 'star' || props.icon === 'flame' })),
      h('div', { key: 't' }, [
        h('div', { key: 'v', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 } }, props.value),
        h('div', { key: 'l', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: 6 } }, props.label)
      ])
    ]);
  }
  function ProfileDesktop() {
    var d = DS(), Button = d.Button, Icon = d.Icon;
    var data = window.SM_DATA, p = data.PROFILE;
    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'profile' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' } }, [
        h('div', { key: 'cv', style: { position: 'relative', height: 206, flex: 'none', zIndex: 0 } }, [
          h('img', { key: 'i', src: p.cover, alt: '', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }),
          h('div', { key: 'g', style: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-base) 4%, rgba(0,0,0,0.25) 70%)' } })
        ]),
        h('div', { key: 'id', style: { display: 'flex', alignItems: 'flex-end', gap: 24, padding: '0 32px', marginTop: -54, flex: 'none', position: 'relative', zIndex: 2 } }, [
          h('img', { key: 'a', src: p.avatar, alt: p.name, style: { width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', flex: 'none', boxShadow: '0 0 0 4px var(--bg-base), 0 0 0 7px var(--accent)' } }),
          h('div', { key: 'n', style: { flex: 1, minWidth: 0, paddingBottom: 8 } }, [
            h('h1', { key: 'h', style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38, letterSpacing: '-0.035em', color: '#fff', margin: 0 } }, p.name),
            h('div', { key: 'c', style: { display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink-46)', fontSize: 16, marginTop: 8 } }, [h(Icon, { key: 'i', name: 'map-pin', size: 16 }), p.city])
          ]),
          h('div', { key: 'ac', style: { display: 'flex', gap: 12, paddingBottom: 8 } }, [
            h(Button, { key: 's', variant: 'secondary', iconLeft: 'share', style: { height: 46 } }, 'Compartir'),
            h(Button, { key: 'e', variant: 'secondary', iconLeft: 'sliders', style: { height: 46 } }, 'Ajustes')
          ])
        ]),
        h('div', { key: 'st', style: { display: 'flex', gap: 16, padding: '26px 32px 0', flex: 'none' } }, [
          h(StatWide, { key: 'r', value: p.rating, label: 'Puntaje · ' + p.ratingCount + ' valoraciones', icon: 'star', accent: '#FFC857' }),
          h(StatWide, { key: 'm', value: p.matches, label: 'Partidos jugados', icon: 'trophy' }),
          h(StatWide, { key: 's', value: p.streak, label: 'Semanas', icon: 'flame', accent: 'var(--warning)' })
        ]),
        h('div', { key: 'hs', style: { flex: 1, minHeight: 0, padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' } }, [
          h('div', { key: 'h', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' } }, [
            h(Title, { key: 't', size: 24 }, 'Partidos recientes'),
            h('span', { key: 'a', style: { color: 'var(--accent)', fontSize: 15, fontWeight: 600, cursor: 'pointer' } }, 'Ver todos')
          ]),
          h('div', { key: 'g', style: { flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, overflow: 'hidden' } },
            data.MATCHES.slice(1, 5).map(function (m) { return h(MatchCardTall, { key: m.id, match: m, photoHeight: 138 }); }))
        ])
      ])
    ]);
  }

  /* ---------------- settings / edit profile ---------------- */
  var SETTINGS_NAV = [['user', 'Cuenta'], ['pencil', 'Editar perfil'], ['share', 'Compartir perfil']];
  function SettingsShell(props) {
    var d = DS(), Icon = d.Icon;
    return h(Frame, null, [
      h(TopBar, { key: 'tb', active: 'profile' }),
      h('div', { key: 'bd', style: { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' } }, [
        h('aside', { key: 'nav', style: { width: 320, flex: 'none', padding: '30px 22px', display: 'flex', flexDirection: 'column', gap: 22, boxShadow: 'inset -1px 0 0 var(--glass-border)' } }, [
          h('div', { key: 'h' }, [
            h(Overline, { key: 'o' }, 'Tu cuenta'),
            h(Title, { key: 't', size: 26, style: { marginTop: 10 } }, 'Ajustes')
          ]),
          h('div', { key: 'l', style: { display: 'flex', flexDirection: 'column', gap: 4 } }, SETTINGS_NAV.map(function (it, i) {
            var on = i === 0;
            return h('div', { key: it[1], style: { display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: on ? 'var(--glass)' : 'transparent', boxShadow: on ? 'var(--ring-glass)' : 'none', color: on ? '#fff' : 'var(--ink-46)' } }, [
              h(Icon, { key: 'i', name: it[0], size: 19, color: on ? 'var(--accent)' : 'currentColor' }),
              h('span', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 15.5, fontWeight: 600 } }, it[1])
            ]);
          })),
          h('div', { key: 'sp', style: { flex: 1 } }),
          h('div', { key: 'out', style: { display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--danger)', boxShadow: 'var(--ring-glass)' } }, [
            h(Icon, { key: 'i', name: 'x', size: 19 }),
            h('span', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 15.5, fontWeight: 600 } }, 'Cerrar sesión')
          ])
        ]),
        h('main', { key: 'main', style: { flex: 1, minWidth: 0, padding: '30px 36px', overflow: 'hidden' } }, props.children)
      ])
    ]);
  }
  // Mismo campo que login / registro: pill de 56px con glifo.
  function Field(props) {
    return h('label', { style: { display: 'block' } }, [
      h(Overline, { key: 'l', style: { marginBottom: 10 } }, props.label),
      h('div', { key: 'i', style: { display: 'flex', alignItems: 'center', gap: 12, height: 56, borderRadius: 99, background: 'var(--glass)', boxShadow: 'var(--ring-glass)', padding: '0 18px' } }, [
        props.glyph ? h('span', { key: 'g', style: { display: 'inline-flex', flex: 'none', color: 'var(--ink-46)' } }, glyph(props.glyph)) : null,
        h('span', { key: 't', style: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: props.value ? '#fff' : 'var(--ink-32)', fontFamily: 'var(--font-text)', fontSize: 17, fontWeight: 500 } }, props.value || props.placeholder)
      ]),
      props.hint ? h('div', { key: 'h', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: 8, paddingLeft: 18 } }, props.hint) : null
    ]);
  }
  function SettingsDesktop() {
    var d = DS(), Button = d.Button, Icon = d.Icon;
    var p = window.SM_DATA.PROFILE;
    function row(icon, label, sub, right) {
      return h('div', { key: label, style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--glass)', boxShadow: 'var(--ring-glass)' } }, [
        h('span', { key: 'i', style: { width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--glass-strong)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, h(Icon, { name: icon, size: 20 })),
        h('div', { key: 't', style: { flex: 1, minWidth: 0 } }, [
          h('div', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600, color: '#fff' } }, label),
          h('div', { key: 's', style: { font: 'var(--text-caption)', color: 'var(--ink-46)', marginTop: 3 } }, sub)
        ]),
        right || h(Icon, { name: 'chevron-right', size: 19, color: 'var(--ink-46)' })
      ]);
    }
    return h(SettingsShell, null, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 820 } }, [
      h('div', { key: 'hd' }, [
        h(Title, { key: 't', size: 28 }, 'Cuenta'),
        h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 15.5, color: 'var(--ink-64)', marginTop: 8 } }, 'Tu identidad pública en SportMatch.')
      ]),
      h('div', { key: 'card', style: { display: 'flex', alignItems: 'center', gap: 20, padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        h('img', { key: 'a', src: p.avatar, alt: p.name, style: { width: 78, height: 78, borderRadius: '50%', objectFit: 'cover', boxShadow: 'var(--ring-glass)' } }),
        h('div', { key: 't', style: { flex: 1, minWidth: 0 } }, [
          h('div', { key: 'n', style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#fff' } }, p.name),
          h('div', { key: 'e', style: { color: 'var(--ink-46)', fontSize: 15, marginTop: 4 } }, 'alex.moreno@gmail.com · ' + p.city)
        ]),
        h(Button, { key: 'b', variant: 'primary', iconLeft: 'pencil', style: { height: 46 } }, 'Editar perfil')
      ]),
      h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column', gap: 12 } }, [
        row('pencil', 'Editar perfil', 'Foto, nombre, ciudad y contraseña'),
        row('share', 'Compartir perfil', 'Enviá tu link de SportMatch')
      ])
    ]));
  }
  function EditProfileDesktop() {
    var d = DS(), Button = d.Button, Icon = d.Icon;
    var p = window.SM_DATA.PROFILE;
    return h(SettingsShell, null, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, height: '100%' } }, [
      h('div', { key: 'hd', style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' } }, [
        h('div', { key: 't' }, [
          h(Title, { key: 'h', size: 28 }, 'Editar perfil'),
          h('p', { key: 'p', style: { fontFamily: 'var(--font-text)', fontSize: 15.5, color: 'var(--ink-64)', marginTop: 8 } }, 'Foto, datos de contacto y contraseña.')
        ]),
        h('div', { key: 'a', style: { display: 'flex', gap: 12 } }, [
          h(Button, { key: 'c', variant: 'secondary', style: { height: 46 } }, 'Cancelar'),
          h(Button, { key: 's', variant: 'primary', iconLeft: 'check', style: { height: 46 } }, 'Guardar cambios')
        ])
      ]),
      h('div', { key: 'ph', style: { display: 'flex', alignItems: 'center', gap: 20, padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--glass)', boxShadow: 'var(--ring-glass), var(--inset-top-sheen)' } }, [
        h('div', { key: 'av', style: { position: 'relative', flex: 'none' } }, [
          h('img', { key: 'i', src: p.avatar, alt: '', style: { width: 92, height: 92, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 3px var(--bg-base), 0 0 0 6px var(--accent)' } }),
          h('span', { key: 'c', style: { position: 'absolute', right: -4, bottom: -4, width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' } }, h(Icon, { name: 'image', size: 17 }))
        ]),
        h('div', { key: 't', style: { flex: 1 } }, [
          h('div', { key: 'l', style: { fontFamily: 'var(--font-text)', fontSize: 16, fontWeight: 600, color: '#fff' } }, 'Foto de perfil'),
          h('div', { key: 's', style: { color: 'var(--ink-46)', fontSize: 14, marginTop: 4 } }, 'JPG o PNG, mínimo 400 × 400 px')
        ]),
        h(Button, { key: 'b', variant: 'secondary', style: { height: 44 } }, 'Subir foto')
      ]),
      h('div', { key: 'g1', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 } }, [
        h(Field, { key: 'n', label: 'Nombre', glyph: 'user', value: p.name }),
        h(Field, { key: 'e', label: 'Email', glyph: 'mail', value: 'alex.moreno@gmail.com' }),
        h(Field, { key: 'c', label: 'Ciudad', glyph: 'pin', value: p.city }),
      ]),
      h('div', { key: 'pw', style: { display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4 } }, [
        h(Overline, { key: 'o' }, 'Cambiar contraseña'),
        h('div', { key: 'g', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 } }, [
          h(Field, { key: 'c', label: 'Actual', glyph: 'lock', placeholder: '••••••••', hint: 'Dejalo vacío para mantenerla' }),
          h(Field, { key: 'n', label: 'Nueva', glyph: 'lock', placeholder: '••••••••', hint: 'Mínimo 8 caracteres' }),
          h(Field, { key: 'r', label: 'Repetir nueva', glyph: 'lock', placeholder: '••••••••' })
        ])
      ])
    ]));
  }

  var SCREENS = {
    login: function () { return h(AuthDesktop, { mode: 'login' }); },
    register: function () { return h(AuthDesktop, { mode: 'register' }); },
    map: function () { return h(MapDesktop, null); },
    discover: function () { return h(DiscoverDesktop, null); },
    detail: function () { return h(DetailDesktop, null); },
    create1: function () { return h(CreateDesktop, { step: 0 }); },
    create2: function () { return h(CreateDesktop, { step: 1 }); },
    create3: function () { return h(CreateDesktop, { step: 2 }); },
    create4: function () { return h(CreateDesktop, { step: 3 }); },
    create5: function () { return h(CreateDesktop, { step: 4 }); },
    matches: function () { return h(MatchesDesktop, null); },
    profile: function () { return h(ProfileDesktop, null); },
    settings: function () { return h(SettingsDesktop, null); },
    editprofile: function () { return h(EditProfileDesktop, null); }
  };

  function SportMatchDesktop(props) {
    var ready = !!(window.SM_DATA && (window.SportMatchDesignSystem_7eff40 || {}).Button && window.__smOverridesReady);
    var st = React.useReducer(function (n) { return n + 1; }, 0); var bump = st[1];
    React.useEffect(function () {
      if (ready) return;
      var t = setInterval(function () {
        if (window.SM_DATA && (window.SportMatchDesignSystem_7eff40 || {}).Button && window.__smOverridesReady) { clearInterval(t); bump(); }
      }, 60);
      return function () { clearInterval(t); };
    }, [ready]);
    if (!ready) return h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg-base)' } });
    var mk = SCREENS[props.screen] || SCREENS.map;
    return mk();
  }

  window.SportMatchDesktop = SportMatchDesktop;
  window.SM_DESKTOP_SIZE = { width: W, height: H };
})();
