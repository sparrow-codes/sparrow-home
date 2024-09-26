import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import { APP_TITLE } from './core/tokens/app-title-token';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';

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
