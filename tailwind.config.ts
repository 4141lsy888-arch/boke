import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f6f0ff',
          100: '#ede6ff',
          200: '#d8c4ff',
          300: '#bea0ff',
          400: '#a87eff',
          500: '#8b4fff',
          600: '#7029ee',
          700: '#5e1fc9',
          800: '#4c1ca0',
          900: '#3e1a80',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
