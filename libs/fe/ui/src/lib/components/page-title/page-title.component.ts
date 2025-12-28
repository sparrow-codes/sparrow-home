import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'sp-page-title',
  templateUrl: './page-title.component.html',
  imports: [RouterLink, ProgressBar],
})
export class PageTitleComponent {
  public readonly routerLink: InputSignal<string[] | undefined> = input();
  public readonly navigationDisabled: InputSignal<boolean> = input(false);
  public readonly showProgressBar: InputSignal<boolean> = input(false);
}
