import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routeSlideTransition = trigger('routeAnimations', [
  transition('DeviceListPage => DeviceDetailsPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateX(100%)', opacity: 0 })]),
    group([
      query(':leave', [animate('300ms ease-out', style({ transform: 'translateX(-30%)', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))]),
    ]),
  ]),

  transition('DeviceDetailsPage => DeviceListPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateX(-30%)', opacity: 0 })]),
    group([
      query(':leave', [animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))]),
      query(':enter', [animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))]),
    ]),
  ]),
]);
