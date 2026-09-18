/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7F4',
          100: '#FEECE6',
          200: '#FDD5C7',
          300: '#FCB59E',
          400: '#F4835E',
          500: '#DE5227', // Nagrik Signature Brand Orange (10% Accent)
          600: '#C84318',
          700: '#A83410',
          800: '#892B0E',
          900: '#71260F',
          950: '#3D1005',
          DEFAULT: '#DE5227'
        },
        newspaper: {
          50: '#FFFFFF',
          100: '#FAF9F6',
          200: '#F3F2ED',
          300: '#E7E5DC',
          400: '#D3D0C4',
          500: '#9C988B',
          600: '#6E6A5E',
          700: '#48453C',
          800: '#26241F',
          900: '#131310',
          DEFAULT: '#FAF9F6'
        },
        ink: {
          950: '#070A0F',
          900: '#0B0F17',
          800: '#141C2B',
          700: '#1F2B3F',
          600: '#334155',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9'
        },
        surface: {
          page: 'var(--bg-page)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-card-elevated)',
          muted: 'var(--bg-muted)',
        },
        edge: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        content: {
          DEFAULT: 'var(--text-main)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inactive: 'var(--text-inactive)',
          success: 'var(--success-text)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Newsreader', 'Georgia', 'Cambria', 'serif'],
        display: ['var(--font-display)', 'Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['var(--font-script)', 'Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace']
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate3d(0, -16px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -7px, 0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { opacity: '0.65', transform: 'translate3d(0, 0, 0) scale(1.06)' }
        },
        scanBeam: {
          '0%': { transform: 'translate3d(0, 0px, 0)', opacity: '0' },
          '12%': { opacity: '0.9' },
          '88%': { opacity: '0.9' },
          '100%': { transform: 'translate3d(0, 144px, 0)', opacity: '0' }
        },
        shimmer: {
          '100%': { transform: 'translate3d(100%, 0, 0)' }
        },
        radarPing: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(0.8)', opacity: '0.9' },
          '80%, 100%': { transform: 'translate3d(0, 0, 0) scale(2.2)', opacity: '0' }
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'floatSlow 4.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'scan-beam': 'scanBeam 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}
