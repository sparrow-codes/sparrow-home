const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    colors: {
      primary: 'var(--sp-primary-color)',
      error: 'var(--sp-error-color)',
      'light-gray': 'var(--app-light-gray)',
      'dark-gray': 'var(--sp-primary-font-color)',
    },
    extend: {},
  },
  plugins: [],
};
