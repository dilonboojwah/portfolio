import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { fv, PAGE_BG } from '../lib/theme'
import { introState } from '../lib/introState'

// ── ANIMATION KNOBS ──────────────────────────────────────────────────────────
// Every value below is in SECONDS. Rule of thumb: BIGGER = slower / more spread
// out, SMALLER = quicker / snappier. There are 4 separate moments, grouped below.
//
// A note on "spread" vs "entrance time" (they show up a lot):
//   • spread       = ONE number shared by all glyphs; their start times are spaced
//                    evenly across that window (e.g. 9 letters spread over 0.5s).
//   • entrance time = the exact moment ONE specific glyph starts (used for 朱 / 谛).

// ▸ 1. INITIAL TYPEWRITER — plays on first load, on refresh, and when you come
//      back to the page from an artifact. "Dustin Zhu" types in letter-by-letter,
//      then 朱 and 谛 each pop in at their own moment.
const NAME_START_DELAY = 0.66    // pause after the page loads before the name starts appearing
const NAME_TYPE_TIME   = 0.6    // spread: total window for all 9 English letters to start typing in
const LETTER_DUR       = 0.3    // how long EACH English letter takes to fade in (also reused on type-out)
const ZHU_IN           = 0.25  // entrance time of 朱 — seconds after the name sequence starts
const DI_IN            = 0.4    // entrance time of 谛 — seconds after the name sequence starts
const CHAR_DUR         = 0.6    // how long EACH Chinese character takes to fade (also reused on type-out)

// ▸ 2. HOVER DISSOLVE — plays when the cursor ENTERS the center (name leaves so the
//      bio arrives). UNIFORM: the whole name fades + blurs out together (no per-letter
//      stagger), so the return can later reverse smoothly from any in-between state.
const NAME_OUT_DUR = 0.4   // seconds for the whole name to dissolve out
const NAME_BLUR    = 6     // px the name blurs by as it dissolves (and clears on the way back)

// ▸ HOVER INTENT — the cursor must linger in the center at least this long (seconds)
//   before the name ⇄ bio swap even begins, so a quick glaze across triggers nothing.
//   TWO separate gates:
//   • HOVER_INTENT_DELAY  — a FRESH hover (name fully at rest in the center).
//   • REENTER_INTENT_DELAY — re-entering while the name is still UNSETTLED from a recent
//     leave (i.e. mid wave-out / mid name-return). Raise THIS to kill the "rapid shuffle
//     back-and-forth" abuse: quick re-entries during that window get ignored entirely.
const HOVER_INTENT_DELAY   = 0.15
const REENTER_INTENT_DELAY = 0.2

// ▸ 3. RETURN FADE — plays when the cursor LEAVES the center. This is NOT the
//      typewriter: the whole name fades in together while drifting forward
//      (scale-up + blur→sharp), so it reads as coming "from behind". Its TIMING is
//      no longer a fixed guess — it's synced to the bio wave-out (see handleLeave):
//      the name returns exactly as the wave's last word begins leaving (cross-dissolve),
//      so it can never appear over the bulk of a still-present bio.
const NAME_RETURN_FADE  = 1   // how long the whole-name fade-in takes
const NAME_RETURN_SCALE = 1   // starting size (smaller = starts further "behind"); grows to 1.0

// ▸ 4. ABOUT BIO WAVE — the hidden bio text that waves in (on hover) and out
//      (on leave) diagonally, top-left → bottom-right.
const ABOUT_IN_BASE     = 0.55  // base fade duration for each word as it waves in
const WAVE_SPREAD       = 0.5   // diagonal spread: bigger = longer gap between the first (top-left) and last (bottom-right) word
const HOVER_WAVE_SPEED  = 1.15  // overall speed of the wave-IN — bigger = faster (divides both the duration AND the spread)
const ABOUT_OUT_SPEEDUP = 1.15   // the wave-OUT is this many × faster than the wave-in

