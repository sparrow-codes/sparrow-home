import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'sp-onboarding',
  imports: [Button, Divider, RouterLink],
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  public readonly title: InputSignal<string> = input.required();
  public readonly description: InputSignal<string> = input.required();
  public readonly buttonLabel: InputSignal<string> = input.required();
  public readonly buttonRouterLink: InputSignal<string[] | string> = input.required();
  public readonly content: InputSignal<string | undefined> = input();
}
