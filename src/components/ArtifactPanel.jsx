import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function ArtifactPanel({ panel, index }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Panel tile */}
      <motion.div
        onClick={() => setOpen(true)}
        className="flex flex-col justify-between cursor-pointer"
        style={{
          background: 'var(--panel)',
          padding: '32px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.12 + 0.8, duration: 0.5 }}
        whileHover={{ background: '#EDE9DF' }}
      >
        {/* Gold border on hover via motion */}
        <HoverBorder />

        {/* Top content */}
        <div className="flex flex-col gap-2">
          <p style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {panel.label}
          </p>
          <p className="editorial" style={{ fontSize: '18px', lineHeight: 1.3 }}>
            {panel.title}
          </p>
          {panel.desc && (
            <p style={{ fontSize: '12px', fontWeight: 300, lineHeight: 1.65, color: 'var(--muted)', marginTop: 4 }}>
              {panel.desc}
            </p>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between" style={{ marginTop: 20 }}>
          <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {panel.action}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--muted)', border: '0.5px solid var(--border)', padding: '3px 8px',
          }}>
            {panel.tag}
          </span>
        </div>
      </motion.div>

      {/* Expand overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex flex-col"
            style={{ background: 'var(--bg)', zIndex: 300, padding: '48px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              onClick={() => setOpen(false)}
              className="self-end"
              style={{
                fontFamily: 'Inter', fontSize: '11px', fontWeight: 400,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--muted)', background: 'none', border: 'none',
                cursor: 'pointer', padding: '8px 0',
              }}
            >
              Close ×
            </button>
            <div className="flex flex-col justify-center flex-1" style={{ maxWidth: 680 }}>
              <p className="eyebrow mb-5">{panel.detail.label}</p>
              <h2 className="editorial mb-6" style={{ fontSize: '34px', lineHeight: 1.25 }}>
                {panel.detail.title}
              </h2>
              <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'var(--secondary)', whiteSpace: 'pre-line' }}>
                {panel.detail.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* Renders a gold border that appears on hover via Framer */
function HoverBorder() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ border: '0px solid var(--accent)' }}
      whileHover={{ border: '1.5px solid var(--accent)' }}
    />
  )
}
