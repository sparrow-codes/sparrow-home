import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, TranslatePipe],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {}
