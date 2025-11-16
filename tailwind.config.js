/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          light: '#4ade80',
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        }
      }
    },
  },
  plugins: [],
}
