/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f1724',
        card: '#0b1220',
        muted: '#94a3b8',
        primary: '#7c3aed',
        secondary: '#06b6d4',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}