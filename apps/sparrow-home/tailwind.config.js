const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    colors: {
      primary: 'var(--sp-primary-color)',
      white: '#ffffff',
      success: '#2CA42C',
      warning: '#FFC107',
      error: '#ba1a1a',
      'dark-blue': 'var(--app-dark-blue)',
      'light-gray': 'var(--app-light-gray)',
      'light-blue': 'var(--app-light-blue)',
      'super-light-gray': 'var(--app-super-light-grey)',
    },
    extend: {},
  },
  plugins: [],
};
