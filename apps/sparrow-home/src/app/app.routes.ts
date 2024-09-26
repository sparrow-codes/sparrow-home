import { Route } from '@angular/router';
import { MainComponent } from './features/main/components/home/main.component';
import { CloudContainerComponent } from './features/cloud/containers/cloud-container/cloud-container.component';

export enum RoutePath {
    MAIN = 'main',
    PANASONIC = 'PANASONIC'
}

export const appRoutes: Route[] = [
    {
        path: RoutePath.MAIN,
        component: MainComponent
    },
    {
        path: RoutePath.PANASONIC,
        component: CloudContainerComponent
    },
    {
        path: '**',
        redirectTo: RoutePath.MAIN
    }
];
