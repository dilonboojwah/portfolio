import Nav from './components/Nav'
import NexusCanvas from './components/NexusCanvas'

export default function App() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg)' }}>
      <Nav />
      <NexusCanvas />
    </div>
  )
}
