import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroChevronDoubleLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'sp-page-title',
  templateUrl: './page-title.component.html',
  imports: [RouterLink],
  providers: [provideIcons({ heroChevronDoubleLeft })],
})
export class PageTitleComponent {
  public readonly routerLink: InputSignal<string[] | undefined> = input();
  public readonly navigationDisabled: InputSignal<boolean> = input(false);
}
