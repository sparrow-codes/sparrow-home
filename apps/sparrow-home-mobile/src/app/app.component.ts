import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewTransitionDirectionService } from '@sparrow-home/core';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [Toast, RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly _viewTransitionService: ViewTransitionDirectionService = inject(ViewTransitionDirectionService);

  public ngOnInit(): void {
    this._viewTransitionService.init();
  }
}
