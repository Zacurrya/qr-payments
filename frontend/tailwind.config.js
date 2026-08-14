/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#070A11',
          900: '#0F172A',
          850: '#141E33',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FEF8C3',
          200: '#FDE047',
          300: '#FACC15',
          400: '#EAB308',
          500: '#D4AF37',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          metallic: '#D4AF37',
          champagne: '#F3E5AB',
          bronze: '#AA771C',
        }
      }
    },
  },
  plugins: [],
};
