import { useState } from 'react'
import { Link } from 'react-router-dom'

// ── ALL LOCAL ASSETS ──────────────────────────────────────────────────────────
import papyrusTexture from '../assets/image/homepage-papyrusfilter.webp'
import cornerTR       from '../assets/illustration/essayborder-tr.svg'
import cornerTL       from '../assets/illustration/essayborder-tl.svg'
import cornerBL       from '../assets/illustration/essayborder-bl.svg'
import cornerBR       from '../assets/illustration/essayborder-br.svg'
import backButton     from '../assets/illustration/backbutton.svg'

// Fraunces variable font axes
const fv = { fontVariationSettings: "'SOFT' 0, 'WONK' 1" }

// ── FOOTER TAIL ─────────────────────────────────────────────────────────────
// Space below the last paragraph = the gap ABOVE the © line (COPYRIGHT_DROP) +
// the gap BELOW it (the column's paddingBottom). They always sum to FOOTER_TAIL,
// so raising COPYRIGHT_DROP moves the copyright LOWER without changing the total
// page height. ← To nudge the copyright, change COPYRIGHT_DROP only.
const FOOTER_TAIL = 236
const COPYRIGHT_DROP = 160   // was 96 (the old mt-24); +24 = 24px lower

// ── CHEVRON ───────────────────────────────────────────────────────────────────
function ChevronRight({ open }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 13 13" fill="none"
      aria-hidden="true"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.22s ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M4.5 3l4 3.5-4 3.5"
        stroke="#3d6191"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── ACCORDION GROUP ───────────────────────────────────────────────────────────
// First item (index 0) starts expanded by default. No divider lines.
// Chevron on the LEFT of each title.
function AccordionGroup({ items }) {
  const [openSet, setOpenSet] = useState(new Set([0]))
  const toggle = (i) => setOpenSet(prev => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    return next
  })

  const titleSt = { ...fv, fontSize: '16px', fontWeight: 600, letterSpacing: '0.15px', color: '#1c1814' }
  const bodySt  = { ...fv, fontSize: '15px', lineHeight: '1.7', letterSpacing: '0.15px', color: '#1c1814' }

  return (
    <div style={{ width: '100%' }}>
      {items.map((item, i) => {
        const isOpen = openSet.has(i)
        return (
          <div key={i} style={{ marginTop: i === 0 ? '0' : '4px' }}>

            {/* Title row — chevron LEFT */}
            <button
              onClick={() => toggle(i)}
              className="font-fraunces"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 0', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
              }}
            >
              <ChevronRight open={isOpen} />
              <span style={titleSt}>{item.title}</span>
            </button>

            {/* Collapsible body — indented past chevron */}
            {/* grid-template-rows 0fr→1fr animates to exact content height (no snap) */}
            <div style={{
              display: 'grid',
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                overflow: 'hidden',
                paddingLeft: '23px',
                opacity: isOpen ? 1 : 0,
                transition: isOpen ? 'opacity 0.22s ease 0.08s' : 'opacity 0.06s ease 0.19s',
              }}>
                <ul
                  className="list-disc ml-5 font-fraunces space-y-1"
                  style={{ ...bodySt, paddingBottom: '10px' }}
                >
                  {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            </div>

          </div>
        )
      })}
    </div>
  )
}

