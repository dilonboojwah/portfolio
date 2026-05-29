import { Link } from 'react-router-dom'

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
import dividerdots      from '../assets/illustration/culinaryrep-dividerdots.svg'
import menuUnderline    from '../assets/illustration/cookingpage-menuunderline.svg'
import archiveVertBorder from '../assets/illustration/culinaryrep-archive-verticalborder.svg'
import backButton       from '../assets/illustration/backbutton-culinary.svg'

// ── PHOTOS ───────────────────────────────────────────────────────────────────
import papyrusTexture   from '../assets/image/homepage-papyrusfilter.webp'
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
const fv     = { fontVariationSettings: "'SOFT' 0, 'WONK' 1" }
const cinzel = { fontFamily: "'Cinzel', serif", fontWeight: 400 }
const fell   = { fontFamily: "'IM Fell English', serif", fontStyle: 'normal' }

// ── DIVIDER DOTS ──────────────────────────────────────────────────────────────
// Pre-composed SVG — three dimensional circles spaced 35px apart
function DividerDots() {
  return (
    <img
      src={dividerdots}
      alt=""
      aria-hidden="true"
      style={{ width: '17px', height: '88px', display: 'block', pointerEvents: 'none', userSelect: 'none', margin: '24px 0' }}
    />
  )
}

