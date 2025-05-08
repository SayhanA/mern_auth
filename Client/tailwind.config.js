/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgba(var(--background))',
        grape : 'rgba(var(--grape))',
        text: 'rgba(var(--text))',
        border: 'rgba(var(--border))'
      }
    },
  },
  plugins: [],
}