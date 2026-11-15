/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0e0e10', 900: '#141416', 800: '#1c1c1f', 700: '#26262a', 600: '#34343a', 400: '#8a8a93', 200: '#d6d3cc' },
        gold: { 300: '#e8d29a', 400: '#d9b968', 500: '#c9a24a', 600: '#a6822f' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
