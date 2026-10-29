/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#581c87',
          900: '#3b0764',
          950: '#1e0538',
        },
        her: {
          purple: '#6d28d9',
          deep: '#2e1065',
          charcoal: '#0f0f14',
          surface: '#181824',
          lavender: '#ddd6fe',
          marigold: '#f59e0b',
          marigoldDark: '#d97706',
          card: '#ffffff',
          cardMuted: '#f8f7fc',
          border: '#e4e2ee',
          textDark: '#1e1b2e',
          textMuted: '#6b6684'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'candle-flicker': 'flicker 2s infinite ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1) skewX(0deg)' },
          '25%': { opacity: '0.8', transform: 'scale(0.98) skewX(-1.5deg)' },
          '50%': { opacity: '1', transform: 'scale(1.05) skewX(1.5deg)' },
          '75%': { opacity: '0.85', transform: 'scale(0.97) skewX(-0.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

