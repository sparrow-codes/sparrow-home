import { Route } from '@angular/router';

import { CloudContainerComponent } from './containers/cloud-container/cloud-container.component';

export const heatPumpRoutes: Route[] = [
  {
    path: '',
    component: CloudContainerComponent,
  },
];
