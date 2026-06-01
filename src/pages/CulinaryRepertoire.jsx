import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fv, PAGE_BG } from '../lib/theme'
import PapyrusTexture from '../components/PapyrusTexture'

gsap.registerPlugin(ScrollTrigger)

// ── ILLUSTRATIONS ─────────────────────────────────────────────────────────────
import flowerCornerTL   from '../assets/illustration/culinaryrep-flowers-corner-tl.svg'
import flowerCornerBR   from '../assets/illustration/culinaryrep-flowers-corner-br.svg'
import flowerCornerBL   from '../assets/illustration/culinaryrep-flowers-corner-bl.svg'
import flowerRight1     from '../assets/illustration/culinaryrep-flowers-rightside-1.svg'
import flowerRight2     from '../assets/illustration/culinaryrep-flowers-rightside-2.svg'
import flowerRight5     from '../assets/illustration/culinaryrep-flowers-rightside-5.svg'
import flowerLeft3      from '../assets/illustration/culinaryrep-flowers-leftside-3.svg'
import flowerLeft4      from '../assets/illustration/culinaryrep-flowers-leftside-4.svg'
import titleUnderline   from '../assets/illustration/culinaryrep-titleunderline.svg'
import dividerdotsRaw   from '../assets/illustration/culinaryrep-dividerdots.svg?raw'
import menuUnderline    from '../assets/illustration/cookingpage-menuunderline.svg'
import archiveVertBorder from '../assets/illustration/culinaryrep-archive-verticalborder.svg'
import backButton       from '../assets/illustration/backbutton-culinary.svg'
import hoveredL        from '../assets/illustration/culinaryrep-gallery-l-hovered.svg'
import hoveredML       from '../assets/illustration/culinaryrep-gallery-ml-hovered.svg'
import hoveredM        from '../assets/illustration/culinaryrep-gallery-m-hovered.svg'
import hoveredMR       from '../assets/illustration/culinaryrep-gallery-mr-hovered.svg'
import hoveredR        from '../assets/illustration/culinaryrep-gallery-r-hovered.svg'

// ── PHOTOS ───────────────────────────────────────────────────────────────────
import photoEthos       from '../assets/image/culinaryrep-personalbartending.webp'
import galleryL         from '../assets/image/culinaryrep-gallery-l.webp'
import galleryML        from '../assets/image/culinaryrep-gallery-ml.webp'
import galleryM         from '../assets/image/culinaryrep-gallery-m.webp'
import galleryMR        from '../assets/image/culinaryrep-gallery-mr.webp'
import galleryR         from '../assets/image/culinaryrep-gallery-r.webp'
import photoWeeknight   from '../assets/image/culinaryrep-weeknightindulgance.webp'
import photoSpaghetti   from '../assets/image/culinaryrep-spaghetti.webp'
import photoSupperclub  from '../assets/image/culinaryrep-supperclub.webp'
import photoFranceAsia  from '../assets/image/culinaryrep-franceamericaseasia.webp'
import photoFriendsBday from '../assets/image/culinaryrep-friendsbday.webp'

// ── FONT SHORTHANDS ───────────────────────────────────────────────────────────
// fv (Fraunces axes) is shared site-wide via ../lib/theme. cinzel + fell are
// only used on this page, so they stay local.
const cinzel = { fontFamily: "Cinzel, 'Trajan Pro', 'Times New Roman', serif", fontWeight: 400 }
const fell   = { fontFamily: "'IM Fell English', Georgia, 'Times New Roman', serif", fontStyle: 'normal' }