// ▸ 4b. CULPRIT-ZONE RECOVERY — the messy glitch came from waving OUT while the bio was
//      only PARTIALLY waved in (some words frozen mid-opacity). The fix: never sweep out
//      from a partial state. The "culprit zone" = leaving AFTER the swap commits but
//      BEFORE the wave-in finishes — i.e. a dwell between HOVER_INTENT_DELAY (lower bound,
//      ~0.15s) and the wave-in's full completion (upper bound, ABOUT_IN_DUR + spread ≈
//      0.9s). Both bounds are already governed by the knobs above; this knob governs what
//      happens INSIDE the zone:
const HOLD_DURATION    = 0   // if you leave mid-wave-in, the bio first COMPLETES its wave-in,
                            // holds fully-formed this long, THEN sweeps out (0 = no hold, sweep immediately)

// ▸ NAME RETURN LEAD — how many seconds BEFORE the wave-out finishes the name starts
//   drifting back (a cross-dissolve). Safe now that every wave-out starts fully-lit.
//   Bigger = name returns sooner / more overlap with the sweep. 0 = wait for full clear.
const NAME_RETURN_LEAD = 0.3

// ▸ 5. AMBIENT — falling-petal mix weights (parallel to fallingflower-1..5).
const TREE_WEIGHTS   = [15, 15, 23, 23, 23]  // tree: petals 1 & 2 rarer (~30% of the mix)
const FLOWER_WEIGHTS = [0, 0, 1, 1, 1]        // flowers: exclude petals 1 & 2 entirely

// ── LOCAL ASSETS ──────────────────────────────────────────────────────────────
import PapyrusTexture   from '../components/PapyrusTexture'
import Clouds           from '../components/Clouds'
import FallingPetals    from '../components/FallingPetals'
import { TREE_SPAWN_POINTS, FLOWER_SPAWN_POINTS } from '../data/petalSpawns'
import blossomTree      from '../assets/illustration/homepage-blossomtree.svg'
import mountains        from '../assets/illustration/homepage-mountains.svg'
import mountainsFlowers from '../assets/illustration/homepage-mountains-flowers.svg'
import patternArtemis   from '../assets/illustration/homepage-pattern-artemis.svg'
import patternProse     from '../assets/illustration/homepage-pattern-prose.svg'
import patternCulinary  from '../assets/illustration/homepage-pattern-culinary.svg'

// ── REFERENCE FRAME ─────────────────────────────────────────────────────────
// The whole composition is authored against the Figma 1440×900 artboard, then
// scaled to fit the viewport as one rigid unit (scale-to-fit hybrid):
//   • CONTENT layer (name + cards) lives inside a 1440×900 artboard that is
//     centered and uniformly transform-scaled — composition never distorts.
//   • AMBIENT layer (papyrus, blossom, mountains) is anchored to the real
//     viewport edges and scaled by the same factor, so blossom stays tangent
//     to the LEFT edge and mountains to the RIGHT edge at any size.
// scale = min(vw/1440, vh/900), capped so it never balloons on large monitors
// (scaling down is safe; uncapped scale-up looks blown-up). The cap is deliberately
// EDITORIAL: at 1.3 a 1920×1080 monitor fills comfortably (it "wants" 1.2) while
// huge 2K/4K screens stop here and frame the composition with airy parchment margins
// rather than zooming everything up — the intended premium, gallery-like feel.
const REF_W = 1440
const REF_H = 900
const MAX_SCALE = 1.3

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H, MAX_SCALE)
}

