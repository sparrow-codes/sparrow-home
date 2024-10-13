import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-subtitle',
  standalone: true,
  imports: [],
  templateUrl: './page-subtitle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSubtitleComponent {}
