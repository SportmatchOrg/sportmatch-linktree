/* SportMatch — App shell (router + overlays + toast).
   Consolidated from the design system UI kit so it can be mounted once
   via <x-import>. All screens, data and imagery live in the DS bundle
   (loaded in the host's <helmet>) under window globals + the
   SportMatchDesignSystem_7eff40 namespace. */
(function () {
  const NAV_ITEMS = [
    { key: 'map', icon: 'map', label: 'Mapa' },
    { key: 'swipe', icon: 'search', label: 'Descubrir' },
    { key: 'create', icon: 'plus', label: 'Crear', center: true },
    { key: 'matches', icon: 'calendar', label: 'Partidos' },
    { key: 'profile', icon: 'user', label: 'Perfil' },
  ];

  function AppShell(props) {
    props = props || {};
    const DS = window.SportMatchDesignSystem_7eff40 || {};
    const { BottomNav, Toast } = DS;
    const data = window.SM_DATA;

    // props.forceScreen (or ?screen=…) renders one screen standalone — used for
    // multi-frame design-tool exports where several shells mount on one page.
    const forced = props.forceScreen || (function () {
      try { return new URLSearchParams(location.search).get('screen'); } catch (e) { return null; }
    })();

    // Panel-only exports (settings / editprofile) still live on the profile tab.
    // 'create' or 'create1'…'create5' — the numbered form pins one wizard step,
    // so each step can be exported as its own static frame.
    const createMatch = /^create([1-9])?$/.exec(forced || '');
    const forcedCreateStep = createMatch && createMatch[1] ? Number(createMatch[1]) - 1 : 0;
    const forcedTab = forced === 'settings' || forced === 'editprofile' ? 'profile' : forced;
    const [tab, setTab] = React.useState(
      forcedTab && ['map', 'swipe', 'matches', 'profile', 'home', 'discover'].indexOf(forcedTab) >= 0
        ? forcedTab : 'map');
    const [detail, setDetail] = React.useState(null);
    const [create, setCreate] = React.useState(!!createMatch);
    const [joined, setJoined] = React.useState({ m1: true, m3: true });
    const [toast, setToast] = React.useState(null);
    const [lReady, setLReady] = React.useState(typeof window.L !== 'undefined');
    const [account, setAccount] = React.useState(() => {
      if (forced === 'login' || forced === 'register') return null;
      if (forced) return { name: 'Alex Moreno', email: 'alex.moreno@gmail.com' };
      try { return JSON.parse(localStorage.getItem('sm.account') || 'null'); } catch (e) { return null; }
    });
    React.useEffect(() => {
      if (forced === 'detail' && data && data.MATCHES) setDetail(data.MATCHES[0]);
      if (forced === 'settings' || forced === 'editprofile') {
        // Profile owns these panels; ask it to open one on mount.
        window.SM_FORCE_PANEL = forced;
      }
    }, []);
    const [, bump] = React.useReducer((n) => n + 1, 0);
    const toastTimer = React.useRef(null);

    React.useEffect(() => {
      if (window.__smOverridesReady) return;
      const onReady = () => bump();
      window.addEventListener('sm-overrides-ready', onReady);
      return () => window.removeEventListener('sm-overrides-ready', onReady);
    }, []);

    React.useEffect(() => {
      if (lReady) return;
      let t;
      const tick = () => {
        if (typeof window.L !== 'undefined') { setLReady(true); return; }
        t = setTimeout(tick, 80);
      };
      tick();
      return () => clearTimeout(t);
    }, [lReady]);

    if (!data || !BottomNav) {
      return React.createElement('div', {
        style: { position: 'absolute', inset: 0, background: '#000' }
      });
    }

    function flash(node) {
      setToast(node);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2800);
    }
    function openDetail(m) { setDetail(m); }
    function onSelect(key) {
      if (key === 'create') { setCreate(true); return; }
      setDetail(null);
      setTab(key);
    }
    function joinCurrent() {
      if (!detail) return;
      setJoined((j) => ({ ...j, [detail.id]: true }));
      flash(React.createElement(Toast, { tone: 'success' },
        'Est\u00e1s dentro. Nos vemos en la cancha \u26A1'));
    }
    function cancelSpot(m) {
      if (!m) return;
      setJoined((j) => { const n = { ...j }; delete n[m.id]; return n; });
      flash(React.createElement(Toast, { tone: 'danger' },
        'Lugar liberado \u00B7 ' + m.title));
    }
    function cancelHosted(m) {
      if (!m) return;
      flash(React.createElement(Toast, { tone: 'danger' },
        'Partido cancelado \u00B7 ' + m.title));
    }
    function publish(form) {
      setCreate(false);
      flash(React.createElement(Toast, { tone: 'success' },
        'Partido publicado \u00B7 ' + ((form.title || '').trim() || form.sport) + ' ' + form.day + ' ' + form.time));
    }
    function acceptMatch(m) {
      setJoined((j) => ({ ...j, [m.id]: true }));
      flash(React.createElement(Toast, { tone: 'success' },
        'Listo. ' + m.title + ' se sum\u00f3 a tus partidos \u26A1'));
    }

    const OVR = window.SM_OVR || {};
    const SwipeDeckC = OVR.SwipeDeck || window.SwipeDeck;
    const MapScreenC = OVR.MapScreen || window.MapScreen;
    const MatchDetailC = OVR.MatchDetail || window.MatchDetail;
    const CreateMatchC = OVR.CreateMatch || window.CreateMatch;
    const MatchesC = OVR.Matches || window.Matches;
    const ProfileC = OVR.Profile || window.Profile;
    const AuthScreenC = OVR.AuthScreen || window.AuthScreen;

    function signIn(acct) {
      const next = { email: acct.email };
      if (acct.name) next.name = acct.name;
      setAccount(next);
      try { localStorage.setItem('sm.account', JSON.stringify(next)); } catch (e) {}
      setTab('map');
      setDetail(null);
      setCreate(false);
    }
    function signOut() {
      setAccount(null);
      try { localStorage.removeItem('sm.account'); } catch (e) {}
    }

    const screens = {
      discover: React.createElement(window.Discover, { data, onOpen: openDetail }),
      matches: React.createElement(MatchesC, { data, joined, onOpen: openDetail, onTab: setTab, onCancel: cancelSpot, onCancelHosted: cancelHosted }),
      home: React.createElement(window.Home, { data, onOpen: openDetail, onTab: setTab }),
      swipe: React.createElement(SwipeDeckC, { data, onOpen: openDetail, onLike: acceptMatch }),
      map: lReady
        ? React.createElement(MapScreenC, { data, onOpen: openDetail })
        : React.createElement('div', { style: { position: 'absolute', inset: 0, background: '#0a0d12' } }),
      profile: React.createElement(ProfileC, {
        data, onOpen: openDetail, account, onLogout: signOut,
        forcePanel: forced === 'settings' ? 'settings' : forced === 'editprofile' ? 'edit' : null,
        onSaved: (pwChanged) => flash(React.createElement(Toast, { tone: 'success' },
          pwChanged ? 'Perfil y contrase\u00f1a actualizados' : 'Perfil actualizado'))
      }),
    };

    const overlay = detail || create;

    if (!account) {
      return React.createElement('div', { className: 'sm-screen-root' },
        AuthScreenC ? React.createElement(AuthScreenC, { onAuth: signIn, initialMode: forced === 'register' ? 'register' : 'login' }) : null,
        React.createElement(window.StatusBar, null),
        React.createElement(window.HomeIndicator, null)
      );
    }

    return React.createElement('div', { className: 'sm-screen-root' },
      screens[tab],
      detail ? React.createElement(MatchDetailC, {
        match: detail, joined: !!joined[detail.id],
        onClose: () => setDetail(null), onJoin: joinCurrent, onCancel: () => cancelSpot(detail)
      }) : null,
      create ? React.createElement(CreateMatchC, {
        data, initialStep: forcedCreateStep,
        onClose: () => setCreate(false), onPublish: publish
      }) : null,
      !overlay ? React.createElement(BottomNav, {
        items: NAV_ITEMS, active: tab, onSelect,
        // Wider pill: spans the 20px gutters instead of hugging its items.
        style: { left: 16, right: 16, transform: 'none', justifyContent: 'space-between', padding: '7px 16px' }
      }) : null,
      React.createElement('div', {
        style: {
          position: 'absolute', top: 64, left: 0, right: 0, display: 'flex',
          justifyContent: 'center', zIndex: 95, pointerEvents: 'none',
          transform: toast ? 'translateY(0)' : 'translateY(-140%)',
          opacity: toast ? 1 : 0,
          transition: 'transform 420ms cubic-bezier(0.34,1.56,0.64,1), opacity 240ms'
        }
      }, toast),
      React.createElement(window.StatusBar, null),
      React.createElement(window.HomeIndicator, null)
    );
  }

  window.SportMatchApp = AppShell;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SportMatchApp: AppShell };
  }
})();
