import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  APP_TITLE,
  authInterceptor,
  AuthService,
  DataFacadeService,
  initializeApp,
  SHORT_APP_TITLE,
  WebAuthenticationService,
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
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes),
    ...MaterialConfiguration,
    {
      provide: AuthService,
      useClass: WebAuthenticationService,
    },
    provideEnvironmentNgxMask({ validation: false }),
  ],
};
