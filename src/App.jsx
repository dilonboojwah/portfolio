import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import MainPage from './pages/MainPage'
import EssayEvolution from './pages/EssayEvolution'
import EssayCoordination from './pages/EssayCoordination'
import CulinaryRepertoire from './pages/CulinaryRepertoire'

// ── ANIMATED ROUTES ───────────────────────────────────────────────────────────
// Each route mounts with a quick CSS fade-in (.route-fade in index.css). Keying
// the wrapper on the pathname remounts the subtree on every navigation, so the
// fade replays. Because all pages share the same parchment background, fading the
// incoming page IN over that constant wash reads as a clean cross-fade.
//
// Why CSS and not a JS animation library: a one-shot opacity fade is exactly what
// CSS keyframes are for — it's compositor-driven, never depends on a JS tick, and
// can never leave the page stuck invisible. GSAP is reserved for the genuinely
// complex choreography (the MainPage name typewriter), where it earns its weight.
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="w-full route-fade">
      <Routes location={location}>
        {/* Main / Hero page */}
        <Route path="/" element={<MainPage />} />
        {/* Essays */}
        <Route path="/essays/evolution" element={<EssayEvolution />} />
        <Route path="/essays/coordination" element={<EssayCoordination />} />
        {/* Culinary Repertoire */}
        <Route path="/culinary" element={<CulinaryRepertoire />} />
      </Routes>
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
