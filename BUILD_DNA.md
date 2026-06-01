# My Build DNA — Dustin Zhu

> This is how I build websites and apps. I feed it to an AI assistant (or re-read it
> myself) at the start of a new project so the output carries my taste, structure, and
> standards — not generic defaults. It's the *how*, written to outlive any single
> codebase.

---

## 0. My one-line philosophy
I build things that are **art-directed, editorial, and ruthlessly legible — on a
foundation I can tune later without re-reading my own code.** Every magic number is a
labeled, commented dial. I never hardcode the same fact twice. My work should feel
composed, not assembled.

---

## 1. I make everything knob-driven
This is my most important habit. **Every value that controls feel — timing, spacing,
scale, spread — is a named constant at the top of the file, in a commented block,
grouped by the moment it affects.** I never bury a tunable number inline.

How I do it:
- Constants live in a labeled section (`// ── ANIMATION KNOBS ──`) at the top.
- Each knob states its unit in the comment, plus a **direction rule** — e.g.
  *"BIGGER = slower / more spread out, SMALLER = snappier."*
- I group knobs by the **user-facing moment** they govern (intro, hover, return…),
  numbered, not by code structure.
- A knob's comment says *what I'll see change*, not just what it is.
- If a value is derived from another, I **derive it in code** — I don't restate it.

Why: I iterate by *feel*, in many small passes. Knobs let me adjust the experience by
editing one obvious, well-labeled line — never spelunking.

---

## 2. I keep a single source of truth — always
If a value lives in two places, I treat it as a bug waiting to happen. I give every
fact one home:
- **Colors** live in exactly the places the platform needs (e.g. Tailwind config + CSS
  `:root` vars) and nowhere else. My shared theme file *points to* them rather than
  re-declaring, so a third copy can't drift.
- **Geometry derives.** I set `CARD_W` / `CARD_H` once; the split ratio, positions, and
  font choices follow from it. Change the source, the layout follows.
- **I encode relationships, not duplicates.** Example: a footer's total height is a
  constant, and the sub-gaps are expressed so they always sum to it — so nudging one
  element never changes the page height. The comment says *"to move X, change Y only."*
- Cross-page shared values get imported from one module — I never copy-paste them.

My litmus test before hardcoding: *"If I change this later, how many places must I
touch?"* The answer has to be **one**.

---

## 3. My comments explain WHY and the relationships
My comments aren't "what the code does" — the code already says that. They capture:
- **The intent / the feel** I'm engineering ("reads as drifting from behind to front").
- **The relationship** between values ("these two always sum to FOOTER_TAIL").
- **The escape hatch** — the single knob to turn for a common adjustment.
- **The hard-won gotcha** — *why* something is the way it is, so future-me doesn't
  "fix" it and reintroduce a bug. (I keep a running list; see §9.)
- **Provenance** — Figma node IDs / coordinates when a value came from the design file.

A good comment lets me come back months later and adjust confidently without
re-deriving anything.

---

## 4. I compose on a fixed artboard, scaled to fit
For art-directed pages I author against a **fixed Figma artboard** (e.g. 1440×900) and
scale the whole composition as one rigid unit: `scale = min(vw/W, vh/H)`, capped.
- My **content layer** (the deliberate composition) is centered and uniformly scaled —
  it never distorts, never reflows. Placement is intentional and stays intentional.
- My **ambient layer** (textures, edge illustrations, atmosphere) is anchored to the
  real viewport edges and scaled by the same factor, so it stays tangent to the screen.
- I make layering explicit via z-index: ambient *behind*, content *in front*.
- The scale cap is a **taste decision**, and mine leans toward **airy editorial
  margins** on huge screens over zooming everything up. Whitespace reads as premium.

I only reach for breakpoint *reflow* on genuinely content-driven (text/scroll)
surfaces. For composed visuals, scale-to-fit is the right paradigm — I don't let
careful placement rearrange itself.

---

## 5. I tie responsiveness to legibility, not magic numbers
- I **derive breakpoints from when the design stops being legible**, not round numbers.
  I express the cutover as `referenceWidth × MIN_LEGIBLE_SCALE`, so it's reasoned.
