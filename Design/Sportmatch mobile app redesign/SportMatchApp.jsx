/* SportMatch — App shell (router + overlays + toast).
   Consolidated from the design system UI kit so it can be mounted once
   via <x-import>. All screens, data and imagery live in the DS bundle
   (loaded in the host's <helmet>) under window globals + the
   SportMatchDesignSystem_7eff40 namespace. */
(function () {
  const NAV_ITEMS = [
    { key: 'map', icon: 'map', label: 'Map' },
    { key: 'swipe', icon: 'layers', label: 'Swipe' },
    { key: 'create', icon: 'plus', label: 'Create', center: true },
    { key: 'matches', icon: 'calendar', label: 'Matches' },
    { key: 'profile', icon: 'user', label: 'Profile' },
  ];

  function AppShell() {
    const DS = window.SportMatchDesignSystem_7eff40 || {};
    const { BottomNav, Toast } = DS;
    const data = window.SM_DATA;

    const [tab, setTab] = React.useState('map');
    const [detail, setDetail] = React.useState(null);
    const [create, setCreate] = React.useState(false);
    const [joined, setJoined] = React.useState({ m1: true, m3: true });
    const [toast, setToast] = React.useState(null);
    const [lReady, setLReady] = React.useState(typeof window.L !== 'undefined');
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
        "You're in. See you on the " + detail.sport.toLowerCase() + " \u26A1"));
    }
    function publish(form) {
      setCreate(false);
      flash(React.createElement(Toast, { tone: 'success' },
        'Match published \u00B7 ' + form.sport + ' ' + form.day + ' ' + form.time));
    }
    function acceptMatch(m) {
      setJoined((j) => ({ ...j, [m.id]: true }));
      flash(React.createElement(Toast, { tone: 'success' },
        "You're in. " + m.title + " added to your matches \u26A1"));
    }

    const OVR = window.SM_OVR || {};
    const SwipeDeckC = OVR.SwipeDeck || window.SwipeDeck;
    const MapScreenC = OVR.MapScreen || window.MapScreen;
    const MatchDetailC = OVR.MatchDetail || window.MatchDetail;
    const CreateMatchC = OVR.CreateMatch || window.CreateMatch;
    const MatchesC = OVR.Matches || window.Matches;

    const screens = {
      discover: React.createElement(window.Discover, { data, onOpen: openDetail }),
      matches: React.createElement(MatchesC, { data, joined, onOpen: openDetail, onTab: setTab }),
      home: React.createElement(window.Home, { data, onOpen: openDetail, onTab: setTab }),
      swipe: React.createElement(SwipeDeckC, { data, onOpen: openDetail, onLike: acceptMatch }),
      map: lReady
        ? React.createElement(MapScreenC, { data, onOpen: openDetail })
        : React.createElement('div', { style: { position: 'absolute', inset: 0, background: '#0a0d12' } }),
      profile: React.createElement(window.Profile, { data, onOpen: openDetail }),
    };

    const overlay = detail || create;

    return React.createElement('div', { className: 'sm-screen-root' },
      screens[tab],
      detail ? React.createElement(MatchDetailC, {
        match: detail, joined: !!joined[detail.id],
        onClose: () => setDetail(null), onJoin: joinCurrent
      }) : null,
      create ? React.createElement(CreateMatchC, {
        data, onClose: () => setCreate(false), onPublish: publish
      }) : null,
      !overlay ? React.createElement(BottomNav, { items: NAV_ITEMS, active: tab, onSelect }) : null,
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
