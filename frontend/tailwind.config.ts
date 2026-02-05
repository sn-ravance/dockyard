import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        docker: {
          blue: '#0db7ed',
          navy: '#003f8c',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