- I pick the axis that actually governs usability (width for a vertically-scrolling
  column; both for a fixed composition) — and I say why in the comment.
- I **detect device capability, not screen size**, when behavior should differ. A
  snapped desktop window is as narrow as a phone; I distinguish them by *pointer type*
  (`any-pointer: fine` = a real computer) instead of width.
- Below the floor, I ship a **deliberate, on-brand placeholder** — never a broken
  shrink. I make its copy adapt to context (e.g. "maximize your window" vs "visit on
  desktop").

---

## 6. My motion is tasteful, intentful, and abuse-proof
Animation is core to the feel for me, but I *engineer* it — I don't sprinkle it:
- **Entrances are the showpieces; exits are simpler and bulletproof.** I keep the
  memorable reveals and make the reverse states uniform, so they can't get caught
  mid-stagger and glitch.
- **I gate on hover intent.** I don't react to a cursor instantly — I require a brief
  linger so a glaze triggers nothing, and a *separate, longer* gate for rapid re-entry
  to defeat "shuffle" abuse.
- **I design for the adversarial user.** I assume someone will spam the interaction, so
  I route every multi-step sequence through one cancellable timeline that a single
  interrupt cleanly kills, and I track interaction state in refs (engaged / unsettled /
  pending) so re-entries never leave orphaned tweens.
- **I never animate out of a partial state.** If a reveal gets interrupted, I either
  complete it first or clear it uniformly — stranded half-rendered elements are the #1
  glitch.
- One animation library, used well. I remove the ones I'm not using.

---

## 7. I keep accessibility & semantics quietly correct
- Decorative imagery gets `alt=""` + `aria-hidden="true"`; meaningful controls get real
  `aria-label`s.
- My navigation is real links/routes, not click handlers on divs.
- I honor the platform — semantic elements, focus, keyboard reachability — without
  making a show of it.

---

## 8. I treat performance as a default, not an afterthought
- I code-split secondary routes (lazy load) and **idle-prefetch** them, so navigation
  feels instant without bloating first paint.
- My primary/hero surface loads eagerly; everything else defers.
- I let the build tool's content-hashing handle cache-busting — I replace an asset in
  place and the hash updates.
- I keep heavy assets honest (optimized SVGs, right-sized images), but I don't
  prematurely micro-optimize — I flag it and move on.

---

## 9. My working method & standards
How I actually run a build:
- **Static first, then motion.** I get the composition pixel-faithful to the design,
  then layer in animation. I never debug both at once.
- **I verify honestly.** A change isn't "done" because it looks plausible. The build
  must pass; behavior must be checked. I state plainly when something is unverified, or
  when a tool *can't* prove it ("I can't watch motion in a hidden preview — you confirm
  the feel"). I never claim a result I didn't observe.
- **I keep a gotchas list.** Every bug that cost me real time becomes a documented,
  numbered note ("DO NOT add X — it caused Y") so I never reintroduce it.
- **One change, one reason.** My commits are scoped and message-explained: what changed
  and *why*, not just what.
- **I iterate in small, reversible passes.** Tune a knob, judge the feel, adjust. I
  favor the one-line lever over the rewrite.
- **I document decisions where they live** — in the comment next to the code, with the
  trade-off named, so the reasoning travels with the file.

---

## 10. My taste checklist (does it feel like me?)
- [ ] Editorial restraint — composed, generous whitespace, nothing shouting.
- [ ] Legible and intentional at every common screen size.
- [ ] Motion that rewards attention but never glitches under abuse.
- [ ] Every feel-value is a labeled, commented knob.
- [ ] Zero duplicated sources of truth; geometry derives.
- [ ] Comments carry the *why* and the escape hatch.
- [ ] A deliberate, on-brand state for every edge (small screen, loading, empty).
- [ ] Build passes; my claims are honest; gotchas are written down.

---

*I use this as a system prompt / project brief. The goal isn't to copy a codebase — it's
to carry my operating principles so anything I build inherits the same DNA.*
