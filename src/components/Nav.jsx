export default function Nav() {
  return (
    <nav
      className="flex items-center justify-between px-12 py-7"
      style={{ borderBottom: '0.5px solid var(--border)' }}
    >
      <span
        className="text-xs font-normal tracking-widest uppercase"
        style={{ color: 'var(--text)' }}
      >
        Dustin Zhu
      </span>
      <span
        className="text-xs font-light tracking-widest uppercase"
        style={{ color: 'var(--muted)' }}
      >
        San Jose &nbsp;·&nbsp; 2026
      </span>
    </nav>
  )
}
