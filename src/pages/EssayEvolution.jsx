import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── ALL LOCAL ASSETS ──────────────────────────────────────────────────────────
import imgArden          from '../assets/illustration/essay-arden.svg'
import timelineNumLeft     from '../assets/illustration/timeline-numonleft.svg'
import timelineOnRight     from '../assets/illustration/timeline-ontheright.svg'
import brushH              from '../assets/illustration/brush-border-horizontal.svg'  // 960×3px
import brushV              from '../assets/illustration/brush-border-vertical.svg'    // 3×360px
import { fv }              from '../lib/theme'
import EssayLayout         from '../components/EssayLayout'

// ── BRUSH BORDER HELPER ───────────────────────────────────────────────────────
// right=true  → vertical brush tiled down the cell's right edge (repeat-y, 360px tall)
// bottom=true → horizontal brush rendered at a fixed 960px wide (no-repeat).
//               Each cell shows a "crop window" into the 960px stroke:
//               xOff is the number of pixels into the stroke to start the window.
//               A NEGATIVE background-position-x achieves this: the image's left
//               edge sits -xOff px from the cell's left, so the visible portion
//               of the cell covers source pixels [xOff … xOff + cellWidth].
//               Different xOff values per row = different part of the stroke per
//               row, so each divider looks like a unique brush mark.
//               Constraint: xOff + maxCellWidth (332px) must be < 960px.
function bb(right, bottom, xOff = 0) {
  const imgs  = [right && `url("${brushV}")`, bottom && `url("${brushH}")`].filter(Boolean)
  if (!imgs.length) return {}
  // Vertical:   repeat-y,  fixed 3px × 360px tile
  // Horizontal: no-repeat, fixed 960px × 3px — negative x positions the crop window
  const rpts  = [right && 'repeat-y',  bottom && 'no-repeat'            ].filter(Boolean)
  const poss  = [right && 'right',     bottom && `${-xOff}px bottom`    ].filter(Boolean)
  const sizes = [right && '3px 360px', bottom && '960px 3px'            ].filter(Boolean)
  return {
    backgroundImage:    imgs.join(', '),
    backgroundRepeat:   rpts.join(', '),
    backgroundPosition: poss.join(', '),
    backgroundSize:     sizes.join(', '),
  }
}

