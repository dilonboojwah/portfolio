// Per-page-load flag (plain in-memory object, resets on any full reload/refresh).
//
// `hasLeftHome` flips true the moment the visitor navigates to a non-home route. The
// homepage reads it to decide whether to play the name typewriter:
//   • false → a fresh load / refresh that landed on home  → PLAY the intro.
//   • true  → a RETURN to home after visiting an artifact → skip it (name already there).
//
// Why a router-driven flag instead of "did the homepage mount before?": React StrictMode
// double-invokes effects in dev, so a self-setting flag in the homepage's own effect
// would mark itself "played" on the throwaway first mount and then skip the real one.
// Setting this only on actual navigation keeps the homepage a pure reader — immune to
// the double-mount — so refresh always re-animates in both dev and production.
export const introState = { hasLeftHome: false }
