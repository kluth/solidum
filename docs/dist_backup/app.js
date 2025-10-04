'use strict';
(() => {
  var Fe = 0,
    Ge = new Set(),
    xe = new Set(),
    Oe = !1;
  function He() {
    return Fe > 0;
  }
  function ee(t) {
    He() ? Ge.add(t) : t();
  }
  function te(t) {
    return Oe ? (xe.has(t) ? !1 : (xe.add(t), !0)) : !0;
  }
  var je = null,
    Ve = null,
    ve = null,
    we = null;
  function oe() {
    return Ve;
  }
  function re(t) {
    je?.onDependency(t);
  }
  function ne() {
    return we;
  }
  function ae(t, o) {
    ((ve = t), (we = o));
  }
  function ie(t) {
    ve?.onDependency(t);
  }
  function S(t) {
    let o = t,
      r = new Set();
    function n() {
      let a = Array.from(r);
      for (let l of a)
        if (te(l))
          try {
            l(o);
          } catch (d) {
            console.error('Error in atom subscriber:', d);
          }
    }
    function i(a) {
      if (arguments.length === 0) {
        let d = oe();
        if (d) {
          let m = i.subscribe(d);
          re(m);
        } else {
          let m = ne();
          if (m) {
            let u = i.subscribe(m);
            ie(u);
          }
        }
        return o;
      }
      let l = typeof a == 'function' ? a(o) : a;
      Object.is(l, o) || ((o = l), ee(n));
    }
    return (
      (i.subscribe = a => (
        r.add(a),
        () => {
          r.delete(a);
        }
      )),
      i
    );
  }
  function P(t) {
    let o = [],
      r = null,
      n = !1,
      i = !1;
    function a() {
      i || n || l();
    }
    function l() {
      if (!i) {
        if (n) {
          console.error('Effect is already running, skipping rerun');
          return;
        }
        n = !0;
        try {
          if (r) {
            try {
              r();
            } catch (m) {
              console.error('Error in effect cleanup:', m);
            }
            r = null;
          }
          for (let m of o) m();
          ((o = []),
            ae(
              {
                onDependency: m => {
                  o.push(m);
                },
              },
              a
            ));
          try {
            t(m => {
              r = m;
            });
          } catch (m) {
            console.error('Error in effect:', m);
          } finally {
            ae(null, null);
          }
        } finally {
          n = !1;
        }
      }
    }
    return (
      l(),
      () => {
        if (!i) {
          if (((i = !0), r))
            try {
              r();
            } catch (d) {
              console.error('Error in effect cleanup:', d);
            }
          for (let d of o) d();
          o = [];
        }
      }
    );
  }
  var Ce = new Map(),
    Ue = 0,
    Ne = new WeakMap(),
    Xe = new WeakMap(),
    G = null,
    se = 0;
  function le(t, o) {
    let r = Ne.get(t);
    r || ((r = new Map()), Ne.set(t, r), Xe.set(t, 0));
    let i = JSON.stringify(o || {})
        .split('')
        .reduce((l, d) => ((l << 5) - l + d.charCodeAt(0)) | 0, 0),
      a = r.get(i);
    return (a || ((a = `${t.name || 'Anonymous'}_${Ue++}`), r.set(i, a)), a);
  }
  function X(t) {
    ((G = t), (se = 0));
  }
  function Y() {
    ((G = null), (se = 0));
  }
  function h(t) {
    if (!G)
      return (
        console.warn('useState called outside component context - state will not persist'),
        S(typeof t == 'function' ? t() : t)
      );
    let o = Ce.get(G);
    o || ((o = []), Ce.set(G, o));
    let r = se++;
    if (r >= o.length) {
      let n = typeof t == 'function' ? t() : t;
      o.push(S(n));
    }
    return o[r];
  }
  var q = Symbol('Fragment');
  function e(t, o, ...r) {
    let n = o || {},
      i = ke(r)
        .filter(a => a != null && a !== !1)
        .map(Ye);
    return { type: t, props: n, children: i };
  }
  function ke(t) {
    let o = [];
    for (let r of t) Array.isArray(r) ? o.push(...ke(r)) : o.push(r);
    return o;
  }
  function Ye(t) {
    return qe(t) ? t : Ke(String(t));
  }
  function qe(t) {
    return t != null && typeof t == 'object' && 'type' in t && 'props' in t && 'children' in t;
  }
  function Ke(t) {
    return { type: 'TEXT_NODE', props: {}, children: [], text: t };
  }
  function Je(t) {
    return [
      'svg',
      'rect',
      'circle',
      'ellipse',
      'line',
      'polyline',
      'polygon',
      'path',
      'text',
      'tspan',
      'textPath',
      'g',
      'defs',
      'clipPath',
      'mask',
      'pattern',
      'linearGradient',
      'radialGradient',
      'stop',
      'image',
      'use',
      'symbol',
      'marker',
      'foreignObject',
      'switch',
      'foreignObject',
      'animate',
      'animateTransform',
      'set',
      'animateMotion',
      'mpath',
      'script',
      'style',
      'title',
      'desc',
      'metadata',
      'a',
      'altGlyph',
      'altGlyphDef',
      'altGlyphItem',
      'glyph',
      'glyphRef',
      'hkern',
      'vkern',
      'font',
      'font-face',
      'font-face-format',
      'font-face-name',
      'font-face-src',
      'font-face-uri',
      'missing-glyph',
      'feBlend',
      'feColorMatrix',
      'feComponentTransfer',
      'feComposite',
      'feConvolveMatrix',
      'feDiffuseLighting',
      'feDisplacementMap',
      'feDistantLight',
      'feDropShadow',
      'feFlood',
      'feFuncA',
      'feFuncB',
      'feFuncG',
      'feFuncR',
      'feGaussianBlur',
      'feImage',
      'feMerge',
      'feMergeNode',
      'feMorphology',
      'feOffset',
      'fePointLight',
      'feSpecularLighting',
      'feSpotLight',
      'feTile',
      'feTurbulence',
      'filter',
      'hatch',
      'hatchpath',
      'mesh',
      'meshgradient',
      'meshpatch',
      'meshrow',
      'radialGradient',
      'solidcolor',
      'view',
    ].includes(t.toLowerCase());
  }
  function E(t, o = window.document) {
    if (t.type === 'TEXT_NODE') return o.createTextNode(t.text || '');
    if (t.type === q) {
      let i = '__contextId' in t && '__contextValue' in t;
      try {
        let a = o.createDocumentFragment();
        for (let l of t.children) a.appendChild(E(l, o));
        return a;
      } finally {
      }
    }
    if (typeof t.type == 'function') {
      let i = le(t.type, t.props);
      if (typeof window < 'u') {
        let a = o.createElement('span');
        a.style.display = 'contents';
        let l = null;
        return (
          P(() => {
            X(i);
            try {
              let d = {
                  ...t.props,
                  children:
                    t.children.length === 1
                      ? t.children[0]
                      : t.children.length > 0
                        ? t.children
                        : void 0,
                },
                m = t.type(d);
              if (m) {
                let u = E(m, o);
                (l ? a.replaceChild(u, l) : a.appendChild(u), (l = u));
              }
            } finally {
              Y();
            }
          }),
          a
        );
      } else {
        X(i);
        try {
          let a = {
              ...t.props,
              children:
                t.children.length === 1
                  ? t.children[0]
                  : t.children.length > 0
                    ? t.children
                    : void 0,
            },
            l = t.type(a);
          return l ? E(l, o) : o.createTextNode('');
        } finally {
          Y();
        }
      }
    }
    let r = t.type,
      n = Je(r) ? o.createElementNS('http://www.w3.org/2000/svg', r) : o.createElement(r);
    Qe(n, t.props);
    for (let i of t.children) n.appendChild(E(i, o));
    return n;
  }
  function Qe(t, o) {
    for (let [r, n] of Object.entries(o))
      if (n != null && r !== 'children')
        if (r === 'className') t.setAttribute('class', String(n));
        else if (r === 'style' && typeof n == 'object') Ze(t, n);
        else if (r.startsWith('on') && typeof n == 'function') {
          let i = r.substring(2).toLowerCase();
          t.addEventListener(i, n);
        } else
          typeof n == 'boolean' ? n && t.setAttribute(r, String(n)) : t.setAttribute(r, String(n));
  }
  function Ze(t, o) {
    for (let [r, n] of Object.entries(o)) n != null && (t.style[r] = n);
  }
  var Se = null;
  function K(t, o, r = window.document) {
    let n = null;
    return P(a => {
      let l = { onMountCallbacks: [], onCleanupCallbacks: [] };
      Se = l;
      try {
        let d = o();
        if (d) {
          let m = E(d, r);
          (n && t.removeChild(n), t.appendChild(m), (n = m));
          for (let u of l.onMountCallbacks) u();
        }
        a(() => {
          for (let m of l.onCleanupCallbacks) m();
          n && (t.removeChild(n), (n = null));
        });
      } finally {
        Se = null;
      }
    });
  }
  var O = S('/'),
    z = {};
  function ze(t) {
    z = t.routes;
    let o = t.initialPath || window.location.pathname;
    return (
      z[o] &&
        (O(o),
        window.dispatchEvent(
          new CustomEvent('routechange', { detail: { path: o, component: z[o] } })
        )),
      window.addEventListener('popstate', r => {
        let n = r.state?.path || window.location.pathname;
        z[n] &&
          (O(n),
          window.dispatchEvent(
            new CustomEvent('routechange', { detail: { path: n, component: z[n] } })
          ));
      }),
      { navigate: r => T(r), getCurrentPage: () => tt(), getCurrentPath: () => O() }
    );
  }
  function T(t) {
    z[t] &&
      (O(t),
      window.history.pushState({ path: t }, '', t),
      window.dispatchEvent(
        new CustomEvent('routechange', { detail: { path: t, component: z[t] } })
      ));
  }
  function tt() {
    return z[O()] || 'HomePage';
  }
  function Te(t) {
    if (t == null || t === !1 || t === '') return [];
    if (typeof t == 'string' || typeof t == 'number') return [String(t)];
    if (Array.isArray(t)) {
      let o = [];
      for (let r of t) o.push(...Te(r));
      return o;
    }
    if (typeof t == 'object') {
      let o = [];
      for (let [r, n] of Object.entries(t)) n && o.push(r);
      return o;
    }
    return [];
  }
  function c(...t) {
    let o = [];
    for (let r of t) o.push(...Te(r));
    return o.join(' ');
  }
  var Me =
    typeof process < 'u' &&
    process.stdout &&
    process.stdout.isTTY &&
    process.env.TERM !== 'dumb' &&
    !process.env.NO_COLOR;
  function p(t, o) {
    return Me ? r => `\x1B[${t}m${r}\x1B[${o}m` : r => String(r);
  }
  var ot = {
    black: p(30, 39),
    red: p(31, 39),
    green: p(32, 39),
    yellow: p(33, 39),
    blue: p(34, 39),
    magenta: p(35, 39),
    cyan: p(36, 39),
    white: p(37, 39),
    gray: p(90, 39),
    bgBlack: p(40, 49),
    bgRed: p(41, 49),
    bgGreen: p(42, 49),
    bgYellow: p(43, 49),
    bgBlue: p(44, 49),
    bgMagenta: p(45, 49),
    bgCyan: p(46, 49),
    bgWhite: p(47, 49),
    bold: p(1, 22),
    dim: p(2, 22),
    italic: p(3, 23),
    underline: p(4, 24),
    inverse: p(7, 27),
    hidden: p(8, 28),
    strikethrough: p(9, 29),
    reset: p(0, 0),
    isColorSupported: Me,
  };
  function w(t) {
    let {
        variant: o = 'primary',
        size: r = 'md',
        disabled: n = !1,
        children: i,
        className: a,
        onClick: l,
        ...d
      } = t,
      m = c(
        'solidum-button',
        `solidum-button--${o}`,
        `solidum-button--${r}`,
        { 'solidum-button--disabled': n },
        a
      );
    return e('button', { className: m, disabled: n, type: 'button', onClick: l, ...d }, i);
  }
  function b(t) {
    let {
        bordered: o = !0,
        hoverable: r = !1,
        padding: n = 'md',
        children: i,
        className: a,
        ...l
      } = t,
      d = c(
        'solidum-card',
        {
          'solidum-card--bordered': o,
          'solidum-card--hoverable': r,
          [`solidum-card--padding-${n}`]: n,
        },
        a
      );
    return e('div', { className: d, ...l }, i);
  }
  function C(t) {
    let {
      variant: o = 'primary',
      size: r = 'md',
      dot: n = !1,
      pulse: i = !1,
      glow: a = !1,
      children: l,
      className: d,
      ...m
    } = t;
    return e(
      'span',
      {
        className: c(
          'solidum-badge',
          `solidum-badge--${o}`,
          `solidum-badge--${r}`,
          { 'solidum-badge--dot': n, 'solidum-badge--pulse': i, 'solidum-badge--glow': a },
          d
        ),
        ...m,
      },
      l
    );
  }
  function H(t) {
    let {
        src: o,
        alt: r = '',
        fallback: n,
        size: i = 'md',
        variant: a = 'circle',
        status: l,
        bordered: d = !1,
        glow: m = !1,
        className: u,
        ...k
      } = t,
      M = n || r.slice(0, 2).toUpperCase();
    return e(
      'div',
      {
        className: c(
          'solidum-avatar',
          `solidum-avatar--${i}`,
          `solidum-avatar--${a}`,
          { 'solidum-avatar--bordered': d, 'solidum-avatar--glow': m },
          u
        ),
        ...k,
      },
      o
        ? e('img', { src: o, alt: r, className: 'solidum-avatar-image' })
        : e('span', { className: 'solidum-avatar-fallback' }, M),
      l && e('span', { className: c('solidum-avatar-status', `solidum-avatar-status--${l}`) })
    );
  }
  function x(t) {
    let { maxWidth: o = 'lg', padding: r = !0, children: n, className: i, ...a } = t,
      l = c('solidum-container', `solidum-container--${o}`, { 'solidum-container--padding': r }, i);
    return e('div', { className: l, ...a }, n);
  }
  function $(t) {
    let {
        direction: o = 'vertical',
        spacing: r = 'md',
        align: n = 'stretch',
        justify: i = 'start',
        wrap: a = !1,
        children: l,
        className: d,
        ...m
      } = t,
      u = c(
        'solidum-stack',
        `solidum-stack--${o}`,
        `solidum-stack--spacing-${r}`,
        `solidum-stack--align-${n}`,
        `solidum-stack--justify-${i}`,
        { 'solidum-stack--wrap': a },
        d
      );
    return e('div', { className: u, ...m }, l);
  }
  function ce(t) {
    let {
        checked: o = !1,
        disabled: r = !1,
        size: n = 'md',
        label: i,
        className: a,
        onChange: l,
        ...d
      } = t,
      m = h(o),
      u = () => {
        if (!r) {
          let k = !m();
          (m(k), l?.(k));
        }
      };
    return e(
      'label',
      { className: c('solidum-switch-wrapper', a) },
      e(
        'button',
        {
          type: 'button',
          role: 'switch',
          'aria-checked': m(),
          className: c('solidum-switch', `solidum-switch--${n}`, {
            'solidum-switch--checked': m(),
            'solidum-switch--disabled': r,
          }),
          disabled: r,
          onClick: u,
          ...d,
        },
        e('span', { className: 'solidum-switch-thumb' })
      ),
      i && e('span', { className: 'solidum-switch-label' }, i)
    );
  }
  function me(t) {
    let {
        value: o,
        max: r = 100,
        size: n = 'md',
        variant: i = 'default',
        showLabel: a = !1,
        color: l = 'primary',
        glow: d = !1,
        className: m,
      } = t,
      u = Math.min(Math.max((o / r) * 100, 0), 100);
    return e(
      'div',
      { className: c('solidum-progress-wrapper', m) },
      e(
        'div',
        {
          className: c(
            'solidum-progress',
            `solidum-progress--${n}`,
            `solidum-progress--${i}`,
            `solidum-progress--${l}`,
            { 'solidum-progress--glow': d }
          ),
          role: 'progressbar',
          'aria-valuenow': o,
          'aria-valuemin': 0,
          'aria-valuemax': r,
        },
        e('div', { className: 'solidum-progress-bar', style: { width: `${u}%` } })
      ),
      a && e('span', { className: 'solidum-progress-label' }, `${Math.round(u)}%`)
    );
  }
  function de(t) {
    let {
      size: o = 'md',
      variant: r = 'default',
      color: n = 'primary',
      label: i,
      className: a,
    } = t;
    return e(
      'div',
      { className: c('solidum-spinner-wrapper', a) },
      e('div', {
        className: c(
          'solidum-spinner',
          `solidum-spinner--${o}`,
          `solidum-spinner--${r}`,
          `solidum-spinner--${n}`
        ),
        role: 'status',
        'aria-label': i || 'Loading',
      }),
      i && e('span', { className: 'solidum-spinner-label' }, i)
    );
  }
  function ue(t) {
    let {
        tabs: o,
        defaultTab: r,
        variant: n = 'line',
        animated: i = !0,
        className: a,
        onChange: l,
      } = t,
      d = h(r || o[0]?.id),
      m = u => {
        (d(u), l?.(u));
      };
    return e(
      'div',
      { className: c('solidum-tabs', `solidum-tabs--${n}`, a) },
      e(
        'div',
        { className: 'solidum-tabs-list', role: 'tablist' },
        ...o.map(u =>
          e(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': u.id === d(),
              className: c('solidum-tab', {
                'solidum-tab--active': u.id === d(),
                'solidum-tab--disabled': u.disabled,
              }),
              disabled: u.disabled,
              onClick: () => !u.disabled && m(u.id),
            },
            u.icon && e('span', { className: 'solidum-tab-icon' }, u.icon),
            u.label
          )
        )
      ),
      e(
        'div',
        { className: 'solidum-tabs-panels' },
        e(
          'div',
          {
            className: c('solidum-tabs-content', 'solidum-tabs-content--active', {
              'solidum-tabs-content--animated': i,
            }),
            role: 'tabpanel',
          },
          o.find(u => u.id === d())?.content
        )
      )
    );
  }
  function fe(t) {
    let {
        columns: o,
        data: r,
        draggableRows: n = !0,
        sortable: i = !0,
        striped: a = !0,
        hoverable: l = !0,
        bordered: d = !1,
        compact: m = !1,
        stickyHeader: u = !0,
        animated: k = !0,
        className: M,
        onSort: A,
        onRowDrag: I,
      } = t,
      L = h(null),
      _ = h('asc'),
      B = h(null),
      W = h(null),
      R = s => {
        if (!i) return;
        let f = L() === s && _() === 'asc' ? 'desc' : 'asc';
        (L(s), _(f), A?.(s, f));
      },
      Q = s => f => {
        (B(s), f.dataTransfer && (f.dataTransfer.effectAllowed = 'move'));
      },
      F = s => f => {
        (f.preventDefault(), W(s));
      },
      D = s => f => {
        f.preventDefault();
        let g = B();
        (g !== null && g !== s && I?.(g, s), B(null), W(null));
      };
    return e(
      'div',
      { className: c('solidum-datatable-wrapper', M) },
      e(
        'table',
        {
          className: c('solidum-datatable', {
            'solidum-datatable--striped': a,
            'solidum-datatable--hoverable': l,
            'solidum-datatable--bordered': d,
            'solidum-datatable--compact': m,
            'solidum-datatable--animated': k,
          }),
        },
        e(
          'thead',
          { className: c({ 'solidum-datatable-header--sticky': u }) },
          e(
            'tr',
            {},
            n && e('th', { className: 'solidum-datatable-drag-handle' }),
            ...o.map(s =>
              e(
                'th',
                {
                  className: c('solidum-datatable-header', {
                    'solidum-datatable-header--sortable': i && s.sortable !== !1,
                    'solidum-datatable-header--sorted': L() === s.key,
                  }),
                  style: s.width ? { width: s.width } : {},
                  onClick: i && s.sortable !== !1 ? () => R(s.key) : void 0,
                },
                s.header,
                i &&
                  s.sortable !== !1 &&
                  L() === s.key &&
                  e(
                    'span',
                    { className: 'solidum-datatable-sort-icon' },
                    _() === 'asc' ? ' \u25B2' : ' \u25BC'
                  )
              )
            )
          )
        ),
        e(
          'tbody',
          {},
          ...r.map((s, f) =>
            e(
              'tr',
              {
                className: c('solidum-datatable-row', {
                  'solidum-datatable-row--dragging': B() === f,
                  'solidum-datatable-row--drag-over': W() === f,
                }),
                draggable: n,
                onDragStart: n ? Q(f) : void 0,
                onDragOver: n ? F(f) : void 0,
                onDrop: n ? D(f) : void 0,
              },
              n && e('td', { className: 'solidum-datatable-drag-handle' }, '\u22EE\u22EE'),
              ...o.map(g => {
                let y = s[g.key],
                  v = g.render ? g.render(y, s) : y;
                return e('td', { className: 'solidum-datatable-cell' }, v);
              })
            )
          )
        )
      ),
      n && e('div', { className: 'solidum-datatable-hint' }, '\u2195 Drag rows to reorder')
    );
  }
  function pe(t) {
    let {
        data: o,
        type: r = 'bar',
        width: n = 600,
        height: i = 400,
        interactive: a = !0,
        animated: l = !0,
        showGrid: d = !0,
        perspective: m = 1e3,
        rotation: u = { x: 20, y: 30, z: 0 },
        className: k,
      } = t,
      M = h(u),
      A = h(!1),
      I = h({ x: 0, y: 0 }),
      L = s => {
        a && (A(!0), I({ x: s.clientX, y: s.clientY }));
      },
      _ = s => {
        if (A() && a) {
          let f = s.clientX - I().x,
            g = s.clientY - I().y,
            y = M();
          (M({ x: y.x + g * 0.5, y: y.y + f * 0.5, z: y.z }), I({ x: s.clientX, y: s.clientY }));
        }
      },
      B = () => {
        A(!1);
      },
      W = Math.max(...o.map(s => s.x)),
      R = Math.max(...o.map(s => s.y)),
      Q = o[0]?.z !== void 0 ? Math.max(...o.map(s => s.z || 0)) : R,
      F = Math.min(n, i) / 3,
      D = (s, f, g) => {
        let y = M(),
          v = (s / W - 0.5) * F,
          he = (f / R - 0.5) * F,
          be = (g / Q - 0.5) * F,
          V = (y.x * Math.PI) / 180,
          U = (y.y * Math.PI) / 180,
          $e = v * Math.cos(U) - be * Math.sin(U),
          ye = v * Math.sin(U) + be * Math.cos(U),
          _e = he * Math.cos(V) - ye * Math.sin(V),
          Re = he * Math.sin(V) + ye * Math.cos(V),
          Z = m / (m + Re);
        return { x: $e * Z + n / 2, y: _e * Z + i / 2, scale: Z };
      };
    return e(
      'div',
      { className: c('solidum-chart3d-wrapper', k) },
      e(
        'svg',
        {
          className: c('solidum-chart3d', {
            'solidum-chart3d--animated': l,
            'solidum-chart3d--interactive': a,
          }),
          width: n,
          height: i,
          xmlns: 'http://www.w3.org/2000/svg',
          onMouseDown: L,
          onMouseMove: _,
          onMouseUp: B,
          onMouseLeave: B,
          style: { cursor: a ? (A() ? 'grabbing' : 'grab') : 'default' },
        },
        e('rect', { width: n, height: i, fill: '#0a0e27', rx: 8 }),
        d &&
          e(
            'g',
            { className: 'solidum-chart3d-grid', opacity: 0.2 },
            ...[...Array(10)].map((s, f) => {
              let g = (f / 10) * R,
                y = D(0, g, 0),
                v = D(W, g, 0);
              return e('line', {
                x1: y.x,
                y1: y.y,
                x2: v.x,
                y2: v.y,
                stroke: '#667eea',
                strokeWidth: 1,
              });
            })
          ),
        r === 'bar' &&
          e(
            'g',
            { className: 'solidum-chart3d-bars' },
            ...o.map((s, f) => {
              let g = D(s.x, 0, s.z || 0),
                y = D(s.x, s.y, s.z || 0),
                v = 20 * g.scale;
              return e(
                'g',
                {},
                e('rect', {
                  x: g.x - v / 2,
                  y: y.y,
                  width: v,
                  height: Math.abs(g.y - y.y),
                  fill: s.color || `hsl(${(f / o.length) * 360}, 70%, 60%)`,
                  opacity: 0.8,
                  rx: 4,
                }),
                e('rect', {
                  x: g.x - v / 2,
                  y: y.y,
                  width: v,
                  height: Math.abs(g.y - y.y),
                  fill: 'url(#barGlow)',
                  opacity: 0.3,
                  rx: 4,
                })
              );
            })
          ),
        r === 'scatter' &&
          e(
            'g',
            { className: 'solidum-chart3d-scatter' },
            ...o.map(s => {
              let f = D(s.x, s.y, s.z || 0),
                g = 8 * f.scale;
              return e(
                'g',
                {},
                e('circle', {
                  cx: f.x,
                  cy: f.y,
                  r: g * 2,
                  fill: s.color || '#667eea',
                  opacity: 0.2,
                }),
                e('circle', { cx: f.x, cy: f.y, r: g, fill: s.color || '#667eea', opacity: 0.9 })
              );
            })
          ),
        e(
          'defs',
          {},
          e(
            'linearGradient',
            { id: 'barGlow', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
            e('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: 0.8 }),
            e('stop', { offset: '100%', stopColor: '#ffffff', stopOpacity: 0 })
          )
        )
      ),
      a && e('div', { className: 'solidum-chart3d-hint' }, '\u{1F504} Drag to rotate')
    );
  }
  function N(t) {
    let {
      blur: o = 'md',
      tint: r = 'light',
      bordered: n = !0,
      hoverable: i = !0,
      glow: a = !1,
      animated: l = !0,
      children: d,
      className: m,
      ...u
    } = t;
    return e(
      'div',
      {
        className: c(
          'solidum-glass-card',
          `solidum-glass-card--blur-${o}`,
          `solidum-glass-card--tint-${r}`,
          {
            'solidum-glass-card--bordered': n,
            'solidum-glass-card--hoverable': i,
            'solidum-glass-card--glow': a,
            'solidum-glass-card--animated': l,
          },
          m
        ),
        ...u,
      },
      d
    );
  }
  function Be() {
    return e(
      'div',
      { className: 'components-page' },
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '4rem 0',
            textAlign: 'center',
          },
        },
        e(
          x,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F3A8} Rich UI Library'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            '20+ production-ready components with wild interactive features'
          ),
          e(w, { variant: 'secondary', size: 'lg', onClick: () => T('/') }, '\u2190 Back to Home')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          x,
          { maxWidth: 'xl' },
          e(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
              },
            },
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', margin: 0, color: '#667eea' } },
                  '\u{1F4CA} Chart3D'
                ),
                e(C, { variant: 'gradient', size: 'sm', glow: !0 }, 'Wild!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Interactive 3D charts with drag-to-rotate functionality.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Animated, Interactive, Responsive'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', margin: 0, color: '#667eea' } },
                  '\u{1F4CB} DataTable'
                ),
                e(C, { variant: 'gradient', size: 'sm', glow: !0 }, 'Wild!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Drag-and-drop table with sorting and filtering.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Draggable, Sortable, Filterable'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u2728 GlassCard'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Glassmorphism effects with backdrop blur and gradients.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Blur effects, Gradient tints, Animations'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', margin: 0, color: '#667eea' } },
                  '\u{1FA9F} Modal'
                ),
                e(C, { variant: 'success', size: 'sm' }, 'Interactive')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Accessible modal dialogs with backdrop and animations.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Accessible, Animated, Backdrop'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F518} Button'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Flexible button component with multiple variants and sizes.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Variants, Sizes, States, Icons'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F500} Switch'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Toggle switch component with smooth animations.'
              ),
              e(
                'div',
                { style: { fontSize: '0.9rem', color: '#9ca3af' } },
                'Features: Animated, Accessible, Customizable'
              )
            )
          )
        )
      )
    );
  }
  var De = typeof window < 'u',
    Ae = S((De && localStorage.getItem('solidum-theme')) || 'default');
  function j() {
    return Ae();
  }
  function Ie(t) {
    if (!De) return;
    (Ae(t), localStorage.setItem('solidum-theme', t));
    let o = document.getElementById('theme-stylesheet');
    (o && (o.href = t === 'chalk' ? './chalk-styles.css' : './styles.css'),
      document.body.classList.remove('chalk-theme', 'default-theme'),
      document.body.classList.add(`${t}-theme`),
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t } })));
  }
  function Le() {
    let t = () => {
        let a = j() === 'default' ? 'chalk' : 'default';
        Ie(a);
      },
      o = j();
    return e(
      'div',
      {
        className: 'theme-switcher',
        style: { position: 'fixed', top: '20px', right: '20px', zIndex: '1000' },
      },
      e(
        w,
        { variant: o === 'chalk' ? 'success' : 'primary', size: 'sm', onClick: t },
        o === 'chalk' ? '\u{1F4D0} Switch to Default' : '\u{1F3A8} Switch to Chalkboard'
      )
    );
  }
  function ge() {
    let t = [
        { x: 1, y: 20, z: 10, label: 'A' },
        { x: 2, y: 35, z: 15, label: 'B' },
        { x: 3, y: 25, z: 8, label: 'C' },
        { x: 4, y: 45, z: 20, label: 'D' },
        { x: 5, y: 30, z: 12, label: 'E' },
      ],
      o = [
        { key: 'name', header: 'Component', sortable: !0 },
        { key: 'category', header: 'Category', sortable: !0 },
        { key: 'interactive', header: 'Interactive', render: n => (n ? '\u2713' : '\u2717') },
      ],
      r = [
        { name: 'Chart3D', category: 'Data Display', interactive: !0 },
        { name: 'DataTable', category: 'Data Display', interactive: !0 },
        { name: 'ParticleBackground', category: 'Effects', interactive: !0 },
        { name: 'GlassCard', category: 'Layout', interactive: !1 },
        { name: 'Modal', category: 'Feedback', interactive: !0 },
      ];
    return e(
      'div',
      { className: 'home-page', style: { position: 'relative', overflow: 'hidden' } },
      Le(),
      e(
        'section',
        {
          className: 'hero',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '8rem 0',
            textAlign: 'center',
            position: 'relative',
          },
        },
        e(
          x,
          { maxWidth: 'lg' },
          e(
            $,
            { spacing: 'lg', align: 'center' },
            e(
              'h1',
              {
                style: {
                  fontSize: '4.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                },
              },
              'Solidum'
            ),
            e(
              'p',
              {
                style: {
                  fontSize: '1.75rem',
                  opacity: '0.95',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                },
              },
              'A Fine-Grained Reactive JavaScript Framework'
            ),
            e(
              'p',
              { style: { fontSize: '1.25rem', opacity: '0.85', marginBottom: '2rem' } },
              '\u2728 Now with 20+ Wild Interactive Components \u2728'
            ),
            e(
              $,
              { direction: 'horizontal', spacing: 'md' },
              e(w, { variant: 'secondary', size: 'lg' }, 'Get Started'),
              e(w, { variant: 'outline', size: 'lg' }, 'View on GitHub')
            )
          )
        )
      ),
      e(
        'section',
        {
          style: { padding: '4rem 0', background: '#1a1a2e', color: 'white', position: 'relative' },
        },
        e(
          x,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F525} Wild Interactive Components'
          ),
          e(
            'p',
            {
              style: {
                textAlign: 'center',
                fontSize: '1.25rem',
                marginBottom: '3rem',
                opacity: '0.8',
              },
            },
            'Drag, rotate, and interact with these components!'
          ),
          e(ue, {
            tabs: [
              {
                id: 'chart3d',
                label: '3D Chart',
                icon: '\u{1F4CA}',
                content: e(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '2rem',
                      background: '#0a0e27',
                      borderRadius: '1rem',
                    },
                  },
                  e(pe, {
                    data: t,
                    type: 'bar',
                    width: 700,
                    height: 450,
                    interactive: !0,
                    animated: !0,
                    showGrid: !0,
                  })
                ),
              },
              {
                id: 'datatable',
                label: 'Drag & Drop Table',
                icon: '\u{1F4CB}',
                content: e(fe, {
                  columns: o,
                  data: r,
                  draggableRows: !0,
                  sortable: !0,
                  striped: !0,
                  hoverable: !0,
                  animated: !0,
                }),
              },
              {
                id: 'glassmorphism',
                label: 'Glassmorphism',
                icon: '\u2728',
                content: e(
                  'div',
                  {
                    style: {
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      padding: '3rem',
                      borderRadius: '1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '2rem',
                    },
                  },
                  e(
                    N,
                    { blur: 'lg', tint: 'light', hoverable: !0, glow: !0, animated: !0 },
                    e('h3', { style: { marginBottom: '1rem', color: '#1a1a2e' } }, 'Light Glass'),
                    e('p', { style: { color: '#4a4a6a' } }, 'Hover me for effects!')
                  ),
                  e(
                    N,
                    { blur: 'xl', tint: 'dark', hoverable: !0, bordered: !0 },
                    e('h3', { style: { marginBottom: '1rem' } }, 'Dark Glass'),
                    e('p', { style: { opacity: '0.8' } }, 'With backdrop blur')
                  ),
                  e(
                    N,
                    { blur: 'md', tint: 'gradient', hoverable: !0, glow: !0, animated: !0 },
                    e('h3', { style: { marginBottom: '1rem' } }, 'Gradient Glass'),
                    e('p', { style: { opacity: '0.9' } }, 'Animated float effect')
                  )
                ),
              },
            ],
            variant: 'pills',
            animated: !0,
          })
        )
      ),
      e(
        'section',
        { style: { padding: '5rem 0', background: '#f9fafb' } },
        e(
          x,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            'Why Solidum?'
          ),
          e(
            'p',
            {
              style: {
                textAlign: 'center',
                fontSize: '1.25rem',
                marginBottom: '3rem',
                color: '#6b7280',
              },
            },
            'A complete framework with everything you need'
          ),
          e(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              },
            },
            e(
              b,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => T('/reactivity'),
                style: { cursor: 'pointer' },
              },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                  '\u26A1 Fine-Grained Reactivity'
                ),
                e(C, { variant: 'gradient', size: 'sm', glow: !0 }, 'Core')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Efficient updates with atom, computed, and effect primitives. Only what changes gets updated.'
              ),
              e(me, { value: 95, variant: 'gradient', showLabel: !0, glow: !0 })
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3AF} Simple API'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Intuitive and easy to learn. Start building reactive applications in minutes.'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F4E6} Lightweight'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Small bundle size with zero dependencies. Perfect for performance-critical applications.'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F527} Extensible'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Build your own UI libraries, state management solutions, and more on top of Solidum.'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u2728 Type-Safe'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Fully typed with TypeScript for excellent developer experience and fewer bugs.'
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                  '\u{1F9EA} Well-Tested'
                ),
                e(C, { variant: 'success', size: 'sm' }, '104 Tests')
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Comprehensive test suite with 100+ tests ensuring reliability and stability.'
              )
            ),
            e(
              b,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => T('/components'),
                style: { cursor: 'pointer' },
              },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                  '\u{1F3A8} Rich UI Library'
                ),
                e(C, { variant: 'gradient', size: 'sm', pulse: !0 }, 'NEW!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                '20+ production-ready components including 3D charts, drag-and-drop tables, and particle effects.'
              ),
              e(
                'div',
                { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } },
                e(H, { size: 'sm', fallback: 'UI', status: 'online', glow: !0 }),
                e(H, { size: 'sm', fallback: '3D', variant: 'rounded' }),
                e(H, { size: 'sm', fallback: 'DND', status: 'online' }),
                e(de, { size: 'sm', variant: 'default' })
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  },
                },
                e(
                  'h3',
                  { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                  '\u{1F3AE} Interactive'
                ),
                e(C, { variant: 'warning', size: 'sm', glow: !0 }, 'Wild!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Drag-to-rotate 3D charts, reorderable tables, mouse-interactive particles, and more!'
              ),
              e(ce, { size: 'md', label: 'Try me!' })
            )
          )
        )
      ),
      e(
        'section',
        {
          style: {
            padding: '4rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        },
        e(
          x,
          { maxWidth: 'lg' },
          e(
            'h2',
            {
              style: {
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '3rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F4CA} Component Library Stats'
          ),
          e(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                textAlign: 'center',
              },
            },
            e(
              N,
              { blur: 'lg', tint: 'light', bordered: !0 },
              e(
                'div',
                { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#667eea' } },
                '20+'
              ),
              e(
                'div',
                { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } },
                'Components'
              )
            ),
            e(
              N,
              { blur: 'lg', tint: 'light', bordered: !0 },
              e(
                'div',
                { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#764ba2' } },
                '4'
              ),
              e(
                'div',
                { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } },
                'Wild Features'
              )
            ),
            e(
              N,
              { blur: 'lg', tint: 'light', bordered: !0 },
              e(
                'div',
                { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#667eea' } },
                '1.6k'
              ),
              e(
                'div',
                { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } },
                'CSS Lines'
              )
            ),
            e(
              N,
              { blur: 'lg', tint: 'light', bordered: !0 },
              e(
                'div',
                { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#764ba2' } },
                '0'
              ),
              e(
                'div',
                { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } },
                'Dependencies'
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '5rem 0' } },
        e(
          x,
          { maxWidth: 'md' },
          e(
            'h2',
            { style: { fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem' } },
            'Quick Example'
          ),
          e(
            'pre',
            {
              style: {
                background: '#1f2937',
                color: '#f3f4f6',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
              },
            },
            e(
              'code',
              null,
              `import { atom, computed, effect } from '@sldm/core';

// Create reactive state
const count = atom(0);
const doubled = computed(() => count() * 2);

// React to changes
effect(() => {
  console.log(\`Count: \${count()}, Doubled: \${doubled()}\`);
});

// Update state
count(5); // Console: Count: 5, Doubled: 10`
            )
          )
        )
      ),
      e(
        'footer',
        {
          style: { background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' },
        },
        e(
          x,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function We() {
    return e(
      'div',
      { className: 'reactivity-page' },
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '4rem 0',
            textAlign: 'center',
          },
        },
        e(
          x,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u26A1 Fine-Grained Reactivity'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Efficient updates with atom, computed, and effect primitives'
          ),
          e(w, { variant: 'secondary', size: 'lg', onClick: () => T('/') }, '\u2190 Back to Home')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          x,
          { maxWidth: 'xl' },
          e(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              },
            },
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F52C} Atom'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Reactive primitives that hold state and notify subscribers when changed.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    overflow: 'auto',
                  },
                },
                e(
                  'code',
                  null,
                  `const count = atom(0);
count(5); // Update value
console.log(count()); // Read value`
                )
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F9EE} Computed'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Derived values that automatically update when their dependencies change.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    overflow: 'auto',
                  },
                },
                e(
                  'code',
                  null,
                  `const doubled = computed(() => 
  count() * 2);`
                )
              )
            ),
            e(
              b,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Effect'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Side effects that run when reactive dependencies change.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    overflow: 'auto',
                  },
                },
                e(
                  'code',
                  null,
                  `effect(() => {
  console.log('Count:', count());
});`
                )
              )
            )
          )
        )
      )
    );
  }
  var at = { HomePage: ge, ReactivityPage: We, ComponentsPage: Be },
    it = ze({
      routes: { '/': 'HomePage', '/reactivity': 'ReactivityPage', '/components': 'ComponentsPage' },
    });
  function Pe() {
    let t = j(),
      o = document.createElement('link');
    ((o.id = 'theme-stylesheet'),
      (o.rel = 'stylesheet'),
      (o.href = t === 'chalk' ? './chalk-styles.css' : './styles.css'),
      document.head.appendChild(o),
      document.body.classList.add(`${t}-theme`));
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => {
        (Pe(), J());
      })
    : (Pe(), J());
  window.addEventListener('routechange', () => {
    J();
  });
  window.addEventListener('themechange', () => {
    J();
  });
  function J() {
    let t = document.getElementById('app');
    if (t) {
      t.innerHTML = '';
      try {
        let o = it.getCurrentPage(),
          r = at[o] || ge;
        K(t, r);
      } catch (o) {
        console.error('Mount error:', o);
      }
    }
  }
})();
//# sourceMappingURL=app.js.map
