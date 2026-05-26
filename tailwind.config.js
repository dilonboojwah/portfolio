/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#F5F2EC',
        text:      '#2A2720',
        secondary: '#6B6458',
        muted:     '#8C8678',
        accent:    '#B8A97A',
        border:    '#D6D0C4',
        hover:     '#EDE9DF',
        panel:     '#F9F7F3',
      },
      fontFamily: {
        sans:      ['Inter', 'sans-serif'],
        editorial: ['Newsreader', 'serif'],
      },
      fontWeight: {
        light:   '300',
        regular: '400',
        medium:  '500',
      },
    },
  },
  plugins: [],
}
