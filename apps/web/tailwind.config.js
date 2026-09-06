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
        newspaper: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F3EFE6',
          300: '#E8E2D5',
          400: '#D5CDBF',
          500: '#9E9585',
          600: '#71695A',
          700: '#453E32',
          800: '#231E17',
          900: '#121214',
          DEFAULT: '#FAF8F5'
        },
        ink: {
          950: '#0D0D0F',
          900: '#121214',
          800: '#1C1C20',
          700: '#2C2C32',
          600: '#4A4A54',
          500: '#71717A'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace']
      }
    },
  },
  plugins: [],
}
