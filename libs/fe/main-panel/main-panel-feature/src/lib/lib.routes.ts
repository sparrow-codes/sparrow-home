import { Route } from '@angular/router';

import { MainPanelFeatureComponent } from './pages/main-panel-feature/main-panel-feature.component';
import { VacationModePage } from './pages/vacation-mode-page/vacation-mode-page';

export const mainPanelFeatureRoutes: Route[] = [
  { path: '', component: MainPanelFeatureComponent },
  { path: 'vacation-mode', component: VacationModePage, data: { vt: 'sub' } },
];
