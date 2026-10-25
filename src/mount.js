/** The preview helper: draws an artwork over a pitch grid in a page. */
import { circle, r2, tokens } from './core.js';

/**
 * Preview helper: draws an Artwork into a container at `scale` (default 3)
 * over a pitch grid aligned to the part's first pin, so every pin should
 * land on a dot. { pins: true } rings each pin in mark-select.
 */
export function mount(target, a, props) {
  props = props || {};
  const T = tokens();
  const s = props.scale || 3;
  const doc = target.ownerDocument;
  const fig = doc.createElement('figure');
  fig.className = 'pk-fig';
  const box = doc.createElement('div');
  box.className = `pk-art${props.grid === false ? '' : ' pk-grid'}`;
  box.style.width = `${r2(a.width * s)}px`;
  box.style.height = `${r2(a.height * s)}px`;
  box.style.setProperty('--pk-scale', String(s));
  if (a.pins && a.pins.length) {
    const f = a.pins[0];
    const m = function (v) {
      return ((v % T.pitch) + T.pitch) % T.pitch;
    };
    box.style.backgroundPosition = `${r2(m(f.x) * s - 1)}px ${r2(m(f.y) * s - 1)}px`;
  }
  box.innerHTML = a.svg;
  if (props.pins && a.pins) {
    const rings = a.pins
      .map(pn => {
        return circle(pn.x, pn.y, 2.2, 'none', { stroke: T['mark-select'], 'stroke-width': 0.9 });
      })
      .join('');
    box.insertAdjacentHTML(
      'beforeend',
      `<svg class="pk-pins" viewBox="0 0 ${a.width} ${a.height}" aria-hidden="true">${rings}</svg>`,
    );
  }
  fig.appendChild(box);
  if (props.caption) {
    const c = doc.createElement('figcaption');
    c.textContent = props.caption;
    fig.appendChild(c);
  }
  target.appendChild(fig);
  return fig;
}
