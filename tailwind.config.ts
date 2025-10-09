import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#111827', accent: '#6366F1' } }
    }
  },
  darkMode: 'class',
  plugins: []
};
export default config;
