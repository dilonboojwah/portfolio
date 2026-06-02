import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainPage from './pages/MainPage'
import MobilePage from './pages/MobilePage'
import { introState } from './lib/introState'

// EAGER imports for every page. The site is small, so we ship all page code in one
// bundle instead of code-splitting. Navigation then never waits on a chunk fetch —
// there's no Suspense fallback and no "loading" flash — so moving between pages feels
// instant, like rooms of one already-loaded immersive space.
import EssayEvolution    from './pages/EssayEvolution'
import EssayCoordination from './pages/EssayCoordination'
import CulinaryRepertoire from './pages/CulinaryRepertoire'
import ComingSoon        from './pages/ComingSoon'

// ── IDLE ASSET PRELOAD ────────────────────────────────────────────────────────
// With all page CODE already bundled, the only thing left that can "pop in" on
// navigation is the IMAGERY (culinary photos + the big illustration SVGs), which the
// browser won't fetch until an <img> for them renders. So once the landing page is
// interactive and the main thread is idle, we warm the browser cache with every
// image/illustration asset. By the time the visitor navigates, the art is already
// decoded and paints instantly — nothing scrambles into place. requestIdleCallback
// keeps this off the critical path (the homepage paints first); the 3s timeout caps it.
const ASSET_URLS = Object.values(
  import.meta.glob('./assets/{image,illustration}/*.{webp,jpg,jpeg,png,svg}', {
    eager: true, query: '?url', import: 'default',
  })
)
function usePreloadAssets() {
  useEffect(() => {
    const preload = () => { for (const url of ASSET_URLS) { const img = new Image(); img.src = url } }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(preload, 2000)   // Safari < 16.4 fallback
    return () => clearTimeout(t)
  }, [])
}

// ── MOBILE DETECTION ──────────────────────────────────────────────────────────
// We cut over to the placeholder when the homepage's scale-to-fit would drop below a
// legibility floor. The homepage is authored against a 1440-wide artboard and scaled
// by min(vw/1440, vh/900); MIN_LEGIBLE_SCALE is the smallest that still reads as a
// premium composition. Because the essays scroll vertically (fluid maxWidth column),
// only WIDTH truly governs usability, so we express the floor as the width at which
// the homepage hits that scale: 1440 × 0.62 ≈ 893px.
//   • ½ of a 1920 monitor = 960px → stays DESKTOP (legible, navigable).
//   • ½ of a 1440 laptop  = 720px → placeholder (too cramped for the landscape art).
const MIN_LEGIBLE_SCALE = 0.62
const MOBILE_BREAKPOINT = Math.round(1440 * MIN_LEGIBLE_SCALE)   // ≈ 893px
function useIsMobile() {
  const read = () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  const [mobile, setMobile] = useState(read)
  useEffect(() => {
    const onResize = () => setMobile(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mobile
}

// ── ANIMATED ROUTES ───────────────────────────────────────────────────────────
// Keying the wrapper on the pathname remounts the subtree on every navigation, so the
// .route-fade glide (index.css) replays. All pages are eagerly bundled, so the incoming
// page is ready immediately — no Suspense, no fallback — and because every page shares
// the parchment background, fading it in over that constant wash reads as a seamless
// cross-dissolve.
function AnimatedRoutes() {
  const location = useLocation()
  // Once the visitor leaves home for any artifact, mark it — so a later return to home
  // skips the name typewriter (see MainPage). Reader-only on MainPage's side keeps this
  // immune to StrictMode's double-mount; refresh (full reload) resets the flag.
  useEffect(() => {
    if (location.pathname !== '/') introState.hasLeftHome = true
  }, [location.pathname])
  return (
    <div key={location.pathname} className="w-full route-fade">
      <Routes location={location}>
        {/* Main / Hero page */}
        <Route path="/" element={<MainPage />} />
        {/* Essays */}
        <Route path="/evolution-of-intelligence" element={<EssayEvolution />} />
        <Route path="/solving-human-ai-coordination" element={<EssayCoordination />} />
        {/* Culinary Repertoire */}
        <Route path="/culinary-repertoire" element={<CulinaryRepertoire />} />
        {/* Artemis app — placeholder for now */}
        <Route path="/artemis" element={<ComingSoon />} />
        {/* Mobile placeholder — direct preview on desktop at /mobile */}
        <Route path="/mobile" element={<MobilePage />} />
        {/* Anything unknown → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  usePreloadAssets()
  const isMobile = useIsMobile()
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        {/* Phones/narrow screens get the placeholder for every route; desktop gets
            the real site (and can still preview the placeholder at /mobile). */}
        {isMobile ? <MobilePage /> : <AnimatedRoutes />}
      </div>
    </BrowserRouter>
  )
}
