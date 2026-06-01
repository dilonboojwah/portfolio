import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { fv, PAGE_BG } from '../lib/theme'

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
const NAME_START_DELAY = 0.4    // pause after the page loads before the name starts appearing
const NAME_TYPE_TIME   = 0.5    // spread: total window for all 9 English letters to start typing in
const LETTER_DUR       = 0.3    // how long EACH English letter takes to fade in (also reused on type-out)
const ZHU_IN           = 0.125  // entrance time of 朱 — seconds after the name sequence starts
const DI_IN            = 0.3    // entrance time of 谛 — seconds after the name sequence starts
const CHAR_DUR         = 0.5    // how long EACH Chinese character takes to fade (also reused on type-out)

// ▸ 2. TYPE-OUT — plays when the cursor ENTERS the center (name leaves so the bio
//      can arrive). Deliberately quicker than the type-in.
const NAME_OUT_TIME    = 0.175  // spread: total window for the 9 letters to fade back out
const CHAR_OUT_STAGGER = 0.08   // gap between 朱 leaving and 谛 leaving on the way out

// ▸ 3. RETURN FADE — plays when the cursor LEAVES the center. This is NOT the
//      typewriter: the whole name fades in together while drifting forward
//      (scale-up + blur→sharp), so it reads as coming "from behind".
const NAME_RETURN_DELAY = 0.4  // pause after the cursor leaves before the name comes back
const NAME_RETURN_FADE  = 1   // how long the whole-name fade-in takes
const NAME_RETURN_SCALE = 1   // starting size (smaller = starts further "behind"); grows to 1.0

// ▸ 4. ABOUT BIO WAVE — the hidden bio text that waves in (on hover) and out
//      (on leave) diagonally, top-left → bottom-right.
const ABOUT_IN_BASE     = 0.55  // base fade duration for each word as it waves in
const WAVE_SPREAD       = 0.5   // diagonal spread: bigger = longer gap between the first (top-left) and last (bottom-right) word
const HOVER_WAVE_SPEED  = 1.15  // overall speed of the wave-IN — bigger = faster (divides both the duration AND the spread)
const ABOUT_OUT_SPEEDUP = 1.15   // the wave-OUT is this many × faster than the wave-in

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
// scale = min(vw/1440, vh/900), capped at 1.1 so it never balloons on large
// monitors (scaling down is safe; uncapped scale-up looks blown-up).
const REF_W = 1440
const REF_H = 900
const MAX_SCALE = 1.1

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
  'This portfolio represents an intersection of design <> technology.',
  'I grew up in upstate New York and have lived in NYC and SF. My favorite food is Nutella and I wish to live in Norway one day.',
]

