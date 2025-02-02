import { Provider } from '@angular/core';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const MaterialConfiguration: Provider[] = [
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' },
  },
  {
    provide: MAT_CARD_CONFIG,
    useValue: { appearance: 'outlined' },
  },
  provideNativeDateAdapter(),
  { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
];
