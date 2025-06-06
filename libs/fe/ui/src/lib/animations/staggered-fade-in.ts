import {
  animate,
  AnimationTriggerMetadata,
  query,
  stagger,
  style,
  transition,
  trigger} from '@angular/animations';

/**
 * Staggered fade-in animation.
 * Applies to container with @staggeredFadeIn and children with .fade-step class.
 */
export const staggeredFadeIn: AnimationTriggerMetadata = trigger('staggeredFadeIn', [
  transition(':enter', [
    query(
      '.fade-step',
      [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(150, [
          animate('400ms ease-out', style({ opacity: 1, transform: 'none' }))
        ])
      ],
      { optional: true }
    )
  ])
]);