export default function MainPage() {
  const scale = useSceneScale()
  const centerRef = useRef(null)   // hover hit-area (scopes the GSAP selectors)
  const retypeRef = useRef(null)   // cancellable timer that retypes the name on mouse-leave

  // ── Name typewriter ──────────────────────────────────────────────────────────
  // Both groups fire together, so "Dustin Zhu" and 朱谛 start at the same instant.
  // Letters type IN over NAME_TYPE_TIME; 朱 and 谛 each enter at their own time (ZHU_IN / DI_IN).
  // type-OUT (on hover) is quicker. Standalone tweens with overwrite:'auto' so rapid
  // hover toggling just redirects — no stacking.
  const typeName = (show, delay = 0) => {
    const letters = gsap.utils.toArray('.name-letter')
    const chars   = gsap.utils.toArray('.name-char')
    const base = { ease: 'none', overwrite: 'auto', delay }   // delay = wait before this run starts
    if (show) {
      gsap.fromTo(letters, { opacity: 0 }, { opacity: 1, ...base, duration: LETTER_DUR, stagger: { amount: NAME_TYPE_TIME } })
      gsap.fromTo(chars,   { opacity: 0 }, { opacity: 1, ...base, duration: CHAR_DUR, stagger: (i) => (i === 0 ? ZHU_IN : DI_IN) })
    } else {
      gsap.to(letters, { opacity: 0, ...base, duration: LETTER_DUR, stagger: { amount: NAME_OUT_TIME } })
      gsap.to(chars,   { opacity: 0, ...base, duration: CHAR_DUR, stagger: { amount: CHAR_OUT_STAGGER } })
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
      gsap.fromTo(group,
        { scale: NAME_RETURN_SCALE, filter: 'blur(6px)' },
        { scale: 1, filter: 'blur(0px)', transformOrigin: 'center center',
          overwrite: 'auto', delay, duration: NAME_RETURN_FADE, ease: 'power2.out' })
    }
  }

  // ── About diagonal wave — standalone tweens (overwrite keeps toggling clean) ──
  const ABOUT_IN_DUR = ABOUT_IN_BASE / HOVER_WAVE_SPEED
  const ABOUT_IN_SPREAD = WAVE_SPREAD / HOVER_WAVE_SPEED
  const aboutWave = (show) => {
    const words = gsap.utils.toArray('.about-word')
    if (!words.length) return
    const maxDiag = Math.max(...words.map(el => el.offsetLeft + el.offsetTop), 1)
    const diag = (el) => (el.offsetLeft + el.offsetTop) / maxDiag
    if (show) {
      gsap.fromTo(words,
        { opacity: 0, y: 4, filter: 'blur(3px)' },
        { opacity: 0.9, y: 0, filter: 'blur(0px)', overwrite: 'auto', duration: ABOUT_IN_DUR, ease: 'power2.out',
          stagger: (i, el) => diag(el) * ABOUT_IN_SPREAD })
    } else {
      // ▸ FIX A: stop every in-progress fade-IN the instant the cursor leaves. Without
      //   this, the staggered out-delays let some words keep blooming into view AFTER
      //   you've already left (the stray-text glitch). Now they freeze, then fade down.
      gsap.killTweensOf(words)
      // out: faster, SAME diagonal direction as the in (TL→BR), ease-OUT begins at full speed (no lead-in)
      gsap.to(words,
        { opacity: 0, y: 4, filter: 'blur(3px)', overwrite: 'auto', duration: ABOUT_IN_DUR / ABOUT_OUT_SPEEDUP, ease: 'power2.out',
          stagger: (i, el) => diag(el) * ABOUT_IN_SPREAD / ABOUT_OUT_SPEEDUP })
    }
  }

  const handleEnter = () => {
    retypeRef.current?.kill(); retypeRef.current = null
    typeName(false)   // name types OUT (quick)
    aboutWave(true)   // About waves in
  }
  const handleLeave = () => {
    retypeRef.current?.kill()
    aboutWave(false)  // About waves out (Fix A: in-tweens killed, so nothing blooms after leaving)
    retypeRef.current = gsap.delayedCall(NAME_RETURN_DELAY, () => {
      // ▸ FIX B: guarantee the bio is GONE before the name reappears. killTweensOf first
      //   so even the last (bottom-right "in") word — which has the longest stagger delay
      //   and could otherwise slip through — is stopped, then uniformly fade all to 0.
      const words = gsap.utils.toArray('.about-word')
      gsap.killTweensOf(words)
      gsap.to(words, { opacity: 0, duration: 0.2 })
      nameFadeIn()
    })
  }

  // First visit — type the name in. GSAP pauses/resumes its own ticker with tab
  // visibility, so a hidden/refocused tab resumes cleanly. No manual visibility
  // handling (that's exactly what was skipping the intro + causing the glitches).
  useEffect(() => {
    const ctx = gsap.context(() => { typeName(true, NAME_START_DELAY) }, centerRef)
    return () => { retypeRef.current?.kill(); ctx.revert() }
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
                      style={{ display: 'inline-block', opacity: 0, willChange: 'opacity' }}>{ch}</span>
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
                  style={{ display: 'block', fontSize: '156px', opacity: 0, willChange: 'opacity' }}>{ch}</span>
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
              className="hover:scale-[1.04] transition-transform duration-200 ease-out"
              style={positioned}
            >
              {card}
            </a>
          ) : (
            <Link
              key={title}
              to={href}
              className="hover:scale-[1.04] transition-transform duration-200 ease-out"
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
