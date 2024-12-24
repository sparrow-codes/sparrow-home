import { Component, input, InputSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDoubleLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'sp-page-title',
  templateUrl: './page-title.component.html',
  imports: [MatButton, NgIcon, RouterLink],
  providers: [provideIcons({ heroChevronDoubleLeft })],
})
export class PageTitleComponent {
  public readonly routerLink: InputSignal<string[] | undefined> = input();
}
