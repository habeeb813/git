/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F3E5AB',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
        },
        luxury: {
          black: '#0A0A0A',
          gold: '#C5A059',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
      }
    },
  },
  plugins: [],
}
