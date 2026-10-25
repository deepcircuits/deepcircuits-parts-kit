/*
 * DeepCircuits Parts Kit: original part artwork generators. Built from src/ by build.mjs with esbuild; edit the modules there.
 *
 * Every generator returns an Artwork: { width, height, svg, pins }. Pixels are CSS pixels at 96 dpi, so 0.1 inch
 * is 9.6 px (PITCH) and every pin sits on that pitch relative to the part's first pin. The SVG uses presentation
 * attributes only (no <style>, no style attributes), because sanitizers strip both. A part's body keeps its fixed
 * material palette; anything that faces the canvas (pin names, symbols) is currentColor. Colours come from the
 * design tokens: see setTokenMode.
 */
var PartsKit = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __privateWrapper = (obj, member, setter, getter) => ({
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  });

  // src/tokens.js
  var FALLBACK, COLOR_TOKENS;
  var init_tokens = __esm({
    "src/tokens.js"() {
      FALLBACK = { "canvas": "#ffffff", "canvas-ink": "#020817", "canvas-ink-muted": "#475569", "canvas-grid": "#cbd5e1", "mark-select": "#6366f1", "mark-focus": "#0f766e", "mark-pin-connected": "#166534", "mark-pin-connected-ring": "#bbf7d0", "mark-hole-hover": "#2563eb", "mark-flow": "#fbbf24", "mark-waypoint": "#8b5cf6", "level-high": "#dc2626", "level-low": "#2563eb", "signal": "#ffd60a", "signal-ink": "#0b0b0c", "pcb-blue": "#1f5d87", "pcb-blue-edge": "#123b57", "pcb-green": "#1f6f43", "pcb-green-edge": "#0f3d24", "pcb-teal": "#107489", "pcb-teal-edge": "#0a4d58", "pcb-black": "#1d2731", "pcb-black-edge": "#0d1318", "pcb-purple": "#5b2d8e", "pcb-purple-edge": "#371a58", "pcb-white": "#f4f5f2", "pcb-white-edge": "#9aa1a8", "pcb-red": "#a8242f", "pcb-red-edge": "#6e151d", "silk": "#f2f6fa", "silk-dark": "#1f2933", "pad": "#d4b25c", "hole": "#ffffff", "cavity": "#0b1420", "chip": "#1f2328", "chip-edge": "#0b0d0f", "chip-print": "#e8ebee", "lead": "#9aa3ab", "lead-edge": "#525b65", "plastic-black": "#22272c", "plastic-black-edge": "#0e1114", "plastic-grey": "#59636c", "plastic-grey-edge": "#30373d", "plastic-white": "#ecebe6", "plastic-white-edge": "#b9b39a", "plastic-blue": "#2b6cb0", "plastic-blue-edge": "#1a4a7a", "plastic-red": "#c8323a", "plastic-red-edge": "#7f1a20", "plastic-amber": "#c06a2b", "plastic-amber-edge": "#7a3f14", "metal": "#c9ced3", "metal-edge": "#8d949b", "brass": "#c9a24a", "brass-edge": "#8a6a24", "glass": "#05070a", "bezel": "#2b3036", "resistor-body": "#e8d4b4", "resistor-body-edge": "#b89a6e", "resistor-smd": "#2d2a26", "band-black": "#0b0b0c", "band-brown": "#8c4a1f", "band-red": "#d7263d", "band-orange": "#f28c28", "band-yellow": "#ffd60a", "band-green": "#2e8b57", "band-blue": "#1e5bd8", "band-violet": "#7c3aed", "band-grey": "#8b8f94", "band-white": "#f4f4f0", "band-gold": "#c9a227", "band-silver": "#b8bcc0", "lens-red": "#ff3b30", "lens-green": "#22c55e", "lens-yellow": "#facc15", "lens-blue": "#3b82f6", "lens-white": "#f8fafc", "lens-orange": "#fb8c00", "indicator-off": "#3a4148", "indicator-off-light": "#c8ccc6", "cap-electrolytic": "#1b2a6b", "cap-stripe": "#d9d9d9", "cap-ceramic": "#b7a27a", "cap-mlcc": "#b8652e", "bread-body": "#f2f0e8", "bread-edge": "#c9c4b4", "bread-hole": "#3d3c38", "bread-print": "#55534c", "rail-plus": "#c62828", "rail-minus": "#1565c0", "lcd-green": "#a7d35a", "lcd-ink": "#1a2a12", "lcd-blue": "#1f55d6", "lcd-ink-light": "#e8f1ff", "segment-face": "#141517", "segment-off": "#2f2b2b", "readout": "#06110b", "readout-text": "#7ee2a8", "readout-dim": "#8fb8a0", "status-ok": "#4ade80", "status-near": "#fbbf24", "status-over": "#f87171", "pitch": "9.6px", "pitch-half": "4.8px", "pitch-2": "19.2px", "pitch-3": "28.8px", "pin-margin": "7.68px", "lead-length": "2.4px", "lead-width": "2.9px", "leg-width": "2.3px", "pad-radius": "2.6px", "hole-radius": "1.3px", "mount-hole-radius": "2.9px", "board-inset": "0.4px", "label-rise": "3.8px", "label-drop": "6.4px", "radius-board": "3px", "radius-bezel": "1.5px", "radius-chip": "1.4px", "radius-part": "1px", "radius-detail": "0.6px", "stroke-outline": "0.8px", "stroke-detail": "0.6px", "stroke-fine": "0.4px", "stroke-symbol": "1.6px", "opacity-lens-off": "0.45", "opacity-glow": "0.35", "opacity-segment-dim": "0.25", "opacity-light": "0.36", "opacity-shade": "0.16", "opacity-heat": "0.55", "opacity-flow": "0.95" };
      COLOR_TOKENS = ["canvas", "canvas-ink", "canvas-ink-muted", "canvas-grid", "mark-select", "mark-focus", "mark-pin-connected", "mark-pin-connected-ring", "mark-hole-hover", "mark-flow", "mark-waypoint", "level-high", "level-low", "signal", "signal-ink", "pcb-blue", "pcb-blue-edge", "pcb-green", "pcb-green-edge", "pcb-teal", "pcb-teal-edge", "pcb-black", "pcb-black-edge", "pcb-purple", "pcb-purple-edge", "pcb-white", "pcb-white-edge", "pcb-red", "pcb-red-edge", "silk", "silk-dark", "pad", "hole", "cavity", "chip", "chip-edge", "chip-print", "lead", "lead-edge", "plastic-black", "plastic-black-edge", "plastic-grey", "plastic-grey-edge", "plastic-white", "plastic-white-edge", "plastic-blue", "plastic-blue-edge", "plastic-red", "plastic-red-edge", "plastic-amber", "plastic-amber-edge", "metal", "metal-edge", "brass", "brass-edge", "glass", "bezel", "resistor-body", "resistor-body-edge", "resistor-smd", "band-black", "band-brown", "band-red", "band-orange", "band-yellow", "band-green", "band-blue", "band-violet", "band-grey", "band-white", "band-gold", "band-silver", "lens-red", "lens-green", "lens-yellow", "lens-blue", "lens-white", "lens-orange", "indicator-off", "indicator-off-light", "cap-electrolytic", "cap-stripe", "cap-ceramic", "cap-mlcc", "bread-body", "bread-edge", "bread-hole", "bread-print", "rail-plus", "rail-minus", "lcd-green", "lcd-ink", "lcd-blue", "lcd-ink-light", "segment-face", "segment-off", "readout", "readout-text", "readout-dim", "status-ok", "status-near", "status-over"];
    }
  });

  // src/core.js
  function num(v, fb) {
    const n = parseFloat(v);
    return isFinite(n) ? n : fb;
  }
  function setTokenMode(m, props) {
    if (m !== "live" && m !== "values" && m !== "vars") throw new Error("The token mode is 'live', 'values' or 'vars'.");
    mode = m;
    prefix = props && props.prefix || "";
    cache = null;
  }
  function tokenMode() {
    return { mode, prefix };
  }
  function tokens() {
    const now = mode === "live" ? Date.now() : 0;
    if (cache && (mode !== "live" || now - cacheAt < 50)) return cache;
    const out = {};
    let css = null;
    if (mode === "live")
      try {
        if (typeof document !== "undefined" && typeof getComputedStyle === "function")
          css = getComputedStyle(document.documentElement);
      } catch (e) {
        css = null;
      }
    for (const k in FALLBACK) {
      const v = css ? css.getPropertyValue(`--${prefix}${k}`).trim() : "";
      out[k] = v || (mode === "vars" && COLOR.has(k) ? `var(--${prefix}${k}, ${FALLBACK[k]})` : FALLBACK[k]);
    }
    for (const k in FALLBACK) if (!COLOR.has(k)) out[k] = num(out[k], num(FALLBACK[k], 0));
    cache = out;
    cacheAt = now;
    return out;
  }
  function attrs(props) {
    let s = "";
    for (const k in props) {
      const v = props[k];
      if (v === void 0 || v === null || v === false) continue;
      s += ` ${k}="${typeof v === "number" ? r2(v) : esc(v)}"`;
    }
    return s;
  }
  function el(tag2, props, inner) {
    return `<${tag2}${attrs(props)}${inner !== void 0 ? `>${inner}</${tag2}>` : "/>"}`;
  }
  function rect(x, y, w, h, fill, more) {
    return el("rect", Object.assign({ x, y, width: w, height: h, fill }, more || {}));
  }
  function circle(cx, cy, r, fill, more) {
    return el("circle", Object.assign({ cx, cy, r, fill }, more || {}));
  }
  function line(x1, y1, x2, y2, stroke, w, more) {
    return el(
      "line",
      Object.assign({ x1, y1, x2, y2, stroke, "stroke-width": w, "stroke-linecap": "round" }, more || {})
    );
  }
  function path(d, fill, more) {
    return el("path", Object.assign({ d, fill }, more || {}));
  }
  function text(x, y, s, size, fill, more) {
    return el(
      "text",
      Object.assign({ x, y, "font-size": size, "font-family": MONO, fill, "text-anchor": "middle" }, more || {}),
      esc(s)
    );
  }
  function svg(w, h, label, inner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(w)}" height="${r2(h)}" viewBox="0 0 ${r2(w)} ${r2(h)}" role="img" aria-label="${esc(label)}">${flushDefs()}${inner}</svg>`;
  }
  function art(w, h, label, inner, pins) {
    return {
      width: r2(w),
      height: r2(h),
      svg: svg(w, h, label, inner),
      pins: pins.map((p) => {
        return { name: p.name, x: r2(p.x), y: r2(p.y) };
      })
    };
  }
  function edge(T, color, w) {
    return { stroke: color, "stroke-width": w === void 0 ? T["stroke-outline"] : w };
  }
  function tag(name, inner, more) {
    return el("g", Object.assign({ "data-part": name }, more || {}), inner);
  }
  function bevel(T, x, y, w, h, d, rx) {
    d = d || Math.max(1, Math.min(2.2, Math.min(w, h) * 0.09));
    if (rx === void 0) rx = Math.max(1, d);
    const i = 0.7 + d / 2;
    const r = Math.max(0.3, rx - d / 2 - 0.2);
    const x0 = x + i;
    const y0 = y + i;
    const x1 = x + w - i;
    const y1 = y + h - i;
    const k = r * (1 - Math.SQRT1_2);
    const light = `M${r2(x0)} ${r2(y1 - r)}V${r2(y0 + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x0 + r)} ${r2(y0)}H${r2(x1 - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1 - k)} ${r2(
      y0 + k
    )}M${r2(x0)} ${r2(y1 - r)}A${r2(r)} ${r2(r)} 0 0 0 ${r2(x0 + k)} ${r2(y1 - k)}`;
    const shade = `M${r2(x1 - k)} ${r2(y0 + k)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(y0 + r)}V${r2(y1 - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1 - r)} ${r2(y1)}H${r2(x0 + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x0 + k)} ${r2(y1 - k)}`;
    return path(light, "none", {
      stroke: "#ffffff",
      "stroke-width": d,
      "stroke-opacity": T["opacity-light"],
      "stroke-linecap": "butt"
    }) + path(shade, "none", {
      stroke: "#000000",
      "stroke-width": d,
      "stroke-opacity": T["opacity-shade"],
      "stroke-linecap": "butt"
    });
  }
  function sheen(kind, color) {
    const key = kind === "glow" ? `glow ${color}` : kind;
    let found = SHEENS.get(key);
    if (!found) {
      if (SHEENS.size >= 512) SHEENS.clear();
      found = gradient(kind, color);
      SHEENS.set(key, found);
    }
    DEFS[found.id] = found.def;
    return `url(#${found.id})`;
  }
  function gradient(kind, color) {
    let id;
    let shape;
    if (kind === "glow") {
      id = `pk-glow-${String(color).replace(/[^0-9a-z]/gi, "").toLowerCase()}`;
      shape = [
        "radialGradient",
        { cx: "50%", cy: "50%", r: "50%" },
        [
          ["0", color, 0.9],
          ["0.55", color, 0.55],
          ["1", color, 0]
        ]
      ];
    } else {
      const name = kind === "hot" || kind === "dome" || kind === "lens" ? kind : "metal";
      id = `pk-${name}`;
      shape = GRADIENTS[name];
    }
    const [element, geometry, stops] = shape;
    const def = el(
      element,
      { id, ...geometry },
      stops.map(([offset, c, opacity]) => el("stop", { offset, "stop-color": c, "stop-opacity": opacity })).join("")
    );
    return { id, def };
  }
  function bevelPoly(T, pts, d) {
    d = d || 2.2;
    const n = pts.length;
    let area = 0;
    let light = "";
    let shade = "";
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      area += a[0] * b[1] - b[0] * a[1];
    }
    const sgn = area > 0 ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const ex = b[0] - a[0];
      const ey = b[1] - a[1];
      const len = Math.sqrt(ex * ex + ey * ey);
      if (len < 2 * d + 1) continue;
      const nx = -ey / len * sgn;
      const ny = ex / len * sgn;
      const ox = nx * (0.7 + d / 2);
      const oy = ny * (0.7 + d / 2);
      const sh = d;
      const q = `M${r2(a[0] + ex / len * sh + ox)} ${r2(a[1] + ey / len * sh + oy)}L${r2(b[0] - ex / len * sh + ox)} ${r2(b[1] - ey / len * sh + oy)}`;
      if (-nx - ny > 0.05) light += q;
      else if (-nx - ny < -0.05) shade += q;
    }
    return (light ? path(light, "none", {
      stroke: "#ffffff",
      "stroke-width": d,
      "stroke-opacity": T["opacity-light"],
      "stroke-linecap": "round"
    }) : "") + (shade ? path(shade, "none", {
      stroke: "#000000",
      "stroke-width": d,
      "stroke-opacity": T["opacity-shade"],
      "stroke-linecap": "round"
    }) : "");
  }
  function flushDefs() {
    const k = Object.keys(DEFS);
    if (!k.length) return "";
    const d = `<defs>${k.map((n) => {
      return DEFS[n];
    }).join("")}</defs>`;
    DEFS = {};
    return d;
  }
  function pinsOnPitch(pins, tolerance) {
    tolerance = tolerance === void 0 ? 1e-6 : tolerance;
    if (!pins.length) return true;
    const f = pins[0];
    const on2 = function(d) {
      return Math.abs(d / PITCH - Math.round(d / PITCH)) * PITCH <= tolerance;
    };
    return pins.every((p) => {
      return on2(p.x - f.x) && on2(p.y - f.y);
    });
  }
  function finish(T, name) {
    const f = FINISHES[name] || FINISHES.blue;
    return { board: T[f.board], edge: T[f.edge], silk: T[f.silk], indicatorOff: T[f.indicatorOff] };
  }
  function lensColor(T, value) {
    if (typeof value === "string" && LENSES[value.toLowerCase()]) return T[LENSES[value.toLowerCase()]];
    if (typeof value === "string" && /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]{3,20}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\))$/i.test(
      value
    ))
      return value;
    return T["lens-red"];
  }
  function pin(props) {
    const T = tokens();
    const x = props.x;
    const y = props.y;
    const kind = props.kind || "pad";
    let s = "";
    const silk = props.silk || T.silk;
    const size = props.size || PIN_LABEL;
    const p = T.pitch;
    if (kind === "pad")
      s += tag(
        "pin",
        circle(x, y, T["pad-radius"], T.pad) + circle(x, y, T["hole-radius"], T.hole, edge(T, T["metal-edge"], 0.5))
      );
    else if (kind === "socket")
      s += tag(
        "pin",
        rect(x - p / 2, y - p / 2, p, p, T["plastic-black"], {
          stroke: T["plastic-black-edge"],
          "stroke-width": T["stroke-fine"]
        }) + rect(x - 1.5, y - 1.5, 3, 3, T.cavity, { rx: 0.4 })
      );
    else if (kind === "smd") s += tag("pin", rect(x - 3.2, y - 2.4, 6.4, 4.8, T.pad, { rx: T["radius-part"] }));
    if (props.label) {
      const side = props.side || "above";
      const clear = kind === "socket" ? p / 2 : 0;
      if (props.rotate) {
        const gapR = clear ? clear + 1.6 : T["pad-radius"] + 1;
        const ty = side === "above" ? y - gapR : y + gapR;
        s += text(x, ty, props.label, size, silk, {
          "text-anchor": side === "above" ? "start" : "end",
          "dominant-baseline": "middle",
          transform: `rotate(-90 ${r2(x)} ${r2(ty)})`
        });
      } else if (side === "above") s += text(x, y - clear - T["label-rise"] + (clear ? 1.4 : 0), props.label, size, silk);
      else if (side === "below") s += text(x, y + clear + T["label-drop"] - (clear ? 1.4 : 0), props.label, size, silk);
      else if (side === "left")
        s += text(x - (kind === "socket" ? p * 0.7 : T["pad-radius"] + 1.4), y + size * 0.36, props.label, size, silk, {
          "text-anchor": "end"
        });
      else
        s += text(x + (kind === "socket" ? p * 0.7 : T["pad-radius"] + 1.4), y + size * 0.36, props.label, size, silk, {
          "text-anchor": "start"
        });
    }
    return s;
  }
  function header(props) {
    const T = tokens();
    const p = T.pitch;
    const labels = props.labels || [];
    const count = props.count || labels.length;
    const axis = props.axis || "x";
    let s = "";
    const pins = [];
    for (let i = 0; i < count; i++) {
      const x = axis === "x" ? props.x + i * p : props.x;
      const y = axis === "x" ? props.y : props.y + i * p;
      const name = labels[i] || String(i + 1);
      s += pin({
        x,
        y,
        kind: props.kind,
        label: props.labels ? name : void 0,
        side: props.side,
        silk: props.silk,
        size: props.size,
        rotate: props.rotate
      });
      pins.push({ name, x, y });
    }
    return { svg: s, pins };
  }
  function board(props) {
    const T = tokens();
    const f = finish(T, props.finish);
    const i = T["board-inset"];
    const w = props.width;
    const h = props.height;
    const y0 = props.y || 0;
    let s = "";
    s += tag(
      "board",
      rect(i, y0 + i, w - 2 * i, h - 2 * i, f.board, Object.assign({ rx: T["radius-board"] }, edge(T, f.edge)))
    );
    s += bevel(T, i, y0 + i, w - 2 * i, h - 2 * i, 2.2, T["radius-board"]);
    if (props.holes !== false) {
      const m = 0.6 * T.pitch;
      const r = T["mount-hole-radius"];
      (props.holes === "top" ? [
        [m, y0 + m],
        [w - m, y0 + m]
      ] : [
        [m, y0 + m],
        [w - m, y0 + m],
        [m, y0 + h - m],
        [w - m, y0 + h - m]
      ]).forEach((c) => {
        s += tag("hole", circle(c[0], c[1], r, T.hole, edge(T, T.pad)));
      });
    }
    if (props.title)
      s += text(
        props.titleX === void 0 ? w / 2 : props.titleX,
        props.titleY === void 0 ? y0 + h / 2 : props.titleY,
        props.title,
        props.titleSize || 5,
        f.silk,
        props.titleAnchor ? { "text-anchor": props.titleAnchor } : void 0
      );
    if (props.mark) s += silkMark(props.mark.x, props.mark.y, props.mark.size || T.pitch, f.silk);
    return s;
  }
  function silkMark(x, y, size, color) {
    const k = size / 32;
    return el(
      "g",
      { "data-mark": "deepcircuits", "data-part": "mark", transform: `translate(${r2(x)} ${r2(y)}) scale(${r2(k)})` },
      path("M4 16h11", "none", { stroke: color, "stroke-width": 3.2, "stroke-linecap": "round" }) + circle(20, 16, 5, color) + path("M18 25h10", "none", { stroke: color, "stroke-width": 3.2, "stroke-linecap": "round" })
    );
  }
  function flow(x1, y1, x2, y2, on2, hook) {
    const T = tokens();
    if (on2 === "reverse") [x1, y1, x2, y2] = [x2, y2, x1, y1];
    return line(x1, y1, x2, y2, T.signal, 1.2, {
      "data-hook": hook,
      "data-live": "flow",
      "data-part": "flow",
      "stroke-dasharray": "2.4 3.4",
      opacity: on2 ? T["opacity-flow"] : 0
    });
  }
  function probe(x, y) {
    const T = tokens();
    return el(
      "g",
      { "data-live": "probe", "data-part": "probe" },
      circle(x, y, 4.6, T.signal, { "fill-opacity": 0.3 }) + circle(x, y, 4.6, "none", { stroke: T.signal, "stroke-width": 1.4 }) + circle(x, y, 1.5, T["signal-ink"])
    );
  }
  function chipTemplate(props) {
    const T = tokens();
    const names = props.pins;
    const label = props.label;
    const kind = props.package || "dip";
    if (!names || names.length < 4 || names.length > 64 || names.length % 2)
      throw new Error(`A ${kind.toUpperCase()} needs an even pin count from 4 to 64.`);
    const half = names.length / 2;
    const p = T.pitch;
    const span = ROW_PITCHES[kind] * p;
    const NAME = 5.2;
    const LEAD = T["lead-length"];
    const longest = Math.max.apply(
      null,
      names.map((n) => {
        return n.length;
      })
    );
    const margin = Math.ceil((longest * NAME * 0.62 + 3) * 10) / 10;
    const width = 2 * margin + span;
    const xl = margin;
    const xr = margin + span;
    const top = p * 0.8;
    const height = 2 * top + (half - 1) * p;
    const pinY = function(row) {
      return top + row * p;
    };
    const pins = names.map((name, index) => {
      return index < half ? { name, x: xl, y: pinY(index) } : { name, x: xr, y: pinY(names.length - 1 - index) };
    });
    const bodyLeft = xl + LEAD;
    const bodyRight = xr - LEAD;
    const bodyTop = top - p * 0.6;
    const bodyBottom = height - bodyTop;
    const cx = (bodyLeft + bodyRight) / 2;
    const cy = height / 2;
    let s = tag(
      "body",
      rect(
        bodyLeft,
        bodyTop,
        bodyRight - bodyLeft,
        bodyBottom - bodyTop,
        T.chip,
        Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"]))
      )
    );
    s += path(`M${r2(cx - 2.6)} ${r2(bodyTop)}a2.6 2.6 0 0 0 5.2 0z`, T["chip-print"]);
    if (kind !== "dip") s += circle(bodyLeft + 2.2, top, 0.9, T["chip-print"]);
    pins.forEach((pn, index) => {
      const left = pn.x === xl;
      s += line(pn.x, pn.y, left ? bodyLeft : bodyRight, pn.y, T["lead-edge"], T["lead-width"]) + line(pn.x, pn.y, left ? bodyLeft : bodyRight, pn.y, T.lead, T["lead-width"] - 1);
      s += rect(
        left ? bodyLeft - LEAD * 0.55 : bodyRight,
        pn.y - 1.7,
        LEAD * 0.55,
        3.4,
        T.lead,
        Object.assign({ rx: 0.3 }, edge(T, T["lead-edge"], 0.4))
      );
      s += text(left ? pn.x - 2.2 : pn.x + 2.2, pn.y + NAME * 0.36, pn.name, NAME, "currentColor", {
        "text-anchor": left ? "end" : "start"
      });
      if (kind === "dip")
        s += text(left ? bodyLeft + 0.8 : bodyRight - 0.8, pn.y + 1.2, String(index + 1), PIN_LABEL, T["chip-print"], {
          "text-anchor": left ? "start" : "end"
        });
    });
    s += bevel(T, bodyLeft, bodyTop, bodyRight - bodyLeft, bodyBottom - bodyTop, 1.6, T["radius-chip"]);
    s += circle(cx, bodyTop + 4.2, 1.1, "none", {
      stroke: T["chip-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8
    }) + circle(cx, bodyBottom - 4.2, 1.1, "none", {
      stroke: T["chip-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8
    });
    const labelSize = Math.min(6.4, (bodyBottom - bodyTop - 8) / Math.max(4, label.length) * 1.6);
    const code = lotCode(label);
    const codeRoom = bodyBottom - bodyTop - 8 >= code.length * PIN_LABEL * 0.62 && labelSize >= 4.4;
    const numbersW = kind === "dip" ? 0.8 + 2 * PIN_LABEL * 0.62 + 0.5 : 1.2;
    const block = labelSize + 0.8 + PIN_LABEL;
    const withCode = codeRoom && bodyRight - bodyLeft >= block + 2 * numbersW;
    const labelX = withCode ? cx + block / 2 - labelSize / 2 : cx;
    const codeX = cx - block / 2 + PIN_LABEL / 2;
    s += text(labelX, cy, label, labelSize, T["chip-print"], {
      "dominant-baseline": "middle",
      transform: `rotate(90 ${r2(labelX)} ${r2(cy)})`
    });
    if (withCode)
      s += text(codeX, cy, code, PIN_LABEL, T["chip-print"], {
        "dominant-baseline": "middle",
        "fill-opacity": 0.85,
        transform: `rotate(90 ${r2(codeX)} ${r2(cy)})`
      });
    return art(width, height, `${label}, ${names.length}-pin ${kind.toUpperCase()}`, s, pins);
  }
  function lotCode(label) {
    let h = 7;
    for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) % 1e5;
    return `DC${26 + h % 9}${String.fromCharCode(65 + h % 26)}${100 + h % 900}`;
  }
  function trace(T, finishName, points) {
    const d = points.map((pt, i) => {
      return `${(i ? "L" : "M") + r2(pt[0])} ${r2(pt[1])}`;
    }).join("");
    return path(d, "none", {
      "data-part": "trace",
      stroke: finishName === "white" ? "#000000" : "#ffffff",
      "stroke-opacity": finishName === "white" ? 0.1 : 0.11,
      "stroke-width": 1.1,
      "stroke-linejoin": "round",
      "stroke-linecap": "round"
    });
  }
  function via(T, x, y) {
    return tag("via", circle(x, y, 1.2, T.pad) + circle(x, y, 0.55, T.hole, edge(T, T["metal-edge"], 0.4)));
  }
  function capTop(T, x, y, r) {
    return tag(
      "cap",
      circle(x, y, r, T["cap-electrolytic"], edge(T, T["plastic-black-edge"], T["stroke-detail"])) + path(
        `M${r2(x + r * 0.55)} ${r2(y - r * 0.83)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x + r * 0.55)} ${r2(y + r * 0.83)}L${r2(x + r * 0.72)} ${r2(y + r * 0.69)}A${r2(r)} ${r2(r)} 0 0 0 ${r2(x + r * 0.72)} ${r2(y - r * 0.69)}z`,
        T["cap-stripe"]
      ) + circle(x, y, r * 0.62, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + circle(x, y, r * 0.62, sheen("metal"), { "fill-opacity": 0.6 }) + path(`M${r2(x - r * 0.4)} ${r2(y)}h${r2(r * 0.8)}M${r2(x)} ${r2(y - r * 0.4)}v${r2(r * 0.8)}`, "none", {
        stroke: T["metal-edge"],
        "stroke-width": 0.6
      })
    );
  }
  function lens(props) {
    const T = tokens();
    const cx = props.cx;
    const cy = props.cy;
    const r = props.r || 9;
    const color = lensColor(T, props.color);
    const on2 = !!props.on;
    const b = on2 ? props.brightness === void 0 ? 1 : Math.max(0, Math.min(1, props.brightness)) : 0;
    let s = "";
    s += tag(
      "glow",
      circle(cx, cy, r * 1.55, color, {
        "data-hook": props.hook ? `${props.hook}-glow` : "glow",
        "fill-opacity": r2(T["opacity-glow"] * b)
      })
    );
    s += tag(
      "lens",
      circle(cx, cy, r, T["plastic-grey"], edge(T, T["plastic-grey-edge"], T["stroke-detail"])) + circle(cx, cy, r, color, {
        "data-hook": props.hook || "lens",
        "fill-opacity": on2 ? r2(T["opacity-lens-off"] + (1 - T["opacity-lens-off"]) * b) : T["opacity-lens-off"]
      }) + circle(cx, cy, r, sheen("lens"), { "fill-opacity": on2 ? 0.9 : 0.7 })
    );
    return s;
  }
  function lit(on2) {
    return typeof on2 === "number" ? on2 > 0 ? Math.min(1, on2) : 0 : on2 ? 1 : 0;
  }
  function indicator(props) {
    const T = tokens();
    const f = finish(T, props.finish);
    const w = props.size || 1.6 * T.pitch;
    const color = lensColor(T, props.color);
    const level = lit(props.on);
    let s = "";
    if (level)
      s += tag(
        "glow",
        rect(props.x - w * 0.35, props.y - w * 0.35, w * 1.7, w * 1.7, color, {
          rx: w * 0.5,
          "fill-opacity": r2(T["opacity-glow"] * level)
        })
      );
    s += tag(
      "indicator",
      rect(
        props.x,
        props.y,
        w,
        w,
        level ? color : f.indicatorOff,
        Object.assign(
          {
            "data-hook": props.hook,
            rx: 1.2,
            "data-on-fill": color,
            "data-off-fill": f.indicatorOff,
            "data-lit-state": props.state,
            "data-lit": level ? "true" : "false"
          },
          edge(T, f.edge, T["stroke-detail"])
        )
      )
    );
    if (props.label) s += text(props.x + w / 2, props.y + w + 4.2, props.label, PIN_LABEL, f.silk);
    return s;
  }
  var PITCH, MONO, cache, cacheAt, mode, prefix, COLOR, PIN_LABEL, r2, ESCAPED, esc, DEFS, SHEENS, GRADIENTS, FINISHES, LENSES, ROW_PITCHES;
  var init_core = __esm({
    "src/core.js"() {
      init_tokens();
      PITCH = 9.6;
      MONO = "ui-monospace,monospace";
      cache = null;
      cacheAt = 0;
      mode = "values";
      prefix = "";
      COLOR = new Set(COLOR_TOKENS);
      PIN_LABEL = 4;
      r2 = function(n) {
        return Math.round(n * 100) / 100;
      };
      ESCAPED = /[&<>"]/;
      esc = function(s) {
        s = String(s);
        return ESCAPED.test(s) ? s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : s;
      };
      DEFS = {};
      SHEENS = /* @__PURE__ */ new Map();
      GRADIENTS = {
        hot: [
          "radialGradient",
          { cx: "50%", cy: "50%", r: "50%" },
          [
            ["0", "#ffffff", 0.95],
            ["0.4", "#ffffff", 0.45],
            ["1", "#ffffff", 0]
          ]
        ],
        dome: [
          "radialGradient",
          { cx: "38%", cy: "30%", r: "70%" },
          [
            ["0", "#ffffff", 0.55],
            ["0.45", "#ffffff", 0.08],
            ["1", "#000000", 0.22]
          ]
        ],
        lens: [
          "radialGradient",
          { cx: "36%", cy: "32%", r: "65%" },
          [
            ["0", "#ffffff", 0.5],
            ["0.5", "#ffffff", 0.06],
            ["1", "#000000", 0.18]
          ]
        ],
        metal: [
          "linearGradient",
          { x1: "0", y1: "0", x2: "1", y2: "1" },
          [
            ["0", "#ffffff", 0.42],
            ["0.5", "#ffffff", 0.04],
            ["1", "#000000", 0.2]
          ]
        ]
      };
      FINISHES = {
        blue: { board: "pcb-blue", edge: "pcb-blue-edge", silk: "silk", indicatorOff: "indicator-off" },
        green: { board: "pcb-green", edge: "pcb-green-edge", silk: "silk", indicatorOff: "indicator-off" },
        teal: { board: "pcb-teal", edge: "pcb-teal-edge", silk: "silk", indicatorOff: "indicator-off" },
        black: { board: "pcb-black", edge: "pcb-black-edge", silk: "silk", indicatorOff: "indicator-off" },
        purple: { board: "pcb-purple", edge: "pcb-purple-edge", silk: "silk", indicatorOff: "indicator-off" },
        white: { board: "pcb-white", edge: "pcb-white-edge", silk: "silk-dark", indicatorOff: "indicator-off-light" },
        red: { board: "pcb-red", edge: "pcb-red-edge", silk: "silk", indicatorOff: "indicator-off" }
      };
      LENSES = {
        red: "lens-red",
        green: "lens-green",
        yellow: "lens-yellow",
        blue: "lens-blue",
        white: "lens-white",
        orange: "lens-orange"
      };
      ROW_PITCHES = { dip: 3, soic: 2, tssop: 2 };
    }
  });

  // src/pieces.js
  function smd(T, kind, x, y, horizontal) {
    const w = horizontal ? 0.9 * T.pitch : 0.55 * T.pitch;
    const h = horizontal ? 0.55 * T.pitch : 0.9 * T.pitch;
    let s = "";
    if (kind === "crystal")
      return tag(
        "crystal",
        rect(
          x,
          y,
          horizontal ? 1.3 * T.pitch : 0.7 * T.pitch,
          horizontal ? 0.7 * T.pitch : 1.3 * T.pitch,
          T.metal,
          Object.assign({ rx: 0.35 * T.pitch }, edge(T, T["metal-edge"], T["stroke-fine"]))
        )
      );
    s += rect(x, y, w, h, kind === "capacitor" ? T["cap-ceramic"] : T["resistor-smd"], { rx: 0.4 });
    s += rect(x, y, horizontal ? w * 0.18 : w, horizontal ? h : h * 0.18, T.lead, { rx: 0.3 }) + rect(
      horizontal ? x + w * 0.82 : x,
      horizontal ? y : y + h * 0.82,
      horizontal ? w * 0.18 : w,
      horizontal ? h : h * 0.18,
      T.lead,
      { rx: 0.3 }
    );
    if (kind === "resistor")
      s += rect(
        horizontal ? x + w * 0.3 : x + w * 0.2,
        horizontal ? y + h * 0.2 : y + h * 0.3,
        horizontal ? w * 0.4 : w * 0.6,
        horizontal ? h * 0.6 : h * 0.4,
        T["cap-stripe"],
        { rx: 0.2, "fill-opacity": 0.9 }
      );
    return tag("smd", s);
  }
  function dipOnBoard(T, x, cy, lengthPitches, label, pin1Right) {
    const p = T.pitch;
    const bw = lengthPitches * p;
    const bh = 2.6 * p;
    let s = "";
    const n = Math.round(lengthPitches);
    for (let i = 0; i < n; i++) {
      const lx = x + (i + 0.5) * p;
      s += rect(lx - 1.1, cy - 1.5 * p, 2.2, 1.5 * p - bh / 2 + 0.6, T.lead, { rx: 0.3 }) + rect(lx - 1.1, cy + bh / 2 - 0.6, 2.2, 1.5 * p - bh / 2 + 0.6, T.lead, { rx: 0.3 });
    }
    s += tag(
      "chip",
      rect(x - 1.1, cy - 1.5 * p, bw + 2.2, 3 * p, "none") + rect(x, cy - bh / 2, bw, bh, T.chip, Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"])))
    );
    s += rect(x + 0.6, cy - bh / 2 + 0.6, bw - 1.2, 1.2, "#ffffff", { rx: 0.6, "fill-opacity": T["opacity-light"] * 0.5 }) + rect(x + 0.6, cy + bh / 2 - 1.8, bw - 1.2, 1.2, "#000000", { rx: 0.6, "fill-opacity": T["opacity-shade"] });
    if (pin1Right)
      s += path(`M${r2(x + bw)} ${r2(cy - 2.6)}a2.6 2.6 0 0 1 0 5.2z`, T["chip-print"]) + circle(x + bw - 0.5 * p, cy - bh / 2 + 0.45 * p, 0.9, T["chip-print"]);
    else
      s += path(`M${r2(x)} ${r2(cy - 2.6)}a2.6 2.6 0 0 0 0 5.2z`, T["chip-print"]) + circle(x + 0.5 * p, cy + bh / 2 - 0.45 * p, 0.9, T["chip-print"]);
    s += circle(x + 4.2, cy, 1.1, "none", {
      stroke: T["chip-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8
    }) + circle(x + bw - 4.2, cy, 1.1, "none", {
      stroke: T["chip-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8
    });
    if (label)
      s += text(x + bw / 2, cy - 0.4, label, 4.4, T["chip-print"]) + text(x + bw / 2, cy + PIN_LABEL + 0.2, lotCode(label), PIN_LABEL, T["chip-print"], { "fill-opacity": 0.85 });
    return s;
  }
  function usbPort(T, props) {
    const kind = props.kind || "micro";
    const mouth = props.mouth || "down";
    const x0 = props.x;
    const y0 = props.y;
    const w = props.w;
    const h = props.h;
    const vert = mouth === "down" || mouth === "up";
    const L = vert ? h : w;
    const W = vert ? w : h;
    const cx = x0 + w / 2;
    const cy = y0 + h / 2;
    const R = function(u0, u1, v0, v1, fill, more) {
      const a = (u1 - u0) * W;
      const b = (v1 - v0) * L;
      if (mouth === "down") return rect(cx + u0 * W, y0 + v0 * L, a, b, fill, more);
      if (mouth === "up") return rect(cx + u0 * W, y0 + (1 - v1) * L, a, b, fill, more);
      if (mouth === "right") return rect(x0 + v0 * L, cy + u0 * W, b, a, fill, more);
      return rect(x0 + (1 - v1) * L, cy + u0 * W, b, a, fill, more);
    };
    const seam = function(v) {
      if (vert) {
        const y = mouth === "down" ? y0 + v * L : y0 + (1 - v) * L;
        return line(x0 + 1.2, y, x0 + w - 1.2, y, T["metal-edge"], T["stroke-fine"]);
      }
      const x = mouth === "right" ? x0 + v * L : x0 + (1 - v) * L;
      return line(x, y0 + 1.2, x, y0 + h - 1.2, T["metal-edge"], T["stroke-fine"]);
    };
    const rx = kind === "c" ? W * 0.45 : 1;
    let s = "";
    s += R(-0.5, -0.34, 0, 0.16, T["metal-edge"], { rx: 0.3 }) + R(0.34, 0.5, 0, 0.16, T["metal-edge"], { rx: 0.3 });
    s += R(-0.5, 0.5, 0.1, 1, T.metal, Object.assign({ rx }, edge(T, T["metal-edge"])));
    s += R(-0.5, 0.5, 0.1, 1, sheen("metal"), { rx, "fill-opacity": 0.75 });
    s += R(-0.5, 0.5, 0.1, 0.24, "#ffffff", { rx, "fill-opacity": 0.18 });
    s += seam(0.5);
    if (kind === "c") s += R(-0.34, 0.34, 0.8, 0.95, T["plastic-black"], { rx: 0.075 * L });
    else {
      if (kind === "mini") s += R(-0.12, 0.12, 0.58, 0.72, T.cavity, { rx: 0.3 });
      else s += R(-0.34, -0.2, 0.6, 0.76, T.cavity, { rx: 0.3 }) + R(0.2, 0.34, 0.6, 0.76, T.cavity, { rx: 0.3 });
      s += R(-0.38, 0.38, 0.86, 0.97, T["plastic-black"], { rx: 0.4 });
    }
    return tag("usb", s);
  }
  function padRow(T, fin, f, props, toward) {
    const hdr = header(props);
    const p = T.pitch;
    const n = hdr.pins.length;
    hdr.pins.forEach((pn, i) => {
      const dx = (i - (n - 1) / 2) * 0.3 * p;
      if (props.axis === "y")
        hdr.svg += trace(T, fin, [
          [pn.x, pn.y],
          [pn.x + (toward < 0 ? -1.1 : 1.1) * p, pn.y],
          [pn.x + (toward < 0 ? -1.6 : 1.6) * p, pn.y + dx]
        ]);
      else
        hdr.svg += trace(T, fin, [
          [pn.x, pn.y],
          [pn.x, pn.y + (toward < 0 ? -1.1 : 1.1) * p],
          [pn.x + dx, pn.y + (toward < 0 ? -1.6 : 1.6) * p]
        ]);
    });
    return hdr;
  }
  function edgeHeader(T, props) {
    const p = T.pitch;
    const mm = p / 2.54;
    const names = props.names;
    const side = props.side || "bottom";
    const back = !!props.back;
    const ext = props.ext === void 0 ? (back ? 8.5 : 6) * mm : props.ext;
    const deep = 2.5 * mm;
    const padIn = (back ? 1.6 : 3.7) * mm;
    let s = "";
    const pins = [];
    const pads = [];
    const across = side === "top" || side === "bottom";
    const out = side === "bottom" || side === "right" ? 1 : -1;
    const R = function(a0, a1, c0, c1, fill, attrs2) {
      const u0 = props.at + out * c0;
      const u1 = props.at + out * c1;
      const lo = Math.min(u0, u1);
      const span = Math.abs(u1 - u0);
      return across ? rect(a0, lo, a1 - a0, span, fill, attrs2) : rect(lo, a0, span, a1 - a0, fill, attrs2);
    };
    const P = function(a, c) {
      return across ? { x: a, y: props.at + out * c } : { x: props.at + out * c, y: a };
    };
    names.forEach((n, i) => {
      const a = props.from + i * p;
      const pad = P(a, -padIn);
      const tip = P(a, ext);
      s += tag("pad", circle(pad.x, pad.y, T["pad-radius"], T.pad));
      s += tag(
        "leg",
        R(a - 1.2, a + 1.2, back ? deep : 0, ext, T["lead-edge"], { rx: 0.5 }) + R(a - 0.8, a + 0.8, back ? deep : 0, ext, T.lead, { rx: 0.4 })
      );
      if (!back) s += R(a - 0.8, a + 0.8, -padIn, -deep + 0.2 * mm, T.lead, { rx: 0.4 });
      pins.push({ name: n, x: r2(tip.x), y: r2(tip.y) });
      pads.push({ x: r2(pad.x), y: r2(pad.y) });
    });
    s += tag(
      "header",
      R(
        props.from - p / 2,
        props.from + (names.length - 0.5) * p,
        back ? 0 : -deep,
        back ? deep : 0,
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    return { svg: s, pins, pads };
  }
  function silkFrame(T, f, x, y, w, h) {
    return rect(x - 1.2, y - 1.2, w + 2.4, h + 2.4, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85,
      rx: 0.4
    });
  }
  function framed(T, f, kind, x, y, horizontal) {
    const p = T.pitch;
    const w = horizontal ? 0.9 * p : 0.55 * p;
    const h = horizontal ? 0.55 * p : 0.9 * p;
    return silkFrame(T, f, x, y, w, h) + smd(T, kind, x, y, horizontal);
  }
  function sot23(T, x, y, leads, label) {
    const w = 1.3 * 3.78;
    const h = 2.9 * 3.78;
    let s = "";
    const n = leads === 5 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const ly = y + h / 2 + (i - (n - 1) / 2) * 0.95 * 3.78 - 1;
      s += rect(x - 1.8, ly, 1.8, 2, T.lead, { rx: 0.2 });
    }
    const m = leads === 5 ? 2 : 1;
    for (let j = 0; j < m; j++) {
      const ry = y + h / 2 + (j - (m - 1) / 2) * 1.9 * 3.78 - 1;
      s += rect(x + w, ry, 1.8, 2, T.lead, { rx: 0.2 });
    }
    s += rect(x, y, w, h, T.chip, Object.assign({ rx: 0.4 }, edge(T, T["chip-edge"], T["stroke-detail"])));
    if (label)
      s += text(x + w / 2, y + h / 2, label, 4, T["chip-print"], {
        "dominant-baseline": "middle",
        transform: `rotate(-90 ${r2(x + w / 2)} ${r2(y + h / 2)})`
      });
    return tag("smd", s);
  }
  function soic(T, x, y, w, h, nSide, label) {
    let s = "";
    const pitch = 1.27 * 3.78;
    for (let i = 0; i < nSide; i++) {
      const ly = y + h / 2 + (i - (nSide - 1) / 2) * pitch - 0.8;
      s += rect(x - 3.6, ly, 3.6, 1.6, T.lead, { rx: 0.2 }) + rect(x + w, ly, 3.6, 1.6, T.lead, { rx: 0.2 });
    }
    s += rect(x, y, w, h, T.chip, Object.assign({ rx: 0.5 }, edge(T, T["chip-edge"], T["stroke-detail"]))) + bevel(T, x, y, w, h, 1, 0.5) + circle(x + 1.8, y + 1.8, 0.6, T["chip-print"]);
    if (label)
      s += text(x + w / 2, y + h / 2, label, 4, T["chip-print"], {
        "dominant-baseline": "middle",
        transform: `rotate(-90 ${r2(x + w / 2)} ${r2(y + h / 2)})`
      });
    return tag("chip", s);
  }
  function mountHole(T, f, x, y, r) {
    return circle(x, y, r + 2.2, "none", { stroke: f.silk, "stroke-width": T["stroke-fine"], "stroke-opacity": 0.85 }) + tag("hole", circle(x, y, r, T.hole, edge(T, T.pad)));
  }
  function soicAcross(T, x, y, w, h, nSide, label) {
    let s = "";
    const pitch = 1.27 * 3.78;
    for (let i = 0; i < nSide; i++) {
      const lx = x + w / 2 + (i - (nSide - 1) / 2) * pitch - 0.8;
      s += rect(lx, y - 3.6, 1.6, 3.6, T.lead, { rx: 0.2 }) + rect(lx, y + h, 1.6, 3.6, T.lead, { rx: 0.2 });
    }
    s += rect(x, y, w, h, T.chip, Object.assign({ rx: 0.5 }, edge(T, T["chip-edge"], T["stroke-detail"]))) + bevel(T, x, y, w, h, 1, 0.5) + circle(x + 1.8, y + h - 1.8, 0.6, T["chip-print"]);
    if (label) s += text(x + w / 2, y + h / 2 + 1.4, label, 4, T["chip-print"]);
    return tag("chip", s);
  }
  function silkName(n) {
    return String(n).replace(/\.\d+$/, "");
  }
  function qfp(T, x, y, w, h, nSide, label) {
    let s = "";
    const lead = 1.5;
    const lw = Math.min(1.2, (w - 4) / nSide * 0.55);
    for (let i = 0; i < nSide; i++) {
      const ox = 2 + (i + 0.5) * (w - 4) / nSide - lw / 2;
      const oy = 2 + (i + 0.5) * (h - 4) / nSide - lw / 2;
      s += rect(x - lead, y + oy, lead, lw, T.lead, { rx: 0.2 }) + rect(x + w, y + oy, lead, lw, T.lead, { rx: 0.2 });
      s += rect(x + ox, y - lead, lw, lead, T.lead, { rx: 0.2 }) + rect(x + ox, y + h, lw, lead, T.lead, { rx: 0.2 });
    }
    s += rect(x, y, w, h, T.chip, Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"])));
    s += rect(x + 0.6, y + 0.6, w - 1.2, 1.1, "#ffffff", { rx: 0.5, "fill-opacity": T["opacity-light"] * 0.4 });
    s += circle(x + 3.2, y + 3.2, 0.9, T["chip-print"]);
    if (label) {
      const fit = Math.floor((w - 2.4) / (PIN_LABEL * 0.62));
      const lbl = String(label);
      const cx = x + w / 2;
      const cy = y + h / 2;
      if (lbl.length <= fit && h >= 3 * PIN_LABEL + 2)
        s += text(cx, cy - 0.6, lbl, PIN_LABEL, T["chip-print"]) + text(cx, cy + PIN_LABEL + 0.4, lotCode(lbl), PIN_LABEL, T["chip-print"], { "fill-opacity": 0.85 });
      else if (lbl.length <= fit) s += text(cx, cy + 1.4, lbl, PIN_LABEL, T["chip-print"]);
      else if (fit >= 4 && lbl.length <= 2 * fit) {
        const dm = /^[A-Za-z]+(?=\d)/.exec(lbl);
        const cut = dm && dm[0].length <= fit && lbl.length - dm[0].length <= fit ? dm[0].length : Math.ceil(lbl.length / 2);
        s += text(cx, cy - 0.8, lbl.slice(0, cut), PIN_LABEL, T["chip-print"]) + text(cx, cy + PIN_LABEL - 0.4, lbl.slice(cut), PIN_LABEL, T["chip-print"]);
      }
    }
    return tag("chip", s);
  }
  function usbC(T, cx, y, w, h, mouth) {
    return usbPort(T, { kind: "c", x: cx - w / 2, y, w, h, mouth: mouth || "down" });
  }
  function barePad(T, x, y) {
    return tag(
      "pad",
      circle(x, y, T["pad-radius"], T.pad) + circle(x, y, T["hole-radius"], T.hole, edge(T, T["metal-edge"], 0.5))
    );
  }
  function wire(x1, y1, x2, y2) {
    const T = tokens();
    return line(x1, y1, x2, y2, T["lead-edge"], T["leg-width"] + 0.6) + line(x1, y1, x2, y2, T.lead, T["leg-width"] - 0.4);
  }
  var init_pieces = __esm({
    "src/pieces.js"() {
      init_core();
    }
  });

  // src/passives.js
  function wirePath(d) {
    const T = tokens();
    return path(d, "none", {
      stroke: T["lead-edge"],
      "stroke-width": T["leg-width"] + 0.6,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }) + path(d, "none", {
      stroke: T.lead,
      "stroke-width": T["leg-width"] - 0.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
  }
  function shadeH(x, y, w, h) {
    const T = tokens();
    return rect(x + 0.6, y + h * 0.1, w - 1.2, h * 0.18, "#ffffff", { rx: h * 0.09, "fill-opacity": T["opacity-light"] }) + rect(x + 0.6, y + h * 0.74, w - 1.2, h * 0.2, "#000000", { rx: h * 0.1, "fill-opacity": T["opacity-shade"] });
  }
  function shadeV(x, y, w, h) {
    const T = tokens();
    return rect(x + w * 0.1, y + 0.8, w * 0.16, h - 1.6, "#ffffff", { rx: w * 0.08, "fill-opacity": T["opacity-light"] }) + rect(x + w * 0.74, y + 0.8, w * 0.2, h - 1.6, "#000000", { rx: w * 0.1, "fill-opacity": T["opacity-shade"] });
  }
  function resistorBands(ohms, tolerance) {
    const v = Math.max(0.01, Number(ohms) || 0);
    let e = Math.floor(Math.log10(v));
    let digits = Math.round(v / Math.pow(10, e - 1));
    if (digits >= 100) {
      digits = Math.round(digits / 10);
      e += 1;
    }
    const mult = e - 1;
    const multiplier = mult === -1 ? "band-gold" : mult === -2 ? "band-silver" : BANDS[Math.max(0, Math.min(9, mult))];
    return [
      BANDS[Math.floor(digits / 10)],
      BANDS[digits % 10],
      multiplier,
      tolerance === 10 ? "band-silver" : "band-gold"
    ];
  }
  function formatOhms(ohms) {
    const v = Number(ohms) || 0;
    const u = v >= 1e6 ? [1e6, "MΩ"] : v >= 1e3 ? [1e3, "kΩ"] : [1, "Ω"];
    const n = v / u[0];
    return `${(Math.round(n * 100) / 100).toString().replace(/\.0+$/, "")} ${u[1]}`;
  }
  function resistor(props) {
    const span = Math.max(3, Math.round(Number(props && props.span) || 4));
    const T = tokens();
    const p = T.pitch;
    const w = span * p;
    const h = 2 * p;
    const y = p;
    let s = "";
    const value = props && props.ohms !== void 0 ? props.ohms : 1e3;
    s += wire(0, y, w, y);
    const mm = p / 2.54;
    const bx = (w - 6.3 * mm) / 2;
    const bw = 6.3 * mm;
    const mh = 2.1 * mm;
    const capW = 1.3 * mm;
    const capH = 2.5 * mm;
    const midX = bx + capW;
    const midW = bw - 2 * capW;
    const bodyEdge = edge(T, T["resistor-body-edge"], T["stroke-detail"]);
    s += tag(
      "body",
      rect(midX - 1, y - mh / 2, midW + 2, mh, T["resistor-body"], bodyEdge) + rect(bx, y - capH / 2, capW, capH, T["resistor-body"], Object.assign({ rx: capW * 0.45 }, bodyEdge)) + rect(bx + bw - capW, y - capH / 2, capW, capH, T["resistor-body"], Object.assign({ rx: capW * 0.45 }, bodyEdge))
    );
    const bands = resistorBands(value, props && props.tolerance);
    const bandW = 0.62 * mm;
    const gap = 0.42 * mm;
    const x0 = bx + 1.14 * mm;
    const xs = [x0, x0 + bandW + gap, x0 + 2 * (bandW + gap), x0 + 3 * bandW + 2 * gap + 0.7 * mm];
    bands.forEach((name, i) => {
      s += rect(xs[i], y - mh / 2 + 0.3, bandW, mh - 0.6, T[name], {
        "data-band": i + 1,
        stroke: name === "band-white" || name === "band-yellow" || name === "band-gold" || name === "band-silver" ? T["resistor-body-edge"] : void 0,
        "stroke-width": T["stroke-fine"]
      });
    });
    const live = props && props.live || {};
    const heat = Math.max(0, Math.min(1, Number(live.heat) || 0));
    s += rect(bx, y - capH / 2, bw, capH, T["band-red"], {
      "data-hook": "heat",
      "data-live": "heat",
      rx: capW * 0.45,
      "fill-opacity": r2(T["opacity-heat"] * heat)
    });
    s += shadeH(bx, y - capH / 2, bw, capH);
    s += flow(0, y, bx, y, live.flow, "flow-1") + flow(bx + bw, y, w, y, live.flow, "flow-2");
    if (live.probe) s += probe(live.probe === "2" ? w : 0, y);
    return art(w, h, `${formatOhms(value)} resistor${heat > 0.8 ? ", hot" : ""}`, s, [
      { name: "1", x: 0, y },
      { name: "2", x: w, y }
    ]);
  }
  function flange(T, x0, x1, y, h, fill, opacity, flatLeft) {
    const w = x1 - x0;
    let s = "";
    s += rect(x0, y, w, h, fill, { rx: 0.9, "fill-opacity": opacity });
    s += rect(x0, y + h * 0.5, w, h * 0.5, "#000000", { rx: 0.9, "fill-opacity": 0.3 });
    s += rect(x0 + 0.8, y + 0.35, w - 1.6, 0.7, "#ffffff", { rx: 0.35, "fill-opacity": 0.4 });
    s += rect(flatLeft ? x0 : x1 - 1.6, y, 1.6, h, "#000000", { rx: 0.6, "fill-opacity": 0.25 });
    s += rect(x0, y, w, h, "none", {
      rx: 0.9,
      stroke: T["plastic-grey-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.7
    });
    return s;
  }
  function led(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 3.2 * p;
    const h = 6.2 * p;
    const color = lensColor(T, props.color || "red");
    const on2 = !!props.on;
    const b = on2 ? props.brightness === void 0 ? 1 : Math.max(0, Math.min(1, props.brightness)) : 0;
    let s = "";
    const mm = p / 2.54;
    const x0 = (w - 5 * mm) / 2;
    const x1 = x0 + 5 * mm;
    const r = 2.5 * mm;
    const cx = w / 2;
    const top = 0.6 * p + 1.2;
    const base = top + 7.6 * mm;
    const flangeH = 1 * mm;
    const xa = 2.1 * p;
    const xc = 1.1 * p;
    const toC = xc > xa ? 1 : -1;
    const legTop = base + flangeH - 0.4;
    const dome = `M${r2(x0)} ${r2(base)}V${r2(top + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(top + r)}V${r2(base)}Z`;
    const white = color === T["lens-white"];
    const glowColor = white ? "#ffd66b" : color;
    s += tag(
      "glow",
      el("ellipse", {
        "data-hook": "glow",
        cx,
        cy: top + r + 1.5,
        rx: Math.min(r * 1.8, cx - 0.2),
        ry: Math.min(r * 1.75, top + r + 1.3),
        fill: sheen("glow", glowColor),
        "fill-opacity": r2(Math.min(1, 2.2 * T["opacity-glow"]) * b)
      })
    );
    s += wire(xa, legTop, xa, h) + wire(xc, legTop, xc, h);
    s += tag(
      "body",
      path(dome, T["plastic-white"]) + path(dome, white && on2 ? "#fff0b8" : color, {
        "data-hook": "lens",
        "fill-opacity": on2 ? r2(0.6 + 0.4 * b) : 0.6
      })
    );
    const frame = { fill: T["plastic-black-edge"], "fill-opacity": on2 ? 0.2 : 0.58 };
    const cupTop = top + r - 1.2;
    const mm2 = mm;
    const cupW = 1.6 * mm2;
    const cupH = 1.3 * mm2;
    const cupBot = cupTop + cupH;
    const postW = 0.42 * mm2;
    const slabIn = xc - toC * 1.25 * mm2;
    const slabOut = xc + toC * 0.7 * mm2;
    const barIn = xc - toC * 0.1 * mm2;
    const barC = (barIn + slabOut) / 2;
    const shoulderY = cupBot + 2.3 * mm2;
    s += path(
      `M${r2(slabIn)} ${r2(base)}V${r2(shoulderY)}L${r2(barIn)} ${r2(cupBot + 0.2)}V${r2(cupBot - 0.3)}H${r2(slabOut)}V${r2(base)}Z`,
      T["plastic-black-edge"],
      frame
    );
    s += path(`M${r2(slabIn + toC * 0.3)} ${r2(shoulderY)}L${r2(barIn + toC * 0.3)} ${r2(cupBot + 0.2)}`, "none", {
      stroke: "#ffffff",
      "stroke-width": 0.4,
      "stroke-opacity": on2 ? 0.25 : 0.35
    });
    s += path(
      `M${r2(barC - cupW / 2)} ${r2(cupTop)}H${r2(barC + cupW / 2)}L${r2(barC + cupW * 0.3)} ${r2(cupBot)}H${r2(barC - cupW * 0.3)}Z`,
      T["plastic-black-edge"],
      frame
    );
    s += path(
      `M${r2(barC - cupW * 0.36)} ${r2(cupTop + 0.35)}H${r2(barC + cupW * 0.36)}L${r2(barC + cupW * 0.18)} ${r2(cupBot - 0.6)}H${r2(barC - cupW * 0.18)}Z`,
      on2 ? "#ffffff" : T["plastic-grey"],
      { "fill-opacity": on2 ? 0.55 : 0.5 }
    );
    s += rect(barC - 0.5, cupBot - 1.4, 1, 0.75, T["plastic-black"], { "fill-opacity": on2 ? 0.5 : 0.8 });
    s += rect(xa - postW / 2, cupTop - 0.4, postW, base - cupTop + 0.4, T["plastic-black-edge"], frame);
    s += rect(
      toC > 0 ? xa - postW / 2 : xa + postW / 2 - postW * 2.2,
      cupTop - 0.4,
      postW * 2.2,
      1.3,
      T["plastic-black-edge"],
      Object.assign({ rx: 0.3 }, frame)
    );
    s += path(
      `M${r2(xa + toC * postW * 1.5)} ${r2(cupTop + 0.2)}Q${r2((xa + barC) / 2)} ${r2(cupTop - 3.4)} ${r2(barC)} ${r2(cupBot - 1.1)}`,
      "none",
      { stroke: T["plastic-black-edge"], "stroke-width": 0.45, "stroke-opacity": on2 ? 0.35 : 0.6 }
    );
    s += rect(xa - 0.95, base - 2.4, 1.9, 2.6, T["plastic-black-edge"], frame);
    if (on2)
      s += el("ellipse", {
        cx: barC,
        cy: cupTop + 0.9,
        rx: r * 1,
        ry: r * 1.05,
        fill: sheen("hot"),
        "fill-opacity": r2(0.5 + 0.5 * b)
      });
    s += path(dome, sheen("dome"), { "fill-opacity": on2 ? 0.7 : 0.8 });
    s += path(dome, "none", { stroke: T["plastic-grey-edge"], "stroke-width": T["stroke-fine"], "stroke-opacity": 0.8 });
    const fx0 = toC > 0 ? x0 - 0.4 * mm : x0;
    const fx1 = toC > 0 ? x1 : x1 + 0.4 * mm;
    s += flange(T, fx0, fx1, base, flangeH, color, on2 ? 1 : 0.6, toC < 0);
    const live = props.live || {};
    s += flow(xa, h, xa, legTop + 1, live.flow, "flow-a") + flow(xc, legTop + 1, xc, h, live.flow, "flow-c");
    if (live.probe) s += probe(live.probe === "K" || live.probe === "C" ? xc : xa, h);
    return art(w, h, `${props.color || "red"} LED${on2 ? ", lit" : ""}`, s, [
      { name: "A", x: xa, y: h },
      { name: "K", x: xc, y: h }
    ]);
  }
  function capacitor(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const kind = props.kind === "ceramic" ? "ceramic" : "electrolytic";
    const w = 2 * p;
    let s = "";
    const xa = 0.5 * p;
    const xc = 1.5 * p;
    if (kind === "ceramic") {
      const h = 4 * p;
      const cx = p;
      const cy = 1.3 * p;
      const r = 2.6 * mm;
      s += wirePath(`M${r2(cx - 0.3 * p)} ${r2(cy + r - 1)}L${r2(xa)} ${r2(cy + r + 0.5 * p)}V${r2(h)}`) + wirePath(`M${r2(cx + 0.3 * p)} ${r2(cy + r - 1)}L${r2(xc)} ${r2(cy + r + 0.5 * p)}V${r2(h)}`);
      s += tag(
        "body",
        el(
          "ellipse",
          Object.assign(
            { cx, cy, rx: r, ry: r * 0.92, fill: T["cap-ceramic"] },
            edge(T, T["resistor-body-edge"], T["stroke-detail"])
          )
        )
      );
      s += el("ellipse", {
        cx: cx - r * 0.3,
        cy: cy - r * 0.35,
        rx: r * 0.35,
        ry: r * 0.22,
        fill: "#ffffff",
        "fill-opacity": 0.3,
        transform: `rotate(-25 ${r2(cx - r * 0.3)} ${r2(cy - r * 0.35)})`
      });
      s += text(cx, cy + 1.6, props.code || "104", PIN_LABEL, T["plastic-black-edge"]);
      return art(w, h, `ceramic capacitor ${props.code || "104"}`, s, [
        { name: "1", x: xa, y: h },
        { name: "2", x: xc, y: h }
      ]);
    }
    const hh = 6 * p;
    const cw = 5 * mm;
    const x0 = (w - cw) / 2;
    const top = 1.2;
    const bottom = top + 11 * mm;
    s += wire(xa, bottom - 0.6, xa, hh) + wire(xc, bottom - 0.6, xc, hh);
    s += tag(
      "body",
      rect(
        x0,
        top,
        cw,
        bottom - top,
        T["cap-electrolytic"],
        Object.assign({ rx: 2.2 }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += rect(x0 + cw * 0.66, top + 0.4, cw * 0.22, bottom - top - 0.8, T["cap-stripe"], { rx: 0.6 });
    [0.28, 0.46, 0.64, 0.82].forEach((f) => {
      s += rect(x0 + cw * 0.7, top + (bottom - top) * f, cw * 0.14, 1.1, T["cap-electrolytic"], { rx: 0.3 });
    });
    s += rect(x0, top, cw, 2.8, "#000000", { rx: 2.2, "fill-opacity": 0.3 });
    s += rect(x0 + 1.2, top + 2.4, cw - 2.4, 0.6, "#ffffff", { "fill-opacity": 0.25 });
    s += rect(x0, bottom - 2.6, cw, 2.6, "#000000", { rx: 1.5, "fill-opacity": 0.25 });
    s += shadeV(x0, top + 3.2, cw, bottom - top - 6);
    s += text(x0 + cw * 0.3, top + (bottom - top) * 0.6, "+", 5.6, T["cap-stripe"], { "font-weight": 700 });
    return art(w, hh, "electrolytic capacitor", s, [
      { name: "+", x: xa, y: hh },
      { name: "-", x: xc, y: hh }
    ]);
  }
  function buzzer(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const w = 5 * p;
    const h = 6.4 * p;
    const cx = 2.5 * p;
    const cy = 2.5 * p;
    const r = 6 * mm;
    let s = "";
    const legTop = cy + r - 2;
    s += wire(p, legTop, p, h) + wire(4 * p, legTop, 4 * p, h);
    s += tag("body", circle(cx, cy, r, T["plastic-black"], edge(T, T["plastic-black-edge"])));
    s += circle(cx, cy, r * 0.86, "#000000", { "fill-opacity": 0.35 });
    s += circle(cx, cy, r * 0.86, "none", { stroke: "#ffffff", "stroke-width": 0.5, "stroke-opacity": 0.12 });
    s += circle(cx, cy, r * 0.5, T["plastic-black"], edge(T, T["plastic-black-edge"], T["stroke-fine"]));
    s += circle(cx, cy, 1.1 * mm, T.cavity);
    s += path(
      `M${r2(cx - r * 0.72)} ${r2(cy - r * 0.3)}A${r2(r * 0.78)} ${r2(r * 0.78)} 0 0 1 ${r2(cx - r * 0.3)} ${r2(cy - r * 0.72)}`,
      "none",
      { stroke: "#ffffff", "stroke-width": 1.3, "stroke-linecap": "round", "stroke-opacity": 0.2 }
    );
    s += text(cx - r * 0.64, cy + r * 0.62, "+", 5, T["chip-print"]);
    const live = props.live || {};
    s += flow(p, h, p, legTop, live.flow, "flow-1") + flow(4 * p, legTop, 4 * p, h, live.flow, "flow-2");
    if (live.probe) s += probe(live.probe === "-" || live.probe === "2" ? 4 * p : p, h);
    return art(w, h, "Buzzer", s, [
      { name: "+", x: p, y: h },
      { name: "-", x: 4 * p, y: h }
    ]);
  }
  function rgbLed(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 4 * p;
    const h = 6.6 * p;
    let s = "";
    const legEnd = function(i) {
      return i === 1 ? h : h - p;
    };
    const ch = ["r", "g", "b"].map((k) => {
      const v = Number(props[k]);
      return isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
    });
    const level = Math.max(ch[0], ch[1], ch[2]);
    const on2 = level > 0.02;
    const hx = function(v) {
      const n = Math.round(v * 255).toString(16);
      return (n.length < 2 ? "0" : "") + n;
    };
    const mix = on2 ? `#${hx(ch[0] / level)}${hx(ch[1] / level)}${hx(ch[2] / level)}` : T["plastic-white"];
    const mm = p / 2.54;
    const x0 = (w - 5 * mm) / 2;
    const x1 = x0 + 5 * mm;
    const r = 2.5 * mm;
    const cx = w / 2;
    const top = 1.2;
    const base = top + 7.6 * mm;
    const flangeH = 1 * mm;
    const xs = [0.5 * p, 1.5 * p, 2.5 * p, 3.5 * p];
    const names = ["Red", "Common", "Green", "Blue"];
    const legTop = base + flangeH - 0.4;
    const dome = `M${r2(x0)} ${r2(base)}V${r2(top + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(top + r)}V${r2(base)}Z`;
    s += tag(
      "glow",
      el("ellipse", {
        "data-hook": "glow",
        cx,
        cy: top + r + 1.5,
        rx: r * 1.8,
        ry: r * 1.75,
        fill: sheen("glow", on2 ? mix : T["lens-white"]),
        "fill-opacity": r2(Math.min(1, 2.2 * T["opacity-glow"]) * level)
      })
    );
    xs.forEach((x, i) => {
      const xi = cx + (i - 1.5) * 1.27 * mm;
      s += wirePath(`M${r2(xi)} ${r2(legTop)}V${r2(legTop + 0.6 * p)}L${r2(x)} ${r2(legTop + 1.6 * p)}V${r2(legEnd(i))}`);
    });
    s += tag(
      "body",
      path(dome, T["plastic-white"], { "fill-opacity": 1 }) + path(dome, mix, {
        "data-hook": "lens",
        "fill-opacity": on2 ? r2(0.45 + 0.5 * level) : 0.08,
        "data-r": ch[0],
        "data-g": ch[1],
        "data-b": ch[2]
      })
    );
    const cupTop = top + r + 2.2;
    [
      [-2.6, 1.4],
      [-0.9, -0.6],
      [0.9, 1],
      [2.6, 0.4]
    ].forEach((q) => {
      s += rect(cx + q[0] * 1.3 - 0.55, cupTop + q[1] * mm, 1.1, base - cupTop - q[1] * mm, T["plastic-black-edge"], {
        "fill-opacity": on2 ? 0.22 : 0.35
      });
    });
    if (on2)
      s += el("ellipse", {
        cx,
        cy: top + r + 1.5,
        rx: r * 0.95,
        ry: r * 1,
        fill: sheen("hot"),
        "fill-opacity": r2(0.4 + 0.5 * level)
      });
    s += path(dome, sheen("dome"), { "fill-opacity": on2 ? 0.7 : 0.8 });
    s += path(dome, "none", { stroke: T["plastic-grey-edge"], "stroke-width": T["stroke-fine"], "stroke-opacity": 0.8 });
    const fx0 = x0 - 0.4 * mm;
    const fx1 = x1;
    s += flange(T, fx0, fx1, base, flangeH, on2 ? mix : T["plastic-white"], 1);
    return art(
      w,
      h,
      `RGB LED${on2 ? `, lit ${mix}` : ""}`,
      s,
      xs.map((x, i) => {
        return { name: names[i], x, y: legEnd(i) };
      })
    );
  }
  var BANDS;
  var init_passives = __esm({
    "src/passives.js"() {
      init_core();
      init_pieces();
      BANDS = [
        "band-black",
        "band-brown",
        "band-red",
        "band-orange",
        "band-yellow",
        "band-green",
        "band-blue",
        "band-violet",
        "band-grey",
        "band-white"
      ];
    }
  });

  // src/boards.js
  function silkOf(props) {
    const labels = props && props.labels || {};
    return function(n) {
      return Object.prototype.hasOwnProperty.call(labels, n) ? String(labels[n]) : silkName(n);
    };
  }
  function devBoardTemplate(props) {
    props = props || {};
    if (props.layout === "landscape") return landscapeBoard(props);
    const T = tokens();
    const p = T.pitch;
    const f = finish(T, props.finish || "teal");
    const left = props.left || [];
    const right = props.right || [];
    const kind = props.pinKind || "socket";
    const moduleTop = props.controller === "module";
    const wroom = moduleTop && props.moduleSize === "wroom";
    const dual = moduleTop && /^dual-/.test(props.usb || "");
    const modH = wroom ? 11.3 * p : 8 * p;
    const icspNames = !moduleTop && props.icsp && props.icsp.length === 6 ? props.icsp : null;
    const rows = Math.max(left.length, right.length);
    const w = (props.widthPitches || 10) * p;
    const top = moduleTop ? modH : (props.topPitches || 2.4) * p;
    const h = top + (rows - 1) * p + (icspNames ? p : 0) + (moduleTop ? (dual ? 5 : 4) * p : 1.4 * p);
    let s = "";
    const span = Math.round((w - 1.6 * p) / p) * p;
    const leftX = (w - span) / 2;
    const rightX = leftX + span;
    s += board({
      width: w,
      height: h,
      finish: props.finish || "teal",
      holes: true,
      mark: props.mark === false ? void 0 : moduleTop ? dual ? { x: w - 1.9 * p, y: h - 3.7 * p, size: 0.7 * p } : { x: w / 2 + 1.4 * p, y: h - 3.55 * p, size: 0.7 * p } : { x: 1.5 * p, y: h - 1.25 * p, size: 0.8 * p }
    });
    const silk = silkOf(props);
    const longest = function(list) {
      return list.reduce((m, n) => {
        return Math.max(m, silk(n).length);
      }, 0);
    };
    const labelL = leftX + 0.7 * p + longest(left) * PIN_LABEL * 0.62;
    const labelR = rightX - 0.7 * p - longest(right) * PIN_LABEL * 0.62;
    const fin = props.finish || "teal";
    const cw0 = Math.max(1.2 * p, Math.min(moduleTop ? 1.8 * p : 2.6 * p, labelR - labelL - 0.6 * p));
    const cxx0 = (labelL + labelR) / 2 - cw0 / 2;
    const traced = function(i) {
      return !(icspNames && i === rows - 1);
    };
    left.forEach((_, i) => {
      const y = top + i * p;
      if (traced(i))
        s += trace(T, fin, [
          [leftX, y],
          [leftX + 1.9 * p, y],
          [Math.max(leftX + 2.3 * p, cxx0 - 0.5 * p), y + 0.4 * p]
        ]);
    });
    right.forEach((_, i) => {
      const y = top + i * p;
      if (traced(i))
        s += trace(T, fin, [
          [rightX, y],
          [rightX - 1.9 * p, y],
          [Math.min(rightX - 2.3 * p, cxx0 + cw0 + 0.5 * p), y - 0.4 * p]
        ]);
    });
    const icspOk = w / 2 - 1.28 * p - 0.4 >= labelL && w / 2 + 1.28 * p + 0.4 <= labelR;
    const viaR = Math.min(w / 2 + 1.6 * p, labelR - 1.6);
    s += via(T, w / 2 - 0.4 * p, top - 0.5 * p) + (moduleTop ? dual ? "" : via(T, w / 2 - 1.6 * p, h - 3.3 * p) : !icspNames && viaR - 1.2 >= labelL + 0.4 ? via(T, viaR, h - 1.15 * p) : "");
    s += line(
      leftX + 0.75 * p,
      top - 0.6 * p,
      leftX + 0.75 * p,
      top + (left.length - 0.4) * p,
      f.silk,
      T["stroke-fine"],
      { "stroke-opacity": 0.5 }
    );
    s += line(
      rightX - 0.75 * p,
      top - 0.6 * p,
      rightX - 0.75 * p,
      top + (right.length - 0.4) * p,
      f.silk,
      T["stroke-fine"],
      { "stroke-opacity": 0.5 }
    );
    const ind = { power: true, user: false, ...props.indicators };
    const rsz = 1.2 * p;
    let resetBelow = false;
    const resetButton2 = function(bx, by) {
      return tag(
        "reset",
        rect(
          bx,
          by,
          rsz,
          rsz,
          T["plastic-black"],
          Object.assign({ rx: 0.8 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
        ) + rect(
          bx + 0.18 * p,
          by + 0.18 * p,
          rsz - 0.36 * p,
          rsz - 0.36 * p,
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T["metal-edge"], T["stroke-fine"]))
        ) + circle(
          bx + rsz / 2,
          by + rsz / 2,
          0.36 * p,
          T["plastic-black"],
          Object.assign({ "data-hook": "reset-button" }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
        )
      );
    };
    if (moduleTop) {
      const antH = wroom ? 1.2 * p : 0.6 * p;
      const canY = wroom ? 2.4 * p : 2 * p;
      const canH = wroom ? 7.5 * p : 4.3 * p;
      const rowY0 = canY + canH + 0.3 * p;
      const ax0 = 1.6 * p;
      const ax1 = w - 1.6 * p;
      const ay = wroom ? 0.7 * p : 0.9 * p;
      let d = "";
      const step = 0.5 * p;
      for (let ax = ax0; ax + step <= ax1; ax += step)
        d += `${(ax === ax0 ? "M" : "L") + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
      s += tag("antenna", path(d, "none", { stroke: T.pad, "stroke-width": 0.9, "stroke-linejoin": "round" }));
      s += tag(
        "module",
        rect(1.2 * p, canY, w - 2.4 * p, canH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"])))
      );
      s += rect(1.2 * p, canY, w - 2.4 * p, 1 * p, "#ffffff", { rx: 1.2, "fill-opacity": 0.22 });
      s += rect(1.2 * p, canY + canH - 0.7 * p, w - 2.4 * p, 0.7 * p, "#000000", { rx: 1, "fill-opacity": 0.12 });
      if (props.chipLabel)
        s += text(
          w / 2,
          canY + canH / 2 + 0.3 * p,
          props.chipLabel,
          Math.min(4.4, (w - 3.2 * p) / Math.max(4, props.chipLabel.length) * 1.5),
          T["chip-edge"],
          { "font-weight": 600 }
        );
      s += smd(T, "capacitor", 1.3 * p, rowY0 + 0.05 * p, true) + smd(T, "resistor", w - 2.2 * p, rowY0 + 0.05 * p, true);
      s += indicator({
        x: w / 2 - 1.3 * p,
        y: rowY0,
        size: 0.7 * p,
        color: "red",
        on: ind.power,
        hook: "power-led",
        state: "power",
        finish: props.finish || "teal"
      });
      s += indicator({
        x: w / 2 + 0.6 * p,
        y: rowY0,
        size: 0.7 * p,
        color: "blue",
        on: ind.user,
        hook: "rgb-led",
        finish: props.finish || "teal"
      });
      const names = props.buttons || ["EN", "BOOT"];
      const by = dual ? h - 4.1 * p : h - 2.6 * p;
      const bxs = dual ? [w / 2 - 2.6 * p, w / 2 + 1.1 * p] : [1.1 * p, w - 2.6 * p];
      bxs.forEach((bx, bi) => {
        s += tag(
          "button",
          rect(
            bx,
            by,
            1.5 * p,
            1.5 * p,
            T["plastic-black"],
            Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
          ) + circle(
            bx + 0.75 * p,
            by + 0.75 * p,
            0.4 * p,
            T.metal,
            Object.assign(bi === 1 ? { "data-hook": "boot-button" } : {}, edge(T, T["metal-edge"], T["stroke-fine"]))
          )
        );
        s += text(bx + 0.75 * p, by + 1.5 * p + PIN_LABEL, names[bi], PIN_LABEL, f.silk);
      });
      if (props.usb === "dual-c")
        s += usbC(T, w / 2 - 2.1 * p, h - 1.6 * p, 2.4 * p, 1.2 * p) + usbC(T, w / 2 + 2.1 * p, h - 1.6 * p, 2.4 * p, 1.2 * p);
      else if (props.usb === "dual-micro")
        s += microUsb(T, w / 2 - 2.1 * p, h - 1.7 * p, 2.4 * p, 1.4 * p) + microUsb(T, w / 2 + 2.1 * p, h - 1.7 * p, 2.4 * p, 1.4 * p);
      else if (props.usb === "c") s += usbC(T, w / 2, h - 1.7 * p, 2.6 * p, 1.4 * p);
      else s += microUsb(T, w / 2, h - 1.9 * p, 2.6 * p, 1.6 * p);
    } else {
      s += microUsb(T, 2.5 * p, 0.2 * p, 2.6 * p, 1.5 * p, "up");
      s += indicator({
        x: 4.05 * p,
        y: 0.45 * p,
        size: 0.8 * p,
        color: "green",
        on: ind.power,
        hook: "power-led",
        state: "power",
        finish: props.finish || "teal",
        label: "ON"
      });
      s += indicator({
        x: 5 * p,
        y: 0.45 * p,
        size: 0.8 * p,
        color: "yellow",
        on: ind.user,
        hook: "user-led",
        finish: props.finish || "teal",
        label: "L"
      });
      const rx = w - 1 * p - rsz;
      const ry = 0.45 * p;
      resetBelow = rx < 5.8 * p - 0.01;
      if (rx - 6 * p >= 1.9 * p)
        s += tag(
          "regulator",
          rect(6.1 * p, 0.3 * p, 0.8 * p, 0.45 * p, T.metal, { rx: 0.2 }) + rect(
            6 * p,
            0.7 * p,
            1 * p,
            0.8 * p,
            T["plastic-black"],
            Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
          )
        ) + smd(T, "capacitor", 7.25 * p, 0.4 * p, false);
      if (!resetBelow) s += resetButton2(rx, ry);
      const hasReg = rx - 6 * p >= 1.9 * p;
      const rstLeft = rx - 1.4 - 3 * PIN_LABEL * 0.62;
      if (resetBelow) {
      } else if (kind !== "socket")
        s += text(rx + rsz / 2, ry + rsz + PIN_LABEL - 0.4, props.resetLabel || "RST", PIN_LABEL, f.silk);
      else if (rstLeft - 0.5 >= (hasReg ? 8 * p : 5.9 * p))
        s += text(rx - 1.4, ry + rsz / 2 + 1.4, props.resetLabel || "RST", PIN_LABEL, f.silk, { "text-anchor": "end" });
    }
    const cw = moduleTop ? cw0 : Math.max(1.2 * p, Math.min(2.6 * p, cw0, h - top - 4 * p));
    const ch = moduleTop ? 1.8 * p : cw;
    const cxx = moduleTop ? cxx0 : (labelL + labelR) / 2 - cw / 2;
    const cyy = top + (rows - 1) * p / 2 - ch / 2;
    if (!moduleTop || props.chip !== false) {
      let chipP = "";
      const pinN = moduleTop ? Math.floor(ch / (0.5 * p)) : Math.max(4, Math.floor((cw - 0.6 * p) / (0.3 * p)));
      if (moduleTop)
        for (let i = 0; i < pinN; i++) {
          chipP += rect(cxx - 1.4, cyy + 0.25 * p + i * 0.5 * p, 1.4, 0.24 * p, T.lead, { rx: 0.2 }) + rect(cxx + cw, cyy + 0.25 * p + i * 0.5 * p, 1.4, 0.24 * p, T.lead, { rx: 0.2 });
        }
      else
        for (let i = 0; i < pinN; i++) {
          const qo = 0.3 * p + (i + 0.5) * (cw - 0.6 * p) / pinN - 0.1 * p;
          chipP += rect(cxx - 1.4, cyy + qo, 1.4, 0.2 * p, T.lead, { rx: 0.2 }) + rect(cxx + cw, cyy + qo, 1.4, 0.2 * p, T.lead, { rx: 0.2 }) + rect(cxx + qo, cyy - 1.4, 0.2 * p, 1.4, T.lead, { rx: 0.2 }) + rect(cxx + qo, cyy + ch, 0.2 * p, 1.4, T.lead, { rx: 0.2 });
        }
      s += tag(
        "chip",
        chipP + rect(cxx, cyy, cw, ch, T.chip, Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"]))) + (moduleTop ? path(`M${r2(cxx + cw / 2 - 2.2)} ${r2(cyy)}a2.2 2.2 0 0 0 4.4 0z`, T["chip-print"]) : circle(cxx + 0.35 * p, cyy + 0.35 * p, 0.8, T["chip-print"]))
      );
      if (props.chipLabel && !moduleTop) {
        const fit = Math.floor((cw - 2.4) / (PIN_LABEL * 0.62));
        const lbl = String(props.chipLabel);
        if (lbl.length <= fit) s += text(cxx + cw / 2, cyy + ch / 2 + 1.4, lbl, PIN_LABEL, T["chip-print"]);
        else if (fit >= 4 && lbl.length <= 2 * fit) {
          const dm = /^[A-Za-z]+(?=\d)/.exec(lbl);
          const cut = dm && dm[0].length <= fit && lbl.length - dm[0].length <= fit ? dm[0].length : Math.ceil(lbl.length / 2);
          s += text(cxx + cw / 2, cyy + ch / 2 - 0.8, lbl.slice(0, cut), PIN_LABEL, T["chip-print"]) + text(cxx + cw / 2, cyy + ch / 2 + PIN_LABEL + 0.2, lbl.slice(cut), PIN_LABEL, T["chip-print"]);
        }
      }
      s += smd(T, "crystal", cxx + cw / 2 - 0.65 * p, cyy - 1.2 * p, true);
      if (w >= 12 * p)
        s += smd(T, "capacitor", cxx - 1.6 * p, cyy + 0.2 * p, false) + smd(T, "capacitor", cxx + cw + 1.05 * p, cyy + 0.2 * p, false);
      const icspY = cyy + ch + 0.9 * p;
      if (resetBelow)
        s += resetButton2(w / 2 - rsz / 2, icspY) + text(w / 2, icspY + rsz + PIN_LABEL - 0.4, props.resetLabel || "RST", PIN_LABEL, f.silk);
      else if (!moduleTop && !icspNames && icspOk && icspY + 1.4 * p < h - 1.3 * p) {
        let icsp = "";
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < 3; c++)
            icsp += circle(w / 2 - p + c * p, icspY + r * p, 0.28 * p, T.pad) + circle(w / 2 - p + c * p, icspY + r * p, 0.13 * p, T.hole);
        s += tag("icsp", icsp) + text(w / 2, icspY + 1.75 * p + 0.8, "ICSP", PIN_LABEL, f.silk);
      }
    }
    const lh = header({
      x: leftX,
      y: top,
      axis: "y",
      labels: left.map(silk),
      kind,
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rh = header({
      x: rightX,
      y: top,
      axis: "y",
      labels: right.map(silk),
      kind,
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    lh.pins.forEach((pn, i) => {
      pn.name = left[i];
    });
    rh.pins.forEach((pn, i) => {
      pn.name = right[i];
    });
    s += lh.svg + rh.svg;
    const icspPins = [];
    if (icspNames) {
      const icx = (leftX + rightX) / 2;
      const icy = top + (rows - 1) * p;
      const pr = T["pad-radius"];
      icspNames.forEach((name, k) => {
        const x = icx + (Math.floor(k / 2) - 1) * p;
        const y = k % 2 ? icy : icy + p;
        s += pin({ x, y, kind: "pad" });
        icspPins.push({ name, x, y });
      });
      s += rect(icx - p - pr - 0.7, icy + p - pr - 0.7, 2 * pr + 1.4, 2 * pr + 1.4, "none", {
        stroke: f.silk,
        "stroke-width": T["stroke-fine"]
      });
      s += text(icx, icy - pr - 1.4, "ICSP", PIN_LABEL, f.silk);
    }
    const extra = [];
    (props.extraPads || []).forEach((e) => {
      const x = leftX + e.dx * p;
      const y = top + e.dy * p;
      s += pin({ x, y, kind: "pad" }) + text(x, y - T["pad-radius"] - 1.4, e.name, PIN_LABEL, f.silk);
      extra.push({ name: e.name, x, y });
    });
    if (props.label)
      s += text(w / 2, moduleTop ? dual ? h - 4.45 * p : h - 3.1 * p : h - 0.5 * p, props.label, 4.4, f.silk);
    return art(
      w,
      h,
      props.description || props.label || "Microcontroller board",
      s,
      lh.pins.concat(rh.pins, icspPins, extra)
    );
  }
  function unoUsbEnd(T, f, fin, X, Y, L, ind, noReset) {
    let s = "";
    s += tag(
      "usb",
      rect(X(-4.2), Y(9.4), L(14.25), L(11.8), T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"]))) + rect(X(-4.2), Y(9.4), L(14.25), L(11.8), sheen("metal"), { rx: 1.2, "fill-opacity": 0.7 }) + rect(X(2.4), Y(10.4), L(2.2), L(0.7), T.cavity, { rx: 0.3 }) + rect(X(2.4), Y(19.5), L(2.2), L(0.7), T.cavity, { rx: 0.3 }) + rect(X(-4.2), Y(9.4), L(14.25), L(2.4), "#ffffff", { rx: 1.2, "fill-opacity": T["opacity-light"] * 0.6 }) + rect(X(-4.2), Y(19), L(14.25), L(2.2), "#000000", { rx: 1.2, "fill-opacity": T["opacity-shade"] }) + line(X(6.2), Y(9.6), X(6.2), Y(21), T["metal-edge"], T["stroke-fine"]) + rect(X(-3.6), Y(11.2), L(5.4), L(8.2), T["plastic-black"], { rx: 0.9 }) + rect(X(-2.8), Y(12.8), L(3.6), L(5), T["plastic-white"], { rx: 0.5, "fill-opacity": 0.85 })
    );
    s += text(X(6.8), Y(24.8), "USB", PIN_LABEL, f.silk);
    s += tag(
      "fuse",
      rect(
        X(0.9),
        Y(22.5),
        L(4.5),
        L(3.2),
        T["band-yellow"],
        Object.assign({ rx: 0.4 }, edge(T, T["resistor-body-edge"], T["stroke-fine"]))
      )
    );
    if (!noReset) s += resetButton(T, f, X, Y, L, 4, 1.5);
    let icsp2 = "";
    [11.6, 14.14, 16.68].forEach((cx) => {
      [5.67, 8.21].forEach((cy) => {
        icsp2 += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
      });
    });
    s += tag("icsp", icsp2);
    s += tag(
      "chip",
      rect(
        X(13.5),
        Y(10.5),
        L(6),
        L(6),
        T.chip,
        Object.assign({ rx: 0.6 }, edge(T, T["chip-edge"], T["stroke-detail"]))
      ) + circle(X(14.3), Y(11.3), 0.6, T["chip-print"])
    );
    s += smd(T, "crystal", X(21), Y(11.2), true) + smd(T, "capacitor", X(21.2), Y(14.6), true) + smd(T, "capacitor", X(23.7), Y(14.6), true);
    [
      ["user-led", "L", ind.user, void 0, 11],
      ["tx-led", "TX", false, "tx", 15],
      ["rx-led", "RX", false, "rx", 19]
    ].forEach((e) => {
      s += indicator({
        x: X(26.5),
        y: Y(e[4]),
        size: L(2),
        color: "yellow",
        on: e[2],
        hook: e[0],
        state: e[3],
        finish: fin
      });
      s += text(X(29.4), Y(e[4] + 1) + 1.4, e[1], PIN_LABEL, f.silk, { "text-anchor": "start" });
    });
    return s;
  }
  function resetButton(T, f, X, Y, L, x, y) {
    return tag(
      "reset",
      rect(
        X(x),
        Y(y),
        L(6),
        L(6),
        T["plastic-black"],
        Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      ) + rect(
        X(x + 0.7),
        Y(y + 0.7),
        L(4.6),
        L(4.6),
        T.metal,
        Object.assign({ rx: 0.5 }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + circle(
        X(x + 3),
        Y(y + 3),
        L(1.5),
        T["lens-red"],
        Object.assign({ "data-hook": "reset-button" }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    ) + text(X(x + 3), Y(y + 7.45), "RESET", PIN_LABEL, f.silk);
  }
  function unoPowerEnd(T, f, X, Y, L, withCrystal) {
    let s = "";
    s += tag(
      "regulator",
      rect(X(15), Y(24.2), L(4.8), L(1.6), T.metal, { rx: 0.3 }) + rect(
        X(14.5),
        Y(25.6),
        L(5.8),
        L(5),
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    if (withCrystal)
      s += tag(
        "crystal",
        rect(
          X(16),
          Y(32.2),
          L(11.5),
          L(4.7),
          T.metal,
          Object.assign({ rx: L(2.35) }, edge(T, T["metal-edge"], T["stroke-fine"]))
        )
      );
    if (withCrystal) s += smd(T, "capacitor", X(21), Y(38.2), true) + smd(T, "capacitor", X(24.2), Y(38.2), true);
    s += capTop(T, X(16.6), Y(46), L(3.15)) + capTop(T, X(23.4), Y(46), L(3.15));
    s += tag(
      "jack",
      rect(
        X(-2.5),
        Y(38.6),
        L(14.5),
        L(13.4),
        T["plastic-black"],
        Object.assign({ rx: 1.2 }, edge(T, T["plastic-black-edge"]))
      ) + rect(X(-2.5), Y(38.6), L(14.5), L(2), "#ffffff", { rx: 1.2, "fill-opacity": 0.08 }) + circle(X(1.4), Y(45.3), L(3.3), T.metal, edge(T, T["metal-edge"])) + circle(X(1.4), Y(45.3), L(2.2), T.cavity) + circle(X(1.4), Y(45.3), L(0.75), T.metal)
    );
    s += text(X(7), Y(37.2), "PWR", PIN_LABEL, f.silk);
    return s;
  }
  function landscapeBoard(props) {
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "teal";
    const f = finish(T, fin);
    const kind = props.pinKind || "socket";
    const gap = 2 * p;
    const OX = 4.2;
    const X = function(x) {
      return r2((x + OX) * mm);
    };
    const Y = function(y) {
      return r2(y * mm);
    };
    const L = function(v) {
      return r2(v * mm);
    };
    const w = L(68.58 + OX);
    const h = L(53.34);
    let s = "";
    let pins = [];
    const top = props.top || [];
    const bottom = props.bottom || [];
    const ind = { power: true, user: false, ...props.indicators };
    const d = `M${X(1)} ${Y(0)}A${L(1)} ${L(1)} 0 0 0 ${X(0)} ${Y(1)}V${Y(52.34)}A${L(1)} ${L(1)} 0 0 0 ${X(1)} ${Y(
      53.34
    )}H${X(65.04)}A${L(1)} ${L(1)} 0 0 0 ${X(66.04)} ${Y(52.34)}V${Y(50.8)}L${X(68.58)} ${Y(48.26)}V${Y(15.49)}L${X(66.04)} ${Y(12.96)}V${Y(1.53)}L${X(64.51)} ${Y(0)}Z`;
    s += tag("board", path(d, f.board, edge(T, f.edge)));
    s += bevelPoly(
      T,
      [
        [X(0), Y(0)],
        [X(64.51), Y(0)],
        [X(66.04), Y(1.53)],
        [X(66.04), Y(12.96)],
        [X(68.58), Y(15.49)],
        [X(68.58), Y(48.26)],
        [X(66.04), Y(50.8)],
        [X(66.04), Y(53.34)],
        [X(0), Y(53.34)]
      ],
      2.4
    );
    [
      [15.24, 2.48],
      [66.05, 17.72],
      [66.04, 45.66],
      [13.97, 50.74]
    ].forEach((c) => {
      s += tag("hole", circle(X(c[0]), Y(c[1]), L(1.6), T.hole, edge(T, T.pad, 1)));
    });
    const topY = Y(2.54);
    const botY = Y(50.8);
    const tx = X(18.46);
    const bx = X(28.62);
    const traceRow = function(groups, x, y, dir) {
      groups.forEach((g) => {
        g.forEach((_, i) => {
          const px = x + i * p;
          s += trace(T, fin, [
            [px, y],
            [px, y + dir * 1.3 * p],
            [px + (px < w / 2 ? 0.5 : -0.5) * p, y + dir * 1.9 * p]
          ]);
        });
        x += (g.length - 1) * p + gap;
      });
    };
    traceRow(top, tx, topY, 1);
    traceRow(bottom, bx, botY, -1);
    [
      [9, 29],
      [24, 25.5],
      [34, 21],
      [52, 21.5],
      [60, 30],
      [11, 35.5]
    ].forEach((v) => {
      s += via(T, X(v[0]), Y(v[1]));
    });
    s += unoUsbEnd(T, f, fin, X, Y, L, ind);
    s += indicator({
      x: X(57.3),
      y: Y(16.2),
      size: L(2),
      color: "green",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin,
      label: "ON"
    });
    const silkLine = function(x0, x1, y) {
      s += line(X(x0), Y(y), X(x1), Y(y), f.silk, T["stroke-fine"], { "stroke-opacity": 0.55 });
    };
    silkLine(17.2, 64.6, 9.8);
    silkLine(27.4, 47, 44.7);
    silkLine(49.7, 65.3, 44.7);
    const names = props.groupNames || {};
    if (names.top && names.top[0]) s += text(X(46), Y(13.4), names.top[0], PIN_LABEL, f.silk);
    (names.bottom || []).forEach((n, i) => {
      if (n) {
        const gx = bx + (i ? (bottom[0].length - 1) * p + gap : 0);
        s += text(gx + (bottom[i].length - 1) * p / 2, Y(43.9), n, PIN_LABEL, f.silk);
      }
    });
    if (props.label) s += text(X(46), Y(27.6), props.label, 11, f.silk, { "font-weight": 700 });
    if (props.mark !== false) s += silkMark(X(60.3), Y(11), 0.8 * p, f.silk);
    let icsp = "";
    [64.27, 66.81].forEach((cx) => {
      [21.37, 23.91, 26.45].forEach((cy) => {
        icsp += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
      });
    });
    s += tag("icsp", icsp);
    s += text(X(65.54), Y(30.4), "ICSP", PIN_LABEL, f.silk);
    s += dipOnBoard(T, X(28.5), Y(36), 14, props.chipLabel);
    s += unoPowerEnd(T, f, X, Y, L, true);
    const silk = silkOf(props);
    const row = function(groups, x, y, side) {
      groups.forEach((g) => {
        const hdr = header({ x, y, labels: g.map(silk), kind, side, silk: f.silk, size: PIN_LABEL, rotate: true });
        hdr.pins.forEach((pn, i) => {
          pn.name = g[i];
        });
        s += hdr.svg;
        pins = pins.concat(hdr.pins);
        x += (g.length - 1) * p + gap;
      });
    };
    row(top, tx, topY, "below");
    row(bottom, bx, botY, "above");
    if (props.pwm && props.pwm.length) {
      const gapR = kind === "socket" ? p / 2 + 1.6 : T["pad-radius"] + 1;
      let px0 = tx;
      top.forEach((g) => {
        g.forEach((name, i) => {
          if (props.pwm.indexOf(name) >= 0) {
            const x = px0 + i * p;
            const ty = topY + gapR + silkOf(props)(name).length * PIN_LABEL * 0.62 + 1.6;
            s += text(x, ty, "~", PIN_LABEL, f.silk, {
              "text-anchor": "end",
              "dominant-baseline": "middle",
              transform: `rotate(-90 ${r2(x)} ${r2(ty)})`
            });
          }
        });
        px0 += (g.length - 1) * p + gap;
      });
    }
    return art(w, h, props.description || props.label || "Microcontroller board", s, pins);
  }
  function axialOnBoard(T, x0, y0, x1, y1, props) {
    const vert = x0 === x1;
    const a0 = vert ? y0 : x0;
    const a1 = vert ? y1 : x1;
    const dir = a1 < a0 ? -1 : 1;
    const mid = (a0 + a1) / 2;
    const len = props.len;
    const wide = props.wide;
    let s = "";
    const band = function(t0, t1, fill, more) {
      const u = mid + dir * (t0 - len / 2);
      const v = mid + dir * (t1 - len / 2);
      const lo = Math.min(u, v);
      const d = Math.abs(v - u);
      return vert ? rect(x0 - wide / 2, lo, wide, d, fill, more) : rect(lo, y0 - wide / 2, d, wide, fill, more);
    };
    s += line(x0, y0, x1, y1, T.lead, 1.2);
    [
      [x0, y0],
      [x1, y1]
    ].forEach((c) => {
      s += circle(c[0], c[1], 1.6, T.pad) + circle(c[0], c[1], 0.7, T.hole);
    });
    if (props.kind === "diode") {
      s += band(
        0,
        len,
        T["band-orange"],
        Object.assign({ rx: wide / 2, "fill-opacity": 0.8 }, edge(T, T["resistor-body-edge"], T["stroke-fine"]))
      );
      s += band(0.3 * len, 0.7 * len, T["band-red"], { "fill-opacity": 0.55 });
      s += band(0.78 * len, 0.9 * len, T["band-black"]);
    } else {
      s += band(
        0,
        len,
        T["resistor-body"],
        Object.assign({ rx: wide / 2 }, edge(T, T["resistor-body-edge"], T["stroke-fine"]))
      );
      resistorBands(props.ohms).forEach((b, k) => {
        const t = [0.18, 0.32, 0.46, 0.74][k] * len;
        s += band(t, t + 0.08 * len, T[b]);
      });
    }
    return tag("smd", s);
  }
  function microUsb(T, cx, y, w, h, mouth) {
    return usbPort(T, { kind: "micro", x: cx - w / 2, y, w, h, mouth: mouth || "down" });
  }
  function tactile(T, f, x, y, size, name, hook) {
    let s = tag(
      "button",
      rect(
        x,
        y,
        size,
        size,
        T["plastic-black"],
        Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      ) + rect(
        x + 0.15 * size,
        y + 0.15 * size,
        0.7 * size,
        0.7 * size,
        T.metal,
        Object.assign({ rx: 0.5 }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + circle(
        x + size / 2,
        y + size / 2,
        0.27 * size,
        T["plastic-black"],
        Object.assign(hook ? { "data-hook": hook } : {}, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    if (name) s += text(x + size / 2, y + size + PIN_LABEL, name, PIN_LABEL, f.silk);
    return s;
  }
  function megaBoardTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "teal";
    const f = finish(T, fin);
    const kind = props.pinKind || "socket";
    const gap = 2 * p;
    const OX = 4.2;
    const X = function(x) {
      return r2((x + OX) * mm);
    };
    const Y = function(y) {
      return r2(y * mm);
    };
    const L = function(v) {
      return r2(v * mm);
    };
    const W = 101.6;
    const w = L(W + OX);
    const h = L(53.34);
    let s = "";
    let pins = [];
    const top = props.top || [];
    const bottom = props.bottom || [];
    const block = props.block || { left: [], right: [] };
    const ind = { power: true, user: false, ...props.indicators };
    const d = `M${X(1)} ${Y(0)}A${L(1)} ${L(1)} 0 0 0 ${X(0)} ${Y(1)}V${Y(52.34)}A${L(1)} ${L(1)} 0 0 0 ${X(1)} ${Y(
      53.34
    )}H${X(W - 3.54)}A${L(1)} ${L(1)} 0 0 0 ${X(W - 2.54)} ${Y(52.34)}V${Y(50.8)}L${X(W)} ${Y(48.26)}V${Y(15.49)}L${X(W - 2.54)} ${Y(12.96)}V${Y(1.53)}L${X(W - 4.07)} ${Y(0)}Z`;
    s += tag("board", path(d, f.board, edge(T, f.edge)));
    s += bevelPoly(
      T,
      [
        [X(0), Y(0)],
        [X(W - 4.07), Y(0)],
        [X(W - 2.54), Y(1.53)],
        [X(W - 2.54), Y(12.96)],
        [X(W), Y(15.49)],
        [X(W), Y(48.26)],
        [X(W - 2.54), Y(50.8)],
        [X(W - 2.54), Y(53.34)],
        [X(0), Y(53.34)]
      ],
      2.4
    );
    [
      [15.24, 2.54],
      [15.24, 50.8],
      [66.04, 17.78],
      [66.04, 45.72],
      [89.9, 2.54, 1.5],
      [96.52, 50.8]
    ].forEach((c) => {
      s += tag("hole", circle(X(c[0]), Y(c[1]), L(c[2] || 1.6), T.hole, edge(T, T.pad, 1)));
    });
    const topY = Y(2.54);
    const botY = Y(50.8);
    const tx = X(18.46);
    const bx = X(31.16);
    const col1 = tx + 30 * p;
    const col2 = tx + 31 * p;
    const bottomGaps = props.bottomGaps || [2, 2];
    const gapOf = function(gaps, k) {
      return (gaps && gaps[k] !== void 0 ? gaps[k] : 2) * p;
    };
    const traceRow = function(groups, x, y, dir, gaps) {
      groups.forEach((g, k) => {
        g.forEach((_, i) => {
          const px = x + i * p;
          s += trace(T, fin, [
            [px, y],
            [px, y + dir * 1.3 * p],
            [px + (px < w / 2 ? 0.5 : -0.5) * p, y + dir * 1.9 * p]
          ]);
        });
        x += (g.length - 1) * p + gapOf(gaps, k);
      });
    };
    traceRow(top, tx, topY, 1);
    traceRow(bottom, bx, botY, -1, bottomGaps);
    block.left.forEach((_, i) => {
      const y = topY + i * p;
      s += trace(T, fin, [
        [col1, y],
        [col1 - 1.6 * p, y],
        [col1 - 2.4 * p, y + 0.4 * p]
      ]);
    });
    [
      [9, 29],
      [24, 32],
      [36, 19],
      [47.5, 40.5],
      [62, 41],
      [86.5, 22.5],
      [86, 40.5],
      [11, 35.5]
    ].forEach((v) => {
      s += via(T, X(v[0]), Y(v[1]));
    });
    s += unoUsbEnd(T, f, fin, X, Y, L, ind, true);
    s += resetButton(T, f, X, Y, L, 71.17, 22.4);
    s += indicator({
      x: X(76),
      y: Y(18.6),
      size: L(2),
      color: "green",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin,
      label: "ON"
    });
    const silkLine = function(x0, x1, y) {
      s += line(X(x0), Y(y), X(x1), Y(y), f.silk, T["stroke-fine"], { "stroke-opacity": 0.55 });
    };
    silkLine(17.2, 90, 9.8);
    silkLine(30, 47, 44.7);
    silkLine(52.5, 93.5, 44.7);
    const names = props.groupNames || {};
    if (names.top && names.top[0]) s += text(tx + 9 * p, Y(13.4), names.top[0], PIN_LABEL, f.silk);
    if (names.top && names.top[1] && top[2])
      s += text(tx + (18 + 2 + (top[2].length - 1) / 2) * p + gap, Y(13.4), names.top[1], PIN_LABEL, f.silk);
    if (names.bottom && names.bottom[0] && bottom[0])
      s += text(bx + (bottom[0].length - 1) * p / 2, Y(43.9), names.bottom[0], PIN_LABEL, f.silk);
    if (names.bottom && names.bottom[1] && bottom[2]) {
      const a0 = bx + (bottom[0].length - 1) * p + gapOf(bottomGaps, 0);
      const aN = a0 + (bottom[1].length - 1) * p + gapOf(bottomGaps, 1) + (bottom[2].length - 1) * p;
      s += text((a0 + aN) / 2, Y(43.9), names.bottom[1], PIN_LABEL, f.silk);
    }
    if (props.label) s += text(X(78), Y(41.2), props.label, 9, f.silk, { "font-weight": 700 });
    if (props.mark !== false) s += silkMark(X(88.5), Y(13.4), 0.8 * p, f.silk);
    s += qfp(T, X(46), Y(21), L(14), L(14), 25, props.chipLabel);
    s += tag(
      "crystal",
      rect(
        X(23),
        Y(21),
        L(11.5),
        L(4.7),
        T.metal,
        Object.assign({ rx: L(2.35) }, edge(T, T["metal-edge"], T["stroke-fine"]))
      )
    );
    s += smd(T, "capacitor", X(36.5), Y(23.5), true) + smd(T, "capacitor", X(39.5), Y(35), true);
    let icsp = "";
    [63.63, 66.17].forEach((cx) => {
      [22.86, 25.4, 27.94].forEach((cy) => {
        icsp += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
      });
    });
    s += tag("icsp", icsp);
    s += text(X(64.9), Y(31.4), "ICSP", PIN_LABEL, f.silk);
    s += smd(T, "resistor", X(79.6), Y(18.6), false) + smd(T, "capacitor", X(67), Y(38.5), true);
    s += unoPowerEnd(T, f, X, Y, L, false);
    const silk = silkOf(props);
    const row = function(groups, x, y, side, gaps) {
      groups.forEach((g, k) => {
        const hdr = header({ x, y, labels: g.map(silk), kind, side, silk: f.silk, size: PIN_LABEL, rotate: true });
        hdr.pins.forEach((pn, i) => {
          pn.name = g[i];
        });
        s += hdr.svg;
        pins = pins.concat(hdr.pins);
        x += (g.length - 1) * p + gapOf(gaps, k);
      });
    };
    row(top, tx, topY, "below");
    block.left.forEach((name, i) => {
      const y = topY + i * p;
      s += pin({ x: col1, y, kind, label: silk(name), side: "left", silk: f.silk, size: PIN_LABEL });
      pins.push({ name, x: col1, y });
      const rn = block.right[i];
      if (rn !== void 0) {
        s += pin({ x: col2, y, kind, label: silk(rn), side: "right", silk: f.silk, size: PIN_LABEL });
        pins.push({ name: rn, x: col2, y });
      }
    });
    row(bottom, bx, botY, "above", bottomGaps);
    if (props.pwm && props.pwm.length) {
      const gapR = kind === "socket" ? p / 2 + 1.6 : T["pad-radius"] + 1;
      let px0 = tx;
      top.forEach((g) => {
        g.forEach((name, i) => {
          if (props.pwm.indexOf(name) >= 0) {
            const x = px0 + i * p;
            const ty = topY + gapR + silkOf(props)(name).length * PIN_LABEL * 0.62 + 1.6;
            s += text(x, ty, "~", PIN_LABEL, f.silk, {
              "text-anchor": "end",
              "dominant-baseline": "middle",
              transform: `rotate(-90 ${r2(x)} ${r2(ty)})`
            });
          }
        });
        px0 += (g.length - 1) * p + gap;
      });
    }
    return art(w, h, props.description || props.label || "Mega-class board", s, pins);
  }
  function franzininho(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "green";
    const f = finish(T, fin);
    const kind = props.pinKind || "socket";
    let s = "";
    const OX = 16.1;
    const X = function(x) {
      return r2((x + OX) * mm);
    };
    const Y = function(y) {
      return r2(y * mm);
    };
    const L = function(v) {
      return r2(v * mm);
    };
    const w = L(OX + 51.07);
    const h = L(30.03);
    const i = T["board-inset"];
    const side = props.side || ["GND", "VCC", "PB4", "PB5", "PB3", "PB2", "PB1", "PB0"];
    const power = props.power || ["VIN", "GND.2", "VCC.2"];
    const ind = { power: true, user: false, ...props.indicators };
    const colX = (46.075 + OX) * mm;
    const colY = 6.53 * mm;
    const rowX = colX - 10 * p;
    const rowY = colY - 2 * p;
    s += tag(
      "board",
      rect(X(0), i, w - i - X(0), h - 2 * i, f.board, Object.assign({ rx: T["radius-board"] }, edge(T, f.edge)))
    );
    s += bevelPoly(
      T,
      [
        [X(0), i],
        [w - i, i],
        [w - i, h - i],
        [X(0), h - i]
      ],
      2.2
    );
    [
      [9.6, 2.45],
      [48.6, 2.45],
      [9.6, 27.45],
      [48.6, 27.45]
    ].forEach((c) => {
      s += tag("hole", circle(X(c[0]), Y(c[1]), L(1.5), T.hole, edge(T, T.pad)));
    });
    const py = 15.03;
    let usb = rect(0.4, Y(py - 6), X(4.3) - 0.4, L(12), T.metal, Object.assign({ rx: L(0.6) }, edge(T, T["metal-edge"])));
    usb += rect(0.4, Y(py - 6), X(4.3) - 0.4, L(12), sheen("metal"), { rx: L(0.6), "fill-opacity": 0.75 }) + rect(0.4, Y(py - 5.4), L(0.5), L(10.8), T.cavity, { rx: 0.4 });
    usb += rect(X(-13.6), Y(py - 4.3), L(2.4), L(1.8), T.cavity, { rx: 0.4 }) + rect(X(-13.6), Y(py + 2.5), L(2.4), L(1.8), T.cavity, { rx: 0.4 });
    usb += line(X(-1.2), Y(py - 6) + 1, X(-1.2), Y(py + 6) - 1, T["metal-edge"], T["stroke-fine"]);
    s += tag("usb", usb);
    [11.53, 13.9, 16.16, 18.53].forEach((y) => {
      s += circle(X(5.39), Y(y), L(0.9), T.pad) + circle(X(5.39), Y(y), L(0.4), T.hole);
    });
    s += trace(T, fin, [
      [X(5.39), Y(13.9)],
      [X(8.21), Y(13.94)]
    ]) + trace(T, fin, [
      [X(5.39), Y(16.16)],
      [X(6.6), Y(16.16)],
      [X(7.3), Y(16.9)],
      [X(8.28), Y(16.9)]
    ]);
    side.forEach((_, k) => {
      const y = colY + k * p;
      s += trace(T, fin, [
        [colX, y],
        [colX - 1.2 * p, y],
        [colX - 1.55 * p, y + 0.35 * p]
      ]);
    });
    [
      [43.5, 2.6],
      [13.5, 26.6],
      [31, 22.2]
    ].forEach((v) => {
      s += via(T, X(v[0]), Y(v[1]));
    });
    const glass = { kind: "diode", len: L(3.8), wide: L(1.8) };
    const res = function(ohms) {
      return { ohms, len: L(6), wide: L(2.3) };
    };
    s += axialOnBoard(T, X(9.54), Y(7.62), X(17.16), Y(7.62), glass) + axialOnBoard(T, X(16.99), Y(10.46), X(9.37), Y(10.46), glass);
    s += axialOnBoard(T, X(8.21), Y(13.94), X(18.38), Y(13.94), res(68)) + axialOnBoard(T, X(8.28), Y(16.9), X(18.44), Y(16.9), res(68));
    s += axialOnBoard(T, X(17.09), Y(19.83), X(9.47), Y(19.83), glass) + axialOnBoard(T, X(8.28), Y(22.79), X(18.44), Y(22.79), res(1500));
    s += axialOnBoard(T, X(21.35), Y(10.55), X(21.35), Y(20.71), res(1e3)) + axialOnBoard(T, X(24.52), Y(10.55), X(24.52), Y(20.71), res(1e3));
    const ux = X(15.46);
    const uy = Y(3.6);
    const ur = L(2.4);
    s += tag(
      "regulator",
      path(
        `M${r2(ux - ur)} ${uy}A${ur} ${ur} 0 0 1 ${r2(ux + ur)} ${uy}V${r2(uy + L(1.4))}H${r2(ux - ur)}Z`,
        T["plastic-black"],
        edge(T, T["plastic-black-edge"], T["stroke-detail"])
      ) + text(ux, r2(uy + L(1.15)), "78L05", PIN_LABEL, T["chip-print"])
    );
    s += tag(
      "cap",
      el("ellipse", {
        cx: X(22.45),
        cy: Y(7.8),
        rx: L(2.5),
        ry: L(1.2),
        fill: T["band-orange"],
        stroke: T["resistor-body-edge"],
        "stroke-width": T["stroke-fine"]
      })
    ) + capTop(T, X(28.92), Y(8.54), L(2.5));
    s += rect(
      X(31.6),
      Y(9.6),
      L(11.4),
      L(10.6),
      T["plastic-black"],
      Object.assign({ rx: L(0.5) }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
    );
    s += dipOnBoard(T, X(32.23), Y(14.91), 4, props.chipLabel || "ATTINY85", true);
    s += tactile(T, f, X(34.56), Y(1.25), L(6), "RESET", "reset-button");
    [
      [21.3, "green", ind.power, "power-led", "power", "ON"],
      [26.38, "yellow", ind.user, "user-led", void 0, "LED"]
    ].forEach((D) => {
      const col2 = lensColor(T, D[1]);
      const level = lit(D[2]);
      const cx = X(D[0]);
      const cy = Y(26.09);
      const lr = L(1.5);
      if (level)
        s += tag(
          "glow",
          circle(cx, cy, 1.8 * lr, sheen("glow", col2), {
            "fill-opacity": r2(Math.min(1, 2.2 * T["opacity-glow"]) * level)
          })
        );
      s += tag(
        "indicator",
        circle(
          cx,
          cy,
          lr,
          level ? col2 : f.indicatorOff,
          Object.assign(
            {
              "data-hook": D[3],
              "data-on-fill": col2,
              "data-off-fill": f.indicatorOff,
              "data-lit-state": D[4],
              "data-lit": level ? "true" : "false"
            },
            edge(T, T["plastic-black-edge"], T["stroke-fine"])
          )
        )
      ) + circle(cx, cy, lr, sheen("dome"), { "fill-opacity": 0.7 });
      s += text(cx, Y(23.3), D[5], PIN_LABEL, f.silk);
    });
    if (props.label) s += text(X(36.3), Y(25.6), props.label, 4.4, f.silk);
    if (props.mark !== false) s += silkMark(X(28.6), Y(16), 0.8 * p, f.silk);
    const silk = silkOf(props);
    const col = header({
      x: colX,
      y: colY,
      axis: "y",
      labels: side.map(silk),
      kind,
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rw = header({
      x: rowX,
      y: rowY,
      axis: "x",
      labels: power.map(silk),
      kind,
      side: "below",
      silk: f.silk,
      size: PIN_LABEL
    });
    col.pins.forEach((pn, k) => {
      pn.name = side[k];
    });
    rw.pins.forEach((pn, k) => {
      pn.name = power[k];
    });
    s += col.svg + rw.svg;
    return art(w, h, props.description || props.label || "ATtiny85 board", s, col.pins.concat(rw.pins));
  }
  function espDevKitTemplate(props) {
    props = props || {};
    if (props.layout === "devkitc") return devKitC(props);
    if (props.layout === "devkit-1") return devKit1(props);
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const kind = props.pinKind || "pad";
    const left = props.left || [];
    const right = props.right || [];
    const ind = { power: true, user: false, ...props.indicators };
    const w = 11.2 * p;
    const leftX = 0.6 * p;
    const rightX = w - 0.6 * p;
    const top = 2.5 * p;
    const rows = Math.max(left.length, right.length);
    const h = Math.max(21.5 * p, top + rows * p + 5 * p);
    let s = "";
    s += board({
      width: w,
      height: h,
      finish: fin,
      holes: false,
      mark: props.mark === false ? void 0 : { x: w / 2 + 2 * p, y: h - 3.5 * p, size: 0.7 * p }
    });
    const mx = 2.2 * p;
    const mw = w - 4.4 * p;
    left.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.2 * p, y],
        [leftX + 1.55 * p, y + 0.35 * p]
      ]);
    });
    right.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.2 * p, y],
        [rightX - 1.55 * p, y - 0.35 * p]
      ]);
    });
    s += via(T, mx + 0.5 * p, 11 * p) + via(T, w - mx - 0.5 * p, 15.6 * p) + via(T, w / 2 - 3 * p, 17.4 * p);
    s += line(
      leftX + 0.75 * p,
      top - 0.6 * p,
      leftX + 0.75 * p,
      top + (left.length - 0.4) * p,
      f.silk,
      T["stroke-fine"],
      { "stroke-opacity": 0.5 }
    );
    s += line(
      rightX - 0.75 * p,
      top - 0.6 * p,
      rightX - 0.75 * p,
      top + (right.length - 0.4) * p,
      f.silk,
      T["stroke-fine"],
      { "stroke-opacity": 0.5 }
    );
    const ax0 = mx + 0.4 * p;
    const ax1 = mx + mw - 0.4 * p;
    const ay = 0.7 * p;
    let d = "";
    const step = 0.5 * p;
    s += rect(mx, 0.4 * p, mw, 2.6 * p, T["pcb-black"], { rx: 1, "fill-opacity": 0.5 });
    for (let ax = ax0; ax + step <= ax1; ax += step)
      d += `${(ax === ax0 ? "M" : "L") + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
    s += tag("antenna", path(d, "none", { stroke: T.pad, "stroke-width": 0.9, "stroke-linejoin": "round" }));
    s += tag("module", rect(mx, 2.9 * p, mw, 7.5 * p, T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"]))));
    s += rect(mx, 2.9 * p, mw, 1 * p, "#ffffff", { rx: 1.2, "fill-opacity": 0.22 }) + rect(mx, 9.7 * p, mw, 0.7 * p, "#000000", { rx: 1, "fill-opacity": 0.12 });
    if (props.chipLabel)
      s += text(
        w / 2,
        6 * p,
        props.chipLabel,
        Math.min(4.4, (mw - 1.2 * p) / Math.max(4, props.chipLabel.length) * 1.5),
        T["chip-edge"],
        { "font-weight": 600 }
      );
    s += text(w / 2, 7.6 * p, lotCode(props.chipLabel || "ESP32"), PIN_LABEL, T["chip-edge"], { "fill-opacity": 0.8 });
    s += qfp(T, 3.2 * p, 11.3 * p, 1.9 * p, 1.9 * p, 7, "CP2102");
    s += tag(
      "regulator",
      rect(6.9 * p, 11.2 * p, 1.6 * p, 0.6 * p, T.metal, { rx: 0.3 }) + rect(
        6.7 * p,
        11.75 * p,
        2 * p,
        1.5 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    s += indicator({
      x: 2.4 * p,
      y: 14.2 * p,
      size: 0.7 * p,
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin,
      label: "PWR"
    });
    if (props.userLed !== false)
      s += indicator({
        x: 8.1 * p,
        y: 14.2 * p,
        size: 0.7 * p,
        color: "blue",
        on: ind.user,
        hook: "user-led",
        finish: fin,
        label: "D2"
      });
    s += smd(T, "capacitor", 4.1 * p, 14.1 * p, false) + smd(T, "resistor", 5.2 * p, 14.1 * p, false) + smd(T, "resistor", 6.3 * p, 14.1 * p, false) + smd(T, "capacitor", 3 * p, 16.4 * p, true) + smd(T, "capacitor", 7 * p, 16.4 * p, true);
    const by = h - 3.6 * p;
    s += tactile(T, f, 0.8 * p, by, 1.5 * p, "EN", void 0) + tactile(T, f, w - 2.3 * p, by, 1.5 * p, "BOOT", "boot-button");
    s += microUsb(T, w / 2, h - 1.7 * p, 2.6 * p, 1.6 * p);
    if (props.label) s += text(w / 2, h - 3.9 * p + 0.4, props.label, 4.4, f.silk);
    const lh = header({
      x: leftX,
      y: top,
      axis: "y",
      labels: left.map(silkOf(props)),
      kind,
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rh = header({
      x: rightX,
      y: top,
      axis: "y",
      labels: right.map(silkOf(props)),
      kind,
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    lh.pins.forEach((pn, i) => {
      pn.name = left[i];
    });
    rh.pins.forEach((pn, i) => {
      pn.name = right[i];
    });
    s += lh.svg + rh.svg;
    return art(w, h, props.description || props.label || "ESP32 development board", s, lh.pins.concat(rh.pins));
  }
  function devKitC(props) {
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const kind = props.pinKind || "pad";
    const left = props.left || [];
    const right = props.right || [];
    const ind = props.indicators || { power: true };
    const w = 11 * p;
    const leftX = 0.5 * p;
    const rightX = w - 0.5 * p;
    const ant = 2.1 * p;
    const top = ant + 0.8 * p;
    const rows = Math.max(left.length, right.length);
    const h = Math.max(21.5 * p, top + (rows - 0.4) * p);
    let s = "";
    s += board({
      width: w,
      height: h - ant,
      y: ant,
      finish: fin,
      holes: false,
      mark: props.mark === false ? void 0 : { x: 7.3 * p, y: h - 3.2 * p, size: 0.7 * p }
    });
    left.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.2 * p, y],
        [leftX + 1.55 * p, y + 0.35 * p]
      ]);
    });
    right.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.2 * p, y],
        [rightX - 1.55 * p, y - 0.35 * p]
      ]);
    });
    s += via(T, 2.6 * p, h - 10.1 * p) + via(T, 8.4 * p, h - 6.1 * p) + via(T, 4.3 * p, h - 5.9 * p);
    const mx = 2 * p;
    const mw = 7 * p;
    const ax0 = mx + 0.4 * p;
    const ax1 = mx + mw - 0.4 * p;
    const ay = 0.5 * p;
    let d = "";
    const step = 0.5 * p;
    s += rect(mx, 0, mw, 10 * p, T["pcb-black"], Object.assign({ rx: 1 }, edge(T, f.edge, T["stroke-fine"])));
    for (let ax = ax0; ax + step <= ax1; ax += step)
      d += `${(ax === ax0 ? "M" : "L") + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
    s += tag("antenna", path(d, "none", { stroke: T.pad, "stroke-width": 0.9, "stroke-linejoin": "round" }));
    s += tag(
      "module",
      rect(mx + 0.3 * p, 2.65 * p, mw - 0.6 * p, 6.85 * p, T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"])))
    );
    s += rect(mx + 0.3 * p, 2.65 * p, mw - 0.6 * p, 1 * p, "#ffffff", { rx: 1.2, "fill-opacity": 0.22 }) + rect(mx + 0.3 * p, 8.8 * p, mw - 0.6 * p, 0.7 * p, "#000000", { rx: 1, "fill-opacity": 0.12 });
    if (props.chipLabel)
      s += text(
        w / 2,
        5.8 * p,
        props.chipLabel,
        Math.min(4.4, (mw - 1.8 * p) / Math.max(4, props.chipLabel.length) * 1.5),
        T["chip-edge"],
        { "font-weight": 600 }
      );
    s += text(w / 2, 7.4 * p, lotCode(props.chipLabel || "ESP32"), PIN_LABEL, T["chip-edge"], { "fill-opacity": 0.8 });
    if (props.label) s += text(w / 2, h - 10.6 * p, props.label, 4.4, f.silk);
    const b = h - 21.5 * p;
    s += tag(
      "regulator",
      rect(3.7 * p, b + 12.3 * p, 1.6 * p, 0.6 * p, T.metal, { rx: 0.3 }) + rect(
        3.5 * p,
        b + 12.85 * p,
        2 * p,
        1.5 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    s += qfp(T, 5 * p, b + 16.3 * p, 1.9 * p, 1.9 * p, 7, "CP2102");
    s += indicator({
      x: 2.3 * p,
      y: b + 16.2 * p,
      size: 0.7 * p,
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin,
      label: "PWR"
    });
    s += smd(T, "capacitor", 6.6 * p, b + 12.4 * p, false) + smd(T, "resistor", 7.6 * p, b + 12.4 * p, false) + smd(T, "resistor", 7.6 * p, b + 14 * p, false) + smd(T, "capacitor", 2.4 * p, b + 18.4 * p, true) + smd(T, "capacitor", 7.4 * p, b + 16.6 * p, false);
    s += tactile(T, f, 1.9 * p, h - 2.3 * p, 1.5 * p, "EN", void 0) + tactile(T, f, w - 3.4 * p, h - 2.3 * p, 1.5 * p, "BOOT", "boot-button");
    s += microUsb(T, w / 2, h - 1.7 * p, 2.6 * p, 1.6 * p);
    const lh = header({
      x: leftX,
      y: top,
      axis: "y",
      labels: left.map(silkOf(props)),
      kind,
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rh = header({
      x: rightX,
      y: top,
      axis: "y",
      labels: right.map(silkOf(props)),
      kind,
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    lh.pins.forEach((pn, i) => {
      pn.name = left[i];
    });
    rh.pins.forEach((pn, i) => {
      pn.name = right[i];
    });
    s += lh.svg + rh.svg;
    return art(w, h, props.description || props.label || "ESP32 development board", s, lh.pins.concat(rh.pins));
  }
  function devKit1(props) {
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const M = function(v) {
      return v * mm;
    };
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const kind = props.pinKind || "pad";
    const ind = { power: true, user: false, ...props.indicators };
    const left = props.left || [];
    const right = props.right || [];
    const rows = Math.max(left.length, right.length);
    const silk = silkOf(props);
    const size = ESP_MODULES[props.module] || ESP_MODULES.mini;
    const wroom = props.module === "wroom";
    const ov = props.overhang || 5.4;
    const first = props.firstPin || 1.55;
    const len = props.length || first + (rows - 1) * 2.54 + 8;
    const usb = props.usb || "micro";
    let s = "";
    const w = M(25.4);
    const h = M(ov + len);
    const leftX = M(1.27);
    const rightX = w - M(1.27);
    const top = M(ov + first);
    const labelW = function(list) {
      return list.reduce((m, n) => {
        return n === null ? m : Math.max(m, silk(n).length);
      }, 0) * PIN_LABEL * 0.62;
    };
    const labelL = leftX + T["pad-radius"] + 1.4 + labelW(left);
    const labelR = rightX - T["pad-radius"] - 1.4 - labelW(right);
    s += board({ width: w, height: h - M(ov), y: M(ov), finish: fin, holes: false });
    left.forEach((n, k) => {
      const y = top + k * p;
      if (n !== null)
        s += trace(T, fin, [
          [leftX, y],
          [leftX + 1.2 * p, y],
          [leftX + 1.55 * p, y + 0.35 * p]
        ]);
    });
    right.forEach((n, k) => {
      const y = top + k * p;
      if (n !== null)
        s += trace(T, fin, [
          [rightX, y],
          [rightX - 1.2 * p, y],
          [rightX - 1.55 * p, y - 0.35 * p]
        ]);
    });
    const mw = M(size[0]);
    const mh = M(size[1]);
    const mx = (w - mw) / 2;
    const inset = M(wroom ? 1 : 0.6);
    const shY = M(ov + 0.6);
    const shH = mh - shY - M(0.5);
    const ax0 = mx + M(1);
    const ax1 = mx + mw - M(1);
    const ay = M(0.9);
    const antH = M(Math.min(2.6, ov - 2));
    let d = "";
    const step = 0.5 * p;
    s += rect(mx, 0, mw, mh, T["pcb-black"], Object.assign({ rx: 1 }, edge(T, f.edge, T["stroke-fine"])));
    for (let ax = ax0; ax + step <= ax1; ax += step)
      d += `${(ax === ax0 ? "M" : "L") + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
    s += tag("antenna", path(d, "none", { stroke: T.pad, "stroke-width": 0.9, "stroke-linejoin": "round" }));
    s += tag(
      "module",
      rect(mx + inset, shY, mw - 2 * inset, shH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"])))
    );
    s += rect(mx + inset, shY, mw - 2 * inset, 1 * p, "#ffffff", { rx: 1.2, "fill-opacity": 0.22 }) + rect(mx + inset, shY + shH - 0.7 * p, mw - 2 * inset, 0.7 * p, "#000000", { rx: 1, "fill-opacity": 0.12 });
    if (props.chipLabel) {
      const room = mw - 2 * inset - 1 * p;
      const fitSize = function(t) {
        return Math.min(4.4, room / Math.max(4, t.length) * 1.5);
      };
      const cut = props.chipLabel.lastIndexOf("-", props.chipLabel.length - 3);
      if (fitSize(props.chipLabel) < PIN_LABEL && cut > 0) {
        const l1 = props.chipLabel.slice(0, cut);
        const l2 = props.chipLabel.slice(cut + 1);
        const ls = Math.max(PIN_LABEL, Math.min(fitSize(l1), fitSize(l2)));
        s += text(w / 2, shY + shH * 0.45 - 0.55 * p, l1, ls, T["chip-edge"], { "font-weight": 600 }) + text(w / 2, shY + shH * 0.45, l2, ls, T["chip-edge"], { "font-weight": 600 });
      } else
        s += text(
          w / 2,
          shY + shH * 0.45,
          props.chipLabel,
          Math.max(PIN_LABEL, fitSize(props.chipLabel)),
          T["chip-edge"],
          {
            "font-weight": 600
          }
        );
    }
    s += text(w / 2, shY + shH * 0.45 + 1.4 * p, lotCode(props.chipLabel || "ESP32"), PIN_LABEL, T["chip-edge"], {
      "fill-opacity": 0.8
    });
    const bs = M(3);
    const names = props.buttons || ["BOOT", "RST"];
    let bys;
    let bxs;
    let low;
    if (usb === "dual-c") {
      s += usbC(T, w / 2 - M(5.2), h - M(5.2), M(8.9), M(5)) + usbC(T, w / 2 + M(5.2), h - M(5.2), M(8.9), M(5));
      bys = h - M(10.2);
      bxs = [w / 2 - M(5.2) - bs / 2, w / 2 + M(5.2) - bs / 2];
      low = bys;
    } else if (usb === "dual-micro") {
      s += microUsb(T, w / 2 - M(6.7), h - M(4.8), M(7.5), M(4.6)) + microUsb(T, w / 2 + M(6.7), h - M(4.8), M(7.5), M(4.6));
      bys = h - M(15.3);
      bxs = [w / 2 - M(5.4) - bs / 2, w / 2 + M(5.4) - bs / 2];
      low = bys;
    } else {
      s += microUsb(T, w / 2, h - M(4.8), M(7.5), M(4.6));
      bys = h - M(7.4);
      bxs = [(labelL + w / 2 - M(3.75)) / 2 - bs / 2, (labelR + w / 2 + M(3.75)) / 2 - bs / 2];
      low = bys;
    }
    bxs.forEach((bx, bi) => {
      s += tactile(T, f, bx, bys, bs, names[bi], /BOOT/.test(names[bi]) ? "boot-button" : "reset-button");
    });
    const x0 = labelL + M(0.6);
    const x1 = labelR - M(0.6);
    const y0 = mh + M(1);
    const y1 = low - M(1.2);
    const cx = (x0 + x1) / 2;
    const ym = (y0 + y1) / 2;
    s += tag(
      "regulator",
      rect(x0 + M(1.6), y0, M(3), M(1.2), T.metal, { rx: 0.3 }) + rect(
        x0,
        y0 + M(1),
        M(6.2),
        M(3.4),
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    s += indicator({
      x: x1 - M(1.4),
      y: y0 + M(1.6),
      size: M(2),
      color: "blue",
      on: ind.user,
      hook: "rgb-led",
      finish: fin,
      label: "RGB"
    });
    s += qfp(T, cx - M(2), ym - M(1), M(4), M(4), 6, props.bridge);
    s += smd(T, "capacitor", cx + M(3.2), ym - M(0.6), false) + smd(T, "resistor", cx - M(4.4), ym - M(0.6), false);
    s += indicator({
      x: x1 - M(1.4),
      y: y1 - M(1.6),
      size: M(1.6),
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin,
      label: "PWR"
    });
    if (props.label) s += text(cx - M(1.2), y1 - M(0.6), props.label, 4.4, f.silk);
    if (props.mark !== false) s += silkMark(x0 + M(0.8), y1 - M(1.6), 0.7 * p, f.silk);
    const pins = [];
    const row = function(list, x, side) {
      list.forEach((n, k) => {
        const y = top + k * p;
        s += pin({ x, y, kind, label: n === null ? void 0 : silk(n), side, silk: f.silk, size: PIN_LABEL });
        if (n !== null) pins.push({ name: n, x, y });
      });
    };
    row(left, leftX, "right");
    row(right, rightX, "left");
    return art(w, h, props.description || props.label || "ESP32 development board", s, pins);
  }
  function nanoConnectTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const M = function(v) {
      return v * mm;
    };
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const kind = props.pinKind || "pad";
    const ind = { power: true, user: false, ...props.indicators };
    const left = props.left || [];
    const right = props.right || [];
    const silk = silkOf({ labels: Object.assign({ RESET: "RST" }, props.labels) });
    const w = M(17.78);
    const h = M(45);
    const leftX = M(1.27);
    const rightX = M(16.51);
    const top = M(3.81);
    const mx = M(3.89);
    const mw = M(10);
    const my = M(0.15);
    const mh = M(14);
    let s = "";
    const pins = [];
    s += board({ width: w, height: M(43.18), finish: fin, holes: false });
    [
      [leftX, M(1.27)],
      [rightX, M(1.27)],
      [leftX, M(41.91)],
      [rightX, M(41.91)]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], M(0.82), T.hole, edge(T, T.pad, 1)));
    });
    const ax0 = mx + M(0.8);
    const ax1 = mx + mw - M(0.8);
    const ay = M(0.8);
    const antH = M(2);
    let d = "";
    const step = 0.5 * p;
    const shY = M(3.9);
    const shH = M(9.7);
    s += rect(mx, my, mw, mh, T["pcb-black"], Object.assign({ rx: 1 }, edge(T, f.edge, T["stroke-fine"])));
    for (let ax = ax0; ax + step <= ax1; ax += step)
      d += `${(ax === ax0 ? "M" : "L") + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
    s += tag("antenna", path(d, "none", { stroke: T.pad, "stroke-width": 0.9, "stroke-linejoin": "round" }));
    s += tag(
      "module",
      rect(mx + M(0.35), shY, mw - M(0.7), shH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T["metal-edge"])))
    );
    s += rect(mx + M(0.35), shY, mw - M(0.7), 1 * p, "#ffffff", { rx: 1.2, "fill-opacity": 0.22 }) + rect(mx + M(0.35), shY + shH - 0.7 * p, mw - M(0.7), 0.7 * p, "#000000", { rx: 1, "fill-opacity": 0.12 });
    s += text(w / 2, shY + shH * 0.45, props.moduleLabel || "NINA-W102", 4.4, T["chip-edge"], { "font-weight": 600 }) + text(w / 2, shY + shH * 0.45 + 1.4 * p, lotCode(props.moduleLabel || "NINA"), PIN_LABEL, T["chip-edge"], {
      "fill-opacity": 0.8
    });
    if (props.mark !== false) s += silkMark(M(4.2), M(14.55), 0.7 * p, f.silk);
    s += via(T, M(6.6), M(15.4)) + smd(T, "capacitor", M(7.2), M(14.7), true) + smd(T, "crystal", M(10.4), M(14.6), true);
    s += qfp(T, M(4.3), M(17.2), M(6.8), M(6.8), 14, props.chipLabel || "RP2040");
    s += tag(
      "chip",
      rect(
        M(11.75),
        M(17.5),
        M(2.1),
        M(3),
        T.chip,
        Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"], T["stroke-detail"]))
      ) + circle(M(12.2), M(17.95), 0.6, T["chip-print"])
    );
    s += via(T, M(12.8), M(22.6));
    s += tag(
      "chip",
      rect(
        M(4.3),
        M(25.5),
        M(6),
        M(5),
        T.chip,
        Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"], T["stroke-detail"]))
      ) + circle(M(4.9), M(26.1), 0.7, T["chip-print"]) + text(M(7.3), M(28.4), "25SF128A", PIN_LABEL, T["chip-print"])
    );
    s += tag(
      "chip",
      rect(
        M(11),
        M(25.6),
        M(2.1),
        M(1.8),
        T.chip,
        Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"], T["stroke-detail"]))
      ) + circle(M(11.4), M(26), 0.5, T["chip-print"])
    );
    s += sot23(T, M(11.7), M(28.1), 5) + via(T, M(13.1), M(32.4));
    s += tag(
      "microphone",
      rect(
        M(4.6),
        M(30.9),
        M(3),
        M(4),
        T.chip,
        Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"], T["stroke-detail"]))
      ) + circle(M(6.1), M(32.2), M(0.35), T.cavity, edge(T, T["metal-edge"], T["stroke-fine"]))
    );
    const bx = M(7.9);
    const by = M(31.3);
    const bw = M(3.9);
    const bh = M(2.6);
    s += tag(
      "button",
      rect(bx, by, bw, bh, T.metal, Object.assign({ rx: 0.8 }, edge(T, T["metal-edge"], T["stroke-detail"]))) + rect(bx + M(0.5), by + M(0.3), bw - M(1), bh - M(0.6), T["metal-edge"], { rx: 0.6, "fill-opacity": 0.35 }) + circle(
        bx + bw / 2,
        by + bh / 2,
        M(0.8),
        T["plastic-white"],
        Object.assign({ "data-hook": "reset-button" }, edge(T, T["plastic-white-edge"], T["stroke-fine"]))
      )
    );
    s += indicator({ x: M(5.3), y: M(35.5), size: M(1.2), color: "blue", on: ind.rgb, hook: "rgb-led", finish: fin });
    s += sot23(T, M(8.1), M(35.6), 3) + smd(T, "capacitor", M(10.6), M(34.5), false) + smd(T, "resistor", M(4.7), M(37.4), true) + smd(T, "resistor", M(10.3), M(37.4), true);
    s += microUsb(T, w / 2, M(39.2), M(7.5), M(5.8));
    s += indicator({
      x: M(2.75),
      y: M(40.6),
      size: M(1.36),
      color: "orange",
      on: ind.user,
      hook: "user-led",
      finish: fin
    });
    s += indicator({
      x: M(13.7),
      y: M(40.6),
      size: M(1.36),
      color: "green",
      on: ind.power,
      hook: "power-led",
      state: "power",
      finish: fin
    });
    const row = function(list, x, side) {
      list.forEach((n, k) => {
        const y = top + k * p;
        const label = silk(n);
        const onEnd = y < my + mh + M(0.6);
        s += pin({ x, y, kind, label: onEnd ? void 0 : label, side, silk: f.silk, size: PIN_LABEL });
        if (onEnd) {
          const lx = side === "right" ? x + T["pad-radius"] + 1 + PIN_LABEL / 2 : x - T["pad-radius"] - 1 - PIN_LABEL / 2;
          s += text(lx, y, label, PIN_LABEL, f.silk, {
            "dominant-baseline": "middle",
            transform: `rotate(-90 ${r2(lx)} ${r2(y)})`
          });
        }
        pins.push({ name: n, x, y });
      });
    };
    row(left, leftX, "right");
    row(right, rightX, "left");
    return art(w, h, props.description || props.label || "Nano-class radio board", s, pins);
  }
  function nucleo64BoardTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const M = function(v) {
      return v * mm;
    };
    const fin = props.finish || "white";
    const f = finish(T, fin);
    const w = M(70);
    const h = M(82.5);
    let s = "";
    const pins = [];
    const ind = { power: true, user: false, ...props.indicators };
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: M(52), y: M(79), size: 0.7 * p } });
    const X0 = M(3.3);
    const top = M(32.8);
    const rowYof = function(r) {
      return top + r * p;
    };
    const left = props.left || [];
    const right = props.right || [];
    const power = props.power || [];
    const analog = props.analog || [];
    const dHigh = props.digitalHigh || [];
    const dLow = props.digitalLow || [];
    const LX = [X0, X0 + p];
    const RX = [X0 + 24 * p, X0 + 25 * p];
    const AL = X0 + 3 * p;
    const AR = X0 + 22 * p;
    [
      [X0 + M(6.7), top - M(4.1)],
      [X0 + M(55.6), top - M(4.1)],
      [X0 + M(40), top + M(47.6)]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], M(1.6), T.hole, edge(T, T.pad, 1)));
    });
    for (let r = 0; r < 19; r++) {
      const y = rowYof(r);
      s += trace(T, fin, [
        [LX[1], y],
        [LX[1] + 1.2 * p, y + 0.4 * p]
      ]) + trace(T, fin, [
        [RX[0], y],
        [RX[0] - 1.2 * p, y - 0.4 * p]
      ]);
    }
    s += via(T, M(17.5), M(64)) + via(T, M(51.5), M(64)) + via(T, M(13), M(4)) + via(T, M(55), M(13)) + via(T, M(30), M(46)) + via(T, M(41), M(46));
    s += usbPort(T, { kind: "mini", x: M(46.9) - 1.9 * p, y: T["board-inset"], w: 3.8 * p, h: 1.7 * p, mouth: "up" });
    s += qfp(T, M(31), M(11.8), M(7), M(7), 12, "DEBUG");
    s += smd(T, "crystal", M(25), M(13.6), false) + smd(T, "capacitor", M(40.2), M(13), false) + smd(T, "capacitor", M(40.2), M(16), false);
    s += indicator({
      x: M(60),
      y: M(5.4),
      size: 0.8 * p,
      color: "red",
      on: false,
      hook: "com-led",
      finish: fin,
      label: "COM"
    });
    let jp = "";
    [
      [M(20.6), M(3.4)],
      [M(20.6) + p, M(3.4)],
      [M(20.6), M(3.4) + p],
      [M(20.6) + p, M(3.4) + p]
    ].forEach((c) => {
      jp += circle(c[0], c[1], 0.3 * p, T.pad) + circle(c[0], c[1], 0.14 * p, T.hole);
    });
    s += tag("icsp", jp) + text(M(21.9), M(9.6), "CN2", PIN_LABEL, f.silk);
    let swd = "";
    for (let k = 0; k < 6; k++)
      swd += circle(M(8), M(9.8) + k * p, 0.3 * p, T.pad) + circle(M(8), M(9.8) + k * p, 0.14 * p, T.hole);
    s += tag("icsp", swd) + text(M(11.6), M(16.4), "SWD", PIN_LABEL, f.silk);
    s += text(M(34.5), M(22.6), "DEBUGGER", PIN_LABEL, f.silk, { "fill-opacity": 0.8 });
    s += line(1.5 * p, M(25.9), w - 1.5 * p, M(25.9), f.silk, T["stroke-fine"], {
      "stroke-dasharray": "3 2.4",
      "stroke-opacity": 0.7
    });
    s += tag(
      "button",
      rect(
        M(24.3),
        M(27.4),
        M(6),
        M(6),
        T["plastic-black"],
        Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      ) + circle(
        M(27.3),
        M(30.4),
        M(1.8),
        T["plastic-blue"],
        Object.assign({ "data-hook": "user-button" }, edge(T, T["plastic-blue-edge"], T["stroke-fine"]))
      )
    );
    s += text(M(27.3), M(33.4) + PIN_LABEL + 0.6, "USER", PIN_LABEL, f.silk);
    s += tactile(T, f, M(38.7), M(27.4), M(6), "RESET", "reset-button");
    s += indicator({
      x: M(48.2),
      y: M(28.6),
      size: 0.8 * p,
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "powered",
      finish: fin,
      label: "PWR"
    });
    s += indicator({
      x: M(51.6),
      y: M(28.6),
      size: 0.8 * p,
      color: "green",
      on: ind.user,
      hook: "user-led",
      finish: fin,
      label: "LD4"
    });
    s += tag(
      "regulator",
      rect(M(20), M(37.6), M(3), M(1.4), T.metal, { rx: 0.3 }) + rect(
        M(18.3),
        M(38.8),
        M(6.5),
        M(3.5),
        T["plastic-black"],
        Object.assign({ rx: 0.4 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    s += qfp(T, M(31), M(52.2), M(7.6), M(7.6), 12, props.chipLabel || "STM32C031C6");
    s += smd(T, "crystal", M(22), M(53), false) + smd(T, "capacitor", M(25), M(48.5), false) + smd(T, "capacitor", M(42.6), M(48.5), false) + smd(T, "resistor", M(25), M(60), false) + smd(T, "resistor", M(42.6), M(60), false);
    s += smd(T, "capacitor", M(29), M(40), true) + smd(T, "capacitor", M(36), M(40), true);
    s += text(M(36.3), M(70.5), props.label || "STM32 BOARD", 6, f.silk, { "font-weight": 700 });
    s += text(M(36.3), M(74.5), "R3 HEADERS", PIN_LABEL, f.silk, { "fill-opacity": 0.8 });
    const pad = function(x, y, name) {
      if (name === null || name === void 0) {
        s += tag("pin", circle(x, y, T["pad-radius"], T.pad) + circle(x, y, T["hole-radius"], T.hole));
        return;
      }
      s += pin({ x, y, kind: "pad" });
      pins.push({ name, x, y });
    };
    for (let r = 0; r < 19; r++) {
      const y = rowYof(r);
      const lp = left[r] || [null, null];
      pad(LX[0], y, lp[0]);
      pad(LX[1], y, lp[1]);
    }
    for (let r = 0; r < 19; r++) {
      const y = rowYof(r);
      const rp = right[r] || [null, null];
      pad(RX[0], y, rp[0]);
      pad(RX[1], y, rp[1]);
    }
    s += text(LX[0] + p / 2, top - 0.9 * p, "CN7", PIN_LABEL, f.silk) + text(RX[0] + p / 2, top - 0.9 * p, "CN10", PIN_LABEL, f.silk);
    const sock = function(x, row, name, side) {
      const y = rowYof(row);
      if (name === null || name === void 0) {
        s += pin({ x, y, kind: "socket" });
        return;
      }
      s += pin({ x, y, kind: "socket", label: silkName(name), side, silk: f.silk, size: PIN_LABEL });
      pins.push({ name, x, y });
    };
    const powerRow = 12 - power.length;
    power.forEach((n, i) => {
      sock(AL, powerRow + i, n, "right");
    });
    analog.forEach((n, i) => {
      sock(AL, 13 + i, n, "right");
    });
    dHigh.forEach((n, i) => {
      sock(AR, 1 + i, n, "left");
    });
    dLow.forEach((n, i) => {
      sock(AR, 11 + i, n, "left");
    });
    s += text(AL, rowYof(powerRow - 1) - 0.35 * p, "POWER", PIN_LABEL, f.silk) + text(AL, rowYof(12) + 1.4, "ANALOG", PIN_LABEL, f.silk) + text(AR, rowYof(0) - 0.35 * p, "DIGITAL", PIN_LABEL, f.silk);
    return art(w, h, props.description || props.label || "Nucleo-64 board", s, pins);
  }
  function picoBoardTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "green";
    const f = finish(T, fin);
    const left = props.left || [];
    const right = props.right || [];
    const ind = props.indicators || { power: false, user: false };
    const w = 8.6 * p;
    const h = 20 * p;
    const leftX = 0.8 * p;
    const rightX = 7.8 * p;
    const top = 0.5 * p;
    const cx = 4.3 * p;
    let s = "";
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 5.4 * p, y: 15.6 * p, size: 0.7 * p } });
    [
      [2.6 * p, 2 * p],
      [5.9 * p, 2 * p],
      [2.6 * p, 18 * p],
      [5.7 * p, 18 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    left.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.3 * p, y],
        [leftX + 1.7 * p, y + 0.35 * p]
      ]);
    });
    right.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.3 * p, y],
        [rightX - 1.7 * p, y - 0.35 * p]
      ]);
    });
    s += via(T, 3 * p, 14.6 * p) + via(T, 6 * p, 14.6 * p) + via(T, 5.9 * p, 7.2 * p);
    s += microUsb(T, cx, T["board-inset"], 2.6 * p, 1.5 * p, "up");
    s += indicator({
      x: 2.3 * p,
      y: 0.6 * p,
      size: 0.6 * p,
      color: "green",
      on: ind.user,
      hook: "user-led",
      finish: fin
    });
    s += tactile(T, f, 2.2 * p, 3.3 * p, 1.4 * p, void 0, "boot-button");
    s += sot23(T, 4.5 * p, 2.3 * p, 5) + framed(T, f, "capacitor", 4.9 * p, 4 * p, true);
    s += soic(T, 3.2 * p, 5 * p, 1.5 * p, 1.3 * p, 2, void 0);
    s += qfp(T, cx - 1.3 * p, 8 * p, 2.6 * p, 2.6 * p, 10, props.chipLabel || "RP2040");
    s += smd(T, "crystal", cx - 0.65 * p, 11.6 * p, true) + smd(T, "capacitor", 3 * p, 12.6 * p, true) + smd(T, "resistor", 4.7 * p, 12.6 * p, true);
    if (props.label)
      s += text(2.3 * p, 9.3 * p, props.label, 4.4, f.silk, {
        "dominant-baseline": "middle",
        transform: `rotate(-90 ${r2(2.3 * p)} ${r2(9.3 * p)})`
      });
    const dbg = header({
      x: leftX + 2 * p,
      y: top + 19 * p,
      labels: ["SWCLK", "GND", "SWDIO"],
      kind: "pad",
      silk: f.silk,
      size: PIN_LABEL
    });
    s += text(cx, h - 1.45 * p, "DEBUG", PIN_LABEL, f.silk);
    const lh = header({
      x: leftX,
      y: top,
      axis: "y",
      labels: left.map(silkName),
      kind: "pad",
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rh = header({
      x: rightX,
      y: top,
      axis: "y",
      labels: right.map(silkName),
      kind: "pad",
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    lh.pins.forEach((pn, i) => {
      pn.name = left[i];
    });
    rh.pins.forEach((pn, i) => {
      pn.name = right[i];
    });
    s += lh.svg + rh.svg + dbg.svg.replace(/<text[^>]*>[^<]*<\/text>/g, "");
    return art(
      w,
      h,
      props.description || props.label || "Raspberry Pi Pico",
      s,
      lh.pins.concat(rh.pins, props.debugPins === false ? [] : dbg.pins)
    );
  }
  function nucleo32BoardTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "white";
    const f = finish(T, fin);
    const left = props.left || [];
    const right = props.right || [];
    const ind = { power: true, user: false, ...props.indicators };
    const w = 18.5 * p / 2.54;
    const h = 20 * p;
    const leftX = (w - 6 * p) / 2;
    const rightX = w - leftX;
    const top = 2.9 * p;
    const cx = w / 2;
    let s = "";
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: cx + 2.2 * p, y: 18.3 * p, size: 0.7 * p } });
    left.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.3 * p, y],
        [leftX + 1.7 * p, y + 0.35 * p]
      ]);
    });
    right.forEach((_, k) => {
      const y = top + k * p;
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.3 * p, y],
        [rightX - 1.7 * p, y - 0.35 * p]
      ]);
    });
    s += via(T, 5.5 * p, 8 * p);
    s += microUsb(T, cx, T["board-inset"], 2.6 * p, 1.5 * p, "up");
    s += indicator({
      x: cx - 2.4 * p,
      y: 0.6 * p,
      size: 0.6 * p,
      color: "red",
      on: false,
      hook: "com-led",
      finish: fin,
      label: "COM"
    });
    s += indicator({
      x: cx + 1.9 * p,
      y: 0.6 * p,
      size: 0.6 * p,
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "powered",
      finish: fin,
      label: "PWR"
    });
    s += qfp(T, cx - 1.3 * p, 2.3 * p, 2.6 * p, 2.6 * p, 10, "DEBUGGER");
    s += smd(T, "crystal", cx + 1.2 * p, 5.3 * p, false) + smd(T, "capacitor", cx - 1.5 * p, 5.4 * p, false);
    s += tactile(T, f, cx - 1.7 * p, 6.6 * p, 1.2 * p, "RESET", "reset-button");
    s += line(1.6 * p, 8.9 * p, w - 1.6 * p, 8.9 * p, f.silk, T["stroke-fine"], {
      "stroke-dasharray": "3 2.4",
      "stroke-opacity": 0.7
    });
    s += qfp(T, cx - 1.3 * p, 9.9 * p, 2.6 * p, 2.6 * p, 8, props.chipLabel || "STM32");
    s += smd(T, "crystal", cx - 0.65 * p, 13.2 * p, true) + smd(T, "capacitor", cx - 1.5 * p, 13 * p, false) + smd(T, "capacitor", cx + 1 * p, 13 * p, false);
    s += indicator({
      x: cx - 0.3 * p,
      y: 16.6 * p,
      size: 0.6 * p,
      color: "green",
      on: ind.user,
      hook: "user-led",
      finish: fin,
      label: "LD3"
    });
    const extra = [];
    (props.extraPads || [
      { name: "VCP_TX", dx: 2, dy: 12 },
      { name: "VCP_RX", dx: 4, dy: 12 }
    ]).forEach((e) => {
      const x = leftX + e.dx * p;
      const y = top + e.dy * p;
      s += pin({ x, y, kind: "pad" }) + text(x, y - T["pad-radius"] - 1.4, e.name, PIN_LABEL, f.silk);
      extra.push({ name: e.name, x, y });
    });
    if (props.label) s += text(cx - 0.9 * p, h - 0.75 * p, props.label, 4.4, f.silk);
    const lh = header({
      x: leftX,
      y: top,
      axis: "y",
      labels: left.map(silkName),
      kind: "pad",
      side: "right",
      silk: f.silk,
      size: PIN_LABEL
    });
    const rh = header({
      x: rightX,
      y: top,
      axis: "y",
      labels: right.map(silkName),
      kind: "pad",
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    lh.pins.forEach((pn, i) => {
      pn.name = left[i];
    });
    rh.pins.forEach((pn, i) => {
      pn.name = right[i];
    });
    s += lh.svg + rh.svg;
    return art(w, h, props.description || props.label || "Nucleo-32 board", s, lh.pins.concat(rh.pins, extra));
  }
  function bluePillBoard(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = 21 * p;
    const h = 9 * p;
    let s = "";
    const ind = props.indicators || {};
    const top = props.top || [
      "GND.2",
      "GND",
      "3V3",
      "R",
      "B11",
      "B10",
      "B1",
      "B0",
      "A7",
      "A6",
      "A5",
      "A4",
      "A3",
      "A2",
      "A1",
      "A0",
      "C15",
      "C14",
      "C13",
      "VBAT"
    ];
    const bottom = props.bottom || [
      "B12",
      "B13",
      "B14",
      "B15",
      "A8",
      "A9",
      "A10",
      "A11",
      "A12",
      "A15",
      "B3",
      "B4",
      "B5",
      "B6",
      "B7",
      "B8",
      "B9",
      "5V",
      "GND.3",
      "3V3.2"
    ];
    const order = props.order || [
      "3V3",
      "3V3.2",
      "5V",
      "A0",
      "A1",
      "A10",
      "A11",
      "A12",
      "A15",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
      "B0",
      "B1",
      "B10",
      "B11",
      "B12",
      "B13",
      "B14",
      "B15",
      "B3",
      "B4",
      "B5",
      "B6",
      "B7",
      "B8",
      "B9",
      "C13",
      "C14",
      "C15",
      "GND",
      "GND.2",
      "GND.3",
      "R",
      "VBAT"
    ];
    const at = {};
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 6.3 * p, y: 5 * p, size: 0.6 * p } });
    [
      [6, "top"],
      [9, "top"],
      [15, "top"],
      [4, "bottom"],
      [8, "bottom"],
      [11, "bottom"]
    ].forEach((c) => {
      const x = (c[0] + 1) * p;
      const y = c[1] === "top" ? 1.5 * p : 7.5 * p;
      const dy = c[1] === "top" ? 1 : -1;
      s += trace(T, fin, [
        [x, y],
        [x, y + dy * 1.1 * p],
        [x + 0.6 * p, y + dy * 1.7 * p]
      ]);
    });
    s += via(T, 7 * p, 6.3 * p) + via(T, 17.6 * p, 3.6 * p);
    s += usbPort(T, { kind: "micro", x: 0, y: 4.5 * p - 1.4 * p, w: 2 * p, h: 2.8 * p, mouth: "left" });
    [2.6, 3.6].forEach((jy) => {
      s += tag(
        "jumper",
        rect(
          2.5 * p,
          jy * p,
          2.6 * p,
          0.6 * p,
          T["plastic-black"],
          Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
        ) + rect(
          2.44 * p,
          (jy - 0.06) * p,
          1.72 * p,
          0.72 * p,
          "#e8c547",
          Object.assign({ rx: 0.4 }, edge(T, "#a9871f", T["stroke-fine"]))
        )
      );
    });
    s += text(5.85 * p, 3.4 * p + PIN_LABEL * 0.4, "BOOT", PIN_LABEL, f.silk);
    s += tactile(T, f, 2.9 * p, 4.65 * p, 1.2 * p, "RST", "reset-button");
    s += smd(T, "resistor", 4.6 * p, 4.75 * p, false) + smd(T, "resistor", 5.4 * p, 4.75 * p, false);
    const cx = 9.9 * p;
    const cy = 4.5 * p;
    const body = 7 * mm;
    const half = body / 2;
    let g = "";
    for (let i = 0; i < 12; i++) {
      const off = -half + (i + 0.5) * body / 12;
      g += rect(cx + off - 0.6, cy - half - 0.2 * p, 1.2, 0.2 * p, T.lead) + rect(cx + off - 0.6, cy + half, 1.2, 0.2 * p, T.lead) + rect(cx - half - 0.2 * p, cy + off - 0.6, 0.2 * p, 1.2, T.lead) + rect(cx + half, cy + off - 0.6, 0.2 * p, 1.2, T.lead);
    }
    g += rect(cx - half, cy - half, body, body, T.chip, Object.assign({ rx: T["radius-chip"] }, edge(T, T["chip-edge"])));
    g += circle(cx - half + 2.2, cy + half - 2.2, 0.9, T["chip-print"]);
    g += text(cx, cy + 1.6, "STM32F103", 4.4, T["chip-print"], { "font-weight": 600 });
    s += el("g", { "data-part": "chip", transform: `rotate(45 ${r2(cx)} ${r2(cy)})` }, g);
    s += tag(
      "crystal",
      rect(
        12.45 * p,
        2.4 * p,
        1.8 * p,
        4.2 * p,
        T.metal,
        Object.assign({ rx: 0.9 * p }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + rect(12.75 * p, 2.75 * p, 1.2 * p, 3.5 * p, "#ffffff", { rx: 0.6 * p, "fill-opacity": 0.18 })
    );
    s += tag(
      "crystal",
      rect(
        14.6 * p,
        3 * p,
        1.3 * p,
        3 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    s += smd(T, "capacitor", 14.75 * p, 2.35 * p, true) + smd(T, "capacitor", 16.25 * p, 5.85 * p, true);
    s += indicator({
      x: 16.4 * p,
      y: 2.6 * p,
      size: 0.6 * p,
      color: "red",
      on: ind.power,
      hook: "power-led",
      state: "powered",
      finish: fin,
      label: "PWR"
    });
    s += indicator({
      x: 16.4 * p,
      y: 4.3 * p,
      size: 0.6 * p,
      color: "green",
      on: ind.user,
      hook: "user-led",
      finish: fin,
      label: "PC13"
    });
    [3, 4, 5, 6].forEach((k) => {
      s += barePad(T, 18.5 * p, k * p);
    });
    top.forEach((n, c) => {
      const x = (c + 1) * p;
      const y = 1.5 * p;
      at[n] = { x, y };
      s += pin({ x, y, kind: "pad", label: silkName(n), side: "below", silk: f.silk, size: PIN_LABEL });
    });
    bottom.forEach((n, c) => {
      const x = (c + 1) * p;
      const y = 7.5 * p;
      at[n] = { x, y };
      s += pin({ x, y, kind: "pad", label: silkName(n), side: "above", silk: f.silk, size: PIN_LABEL });
    });
    const pins = order.filter((n) => {
      return at[n];
    }).map((n) => {
      return { name: n, x: at[n].x, y: at[n].y };
    });
    return art(w, h, props.description || props.label || "STM32F103C8 Blue Pill board", s, pins);
  }
  function lights(props, user) {
    const ind = props && props.indicators || {};
    return user === false ? { power: ind.power === true } : { power: ind.power === true, user: ind.user || false };
  }
  function unoClassBoard(props) {
    return devBoardTemplate({
      layout: "landscape",
      label: "UNO-CLASS",
      chipLabel: "ATMEGA328P",
      labels: { "A5.2": "SCL", "A4.2": "SDA" },
      top: [
        ["A5.2", "A4.2", "AREF", "GND", "13", "12", "11", "10", "9", "8"],
        ["7", "6", "5", "4", "3", "2", "1", "0"]
      ],
      bottom: [
        ["NC", "IOREF", "RESET", "3.3V", "5V", "GND.2", "GND.3", "VIN"],
        ["A0", "A1", "A2", "A3", "A4", "A5"]
      ],
      groupNames: { top: ["DIGITAL (PWM ~)"], bottom: ["POWER", "ANALOG IN"] },
      pwm: ["3", "5", "6", "9", "10", "11"],
      indicators: lights(props),
      description: "Uno-class board"
    });
  }
  function nanoClassBoard(props) {
    return devBoardTemplate({
      label: "NANO-CLASS",
      chipLabel: "ATMEGA328P",
      pinKind: "pad",
      widthPitches: 7.2,
      labels: NANO_LABELS,
      left: ["13", "3.3V", "AREF", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "5V", "RESET", "GND", "VIN"],
      right: ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "GND.2", "RESET.2", "0", "1"],
      icsp: ["12.2", "5V.2", "13.2", "11.2", "RESET.3", "GND.3"],
      indicators: lights(props),
      description: "Nano-class board"
    });
  }
  function numbered(from, count, step) {
    const out = [];
    for (let i = 0; i < count; i++) out.push(String(from + i * step));
    return out;
  }
  function megaClassBoard(props) {
    return megaBoardTemplate({
      label: "MEGA-CLASS",
      chipLabel: "ATMEGA2560",
      top: [
        ["SCL", "SDA", "AREF", "GND", "13", "12", "11", "10", "9", "8"],
        ["7", "6", "5", "4", "3", "2", "1", "0"],
        numbered(14, 8, 1)
      ],
      block: {
        left: ["5V.2"].concat(numbered(22, 16, 2), ["GND.4"]),
        right: ["5V.3"].concat(numbered(23, 16, 2), ["GND.5"])
      },
      bottom: [
        ["IOREF", "RESET", "3.3V", "5V", "GND.2", "GND.3", "VIN"],
        numbered(0, 8, 1).map((n) => {
          return `A${n}`;
        }),
        numbered(8, 8, 1).map((n) => {
          return `A${n}`;
        })
      ],
      groupNames: { top: ["DIGITAL (PWM ~)", "COMMUNICATION"], bottom: ["POWER", "ANALOG IN"] },
      pwm: numbered(2, 12, 1),
      indicators: lights(props),
      description: "Mega-class board"
    });
  }
  function nanoRp2040Board(props) {
    return nanoConnectTemplate({
      label: "NANO RP2040",
      chipLabel: "RP2040",
      left: ["TX", "RX", "RESET", "GND", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12"],
      right: ["VIN", "GND.2", "REC", "5V", "A7", "A6", "A5", "A4", "A3", "A2", "A1", "A0", "AREF", "3.3V", "D13"],
      indicators: lights(props),
      description: "Nano RP2040 Connect board"
    });
  }
  function picoClassBoard(props) {
    return picoBoardTemplate({
      label: "PICO-CLASS",
      chipLabel: "RP2040",
      debugPins: false,
      indicators: lights(props),
      description: "Pico-class board",
      left: [
        "GP0",
        "GP1",
        "GND",
        "GP2",
        "GP3",
        "GP4",
        "GP5",
        "GND.2",
        "GP6",
        "GP7",
        "GP8",
        "GP9",
        "GND.3",
        "GP10",
        "GP11",
        "GP12",
        "GP13",
        "GND.4",
        "GP14",
        "GP15"
      ],
      right: [
        "VBUS",
        "VSYS",
        "GND.8",
        "3V3_EN",
        "3V3",
        "ADC_VREF",
        "GP28",
        "GND.7",
        "GP27",
        "GP26",
        "RUN",
        "GP22",
        "GND.6",
        "GP21",
        "GP20",
        "GP19",
        "GP18",
        "GND.5",
        "GP17",
        "GP16"
      ]
    });
  }
  function esp32DevKitV1(props) {
    return espDevKitTemplate({
      label: "ESP32 DEVKIT V1",
      chipLabel: "ESP-WROOM-32",
      indicators: lights(props),
      description: "ESP32 development board",
      left: ["EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "D13", "GND.2", "VIN"],
      right: ["D23", "D22", "TX0", "RX0", "D21", "D19", "D18", "D5", "TX2", "RX2", "D4", "D2", "D15", "GND", "3V3"]
    });
  }
  function esp32DevKitCV4(props) {
    return espDevKitTemplate({
      label: "ESP32 DEVKITC V4",
      chipLabel: "ESP32-WROOM-32D",
      layout: "devkitc",
      indicators: lights(props, false),
      description: "ESP32 development board",
      left: [
        "3V3",
        "EN",
        "VP",
        "VN",
        "34",
        "35",
        "32",
        "33",
        "25",
        "26",
        "27",
        "14",
        "12",
        "GND",
        "13",
        "D2",
        "D3",
        "CMD",
        "5V"
      ],
      right: [
        "GND.2",
        "23",
        "22",
        "TX",
        "RX",
        "21",
        "GND.3",
        "19",
        "18",
        "5",
        "17",
        "16",
        "4",
        "0",
        "2",
        "15",
        "D1",
        "D0",
        "CLK"
      ]
    });
  }
  function moduleDevKit(spec, props) {
    return espDevKitTemplate({
      layout: "devkit-1",
      module: spec.size[0],
      length: spec.size[1],
      overhang: spec.size[2],
      firstPin: spec.size[3],
      usb: spec.usb,
      buttons: spec.buttons,
      bridge: spec.bridge,
      label: spec.label,
      chipLabel: spec.module,
      left: spec.left,
      right: spec.right,
      indicators: { power: lights(props).power },
      description: spec.description
    });
  }
  function esp32C3DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-C3-MINI-1",
        label: "DEVKITM-1",
        size: ["mini", 38.91, 5.35, 1.68],
        usb: "micro",
        buttons: ["BOOT", "RST"],
        bridge: "CP2102N",
        description: "ESP32-C3 development board",
        left: ["GND", "3V3", "3V3.2", "2", "3", "GND.2", "RST", "GND.3", "0", "1", "10", "GND.4", "5V", "5V.2", "GND.5"],
        right: ["GND.6", "TX", "RX", "GND.7", "9", "8", "GND.8", "7", "6", "5", "4", "GND.9", "18", "19", "GND.10"]
      },
      props
    );
  }
  function esp32S2DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-S2-MINI-1",
        label: "DEVKITM-1",
        size: ["mini-s2", 54, 5.6, 1.6],
        usb: "micro",
        buttons: ["BOOT", "RST"],
        bridge: "CP2102N",
        description: "ESP32-S2 development board",
        left: [
          "3V3",
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "5V",
          "GND"
        ],
        right: [
          "GND.2",
          "RST",
          "46",
          "45",
          "RX",
          "TX",
          "42",
          "41",
          "40",
          "39",
          "38",
          "37",
          "36",
          "35",
          "34",
          "33",
          "26",
          "21",
          "20",
          "19",
          "18"
        ]
      },
      props
    );
  }
  function esp32S3DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-S3-WROOM-1",
        label: "DEVKITC-1",
        size: ["wroom", 62.74, 8.25, 1.53],
        usb: "dual-micro",
        buttons: ["BOOT", "RESET"],
        bridge: "CP2102N",
        description: "ESP32-S3 development board",
        left: [
          "3V3",
          "3V3.2",
          "RST",
          "4",
          "5",
          "6",
          "7",
          "15",
          "16",
          "17",
          "18",
          "8",
          "3",
          "46",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "5V",
          "GND"
        ],
        right: [
          "GND.2",
          "TX",
          "RX",
          "1",
          "2",
          "42",
          "41",
          "40",
          "39",
          "38",
          "37",
          "36",
          "35",
          "0",
          "45",
          "48",
          "47",
          "21",
          "20",
          "19",
          "GND.3",
          "GND.4"
        ]
      },
      props
    );
  }
  function esp32C5DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-C5-WROOM-1",
        label: "DEVKITC-1",
        size: ["wroom", 53.6, 6.5, 1.575],
        usb: "dual-c",
        buttons: ["RESET", "BOOT"],
        description: "ESP32-C5 development board",
        left: ["3V3", "RST", "2", "3", "0", "1", "6", "7", "8", "9", "10", "26", "25", "5V", "GND", "NC0"],
        right: ["GND.2", "TX", "RX", "24", "23", "15", "27", "4", "5", "NC1", "28", "GND.3", "14", "13", "GND.4", "NC2"]
      },
      props
    );
  }
  function esp32C6DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-C6-WROOM-1",
        label: "DEVKITC-1",
        size: ["wroom", 51.8, 6.35, 1.575],
        usb: "dual-c",
        buttons: ["BOOT", "RESET"],
        description: "ESP32-C6 development board",
        left: ["3V3", "RST", "4", "5", "6", "7", "0", "1", "8", "10", "11", "2", "3", "5V", "GND", null],
        right: ["GND.2", "TX", "RX", "15", "23", "22", "21", "20", "19", "18", "9", "GND.3", "13", "12", "GND.4", null]
      },
      props
    );
  }
  function esp32H2DevKit(props) {
    return moduleDevKit(
      {
        module: "ESP32-H2-MINI-1",
        label: "DEVKITM-1",
        size: ["mini", 48.26, 5.4, 1.46],
        usb: "dual-c",
        buttons: ["RESET", "BOOT"],
        description: "ESP32-H2 development board",
        left: ["3V3", "RST", "0", "1", "2", "3", "13", "14", "4", "5", "NC", "VBAT", "GND", "5V", "GND.2"],
        right: ["GND.3", "TX", "RX", "10", "11", "25", "12", "8", "22", "GND.4", "9", "GND.5", "27", "26", "GND.6"]
      },
      props
    );
  }
  function stm32L031K6Board(props) {
    return nucleo32BoardTemplate({
      label: "L031K6 BOARD",
      chipLabel: "STM32L031K6",
      indicators: { power: lights(props).power },
      description: "Nucleo-32 board with an STM32L031K6",
      left: ["D1", "D0", "RST", "GND", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12"],
      right: ["VIN", "GND.2", "RST.2", "5V", "A7", "A6", "A5", "A4", "A3", "A2", "A1", "A0", "REF", "3V3", "D13"]
    });
  }
  function stm32C031C6Board(props) {
    return nucleo64BoardTemplate({
      label: "C031C6 BOARD",
      chipLabel: "STM32C031C6",
      indicators: { power: lights(props).power },
      description: "Nucleo-64 board with an STM32C031C6",
      left: [
        ["PD0", "PD1"],
        ["PD2", "PD2.2"],
        ["VDD", "E5V"],
        ["PA14", "GND.4"],
        [null, null],
        [null, "IOREF.2"],
        ["PA13", "NRST.2"],
        ["PC6", "3V3.2"],
        [null, "5V.2"],
        ["GND.5", "GND.6"],
        [null, "GND.7"],
        ["PC13", "VIN.2"],
        ["PC14", null],
        [null, "PA0"],
        ["PF0", "PA1"],
        ["PF1", "PA4"],
        ["PB11", "PB0.2"],
        ["PA2", "PA11"],
        [null, "PA12"]
      ],
      right: [
        ["PD3", "PA3"],
        ["PB8", "PC15"],
        ["PB9", "PB12"],
        ["AVDD.2", "5V.3"],
        ["GND.8", null],
        ["PA5", "PF3"],
        ["PA6", "PA8"],
        ["PA7", "PB12.2"],
        ["PB0", null],
        ["PC7", "GND.9"],
        ["PA9", "PB2"],
        ["PA15", "PB1"],
        ["PB5", "PB15"],
        ["PB4", "PB14"],
        ["PB10", "PB13"],
        ["PB3", "AGND"],
        ["PA10", null],
        ["PB6", null],
        ["PB7", null]
      ],
      power: [null, "IOREF", "NRST", "3V3", "5V", "GND", "GND.2", "VIN"],
      analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
      digitalHigh: ["D15", "D14", "AVDD", "GND.3", "D13", "D12", "D11", "D10", "D9", "D8"],
      digitalLow: ["D7", "D6", "D5", "D4", "D3", "D2", "D1", "D0"]
    });
  }
  var ESP_MODULES, NANO_LABELS;
  var init_boards = __esm({
    "src/boards.js"() {
      init_core();
      init_pieces();
      init_passives();
      ESP_MODULES = { mini: [13.2, 16.6], "mini-s2": [15.4, 20.5], wroom: [18, 25.5] };
      NANO_LABELS = { 0: "RX0", 1: "TX1", "3.3V": "3V3", AREF: "REF", RESET: "RST", "RESET.2": "RST" };
      for (let nanoDigit = 2; nanoDigit <= 13; nanoDigit++) NANO_LABELS[String(nanoDigit)] = `D${nanoDigit}`;
    }
  });

  // src/families/boards.js
  var boards_exports = {};
  __export(boards_exports, {
    bluePillBoard: () => bluePillBoard,
    esp32C3DevKit: () => esp32C3DevKit,
    esp32C5DevKit: () => esp32C5DevKit,
    esp32C6DevKit: () => esp32C6DevKit,
    esp32DevKitCV4: () => esp32DevKitCV4,
    esp32DevKitV1: () => esp32DevKitV1,
    esp32H2DevKit: () => esp32H2DevKit,
    esp32S2DevKit: () => esp32S2DevKit,
    esp32S3DevKit: () => esp32S3DevKit,
    franzininho: () => franzininho,
    megaClassBoard: () => megaClassBoard,
    nanoClassBoard: () => nanoClassBoard,
    nanoRp2040Board: () => nanoRp2040Board,
    picoClassBoard: () => picoClassBoard,
    stm32C031C6Board: () => stm32C031C6Board,
    stm32L031K6Board: () => stm32L031K6Board,
    unoClassBoard: () => unoClassBoard
  });
  var init_boards2 = __esm({
    "src/families/boards.js"() {
      init_boards();
    }
  });

  // src/displays.js
  function characterLcd(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const cols = props.cols || 16;
    const rows = props.rows || 2;
    const lines = props.lines || [];
    const glyphs = props.glyphs;
    const blue = props.color === "blue";
    const backpack = !!props.backpack;
    const mmL = p / 2.54;
    const big = cols >= 20 || rows >= 4;
    const real = big ? [98, 60] : [80, 36];
    const M = big ? { dotW: 0.55, dotH: 0.55, dotDx: 0.6, dotDy: 0.6, cellDy: 5.35, marginX: 3.3, marginY: 2.2 } : { dotW: 0.55, dotH: 0.65, dotDx: 0.6, dotDy: 0.7, cellDy: 5.95, marginX: 4.15, marginY: 2.45 };
    const cellDx = 3.55 * mmL;
    const cellDy = M.cellDy * mmL;
    const dotW = M.dotW * mmL;
    const dotH = M.dotH * mmL;
    const dotDx = M.dotDx * mmL;
    const dotDy = M.dotDy * mmL;
    const charW = 4 * dotDx + dotW;
    const charH = 7 * dotDy + dotH;
    const activeW = (cols - 1) * cellDx + charW;
    const activeH = (rows - 1) * cellDy + charH;
    const glassW = activeW + 2 * M.marginX * mmL;
    const glassH = activeH + 2 * M.marginY * mmL;
    const w = r2(real[0] * mmL);
    const h = r2(real[1] * mmL);
    const bezelW = glassW + (big ? 19.8 : 6.7) * mmL;
    const bezelH = glassH + (big ? 14.1 : 7.8) * mmL;
    const bezelX = (w - bezelW) / 2;
    const bezelY = big ? r2(10.35 * mmL) : r2(Math.max(3 * p, 2.6 * p + (h - 2.6 * p - 1.2 * p - bezelH) / 2));
    const parallel = ["VSS", "VDD", "V0", "RS", "RW", "E", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "A", "K"];
    const names = backpack ? parallel : props.pins || parallel;
    const f = finish(T, props.finish || "green");
    let s = board({
      width: w,
      height: h,
      finish: props.finish || "green",
      holes: false,
      mark: props.mark === false ? void 0 : { x: w - 2.2 * p, y: h / 2 - 0.45 * p, size: 0.9 * p }
    });
    [
      [2.5, 2.5],
      [real[0] - 2.5, 2.5],
      [2.5, real[1] - 2.5],
      [real[0] - 2.5, real[1] - 2.5]
    ].forEach((c) => {
      s += tag(
        "hole",
        circle(c[0] * mmL, c[1] * mmL, 2.1 * mmL, T.pad) + circle(c[0] * mmL, c[1] * mmL, 1.25 * mmL, T.hole, edge(T, T["metal-edge"], 0.5))
      );
    });
    s += rect(1.2 * p, 1.8 * p, w - 2.4 * p, h - 3.2 * p, "none", {
      rx: 1,
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.4
    });
    const hx = (big ? 10 : 8) * mmL;
    const hy = 2.5 * mmL;
    const hdr = header({ x: hx, y: hy, labels: names, side: "below", silk: f.silk, size: PIN_LABEL });
    s += rect(hx - 0.5 * p, hy - 0.5 * p, p, p, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8
    });
    s += smd(T, "resistor", w - 4.4 * p, 0.45 * p, true) + smd(T, "capacitor", w - 4.4 * p, 1.15 * p, true);
    hdr.pins.forEach((pn, i) => {
      s += trace(T, props.finish || "green", [
        [pn.x, pn.y],
        [pn.x, pn.y + 1 * p],
        [pn.x + 0.5 * p, pn.y + 1.6 * p]
      ]);
    });
    s += via(T, 1.2 * p, h - 2.3 * p) + via(T, w - 1.3 * p, 2.6 * p) + via(T, w / 2, h - 0.55 * p);
    let shown = hdr.pins;
    let over = "";
    if (backpack) {
      hdr.pins.forEach((pn) => {
        s += tag(
          "solder",
          circle(pn.x, pn.y, T["pad-radius"], T.pad) + circle(pn.x, pn.y, T["hole-radius"] + 0.4, T.metal, edge(T, T["metal-edge"], 0.5))
        );
      });
      hdr.pins.forEach((pn, i) => {
        s += text(pn.x, pn.y + T["label-drop"], names[i], PIN_LABEL, f.silk);
      });
      const side = header({
        x: 0.45 * p,
        y: 3.4 * p,
        labels: props.pins || ["GND", "VCC", "SDA", "SCL"],
        axis: "y",
        side: "right",
        silk: f.silk,
        size: PIN_LABEL
      });
      over = tag(
        "backpack-header",
        rect(0.05 * p, 2.9 * p, 0.8 * p, 4 * p, T["plastic-black"], { rx: 0.6, "fill-opacity": 0.9 })
      ) + side.svg;
      shown = side.pins;
    } else s += hdr.svg;
    s += tag("cob", rect(bezelX + 1.2 * p, bezelY + bezelH - 0.3 * p, bezelW - 2.4 * p, 0.8 * p, T.chip, { rx: 0.5 }));
    [0.2, 0.5, 0.8].forEach((q) => {
      s += rect(
        bezelX + 1.2 * p + (bezelW - 2.4 * p) * q - 0.8 * p,
        bezelY + bezelH + 0.05 * p,
        1.6 * p,
        0.35 * p,
        "#000000",
        { rx: 0.5, "fill-opacity": 0.35 }
      );
    });
    s += tag(
      "body",
      rect(
        bezelX,
        bezelY,
        bezelW,
        bezelH,
        T["plastic-black"],
        Object.assign({ rx: T["radius-bezel"] }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += rect(bezelX + 1.5, bezelY + 1.5, bezelW - 3, bezelH - 3, "none", {
      rx: T["radius-bezel"],
      stroke: "#ffffff",
      "stroke-width": 0.5,
      "stroke-opacity": 0.12
    });
    const gx = bezelX + (bezelW - glassW) / 2;
    const gy = bezelY + (bezelH - glassH) / 2;
    s += rect(gx, gy, glassW, glassH, blue ? T["lcd-blue"] : T["lcd-green"], { "data-hook": "glass", rx: 0.8 });
    s += rect(gx, gy, glassW, glassH, "none", {
      rx: 0.8,
      stroke: "#000000",
      "stroke-width": 0.6,
      "stroke-opacity": 0.25
    });
    const ink = blue ? T["lcd-ink-light"] : T["lcd-ink"];
    const ox = gx + M.marginX * mmL;
    const oy = gy + M.marginY * mmL;
    let cells = "";
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = ox + c * cellDx;
        const y = oy + r * cellDy;
        const ch = (lines[r] || "")[c];
        const dots = glyphs ? glyphs[r * cols + c] : null;
        cells += rect(x, y, charW, charH, ink, { "fill-opacity": 0.06 });
        if (dots) {
          for (let dy = 0; dy < 8; dy++)
            for (let dx = 0; dx < 5; dx++)
              if (dots[dy] >> 4 - dx & 1) cells += rect(x + dx * dotDx, y + dy * dotDy, dotW, dotH, ink);
        } else if (!glyphs && ch && ch !== " ")
          cells += text(x + charW / 2, y + charH * 0.86, ch, charH * 0.92, ink, { "font-weight": 700 });
      }
    s += el(
      "g",
      {
        "data-hook": "matrix",
        "data-cols": cols,
        "data-rows": rows,
        "data-x": r2(ox),
        "data-y": r2(oy),
        "data-cell-dx": r2(cellDx),
        "data-cell-dy": r2(cellDy),
        "data-dot-dx": r2(dotDx),
        "data-dot-dy": r2(dotDy),
        "data-dot-w": r2(dotW),
        "data-dot-h": r2(dotH)
      },
      cells
    ) + over;
    const shownText = glyphs ? "" : lines.length ? ` showing ${lines.join(" / ")}` : "";
    return art(w, h, `${cols}×${rows} character LCD${backpack ? " with an I2C backpack" : ""}${shownText}`, s, shown);
  }
  function sevenSegment(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const digits = Math.max(1, Math.min(4, props.digits || 1));
    const value = String(props.value === void 0 ? "8" : props.value);
    const color = lensColor(T, props.color || "red");
    const cellW = 5 * p;
    const w = digits * cellW;
    let h = 9 * p;
    let s = "";
    const off = T["segment-off"];
    const dim = T["opacity-segment-dim"];
    const LAYOUTS = {
      1: { top: ["G", "F", "COM.2", "A", "B"], bottom: ["E", "D", "COM", "C", "DP"] },
      2: { top: ["A", "B", "DIG1", "DIG2", "F"], bottom: ["C", "DP", "E", "D", "G"] },
      3: { top: ["DIG1", "A", "F", "DIG2", "DIG3", "B"], bottom: ["E", "D", "DP", "C", "G", null] },
      4: { top: ["DIG1", "A", "F", "DIG2", "DIG3", "B", "CLN"], bottom: ["E", "D", "DP", "C", "G", "DIG4", "COM"] }
    };
    const names = props.pins || LAYOUTS[digits];
    const named = function(n) {
      return n !== null && n !== void 0;
    };
    const allNames = names ? names.top.concat(names.bottom).filter(named).map(silkName) : [];
    const maxLen = allNames.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rot = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const pinTop = rot ? 1.6 * p : 1 * p;
    const dy = pinTop - 1 * p;
    h = rot ? 9.2 * p : 9 * p;
    s += tag(
      "body",
      rect(
        T["board-inset"],
        1.4 * p + dy,
        w - 2 * T["board-inset"],
        5.5 * p,
        T["segment-face"],
        Object.assign({ rx: 1.2 }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += rect(T["board-inset"] + 1.5, 1.4 * p + dy + 1.5, w - 2 * T["board-inset"] - 3, 5.5 * p - 3, "none", {
      rx: 1,
      stroke: "#ffffff",
      "stroke-width": 0.5,
      "stroke-opacity": 0.1
    });
    const clamp2 = function(v) {
      v = Number(v);
      return v > 0 ? Math.min(1, v) : 0;
    };
    const level = function(on2, d, sgm) {
      return props.levels ? clamp2(props.levels[d * 8 + sgm]) : on2 ? 1 : 0;
    };
    const glow = function(lv) {
      return lv > 0 ? r2(dim + (1 - dim) * lv) : 0;
    };
    const bar = function(x, y, len, horizontal, lv, d, sgm) {
      const t = 0.42 * p;
      const bx = horizontal ? x : x - t / 2;
      const by = horizontal ? y - t / 2 : y;
      const bw = horizontal ? len : t;
      const bh = horizontal ? t : len;
      return rect(bx, by, bw, bh, off, { rx: t / 2 }) + rect(bx, by, bw, bh, color, {
        rx: t / 2,
        "fill-opacity": glow(lv),
        "data-segment": `${d}-${sgm}`,
        "data-level": r2(lv)
      });
    };
    const dot = function(cx, cy, lv, hook) {
      return circle(cx, cy, 0.24 * p, off) + circle(cx, cy, 0.24 * p, color, Object.assign({ "fill-opacity": glow(lv), "data-level": r2(lv) }, hook));
    };
    const colonLevel = typeof props.colon === "number" ? clamp2(props.colon) : props.colon ? 1 : 0;
    for (let d = 0; d < digits; d++) {
      const lit2 = SEG_OF[value[d] === void 0 ? " " : value[d]] || "";
      const ox = d * cellW + 1.2 * p;
      const oy = 2 * p + dy;
      const sw = 2 * p;
      const sh = 2 * p;
      const on2 = function(k) {
        return lit2.indexOf(k) >= 0;
      };
      const skew = `skewX(-10) translate(${r2((oy + sh) * 0.176)} 0)`;
      let g = "";
      g += bar(ox + 0.25 * p, oy, sw, true, level(on2("a"), d, 0), d, 0);
      g += bar(ox + sw + 0.25 * p, oy + 0.2 * p, sh - 0.4 * p, false, level(on2("b"), d, 1), d, 1);
      g += bar(ox + sw + 0.25 * p, oy + sh + 0.2 * p, sh - 0.4 * p, false, level(on2("c"), d, 2), d, 2);
      g += bar(ox + 0.25 * p, oy + 2 * sh, sw, true, level(on2("d"), d, 3), d, 3);
      g += bar(ox + 0.25 * p, oy + sh + 0.2 * p, sh - 0.4 * p, false, level(on2("e"), d, 4), d, 4);
      g += bar(ox + 0.25 * p, oy + 0.2 * p, sh - 0.4 * p, false, level(on2("f"), d, 5), d, 5);
      g += bar(ox + 0.25 * p, oy + sh, sw, true, level(on2("g"), d, 6), d, 6);
      s += el("g", { "data-digit": d + 1, transform: skew }, g);
      if (digits === 4 && d === 1 && props.showColon !== false)
        s += dot(ox + sw + 1 * p, oy + sh * 0.5, colonLevel, { "data-colon": "true" }) + dot(ox + sw + 1 * p, oy + sh * 1.5, colonLevel, { "data-colon": "true" });
      s += dot(ox + sw + 1 * p, oy + 2 * sh, level(!!(props.dp && props.dp[d]), d, 7), { "data-segment": `${d}-7` });
    }
    const pins = [];
    if (names) {
      const tx0 = r2(Math.round((w - (names.top.length - 1) * p) / 2 / p * 2) / 2 * p);
      const bx0 = tx0 + Math.round(((w - (names.bottom.length - 1) * p) / 2 - tx0) / p) * p;
      const row = function(x0, y, list, side) {
        list.forEach((n, i) => {
          if (!named(n)) return;
          s += pin({
            x: x0 + i * p,
            y,
            kind: "leg",
            label: silkName(n),
            side,
            silk: "currentColor",
            size: PIN_LABEL,
            rotate: rot
          });
          pins.push({ name: n, x: x0 + i * p, y });
        });
      };
      names.top.forEach((_, i) => {
        s = wire(tx0 + i * p, pinTop, tx0 + i * p, pinTop + 0.6 * p) + s;
      });
      names.bottom.forEach((_, i) => {
        s = wire(bx0 + i * p, pinTop + 5.8 * p, bx0 + i * p, pinTop + 6 * p) + s;
      });
      row(tx0, pinTop, names.top, "above");
      row(bx0, pinTop + 6 * p, names.bottom, "below");
    } else {
      for (let i = 0; i < digits * 5; i++) {
        s = wire(0.5 * p + i * p, 1 * p, 0.5 * p + i * p, 1.6 * p) + wire(0.5 * p + i * p, 6.8 * p, 0.5 * p + i * p, 7 * p) + s;
        pins.push({ name: `t${i + 1}`, x: 0.5 * p + i * p, y: 1 * p });
        pins.push({ name: `b${i + 1}`, x: 0.5 * p + i * p, y: 7 * p });
      }
    }
    return art(
      w,
      h,
      `${digits}-digit seven-segment display${props.levels || !value.trim() ? "" : ` showing ${value}`}`,
      s,
      pins
    );
  }
  function screenPicture(props, x, y, w, h, ink, colour) {
    const px = props.pixels;
    if (!px || !(px.width > 0) || !(px.height > 0) || !px.data) return "";
    const cw = w / px.width;
    const ch = h / px.height;
    const paths = {};
    const order = [];
    const fill = function(v) {
      return colour && typeof v === "string" ? v : ink;
    };
    for (let row = 0; row < px.height; row++) {
      for (let col = 0; col < px.width; col++) {
        const v = px.data[row * px.width + col];
        if (!v) continue;
        const c = fill(v);
        let run = col;
        while (run + 1 < px.width && px.data[row * px.width + run + 1] && fill(px.data[row * px.width + run + 1]) === c)
          run++;
        if (!(c in paths)) {
          paths[c] = "";
          order.push(c);
        }
        paths[c] += `M${r2(x + col * cw)} ${r2(y + row * ch)}h${r2((run - col + 1) * cw)}v${r2(ch)}h${r2(-(run - col + 1) * cw)}z`;
        col = run;
      }
    }
    const out = order.map((c) => {
      return el("path", { d: paths[c], fill: c, "shape-rendering": "crispEdges" });
    }).join("");
    return out ? el("g", { "data-hook": "picture", "data-width": px.width, "data-height": px.height }, out) : "";
  }
  function flexTab(T, x, y, w, h) {
    return tag(
      "smd",
      rect(x, y, w, h, "#b8792f", Object.assign({ rx: 0.6 }, edge(T, "#8a5a20", T["stroke-fine"]))) + rect(x + 1, y, w - 2, h * 0.45, T["plastic-black"], { rx: 0.4 })
    );
  }
  function oledBreakout(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const names = props.pins || ["DATA", "CLK", "DC", "RST", "CS", "3V3", "VIN", "GND"];
    const maxLen = names.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rotate = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const w = 10.6 * p;
    const h = rotate ? 11 * p : 10.6 * p;
    const gy = rotate ? 2.3 * p : 1.6 * p;
    let s = "";
    s += board({
      width: w,
      height: h,
      finish: fin,
      holes: true,
      mark: { x: w - 2.4 * p, y: h - 1.15 * p, size: 0.6 * p }
    });
    const hdr = header({
      x: r2((w - (names.length - 1) * p) / 2),
      y: 0.6 * p,
      labels: names,
      kind: "pad",
      side: "below",
      silk: f.silk,
      size: PIN_LABEL,
      rotate
    });
    hdr.pins.forEach((pn) => {
      s += trace(T, fin, [
        [pn.x, pn.y],
        [pn.x, gy + 0.6 * p]
      ]);
    });
    const gw = 26.7 * mm;
    const gh = 19.26 * mm;
    const gx = (w - gw) / 2;
    s += flexTab(T, w / 2 - 5 * mm, gy + gh - 0.5, 10 * mm, 0.45 * p + 0.5);
    s += tag("body", rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1 }, edge(T, T["plastic-black-edge"]))));
    s += rect(gx + 1.5, gy + gh - 2.6 * mm - 1.5, gw - 3, 2.6 * mm, T["plastic-black"], { rx: 0.6 });
    s += rect(gx + 1.5, gy + 1.5, gw - 3, 0.6 * mm, "#ffffff", { "fill-opacity": 0.12 });
    const ww = 21.74 * mm;
    const wh = 10.86 * mm;
    const wx = gx + (gw - ww) / 2;
    const wy = gy + 1.4 * mm;
    s += rect(wx, wy, ww, wh, T.glass, { "data-hook": "display", "data-width": 128, "data-height": 64, rx: 0.5 });
    s += screenPicture(props, wx, wy, ww, wh, T["readout-text"]);
    if (props.caption)
      s += text(wx + ww / 2, wy + wh / 2 + 2.4, props.caption, 6.4, T["readout-text"], { "font-weight": 600 });
    s += hdr.svg;
    return art(w, h, `0.96 inch OLED module, ${names.length}-pin`, s, hdr.pins);
  }
  function oledSquare(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const cols = props.columns || 128;
    const rows = props.rows || 128;
    const names = props.pins || ["GND", "VCC", "SCL", "SDA"];
    const w = 34.3 * mm;
    const h = 45.5 * mm;
    let s = "";
    s += board({
      width: w,
      height: h,
      finish: fin,
      holes: false,
      mark: { x: w - 2.6 * p, y: h - 1.05 * p, size: 0.6 * p }
    });
    [
      [2.5, 2.5],
      [31.8, 2.5],
      [2.5, 43],
      [31.8, 43]
    ].forEach((c) => {
      s += tag("hole", circle(c[0] * mm, c[1] * mm, 1.3 * mm, T.hole, edge(T, T.pad, 1)));
    });
    const hdr = header({
      x: r2((w - (names.length - 1) * p) / 2),
      y: 0.6 * p,
      labels: names,
      kind: "pad",
      side: "below",
      silk: f.silk,
      size: PIN_LABEL
    });
    const gw = 31 * mm;
    const gh = 35 * mm;
    const gx = (w - gw) / 2;
    const gy = 1.6 * p;
    const aw = 26.9 * mm;
    const ah = 26.9 * mm;
    hdr.pins.forEach((pn) => {
      s += trace(T, fin, [
        [pn.x, pn.y],
        [pn.x, gy + 0.5 * p]
      ]);
    });
    s += flexTab(T, w / 2 - 5 * mm, gy + gh - 0.5, 10 * mm, 0.5 * p + 0.5);
    s += tag(
      "body",
      rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1, "data-hook": "glass" }, edge(T, T["plastic-black-edge"])))
    );
    s += rect(gx + 1.5, gy + gh - 3.3 * mm - 1.5, gw - 3, 3.3 * mm, T["plastic-black"], { rx: 0.6 });
    s += rect(gx + 1.5, gy + 1.5, gw - 3, 0.6 * mm, "#ffffff", { "fill-opacity": 0.1 });
    const ax = gx + (gw - aw) / 2;
    const ay = gy + 2 * mm;
    s += rect(ax, ay, aw, ah, T.glass, { "data-hook": "display", "data-width": cols, "data-height": rows });
    s += screenPicture(props, ax, ay, aw, ah, T["readout-text"]);
    if (props.caption)
      s += text(ax + aw / 2, ay + ah / 2 + 3, props.caption, 7.5, T["readout-text"], { "font-weight": 600 });
    s += text(4.6 * mm, h - 1.6 * mm, props.label || `${cols}x${rows} OLED`, PIN_LABEL, f.silk, {
      "text-anchor": "start"
    });
    s += hdr.svg;
    return art(w, h, `${cols} x ${rows} OLED module`, s, hdr.pins);
  }
  function tftModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "red";
    const f = finish(T, fin);
    const cap2 = !!props.touch;
    let s = "";
    const names = props.pins || ["VCC", "GND", "CS", "RST", "D/C", "MOSI", "SCK", "LED", "MISO"];
    const G = cap2 ? {
      w: 50,
      h: 86,
      gy: 6.4,
      gh: 69.2,
      ww: 43.2,
      wh: 57.6,
      wx: 3.4,
      wy: 9.3,
      holes: [
        [3, 3],
        [47, 3],
        [3, 79.08],
        [47, 79.08]
      ],
      jx: 8.49
    } : {
      w: 42.72,
      h: 77.18,
      gy: 6.51,
      gh: 60.26,
      ww: 36.72,
      wh: 48.96,
      wx: 3,
      wy: 9.26,
      holes: [
        [3, 3],
        [39.72, 3],
        [3, 70.26],
        [39.72, 70.26]
      ],
      jx: 4.85
    };
    const w = G.w * mm;
    const h = G.h * mm;
    s += board({
      width: w,
      height: h,
      finish: fin,
      holes: false,
      mark: props.mark === false ? void 0 : { x: 10 * mm, y: 3 * mm, size: 0.7 * p }
    });
    G.holes.forEach((c) => {
      s += tag("hole", circle(c[0] * mm, c[1] * mm, 1.5 * mm, T.hole, edge(T, T.pad, 1)));
    });
    const jx = G.jx * mm;
    const jy = h - 2 * mm;
    if (!cap2) {
      for (let k = 0; k < 4; k++) s += barePad(T, (17.23 + k * 2.54) * mm, 2.17 * mm);
      s += text((17.23 + 3 * 2.54) * mm + 2.4 * mm, 2.17 * mm + 1.4, "J4", PIN_LABEL, f.silk);
    }
    s += text(jx - 0.55 * p, jy + 1.4, "J2", PIN_LABEL, f.silk, { "text-anchor": "end" });
    const gx = 0.2 * mm;
    const gy = G.gy * mm;
    const gw = w - 0.4 * mm;
    const gh = G.gh * mm;
    s += flexTab(T, gx + gw / 2 - 9 * mm, gy + gh - 0.5, 18 * mm, 0.5 * p + 0.5);
    s += tag(
      "body",
      rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1, "data-hook": "glass" }, edge(T, T["plastic-black-edge"])))
    );
    const ww = G.ww * mm;
    const wh = G.wh * mm;
    const wx = G.wx * mm;
    const wy = G.wy * mm;
    s += rect(wx, wy, ww, wh, T.glass, { "data-hook": "display", "data-width": 240, "data-height": 320, rx: 0.5 });
    s += rect(gx + 2, gy + gh - 5.6 * mm, gw - 4, 4.2 * mm, T["plastic-black"], { rx: 0.6 });
    s += rect(gx + 2, gy + 1.5, gw - 4, 0.8 * mm, "#ffffff", { "fill-opacity": 0.1 });
    s += screenPicture(props, wx, wy, ww, wh, "#ffffff", true);
    if (props.caption)
      s += text(wx + ww / 2, wy + wh / 2 + 3, props.caption, 7.5, T["readout-text"], { "font-weight": 600 });
    const pins = [];
    for (let i = 0; i < 14; i++) {
      const x = jx + i * p;
      const n = names[i];
      if (typeof n === "string") {
        s += pin({ x, y: jy, kind: "pad", label: n, side: "above", silk: f.silk, size: PIN_LABEL, rotate: true });
        pins.push({ name: n, x, y: jy });
      } else s += barePad(T, x, jy);
    }
    return art(w, h, cap2 ? "2.8 inch TFT module with capacitive touch" : "2.4 inch TFT module", s, pins);
  }
  function nokiaModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "red";
    const f = finish(T, fin);
    const w = 18 * p;
    const h = 18 * p;
    let s = "";
    const names = props.pins || ["RST", "CE", "DC", "DIN", "CLK", "VCC", "BL", "GND"];
    s += board({ width: w, height: h, finish: fin, holes: true, mark: { x: 14.6 * p, y: h - 1.1 * p, size: 0.6 * p } });
    const x0 = r2((w - (names.length - 1) * p) / 2);
    s += rect(x0 - 0.6 * p, 0.7 * p - 0.4 * p, (names.length - 1) * p + 1.2 * p, 0.8 * p, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8,
      rx: 0.4
    });
    names.forEach((n, i) => {
      s += barePad(T, x0 + i * p, 0.7 * p);
    });
    s += rect(x0 - 0.6 * p, h - 0.7 * p - 0.4 * p, (names.length - 1) * p + 1.2 * p, 0.8 * p, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.8,
      rx: 0.4
    });
    s += rect(x0 - 0.45 * p, h - 1.15 * p, 0.9 * p, 0.9 * p, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.9
    });
    const hdr = header({
      x: x0,
      y: h - 0.7 * p,
      labels: names,
      kind: "pad",
      side: "above",
      silk: f.silk,
      size: PIN_LABEL
    });
    s += smd(T, "capacitor", 1.5 * p, 0.45 * p, true) + text(1.5 * p, 0.35 * p, "C1", PIN_LABEL, f.silk, { "text-anchor": "start" });
    s += smd(T, "resistor", w - 2.4 * p, 0.45 * p, true) + text(w - 2.4 * p, 0.35 * p, "D1", PIN_LABEL, f.silk, { "text-anchor": "start" });
    const gw = 40 * mm;
    const gh = 34 * mm;
    const fr = 1.2 * mm;
    const gx = (w - gw) / 2;
    const gy = 1.9 * p + fr;
    [0.25, 0.75].forEach((q) => {
      const ty = gy + gh * q - 0.5 * p;
      s += tag(
        "smd",
        rect(
          gx - fr - 0.25 * p,
          ty,
          0.25 * p + 1,
          p,
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T["metal-edge"], T["stroke-fine"]))
        ) + rect(
          gx + gw + fr - 1,
          ty,
          0.25 * p + 1,
          p,
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T["metal-edge"], T["stroke-fine"]))
        )
      );
    });
    s += tag(
      "body",
      rect(gx - fr, gy - fr, gw + 2 * fr, gh + 2 * fr, T.metal, Object.assign({ rx: 1.4 }, edge(T, T["metal-edge"])))
    );
    s += bevel(T, gx - fr, gy - fr, gw + 2 * fr, gh + 2 * fr, 1.4, 1.4);
    s += rect(
      gx,
      gy,
      gw,
      gh,
      "#c9d3bd",
      Object.assign({ "data-hook": "glass", rx: 0.8 }, edge(T, "#8d9a85", T["stroke-fine"]))
    );
    s += rect(gx + 1.2 * mm, gy + gh - 5 * mm, gw - 2.4 * mm, 3.4 * mm, "#2a2f33", { rx: 0.6, "fill-opacity": 0.55 });
    const dw = 30 * mm;
    const dh = 20 * mm;
    const dx = gx + (gw - dw) / 2;
    const dy = gy + 4.6 * mm;
    s += rect(dx, dy, dw, dh, "none", { "data-hook": "display", "data-width": 84, "data-height": 48 });
    s += screenPicture(props, dx, dy, dw, dh, "#1c2a1a");
    if (props.caption) s += text(dx + dw / 2, dy + dh / 2 + 2.6, props.caption, 6.8, "#1c2a1a", { "font-weight": 700 });
    s += text(1.2 * p, h - 0.6 * p, props.label || "PCD8544 84x48", PIN_LABEL, f.silk, { "text-anchor": "start" });
    s += hdr.svg;
    return art(w, h, "PCD8544 84 x 48 graphic LCD module", s, hdr.pins);
  }
  function epaperModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const M = function(v) {
      return v * mm;
    };
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = M(89.5);
    const h = M(38);
    let s = "";
    const names = props.pins || ["BUSY", "RST", "DC", "CS", "CLK", "DIN", "GND", "VCC"];
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: M(84.7), y: M(30.2), size: 0.7 * p } });
    [
      [M(2.5), M(2.5)],
      [M(2.5), M(35.5)],
      [M(87.5), M(2.5)],
      [M(87.5), M(35.5)]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], M(1.5), T.hole, edge(T, T.pad, 1)));
    });
    const pw = M(79);
    const ph = M(36.7);
    const px = M(5);
    const py = (h - ph) / 2;
    s += tag(
      "smd",
      rect(M(0.6), M(10.5), M(4.8), M(16.5), "#b8792f", Object.assign({ rx: 0.8 }, edge(T, "#8a5a20", T["stroke-fine"])))
    );
    s += tag(
      "body",
      rect(px, py, pw, ph, "#d9d7cf", Object.assign({ rx: 1 }, edge(T, T["metal-edge"], T["stroke-fine"])))
    );
    s += rect(px + M(0.4), py + M(0.4), M(3.4), ph - M(0.8), "#efeee8", { rx: 0.6 }) + rect(px + M(1.6), h / 2 - M(4), M(1), M(8), T.chip, { rx: 0.3 });
    s += rect(px + M(4.2), py + M(0.6), pw - M(4.8), ph - M(1.2), "#f2f0ea", { "data-hook": "paper", rx: 0.8 });
    const dw = M(66.89);
    const dh = M(29.05);
    const dx = px + pw - M(2.3) - dw;
    const dy = (h - dh) / 2;
    s += rect(dx, dy, dw, dh, "#f2f0ea", { "data-hook": "display", "data-width": 296, "data-height": 128 });
    s += screenPicture(props, dx, dy, dw, dh, "#1a1a1a");
    if (props.caption) s += text(dx + dw / 2, dy + dh / 2 + 2.8, props.caption, 7.5, "#1a1a1a", { "font-weight": 700 });
    const hdr = header({
      x: M(88.2),
      y: h / 2 - (names.length - 1) * p / 2,
      axis: "y",
      labels: names,
      kind: "pad",
      side: "left",
      silk: f.silk,
      size: PIN_LABEL
    });
    s += hdr.svg;
    return art(w, h, "2.9 inch 296 x 128 e-paper module", s, hdr.pins);
  }
  function max7219Matrix(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    let fin = "blue";
    let f = finish(T, fin);
    const chain = Math.max(1, Math.min(32, Math.floor(Number(props.chain) || 1)));
    const face = 32 * mm;
    let w = (Math.ceil(12.6 * chain) + 5) * p;
    let h = 13 * p;
    let s = "";
    const on2 = lensColor(T, props.color || "red");
    const off = T["indicator-off-light"];
    const lit2 = props.lit || [];
    const pins = [];
    const wells = function(fx, fy, k) {
      let g = rect(
        fx,
        fy,
        face,
        face,
        T["segment-face"],
        Object.assign(
          { rx: 1.2, "data-hook": `face-${k}`, "data-rows": 8, "data-cols": 8 },
          edge(T, T["plastic-black-edge"], T["stroke-fine"])
        )
      );
      const pitch = 3.8 * mm;
      const ox = fx + (face - 7 * pitch) / 2;
      const oy = fy + (face - 7 * pitch) / 2;
      const rowsLit = lit2[k] || [];
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
          const isOn = String(rowsLit[r] || "")[c] === "1";
          const cx = ox + c * pitch;
          const cy = oy + r * pitch;
          g += circle(cx, cy, 1.5 * mm, isOn ? on2 : off, {
            "data-led": `${k}-${r}-${c}`,
            "data-lit": isOn ? "true" : "false"
          });
          g += circle(cx, cy, 0.8 * mm, isOn ? "#ffffff" : T["plastic-white-edge"], {
            "fill-opacity": isOn ? 0.55 : 0.35
          });
        }
      return tag("body", g);
    };
    if (chain === 1) {
      fin = "green";
      f = finish(T, fin);
      w = 13 * p;
      h = 22 * p;
      s = "";
      const inOrder = ["CLK", "CS", "DIN", "GND", "V+"];
      const outOrder = ["CLK.2", "CS.2", "DOUT", "GND.2", "V+.2"];
      const x0 = 4.5 * p;
      const at = {};
      s += board({
        width: w,
        height: 20 * p,
        y: 1 * p,
        finish: fin,
        holes: "top",
        mark: { x: 1.2 * p, y: 2.6 * p, size: 0.7 * p }
      });
      inOrder.forEach((n, i) => {
        const x = x0 + i * p;
        s += tag(
          "leg",
          rect(x - 1.45, 0, 2.9, 1 * p, T["lead-edge"], { rx: 0.6 }) + rect(x - 0.95, 0, 1.9, 1 * p, T.lead, { rx: 0.5 })
        );
        s += pin({ x, y: 1 * p, kind: "leg", label: n, side: "below", rotate: true, silk: f.silk, size: PIN_LABEL });
        s += tag(
          "leg",
          rect(x - 1.45, 21 * p, 2.9, 1 * p, T["lead-edge"], { rx: 0.6 }) + rect(x - 0.95, 21 * p, 1.9, 1 * p, T.lead, { rx: 0.5 })
        );
        s += text(x, 20.65 * p, outOrder[i].replace(".2", ""), PIN_LABEL, f.silk);
        at[n] = { x, y: 1 * p };
        at[outOrder[i]] = { x, y: 21 * p };
      });
      s += dipOnBoard(T, 0.5 * p, 5.6 * p, 12, "MAX7219");
      s += wells(0.2 * p, 20 * p - face, 0);
      ["V+", "GND", "DIN", "CS", "CLK", "V+.2", "GND.2", "DOUT", "CS.2", "CLK.2"].forEach((n) => {
        pins.push({ name: n, x: at[n].x, y: at[n].y });
      });
      return art(w, h, "1 x MAX7219 8x8 LED matrix", s, pins);
    }
    const bw = chain * face;
    const i0 = T["board-inset"];
    w = Math.ceil((bw + 4 * mm) / p) * p;
    h = face;
    const ext = (w - bw) / 2;
    s += tag(
      "board",
      rect(ext + i0, i0, bw - 2 * i0, h - 2 * i0, f.board, Object.assign({ rx: T["radius-board"] }, edge(T, f.edge)))
    );
    const inNames = ["V+", "GND", "DIN", "CS", "CLK"];
    const outNames = ["V+.2", "GND.2", "DOUT", "CS.2", "CLK.2"];
    for (let i = 0; i < 5; i++) {
      const y = h / 2 + (i - 2) * p;
      s += tag(
        "leg",
        rect(w - ext - 2 * mm, y - 1.45, ext + 2 * mm, 2.9, T["lead-edge"], { rx: 0.6 }) + rect(w - ext - 2 * mm, y - 0.95, ext + 2 * mm, 1.9, T.lead, { rx: 0.5 })
      );
      s += tag(
        "leg",
        rect(0, y - 1.45, ext + 2 * mm, 2.9, T["lead-edge"], { rx: 0.6 }) + rect(0, y - 0.95, ext + 2 * mm, 1.9, T.lead, { rx: 0.5 })
      );
      pins.push({ name: inNames[i], x: w, y });
    }
    for (let k = 0; k < chain; k++) s += wells(ext + (chain - 1 - k) * face, 0, k);
    outNames.forEach((n, i) => {
      pins.push({ name: n, x: 0, y: h / 2 + (i - 2) * p });
    });
    return art(w, h, `${chain} x MAX7219 8x8 LED matrix`, s, pins);
  }
  function tm1637Module(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const bw = 42 * mm;
    const w = bw + p;
    const h = 24 * mm;
    let s = "";
    const color = lensColor(T, props.color || "red");
    const value = String(props.value === void 0 ? "" : props.value);
    const dp = props.type === "dp";
    const off = T["indicator-off-light"];
    s += board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 1.3 * p, y: h / 2, size: 0.7 * p } });
    [
      [2.5 * mm, 2.5 * mm],
      [2.5 * mm, h - 2.5 * mm]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const names = props.pins || ["CLK", "DIO", "VCC", "GND"];
    const pins = [];
    names.forEach((n, i) => {
      const y = h / 2 + (i - 1.5) * p;
      s += trace(T, fin, [
        [bw - 1 * p, y],
        [bw - 2.4 * p, y],
        [bw - 3 * p, y - 0.4 * p]
      ]);
      s += tag(
        "leg",
        rect(bw - 1 * p, y - 1.45, 2 * p, 2.9, T["lead-edge"], { rx: 0.6 }) + rect(bw - 1 * p, y - 0.95, 2 * p, 1.9, T.lead, { rx: 0.5 })
      ) + text(bw - 1.15 * p, y + 1.4, n, PIN_LABEL, f.silk, { "text-anchor": "end" });
      pins.push({ name: n, x: w, y });
    });
    const fw = 30 * mm;
    const fh = 14 * mm;
    const fx = 2.5 * p;
    const fy = (h - fh) / 2;
    const rim = 0.3 * p;
    s += tag(
      "body",
      rect(fx, fy, fw, fh, T["plastic-white"], Object.assign({ rx: 1.2 }, edge(T, T["plastic-white-edge"])))
    );
    s += bevel(T, fx, fy, fw, fh, 1.4, 1.2);
    s += rect(fx + rim, fy + rim, fw - 2 * rim, fh - 2 * rim - 0.25 * p, T["segment-face"], { rx: 0.8 });
    s += text(fx + fw - rim - 1.5, fy + fh - 0.1 * p, "3642BS", PIN_LABEL, T["plastic-white-edge"], {
      "text-anchor": "end",
      "fill-opacity": 0.9
    });
    const sw = 1.35 * p;
    const sh = 1.35 * p;
    const cell = 2.7 * p;
    const t = 0.3 * p;
    const bar = function(x, y, len, horizontal, on2, d, sgm) {
      return rect(
        horizontal ? x : x - t / 2,
        horizontal ? y - t / 2 : y,
        horizontal ? len : t,
        horizontal ? t : len,
        on2 ? color : off,
        { rx: t / 2, "fill-opacity": on2 ? 1 : 0.6, "data-segment": `${d}-${sgm}`, "data-lit": on2 ? "true" : "false" }
      );
    };
    const oy = fy + 1.1 * p;
    for (let d = 0; d < 4; d++) {
      const litSeg = SEG_OF[value[d] === void 0 ? " " : value[d]] || "";
      const ox = fx + 0.9 * p + d * cell + (d >= 2 ? 0.5 * p : 0);
      let g = "";
      g += bar(ox + 0.2 * p, oy, sw, true, litSeg.indexOf("a") >= 0, d, 0);
      g += bar(ox + sw + 0.2 * p, oy + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf("b") >= 0, d, 1);
      g += bar(ox + sw + 0.2 * p, oy + sh + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf("c") >= 0, d, 2);
      g += bar(ox + 0.2 * p, oy + 2 * sh, sw, true, litSeg.indexOf("d") >= 0, d, 3);
      g += bar(ox + 0.2 * p, oy + sh + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf("e") >= 0, d, 4);
      g += bar(ox + 0.2 * p, oy + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf("f") >= 0, d, 5);
      g += bar(ox + 0.2 * p, oy + sh, sw, true, litSeg.indexOf("g") >= 0, d, 6);
      s += el("g", { "data-digit": d + 1, transform: `skewX(-10) translate(${r2((oy + sh) * 0.176)} 0)` }, g);
      if (dp) {
        const pon = !!(props.dp && props.dp[d]);
        s += circle(ox + sw + 0.75 * p, oy + 2 * sh, 0.17 * p, pon ? color : off, {
          "fill-opacity": pon ? 1 : 0.6,
          "data-segment": `${d}-7`,
          "data-lit": pon ? "true" : "false"
        });
      }
    }
    if (!dp) {
      const cx = fx + 0.9 * p + 2 * cell + 0.05 * p;
      const con = !!props.colon;
      s += circle(cx, oy + sh * 0.55, 0.19 * p, con ? color : off, {
        "fill-opacity": con ? 1 : 0.6,
        "data-colon": "true",
        "data-lit": con ? "true" : "false"
      }) + circle(cx, oy + sh * 1.45, 0.19 * p, con ? color : off, {
        "fill-opacity": con ? 1 : 0.6,
        "data-colon": "true",
        "data-lit": con ? "true" : "false"
      });
    }
    s += smd(T, "capacitor", 15 * p, 1 * p, true) + smd(T, "resistor", 15 * p, h - 1.6 * p, true) + via(T, 1.6 * p, h / 2 + 1.1 * p);
    s += text(fx + fw / 2, h - 0.5 * p, props.label || "4-DIGIT DISPLAY", PIN_LABEL, f.silk);
    return art(w, h, `TM1637 4-digit display${value ? ` showing ${value}` : ""}`, s, pins);
  }
  function screen(props, own) {
    props = props || {};
    return Object.assign({ caption: props.caption, pixels: props.pixels }, own);
  }
  function ssd1306Module(props) {
    return oledBreakout(screen(props, { pins: ["GND", "VCC", "SCL", "SDA"] }));
  }
  function sh1107Module(props) {
    return oledSquare(screen(props, { label: "SH1107 128x128", pins: ["GND", "VCC", "SCL", "SDA"] }));
  }
  function ili9341TouchDisplay(props) {
    return tftModule(
      screen(props, {
        touch: true,
        pins: ["VCC", "GND", "CS", "RST", "D/C", "MOSI", "SCK", "LED", "MISO", "SCL", null, "SDA"]
      })
    );
  }
  var SEG_OF;
  var init_displays = __esm({
    "src/displays.js"() {
      init_core();
      init_pieces();
      SEG_OF = {
        0: "abcdef",
        1: "bc",
        2: "abdeg",
        3: "abcdg",
        4: "bcfg",
        5: "acdfg",
        6: "acdefg",
        7: "abc",
        8: "abcdefg",
        9: "abcdfg",
        "-": "g",
        " ": "",
        A: "abcefg",
        b: "cdefg",
        C: "adef",
        d: "bcdeg",
        E: "adefg",
        F: "aefg",
        H: "bcefg",
        L: "def",
        P: "abefg",
        o: "cdeg",
        r: "eg",
        U: "bcdef"
      };
    }
  });

  // src/pixels.js
  function pixelColor(T, c) {
    if (typeof c === "string" && c) return { fill: c, level: 1 };
    if (c && typeof c === "object") {
      const ch = ["r", "g", "b"].map((k) => {
        const v = Number(c[k]);
        return isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
      });
      const level = Math.max(ch[0], ch[1], ch[2]);
      if (level > 0.02) {
        const hx = function(v) {
          const n = Math.round(v * 255).toString(16);
          return (n.length < 2 ? "0" : "") + n;
        };
        return { fill: `#${hx(ch[0] / level)}${hx(ch[1] / level)}${hx(ch[2] / level)}`, level };
      }
    }
    return { fill: T["indicator-off"], level: 0 };
  }
  function pixelPackage(T, x, y, hook, c, size) {
    const mm = T.pitch / 2.54;
    const k = (size || 5) / 5;
    const h = 2.5 * mm * k;
    const pc = pixelColor(T, c);
    let s = "";
    const die = function(dx, fill) {
      return rect(x + dx * k, y - 0.35 * mm * k, 0.6 * mm * k, 0.7 * mm * k, T[fill], { "fill-opacity": 0.55 });
    };
    s += tag("glow", circle(x, y, 3.2 * mm * k, pc.fill, { "fill-opacity": r2(T["opacity-glow"] * pc.level) }));
    s += tag(
      "body",
      rect(
        x - h,
        y - h,
        2 * h,
        2 * h,
        T["plastic-white"],
        Object.assign({ rx: 0.4 * mm * k }, edge(T, T["plastic-white-edge"], T["stroke-fine"]))
      ) + circle(x, y, 1.6 * mm * k, T["plastic-white-edge"], { "fill-opacity": 0.5 }) + die(-1.05 * mm, "lens-red") + die(-0.3 * mm, "lens-green") + die(0.45 * mm, "lens-blue") + circle(x, y, 1.75 * mm * k, pc.fill, {
        "data-hook": hook,
        "data-level": r2(pc.level),
        "fill-opacity": pc.level > 0 ? r2(0.55 + 0.45 * pc.level) : 0
      }) + circle(x, y, 1.6 * mm * k, sheen("lens"), { "fill-opacity": 0.6 })
    );
    return s;
  }
  function pixel5050(T, x, y, hook, c) {
    return pixelPackage(T, x, y, hook, c, 5);
  }
  function neopixel(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 3 * p;
    const h = 2 * p;
    let s = "";
    const pins = [
      { name: "VDD", x: 0.5 * p, y: 0.5 * p },
      { name: "DIN", x: 2.5 * p, y: 0.5 * p },
      { name: "DOUT", x: 0.5 * p, y: 1.5 * p },
      { name: "VSS", x: 2.5 * p, y: 1.5 * p }
    ];
    pins.forEach((pn) => {
      s += tag("pin", rect(pn.x - 2.4, pn.y - 1.8, 4.8, 3.6, T.pad, { rx: 0.4 }));
    });
    s += pixel5050(T, 1.5 * p, 1 * p, "pixel", props.color || props);
    s += path(`M${r2(0.5 * p - 2.4)} ${r2(0.5 * p - 1.8)}l3 3`, "none", {
      stroke: T["plastic-black-edge"],
      "stroke-width": T["stroke-fine"]
    });
    return art(w, h, `NeoPixel${pixelColor(T, props.color || props).level ? ", lit" : ""}`, s, pins);
  }
  function ledRing(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const f = finish(T, "black");
    const n = Math.max(1, Math.min(1024, Math.floor(Number(props.pixels)) || 16));
    const colors = props.colors || [];
    const OD = { 8: 29.7, 12: 36.8, 16: 44.5, 24: 65.5 }[n] || Math.max(18, n * 2.75 + 0.5);
    const R = OD / 2 * mm;
    const Ri = R - 6.4 * mm;
    const pitchR = R - 3.2 * mm;
    const w = Math.ceil((2 * R + 1.2 * p) / p) * p;
    const cx = w / 2;
    const cy = 0.6 * p + R;
    const h = cy + R + 2.2 * p;
    let s = "";
    const ring = `M${r2(cx - R)} ${r2(cy)}a${r2(R)} ${r2(R)} 0 1 0 ${r2(2 * R)} 0a${r2(R)} ${r2(R)} 0 1 0 ${r2(-2 * R)} 0zM${r2(cx - Ri)} ${r2(cy)}a${r2(Ri)} ${r2(Ri)} 0 1 0 ${r2(2 * Ri)} 0a${r2(Ri)} ${r2(Ri)} 0 1 0 ${r2(-2 * Ri)} 0z`;
    s += tag(
      "board",
      path(ring, f.board, { "fill-rule": "evenodd", stroke: f.edge, "stroke-width": T["stroke-outline"] })
    );
    s += tag(
      "board",
      rect(
        cx - 2.4 * p,
        cy + R - 1.2 * p,
        4.8 * p,
        1.2 * p + 1.6 * p,
        f.board,
        Object.assign({ rx: 1 }, edge(T, f.edge))
      )
    );
    for (let i = 0; i < n; i++) {
      const deg = -90 + i * 360 / n;
      const a = deg * Math.PI / 180;
      const px = r2(cx + Math.cos(a) * pitchR);
      const py = r2(cy + Math.sin(a) * pitchR);
      s += el("g", { transform: `rotate(${r2(deg + 90)} ${px} ${py})` }, pixel5050(T, px, py, `px-${i + 1}`, colors[i]));
    }
    const hdr = header({
      x: cx - 1.5 * p,
      y: h - 0.6 * p,
      labels: props.pins || ["GND", "VCC", "DIN", "DOUT"],
      kind: "pad",
      side: "above",
      silk: f.silk,
      size: PIN_LABEL,
      rotate: true
    });
    s += hdr.svg;
    return art(w, h, `${n}-pixel LED ring`, s, hdr.pins);
  }
  function ledStrip(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const n = Math.max(1, Math.min(LED_STRIP_MAX_PIXELS, Math.floor(Number(props.pixels) || 8)));
    const kind = STRIP_SIZES[props.pixelSize] || STRIP_SIZES["5050"];
    const step = kind.step * p;
    const k = kind.size / 5;
    const round2 = props.pixelShape === "round" || props.pixelShape === "circle";
    const w = Math.ceil((4.8 * p + n * step) / p) * p;
    const h = 4 * p;
    let s = "";
    const colors = props.colors || [];
    s += tag(
      "board",
      rect(
        T["board-inset"],
        T["board-inset"],
        w - 2 * T["board-inset"],
        h - 2 * T["board-inset"],
        T["plastic-black"],
        Object.assign({ rx: 1.5 }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += bevel(T, T["board-inset"], T["board-inset"], w - 2 * T["board-inset"], h - 2 * T["board-inset"], 1.6);
    const inNames = ["VDD", "DIN", "VSS"];
    const outNames = ["VDD", "DOUT", "VSS"];
    const pins = [];
    [0, 1, 2].forEach((i) => {
      const y = (i + 1) * p;
      s += tag("pad", rect(0, y - 0.3 * p, 0.9 * p, 0.6 * p, T.pad, { rx: 1 })) + text(1.1 * p, y + 1.4, inNames[i], PIN_LABEL, T.silk, { "text-anchor": "start" });
      s += tag("pad", rect(w - 0.9 * p, y - 0.3 * p, 0.9 * p, 0.6 * p, T.pad, { rx: 1 })) + text(w - 1.1 * p, y + 1.4, outNames[i], PIN_LABEL, T.silk, { "text-anchor": "end" });
      pins.push({ name: inNames[i], x: 0, y });
    });
    for (let i = 0; i < n; i++) {
      const cx = (w - n * step) / 2 + (i + 0.5) * step;
      const cy = 2 * p;
      const c = colors[i] || null;
      const pc = pixelColor(T, c);
      let g = "";
      if (round2) {
        g += tag("glow", circle(cx, cy, 3.4 * mm * k, pc.fill, { "fill-opacity": r2(T["opacity-glow"] * pc.level) }));
        g += tag(
          "body",
          circle(cx, cy, 2.6 * mm * k, T["plastic-white"], edge(T, T["plastic-white-edge"], T["stroke-fine"])) + circle(cx, cy, 1.75 * mm * k, pc.fill, {
            "data-hook": `px-${i}`,
            "data-level": r2(pc.level),
            "fill-opacity": pc.level > 0 ? r2(0.55 + 0.45 * pc.level) : 0
          })
        );
      } else g += pixelPackage(T, cx, cy, `px-${i}`, c, kind.size);
      s += el("g", { "data-pixel": i, "data-lit": pc.level > 0 ? "true" : "false" }, g);
      if (i < n - 1) {
        const xb = cx + step / 2;
        if (step >= 3 * p) {
          s += path(`M${r2(xb)} ${r2(T["board-inset"] + 1)}V${r2(h - T["board-inset"] - 1)}`, "none", {
            stroke: T.silk,
            "stroke-width": T["stroke-fine"],
            "stroke-opacity": 0.5,
            "stroke-dasharray": "1.2 1.2"
          });
          [1, 2, 3].forEach((q) => {
            s += tag(
              "pad",
              rect(xb - 0.5 * p, q * p - 0.25 * p, 0.3 * p, 0.5 * p, T.pad, { rx: 0.6 }) + rect(xb + 0.2 * p, q * p - 0.25 * p, 0.3 * p, 0.5 * p, T.pad, { rx: 0.6 })
            );
          });
        } else
          s += path(
            `M${r2(xb - 1.6 * k)} ${r2(cy - 1.4 * k)}l${r2(1.6 * k)} ${r2(1.4 * k)}l${r2(-1.6 * k)} ${r2(1.4 * k)}`,
            "none",
            { stroke: T.silk, "stroke-width": 0.6, "stroke-opacity": 0.6 }
          );
      }
    }
    pins.push({ name: "VDD.2", x: w, y: p }, { name: "DOUT", x: w, y: 2 * p }, { name: "VSS.2", x: w, y: 3 * p });
    return art(w, h, `${n}-pixel WS2812 strip`, s, pins);
  }
  function formatMilliamps(amps) {
    const ma = (Number(amps) || 0) * 1e3;
    return `${ma >= 10 ? Math.round(ma) : Math.round(ma * 10) / 10} mA`;
  }
  function meterLines(props) {
    props = props || {};
    if (!props.status || props.status === "idle") return ["-- FPS", "Connect DIN to a WS2812 data line", ""];
    return [
      `${Number(props.fps) || 0} FPS · ${Number(props.pixels) || 0} px`,
      `${formatMilliamps(props.amps)} · ${(Number(props.watts) || 0).toFixed(2)} W`,
      `peak ${formatMilliamps(props.peakAmps)} of ${Number(props.limitAmps) || 0} A`
    ];
  }
  function neopixelMeter(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 20 * p;
    const h = 7 * p;
    let s = "";
    const status = { ok: 1, near: 1, over: 1 }[props.status] ? props.status : "idle";
    const lines = meterLines(props);
    const tone = status === "idle" ? T["readout-dim"] : T[`status-${status}`];
    const limit = Number(props.limitAmps) || 0;
    const share = status === "idle" || !(limit > 0) ? 0 : Math.max(0, Math.min(1, (Number(props.peakAmps) || 0) / limit));
    s += line(0, 2 * p, 1.4 * p, 2 * p, T["lead-edge"], 2.9) + line(0, 2 * p, 1.4 * p, 2 * p, T.lead, 1.9);
    s += tag(
      "body",
      rect(
        1.2 * p,
        0.5 * p,
        w - 1.7 * p,
        h - 1 * p,
        T["plastic-black"],
        Object.assign({ rx: 3 }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += rect(1.2 * p + 1.5, 0.5 * p + 1.5, w - 1.7 * p - 3, 2.2, "#ffffff", { rx: 1, "fill-opacity": 0.08 });
    const rx = 2.2 * p;
    const ry = 1.2 * p;
    const rw = w - 4.4 * p;
    const rh = h - 2.4 * p;
    s += rect(rx, ry, rw, rh, T.readout, { rx: 2 });
    let g = circle(rx + rw - 0.6 * p, ry + 0.6 * p, 0.25 * p, tone, { "data-lamp": status });
    g += text(rx + 0.6 * p, ry + 1.05 * p, lines[0], 5.2, T["readout-text"], {
      "text-anchor": "start",
      "font-weight": 600
    });
    g += text(
      rx + 0.6 * p,
      ry + 2.2 * p,
      lines[1],
      lines[2] ? 5.2 : PIN_LABEL,
      status === "idle" ? T["readout-dim"] : T["readout-text"],
      { "text-anchor": "start" }
    );
    if (lines[2]) g += text(rx + 0.6 * p, ry + 3.3 * p, lines[2], PIN_LABEL, tone, { "text-anchor": "start" });
    s += el(
      "g",
      {
        "data-status": status,
        "data-fps": Number(props.fps) || 0,
        "data-pixels": Number(props.pixels) || 0,
        "data-amps": r2(Number(props.amps) || 0)
      },
      g
    );
    s += rect(rx + 0.6 * p, ry + rh - 0.55 * p, rw - 1.2 * p, 0.2 * p, T["readout-text"], {
      rx: 1,
      "fill-opacity": 0.25
    });
    s += rect(rx + 0.6 * p, ry + rh - 0.55 * p, r2((rw - 1.2 * p) * share), 0.2 * p, tone, { rx: 1 });
    s += text(w - 1.6 * p, h - 0.75 * p, "DIN", PIN_LABEL, T.silk, { "text-anchor": "end", "fill-opacity": 0.8 }) + text(2.2 * p, h - 0.75 * p, "PIXEL METER", PIN_LABEL, T.silk, { "text-anchor": "start", "fill-opacity": 0.8 });
    return art(w, h, `NeoPixel meter: ${lines.filter(Boolean).join(", ")}`, s, [{ name: "DIN", x: 0, y: 2 * p }]);
  }
  function ledBarGraph(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const n = 10;
    const values = props.levels || [];
    const colors = props.colors || [];
    const colorOf = function(k) {
      return lensColor(T, colors[k] || props.color || "red");
    };
    const w = 11 * p;
    const h = 5 * p;
    const cy = 2.5 * p;
    let s = "";
    const pins = [];
    for (let i = 0; i < n; i++) pins.push({ name: `A${i + 1}`, x: (i + 1) * p, y: 1 * p });
    for (let j = 0; j < n; j++) pins.push({ name: `K${j + 1}`, x: (j + 1) * p, y: 4 * p });
    const bx0 = 0.5 * p;
    const by0 = 0.8 * p;
    const bw = 10 * p;
    const bh = 3.4 * p;
    for (let q = 0; q < n; q++) {
      const lx = (q + 1) * p;
      [
        [0.45 * p, by0],
        [by0 + bh, 4.55 * p]
      ].forEach((seg) => {
        s += tag(
          "leg",
          rect(lx - 1.45, seg[0], 2.9, seg[1] - seg[0], T["lead-edge"], { rx: 0.6 }) + rect(lx - 0.95, seg[0], 1.9, seg[1] - seg[0], T.lead, { rx: 0.5 })
        );
      });
    }
    s += tag(
      "body",
      rect(bx0, by0, bw, bh, T["plastic-white"], Object.assign({ rx: 1 }, edge(T, T["plastic-white-edge"])))
    );
    s += bevel(T, bx0, by0, bw, bh, 1.6, 1);
    const mm = p / 2.54;
    const bp = 2.2 * mm;
    const bwid = 1.6 * mm;
    const bht = 2 * p;
    s += rect(bx0 + 1.2 * mm, by0 + 0.38 * p, bw - 2.4 * mm, bh - 0.76 * p, T["segment-face"], { rx: 0.8 });
    for (let k = 0; k < n; k++) {
      const lv = Math.max(0, Math.min(1, Number(values[k]) || 0));
      const bx = w / 2 + (k - (n - 1) / 2) * bp;
      s += rect(bx - bwid / 2, cy - bht / 2, bwid, bht, T["indicator-off-light"], { rx: 1, "fill-opacity": 0.75 });
      s += rect(bx - bwid / 2, cy - bht / 2, bwid, bht, colorOf(k), {
        "data-hook": `bar-${k + 1}`,
        "data-level": r2(lv),
        rx: 1,
        "fill-opacity": lv > 0 ? r2(T["opacity-segment-dim"] + (1 - T["opacity-segment-dim"]) * lv) : 0
      });
    }
    s += rect(bx0 + 0.9 * mm, by0 + 0.08 * p, 0.3 * p, 0.3 * p, T["plastic-white-edge"], {
      rx: 0.4,
      "fill-opacity": 0.9
    });
    if (props.vertical)
      return art(
        h,
        w,
        "LED bar graph",
        el("g", { transform: "matrix(0 1 1 0 0 0)" }, s),
        pins.map((q) => {
          return { name: q.name, x: q.y, y: q.x };
        })
      );
    return art(w, h, "LED bar graph", s, pins);
  }
  function neopixelMatrix(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const f = finish(T, "black");
    const rows = Math.max(1, Math.min(1024, Math.floor(Number(props.rows)) || 8));
    const cols = Math.max(1, Math.min(1024, Math.floor(Number(props.cols)) || 8));
    const colors = props.colors || [];
    const pitch = 3.5 * p;
    const w = cols * pitch;
    const h = rows * pitch;
    const x0 = pitch / 2;
    const y0 = pitch / 2;
    let s = "";
    const names = props.pins || ["GND", "VCC", "DIN", "DOUT"];
    s += board({
      width: w,
      height: h,
      finish: "black",
      holes: false,
      mark: { x: w / 2 + 1.2 * p, y: y0 + Math.max(0, rows - 2) * pitch + pitch / 2 - 0.35 * p, size: 0.7 * p }
    });
    const gapTop = rows > 1 ? y0 + pitch / 2 : h;
    const gapBottom = rows > 1 ? y0 + (rows - 1.5) * pitch : h;
    if (rows >= 6 && cols >= 6)
      [
        [cols / 2 - 1.5, 0.5],
        [cols / 2 + 1.5, 0.5],
        [cols / 2 - 1.5, rows / 2 - 0.5],
        [cols / 2 + 1.5, rows / 2 - 0.5],
        [cols / 2 - 1.5, rows - 1.5],
        [cols / 2 + 1.5, rows - 1.5]
      ].forEach((c) => {
        s += tag("hole", circle(x0 + c[0] * pitch, y0 + c[1] * pitch, T["mount-hole-radius"], T.hole, edge(T, T.pad)));
      });
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cx = x0 + c * pitch;
        const cy = y0 + r * pitch;
        s += pixel5050(T, cx, cy, `px-${r * cols + c + 1}`, colors[r * cols + c]);
        s += tag(
          "smd",
          rect(cx + 1.2 * p, cy - 0.22 * p, 0.28 * p, 0.44 * p, T["cap-ceramic"], { rx: 0.3 }) + rect(cx + 1.2 * p, cy - 0.22 * p, 0.28 * p, 0.09 * p, T.lead) + rect(cx + 1.2 * p, cy + 0.13 * p, 0.28 * p, 0.09 * p, T.lead)
        );
      }
    const pins = [];
    [0, 1, 2].forEach((i) => {
      s += pin({
        x: (0.5 + i) * p,
        y: gapTop,
        kind: "pad",
        label: names[i],
        side: "below",
        silk: f.silk,
        size: PIN_LABEL
      });
      pins.push({ name: names[i], x: (0.5 + i) * p, y: gapTop });
    });
    s += barePad(T, w - 2.5 * p, gapBottom) + barePad(T, w - 1.5 * p, gapBottom);
    s += pin({
      x: w - 0.5 * p,
      y: gapBottom,
      kind: "pad",
      label: names[3],
      side: "below",
      silk: f.silk,
      size: PIN_LABEL
    });
    pins.push({ name: names[3], x: w - 0.5 * p, y: gapBottom });
    if (cols >= 6) s += text(w / 2, y0 + (rows / 2 - 0.5) * pitch + 1.4, `${rows} x ${cols} RGB`, PIN_LABEL, f.silk);
    return art(w, h, `${rows} x ${cols} NeoPixel matrix`, s, pins);
  }
  var LED_STRIP_MAX_PIXELS, STRIP_SIZES;
  var init_pixels = __esm({
    "src/pixels.js"() {
      init_core();
      init_pieces();
      LED_STRIP_MAX_PIXELS = 1024;
      STRIP_SIZES = { 5050: { step: 3, size: 5 }, 3535: { step: 2, size: 3.5 }, 2020: { step: 1.5, size: 2 } };
    }
  });

  // src/families/displays.js
  var displays_exports = {};
  __export(displays_exports, {
    characterLcd: () => characterLcd,
    epaperModule: () => epaperModule,
    ili9341TouchDisplay: () => ili9341TouchDisplay,
    ledRing: () => ledRing,
    max7219Matrix: () => max7219Matrix,
    neopixelMatrix: () => neopixelMatrix,
    nokiaModule: () => nokiaModule,
    oledBreakout: () => oledBreakout,
    oledSquare: () => oledSquare,
    sevenSegment: () => sevenSegment,
    sh1107Module: () => sh1107Module,
    ssd1306Module: () => ssd1306Module,
    tftModule: () => tftModule,
    tm1637Module: () => tm1637Module
  });
  var init_displays2 = __esm({
    "src/families/displays.js"() {
      init_displays();
      init_pixels();
    }
  });

  // src/modules.js
  function moduleTemplate(props) {
    const T = tokens();
    const p = T.pitch;
    const names = props.pins || ["VCC", "OUT", "GND"];
    const f = finish(T, props.finish || "purple");
    const mm = p / 2.54;
    const minW = (names.length + 1) * p;
    const w = props.width ? props.width * mm : Math.max(minW, (props.widthPitches || 0) * p);
    const h = props.height ? props.height * mm : (props.heightPitches || 4.6) * p;
    const rowY = h - 0.6 * p;
    let s = "";
    const startX = r2((w - (names.length - 1) * p) / 2);
    s += board({
      width: w,
      height: h,
      finish: props.finish || "purple",
      holes: props.holes === false || w < 5 * p ? false : startX - 0.6 * p < 1.25 * p ? "top" : true,
      title: (props.part || "chip") === "dual-can" ? void 0 : props.label,
      titleY: props.extraPads && props.extraPads.length ? rowY - Math.floor((rowY - 0.8 * p) / p) * p + 1.4 * p : 1.1 * p,
      titleSize: Math.min(5, (w - 2 * p) / Math.max(4, (props.label || "").length) * 1.5),
      mark: w >= 8 * p && props.mark !== false && ((props.part || "chip") !== "dual-can" || w >= 14 * p) ? {
        x: w - 2 * p,
        y: props.extraPads && props.extraPads.length ? rowY - Math.floor((rowY - 0.8 * p) / p) * p + 1.8 * p : 0.55 * p,
        size: 0.8 * p
      } : void 0
    });
    const maxLen = names.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const labelSpan = rotateLabels ? T["pad-radius"] + 1 + maxLen * PIN_LABEL * 0.62 + 1.2 : T["label-rise"] + 3.6;
    const extraY = rowY - Math.floor((rowY - 0.8 * p) / p) * p;
    const extra = props.extraPads && props.extraPads.length ? header({
      x: r2((w - (props.extraPads.length - 1) * p) / 2),
      y: extraY,
      labels: props.extraPads,
      kind: "pad",
      side: "below",
      silk: f.silk,
      size: PIN_LABEL
    }) : null;
    const part = props.part || "chip";
    const top = part === "dual-can" ? 0.7 * p : extra ? extraY + 1.7 * p : 1.6 * p;
    const bottom = rowY - labelSpan;
    const mid = (top + bottom) / 2;
    const cx = w / 2;
    const room = bottom - top;
    if (extra) {
      s += extra.svg;
      extra.pins.forEach((pn) => {
        s += trace(T, props.finish || "purple", [
          [pn.x, pn.y],
          [pn.x, pn.y + 1 * p],
          [pn.x + (pn.x < cx ? 0.3 : -0.3) * p, pn.y + 1.5 * p]
        ]);
      });
    }
    if (part !== "dual-can")
      s += rect(0.5 * p, top - 0.25 * p, w - p, bottom - top + 0.5 * p, "none", {
        rx: 1,
        stroke: f.silk,
        "stroke-width": T["stroke-fine"],
        "stroke-opacity": 0.55
      });
    const hdr = header({ x: startX, y: rowY, labels: names, side: "above", silk: f.silk, rotate: rotateLabels });
    hdr.pins.forEach((pn, i) => {
      const dx = (i - (names.length - 1) / 2) * 0.35 * p;
      s += trace(T, props.finish || "purple", [
        [pn.x, pn.y],
        [pn.x, rowY - 1.1 * p],
        [pn.x + dx, bottom + 0.1 * p]
      ]);
    });
    if (w >= 8 * p && part !== "sensor" && part !== "dome" && (part !== "dual-can" || w >= 14 * p))
      s += via(T, 0.8 * p, rotateLabels ? Math.min(h - 1.9 * p, bottom - 0.7 * p) : h - 1.9 * p) + via(T, w - 0.8 * p, Math.max(top + 0.2 * p, 1.8 * p));
    if (part === "chip") {
      const half = Math.min(0.9 * p, (bottom - top) / 2 - 0.12 * p);
      const ic = props.ic || "soic";
      let chipS = "";
      if (ic === "lga") {
        chipS += rect(
          cx - half,
          mid - half,
          2 * half,
          2 * half,
          T.metal,
          Object.assign({ rx: 1 }, edge(T, T["metal-edge"], T["stroke-detail"]))
        );
        chipS += rect(cx - half + 0.5, mid - half + 0.5, 2 * half - 1, 0.9, "#ffffff", {
          rx: 0.4,
          "fill-opacity": T["opacity-light"] * 0.5
        }) + circle(cx + half * 0.3, mid + half * 0.3, half * 0.22, T.hole);
      } else {
        chipS += rect(
          cx - half,
          mid - half,
          2 * half,
          2 * half,
          T.chip,
          Object.assign({ rx: ic === "qfn" ? 0.5 : 1 }, edge(T, T["chip-edge"], T["stroke-detail"]))
        );
        if (ic === "qfn") {
          for (let i = 0; i < 4; i++) {
            const lq = -half * 0.66 + i * half * 0.44;
            chipS += rect(cx - half, mid + lq, 1, 0.2 * p, T.lead) + rect(cx + half - 1, mid + lq, 1, 0.2 * p, T.lead) + rect(cx + lq, mid - half, 0.2 * p, 1, T.lead) + rect(cx + lq, mid + half - 1, 0.2 * p, 1, T.lead);
          }
        } else {
          for (let i = 0; i < 4; i++) {
            const ly = mid - half * 0.69 + i * half * 0.46;
            chipS += rect(cx - half - 1.2, ly, 1.2, 0.22 * p, T.lead, { rx: 0.2 }) + rect(cx + half, ly, 1.2, 0.22 * p, T.lead, { rx: 0.2 });
          }
        }
        chipS += circle(cx - half * 0.66, mid - half * 0.66, 0.6, T["chip-print"]);
        if (ic !== "qfn")
          chipS += rect(cx - half + 0.5, mid - half + 0.5, 0.9, 2 * half - 1, "#ffffff", {
            rx: 0.4,
            "fill-opacity": T["opacity-light"] * 0.4
          });
      }
      s += tag("chip", chipS);
      const codeFit = Math.floor((2 * half - 1.6) / (PIN_LABEL * 0.62));
      if (half >= 0.8 * p && codeFit >= 4)
        s += text(cx, mid + half * 0.55, lotCode(props.label || "IC").slice(0, codeFit), PIN_LABEL, T["chip-print"], {
          "fill-opacity": 0.85
        });
      if (cx - 2.3 * p >= 0.6 * p && room >= 1.9 * p)
        s += smd(T, "resistor", cx - 2.3 * p, mid - 0.9 * p, true) + smd(T, "capacitor", cx - 2.3 * p, mid + 0.05 * p, true);
      if (cx + 2.1 * p <= w - 0.6 * p && room >= 1.5 * p) s += smd(T, "crystal", cx + 1.35 * p, mid - 0.65 * p, false);
      if (w >= 8 * p && room >= 1.3 * p)
        s += smd(T, "capacitor", cx - 3.3 * p, mid - 0.45 * p, false) + smd(T, "resistor", cx + 2.4 * p, mid - 0.45 * p, false);
    } else if (part === "sensor") {
      const sw = Math.min(w - 1.6 * p, 6 * p);
      const sh = Math.min(bottom - top, 10 * p);
      const sx = cx - sw / 2;
      const sy = mid - sh / 2;
      const hp = props.housing === "blue" ? T["plastic-blue"] : T["plastic-white"];
      const he = props.housing === "blue" ? T["plastic-blue-edge"] : T["plastic-white-edge"];
      s += tag("housing", rect(sx, sy, sw, sh, hp, Object.assign({ rx: 1.2 }, edge(T, he))));
      s += rect(sx + 1, sy + 1, sw - 2, sh - 2, "none", {
        rx: 0.8,
        stroke: he,
        "stroke-width": T["stroke-fine"],
        "stroke-opacity": 0.6
      });
      if (props.vent === "holes") {
        for (let gy = sy + 0.5 * p; gy < sy + sh - 0.3 * p; gy += 0.45 * p)
          for (let gx = sx + 0.5 * p; gx < sx + sw - 0.3 * p; gx += 0.45 * p)
            s += circle(gx, gy, 0.95, T["plastic-white-edge"]) + circle(gx - 0.25, gy - 0.25, 0.4, "#000000", { "fill-opacity": 0.25 });
      } else {
        const slotH = Math.min(1.2 * p, (sh - 1.2 * p) / 3);
        const rowsN = Math.max(1, Math.floor(sh * 0.68 / (slotH + 0.25 * p)));
        for (let rr = 0; rr < rowsN; rr++)
          for (let sxx = sx + 0.4 * p; sxx < sx + sw - 0.4 * p; sxx += 0.42 * p)
            s += rect(sxx, sy + 0.4 * p + rr * (slotH + 0.25 * p), 0.22 * p, slotH, T["plastic-white-edge"], {
              rx: 0.1 * p
            }) + rect(sxx + 0.04 * p, sy + 0.4 * p + rr * (slotH + 0.25 * p), 0.1 * p, slotH, "#000000", {
              rx: 0.05 * p,
              "fill-opacity": 0.3
            });
      }
      s += bevel(T, sx, sy, sw, sh);
    } else if (part === "can" || part === "dual-can") {
      let r;
      let cs;
      let cyc = mid;
      if (part === "dual-can") {
        const zoneHalf = (names.length - 1) * p / 2 + (rotateLabels ? PIN_LABEL / 2 : maxLen * PIN_LABEL * 0.62 / 2) + 0.6;
        const canBottom = rowY - T["pad-radius"] - 0.6;
        r = Math.min(
          (props.canPitches || 2.6) * p / 2,
          (canBottom - top) / 2 - 1.2,
          (cx - zoneHalf - 2.8 - 0.6 * p) / 2
        );
        cyc = (top + canBottom) / 2;
        cs = [cx - (zoneHalf + r + 1.6), cx + (zoneHalf + r + 1.6)];
      } else {
        r = Math.min((props.canPitches || 2.6) * p / 2, room / 2 - 2.4, w / 2 - 0.8 * p - 1.2);
        cs = [cx];
      }
      if (r < 2) r = 2;
      cs.forEach((x) => {
        s += tag("can", circle(x, cyc, r + 1.2, T["metal-edge"]));
        s += circle(x, cyc, r, T.metal, edge(T, T["metal-edge"])) + circle(x, cyc, r, sheen("metal"), { "fill-opacity": 0.6 });
        s += circle(x, cyc, r * 0.74, T["plastic-black"], edge(T, T["metal-edge"], T["stroke-fine"]));
        s += circle(x, cyc, r * 0.74, T["metal-edge"], { "fill-opacity": 0.55 });
        for (let k = 0; k < 8; k++) {
          const a = k * Math.PI / 4 + Math.PI / 8;
          s += circle(x + Math.cos(a) * r * 0.86, cyc + Math.sin(a) * r * 0.86, r * 0.045, T["metal-edge"]);
        }
        for (let m = 0; m < 5; m++)
          s += circle(x, cyc, r * (0.12 + m * 0.13), "none", {
            stroke: "#ffffff",
            "stroke-width": 0.4,
            "stroke-opacity": 0.22
          });
        s += path(
          `M${r2(x - r * 0.6)} ${r2(cyc - r * 0.35)}A${r2(r * 0.7)} ${r2(r * 0.7)} 0 0 1 ${r2(x - r * 0.3)} ${r2(cyc - r * 0.64)}`,
          "none",
          { stroke: "#ffffff", "stroke-width": 1, "stroke-linecap": "round", "stroke-opacity": 0.35 }
        );
      });
      if (part === "dual-can") {
        const gap = cs[1] - cs[0] - 2 * r - 2.4;
        if (props.label && gap >= 8 && mid - 1.45 * p - 4.2 >= top)
          s += text(
            cx,
            mid - 0.9 * p,
            props.label,
            Math.min(5, (gap - 2) / Math.max(4, props.label.length) * 1.6),
            f.silk
          );
        if (w >= 14 * p)
          s += text(1.35 * p, h - 0.45 * p, "T", PIN_LABEL, f.silk) + text(w - 1.35 * p, h - 0.45 * p, "R", PIN_LABEL, f.silk);
        if (r >= 2.2 * p)
          s += smd(T, "crystal", cx - 0.65 * p, mid - 2.3 * p, true) + tag("chip", rect(cx - 0.6 * p, mid - 0.3 * p, 1.2 * p, 0.9 * p, T.chip, { rx: 0.6 })) + smd(T, "capacitor", cx - 0.45 * p, mid + 0.8 * p, true);
      } else if (cx - r - 0.9 * p >= 0.6 * p + 1.2 && room >= 1.2 * p)
        s += smd(T, "resistor", cx - r - 0.9 * p, mid - 0.45 * p, false) + smd(T, "capacitor", cx + r + 0.45 * p, mid - 0.45 * p, false);
    } else if (part === "microsd") {
      const sw2 = Math.min(w - 1.6 * p, 6 * p);
      const sh2 = Math.min(room - 0.3 * p, 5.6 * p);
      const sx2 = cx - sw2 / 2;
      const sy2 = mid - sh2 / 2;
      s += tag(
        "slot",
        path(
          `M${r2(sx2)} ${r2(sy2)}H${r2(sx2 + sw2 - 0.9 * p)}l${r2(0.9 * p)} ${r2(0.9 * p)}V${r2(sy2 + sh2)}H${r2(sx2)}Z`,
          T.metal,
          edge(T, T["metal-edge"])
        ) + rect(sx2 + 0.5 * p, sy2 + sh2 - 1.2 * p, sw2 - 1 * p, 0.9 * p, T["plastic-black"], { rx: 0.3 }) + rect(sx2 + 0.5 * p, sy2 + sh2 - 1.2 * p, sw2 - 1 * p, 0.25 * p, "#ffffff", { "fill-opacity": 0.15 })
      );
      s += bevel(T, sx2, sy2, sw2, sh2, 1.2);
      [
        [sx2 + 0.35 * p, sy2 + 0.35 * p],
        [sx2 + sw2 - 0.35 * p, sy2 + sh2 - 0.35 * p],
        [sx2 + 0.35 * p, sy2 + sh2 - 0.35 * p]
      ].forEach((c) => {
        s += circle(c[0], c[1], 0.8, T["metal-edge"]);
      });
    } else if (part === "rtc") {
      const cr = Math.min(3.9 * p, room / 2 - 0.2 * p, w / 2 - 0.8 * p);
      const ccx = Math.min(w - 0.8 * p - cr, cx + 1 * p);
      s += tag(
        "cell",
        circle(ccx, mid, cr + 0.9, T["metal-edge"]) + circle(ccx, mid, cr, T.metal, edge(T, T["metal-edge"])) + circle(ccx, mid, cr * 0.82, "none", {
          stroke: T["metal-edge"],
          "stroke-width": T["stroke-fine"],
          "stroke-opacity": 0.6
        }) + text(ccx, mid + 2.4, "CR2032", Math.max(PIN_LABEL, Math.min(6.4, cr * 0.5)), T["metal-edge"], {
          "font-weight": 600
        }) + text(ccx, mid - cr * 0.45, "+", PIN_LABEL + 2, T["metal-edge"], { "font-weight": 700 })
      );
      s += el("ellipse", {
        cx: ccx - cr * 0.35,
        cy: mid - cr * 0.45,
        rx: cr * 0.35,
        ry: cr * 0.16,
        fill: "#ffffff",
        "fill-opacity": 0.45,
        transform: `rotate(-30 ${r2(ccx - cr * 0.35)} ${r2(mid - cr * 0.45)})`
      });
      if (ccx - cr - 0.6 * p - 1.3 * p >= 0.6 * p) {
        const qx = 0.7 * p;
        const qy = mid - 0.6 * p;
        s += tag(
          "chip",
          rect(
            qx,
            qy,
            1.3 * p,
            1.2 * p,
            T.chip,
            Object.assign({ rx: 0.6 }, edge(T, T["chip-edge"], T["stroke-detail"]))
          ) + circle(qx + 2.2, qy + 2.2, 0.6, T["chip-print"])
        );
        for (let ql = 0; ql < 4; ql++)
          s += rect(qx - 1.2, qy + 1.6 + ql * 2.5, 1.2, 1.4, T.lead, { rx: 0.2 }) + rect(qx + 1.3 * p, qy + 1.6 + ql * 2.5, 1.2, 1.4, T.lead, { rx: 0.2 });
        s += tag(
          "crystal",
          rect(
            qx,
            qy + 1.6 * p,
            0.7 * p,
            1.8 * p,
            T.metal,
            Object.assign({ rx: 0.35 * p }, edge(T, T["metal-edge"], T["stroke-fine"]))
          )
        );
      }
    } else if (part === "dome") {
      const dr = Math.min((props.domePitches || 3) * p / 2, room / 2 - 1.4, w / 2 - 0.8 * p - 1);
      s += tag("dome", circle(cx, mid, dr + 1, T["plastic-white-edge"]));
      s += circle(cx, mid, dr, T["plastic-white"], edge(T, T["plastic-white-edge"]));
      for (let q = 1; q <= 3; q++)
        s += circle(cx, mid, dr * q / 3.6, "none", {
          stroke: T["plastic-white-edge"],
          "stroke-width": T["stroke-fine"]
        });
      s += path(`M${r2(cx - dr)} ${r2(mid)}h${r2(2 * dr)}M${r2(cx)} ${r2(mid - dr)}v${r2(2 * dr)}`, "none", {
        stroke: T["plastic-white-edge"],
        "stroke-width": T["stroke-fine"]
      });
      s += el("ellipse", {
        cx: cx - dr * 0.35,
        cy: mid - dr * 0.4,
        rx: dr * 0.3,
        ry: dr * 0.16,
        fill: "#ffffff",
        "fill-opacity": 0.6,
        transform: `rotate(-30 ${r2(cx - dr * 0.35)} ${r2(mid - dr * 0.4)})`
      });
      const tp = 0.7 * p;
      if (cx - dr - 1 - 0.35 * p - tp >= 0.6 * p && room >= tp + 0.4 * p)
        [
          [0.6 * p, "time"],
          [w - 0.6 * p - tp, "sens"]
        ].forEach((t) => {
          s += tag(
            "trimmer",
            rect(
              t[0],
              mid - tp / 2,
              tp,
              tp,
              T["band-orange"],
              Object.assign({ rx: 0.8 }, edge(T, T["resistor-body-edge"], T["stroke-fine"]))
            ) + circle(
              t[0] + tp / 2,
              mid,
              tp * 0.28,
              T["plastic-white"],
              edge(T, T["plastic-white-edge"], T["stroke-fine"])
            ) + line(
              t[0] + tp / 2 - tp * 0.22,
              mid,
              t[0] + tp / 2 + tp * 0.22,
              mid,
              T["plastic-white-edge"],
              T["stroke-fine"]
            )
          );
        });
    }
    s += hdr.svg;
    return art(
      w,
      h,
      props.description || `${props.label || "Breakout"} module`,
      s,
      extra ? hdr.pins.concat(extra.pins) : hdr.pins
    );
  }
  function logicAnalyzer(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const w = 54.7 * mm;
    const h = 27.4 * mm;
    let s = "";
    const names = props.channels || ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"];
    const lit2 = props.lit || [];
    const samples = Math.max(0, Math.floor(Number(props.samples) || 0));
    const state2 = props.state || "idle";
    const WORD = { idle: "STOP", armed: "ARMED", recording: "REC", paused: "PAUSE", full: "FULL", error: "MEM" };
    const bi = T["board-inset"];
    const pins = [];
    s += tag(
      "body",
      rect(
        bi,
        bi,
        w - 2 * bi,
        h - 2 * bi,
        T["plastic-black"],
        Object.assign({ rx: 3 }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += bevel(T, bi, bi, w - 2 * bi, h - 2 * bi, 2.2, 3);
    s += usbPort(T, { kind: "mini", x: 0.3 * mm, y: h / 2 - 3.85 * mm, w: 3.4 * mm, h: 7.7 * mm, mouth: "left" });
    const colX = [w - 2 * p, w - p];
    const rowY = function(r) {
      return h / 2 + (r - 2) * p;
    };
    let hdrS = rect(
      colX[0] - 0.75 * p,
      rowY(0) - 0.85 * p,
      2.5 * p,
      5.7 * p,
      T["plastic-black"],
      Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
    );
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 2; c++)
        hdrS += rect(colX[c] - 0.28 * p, rowY(r) - 0.28 * p, 0.56 * p, 0.56 * p, T.cavity, { rx: 0.3 }) + rect(colX[c] - 0.12 * p, rowY(r) - 0.12 * p, 0.24 * p, 0.24 * p, T.metal);
    s += tag("socket", hdrS);
    for (let i = 0; i < 8; i++) pins.push({ name: names[i], x: colX[i % 2], y: rowY(Math.floor(i / 2)) });
    pins.push({ name: "GND", x: colX[1], y: rowY(4) });
    const lx = 4.4 * mm;
    const ly = 2 * mm;
    const lw = w - 3.05 * p - lx;
    const lh = h - 2 * ly;
    s += rect(lx, ly, lw, lh, T["plastic-white"], { rx: 1.4 });
    s += text(lx + 0.5 * p, ly + 1.75 * p, "Logic", 10.5, T["plastic-black"], {
      "text-anchor": "start",
      "font-weight": 700
    }) + text(lx + 0.5 * p, ly + 3 * p, "Analyzer", 10.5, T["plastic-black"], {
      "text-anchor": "start",
      "font-weight": 700
    });
    s += text(lx + 0.5 * p, ly + 4.15 * p, "24MHz 8CH", 5, T["plastic-black"], { "text-anchor": "start" });
    const lampX = [lx + lw - 5 * p, lx + lw - 2.2 * p];
    for (let c2 = 0; c2 < 8; c2++) {
      const tx = lampX[c2 % 2];
      const ty = rowY(Math.floor(c2 / 2));
      const on2 = !!lit2[c2];
      s += tag(
        "indicator",
        circle(
          tx,
          ty,
          on2 ? 2.4 : 2,
          on2 ? T["lens-green"] : T["indicator-off-light"],
          Object.assign(
            { "data-channel": c2, "data-lit": on2 ? "true" : "false" },
            edge(T, on2 ? T["lens-green"] : T["plastic-black-edge"], T["stroke-fine"])
          )
        )
      );
      s += text(tx + 0.5 * p, ty + 1.4, names[c2], PIN_LABEL, T["plastic-black"], {
        "text-anchor": "start",
        "font-weight": 600
      });
    }
    s += text(lampX[0] + 0.5 * p, rowY(4) + 1.4, "CLK", PIN_LABEL, T["plastic-black"], {
      "text-anchor": "start",
      "font-weight": 600
    }) + text(lampX[1] + 0.5 * p, rowY(4) + 1.4, "GND", PIN_LABEL, T["plastic-black"], {
      "text-anchor": "start",
      "font-weight": 600
    });
    const rx = lx + 0.35 * p;
    const ry = ly + lh - 1.15 * p;
    const rw = lw - 0.7 * p;
    const rh = 0.75 * p;
    s += rect(rx, ry, rw, rh, T.readout, { rx: 1 });
    const g = text(rx + 0.3 * p, ry + 0.55 * p, `SAMPLES ${samples}`, PIN_LABEL, T["readout-text"], {
      "text-anchor": "start",
      "font-weight": 600
    }) + text(rx + rw - 0.3 * p, ry + 0.55 * p, WORD[state2] || "STOP", PIN_LABEL, T["readout-text"], {
      "text-anchor": "end",
      "font-weight": 600
    });
    s += el(
      "g",
      {
        "data-samples": samples,
        "data-state": state2,
        "data-running": state2 === "recording" ? "true" : "false",
        "data-activity": r2(Number(props.activity) || 0)
      },
      g
    );
    return art(w, h, `Eight-channel logic analyzer, ${(WORD[state2] || "STOP").toLowerCase()}`, s, pins);
  }
  function microsdModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = 16.5 * p;
    const h = 9.5 * p;
    let s = "";
    const names = props.pins || ["CS", "SCK", "DI", "DO", "VCC", "GND", "CD"];
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 12.1 * p, y: 3.7 * p, size: 0.8 * p } });
    [
      [0.8 * p, 0.8 * p],
      [w - 0.8 * p, 0.8 * p],
      [0.8 * p, h - 0.8 * p],
      [w - 0.8 * p, h - 0.8 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(
      T,
      fin,
      f,
      { x: w - 1 * p, y: 1.75 * p, axis: "y", labels: names, kind: "pad", side: "left", silk: f.silk, size: PIN_LABEL },
      -1
    );
    const sx = 1.4 * p;
    const sy = 1.6 * p;
    const sw = 14.5 * mm;
    const sh = 15.5 * mm;
    s += tag(
      "slot",
      path(
        `M${r2(sx)} ${r2(sy)}H${r2(sx + sw - 0.9 * p)}l${r2(0.9 * p)} ${r2(0.9 * p)}V${r2(sy + sh)}H${r2(sx)}Z`,
        T.metal,
        edge(T, T["metal-edge"])
      ) + rect(sx, sy + 0.6 * p, 0.5 * p, sh - 1.2 * p, T["plastic-black"], { rx: 0.3 }) + rect(sx + 0.05 * p, sy + 0.6 * p, 0.2 * p, sh - 1.2 * p, "#ffffff", { "fill-opacity": 0.15 }) + rect(sx + sw - 0.45 * p, sy + 1 * p, 0.3 * p, sh - 2 * p, T["metal-edge"], { rx: 0.2, "fill-opacity": 0.6 })
    );
    s += bevel(T, sx, sy, sw, sh, 1.4);
    for (let k = 0; k < 8; k++)
      s += rect(sx + sw - 0.4 * p, sy + 1.3 * p + k * 0.55 * p, 0.6 * p, 0.2 * p, T.lead, { rx: 0.1 });
    [
      [sx + 0.4 * p, sy + 0.4 * p],
      [sx + 0.4 * p, sy + sh - 0.4 * p],
      [sx + sw - 0.4 * p, sy + sh - 0.4 * p]
    ].forEach((c) => {
      s += circle(c[0], c[1], 0.8, T["metal-edge"]);
    });
    s += soicAcross(T, 8.6 * p, 0.95 * p, 2.9 * p, 1.4 * p, 7, "74LVC125");
    [
      [7.5, 0.75],
      [7.5, 1.55],
      [11.9, 0.75],
      [11.9, 1.55]
    ].forEach((q) => {
      s += framed(T, f, q[1] < 1 ? "capacitor" : "resistor", q[0] * p, q[1] * p, true);
    });
    const rx = 8.7 * p;
    const ry = 5.6 * p;
    const rw = 2.6 * p;
    const rh = 1.4 * p;
    s += tag(
      "chip",
      rect(rx + rw / 2 - 0.6 * p, ry - 0.5 * p, 1.2 * p, 0.5 * p, T.lead, { rx: 0.2 }) + [0.3, 1.3, 2.3].map((k) => {
        return rect(rx + k * p, ry + rh, 0.35 * p, 0.55 * p, T.lead, { rx: 0.2 });
      }).join("") + rect(rx, ry, rw, rh, T.chip, Object.assign({ rx: 0.5 }, edge(T, T["chip-edge"], T["stroke-detail"]))) + bevel(T, rx, ry, rw, rh, 1, 0.5) + text(rx + rw / 2, ry + rh / 2 + 1.4, "AMS1117", 4, T["chip-print"])
    );
    s += framed(T, f, "capacitor", 7.4 * p, 5.4 * p, true) + framed(T, f, "capacitor", 7.5 * p, 6.7 * p, true) + framed(T, f, "capacitor", 11.7 * p, 7.3 * p, true);
    s += hdr.svg;
    return art(w, h, "microSD card module", s, hdr.pins);
  }
  function rtcModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = 15 * p;
    const h = 8.7 * p;
    let s = "";
    const names = props.pins || ["GND", "5V", "SDA", "SCL", "SQW"];
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 2.6 * p, y: 7.35 * p, size: 0.8 * p } });
    [
      [0.8 * p, 0.8 * p],
      [w - 0.8 * p, 0.8 * p],
      [0.8 * p, h - 0.8 * p],
      [w - 0.8 * p, h - 0.8 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(
      T,
      fin,
      f,
      { x: w - 1 * p, y: 2.5 * p, axis: "y", labels: names, kind: "pad", side: "left", silk: f.silk, size: PIN_LABEL },
      -1
    );
    s += text(6.9 * p, 1.1 * p, props.label || "RTC", 5, f.silk, { "font-weight": 600 });
    const ccx = 3.9 * p;
    const ccy = 4.5 * p;
    const cr = 6.25 * mm;
    s += tag(
      "cell",
      circle(ccx, ccy, cr + 0.45 * p, T.pad, edge(T, T["metal-edge"], T["stroke-fine"])) + rect(ccx - cr - 0.9 * p, ccy - 0.35 * p, 0.8 * p, 0.7 * p, T.pad, { rx: 0.3 }) + rect(ccx + cr + 0.2 * p, ccy - 0.35 * p, 0.8 * p, 0.7 * p, T.pad, { rx: 0.3 }) + circle(ccx, ccy, cr, T["plastic-black"], edge(T, T["plastic-black-edge"])) + circle(ccx, ccy, cr, sheen("metal"), { "fill-opacity": 0.35 }) + text(ccx, ccy - 0.6, "CR1220", 4.4, T["plastic-grey"], { "font-weight": 600 }) + text(ccx, ccy + 4.6, "3V", 4, T["plastic-grey"])
    );
    s += text(ccx + cr + 1.5 * p, ccy + 1.5 * p, "+", 5, f.silk, { "font-weight": 700 });
    const qx = 8.4 * p;
    const qy = 2 * p;
    s += silkFrame(T, f, qx - 0.9 * p, qy - 0.45 * p, 3.4 * p, 0.9 * p);
    s += circle(qx - 0.6 * p, qy - 0.25 * p, 1.3, T.pad) + circle(qx - 0.6 * p, qy + 0.25 * p, 1.3, T.pad) + line(qx - 0.6 * p, qy - 0.25 * p, qx + 0.1 * p, qy - 0.1 * p, T.lead, 0.9) + line(qx - 0.6 * p, qy + 0.25 * p, qx + 0.1 * p, qy + 0.1 * p, T.lead, 0.9);
    s += tag(
      "crystal",
      rect(
        qx,
        qy - 1 * mm,
        6 * mm,
        2 * mm,
        T.metal,
        Object.assign({ rx: 1 * mm }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + rect(qx, qy - 1 * mm, 6 * mm, 2 * mm, sheen("metal"), { rx: 1 * mm, "fill-opacity": 0.7 })
    );
    s += soicAcross(T, 8.3 * p, 3.5 * p, 1.95 * p, 1.55 * p, 4, "DS1307");
    s += framed(T, f, "resistor", 8.6 * p, 6.1 * p, true) + text(9.75 * p, 6.5 * p, "R1", 4, f.silk, { "text-anchor": "start" });
    s += hdr.svg;
    return art(w, h, "DS1307 real-time clock module", s, hdr.pins);
  }
  function rfidModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = 23.5 * p;
    const h = 16 * p;
    let s = "";
    const names = props.pins || ["SDA", "SCK", "MOSI", "MISO", "IRQ", "GND", "RST", "3.3V"];
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 10.2 * p, y: 13.4 * p, size: 0.8 * p } });
    [
      [6.9 * p, 1.2 * p],
      [6.9 * p, h - 1.2 * p],
      [22.5 * p, 2 * p],
      [22.5 * p, h - 2 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(
      T,
      fin,
      f,
      { x: 1 * p, y: 4 * p, axis: "y", labels: names, kind: "pad", side: "right", silk: f.silk, size: PIN_LABEL },
      1
    );
    s += rect(0.45 * p, 3.4 * p, 1.1 * p, 8.2 * p, "none", {
      rx: 0.6,
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85
    });
    s += tag(
      "crystal",
      rect(
        1.4 * p,
        0.75 * p,
        4.3 * p,
        1.6 * p,
        T.metal,
        Object.assign({ rx: 0.8 * p }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + rect(1.4 * p, 0.75 * p, 4.3 * p, 1.6 * p, sheen("metal"), { rx: 0.8 * p, "fill-opacity": 0.7 })
    );
    s += text(5.95 * p, 1.75 * p, "OSC", 4, f.silk, { "text-anchor": "start" });
    s += framed(T, f, "capacitor", 1.9 * p, 2.75 * p, true) + framed(T, f, "capacitor", 3.6 * p, 2.75 * p, true);
    [
      [3, 4.35],
      [3.9, 4.35],
      [4.8, 4.35],
      [5.7, 4.35]
    ].forEach((q, i) => {
      s += framed(T, f, i === 0 || i === 3 ? "capacitor" : "resistor", q[0] * p, q[1] * p, false);
    });
    s += qfp(T, 3.4 * p, 6.3 * p, 2.3 * p, 2.3 * p, 8, "RC522");
    s += text(6.6 * p, 7.45 * p, "HW-126", 4, f.silk, {
      "dominant-baseline": "middle",
      transform: `rotate(-90 ${r2(6.6 * p)} ${r2(7.45 * p)})`
    });
    [
      [3, 9.5],
      [3.9, 9.5],
      [4.8, 9.5],
      [5.7, 9.5]
    ].forEach((q, i) => {
      s += framed(T, f, i === 1 ? "resistor" : "capacitor", q[0] * p, q[1] * p, false);
    });
    s += silkFrame(T, f, 1 * p, 12 * p, 0.6 * p, 0.6 * p) + indicator({
      x: 1 * p,
      y: 12 * p,
      size: 0.6 * p,
      color: "red",
      on: !!(props.indicators && props.indicators.power),
      hook: "power-led",
      state: "power",
      finish: fin
    });
    [
      [2.4, 11.9],
      [3.3, 11.9],
      [4.2, 11.9]
    ].forEach((q, i) => {
      s += framed(T, f, "resistor", q[0] * p, q[1] * p, false);
    });
    s += text(1.3 * p, 13.5 * p, "D1", 4, f.silk) + text(2.95 * p, 13.5 * p, "R1", 4, f.silk) + text(3.9 * p, 13.5 * p, "L1", 4, f.silk) + text(4.8 * p, 13.5 * p, "L2", 4, f.silk);
    const turns = 3;
    const cx0 = 8.2 * p;
    const cy0 = 1 * p;
    const cw = 13.4 * p;
    const ch = h - 2 * p;
    const gap = 0.3 * p;
    let d = "";
    for (let t = 0; t < turns; t++) {
      const x = cx0 + t * gap;
      const y = cy0 + t * gap;
      const ww = cw - 2 * t * gap;
      const hh = ch - 2 * t * gap;
      const rr = 1.6 * p - t * gap;
      d += `M${r2(x + rr)} ${r2(y)}H${r2(x + ww - rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + ww)} ${r2(y + rr)}V${r2(y + hh - rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + ww - rr)} ${r2(y + hh)}H${r2(x + rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x)} ${r2(y + hh - rr)}V${r2(y + rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + rr)} ${r2(y)}Z`;
    }
    s += path(d, "none", { "data-hook": "antenna", stroke: T.pad, "stroke-width": 1.1, "stroke-linejoin": "round" });
    s += rect(
      cx0 + turns * gap + 0.4 * p,
      cy0 + turns * gap + 0.4 * p,
      cw - 2 * turns * gap - 0.8 * p,
      ch - 2 * turns * gap - 0.8 * p,
      "none",
      { "data-hook": "field", rx: 2 }
    );
    for (let k = 0; k < 6; k++) s += framed(T, f, "capacitor", 9.6 * p, (5 + k * 1) * p, true);
    const acx = 15.3 * p;
    const acy = 8 * p;
    let arcs = "";
    for (let a = 1; a <= 4; a++) {
      const ar = a * 1.1 * p;
      const sa = -Math.PI * 0.8;
      const ea = -Math.PI * 0.2;
      arcs += `M${r2(acx + Math.cos(sa) * ar)} ${r2(acy + Math.sin(sa) * ar)}A${r2(ar)} ${r2(ar)} 0 0 1 ${r2(acx + Math.cos(ea) * ar)} ${r2(acy + Math.sin(ea) * ar)}`;
      arcs += `M${r2(acx - Math.cos(sa) * ar)} ${r2(acy - Math.sin(sa) * ar)}A${r2(ar)} ${r2(ar)} 0 0 1 ${r2(acx - Math.cos(ea) * ar)} ${r2(acy - Math.sin(ea) * ar)}`;
    }
    s += path(arcs, "none", { stroke: f.silk, "stroke-width": 1, "stroke-linecap": "round" }) + circle(acx, acy, 1.6, f.silk);
    s += text(20.3 * p, acy, props.label || "RFID-RC522", 6, f.silk, {
      "font-weight": 600,
      "dominant-baseline": "middle",
      transform: `rotate(-90 ${r2(20.3 * p)} ${r2(acy)})`
    });
    s += hdr.svg;
    return art(w, h, "MFRC522 RFID reader module", s, hdr.pins);
  }
  function relayModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "red";
    const f = finish(T, fin);
    const w = 19.5 * p;
    const h = 10 * p;
    let s = "";
    const ind = { power: true, status: false, ...props.indicators };
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 10.4 * p, y: 0.55 * p, size: 0.7 * p } });
    [
      [0.9 * p, 0.9 * p],
      [w - 0.9 * p, 0.9 * p],
      [0.9 * p, h - 0.9 * p],
      [w - 0.9 * p, h - 0.9 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(
      T,
      fin,
      f,
      {
        x: 18.75 * p,
        y: 4 * p,
        axis: "y",
        labels: ["VCC", "GND", "IN"],
        kind: "pad",
        side: "left",
        silk: f.silk,
        size: PIN_LABEL
      },
      -1
    );
    const tx = 1.75 * p;
    const tw = 2.6 * p;
    const ty = 2 * p;
    const th = 6 * p;
    const names = ["NO", "COM", "NC"];
    const pins = hdr.pins.slice();
    s += tag(
      "terminal",
      rect(tx - tw / 2, ty, tw, th, T["plastic-blue"], Object.assign({ rx: 1 }, edge(T, T["plastic-blue-edge"]))) + bevel(T, tx - tw / 2, ty, tw, th, 1.6, 1)
    );
    names.forEach((n, i) => {
      const y = (3 + 2 * i) * p;
      s += circle(tx, y, 0.5 * p, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + circle(tx, y, 0.5 * p, sheen("metal"), { "fill-opacity": 0.6 }) + line(tx - 0.3 * p, y - 0.3 * p, tx + 0.3 * p, y + 0.3 * p, T["metal-edge"], 0.9) + line(tx + 0.3 * p, y - 0.3 * p, tx - 0.3 * p, y + 0.3 * p, T["metal-edge"], 0.9);
      s += text(tx + tw / 2 + 0.45 * p, y + 1.4, n, PIN_LABEL, f.silk, { "text-anchor": "start" });
    });
    const rw = 19 * mm;
    const rh = 15.5 * mm;
    const rx = 4.6 * p;
    const ry = (h - rh) / 2;
    s += tag(
      "body",
      rect(rx, ry, rw, rh, T["plastic-blue"], Object.assign({ rx: 1.2 }, edge(T, T["plastic-blue-edge"])))
    );
    s += bevel(T, rx, ry, rw, rh, 1.8, 1.2);
    s += text(rx + rw / 2, ry + 1.5 * p, "RELAY", 5, T["chip-print"], { "font-weight": 700 });
    s += text(rx + rw / 2, ry + 2.5 * p, "10A 250VAC  10A 125VAC", PIN_LABEL, T["chip-print"]) + text(rx + rw / 2, ry + 3.1 * p, "10A 30VDC   10A 28VDC", PIN_LABEL, T["chip-print"]);
    s += text(rx + rw / 2, ry + 4.3 * p, "SRD-05VDC-SL-C", 5, T["chip-print"], { "font-weight": 600 });
    s += text(rx + rw / 2, ry + 5.3 * p, lotCode("SRD"), PIN_LABEL, T["chip-print"], { "fill-opacity": 0.8 });
    s += framed(T, f, "resistor", 13 * p, 0.75 * p, true) + framed(T, f, "resistor", 15 * p, 0.75 * p, true) + framed(T, f, "resistor", 15.3 * p, 3.3 * p, true) + framed(T, f, "resistor", 15.3 * p, 4.3 * p, true);
    s += sot23(T, 13.4 * p, 2.1 * p, 3) + text(13.3 * p, 4.5 * p, "Q1", PIN_LABEL, f.silk);
    s += soicAcross(T, 13.1 * p, 5.6 * p, 1.6 * p, 1.4 * p, 2, "817");
    s += silkFrame(T, f, 17 * p, 0.8 * p, 0.7 * p, 0.7 * p) + indicator({
      x: 17 * p,
      y: 0.8 * p,
      size: 0.7 * p,
      color: "red",
      on: !!ind.power,
      hook: "power-led",
      state: "power-led",
      finish: fin
    }) + text(17.35 * p, 2.3 * p, "PWR", PIN_LABEL, f.silk);
    s += silkFrame(T, f, 15.9 * p, 5.5 * p, 0.7 * p, 0.7 * p) + indicator({
      x: 15.9 * p,
      y: 5.5 * p,
      size: 0.7 * p,
      color: "green",
      on: !!ind.status,
      hook: "status-led",
      state: "status-led",
      finish: fin
    }) + text(16.25 * p, 7 * p, "ON", PIN_LABEL, f.silk);
    s += tag(
      "jumper",
      rect(
        13 * p,
        8.1 * p,
        2.2 * p,
        0.8 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      ) + rect(13.1 * p, 8.2 * p, 1 * p, 0.6 * p, T["band-yellow"], { rx: 0.2 })
    );
    s += text(12.6 * p, 8.75 * p, "L", PIN_LABEL, f.silk) + text(15.6 * p, 8.75 * p, "H", PIN_LABEL, f.silk);
    names.forEach((n, i) => {
      pins.push({ name: n, x: tx, y: (3 + 2 * i) * p });
    });
    if (props.label !== false)
      s += text(8.1 * p, 9.25 * p, props.label || "1 RELAY MODULE  HIGH/LOW TRIGGER", PIN_LABEL, f.silk);
    s += hdr.svg;
    return art(w, h, "Relay module with an SPDT changeover contact", s, pins);
  }
  var init_modules = __esm({
    "src/modules.js"() {
      init_core();
      init_pieces();
    }
  });

  // src/sensors.js
  function comparatorBoardTemplate(props) {
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const element = props.element || "ldr";
    const layout = element === "cylinder" ? "tilt" : element === "mic" ? "ky037" : "fc";
    const fin = props.finish || (layout === "ky037" ? "red" : "blue");
    const f = finish(T, fin);
    const names = props.pins || ["VCC", "GND", "DO", "AO"];
    const prints = props.labels || names.map((n) => {
      return n === "DOUT" ? "DO" : n === "AOUT" ? "AO" : n;
    });
    const bw = (layout === "ky037" ? 15 : 14) * mm;
    const bh = (layout === "ky037" ? 34 : 32) * mm;
    const sx = bw / ((layout === "tilt" ? 14 : 16.3) * mm);
    const sy = bh / (36 * mm);
    const micMm = Number(props.micMm) || 9.7;
    const micLen = (micMm > 8 ? 6.7 : 4.5) * mm;
    const ext = 6 * mm;
    const w = bw;
    const by = (layout === "tilt" ? 11.5 : layout === "fc" ? 6.5 : micLen / mm + 1) * mm;
    const h = by + bh + ext;
    const cx = w / 2;
    let s = "";
    const X = function(k) {
      return r2(cx + k * sx * mm);
    };
    const Y = function(k) {
      return r2(by + k * sy * mm);
    };
    const startX = r2((w - (names.length - 1) * p) / 2);
    const maxLen = prints.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const edgePins = edgeHeader(T, { names, side: "bottom", at: by + bh, from: startX, ext });
    const rowY = edgePins.pads[0].y;
    const labelSpan = rotateLabels ? T["pad-radius"] + 1 + maxLen * PIN_LABEL * 0.62 + 1.2 : T["label-rise"] + 3.6;
    const bottom = rowY - labelSpan;
    const frame = function(x, y, fw, fh) {
      return rect(x - 1.2, y - 1.2, fw + 2.4, fh + 2.4, "none", {
        stroke: f.silk,
        "stroke-width": T["stroke-fine"],
        "stroke-opacity": 0.85,
        rx: 0.4
      });
    };
    const passive = function(kind, x, y, horizontal) {
      const rw = horizontal ? 0.9 * p : 0.55 * p;
      const rh = horizontal ? 0.55 * p : 0.9 * p;
      const px = X(x);
      const py = Y(y);
      if (kind === "mlcc") {
        const cw2 = horizontal ? 3 * mm : 1.5 * mm;
        const chh = horizontal ? 1.5 * mm : 3 * mm;
        return frame(px, py, cw2, chh) + tag(
          "smd",
          rect(px, py, cw2, chh, T["cap-mlcc"], { rx: 0.4 }) + (horizontal ? rect(px, py, cw2 * 0.18, chh, T.lead, { rx: 0.3 }) + rect(px + cw2 * 0.82, py, cw2 * 0.18, chh, T.lead, { rx: 0.3 }) : rect(px, py, cw2, chh * 0.18, T.lead, { rx: 0.3 }) + rect(px, py + chh * 0.82, cw2, chh * 0.18, T.lead, { rx: 0.3 }))
        );
      }
      return frame(px, py, rw, rh) + smd(T, kind, px, py, horizontal);
    };
    const lamp = function(x, y, color, hook, state2, on2, label, where) {
      const isz = 0.6 * p;
      const lx = X(x);
      const ly = Y(y);
      let out = frame(lx, ly, isz, isz) + indicator({ x: lx, y: ly, size: isz, color, on: on2, hook, state: state2, finish: fin });
      if (where === "right")
        out += text(lx + isz + 2, ly + isz / 2, label, 4, f.silk, {
          "text-anchor": "start",
          "dominant-baseline": "middle"
        });
      else out += text(lx + isz / 2, ly + isz + 4, label, 4, f.silk);
      return out;
    };
    const L = layout === "fc" ? {
      holes: [
        [-6.3, 2.2],
        [6.3, 2.2]
      ],
      mount: [0.3, 24.5],
      mark: [-7, 27.2],
      chipX: -4.4,
      chipY: 14,
      trimX: 0.6,
      trimY: 11,
      code: "103",
      passives: [
        ["mlcc", -6.6, 6.2, true],
        ["mlcc", -6.6, 8.8, true],
        ["resistor", -7.3, 10.6, false],
        ["resistor", -5, 10.6, false],
        ["resistor", 3.6, 23.2, true],
        ["resistor", 3.6, 27.4, true]
      ],
      pwr: [4.6, 19.2, "below"],
      dout: [-6.6, 24, "right"]
    } : layout === "tilt" ? {
      holes: [
        [-5.6, 2.2],
        [5.6, 2.2]
      ],
      mount: [-1.2, 23],
      mark: [4, 26.4],
      chipX: -3.6,
      chipY: 10,
      trimX: -0.2,
      trimY: 9,
      code: "103",
      passives: [
        ["resistor", -6.2, 5.6, false],
        ["resistor", -3.7, 5.6, false],
        ["capacitor", 1.2, 5.6, false],
        ["capacitor", 3.7, 5.6, false],
        ["resistor", -6.3, 17.6, true],
        ["resistor", 2.6, 17.6, true]
      ],
      pwr: [3.6, 20.4, "below"],
      dout: [-6.3, 20.4, "below"]
    } : {
      holes: [
        [-6.3, 2.2],
        [6.3, 2.2]
      ],
      mount: [0.3, 23.5],
      mark: [-1.2, 26.6],
      chipX: -4,
      chipY: 13,
      trimX: 0.6,
      trimY: 12.5,
      code: "104",
      passives: [
        ["resistor", -7, 9.6, false],
        ["resistor", -4.4, 9.6, false],
        ["resistor", 3.2, 5.6, false],
        ["resistor", 5.8, 5.6, false],
        ["resistor", -6.6, 20.4, true],
        ["resistor", 3.6, 20.4, true]
      ],
      pwr: [3.4, 23.5, "below"],
      dout: [-5.8, 23.5, "below"]
    };
    s += board({
      width: w,
      height: bh,
      y: by,
      finish: fin,
      holes: false,
      mark: { x: X(L.mark[0]), y: Y(L.mark[1]), size: 0.7 * p }
    });
    L.holes.forEach((c) => {
      s += tag("hole", circle(X(c[0]), Y(c[1]), 0.8 * mm, T.hole, edge(T, T.pad, T["stroke-fine"])));
    });
    s += circle(X(L.mount[0]), Y(L.mount[1]), 2.2 * mm, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85
    });
    s += tag("hole", circle(X(L.mount[0]), Y(L.mount[1]), 1.5 * mm, T.hole, edge(T, T.pad)));
    const hdr = header({
      x: startX,
      y: rowY,
      labels: prints,
      kind: "print",
      side: "above",
      silk: f.silk,
      rotate: rotateLabels
    });
    edgePins.pads.forEach((pd, i) => {
      s += trace(T, fin, [
        [pd.x, pd.y],
        [pd.x, rowY - 1.1 * p],
        [pd.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p]
      ]);
    });
    const padY = Y(3.6);
    const E = function(k) {
      return r2(cx + k * mm);
    };
    if (element === "flame") {
      const lr = 2.5 * mm;
      const tip = by - 6 * mm;
      const base = by + 1 * mm;
      [E(-1.27), E(1.27)].forEach((x) => {
        s += wire(x, base - 0.6, x, padY);
      });
      const dome = `M${E(-2.5)} ${r2(base)}V${r2(tip + lr)}A${r2(lr)} ${r2(lr)} 0 0 1 ${E(2.5)} ${r2(tip + lr)}V${r2(base)}Z`;
      s += tag(
        "element",
        path(dome, T["plastic-black"], edge(T, T["plastic-black-edge"], T["stroke-detail"])) + rect(
          E(-2.9),
          r2(base - 0.6 * mm),
          5.8 * mm,
          1 * mm,
          T["plastic-black"],
          Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
        )
      );
      s += path(dome, sheen("dome"), { "fill-opacity": 0.75 });
      s += el("ellipse", {
        cx: E(-0.9),
        cy: r2(tip + lr * 0.75),
        rx: lr * 0.32,
        ry: lr * 0.16,
        fill: "#ffffff",
        "fill-opacity": 0.3,
        transform: `rotate(-30 ${E(-0.9)} ${r2(tip + lr * 0.75)})`
      });
    } else if (element === "ldr") {
      const pr = 2.5 * mm;
      const pcy = by - 2.6 * mm;
      [E(-1.27), E(1.27)].forEach((x) => {
        s += wire(x, pcy + pr * 0.8, x, padY);
      });
      let track = "";
      for (let k = 0; k < 6; k++) {
        const ty0 = pcy - pr * 0.7 + k * pr * 0.28;
        track += `M${r2(cx - pr * 0.62)} ${r2(ty0)}h${r2(pr * 1.24)}${k < 5 ? `m${r2(k % 2 ? -pr * 1.24 : 0)} ${r2(pr * 0.14)}v0` : ""}`;
      }
      s += tag(
        "element",
        circle(cx, pcy, pr, T["cap-ceramic"], edge(T, T["resistor-body-edge"], T["stroke-detail"])) + path(track, "none", { stroke: T["resistor-smd"], "stroke-width": 1.1, "stroke-linecap": "round" })
      );
      s += circle(cx, pcy, pr, sheen("lens"), { "fill-opacity": 0.5 });
    } else if (element === "cylinder") {
      const cr = 2 * mm;
      const ctop = by - 11 * mm;
      const cbot = by + 1 * mm;
      [E(-1.27), E(1.27)].forEach((x) => {
        s += wire(x, cbot - 0.6, x, padY);
      });
      const can = `M${E(-2)} ${r2(cbot)}V${r2(ctop + cr)}A${r2(cr)} ${r2(cr)} 0 0 1 ${E(2)} ${r2(ctop + cr)}V${r2(cbot)}Z`;
      s += tag(
        "element",
        path(can, T.brass, edge(T, T["brass-edge"])) + rect(E(-2), r2(cbot - 1 * mm), 4 * mm, 1 * mm, T["plastic-black"], { rx: 0.3 })
      );
      s += path(can, sheen("metal"), { "fill-opacity": 0.8 });
    } else if (element === "mic") {
      const micR = micMm * mm / 2;
      const mtop = by - micLen - 0.5 * mm;
      const mbot = by - 0.5 * mm;
      [E(-1.27), E(1.27)].forEach((x) => {
        s += wire(x, mbot - 0.6, x, padY);
      });
      s += tag(
        "element",
        rect(cx - micR, mtop, 2 * micR, micLen, T.metal, Object.assign({ rx: 0.8 }, edge(T, T["metal-edge"]))) + rect(cx - micR + 0.4, mtop + 0.2, 2 * micR - 0.8, 0.9 * mm, T.cavity, { rx: 0.5 }) + rect(cx - micR, mtop + 1.1 * mm, 2 * micR, 0.5 * mm, T["metal-edge"], { "fill-opacity": 0.6 })
      );
      s += rect(cx - micR, mtop, 2 * micR, micLen, sheen("metal"), { rx: 0.8, "fill-opacity": 0.7 });
    }
    [E(-1.27), E(1.27)].forEach((x) => {
      s += tag("pad", circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
    });
    s += line(E(-4.4), r2(padY), E(-3.2), r2(padY), f.silk, 0.8) + line(E(-3.8), r2(padY - 0.6 * mm), E(-3.8), r2(padY + 0.6 * mm), f.silk, 0.8) + line(E(3.2), r2(padY), E(4.4), r2(padY), f.silk, 0.8);
    L.passives.forEach((q) => {
      s += passive(q[0], q[1], q[2], q[3]);
    });
    const ts = 6.8 * mm;
    const tx = Math.min(X(L.trimX), r2(w - ts - 0.4 * mm));
    const ty = Y(L.trimY);
    const tcx = tx + ts / 2;
    const tcy = ty + ts / 2;
    const dr = 1.8 * mm;
    if (layout === "ky037") {
      const tw = 4.8 * mm;
      const tl = 9.5 * mm;
      const qx = r2(tcx - tw / 2);
      const qy = r2(by + 9.4 * mm);
      const scx = qx + tw / 2;
      const scy = qy + tl - 1.9 * mm;
      const sr = 1.2 * mm;
      s += tag(
        "trimmer",
        rect(
          qx,
          qy,
          tw,
          tl,
          T["plastic-blue"],
          Object.assign({ rx: 0.5 }, edge(T, T["plastic-blue-edge"], T["stroke-fine"]))
        ) + bevel(T, qx, qy, tw, tl, 1, 0.5) + circle(scx, scy, sr, T.brass, edge(T, T["brass-edge"], T["stroke-fine"])) + line(scx - sr * 0.7, scy - sr * 0.7, scx + sr * 0.7, scy + sr * 0.7, T["brass-edge"], 0.7) + text(scx, qy + 3.4 * mm, L.code, 4, T["lens-white"], {
          "fill-opacity": 0.9,
          "dominant-baseline": "middle",
          transform: `rotate(-90 ${r2(scx)} ${r2(qy + 3.4 * mm)})`
        })
      );
    } else
      s += tag(
        "trimmer",
        rect(
          tx,
          ty,
          ts,
          ts,
          T["lens-blue"],
          Object.assign({ rx: 1.6 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
        ) + bevel(T, tx, ty, ts, ts, 1.2, 1.6) + path(
          `M${r2(tcx - dr * 1.45 * 0.5)} ${r2(tcy + dr * 1.45 * 0.866)}A${r2(dr * 1.45)} ${r2(dr * 1.45)} 0 1 1 ${r2(tcx + dr * 1.45 * 0.5)} ${r2(tcy + dr * 1.45 * 0.866)}`,
          "none",
          { stroke: T["lens-white"], "stroke-width": 0.6, "stroke-opacity": 0.9 }
        ) + path(
          `M${r2(tcx + dr * 1.45 * 0.5 - 1.6)} ${r2(tcy + dr * 1.45 * 0.866 - 1.4)}l1.8 1.3 -2.1 0.9z`,
          T["lens-white"],
          { "fill-opacity": 0.9 }
        ) + circle(tcx, tcy, dr, T["cap-stripe"], edge(T, T["metal-edge"], T["stroke-fine"])) + line(tcx - dr * 0.7, tcy, tcx + dr * 0.7, tcy, T["metal-edge"], 0.7) + line(tcx, tcy - dr * 0.7, tcx, tcy + dr * 0.7, T["metal-edge"], 0.7) + text(tcx, ty + ts - 1.4, L.code, 4, T["lens-white"], { "fill-opacity": 0.9 })
      );
    const cw = 3.9 * mm;
    const chl = 4.9 * mm;
    const chx = X(L.chipX) - cw / 2;
    const chy = Y(L.chipY);
    let chip = "";
    for (let li = 0; li < 4; li++) {
      const ly = chy + chl / 2 + (li - 1.5) * 1.27 * mm - 0.22 * mm;
      chip += rect(chx - 1 * mm, ly, 1 * mm, 0.44 * mm, T.lead, { rx: 0.2 }) + rect(chx + cw, ly, 1 * mm, 0.44 * mm, T.lead, { rx: 0.2 });
    }
    chip += rect(chx, chy, cw, chl, T.chip, Object.assign({ rx: 0.5 }, edge(T, T["chip-edge"], T["stroke-detail"]))) + bevel(T, chx, chy, cw, chl, 1, 0.5) + circle(chx + 1.8, chy + 1.8, 0.6, T["chip-print"]);
    chip += text(chx + cw / 2, chy + chl / 2, "LM393", 4, T["chip-print"], {
      "dominant-baseline": "middle",
      transform: `rotate(-90 ${r2(chx + cw / 2)} ${r2(chy + chl / 2)})`
    });
    s += tag("chip", chip);
    s += lamp(
      L.pwr[0],
      L.pwr[1],
      "red",
      "power-led",
      "power",
      !!(props.indicators && props.indicators.power),
      "PWR",
      L.pwr[2]
    );
    s += lamp(
      L.dout[0],
      L.dout[1],
      "green",
      "out-led",
      void 0,
      !!(props.indicators && props.indicators.out),
      "DO",
      L.dout[2]
    );
    s += edgePins.svg + hdr.svg;
    const what = element === "flame" ? "Flame sensor" : element === "ldr" ? "Light sensor (LDR)" : element === "cylinder" ? "Tilt switch" : "Sound sensor";
    return art(w, h, props.description || `${what} module`, s, edgePins.pins);
  }
  function smallSensorBoardTemplate(props) {
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const element = props.element || "bead";
    const names = props.pins || (element === "ir" ? ["GND", "VCC", "OUT"] : ["OUT", "VCC", "GND"]);
    const prints = props.labels || (element === "ir" ? ["-", "", "S"] : ["S", "", "-"]);
    const w = 15 * mm;
    const bh = 18.5 * mm;
    const ext = 6 * mm;
    const by = (element === "bead" ? 7 : 0) * mm;
    const h = by + bh + ext;
    const cx = w / 2;
    let s = "";
    const X = function(k) {
      return r2(cx + k * mm);
    };
    const startX = r2((w - (names.length - 1) * p) / 2);
    const maxLen = prints.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const edgePins = edgeHeader(T, { names, side: "bottom", at: by + bh, from: startX, ext });
    const rowY = edgePins.pads[0].y;
    const labelSpan = rotateLabels ? T["pad-radius"] + 1 + maxLen * PIN_LABEL * 0.62 + 1.2 : T["label-rise"] + 3.6;
    const bottom = rowY - labelSpan;
    const frame = function(x, y, fw, fh) {
      return rect(x - 1.2, y - 1.2, fw + 2.4, fh + 2.4, "none", {
        stroke: f.silk,
        "stroke-width": T["stroke-fine"],
        "stroke-opacity": 0.85,
        rx: 0.4
      });
    };
    s += board({
      width: w,
      height: bh,
      y: by,
      finish: fin,
      holes: "top",
      mark: { x: w - 1.4 * p, y: by + 9.6 * mm, size: 0.7 * p }
    });
    const hdr = header({
      x: startX,
      y: rowY,
      labels: prints,
      kind: "print",
      side: "above",
      silk: f.silk,
      rotate: rotateLabels
    });
    edgePins.pads.forEach((pd, i) => {
      s += trace(T, fin, [
        [pd.x, pd.y],
        [pd.x, rowY - 1.1 * p],
        [pd.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p]
      ]);
    });
    let pads = [];
    let padY;
    let resX = 3;
    let resY = 7.4;
    if (element === "bead") {
      const bcy = by - 4.6 * mm;
      padY = by + 8.4 * mm;
      resX = -5.2;
      [X(-1.27), X(1.27)].forEach((x) => {
        s += wire(x, bcy + 1.4 * mm, x, padY);
      });
      s += tag(
        "element",
        el("ellipse", {
          cx,
          cy: r2(bcy),
          rx: 1.5 * mm,
          ry: 1.9 * mm,
          fill: T["plastic-black"],
          stroke: T["plastic-black-edge"],
          "stroke-width": T["stroke-detail"]
        })
      );
      s += el("ellipse", { cx, cy: r2(bcy), rx: 1.5 * mm, ry: 1.9 * mm, fill: sheen("dome"), "fill-opacity": 0.7 });
      pads = [X(-1.27), X(1.27)];
    } else if (element === "ir") {
      const iw = 6.4 * mm;
      const id = 3.2 * mm;
      const itop = by + 2.9 * mm;
      const dr = 2.3 * mm;
      const dd = 2 * mm;
      padY = itop + id / 2;
      resY = 6.8;
      [X(-2.54), X(0), X(2.54)].forEach((x) => {
        s += tag("pad", circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
      });
      s += tag(
        "element",
        rect(
          X(-3.2),
          r2(itop),
          iw,
          id,
          T["plastic-black"],
          Object.assign({ rx: 0.8 }, edge(T, T["plastic-black-edge"]))
        ) + path(
          `M${X(-2.3)} ${r2(itop + 0.2)}A${r2(dr)} ${r2(dd)} 0 0 1 ${X(2.3)} ${r2(itop + 0.2)}Z`,
          T["plastic-black"],
          edge(T, T["plastic-black-edge"], T["stroke-detail"])
        )
      );
      s += bevel(T, X(-3.2), itop, iw, id, 0.8, 0.8) + path(`M${X(-2.3)} ${r2(itop + 0.2)}A${r2(dr)} ${r2(dd)} 0 0 1 ${X(2.3)} ${r2(itop + 0.2)}Z`, sheen("lens"), {
        "fill-opacity": 0.75
      });
      s += frame(cx - 5.2 * mm, by + 7 * mm, 0.6 * p, 0.6 * p) + indicator({
        x: cx - 5.2 * mm,
        y: by + 7 * mm,
        size: 0.6 * p,
        color: "red",
        on: !!(props.indicators && props.indicators.power),
        hook: "power-led",
        state: "power",
        finish: fin
      });
    }
    pads.forEach((x) => {
      s += tag("pad", circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
    });
    s += frame(cx + resX * mm, by + resY * mm, 0.55 * p, 0.9 * p) + smd(T, "resistor", cx + resX * mm, by + resY * mm, false);
    if (props.label)
      s += text(
        cx,
        by + (bh / mm - 6.6) * mm,
        props.label,
        Math.min(5, (w - 2.4 * p) / Math.max(3, props.label.length) * 1.5),
        f.silk
      );
    s += edgePins.svg + hdr.svg;
    const what = element === "bead" ? "Temperature sensor (NTC)" : "IR receiver";
    return art(w, h, props.description || `${what} module`, s, edgePins.pins);
  }
  function sensorModuleTemplate(props) {
    props = props || {};
    const el0 = props.element || "ldr";
    if (el0 === "flame" || el0 === "ldr" || el0 === "mic" || el0 === "cylinder") return comparatorBoardTemplate(props);
    if (el0 === "bead" || el0 === "ir") return smallSensorBoardTemplate(props);
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || (props.comparator ? "blue" : "black");
    const f = finish(T, fin);
    const names = props.pins || ["VCC", "GND", "DO", "AO"];
    const w = (props.widthPitches || 6.5) * p;
    const h = (props.heightPitches || 14) * p;
    const rowY = h - 0.6 * p;
    let s = "";
    const element = props.element || "ldr";
    const cx = w / 2;
    const startX = r2((w - (names.length - 1) * p) / 2);
    const maxLen = names.reduce((m, n) => {
      return Math.max(m, n.length);
    }, 0);
    const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
    const labelSpan = rotateLabels ? T["pad-radius"] + 1 + maxLen * PIN_LABEL * 0.62 + 1.2 : T["label-rise"] + 3.6;
    const bottom = rowY - labelSpan;
    s += board({
      width: w,
      height: h,
      finish: fin,
      holes: w >= 5 * p ? "top" : false,
      mark: w >= 6 * p ? { x: w - 1.4 * p, y: bottom - 1 * p, size: 0.7 * p } : void 0
    });
    const hdr = header({ x: startX, y: rowY, labels: names, side: "above", silk: f.silk, rotate: rotateLabels });
    hdr.pins.forEach((pn, i) => {
      s += trace(T, fin, [
        [pn.x, pn.y],
        [pn.x, rowY - 1.1 * p],
        [pn.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p]
      ]);
    });
    let ey = 2.4 * p;
    if (element === "ldr") {
      const lr = 2.5 * mm;
      ey = 1.2 * p + lr;
      s += wire(cx - 1 * mm, ey + lr - 1, cx - 1 * mm, ey + lr + 1.2 * p) + wire(cx + 1 * mm, ey + lr - 1, cx + 1 * mm, ey + lr + 1.2 * p);
      let track = "";
      for (let k = 0; k < 6; k++) {
        const ty2 = ey - lr * 0.7 + k * lr * 0.28;
        track += `M${r2(cx - lr * 0.62)} ${r2(ty2)}h${r2(lr * 1.24)}${k < 5 ? `m${r2(k % 2 ? -lr * 1.24 : 0)} ${r2(lr * 0.14)}v0` : ""}`;
      }
      s += tag(
        "element",
        circle(cx, ey, lr, T["cap-ceramic"], edge(T, T["resistor-body-edge"], T["stroke-detail"])) + path(track, "none", { stroke: T["resistor-smd"], "stroke-width": 1.1, "stroke-linecap": "round" })
      );
      s += el("ellipse", {
        cx: cx - lr * 0.4,
        cy: ey - lr * 0.45,
        rx: lr * 0.3,
        ry: lr * 0.14,
        fill: "#ffffff",
        "fill-opacity": 0.35,
        transform: `rotate(-30 ${r2(cx - lr * 0.4)} ${r2(ey - lr * 0.45)})`
      });
    } else if (element === "mic") {
      const mr = 4.85 * mm;
      ey = 1 * p + mr;
      s += tag(
        "element",
        circle(cx, ey, mr, T.metal, edge(T, T["metal-edge"])) + circle(cx, ey, mr * 0.75, "#000000", { "fill-opacity": 0.08 }) + circle(cx, ey, mr * 0.22, T.cavity)
      );
      s += el("ellipse", {
        cx: cx - mr * 0.4,
        cy: ey - mr * 0.45,
        rx: mr * 0.35,
        ry: mr * 0.16,
        fill: "#ffffff",
        "fill-opacity": 0.5,
        transform: `rotate(-30 ${r2(cx - mr * 0.4)} ${r2(ey - mr * 0.45)})`
      });
    } else if (element === "bead") {
      ey = 1.6 * p;
      s += wire(cx - 0.9 * mm, ey + 0.8 * mm, cx - 0.9 * mm, ey + 1.4 * p) + wire(cx + 0.9 * mm, ey + 0.8 * mm, cx + 0.9 * mm, ey + 1.4 * p);
      s += tag(
        "element",
        el("ellipse", {
          cx,
          cy: ey,
          rx: 1.5 * mm,
          ry: 1.9 * mm,
          fill: T["plastic-black"],
          stroke: T["plastic-black-edge"],
          "stroke-width": T["stroke-detail"]
        })
      );
      s += el("ellipse", {
        cx: cx - 0.5 * mm,
        cy: ey - 0.7 * mm,
        rx: 0.5 * mm,
        ry: 0.3 * mm,
        fill: "#ffffff",
        "fill-opacity": 0.3
      });
    } else if (element === "cylinder") {
      const cl = Math.min(w - 1.6 * p, 12 * mm);
      const cyl = 4 * mm;
      ey = 1.4 * p + cyl / 2;
      s += tag(
        "element",
        rect(cx - cl / 2, ey - cyl / 2, cl, cyl, T.metal, Object.assign({ rx: cyl / 2 }, edge(T, T["metal-edge"]))) + rect(cx - cl / 2 + 1.5, ey - cyl / 2 + 1.2, cl - 3, cyl * 0.3, "#ffffff", {
          rx: 1,
          "fill-opacity": T["opacity-light"] * 0.6
        }) + rect(cx - cl / 2 + 1.5, ey + cyl * 0.2, cl - 3, cyl * 0.22, "#000000", {
          rx: 1,
          "fill-opacity": T["opacity-shade"]
        })
      );
      s += wire(cx - cl / 2 - 0.6 * p, ey, cx - cl / 2, ey) + wire(cx + cl / 2, ey, cx + cl / 2 + 0.6 * p, ey);
    } else if (element === "ir") {
      const iw = 6.5 * mm;
      const ih = 5.5 * mm;
      ey = 1.2 * p + ih / 2;
      [cx - 1 * p, cx, cx + 1 * p].forEach((x) => {
        s += wire(x, ey + ih / 2 - 1, x, ey + ih / 2 + 1 * p);
      });
      s += tag(
        "element",
        rect(
          cx - iw / 2,
          ey - ih / 2,
          iw,
          ih,
          T["plastic-black"],
          Object.assign({ rx: 1.5 }, edge(T, T["plastic-black-edge"]))
        ) + circle(cx, ey, 2.2 * mm, T["plastic-black"], edge(T, T["plastic-black-edge"], T["stroke-detail"])) + circle(cx, ey, 2.2 * mm, "#ffffff", { "fill-opacity": 0.06 })
      );
      s += el("ellipse", {
        cx: cx - 0.8 * mm,
        cy: ey - 0.9 * mm,
        rx: 0.8 * mm,
        ry: 0.4 * mm,
        fill: "#ffffff",
        "fill-opacity": 0.25,
        transform: `rotate(-30 ${r2(cx - 0.8 * mm)} ${r2(ey - 0.9 * mm)})`
      });
    }
    const ty = ey + (element === "mic" ? 4.85 * mm : element === "cylinder" ? 2 * mm : 2.5 * mm) + 1.3 * p + (element === "bead" || element === "cylinder" ? 0.6 * p : 0);
    if (props.label)
      s += text(cx, ty, props.label, Math.min(5, (w - 1.4 * p) / Math.max(4, props.label.length) * 1.5), f.silk);
    const by = ty + Math.max(0.5 * p, (bottom - ty - 3.8 * p) / 2);
    if (props.comparator && bottom - by >= 3.2 * p) {
      const ch = 1 * p;
      const chx = cx - 1.9 * p;
      const chy = by + 0.4 * p;
      s += tag(
        "chip",
        rect(chx, chy, 1.3 * p, ch, T.chip, Object.assign({ rx: 0.5 }, edge(T, T["chip-edge"], T["stroke-detail"]))) + circle(chx + 2, chy + 2, 0.5, T["chip-print"])
      );
      for (let li = 0; li < 4; li++)
        s += rect(chx + 1.5 + li * 2.6, chy - 1.3, 1.2, 1.3, T.lead, { rx: 0.2 }) + rect(chx + 1.5 + li * 2.6, chy + ch, 1.2, 1.3, T.lead, { rx: 0.2 });
      const tx = cx + 0.5 * p;
      const tsz = 1 * p;
      s += tag(
        "trimmer",
        rect(
          tx,
          by + 0.3 * p,
          tsz,
          tsz,
          T["lens-blue"],
          Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
        ) + circle(tx + tsz / 2, by + 0.3 * p + tsz / 2, 0.28 * p, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + line(
          tx + tsz / 2 - 0.2 * p,
          by + 0.3 * p + tsz / 2,
          tx + tsz / 2 + 0.2 * p,
          by + 0.3 * p + tsz / 2,
          T["metal-edge"],
          T["stroke-fine"]
        )
      );
      const iy = by + 1.9 * p;
      s += indicator({
        x: cx - 1.9 * p,
        y: iy,
        size: 0.6 * p,
        color: "red",
        on: !!(props.indicators && props.indicators.power),
        hook: "power-led",
        state: "power",
        finish: fin
      });
      s += indicator({
        x: cx - 0.7 * p,
        y: iy,
        size: 0.6 * p,
        color: "green",
        on: !!(props.indicators && props.indicators.out),
        hook: "out-led",
        finish: fin
      });
      s += smd(T, "resistor", cx + 0.6 * p, iy - 0.05 * p, true) + smd(T, "resistor", cx + 0.6 * p, iy + 0.55 * p, true);
      if (bottom - (iy + 1.3 * p) >= 1 * p)
        s += smd(T, "capacitor", cx - 1.7 * p, iy + 1.1 * p, true) + smd(T, "resistor", cx + 0.1 * p, iy + 1.1 * p, true);
    } else if (!props.comparator && bottom - by >= 1.4 * p) {
      s += smd(T, "resistor", cx - 1.4 * p, by + 0.2 * p, true) + smd(T, "capacitor", cx + 0.4 * p, by + 0.2 * p, true);
    }
    s += hdr.svg;
    return art(w, h, props.description || `${props.label || "Sensor"} module`, s, hdr.pins);
  }
  function to92Template(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 4 * p;
    const h = 5 * p;
    const names = props.pins || ["GND", "DQ", "VCC"];
    const label = props.label || "DS18B20";
    let s = "";
    const cx = 2 * p;
    const bw = 4.7 * (p / 2.54);
    const bh = 4.6 * (p / 2.54);
    const bx = cx - bw / 2;
    const by = 0.9 * p;
    names.forEach((_, i) => {
      const x = (i + 1) * p;
      const dx = (i - 1) * 1.27 * (p / 2.54);
      const d = `M${r2(cx + dx)} ${r2(by + bh - 1)}V${r2(by + bh + 0.9 * p)}L${r2(x)} ${r2(by + bh + 1.7 * p)}V${r2(h)}`;
      s += tag(
        "leg",
        path(d, "none", {
          stroke: T["lead-edge"],
          "stroke-width": 2.9,
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        }) + path(d, "none", { stroke: T.lead, "stroke-width": 1.9, "stroke-linejoin": "round", "stroke-linecap": "round" })
      );
    });
    s += tag(
      "body",
      path(
        `M${r2(bx)} ${r2(by + bh)}V${r2(by + 2.2)}a2.2 2.2 0 0 1 2.2 -2.2H${r2(bx + bw - 2.2)}a2.2 2.2 0 0 1 2.2 2.2V${r2(by + bh)}Z`,
        T["plastic-black"],
        Object.assign({ "stroke-linejoin": "round" }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += rect(bx + 1.2, by + 1.2, bw - 2.4, 1.6, "#ffffff", { rx: 0.8, "fill-opacity": T["opacity-light"] * 0.5 });
    const cut = /^[A-Za-z]+(?=\d)/.exec(label);
    const a = cut ? label.slice(0, cut[0].length) : label.slice(0, 3);
    const b = cut ? label.slice(cut[0].length) : label.slice(3);
    s += text(cx, by + bh / 2 - 0.4, a, PIN_LABEL, T["chip-print"], { "font-weight": 600 }) + text(cx, by + bh / 2 + PIN_LABEL + 0.2, b, PIN_LABEL, T["chip-print"]);
    return art(
      w,
      h,
      `${label} in a TO-92 package`,
      s,
      names.map((n, i) => {
        return { name: n, x: (i + 1) * p, y: h };
      })
    );
  }
  function dht22Sensor(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const w = 6.5 * p;
    const h = 12 * p;
    const names = props.pins || ["VCC", "SDA", "NC", "GND"];
    let s = "";
    const hw = 15.1 * mm;
    const hh = 25.1 * mm;
    const hx = (w - hw) / 2;
    const hy = 0.4 * p;
    const cx = w / 2;
    const xs = [1.75 * p, 2.75 * p, 3.75 * p, 4.75 * p];
    const Y = function(k) {
      return r2(hy + k * mm);
    };
    const ch = 2.8 * mm;
    const rc = 1.2;
    xs.forEach((x) => {
      s += wire(x, hy + hh - 1, x, h);
    });
    s += tag(
      "housing",
      path(
        `M${r2(hx + ch)} ${r2(hy)}H${r2(hx + hw - ch)}L${r2(hx + hw)} ${Y(3.6)}V${r2(hy + hh - rc)}Q${r2(hx + hw)} ${r2(hy + hh)} ${r2(hx + hw - rc)} ${r2(
          hy + hh
        )}H${r2(hx + rc)}Q${r2(hx)} ${r2(hy + hh)} ${r2(hx)} ${r2(hy + hh - rc)}V${Y(3.6)}Z`,
        T["plastic-white"],
        Object.assign({ "stroke-linejoin": "round" }, edge(T, T["plastic-white-edge"]))
      )
    );
    s += line(r2(hx + ch + 1), r2(hy + 0.9), r2(hx + hw - ch - 1), r2(hy + 0.9), "#ffffff", 0.9, { "stroke-opacity": 0.7 }) + line(r2(hx + 0.4), Y(4.4), r2(hx + hw - 0.4), Y(4.4), T["plastic-white-edge"], T["stroke-fine"], {
      "stroke-opacity": 0.8
    });
    s += circle(cx, Y(2.3), 1.4 * mm, T.hole, edge(T, T["plastic-white-edge"], T["stroke-fine"]));
    const vw = 1.1 * mm;
    const vh = 1 * mm;
    const vent = function(x0, x1, y) {
      return rect(r2(x0), r2(y - vh / 2), r2(x1 - x0), r2(vh), T.cavity, { rx: 0.4, "fill-opacity": 0.85 });
    };
    for (let r = 0; r < 6; r++) {
      const vy = hy + (5.9 + r * 2.45) * mm;
      [-2.25, 0, 2.25].forEach((k) => {
        s += vent(cx + k * mm - vw / 2, cx + k * mm + vw / 2, vy);
      });
      if (r > 0) s += vent(hx - 0.5, hx + 3.7 * mm, vy) + vent(hx + hw - 3.7 * mm, hx + hw + 0.5, vy);
    }
    s += text(cx, Y(21.9), "AM2302", 5.5, T["plastic-white-edge"], { "font-weight": 600 });
    return art(
      w,
      h,
      "DHT22 temperature and humidity sensor",
      s,
      xs.map((x, i) => {
        return { name: names[i], x, y: h };
      })
    );
  }
  function dht11Module(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const names = props.pins || ["GND", "DATA", "VCC"];
    const prints = props.labels || names;
    let s = "";
    const w = 14 * mm;
    const bh = 28 * mm;
    const cx = w / 2;
    const edgePins = edgeHeader(T, { names, side: "bottom", at: bh, from: r2(cx - (names.length - 1) * p / 2) });
    const h = edgePins.pins[0].y;
    s += board({ width: w, height: bh, finish: fin, holes: false, mark: { x: 9.4 * mm, y: 20 * mm, size: 0.6 * p } });
    const hw = 12 * mm;
    const hh = 15.5 * mm;
    const hx = (w - hw) / 2;
    const hy = 0.8 * mm;
    const vw = 1.4 * mm;
    const vh = 1.3 * mm;
    const vent = function(x0, x1, y) {
      return rect(r2(x0), r2(y - vh / 2), r2(x1 - x0), r2(vh), T.cavity, { rx: 0.4, "fill-opacity": 0.8 });
    };
    s += tag(
      "housing",
      rect(hx, hy, hw, hh, T["plastic-blue"], Object.assign({ rx: 1 }, edge(T, T["plastic-blue-edge"])))
    );
    s += bevel(T, hx, hy, hw, hh, 1.6, 1);
    for (let r = 0; r < 5; r++) {
      const vy = hy + (2.6 + r * 2.55) * mm;
      [-2.2, 0, 2.2].forEach((k) => {
        s += vent(cx + k * mm - vw / 2, cx + k * mm + vw / 2, vy);
      });
      if (r > 0) s += vent(hx - 0.5, hx + 2.4 * mm, vy) + vent(hx + hw - 2.4 * mm, hx + hw + 0.5, vy);
    }
    s += tag("hole", circle(cx, 19.6 * mm, 1.5 * mm, T.hole, edge(T, f.edge)));
    s += framed(T, f, "resistor", 1 * mm, 16.9 * mm, false);
    s += rect(1 * mm - 1.2, 20.1 * mm - 1.2, 0.55 * p + 2.4, 0.55 * p + 2.4, "none", {
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85,
      rx: 0.4
    }) + indicator({
      x: 1 * mm,
      y: 20.1 * mm,
      size: 0.55 * p,
      color: "red",
      on: !!(props.indicators && props.indicators.power),
      hook: "power-led",
      state: "power",
      finish: fin
    });
    s += framed(T, f, "resistor", w - 1 * mm - 0.55 * p, 16.9 * mm, false);
    const hdr = header({
      x: edgePins.pads[0].x,
      y: edgePins.pads[0].y,
      labels: prints,
      kind: "print",
      side: "above",
      silk: f.silk
    });
    s += edgePins.svg + hdr.svg;
    return art(w, h, props.description || "DHT11 module", s, edgePins.pins);
  }
  function ultrasonicRanger(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const names = props.pins || ["VCC", "TRIG", "ECHO", "GND"];
    const prints = props.labels || ["Vcc", "Trig", "Echo", "Gnd"];
    const w = 45 * mm;
    const bh = 20 * mm;
    const cx = w / 2;
    const cy = 9.6 * mm;
    const r = 8 * mm;
    let s = "";
    const edgePins = edgeHeader(T, {
      names,
      side: "bottom",
      at: bh,
      from: r2(cx - (names.length - 1) * p / 2),
      back: true
    });
    const h = edgePins.pins[0].y;
    s += board({ width: w, height: bh, finish: fin, holes: false });
    [
      [1.7, 1.7],
      [43.3, 1.7],
      [1.7, 18.3],
      [43.3, 18.3]
    ].forEach((c) => {
      s += tag("hole", circle(c[0] * mm, c[1] * mm, 0.9 * mm, T.hole, edge(T, T.pad)));
    });
    [cx - 13 * mm, cx + 13 * mm].forEach((x) => {
      const m = r * 0.78;
      let weave = "";
      for (let d = -m + 0.5 * mm; d < m; d += 0.5 * mm) {
        const c = Math.sqrt(m * m - d * d);
        weave += line(r2(x - c), r2(cy + d), r2(x + c), r2(cy + d), "#ffffff", T["stroke-fine"]) + line(r2(x + d), r2(cy - c), r2(x + d), r2(cy + c), "#ffffff", T["stroke-fine"]);
      }
      s += tag(
        "can",
        circle(x, cy, r, T.metal, edge(T, T["metal-edge"])) + circle(x, cy, r, sheen("metal"), { "fill-opacity": 0.6 }) + circle(x, cy, r * 0.88, "none", {
          stroke: T["metal-edge"],
          "stroke-width": T["stroke-fine"],
          "stroke-opacity": 0.8
        }) + circle(x, cy, m, T["plastic-black"], edge(T, T["metal-edge"], T["stroke-fine"]))
      );
      s += el("g", { opacity: 0.14 }, weave) + circle(x, cy, m, sheen("dome"), { "fill-opacity": 0.25 });
    });
    s += tag(
      "crystal",
      rect(
        cx - 4 * mm,
        1.3 * mm,
        8 * mm,
        3.2 * mm,
        T.metal,
        Object.assign({ rx: 1.6 * mm }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + rect(cx - 3.2 * mm, 1.8 * mm, 6.4 * mm, 0.7 * mm, "#ffffff", {
        rx: 0.35 * mm,
        "fill-opacity": T["opacity-light"] * 0.6
      })
    );
    s += text(cx, 8.6 * mm, props.label || "HC-SR04", 5, f.silk, { "font-weight": 600 });
    s += text(4.4 * mm, 19 * mm, "T", PIN_LABEL, f.silk) + text(w - 4.4 * mm, 19 * mm, "R", PIN_LABEL, f.silk);
    const hdr = header({
      x: edgePins.pads[0].x,
      y: edgePins.pads[0].y,
      labels: prints,
      kind: "print",
      side: "above",
      silk: f.silk,
      rotate: true
    });
    s += edgePins.svg + hdr.svg;
    return art(w, h, props.description || "Ultrasonic distance sensor (HC-SR04)", s, edgePins.pins);
  }
  function bmp180Board(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const variant = props.variant === "gy68" ? "gy68" : "five-pin";
    let s = "";
    const M = function(k) {
      return r2(k * mm);
    };
    const lga = function(x, y) {
      const hw = 1.8 * mm;
      const hh = 1.9 * mm;
      return tag(
        "chip",
        rect(
          x - hw,
          y - hh,
          2 * hw,
          2 * hh,
          T.metal,
          Object.assign({ rx: 1 }, edge(T, T["metal-edge"], T["stroke-detail"]))
        ) + rect(x - hw + 0.5, y - hh + 0.5, 2 * hw - 1, 0.9, "#ffffff", {
          rx: 0.4,
          "fill-opacity": T["opacity-light"] * 0.5
        }) + circle(x + hw * 0.45, y + hh * 0.45, hw * 0.2, T.cavity)
      ) + text(x, y + 1.4, "244", 4, T["chip-edge"], { "fill-opacity": 0.8 });
    };
    const regulator = function(x, y) {
      const bw = 2.9 * mm;
      const bh = 1.3 * mm;
      const r = rect(x - 0.5 * mm, y - bh / 2 - 0.55 * mm, 1 * mm, 0.55 * mm, T.lead, { rx: 0.2 }) + rect(x - 1.45 * mm, y + bh / 2, 1 * mm, 0.55 * mm, T.lead, { rx: 0.2 }) + rect(x + 0.45 * mm, y + bh / 2, 1 * mm, 0.55 * mm, T.lead, { rx: 0.2 });
      return tag(
        "smd",
        r + rect(
          x - bw / 2,
          y - bh / 2,
          bw,
          bh,
          T.chip,
          Object.assign({ rx: 0.4 }, edge(T, T["chip-edge"], T["stroke-detail"]))
        ) + text(x, y + 1.4, "662K", 4, T["chip-print"])
      );
    };
    if (variant === "gy68") {
      const w = 10 * mm;
      const h = 12.5 * mm;
      const names = props.pins || ["SDA", "SCL", "GND", "VCC"];
      s += board({ width: w, height: h, finish: fin, holes: false });
      const hdr = header({ x: r2((w - (names.length - 1) * p) / 2), y: M(1.6), count: names.length });
      hdr.pins.forEach((pn, i) => {
        pn.name = names[i];
      });
      s += smd(T, "resistor", M(0.3), M(3.45), false) + smd(T, "capacitor", M(2), M(3.45), false) + regulator(M(5.7), M(4.6)) + smd(T, "capacitor", M(8.3), M(3.45), false);
      s += text(M(6.9), M(7.3), "BMP180", 4.6, f.silk, { "font-weight": 600 });
      s += lga(M(2.2), M(9.4));
      s += mountHole(T, f, M(7.1), M(9.7), 1.5 * mm);
      s += hdr.svg;
      return art(w, h, "BMP180 breakout (GY-68)", s, hdr.pins);
    }
    const w2 = 15 * mm;
    const h2 = 13 * mm;
    const names2 = props.pins || ["VCC", "GND", "SCL", "SDA", "3.3V"];
    const py = r2((h2 - (names2.length - 1) * p) / 2);
    s += board({ width: w2, height: h2, finish: fin, holes: false });
    s += rect(M(0.35), M(0.35), M(6.6), h2 - M(0.7), "none", {
      rx: 0.6,
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85
    });
    const hdr2 = header({ x: M(1.4), y: py, axis: "y", labels: names2, side: "right", silk: f.silk, size: 4.6 });
    s += framed(T, f, "capacitor", M(7.2), M(1.9), true) + regulator(M(8.4), M(5.6)) + framed(T, f, "capacitor", M(7.2), M(7.3), true) + framed(T, f, "resistor", M(7.2), M(9.3), true) + framed(T, f, "resistor", M(7.2), M(11.1), true);
    s += framed(T, f, "capacitor", M(10.9), M(6.4), true);
    s += mountHole(T, f, M(12.8), M(2.7), 1.6 * mm);
    s += rect(M(10.3), M(8.4), M(4.2), M(4.1), "none", {
      rx: 0.4,
      stroke: f.silk,
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.85
    }) + lga(M(12.4), M(10.45));
    s += hdr2.svg;
    return art(w2, h2, "BMP180 breakout", s, hdr2.pins);
  }
  function pirModule(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "green";
    const f = finish(T, fin);
    const w = 12.5 * p;
    const h = 10 * p;
    const names = props.pins || ["GND", "OUT", "VCC"];
    let s = "";
    const cx = w / 2;
    const cy = 4.3 * p;
    const r = 4 * p;
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 0.5 * p, y: 1.4 * p, size: 0.7 * p } });
    [
      [0.7 * p, 4.6 * p],
      [w - 0.7 * p, 4.6 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(T, fin, f, { x: 5.25 * p, y: h - 0.6 * p, labels: names, side: "above", silk: f.silk }, -1);
    s += tag(
      "dome",
      rect(
        cx - r,
        cy - r,
        2 * r,
        2 * r,
        T["plastic-white"],
        Object.assign({ rx: 1.2, "fill-opacity": 0.9 }, edge(T, T["plastic-white-edge"], T["stroke-fine"]))
      ) + circle(cx, cy, r, T["plastic-white"], edge(T, T["plastic-white-edge"]))
    );
    s += circle(cx, cy, r * 0.52, "none", { stroke: T["plastic-white-edge"], "stroke-width": T["stroke-fine"] }) + circle(cx, cy, r * 0.8, "none", {
      stroke: T["plastic-white-edge"],
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.7
    });
    let cuts = "";
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3 + Math.PI / 6;
      cuts += `M${r2(cx + Math.cos(a) * r * 0.52)} ${r2(cy + Math.sin(a) * r * 0.52)}L${r2(cx + Math.cos(a) * r * 0.98)} ${r2(cy + Math.sin(a) * r * 0.98)}`;
    }
    s += path(cuts, "none", { stroke: T["plastic-white-edge"], "stroke-width": T["stroke-fine"] }) + circle(cx, cy, 1.2, T["plastic-white-edge"]);
    s += circle(cx, cy, r, sheen("dome"), { "fill-opacity": 0.55 });
    s += hdr.svg;
    return art(w, h, "PIR motion sensor module", s, hdr.pins);
  }
  function gasModuleTemplate(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "blue";
    const f = finish(T, fin);
    const w = 8 * p;
    const bh = 13 * p;
    const h = bh + 6 * mm;
    const names = props.pins || ["VCC", "GND", "DO", "AO"];
    const prints = props.labels || names;
    let s = "";
    const cx = w / 2;
    const cy = 4.2 * p;
    const rr = 9 * mm;
    const rm = 8 * mm;
    s += board({ width: w, height: bh, finish: fin, holes: false, mark: { x: w - 1.3 * p, y: 9.6 * p, size: 0.7 * p } });
    [
      [0.75 * p, 8.7 * p],
      [w - 0.75 * p, 8.7 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const edgePins = edgeHeader(T, { names, side: "bottom", at: bh, from: 2.5 * p });
    const hdr = padRow(
      T,
      fin,
      f,
      {
        x: 2.5 * p,
        y: edgePins.pads[0].y,
        labels: prints,
        kind: "print",
        side: "above",
        silk: f.silk,
        rotate: prints.some((n) => {
          return n.length > 3;
        })
      },
      -1
    );
    s += tag(
      "can",
      circle(cx, cy, rr, T["plastic-black"], edge(T, T["plastic-black-edge"])) + circle(cx, cy, rm, T.metal, edge(T, T["metal-edge"]))
    );
    let mesh = "";
    for (let k = -6; k <= 6; k++) {
      const d = k * rm / 6.5;
      const c = Math.sqrt(Math.max(0, rm * rm - d * d)) * 0.985;
      mesh += `M${r2(cx - c)} ${r2(cy + d)}H${r2(cx + c)}M${r2(cx + d)} ${r2(cy - c)}V${r2(cy + c)}`;
    }
    s += path(mesh, "none", { stroke: T["metal-edge"], "stroke-width": 0.5, "stroke-opacity": 0.75 });
    s += circle(cx, cy, rm, sheen("metal"), { "fill-opacity": 0.55 });
    s += text(cx, 9.9 * p, props.label || "MQ-2", 4.6, f.silk, { "font-weight": 600 });
    if (props.indicators) {
      const isz = 0.6 * p;
      const ly = 8.1 * p;
      const tag2 = { "text-anchor": "start", "dominant-baseline": "middle" };
      s += indicator({
        x: 2 * p,
        y: ly,
        size: isz,
        color: "red",
        on: !!props.indicators.power,
        hook: "power-led",
        state: "power",
        finish: fin
      }) + text(2 * p + isz + 1.6, ly + isz / 2, "PWR", 4, f.silk, tag2);
      s += indicator({
        x: 4.6 * p,
        y: ly,
        size: isz,
        color: "green",
        on: !!props.indicators.out,
        hook: "out-led",
        finish: fin
      }) + text(4.6 * p + isz + 1.6, ly + isz / 2, "DO", 4, f.silk, tag2);
    }
    s += edgePins.svg + hdr.svg;
    return art(w, h, `${props.label || "MQ-2"} gas sensor module`, s, edgePins.pins);
  }
  function hx711Board(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const fin = props.finish || "red";
    const f = finish(T, fin);
    const w = 12 * p;
    const h = 9.5 * p;
    let s = "";
    const names = props.pins || ["VCC", "DT", "SCK", "GND"];
    const cells = props.cellPads || ["RED", "BLK", "WHT", "GRN", "YLW"];
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 5.6 * p, y: 7.5 * p, size: 0.7 * p } });
    [
      [1 * p, 0.8 * p],
      [w - 1 * p, 0.8 * p],
      [1 * p, h - 0.8 * p],
      [w - 1 * p, h - 0.8 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const left = padRow(
      T,
      fin,
      f,
      { x: 1 * p, y: 2 * p, axis: "y", labels: cells, kind: "pad", side: "right", silk: f.silk, size: PIN_LABEL },
      1
    );
    const right = padRow(
      T,
      fin,
      f,
      {
        x: w - 1 * p,
        y: 2 * p,
        axis: "y",
        labels: ["VDD"].concat(names),
        kind: "pad",
        side: "left",
        silk: f.silk,
        size: PIN_LABEL
      },
      -1
    );
    s += soicAcross(T, 4.3 * p, 4.25 * p, 3.9 * p, 1.55 * p, 8, "HX711");
    s += capTop(T, 7.9 * p, 1.5 * p, 0.6 * p) + capTop(T, 9 * p, 2.9 * p, 0.6 * p);
    [
      [3.2, 2.1],
      [3.2, 2.9],
      [3.2, 3.7],
      [3.2, 4.5]
    ].forEach((q) => {
      s += framed(T, f, "resistor", q[0] * p, q[1] * p, true);
    });
    s += framed(T, f, "resistor", 4.8 * p, 1.2 * p, true) + framed(T, f, "capacitor", 5.9 * p, 1.2 * p, true) + framed(T, f, "resistor", 8.8 * p, 4.75 * p, true) + framed(T, f, "capacitor", 3.4 * p, 6.4 * p, true) + framed(T, f, "resistor", 4.5 * p, 6.4 * p, true);
    s += text(4.2 * p, 8.7 * p, "LOAD CELL AMP", 4.4, f.silk, { "text-anchor": "start", "font-weight": 600 });
    s += left.svg + right.svg;
    return art(w, h, "HX711 load cell amplifier", s, right.pins.slice(1).concat([right.pins[0]]).concat(left.pins));
  }
  function pulseSensor(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = "black";
    const f = finish(T, fin);
    const r = 8 * mm;
    const w = 7 * p;
    const h = 2 * r + 2.6 * p;
    const cx = 3.5 * p;
    const cy = 0.3 * p + r;
    let s = "";
    const xs = [2.5 * p, 3.5 * p, 4.5 * p];
    const names = props.pins || ["GND", "VCC", "OUT"];
    xs.forEach((x) => {
      s += wire(x, cy + r - 2, x, h);
    });
    s += tag("board", circle(cx, cy, r, f.board, edge(T, f.edge)));
    s += circle(cx, cy, r, sheen("lens"), { "fill-opacity": 0.25 });
    const hr = r * 0.62;
    const heart = `M${r2(cx)} ${r2(cy + hr * 0.85)}C${r2(cx - hr * 1.5)} ${r2(cy - hr * 0.15)} ${r2(cx - hr * 0.95)} ${r2(cy - hr * 1.15)} ${r2(cx)} ${r2(cy - hr * 0.35)}C${r2(cx + hr * 0.95)} ${r2(cy - hr * 1.15)} ${r2(cx + hr * 1.5)} ${r2(cy - hr * 0.15)} ${r2(cx)} ${r2(cy + hr * 0.85)}Z`;
    s += path(heart, f.silk, { "fill-opacity": 0.92 });
    [
      [cx - r * 0.78, cy - r * 0.1],
      [cx + r * 0.78, cy + r * 0.1]
    ].forEach((c) => {
      s += circle(c[0], c[1], 1, T.hole, edge(T, T.pad, T["stroke-fine"]));
    });
    s += indicator({
      x: cx - 0.3 * p,
      y: cy - 0.75 * p,
      size: 0.6 * p,
      color: "green",
      on: !!props.on,
      hook: "pulse-led",
      finish: "white"
    });
    s += tag(
      "sensor",
      rect(
        cx - 0.35 * p,
        cy + 0.05 * p,
        0.7 * p,
        0.5 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.3 }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
      )
    );
    return art(
      w,
      h,
      `Pulse sensor${props.on ? ", lit" : ""}`,
      s,
      xs.map((x, i) => {
        return { name: names[i], x, y: h };
      })
    );
  }
  function lamps(props) {
    const ind = props && props.indicators || {};
    return { power: ind.power === true, out: ind.out === true };
  }
  function finishOf(props, own) {
    return props && props.finish || own;
  }
  function lightSensor(props) {
    return sensorModuleTemplate({
      element: "ldr",
      comparator: true,
      pins: ["VCC", "GND", "DO", "AO"],
      indicators: lamps(props),
      finish: finishOf(props)
    });
  }
  function flameSensor(props) {
    return sensorModuleTemplate({
      element: "flame",
      comparator: true,
      pins: ["VCC", "GND", "DOUT", "AOUT"],
      labels: ["VCC", "GND", "DO", "AO"],
      indicators: lamps(props),
      finish: finishOf(props)
    });
  }
  function tiltSwitch(props) {
    return sensorModuleTemplate({
      element: "cylinder",
      comparator: true,
      pins: ["GND", "VCC", "OUT"],
      indicators: lamps(props),
      finish: finishOf(props)
    });
  }
  function soundSensor(props) {
    return sensorModuleTemplate({
      element: "mic",
      comparator: true,
      micMm: props && props.small ? 6 : 9.7,
      pins: ["AOUT", "GND", "VCC", "DOUT"],
      labels: ["AO", "G", "+", "DO"],
      indicators: lamps(props),
      finish: finishOf(props)
    });
  }
  function ntcSensor(props) {
    return sensorModuleTemplate({
      element: "bead",
      pins: ["OUT", "VCC", "GND"],
      label: "KY-013",
      finish: finishOf(props)
    });
  }
  function irReceiver(props) {
    return sensorModuleTemplate({ element: "ir", pins: ["GND", "VCC", "DAT"], label: "KY-022", finish: finishOf(props) });
  }
  function gasSensor(props) {
    return gasModuleTemplate({
      pins: ["VCC", "GND", "DOUT", "AOUT"],
      labels: ["VCC", "GND", "DO", "AO"],
      indicators: lamps(props),
      finish: finishOf(props)
    });
  }
  function ds18b20Sensor() {
    return to92Template({ label: "DS18B20", pins: ["GND", "DQ", "VDD"] });
  }
  function mpu6050Imu(props) {
    return moduleTemplate({
      label: "MPU6050",
      pins: ["VCC", "GND", "SCL", "SDA", "XDA", "XCL", "AD0", "INT"],
      part: "chip",
      ic: "qfn",
      width: 21,
      height: 16,
      finish: finishOf(props, "blue")
    });
  }
  var init_sensors = __esm({
    "src/sensors.js"() {
      init_core();
      init_pieces();
      init_modules();
    }
  });

  // src/families/sensors.js
  var sensors_exports = {};
  __export(sensors_exports, {
    bmp180Board: () => bmp180Board,
    dht11Module: () => dht11Module,
    dht22Sensor: () => dht22Sensor,
    ds18b20Sensor: () => ds18b20Sensor,
    flameSensor: () => flameSensor,
    gasSensor: () => gasSensor,
    irReceiver: () => irReceiver,
    lightSensor: () => lightSensor,
    mpu6050Imu: () => mpu6050Imu,
    ntcSensor: () => ntcSensor,
    pirModule: () => pirModule,
    pulseSensor: () => pulseSensor,
    soundSensor: () => soundSensor,
    tiltSwitch: () => tiltSwitch,
    ultrasonicRanger: () => ultrasonicRanger
  });
  var init_sensors2 = __esm({
    "src/families/sensors.js"() {
      init_sensors();
    }
  });

  // src/inputs.js
  function pushbutton(props) {
    props = props || {};
    const small = props.size === 6;
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const w = small ? 4 * p : 6 * p;
    const h = small ? 3.6 * p : 5.4 * p;
    let s = "";
    let cap2 = lensColor(T, props.cap || "black");
    const pressed = !!props.pressed;
    const c = { x: w / 2, y: h / 2 };
    if (props.cap === "black" || !props.cap) cap2 = T["plastic-black"];
    const legs = small ? [
      [c.x - 1.5 * p, c.y - p],
      [c.x + 1.5 * p, c.y - p],
      [c.x - 1.5 * p, c.y + p],
      [c.x + 1.5 * p, c.y + p]
    ] : [
      [0.5 * p, c.y - p],
      [5.5 * p, c.y - p],
      [0.5 * p, c.y + p],
      [5.5 * p, c.y + p]
    ];
    const half = (small ? 3 : 6) * mm;
    legs.forEach((l) => {
      const left = l[0] < c.x;
      s += wire(l[0], l[1], left ? c.x - half + 1 : c.x + half - 1, l[1]) + tag("leg", rect(l[0] - 1.6, l[1] - 1.6, 3.2, 3.2, T.lead, { rx: 0.5 }));
    });
    s += tag(
      "body",
      rect(
        c.x - half,
        c.y - half,
        2 * half,
        2 * half,
        T["plastic-black"],
        Object.assign({ rx: 2 }, edge(T, T["plastic-black-edge"]))
      )
    );
    const inset = small ? 1.2 : 2.2;
    s += rect(
      c.x - half + inset,
      c.y - half + inset,
      2 * half - 2 * inset,
      2 * half - 2 * inset,
      T.metal,
      Object.assign({ rx: 1.4 }, edge(T, T["metal-edge"], T["stroke-detail"]))
    );
    if (!small)
      [
        [c.x - half + 2.2, c.y],
        [c.x + half - 2.2, c.y]
      ].forEach((t, j) => {
        const i = j + 2;
        s += rect(
          t[0] - (i < 2 ? 2.8 : 1.2),
          t[1] - (i < 2 ? 1.2 : 2.8),
          i < 2 ? 5.6 : 2.4,
          i < 2 ? 2.4 : 5.6,
          T["metal-edge"],
          { rx: 0.5 }
        );
      });
    const r = (small ? 1.75 : 3.5) * mm;
    const ring = small ? 1.2 : 2.4;
    s += circle(c.x, c.y, r + ring, T["plastic-black-edge"]);
    s += circle(c.x, c.y, r + ring * 0.6, T.metal, edge(T, T["metal-edge"], T["stroke-fine"]));
    s += circle(c.x + 0.6, c.y + 0.9, r, "#000000", { "fill-opacity": pressed ? 0.45 : 0.3 });
    s += circle(
      c.x,
      c.y,
      pressed ? r * 0.92 : r,
      cap2,
      Object.assign(
        {
          "data-hook": "cap",
          "data-pressed": pressed ? "true" : void 0,
          "data-axis": "y",
          "data-travel": 1.2,
          "data-cx": r2(c.x),
          "data-cy": r2(c.y)
        },
        edge(T, T["plastic-black-edge"], T["stroke-detail"])
      )
    );
    s += circle(c.x, c.y, (pressed ? r * 0.92 : r) - 2.2, "#000000", { "fill-opacity": pressed ? 0.18 : 0.08 });
    s += path(
      `M${r2(c.x - r * 0.62)} ${r2(c.y - r * 0.3)}A${r2(r * 0.7)} ${r2(r * 0.7)} 0 0 1 ${r2(c.x - r * 0.2)} ${r2(c.y - r * 0.66)}`,
      "none",
      { stroke: "#ffffff", "stroke-width": 1.4, "stroke-linecap": "round", "stroke-opacity": pressed ? 0.14 : 0.3 }
    );
    return art(
      w,
      h,
      (small ? "6 mm pushbutton" : "Pushbutton") + (pressed ? ", pressed" : ""),
      s,
      legs.map((l, i) => {
        return { name: ["1", "1.2", "2", "2.2"][i], x: l[0], y: l[1] };
      })
    );
  }
  function potentiometer(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 4 * p;
    const h = 5 * p;
    let s = "";
    const pos = Math.max(0, Math.min(1, props.position === void 0 ? 0.5 : Number(props.position)));
    const angle = -135 + pos * 270;
    const cx = 2 * p;
    const cy = 2 * p;
    [p, 2 * p, 3 * p].forEach((x) => {
      s += wire(x, 3.6 * p, x, h) + tag(
        "tab",
        rect(
          x - 2.4,
          3.45 * p,
          4.8,
          0.5 * p,
          T.metal,
          Object.assign({ rx: 0.4 }, edge(T, T["metal-edge"], T["stroke-fine"]))
        )
      );
    });
    s += tag(
      "body",
      rect(
        0.25 * p,
        0.25 * p,
        3.5 * p,
        3.5 * p,
        T["plastic-grey"],
        Object.assign({ rx: 2 }, edge(T, T["plastic-grey-edge"]))
      )
    );
    s += rect(0.25 * p, 0.25 * p, 3.5 * p, 3.5 * p, "#000000", { rx: 2, "fill-opacity": 0.08 });
    const ra = 1.62 * p;
    const a0 = (-135 - 90) * Math.PI / 180;
    const a1 = (135 - 90) * Math.PI / 180;
    s += path(
      `M${r2(cx + ra * Math.cos(a0))} ${r2(cy + ra * Math.sin(a0))}A${r2(ra)} ${r2(ra)} 0 1 1 ${r2(cx + ra * Math.cos(a1))} ${r2(cy + ra * Math.sin(a1))}`,
      "none",
      { stroke: T["chip-print"], "stroke-width": 0.6, "stroke-opacity": 0.6, "stroke-linecap": "round" }
    );
    const rk = 1.35 * p;
    let knurl = "";
    for (let k = 0; k < 28; k++) {
      const a = k * Math.PI * 2 / 28;
      knurl += `M${r2(cx + Math.cos(a) * (rk - 0.3))} ${r2(cy + Math.sin(a) * (rk - 0.3))}L${r2(cx + Math.cos(a) * (rk + 0.9))} ${r2(cy + Math.sin(a) * (rk + 0.9))}`;
    }
    s += el(
      "g",
      {
        "data-hook": "knob",
        "data-part": "knob",
        "data-cx": r2(cx),
        "data-cy": r2(cy),
        "data-angle": r2(angle),
        transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`
      },
      circle(cx, cy, rk + 1.1, T["plastic-black-edge"]) + path(knurl, "none", { stroke: T["plastic-black"], "stroke-width": 1.1, "stroke-linecap": "round" }) + circle(cx, cy, rk, T["plastic-black"], edge(T, T["plastic-black-edge"], T["stroke-detail"])) + circle(cx, cy, rk, sheen("lens"), { "fill-opacity": 0.5 }) + path(
        `M${r2(cx - 0.42 * p)} ${r2(cy - 0.26 * p)}A${r2(0.5 * p)} ${r2(0.5 * p)} 0 1 0 ${r2(cx + 0.42 * p)} ${r2(cy - 0.26 * p)}Z`,
        T.metal,
        edge(T, T["metal-edge"], T["stroke-fine"])
      ) + line(cx, cy - 0.55 * p, cx, cy - rk + 0.5, T["chip-print"], 1.6)
    );
    s += path(
      `M${r2(cx - rk * 0.7)} ${r2(cy - rk * 0.25)}A${r2(rk * 0.75)} ${r2(rk * 0.75)} 0 0 1 ${r2(cx - rk * 0.25)} ${r2(cy - rk * 0.7)}`,
      "none",
      { stroke: "#ffffff", "stroke-width": 1.2, "stroke-linecap": "round", "stroke-opacity": 0.22 }
    );
    return art(w, h, `Potentiometer at ${Math.round(pos * 100)}%`, s, [
      { name: "GND", x: p, y: h },
      { name: "SIG", x: 2 * p, y: h },
      { name: "VCC", x: 3 * p, y: h }
    ]);
  }
  function slideSwitch(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 4 * p;
    const h = 3 * p;
    let s = "";
    const pos = props.contact === 3 ? 2 : 1;
    [p, 2 * p, 3 * p].forEach((x) => {
      s += wire(x, 1.9 * p, x, h) + rect(x - 2.2, 1.85 * p, 4.4, 0.35 * p, T["metal-edge"], { rx: 0.4 });
    });
    s += tag(
      "ear",
      rect(
        0.15 * p,
        0.85 * p,
        0.3 * p,
        0.8 * p,
        T.metal,
        Object.assign({ rx: 0.4 }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + circle(0.3 * p, 1.25 * p, 0.9, T.hole)
    ) + tag(
      "ear",
      rect(
        3.55 * p,
        0.85 * p,
        0.3 * p,
        0.8 * p,
        T.metal,
        Object.assign({ rx: 0.4 }, edge(T, T["metal-edge"], T["stroke-fine"]))
      ) + circle(3.7 * p, 1.25 * p, 0.9, T.hole)
    );
    s += tag(
      "body",
      rect(0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, T.metal, Object.assign({ rx: 1 }, edge(T, T["metal-edge"])))
    );
    s += bevel(T, 0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, 1.2) + rect(0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, sheen("metal"), { rx: 1, "fill-opacity": 0.5 });
    s += rect(0.9 * p, 0.75 * p, 2.2 * p, 1 * p, T["plastic-black-edge"], { rx: 0.6 });
    const lx = pos === 1 ? 1 * p : 2.1 * p;
    s += el(
      "g",
      {
        "data-hook": "lever",
        "data-part": "lever",
        "data-position": pos,
        "data-axis": "x",
        "data-travel": r2(1.1 * p),
        transform: `translate(${r2(lx)} 0)`
      },
      rect(
        0,
        0.5 * p,
        0.9 * p,
        1.5 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.6 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      ) + path(
        `M${r2(0.25 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}M${r2(0.45 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}M${r2(0.65 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}`,
        "none",
        { stroke: "#ffffff", "stroke-width": 0.5, "stroke-opacity": 0.25 }
      )
    );
    return art(w, h, `Slide switch, middle pin to pin ${pos === 2 ? 3 : 1}`, s, [
      { name: "1", x: p, y: h },
      { name: "2", x: 2 * p, y: h },
      { name: "3", x: 3 * p, y: h }
    ]);
  }
  function dipSwitch(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const n = Math.max(1, Math.min(12, Number(props.count) || 8));
    const values = props.values || [];
    let s = "";
    const w = (n + 1) * p;
    const cy = 2.3 * p;
    const h = 4.6 * p;
    const bodyX = 0.5 * p;
    const bodyW = n * p;
    const bodyY = cy - 1.25 * p;
    const bodyH = 2.5 * p;
    const pins = [];
    for (let i = 0; i < n; i++) {
      const x = (i + 1) * p;
      s += rect(x - 1.1, cy - 1.5 * p, 2.2, 1.5 * p - bodyH / 2 + 0.6, T.lead, { rx: 0.3 }) + rect(x - 1.1, cy + bodyH / 2 - 0.6, 2.2, 1.5 * p - bodyH / 2 + 0.6, T.lead, { rx: 0.3 });
      pins.push({ name: `${i + 1}a`, x, y: cy + 1.5 * p });
    }
    for (let j = n - 1; j >= 0; j--) pins.push({ name: `${j + 1}b`, x: (j + 1) * p, y: cy - 1.5 * p });
    s += tag(
      "body",
      rect(bodyX, bodyY, bodyW, bodyH, T["plastic-red"], Object.assign({ rx: 1.2 }, edge(T, T["plastic-red-edge"])))
    );
    s += bevel(T, bodyX, bodyY, bodyW, bodyH, 1.4);
    s += text(bodyX + 0.2 * p, bodyY + 0.46 * p, "ON", PIN_LABEL, T["plastic-white"], {
      "text-anchor": "start",
      "font-weight": 600
    });
    for (let k = 0; k < n; k++) {
      const kx = (k + 1) * p;
      const on2 = !!values[k];
      s += rect(kx - 0.25 * p, cy - 0.65 * p, 0.5 * p, 1.3 * p, T["plastic-red-edge"], { rx: 0.8, "data-slot": k + 1 });
      s += el(
        "g",
        {
          "data-hook": `lever-${k + 1}`,
          "data-part": "lever",
          "data-on": on2 ? "true" : "false",
          "data-axis": "y",
          "data-travel": r2(0.65 * p)
        },
        rect(
          kx - 0.2 * p,
          on2 ? cy - 0.6 * p : cy + 0.05 * p,
          0.4 * p,
          0.55 * p,
          T["plastic-white"],
          Object.assign({ rx: 0.6 }, edge(T, T["plastic-white-edge"], T["stroke-fine"]))
        )
      );
      s += text(kx, bodyY + bodyH - 0.12 * p, String(k + 1), PIN_LABEL, T["plastic-white"], { "font-weight": 600 });
    }
    return art(w, h, `${n}-position DIP switch`, s, pins);
  }
  function joystick(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const ext = 6 * mm;
    const bw = 34 * mm;
    const h = 26 * mm;
    const w = ext + bw;
    let s = "";
    const jx = Math.max(-1, Math.min(1, Number(props.x) || 0));
    const jy = Math.max(-1, Math.min(1, Number(props.y) || 0));
    const names = props.pins || ["GND", "VCC", "HORZ", "VERT", "SEL"];
    const prints = props.labels || (props.pins ? props.pins : ["GND", "+5V", "VRx", "VRy", "SW"]);
    let pins = [];
    s += el(
      "g",
      { transform: `translate(${r2(ext)} 0)` },
      board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 8 * mm, y: 22.4 * mm, size: 0.8 * p } })
    );
    [
      [ext + 4.5 * mm, 3 * mm],
      [ext + 4.5 * mm, h - 3 * mm],
      [w - 3 * mm, 3 * mm],
      [w - 3 * mm, h - 3 * mm]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], 1.6 * mm, T.hole, edge(T, T.pad)));
    });
    s += text(w - 1 * mm, h / 2, "KY-023", 4.4, f.silk, { transform: `rotate(-90 ${r2(w - 1 * mm)} ${r2(h / 2)})` });
    const hdr = edgeHeader(T, { names, side: "left", at: ext, from: h / 2 - 2 * p, ext });
    s += hdr.svg;
    hdr.pads.forEach((pd, i) => {
      s += text(pd.x + 1.2 * mm, pd.y + 1.4, prints[i], PIN_LABEL, f.silk, { "text-anchor": "start" });
    });
    pins = hdr.pins;
    const cx = ext + 19.5 * mm;
    const cy = h / 2;
    const travel = 0.7 * p;
    const dx = jx * travel;
    const dy = -jy * travel;
    s += circle(cx + 0.5 * mm, cy + 0.6 * mm, 12.1 * mm, "#000000", { "fill-opacity": 0.3 });
    s += el(
      "g",
      { "data-hook": "boot", "data-part": "boot", transform: `translate(${r2(dx / 3)} ${r2(dy / 3)})` },
      circle(cx, cy, 12 * mm, T["plastic-black"], edge(T, T["plastic-black-edge"])) + circle(cx, cy, 12 * mm, sheen("dome"), { "fill-opacity": 0.3 })
    );
    s += el(
      "g",
      {
        "data-hook": "stick",
        "data-part": "stick",
        "data-x": r2(jx),
        "data-y": r2(jy),
        "data-axis": "xy",
        "data-travel": r2(travel),
        "data-cx": r2(cx),
        "data-cy": r2(cy),
        transform: `translate(${r2(dx)} ${r2(dy)})`
      },
      circle(cx, cy, 9.4 * mm, "#000000", { "fill-opacity": 0.3 }) + circle(
        cx,
        cy,
        9 * mm,
        T["plastic-black"],
        Object.assign(
          { "data-hook": "cap", "data-pressed": props.pressed ? "true" : void 0 },
          edge(T, T["plastic-black-edge"])
        )
      ) + circle(cx, cy, 9 * mm, sheen("dome"), { "fill-opacity": 0.22 }) + circle(cx, cy, 7.2 * mm, "#000000", {
        "fill-opacity": props.pressed ? 0.3 : 0.18,
        stroke: "#ffffff",
        "stroke-opacity": 0.1,
        "stroke-width": T["stroke-fine"]
      })
    );
    return art(
      w,
      h,
      `Joystick${jx || jy ? ` at ${r2(jx)}, ${r2(jy)}` : " centred"}${props.pressed ? ", pressed" : ""}`,
      s,
      pins
    );
  }
  function keypad(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const rows = props.rows || 4;
    const cols = props.cols || 4;
    const legends = props.keys || [
      ["1", "2", "3", "A"],
      ["4", "5", "6", "B"],
      ["7", "8", "9", "C"],
      ["*", "0", "#", "D"]
    ];
    const pressed = props.pressed || [];
    const pitch = 5.6 * p;
    const key = 3.9 * p;
    const sheetW = (cols - 1) * pitch + key + 6.6 * p;
    const sheetH = (rows - 1) * pitch + key + 8.2 * p;
    const tailW = (rows + cols + 1) * p;
    const w = sheetW;
    const h = sheetH + 3.5 * p;
    let s = "";
    s += tag(
      "body",
      rect(
        T["board-inset"],
        T["board-inset"],
        sheetW - 2 * T["board-inset"],
        sheetH - 2 * T["board-inset"],
        T["plastic-black"],
        Object.assign({ rx: 1.2 * p }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += bevel(
      T,
      T["board-inset"],
      T["board-inset"],
      sheetW - 2 * T["board-inset"],
      sheetH - 2 * T["board-inset"],
      2.4,
      1.2 * p
    );
    s += rect(1.2 * p, 1.2 * p, sheetW - 2.4 * p, sheetH - 2.4 * p, "none", {
      rx: 0.8 * p,
      stroke: "#ffffff",
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.25
    });
    const x0 = (sheetW - ((cols - 1) * pitch + key)) / 2;
    const y0 = 4.2 * p;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const kx = x0 + c * pitch;
        const ky = y0 + r * pitch;
        const down = !!(pressed[r] && pressed[r][c]);
        const legend = (legends[r] || [])[c] || "";
        const ink = /^[0-9]$/.test(legend) ? "plastic-blue" : "plastic-red";
        s += el(
          "g",
          { "data-hook": `key-${r + 1}-${c + 1}`, "data-part": "key", "data-pressed": down ? "true" : void 0 },
          rect(kx, ky, key, key, T[ink], Object.assign({ rx: 0.5 * p }, edge(T, T[`${ink}-edge`], T["stroke-detail"]))) + (down ? rect(kx, ky, key, key, "#000000", { rx: 0.5 * p, "fill-opacity": 0.38 }) : bevel(T, kx, ky, key, key, 1.6, 0.5 * p)) + text(kx + key / 2, ky + key / 2 + 4, legend, 11, T["plastic-white"], {
            "font-weight": 700,
            "fill-opacity": down ? 0.7 : 1
          })
        );
      }
    const tx = (w - tailW) / 2;
    s += tag(
      "tail",
      rect(
        tx,
        sheetH - 0.5 * p,
        tailW,
        4 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.4 * p }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      )
    );
    const names = [];
    for (let i = 1; i <= rows; i++) names.push(`R${i}`);
    for (let j = 1; j <= cols; j++) names.push(`C${j}`);
    const hdr = header({
      x: tx + p,
      y: h - 0.5 * p,
      labels: names,
      kind: "leg",
      side: "above",
      silk: T["plastic-white"],
      size: PIN_LABEL
    });
    s += hdr.svg;
    return art(w, h, `${rows} x ${cols} membrane keypad`, s, hdr.pins);
  }
  function irRemote(props) {
    props = props || {};
    const keys = props.keys || [
      [
        ["power", "PWR"],
        ["vol-up", "VOL+"],
        ["func-stop", "FUNC"]
      ],
      [
        ["prev", "|<<"],
        ["play", ">||"],
        ["next", ">>|"]
      ],
      [
        ["down", "v"],
        ["vol-down", "VOL-"],
        ["up", "^"]
      ],
      [
        ["0", "0"],
        ["eq", "EQ"],
        ["st-rept", "ST"]
      ],
      [
        ["1", "1"],
        ["2", "2"],
        ["3", "3"]
      ],
      [
        ["4", "4"],
        ["5", "5"],
        ["6", "6"]
      ],
      [
        ["7", "7"],
        ["8", "8"],
        ["9", "9"]
      ]
    ];
    const T = tokens();
    const p = T.pitch;
    const w = 16 * p;
    const h = (5.7 + 3.9 * keys.length) * p;
    let s = "";
    const pressed = props.pressed || "";
    s += tag(
      "body",
      rect(
        T["board-inset"],
        T["board-inset"],
        w - 2 * T["board-inset"],
        h - 2 * T["board-inset"],
        T["plastic-black"],
        Object.assign({ rx: 1.6 * p }, edge(T, T["plastic-black-edge"]))
      )
    );
    s += bevel(T, T["board-inset"], T["board-inset"], w - 2 * T["board-inset"], h - 2 * T["board-inset"], 2.4, 1.6 * p);
    s += rect(0.9 * p, 0.9 * p, w - 1.8 * p, h - 1.8 * p, "none", {
      rx: 1.2 * p,
      stroke: "#ffffff",
      "stroke-width": T["stroke-fine"],
      "stroke-opacity": 0.2
    });
    s += rect(1.2 * p, 3.2 * p, w - 2.4 * p, 0.5 * p, "#ffffff", { rx: 0.25 * p, "fill-opacity": 0.08 });
    s += tag(
      "led",
      circle(w / 2, 1.7 * p, 0.55 * p, T["plastic-grey"], edge(T, T["plastic-grey-edge"], T["stroke-detail"])) + circle(w / 2, 1.7 * p, 0.3 * p, T["plastic-black-edge"])
    );
    keys.forEach((row, r) => {
      row.forEach((k, c) => {
        if (!k) return;
        const kx = w / 2 + (c - 1) * 4.7 * p;
        const ky = 5.4 * p + r * 3.9 * p;
        const down = pressed === k[0];
        const kr = 1.6 * p;
        const word = k[1].length > 2;
        const size = word ? 5.2 : 8;
        s += el(
          "g",
          { "data-hook": `key-${k[0]}`, "data-part": "key", "data-pressed": down ? "true" : void 0 },
          circle(
            kx,
            ky,
            kr,
            down ? "#1a1f24" : T["plastic-grey"],
            edge(T, down ? "#0b0e11" : T["plastic-grey-edge"], T["stroke-detail"])
          ) + (down ? "" : circle(kx, ky, kr, sheen("lens"), { "fill-opacity": 0.45 })) + text(kx, ky + size * 0.36, k[1], size, T["plastic-white"], {
            "font-weight": 700,
            "fill-opacity": down ? 0.7 : 1
          })
        );
      });
    });
    return art(w, h, `IR remote${pressed ? `, ${pressed} pressed` : ""}`, s, []);
  }
  function rotaryDialer(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 27 * p;
    const h = 30 * p;
    let s = "";
    const cx = 13.5 * p;
    const cy = 13.5 * p;
    const R = 11.2 * p;
    const angle = Number(props.angle) || 0;
    s += tag(
      "body",
      rect(
        T["board-inset"],
        T["board-inset"],
        w - 2 * T["board-inset"],
        h - 2 * T["board-inset"],
        T["plastic-white"],
        Object.assign({ rx: 2.4 * p }, edge(T, T["plastic-white-edge"]))
      )
    );
    s += bevel(T, 0.8 * p, 0.8 * p, w - 1.6 * p, h - 1.6 * p, 2, 2 * p);
    s += circle(cx, cy, R + 0.6 * p, T["plastic-white-edge"], { "fill-opacity": 0.35 });
    const holeR = 1.55 * p;
    const ring = 8.3 * p;
    let holes = "";
    let digits = "";
    const angles = [];
    const stop = Math.atan2(0.785, 0.885) * 180 / Math.PI;
    for (let i = 0; i < 10; i++) {
      angles.push(r2(((-30 - i * 28) % 360 + 360) % 360));
      const a = (-30 - i * 28) * Math.PI / 180;
      const hx = cx + Math.cos(a) * ring;
      const hy = cy + Math.sin(a) * ring;
      const dx = cx + Math.cos(a) * (ring - 2.6 * p);
      const dy = cy + Math.sin(a) * (ring - 2.6 * p);
      digits += text(dx, dy + 2.2, String((i + 1) % 10), 6.4, T["plastic-white"], { "font-weight": 700 });
      holes += `M${r2(hx - holeR)} ${r2(hy)}a${r2(holeR)} ${r2(holeR)} 0 1 0 ${r2(2 * holeR)} 0a${r2(holeR)} ${r2(holeR)} 0 1 0 ${r2(-2 * holeR)} 0z`;
    }
    const disc = `M${r2(cx - R)} ${r2(cy)}a${r2(R)} ${r2(R)} 0 1 0 ${r2(2 * R)} 0a${r2(R)} ${r2(R)} 0 1 0 ${r2(-2 * R)} 0z`;
    s += el(
      "g",
      {
        "data-hook": "dial",
        "data-part": "dial",
        "data-cx": r2(cx),
        "data-cy": r2(cy),
        "data-angle": r2(angle),
        "data-ring": r2(ring),
        "data-hole-radius": r2(holeR),
        "data-hole-angles": angles.join(" "),
        "data-stop": r2(stop),
        transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`
      },
      path(disc + holes, T["plastic-black"], {
        "fill-rule": "evenodd",
        stroke: T["plastic-black-edge"],
        "stroke-width": T["stroke-outline"]
      }) + digits + circle(cx, cy, 2.4 * p, T.metal, edge(T, T["metal-edge"])) + circle(cx, cy, 1 * p, T["plastic-black"], edge(T, T["metal-edge"], T["stroke-fine"]))
    );
    s += path(`M${r2(cx + R * 0.72)} ${r2(cy + R * 0.95)}L${r2(cx + R * 1.05)} ${r2(cy + R * 0.62)}`, "none", {
      stroke: T.metal,
      "stroke-width": 0.55 * p,
      "stroke-linecap": "round"
    });
    s += path(`M${r2(cx + R * 0.72)} ${r2(cy + R * 0.95)}L${r2(cx + R * 1.05)} ${r2(cy + R * 0.62)}`, "none", {
      stroke: T["metal-edge"],
      "stroke-width": T["stroke-fine"]
    });
    const hdr = header({
      x: cx - p,
      y: h - 0.8 * p,
      labels: props.pins || ["GND", "DIAL", "PULSE"],
      kind: "pad",
      side: "above",
      silk: T["plastic-black"],
      size: PIN_LABEL,
      rotate: true
    });
    s += hdr.svg;
    return art(w, h, "Rotary dialer", s, hdr.pins);
  }
  function rotaryEncoder(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "black";
    const f = finish(T, fin);
    const bw = 26.2 * mm;
    const ext = 6 * mm;
    const w = bw + ext;
    const h = 18.63 * mm;
    let s = "";
    const detent = Math.round(Number(props.detent) || 0);
    const cx = 9.1 * mm;
    const cy = 7.75 * mm;
    const names = props.pins || ["CLK", "DT", "SW", "VCC", "GND"];
    const prints = props.labels || (props.pins ? props.pins : ["CLK", "DT", "SW", "+", "GND"]);
    s += board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 11.5 * mm, y: 15.5 * mm, size: 0.7 * p } });
    const hdr = edgeHeader(T, { names, side: "right", at: bw, from: 2 * mm, ext });
    hdr.pads.forEach((pd, i) => {
      s += text(pd.x - T["pad-radius"] - 1.4, pd.y + 1.8, prints[i], 5, f.silk, { "text-anchor": "end" });
    });
    s += mountHole(T, f, 4.3 * mm, 16.4 * mm, 1.5 * mm) + mountHole(T, f, 21.6 * mm, 16.4 * mm, 1.5 * mm);
    const half = 6 * mm;
    s += tag(
      "encoder",
      [-2.5, 0, 2.5].map((k) => {
        return rect(cx - half - 1 * mm, cy + k * mm - 0.4 * mm, 1.2 * mm, 0.8 * mm, T.lead, { rx: 0.2 });
      }).join("") + rect(cx - half, cy - half, 2 * half, 2 * half, T.metal, Object.assign({ rx: 1 }, edge(T, T["metal-edge"])))
    );
    s += bevel(T, cx - half, cy - half, 2 * half, 2 * half, 1.8);
    const rb = 3.5 * mm;
    s += circle(cx, cy, rb, T.metal, edge(T, T["metal-edge"])) + circle(cx, cy, rb - 0.6, "none", { stroke: T["metal-edge"], "stroke-width": 0.5, "stroke-opacity": 0.8 }) + circle(cx, cy, rb - 1.4, "none", { stroke: T["metal-edge"], "stroke-width": 0.5, "stroke-opacity": 0.6 });
    const rs = 3 * mm;
    const flat = 1.5 * mm;
    const chord = Math.sqrt(rs * rs - flat * flat);
    const angle = detent % 20 * 18;
    const d = `M${r2(cx - chord)} ${r2(cy - flat)}H${r2(cx + chord)}A${r2(rs)} ${r2(rs)} 0 1 1 ${r2(cx - chord)} ${r2(cy - flat)}Z`;
    s += el(
      "g",
      {
        "data-hook": "knob",
        "data-part": "knob",
        "data-detent": detent,
        "data-cx": r2(cx),
        "data-cy": r2(cy),
        "data-angle": r2(angle),
        transform: `rotate(${angle} ${r2(cx)} ${r2(cy)})`
      },
      circle(cx, cy, half, T.metal, { "fill-opacity": 0 }) + path(
        d,
        props.pressed ? T["metal-edge"] : T.metal,
        Object.assign(
          { "data-hook": "cap", "data-pressed": props.pressed ? "true" : void 0 },
          edge(T, T["metal-edge"], T["stroke-detail"])
        )
      ) + path(d, sheen("metal"), { "fill-opacity": props.pressed ? 0.3 : 0.75 }) + line(cx - chord + 0.6, cy - flat, cx + chord - 0.6, cy - flat, T["metal-edge"], 0.9)
    );
    s += hdr.svg;
    return art(w, h, `Rotary encoder at detent ${detent}${props.pressed ? ", pressed" : ""}`, s, hdr.pins);
  }
  function slidePotentiometer(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const fin = props.finish || "red";
    const f = finish(T, fin);
    const travel = Math.max(10, Number(props.travel) || 60);
    const pos = Math.max(0, Math.min(1, Number(props.position) || 0));
    const bodyW = (travel + 15) * mm;
    const bodyH = 9 * mm;
    const w = Math.ceil((travel + 30) * mm / p) * p;
    const h = 8 * p;
    let s = "";
    s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: w - 4.4 * p, y: 1 * p, size: 0.7 * p } });
    [
      [0.8 * p, 0.8 * p],
      [w - 0.8 * p, 0.8 * p],
      [0.8 * p, h - 0.8 * p],
      [w - 0.8 * p, h - 0.8 * p]
    ].forEach((c) => {
      s += tag("hole", circle(c[0], c[1], T["mount-hole-radius"], T.hole, edge(T, T.pad)));
    });
    const hdr = padRow(
      T,
      fin,
      f,
      {
        x: w - 1 * p,
        y: h / 2 - p,
        axis: "y",
        labels: ["A", "SIG", "B"],
        kind: "pad",
        side: "left",
        silk: f.silk,
        size: PIN_LABEL
      },
      -1
    );
    const bx = 1.6 * p;
    const by = (h - bodyH) / 2;
    s += tag(
      "body",
      rect(bx, by, bodyW, bodyH, T["plastic-black"], Object.assign({ rx: 1.2 }, edge(T, T["plastic-black-edge"]))) + rect(
        bx + 1.2 * mm,
        by + 1 * mm,
        bodyW - 2.4 * mm,
        bodyH - 2 * mm,
        T.metal,
        Object.assign({ rx: 0.8 }, edge(T, T["metal-edge"], T["stroke-detail"]))
      )
    );
    s += bevel(T, bx, by, bodyW, bodyH, 1.4) + rect(bx + 0.7, by + 0.7, bodyW - 1.4, bodyH - 1.4, sheen("metal"), { rx: 1.2, "fill-opacity": 0.4 });
    const sx0 = bx + (bodyW - travel * mm) / 2;
    const sy = by + bodyH / 2;
    s += rect(
      sx0,
      sy - 0.8 * mm,
      travel * mm,
      1.6 * mm,
      T["plastic-black"],
      Object.assign({ rx: 0.8 * mm }, edge(T, T["plastic-black-edge"], T["stroke-fine"]))
    );
    [bx + 2.4 * mm, bx + bodyW - 2.4 * mm].forEach((x) => {
      s += circle(x, sy, 0.9 * mm, T.hole, edge(T, T["metal-edge"], T["stroke-fine"]));
    });
    s += framed(T, f, "resistor", w - 4.1 * p, h / 2 + 1.6 * p, true) + framed(T, f, "resistor", w - 4.1 * p, h / 2 - 2.2 * p, true);
    const lx = sx0 + pos * travel * mm;
    s += el(
      "g",
      {
        "data-hook": "lever",
        "data-part": "lever",
        "data-position": r2(pos),
        "data-axis": "x",
        "data-travel": r2(travel * mm)
      },
      rect(
        lx - 2 * mm,
        sy - 3.6 * mm,
        4 * mm,
        7.2 * mm,
        T["band-yellow"],
        Object.assign({ rx: 1.2 }, edge(T, T["resistor-body-edge"], T["stroke-detail"]))
      ) + rect(lx - 2 * mm, sy - 0.5 * mm, 4 * mm, 1 * mm, "#000000", { "fill-opacity": 0.35 }) + rect(lx - 1.4 * mm, sy - 3 * mm, 2.8 * mm, 1.2 * mm, "#ffffff", { rx: 1, "fill-opacity": T["opacity-light"] })
    );
    s += hdr.svg;
    return art(w, h, `Slide potentiometer at ${Math.round(pos * 100)}%`, s, hdr.pins);
  }
  var init_inputs = __esm({
    "src/inputs.js"() {
      init_core();
      init_pieces();
    }
  });

  // src/families/inputs.js
  var inputs_exports = {};
  __export(inputs_exports, {
    dipSwitch: () => dipSwitch,
    irRemote: () => irRemote,
    joystick: () => joystick,
    keypad: () => keypad,
    potentiometer: () => potentiometer,
    pushbutton: () => pushbutton,
    rotaryDialer: () => rotaryDialer,
    rotaryEncoder: () => rotaryEncoder,
    slidePotentiometer: () => slidePotentiometer,
    slideSwitch: () => slideSwitch
  });
  var init_inputs2 = __esm({
    "src/families/inputs.js"() {
      init_inputs();
    }
  });

  // src/actuators.js
  function servo(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const angle = Math.max(-90, Math.min(90, Number(props.angle) || 0));
    const w = r2(45 * mm);
    const h = r2(31.6 * mm);
    let s = "";
    const bw = 22.8 * mm;
    const bh = 12.2 * mm;
    const bx = w - bw - 4.6 * mm - 0.5 * p;
    const by = h - bh - 0.8 * p;
    const sx = bx + 6 * mm;
    const sy = by + bh / 2;
    const pins = [
      { name: "GND", x: 0.5 * p, y: sy - p },
      { name: "V+", x: 0.5 * p, y: sy },
      { name: "PWM", x: 0.5 * p, y: sy + p }
    ];
    [
      ["#5a3a1a", -p],
      ["#c62828", 0],
      ["#f28c28", p]
    ].forEach((wr) => {
      s += path(
        `M${r2(bx)} ${r2(sy + wr[1] * 0.35)}C${r2(bx - 3 * p)} ${r2(sy + wr[1] * 0.35)} ${r2(3.5 * p)} ${r2(sy + wr[1])} ${r2(1.6 * p)} ${r2(sy + wr[1])}`,
        "none",
        { stroke: wr[0], "stroke-width": 1.6, "stroke-linecap": "round" }
      );
    });
    s += tag(
      "connector",
      rect(
        0.5 * p - 3.6,
        sy - 1.5 * p,
        1.5 * p,
        3 * p,
        T["plastic-black"],
        Object.assign({ rx: 0.8 }, edge(T, T["plastic-black-edge"], T["stroke-detail"]))
      )
    );
    pins.forEach((pn) => {
      s += rect(pn.x - 1.5, pn.y - 1.5, 3, 3, T.cavity, { rx: 0.4 });
    });
    s += tag(
      "body",
      rect(
        bx - 4.6 * mm,
        sy - 2.1 * mm,
        bw + 9.2 * mm,
        4.2 * mm,
        T["plastic-blue"],
        Object.assign({ rx: 1 }, edge(T, T["plastic-blue-edge"]))
      ) + rect(bx, by, bw, bh, T["plastic-blue"], Object.assign({ rx: 1.2 }, edge(T, T["plastic-blue-edge"])))
    );
    s += bevel(T, bx, by, bw, bh, 1.8);
    [bx - 2.6 * mm, bx + bw + 2.6 * mm].forEach((x) => {
      s += circle(x, sy, 1 * mm, T.hole, edge(T, T["plastic-blue-edge"], T["stroke-fine"]));
    });
    s += circle(sx, sy, 5.8 * mm, T["plastic-blue"], edge(T, T["plastic-blue-edge"], T["stroke-detail"])) + circle(sx, sy, 5.8 * mm, "#ffffff", { "fill-opacity": 0.08 });
    s += circle(sx + 8.2 * mm, sy, 3.4 * mm, T["plastic-blue"], edge(T, T["plastic-blue-edge"], T["stroke-detail"]));
    s += rect(bx + 2, by + 1.5, bw - 4, 1.8 * mm, "#ffffff", { rx: 1, "fill-opacity": T["opacity-light"] * 0.5 });
    const hornLen = 18 * mm;
    s += el(
      "g",
      {
        "data-hook": "horn",
        "data-part": "horn",
        "data-angle": r2(angle),
        "data-cx": r2(sx),
        "data-cy": r2(sy),
        transform: `rotate(${r2(-angle)} ${r2(sx)} ${r2(sy)})`
      },
      path(
        `M${r2(sx - 2.2 * mm)} ${r2(sy)}a${r2(2.2 * mm)} ${r2(2.2 * mm)} 0 1 1 ${r2(4.4 * mm)} 0L${r2(sx + 1.4 * mm)} ${r2(sy - hornLen)}a${r2(1.4 * mm)} ${r2(1.4 * mm)} 0 0 0 ${r2(-2.8 * mm)} 0Z`,
        T["plastic-white"],
        Object.assign({ "stroke-linejoin": "round" }, edge(T, T["plastic-white-edge"], T["stroke-detail"]))
      ) + path(`M${r2(sx)} ${r2(sy - 5 * mm)}V${r2(sy - hornLen + 2.6 * mm)}`, "none", {
        stroke: T["plastic-white-edge"],
        "stroke-width": 0.6,
        "stroke-dasharray": "1.6 1.9"
      }) + circle(sx, sy, 1.4 * mm, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + circle(sx, sy, 0.6 * mm, T["metal-edge"])
    );
    return art(w, h, `Micro servo at ${r2(angle)}°`, s, pins);
  }
  function stepper(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const frame = Math.max(20, Number(props.frameSize) || 42.3);
    const biaxial = !!props.biaxial;
    const angle = Number(props.angle) || 0;
    const angle2 = Number(props.angle2) || 0;
    const names = props.pins || (biaxial ? ["A1-", "A1+", "B1+", "B1-", "A2-", "A2+", "B2+", "B2-"] : ["A-", "A+", "B+", "B-"]);
    const bw = frame * mm;
    const w = Math.ceil((bw + 1.2 * p) / p) * p;
    const bx = (w - bw) / 2;
    const by = 0.5 * p;
    const h = by + bw + 2.6 * p;
    const cx = w / 2;
    const cy = by + bw / 2;
    let s = "";
    s += tag(
      "body",
      rect(bx, by, bw, bw, T["plastic-black"], Object.assign({ rx: 0.1 * bw }, edge(T, T["plastic-black-edge"])))
    );
    s += rect(
      bx + 0.06 * bw,
      by + 0.06 * bw,
      0.88 * bw,
      0.88 * bw,
      T.metal,
      Object.assign({ rx: 0.06 * bw }, edge(T, T["metal-edge"], T["stroke-detail"]))
    );
    s += bevel(T, bx + 0.06 * bw, by + 0.06 * bw, 0.88 * bw, 0.88 * bw, 2.2) + rect(bx + 0.06 * bw + 0.7, by + 0.06 * bw + 0.7, 0.88 * bw - 1.4, 0.88 * bw - 1.4, sheen("metal"), {
      rx: 0.06 * bw,
      "fill-opacity": 0.5
    });
    const hole = frame >= 40 ? 31 * mm / 2 : frame * 0.37;
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1]
    ].forEach((c) => {
      s += circle(cx + c[0] * hole, cy + c[1] * hole, 1.5 * mm, T.hole, edge(T, T["metal-edge"], T["stroke-fine"]));
    });
    s += circle(cx, cy, 11 * mm, T.metal, edge(T, T["metal-edge"], T["stroke-detail"])) + circle(cx, cy, 11 * mm, "#000000", { "fill-opacity": 0.06 });
    if (biaxial) {
      s += el(
        "g",
        {
          "data-hook": "rotor-2",
          "data-part": "rotor",
          "data-angle": r2(angle2),
          "data-cx": r2(cx),
          "data-cy": r2(cy),
          transform: `rotate(${r2(angle2)} ${r2(cx)} ${r2(cy)})`
        },
        circle(cx, cy, 4.2 * mm, T["metal-edge"], edge(T, T["plastic-black-edge"], T["stroke-fine"])) + line(cx, cy - 4.2 * mm, cx, cy - 2.6 * mm, T["chip-print"], 1.2)
      );
      s += el(
        "g",
        {
          "data-hook": "rotor",
          "data-part": "rotor",
          "data-angle": r2(angle),
          "data-cx": r2(cx),
          "data-cy": r2(cy),
          transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`
        },
        circle(cx, cy, 2.5 * mm, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + path(`M${r2(cx - 2.5 * mm * 0.6)} ${r2(cy - 2 * mm)}h${r2(3 * mm)}`, "none", {
          stroke: T["metal-edge"],
          "stroke-width": 0.8
        })
      );
    } else {
      s += el(
        "g",
        {
          "data-hook": "rotor",
          "data-part": "rotor",
          "data-angle": r2(angle),
          "data-cx": r2(cx),
          "data-cy": r2(cy),
          transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`
        },
        circle(cx, cy, 2.5 * mm, T.metal, edge(T, T["metal-edge"], T["stroke-fine"])) + path(`M${r2(cx - 1.8 * mm)} ${r2(cy - 1.75 * mm)}h${r2(3.6 * mm)}`, "none", {
          stroke: T["metal-edge"],
          "stroke-width": 0.9
        })
      );
    }
    const hdr = header({
      x: r2(cx - (names.length - 1) * p / 2),
      y: h - 0.6 * p,
      labels: names,
      kind: "leg",
      side: "above",
      silk: "currentColor",
      size: PIN_LABEL,
      rotate: names.length > 4
    });
    const cols = [
      T["band-blue"],
      T["band-red"],
      T["band-green"],
      T["resistor-smd"],
      T["band-blue"],
      T["band-red"],
      T["band-green"],
      T["resistor-smd"]
    ];
    hdr.pins.forEach((pn, i) => {
      s += path(
        `M${r2(cx + (i - (names.length - 1) / 2) * 0.35 * p)} ${r2(by + bw - 2)}C${r2(cx + (i - (names.length - 1) / 2) * 0.35 * p)} ${r2(by + bw + 0.9 * p)} ${r2(pn.x)} ${r2(by + bw + 0.2 * p)} ${r2(pn.x)} ${r2(pn.y - (names.length > 4 ? 1.9 : 1) * p)}`,
        "none",
        { stroke: cols[i % cols.length], "stroke-width": 1.5, "stroke-linecap": "round" }
      );
    });
    s += hdr.svg;
    return art(
      w,
      h,
      `${biaxial ? "Biaxial stepper" : `NEMA ${Math.round(frame / 2.54)} stepper`} at ${r2(angle)}°`,
      s,
      hdr.pins
    );
  }
  function relay(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const mm = p / 2.54;
    const w = 9 * p;
    const h = 5.4 * p;
    const cy = 2.7 * p;
    const bw = 20.5 * mm;
    const bh = 10 * mm;
    const bx = 8 * p + 1.25 * mm - bw;
    const by = cy - bh / 2;
    let s = "";
    const pins = [];
    const top = ["NO2", "NC2", "P2", "COIL2"];
    const bot = ["NO1", "NC1", "P1", "COIL1"];
    const at = [1, 3, 5, 8];
    top.forEach((n, i) => {
      pins.push({ name: n, x: at[i] * p, y: cy - 1.5 * p });
    });
    bot.forEach((n, i) => {
      pins.push({ name: n, x: at[i] * p, y: cy + 1.5 * p });
    });
    s += tag(
      "body",
      rect(
        bx,
        by,
        bw,
        bh,
        T["plastic-amber"],
        Object.assign(
          { rx: 1.2, "data-hook": "relay", "data-energised": props.energised ? "true" : "false" },
          edge(T, T["plastic-amber-edge"])
        )
      )
    );
    s += rect(bx + 2, by + 1.2, bw - 4, 1.4, "#ffffff", { rx: 0.7, "fill-opacity": T["opacity-light"] * 0.5 });
    pins.forEach((pn, i) => {
      s += circle(
        pn.x,
        pn.y,
        1.4,
        "#000000",
        Object.assign({ "fill-opacity": 0.4 }, edge(T, T["plastic-amber-edge"], T["stroke-fine"]))
      );
      s += text(pn.x, i < 4 ? cy - 8 : cy + 11.4, pn.name, PIN_LABEL, T["plastic-black"]);
    });
    s += text(bx + bw / 2, cy - 2.2, "KS2E-M-DC5", PIN_LABEL + 0.4, T["plastic-black"], { "font-weight": 600 });
    s += text(bx + bw / 2, cy + 3, `DPDT 5V ${lotCode("KS2E")}`, PIN_LABEL, T["plastic-black"], {
      "fill-opacity": 0.85
    });
    s += circle(bx + 3, by + bh - 3, 1, T["plastic-black"], { "fill-opacity": 0.8 });
    return art(w, h, `DPDT relay${props.energised ? ", energised" : ""}`, s, pins);
  }
  var init_actuators = __esm({
    "src/actuators.js"() {
      init_core();
    }
  });

  // src/families/outputs.js
  var outputs_exports = {};
  __export(outputs_exports, {
    buzzer: () => buzzer,
    led: () => led,
    ledBarGraph: () => ledBarGraph,
    ledStrip: () => ledStrip,
    neopixel: () => neopixel,
    relay: () => relay,
    rgbLed: () => rgbLed,
    servo: () => servo,
    stepper: () => stepper
  });
  var init_outputs = __esm({
    "src/families/outputs.js"() {
      init_passives();
      init_pixels();
      init_actuators();
    }
  });

  // src/families/modules.js
  var modules_exports = {};
  __export(modules_exports, {
    hx711Board: () => hx711Board,
    logicAnalyzer: () => logicAnalyzer,
    microsdModule: () => microsdModule,
    neopixelMeter: () => neopixelMeter,
    relayModule: () => relayModule,
    rfidModule: () => rfidModule,
    rtcModule: () => rtcModule
  });
  var init_modules2 = __esm({
    "src/families/modules.js"() {
      init_modules();
      init_sensors();
      init_pixels();
    }
  });

  // src/chips.js
  function packageOf(props, own) {
    return props && props.package || own;
  }
  function ne555Timer(props) {
    return chipTemplate({
      label: "NE555",
      package: packageOf(props, "dip"),
      pins: ["GND", "TRIG", "OUT", "RESET", "CTRL", "THR", "DIS", "VCC"]
    });
  }
  function shiftRegister595(props) {
    return chipTemplate({
      label: "74HC595",
      package: packageOf(props, "dip"),
      pins: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "GND", "Q7S", "MR", "SHCP", "STCP", "OE", "DS", "Q0", "VCC"]
    });
  }
  function shiftRegister165(props) {
    return chipTemplate({
      label: "74HC165",
      package: packageOf(props, "dip"),
      pins: ["PL", "CP", "D4", "D5", "D6", "D7", "Q7_N", "GND", "Q7", "DS", "D0", "D1", "D2", "D3", "CE", "VCC"]
    });
  }
  function ledDriver595(props) {
    return chipTemplate({
      label: "NLSF595",
      package: packageOf(props, "tssop"),
      pins: ["QB", "QC", "QD", "QE", "QF", "QG", "QH", "GND", "SQH", "SCLR", "SCK", "RCK", "OE", "SI", "QA", "VCC"]
    });
  }
  function attiny85(props) {
    return chipTemplate({
      label: "ATtiny85",
      package: packageOf(props, "dip"),
      pins: ["PB5", "PB3", "PB4", "GND", "PB0", "PB1", "PB2", "VCC"]
    });
  }
  var init_chips = __esm({
    "src/chips.js"() {
      init_core();
    }
  });

  // src/families/chips.js
  var chips_exports = {};
  __export(chips_exports, {
    attiny85: () => attiny85,
    ledDriver595: () => ledDriver595,
    ne555Timer: () => ne555Timer,
    shiftRegister165: () => shiftRegister165,
    shiftRegister595: () => shiftRegister595
  });
  var init_chips2 = __esm({
    "src/families/chips.js"() {
      init_chips();
    }
  });

  // src/families/passives.js
  var passives_exports = {};
  __export(passives_exports, {
    capacitor: () => capacitor,
    resistor: () => resistor
  });
  var init_passives2 = __esm({
    "src/families/passives.js"() {
      init_passives();
    }
  });

  // src/breadboardColors.js
  function breadboardColor(value) {
    const k = typeof value === "string" ? value.trim().toLowerCase() : "";
    return Object.prototype.hasOwnProperty.call(BREADBOARD_PAINT, k) ? k : "white";
  }
  var BREADBOARD_PAINT, BREADBOARD_COLORS;
  var init_breadboardColors = __esm({
    "src/breadboardColors.js"() {
      BREADBOARD_PAINT = {
        red: { body: "#ef5350", edge: "#a52825", hole: "#1a0303", print: "#1a0303" },
        orange: { body: "#fb8c00", edge: "#a85d00", hole: "#2b1600", print: "#2b1600" },
        yellow: { body: "#fdd835", edge: "#b39500", hole: "#332b00", print: "#332b00" },
        green: { body: "#43a047", edge: "#2a6b2d", hole: "#0b220c", print: "#0b220c" },
        blue: { body: "#1e88e5", edge: "#145ea0", hole: "#04162a", print: "#04162a" },
        purple: { body: "#8e24aa", edge: "#5d1771", hole: "#f3e5f5", print: "#f3e5f5" },
        brown: { body: "#9c7b6f", edge: "#5d4037", hole: "#1b110d", print: "#1b110d" },
        black: { body: "#2b2b2b", edge: "#0f0f0f", hole: "#c8c8c8", print: "#d9d9d9" }
      };
      BREADBOARD_COLORS = ["white", "red", "orange", "yellow", "green", "blue", "purple", "brown", "black"];
    }
  });

  // src/breadboard.js
  function breadboardPaint(value, T) {
    const k = breadboardColor(value);
    if (k !== "white") return BREADBOARD_PAINT[k];
    T = T || tokens();
    return { body: T["bread-body"], edge: T["bread-edge"], hole: T["bread-hole"], print: T["bread-print"] };
  }
  function breadboard(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const v = props.variant || "breadboard";
    const L = { breadboard: [63, 50, 3], "breadboard-half": [30, 25, 2], "breadboard-mini": [17, 0, 0] }[v] || [
      63,
      50,
      3
    ];
    const cols = L[0];
    const railHoles = L[1];
    const railStart = L[2];
    const rails = railHoles > 0;
    const a = rails ? 5 : 2.5;
    const rowY = {};
    const letters = "abcdefghij";
    let s = "";
    const c = breadboardPaint(props.color, T);
    const font = { "font-family": "ui-sans-serif,sans-serif" };
    for (let i = 0; i < 10; i++) rowY[letters[i]] = (a + i + (i >= 5 ? 2 : 0)) * p;
    const bottom = rails ? rowY.j + 4 * p + p : rowY.j + 2.5 * p;
    const w = (cols - 1) * p + 4 * p;
    const h = bottom;
    const colX = function(k) {
      return 2 * p + (k - 1) * p;
    };
    const mm = p / 2.54;
    const bw = rails ? w - 2 * T["board-inset"] : 46 * mm;
    const bh = rails ? h - 2 * T["board-inset"] : 34.5 * mm;
    const bx = (w - bw) / 2;
    const by = (h - bh) / 2;
    s += tag("body", rect(bx, by, bw, bh, c.body, Object.assign({ rx: 3 }, edge(T, c.edge))));
    s += bevel(T, bx, by, bw, bh, 2.6, 3);
    const holes = function(centres) {
      return path(
        centres.map((q) => {
          return `M${r2(q[0] - 1.5)} ${r2(q[1] - 1.5)}h3v3h-3z`;
        }).join(""),
        c.hole
      );
    };
    const strip = function(first) {
      const q = [];
      for (let k = 1; k <= cols; k++) for (let r = 0; r < 5; r++) q.push([colX(k), rowY[letters[first + r]]]);
      return holes(q);
    };
    s += rect(
      bx + 0.6 * p - T["board-inset"],
      rowY.e + 0.85 * p,
      bw - 1.2 * p + 2 * T["board-inset"],
      1.3 * p,
      "#000000",
      { rx: 2, "fill-opacity": 0.12 }
    );
    s += strip(0) + strip(5);
    const letterX = rails ? 0.9 * p : bx + 1.2 * mm;
    for (let i = 0; i < 10; i++) {
      const y = rowY[letters[i]] + 1.4;
      s += text(letterX, y, letters[i], PIN_LABEL, c.print, font) + text(w - letterX, y, letters[i], PIN_LABEL, c.print, font);
    }
    for (let k = 1; k <= cols; k++)
      if (k === 1 || k % 5 === 0)
        s += text(colX(k), rowY.a - 0.55 * p, String(k), PIN_LABEL, c.print, font) + text(colX(k), rowY.j + 0.85 * p, String(k), PIN_LABEL, c.print, font);
    if (rails) {
      const railRows = { tp: p, tn: 2 * p, bp: rowY.j + 3 * p, bn: rowY.j + 4 * p };
      const railX = function(n) {
        return colX(railStart + n - 1 + Math.floor((n - 1) / 5));
      };
      const x0 = railX(1);
      const x1 = railX(railHoles);
      const split = !!props.splitRails && v === "breadboard";
      const spans = split ? [
        [x0 - 0.6 * p, railX(25) + 0.3 * p],
        [railX(26) - 0.3 * p, x1 + 0.6 * p]
      ] : [[x0 - 0.6 * p, x1 + 0.6 * p]];
      const q = [];
      Object.keys(railRows).forEach((r) => {
        const y = railRows[r];
        const plus = r === "tp" || r === "bp";
        const lineY = plus ? y - 0.55 * p : y + 0.55 * p;
        const ink = plus ? T["rail-plus"] : T["rail-minus"];
        spans.forEach((sp) => {
          s += rect(sp[0], lineY - 0.6, sp[1] - sp[0], 1.2, ink, { rx: 0.6, "fill-opacity": 0.9 });
        });
        s += text(x0 - 1.2 * p, lineY + 1.5, plus ? "+" : "-", 5, ink, { "font-weight": 700 }) + text(x1 + 1.2 * p, lineY + 1.5, plus ? "+" : "-", 5, ink, { "font-weight": 700 });
        for (let n = 1; n <= railHoles; n++) q.push([railX(n), y]);
      });
      s += holes(q);
    }
    const rings = (props.occupied || []).map((at) => {
      return circle(at.x, at.y, 3.1, "none", { stroke: T["mark-focus"], "stroke-width": 1.2 });
    }).join("");
    if (rings) s += tag("occupied", rings);
    return art(
      w,
      h,
      { breadboard: "Full breadboard", "breadboard-half": "Half breadboard", "breadboard-mini": "Mini breadboard" }[v],
      s,
      []
    );
  }
  var init_breadboard = __esm({
    "src/breadboard.js"() {
      init_core();
      init_breadboardColors();
    }
  });

  // src/families/breadboards.js
  var breadboards_exports = {};
  __export(breadboards_exports, {
    breadboard: () => breadboard
  });
  var init_breadboards = __esm({
    "src/families/breadboards.js"() {
      init_breadboard();
    }
  });

  // src/symbols.js
  function logicSymbol(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const gate = props.gate || "and";
    const single = gate === "not" || gate === "buffer";
    const n = single ? 1 : Math.max(2, Math.min(8, props.inputs || 2));
    const height = (single ? 2 : n * 2) * p;
    const inputY = function(i) {
      return single ? p : p * (1 + 2 * i);
    };
    const outY = single ? p : n * p;
    const width = 6 * p;
    const x0 = 1.2 * p;
    const x1 = 4.6 * p;
    const y0 = 0.3 * p;
    const y1 = height - 0.3 * p;
    const cy = outY;
    const hh = (y1 - y0) / 2;
    const bubble = INVERTED[gate] ? 2.6 : 0;
    let orFamily = /or$/.test(gate) && gate !== "xor" && gate !== "xnor" ? true : gate === "or" || gate === "nor";
    const exclusive = gate === "xor" || gate === "xnor";
    orFamily = gate === "or" || gate === "nor" || exclusive;
    const st = {
      fill: "none",
      stroke: "currentColor",
      "stroke-width": T["stroke-symbol"],
      "stroke-linejoin": "round",
      "stroke-linecap": "round"
    };
    let s = "";
    let body;
    if (single) body = path(`M${r2(x0)} ${r2(y0)}L${r2(x1 - bubble * 2)} ${r2(cy)}L${r2(x0)} ${r2(y1)}z`, "none", st);
    else if (orFamily) {
      const inX = x0 + (exclusive ? 0.5 * p : 0);
      const bodyEnd = x1 - bubble * 2;
      body = path(
        `M${r2(inX)} ${r2(y0)}Q${r2(inX + hh * 0.5)} ${r2(cy)} ${r2(inX)} ${r2(y1)}Q${r2(inX + hh * 1.2)} ${r2(y1)} ${r2(bodyEnd)} ${r2(cy)}Q${r2(inX + hh * 1.2)} ${r2(y0)} ${r2(inX)} ${r2(y0)}z`,
        "none",
        st
      );
      if (exclusive) body += path(`M${r2(x0)} ${r2(y0)}Q${r2(x0 + hh * 0.5)} ${r2(cy)} ${r2(x0)} ${r2(y1)}`, "none", st);
    } else
      body = path(
        `M${r2(x0)} ${r2(y0)}H${r2(x1 - bubble * 2 - hh)}A${r2(hh)} ${r2(hh)} 0 0 1 ${r2(x1 - bubble * 2 - hh)} ${r2(y1)}H${r2(x0)}z`,
        "none",
        st
      );
    const pins = [];
    for (let i = 0; i < n; i++) {
      const y = inputY(i);
      const lx = orFamily ? x0 + (exclusive ? 0.5 * p : 0) + hh * 0.5 * (1 - Math.pow((y - cy) / hh, 2)) : x0;
      s += line(0, y, Math.max(x0, lx), y, "currentColor", T["stroke-symbol"]);
      pins.push({ name: (props.inputNames || [])[i] || (single ? "IN" : String.fromCharCode(65 + i)), x: 0, y });
    }
    s += body;
    if (bubble) s += circle(x1 - bubble, cy, bubble, "none", st);
    s += line(x1, cy, width, cy, "currentColor", T["stroke-symbol"], { "data-level-pin": n });
    pins.push({ name: props.outputName || "OUT", x: width, y: cy });
    return art(width, height, `${GATE_NAMES[gate]} gate`, s, pins);
  }
  function muxSymbol(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 6 * p;
    const h = 4 * p;
    const x0 = 1.6 * p;
    const x1 = 4.4 * p;
    const inset = 0.6 * p;
    const st = SYM(T);
    let s = "";
    const selTop = h - 0.3 * p - inset * (3 * p - x0) / (x1 - x0);
    s += line(0, p, x0, p, "currentColor", T["stroke-symbol"]) + line(0, 3 * p, x0, 3 * p, "currentColor", T["stroke-symbol"]);
    s += line(3 * p, h, 3 * p, selTop, "currentColor", T["stroke-symbol"]);
    s += line(x1, 2 * p, w, 2 * p, "currentColor", T["stroke-symbol"], { "data-level-pin": 3 });
    s += path(
      `M${r2(x0)} ${r2(0.3 * p)}L${r2(x1)} ${r2(0.3 * p + inset)}L${r2(x1)} ${r2(h - 0.3 * p - inset)}L${r2(x0)} ${r2(h - 0.3 * p)}Z`,
      "none",
      st
    );
    s += symText(x0 + 4.2, p + 1.5, "0") + symText(x0 + 4.2, 3 * p + 1.5, "1");
    const names = props.pins || ["A", "B", "SEL", "OUT"];
    return art(w, h, "2-input multiplexer", s, [
      { name: names[0], x: 0, y: p },
      { name: names[1], x: 0, y: 3 * p },
      { name: names[2], x: 3 * p, y: h },
      { name: names[3], x: w, y: 2 * p }
    ]);
  }
  function flipFlopSymbol(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 6 * p;
    const h = 4 * p;
    const x0 = 1.2 * p;
    const x1 = 4.8 * p;
    const y0 = 0.4 * p;
    const y1 = h - 0.4 * p;
    const st = SYM(T);
    let s = "";
    const sw = T["stroke-symbol"];
    let pins = [
      { name: "D", x: 0, y: p },
      { name: "CLK", x: 0, y: 3 * p }
    ];
    const sr = [];
    if (props.set) sr.push({ name: "S", x: 3 * p, y: 0 });
    if (props.reset) sr.push({ name: "R", x: 3 * p, y: h });
    if (!props.srLast) pins = pins.concat(sr);
    const qIndex = pins.length;
    pins.push({ name: "Q", x: w, y: p }, { name: "NOTQ", x: w, y: 3 * p });
    if (props.srLast) pins = pins.concat(sr);
    s += line(0, p, x0, p, "currentColor", sw) + line(0, 3 * p, x0, 3 * p, "currentColor", sw);
    s += line(x1, p, w, p, "currentColor", sw, { "data-level-pin": qIndex }) + line(x1, 3 * p, w, 3 * p, "currentColor", sw, { "data-level-pin": qIndex + 1 });
    if (props.set) s += line(3 * p, 0, 3 * p, y0, "currentColor", sw) + symText(3 * p, y0 + PIN_LABEL + 0.6, "S");
    if (props.reset) s += line(3 * p, h, 3 * p, y1, "currentColor", sw) + symText(3 * p, y1 - 1.4, "R");
    s += rect(x0, y0, x1 - x0, y1 - y0, "none", st);
    s += path(`M${r2(x0)} ${r2(3 * p - 2.4)}L${r2(x0 + 3.2)} ${r2(3 * p)}L${r2(x0)} ${r2(3 * p + 2.4)}`, "none", st);
    s += symText(x0 + 1.6, p + 1.5, "D", PIN_LABEL, { "text-anchor": "start" }) + symText(x1 - 1.6, p + 1.5, "Q", PIN_LABEL, { "text-anchor": "end" }) + symText(x1 - 1.6, 3 * p + 1.5, "Q", PIN_LABEL, { "text-anchor": "end" });
    s += line(x1 - 4.2, 3 * p - 2.9, x1 - 1.6, 3 * p - 2.9, "currentColor", 0.6);
    return art(
      w,
      h,
      `D flip-flop${props.set && props.reset ? " with set and reset" : props.reset ? " with reset" : props.set ? " with set" : ""}`,
      s,
      pins
    );
  }
  function clockGenerator(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 5 * p;
    const h = 4 * p;
    const x0 = 0.4 * p;
    const x1 = 3.8 * p;
    const y0 = 0.4 * p;
    const y1 = h - 1.2 * p;
    const st = SYM(T);
    let s = "";
    const sw = T["stroke-symbol"];
    s += rect(x0, y0, x1 - x0, y1 - y0, "none", Object.assign({ rx: 2 }, st));
    s += path(`M${r2(x0 + 4)} ${r2(2 * p + 2)}h4v-8h6v8h6v-8h6v8h4`, "none", st);
    s += line(x1, 2 * p, w, 2 * p, "currentColor", sw, { "data-level-pin": 0 });
    s += line(2 * p, y1, 2 * p, h, "currentColor", sw);
    s += symText((x0 + x1) / 2, y1 - 1.2, props.label || "CLK");
    return art(w, h, "Clock generator", s, [
      { name: "CLK", x: w, y: 2 * p },
      { name: "GND", x: 2 * p, y: h }
    ]);
  }
  function supplySymbol(props) {
    props = props || {};
    const T = tokens();
    const p = T.pitch;
    const w = 3 * p;
    const h = 3 * p;
    const sw = T["stroke-symbol"];
    let s = "";
    const v = props.voltage === void 0 ? "VCC" : `${String(props.voltage)}V`;
    s += line(0.5 * p, 1.3 * p, 2.5 * p, 1.3 * p, "currentColor", sw) + line(1.5 * p, 1.3 * p, 1.5 * p, h, "currentColor", sw);
    s += symText(1.5 * p, 1.3 * p - 3.2, v, 5.5, { "font-weight": 600 });
    return art(w, h, `Supply ${v}`, s, [{ name: "VCC", x: 1.5 * p, y: h }]);
  }
  function noteSymbol() {
    const T = tokens();
    const st = SYM(T);
    return art(32, 32, "Text note", path("M7 9V6h18v3M16 6v20M12 26h8", "none", st), []);
  }
  var INVERTED, GATE_NAMES, SYM, symText;
  var init_symbols = __esm({
    "src/symbols.js"() {
      init_core();
      INVERTED = { nand: 1, nor: 1, xnor: 1, not: 1 };
      GATE_NAMES = {
        and: "AND",
        nand: "NAND",
        or: "OR",
        nor: "NOR",
        xor: "XOR",
        xnor: "XNOR",
        not: "NOT",
        buffer: "Buffer"
      };
      SYM = function(T) {
        return {
          fill: "none",
          stroke: "currentColor",
          "stroke-width": T["stroke-symbol"],
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        };
      };
      symText = function(x, y, s, size, more) {
        return text(x, y, s, size || PIN_LABEL, "currentColor", more);
      };
    }
  });

  // src/families/symbols.js
  var symbols_exports = {};
  __export(symbols_exports, {
    clockGenerator: () => clockGenerator,
    flipFlopSymbol: () => flipFlopSymbol,
    logicSymbol: () => logicSymbol,
    muxSymbol: () => muxSymbol,
    noteSymbol: () => noteSymbol,
    supplySymbol: () => supplySymbol
  });
  var init_symbols2 = __esm({
    "src/families/symbols.js"() {
      init_symbols();
    }
  });

  // bundle-entry.js
  var bundle_entry_exports = {};
  __export(bundle_entry_exports, {
    BREADBOARD_COLORS: () => BREADBOARD_COLORS,
    CATALOG: () => CATALOG,
    FAMILIES: () => FAMILIES,
    FINISHES: () => FINISHES,
    LED_STRIP_MAX_PIXELS: () => LED_STRIP_MAX_PIXELS,
    PITCH: () => PITCH,
    angleBetween: () => angleBetween,
    attiny85: () => attiny85,
    bevel: () => bevel,
    bevelPoly: () => bevelPoly,
    bluePillBoard: () => bluePillBoard,
    bmp180Board: () => bmp180Board,
    board: () => board,
    breadboard: () => breadboard,
    breadboardColor: () => breadboardColor,
    breadboardPaint: () => breadboardPaint,
    buzzer: () => buzzer,
    callOf: () => callOf,
    capTop: () => capTop,
    capacitor: () => capacitor,
    characterLcd: () => characterLcd,
    check: () => check,
    checkOptions: () => checkOptions,
    chipTemplate: () => chipTemplate,
    clockGenerator: () => clockGenerator,
    comparatorBoardTemplate: () => comparatorBoardTemplate,
    definePartElement: () => definePartElement,
    detentsTurned: () => detentsTurned,
    devBoardTemplate: () => devBoardTemplate,
    dht11Module: () => dht11Module,
    dht22Sensor: () => dht22Sensor,
    dialDigitAt: () => dialDigitAt,
    dialGeometry: () => dialGeometry,
    dialTravel: () => dialTravel,
    dipSwitch: () => dipSwitch,
    drawPart: () => drawPart,
    ds18b20Sensor: () => ds18b20Sensor,
    epaperModule: () => epaperModule,
    esp32C3DevKit: () => esp32C3DevKit,
    esp32C5DevKit: () => esp32C5DevKit,
    esp32C6DevKit: () => esp32C6DevKit,
    esp32DevKitCV4: () => esp32DevKitCV4,
    esp32DevKitV1: () => esp32DevKitV1,
    esp32H2DevKit: () => esp32H2DevKit,
    esp32S2DevKit: () => esp32S2DevKit,
    esp32S3DevKit: () => esp32S3DevKit,
    espDevKitTemplate: () => espDevKitTemplate,
    findHook: () => findHook,
    findPart: () => findPart,
    flameSensor: () => flameSensor,
    flipArtwork: () => flipArtwork,
    flipFlopSymbol: () => flipFlopSymbol,
    flow: () => flow,
    formatMilliamps: () => formatMilliamps,
    formatOhms: () => formatOhms,
    franzininho: () => franzininho,
    gasModuleTemplate: () => gasModuleTemplate,
    gasSensor: () => gasSensor,
    header: () => header,
    hx711Board: () => hx711Board,
    ili9341TouchDisplay: () => ili9341TouchDisplay,
    indicator: () => indicator,
    irReceiver: () => irReceiver,
    irRemote: () => irRemote,
    joystick: () => joystick,
    keypad: () => keypad,
    knobPosition: () => knobPosition,
    led: () => led,
    ledBarGraph: () => ledBarGraph,
    ledDriver595: () => ledDriver595,
    ledRing: () => ledRing,
    ledStrip: () => ledStrip,
    lens: () => lens,
    lensColor: () => lensColor,
    lightSensor: () => lightSensor,
    loadPart: () => loadPart,
    logicAnalyzer: () => logicAnalyzer,
    logicSymbol: () => logicSymbol,
    lotCode: () => lotCode,
    max7219Matrix: () => max7219Matrix,
    megaBoardTemplate: () => megaBoardTemplate,
    megaClassBoard: () => megaClassBoard,
    meterLines: () => meterLines,
    microsdModule: () => microsdModule,
    moduleTemplate: () => moduleTemplate,
    mount: () => mount,
    mpu6050Imu: () => mpu6050Imu,
    muxSymbol: () => muxSymbol,
    nanoClassBoard: () => nanoClassBoard,
    nanoConnectTemplate: () => nanoConnectTemplate,
    nanoRp2040Board: () => nanoRp2040Board,
    ne555Timer: () => ne555Timer,
    neopixel: () => neopixel,
    neopixelMatrix: () => neopixelMatrix,
    neopixelMeter: () => neopixelMeter,
    nokiaModule: () => nokiaModule,
    noteSymbol: () => noteSymbol,
    ntcSensor: () => ntcSensor,
    nucleo32BoardTemplate: () => nucleo32BoardTemplate,
    nucleo64BoardTemplate: () => nucleo64BoardTemplate,
    oledBreakout: () => oledBreakout,
    oledSquare: () => oledSquare,
    optionApplies: () => optionApplies,
    optionsFromAttributes: () => optionsFromAttributes,
    partPins: () => partPins,
    patchSvg: () => patchSvg,
    picoBoardTemplate: () => picoBoardTemplate,
    picoClassBoard: () => picoClassBoard,
    pin: () => pin,
    pinsOnPitch: () => pinsOnPitch,
    pirModule: () => pirModule,
    potentiometer: () => potentiometer,
    probe: () => probe,
    pulseSensor: () => pulseSensor,
    pushbutton: () => pushbutton,
    relay: () => relay,
    relayModule: () => relayModule,
    resistor: () => resistor,
    resistorBands: () => resistorBands,
    rfidModule: () => rfidModule,
    rgbLed: () => rgbLed,
    rotaryDialer: () => rotaryDialer,
    rotaryEncoder: () => rotaryEncoder,
    rotateArtwork: () => rotateArtwork,
    rtcModule: () => rtcModule,
    scopeIds: () => scopeIds,
    searchParts: () => searchParts,
    sensorModuleTemplate: () => sensorModuleTemplate,
    servo: () => servo,
    setTokenMode: () => setTokenMode,
    sevenSegment: () => sevenSegment,
    sh1107Module: () => sh1107Module,
    shiftRegister165: () => shiftRegister165,
    shiftRegister595: () => shiftRegister595,
    silkMark: () => silkMark,
    slidePotentiometer: () => slidePotentiometer,
    slideSwitch: () => slideSwitch,
    smallSensorBoardTemplate: () => smallSensorBoardTemplate,
    soundSensor: () => soundSensor,
    ssd1306Module: () => ssd1306Module,
    stepper: () => stepper,
    stm32C031C6Board: () => stm32C031C6Board,
    stm32L031K6Board: () => stm32L031K6Board,
    supplySymbol: () => supplySymbol,
    svg: () => svg,
    syncSvg: () => syncSvg,
    tftModule: () => tftModule,
    tiltSwitch: () => tiltSwitch,
    tm1637Module: () => tm1637Module,
    to92Template: () => to92Template,
    toDataUrl: () => toDataUrl,
    tokenMode: () => tokenMode,
    tokens: () => tokens,
    trace: () => trace,
    ultrasonicRanger: () => ultrasonicRanger,
    unoClassBoard: () => unoClassBoard,
    usbC: () => usbC,
    usbPort: () => usbPort,
    via: () => via,
    wire: () => wire
  });

  // src/index.js
  init_boards2();
  init_displays2();
  init_sensors2();
  init_inputs2();
  init_outputs();
  init_modules2();
  init_chips2();
  init_passives2();
  init_breadboards();
  init_symbols2();

  // src/options.js
  init_tokens();
  init_breadboardColors();
  var cap = (s) => s[0].toUpperCase() + s.slice(1);
  var choice = (value, label, swatch) => swatch ? { value, label, swatch } : { value, label };
  var LENS_CHOICES = ["red", "green", "yellow", "blue", "white", "orange"].map(
    (c) => choice(c, cap(c), FALLBACK[`lens-${c}`])
  );
  var FINISH_CHOICES = ["blue", "green", "teal", "black", "purple", "white", "red"].map(
    (f) => choice(f, cap(f), FALLBACK[`pcb-${f}`])
  );
  var PIXEL_CHOICES = [
    choice("#22c55e", "Green", "#22c55e"),
    choice("#3b82f6", "Blue", "#3b82f6"),
    choice("#f59e0b", "Amber", "#f59e0b"),
    choice("#ec4899", "Pink", "#ec4899"),
    choice("#ffffff", "White", "#ffffff")
  ];
  var bool = (label, more) => ({ type: "boolean", label, default: false, ...more });
  var state = (spec) => ({ ...spec, state: true });
  var unit = (label, more) => ({ type: "number", label, min: 0, max: 1, step: 0.05, default: 0, ...more });
  var finish2 = (def) => ({ type: "enum", label: "Board colour", choices: FINISH_CHOICES, default: def });
  var lens2 = (def) => ({ type: "color", label: "Colour", choices: LENS_CHOICES, default: def });
  var pkg = (def) => ({
    type: "enum",
    label: "Package",
    choices: [choice("dip", "DIP"), choice("soic", "SOIC"), choice("tssop", "TSSOP")],
    default: def
  });
  var pixels = (length, label = "Pixel colours") => state({ type: "list", label, items: { type: "pixel", choices: PIXEL_CHOICES }, length });
  var lamps2 = (fields, lit2 = []) => {
    const out = {};
    for (const [k, label] of Object.entries(fields))
      out[k] = { type: k === "user" ? "level" : "boolean", label, default: lit2.includes(k) };
    return state({ type: "object", label: "Lamps", fields: out });
  };
  var BOARD = { indicators: lamps2({ power: "Power LED", user: "User LED" }) };
  var POWER_BOARD = { indicators: lamps2({ power: "Power LED" }) };
  var SENSOR_BOARD = (def) => ({ indicators: lamps2({ power: "Power LED", out: "Output LED" }), finish: finish2(def) });
  var WAVE_CODE = "Array.from({ length: 2048 }, (_, i) => Math.abs(16 - 12 * Math.sin((i % 64) / 6) - Math.floor(i / 64)) < 1.5)";
  var WAVE = {
    width: 64,
    height: 32,
    data: Array.from({ length: 2048 }, (_, i) => Math.abs(16 - 12 * Math.sin(i % 64 / 6) - Math.floor(i / 64)) < 1.5)
  };
  var screen2 = (def, caption = "Hello!") => ({
    caption: state({
      type: "text",
      label: "Caption",
      default: "",
      maxLength: 24,
      when: { pixels: null },
      example: caption
    }),
    pixels: state({
      type: "frame",
      label: "Picture",
      examples: [{ label: "Sine wave", value: WAVE, code: `{ width: 64, height: 32, data: ${WAVE_CODE} }` }]
    }),
    ...def ? { finish: finish2(def) } : {}
  });
  var GLYPHS = {
    Heart: ["00000000", "01100110", "11111111", "11111111", "01111110", "00111100", "00011000", "00000000"],
    Smile: ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100"],
    Arrow: ["00011000", "00111100", "01111110", "11111111", "00011000", "00011000", "00011000", "00011000"]
  };
  var KEYPAD = [
    ["1", "2", "3", "A"],
    ["4", "5", "6", "B"],
    ["7", "8", "9", "C"],
    ["*", "0", "#", "D"]
  ];
  var REMOTE_KEYS = [
    ["power", "Power"],
    ["vol-up", "Vol +"],
    ["func-stop", "Func/stop"],
    ["prev", "Previous"],
    ["play", "Play"],
    ["next", "Next"],
    ["down", "Down"],
    ["vol-down", "Vol −"],
    ["up", "Up"],
    ["0", "0"],
    ["eq", "EQ"],
    ["st-rept", "ST/REPT"],
    ..."123456789".split("").map((k) => [k, k])
  ];
  var flow2 = {
    type: "enum",
    label: "Current",
    choices: [choice(false, "Off"), choice(true, "Flowing"), choice("reverse", "Reversed")],
    default: false
  };
  var probe2 = (pins) => ({
    type: "enum",
    label: "Probe on pin",
    choices: [choice("", "None"), ...pins.map((p) => choice(p, p))],
    default: ""
  });
  var OPTIONS = {
    // Boards.
    unoClassBoard: BOARD,
    nanoClassBoard: BOARD,
    megaClassBoard: BOARD,
    nanoRp2040Board: BOARD,
    picoClassBoard: { indicators: lamps2({ user: "User LED" }) },
    esp32DevKitV1: BOARD,
    esp32DevKitCV4: POWER_BOARD,
    esp32C3DevKit: POWER_BOARD,
    esp32C5DevKit: POWER_BOARD,
    esp32C6DevKit: POWER_BOARD,
    esp32H2DevKit: POWER_BOARD,
    esp32S2DevKit: POWER_BOARD,
    esp32S3DevKit: POWER_BOARD,
    stm32L031K6Board: POWER_BOARD,
    stm32C031C6Board: POWER_BOARD,
    bluePillBoard: BOARD,
    franzininho: { indicators: lamps2({ power: "Power LED", user: "User LED" }, ["power"]) },
    // Displays.
    characterLcd: {
      lines: state({
        type: "list",
        label: "Lines",
        items: { type: "text", label: "Line", maxLength: 20 },
        example: ["Hello, world", "DeepCircuits"]
      }),
      glyphs: state({
        type: "list",
        label: "Cells",
        items: { type: "list", items: { type: "integer", min: 0, max: 31 }, length: 8 }
      }),
      color: {
        type: "enum",
        label: "Backlight",
        choices: [choice("green", "Green", FALLBACK["lcd-green"]), choice("blue", "Blue", FALLBACK["lcd-blue"])],
        default: "green"
      },
      backpack: bool("I2C backpack")
    },
    ssd1306Module: screen2(),
    oledBreakout: screen2("blue"),
    sh1107Module: screen2(),
    tftModule: screen2("red", "Hello, bench!"),
    ili9341TouchDisplay: screen2(null, "Touch me"),
    nokiaModule: screen2("red"),
    epaperModule: screen2("blue", "Hello, bench!"),
    sevenSegment: {
      value: state({ type: "text", label: "Text", numeric: true, default: "8", maxLength: 8 }),
      dp: state({ type: "list", label: "Points", items: { type: "boolean" } }),
      colon: state({ type: "level", label: "Colon", default: false, when: { digits: 4 } }),
      levels: state({ type: "list", label: "Segment levels", items: { type: "number", min: 0, max: 1 } }),
      color: lens2("red")
    },
    tm1637Module: {
      value: state({ type: "text", label: "Text", numeric: true, default: "", maxLength: 4, example: "1230" }),
      colon: state(bool("Colon")),
      color: lens2("red"),
      finish: finish2("blue")
    },
    max7219Matrix: {
      lit: state({
        type: "list",
        label: "Picture",
        items: { type: "list", items: { type: "text", maxLength: 8 }, length: 8 },
        examples: Object.entries(GLYPHS).map(([label, rows]) => ({ label, value: rows, each: true }))
      }),
      color: lens2("red")
    },
    neopixelMatrix: { colors: pixels(64) },
    ledRing: { colors: pixels(16) },
    // Sensors.
    ultrasonicRanger: { finish: finish2("blue") },
    dht22Sensor: {},
    dht11Module: { indicators: lamps2({ power: "Power LED" }), finish: finish2("black") },
    bmp180Board: { finish: finish2("blue") },
    lightSensor: SENSOR_BOARD("blue"),
    flameSensor: SENSOR_BOARD("blue"),
    soundSensor: { ...SENSOR_BOARD("red"), small: bool("Small board, 6 mm capsule") },
    tiltSwitch: SENSOR_BOARD("blue"),
    gasSensor: SENSOR_BOARD("blue"),
    irReceiver: { finish: finish2("black") },
    ntcSensor: { finish: finish2("black") },
    pirModule: { finish: finish2("green") },
    mpu6050Imu: { finish: finish2("blue") },
    pulseSensor: { on: state(bool("Beat LED")) },
    ds18b20Sensor: {},
    // Inputs.
    pushbutton: {
      pressed: state(bool("Pressed")),
      cap: {
        type: "color",
        label: "Cap",
        choices: [choice("black", "Black", FALLBACK["plastic-black"]), ...LENS_CHOICES],
        default: "black"
      }
    },
    potentiometer: { position: state(unit("Position", { step: 0.01, default: 0.5 })) },
    slidePotentiometer: { position: state(unit("Position", { step: 0.01, default: 0 })) },
    slideSwitch: {
      contact: state({
        type: "enum",
        label: "Middle pin joins",
        choices: [choice(1, "Pin 1"), choice(3, "Pin 3")],
        default: 1
      })
    },
    rotaryEncoder: {
      detent: state({ type: "integer", label: "Detent", min: 0, max: 19, step: 1, default: 0 }),
      pressed: state(bool("Pressed")),
      finish: finish2("black")
    },
    joystick: {
      x: state({ type: "number", label: "X", min: -1, max: 1, step: 0.05, default: 0 }),
      y: state({ type: "number", label: "Y", min: -1, max: 1, step: 0.05, default: 0 }),
      pressed: state(bool("Pressed")),
      finish: finish2("black")
    },
    keypad: {
      pressed: state({
        type: "list",
        label: "Keys held",
        items: { type: "list", items: { type: "boolean" }, length: 4 },
        length: 4,
        examples: ["1", "5", "9", "A", "*", "#"].map((key) => ({
          label: key,
          value: KEYPAD.map((row) => row.map((k) => k === key ? 1 : 0))
        }))
      })
    },
    dipSwitch: { values: state({ type: "list", label: "Switches on", items: { type: "boolean" }, length: 8 }) },
    irRemote: {
      pressed: state({
        type: "enum",
        label: "Key held",
        choices: [choice("", "None"), ...REMOTE_KEYS.map(([k, label]) => choice(k, label))],
        default: ""
      })
    },
    rotaryDialer: {
      // 324°: the 0's hole wound round to the finger stop.
      angle: state({ type: "number", label: "Dial", min: 0, max: 324, step: 1, unit: "°", default: 0 })
    },
    // Outputs.
    led: {
      color: lens2("red"),
      on: state(bool("Lit")),
      brightness: state(unit("Brightness", { default: 1, when: { on: true } })),
      live: state({ type: "object", label: "Live layer", fields: { flow: flow2, probe: probe2(["A", "K"]) } })
    },
    rgbLed: {
      r: state(unit("Red")),
      g: state(unit("Green")),
      b: state(unit("Blue"))
    },
    ledBarGraph: {
      levels: state({ type: "list", label: "Bar levels", items: { type: "number", min: 0, max: 1 }, length: 10 }),
      color: lens2("red")
    },
    neopixel: {
      color: state({ type: "pixel", label: "Colour", choices: PIXEL_CHOICES }),
      r: state(unit("Red")),
      g: state(unit("Green")),
      b: state(unit("Blue"))
    },
    ledStrip: {
      colors: pixels(8),
      pixels: { type: "integer", label: "Pixels", min: 1, max: 1024, step: 1, default: 8 },
      pixelSize: {
        type: "enum",
        label: "Pixel size",
        choices: [choice("5050", "5050"), choice("3535", "3535"), choice("2020", "2020")],
        default: "5050"
      },
      pixelShape: {
        type: "enum",
        label: "Pixel shape",
        choices: [choice("square", "Square"), choice("round", "Round")],
        default: "square"
      }
    },
    buzzer: { live: state({ type: "object", label: "Live layer", fields: { flow: flow2, probe: probe2(["+", "-"]) } }) },
    servo: { angle: state({ type: "number", label: "Angle", min: -90, max: 90, step: 1, unit: "°", default: 0 }) },
    stepper: {
      angle: state({ type: "number", label: "Angle", min: 0, max: 360, step: 1.8, unit: "°", default: 0 }),
      angle2: state({
        type: "number",
        label: "Outer angle",
        min: 0,
        max: 360,
        step: 6,
        unit: "°",
        default: 0,
        when: { biaxial: true }
      })
    },
    relay: { energised: state(bool("Energised")) },
    // Modules.
    relayModule: { indicators: lamps2({ power: "Power LED", status: "Status LED" }, ["power"]), finish: finish2("red") },
    hx711Board: { finish: finish2("red") },
    microsdModule: { finish: finish2("blue") },
    rtcModule: { finish: finish2("blue") },
    rfidModule: { indicators: lamps2({ power: "Power LED" }), finish: finish2("blue") },
    logicAnalyzer: {
      state: state({
        type: "enum",
        label: "State",
        choices: ["idle", "armed", "recording", "paused", "full", "error"].map((s) => choice(s, cap(s))),
        default: "idle"
      }),
      samples: state({ type: "integer", label: "Samples", min: 0, max: 1e6, step: 1, default: 0 }),
      lit: state({ type: "list", label: "Channels high", items: { type: "boolean" }, length: 8 }),
      activity: state(unit("Activity"))
    },
    neopixelMeter: {
      status: state({
        type: "enum",
        label: "Status",
        choices: [
          choice("idle", "Idle"),
          choice("ok", "OK"),
          choice("near", "Near the limit"),
          choice("over", "Over the limit")
        ],
        default: "idle"
      }),
      fps: state({
        type: "number",
        label: "Frames a second",
        min: 0,
        max: 240,
        step: 1,
        default: 0,
        when: { status: ["ok", "near", "over"] }
      }),
      pixels: state({
        type: "integer",
        label: "Pixels",
        min: 0,
        max: 1024,
        step: 1,
        default: 0,
        when: { status: ["ok", "near", "over"] }
      }),
      amps: state({
        type: "number",
        label: "Current",
        min: 0,
        max: 10,
        step: 0.05,
        unit: "A",
        default: 0,
        when: { status: ["ok", "near", "over"] }
      }),
      watts: state({
        type: "number",
        label: "Power",
        min: 0,
        max: 50,
        step: 0.1,
        unit: "W",
        default: 0,
        when: { status: ["ok", "near", "over"] }
      }),
      peakAmps: state({
        type: "number",
        label: "Peak current",
        min: 0,
        max: 10,
        step: 0.05,
        unit: "A",
        default: 0,
        when: { status: ["ok", "near", "over"] }
      }),
      limitAmps: state({
        type: "number",
        label: "Supply limit",
        min: 0,
        max: 10,
        step: 0.5,
        unit: "A",
        default: 0,
        when: { status: ["ok", "near", "over"] }
      })
    },
    // Chips.
    ne555Timer: { package: pkg("dip") },
    shiftRegister595: { package: pkg("dip") },
    shiftRegister165: { package: pkg("dip") },
    ledDriver595: { package: pkg("tssop") },
    attiny85: { package: pkg("dip") },
    // Passives.
    resistor: {
      ohms: {
        type: "number",
        label: "Resistance",
        min: 0,
        step: 1,
        unit: "Ω",
        default: 1e3,
        examples: [220, 1e3, 1e4, 1e5].map((v) => ({ label: `${v >= 1e3 ? `${v / 1e3} k` : `${v} `}Ω`, value: v }))
      },
      tolerance: { type: "enum", label: "Tolerance", choices: [choice(5, "5%"), choice(10, "10%")], default: 5 },
      span: { type: "integer", label: "Lead spacing", min: 3, max: 12, step: 1, unit: "pitches", default: 4 },
      live: state({
        type: "object",
        label: "Live layer",
        fields: { flow: flow2, heat: unit("Heat"), probe: probe2(["1", "2"]) }
      })
    },
    capacitor: {
      code: {
        type: "text",
        label: "Value code",
        default: "104",
        maxLength: 4,
        when: { kind: "ceramic" },
        examples: [
          { label: "100 nF", value: "104" },
          { label: "10 nF", value: "103" },
          { label: "2.2 nF", value: "222" },
          { label: "22 pF", value: "220" }
        ]
      }
    },
    // Breadboards.
    breadboard: {
      color: {
        type: "enum",
        label: "Colour",
        choices: BREADBOARD_COLORS.map(
          (c) => choice(c, cap(c), c === "white" ? FALLBACK["bread-body"] : BREADBOARD_PAINT[c].body)
        ),
        default: "white"
      },
      splitRails: bool("Split rails", { when: { variant: "breadboard" } }),
      occupied: state({ type: "list", label: "Holes in use", items: { type: "point" } })
    },
    // Symbols.
    logicSymbol: {
      inputs: {
        type: "integer",
        label: "Inputs",
        min: 2,
        max: 8,
        step: 1,
        default: 2,
        when: { gate: ["and", "nand", "or", "nor", "xor", "xnor"] }
      }
    },
    muxSymbol: {},
    flipFlopSymbol: {},
    clockGenerator: { label: { type: "text", label: "Label", default: "CLK", maxLength: 8 } },
    supplySymbol: { voltage: { type: "number", label: "Voltage", min: 0, max: 48, step: 0.1, unit: "V" } }
  };

  // src/catalog.js
  var FAMILIES = [
    "board",
    "display",
    "sensor",
    "input",
    "output",
    "module",
    "chip",
    "passive",
    "breadboard",
    "symbol"
  ];
  var PARTS = [
    ["uno-class-board", "Uno-class board", "board", "unoClassBoard", null, ["Arduino Uno", "ATmega328P"]],
    ["nano-class-board", "Nano-class board", "board", "nanoClassBoard", null, ["Arduino Nano", "ATmega328P"]],
    ["mega-class-board", "Mega-class board", "board", "megaClassBoard", null, ["Arduino Mega", "ATmega2560"]],
    ["rp2040-nano-class-board", "RP2040 Nano-class board", "board", "nanoRp2040Board", null, ["Nano RP2040 Connect"]],
    ["pico-class-board", "Pico-class board", "board", "picoClassBoard", null, ["Raspberry Pi Pico", "RP2040"]],
    [
      "esp32-dev-board-30-pin",
      "ESP32 dev board, 30-pin",
      "board",
      "esp32DevKitV1",
      null,
      ["ESP32 DevKit V1", "ESP-WROOM-32"]
    ],
    [
      "esp32-dev-board-38-pin",
      "ESP32 dev board, 38-pin",
      "board",
      "esp32DevKitCV4",
      null,
      ["ESP32-DevKitC V4", "ESP32-WROOM-32"]
    ],
    ["esp32-c3-dev-board", "ESP32-C3 dev board", "board", "esp32C3DevKit", null, ["ESP32-C3-DevKitM-1"]],
    ["esp32-c5-dev-board", "ESP32-C5 dev board", "board", "esp32C5DevKit", null, ["ESP32-C5-DevKitC-1"]],
    ["esp32-c6-dev-board", "ESP32-C6 dev board", "board", "esp32C6DevKit", null, ["ESP32-C6-DevKitC-1"]],
    ["esp32-h2-dev-board", "ESP32-H2 dev board", "board", "esp32H2DevKit", null, ["ESP32-H2-DevKitM-1"]],
    ["esp32-s2-dev-board", "ESP32-S2 dev board", "board", "esp32S2DevKit", null, ["ESP32-S2-DevKitM-1"]],
    ["esp32-s3-dev-board", "ESP32-S3 dev board", "board", "esp32S3DevKit", null, ["ESP32-S3-DevKitC-1"]],
    ["stm32-board-32-pin", "STM32 board, 32-pin", "board", "stm32L031K6Board", null, ["Nucleo-32", "STM32L031K6"]],
    ["stm32-board-64-pin", "STM32 board, 64-pin", "board", "stm32C031C6Board", null, ["Nucleo-64", "STM32C031C6"]],
    ["stm32-blue-pill", "STM32 Blue Pill", "board", "bluePillBoard", null, ["STM32F103C8"]],
    ["franzininho-diy", "Franzininho DIY", "board", "franzininho", null, ["ATtiny85"]],
    [
      "character-lcd-16x2",
      "Character LCD, 16×2",
      "display",
      "characterLcd",
      { cols: 16, rows: 2 },
      ["LCD1602", "HD44780"]
    ],
    [
      "character-lcd-20x4",
      "Character LCD, 20×4",
      "display",
      "characterLcd",
      { cols: 20, rows: 4 },
      ["LCD2004", "HD44780"]
    ],
    ["oled-0-96in-i2c", "OLED, 0.96″ I2C", "display", "ssd1306Module", null, ["SSD1306", "128x64"]],
    ["oled-0-96in-spi", "OLED, 0.96″ SPI", "display", "oledBreakout", null, ["SSD1306", "128x64"]],
    ["oled-1-5in", "OLED, 1.5″", "display", "sh1107Module", null, ["SH1107", "128x128"]],
    ["tft-display-2-4in", "TFT display, 2.4″", "display", "tftModule", null, ["ILI9341", "240x320"]],
    ["tft-display-2-8in-touch", "TFT display, 2.8″ touch", "display", "ili9341TouchDisplay", null, ["ILI9341", "FT6206"]],
    ["graphic-lcd-84x48", "Graphic LCD, 84×48", "display", "nokiaModule", null, ["PCD8544", "Nokia 5110"]],
    ["e-paper-display-2-9in", "E-paper display, 2.9″", "display", "epaperModule", null, ["e-ink", "296x128"]],
    [
      "seven-segment-display-1-digit",
      "Seven-segment display, 1 digit",
      "display",
      "sevenSegment",
      { digits: 1 },
      ["7-segment"]
    ],
    [
      "seven-segment-display-4-digits",
      "Seven-segment display, 4 digits",
      "display",
      "sevenSegment",
      { digits: 4 },
      ["7-segment"]
    ],
    ["clock-display", "Clock display", "display", "tm1637Module", null, ["TM1637", "7-segment"]],
    ["led-matrix-8x8", "LED matrix, 8×8", "display", "max7219Matrix", { chain: 1 }, ["MAX7219"]],
    ["led-matrix-chain-of-4", "LED matrix, chain of 4", "display", "max7219Matrix", { chain: 4 }, ["MAX7219"]],
    ["rgb-led-matrix-8x8", "RGB LED matrix, 8×8", "display", "neopixelMatrix", null, ["WS2812B", "NeoPixel"]],
    ["led-ring-16-leds", "LED ring, 16 LEDs", "display", "ledRing", null, ["WS2812B", "NeoPixel ring"]],
    ["ultrasonic-ranger", "Ultrasonic ranger", "sensor", "ultrasonicRanger", null, ["HC-SR04", "distance"]],
    [
      "temperature-and-humidity-sensor",
      "Temperature and humidity sensor",
      "sensor",
      "dht22Sensor",
      null,
      ["DHT22", "AM2302"]
    ],
    ["temperature-and-humidity-module", "Temperature and humidity module", "sensor", "dht11Module", null, ["DHT11"]],
    [
      "pressure-sensor-4-pin",
      "Pressure sensor, 4-pin",
      "sensor",
      "bmp180Board",
      { variant: "gy68" },
      ["BMP180", "GY-68", "barometer"]
    ],
    [
      "pressure-sensor-5-pin",
      "Pressure sensor, 5-pin",
      "sensor",
      "bmp180Board",
      { variant: "five-pin" },
      ["BMP180", "barometer"]
    ],
    ["light-sensor", "Light sensor", "sensor", "lightSensor", null, ["LDR", "photoresistor"]],
    ["flame-sensor", "Flame sensor", "sensor", "flameSensor", null, ["infrared"]],
    ["sound-sensor", "Sound sensor", "sensor", "soundSensor", null, ["microphone", "KY-037", "KY-038"]],
    ["tilt-switch", "Tilt switch", "sensor", "tiltSwitch", null, ["SW-520D"]],
    ["gas-sensor", "Gas sensor", "sensor", "gasSensor", null, ["MQ-2", "MQ-135"]],
    ["ir-receiver", "IR receiver", "sensor", "irReceiver", null, ["KY-022", "infrared", "VS1838B"]],
    ["ntc-thermistor", "NTC thermistor", "sensor", "ntcSensor", null, ["KY-013", "temperature"]],
    ["pir-motion-sensor", "PIR motion sensor", "sensor", "pirModule", null, ["HC-SR501"]],
    ["accelerometer-and-gyro", "Accelerometer and gyro", "sensor", "mpu6050Imu", null, ["MPU6050", "IMU", "GY-521"]],
    ["pulse-sensor", "Pulse sensor", "sensor", "pulseSensor", null, ["heart rate"]],
    ["ds18b20-temperature-sensor", "DS18B20 temperature sensor", "sensor", "ds18b20Sensor", null, ["1-Wire", "TO-92"]],
    ["pushbutton", "Pushbutton", "input", "pushbutton", { size: 12 }, ["button", "tactile switch"]],
    ["pushbutton-6-mm", "Pushbutton, 6 mm", "input", "pushbutton", { size: 6 }, ["button", "tactile switch"]],
    ["potentiometer", "Potentiometer", "input", "potentiometer", null, ["knob", "pot"]],
    ["slide-potentiometer", "Slide potentiometer", "input", "slidePotentiometer", null, ["fader", "slider"]],
    ["slide-switch", "Slide switch", "input", "slideSwitch", null, ["SPDT"]],
    ["rotary-encoder", "Rotary encoder", "input", "rotaryEncoder", null, ["KY-040"]],
    ["joystick", "Joystick", "input", "joystick", null, ["KY-023", "thumbstick"]],
    ["keypad-4x4", "Keypad, 4×4", "input", "keypad", null, ["membrane keypad", "matrix keypad"]],
    ["dip-switch-8-way", "DIP switch, 8-way", "input", "dipSwitch", { count: 8 }, ["switch bank"]],
    ["ir-remote", "IR remote", "input", "irRemote", null, ["infrared remote"]],
    ["rotary-dialer", "Rotary dialer", "input", "rotaryDialer", null, ["telephone dial"]],
    ["led-5-mm", "LED, 5 mm", "output", "led", null, ["light-emitting diode"]],
    ["rgb-led", "RGB LED", "output", "rgbLed", null, ["common cathode"]],
    ["led-bar-graph", "LED bar graph", "output", "ledBarGraph", null, ["10-segment"]],
    ["addressable-led", "Addressable LED", "output", "neopixel", null, ["WS2812B", "NeoPixel"]],
    ["addressable-led-strip", "Addressable LED strip", "output", "ledStrip", null, ["WS2812B", "NeoPixel strip"]],
    ["piezo-buzzer", "Piezo buzzer", "output", "buzzer", null, ["beeper", "speaker"]],
    ["servo", "Servo", "output", "servo", null, ["SG90", "micro servo"]],
    ["stepper-motor", "Stepper motor", "output", "stepper", { biaxial: false }, ["NEMA 17"]],
    ["biaxial-stepper", "Biaxial stepper", "output", "stepper", { biaxial: true }, ["clock motor"]],
    ["dpdt-relay", "DPDT relay", "output", "relay", null, ["relay"]],
    ["relay-module", "Relay module", "module", "relayModule", null, ["relay", "SRD-05VDC"]],
    ["load-cell-amplifier", "Load cell amplifier", "module", "hx711Board", null, ["HX711", "scale"]],
    ["microsd-card-module", "microSD card module", "module", "microsdModule", null, ["SD card"]],
    ["real-time-clock", "Real-time clock", "module", "rtcModule", null, ["DS1307", "DS3231", "RTC"]],
    ["rfid-reader", "RFID reader", "module", "rfidModule", null, ["MFRC522", "RC522", "NFC"]],
    ["logic-analyzer", "Logic analyzer", "module", "logicAnalyzer", null, ["8 channels"]],
    ["pixel-meter", "Pixel meter", "module", "neopixelMeter", null, ["NeoPixel", "current meter"]],
    ["ne555-timer", "NE555 timer", "chip", "ne555Timer", null, ["555"]],
    ["shift-register-74hc595", "Shift register, 74HC595", "chip", "shiftRegister595", null, ["SIPO"]],
    ["shift-register-74hc165", "Shift register, 74HC165", "chip", "shiftRegister165", null, ["PISO"]],
    ["nlsf595-driver", "NLSF595 driver", "chip", "ledDriver595", null, ["LED driver"]],
    ["attiny85", "ATtiny85", "chip", "attiny85", null, ["microcontroller"]],
    ["resistor", "Resistor", "passive", "resistor", null, ["ohm"]],
    ["electrolytic-capacitor", "Electrolytic capacitor", "passive", "capacitor", { kind: "electrolytic" }, ["capacitor"]],
    ["ceramic-capacitor", "Ceramic capacitor", "passive", "capacitor", { kind: "ceramic" }, ["capacitor", "MLCC"]],
    ["mini-breadboard", "Mini breadboard", "breadboard", "breadboard", { variant: "breadboard-mini" }, ["170 points"]],
    ["half-breadboard", "Half breadboard", "breadboard", "breadboard", { variant: "breadboard-half" }, ["400 points"]],
    ["full-breadboard", "Full breadboard", "breadboard", "breadboard", { variant: "breadboard" }, ["830 points"]],
    ["and-gate", "AND gate", "symbol", "logicSymbol", { gate: "and" }, ["logic gate"]],
    ["nand-gate", "NAND gate", "symbol", "logicSymbol", { gate: "nand" }, ["logic gate"]],
    ["or-gate", "OR gate", "symbol", "logicSymbol", { gate: "or" }, ["logic gate"]],
    ["nor-gate", "NOR gate", "symbol", "logicSymbol", { gate: "nor" }, ["logic gate"]],
    ["xor-gate", "XOR gate", "symbol", "logicSymbol", { gate: "xor" }, ["logic gate"]],
    ["xnor-gate", "XNOR gate", "symbol", "logicSymbol", { gate: "xnor" }, ["logic gate"]],
    ["not-gate", "NOT gate", "symbol", "logicSymbol", { gate: "not" }, ["inverter", "logic gate"]],
    ["buffer", "Buffer", "symbol", "logicSymbol", { gate: "buffer" }, ["logic gate"]],
    ["multiplexer", "Multiplexer", "symbol", "muxSymbol", null, ["mux"]],
    ["d-flip-flop", "D flip-flop", "symbol", "flipFlopSymbol", null, ["latch"]],
    [
      "d-flip-flop-with-set-and-reset",
      "D flip-flop with set and reset",
      "symbol",
      "flipFlopSymbol",
      { set: true, reset: true },
      ["latch"]
    ],
    ["clock-source", "Clock source", "symbol", "clockGenerator", null, ["oscillator"]],
    ["supply", "Supply", "symbol", "supplySymbol", null, ["VCC", "power"]]
  ];
  function optionApplies(spec, values) {
    if (!spec.when) return true;
    return Object.entries(spec.when).every(([k, want]) => {
      const v = values[k] === void 0 ? null : values[k];
      return (Array.isArray(want) ? want : [want]).some((w) => w === v);
    });
  }
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      for (const v of Object.values(value)) freeze(v);
    }
    return value;
  }
  function entry([id, name, family, fn, preset, aliases]) {
    const all = OPTIONS[fn];
    if (!all) throw new Error(`${id}: no options for ${fn}`);
    const options = {};
    preset = preset || {};
    for (const [k, spec] of Object.entries(all)) {
      if (k in preset) continue;
      if (!spec.when || Object.keys(spec.when).every((w) => !(w in preset)) || optionApplies(spec, preset))
        options[k] = spec;
    }
    const stateNames = Object.keys(options).filter((k) => options[k].state);
    return { id, name, family, fn, preset, options, state: stateNames, aliases };
  }
  var CATALOG = freeze(PARTS.map(entry));
  var byId = new Map(CATALOG.map((e) => [e.id, e]));
  function findPart(id) {
    return byId.get(id);
  }
  function distance(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function nearest(word, words) {
    let best = null;
    let bestD = Infinity;
    for (const w of words) {
      const dist = distance(word.toLowerCase(), w.toLowerCase());
      if (dist < bestD) [best, bestD] = [w, dist];
    }
    return best && bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
  }
  var isColor = (v) => typeof v === "string" && /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]{3,20}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\))$/i.test(
    v
  );
  var isNum = (v) => typeof v === "number" && isFinite(v);
  function problemsOf(spec, value, where) {
    if (value === void 0 || value === null) return [];
    const out = [];
    const bad = (what) => out.push(`${where} must be ${what}`);
    switch (spec.type) {
      case "boolean":
        if (typeof value !== "boolean" && value !== 0 && value !== 1) bad("true or false");
        break;
      case "number":
      case "integer":
        if (!isNum(value) || spec.type === "integer" && !Number.isInteger(value))
          bad(`a${spec.type === "integer" ? "n integer" : " number"}`);
        break;
      case "level":
        if (typeof value !== "boolean" && !isNum(value)) bad("true, false or a level from 0 to 1");
        break;
      case "enum":
        if (!spec.choices.some((c) => c.value === value))
          bad(`one of ${spec.choices.map((c) => JSON.stringify(c.value)).join(", ")}`);
        break;
      case "color":
        if (!isColor(value)) bad("a lens colour name or a CSS colour");
        break;
      case "pixel":
        if (!isColor(value) && !(value && typeof value === "object" && isNum(value.r) && isNum(value.g) && isNum(value.b)))
          bad("a CSS colour, { r, g, b } or null");
        break;
      case "text":
        if (typeof value !== "string" && !(spec.numeric && isNum(value))) bad(spec.numeric ? "text or a number" : "text");
        break;
      case "frame":
        if (!value || typeof value !== "object" || !isNum(value.width) || !isNum(value.height) || value.data == null)
          bad("a picture { width, height, data }");
        break;
      case "point":
        if (!value || typeof value !== "object" || !isNum(value.x) || !isNum(value.y)) bad("a point { x, y }");
        break;
      case "list":
        if (!Array.isArray(value)) bad("a list");
        else value.forEach((item, i) => out.push(...problemsOf(spec.items, item, `${where}[${i}]`)));
        break;
      case "object":
        if (typeof value !== "object" || Array.isArray(value)) bad("an object");
        else
          for (const [k, v] of Object.entries(value)) {
            if (spec.fields[k]) out.push(...problemsOf(spec.fields[k], v, `${where}.${k}`));
            else {
              const near = nearest(k, Object.keys(spec.fields));
              out.push(
                `${where} has no "${k}"${near ? `; did you mean "${near}"?` : ""} It takes ${Object.keys(spec.fields).join(", ")}.`
              );
            }
          }
        break;
      default:
    }
    return out;
  }
  function checkOptions(id, options) {
    const e = findPart(id);
    if (!e) {
      const near = nearest(
        String(id),
        CATALOG.map((c) => c.id)
      );
      return [`There is no catalog part "${id}"${near ? `; did you mean "${near}"?` : ""}`];
    }
    if (options === void 0 || options === null) return [];
    if (typeof options !== "object" || Array.isArray(options)) return [`${e.id}: the options must be an object`];
    const out = [];
    const names = Object.keys(e.options);
    for (const [k, v] of Object.entries(options)) {
      const spec = e.options[k];
      if (spec) out.push(...problemsOf(spec, v, `${e.id}: "${k}"`));
      else {
        const near = nearest(k, names);
        const fixed = k in e.preset ? ` (the part sets it: ${JSON.stringify(e.preset[k])})` : "";
        out.push(
          `${e.id} has no option "${k}"${fixed}${near ? `; did you mean "${near}"?` : ""}${names.length ? ` Its options are ${names.join(", ")}.` : " It takes no options."}`
        );
      }
    }
    return out;
  }
  function callOf(id, options) {
    const problems = checkOptions(id, options);
    if (problems.length) throw new Error(problems.join("\n"));
    const e = findPart(id);
    return { entry: e, props: { ...e.preset, ...options } };
  }
  var fold = (s) => String(s).toLowerCase().replace(/×/g, "x").replace(/″/g, "in").replace(/[^a-z0-9]+/g, "");
  function searchParts(query) {
    const words = String(query || "").split(/\s+/).map(fold).filter(Boolean);
    if (!words.length) return CATALOG.slice();
    const scored = [];
    for (const e of CATALOG) {
      const terms = [e.id, e.name, ...e.aliases].map(fold);
      let score = 0;
      for (const w of words) {
        const s = terms.reduce((best, t) => Math.max(best, t === w ? 3 : t.startsWith(w) ? 2 : t.includes(w) ? 1 : 0), 0);
        if (!s) {
          score = 0;
          break;
        }
        score += s;
      }
      if (score) scored.push([score, e]);
    }
    return scored.sort((a, b) => b[0] - a[0]).map(([, e]) => e);
  }
  var FAMILY_MODULES = {
    board: () => Promise.resolve().then(() => (init_boards2(), boards_exports)),
    display: () => Promise.resolve().then(() => (init_displays2(), displays_exports)),
    sensor: () => Promise.resolve().then(() => (init_sensors2(), sensors_exports)),
    input: () => Promise.resolve().then(() => (init_inputs2(), inputs_exports)),
    output: () => Promise.resolve().then(() => (init_outputs(), outputs_exports)),
    module: () => Promise.resolve().then(() => (init_modules2(), modules_exports)),
    chip: () => Promise.resolve().then(() => (init_chips2(), chips_exports)),
    passive: () => Promise.resolve().then(() => (init_passives2(), passives_exports)),
    breadboard: () => Promise.resolve().then(() => (init_breadboards(), breadboards_exports)),
    symbol: () => Promise.resolve().then(() => (init_symbols2(), symbols_exports))
  };
  async function loadPart(id) {
    const e = findPart(id);
    if (!e) throw new Error(checkOptions(id)[0]);
    const family = await FAMILY_MODULES[e.family]();
    const draw = family[e.fn];
    return (options) => draw(callOf(e.id, options).props);
  }

  // src/draw.js
  init_boards2();
  init_displays2();
  init_sensors2();
  init_inputs2();
  init_outputs();
  init_modules2();
  init_chips2();
  init_passives2();
  init_breadboards();
  init_symbols2();
  var DRAW = {
    ...boards_exports,
    ...displays_exports,
    ...sensors_exports,
    ...inputs_exports,
    ...outputs_exports,
    ...modules_exports,
    ...chips_exports,
    ...passives_exports,
    ...breadboards_exports,
    ...symbols_exports
  };
  function drawPart(id, options) {
    const { entry: entry2, props } = callOf(id, options);
    return DRAW[entry2.fn](props);
  }
  var PINS = /* @__PURE__ */ new Map();
  function partPins(id, options) {
    const key = `${id} ${JSON.stringify(options || {})}`;
    let found = PINS.get(key);
    if (!found) {
      const art2 = drawPart(id, options);
      found = Object.freeze({
        width: art2.width,
        height: art2.height,
        pins: Object.freeze(art2.pins.map((p) => Object.freeze({ ...p })))
      });
      if (PINS.size >= 500) PINS.delete(PINS.keys().next().value);
      PINS.set(key, found);
    }
    return found;
  }

  // src/helpers.js
  init_tokens();
  var round = (v) => Math.round(v * 100) / 100;
  function parts(art2) {
    const open = /^<svg\b[^>]*>/.exec(art2.svg);
    const close = art2.svg.lastIndexOf("</svg>");
    if (!open || close < 0) throw new Error("The drawing has no svg root.");
    return { open: open[0], inner: art2.svg.slice(open[0].length, close) };
  }
  var sized = (open, w, h) => open.replace(/\swidth="[^"]*"/, ` width="${w}"`).replace(/\sheight="[^"]*"/, ` height="${h}"`).replace(/\sviewBox="[^"]*"/, ` viewBox="0 0 ${w} ${h}"`);
  function rotateArtwork(art2, quarterTurns) {
    const t = (Math.round(Number(quarterTurns) || 0) % 4 + 4) % 4;
    if (!t) return { ...art2, pins: art2.pins.slice() };
    const { width: w, height: h } = art2;
    const { open, inner } = parts(art2);
    const [W, H] = t === 2 ? [w, h] : [h, w];
    const transform = t === 1 ? `translate(${h} 0) rotate(90)` : t === 2 ? `translate(${w} ${h}) rotate(180)` : `translate(0 ${w}) rotate(-90)`;
    const turn2 = (p) => t === 1 ? { ...p, x: round(h - p.y), y: round(p.x) } : t === 2 ? { ...p, x: round(w - p.x), y: round(h - p.y) } : { ...p, x: round(p.y), y: round(w - p.x) };
    return {
      width: W,
      height: H,
      svg: `${sized(open, W, H)}<g transform="${transform}">${inner}</g></svg>`,
      pins: art2.pins.map(turn2)
    };
  }
  function flipArtwork(art2, axis) {
    if (axis !== "horizontal" && axis !== "vertical") throw new Error("flipArtwork takes 'horizontal' or 'vertical'.");
    const { width: w, height: h } = art2;
    const { open, inner } = parts(art2);
    const across = axis === "horizontal";
    const transform = across ? `translate(${w} 0) scale(-1 1)` : `translate(0 ${h}) scale(1 -1)`;
    return {
      width: w,
      height: h,
      svg: `${open}<g transform="${transform}">${inner}</g></svg>`,
      pins: art2.pins.map((p) => across ? { ...p, x: round(w - p.x) } : { ...p, y: round(h - p.y) })
    };
  }
  function scopeIds(art2, prefix2) {
    const pre = String(prefix2);
    return {
      ...art2,
      svg: art2.svg.replace(/\sid="([^"]+)"/g, ` id="${pre}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`).replace(/href="#([^"]+)"/g, `href="#${pre}$1"`)
    };
  }
  function toDataUrl(art2, props) {
    const ink = props && props.ink || FALLBACK["canvas-ink"];
    const { open } = parts(art2);
    const root = /\scolor="[^"]*"/.test(open) ? open.replace(/\scolor="[^"]*"/, ` color="${ink}"`) : open.replace("<svg", `<svg color="${ink}"`);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(root + art2.svg.slice(open.length))}`;
  }

  // src/index.js
  init_core();
  init_breadboardColors();
  init_pixels();

  // src/templates.js
  init_boards();
  init_modules();
  init_sensors();
  init_core();

  // src/primitives.js
  init_core();
  init_pieces();
  init_passives();
  init_pixels();
  init_breadboardColors();
  init_breadboard();

  // src/check.js
  init_core();
  init_core();
  function check(a) {
    let items = [];
    const stack = [];
    const re = /<(\/?)(g|rect|circle|ellipse|line|path|text)\b([^>]*?)(\/?)>([^<]*)/g;
    let m;
    const attr = function(s, n) {
      const r = new RegExp(`(?:^|\\s)${n}="([^"]*)"`).exec(s);
      return r ? r[1] : null;
    };
    const num2 = function(s, n, d) {
      const v = attr(s, n);
      return v === null ? d : parseFloat(v);
    };
    function xf(t) {
      let M = [1, 0, 0, 1, 0, 0];
      let r;
      const reT = /(translate|scale|rotate|matrix)\(([^)]*)\)/g;
      const mul = function(A, B) {
        return [
          A[0] * B[0] + A[2] * B[1],
          A[1] * B[0] + A[3] * B[1],
          A[0] * B[2] + A[2] * B[3],
          A[1] * B[2] + A[3] * B[3],
          A[0] * B[4] + A[2] * B[5] + A[4],
          A[1] * B[4] + A[3] * B[5] + A[5]
        ];
      };
      while (r = reT.exec(t || "")) {
        const v = r[2].trim().split(/[\s,]+/).map(parseFloat);
        if (r[1] === "translate") M = mul(M, [1, 0, 0, 1, v[0], v[1] || 0]);
        else if (r[1] === "scale") M = mul(M, [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]);
        else if (r[1] === "matrix") M = mul(M, v.slice(0, 6));
        else {
          const ang = v[0] * Math.PI / 180;
          const cx = v[1] || 0;
          const cy = v[2] || 0;
          const c = Math.cos(ang);
          const sn = Math.sin(ang);
          M = mul(M, [c, sn, -sn, c, cx - c * cx + sn * cy, cy - sn * cx - c * cy]);
        }
      }
      return M;
    }
    const apply = function(M, x, y) {
      return [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
    };
    function boxOf(M, pts) {
      const xs = [];
      const ys = [];
      pts.forEach((pt) => {
        const q = apply(M, pt[0], pt[1]);
        xs.push(q[0]);
        ys.push(q[1]);
      });
      return {
        x0: Math.min.apply(null, xs),
        y0: Math.min.apply(null, ys),
        x1: Math.max.apply(null, xs),
        y1: Math.max.apply(null, ys)
      };
    }
    function pathPts(d) {
      const pts = [];
      let x = 0;
      let y = 0;
      let sx = 0;
      let sy = 0;
      const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
      let i = 0;
      let cmd = "M";
      const next = function() {
        return parseFloat(tok[i++]);
      };
      while (i < tok.length) {
        if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
        switch (cmd) {
          case "M":
            x = next();
            y = next();
            sx = x;
            sy = y;
            pts.push([x, y]);
            cmd = "L";
            break;
          case "m":
            x += next();
            y += next();
            sx = x;
            sy = y;
            pts.push([x, y]);
            cmd = "l";
            break;
          case "L":
            x = next();
            y = next();
            pts.push([x, y]);
            break;
          case "l":
            x += next();
            y += next();
            pts.push([x, y]);
            break;
          case "H":
            x = next();
            pts.push([x, y]);
            break;
          case "h":
            x += next();
            pts.push([x, y]);
            break;
          case "V":
            y = next();
            pts.push([x, y]);
            break;
          case "v":
            y += next();
            pts.push([x, y]);
            break;
          case "Q":
            next();
            next();
            x = next();
            y = next();
            pts.push([x, y]);
            break;
          case "q":
            next();
            next();
            x += next();
            y += next();
            pts.push([x, y]);
            break;
          case "C":
            next();
            next();
            next();
            next();
            x = next();
            y = next();
            pts.push([x, y]);
            break;
          case "A":
            next();
            next();
            next();
            next();
            next();
            x = next();
            y = next();
            pts.push([x, y]);
            break;
          case "a":
            next();
            next();
            next();
            next();
            next();
            x += next();
            y += next();
            pts.push([x, y]);
            break;
          case "Z":
          case "z":
            x = sx;
            y = sy;
            break;
          default:
            i++;
        }
      }
      return pts;
    }
    while (m = re.exec(a.svg)) {
      const closing = m[1] === "/";
      const tagName = m[2];
      const attrs2 = m[3];
      const inner = m[5];
      if (tagName === "g") {
        if (closing) {
          stack.pop();
          continue;
        }
        const parent = stack.length ? stack[stack.length - 1] : null;
        const M0 = parent ? parent.M : [1, 0, 0, 1, 0, 0];
        const Mt = xf(attr(attrs2, "transform"));
        const M = [
          M0[0] * Mt[0] + M0[2] * Mt[1],
          M0[1] * Mt[0] + M0[3] * Mt[1],
          M0[0] * Mt[2] + M0[2] * Mt[3],
          M0[1] * Mt[2] + M0[3] * Mt[3],
          M0[0] * Mt[4] + M0[2] * Mt[5] + M0[4],
          M0[1] * Mt[4] + M0[3] * Mt[5] + M0[5]
        ];
        const part = attr(attrs2, "data-part") || (parent ? parent.part : null);
        const node = { M, part, box: null, circle: null, own: !!attr(attrs2, "data-part") };
        stack.push(node);
        if (node.own) items.push({ kind: "part", name: part, node });
        continue;
      }
      if (closing) continue;
      const top = stack.length ? stack[stack.length - 1] : null;
      const Mc = top ? top.M : [1, 0, 0, 1, 0, 0];
      let box = null;
      let circ = null;
      const ownPart = attr(attrs2, "data-part");
      const tLocal = xf(attr(attrs2, "transform"));
      const Me = [
        Mc[0] * tLocal[0] + Mc[2] * tLocal[1],
        Mc[1] * tLocal[0] + Mc[3] * tLocal[1],
        Mc[0] * tLocal[2] + Mc[2] * tLocal[3],
        Mc[1] * tLocal[2] + Mc[3] * tLocal[3],
        Mc[0] * tLocal[4] + Mc[2] * tLocal[5] + Mc[4],
        Mc[1] * tLocal[4] + Mc[3] * tLocal[5] + Mc[5]
      ];
      if (tagName === "rect") {
        const x = num2(attrs2, "x", 0);
        const y = num2(attrs2, "y", 0);
        const w = num2(attrs2, "width", 0);
        const h = num2(attrs2, "height", 0);
        box = boxOf(Me, [
          [x, y],
          [x + w, y],
          [x, y + h],
          [x + w, y + h]
        ]);
      } else if (tagName === "circle") {
        const cx = num2(attrs2, "cx", 0);
        const cy = num2(attrs2, "cy", 0);
        const r = num2(attrs2, "r", 0);
        const cc = apply(Me, cx, cy);
        const rr = r * Math.sqrt(Math.abs(Me[0] * Me[3] - Me[1] * Me[2]));
        box = { x0: cc[0] - rr, y0: cc[1] - rr, x1: cc[0] + rr, y1: cc[1] + rr };
        circ = { x: cc[0], y: cc[1], r: rr };
      } else if (tagName === "ellipse") {
        const ex = num2(attrs2, "cx", 0);
        const ey = num2(attrs2, "cy", 0);
        const erx = num2(attrs2, "rx", 0);
        const ery = num2(attrs2, "ry", 0);
        box = boxOf(Me, [
          [ex - erx, ey - ery],
          [ex + erx, ey - ery],
          [ex - erx, ey + ery],
          [ex + erx, ey + ery]
        ]);
      } else if (tagName === "line") {
        box = boxOf(Me, [
          [num2(attrs2, "x1", 0), num2(attrs2, "y1", 0)],
          [num2(attrs2, "x2", 0), num2(attrs2, "y2", 0)]
        ]);
      } else if (tagName === "path") {
        const pts = pathPts(attr(attrs2, "d") || "");
        if (pts.length) box = boxOf(Me, pts);
      } else if (tagName === "text") {
        const txt = inner.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
        const fs = num2(attrs2, "font-size", 4);
        const tw = txt.length * fs * 0.62;
        const tx = num2(attrs2, "x", 0);
        const ty = num2(attrs2, "y", 0);
        const anchor = attr(attrs2, "text-anchor") || "middle";
        const mid = attr(attrs2, "dominant-baseline") === "middle";
        const left = anchor === "start" ? tx : anchor === "end" ? tx - tw : tx - tw / 2;
        const topY = mid ? ty - fs * 0.5 : ty - fs * 0.76;
        const botY = mid ? ty + fs * 0.5 : ty + fs * 0.1;
        items.push({
          kind: "text",
          name: txt,
          box: boxOf(Me, [
            [left, topY],
            [left + tw, topY],
            [left, botY],
            [left + tw, botY]
          ])
        });
        continue;
      }
      if (!box) continue;
      if (ownPart) {
        items.push({ kind: "part", name: ownPart, box, circle: circ });
        continue;
      }
      if (top) {
        let g = top;
        while (g && !g.own) g = null;
        let holder = null;
        for (let k = stack.length - 1; k >= 0; k--)
          if (stack[k].own) {
            holder = stack[k];
            break;
          }
        if (holder) {
          if (!holder.box) {
            holder.box = box;
            holder.circle = circ;
          } else {
            holder.box = {
              x0: Math.min(holder.box.x0, box.x0),
              y0: Math.min(holder.box.y0, box.y0),
              x1: Math.max(holder.box.x1, box.x1),
              y1: Math.max(holder.box.y1, box.y1)
            };
            const hc = holder.circle;
            if (hc) {
              const inside = box.x0 >= hc.x - hc.r - 0.01 && box.x1 <= hc.x + hc.r + 0.01 && box.y0 >= hc.y - hc.r - 0.01 && box.y1 <= hc.y + hc.r + 0.01;
              if (circ && Math.abs(hc.x - circ.x) < 0.01 && Math.abs(hc.y - circ.y) < 0.01)
                holder.circle = circ.r > hc.r ? circ : hc;
              else if (!inside) holder.circle = null;
            }
          }
        }
      }
    }
    items.forEach((it) => {
      if (it.node) {
        it.box = it.node.box;
        it.circle = it.node.circle;
        delete it.node;
      }
    });
    items = items.filter((it) => {
      return it.box;
    });
    const ignore = { glow: 1, trace: 1, flow: 1, probe: 1 };
    const ground = { body: 1, board: 1 };
    const tol = 0.35;
    const meets = function(A, B) {
      return A.x1 - tol > B.x0 && B.x1 - tol > A.x0 && A.y1 - tol > B.y0 && B.y1 - tol > A.y0;
    };
    const contains = function(A, B) {
      return B.x0 >= A.x0 - tol && B.x1 <= A.x1 + tol && B.y0 >= A.y0 - tol && B.y1 <= A.y1 + tol;
    };
    const circleMeets = function(c, B) {
      const nx = Math.max(B.x0, Math.min(c.x, B.x1));
      const ny = Math.max(B.y0, Math.min(c.y, B.y1));
      return (c.x - nx) * (c.x - nx) + (c.y - ny) * (c.y - ny) < (c.r - tol) * (c.r - tol);
    };
    const pairMeets = function(A, B) {
      if (!meets(A.box, B.box)) return false;
      if (A.circle && !B.circle) return circleMeets(A.circle, B.box);
      if (B.circle && !A.circle) return circleMeets(B.circle, A.box);
      if (A.circle && B.circle) {
        const dx = A.circle.x - B.circle.x;
        const dy = A.circle.y - B.circle.y;
        return Math.sqrt(dx * dx + dy * dy) < A.circle.r + B.circle.r - tol;
      }
      return true;
    };
    const problems = [];
    const desc = function(it) {
      return `${it.kind} ${JSON.stringify(it.name)} [${r2(it.box.x0)},${r2(it.box.y0)} ${r2(it.box.x1)},${r2(it.box.y1)}]`;
    };
    for (let i = 0; i < items.length; i++) {
      const A = items[i];
      if (ignore[A.name]) continue;
      if (A.box.x0 < -0.5 || A.box.y0 < -0.5 || A.box.x1 > a.width + 0.5 || A.box.y1 > a.height + 0.5)
        problems.push({ kind: "outside", a: desc(A) });
      for (let j = i + 1; j < items.length; j++) {
        const B = items[j];
        if (ignore[B.name]) continue;
        if (A.kind === "part" && B.kind === "part" && (ground[A.name] || ground[B.name])) continue;
        if (A.kind === "text" && B.kind === "part" && ground[B.name]) continue;
        if (B.kind === "text" && A.kind === "part" && ground[A.name]) continue;
        if (!pairMeets(A, B)) continue;
        if (A.kind === "part" && B.kind === "part" && (contains(A.box, B.box) || contains(B.box, A.box))) continue;
        if (A.kind !== B.kind && contains(A.kind === "part" ? A.box : B.box, A.kind === "part" ? B.box : A.box)) continue;
        problems.push({
          kind: A.kind === "text" && B.kind === "text" ? "text-on-text" : A.kind === B.kind ? "part-on-part" : "text-on-part",
          a: desc(A),
          b: desc(B)
        });
      }
    }
    return problems;
  }

  // src/mount.js
  init_core();
  function mount(target, a, props) {
    props = props || {};
    const T = tokens();
    const s = props.scale || 3;
    const doc = target.ownerDocument;
    const fig = doc.createElement("figure");
    fig.className = "pk-fig";
    const box = doc.createElement("div");
    box.className = `pk-art${props.grid === false ? "" : " pk-grid"}`;
    box.style.width = `${r2(a.width * s)}px`;
    box.style.height = `${r2(a.height * s)}px`;
    box.style.setProperty("--pk-scale", String(s));
    if (a.pins && a.pins.length) {
      const f = a.pins[0];
      const m = function(v) {
        return (v % T.pitch + T.pitch) % T.pitch;
      };
      box.style.backgroundPosition = `${r2(m(f.x) * s - 1)}px ${r2(m(f.y) * s - 1)}px`;
    }
    box.innerHTML = a.svg;
    if (props.pins && a.pins) {
      const rings = a.pins.map((pn) => {
        return circle(pn.x, pn.y, 2.2, "none", { stroke: T["mark-select"], "stroke-width": 0.9 });
      }).join("");
      box.insertAdjacentHTML(
        "beforeend",
        `<svg class="pk-pins" viewBox="0 0 ${a.width} ${a.height}" aria-hidden="true">${rings}</svg>`
      );
    }
    fig.appendChild(box);
    if (props.caption) {
      const c = doc.createElement("figcaption");
      c.textContent = props.caption;
      fig.appendChild(c);
    }
    target.appendChild(fig);
    return fig;
  }

  // src/dom.js
  var hostOwned = (name) => name === "tabindex" || name === "role" || name === "style" || name === "class" || name.startsWith("aria-");
  var isElement = (node) => node.nodeType === 1;
  function keyOf(node) {
    if (!isElement(node)) return null;
    const own = node.getAttribute("data-hook");
    if (own !== null) return own;
    for (const child of Array.from(node.childNodes)) {
      const key = keyOf(child);
      if (key !== null) return key;
    }
    return null;
  }
  var sameNode = (a, b, key = keyOf(b)) => a.nodeType === b.nodeType && (!isElement(a) || !isElement(b) || a.localName === b.localName && keyOf(a) === key);
  function syncSvg(current, next) {
    if (!isElement(current) || !isElement(next)) {
      if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
      return;
    }
    for (const { name, value } of Array.from(next.attributes))
      if (current.getAttribute(name) !== value) current.setAttribute(name, value);
    for (const { name } of Array.from(current.attributes))
      if (!next.hasAttribute(name) && !hostOwned(name)) current.removeAttribute(name);
    const after = Array.from(next.childNodes);
    const keys = after.map(keyOf);
    const drawn = new Set(keys.filter((key) => key !== null));
    const kept = (node) => {
      const key = keyOf(node);
      return key !== null && drawn.has(key);
    };
    let index = 0;
    for (const [i, child] of after.entries()) {
      const key = keys[i];
      let old = current.childNodes[index] || null;
      let same2 = old !== null && sameNode(old, child, key);
      if (old && !same2 && key !== null) {
        const between = [];
        let match = old;
        while (match && !sameNode(match, child, key)) {
          between.push(match);
          match = match.nextSibling;
        }
        if (match && !between.some(kept)) {
          for (const gone of between) current.removeChild(gone);
          old = match;
          same2 = true;
        }
      }
      if (same2) {
        if (!old.isEqualNode(child)) syncSvg(old, child);
      } else if (old && kept(old)) current.insertBefore(child, old);
      else if (old) current.replaceChild(child, old);
      else current.appendChild(child);
      index++;
    }
    while (current.lastChild && current.childNodes.length > index) current.removeChild(current.lastChild);
  }
  function patchSvg(host, drawing) {
    const markup = typeof drawing === "string" ? drawing : drawing.svg;
    const current = host.firstElementChild;
    if (!current || current.localName !== "svg") {
      host.innerHTML = markup;
      return;
    }
    const template = host.ownerDocument.createElement("template");
    template.innerHTML = markup;
    const next = template.content.firstElementChild;
    if (!next || next.localName !== "svg") {
      host.innerHTML = markup;
      return;
    }
    syncSvg(current, next);
  }
  function findHook(host, hook) {
    return host.querySelector(`[data-hook="${hook}"]`);
  }

  // src/controls.js
  var DETENT_DEGREES = 18;
  var data = (element, name) => {
    var _a;
    return Number((_a = element == null ? void 0 : element.getAttribute(name)) != null ? _a : NaN);
  };
  function angleBetween(a, b) {
    return ((b - a) % 360 + 540) % 360 - 180;
  }
  function knobPosition(dx, dy, previous) {
    if (Math.hypot(dx, dy) < 1e-6) return previous;
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    if (angle >= -135 && angle <= 135) return (angle + 135) / 270;
    if (previous >= 0.75) return 1;
    if (previous <= 0.25) return 0;
    return dx < 0 ? 0 : dx > 0 ? 1 : previous >= 0.5 ? 1 : 0;
  }
  function detentsTurned(from, to) {
    const detents = Math.trunc(angleBetween(from, to) / DETENT_DEGREES);
    return { detents, from: from + detents * DETENT_DEGREES };
  }
  function dialGeometry(dial2) {
    var _a;
    if (!dial2) return void 0;
    const holes = ((_a = dial2.getAttribute("data-hole-angles")) != null ? _a : "").trim().split(/\s+/).map(Number);
    const geometry = {
      cx: data(dial2, "data-cx"),
      cy: data(dial2, "data-cy"),
      ring: data(dial2, "data-ring"),
      holeRadius: data(dial2, "data-hole-radius"),
      stop: data(dial2, "data-stop"),
      angle: data(dial2, "data-angle") || 0,
      holes
    };
    const numbers = [geometry.cx, geometry.cy, geometry.ring, geometry.holeRadius, geometry.stop, ...holes];
    return holes.length === 10 && numbers.every(Number.isFinite) ? geometry : void 0;
  }
  function dialDigitAt(geometry, x, y, reach = 0) {
    let digit;
    let nearest2 = Infinity;
    geometry.holes.forEach((degrees, index) => {
      const radians = (degrees + geometry.angle) * Math.PI / 180;
      const distance2 = Math.hypot(
        x - (geometry.cx + Math.cos(radians) * geometry.ring),
        y - (geometry.cy + Math.sin(radians) * geometry.ring)
      );
      if (distance2 <= geometry.holeRadius + reach && distance2 < nearest2) {
        nearest2 = distance2;
        digit = (index + 1) % 10;
      }
    });
    return digit;
  }
  function dialTravel(geometry, digit) {
    const at = geometry.holes[(digit + 9) % 10];
    return ((geometry.stop - at) % 360 + 360) % 360;
  }

  // src/elementControls.js
  var JOYSTICK_FULL_DRAG = 9 * 9.6 / 2.54;
  var WIND_DEGREES_PER_SECOND = 720;
  var RUN_DEGREES_PER_SECOND = 280;
  var STOP_MS = 120;
  var clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  var hundredths = (value) => Math.round(value * 100) / 100;
  var degreesOf = (dx, dy) => Math.atan2(dy, dx) * 180 / Math.PI;
  var data2 = (element, name) => {
    var _a;
    return Number((_a = element == null ? void 0 : element.getAttribute(name)) != null ? _a : NaN);
  };
  var activates = (event) => event.key === " " || event.key === "Enter";
  var on = (event, selector) => event.composedPath().find((node) => node instanceof globalThis.Element && node.matches(selector));
  var sliderAria = (position, orientation) => ({
    ariaValueMin: "0",
    ariaValueMax: "100",
    ariaValueNow: String(Math.round(position * 100)),
    ariaValueText: `${Math.round(position * 100)}%`,
    ariaOrientation: orientation
  });
  var SLIDER_KEYS = {
    ArrowRight: (position) => position + 0.01,
    ArrowUp: (position) => position + 0.01,
    ArrowLeft: (position) => position - 0.01,
    ArrowDown: (position) => position - 0.01,
    PageUp: (position) => position + 0.1,
    PageDown: (position) => position - 0.1,
    Home: () => 0,
    End: () => 1
  };
  function sliderKey(c, event) {
    const step = SLIDER_KEYS[event.key];
    if (!step) return false;
    c.step({ position: hundredths(clamp(step(Number(c.state().position) || 0), 0, 1)) });
    return true;
  }
  function turn(c, steps) {
    const detent = ((Math.round(Number(c.state().detent) || 0) + steps) % 20 + 20) % 20;
    c.set({ detent });
    c.emit("turn", { steps, detent });
  }
  var keysOf = (c) => Array.from(c.hooks('[data-hook^="key-"]'), (element) => {
    var _a, _b;
    return {
      element,
      hook: element.getAttribute("data-hook"),
      legend: (_b = (_a = element.querySelector("text")) == null ? void 0 : _a.textContent) != null ? _b : ""
    };
  });
  var REMOTE_KEYS2 = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "prev",
    ArrowRight: "next",
    " ": "play",
    Enter: "play",
    "+": "vol-up",
    "=": "vol-up",
    "-": "vol-down"
  };
  function dial(c, digit) {
    var _a;
    const session = c.session;
    const geometry = dialGeometry(c.hook("dial"));
    if (session.dialling || !geometry) return;
    const travel = dialTravel(geometry, digit);
    if ((_a = globalThis.matchMedia) == null ? void 0 : _a.call(globalThis, "(prefers-reduced-motion: reduce)").matches) {
      c.emit("dial", { digit });
      return;
    }
    session.dialling = true;
    const wind = travel / WIND_DEGREES_PER_SECOND * 1e3;
    const run = travel / RUN_DEGREES_PER_SECOND * 1e3;
    const start = globalThis.performance.now();
    const frame = (now) => {
      const t = now - start;
      if (!c.connected() || t >= wind + STOP_MS + run) {
        session.dialling = false;
        c.show(null);
        if (c.connected()) c.emit("dial", { digit });
        return;
      }
      const angle = t < wind ? travel * t / wind : travel * (1 - Math.max(0, t - wind - STOP_MS) / run);
      c.show({ angle: hundredths(angle) });
      globalThis.requestAnimationFrame(frame);
    };
    globalThis.requestAnimationFrame(frame);
  }
  var CONTROLS = {
    pushbutton: {
      role: "button",
      aria: (state2) => ({ ariaPressed: String(!!state2.pressed) }),
      down: (c, event) => (c.hold(`pointer:${event.pointerId}`, { key: "" }), true),
      key: (c, event, source) => activates(event) && (c.hold(source, { key: "" }), true),
      held: (tokens2) => ({ pressed: tokens2.length > 0 })
    },
    slideSwitch: {
      role: "switch",
      aria: (state2) => ({ ariaChecked: String(state2.contact === 3) }),
      tap: (c) => c.step({ contact: c.state().contact === 3 ? 1 : 3 }),
      key: (c, event) => {
        const contact = activates(event) ? c.state().contact === 3 ? 1 : 3 : { ArrowLeft: 1, ArrowRight: 3 }[event.key];
        if (contact === void 0) return false;
        if (!event.repeat) c.step({ contact });
        return true;
      }
    },
    dipSwitch: {
      role: "group",
      tap: (c, event, point) => {
        const slot = Array.from(c.hooks("[data-slot]")).find((element) => {
          const box = element.getBBox();
          return point.x >= box.x - 1 && point.x <= box.x + box.width + 1 && point.y >= box.y - 1 && point.y <= box.y + box.height + 1;
        });
        if (slot) flipLever(c, Number(slot.getAttribute("data-slot")) - 1);
      },
      key: (c, event) => {
        const index = /^[1-9]$/.test(event.key) ? Number(event.key) - 1 : -1;
        if (index < 0 || index >= c.hooks("[data-slot]").length) return false;
        if (!event.repeat) flipLever(c, index);
        return true;
      }
    },
    potentiometer: {
      role: "slider",
      drag: true,
      aria: (state2) => sliderAria(Number(state2.position)),
      down: () => true,
      move: (c, event, point) => {
        const knob = c.hook("knob");
        const cx = data2(knob, "data-cx");
        const cy = data2(knob, "data-cy");
        if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;
        c.set({ position: hundredths(knobPosition(point.x - cx, point.y - cy, Number(c.state().position))) });
      },
      key: sliderKey
    },
    slidePotentiometer: {
      role: "slider",
      drag: true,
      aria: (state2) => sliderAria(Number(state2.position), "horizontal"),
      down: (c, event, point, drag) => (drag.position = Number(c.state().position) || 0, true),
      move: (c, event, point, drag) => {
        const travel = data2(c.hook("lever"), "data-travel");
        if (travel > 0) c.set({ position: hundredths(clamp(drag.position + (point.x - drag.x) / travel, 0, 1)) });
      },
      key: sliderKey
    },
    rotaryEncoder: {
      role: "slider",
      drag: true,
      press: "tap",
      aria: (state2) => {
        var _a, _b;
        return {
          ariaValueMin: "0",
          ariaValueMax: "19",
          ariaValueNow: String((_a = state2.detent) != null ? _a : 0),
          ariaValueText: `Detent ${(_b = state2.detent) != null ? _b : 0}${state2.pressed ? ", pressed" : ""}`
        };
      },
      down: (c, event, point, drag) => {
        const knob = c.hook("knob");
        drag.cx = data2(knob, "data-cx");
        drag.cy = data2(knob, "data-cy");
        drag.from = degreesOf(point.x - drag.cx, point.y - drag.cy);
        return Number.isFinite(drag.cx) && Number.isFinite(drag.cy);
      },
      move: (c, event, point, drag) => {
        const { detents, from } = detentsTurned(drag.from, degreesOf(point.x - drag.cx, point.y - drag.cy));
        drag.from = from;
        for (let k = 0; k < Math.abs(detents); k++) turn(c, Math.sign(detents));
      },
      key: (c, event, source) => {
        if (activates(event)) return c.hold(source, { key: "" }), true;
        const steps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
        if (!steps) return false;
        c.step(() => turn(c, steps));
        return true;
      },
      held: (tokens2) => ({ pressed: tokens2.length > 0 })
    },
    joystick: {
      role: "group",
      drag: true,
      press: "tap",
      aria: (state2) => {
        var _a, _b;
        return {
          ariaDescription: `x ${(_a = state2.x) != null ? _a : 0}, y ${(_b = state2.y) != null ? _b : 0}${state2.pressed ? ", pressed" : ""}`
        };
      },
      down: () => true,
      move: (c, event, point, drag) => c.hold(`pointer:${event.pointerId}`, {
        x: (point.x - drag.x) / JOYSTICK_FULL_DRAG,
        y: -(point.y - drag.y) / JOYSTICK_FULL_DRAG
      }),
      key: (c, event, source) => {
        if (activates(event)) return c.hold(source, { key: "" }), true;
        const share = event.shiftKey ? 0.25 : 1;
        const at = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
        if (!at) return false;
        c.hold(source, { x: at[0] * share, y: at[1] * share });
        return true;
      },
      // Each finger and key pushes the stick; letting go of all of them centres it.
      held: (tokens2) => {
        const sum = (axis) => hundredths(
          clamp(
            tokens2.reduce((total, token) => {
              var _a;
              return total + ((_a = token[axis]) != null ? _a : 0);
            }, 0),
            -1,
            1
          )
        );
        return { x: sum("x"), y: sum("y"), pressed: tokens2.some((token) => token.key !== void 0) };
      }
    },
    keypad: {
      role: "group",
      down: (c, event) => {
        const key = on(event, '[data-hook^="key-"]');
        return !!key && (c.hold(`pointer:${event.pointerId}`, keypadToken(key)), true);
      },
      // A legend typed on the keyboard holds its key: 0 to 9, A to D, * and #.
      key: (c, event, source) => {
        const key = keysOf(c).find((k) => k.legend && k.legend.toUpperCase() === event.key.toUpperCase());
        return !!key && (c.hold(source, keypadToken(key.element)), true);
      },
      held: (tokens2, state2, c) => {
        var _a, _b, _c;
        const pressed = [];
        for (const key of keysOf(c)) {
          const [, row, column] = (_a = /^key-(\d+)-(\d+)$/.exec(key.hook)) != null ? _a : [];
          if (row === void 0) continue;
          (_c = pressed[_b = row - 1]) != null ? _c : pressed[_b] = [];
          pressed[row - 1][column - 1] = tokens2.some((token) => token.hook === key.hook);
        }
        return { pressed };
      }
    },
    irRemote: {
      role: "group",
      down: (c, event) => {
        const key = on(event, '[data-hook^="key-"]');
        return !!key && (c.hold(`pointer:${event.pointerId}`, { key: key.getAttribute("data-hook").slice(4) }), true);
      },
      key: (c, event, source) => {
        const name = /^[0-9]$/.test(event.key) ? event.key : REMOTE_KEYS2[event.key];
        if (!name || !c.hook(`key-${name}`)) return false;
        c.hold(source, { key: name });
        return true;
      },
      // The remote sends one key at a time: the last one pressed.
      held: (tokens2) => ({ pressed: tokens2.length ? tokens2[tokens2.length - 1].key : "" })
    },
    rotaryDialer: {
      role: "group",
      tap: (c, event, point) => {
        const geometry = dialGeometry(c.hook("dial"));
        const digit = geometry && dialDigitAt(geometry, point.x, point.y, 1);
        if (digit !== void 0) dial(c, digit);
      },
      key: (c, event) => {
        if (!/^[0-9]$/.test(event.key)) return false;
        if (!event.repeat) dial(c, Number(event.key));
        return true;
      }
    }
  };
  function keypadToken(element) {
    var _a, _b;
    return { key: (_b = (_a = element.querySelector("text")) == null ? void 0 : _a.textContent) != null ? _b : "", hook: element.getAttribute("data-hook") };
  }
  function flipLever(c, index) {
    const count = c.hooks("[data-slot]").length;
    const values = Array.from({ length: count }, (_, k) => {
      var _a;
      return !!((_a = c.state().values) != null ? _a : [])[k];
    });
    values[index] = !values[index];
    c.step({ values });
  }

  // src/element.js
  var kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  var camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  var isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  var OWN = /* @__PURE__ */ new Set(["type", "scale", "options", "static"]);
  var GLOBAL = /* @__PURE__ */ new Set([
    "id",
    "class",
    "style",
    "title",
    "lang",
    "dir",
    "hidden",
    "slot",
    "tabindex",
    "role",
    "part",
    "exportparts",
    "is",
    "inert",
    "draggable",
    "spellcheck",
    "translate",
    "contenteditable",
    "autofocus",
    "autocapitalize",
    "accesskey",
    "nonce",
    "popover",
    "enterkeyhint",
    "inputmode",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype"
  ]);
  var isGlobal = (name) => OWN.has(name) || GLOBAL.has(name) || name.startsWith("aria-") || name.startsWith("data-") || name.startsWith("xml") || name.startsWith("on") && name.length > 2;
  function namesOf(specs) {
    const names = /* @__PURE__ */ new Map();
    for (const key of Object.keys(specs)) {
      names.set(key.toLowerCase(), key);
      names.set(kebab(key), key);
    }
    return names;
  }
  function number(value) {
    const n = Number(value);
    return value.trim() !== "" && Number.isFinite(n) ? n : value;
  }
  function json(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  function valueOf(spec, value) {
    var _a;
    switch (spec.type) {
      case "boolean":
        return value !== "false";
      case "level":
        return value === "" || value === "true" ? true : value === "false" ? false : number(value);
      case "number":
      case "integer":
        return number(value);
      case "enum": {
        const choice2 = (_a = spec.choices.find((c) => String(c.value) === value)) != null ? _a : value === "" ? spec.choices.find((c) => c.value === true) : void 0;
        return choice2 ? choice2.value : value;
      }
      case "text":
      case "color":
        return value;
      case "pixel":
        return value.startsWith("{") || value === "null" ? json(value) : value;
      default:
        return json(value);
    }
  }
  var pairsOf = (attributes) => typeof attributes[Symbol.iterator] === "function" ? Array.from(attributes, (a) => Array.isArray(a) ? a : [a.name, a.value]) : Object.entries(attributes);
  function optionsFromAttributes(id, attributes) {
    const entry2 = findPart(id);
    if (!entry2) throw new Error(checkOptions(id)[0]);
    const named = namesOf(entry2.options);
    const options = {};
    for (const [attribute, value] of pairsOf(attributes)) {
      const name = attribute.toLowerCase();
      const key = named.get(name);
      if (key !== void 0) {
        const parsed = valueOf(entry2.options[key], value);
        options[key] = isObject(parsed) && isObject(options[key]) ? { ...options[key], ...parsed } : parsed;
        continue;
      }
      const dash = name.indexOf("-");
      const head = dash > 0 ? named.get(name.slice(0, dash)) : void 0;
      const spec = head === void 0 ? void 0 : entry2.options[head];
      if ((spec == null ? void 0 : spec.type) === "object") {
        const rest = name.slice(dash + 1);
        const field = namesOf(spec.fields).get(rest);
        const fields = isObject(options[head]) ? options[head] : {};
        options[head] = { ...fields, [field != null ? field : camel(rest)]: field ? valueOf(spec.fields[field], value) : value };
        continue;
      }
      if (isGlobal(name)) continue;
      options[camel(name)] = value;
    }
    return options;
  }
  var scaled = (svg2, scale) => scale === 1 ? svg2 : svg2.replace(
    /^<svg\b[^>]*>/,
    (tag2) => tag2.replace(/ (width|height)="([\d.]+)"/g, (_, name, value) => ` ${name}="${+(value * scale).toFixed(2)}"`)
  );
  var STYLE = `:host{display:inline-block;line-height:0;vertical-align:middle}:host([hidden]){display:none}
[part=drawing]{display:block}svg{display:block;max-width:100%;height:auto}
[data-control]{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
[data-control=press]{cursor:pointer;touch-action:manipulation}[data-control=drag]{cursor:grab;touch-action:none}
[part=error]{display:inline-block;max-width:24em;padding:4px 8px;border:1px solid #d92d20;border-radius:4px;
font:12px/1.4 system-ui,sans-serif;color:#b42318;background:#fff;white-space:normal}`;
  var SLOP = 4;
  var HOLD_MS = 250;
  var PULSE_MS = 120;
  var ARIA = [
    "ariaPressed",
    "ariaChecked",
    "ariaValueMin",
    "ariaValueMax",
    "ariaValueNow",
    "ariaValueText",
    "ariaOrientation",
    "ariaDescription"
  ];
  var blank = (value) => value === void 0 || value === null || value === false || value === "" || Array.isArray(value) && value.every(blank);
  var same = (a, b) => JSON.stringify(a) === JSON.stringify(b) || blank(a) && blank(b);
  function definePartElement(name = "parts-kit-part") {
    var _drawing, _observer, _options, _artwork, _error, _queued, _ticket, _entry, _control, _internals, _context, _session, _holds, _pressed, _pointers, _pulses, _gesture, _before, _transient, _tabindex, _leave, _hide, _PartElement_instances, schedule_fn, draw_fn, bind_fn, state_fn, set_fn, emit_fn, begin_fn, end_fn, hold_fn, release_fn, letGo_fn, settle_fn, point_fn, pointerDown_fn, pointerMove_fn, pointerUp_fn, keyDown_fn;
    const registry = globalThis.customElements;
    if (!registry) throw new Error("definePartElement needs a page: this environment has no custom elements.");
    const defined = registry.get(name);
    if (defined) return defined;
    class PartElement extends globalThis.HTMLElement {
      constructor() {
        super();
        __privateAdd(this, _PartElement_instances);
        __privateAdd(this, _drawing);
        __privateAdd(this, _observer);
        __privateAdd(this, _options, {});
        __privateAdd(this, _artwork, null);
        __privateAdd(this, _error, null);
        __privateAdd(this, _queued, false);
        __privateAdd(this, _ticket, 0);
        // The part's catalog entry and its control (elementControls.js), once drawn; null for a part a person does not operate.
        __privateAdd(this, _entry, null);
        __privateAdd(this, _control, null);
        __privateAdd(this, _internals, null);
        __privateAdd(this, _context);
        // The control's own memory (a dial running back), from when it was bound.
        __privateAdd(this, _session, {});
        // What each finger and key holds now (pointer:<id>, key:<code>), the keys pressed, and each pointer down.
        __privateAdd(this, _holds, /* @__PURE__ */ new Map());
        __privateAdd(this, _pressed, /* @__PURE__ */ new Set());
        __privateAdd(this, _pointers, /* @__PURE__ */ new Map());
        __privateAdd(this, _pulses, 0);
        // The sources of the press or drag going on, and the state when it began, for `change`.
        __privateAdd(this, _gesture, /* @__PURE__ */ new Set());
        __privateAdd(this, _before, {});
        // Options drawn for a moment and never set: the dialer's wheel as it turns.
        __privateAdd(this, _transient, null);
        // Whether the element gave itself its tabindex.
        __privateAdd(this, _tabindex, false);
        __privateAdd(this, _leave, () => __privateMethod(this, _PartElement_instances, letGo_fn).call(this, ""));
        __privateAdd(this, _hide, () => {
          var _a;
          return ((_a = globalThis.document) == null ? void 0 : _a.hidden) && __privateMethod(this, _PartElement_instances, letGo_fn).call(this, "");
        });
        const root = this.attachShadow({ mode: "open" });
        root.innerHTML = `<style>${STYLE}</style><span part="drawing"></span>`;
        __privateSet(this, _drawing, root.lastElementChild);
        __privateSet(this, _observer, new globalThis.MutationObserver((records) => {
          if (records.some((r) => OWN.has(r.attributeName) || !isGlobal(r.attributeName))) __privateMethod(this, _PartElement_instances, schedule_fn).call(this);
        }));
        try {
          __privateSet(this, _internals, this.attachInternals());
        } catch (e) {
          __privateSet(this, _internals, null);
        }
        const element = this;
        __privateSet(this, _context, {
          get session() {
            return __privateGet(element, _session);
          },
          state: () => __privateMethod(this, _PartElement_instances, state_fn).call(this),
          set: (patch) => __privateMethod(this, _PartElement_instances, set_fn).call(this, patch),
          step: (change) => {
            __privateMethod(this, _PartElement_instances, begin_fn).call(this, "step");
            if (typeof change === "function") change();
            else __privateMethod(this, _PartElement_instances, set_fn).call(this, change);
            __privateMethod(this, _PartElement_instances, end_fn).call(this, "step");
          },
          hold: (source, token) => __privateMethod(this, _PartElement_instances, hold_fn).call(this, source, token),
          emit: (type, detail) => __privateMethod(this, _PartElement_instances, emit_fn).call(this, type, detail),
          show: (options) => {
            __privateSet(this, _transient, options);
            __privateMethod(this, _PartElement_instances, schedule_fn).call(this);
          },
          hook: (name2) => this.hook(name2),
          hooks: (selector) => __privateGet(this, _drawing).querySelectorAll(selector),
          connected: () => this.isConnected
        });
        this.addEventListener("pointerdown", (event) => __privateMethod(this, _PartElement_instances, pointerDown_fn).call(this, event));
        this.addEventListener("pointermove", (event) => __privateMethod(this, _PartElement_instances, pointerMove_fn).call(this, event));
        for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
          this.addEventListener(type, (event) => __privateMethod(this, _PartElement_instances, pointerUp_fn).call(this, event));
        this.addEventListener("keydown", (event) => __privateMethod(this, _PartElement_instances, keyDown_fn).call(this, event));
        this.addEventListener("keyup", (event) => __privateMethod(this, _PartElement_instances, release_fn).call(this, `key:${event.code || event.key}`));
        this.addEventListener("blur", () => __privateMethod(this, _PartElement_instances, letGo_fn).call(this, "key:"));
        this.addEventListener("contextmenu", (event) => __privateGet(this, _pointers).size && event.preventDefault());
      }
      connectedCallback() {
        var _a, _b;
        for (const key of ["type", "options"])
          if (Object.prototype.hasOwnProperty.call(this, key)) {
            const value = this[key];
            delete this[key];
            this[key] = value;
          }
        __privateGet(this, _observer).observe(this, { attributes: true });
        (_a = globalThis.addEventListener) == null ? void 0 : _a.call(globalThis, "blur", __privateGet(this, _leave));
        (_b = globalThis.document) == null ? void 0 : _b.addEventListener("visibilitychange", __privateGet(this, _hide));
        __privateMethod(this, _PartElement_instances, schedule_fn).call(this);
      }
      disconnectedCallback() {
        var _a, _b;
        __privateGet(this, _observer).disconnect();
        (_a = globalThis.removeEventListener) == null ? void 0 : _a.call(globalThis, "blur", __privateGet(this, _leave));
        (_b = globalThis.document) == null ? void 0 : _b.removeEventListener("visibilitychange", __privateGet(this, _hide));
        __privateMethod(this, _PartElement_instances, letGo_fn).call(this, "");
      }
      /** The catalog id of the part it draws: its `type` attribute. */
      get type() {
        var _a;
        return (_a = this.getAttribute("type")) != null ? _a : "";
      }
      set type(id) {
        this.setAttribute("type", id);
      }
      /** Options set from code, over the ones the attributes give: lists and objects, such as an LCD's lines. */
      get options() {
        return { ...__privateGet(this, _options) };
      }
      set options(options) {
        __privateSet(this, _options, { ...options != null ? options : {} });
        __privateMethod(this, _PartElement_instances, schedule_fn).call(this);
      }
      /** The last drawing, before `scale`; null before the first and after an error. */
      get artwork() {
        return __privateGet(this, _artwork);
      }
      /** The part's pins, in the drawing's pixels before `scale`. */
      get pins() {
        return __privateGet(this, _artwork) ? __privateGet(this, _artwork).pins : [];
      }
      /** Why the last drawing failed, or null. */
      get error() {
        return __privateGet(this, _error);
      }
      /** A drawn element by its data-hook (lens, knob, lever-3), or null. */
      hook(name2) {
        return findHook(__privateGet(this, _drawing), name2);
      }
    }
    _drawing = new WeakMap();
    _observer = new WeakMap();
    _options = new WeakMap();
    _artwork = new WeakMap();
    _error = new WeakMap();
    _queued = new WeakMap();
    _ticket = new WeakMap();
    _entry = new WeakMap();
    _control = new WeakMap();
    _internals = new WeakMap();
    _context = new WeakMap();
    _session = new WeakMap();
    _holds = new WeakMap();
    _pressed = new WeakMap();
    _pointers = new WeakMap();
    _pulses = new WeakMap();
    _gesture = new WeakMap();
    _before = new WeakMap();
    _transient = new WeakMap();
    _tabindex = new WeakMap();
    _leave = new WeakMap();
    _hide = new WeakMap();
    _PartElement_instances = new WeakSet();
    schedule_fn = function() {
      if (__privateGet(this, _queued)) return;
      __privateSet(this, _queued, true);
      globalThis.queueMicrotask(() => {
        __privateSet(this, _queued, false);
        __privateMethod(this, _PartElement_instances, draw_fn).call(this);
      });
    };
    draw_fn = async function() {
      var _a;
      const ticket = ++__privateWrapper(this, _ticket)._;
      try {
        const type = this.getAttribute("type");
        if (!type) throw new Error('Give it a catalog part id as its type, as in type="led-5-mm".');
        const scale = Number((_a = this.getAttribute("scale")) != null ? _a : 1);
        if (!(scale > 0)) throw new Error(`scale must be a number above 0, not "${this.getAttribute("scale")}".`);
        const draw = await loadPart(type);
        if (ticket !== __privateGet(this, _ticket)) return;
        const art2 = draw({ ...optionsFromAttributes(type, this.attributes), ...__privateGet(this, _options), ...__privateGet(this, _transient) });
        patchSvg(__privateGet(this, _drawing), scaled(art2.svg, scale));
        __privateSet(this, _artwork, art2);
        __privateSet(this, _error, null);
        __privateMethod(this, _PartElement_instances, bind_fn).call(this, findPart(type));
        this.dispatchEvent(new globalThis.CustomEvent("draw", { detail: { artwork: art2 } }));
      } catch (error) {
        if (ticket !== __privateGet(this, _ticket)) return;
        __privateSet(this, _artwork, null);
        __privateSet(this, _error, error.message);
        __privateMethod(this, _PartElement_instances, bind_fn).call(this, null);
        const box = this.ownerDocument.createElement("span");
        box.setAttribute("part", "error");
        box.textContent = error.message;
        __privateGet(this, _drawing).replaceChildren(box);
        console.error(`<${this.localName}>: ${error.message}`);
      }
    };
    /** Takes the part's control when its part changes, and tells assistive technology its state. */
    bind_fn = function(entry2) {
      var _a, _b, _c;
      const control = entry2 && !this.hasAttribute("static") && CONTROLS[entry2.fn] || null;
      if (entry2 !== __privateGet(this, _entry) || control !== __privateGet(this, _control)) {
        for (const drag of __privateGet(this, _pointers).values()) globalThis.clearTimeout(drag.timer);
        __privateGet(this, _pointers).clear();
        __privateGet(this, _holds).clear();
        __privateGet(this, _pressed).clear();
        __privateGet(this, _gesture).clear();
        __privateSet(this, _session, {});
        __privateSet(this, _transient, null);
        __privateSet(this, _entry, entry2);
        __privateSet(this, _control, control);
        if (control && !this.hasAttribute("tabindex")) {
          this.setAttribute("tabindex", "0");
          __privateSet(this, _tabindex, true);
        } else if (!control && __privateGet(this, _tabindex)) {
          this.removeAttribute("tabindex");
          __privateSet(this, _tabindex, false);
        }
        if (control) __privateGet(this, _drawing).setAttribute("data-control", control.drag ? "drag" : "press");
        else __privateGet(this, _drawing).removeAttribute("data-control");
      }
      const internals = __privateGet(this, _internals);
      if (!internals) return;
      const aria = (_b = (_a = control == null ? void 0 : control.aria) == null ? void 0 : _a.call(control, __privateMethod(this, _PartElement_instances, state_fn).call(this))) != null ? _b : {};
      internals.role = control ? control.role : null;
      internals.ariaLabel = control ? entry2.name : null;
      for (const name2 of ARIA) internals[name2] = (_c = aria[name2]) != null ? _c : null;
    };
    /** The options the part is drawn with: its preset and defaults, the attributes, the `options` property. */
    state_fn = function() {
      const entry2 = __privateGet(this, _entry);
      if (!entry2) return {};
      const defaults = {};
      for (const [key, spec] of Object.entries(entry2.options))
        if (spec.default !== void 0) defaults[key] = spec.default;
      return { ...entry2.preset, ...defaults, ...optionsFromAttributes(entry2.id, this.attributes), ...__privateGet(this, _options) };
    };
    /** Changes options a person changed: writes them where they came from and fires `input` with the ones that differ. */
    set_fn = function(patch) {
      var _a;
      const state2 = __privateMethod(this, _PartElement_instances, state_fn).call(this);
      const changed = {};
      for (const [key, value] of Object.entries(patch)) if (!same(state2[key], value)) changed[key] = value;
      if (!Object.keys(changed).length) return;
      const named = namesOf(__privateGet(this, _entry).options);
      let redraw = false;
      for (const [key, value] of Object.entries(changed)) {
        if (Object.prototype.hasOwnProperty.call(__privateGet(this, _options), key)) {
          __privateGet(this, _options)[key] = value;
          redraw = true;
          continue;
        }
        const spec = __privateGet(this, _entry).options[key];
        const name2 = (_a = Array.from(this.attributes, (a) => a.name).find((n) => named.get(n.toLowerCase()) === key)) != null ? _a : kebab(key);
        if (spec && same(value, spec.default)) this.removeAttribute(name2);
        else if (value === true && (spec == null ? void 0 : spec.type) === "boolean") this.setAttribute(name2, "");
        else this.setAttribute(name2, typeof value === "object" ? JSON.stringify(value) : String(value));
      }
      if (redraw) __privateMethod(this, _PartElement_instances, schedule_fn).call(this);
      __privateMethod(this, _PartElement_instances, emit_fn).call(this, "input", changed);
    };
    emit_fn = function(type, detail) {
      this.dispatchEvent(new globalThis.CustomEvent(type, { detail, bubbles: true, composed: true }));
    };
    /** A press, drag or held key begins; the first remembers the state, for `change`. */
    begin_fn = function(source) {
      if (!__privateGet(this, _gesture).size) __privateSet(this, _before, __privateMethod(this, _PartElement_instances, state_fn).call(this));
      __privateGet(this, _gesture).add(source);
    };
    /** A press, drag or held key ends; the last fires `change` with the options that differ from when they began. */
    end_fn = function(source) {
      if (!__privateGet(this, _gesture).delete(source) || __privateGet(this, _gesture).size) return;
      const after = __privateMethod(this, _PartElement_instances, state_fn).call(this);
      const changed = {};
      for (const [key, value] of Object.entries(after)) if (!same(__privateGet(this, _before)[key], value)) changed[key] = value;
      if (Object.keys(changed).length) __privateMethod(this, _PartElement_instances, emit_fn).call(this, "change", changed);
    };
    hold_fn = function(source, token) {
      __privateMethod(this, _PartElement_instances, begin_fn).call(this, source);
      __privateGet(this, _holds).set(source, token);
      __privateMethod(this, _PartElement_instances, settle_fn).call(this);
    };
    release_fn = function(source) {
      if (__privateGet(this, _holds).delete(source)) __privateMethod(this, _PartElement_instances, settle_fn).call(this);
      __privateMethod(this, _PartElement_instances, end_fn).call(this, source);
    };
    /** Lets go of every hold whose source starts with `prefix`, and of every pointer when it is empty. */
    letGo_fn = function(prefix2) {
      const sources = [...__privateGet(this, _holds).keys()].filter((source) => source.startsWith(prefix2));
      if (!prefix2)
        for (const [id, drag] of __privateGet(this, _pointers)) {
          globalThis.clearTimeout(drag.timer);
          sources.push(`pointer:${id}`);
        }
      if (!prefix2) __privateGet(this, _pointers).clear();
      let held = false;
      for (const source of sources) held = __privateGet(this, _holds).delete(source) || held;
      if (held) __privateMethod(this, _PartElement_instances, settle_fn).call(this);
      for (const source of sources) __privateMethod(this, _PartElement_instances, end_fn).call(this, source);
    };
    /** Sets what the holds now give, and fires `press` and `release` for the keys that went down or came up. */
    settle_fn = function() {
      const control = __privateGet(this, _control);
      if (!(control == null ? void 0 : control.held)) return;
      const tokens2 = [...__privateGet(this, _holds).values()];
      __privateMethod(this, _PartElement_instances, set_fn).call(this, control.held(tokens2, __privateMethod(this, _PartElement_instances, state_fn).call(this), __privateGet(this, _context)));
      const keys = new Set(tokens2.filter((token) => token.key !== void 0).map((token) => token.key));
      for (const key of keys) if (!__privateGet(this, _pressed).has(key)) __privateMethod(this, _PartElement_instances, emit_fn).call(this, "press", key ? { key } : {});
      for (const key of __privateGet(this, _pressed)) if (!keys.has(key)) __privateMethod(this, _PartElement_instances, emit_fn).call(this, "release", key ? { key } : {});
      __privateSet(this, _pressed, keys);
    };
    /** A client point in the drawing's own pixels, whatever its scale. */
    point_fn = function(event) {
      var _a;
      const matrix = (_a = __privateGet(this, _drawing).querySelector("svg")) == null ? void 0 : _a.getScreenCTM();
      return matrix ? new globalThis.DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : void 0;
    };
    pointerDown_fn = function(event) {
      var _a;
      const control = __privateGet(this, _control);
      if (!control || event.pointerType === "mouse" && event.button !== 0 || __privateGet(this, _pointers).has(event.pointerId))
        return;
      const point = __privateMethod(this, _PartElement_instances, point_fn).call(this, event);
      if (!point) return;
      const source = `pointer:${event.pointerId}`;
      const drag = { x: point.x, y: point.y, clientX: event.clientX, clientY: event.clientY, moved: false };
      __privateMethod(this, _PartElement_instances, begin_fn).call(this, source);
      if (!((_a = control.down) == null ? void 0 : _a.call(control, __privateGet(this, _context), event, point, drag)) && !control.tap) {
        __privateMethod(this, _PartElement_instances, end_fn).call(this, source);
        return;
      }
      __privateGet(this, _pointers).set(event.pointerId, drag);
      try {
        this.setPointerCapture(event.pointerId);
      } catch (e) {
      }
      if (control.press === "tap") {
        drag.pending = true;
        drag.timer = globalThis.setTimeout(() => {
          drag.pending = false;
          drag.pressing = true;
          __privateMethod(this, _PartElement_instances, hold_fn).call(this, source, { key: "" });
        }, HOLD_MS);
      }
    };
    pointerMove_fn = function(event) {
      var _a, _b;
      const drag = __privateGet(this, _pointers).get(event.pointerId);
      if (!drag) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) > SLOP) {
        drag.moved = true;
        if (drag.pending) {
          drag.pending = false;
          globalThis.clearTimeout(drag.timer);
        }
      }
      const point = drag.moved && !drag.pressing && __privateMethod(this, _PartElement_instances, point_fn).call(this, event);
      if (point) (_b = (_a = __privateGet(this, _control)) == null ? void 0 : _a.move) == null ? void 0 : _b.call(_a, __privateGet(this, _context), event, point, drag);
    };
    pointerUp_fn = function(event) {
      var _a, _b;
      const drag = __privateGet(this, _pointers).get(event.pointerId);
      if (!drag) return;
      __privateGet(this, _pointers).delete(event.pointerId);
      globalThis.clearTimeout(drag.timer);
      const source = `pointer:${event.pointerId}`;
      if (event.type === "pointerup" && !drag.moved) {
        if (drag.pending) {
          const pulse = `pulse:${++__privateWrapper(this, _pulses)._}`;
          __privateMethod(this, _PartElement_instances, hold_fn).call(this, pulse, { key: "" });
          globalThis.setTimeout(() => __privateMethod(this, _PartElement_instances, release_fn).call(this, pulse), PULSE_MS);
        }
        const point = __privateMethod(this, _PartElement_instances, point_fn).call(this, event);
        if (point) (_b = (_a = __privateGet(this, _control)) == null ? void 0 : _a.tap) == null ? void 0 : _b.call(_a, __privateGet(this, _context), event, point);
      }
      __privateMethod(this, _PartElement_instances, release_fn).call(this, source);
    };
    keyDown_fn = function(event) {
      const control = __privateGet(this, _control);
      if (!(control == null ? void 0 : control.key) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (control.key(__privateGet(this, _context), event, `key:${event.code || event.key}`)) event.preventDefault();
    };
    registry.define(name, PartElement);
    return PartElement;
  }
  if (globalThis.customElements && !globalThis.customElements.get("parts-kit-part")) definePartElement();

  // bundle-entry.js
  init_boards2();
  init_breadboards();
  init_chips2();
  init_displays2();
  init_inputs2();
  init_modules2();
  init_outputs();
  init_passives2();
  init_sensors2();
  init_symbols2();
  return __toCommonJS(bundle_entry_exports);
})();
globalThis.PartsKit = Object.assign({}, PartsKit);
