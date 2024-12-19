import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { initializeApp } from './core/initializer/config.initializer';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { DataFacadeService } from './core/services/data-facade.service';
import { APP_TITLE } from './core/tokens/app-title-token';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_TITLE,
      useValue: 'Sparrow Home',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [HttpBackend, DataFacadeService],
      multi: true,
    },
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' },
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'outlined' },
    },
    provideAnimationsAsync(),
  ],
};
