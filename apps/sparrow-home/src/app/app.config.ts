import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { apiUrlInterceptor } from '~core/interceptors/api-url.interceptor';
import { authInterceptor } from '~core/interceptors/auth.interceptor';
import { APP_TITLE } from '~core/tokens/app-title-token';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_TITLE,
      useValue: 'Sparrow Home',
    },
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideRouter(appRoutes),
  ],
};
