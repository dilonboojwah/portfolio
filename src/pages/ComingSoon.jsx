import { Link } from 'react-router-dom'
import { fv, PAGE_BG } from '../lib/theme'
import PapyrusTexture from '../components/PapyrusTexture'

// ── COMING SOON ───────────────────────────────────────────────────────────────
// Placeholder for the Artemis app (/artemis). Matches the Figma "coming soon"
// frame: airy-white wash + papyrus, with centered Fraunces/dust text. A subtle
// "back home" link is added for navigation.
export default function ComingSoon() {
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      background: PAGE_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <PapyrusTexture />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="font-fraunces text-dust" style={{
          ...fv, fontSize: '28px', lineHeight: 1, letterSpacing: '0.98px', textAlign: 'center', margin: 0,
        }}>
          coming soon
        </p>

        <Link
          to="/"
          className="font-fraunces hover:opacity-100 transition-opacity duration-200"
          style={{ ...fv, fontSize: '15px', color: '#9a8e7f', opacity: 0.55, marginTop: '26px', letterSpacing: '0.15px' }}
        >
          ← home
        </Link>
      </div>
    </div>
  )
}
