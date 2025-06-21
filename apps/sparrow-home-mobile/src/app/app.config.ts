import { HttpBackend, provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import {
  APP_TITLE,
  authInterceptor,
  AuthService,
  DataFacadeService,
  initializeApp,
  MobileAuthenticationService,
  MobilePushNotificationService,
  SHORT_APP_TITLE,
} from '@sparrow-home/core';
import { MaterialConfiguration } from '@sparrow-home/ui';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { Noir } from '../theme/noir';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'ios' }),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
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
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: false,
          floatLabel: 'in'
        }
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...MaterialConfiguration,
    {
      provide: AuthService,
      useClass: MobileAuthenticationService,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
    }),
    provideEnvironmentNgxMask({ validation: false }),
    MobilePushNotificationService,
    MessageService
  ],
};
