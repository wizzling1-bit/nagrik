/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E36138',
          600: '#D04F26',
          700: '#B43B16',
          800: '#912F11',
          900: '#74260E',
          950: '#421204',
          DEFAULT: '#E36138'
        },
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E36138',
          600: '#D04F26',
          700: '#B43B16',
          800: '#912F11',
          DEFAULT: '#E36138'
        },
        tricolor: {
          orange: '#F58220',
          white: '#FFFFFF',
          green: '#388E3C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
