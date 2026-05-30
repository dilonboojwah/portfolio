/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── COLORS (exact from Figma color system) ─────────────────────────
      colors: {
        // Backgrounds
        'rice-paper': '#faf7f2',   // main page bg (linen)
        'linen':      '#faf7f2',   // alias for bg-linen utility
        'parchment':  '#ebe4d4',   // deeper warm bg
        // Text
        'ink':        '#1c1814',   // near-black warm
        'stone':      '#5c5347',   // mid warm brown (artifact link titles)
        'dust':       '#9a8e7f',   // muted warm grey (labels, name)
        // Accent — Gold
        'gold':       '#b8a97a',   // dividers, borders
        'gold-warm':  '#c9a84c',   // warmer gold variant
        // Accent — Blue
        'aegean':     '#3d6191',   // Aegean blue (table headers, accents)
        'aegean-deep':'#2a4a75',   // deeper blue variant
      },

      // ── FONTS (exact from Figma typography system) ──────────────────────
      // Each family ends in a LOCALLY-INSTALLED font + a generic, so the page
      // stays on-brand even if Google Fonts is slow/blocked/offline.
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],            // display, headings, body
        chinese:  ['"Ma Shan Zheng"', '"KaiTi"', '"STKaiti"', 'serif'],             // 朱谛 — falls back to system brush/kai faces
        onest:    ['Onest', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'], // UI labels, captions
        cinzel:   ['Cinzel', '"Trajan Pro"', '"Times New Roman"', 'serif'],         // Roman-caps labels/titles
        fell:     ['"IM Fell English"', 'Georgia', '"Times New Roman"', 'serif'],   // culinary headings + body
      },

      // ── TYPE SCALE (from Figma typography frame) ────────────────────────
      fontSize: {
        'display':  ['56px', { lineHeight: '1.15', letterSpacing: '0.01em' }],
        'heading':  ['28px', { lineHeight: '60px', letterSpacing: '0.01em' }],
        'artifact': ['24px', { lineHeight: '40px', letterSpacing: '0.01em' }],
        'body-ui':  ['14px', { lineHeight: '1.5' }],
        'nav-ui':   ['11px', { lineHeight: '1', letterSpacing: '0.06em' }],
        'label-ui': ['10px', { lineHeight: '1', letterSpacing: '0.14em' }],
        'caption':  ['12px', { lineHeight: '1', letterSpacing: '0.10em' }],
        // Essay-specific
        'essay-title':  ['34px', { lineHeight: '1.2' }],
        'essay-lead':   ['19px', { lineHeight: '1.55' }],
        'essay-body':   ['16px', { lineHeight: '1.8' }],
        'essay-caption':['12px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}
