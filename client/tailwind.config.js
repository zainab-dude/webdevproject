/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // <--- IMPORTANT: This enables manual toggling
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
    },
  },
  plugins: [],
}


