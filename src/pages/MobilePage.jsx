import { useState, useEffect } from 'react'
import { fv } from '../lib/theme'
import mobileSky from '../assets/illustration/mobile-sky.svg'
import mobileMountains from '../assets/illustration/mobile-mountains.svg'

// ── MOBILE PLACEHOLDER ────────────────────────────────────────────────────────
// "Best viewed on desktop" screen, shown on narrow viewports. Authored against the
// Figma 390×844 "Mobile" frame and scaled to fit the device as one rigid unit
// (same scale-to-fit trick as the desktop hero), centred, with the airy-white wash
// filling any letterbox — so it's pixel-faithful from an iPhone SE to a Pro Max.
//
// Vertical spacing: mountains sit at their Figma top (554). The text block spans
// 366–478, leaving a 76px gap above the mountains — so the sky is placed with its
// bottom edge 76px above the text (top 119), making the two gaps equidistant.
const FRAME_W = 390
const FRAME_H = 844
const MAX_SCALE = 1.2
const BG = '#fdf9f5'   // airy-white (matches the Figma frame)

// ── POSITION KNOBS (edit these) ───────────────────────────────────────────────
// Both illustrations are centered horizontally and anchored by the edge NEAREST
// the center text. So:
//   • `width` = on-screen size in px (height scales from the SVG's aspect). Grow
//     this to scale the art up — it expands toward the SCREEN EDGE, so the gap to
//     the text stays fixed (sky grows upward, mountains grow downward).
//   • SKY.bottom / MOUNTAINS.top = px from the artboard's top edge — these set the
//     distance to the text (smaller gap = move them closer to the text).
const SKY       = { width: 308, bottom: 281 }   // top illustration — bottom edge sits at y=299
const MOUNTAINS = { width: 308, top: 570 }       // bottom illustration — top edge sits at y=554

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, MAX_SCALE)
}

// Is this an actual computer vs a phone/tablet? Size alone can't tell — a snapped
// desktop window is narrow too. Pointer type can: any precise pointer (mouse/trackpad)
// means a computer (even a touchscreen laptop), while phones/tablets only have a
// coarse pointer. Drives the placeholder's call-to-action (maximize vs visit on desktop).
function isComputer() {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(any-pointer: fine)').matches
}

export default function MobilePage() {
  const [scale, setScale] = useState(computeScale)
  const [onComputer] = useState(isComputer)
  useEffect(() => {
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: `${FRAME_W}px`, height: `${FRAME_H}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
      }}>
        {/* Sky illustration — centered, anchored by its BOTTOM edge (grows upward) */}
        <img src={mobileSky} alt="" aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: `${SKY.bottom}px`, width: `${SKY.width}px`, height: 'auto',
          transform: 'translate(-50%, -100%)', display: 'block',
        }} />

        {/* Center message */}
        <div style={{ position: 'absolute', left: '96px', top: '366px', width: '198px', textAlign: 'center', opacity: 0.9 }}>
          <p className="font-fraunces" style={{ ...fv, margin: 0, fontSize: '24px', fontWeight: 700, lineHeight: 1.25, color: '#5c5347' }}>
            Crafted for a bigger canvas
          </p>
          <p className="font-fraunces" style={{ ...fv, margin: '16px 0 0', fontSize: '17px', fontWeight: 600, lineHeight: 1.3, color: '#9a8e7f' }}>
            {onComputer ? 'Maximize your window for the full experience' : 'Visit on desktop for the full experience'}
          </p>
        </div>

        {/* Mountains illustration — centered, anchored by its TOP edge (grows downward) */}
        <img src={mobileMountains} alt="" aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: `${MOUNTAINS.top}px`, width: `${MOUNTAINS.width}px`, height: 'auto',
          transform: 'translateX(-50%)', display: 'block',
        }} />
      </div>
    </div>
  )
}
