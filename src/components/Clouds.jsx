import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import cloud1 from '../assets/illustration/homepage-cloud-1.svg'
import cloud2 from '../assets/illustration/homepage-cloud-2.svg'
import cloud3 from '../assets/illustration/homepage-cloud-3.svg'
import cloud4 from '../assets/illustration/homepage-cloud-4.svg'

// ── CLOUDS ────────────────────────────────────────────────────────────────────
// Four clouds in the bottom-right that drift slowly LEFT, then loop. Positions
// (w/h, vertical height, and the drift band) are taken from the Figma 1440×900
// artboard, and anchored to the viewport's BOTTOM-RIGHT + scaled by the scene
// factor — same "ambient layer" rule the blossom/mountains follow, so they track
// the right edge at any size. Each cloud fades OUT at the left edge of the band
// and fades back IN at the right edge, which hides the wrap so the loop is seamless.
//
// Drift band, in artboard-x:
const ARTBOARD_W = 1440
const BAND_LEFT  = 983     // cloud-1's left edge  → exit / fade-out  (← knob)
const BAND_RIGHT = 1400  // rightmost cloud (cloud-2) right edge → entry / fade-in (← knob)

// Per cloud: art + width + vertical anchor (px from artboard bottom) + cross time
// (seconds to traverse the band; different per cloud = different speeds).
const CLOUDS = [
  { src: cloud4, w: 197.5, bottom: 161.5, cross: 96 },
  { src: cloud3, w: 105.6, bottom: 203.1, cross: 80 },
  { src: cloud1, w: 96.5,  bottom: 133.1, cross: 72 },
  { src: cloud2, w: 59.0,  bottom: 214.9, cross: 56 },
]

export default function Clouds({ scale }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const els = ref.current.querySelectorAll('.cloud')
    const tls = []
    els.forEach((el, i) => {
      const c = CLOUDS[i]
      // Travel so the cloud's LEFT edge (not its right edge) lands exactly on
      // BAND_LEFT as it finishes fading — so no visible pixel ever crosses it.
      const travel = Math.max(0, (BAND_RIGHT - BAND_LEFT) - c.w) * scale
      const tl = gsap.timeline({ repeat: -1 })
      tl.fromTo(el, { x: 0 }, { x: -travel, ease: 'none', duration: c.cross }, 0)
      tl.to(el, { keyframes: { opacity: [0, 0.8, 0.8, 0], times: [0, 0.12, 0.88, 1] }, ease: 'none', duration: c.cross }, 0)
      tl.progress(i / els.length)        // spread the clouds across the band initially
      tls.push(tl)
    })
    return () => tls.forEach(t => t.kill())
  }, [scale])

  return (
    <div ref={ref} aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {CLOUDS.map((c, i) => (
        <img key={i} className="cloud" src={c.src} alt="" style={{
          position: 'absolute',
          right: `${(ARTBOARD_W - BAND_RIGHT) * scale}px`,   // right edge sits at BAND_RIGHT when x=0
          bottom: `${c.bottom * scale}px`,
          width: `${c.w * scale}px`, height: 'auto',
          opacity: 0, pointerEvents: 'none', userSelect: 'none', willChange: 'transform, opacity',
        }} />
      ))}
    </div>
  )
}
