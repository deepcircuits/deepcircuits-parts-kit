// The types of drawings.mjs, for a host that runs the kit's drawings in its own tests.
import type { Artwork, PartsKit } from '../project/generators/index.d.ts';

/** The kit to draw with: the bundle's PartsKit, or the entry points' exports on one object. */
type Kit = Partial<PartsKit>;
/** The built bundle's PartsKit, loaded in a context of its own so a check can replace its functions. */
export declare function loadBundle(): PartsKit;
/** The suite: a fixed set of parts in their states, by name. */
export declare function suite(K: Kit): Record<string, Artwork>;
/** The fuzz cases, [name, make], from a fixed seed: each make draws a template with random pins, counts and sizes. */
export declare function fuzzCases(K: Kit): [string, () => Artwork][];
/** Each card's preview script, by card name, without the line that sets the live token mode. */
export declare function previewScripts(): { name: string; script: string }[];
/** The artworks the card previews mount, drawn with K: [{ name: 'Card · caption', art }]. */
export declare function drawPreviews(K: Kit): { name: string; art: Artwork }[];
/** A meter and its two test leads on a bench of their own (places in pitches; a null lead lies at its rest place). */
export declare function leadArt(
  K: Kit,
  props: { width: number; height: number; at: { x: number; y: number }; redJack?: 'V' | 'mA'; mode?: 'voltage' | 'current'; black?: { x: number; y: number } | null; red?: { x: number; y: number } | null },
): Artwork;
