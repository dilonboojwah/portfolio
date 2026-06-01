import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import MainPage from './pages/MainPage'   // eager — this is the landing page, keep it instant
import MobilePage from './pages/MobilePage'   // eager — the only thing a phone visitor needs

// Secondary pages are code-split: their JS (incl. GSAP ScrollTrigger usage) only
// downloads when the route is visited. We keep the import functions so we can both
// lazy()-render them AND prefetch them on idle (below).
const importEvolution    = () => import('./pages/EssayEvolution')
const importCoordination = () => import('./pages/EssayCoordination')
const importCulinary     = () => import('./pages/CulinaryRepertoire')
const importComingSoon   = () => import('./pages/ComingSoon')

const EssayEvolution    = lazy(importEvolution)
const EssayCoordination = lazy(importCoordination)
const CulinaryRepertoire = lazy(importCulinary)
const ComingSoon        = lazy(importComingSoon)

// Fallback shown while a split chunk loads — just the parchment wash, so the swap
// is seamless (no white flash) on a background every page already shares.
const RouteFallback = () => (
  <div style={{ width: '100%', minHeight: '100dvh', background: 'var(--rice-paper)' }} />
)

// ── IDLE PREFETCH ─────────────────────────────────────────────────────────────
// Once the homepage is interactive and the browser has spare main-thread time,
// quietly download the other pages' chunks so navigating to them is instant.
// requestIdleCallback fires during the idle gaps between animation frames (the
// falling petals never block it); the 3s timeout caps the wait as a guarantee.
// Re-calling an import() that already resolved is a no-op (the chunk is cached).
function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => { importEvolution(); importCoordination(); importCulinary(); importComingSoon() }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(prefetch, 2000)   // Safari < 16.4 fallback
    return () => clearTimeout(t)
  }, [])
}

// ── MOBILE DETECTION ──────────────────────────────────────────────────────────
// The desktop layout needs room (the essays use a fixed 900px column), so below
// this width we show the mobile "best viewed on desktop" placeholder instead.
const MOBILE_BREAKPOINT = 1000   // px — narrower than this → mobile placeholder
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
// Each route mounts with a quick CSS fade-in (.route-fade in index.css). Keying
// the wrapper on the pathname remounts the subtree on every navigation, so the
// fade replays. Because all pages share the same parchment background, fading the
// incoming page IN over that constant wash reads as a clean cross-fade.
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="w-full route-fade">
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  usePrefetchRoutes()
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
