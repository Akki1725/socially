/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#be4460',
          50: '#fef2f3',
          100: '#fde6e8',
          500: '#be4460',
          600: '#be4460',
          700: '#a83a52',
        },
      },
    },
  },
  plugins: [],
}

