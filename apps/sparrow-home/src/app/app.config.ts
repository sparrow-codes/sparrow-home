import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  apiUrlInterceptor,
  APP_TITLE,
  authInterceptor,
  DataFacadeService,
  initializeApp,
  SHORT_APP_TITLE,
} from '@sparrow-home/core';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_TITLE,
      useValue: 'Sparrow Home',
    },
    {
      provide: SHORT_APP_TITLE,
      useValue: 'SH',
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [HttpBackend, DataFacadeService],
      multi: true,
    },
    provideEnvironmentNgxMask({ validation: false }),
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    ...MaterialConfiguration,
    provideEnvironmentNgxMask({ validation: false }),
  ],
};
