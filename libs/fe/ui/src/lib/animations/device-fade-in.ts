import { animate, AnimationTriggerMetadata, query, stagger, style, transition, trigger } from '@angular/animations';

export const deviceItemFadeIn: AnimationTriggerMetadata = trigger('deviceItemFadeIn', [
  transition(':enter', [
    query(':self, *', [
      style({ opacity: 0, transform: 'translateY(8px)' }),
      stagger(40, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ], { optional: true })
  ])
]);
