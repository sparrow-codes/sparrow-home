import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXCircle } from '@ng-icons/heroicons/outline';

@Component({
  imports: [CommonModule, NgIcon],
  templateUrl: './page-not-found.component.html',
  providers: [provideIcons({ heroXCircle })],
})
export class PageNotFoundComponent {}
