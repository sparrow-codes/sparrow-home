import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  templateUrl: './page-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
