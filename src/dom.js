/**
 * Updating a drawn part in place, in a page. Redrawing is cheap, but replacing the SVG ends a control's focus and
 * pointer capture; patchSvg changes only what differs, and never moves or replaces an element that carries a
 * `data-hook` (lens, knob, cap, lever-N) and is still drawn.
 */

/** Attributes a host sets on drawn elements (focus, roles, states), which a patch keeps. */
const hostOwned = name =>
  name === 'tabindex' || name === 'role' || name === 'style' || name === 'class' || name.startsWith('aria-');

const isElement = node => node.nodeType === 1;
/** An element's `data-hook`, or else the first one inside it, so a plain group pairs with the group holding the same hook. */
function keyOf(node) {
  if (!isElement(node)) return null;
  const own = node.getAttribute('data-hook');
  if (own !== null) return own;
  for (const child of Array.from(node.childNodes)) {
    const key = keyOf(child);
    if (key !== null) return key;
  }
  return null;
}
const sameNode = (a, b) =>
  a.nodeType === b.nodeType &&
  (!isElement(a) || !isElement(b) || (a.localName === b.localName && keyOf(a) === keyOf(b)));

/**
 * Brings `current` (a drawing on the page) to `next` (the same part redrawn), child by child. A hooked element that is
 * still drawn is never moved or replaced: a sibling that comes or goes before it (an LED's glow, drawn only while lit) is
 * inserted or removed around it.
 */
export function syncSvg(current, next) {
  if (!isElement(current) || !isElement(next)) {
    if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
    return;
  }
  for (const { name, value } of Array.from(next.attributes))
    if (current.getAttribute(name) !== value) current.setAttribute(name, value);
  for (const { name } of Array.from(current.attributes))
    if (!next.hasAttribute(name) && !hostOwned(name)) current.removeAttribute(name);
  const after = Array.from(next.childNodes);
  const drawn = new Set(after.map(keyOf).filter(key => key !== null));
  const kept = node => {
    const key = keyOf(node);
    return key !== null && drawn.has(key);
  };
  let index = 0;
  for (const child of after) {
    let old = current.childNodes[index] || null;
    if (old && !sameNode(old, child) && keyOf(child) !== null) {
      // This hook's element further on: the siblings before it are gone.
      const between = [];
      let match = old;
      while (match && !sameNode(match, child)) {
        between.push(match);
        match = match.nextSibling;
      }
      if (match && !between.some(kept)) {
        for (const gone of between) current.removeChild(gone);
        old = match;
      }
    }
    if (old && sameNode(old, child)) syncSvg(old, child);
    else if (old && kept(old)) current.insertBefore(child, old);
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
export function patchSvg(host, drawing) {
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
  syncSvg(current, next);
}

/** A drawn element by its hook (`lens`, `knob`, `lever-3`), inside `host`. */
export function findHook(host, hook) {
  return host.querySelector(`[data-hook="${hook}"]`);
}