// ── PILL SEQUENCE ─────────────────────────────────────────────────────────────
// e.g. "map → orchestrate → execute" — Fraunces, aegean words, gold-warm arrows.
// width:100% makes it left-flush within its flex-col parent.
function PillSequence({ pills }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', width: '100%', marginBottom: '16px' }}>
      {pills.flatMap((pill, i) => {
        const els = [
          <span key={`p${i}`} style={{
            ...fv,
            fontFamily: 'Fraunces, serif',
            fontSize: '15px', fontWeight: 400,
            color: '#3d6191',
          }}>
            {pill}
          </span>
        ]
        if (i < pills.length - 1) {
          els.push(
            <span key={`a${i}`} style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '15px', color: '#c9a84c',
            }}>
              →
            </span>
          )
        }
        return els
      })}
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function EssayCoordination() {
  const prose680 = { width: '100%', maxWidth: '680px' }
  const body17   = { ...fv, fontSize: '17px', lineHeight: '1.75', letterSpacing: '0.17px' }
  const body15   = { ...fv, fontSize: '15px', lineHeight: '1.7',  letterSpacing: '0.15px' }

  // "I. Workflow design" labels in Points of Failure — small, dust, centered
  const failureLbl = { ...fv, fontSize: '14px', fontWeight: 400, color: '#9a8e7f', textAlign: 'center' }

  // "I. Workflow design" headings in A Winning Framework — 20px, ink, centered
  const frameworkLbl = { ...fv, fontSize: '20px', fontWeight: 400, color: '#1c1814', textAlign: 'center' }

  // "Create legible workflows" subtitle — Onest, small, light, NOT italic
  const subtitleLbl = {
    fontFamily: 'Onest, sans-serif',
    fontSize: '12px', fontWeight: 400,
    letterSpacing: '0.06em', color: '#b0a695',
    textAlign: 'center',
  }

  return (
    <div
      className="relative w-full"
      style={{
        background: 'radial-gradient(ellipse 140% 60% at 50% 0%, #fdfcf9 0%, #faf7f2 100%)',
        overflowX: 'hidden',
        minHeight: '100dvh',
      }}
    >

      {/* ── PAPYRUS TEXTURE ──────────────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: 0, right: 0, bottom: 0, left: 0,
          backgroundImage: `url(${papyrusTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
          mixBlendMode: 'multiply',
          opacity: 0.25,
        }}
      />

      {/* ── BACK BUTTON ──────────────────────────────────────────────────── */}
      {/* top: 100px — above content (starts at 200px), below corner tip     */}
      <Link
        to="/"
        className="absolute z-20 hover:opacity-60 transition-opacity duration-200"
        style={{
          left: 'calc(50% - 340px - 84px - 10px)',
          top: '150px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
        aria-label="Back to home"
      >
        {/* Icon-only SVG; the word is interchangeable text (change "back" → "home") */}
        <img src={backButton} alt="" style={{ display: 'block', opacity: 0.4 }} />
        <span style={{ ...fv, fontFamily: 'Fraunces, serif', fontSize: '17px', color: '#9a8e7f', opacity: 0.4 }}>back</span>
      </Link>

      {/* ── CORNER ORNAMENTS ─────────────────────────────────────────────── */}
      <div className="absolute pointer-events-none select-none"
        style={{ right: '39.6px', top: '27px', width: '238px', height: '229px' }}>
        <img src={cornerTR} alt="" className="w-full h-full" />
      </div>
      <div className="absolute pointer-events-none select-none"
        style={{ left: '39px', top: '27px', width: '236px', height: '232px' }}>
        <img src={cornerTL} alt="" className="w-full h-full" />
      </div>
      <div className="absolute pointer-events-none select-none"
        style={{ right: '39px', bottom: '28px', width: '236px', height: '232px' }}>
        <img src={cornerBR} alt="" className="w-full h-full" />
      </div>
      <div className="absolute pointer-events-none select-none"
        style={{ left: '39px', bottom: '30px', width: '239px', height: '229px' }}>
        <img src={cornerBL} alt="" className="w-full h-full" />
      </div>

      {/* ── ESSAY BODY COLUMN ────────────────────────────────────────────── */}
      <div
        className="relative mx-auto flex flex-col items-center"
        style={{ width: '100%', maxWidth: '900px', paddingTop: '200px', paddingBottom: `${FOOTER_TAIL - COPYRIGHT_DROP}px` }}
      >

        {/* Title */}
        <h1
          className="font-fraunces text-ink text-center shrink-0"
          style={{ ...fv, fontSize: '40px', lineHeight: '1.4', letterSpacing: '0.4px', width: '664px', fontWeight: 400 }}
        >
          Solving Human-AI Coordination
        </h1>

        {/* Author / Date */}
        <div className="font-onest text-center shrink-0 mt-6"
          style={{ fontSize: '15px', lineHeight: '1.6', letterSpacing: '0.05em' }}>
          <p className="text-ink mb-0.5">Dustin Zhu</p>
          <p className="text-dust mb-0">June 11, 2026</p>
        </div>

        {/* Intro 1 */}
        <p className="font-fraunces text-ink shrink-0 mt-12" style={{ ...body17, ...prose680 }}>
          Every month major labs release models that are cheaper, higher quality, and more reliable.
          As intelligence gets commoditized, the moat becomes human-AI coordination.
        </p>

        {/* Intro 2 */}
        <p className="font-fraunces text-ink shrink-0 mt-5" style={{ ...body17, ...prose680 }}>
          Most companies will fall short for a simple reason: they do not define what good work looks
          like, preserve context, or measure outputs.
        </p>

        {/* ══════════════════════════════════════════════════════════════════
            POINTS OF FAILURE
        ══════════════════════════════════════════════════════════════════ */}
        <h2 className="font-fraunces text-ink shrink-0 mt-12"
          style={{ ...fv, fontSize: '26px', lineHeight: '1.4', letterSpacing: '0.24px', width: '680px', fontWeight: 400 }}>
          Points of Failure
        </h2>

        <p className="font-fraunces text-ink shrink-0 mt-4" style={{ ...body17, ...prose680 }}>
          With AI widespread now, an org is susceptible to 3 points of failure.
        </p>

        {/* I. Workflow design */}
        <div className="shrink-0 mt-10" style={prose680}>
          <p className="font-fraunces mb-8" style={frameworkLbl}>I. Workflow design</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <ul className="list-disc ml-14 font-fraunces" style={body15}>
              <li>
                They don't understand/map their workflows at the level required for automation (in most cases it's not visually documented)
              </li>
            </ul>
            <ul className="list-disc ml-14 font-fraunces" style={body15}>
              <li>Executives can name departments/job titles but not decision points, failure states, exception handling, handoff logic</li>
            </ul>
          </div>
        </div>

        {/* II. Context quality */}
        <div className="shrink-0 mt-10" style={prose680}>
          <p className="font-fraunces mb-8" style={frameworkLbl}>II. Context quality</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <ul className="list-disc ml-14 font-fraunces" style={body15}>
              <li>Most firms have weak context architecture. The knowledge lives in Slack, scattered docs, tribal memory, outdated SOPs</li>
            </ul>
            <ul className="list-disc ml-14 font-fraunces" style={body15}>
              <li>Without structured context, models don't have a foundational base to learn from and produce relevant responses</li>
            </ul>
          </div>
          <p className="font-fraunces text-center mt-5"
            style={{ ...fv, fontSize: '15px', color: '#9a8e7f' }}>
            garbage in... garbage out...
          </p>
        </div>

        {/* III. Evaluation */}
        <div className="shrink-0 mt-10" style={prose680}>
          <p className="font-fraunces mb-8" style={frameworkLbl}>III. Evaluation</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <ul className="list-disc ml-14 font-fraunces" style={body15}>
              <li>Most firms don't have explicit definitions of "good"; they rely on senior people "just knowing" if something feels right</li>
            </ul>
            <ul className="list-disc ml-4 font-fraunces" style={body15}>
              <li>This leads to non-standardized and inconsistent output, with or without AI</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            A WINNING FRAMEWORK
        ══════════════════════════════════════════════════════════════════ */}
        <h2 className="font-fraunces text-ink shrink-0 mt-12"
          style={{ ...fv, fontSize: '26px', lineHeight: '1.4', letterSpacing: '0.24px', width: '680px', fontWeight: 400 }}>
          A Winning Framework
        </h2>

        {/* I. Workflow design */}
        <div className="shrink-0 mt-8 flex flex-col items-center" style={prose680}>
          <p className="font-fraunces mb-2" style={frameworkLbl}>I. Workflow design</p>
          <p className="mb-6" style={subtitleLbl}>Create legible workflows</p>
          <PillSequence pills={['map', 'orchestrate', 'execute']} />
          <AccordionGroup items={[
            {
              title: 'Map',
              bullets: [
                'Trigger → inputs → decision points → outputs → exception paths → final owner',
                'Each step is deterministic (rules/API/database lookup), shows where judgment can be outsourced (model), and where exceptions have to be handled (human)',
                'Possible tool: Miro',
              ],
            },
            {
              title: 'Orchestrate',
              bullets: [
                'Write orchestration logic using code to turn the map into a backend workflow graph/state machine',
                'Possible tool: LangGraph + Python backend',
              ],
            },
            {
              title: 'Execute',
              bullets: [
                'Run orchestration logic against live inputs',
              ],
            },
          ]} />
        </div>

        {/* II. Context quality */}
        <div className="shrink-0 mt-10 flex flex-col items-center" style={prose680}>
          <p className="font-fraunces mb-2" style={frameworkLbl}>II. Context quality</p>
          <p className="mb-6" style={subtitleLbl}>Create content systems</p>
          <PillSequence pills={['harvest', 'normalize', 'approve', 'publish']} />
          <AccordionGroup items={[
            {
              title: 'Harvest',
              bullets: [
                'Pull content from source systems: docs, Slack, Notion, CRM, tickets, SME interviews',
              ],
            },
            {
              title: 'Normalize',
              bullets: [
                'Use canonical format: policies, entities, process rules, examples/precedents, definitions',
              ],
            },
            {
              title: 'Approve',
              bullets: [
                'Assign an owner for each content domain',
              ],
            },
            {
              title: 'Publish',
              bullets: [
                'Publish content using a document store like Amazon S3 for raw docs + DB like Postgres for structured truth + retrieval layer like pgvector',
              ],
            },
          ]} />
        </div>

        {/* III. Evaluation */}
        <div className="shrink-0 mt-10 flex flex-col items-center" style={prose680}>
          <p className="font-fraunces mb-2" style={frameworkLbl}>III. Evaluation</p>
          <p className="mb-6" style={subtitleLbl}>Monitor performance</p>
          <PillSequence pills={['define', 'test', 'monitor']} />
          <AccordionGroup items={[
            {
              title: 'Define',
              bullets: [
                'Build an eval set of representative tasks',
                'Define "good" (correctness, completeness, policy compliance, cost/latency)',
              ],
            },
            {
              title: 'Test',
              bullets: [
                'Run offline evals before release',
                'Run online monitoring after release (success rate, handoff rate, error categories, cost/latency)',
                'Can use LangSmith',
              ],
            },
            {
              title: 'Monitor',
              bullets: [
                'Follow escalation paths: detect → route → resolve → improve',
                'Define escalation triggers (low confidence, missing context, policy-sensitive case)',
                'Route by tier: 0: model retries, 1: frontline human reviewer, 2: domain owner, 3: function head',
                'Require every escalation end with resolution, root-cause tag, system fix',
              ],
            },
          ]} />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CLOSING THOUGHTS
        ══════════════════════════════════════════════════════════════════ */}
        <h2 className="font-fraunces text-ink shrink-0 mt-16"
          style={{ ...fv, fontSize: '26px', lineHeight: '1.4', letterSpacing: '0.24px', width: '680px', fontWeight: 400 }}>
          Closing Thoughts
        </h2>

        <div className="font-fraunces text-ink shrink-0 mt-4" style={{ ...body17, ...prose680 }}>
          <p className="mb-5">
            Human-AI coordination fails when firms cannot make work legible. A company needs clear
            task boundaries, explicit context, measurable outcomes, and named ownership.
          </p>
          <p className="mb-1">Without clarity on those things, orgs will either:</p>
          <ul className="list-disc ml-6 mb-5">
            <li>Over-automate and create chaos</li>
            <li>Under-automate and create stagnation</li>
          </ul>
          <p className="mb-0">
            Now, it's less so about access to intelligence and more about how to orchestrate around it.
          </p>
        </div>

        {/* Copyright */}
        <p className="font-onest text-dust text-center shrink-0"
          style={{ fontSize: '13px', letterSpacing: '0.08em', marginTop: `${COPYRIGHT_DROP}px` }}>
          © 2026 Dustin Zhu
        </p>

      </div>
    </div>
  )
}
