/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B00FF',
        secondary: '#FF6B35',
        accent: '#39FF14',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        'game-bg': '#0D0221',
        'game-panel': '#2A1A3E',
        success: '#39FF14',
        warning: '#FFD700',
        error: '#FF1744',
        info: '#00E5FF'
      },
      fontFamily: {
        display: ['Creepster', 'cursive'],
        body: ['Fredoka One', 'sans-serif'],
        sans: ['Fredoka One', 'ui-sans-serif', 'system-ui'],
        heading: ['Creepster', 'cursive']
      },
      animation: {
        'bounce-light': 'bounce 1s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        }
      }
    },
  },
  plugins: [],
}