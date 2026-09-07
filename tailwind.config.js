/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0f172a',      // Dark slate navy
          navy: '#1e293b',      // Secondary navy
          blue: '#1d4ed8',      // Institutional royal blue
          green: '#047857',     // Swachh Bharat green
          lightGreen: '#ecfdf5',// Light emerald tint
          saffron: '#d97706',   // Indian civic warm amber
          accent: '#0d9488'     // Teal accent
        }
      }
    },
  },
  plugins: [],
}