// ── TIMELINE ──────────────────────────────────────────────────────────────────
// 5 entries spaced evenly at 80px row intervals.
// Left entries  (1985, 2012, 2035): numonleft  SVG — circle left, arrow right, year left.
// Right entries (1998, 2026):       ontheright SVG — circle right, arrow left, year right.
function Timeline() {
  const yr = { ...fv, fontSize: '16px', lineHeight: '1.5', letterSpacing: '0.17px', whiteSpace: 'nowrap' }
  const ds = { ...fv, fontSize: '14px', lineHeight: '1.5', letterSpacing: '0.14px' }

  // Each row's base y-coordinate (80px apart gives clean even spacing)
  const Y = [0, 80, 160, 240, 320]

  return (
    <div className="relative shrink-0" style={{ width: '498px', height: '410px' }}>

      {/* ── Layout logic ────────────────────────────────────────────────────
           LEFT entries  (1985, 2012, 2035) — numonleft SVG, circle on left:
             year  at x=52  (text ~44px wide → ends at ~96, gap ~7px to circle)
             arrow at x=103  (circle = left edge of SVG)
             desc  at x=117  (just past circle, same column as right entries)

           RIGHT entries (1998, 2026) — ontheright SVG, circle on right:
             arrow at x=3   (right edge = 230 = circle position)
             year  at x=243  (13px after circle — right side)
             desc  at x=115  (same ~center column as left entries)

           All descriptions share x≈115–117, forming one vertical text spine.
      ── */}

      {/* 1985 — left */}
      <p className="absolute font-fraunces text-aegean m-0"
        style={{ ...yr, left: '52px',  top: `${Y[0]}px` }}>1985</p>
      <img src={timelineNumLeft} alt="" aria-hidden="true" className="absolute pointer-events-none"
        style={{ left: '103px', top: `${Y[0] + 3}px`, width: '227px', height: '16px' }} />
      <p className="absolute font-fraunces text-ink m-0"
        style={{ ...ds, left: '117px', top: `${Y[0] + 22}px`, width: '250px' }}>
        Making computers usable at all
      </p>

      {/* 1998 — right */}
      <p className="absolute font-fraunces text-aegean m-0"
        style={{ ...yr, left: '243px', top: `${Y[1]}px` }}>1998</p>
      <img src={timelineOnRight} alt="" aria-hidden="true" className="absolute pointer-events-none"
        style={{ left: '3px',   top: `${Y[1] + 3}px`, width: '227px', height: '16px' }} />
      <p className="absolute font-fraunces text-ink m-0"
        style={{ ...ds, left: '115px', top: `${Y[1] + 22}px`, width: '317px' }}>
        Turning the internet into commerce and coordination
      </p>

      {/* 2012 — left */}
      <p className="absolute font-fraunces text-aegean m-0"
        style={{ ...yr, left: '52px',  top: `${Y[2]}px` }}>2012</p>
      <img src={timelineNumLeft} alt="" aria-hidden="true" className="absolute pointer-events-none"
        style={{ left: '103px', top: `${Y[2] + 3}px`, width: '227px', height: '16px' }} />
      <p className="absolute font-fraunces text-ink m-0"
        style={{ ...ds, left: '116px', top: `${Y[2] + 22}px`, width: '316px' }}>
        Scaling software into platforms people use everyday
      </p>

      {/* 2026 — right */}
      <p className="absolute font-fraunces text-aegean m-0"
        style={{ ...yr, left: '240px', top: `${Y[3]}px` }}>2026</p>
      <img src={timelineOnRight} alt="" aria-hidden="true" className="absolute pointer-events-none"
        style={{ left: '0px',   top: `${Y[3] + 3}px`, width: '227px', height: '16px' }} />
      <p className="absolute font-fraunces text-ink m-0"
        style={{ ...ds, left: '111px', top: `${Y[3] + 22}px`, width: '317px' }}>
        Turning AI from a cool demo into a reliable operating layer
      </p>

      {/* 2035 — left */}
      <p className="absolute font-fraunces text-aegean m-0"
        style={{ ...yr, left: '52px',  top: `${Y[4]}px` }}>2035</p>
      <img src={timelineNumLeft} alt="" aria-hidden="true" className="absolute pointer-events-none"
        style={{ left: '103px', top: `${Y[4] + 3}px`, width: '227px', height: '16px' }} />
      <p className="absolute font-fraunces text-ink m-0"
        style={{ ...ds, left: '116px', top: `${Y[4] + 22}px`, width: '340px' }}>
        Deciding how human/machine intelligence should be distributed across businesses
      </p>

    </div>
  )
}

