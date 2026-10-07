/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Anton"', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff8eb', 100: '#ffecc6', 200: '#ffd788', 300: '#ffbb4a', 400: '#ffa020',
          500: '#f97d07', 600: '#dd5a02', 700: '#b73c06', 800: '#942e0c', 900: '#7a270d',
        },
        ink: { 950: '#0b0b0f', 900: '#121218', 800: '#1b1b24', 700: '#272733' },
      },
    },
  },
  plugins: [],
};
