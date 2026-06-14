import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

// eslint-disable-next-line @typescript-eslint/typedef
export const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          contrastColor: '{zinc.50}',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '#f3f4f6',
          contrastColor: '#111827E6',
          hoverColor: '#e2e8f0',
          activeColor: '#cbd5e1',
        },
        highlight: {
          background: 'rgba(148, 163, 184, 0.16)',
          focusBackground: 'rgba(148, 163, 184, 0.24)',
          color: '#f8fafc',
          focusColor: '#d7d7d7',
        },
        surface: {
          0: '#f3f4f6',
          700: '#243041',
          800: '#1B2432',
          900: '#111827',
          950: '#080C15',
        },
      },
    },
  },
});
