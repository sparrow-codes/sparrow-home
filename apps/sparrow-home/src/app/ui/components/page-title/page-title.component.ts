import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './page-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
