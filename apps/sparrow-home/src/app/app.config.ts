import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { appRoutes } from './app.routes';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { APP_TITLE } from './core/tokens/app-title-token';

export const appConfig: ApplicationConfig = {
  
  providers: [
    MessageService,
    {
      provide: APP_TITLE,
      useValue: 'Sparrow Home'
    },
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
