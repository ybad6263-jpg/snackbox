import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F9F8F6',
        orange: '#FF6B00',
      },
      borderRadius: {
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
