/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fifa-blue': '#00369C',
        'fifa-red': '#C8102E',
        'fifa-gold': '#FDB913',
        'fifa-green': '#00A651',
        'fifa-teal': '#00B5AD',
        'fifa-purple': '#6F2C91',
        'fifa-dark': '#0A0A0A',
        'fifa-gray-900': '#1A1A1A',
        'fifa-gray-800': '#2D2D2D',
        'fifa-gray-100': '#F7F7F7',
      },
      fontFamily: {
        'fifa': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'fifa': '0 10px 40px -10px rgba(0, 54, 156, 0.3)',
        'fifa-lg': '0 20px 60px -15px rgba(0, 54, 156, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 54, 156, 0.05), 0 10px 15px -3px rgba(0, 54, 156, 0.1), 0 0 0 1px rgba(0, 54, 156, 0.02)',
        'card-hover': '0 10px 20px -5px rgba(0, 54, 156, 0.1), 0 20px 25px -5px rgba(0, 54, 156, 0.15), 0 0 0 1px rgba(0, 54, 156, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
