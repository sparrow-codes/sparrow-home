import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const sparrowFadeIn: AnimationTriggerMetadata = trigger('sparrowFadeIn', [
  transition('void => *', [style({ opacity: 0 }), animate('{{duration}}ms', style({ opacity: 1 }))], {
    params: { duration: 300 },
  }),
]);
