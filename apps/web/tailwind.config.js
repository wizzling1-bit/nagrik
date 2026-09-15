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
          50: '#FDF8F6',
          100: '#F7EBE6',
          200: '#EED5CC',
          300: '#DFB4A4',
          400: '#C9856E',
          500: '#B45334', // Soft warm terracotta (low glare, premium editorial)
          600: '#9A4125',
          700: '#7E321B',
          800: '#672A17',
          900: '#552414',
          950: '#2F1108',
          DEFAULT: '#B45334'
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
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Newsreader', '"Noto Serif Devanagari"', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', '"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace']
      },
      letterSpacing: {
        'serif-tight': '-0.035em',
        'serif-snug': '-0.02em',
        'editorial-label': '0.14em',
        'editorial-nav': '0.04em',
      },
      lineHeight: {
        'display': '0.98',
        'tight-serif': '1.04',
        'snug-serif': '1.12',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' }
        },
        scanBeam: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(300%)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        radarPing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '80%, 100%': { transform: 'scale(2.4)', opacity: '0' }
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'floatSlow 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'scan-beam': 'scanBeam 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}
