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
          // Glassmorphic color palette (yellow, black, white)
          glass: {
            yellow: '#FFD700',
            'yellow-light': '#FFED4E',
            'yellow-dark': '#FFC107',
            black: '#000000',
            'black-light': '#1a1a1a',
            'black-dark': '#0a0a0a',
            white: '#FFFFFF',
            'white-dark': '#f8f9fa',
          }
        },
        backdropBlur: {
          xs: '2px',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        }
      },
    },
    plugins: [],
  }