import { Link } from 'react-router-dom'
import { fv, PAGE_BG } from '../lib/theme'
import PapyrusTexture from './PapyrusTexture'

import cornerTR   from '../assets/illustration/essayborder-tr.svg'
import cornerTL   from '../assets/illustration/essayborder-tl.svg'
import cornerBL   from '../assets/illustration/essayborder-bl.svg'
import cornerBR   from '../assets/illustration/essayborder-br.svg'
import backButton from '../assets/illustration/backbutton.svg'

// ── FOOTER TAIL ─────────────────────────────────────────────────────────────
// Space below the last paragraph = the gap ABOVE the © line (COPYRIGHT_DROP) +
// the gap BELOW it (the column's paddingBottom). They always sum to FOOTER_TAIL,
// so raising COPYRIGHT_DROP moves the copyright LOWER without changing the total
// page height. ← To nudge the copyright, change COPYRIGHT_DROP only.
const FOOTER_TAIL = 236
const COPYRIGHT_DROP = 160

// ── ESSAY LAYOUT ──────────────────────────────────────────────────────────────
// The shared chrome for both essays: parchment background + papyrus, the home/back
// link, the four corner ornaments, and the centered 900px column with the title /
// author / date header and the copyright footer. Each essay supplies only its own
// `title`, `date`, the back-link `backWord`, and its body as `children`.
export default function EssayLayout({ title, date = '', backWord = 'home', children }) {
  return (
    <div
      className="relative w-full"
      style={{ background: PAGE_BG, overflowX: 'hidden', minHeight: '100dvh' }}
    >
      <PapyrusTexture />

      {/* ── BACK BUTTON ──────────────────────────────────────────────────── */}
      {/* left: calc(50% - 340px - 84px - 10px) — derived from the 680 column. */}
      <Link
        to="/"
        className="absolute z-20"
        style={{
          left: 'calc(50% - 340px - 84px - 10px)',
          top: '150px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
        aria-label="Back to home"
      >
        <img src={backButton} alt="" style={{ display: 'block', opacity: 0.4 }} />
        <span style={{ ...fv, fontFamily: "Fraunces, Georgia, 'Times New Roman', serif", fontSize: '16px', color: '#9a8e7f', opacity: 0.4 }}>{backWord}</span>
      </Link>

      {/* ── CORNER ORNAMENTS ─────────────────────────────────────────────── */}
      {/* Assets exported already oriented for their corner — no rotation.  */}
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
          style={{ ...fv, fontSize: '36px', lineHeight: '1.4', letterSpacing: '0.4px', width: '664px', fontWeight: 400 }}
        >
          {title}
        </h1>

        {/* Author / Date */}
        <div className="font-onest text-center shrink-0 mt-6"
          style={{ fontSize: '15px', lineHeight: '1.6', letterSpacing: '0.05em' }}>
          <p className="text-ink mb-0.5">Dustin Zhu</p>
          <p className="text-dust mb-0">{date}</p>
        </div>

        {children}

        {/* Copyright */}
        <p className="font-onest text-dust text-center shrink-0"
          style={{ fontSize: '13px', letterSpacing: '0.08em', marginTop: `${COPYRIGHT_DROP}px` }}>
          © 2026 Dustin Zhu
        </p>
      </div>
    </div>
  )
}
