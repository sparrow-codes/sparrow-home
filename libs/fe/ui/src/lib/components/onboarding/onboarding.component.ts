import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular';

import { Divider } from '../divider/divider';

@Component({
  selector: 'sp-onboarding',
  imports: [Divider, RouterLink, IonButton],
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  public readonly title: InputSignal<string> = input('');
  public readonly description: InputSignal<string> = input.required();
  public readonly buttonLabel: InputSignal<string> = input.required();
  public readonly buttonRouterLink: InputSignal<string[] | string> = input.required();
  public readonly content: InputSignal<string | undefined> = input();
}