// ── DIVIDER DOTS ──────────────────────────────────────────────────────────────
// Three stacked dots. Inlined (via the raw SVG) instead of an <img> so each dot is
// its own targetable <g>. On scroll into view the dots fade in TOP→BOTTOM in quick
// succession, ONCE per visit (won't replay on scroll-up; a refresh remounts + replays).
//   • DOTS_FADE   = how long each dot takes to fade in
//   • DOTS_STAGGER = gap between consecutive dots (bigger = more "one after another")
const DOTS_FADE = 0.22
const DOTS_STAGGER = 0.13
function DividerDots() {
  const ref = useRef(null)
  useEffect(() => {
    const groups = ref.current?.querySelectorAll('g')
    if (!groups?.length) return
    gsap.set(groups, { opacity: 0 })                       // start hidden
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 88%',                                    // fire when the dots are ~12% up from the bottom
      once: true,
      onEnter: () => gsap.to(groups, { opacity: 0.4, duration: DOTS_FADE, stagger: DOTS_STAGGER, ease: 'power1.out' }),
    })
    return () => st.kill()
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ width: '17px', height: '88px', margin: '24px 0', pointerEvents: 'none', userSelect: 'none' }}
      dangerouslySetInnerHTML={{ __html: dividerdotsRaw }}
    />
  )
}

