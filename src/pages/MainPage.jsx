import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
  { label: 'APP',     title: 'Value Chatbot',                 pattern: patternChatbot,  href: 'https://valuechatbot.dustinzhu.com', external: true,  x: 110,  y: 470 },
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

export default function MainPage() {
  const scale = useSceneScale()

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

        {/* Name — centered in the artboard (Figma x-center=720, top=249) */}
        <div
          className="absolute flex flex-col items-center text-center"
          style={{ left: '50%', top: '249px', transform: 'translateX(-50%)', gap: '6px', opacity: 1 }}
        >
          <p
            className="font-fraunces"
            style={{ ...fv, fontSize: '28px', fontWeight: 900, lineHeight: 1, letterSpacing: '0.98px', color: '#9a8e7f', whiteSpace: 'nowrap' }}
          >
            Dustin Zhu
          </p>
          {/* 朱谛 — 156px Ma Shan Zheng; width forces the two chars to stack vertically */}
          <p
            className="font-chinese"
            style={{ fontSize: '156px', lineHeight: 1.15, letterSpacing: '-1.56px', color: '#9a8e7f', width: '191px', textAlign: 'center' }}
          >
            朱谛
          </p>
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
