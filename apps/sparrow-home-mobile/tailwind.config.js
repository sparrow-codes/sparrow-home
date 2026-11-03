const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      colors: {
        sp: {
          primary: {
          50: 'var(--sp-primary-50)',
          100: 'var(--sp-primary-100)',
          200: 'var(--sp-primary-200)',
          300: 'var(--sp-primary-300)',
          400: 'var(--sp-primary-400)',
          500: 'var(--sp-primary-500)',
          600: 'var(--sp-primary-600)',
          700: 'var(--sp-primary-700)',
          800: 'var(--sp-primary-800)',
          900: 'var(--sp-primary-900)',
          950: 'var(--sp-primary-950)',
        },
          accent: {
          50: 'var(--sp-accent-50)',
          100: 'var(--sp-accent-100)',
          200: 'var(--sp-accent-200)',
          300: 'var(--sp-accent-300)',
          400: 'var(--sp-accent-400)',
          500: 'var(--sp-accent-500)',
          600: 'var(--sp-accent-600)',
          700: 'var(--sp-accent-700)',
          800: 'var(--sp-accent-800)',
          900: 'var(--sp-accent-900)',
          950: 'var(--sp-accent-950)',
        },
          surface: 'var(--sp-surface)',
          'surface-raised': 'var(--sp-surface-raised)',
          'surface-sunken': 'var(--sp-surface-sunken)',
          border: 'var(--sp-border)',
          text: 'var(--sp-text)',
          'text-muted': 'var(--sp-text-muted)',
        },
      },
      borderRadius: {
        'sp-sm': 'var(--sp-radius-sm)',
        'sp-md': 'var(--sp-radius-md)',
        'sp-lg': 'var(--sp-radius-lg)',
      },
      boxShadow: {
        'sp-sm': 'var(--sp-shadow-sm)',
        'sp-md': 'var(--sp-shadow-md)',
        'sp-lg': 'var(--sp-shadow-lg)',
      },
    },
  },
  darkMode: ['class', '.ion-palette-dark'],
};