// ── TABLE ─────────────────────────────────────────────────────────────────────
// Interior grid lines only — no outer borders on any of the 4 sides.
// Brush texture via CSS background-image rather than CSS border, to avoid
// border-collapse conflicts. bb(right, bottom) controls which edges get a line.
function EvolutionTable() {
  const pad  = { padding: '10px 12px', verticalAlign: 'top' }
  const body = { ...fv, fontSize: '15px', lineHeight: '1.65', letterSpacing: '0.15px', color: '#1c1814' }
  const yr   = { ...fv, fontSize: '16px', fontWeight: 600, color: '#3d6191',
                 textAlign: 'center', verticalAlign: 'middle' }
  const hdr  = { ...fv, fontSize: '16px', fontWeight: 600, letterSpacing: '0.16em',
                 textAlign: 'center', color: '#3d6191', padding: '8px 12px', verticalAlign: 'bottom' }

  // Each row's horizontal-brush x-offset (0–359px).
  // Different values = different phase of the stroke tile per row →
  // no two dividers look the same even though they use the same SVG.
  // Pick values that are spaced well apart so strokes feel unrelated.
  const X = { h: 350, r85: 53, r98: 189, r12: 97, r26: 271 }
  // (2035 is the last row — no bottom brush — offset irrelevant)
  // h=350: header starts mid-stroke to avoid the sparse fade-in at pixel 0.
  // Other rows start at 53–271, all well past the leading edge.
  // Constraint: xOff + 332 (widest cell) < 960. Max here: 350+332=682 ✓

  return (
    <table className="w-full font-fraunces" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ ...hdr, ...bb(true,  true,  X.h),  width: '88px'  }} />
          <th style={{ ...hdr, ...bb(true,  true,  X.h),  width: '200px' }}>BOTTLENECK</th>
          <th style={{ ...hdr, ...bb(true,  true,  X.h),  width: '280px' }}>ARDEN'S EXECUTION</th>
          <th style={{ ...hdr, ...bb(false, true,  X.h)                  }}>EXAMPLE SITUATION</th>
        </tr>
      </thead>
      <tbody>

        {/* 1985 */}
        <tr>
          <td style={{ ...pad, ...yr,   ...bb(true,  true,  X.r85) }}>1985</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r85) }}>Making computers useful inside institutions</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r85) }}>
            Arden sits with finance/ops/marketing to understand a manual process then
            translates it into basic computer logic.
          </td>
          <td style={{ ...pad, ...body, ...bb(false, true,  X.r85) }}>
            <p className="mb-0">Hospitals track records through paper, filing cabinets, and phone calls.</p>
            <p className="mt-3 mb-0">Arden creates a system: inputs, fields, dependencies, exceptions, outputs. She converts everything to logic.</p>
          </td>
        </tr>

        {/* 1998 */}
        <tr>
          <td style={{ ...pad, ...yr,   ...bb(true,  true,  X.r98) }}>1998</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r98) }}>Leveraging the full potential of networks</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r98) }}>
            Arden sees the internet not just as a place to browse pages but also as a
            distribution layer, commerce layer, and coordination layer.
          </td>
          <td style={{ ...pad, ...body, ...bb(false, true,  X.r98) }}>
            <p className="mb-0">Retailers treat websites like a digital brochure.</p>
            <p className="mt-3 mb-0">Arden constructs a world around inventory syncing, payment flows, customer accounts, email capture, etc.</p>
          </td>
        </tr>

        {/* 2012 */}
        <tr>
          <td style={{ ...pad, ...yr,   ...bb(true,  true,  X.r12) }}>2012</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r12) }}>
            <span style={{ color: '#1c1814' }}>Scaling software into systems people use every day </span>
            <span style={{ color: '#5c5347' }}>(internet is now mainstream)</span>
          </td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r12) }}>
            Arden doesn't just ship features; she designs the whole product system around
            retention, data, and scale.
          </td>
          <td style={{ ...pad, ...body, ...bb(false, true,  X.r12) }}>
            <p className="mb-0">A company wants a better app.</p>
            <p className="mt-3 mb-0">Arden thinks about onboarding, APIs, experiments, and retention loops.</p>
          </td>
        </tr>

        {/* 2026 */}
        <tr>
          <td style={{ ...pad, ...yr,   ...bb(true,  true,  X.r26) }}>2026</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r26) }}>Making AI reliable inside workflows</td>
          <td style={{ ...pad, ...body, ...bb(true,  true,  X.r26) }}>
            Arden takes a messy workflow, inserts AI into the right steps, and decides
            where humans still need to step in.
          </td>
          <td style={{ ...pad, ...body, ...bb(false, true,  X.r26) }}>
            <p className="mb-0">A manager says "can we use AI for this?"</p>
            <p className="mt-3 mb-1">Arden asks:</p>
            <ul className="list-disc ml-5 space-y-0.5">
              <li>which part</li>
              <li>with what context</li>
              <li>with what review</li>
              <li>how will we know it's actually better</li>
            </ul>
          </td>
        </tr>

        {/* 2035 — last row, no bottom brush */}
        <tr>
          <td style={{ ...pad, ...yr,   ...bb(true,  false) }}>2035</td>
          <td style={{ ...pad, ...body, ...bb(true,  false) }}>
            <span style={{ color: '#1c1814' }}>Allocating AI across an entire institution </span>
            <span style={{ color: '#9a8e7f' }}>(AI is now mainstream, just like how the internet feels in 2026)</span>
          </td>
          <td style={{ ...pad, ...body, ...bb(true,  false) }}>
            Arden allocates intelligence across the business the way an investor allocates money.
          </td>
          <td style={{ ...pad, ...body, ...bb(false, false) }}>
            <p className="mb-0">A hospital runs 150 agents across intake, billing, coding, and patient comms.</p>
            <p className="mt-3 mb-1">Arden asks:</p>
            <ul className="list-disc ml-5 space-y-0.5">
              <li>what should happen automatically</li>
              <li>what needs approval</li>
              <li>where is human judgment still too important to outsource</li>
            </ul>
          </td>
        </tr>

      </tbody>
    </table>
  )
}

