import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import os from 'os'

// NOTE: Project lives inside OneDrive which locks files and breaks Vite's cache.
// We redirect the cache to a temp folder outside OneDrive to avoid EPERM errors.
// Long-term: move the project to C:\code\portfolio (outside OneDrive).
const cacheDir = path.join(os.tmpdir(), 'vite-portfolio-cache')

export default defineConfig({
  plugins: [react()],
  cacheDir,
})
