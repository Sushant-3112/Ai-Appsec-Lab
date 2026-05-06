/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // indigo-600
        secondary: "#ec4899", // pink-500
        ltGreen: "#d2e823",
        ltMaroon: "#780016",
        ltBlue: "#2a5bd7",
        ltDarkGreen: "#1a3622",
        ltPink: "#e9c0e9",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
