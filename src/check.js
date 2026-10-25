/** The overlap check: what in an artwork sits on what. */
import { r2 } from './core.js';

/**
 * The overlap check. Parses an Artwork's SVG (the kit's own output: one
 * element per line of attributes, groups tagged data-part) and reports
 * text on text, text on a part, a part on a part, and anything outside
 * the box. Parts named body or board are grounds: other parts and text
 * may sit on them. glow, trace, flow and probe are ignored; a part may
 * contain a smaller part or a label (a + on a capacitor).
 */
export function check(a) {
  let items = [];
  const stack = [];
  const re = /<(\/?)(g|rect|circle|ellipse|line|path|text)\b([^>]*?)(\/?)>([^<]*)/g;
  let m;
  const attr = function (s, n) {
    const r = new RegExp(`(?:^|\\s)${n}="([^"]*)"`).exec(s);
    return r ? r[1] : null;
  };
  const num = function (s, n, d) {
    const v = attr(s, n);
    return v === null ? d : parseFloat(v);
  };
  function xf(t) {
    // a transform into an affine [a b c d e f]
    let M = [1, 0, 0, 1, 0, 0];
    let r;
    const reT = /(translate|scale|rotate|matrix)\(([^)]*)\)/g;
    const mul = function (A, B) {
      return [
        A[0] * B[0] + A[2] * B[1],
        A[1] * B[0] + A[3] * B[1],
        A[0] * B[2] + A[2] * B[3],
        A[1] * B[2] + A[3] * B[3],
        A[0] * B[4] + A[2] * B[5] + A[4],
        A[1] * B[4] + A[3] * B[5] + A[5],
      ];
    };
    while ((r = reT.exec(t || ''))) {
      const v = r[2]
        .trim()
        .split(/[\s,]+/)
        .map(parseFloat);
      if (r[1] === 'translate') M = mul(M, [1, 0, 0, 1, v[0], v[1] || 0]);
      else if (r[1] === 'scale') M = mul(M, [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]);
      else if (r[1] === 'matrix') M = mul(M, v.slice(0, 6));
      else {
        const ang = (v[0] * Math.PI) / 180;
        const cx = v[1] || 0;
        const cy = v[2] || 0;
        const c = Math.cos(ang);
        const sn = Math.sin(ang);
        M = mul(M, [c, sn, -sn, c, cx - c * cx + sn * cy, cy - sn * cx - c * cy]);
      }
    }
    return M;
  }
  const apply = function (M, x, y) {
    return [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
  };
  function boxOf(M, pts) {
    const xs = [];
    const ys = [];
    pts.forEach(pt => {
      const q = apply(M, pt[0], pt[1]);
      xs.push(q[0]);
      ys.push(q[1]);
    });
    return {
      x0: Math.min.apply(null, xs),
      y0: Math.min.apply(null, ys),
      x1: Math.max.apply(null, xs),
      y1: Math.max.apply(null, ys),
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
    let cmd = 'M';
    const next = function () {
      return parseFloat(tok[i++]);
    };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
      switch (cmd) {
        case 'M':
          x = next();
          y = next();
          sx = x;
          sy = y;
          pts.push([x, y]);
          cmd = 'L';
          break;
        case 'm':
          x += next();
          y += next();
          sx = x;
          sy = y;
          pts.push([x, y]);
          cmd = 'l';
          break;
        case 'L':
          x = next();
          y = next();
          pts.push([x, y]);
          break;
        case 'l':
          x += next();
          y += next();
          pts.push([x, y]);
          break;
        case 'H':
          x = next();
          pts.push([x, y]);
          break;
        case 'h':
          x += next();
          pts.push([x, y]);
          break;
        case 'V':
          y = next();
          pts.push([x, y]);
          break;
        case 'v':
          y += next();
          pts.push([x, y]);
          break;
        case 'Q':
          next();
          next();
          x = next();
          y = next();
          pts.push([x, y]);
          break;
        case 'q':
          next();
          next();
          x += next();
          y += next();
          pts.push([x, y]);
          break;
        case 'C':
          next();
          next();
          next();
          next();
          x = next();
          y = next();
          pts.push([x, y]);
          break;
        case 'A':
          next();
          next();
          next();
          next();
          next();
          x = next();
          y = next();
          pts.push([x, y]);
          break;
        case 'a':
          next();
          next();
          next();
          next();
          next();
          x += next();
          y += next();
          pts.push([x, y]);
          break;
        case 'Z':
        case 'z':
          x = sx;
          y = sy;
          break;
        default:
          i++;
      }
    }
    return pts;
  }
  while ((m = re.exec(a.svg))) {
    const closing = m[1] === '/';
    const tagName = m[2];
    const attrs = m[3];
    const inner = m[5];
    if (tagName === 'g') {
      if (closing) {
        stack.pop();
        continue;
      }
      const parent = stack.length ? stack[stack.length - 1] : null;
      const M0 = parent ? parent.M : [1, 0, 0, 1, 0, 0];
      const Mt = xf(attr(attrs, 'transform'));
      const M = [
        M0[0] * Mt[0] + M0[2] * Mt[1],
        M0[1] * Mt[0] + M0[3] * Mt[1],
        M0[0] * Mt[2] + M0[2] * Mt[3],
        M0[1] * Mt[2] + M0[3] * Mt[3],
        M0[0] * Mt[4] + M0[2] * Mt[5] + M0[4],
        M0[1] * Mt[4] + M0[3] * Mt[5] + M0[5],
      ];
      const part = attr(attrs, 'data-part') || (parent ? parent.part : null);
      const node = { M, part, box: null, circle: null, own: !!attr(attrs, 'data-part') };
      stack.push(node);
      if (node.own) items.push({ kind: 'part', name: part, node });
      continue;
    }
    if (closing) continue;
    const top = stack.length ? stack[stack.length - 1] : null;
    const Mc = top ? top.M : [1, 0, 0, 1, 0, 0];
    let box = null;
    let circ = null;
    const ownPart = attr(attrs, 'data-part');
    const tLocal = xf(attr(attrs, 'transform'));
    const Me = [
      Mc[0] * tLocal[0] + Mc[2] * tLocal[1],
      Mc[1] * tLocal[0] + Mc[3] * tLocal[1],
      Mc[0] * tLocal[2] + Mc[2] * tLocal[3],
      Mc[1] * tLocal[2] + Mc[3] * tLocal[3],
      Mc[0] * tLocal[4] + Mc[2] * tLocal[5] + Mc[4],
      Mc[1] * tLocal[4] + Mc[3] * tLocal[5] + Mc[5],
    ];
    if (tagName === 'rect') {
      const x = num(attrs, 'x', 0);
      const y = num(attrs, 'y', 0);
      const w = num(attrs, 'width', 0);
      const h = num(attrs, 'height', 0);
      box = boxOf(Me, [
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ]);
    } else if (tagName === 'circle') {
      const cx = num(attrs, 'cx', 0);
      const cy = num(attrs, 'cy', 0);
      const r = num(attrs, 'r', 0);
      const cc = apply(Me, cx, cy);
      const rr = r * Math.sqrt(Math.abs(Me[0] * Me[3] - Me[1] * Me[2]));
      box = { x0: cc[0] - rr, y0: cc[1] - rr, x1: cc[0] + rr, y1: cc[1] + rr };
      circ = { x: cc[0], y: cc[1], r: rr };
    } else if (tagName === 'ellipse') {
      const ex = num(attrs, 'cx', 0);
      const ey = num(attrs, 'cy', 0);
      const erx = num(attrs, 'rx', 0);
      const ery = num(attrs, 'ry', 0);
      box = boxOf(Me, [
        [ex - erx, ey - ery],
        [ex + erx, ey - ery],
        [ex - erx, ey + ery],
        [ex + erx, ey + ery],
      ]);
    } else if (tagName === 'line') {
      box = boxOf(Me, [
        [num(attrs, 'x1', 0), num(attrs, 'y1', 0)],
        [num(attrs, 'x2', 0), num(attrs, 'y2', 0)],
      ]);
    } else if (tagName === 'path') {
      const pts = pathPts(attr(attrs, 'd') || '');
      if (pts.length) box = boxOf(Me, pts);
    } else if (tagName === 'text') {
      const txt = inner
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
      const fs = num(attrs, 'font-size', 4);
      const tw = txt.length * fs * 0.62;
      const tx = num(attrs, 'x', 0);
      const ty = num(attrs, 'y', 0);
      const anchor = attr(attrs, 'text-anchor') || 'middle';
      const mid = attr(attrs, 'dominant-baseline') === 'middle';
      const left = anchor === 'start' ? tx : anchor === 'end' ? tx - tw : tx - tw / 2;
      const topY = mid ? ty - fs * 0.5 : ty - fs * 0.76;
      const botY = mid ? ty + fs * 0.5 : ty + fs * 0.1;
      items.push({
        kind: 'text',
        name: txt,
        box: boxOf(Me, [
          [left, topY],
          [left + tw, topY],
          [left, botY],
          [left + tw, botY],
        ]),
      });
      continue;
    }
    if (!box) continue;
    if (ownPart) {
      items.push({ kind: 'part', name: ownPart, box, circle: circ });
      continue;
    }
    if (top) {
      // grow the enclosing tagged group's box
      let g = top;
      while (g && !g.own) g = null; // only the nearest tagged ancestor accumulates
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
            y1: Math.max(holder.box.y1, box.y1),
          };
          // The group stays a circle while every child sits inside its largest concentric circle.
          const hc = holder.circle;
          if (hc) {
            const inside =
              box.x0 >= hc.x - hc.r - 0.01 &&
              box.x1 <= hc.x + hc.r + 0.01 &&
              box.y0 >= hc.y - hc.r - 0.01 &&
              box.y1 <= hc.y + hc.r + 0.01;
            if (circ && Math.abs(hc.x - circ.x) < 0.01 && Math.abs(hc.y - circ.y) < 0.01)
              holder.circle = circ.r > hc.r ? circ : hc;
            else if (!inside) holder.circle = null;
          }
        }
      }
    }
  }
  items.forEach(it => {
    if (it.node) {
      it.box = it.node.box;
      it.circle = it.node.circle;
      delete it.node;
    }
  });
  items = items.filter(it => {
    return it.box;
  });
  const ignore = { glow: 1, trace: 1, flow: 1, probe: 1 };
  const ground = { body: 1, board: 1 };
  const tol = 0.35;
  const meets = function (A, B) {
    return A.x1 - tol > B.x0 && B.x1 - tol > A.x0 && A.y1 - tol > B.y0 && B.y1 - tol > A.y0;
  };
  const contains = function (A, B) {
    return B.x0 >= A.x0 - tol && B.x1 <= A.x1 + tol && B.y0 >= A.y0 - tol && B.y1 <= A.y1 + tol;
  };
  const circleMeets = function (c, B) {
    const nx = Math.max(B.x0, Math.min(c.x, B.x1));
    const ny = Math.max(B.y0, Math.min(c.y, B.y1));
    return (c.x - nx) * (c.x - nx) + (c.y - ny) * (c.y - ny) < (c.r - tol) * (c.r - tol);
  };
  const pairMeets = function (A, B) {
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
  const desc = function (it) {
    return `${it.kind} ${JSON.stringify(it.name)} [${r2(it.box.x0)},${r2(it.box.y0)} ${r2(it.box.x1)},${r2(it.box.y1)}]`;
  };
  for (let i = 0; i < items.length; i++) {
    const A = items[i];
    if (ignore[A.name]) continue;
    if (A.box.x0 < -0.5 || A.box.y0 < -0.5 || A.box.x1 > a.width + 0.5 || A.box.y1 > a.height + 0.5)
      problems.push({ kind: 'outside', a: desc(A) });
    for (let j = i + 1; j < items.length; j++) {
      const B = items[j];
      if (ignore[B.name]) continue;
      if (A.kind === 'part' && B.kind === 'part' && (ground[A.name] || ground[B.name])) continue;
      if (A.kind === 'text' && B.kind === 'part' && ground[B.name]) continue;
      if (B.kind === 'text' && A.kind === 'part' && ground[A.name]) continue;
      if (!pairMeets(A, B)) continue;
      if (A.kind === 'part' && B.kind === 'part' && (contains(A.box, B.box) || contains(B.box, A.box))) continue;
      if (A.kind !== B.kind && contains(A.kind === 'part' ? A.box : B.box, A.kind === 'part' ? B.box : A.box)) continue;
      problems.push({
        kind:
          A.kind === 'text' && B.kind === 'text' ? 'text-on-text' : A.kind === B.kind ? 'part-on-part' : 'text-on-part',
        a: desc(A),
        b: desc(B),
      });
    }
  }
  return problems;
}
export { pinsOnPitch } from './core.js';
