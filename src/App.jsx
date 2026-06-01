import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import MainPage from './pages/MainPage'   // eager — this is the landing page, keep it instant

// Secondary pages are code-split: their JS (incl. GSAP ScrollTrigger usage) only
// downloads when the route is actually visited, shrinking the homepage bundle.
const EssayEvolution = lazy(() => import('./pages/EssayEvolution'))
const EssayCoordination = lazy(() => import('./pages/EssayCoordination'))
const CulinaryRepertoire = lazy(() => import('./pages/CulinaryRepertoire'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))

// Fallback shown while a split chunk loads — just the parchment wash, so the swap
// is seamless (no white flash) on a background every page already shares.
const RouteFallback = () => (
  <div style={{ width: '100%', minHeight: '100dvh', background: 'var(--rice-paper)' }} />
)

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
          {/* Anything unknown → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}
