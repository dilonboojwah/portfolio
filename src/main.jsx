import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import faviconUrl from './assets/illustration/favicon.svg'

// Point the <link rel="icon"> at the bundled favicon asset, so editing
// src/assets/illustration/favicon.svg is all it takes to update the tab icon.
const faviconLink = document.getElementById('favicon')
if (faviconLink) faviconLink.href = faviconUrl

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
