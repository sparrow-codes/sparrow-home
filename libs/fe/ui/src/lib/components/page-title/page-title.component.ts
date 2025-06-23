import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sp-page-title',
  templateUrl: './page-title.component.html',
  imports: [RouterLink],
})
export class PageTitleComponent {
  public readonly routerLink: InputSignal<string[] | undefined> = input();
  public readonly navigationDisabled: InputSignal<boolean> = input(false);
}
