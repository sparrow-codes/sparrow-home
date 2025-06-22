import { Route } from '@angular/router';
import { MessageService } from 'primeng/api';

import { MainPanelFeatureComponent } from './main-panel-feature/main-panel-feature.component';

export const mainPanelFeatureRoutes: Route[] = [
  { path: '', component: MainPanelFeatureComponent, providers: [MessageService] },
];