// ── ARCHIVE PHOTO ─────────────────────────────────────────────────────────────
// Photo with a small caption centered below it
// `speed` drives the parallax: as the archive scrolls through the viewport, the
// photo + its caption drift vertically by ±speed px (the drift is 0 at the centre,
// so the rows line up when the section is centred on screen). Photos in the SAME
// ROW share a speed so the row stays horizontally aligned; the two rows use
// DIFFERENT speeds — that difference is the parallax you see between them.
// ← Tune the two row speeds in the JSX below (keep each row's values equal).
function ArchivePhoto({ src, caption, w, h, speed = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!speed) return
    const el = ref.current
    const tw = gsap.fromTo(el, { y: speed }, {
      y: -speed, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    return () => { if (tw.scrollTrigger) tw.scrollTrigger.kill(); tw.kill() }
  }, [speed])
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: `${w}px`, height: `${h}px`, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={src}
          alt={caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
        />
      </div>
      <p className="text-stone" style={{
        ...fell,
        fontSize: '14px',
        lineHeight: '1.5',
        letterSpacing: '0.14px',
        textAlign: 'center',
        width: `${w}px`,
        margin: 0,
      }}>
        {caption}
      </p>
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function CulinaryRepertoire() {
  const [hoveredCard, setHoveredCard] = useState(null)
  return (
    // Single full-width wrapper — same pattern as essay pages.
    // No fixed 1440px frame; content column centers itself via margin:auto.
    // Decorative elements use calc(50% ± X) so they track the content center
    // at any viewport width (1440px laptop AND wider monitors).
    <div style={{
      position: 'relative',
      width: '100%',
      overflowX: 'hidden',
      background: PAGE_BG,
    }}>

      {/* ── Papyrus texture (shared component, viewport-fixed) ── */}
      <PapyrusTexture />

        {/* ── Corner flowers ─────────────────────────────────────────────────── */}
        {/* Flattened SVGs — no CSS transforms, no forced resize, just pixel placement */}
        {/* TL: origin at (0,0) of page frame per Figma */}
        <img src={flowerCornerTL} alt="" aria-hidden="true" style={{
          position: 'absolute', left: 0, top: 0,
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />
        {/* BR: hugs bottom-right corner */}
        <img src={flowerCornerBR} alt="" aria-hidden="true" style={{
          position: 'absolute', right: 0, bottom: 0,
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />
        {/* BL: hugs bottom-left corner */}
        <img src={flowerCornerBL} alt="" aria-hidden="true" style={{
          position: 'absolute', left: 0, bottom: 0,
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

        {/* ── Side flowers — absolute pixel placement, no CSS transforms ────────── */}
        {/* SVGs are flattened; rotation/flip already baked into paths.              */}
        {/* Y values from Figma directly. X values derived from Figma inset math.   */}

        {/* ── Side flowers — edge-anchored, same logic as corner flowers ──────── */}
        {/* right: X  = X px from viewport's right edge (negative = slightly outside) */}
        {/* left:  X  = X px from viewport's left  edge (negative = slightly outside) */}
        {/* Values come from each flower's distance to the frame edge in Figma's      */}
        {/* 1440px design: right_edge_of_flower - 1440 = overhang (negative = inside) */}

        {/* Right 1 (208×96): Figma right edge 1450px → 10px past frame → right: -10px */}
        <img src={flowerRight1} alt="" aria-hidden="true" style={{
          position: 'absolute', right: '-10px', top: '428.21px',
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

        {/* Right 2 (163×104): Figma right edge 1449px → 9px past frame → right: -9px */}
        <img src={flowerRight2} alt="" aria-hidden="true" style={{
          position: 'absolute', right: '-9px', top: '577.12px',
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

        {/* Right 5 (108×101): flush with right edge so it stays tangent at all widths */}
        <img src={flowerRight5} alt="" aria-hidden="true" style={{
          position: 'absolute', right: 0, top: '1898.24px',
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

        {/* Left 3 (75×46): Figma x=0 → flush with left edge */}
        <img src={flowerLeft3} alt="" aria-hidden="true" style={{
          position: 'absolute', left: 0, top: '1486.96px',
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

        {/* Left 4 (94×56): Figma x=-4 → 4px outside left edge */}
        <img src={flowerLeft4} alt="" aria-hidden="true" style={{
          position: 'absolute', left: '-4px', top: '1547.54px',
          display: 'block', pointerEvents: 'none', userSelect: 'none',
        }} />

      {/* ── BACK BUTTON ──────────────────────────────────────────────────── */}
      {/* left: calc(50% - 340px - 84px - 10px)                              */}
      {/*   50%      = page center                                            */}
      {/*   - 340px  = left edge of the 680px prose column                   */}
      {/*   - 84px   = button's natural width (SVG includes 10px padding)    */}
      {/*   - 10px   = extra breathing room so button isn't flush to prose   */}
      <Link
        to="/"
        className="absolute z-20"
        style={{
          left: 'calc(50% - 340px - 84px - 10px)',
          top: '150px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-label="Back to home"
      >
        <img src={backButton} alt="" style={{ display: 'block' }} />
        <span className="text-aegean" style={{ ...fell, fontSize: '16px', lineHeight: '1.5', letterSpacing: '0.17px', opacity: 0.4 }}>home</span>
      </Link>

        {/* ── Main content column ────────────────────────────────────────────── */}
        {/* 900px column; margin:auto centers it inside the 1440px frame        */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '170px',
          paddingBottom: '280px',
          paddingLeft: '10px',
          paddingRight: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
        }}>

          {/* ── Title + underline — wrapped so underline sits flush under title ── */}
          {/* Underline spacing = top: '-11.9px' on the absolute div below.        */}
          {/* To move underline closer/farther: adjust that top value.             */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            <p className="text-ink" style={{
              ...cinzel,
              fontSize: '42px',
              lineHeight: '60px',
              letterSpacing: '0.48px',
              textAlign: 'center',
              width: '680px',
              height: '56px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              Notes from the Kitchen
            </p>
            {/* Zero-height div; top: '8px' = gap below title. height: '9px' = underline thickness. */}
            {/* To move underline closer: lower the top value. Further: raise it.                  */}
            <div style={{ width: '411px', height: 0, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', top: '10px', right: 0, left: 0, height: '9px' }}>
                <img src={titleUnderline} alt="" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>

          {/* ── Culinary ethos ────────────────────────────────────────────────── */}
          {/* Vertical stack, centered. gap: '4px' controls heading→subtext.    */}
          {/* gap: '20px' controls text block → photo.                          */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            marginTop: '40px',
          }}>
            {/* Text */}
            <div style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                <p className="text-aegean-deep" style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', opacity: 0.85, margin: 0, lineHeight: 1 }}>
                  Culinary ethos
                </p>
              </div>
              <p className="text-ink" style={{ ...fell, fontSize: '18px', lineHeight: '1.5', letterSpacing: '0.18px', margin: 0, textAlign: 'center' }}>
                Taking the flavors everyone loves a little bit further.
              </p>
            </div>
            {/* Photo */}
            <div style={{ width: '230px', height: '236px', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={photoEthos}
                alt="Dustin cooking"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block', pointerEvents: 'none' }}
              />
            </div>
          </div>

          <DividerDots />

          {/* ── Elevated comfort food + photo staircase — 900px container ── */}
          {/* Cards: 176×223, 5px gap, 56px vertical step. R at top:0.      */}
          {/* Text: top:0, left:680 (aligns with R card top-left zone).      */}
          <div style={{ position: 'relative', width: '900px', height: '447px', flexShrink: 0 }}>
            {/* Text block */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                <p className="text-aegean-deep" style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', opacity: 0.85, margin: 0, lineHeight: 1, width: '367px' }}>
                  Elevated comfort food
                </p>
              </div>
              <p className="text-ink" style={{ ...fell, fontSize: '18px', lineHeight: '1.5', letterSpacing: '0.18px', margin: 0, width: '230px' }}>
                Rooted in the familiar. Obsessed with the details.
              </p>
            </div>
            {/* Staircase photos with hover-reveal menus */}
            {[
              { src: galleryL,  hov: hoveredL,  left:   0, top: 224 },
              { src: galleryML, hov: hoveredML, left: 181, top: 168 },
              { src: galleryM,  hov: hoveredM,  left: 362, top: 112 },
              { src: galleryMR, hov: hoveredMR, left: 543, top:  56 },
              { src: galleryR,  hov: hoveredR,  left: 724, top:   0 },
            ].map(({ src, hov, left, top }, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: '176px',
                  height: '223px',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                <img
                  src={hov}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                    opacity: hoveredCard === i ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                  }}
                />
              </div>
            ))}
          </div>

          <DividerDots />

          {/* ── Archive section — heading, photos, bottom divider, vertical borders */}
          {/* Borders sit at left/right edges of the 680px content zone (110px    */}
          {/* inset from each side of the 900px wrapper).                         */}
          {/* Border top = bottom of heading (54px). Height = ~571px to reach the */}
          {/* top of the DividerDots inside.                                       */}
          <div style={{
            position: 'relative',
            width: '900px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '48px',
          }}>
            {/* Left vertical border — aligned with 680px container left edge */}
            <img src={archiveVertBorder} alt="" aria-hidden="true" style={{
              position: 'absolute',
              left: '107px',
              top: '54px',
              width: '6px',
              height: '544px',
              opacity: 0.4,
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
            }} />
            {/* Right vertical border — aligned with 680px container right edge */}
            <img src={archiveVertBorder} alt="" aria-hidden="true" style={{
              position: 'absolute',
              right: '107px',
              top: '54px',
              width: '6px',
              height: '544px',
              opacity: 0.4,
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
            }} />

            {/* Heading — centered */}
            <div style={{ flexShrink: 0, paddingTop: '10px', paddingBottom: '10px' }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-aegean-deep" style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', opacity: 0.85, margin: 0, lineHeight: 1 }}>
                  From the archive
                </p>
              </div>
            </div>

            {/* Photos */}
            <div style={{ width: '680px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
              {/* Row 1: two landscape photos (232.7 × 174.5) */}
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* Top row — both share speed 70 (stay aligned with each other) */}
                <ArchivePhoto src={photoWeeknight} caption="weeknight indulgence, for 1" w={232.7} h={174.5} speed={88} />
                <ArchivePhoto src={photoSpaghetti} caption="best with a bottle of red"   w={232.7} h={174.5} speed={64} />
              </div>
              {/* Row 2: three portrait photos (174.5 × 232.7) */}
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* Bottom row — all three share speed 50 (stay aligned; differs from top → parallax) */}
                <ArchivePhoto src={photoSupperclub}  caption="supper club"                  w={174.5} h={232.7} speed={96} />
                <ArchivePhoto src={photoFranceAsia}  caption="france <> america <> se asia" w={174.5} h={232.7} speed={88} />
                <ArchivePhoto src={photoFriendsBday} caption="for a friend's birthday"      w={174.5} h={232.7} speed={104} />
              </div>
            </div>

            {/* Bottom DividerDots — inside archive wrapper so borders end here */}
            <DividerDots />
          </div>

          {/* ── Personal Picks heading + underline — wrapped so underline sits   */}
          {/* flush under heading. Spacing = top: '-3px' in the absolute div.    */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            <p className="text-aegean" style={{
              ...fell,
              fontSize: '32px',
              lineHeight: '1.5',
              letterSpacing: '0.32px',
              opacity: 0.85,
              textAlign: 'center',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              Personal Picks
            </p>
            {/* Menu underline — top: '8px' = gap below heading. opacity: 0.8.    */}
            {/* To move closer: lower top. Further: raise it.                     */}
            <div style={{ width: '680px', height: 0, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', top: '8px', right: 0, left: 0, height: '6px' }}>
                <img src={menuUnderline} alt="" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%', opacity: 0.85 }} />
              </div>
            </div>
          </div>

          {/* ── Two-column menu table ─────────────────────────────────────────── */}
          {/* 180px labels + 320px gap + 180px values = 680px total              */}
          {/* Note: correct label→value mappings restored (Figma had ordering off) */}
          <div style={{
            width: '680px',
            flexShrink: 0,
            display: 'flex',
            gap: '320px',
            alignItems: 'flex-start',
            marginTop: '-16px',
          }}>

            {/* Labels — left-aligned */}
            <div className="text-ink" style={{
              ...fell,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              fontSize: '17px',
              lineHeight: '1.5',
              letterSpacing: '0.17px',
              width: '180px',
              flexShrink: 0,
            }}>
              {['Knife:', 'Cutting board:', 'Kitchen essential:', 'Ingredient:', 'Restaurant:', 'Bakery:'].map(label => (
                <p key={label} style={{ margin: 0 }}>{label}</p>
              ))}
            </div>

            {/* Values — right-aligned */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-end',
              width: '180px',
              flexShrink: 0,
            }}>
              {/* Knife */}
              <a
                href="https://www.zwilling.com/us/zwilling-pro-6-inch-chefs-knife-38405-163/38405-163-0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textDecoration: 'underline', textAlign: 'right' }}
              >
                Zwilling Pro, 6 inch
              </a>
              {/* Cutting board — "Boos Block" is linked, "(R-Board)" is plain text */}
              <p className="text-ink" style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textAlign: 'right', margin: 0 }}>
                <a
                  href="https://www.johnboos.com/products/maple-cutting-boards-1-1-2-thick-r-board-series?Size=20%22+x+15%22+x+1-1%2F2%22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink"
                  style={{ textDecoration: 'underline' }}
                >
                  Boos Block
                </a>
                {' (R-Board)'}
              </p>
              {/* Kitchen essential */}
              <a
                href="https://www.amazon.com/Orgtiv-48Sets-8-Containers-Airtight-Disposable/dp/B09F2FP5QY/ref=sr_1_4_sspa?crid=3JKDG6XU2POX9&dib=eyJ2IjoiMSJ9.72mMcO0yxxKX4MsBiY5hnmysxHoW0FGxy3gFvhh1DENpAP-prLpn5X2S1iC2CBeRibaMCBdEphLK8lFaiLlggS24DUvlgGZO3NN6cescwbt0qKP-d4qel3JdX9K-arAXYu97fTO3Oy01v21nBirlswUMnmLdW-rHNnJ1xfphvS5YD_5eehTkGrVLn6ldK_4FE4WYtLzZMIZy9fLPo6Pk5GAwRj61n2l7YqhCe2wjPA0BcqPwr93BEq1H_G_ZybsGs9Yk9dEYjh0lW7o_on9NLRxxVHShx8Meo4cPcaDdT6oA.7o6KeK36SYKbhrCRMdRPXbhDDONmu4rhVBWbkE0YXrE&dib_tag=se&keywords=deli%2Bcontainers%2Bwith%2Blids&qid=1728509573&sprefix=deli%2Bcont%2Caps%2C128&sr=8-4-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textDecoration: 'underline', textAlign: 'right' }}
              >
                deli containers
              </a>
              {/* Ingredient */}
              <p className="text-ink" style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textAlign: 'right', margin: 0 }}>
                vanilla bean
              </p>
              {/* Restaurant */}
              <a
                href="https://www.thursdaykitchen.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textDecoration: 'underline', textAlign: 'right' }}
              >
                Thursday Kitchen
              </a>
              {/* Bakery */}
              <a
                href="https://ladywong.com/?srsltid=AfmBOor6UwLbH-l_9kYibZP5KELZRlBIUDI7rHPIRavVq3Ul8-0nqtFe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', textDecoration: 'underline', textAlign: 'right' }}
              >
                Lady Wong
              </a>
            </div>

          </div>

        </div> {/* end content column */}
    </div>
  )
}
