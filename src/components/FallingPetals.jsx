import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import petal1 from '../assets/illustration/fallingflower-1.svg'
import petal2 from '../assets/illustration/fallingflower-2.svg'
import petal3 from '../assets/illustration/fallingflower-3.svg'
import petal4 from '../assets/illustration/fallingflower-4.svg'
import petal5 from '../assets/illustration/fallingflower-5.svg'

const PETAL_SVGS = [petal1, petal2, petal3, petal4, petal5]
const REF_W = 1440, REF_H = 900
const rand = (a, b) => a + Math.random() * (b - a)

// Weighted random petal: weights run parallel to PETAL_SVGS (fallingflower-1..5).
// A weight of 0 excludes that petal entirely.
function weightedPick(weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < PETAL_SVGS.length; i++) { r -= weights[i]; if (r <= 0) return PETAL_SVGS[i] }
  return PETAL_SVGS[PETAL_SVGS.length - 1]
}

// ── FALLING PETALS (configurable emitter) ─────────────────────────────────────
// Petals shed from a spawn region, fall, and drift sideways, capped so they never
// cross a boundary. All geometry is given in Figma 1440×900 artboard coords so it
// scales/anchors like the rest of the scene. Used twice on MainPage (tree + flowers).
//
//   spawn  { ax0, ax1, ay0, ay1, hAnchor:'left'|'right', vAnchor:'top'|'bottom' }
//            the spawn box in artboard coords, anchored to a viewport edge.
//   drift  { min, max }   signed artboard px of horizontal drift (+ = right).
//   cap    { artboardX, side:'max'|'min' } | null
//            a boundary (in the CENTRED content frame) the petal must not cross.
//   sway/fall/scaleRange/maxOpacity/zIndex — feel knobs.
export default function FallingPetals({
  scale, count = 16, spawn, drift, cap = null,
  spawnPoints = null, jitter = 4,          // spawn from real flower points (artboard [x,y]) + a little scatter
  releaseScale = 0.35,                      // "release": petal blooms from this size to full as it detaches
  fadeIn = 0.1, fadeOut = 0.15,             // fraction of the fall spent fading IN (to maxOpacity) / OUT
  petalWeights = [1, 1, 1, 1, 1],
  sway = { min: 8, max: 18 }, fall = { min: 9, max: 16 },
  scaleRange = [0.7, 1.4], maxOpacity = 0.85, zIndex = 5,
}) {
  const ref = useRef(null)
  const petals = useMemo(
    () => Array.from({ length: count }, () => ({ src: weightedPick(petalWeights), s: rand(scaleRange[0], scaleRange[1]) })),
    [count, petalWeights] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const winW = window.innerWidth, winH = window.innerHeight, cx = winW / 2
    // artboard → viewport mapping (ambient-anchored for spawn, centred for the cap)
    const ax2vx = (ax) => spawn.hAnchor === 'left' ? ax * scale : winW - (REF_W - ax) * scale
    const ay2vy = (ay) => spawn.vAnchor === 'top' ? ay * scale : winH - (REF_H - ay) * scale
    const capVX = cap ? cx + (cap.artboardX - REF_W / 2) * scale : null

    const els = ref.current.querySelectorAll('.petal')
    const all = []
    els.forEach((outer) => {
      const inner = outer.querySelector('.petal-spin')
      // Spawn from a real flower point (+ jitter) when given, else from the box.
      let ax, ay
      if (spawnPoints && spawnPoints.length) {
        const [px, py] = spawnPoints[Math.floor(Math.random() * spawnPoints.length)]
        ax = px + rand(-jitter, jitter); ay = py + rand(-jitter, jitter)
      } else {
        ax = rand(spawn.ax0, spawn.ax1); ay = rand(spawn.ay0, spawn.ay1)
      }
      const sx = ax2vx(ax), sy = ay2vy(ay)
      let dx = rand(drift.min, drift.max) * scale
      if (cap) dx = cap.side === 'max' ? Math.min(dx, Math.max(0, capVX - sx))
                                       : Math.max(dx, Math.min(0, capVX - sx))
      const dur = rand(fall.min, fall.max)
      gsap.set(outer, { x: sx, y: sy, opacity: 0, scale: releaseScale })
      const tl = gsap.timeline({ repeat: -1 })
      tl.to(outer, { x: sx + dx, y: winH + 100, ease: 'none', duration: dur }, 0)
      tl.to(outer, { keyframes: { opacity: [0, maxOpacity, maxOpacity, 0], times: [0, fadeIn, 1 - fadeOut, 1] }, ease: 'none', duration: dur }, 0)
      tl.fromTo(outer, { scale: releaseScale }, { scale: 1, ease: 'power1.out', duration: dur * 0.14 }, 0) // bloom/release at the flower
      tl.progress(Math.random())                     // pre-distribute along the fall
      all.push(tl)
      all.push(gsap.to(inner, { x: rand(sway.min, sway.max), rotation: rand(60, 200), duration: rand(2, 4), ease: 'sine.inOut', repeat: -1, yoyo: true }))
    })
    return () => all.forEach((t) => t.kill())
  }, [petals, scale]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex, overflow: 'hidden' }}>
      {petals.map((p, i) => (
        <div key={i} className="petal" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform, opacity' }}>
          <div className="petal-spin" style={{ willChange: 'transform' }}>
            <img src={p.src} alt="" style={{ display: 'block', transform: `scale(${p.s})` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
