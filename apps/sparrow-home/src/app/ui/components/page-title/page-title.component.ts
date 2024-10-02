import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, sparrowFadeIn } from '@sparrow-codes/sparrow-ui';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-title.component.html',
  animations: [sparrowFadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
