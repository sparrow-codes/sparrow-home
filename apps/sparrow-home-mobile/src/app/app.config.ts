import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIonicAngular } from '@ionic/angular';
import { provideTranslateService, TranslateCompiler } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_TITLE, authInterceptor, initializeApp, SHORT_APP_TITLE } from '@sparrow-home/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideIonicAngular({ mode: 'ios' }),
    provideRouter(appRoutes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideAppInitializer(initializeApp),
    {
      provide: APP_TITLE,
      useValue: 'Sparrow Home',
    },
    {
      provide: SHORT_APP_TITLE,
      useValue: 'SH',
    },
    provideZonelessChangeDetection(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
    }),
  ],
};