// ── ARCHIVE PHOTO ─────────────────────────────────────────────────────────────
// Photo with a small caption centered below it
function ArchivePhoto({ src, caption, w, h }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: `${w}px`, height: `${h}px`, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={src}
          alt={caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
        />
      </div>
      <p style={{
        ...fell,
        fontSize: '14px',
        lineHeight: '1.5',
        letterSpacing: '0.14px',
        color: '#5c5347',
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
  return (
    // Single full-width wrapper — same pattern as essay pages.
    // No fixed 1440px frame; content column centers itself via margin:auto.
    // Decorative elements use calc(50% ± X) so they track the content center
    // at any viewport width (1440px laptop AND wider monitors).
    <div style={{
      position: 'relative',
      width: '100%',
      overflowX: 'hidden',
      background: 'radial-gradient(ellipse 140% 60% at 50% 0%, #fdfcf9 0%, #faf7f2 100%)',
    }}>

      {/* ── Papyrus texture — absolute div fills full rendered page height ── */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
        backgroundImage: `url(${papyrusTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        mixBlendMode: 'multiply',
        opacity: 0.25,
        pointerEvents: 'none',
        userSelect: 'none',
      }} />

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
        className="absolute z-20 hover:opacity-60 transition-opacity duration-200"
        style={{
          left: 'calc(50% - 340px - 84px - 10px)',
          top: '150px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-label="Back to home"
      >
        {/* Icon-only SVG (opacity 0.4 baked into the asset); the word is interchangeable text */}
        <img src={backButton} alt="" style={{ display: 'block' }} />
        <span style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#3d6191', opacity: 0.4 }}>home</span>
      </Link>

        {/* ── Main content column ────────────────────────────────────────────── */}
        {/* 900px column; margin:auto centers it inside the 1440px frame        */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '200px',
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
            <p style={{
              ...cinzel,
              fontSize: '48px',
              lineHeight: '60px',
              letterSpacing: '0.48px',
              color: '#1c1814',
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
                <p style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', color: '#2a4a75',  opacity: 0.85, margin: 0, lineHeight: 1 }}>
                  Culinary ethos
                </p>
              </div>
              <p style={{ ...fell, fontSize: '18px', lineHeight: '1.5', letterSpacing: '0.18px', color: '#1c1814', margin: 0, textAlign: 'center' }}>
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

          {/* ── Elevated comfort food + photo scatter — combined 900px container ── */}
          {/* Text top aligns with galleryR (the rightmost/topmost photo, top: 0). */}
          {/* Text left is at 110px = left edge of the 680px content zone.         */}
          {/* galleryL is at y:223, well below the text block (y:0–~65), no overlap.*/}
          {/* Total photo width: 900px (4×177 + 1×176 + 4×4px gaps).               */}
          <div style={{ position: 'relative', width: '900px', height: '446px', flexShrink: 0 }}>
            {/* Text block — top aligns with galleryR, left aligns with 680px zone */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
                <p style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', color: '#2a4a75', opacity: 0.85, margin: 0, lineHeight: 1, width: '367px' }}>
                  Elevated comfort food
                </p>
              </div>
              <p style={{ ...fell, fontSize: '18px', lineHeight: '1.5', letterSpacing: '0.18px', color: '#1c1814', margin: 0, width: '230px' }}>
                Rooted in the familiar. Obsessed with the details.
              </p>
            </div>
            {/* Photos — diagonal arrangement, total width 900px */}
            {[
              { src: galleryL,  left:   0, top: 223, w: 177, h: 223 },
              { src: galleryML, left: 181, top: 176, w: 177, h: 223 },
              { src: galleryM,  left: 362, top: 111, w: 177, h: 224 },
              { src: galleryMR, left: 543, top:  64, w: 177, h: 224 },
              { src: galleryR,  left: 724, top:   0, w: 176, h: 223 },
            ].map(({ src, left, top, w, h }, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${w}px`,
                  height: `${h}px`,
                  overflow: 'hidden',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
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
                <p style={{ ...fell, fontSize: '32px', letterSpacing: '0.32px', color: '#2a4a75', opacity: 0.85, margin: 0, lineHeight: 1 }}>
                  From the archive
                </p>
              </div>
            </div>

            {/* Photos */}
            <div style={{ width: '680px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}>
              {/* Row 1: two landscape photos (232.7 × 174.5) */}
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
                <ArchivePhoto src={photoWeeknight} caption="weeknight indulgence, for 1" w={232.7} h={174.5} />
                <ArchivePhoto src={photoSpaghetti} caption="best with a bottle of red"   w={232.7} h={174.5} />
              </div>
              {/* Row 2: three portrait photos (174.5 × 232.7) */}
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
                <ArchivePhoto src={photoSupperclub}  caption="supper club"                  w={174.5} h={232.7} />
                <ArchivePhoto src={photoFranceAsia}  caption="france <> america <> se asia" w={174.5} h={232.7} />
                <ArchivePhoto src={photoFriendsBday} caption="for a friend's birthday"      w={174.5} h={232.7} />
              </div>
            </div>

            {/* Bottom DividerDots — inside archive wrapper so borders end here */}
            <DividerDots />
          </div>

          {/* ── Personal Picks heading + underline — wrapped so underline sits   */}
          {/* flush under heading. Spacing = top: '-3px' in the absolute div.    */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            <p style={{
              ...fell,
              fontSize: '32px',
              lineHeight: '1.5',
              letterSpacing: '0.32px',
              color: '#3d6191',
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
            <div style={{
              ...fell,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'flex-start',
              fontSize: '17px',
              lineHeight: '1.5',
              letterSpacing: '0.17px',
              color: '#1c1814',
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
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textDecoration: 'underline', textAlign: 'right' }}
              >
                Zwilling Pro, 6 inch
              </a>
              {/* Cutting board — "Boos Block" is linked, "(R-Board)" is plain text */}
              <p style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textAlign: 'right', margin: 0 }}>
                <a
                  href="https://www.johnboos.com/products/maple-cutting-boards-1-1-2-thick-r-board-series?Size=20%22+x+15%22+x+1-1%2F2%22"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1c1814', textDecoration: 'underline' }}
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
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textDecoration: 'underline', textAlign: 'right' }}
              >
                deli containers
              </a>
              {/* Ingredient */}
              <p style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textAlign: 'right', margin: 0 }}>
                vanilla bean
              </p>
              {/* Restaurant */}
              <a
                href="https://www.thursdaykitchen.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textDecoration: 'underline', textAlign: 'right' }}
              >
                Thursday Kitchen
              </a>
              {/* Bakery */}
              <a
                href="https://ladywong.com/?srsltid=AfmBOor6UwLbH-l_9kYibZP5KELZRlBIUDI7rHPIRavVq3Ul8-0nqtFe"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...fell, fontSize: '17px', lineHeight: '1.5', letterSpacing: '0.17px', color: '#1c1814', textDecoration: 'underline', textAlign: 'right' }}
              >
                Lady Wong
              </a>
            </div>

          </div>

        </div> {/* end content column */}
    </div>
  )
}
