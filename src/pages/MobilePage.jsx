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
// Coordinates are inside the 390×844 artboard: x = px from the LEFT edge, y = px
// from the TOP edge, width = px (height scales automatically from the SVG's own
// aspect ratio). Bigger y = lower on screen; bigger x = further right.
const SKY       = { x: 55, y: 119, width: 280 }   // sun + name + clouds + crane (top)
const MOUNTAINS = { x: 55, y: 554, width: 280 }   // bottom scenery

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, MAX_SCALE)
}

export default function MobilePage() {
  const [scale, setScale] = useState(computeScale)
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
        {/* Sky illustration (sun + name + clouds + crane) */}
        <img src={mobileSky} alt="" aria-hidden="true" style={{
          position: 'absolute', left: `${SKY.x}px`, top: `${SKY.y}px`, width: `${SKY.width}px`, height: 'auto', display: 'block',
        }} />

        {/* Center message */}
        <div style={{ position: 'absolute', left: '96px', top: '366px', width: '198px', textAlign: 'center', opacity: 0.9 }}>
          <p className="font-fraunces" style={{ ...fv, margin: 0, fontSize: '22px', fontWeight: 700, lineHeight: 1.25, color: '#5c5347' }}>
            Crafted for a bigger canvas
          </p>
          <p className="font-fraunces" style={{ ...fv, margin: '14px 0 0', fontSize: '17px', fontWeight: 600, lineHeight: 1.3, color: '#9a8e7f' }}>
            Visit on desktop for the full experience
          </p>
        </div>

        {/* Mountains illustration (Figma position) */}
        <img src={mobileMountains} alt="" aria-hidden="true" style={{
          position: 'absolute', left: `${MOUNTAINS.x}px`, top: `${MOUNTAINS.y}px`, width: `${MOUNTAINS.width}px`, height: 'auto', display: 'block',
        }} />
      </div>
    </div>
  )
}
