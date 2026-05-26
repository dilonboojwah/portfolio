import { motion } from 'framer-motion'
import ArtifactPanel from './ArtifactPanel'

const PANELS = [
  {
    id: 'writing',
    label: 'Writing',
    title: 'Two essays on intelligence, coordination, and the next layer.',
    desc: null,
    action: 'Read →',
    tag: 'Essays',
    detail: {
      label: 'Writing',
      title: 'Two essays on intelligence, coordination, and the next layer.',
      body: 'Essay I — The Evolution of Intelligence: Prestige always moves to the orchestration layer above the tool. The 2026 bottleneck is making AI operational inside real workflows.\n\nEssay II — Why Most Teams Will Fail at Human-AI Coordination: AI adoption is a coordination problem, not a tooling problem. Three failure points: workflow design, context quality, and evaluation.',
    },
  },
  {
    id: 'work',
    label: 'Work',
    title: 'Dashboard Case Study',
    desc: 'Reduced a 90-minute ops review to 20 minutes. React + FastAPI + OpenAI, deployed on Vercel.',
    action: 'View case →',
    tag: 'Product',
    detail: {
      label: 'Work · Dashboard Case Study',
      title: 'No legible view into pipeline health. Decisions made on gut, not signal.',
      body: 'Designed in Figma. Built in React + Python FastAPI with OpenAI integration for natural-language querying. Deployed on Vercel. Reduced weekly ops review from 90 minutes to 20 minutes. First artifact I was proud to sign my name to.',
    },
  },
  {
    id: 'cooking',
    label: 'Craft',
    title: 'Cooking as a design problem.',
    desc: 'I hosted private dinners in NYC. Every dish is a system: constraints, ratios, sequencing.',
    action: 'See the work →',
    tag: 'Cooking',
    detail: {
      label: 'Craft · Cooking',
      title: 'I hosted private dinners in NYC. Every dish is a system.',
      body: "Constraints, ratios, sequencing — a final thing that either holds together or doesn't. Miso-glazed black cod. Hand-rolled soba, dashi broth. Lamb shoulder, preserved lemon.",
    },
  },
  {
    id: 'chat',
    label: 'Tool',
    title: 'Values Clarification Chatbot',
    desc: 'An AI that helps you articulate what you actually believe. Built on the Claude API.',
    action: 'Open tool →',
    tag: 'Claude API',
    detail: {
      label: 'Tool · Values Chatbot',
      title: 'An AI that helps you articulate what you actually believe.',
      body: "Built on the Claude API. Ask it hard questions about what you value, how you make decisions, what you're optimizing for. It doesn't tell you what to think — it surfaces what you already think. Launching soon.",
    },
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12 + 0.3, duration: 0.6, ease: 'easeOut' },
  }),
}

export default function NexusCanvas() {
  return (
    <div className="flex flex-1 overflow-hidden">

      {/* LEFT — Identity */}
      <div
        className="flex flex-col justify-center px-12 py-8 flex-shrink-0"
        style={{
          width: '42%',
          borderRight: '0.5px solid var(--border)',
        }}
      >
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Portfolio &nbsp;·&nbsp; Selected Work
        </motion.p>

        <motion.h1
          className="editorial mb-7"
          style={{ fontSize: '30px', lineHeight: 1.28 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          I take vague problems with real stakes and produce the most elegant,
          technically grounded output possible.
        </motion.h1>

        <motion.p
          className="mb-10"
          style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--secondary)', maxWidth: '360px' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Generalist operator. Economics and CS from Duke. Background in strategy
          consulting and early-stage startup scaling. I think in systems and build
          in artifacts.
        </motion.p>

        <motion.div
          style={{ width: 32, height: '0.5px', background: 'var(--accent)', marginBottom: 24 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.5 }}
        />

        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {[
            ['Background', 'Duke · Consulting · Startups'],
            ['Currently', 'San Jose, CA'],
            ['Contact', 'dustin@—.com'],
          ].map(([key, val]) => (
            <p key={key} style={{ fontSize: '11px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {key}&nbsp;&nbsp;<span style={{ color: 'var(--secondary)' }}>{val}</span>
            </p>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Artifact Grid */}
      <div
        className="flex-1 grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1px',
          background: 'var(--border)',
        }}
      >
        {PANELS.map((panel, i) => (
          <ArtifactPanel key={panel.id} panel={panel} index={i} />
        ))}
      </div>

    </div>
  )
}
