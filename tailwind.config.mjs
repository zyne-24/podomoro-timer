import typography from 'tailwindcss-typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          50: '#fbf9f5',
          100: '#f6f1e9',
          200: '#ece2d2',
          300: '#ddcdb4',
        },
        ember: {
          500: '#c2410c',
          600: '#9a3412',
          700: '#7c2d12',
        },
        moss: {
          500: '#4d7c0f',
          600: '#3f6212',
          700: '#365314',
        },
        noir: {
          800: '#1c1917',
          900: '#17120f',
        },
      },
    },
  },
  plugins: [typography],
};
