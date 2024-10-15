import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { initializeApp } from '~core/initializer/config.initializer';
import { apiUrlInterceptor } from '~core/interceptors/api-url.interceptor';
import { authInterceptor } from '~core/interceptors/auth.interceptor';
import { DataFacadeService } from '~core/services/data-facade.service';
import { APP_TITLE } from '~core/tokens/app-title-token';

import { appRoutes } from './app.routes';

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
  ],
};
