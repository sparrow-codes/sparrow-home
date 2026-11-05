import { ChangeDetectionStrategy,Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {}