function useSceneScale() {
  const [scale, setScale] = useState(computeScale)
  useEffect(() => {
    const onResize = () => setScale(computeScale())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

// ── ARTIFACT CARDS ──────────────────────────────────────────────────────────
// Card geometry is a single source of truth — bump CARD_W/CARD_H and the split
// ratio + positions follow; label/title fonts are chosen deliberately so they
// stay legible rather than scaling blindly.
const CARD_W = 150
const CARD_H = 300
const CARD_TEXT_H = Math.round(CARD_H * 0.45) // 45% text block / 55% pattern half

// Positions are absolute coordinates inside the 1440×900 artboard.
// Symmetric about center (x=720): outer cards ±535, inner cards ±335, 50px
// gutters, ~164px clearance from the calligraphy, vertical span centered on 450.
// The cards are the navigation: external for the app, internal routes otherwise.
const cards = [
  { label: 'APP',     title: 'Artemis', subtitle: 'career clarity engine',     pattern: patternArtemis,  href: '/artemis',                            external: false, x: 110,  y: 470 },
  { label: 'PROSE',   title: 'The Evolution of Intelligence', pattern: patternProse,    href: '/evolution-of-intelligence',          external: false, x: 310,  y: 390 },
  { label: 'PROSE',   title: 'Solving Human-AI Coordination', pattern: patternProse,    href: '/solving-human-ai-coordination',      external: false, x: 980,  y: 210 },
  { label: 'GALLERY', title: 'Culinary Repertoire',           pattern: patternCulinary, href: '/culinary-repertoire',                external: false, x: 1180, y: 130 },
]

function ArtifactCard({ label, title, subtitle, pattern }) {
  return (
    <div style={{
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
      background: 'rgba(255,255,255,1)',
      border: '0.5px solid rgba(61,97,145,0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}>
      {/* Text block — 45% of card height; label top, title bottom (justify-between) */}
      <div style={{
        height: `${CARD_TEXT_H}px`,
        width: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        <p className="text-gold" style={{
          fontFamily: "Cinzel, 'Trajan Pro', 'Times New Roman', serif", fontWeight: 400,
          fontSize: '16px', lineHeight: 1, letterSpacing: '0.4px',
          textAlign: 'center', whiteSpace: 'nowrap', margin: 0,
        }}>
          {label}
        </p>
        {subtitle ? (
          // Two-line title (the Artemis card): name + dust subtitle, per Figma card-artemis.
          <div className="font-fraunces" style={{ ...fv, textAlign: 'right', width: '100%', letterSpacing: '0.2px' }}>
            <p className="text-stone" style={{ fontSize: '20px', lineHeight: 1.5, margin: 0 }}>{title}</p>
            <p className="text-dust"  style={{ fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{subtitle}</p>
          </div>
        ) : (
          <p className="font-fraunces text-stone" style={{
            ...fv,
            fontSize: '20px', lineHeight: 1.25, letterSpacing: '0.13px',
            textAlign: 'right', width: '100%', margin: 0,
          }}>
            {title}
          </p>
        )}
      </div>

      {/* Pattern half — exported SVG is pre-fitted to the card bottom (100×105) */}
      <div style={{
        flex: '1 0 0',
        minHeight: 0,
        width: '100%',
        overflow: 'hidden',
        background: 'rgba(237,241,246,0.5)',
        opacity: 0.8,
      }}>
        <img src={pattern} alt="" aria-hidden="true" style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }} />
      </div>
    </div>
  )
}

// Center hover reveal — contents of the hidden "Main Page About Text" box (Figma 223:1987)
const aboutParas = [
  'I grew up in upstate New York and have lived in NYC and SF. My work sits at the intersection of design and technology.',
  'I have a soft spot for Nutella and a dream of living in Norway one day.',
]

export default function MainPage() {
  const scale = useSceneScale()
  // On a RETURN to the homepage the typewriter is skipped — so render the name glyphs
  // already-visible from the FIRST painted frame (not opacity:0 then a post-mount snap),
  // which is what caused the occasional flash. On the first visit they start hidden and
  // the typewriter (effect below) fades them in.
  const introInitialOpacity = introState.hasLeftHome ? 1 : 0
  const centerRef = useRef(null)   // hover hit-area (scopes the GSAP selectors)
  const enterTimerRef = useRef(null) // hover-intent timer (fires the swap only after a brief linger)
  const activeRef = useRef(false)    // whether the name⇄bio swap is currently engaged
  const unsettledRef = useRef(false) // true from a leave until the name has fully returned
  const exitTlRef = useRef(null)     // the exit timeline: (optional hold →) wave-out → name return
  const pendingOutRef = useRef(false) // left mid-wave-in → owe a recovery once the wave-in finishes
  const bioFullyInRef = useRef(false) // whether the wave-in has fully completed (full bio on screen)

  // ── Name typewriter (intro only) ─────────────────────────────────────────────
  // Plays on page load / refresh / return-from-route. Both groups fire together:
  // "Dustin Zhu" types IN over NAME_TYPE_TIME; 朱 and 谛 each enter at ZHU_IN / DI_IN.
  // (The hover-OUT is a uniform dissolve now — see nameDissolve — not a typewriter.)
  const typeName = (delay = 0) => {
    const letters = gsap.utils.toArray('.name-letter')
    const chars   = gsap.utils.toArray('.name-char')
    const base = { ease: 'none', overwrite: 'auto', delay }   // delay = wait before this run starts
    gsap.fromTo(letters, { opacity: 0 }, { opacity: 1, ...base, duration: LETTER_DUR, stagger: { amount: NAME_TYPE_TIME } })
    gsap.fromTo(chars,   { opacity: 0 }, { opacity: 1, ...base, duration: CHAR_DUR, stagger: (i) => (i === 0 ? ZHU_IN : DI_IN) })
  }

  // ── Name dissolve (hover) ────────────────────────────────────────────────────
  // The whole name fades + blurs out TOGETHER (uniform, no stagger). Keeping it
  // uniform is the fix: the name is always at a single opacity/blur, so the return
  // can reverse cleanly from any point — no caught-mid-stagger flash or unevenness.
  const nameDissolve = () => {
    const glyphs = [...gsap.utils.toArray('.name-letter'), ...gsap.utils.toArray('.name-char')]
    const group  = centerRef.current?.querySelector('.name-group')
    gsap.to(glyphs, { opacity: 0, overwrite: 'auto', duration: NAME_OUT_DUR, ease: 'power2.out' })
    if (group) {
      gsap.to(group, { scale: NAME_RETURN_SCALE, filter: `blur(${NAME_BLUR}px)`, transformOrigin: 'center center',
        overwrite: 'auto', duration: NAME_OUT_DUR, ease: 'power2.out' })
    }
  }

  // ── Name return fade ─────────────────────────────────────────────────────────
  // Used ONLY when the cursor leaves the center (the name coming back). Unlike the
  // initial typewriter (typeName), every letter + character fades in TOGETHER as a
  // single unit — no per-glyph stagger. A slight scale-up + blur-clear on the whole
  // group makes the name read as drifting "from behind to front" into focus.
  const nameFadeIn = (delay = 0) => {
    const glyphs = [...gsap.utils.toArray('.name-letter'), ...gsap.utils.toArray('.name-char')]
    const group  = centerRef.current?.querySelector('.name-group')
    // Fade from the glyphs' CURRENT opacity (not a hard reset to 0). On a quick leave
    // the name may still be mid type-out (partially visible); reversing smoothly from
    // where it is avoids the snap-to-0 "double flash". Identical for a full hover (already 0).
    gsap.to(glyphs, { opacity: 1, overwrite: 'auto', delay, duration: NAME_RETURN_FADE, ease: 'power2.out' })
    if (group) {
      // Clear scale/blur from the group's CURRENT state (set by the dissolve) — a
      // gsap.to, NOT a fromTo, so the blur never snaps. Symmetric with the dissolve.
      gsap.to(group, { scale: 1, filter: 'blur(0px)', transformOrigin: 'center center',
        overwrite: 'auto', delay, duration: NAME_RETURN_FADE, ease: 'power2.out' })
    }
  }

  // ── About diagonal wave ──────────────────────────────────────────────────────
  const ABOUT_IN_DUR = ABOUT_IN_BASE / HOVER_WAVE_SPEED
  const ABOUT_IN_SPREAD = WAVE_SPREAD / HOVER_WAVE_SPEED
  const ABOUT_OUT_DUR = ABOUT_IN_DUR / ABOUT_OUT_SPEEDUP          // per-word fade-out duration
  const ABOUT_OUT_STAGGER = ABOUT_IN_SPREAD / ABOUT_OUT_SPEEDUP   // diag(0→1) × this = each word's start
  const ABOUT_OUT_TOTAL = ABOUT_OUT_STAGGER + ABOUT_OUT_DUR       // wall-clock span of the whole sweep-out

  const diagFns = () => {
    const words = gsap.utils.toArray('.about-word')
    const maxDiag = Math.max(...words.map(el => el.offsetLeft + el.offsetTop), 1)
    return { words, diag: (el) => (el.offsetLeft + el.offsetTop) / maxDiag }
  }

  // Wave the bio IN (diagonal TL→BR). onComplete marks the bio fully revealed; if the
  // cursor has ALREADY left by then (a "culprit-zone" leave), it kicks off the graceful
  // recovery: hold the fully-formed bio, then sweep it out — never from a partial state.
  const aboutWaveIn = () => {
    const { words, diag } = diagFns()
    if (!words.length) return
    bioFullyInRef.current = false
    gsap.fromTo(words,
      { opacity: 0, y: 4, filter: 'blur(3px)' },
      { opacity: 0.9, y: 0, filter: 'blur(0px)', overwrite: 'auto', duration: ABOUT_IN_DUR, ease: 'power2.out',
        stagger: (i, el) => diag(el) * ABOUT_IN_SPREAD,
        onComplete: () => {
          bioFullyInRef.current = true
          if (pendingOutRef.current) {            // left mid-wave-in → now recover from the FULL state
            pendingOutRef.current = false
            exitTlRef.current?.kill()
            exitTlRef.current = buildExitTimeline(true)   // WITH the hold
          }
        } })
  }

  // The shared EXIT: (optional hold →) diagonal sweep-out → name cross-dissolves back in.
  // Always runs from a fully-lit bio, so the sweep never strands frozen partial words.
  const buildExitTimeline = (withHold) => {
    const { words, diag } = diagFns()
    if (!words.length) { nameFadeIn(); unsettledRef.current = false; return null }
    const holdT = (withHold && HOLD_DURATION > 0) ? HOLD_DURATION : 0
    gsap.killTweensOf(words)   // stop the wave-in cleanly; words hold at FULL through holdT
    const tl = gsap.timeline()
    // diagonal sweep-OUT, TL→BR (begins after the hold)
    tl.to(words,
      { opacity: 0, y: 4, filter: 'blur(3px)', duration: ABOUT_OUT_DUR, ease: 'power2.out',
        stagger: (i, el) => diag(el) * ABOUT_OUT_STAGGER }, holdT)
    // name drifts back NAME_RETURN_LEAD before the sweep finishes (cross-dissolve)
    const nameAt = holdT + Math.max(ABOUT_OUT_TOTAL - NAME_RETURN_LEAD, 0)
    tl.call(() => nameFadeIn(), null, nameAt)
    // re-entry window closes once the name has fully returned
    tl.call(() => { unsettledRef.current = false }, null, nameAt + NAME_RETURN_FADE)
    return tl
  }

  // The actual name⇄bio swap — only fired once the cursor has lingered (hover intent).
  const fireSwap = () => {
    activeRef.current = true
    unsettledRef.current = false       // we're engaged again — no longer "returning"
    pendingOutRef.current = false
    exitTlRef.current?.kill(); exitTlRef.current = null
    nameDissolve()    // name dissolves OUT (uniform fade + blur)
    aboutWaveIn()     // bio waves in
  }
  const handleEnter = () => {
    // Don't react immediately — wait out the intent delay. A quick glaze leaves before
    // this fires, so nothing animates. RE-entering while the name is still unsettled from
    // a recent leave uses the longer REENTER gate, so rapid back-and-forth shuffling is
    // ignored until the cursor genuinely lingers.
    const delay = unsettledRef.current ? REENTER_INTENT_DELAY : HOVER_INTENT_DELAY
    enterTimerRef.current?.kill()
    enterTimerRef.current = gsap.delayedCall(delay, fireSwap)
  }
  const handleLeave = () => {
    enterTimerRef.current?.kill(); enterTimerRef.current = null
    if (!activeRef.current) return   // intent never met → nothing happened, nothing to undo
    activeRef.current = false
    unsettledRef.current = true      // open the "re-entry" window until the name fully returns
    exitTlRef.current?.kill()
    if (bioFullyInRef.current) {
      // SETTLED hover: bio is fully shown → sweep out + cross-dissolve the name straight away.
      exitTlRef.current = buildExitTimeline(false)   // no hold
    } else {
      // CULPRIT ZONE: left before the wave-in finished. Don't sweep out from a partial,
      // straggler-prone state — let the wave-in COMPLETE first; its onComplete then runs
      // buildExitTimeline(true) (hold + sweep). pendingOutRef is the "we owe an exit" flag.
      pendingOutRef.current = true
    }
  }

  // First visit — type the name in. On a RETURN from an artifact (introPlayed already
  // true) we skip the typewriter and just snap every glyph visible, so the homepage reads
  // as already-there. GSAP pauses/resumes its own ticker with tab visibility, so a
  // hidden/refocused tab resumes cleanly — no manual visibility handling.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (introState.hasLeftHome) {
        gsap.set(['.name-letter', '.name-char'], { opacity: 1 })   // returning — already there, no animation
      } else {
        typeName(NAME_START_DELAY)                                  // fresh load / refresh — play the intro
      }
    }, centerRef)
    return () => { enterTimerRef.current?.kill(); exitTlRef.current?.kill(); ctx.revert() }
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      background: PAGE_BG,
    }}>

      {/* ── AMBIENT LAYER — viewport-anchored, full-bleed ───────────────────── */}

      {/* Papyrus texture — fills the whole viewport */}
      <PapyrusTexture />

      {/* Blossom — tangent to LEFT edge; scales with the scene */}
      <img
        src={blossomTree}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ left: 0, top: `${43 * scale}px`, width: `${301 * scale}px`, height: 'auto', opacity: 0.65 }}
      />

      {/* Mountains — tangent to RIGHT edge; scales with the scene, distance from bottom scales too */}
      <img
        src={mountains}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ right: 0, bottom: `${23 * scale}px`, width: `${457 * scale}px`, height: 'auto' }}
      />

      {/* Mountain flowers — small cluster flush to the right edge, above the mountains */}
      <img
        src={mountainsFlowers}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ right: `${0.3 * scale}px`, bottom: `${226 * scale}px`, width: `${135.3 * scale}px`, height: 'auto' }}
      />

      {/* Clouds — drift left in the bottom-right, anchored to the right edge + scaled */}
      <Clouds scale={scale} />

      {/* Petals from the TREE — spawn across a horizontal plane from the screen's
          left edge to 50px shy of the tree's right edge, fall down + hard right,
          capped at the middle container's left edge. zIndex 2 = BEHIND the cards. */}
      {/* ▸▸ TOP-LEFT knobs:  count = NUMBER of petals,  fall = SPEED (sec/fall, bigger = slower).
           drift fans out: NEGATIVE values drift LEFT (off screen), POSITIVE drift RIGHT.
           cap only limits the RIGHT side (the middle-container edge). */}
      <FallingPetals
        scale={scale} zIndex={2}
        count={12}
        fall={{ min: 18, max: 32 }}
        fadeIn={0.01}
        spawnPoints={TREE_SPAWN_POINTS}
        spawn={{ hAnchor: 'left', vAnchor: 'top' }}
        drift={{ min: -350, max: 560 }}
        cap={{ artboardX: 574, side: 'max' }}
        petalWeights={TREE_WEIGHTS}
        sway={{ min: 8, max: 18 }}
      />

      {/* Petals from the MOUNTAIN FLOWERS — petals 1 & 2 excluded; fall + drift
          aggressively LEFT, capped at x=1155 (~100px past the right-most card's
          midpoint). zIndex 2 = behind the cards. */}
      {/* ▸▸ BOTTOM-RIGHT knobs:  count = NUMBER of petals,  fall = SPEED (sec/fall, bigger = slower). */}
      <FallingPetals
        scale={scale} zIndex={2}
        count={8}
        fall={{ min: 13, max: 23 }}
        fadeIn={0.01}
        spawnPoints={FLOWER_SPAWN_POINTS}
        spawn={{ hAnchor: 'right', vAnchor: 'bottom' }}
        drift={{ min: -450, max: 80 }}
        cap={{ artboardX: 1050, side: 'min' }}
        petalWeights={FLOWER_WEIGHTS}
        sway={{ min: 6, max: 14 }}
      />

      {/* ── CONTENT LAYER — 1440×900 artboard, centered + uniformly scaled ───── */}
      {/* zIndex 10 keeps the name + cards ABOVE the ambient petals (z2). */}
      <div style={{
        position: 'absolute',
        zIndex: 10,
        left: '50%',
        top: '50%',
        width: `${REF_W}px`,
        height: `${REF_H}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
      }}>

        {/* ── NAME ⇄ ABOUT cross-fade (GSAP) ───────────────────────────────────
            Hit area = the 191×399 name box + 50px padding on every side, so the
            hover triggers a little before the cursor reaches the calligraphy.
            On enter a paused GSAP timeline plays: the name dissolves (blur + fade
            + soft expand, receding) while the About lines "come into existence" —
            pulling into focus from a blur and easing forward in scale, in place
            (never sliding in from a direction). mouseleave reverses the timeline.
            pointerEvents are off on the layers so the wrapper alone owns the hover. */}
        <div
          ref={centerRef}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={{ position: 'absolute', left: '50%', top: '199px', transform: 'translateX(-50%)', width: '291px', height: '499px', zIndex: 15 }}
        >
          {/* NAME layer — 50px inset lands it at the artboard center (x=720, top=249) */}
          <div
            className="name-group flex flex-col items-center text-center"
            style={{ position: 'absolute', left: '50px', top: '50px', width: '191px', gap: '6px', pointerEvents: 'none' }}
          >
            {/* "Dustin Zhu" — typed out letter-by-letter (typewriter): each letter
                pops in discretely, left→right, via a staggered opacity. */}
            <p
              className="font-fraunces text-dust"
              style={{ ...fv, fontSize: '28px', fontWeight: 900, lineHeight: 1, letterSpacing: '0.98px', whiteSpace: 'nowrap', margin: 0 }}
            >
              {'Dustin Zhu'.split('').map((ch, i) =>
                ch === ' '
                  ? <span key={i} style={{ display: 'inline-block', width: '0.3em' }} />
                  : <span key={i} className="name-letter"
                      style={{ display: 'inline-block', opacity: introInitialOpacity, willChange: 'opacity' }}>{ch}</span>
              )}
            </p>
            {/* 朱谛 — simple text (Ma Shan Zheng), the two characters stacked and typed
                out one at a time (朱 then 谛) over the same total time as "Dustin Zhu". */}
            <div
              className="font-chinese text-dust"
              style={{ marginTop: '16px', lineHeight: 1.15, letterSpacing: '-1.56px', textAlign: 'center' }}
            >
              {['朱', '谛'].map((ch, i) => (
                <span key={i} className="name-char"
                  style={{ display: 'block', fontSize: '156px', opacity: introInitialOpacity, willChange: 'opacity' }}>{ch}</span>
              ))}
            </div>
          </div>

          {/* ABOUT layer — same 191px center column (Figma x=624, y=290 → 50+41px inset).
              Both paragraphs are split into words sharing ONE diagonal wave, so they read
              as a single body (not two separately-timed blocks). position:absolute makes
              this the offsetParent the wave math measures each word against. */}
          <div style={{ position: 'absolute', left: '50px', top: '91px', width: '191px', display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
            {aboutParas.map((text, i) => (
              <p key={i} className="font-fraunces text-ink"
                style={{ ...fv, fontSize: '14px', lineHeight: 1.5, letterSpacing: '0.14px', margin: 0, width: '100%' }}>
                {text.split(' ').flatMap((w, wi, arr) => {
                  const span = (
                    <span key={`w${wi}`} className="about-word"
                      style={{ display: 'inline-block', opacity: 0, willChange: 'transform, filter, opacity' }}>
                      {w}
                    </span>
                  )
                  return wi < arr.length - 1 ? [span, ' '] : [span]
                })}
              </p>
            ))}
          </div>
        </div>

        {/* Artifact cards — the navigation, arranged as an ascending staircase */}
        {cards.map(({ label, title, subtitle, pattern, href, external, x, y }) => {
          const positioned = { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: 10 }
          const card = <ArtifactCard label={label} title={title} subtitle={subtitle} pattern={pattern} />

          return external ? (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
              style={positioned}
            >
              {card}
            </a>
          ) : (
            <Link
              key={title}
              to={href}
              className="card-link"
              style={positioned}
            >
              {card}
            </Link>
          )
        })}

      </div>
    </div>
  )
}
