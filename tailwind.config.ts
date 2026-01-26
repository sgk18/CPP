import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a5f7a',
        'primary-dark': '#12465a',
        secondary: '#2a9d8f',
        accent: '#e76f51',
        'accent-hover': '#d65c3e',
        'light-blue': '#a8dadc',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      backdropFilter: {
        'blur-10': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
export default config