// ── ARDEN BLOCK (animation #3) ────────────────────────────────────────────────
// On scroll into view (once): the caption waves in diagonally top-left → bottom-
// right (same pattern as the homepage bio), and the Arden figure does the name
// "return fade" (opacity + blur clearing). Tune with the knobs below.
const ARDEN_WAVE_DUR    = 0.55  // per-word fade duration in the caption wave
const ARDEN_WAVE_SPREAD = 0.5   // diagonal spread of the wave (bigger = more staggered)
const ARDEN_FIG_FADE    = 1.75   // figure fade-in duration
const ARDEN_FIG_BLUR    = 6     // figure starts this blurred (px), clears to 0
const ARDEN_FIG_DELAY   = 0.3  // wait this long (s) AFTER the text wave starts before the figure begins
const ARDEN_CAPTION = 'Arden will be our fictional exemplar for these time periods'

function ArdenBlock() {
  const rootRef = useRef(null)
  const figRef  = useRef(null)
  useEffect(() => {
    const words = rootRef.current.querySelectorAll('.arden-word')
    const fig   = figRef.current
    gsap.set(words, { opacity: 0, y: 4, filter: 'blur(3px)' })
    gsap.set(fig,   { opacity: 0, filter: `blur(${ARDEN_FIG_BLUR}px)` })
    // Diagonal measure per word (offset within the relatively-positioned caption).
    const maxDiag = Math.max(...[...words].map(el => el.offsetLeft + el.offsetTop), 1)
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(words, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: ARDEN_WAVE_DUR, ease: 'power2.out',
          stagger: (i, el) => ((el.offsetLeft + el.offsetTop) / maxDiag) * ARDEN_WAVE_SPREAD,
        })
        gsap.to(fig, { opacity: 1, filter: 'blur(0px)', duration: ARDEN_FIG_FADE, delay: ARDEN_FIG_DELAY, ease: 'power2.out' })
      },
    })
    return () => st.kill()
  }, [])
  return (
    <div ref={rootRef} className="flex items-center shrink-0 mt-10">
      <p className="font-fraunces text-dust mb-0"
        style={{ ...fv, position: 'relative', fontSize: '15px', lineHeight: '1.6', letterSpacing: '0.15px', width: '240px' }}>
        {ARDEN_CAPTION.split(' ').flatMap((w, wi, arr) => {
          const span = (
            <span key={wi} className="arden-word"
              style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}>{w}</span>
          )
          return wi < arr.length - 1 ? [span, ' '] : [span]
        })}
      </p>
      {/* ↓ GAP between the caption and the Arden figure: edit ml-7 below.      */}
      {/*   Tailwind margin-left scale: ml-2=8px, ml-4=16px, ml-6=24px, ml-8=32px. */}
      <img
        ref={figRef}
        src={imgArden}
        alt="Arden — fictional exemplar"
        className="ml-7"
        style={{ display: 'block', flexShrink: 0, willChange: 'filter, opacity' }}
      />
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function EssayEvolution() {
  const prose680 = { width: '680px' }
  const body16   = { ...fv, fontSize: '16px', lineHeight: '1.75', letterSpacing: '0.17px' }

  return (
    <EssayLayout title="The Evolution of Intelligence" backWord="home">

        {/* Lead paragraph */}
        <p className="font-fraunces text-ink shrink-0 mt-12" style={{ ...body16, ...prose680 }}>
          History's top performers weren't always the smartest people in the room.
          They were just early - early to see bottlenecks, early to position themselves where tech was rewriting rules, early to compound success.
          This has especially been true since 1970.
        </p>

        {/* Bottlenecks label */}
        <p className="font-fraunces text-ink shrink-0 mt-8" style={{ ...body16, ...prose680 }}>
          Tech/operational bottlenecks by time periods:
        </p>

        {/* Zigzag timeline */}
        <div className="mt-8 shrink-0">
          <Timeline />
        </div>

        {/* Pattern paragraph */}
        <p className="font-fraunces text-ink shrink-0 mt-6" style={{ ...body16, ...prose680 }}>
          The common pattern has been: <br />
          {[
            'new technology appears',
            'early users get attention',
            'usage becomes common',
            "prestige moves up a 'layer'",
            'new elite performer designs/scales on top of the tool',
          ].flatMap((phrase, i, arr) => {
            const els = [<span key={`p${i}`} style={{ color: '#3d6191' }}>{phrase}</span>]
            if (i < arr.length - 1) els.push(<span key={`a${i}`} style={{ color: '#c9a84c' }}> → </span>)
            return els
          })}
        </p>

        {/* Section heading */}
        <h2 className="font-fraunces text-ink shrink-0 mt-12"
          style={{ ...fv, fontSize: '26px', lineHeight: '1.4', letterSpacing: '0.24px', width: '680px', fontWeight: 400 }}>
          Evolution Timeline
        </h2>

        {/* Table intro */}
        <p className="font-fraunces text-ink shrink-0 mt-4" style={{ ...body16, ...prose680 }}>
          Below is a deeper dive into what each era looks like:
        </p>

        {/* Arden + caption — wave-in caption + ink/return-fade figure on scroll-in */}
        <ArdenBlock />

        {/* Table — full 900px column width */}
        <div className="shrink-0 w-full mt-12">
          <EvolutionTable />
        </div>

        {/* Section heading */}
        <h2 className="font-fraunces text-ink shrink-0 mt-20"
          style={{ ...fv, fontSize: '26px', lineHeight: '1.4', letterSpacing: '0.24px', width: '680px', fontWeight: 400 }}>
          Closing Thoughts
        </h2>

        {/* Closing content */}
        <div className="font-fraunces text-ink shrink-0 mt-4" style={{ ...body16, ...prose680 }}>
          <p className="mb-1">Every innovation wave changes what society admires:</p>
          <ul className="list-disc ml-6 mb-6">
            <li>The early computer era rewarded people who could operate the machine</li>
            <li>The internet era rewarded people who could build on the network</li>
            <li>The software era rewarded people who could scale platforms</li>
            <li>The AI era rewards people who can direct intelligence</li>
          </ul>
          <p className="mb-0">2026 is about "how do we deploy AI into work".</p>
          <p className="mb-6">2035 will be about "how do we redesign orgs now that intelligence is ambient".</p>
          <p className="mb-0">
            Staying intellectually modern means not attaching yourself to the current tool, but to the
            new bottleneck it creates. The real edge moves upward to the people who can organize, direct,
            and scale what sits on top of them. What matters is not being early to the tool, but early
            to the scarcity it creates.
          </p>
        </div>

    </EssayLayout>
  )
}
