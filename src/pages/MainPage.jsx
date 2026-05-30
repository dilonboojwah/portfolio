import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

// ── ANIMATION KNOBS ──────────────────────────────────────────────────────────
const NAME_START_DELAY = 0.4       // wait this long (s) after the PAGE LOADS before the name starts typing
const NAME_TYPE_TIME = 0.425     // "Dustin Zhu" letters type-IN total (seconds)
const ZHU_IN = 0.175               // 朱 (zhu) entrance — seconds after the name sequence starts
const DI_IN = 0.3              // 谛 (di) entrance — seconds after the name sequence starts
const NAME_OUT_TIME = 0.175     // letters type-OUT total — quicker than the in
const CHAR_OUT_STAGGER = 0.08  // 谛 leaves this many seconds after 朱 on type-OUT
const LETTER_DUR = 0.2        // per-LETTER fade duration for the English name (small = crisp typewriter)
const CHAR_DUR = 0.5          // per-CHARACTER fade duration for 朱谛 (independent from the letters)
const NAME_RETURN_DELAY = 0.45  // wait after mouse-leave before the name retypes in
const WAVE_SPREAD = 0.5        // About diagonal-wave spread (shape, not overall speed)
const HOVER_WAVE_SPEED = 1.15  // hover wave (in) plays this × faster
const ABOUT_OUT_SPEEDUP = 1.3  // About wave-OUT is this × faster than the in

// ── LOCAL ASSETS ──────────────────────────────────────────────────────────────
import papyrusTexture   from '../assets/image/homepage-papyrusfilter.webp'
import blossomTree      from '../assets/illustration/homepage-blossomtree.svg'
import mountains        from '../assets/illustration/homepage-mountains.svg'
import patternChatbot   from '../assets/illustration/homepage-pattern-chatbotcard.svg'
import patternProse     from '../assets/illustration/homepage-pattern-prose.svg'
import patternCulinary  from '../assets/illustration/homepage-pattern-culinary.svg'

// Fraunces variable font axes
const fv = { fontVariationSettings: "'SOFT' 0, 'WONK' 1" }

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
  { label: 'APP',     title: 'Artemis: Career Clarity Engine',                 pattern: patternChatbot,  href: 'https://valuechatbot.dustinzhu.com', external: true,  x: 110,  y: 470 },
  { label: 'PROSE',   title: 'The Evolution of Intelligence', pattern: patternProse,    href: '/essays/evolution',                  external: false, x: 310,  y: 390 },
  { label: 'PROSE',   title: 'Solving Human-AI Coordination', pattern: patternProse,    href: '/essays/coordination',               external: false, x: 980,  y: 210 },
  { label: 'GALLERY', title: 'Culinary Repertoire',           pattern: patternCulinary, href: '/culinary',                          external: false, x: 1180, y: 130 },
]

function ArtifactCard({ label, title, pattern }) {
  return (
    <div style={{
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
      background: 'rgba(255,255,255,0.65)',
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
        <p style={{
          fontFamily: "'Cinzel', serif", fontWeight: 400,
          fontSize: '16px', lineHeight: 1, letterSpacing: '0.4px',
          color: '#b8a97a', textAlign: 'center', whiteSpace: 'nowrap', margin: 0,
        }}>
          {label}
        </p>
        <p className="font-fraunces" style={{
          ...fv,
          fontSize: '20px', lineHeight: 1.25, letterSpacing: '0.13px',
          color: '#5c5347', textAlign: 'right', width: '100%', margin: 0,
        }}>
          {title}
        </p>
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

  // ── About diagonal wave — standalone tweens (overwrite keeps toggling clean) ──
  const ABOUT_IN_DUR = 0.55 / HOVER_WAVE_SPEED
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
      // out: 20% faster, OPPOSITE direction (BR→TL), ease-OUT begins at full speed (no lead-in)
      gsap.to(words,
        { opacity: 0, y: 4, filter: 'blur(3px)', overwrite: 'auto', duration: ABOUT_IN_DUR / ABOUT_OUT_SPEEDUP, ease: 'power2.out',
          stagger: (i, el) => (1 - diag(el)) * ABOUT_IN_SPREAD / ABOUT_OUT_SPEEDUP })
    }
  }

  const handleEnter = () => {
    retypeRef.current?.kill(); retypeRef.current = null
    typeName(false)   // name types OUT (quick)
    aboutWave(true)   // About waves in
  }
  const handleLeave = () => {
    retypeRef.current?.kill()
    aboutWave(false)  // About waves out
    retypeRef.current = gsap.delayedCall(NAME_RETURN_DELAY, () => typeName(true)) // then retype the name
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
      background: 'radial-gradient(ellipse 140% 60% at 50% 0%, #fdfcf9 0%, #faf7f2 100%)',
    }}>

      {/* ── AMBIENT LAYER — viewport-anchored, full-bleed ───────────────────── */}

      {/* Papyrus texture — fills the whole viewport */}
      <img
        src={papyrusTexture}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ mixBlendMode: 'multiply', opacity: 0.25 }}
      />

      {/* Blossom — tangent to LEFT edge; scales with the scene, distance from top scales too */}
      <img
        src={blossomTree}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ left: 0, top: `${43 * scale}px`, width: `${283 * scale}px`, height: 'auto', opacity: 0.65 }}
      />

      {/* Mountains — tangent to RIGHT edge; scales with the scene, distance from bottom scales too */}
      <img
        src={mountains}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ right: 0, bottom: `${23 * scale}px`, width: `${457 * scale}px`, height: 'auto' }}
      />

      {/* ── CONTENT LAYER — 1440×900 artboard, centered + uniformly scaled ───── */}
      <div style={{
        position: 'absolute',
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
            className="flex flex-col items-center text-center"
            style={{ position: 'absolute', left: '50px', top: '50px', width: '191px', gap: '6px', pointerEvents: 'none' }}
          >
            {/* "Dustin Zhu" — typed out letter-by-letter (typewriter): each letter
                pops in discretely, left→right, via a staggered opacity. */}
            <p
              className="font-fraunces"
              style={{ ...fv, fontSize: '28px', fontWeight: 900, lineHeight: 1, letterSpacing: '0.98px', color: '#9a8e7f', whiteSpace: 'nowrap', margin: 0 }}
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
              className="font-chinese"
              style={{ marginTop: '16px', lineHeight: 1.15, letterSpacing: '-1.56px', color: '#9a8e7f', textAlign: 'center' }}
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
              <p key={i} className="font-fraunces"
                style={{ ...fv, fontSize: '14px', lineHeight: 1.5, letterSpacing: '0.14px', color: '#1c1814', margin: 0, width: '100%' }}>
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
        {cards.map(({ label, title, pattern, href, external, x, y }) => {
          const positioned = { position: 'absolute', left: `${x}px`, top: `${y}px`, zIndex: 10 }
          const card = <ArtifactCard label={label} title={title} pattern={pattern} />

          return external ? (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
              style={positioned}
            >
              {card}
            </a>
          ) : (
            <Link
              key={title}
              to={href}
              className="hover:opacity-80 transition-opacity duration-200"
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
