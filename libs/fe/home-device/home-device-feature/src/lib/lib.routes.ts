import { Route } from '@angular/router';

import { DeviceDetailsComponent } from './pages/device-details/device-details.component';
import { DevicePageComponent } from './pages/device-page/device-page.component';

export const homeDeviceRoutes: Route[] = [
  {
    path: '',
    component: DevicePageComponent,
  },
  {
    path: 'details/:id',
    component: DeviceDetailsComponent,
  },
];
