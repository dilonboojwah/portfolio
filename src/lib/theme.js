// ── SHARED THEME CONSTANTS ────────────────────────────────────────────────────
// Single source of truth for values that were previously copy-pasted, verbatim,
// into every page. Importing them here (instead of re-declaring per file) keeps
// the pages in lockstep — change a value once and all pages follow.
//
// NOTE: the canonical COLOR palette lives in two already-existing places:
//   • tailwind.config.js  → enables utility classes like `text-ink`, `bg-parchment`
//   • src/index.css :root  → exposes the same hues as CSS variables (var(--ink))
// This file deliberately does NOT re-declare colors, to avoid a third source of
// truth drifting out of sync.

// Fraunces is a variable font. Every place we render Fraunces we pin its two
// custom axes to the same values so the typeface looks identical site-wide:
//   SOFT 0  → sharp (un-softened) terminals
//   WONK 1  → the "wonky" stylistic alternates enabled
// Spread this object into any Fraunces element's style: style={{ ...fv, ... }}
export const fv = { fontVariationSettings: "'SOFT' 0, 'WONK' 1" }

// The flat airy-white page base used on every route (matches the Figma fill and
// the <body> background). Sourced from the --rice-paper CSS var so the palette
// stays defined in one place (index.css :root).
export const PAGE_BG = 'var(--rice-paper)'
