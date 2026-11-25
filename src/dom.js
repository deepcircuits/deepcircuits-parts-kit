/**
 * Updating a drawn part in place, in a page. Redrawing is cheap, but replacing the SVG ends a control's focus and
 * pointer capture; patchSvg changes only what differs, and never moves or replaces an element that carries a
 * `data-hook` (lens, knob, cap, lever-N) and is still drawn.
 */

/** Attributes a host sets on drawn elements (focus, roles, states), which a patch keeps. */
const hostOwned = name =>
  name === 'tabindex' || name === 'role' || name === 'style' || name === 'class' || name.startsWith('aria-');

const HOOK_ATTR = 'data-hook';

const isElement = node => node.nodeType === 1;
/** An element's hook attribute, or else the first one inside it, so a plain group pairs with the group holding the same hook. */
function keyOf(node, attr) {
  if (!isElement(node)) return null;
  const own = node.getAttribute(attr);
  if (own !== null) return own;
  for (const child of Array.from(node.childNodes)) {
    const key = keyOf(child, attr);
    if (key !== null) return key;
  }
  return null;
}
/** Whether `a` stands for `b`, whose key is `key`: the same kind of node, and for elements the same tag and hook. */
const sameNode = (a, b, attr, key = keyOf(b, attr)) =>
  a.nodeType === b.nodeType &&
  (!isElement(a) || !isElement(b) || (a.localName === b.localName && keyOf(a, attr) === key));

/**
 * Brings `current` (a drawing on the page) to `next` (the same part redrawn), child by child. A hooked element that is
 * still drawn is never moved or replaced: a sibling that comes or goes before it (an LED's glow, drawn only while lit) is
 * inserted or removed around it. Pass `{ hookAttribute }` if a host copies hooks to another attribute (e.g. `data-svg-id`).
 */
export function syncSvg(current, next, options) {
  if (!isElement(current) || !isElement(next)) {
    if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
    return;
  }
  const attr = options?.hookAttribute || HOOK_ATTR;
  for (const { name, value } of Array.from(next.attributes))
    if (current.getAttribute(name) !== value) current.setAttribute(name, value);
  for (const { name } of Array.from(current.attributes))
    if (!next.hasAttribute(name) && !hostOwned(name)) current.removeAttribute(name);
  const after = Array.from(next.childNodes);
  const keys = after.map(node => keyOf(node, attr));
  const drawn = new Set(keys.filter(key => key !== null));
  const kept = node => {
    const key = keyOf(node, attr);
    return key !== null && drawn.has(key);
  };
  let index = 0;
  for (const [i, child] of after.entries()) {
    const key = keys[i];
    let old = current.childNodes[index] || null;
    let same = old !== null && sameNode(old, child, attr, key);
    if (old && !same && key !== null) {
      // This hook's element further on: the siblings before it are gone.
      const between = [];
      let match = old;
      while (match && !sameNode(match, child, attr, key)) {
        between.push(match);
        match = match.nextSibling;
      }
      if (match && !between.some(kept)) {
        for (const gone of between) current.removeChild(gone);
        old = match;
        same = true;
      }
    }
    // An unchanged element needs no walk through its children.
    if (same) {
      if (typeof old.isEqualNode !== 'function' || !old.isEqualNode(child)) syncSvg(old, child, options);
    } else if (old && kept(old)) current.insertBefore(child, old);
    else if (old) current.replaceChild(child, old);
    else current.appendChild(child);
    index++;
  }
  while (current.lastChild && current.childNodes.length > index) current.removeChild(current.lastChild);
}

/**
 * Shows a drawing (an Artwork, or its SVG markup) in `host`, changing only what differs from the drawing already there,
 * so focus, pointer capture and the host's own attributes survive a redraw. The first call fills the host.
 */
export function patchSvg(host, drawing, options) {
  const markup = typeof drawing === 'string' ? drawing : drawing.svg;
  const current = host.firstElementChild;
  if (!current || current.localName !== 'svg') {
    host.innerHTML = markup;
    return;
  }
  const template = host.ownerDocument.createElement('template');
  template.innerHTML = markup;
  const next = template.content.firstElementChild;
  if (!next || next.localName !== 'svg') {
    host.innerHTML = markup;
    return;
  }
  syncSvg(current, next, options);
}

/** A drawn element by its hook (`lens`, `knob`, `lever-3`), inside `host`. */
export function findHook(host, hook, options) {
  const attr = options?.hookAttribute || HOOK_ATTR;
  return host.querySelector(`[${attr}="${hook}"]`);
}
