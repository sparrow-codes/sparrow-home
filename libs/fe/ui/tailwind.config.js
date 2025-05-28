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
      background: 'var(--color-background)',
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
      'button-background': 'var(--color-button-background)',
      'icon-default': 'var(--color-icon-default)',
      'icon-muted': 'var(--color-icon-muted)',
      'icon-active': 'var(--color-icon-active)',
      'nav-background': 'var(--color-nav-background)',
      'nav-icon-active': 'var(--color-nav-icon-active)',
      'nav-icon-inactive': 'var(--color-nav-icon-inactive)',
      'border-light': 'var(--color-border-light)',
    },
    extend: {},
  },
  plugins: [],
};
