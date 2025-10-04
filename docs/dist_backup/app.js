'use strict';
(() => {
  var ut = 0,
    pt = new Set(),
    Ie = new Set(),
    ft = !1;
  function gt() {
    return ut > 0;
  }
  function J(t) {
    gt() ? pt.add(t) : t();
  }
  function Q(t) {
    return ft ? (Ie.has(t) ? !1 : (Ie.add(t), !0)) : !0;
  }
  var We = null,
    De = null,
    Me = null,
    Pe = null;
  function j() {
    return De;
  }
  function me(t, r) {
    ((We = t), (De = r));
  }
  function Z(t) {
    We?.onDependency(t);
  }
  function ee() {
    return Pe;
  }
  function de(t, r) {
    ((Me = t), (Pe = r));
  }
  function te(t) {
    Me?.onDependency(t);
  }
  function T(t) {
    let r = t,
      o = new Set();
    function n() {
      let a = Array.from(o);
      for (let s of a)
        if (Q(s))
          try {
            s(r);
          } catch (u) {
            console.error('Error in atom subscriber:', u);
          }
    }
    function i(a) {
      if (arguments.length === 0) {
        let u = j();
        if (u) {
          let m = i.subscribe(u);
          Z(m);
        } else {
          let m = ee();
          if (m) {
            let f = i.subscribe(m);
            te(f);
          }
        }
        return r;
      }
      let s = typeof a == 'function' ? a(r) : a;
      Object.is(s, r) || ((r = s), J(n));
    }
    return (
      (i.subscribe = a => (
        o.add(a),
        () => {
          o.delete(a);
        }
      )),
      i
    );
  }
  function ue(t) {
    let r,
      o = !0,
      n = !1,
      i = new Set(),
      a = [];
    function s() {
      let v = Array.from(i);
      for (let w of v)
        if (Q(w))
          try {
            w(r);
          } catch (z) {
            console.error('Error in computed subscriber:', z);
          }
    }
    function u() {
      if (!(o || n))
        if (i.size > 0) {
          let v = r;
          o = !0;
          let w = m();
          Object.is(v, w) || J(s);
        } else o = !0;
    }
    function m() {
      if (n) throw new Error('Circular dependency detected in computed()');
      n = !0;
      try {
        for (let z of a) z();
        a = [];
        let v = {
            onDependency: z => {
              a.push(z);
            },
          },
          w = j();
        me(v, u);
        try {
          return ((r = t()), (o = !1), r);
        } finally {
          me(null, w);
        }
      } finally {
        n = !1;
      }
    }
    function f() {
      let v = j();
      if (v && v !== u) {
        let w = f.subscribe(v);
        Z(w);
      } else if (v !== u) {
        let w = ee();
        if (w) {
          let z = f.subscribe(w);
          te(z);
        }
      }
      return (o && m(), r);
    }
    return (
      (f.subscribe = v => (
        i.size === 0 && o && m(),
        i.add(v),
        () => {
          i.delete(v);
        }
      )),
      f
    );
  }
  function G(t) {
    let r = [],
      o = null,
      n = !1,
      i = !1;
    function a() {
      i || n || s();
    }
    function s() {
      if (!i) {
        if (n) {
          console.error('Effect is already running, skipping rerun');
          return;
        }
        n = !0;
        try {
          if (o) {
            try {
              o();
            } catch (m) {
              console.error('Error in effect cleanup:', m);
            }
            o = null;
          }
          for (let m of r) m();
          ((r = []),
            de(
              {
                onDependency: m => {
                  r.push(m);
                },
              },
              a
            ));
          try {
            t(m => {
              o = m;
            });
          } catch (m) {
            console.error('Error in effect:', m);
          } finally {
            de(null, null);
          }
        } finally {
          n = !1;
        }
      }
    }
    return (
      s(),
      () => {
        if (!i) {
          if (((i = !0), o))
            try {
              o();
            } catch (u) {
              console.error('Error in effect cleanup:', u);
            }
          for (let u of r) u();
          r = [];
        }
      }
    );
  }
  var Re = new Map(),
    bt = 0,
    Le = new WeakMap(),
    ht = new WeakMap(),
    U = null,
    pe = 0;
  function fe(t, r) {
    let o = Le.get(t);
    o || ((o = new Map()), Le.set(t, o), ht.set(t, 0));
    let i = JSON.stringify(r || {})
        .split('')
        .reduce((s, u) => ((s << 5) - s + u.charCodeAt(0)) | 0, 0),
      a = o.get(i);
    return (a || ((a = `${t.name || 'Anonymous'}_${bt++}`), o.set(i, a)), a);
  }
  function re(t) {
    ((U = t), (pe = 0));
  }
  function oe() {
    ((U = null), (pe = 0));
  }
  function x(t) {
    if (!U)
      return (
        console.warn('useState called outside component context - state will not persist'),
        T(typeof t == 'function' ? t() : t)
      );
    let r = Re.get(U);
    r || ((r = []), Re.set(U, r));
    let o = pe++;
    if (o >= r.length) {
      let n = typeof t == 'function' ? t() : t;
      r.push(T(n));
    }
    return r[o];
  }
  var ne = Symbol('Fragment');
  function e(t, r, ...o) {
    let n = r || {},
      i = Fe(o)
        .filter(a => a != null && a !== !1)
        .map(yt);
    return { type: t, props: n, children: i };
  }
  function Fe(t) {
    let r = [];
    for (let o of t) Array.isArray(o) ? r.push(...Fe(o)) : r.push(o);
    return r;
  }
  function yt(t) {
    return xt(t) ? t : vt(String(t));
  }
  function xt(t) {
    return t != null && typeof t == 'object' && 'type' in t && 'props' in t && 'children' in t;
  }
  function vt(t) {
    return { type: 'TEXT_NODE', props: {}, children: [], text: t };
  }
  function Ct(t) {
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
  function W(t, r = window.document) {
    if (t.type === 'TEXT_NODE') return r.createTextNode(t.text || '');
    if (t.type === ne) {
      let i = '__contextId' in t && '__contextValue' in t;
      try {
        let a = r.createDocumentFragment();
        for (let s of t.children) a.appendChild(W(s, r));
        return a;
      } finally {
      }
    }
    if (typeof t.type == 'function') {
      let i = fe(t.type, t.props);
      if (typeof window < 'u') {
        let a = r.createElement('span');
        a.style.display = 'contents';
        let s = null;
        return (
          G(() => {
            re(i);
            try {
              let u = {
                  ...t.props,
                  children:
                    t.children.length === 1
                      ? t.children[0]
                      : t.children.length > 0
                        ? t.children
                        : void 0,
                },
                m = t.type(u);
              if (m) {
                let f = W(m, r);
                (s ? a.replaceChild(f, s) : a.appendChild(f), (s = f));
              }
            } finally {
              oe();
            }
          }),
          a
        );
      } else {
        re(i);
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
            s = t.type(a);
          return s ? W(s, r) : r.createTextNode('');
        } finally {
          oe();
        }
      }
    }
    let o = t.type,
      n = Ct(o) ? r.createElementNS('http://www.w3.org/2000/svg', o) : r.createElement(o);
    wt(n, t.props);
    for (let i of t.children) n.appendChild(W(i, r));
    return n;
  }
  function wt(t, r) {
    for (let [o, n] of Object.entries(r))
      if (n != null && o !== 'children')
        if (o === 'className') t.setAttribute('class', String(n));
        else if (o === 'style' && typeof n == 'object') kt(t, n);
        else if (o.startsWith('on') && typeof n == 'function') {
          let i = o.substring(2).toLowerCase();
          t.addEventListener(i, n);
        } else
          typeof n == 'boolean' ? n && t.setAttribute(o, String(n)) : t.setAttribute(o, String(n));
  }
  function kt(t, r) {
    for (let [o, n] of Object.entries(r)) n != null && (t.style[o] = n);
  }
  var Ge = null;
  function ae(t, r, o = window.document) {
    let n = null;
    return G(a => {
      let s = { onMountCallbacks: [], onCleanupCallbacks: [] };
      Ge = s;
      try {
        let u = r();
        if (u) {
          let m = W(u, o);
          (n && t.removeChild(n), t.appendChild(m), (n = m));
          for (let f of s.onMountCallbacks) f();
        }
        a(() => {
          for (let m of s.onCleanupCallbacks) m();
          n && (t.removeChild(n), (n = null));
        });
      } finally {
        Ge = null;
      }
    });
  }
  var Nt = 0,
    zt = new Set(),
    $e = new Set(),
    Bt = !1;
  function Et() {
    return Nt > 0;
  }
  function ge(t) {
    Et() ? zt.add(t) : t();
  }
  function be(t) {
    return Bt ? ($e.has(t) ? !1 : ($e.add(t), !0)) : !0;
  }
  var At = null,
    Tt = null,
    It = null,
    Wt = null;
  function he() {
    return Tt;
  }
  function ye(t) {
    At?.onDependency(t);
  }
  function xe() {
    return Wt;
  }
  function ve(t) {
    It?.onDependency(t);
  }
  function ie(t) {
    let r = t,
      o = new Set();
    function n() {
      let a = Array.from(o);
      for (let s of a)
        if (be(s))
          try {
            s(r);
          } catch (u) {
            console.error('Error in atom subscriber:', u);
          }
    }
    function i(a) {
      if (arguments.length === 0) {
        let u = he();
        if (u) {
          let m = i.subscribe(u);
          ye(m);
        } else {
          let m = xe();
          if (m) {
            let f = i.subscribe(m);
            ve(f);
          }
        }
        return r;
      }
      let s = typeof a == 'function' ? a(r) : a;
      Object.is(s, r) || ((r = s), ge(n));
    }
    return (
      (i.subscribe = a => (
        o.add(a),
        () => {
          o.delete(a);
        }
      )),
      i
    );
  }
  var Ce = Symbol('Fragment');
  var V = ie('/'),
    D = {},
    _ = '';
  function je(t) {
    return _ && t.startsWith(_) ? t.slice(_.length) || '/' : t;
  }
  function _t(t) {
    return _ ? _ + t : t;
  }
  function Ue(t) {
    ((D = t.routes), (_ = t.basePath || ''));
    let r = t.initialPath || window.location.pathname,
      o = je(r);
    return (
      D[o] &&
        (V(o),
        window.dispatchEvent(
          new CustomEvent('routechange', { detail: { path: o, component: D[o] } })
        )),
      window.addEventListener('popstate', n => {
        let i = n.state?.path || window.location.pathname,
          a = je(i);
        D[a] &&
          (V(a),
          window.dispatchEvent(
            new CustomEvent('routechange', { detail: { path: a, component: D[a] } })
          ));
      }),
      { navigate: n => N(n), getCurrentPage: () => $t(), getCurrentPath: () => V() }
    );
  }
  function N(t) {
    if (D[t]) {
      V(t);
      let r = _t(t);
      (window.history.pushState({ path: r }, '', r),
        window.dispatchEvent(
          new CustomEvent('routechange', { detail: { path: t, component: D[t] } })
        ));
    }
  }
  function $t() {
    return D[V()] || 'HomePage';
  }
  function Ve(t) {
    if (t == null || t === !1 || t === '') return [];
    if (typeof t == 'string' || typeof t == 'number') return [String(t)];
    if (Array.isArray(t)) {
      let r = [];
      for (let o of t) r.push(...Ve(o));
      return r;
    }
    if (typeof t == 'object') {
      let r = [];
      for (let [o, n] of Object.entries(t)) n && r.push(o);
      return r;
    }
    return [];
  }
  function p(...t) {
    let r = [];
    for (let o of t) r.push(...Ve(o));
    return r.join(' ');
  }
  var Ye =
    typeof process < 'u' &&
    process.stdout &&
    process.stdout.isTTY &&
    process.env.TERM !== 'dumb' &&
    !process.env.NO_COLOR;
  function h(t, r) {
    return Ye ? o => `\x1B[${t}m${o}\x1B[${r}m` : o => String(o);
  }
  var Ht = {
    black: h(30, 39),
    red: h(31, 39),
    green: h(32, 39),
    yellow: h(33, 39),
    blue: h(34, 39),
    magenta: h(35, 39),
    cyan: h(36, 39),
    white: h(37, 39),
    gray: h(90, 39),
    bgBlack: h(40, 49),
    bgRed: h(41, 49),
    bgGreen: h(42, 49),
    bgYellow: h(43, 49),
    bgBlue: h(44, 49),
    bgMagenta: h(45, 49),
    bgCyan: h(46, 49),
    bgWhite: h(47, 49),
    bold: h(1, 22),
    dim: h(2, 22),
    italic: h(3, 23),
    underline: h(4, 24),
    inverse: h(7, 27),
    hidden: h(8, 28),
    strikethrough: h(9, 29),
    reset: h(0, 0),
    isColorSupported: Ye,
  };
  function k(t) {
    let {
        variant: r = 'primary',
        size: o = 'md',
        disabled: n = !1,
        children: i,
        className: a,
        onClick: s,
        ...u
      } = t,
      m = p(
        'solidum-button',
        `solidum-button--${r}`,
        `solidum-button--${o}`,
        { 'solidum-button--disabled': n },
        a
      );
    return e('button', { className: m, disabled: n, type: 'button', onClick: s, ...u }, i);
  }
  function l(t) {
    let {
        bordered: r = !0,
        hoverable: o = !1,
        padding: n = 'md',
        children: i,
        className: a,
        ...s
      } = t,
      u = p(
        'solidum-card',
        {
          'solidum-card--bordered': r,
          'solidum-card--hoverable': o,
          [`solidum-card--padding-${n}`]: n,
        },
        a
      );
    return e('div', { className: u, ...s }, i);
  }
  function g(t) {
    let {
      variant: r = 'primary',
      size: o = 'md',
      dot: n = !1,
      pulse: i = !1,
      glow: a = !1,
      children: s,
      className: u,
      ...m
    } = t;
    return e(
      'span',
      {
        className: p(
          'solidum-badge',
          `solidum-badge--${r}`,
          `solidum-badge--${o}`,
          { 'solidum-badge--dot': n, 'solidum-badge--pulse': i, 'solidum-badge--glow': a },
          u
        ),
        ...m,
      },
      s
    );
  }
  function Y(t) {
    let {
        src: r,
        alt: o = '',
        fallback: n,
        size: i = 'md',
        variant: a = 'circle',
        status: s,
        bordered: u = !1,
        glow: m = !1,
        className: f,
        ...v
      } = t,
      w = n || o.slice(0, 2).toUpperCase();
    return e(
      'div',
      {
        className: p(
          'solidum-avatar',
          `solidum-avatar--${i}`,
          `solidum-avatar--${a}`,
          { 'solidum-avatar--bordered': u, 'solidum-avatar--glow': m },
          f
        ),
        ...v,
      },
      r
        ? e('img', { src: r, alt: o, className: 'solidum-avatar-image' })
        : e('span', { className: 'solidum-avatar-fallback' }, w),
      s && e('span', { className: p('solidum-avatar-status', `solidum-avatar-status--${s}`) })
    );
  }
  function c(t) {
    let { maxWidth: r = 'lg', padding: o = !0, children: n, className: i, ...a } = t,
      s = p('solidum-container', `solidum-container--${r}`, { 'solidum-container--padding': o }, i);
    return e('div', { className: s, ...a }, n);
  }
  function B(t) {
    let {
        direction: r = 'vertical',
        spacing: o = 'md',
        align: n = 'stretch',
        justify: i = 'start',
        wrap: a = !1,
        children: s,
        className: u,
        ...m
      } = t,
      f = p(
        'solidum-stack',
        `solidum-stack--${r}`,
        `solidum-stack--spacing-${o}`,
        `solidum-stack--align-${n}`,
        `solidum-stack--justify-${i}`,
        { 'solidum-stack--wrap': a },
        u
      );
    return e('div', { className: f, ...m }, s);
  }
  function we(t) {
    let {
        checked: r = !1,
        disabled: o = !1,
        size: n = 'md',
        label: i,
        className: a,
        onChange: s,
        ...u
      } = t,
      m = x(r),
      f = () => {
        if (!o) {
          let v = !m();
          (m(v), s?.(v));
        }
      };
    return e(
      'label',
      { className: p('solidum-switch-wrapper', a) },
      e(
        'button',
        {
          type: 'button',
          role: 'switch',
          'aria-checked': m(),
          className: p('solidum-switch', `solidum-switch--${n}`, {
            'solidum-switch--checked': m(),
            'solidum-switch--disabled': o,
          }),
          disabled: o,
          onClick: f,
          ...u,
        },
        e('span', { className: 'solidum-switch-thumb' })
      ),
      i && e('span', { className: 'solidum-switch-label' }, i)
    );
  }
  function ke(t) {
    let {
        value: r,
        max: o = 100,
        size: n = 'md',
        variant: i = 'default',
        showLabel: a = !1,
        color: s = 'primary',
        glow: u = !1,
        className: m,
      } = t,
      f = Math.min(Math.max((r / o) * 100, 0), 100);
    return e(
      'div',
      { className: p('solidum-progress-wrapper', m) },
      e(
        'div',
        {
          className: p(
            'solidum-progress',
            `solidum-progress--${n}`,
            `solidum-progress--${i}`,
            `solidum-progress--${s}`,
            { 'solidum-progress--glow': u }
          ),
          role: 'progressbar',
          'aria-valuenow': r,
          'aria-valuemin': 0,
          'aria-valuemax': o,
        },
        e('div', { className: 'solidum-progress-bar', style: { width: `${f}%` } })
      ),
      a && e('span', { className: 'solidum-progress-label' }, `${Math.round(f)}%`)
    );
  }
  function Se(t) {
    let {
      size: r = 'md',
      variant: o = 'default',
      color: n = 'primary',
      label: i,
      className: a,
    } = t;
    return e(
      'div',
      { className: p('solidum-spinner-wrapper', a) },
      e('div', {
        className: p(
          'solidum-spinner',
          `solidum-spinner--${r}`,
          `solidum-spinner--${o}`,
          `solidum-spinner--${n}`
        ),
        role: 'status',
        'aria-label': i || 'Loading',
      }),
      i && e('span', { className: 'solidum-spinner-label' }, i)
    );
  }
  function I(t) {
    let {
        tabs: r,
        defaultTab: o,
        variant: n = 'line',
        animated: i = !0,
        className: a,
        onChange: s,
      } = t,
      u = x(o || r[0]?.id),
      m = f => {
        (u(f), s?.(f));
      };
    return e(
      'div',
      { className: p('solidum-tabs', `solidum-tabs--${n}`, a) },
      e(
        'div',
        { className: 'solidum-tabs-list', role: 'tablist' },
        ...r.map(f =>
          e(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': f.id === u(),
              className: p('solidum-tab', {
                'solidum-tab--active': f.id === u(),
                'solidum-tab--disabled': f.disabled,
              }),
              disabled: f.disabled,
              onClick: () => !f.disabled && m(f.id),
            },
            f.icon && e('span', { className: 'solidum-tab-icon' }, f.icon),
            f.label
          )
        )
      ),
      e(
        'div',
        { className: 'solidum-tabs-panels' },
        e(
          'div',
          {
            className: p('solidum-tabs-content', 'solidum-tabs-content--active', {
              'solidum-tabs-content--animated': i,
            }),
            role: 'tabpanel',
          },
          r.find(f => f.id === u())?.content
        )
      )
    );
  }
  function Ne(t) {
    let {
        columns: r,
        data: o,
        draggableRows: n = !0,
        sortable: i = !0,
        striped: a = !0,
        hoverable: s = !0,
        bordered: u = !1,
        compact: m = !1,
        stickyHeader: f = !0,
        animated: v = !0,
        className: w,
        onSort: z,
        onRowDrag: R,
      } = t,
      L = x(null),
      $ = x('asc'),
      M = x(null),
      F = x(null),
      H = d => {
        if (!i) return;
        let b = L() === d && $() === 'asc' ? 'desc' : 'asc';
        (L(d), $(b), z?.(d, b));
      },
      se = d => b => {
        (M(d), b.dataTransfer && (b.dataTransfer.effectAllowed = 'move'));
      },
      O = d => b => {
        (b.preventDefault(), F(d));
      },
      P = d => b => {
        b.preventDefault();
        let y = M();
        (y !== null && y !== d && R?.(y, d), M(null), F(null));
      };
    return e(
      'div',
      { className: p('solidum-datatable-wrapper', w) },
      e(
        'table',
        {
          className: p('solidum-datatable', {
            'solidum-datatable--striped': a,
            'solidum-datatable--hoverable': s,
            'solidum-datatable--bordered': u,
            'solidum-datatable--compact': m,
            'solidum-datatable--animated': v,
          }),
        },
        e(
          'thead',
          { className: p({ 'solidum-datatable-header--sticky': f }) },
          e(
            'tr',
            {},
            n && e('th', { className: 'solidum-datatable-drag-handle' }),
            ...r.map(d =>
              e(
                'th',
                {
                  className: p('solidum-datatable-header', {
                    'solidum-datatable-header--sortable': i && d.sortable !== !1,
                    'solidum-datatable-header--sorted': L() === d.key,
                  }),
                  style: d.width ? { width: d.width } : {},
                  onClick: i && d.sortable !== !1 ? () => H(d.key) : void 0,
                },
                d.header,
                i &&
                  d.sortable !== !1 &&
                  L() === d.key &&
                  e(
                    'span',
                    { className: 'solidum-datatable-sort-icon' },
                    $() === 'asc' ? ' \u25B2' : ' \u25BC'
                  )
              )
            )
          )
        ),
        e(
          'tbody',
          {},
          ...o.map((d, b) =>
            e(
              'tr',
              {
                className: p('solidum-datatable-row', {
                  'solidum-datatable-row--dragging': M() === b,
                  'solidum-datatable-row--drag-over': F() === b,
                }),
                draggable: n,
                onDragStart: n ? se(b) : void 0,
                onDragOver: n ? O(b) : void 0,
                onDrop: n ? P(b) : void 0,
              },
              n && e('td', { className: 'solidum-datatable-drag-handle' }, '\u22EE\u22EE'),
              ...r.map(y => {
                let S = d[y.key],
                  E = y.render ? y.render(S, d) : S;
                return e('td', { className: 'solidum-datatable-cell' }, E);
              })
            )
          )
        )
      ),
      n && e('div', { className: 'solidum-datatable-hint' }, '\u2195 Drag rows to reorder')
    );
  }
  function ze(t) {
    let {
        data: r,
        type: o = 'bar',
        width: n = 600,
        height: i = 400,
        interactive: a = !0,
        animated: s = !0,
        showGrid: u = !0,
        perspective: m = 1e3,
        rotation: f = { x: 20, y: 30, z: 0 },
        className: v,
      } = t,
      w = x(f),
      z = x(!1),
      R = x({ x: 0, y: 0 }),
      L = d => {
        a && (z(!0), R({ x: d.clientX, y: d.clientY }));
      },
      $ = d => {
        if (z() && a) {
          let b = d.clientX - R().x,
            y = d.clientY - R().y,
            S = w();
          (w({ x: S.x + y * 0.5, y: S.y + b * 0.5, z: S.z }), R({ x: d.clientX, y: d.clientY }));
        }
      },
      M = () => {
        z(!1);
      },
      F = Math.max(...r.map(d => d.x)),
      H = Math.max(...r.map(d => d.y)),
      se = r[0]?.z !== void 0 ? Math.max(...r.map(d => d.z || 0)) : H,
      O = Math.min(n, i) / 3,
      P = (d, b, y) => {
        let S = w(),
          E = (d / F - 0.5) * O,
          Ee = (b / H - 0.5) * O,
          Ae = (y / se - 0.5) * O,
          q = (S.x * Math.PI) / 180,
          K = (S.y * Math.PI) / 180,
          ct = E * Math.cos(K) - Ae * Math.sin(K),
          Te = E * Math.sin(K) + Ae * Math.cos(K),
          mt = Ee * Math.cos(q) - Te * Math.sin(q),
          dt = Ee * Math.sin(q) + Te * Math.cos(q),
          ce = m / (m + dt);
        return { x: ct * ce + n / 2, y: mt * ce + i / 2, scale: ce };
      };
    return e(
      'div',
      { className: p('solidum-chart3d-wrapper', v) },
      e(
        'svg',
        {
          className: p('solidum-chart3d', {
            'solidum-chart3d--animated': s,
            'solidum-chart3d--interactive': a,
          }),
          width: n,
          height: i,
          xmlns: 'http://www.w3.org/2000/svg',
          onMouseDown: L,
          onMouseMove: $,
          onMouseUp: M,
          onMouseLeave: M,
          style: { cursor: a ? (z() ? 'grabbing' : 'grab') : 'default' },
        },
        e('rect', { width: n, height: i, fill: '#0a0e27', rx: 8 }),
        u &&
          e(
            'g',
            { className: 'solidum-chart3d-grid', opacity: 0.2 },
            ...[...Array(10)].map((d, b) => {
              let y = (b / 10) * H,
                S = P(0, y, 0),
                E = P(F, y, 0);
              return e('line', {
                x1: S.x,
                y1: S.y,
                x2: E.x,
                y2: E.y,
                stroke: '#667eea',
                strokeWidth: 1,
              });
            })
          ),
        o === 'bar' &&
          e(
            'g',
            { className: 'solidum-chart3d-bars' },
            ...r.map((d, b) => {
              let y = P(d.x, 0, d.z || 0),
                S = P(d.x, d.y, d.z || 0),
                E = 20 * y.scale;
              return e(
                'g',
                {},
                e('rect', {
                  x: y.x - E / 2,
                  y: S.y,
                  width: E,
                  height: Math.abs(y.y - S.y),
                  fill: d.color || `hsl(${(b / r.length) * 360}, 70%, 60%)`,
                  opacity: 0.8,
                  rx: 4,
                }),
                e('rect', {
                  x: y.x - E / 2,
                  y: S.y,
                  width: E,
                  height: Math.abs(y.y - S.y),
                  fill: 'url(#barGlow)',
                  opacity: 0.3,
                  rx: 4,
                })
              );
            })
          ),
        o === 'scatter' &&
          e(
            'g',
            { className: 'solidum-chart3d-scatter' },
            ...r.map(d => {
              let b = P(d.x, d.y, d.z || 0),
                y = 8 * b.scale;
              return e(
                'g',
                {},
                e('circle', {
                  cx: b.x,
                  cy: b.y,
                  r: y * 2,
                  fill: d.color || '#667eea',
                  opacity: 0.2,
                }),
                e('circle', { cx: b.x, cy: b.y, r: y, fill: d.color || '#667eea', opacity: 0.9 })
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
  function A(t) {
    let {
      blur: r = 'md',
      tint: o = 'light',
      bordered: n = !0,
      hoverable: i = !0,
      glow: a = !1,
      animated: s = !0,
      children: u,
      className: m,
      ...f
    } = t;
    return e(
      'div',
      {
        className: p(
          'solidum-glass-card',
          `solidum-glass-card--blur-${r}`,
          `solidum-glass-card--tint-${o}`,
          {
            'solidum-glass-card--bordered': n,
            'solidum-glass-card--hoverable': i,
            'solidum-glass-card--glow': a,
            'solidum-glass-card--animated': s,
          },
          m
        ),
        ...f,
      },
      u
    );
  }
  var Xe = typeof window < 'u',
    qe = T((Xe && localStorage.getItem('solidum-theme')) || 'default');
  function X() {
    return qe();
  }
  function Ke(t) {
    if (!Xe) return;
    (qe(t), localStorage.setItem('solidum-theme', t));
    let r = document.getElementById('theme-stylesheet');
    (r && (r.href = t === 'chalk' ? './chalk-styles.css' : './styles.css'),
      document.body.classList.remove('chalk-theme', 'default-theme'),
      document.body.classList.add(`${t}-theme`),
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t } })));
  }
  function Je() {
    let t = () => {
        let a = X() === 'default' ? 'chalk' : 'default';
        Ke(a);
      },
      r = X();
    return e(
      'div',
      {
        className: 'theme-switcher',
        style: { position: 'fixed', top: '20px', right: '20px', zIndex: '1000' },
      },
      e(
        k,
        { variant: r === 'chalk' ? 'success' : 'primary', size: 'sm', onClick: t },
        r === 'chalk' ? '\u{1F4D0} Switch to Default' : '\u{1F3A8} Switch to Chalkboard'
      )
    );
  }
  var Ut = [
    { path: '/', label: 'Home', icon: '\u{1F3E0}' },
    { path: '/getting-started', label: 'Getting Started', icon: '\u{1F680}' },
    { path: '/reactivity', label: 'Core & Reactivity', icon: '\u26A1' },
    { path: '/router', label: 'Router', icon: '\u{1F6E3}\uFE0F' },
    { path: '/store', label: 'Store', icon: '\u{1F4E6}' },
    { path: '/context', label: 'Context', icon: '\u{1F504}' },
    { path: '/storage', label: 'Storage', icon: '\u{1F4BE}' },
    { path: '/ssr', label: 'SSR', icon: '\u{1F5A5}\uFE0F' },
    { path: '/web-ai', label: 'Web AI', icon: '\u{1F916}', badge: 'Chrome' },
    { path: '/ai-debugger', label: 'AI Debugger', icon: '\u{1F41B}', badge: 'NEW' },
    { path: '/testing', label: 'Testing', icon: '\u{1F9EA}' },
    { path: '/components', label: 'UI Components', icon: '\u{1F3A8}' },
    { path: '/ui-chalk', label: 'UI Chalk', icon: '\u270F\uFE0F' },
    { path: '/integrations', label: 'Integrations', icon: '\u{1F50C}' },
  ];
  function C() {
    let t = window.location.pathname.replace(/^\/solidum/, '');
    return e(
      'nav',
      {
        style: {
          position: 'sticky',
          top: 0,
          zIndex: 1e3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
      e(
        c,
        { maxWidth: 'xl' },
        e(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 0',
              flexWrap: 'wrap',
              gap: '1rem',
            },
          },
          e(
            'div',
            {
              style: {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              },
              onClick: () => N('/'),
            },
            'Solidum'
          ),
          e(
            'div',
            {
              className: 'nav-links-desktop',
              style: {
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                flex: '1',
                justifyContent: 'center',
              },
            },
            ...Ut.map(r =>
              e(
                'div',
                { key: r.path, style: { position: 'relative' } },
                e(
                  k,
                  {
                    variant: t === r.path ? 'primary' : 'ghost',
                    size: 'sm',
                    onClick: () => N(r.path),
                    style: { fontSize: '0.875rem' },
                  },
                  `${r.icon} ${r.label}`
                ),
                r.badge
                  ? e(
                      g,
                      {
                        variant: r.badge === 'NEW' ? 'gradient' : 'info',
                        size: 'xs',
                        style: {
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          fontSize: '0.625rem',
                          padding: '0.125rem 0.25rem',
                        },
                      },
                      r.badge
                    )
                  : null
              )
            )
          ),
          e(
            k,
            {
              variant: 'outline',
              size: 'sm',
              onClick: () => window.open('https://github.com/kluth/solidum', '_blank'),
            },
            '\u2B50 GitHub'
          )
        )
      )
    );
  }
  function Be() {
    let t = [
        { x: 1, y: 20, z: 10, label: 'A' },
        { x: 2, y: 35, z: 15, label: 'B' },
        { x: 3, y: 25, z: 8, label: 'C' },
        { x: 4, y: 45, z: 20, label: 'D' },
        { x: 5, y: 30, z: 12, label: 'E' },
      ],
      r = [
        { key: 'name', header: 'Component', sortable: !0 },
        { key: 'category', header: 'Category', sortable: !0 },
        { key: 'interactive', header: 'Interactive', render: n => (n ? '\u2713' : '\u2717') },
      ],
      o = [
        { name: 'Chart3D', category: 'Data Display', interactive: !0 },
        { name: 'DataTable', category: 'Data Display', interactive: !0 },
        { name: 'ParticleBackground', category: 'Effects', interactive: !0 },
        { name: 'GlassCard', category: 'Layout', interactive: !1 },
        { name: 'Modal', category: 'Feedback', interactive: !0 },
      ];
    return e(
      'div',
      { className: 'home-page', style: { position: 'relative', overflow: 'hidden' } },
      C(),
      Je(),
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
          c,
          { maxWidth: 'lg' },
          e(
            B,
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
              B,
              { direction: 'horizontal', spacing: 'md' },
              e(k, { variant: 'secondary', size: 'lg' }, 'Get Started'),
              e(k, { variant: 'outline', size: 'lg' }, 'View on GitHub')
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
          c,
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
          e(I, {
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
                  e(ze, {
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
                content: e(Ne, {
                  columns: r,
                  data: o,
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
                    A,
                    { blur: 'lg', tint: 'light', hoverable: !0, glow: !0, animated: !0 },
                    e('h3', { style: { marginBottom: '1rem', color: '#1a1a2e' } }, 'Light Glass'),
                    e('p', { style: { color: '#4a4a6a' } }, 'Hover me for effects!')
                  ),
                  e(
                    A,
                    { blur: 'xl', tint: 'dark', hoverable: !0, bordered: !0 },
                    e('h3', { style: { marginBottom: '1rem' } }, 'Dark Glass'),
                    e('p', { style: { opacity: '0.8' } }, 'With backdrop blur')
                  ),
                  e(
                    A,
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
          c,
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
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/reactivity'),
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
                e(g, { variant: 'gradient', size: 'sm', glow: !0 }, 'Core')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Efficient updates with atom, computed, and effect primitives. Only what changes gets updated.'
              ),
              e(ke, { value: 95, variant: 'gradient', showLabel: !0, glow: !0 })
            ),
            e(
              l,
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
              l,
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
              l,
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
              l,
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
              l,
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
                e(g, { variant: 'success', size: 'sm' }, '104 Tests')
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Comprehensive test suite with 100+ tests ensuring reliability and stability.'
              )
            ),
            e(
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/components'),
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
                e(g, { variant: 'gradient', size: 'sm', pulse: !0 }, 'NEW!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                '20+ production-ready components including 3D charts, drag-and-drop tables, and particle effects.'
              ),
              e(
                'div',
                { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' } },
                e(Y, { size: 'sm', fallback: 'UI', status: 'online', glow: !0 }),
                e(Y, { size: 'sm', fallback: '3D', variant: 'rounded' }),
                e(Y, { size: 'sm', fallback: 'DND', status: 'online' }),
                e(Se, { size: 'sm', variant: 'default' })
              )
            ),
            e(
              l,
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
                e(g, { variant: 'warning', size: 'sm', glow: !0 }, 'Wild!')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Drag-to-rotate 3D charts, reorderable tables, mouse-interactive particles, and more!'
              ),
              e(we, { size: 'md', label: 'Try me!' })
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
          c,
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
              A,
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
              A,
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
              A,
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
              A,
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
          c,
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function Qe() {
    return e(
      'div',
      { className: 'getting-started-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F680} Getting Started'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Build reactive applications with Solidum in minutes'
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4E6} Installation'
          ),
          e(I, {
            tabs: [
              {
                id: 'core',
                label: 'Core Package',
                icon: '\u26A1',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'h3',
                    { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                    'Install Core Framework'
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
                        fontSize: '1rem',
                        marginBottom: '1rem',
                      },
                    },
                    e('code', null, 'npm install @sldm/core')
                  ),
                  e(
                    'p',
                    { style: { color: '#6b7280', marginBottom: '1rem' } },
                    'The core package includes fine-grained reactivity primitives: atom(), computed(), effect(), and the component system.'
                  )
                ),
              },
              {
                id: 'ui',
                label: 'UI Components',
                icon: '\u{1F3A8}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'h3',
                    { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                    'Install UI Libraries'
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
                        fontSize: '1rem',
                        marginBottom: '1rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `# Glassmorphism UI
npm install @sldm/ui

# Chalk/Hand-drawn UI
npm install @sldm/ui-chalk`
                    )
                  ),
                  e(
                    'p',
                    { style: { color: '#6b7280' } },
                    '20+ production-ready components with glassmorphism effects and chalk/hand-drawn styles.'
                  )
                ),
              },
              {
                id: 'full',
                label: 'Full Stack',
                icon: '\u{1F525}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'h3',
                    { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                    'Install All Packages'
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
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `npm install @sldm/core @sldm/ui @sldm/router \\
  @sldm/store @sldm/context @sldm/storage \\
  @sldm/ssr @sldm/web-ai @sldm/debug \\
  @sldm/testing @sldm/integrations`
                    )
                  ),
                  e(
                    'p',
                    { style: { color: '#6b7280' } },
                    'Everything you need for modern web development: reactivity, UI, routing, state management, SSR, AI, debugging, and more!'
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
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u26A1 Quick Start'
          ),
          e(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
              },
            },
            e(
              l,
              { padding: 'lg', bordered: !0, hoverable: !0 },
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
                  '1\uFE0F\u20E3 Reactivity'
                ),
                e(g, { variant: 'gradient', size: 'sm' }, 'Core')
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
                    fontSize: '0.9rem',
                  },
                },
                e(
                  'code',
                  null,
                  `import { atom, computed, effect } from '@sldm/core';

const count = atom(0);
const doubled = computed(() => count() * 2);

effect(() => {
  console.log(\`\${count()} * 2 = \${doubled()}\`);
});

count(5); // Logs: 5 * 2 = 10`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', bordered: !0, hoverable: !0 },
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
                  '2\uFE0F\u20E3 Components'
                ),
                e(g, { variant: 'success', size: 'sm' }, 'UI')
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
                    fontSize: '0.9rem',
                  },
                },
                e(
                  'code',
                  null,
                  `import { mount, createElement, atom } from '@sldm/core';
import { Button, Card } from '@sldm/ui';

function Counter() {
  const count = atom(0);

  return createElement(Card, { padding: 'lg' },
    createElement('h2', {}, 'Count: ', count),
    createElement(Button, {
      onClick: () => count(count() + 1)
    }, 'Increment')
  );
}

mount(document.body, Counter);`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', bordered: !0, hoverable: !0 },
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
                  '3\uFE0F\u20E3 Routing'
                ),
                e(g, { variant: 'info', size: 'sm' }, 'Router')
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
                    fontSize: '0.9rem',
                  },
                },
                e(
                  'code',
                  null,
                  `import { createRouter, navigate } from '@sldm/router';

const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/about': 'AboutPage',
    '/users/:id': 'UserPage',
  },
});

// Navigate programmatically
navigate('/users/123');`
                )
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F3AF} Next Steps'
          ),
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
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/reactivity'),
                style: { cursor: 'pointer' },
              },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Learn Reactivity'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Master fine-grained reactivity with atom(), computed(), and effect()'
              )
            ),
            e(
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/components'),
                style: { cursor: 'pointer' },
              },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3A8} Explore Components'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Discover 20+ interactive UI components with wild features'
              )
            ),
            e(
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/router'),
                style: { cursor: 'pointer' },
              },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F6E3}\uFE0F Setup Routing'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Add client-side routing with dynamic parameters and nested routes'
              )
            ),
            e(
              l,
              {
                padding: 'lg',
                hoverable: !0,
                bordered: !0,
                onClick: () => N('/ai-debugger'),
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
                  '\u{1F41B} Try AI Debugger'
                ),
                e(g, { variant: 'gradient', size: 'sm', pulse: !0 }, 'NEW!')
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Intelligent debugging with AI-powered error analysis and fixes'
              )
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function Ze() {
    return e(
      'div',
      { className: 'reactivity-page' },
      C(),
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
          c,
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
          e(k, { variant: 'secondary', size: 'lg', onClick: () => N('/') }, '\u2190 Back to Home')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
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
              l,
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
              l,
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
              l,
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
  function et() {
    let t = T(window.location.pathname);
    return e(
      'div',
      { className: 'router-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F6E3}\uFE0F Router'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Client-side routing with dynamic parameters and nested routes'
          ),
          e(
            B,
            { direction: 'horizontal', spacing: 'md', align: 'center' },
            e(g, { variant: 'secondary', size: 'lg' }, 'v0.3.0'),
            e(g, { variant: 'success', size: 'lg' }, 'Hash & History')
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u2728 Features'
          ),
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
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3AF} Dynamic Routes'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Support for dynamic route parameters like /users/:id and wildcards'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `routes: {
  '/users/:id': 'UserPage',
  '/posts/:slug': 'PostPage',
  '/*': 'NotFoundPage'
}`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F4CD} Navigation'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Programmatic navigation and route matching'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `import { navigate } from '@sldm/router';

navigate('/users/123');
navigate('/about', { replace: true });`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F504} Hash & History'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Support for both hash-based and history API routing'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `createRouter({
  mode: 'hash', // or 'history'
  routes: { ... }
})`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3A8} Base Path'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Deploy to subdirectories with basePath support'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `createRouter({
  basePath: '/my-app',
  routes: { ... }
})`
                )
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage Example'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                },
              },
              e(
                'code',
                null,
                `import { createRouter, navigate } from '@sldm/router';
import { mount } from '@sldm/core';

// Define your page components
const HomePage = () => /* ... */;
const AboutPage = () => /* ... */;
const UserPage = () => /* ... */;

const pageComponents = {
  HomePage,
  AboutPage,
  UserPage,
};

// Create router
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/about': 'AboutPage',
    '/users/:id': 'UserPage',
  },
});

// Listen for route changes
window.addEventListener('routechange', () => {
  const currentPage = router.getCurrentPage();
  const PageComponent = pageComponents[currentPage];

  const root = document.getElementById('app');
  root.innerHTML = '';
  mount(root, PageComponent);
});

// Navigate programmatically
navigate('/users/123');

// Access route parameters
const params = router.getParams(); // { id: '123' }`
              )
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function tt() {
    let t = T(0),
      r = ue(() => t() * 2);
    return e(
      'div',
      { className: 'store-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F4E6} Store'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Global state management built on fine-grained reactivity'
          ),
          e(g, { variant: 'secondary', size: 'lg' }, 'Reactive')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#1a1a2e', color: 'white' } },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h2',
            { style: { fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' } },
            '\u{1F3AE} Live Demo'
          ),
          e(
            A,
            { blur: 'lg', tint: 'dark', glow: !0, padding: 'xl' },
            e(
              'div',
              { style: { textAlign: 'center' } },
              e('div', { style: { fontSize: '3rem', marginBottom: '1rem' } }, 'Count: ', t),
              e(
                'div',
                { style: { fontSize: '2rem', marginBottom: '2rem', opacity: '0.8' } },
                'Doubled: ',
                r
              ),
              e(
                B,
                { direction: 'horizontal', spacing: 'md', align: 'center' },
                e(k, { variant: 'primary', size: 'lg', onClick: () => t(t() + 1) }, '+ Increment'),
                e(k, { variant: 'danger', size: 'lg', onClick: () => t(t() - 1) }, '- Decrement'),
                e(k, { variant: 'secondary', size: 'lg', onClick: () => t(0) }, '\u21BB Reset')
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u2728 Features'
          ),
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
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Fine-Grained Updates'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Only components that use changed data are re-rendered. No virtual DOM diffing needed.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `const store = createStore({
  count: 0,
  user: { name: 'Alice' }
});`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3AF} Simple API'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Read with store.count, update with store.count = 10. No reducers or actions needed.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `// Read
console.log(store.count);

// Update
store.count = 10;
store.user.name = 'Bob';`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F504} Reactive Computed'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Derive values that automatically update when dependencies change.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `const doubled = computed(() =>
  store.count * 2
);`
                )
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F50D} Deep Reactivity'
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Nested objects and arrays are automatically reactive.'
              ),
              e(
                'pre',
                {
                  style: {
                    background: '#1f2937',
                    color: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                  },
                },
                e(
                  'code',
                  null,
                  `store.todos.push({
  text: 'Learn Solidum',
  done: false
});`
                )
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage Example'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                },
              },
              e(
                'code',
                null,
                `import { createStore } from '@sldm/store';
import { createElement, mount } from '@sldm/core';

// Create store
const store = createStore({
  count: 0,
  todos: [],
  user: { name: 'Alice', email: 'alice@example.com' }
});

// Component using store
function Counter() {
  return createElement('div', {},
    createElement('h2', {}, 'Count: ', store.count),
    createElement('button', {
      onClick: () => store.count++
    }, 'Increment')
  );
}

// Component automatically re-renders when store.count changes
mount(document.body, Counter);`
              )
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function rt() {
    return e(
      'div',
      { className: 'context-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F504} Context'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Share data across component trees without prop drilling'
          ),
          e(g, { variant: 'secondary', size: 'lg' }, 'Type-Safe')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u2728 Features'
          ),
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
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F3AF} No Prop Drilling'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Pass data deep into component trees without manually threading props through every level.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u2705 Type-Safe'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Full TypeScript support with type inference for context values.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Reactive'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                "Built on Solidum's reactivity - context updates automatically propagate to consumers."
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F512} Scoped'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Each context is scoped to its provider subtree - perfect for nested components.'
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                },
              },
              e(
                'code',
                null,
                `import { createContext, useContext } from '@sldm/context';
import { createElement, atom } from '@sldm/core';

// Create context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggle: () => void;
}>();

// Provider component
function ThemeProvider({ children }) {
  const theme = atom<'light' | 'dark'>('light');

  const value = {
    theme: theme(),
    toggle: () => theme(theme() === 'light' ? 'dark' : 'light'),
  };

  return createElement(
    ThemeContext.Provider,
    { value },
    children
  );
}

// Consumer component
function ThemedButton() {
  const themeCtx = useContext(ThemeContext);

  return createElement('button', {
    style: {
      background: themeCtx.theme === 'dark' ? '#1f2937' : '#ffffff',
      color: themeCtx.theme === 'dark' ? '#ffffff' : '#1f2937',
    },
    onClick: themeCtx.toggle,
  }, 'Toggle Theme');
}`
              )
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function ot() {
    return e(
      'div',
      { className: 'storage-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F4BE} Storage'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Persist data with LocalStorage, IndexedDB, and more'
          ),
          e(g, { variant: 'secondary', size: 'lg' }, 'Reactive')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4E6} Storage Types'
          ),
          e(I, {
            tabs: [
              {
                id: 'localstorage',
                label: 'LocalStorage',
                icon: '\u{1F4DD}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `import { createLocalStorage } from '@sldm/storage';

const storage = createLocalStorage('my-app');

// Set values
await storage.set('user', { name: 'Alice', age: 30 });

// Get values
const user = await storage.get('user');

// Remove values
await storage.remove('user');

// Clear all
await storage.clear();`
                    )
                  )
                ),
              },
              {
                id: 'indexeddb',
                label: 'IndexedDB',
                icon: '\u{1F5C4}\uFE0F',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `import { createIndexedDB } from '@sldm/storage';

const storage = createIndexedDB('my-app', 'users');

// Store complex objects
await storage.set('user-123', {
  id: 123,
  name: 'Alice',
  preferences: { theme: 'dark' },
  createdAt: new Date(),
});

// Query by key
const user = await storage.get('user-123');`
                    )
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
        'footer',
        {
          style: { background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' },
        },
        e(c, {}, e('p', {}, 'Built with \u2764\uFE0F using Solidum'))
      )
    );
  }
  function nt() {
    return e(
      'div',
      { className: 'ssr-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F5A5}\uFE0F Server-Side Rendering'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Render Solidum components to HTML on the server'
          ),
          e(g, { variant: 'success', size: 'lg' }, 'Fast!')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                },
              },
              e(
                'code',
                null,
                `import { renderToString } from '@sldm/ssr';
import { HomePage } from './pages/index.js';

// Render component to HTML string
const html = renderToString(HomePage());

// Use in your HTML template
const page = \`<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="app">\${html}</div>
  <script src="/app.js"><\/script>
</body>
</html>\`;

// Send to client
res.send(page);`
              )
            )
          )
        )
      ),
      e(
        'footer',
        {
          style: { background: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' },
        },
        e(c, {}, e('p', {}, 'Built with \u2764\uFE0F using Solidum'))
      )
    );
  }
  function at() {
    return e(
      'div',
      { className: 'web-ai-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F916} Web AI'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Integrate Google Gemini Nano AI directly in the browser'
          ),
          e(
            B,
            { direction: 'horizontal', spacing: 'md', align: 'center' },
            e(g, { variant: 'info', size: 'lg' }, 'Chrome 127+'),
            e(g, { variant: 'success', size: 'lg' }, 'Built-in AI')
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u2728 Features'
          ),
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
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F9E0} Gemini Nano'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                "Use Google's built-in AI directly in Chrome - no API keys, no server needed!"
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Reactive Integration'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Reactive AI client with atom-based state management for seamless integration.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F512} Privacy First'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'All processing happens locally in the browser. Your data never leaves your device.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F4BE} Built-in Caching'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Smart caching for improved performance and reduced redundant AI calls.'
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                },
              },
              e(
                'code',
                null,
                `import { createWebAIClient } from '@sldm/web-ai';

// Create AI client
const aiClient = createWebAIClient();

// Check availability
if (await aiClient.isAvailable()) {
  // Generate text
  const response = await aiClient.generate(
    'Explain fine-grained reactivity in simple terms'
  );

  console.log(response);

  // Streaming responses
  for await (const chunk of aiClient.generateStream(prompt)) {
    console.log(chunk);
  }
}

// Reactive state
console.log('Loading:', aiClient.isLoading());
console.log('Error:', aiClient.error());`
              )
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function it() {
    return e(
      'div',
      { className: 'ai-debugger-page' },
      C(),
      e(
        'section',
        {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '6rem 0 4rem',
            textAlign: 'center',
          },
        },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h1',
            {
              style: {
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              },
            },
            '\u{1F41B} AI Debugger'
          ),
          e(
            'p',
            { style: { fontSize: '1.5rem', opacity: '0.9', marginBottom: '2rem' } },
            'Intelligent debugging with AI-powered error analysis and fixes'
          ),
          e(
            B,
            { direction: 'horizontal', spacing: 'md', align: 'center' },
            e(g, { variant: 'gradient', size: 'lg', pulse: !0 }, 'NEW!'),
            e(g, { variant: 'info', size: 'lg' }, 'Chrome 127+'),
            e(g, { variant: 'success', size: 'lg' }, 'v0.3.0')
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F31F} Features'
          ),
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
              l,
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
                  '\u{1F50D} AI Error Analysis'
                ),
                e(g, { variant: 'gradient', size: 'sm', glow: !0 }, 'Smart')
              ),
              e(
                'p',
                { style: { color: '#6b7280', marginBottom: '1rem' } },
                'Automatically analyze errors with detailed insights, possible causes, and suggested fixes using Google Gemini Nano.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F4A1} Debug Hints'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Get intelligent code review hints and improvement suggestions for your code.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F527} Fix Suggestions'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Receive automatic fix proposals with code examples tailored to your specific error.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u26A1 Auto-Analysis Mode'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                "Automatically analyze errors as they're logged to the console."
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F4BE} Smart Caching'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Built-in caching for improved performance - identical errors analyzed only once.'
              )
            ),
            e(
              l,
              { padding: 'lg', hoverable: !0, bordered: !0 },
              e(
                'h3',
                { style: { fontSize: '1.5rem', marginBottom: '1rem', color: '#667eea' } },
                '\u{1F504} Fallback Support'
              ),
              e(
                'p',
                { style: { color: '#6b7280' } },
                'Works with or without AI availability. Provides stack trace analysis when AI is unavailable.'
              )
            )
          )
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: 'white' } },
        e(
          c,
          { maxWidth: 'xl' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u{1F4DD} Usage Examples'
          ),
          e(I, {
            tabs: [
              {
                id: 'basic',
                label: 'Basic Usage',
                icon: '\u{1F680}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `import { createAIDebugger } from '@sldm/debug';

const aiDebugger = createAIDebugger({
  enableAutoAnalysis: true,
});

try {
  // Your code
  riskyOperation();
} catch (error) {
  const analysis = await aiDebugger.analyzeError(error, {
    code: sourceCode,
    file: 'app.ts',
    line: 42,
  });

  console.log('Summary:', analysis.summary);
  console.log('Causes:', analysis.possibleCauses);
  console.log('Fixes:', analysis.suggestedFixes);
  console.log('Severity:', analysis.severity);
}`
                    )
                  )
                ),
              },
              {
                id: 'hints',
                label: 'Debug Hints',
                icon: '\u{1F4A1}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `// Get debug hints for code
const hints = await aiDebugger.getDebugHints(
  \`function calculate(a, b) {
    return a / b;
  }\`,
  'This function sometimes returns Infinity'
);

hints.forEach(hint => {
  console.log(\`[\${hint.type}] \${hint.message}\`);
  if (hint.suggestion) {
    console.log('Suggestion:', hint.suggestion);
  }
});`
                    )
                  )
                ),
              },
              {
                id: 'fixes',
                label: 'Fix Suggestions',
                icon: '\u{1F527}',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `// Get AI-powered fix suggestion
const fix = await aiDebugger.suggestFix(
  error,
  problematicCode
);

console.log('Explanation:', fix.explanation);
console.log('Suggested Code:');
console.log(fix.suggestedCode);`
                    )
                  )
                ),
              },
              {
                id: 'auto',
                label: 'Auto-Analysis',
                icon: '\u26A1',
                content: e(
                  l,
                  { padding: 'lg' },
                  e(
                    'pre',
                    {
                      style: {
                        background: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.9rem',
                      },
                    },
                    e(
                      'code',
                      null,
                      `// Enable auto-analysis mode
const aiDebugger = createAIDebugger({
  enableAutoAnalysis: true,
  autoAnalysisLevel: 'error', // or 'warn', 'all'
});

// Errors are now automatically analyzed!
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error(error);
  // AI analysis happens automatically
  // and is logged to console
}`
                    )
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
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
          { maxWidth: 'lg' },
          e(
            'h2',
            {
              style: {
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            },
            '\u2699\uFE0F Prerequisites'
          ),
          e(
            l,
            { padding: 'lg', bordered: !0 },
            e(
              'ul',
              { style: { fontSize: '1.1rem', lineHeight: '2', color: '#4b5563' } },
              e('li', {}, '\u2705 Chrome 127+ with AI features enabled'),
              e('li', {}, '\u2705 @sldm/web-ai package installed'),
              e('li', {}, '\u2705 Internet connection for first-time AI model download'),
              e('li', {}, '\u{1F4A1} Falls back gracefully when AI unavailable')
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
          c,
          {},
          e('p', {}, 'Built with \u2764\uFE0F using Solidum'),
          e('p', { style: { marginTop: '0.5rem', opacity: '0.7' } }, 'MIT License \xA9 2025')
        )
      )
    );
  }
  function lt() {
    return e(
      'div',
      { className: 'components-page' },
      C(),
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
          c,
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
          e(k, { variant: 'secondary', size: 'lg', onClick: () => N('/') }, '\u2190 Back to Home')
        )
      ),
      e(
        'section',
        { style: { padding: '4rem 0', background: '#f9fafb' } },
        e(
          c,
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
              l,
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
                e(g, { variant: 'gradient', size: 'sm', glow: !0 }, 'Wild!')
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
              l,
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
                e(g, { variant: 'gradient', size: 'sm', glow: !0 }, 'Wild!')
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
              l,
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
              l,
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
                e(g, { variant: 'success', size: 'sm' }, 'Interactive')
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
              l,
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
              l,
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
  var Vt = {
      HomePage: Be,
      GettingStartedPage: Qe,
      ReactivityPage: Ze,
      RouterPage: et,
      StorePage: tt,
      ContextPage: rt,
      StoragePage: ot,
      SSRPage: nt,
      WebAIPage: at,
      AIDebuggerPage: it,
      ComponentsPage: lt,
    },
    Yt = window.location.pathname.includes('/solidum') ? '/solidum' : '',
    Xt = Ue({
      routes: {
        '/': 'HomePage',
        '/getting-started': 'GettingStartedPage',
        '/reactivity': 'ReactivityPage',
        '/router': 'RouterPage',
        '/store': 'StorePage',
        '/context': 'ContextPage',
        '/storage': 'StoragePage',
        '/ssr': 'SSRPage',
        '/web-ai': 'WebAIPage',
        '/ai-debugger': 'AIDebuggerPage',
        '/components': 'ComponentsPage',
      },
      basePath: Yt,
    });
  function st() {
    let t = X(),
      r = document.createElement('link');
    ((r.id = 'theme-stylesheet'),
      (r.rel = 'stylesheet'),
      (r.href = t === 'chalk' ? './chalk-styles.css' : './styles.css'),
      document.head.appendChild(r),
      document.body.classList.add(`${t}-theme`));
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => {
        (st(), le());
      })
    : (st(), le());
  window.addEventListener('routechange', () => {
    le();
  });
  window.addEventListener('themechange', () => {
    le();
  });
  function le() {
    let t = document.getElementById('app');
    if (t) {
      t.innerHTML = '';
      try {
        let r = Xt.getCurrentPage(),
          o = Vt[r] || Be;
        ae(t, o);
      } catch (r) {
        console.error('Mount error:', r);
      }
    }
  }
})();
//# sourceMappingURL=app.js.map
