import papyrusTexture from '../assets/image/homepage-papyrusfilter.webp'

// ── PAPYRUS TEXTURE ───────────────────────────────────────────────────────────
// The warm paper grain laid over every page. Rendered as a background-image on an
// absolutely-positioned full-bleed layer.
//
// `background-attachment: fixed` pins the texture to the VIEWPORT rather than the
// document. Two payoffs:
//   • On tall, scrolling pages the 1440×900 source is only scaled to viewport size
//     (not stretched to the full document height), so the grain stays fine and
//     crisp instead of ballooning.
//   • The texture holds still while content scrolls over it — a subtle, premium
//     "ink on fixed parchment" feel.
// `multiply` + 0.25 opacity lets the parchment tint show through without muddying
// the text. pointer-events/select are off so it never intercepts interaction.
export default function PapyrusTexture() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        backgroundImage: `url(${papyrusTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
        mixBlendMode: 'multiply',
        opacity: 0.25,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  )
}
