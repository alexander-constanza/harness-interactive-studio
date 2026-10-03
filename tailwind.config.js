/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0B0F17",
          card: "#131B2B",
          border: "#1E293B",
          accent: "#38BDF8",
          accentHover: "#0EA5E9",
          muted: "#64748B",
          text: "#F8FAFC"
        }
      }
    },
  },
  plugins: [],
}
