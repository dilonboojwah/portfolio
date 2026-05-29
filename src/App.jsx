import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MainPage from './pages/MainPage'
import EssayEvolution from './pages/EssayEvolution'
import EssayCoordination from './pages/EssayCoordination'
import CulinaryRepertoire from './pages/CulinaryRepertoire'

// ── PAGE TRANSITION WRAPPER ───────────────────────────────────────────────────
// Wraps each page in a fast fade. 150ms in / 100ms out feels instant but elegant.
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.10, ease: 'easeIn'  } },
}

function PageWrapper({ children }) {
  // No height constraint — main page uses h-screen internally,
  // essay/culinary pages need to scroll past viewport height.
  return (
    <motion.div
      className="w-full"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// ── ANIMATED ROUTES ───────────────────────────────────────────────────────────
// AnimatePresence needs to detect route changes — useLocation() lives here.
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ── Main / Hero page ─────────── */}
        <Route path="/" element={
          <PageWrapper><MainPage /></PageWrapper>
        } />

        {/* ── Essay: The Evolution of Intelligence ── */}
        <Route path="/essays/evolution" element={
          <PageWrapper><EssayEvolution /></PageWrapper>
        } />
        {/* ── Essay: Solving Human-AI Coordination ── */}
        <Route path="/essays/coordination" element={
          <PageWrapper><EssayCoordination /></PageWrapper>
        } />

        {/* ── Culinary Repertoire ── */}
        <Route path="/culinary" element={
          <PageWrapper><CulinaryRepertoire /></PageWrapper>
        } />

      </Routes>
    </AnimatePresence>
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
