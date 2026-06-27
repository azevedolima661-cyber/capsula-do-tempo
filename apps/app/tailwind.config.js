/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F9FAFB',
        ink: '#1F2937',
        primary: '#8B5CF6',
        secondary: '#EC4899',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-league-spartan)', 'sans-serif'],
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
