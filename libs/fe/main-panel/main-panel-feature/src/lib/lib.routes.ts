import { Route } from '@angular/router';

import { MainPanelFeatureComponent } from './main-panel-feature/main-panel-feature.component';
import { MessageService } from 'primeng/api';

export const mainPanelFeatureRoutes: Route[] = [{ path: '', component: MainPanelFeatureComponent, providers: [MessageService] }];
