/** A design token: one value, or one per theme for a colour. */
export interface Token {
  name: string;
  value: string | Record<string, string>;
  usage?: string;
}

/** The parts of tokens.json the stylesheet is written from. */
export interface TokensFile {
  color: { themes: readonly { id: string; name?: string }[]; tokens: readonly Token[] };
  spacing: { tokens: readonly Token[] };
  radius: { tokens: readonly Token[] };
  stroke: { tokens: readonly Token[] };
  opacity: { tokens: readonly Token[] };
  type: { families: Record<string, string> };
}

export interface TokensCssOptions {
  /** Namespaces every property: 'kit-' gives --kit-pad. Use the same prefix as setTokenMode('vars', { prefix }). */
  prefix?: string;
  /** The light theme's selector. Default ':root, [data-theme="light"]'. */
  light?: string;
  /** The dark theme's selector. Default '[data-theme="dark"]'. */
  dark?: string;
}

/** The tokens as CSS custom properties: every colour per theme, then the metrics and type families. */
export function tokensCss(tokens: TokensFile, options?: TokensCssOptions): string;
