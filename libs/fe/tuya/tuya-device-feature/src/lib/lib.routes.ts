import { Route } from '@angular/router';

import { TuyaDeviceDetailsComponent } from './pages/tuya-device-details/tuya-device-details.component';
import { TuyaDeviceFeatureComponent } from './pages/tuya-device-feature/tuya-device-feature.component';

export const tuyaDeviceRoutes: Route[] = [
  {
    path: '',
    component: TuyaDeviceFeatureComponent,
  },
  {
    path: 'details/:id',
    component: TuyaDeviceDetailsComponent,
  },
];
