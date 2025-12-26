import { Route } from '@angular/router';

import { AddDevicePageComponent } from './pages/add-device/add-device-page.component';
import { DeviceDetailsComponent } from './pages/device-details/device-details.component';
import { DevicePageComponent } from './pages/device-page/device-page.component';

export const homeDeviceRoutes: Route[] = [
  {
    path: '',
    component: DevicePageComponent,
  },
  {
    path: 'details/:id',
    data: { vt: 'sub' },
    component: DeviceDetailsComponent,
  },
  {
    path: 'add',
    data: { vt: 'sub' },
    component: AddDevicePageComponent,
  },
];
